import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import DataEditorTable from '@/components/admin/DataEditorTable';

export default async function SurveyDataEditor({ params }: { params: Promise<{ surveyId: string }> }) {
    const { surveyId } = await params;

    // Get survey info
    const { rows: surveyRows } = await query(`
        SELECT s.label, s.year, m.name as module
        FROM surveys s
        JOIN modules m ON s.module_id = m.id
        WHERE s.id = $1
    `, [surveyId]);

    if (surveyRows.length === 0) return notFound();
    const survey = surveyRows[0];

    // Get indicators with their trend data
    const { rows: indicators } = await query(`
        SELECT 
            i.id,
            i.title,
            c.title as category,
            td.id as data_id,
            td.year as data_year,
            td.value
        FROM indicators i
        JOIN categories c ON i.category_id = c.id
        LEFT JOIN trend_data td ON i.id = td.indicator_id
        WHERE c.survey_id = $1
        ORDER BY c.title, i.title, td.year
    `, [surveyId]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {survey.label} ({survey.year})
                </h1>
                <p className="text-sm text-gray-500">{survey.module}</p>
            </div>

            <DataEditorTable indicators={indicators} surveyId={surveyId} />
        </div>
    );
}
