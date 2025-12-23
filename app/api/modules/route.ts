
import { NextResponse } from 'next/server';
import { surveyService } from '@/lib/services/surveyService';

export async function GET() {
    try {
        const modules = await surveyService.getAllModules();
        return NextResponse.json({ success: true, data: modules });
    } catch (error: any) {
        console.error('[API Modules Error]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
