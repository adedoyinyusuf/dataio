import { query } from "@/lib/db";
import Link from "next/link";

async function getStats() {
    try {
        const surveyCount = await query('SELECT count(*) FROM surveys');
        const indicatorCount = await query('SELECT count(*) FROM indicators');
        const dataCount = await query('SELECT count(*) FROM trend_data');

        return {
            surveys: parseInt(surveyCount.rows[0].count),
            indicators: parseInt(indicatorCount.rows[0].count),
            points: parseInt(dataCount.rows[0].count),
            dbStatus: 'Connected'
        };
    } catch (e) {
        return { surveys: 0, indicators: 0, points: 0, dbStatus: 'Error' };
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2">Welcome to the Administration Console.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Clickable Stat Cards */}
                <Link href="/admin/modules" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-400 transition-all group">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Surveys</div>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-gray-900">{stats.surveys}</span>
                        <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">→ Manage</span>
                    </div>
                </Link>

                <Link href="/admin/indicators" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-400 transition-all group">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Indicators Defined</div>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-gray-900">{stats.indicators}</span>
                        <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">→ Browse</span>
                    </div>
                </Link>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Data Points</div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-blue-600">{stats.points.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {stats.dbStatus === 'Error' && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    Database Connection Error. Please check logs.
                </div>
            )}

            {/* Quick Actions */}
            <h2 className="text-xl font-semibold text-gray-800 pt-4">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/admin/modules" className="block p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                    <div className="font-semibold text-gray-900 group-hover:text-blue-700">Manage Modules</div>
                    <div className="text-sm text-gray-500 mt-1">Enable/Disable surveys</div>
                </Link>
                <Link href="/admin/indicators" className="block p-4 border rounded-lg hover:border-green-500 hover:bg-green-50 transition group">
                    <div className="font-semibold text-gray-900 group-hover:text-green-700">Browse Indicators</div>
                    <div className="text-sm text-gray-500 mt-1">Search and manage</div>
                </Link>
                <Link href="/admin/audit" className="block p-4 border rounded-lg hover:border-amber-500 hover:bg-amber-50 transition group">
                    <div className="font-semibold text-gray-900 group-hover:text-amber-700">Data Audit</div>
                    <div className="text-sm text-gray-500 mt-1">Check integrity</div>
                </Link>
            </div>
        </div>
    );
}
