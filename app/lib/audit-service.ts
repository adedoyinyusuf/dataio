import { query } from '@/lib/db';

export type AuditResult = {
    emptyCategories: { id: string; title: string; survey: string }[];
    surveysWithoutIndicators: { id: string; name: string; year: string; categoryCount: number }[];
    summary: {
        totalSurveys: number;
        totalCategories: number;
        totalIndicators: number;
    };
};

export async function runAudit(): Promise<AuditResult> {
    const emptyCatsRes = await query(`
        SELECT c.id, c.title, s.label as survey
        FROM categories c
        JOIN surveys s ON c.survey_id = s.id
        LEFT JOIN indicators i ON c.id = i.category_id
        WHERE i.id IS NULL
    `);

    const surveysWithoutIndicatorsRes = await query(`
        SELECT s.id, s.label as name, s.year, COUNT(DISTINCT c.id) as category_count
        FROM surveys s
        LEFT JOIN categories c ON s.id = c.survey_id
        LEFT JOIN indicators i ON c.id = i.category_id
        GROUP BY s.id, s.label, s.year
        HAVING COUNT(i.id) = 0
    `);

    const summaryRes = await query(`
        SELECT 
            (SELECT COUNT(*) FROM surveys) as total_surveys,
            (SELECT COUNT(*) FROM categories) as total_categories,
            (SELECT COUNT(*) FROM indicators) as total_indicators
    `);

    return {
        emptyCategories: emptyCatsRes.rows,
        surveysWithoutIndicators: surveysWithoutIndicatorsRes.rows.map(r => ({
            id: r.id,
            name: r.name,
            year: r.year,
            categoryCount: parseInt(r.category_count)
        })),
        summary: {
            totalSurveys: parseInt(summaryRes.rows[0].total_surveys),
            totalCategories: parseInt(summaryRes.rows[0].total_categories),
            totalIndicators: parseInt(summaryRes.rows[0].total_indicators),
        }
    };
}
