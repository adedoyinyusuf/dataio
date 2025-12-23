import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { query } from '@/lib/db';

export async function GET() {
    // Security: Validate Admin Access
    const headersList = await headers();
    const adminKey = headersList.get('x-admin-key');
    const isDev = process.env.NODE_ENV === 'development';

    // In production, require strict generic admin key
    if (!isDev && (!process.env.ADMIN_SECRET || adminKey !== process.env.ADMIN_SECRET)) {
        return NextResponse.json({ success: false, error: 'Unauthorized Access' }, { status: 401 });
    }

    try {
        // Get all modules with their survey count
        const modulesResult = await query(`
            SELECT 
                m.id,
                m.name,
                m.description,
                m.enabled,
                COUNT(DISTINCT s.id) as survey_count,
                json_agg(DISTINCT s.year ORDER BY s.year DESC) FILTER (WHERE s.year IS NOT NULL) as years
            FROM modules m
            LEFT JOIN surveys s ON m.id = s.module_id
            GROUP BY m.id, m.name, m.description, m.enabled
            ORDER BY m.id
        `);

        const modules = [];
        for (const row of modulesResult.rows) {
            // Get category and indicator count for each module
            const indicatorResult = await query(`
                SELECT COUNT(DISTINCT i.id) as indicator_count
                FROM modules m
                LEFT JOIN surveys s ON m.id = s.module_id
                LEFT JOIN categories c ON s.id = c.survey_id
                LEFT JOIN indicators i ON c.id = i.category_id
                WHERE m.id = $1
            `, [row.id]);

            modules.push({
                id: row.id,
                name: row.name,
                description: row.description,
                enabled: row.enabled,
                surveyCount: parseInt(row.survey_count),
                years: row.years || [],
                indicatorCount: parseInt(indicatorResult.rows[0]?.indicator_count || 0)
            });
        }

        return NextResponse.json({
            success: true,
            data: modules
        });
    } catch (error: any) {
        console.error('[Module Status Error]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
