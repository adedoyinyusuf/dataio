import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // Get all stats in parallel
        const [modules, surveys, categories, indicators, dataPoints, stateData, zonalData] = await Promise.all([
            query('SELECT COUNT(*) as count FROM modules WHERE enabled = true'),
            query('SELECT COUNT(*) as count FROM surveys'),
            query('SELECT COUNT(*) as count FROM categories'),
            query('SELECT COUNT(*) as count FROM indicators'),
            query('SELECT COUNT(*) as count FROM trend_data'),
            query('SELECT COUNT(*) as count FROM state_data'),
            query('SELECT COUNT(*) as count FROM zonal_data')
        ]);

        const stats = {
            modules: parseInt(modules.rows[0].count),
            surveys: parseInt(surveys.rows[0].count),
            categories: parseInt(categories.rows[0].count),
            indicators: parseInt(indicators.rows[0].count),
            dataPoints: parseInt(dataPoints.rows[0].count),
            stateData: parseInt(stateData.rows[0].count),
            zonalData: parseInt(zonalData.rows[0].count)
        };

        return NextResponse.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('[Stats API] Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
