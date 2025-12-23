
import { query } from '@/lib/db';

export interface Module {
    id: string;
    name: string;
    description: string;
    icon?: string;
    yearsAvailable: string[];
}

export interface Indicator {
    title: string;
    unit?: string;
    val: number | null;
    color?: string;
    context?: string;
    analysis?: string;
    isTrend: boolean;
    isRate: boolean;
    isTFR: boolean;
    zonal?: number[] | null;
    labels?: string[];
    datasets?: any[];
    desc?: string;
}

export interface Category {
    title: string;
    description: string;
    items: Record<string, Indicator>;
}

export interface SurveyData {
    label: string;
    desc: string;
    stats: {
        response: number;
        women: number;
        men: number;
    };
    indicators: Record<string, Category>;
}

class SurveyService {
    /**
     * Get all modules with available years
     */
    async getAllModules(): Promise<Module[]> {
        const result = await query(`
            SELECT m.id, m.name, m.description, m.icon,
            COALESCE(
                (SELECT array_agg(DISTINCT year ORDER BY year DESC) FROM surveys s WHERE s.module_id = m.id), 
                ARRAY[]::text[]
            ) as years_available
            FROM modules m
            ORDER BY m.id
        `);

        return result.rows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            icon: row.icon,
            yearsAvailable: row.years_available || []
        }));
    }

    /**
     * Get data for a specific module and year
     */
    async getSurveyData(moduleId: string, year: string): Promise<SurveyData | null> {
        console.log(`[SurveyService] Fetching data for ${moduleId} ${year}`);

        // Get survey info
        const surveyResult = await query(`
            SELECT id, year, label, description, response_rate, women_sample_size, men_sample_size
            FROM surveys
            WHERE module_id = $1 AND year = $2
        `, [moduleId, year]);

        if (surveyResult.rows.length === 0) {
            console.log('[SurveyService] Survey not found');
            return null;
        }

        const survey = surveyResult.rows[0];

        // Get all indicators with categories
        const indicatorsResult = await query(`
            SELECT 
                c.key as category_key,
                c.title as category_title,
                c.description as category_description,
                i.id as indicator_id,
                i.key as indicator_key,
                i.title as indicator_title,
                i.unit,
                i.national_value,
                i.color,
                i.context,
                i.analysis,
                i.is_trend,
                i.is_rate,
                i.is_tfr,
                i.display_order
            FROM categories c
            JOIN indicators i ON c.id = i.category_id
            WHERE c.survey_id = $1
            ORDER BY c.display_order, i.display_order
        `, [survey.id]);

        // Organize indicators by category
        const indicators: Record<string, Category> = {};

        for (const row of indicatorsResult.rows) {
            if (!indicators[row.category_key]) {
                indicators[row.category_key] = {
                    title: row.category_title,
                    description: row.category_description,
                    items: {}
                };
            }

            // Get zonal data if not a trend
            let zonalData = null;
            if (!row.is_trend) {
                const zonalResult = await query(`
                    SELECT zone, value
                    FROM zonal_data
                    WHERE indicator_id = $1
                    ORDER BY 
                        CASE zone
                            WHEN 'North Central' THEN 1
                            WHEN 'North East' THEN 2
                            WHEN 'North West' THEN 3
                            WHEN 'South East' THEN 4
                            WHEN 'South South' THEN 5
                            WHEN 'South West' THEN 6
                        END
                `, [row.indicator_id]);
                zonalData = zonalResult.rows.map(z => z.value);
            }

            // Get trend data if it's a trend indicator
            let trendData = null;
            if (row.is_trend) {
                const trendResult = await query(`
                    SELECT year, series_name, value, color
                    FROM trend_data
                    WHERE indicator_id = $1
                    ORDER BY year, series_name
                `, [row.indicator_id]);

                // Organize trend data
                const years: string[] = [...new Set(trendResult.rows.map(t => t.year)) as Set<string>];
                const series: string[] = [...new Set(trendResult.rows.map(t => t.series_name)) as Set<string>];

                const datasets = series.map(seriesName => {
                    const seriesData = trendResult.rows.filter(t => t.series_name === seriesName);
                    return {
                        label: seriesName,
                        data: years.map(year => {
                            const point = seriesData.find(d => d.year === year);
                            return point ? point.value : null;
                        }),
                        borderColor: seriesData[0]?.color || '#000000',
                        backgroundColor: seriesData[0]?.color || '#000000'
                    };
                });

                trendData = {
                    labels: years,
                    datasets
                };
            }

            indicators[row.category_key].items[row.indicator_key] = {
                title: row.indicator_title,
                unit: row.unit,
                val: row.national_value,
                color: row.color,
                context: row.context,
                analysis: row.analysis,
                isTrend: row.is_trend,
                isRate: row.is_rate,
                isTFR: row.is_tfr,
                ...(zonalData && { zonal: zonalData }),
                ...(trendData && { ...trendData, desc: row.context })
            };
        }

        return {
            label: survey.label,
            desc: survey.description,
            stats: {
                response: survey.response_rate,
                women: survey.women_sample_size,
                men: survey.men_sample_size
            },
            indicators
        };
    }
}

export const surveyService = new SurveyService();
