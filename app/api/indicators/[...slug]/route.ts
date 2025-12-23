
import { NextResponse } from 'next/server';
import { databaseService } from '@/lib/services/database';

export async function GET(request: Request, props: { params: Promise<{ slug: string[] }> }) {
    const params = await props.params;
    const { slug } = params;

    try {
        // Route: /api/indicators/:moduleId/:year
        if (slug.length === 2) {
            const [moduleId, year] = slug;
            const surveyData = await databaseService.getModuleYearData(moduleId, year);

            if (!surveyData) {
                return NextResponse.json({ success: false, error: 'Data not found' }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                data: {
                    module: moduleId,
                    year,
                    ...surveyData
                }
            });
        }

        // Route: /api/indicators/:moduleId/:year
        if (slug.length === 4) {
            // ... implementation for specific indicator ...
            // For now, let's focus on the list which drives the sidebar
            return NextResponse.json({ success: false, error: 'Detailed indicator view not implemented yet' }, { status: 501 });
        }

        return NextResponse.json({ success: false, error: 'Invalid route' }, { status: 400 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
