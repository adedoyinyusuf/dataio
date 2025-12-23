
import { NextResponse } from 'next/server';
import { databaseService } from '@/lib/services/database';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('module');
    const year = searchParams.get('year');
    const category = searchParams.get('category');
    const indicator = searchParams.get('indicator');

    if (!moduleId || !year || !category || !indicator) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        const data = await databaseService.getAllStateDataForIndicator(moduleId, year, category, indicator);
        return NextResponse.json(data);
    } catch (err: any) {
        console.error('Error fetching state data:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
