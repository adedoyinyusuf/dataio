
import { query } from '../db';

export interface Module {
    id: string;
    name: string;
    description: string;
    icon?: string;
    color?: string;
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
    stateData?: Record<string, number> | null;
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

class DatabaseService {
    /**
     * Get all modules
     */
    async getAllModules(): Promise<Module[]> {
        const result = await query(`
            SELECT 
                m.id,
                m.name,
                m.description,
                m.icon,
                m.color,
                m.enabled,
                COALESCE(
                    json_agg(
                        DISTINCT s.year 
                        ORDER BY s.year DESC
                    ) FILTER (WHERE s.year IS NOT NULL),
                    '[]'
                ) as years_available
            FROM modules m
            LEFT JOIN surveys s ON m.id = s.module_id
            WHERE m.enabled = true
            GROUP BY m.id, m.name, m.description, m.icon, m.color, m.enabled
            ORDER BY m.id
        `);

        return result.rows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            icon: row.icon,
            color: row.color,
            yearsAvailable: row.years_available
        }));
    }

    /**
     * Get module by ID
     */
    async getModuleById(moduleId: string) {
        const result = await query(`
            SELECT 
                m.id,
                m.name,
                m.description,
                m.icon,
                m.color,
                COALESCE(
                    json_agg(
                        DISTINCT s.year 
                        ORDER BY s.year DESC
                    ) FILTER (WHERE s.year IS NOT NULL),
                    '[]'
                ) as years
            FROM modules m
            LEFT JOIN surveys s ON m.id = s.module_id
            WHERE m.id = $1 AND m.enabled = true
            GROUP BY m.id
        `, [moduleId]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            years: row.years
        };
    }

    /**
     * Get module data for a specific year
     */
    async getModuleYearData(moduleId: string, year: string): Promise<SurveyData | null> {
        // Get survey info
        const surveyResult = await query(`
            SELECT id, year, label, description, response_rate, women_sample_size, men_sample_size
            FROM surveys
            WHERE module_id = $1 AND year = $2
        `, [moduleId, year]);

        if (surveyResult.rows.length === 0) return null;

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
            let stateData = null;
            // Get zonal data (always check, as some trends might have regional snapshots)
            if (true) {
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

                // Get state data
                const stateResult = await query(`
                    SELECT state, value
                    FROM state_data
                    WHERE indicator_id = $1
                    ORDER BY state
                `, [row.indicator_id]);

                if (stateResult.rows.length > 0) {
                    stateData = {};
                    stateResult.rows.forEach(s => {
                        stateData[s.state] = s.value;
                    });
                }
            }

            // Get trend data if it's a trend indicator
            let trendData = null;
            if (row.is_trend) {
                const trendResult = await query(`
                    SELECT year, series_name, value, color
                    FROM trend_data
                    WHERE indicator_id = $1
                    ORDER BY display_order ASC, year ASC, series_name
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
                ...(stateData && { stateData }),
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

    /**
     * Get all state data for a specific indicator
     */
    async getAllStateDataForIndicator(moduleId: string, year: string, categoryKey: string, indicatorKey: string) {
        const result = await query(`
            SELECT sd.state as "State", sd.value as "Value"
            FROM state_data sd
            JOIN indicators i ON sd.indicator_id = i.id
            JOIN categories c ON i.category_id = c.id
            JOIN surveys s ON c.survey_id = s.id
            WHERE s.module_id = $1 
              AND s.year = $2 
              AND c.key = $3 
              AND i.key = $4
            ORDER BY sd.state
        `, [moduleId, year, categoryKey, indicatorKey]);

        return result.rows;
    }

    /**
     * Get all indicators for a module and year
     */
    async getIndicators(moduleId: string, year: string) {
        const data = await this.getModuleYearData(moduleId, year);
        return data ? data.indicators : null;
    }
}

export const databaseService = new DatabaseService();
