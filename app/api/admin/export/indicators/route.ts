import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { rows } = await query(`
            SELECT 
                i.id,
                i.title as indicator,
                c.title as category,
                s.label as survey,
                s.year,
                m.name as module
            FROM indicators i
            JOIN categories c ON i.category_id = c.id
            JOIN surveys s ON c.survey_id = s.id
            JOIN modules m ON s.module_id = m.id
            ORDER BY m.name, s.year DESC, c.title, i.title
        `);

        // Convert to CSV
        const headers = ['ID', 'Indicator', 'Category', 'Survey', 'Year', 'Module'];
        const csvRows = [
            headers.join(','),
            ...rows.map(row => [
                row.id,
                `"${row.indicator.replace(/"/g, '""')}"`,
                `"${row.category.replace(/"/g, '""')}"`,
                `"${row.survey.replace(/"/g, '""')}"`,
                row.year,
                row.module
            ].join(','))
        ];

        const csv = csvRows.join('\n');

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="indicators-export-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}
