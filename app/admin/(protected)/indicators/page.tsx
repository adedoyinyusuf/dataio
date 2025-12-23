import { query } from '@/lib/db';
import IndicatorSearch from '@/components/admin/IndicatorSearch';

export default async function IndicatorsPage() {
    const { rows: indicators } = await query(`
        SELECT 
            i.id,
            i.title,
            c.title as category,
            m.name as module,
            s.year
        FROM indicators i
        JOIN categories c ON i.category_id = c.id
        JOIN surveys s ON c.survey_id = s.id
        JOIN modules m ON s.module_id = m.id
        ORDER BY m.name, s.year DESC, c.title, i.title
    `);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Indicator Management</h1>
                <p className="text-sm text-gray-500">Browse and search all indicators across surveys.</p>
            </div>

            <IndicatorSearch initialIndicators={indicators} />
        </div>
    );
}
