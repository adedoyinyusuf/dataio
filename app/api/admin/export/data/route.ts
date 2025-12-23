import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { rows } = await query(`
            SELECT 
                i.title as indicator,
                c.title as category,
                s.label as survey,
                s.year as survey_year,
                m.name as module,
                td.year as data_year,
                td.value,
                td.location
            FROM trend_data td
            JOIN indicators i ON td.indicator_id = i.id
            JOIN categories c ON i.category_id = c.id
            JOIN surveys s ON c.survey_id = s.id
            JOIN modules m ON s.module_id = m.id
            ORDER BY m.name, s.year DESC, c.title, i.title, td.year
        `);

        // Convert to CSV
        const headers = ['Module', 'Survey', 'Survey Year', 'Category', 'Indicator', 'Data Year', 'Value', 'Location'];
        const csvRows = [
            headers.join(','),
            ...rows.map(row => [
                row.module,
                `"${row.survey.replace(/"/g, '""')}"`,
                row.survey_year,
                `"${row.category.replace(/"/g, '""')}"`,
                `"${row.indicator.replace(/"/g, '""')}"`,
                row.data_year,
                row.value,
                row.location || 'National'
            ].join(','))
        ];

        const csv = csvRows.join('\n');

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="trend-data-export-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}
