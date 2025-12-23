import { query } from '@/lib/db';
import Link from 'next/link';

export default async function DataEditorPage() {
    // Get all surveys for the dropdown
    const { rows: surveys } = await query(`
        SELECT s.id, s.label, s.year, m.name as module
        FROM surveys s
        JOIN modules m ON s.module_id = m.id
        WHERE m.enabled = true
        ORDER BY m.name, s.year DESC
    `);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Data Editor</h1>
                    <p className="text-sm text-gray-500">View and edit data values for indicators</p>
                </div>
                <Link
                    href="/admin/data-editor/export"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Export Data
                </Link>
            </div>

            {/* Survey Selection */}
            <div className="bg-white rounded-lg shadow border p-6">
                <h2 className="text-lg font-semibold mb-4">Select Survey to Edit</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {surveys.map((survey) => (
                        <Link
                            key={survey.id}
                            href={`/admin/data-editor/${survey.id}`}
                            className="block p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
                        >
                            <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                                {survey.label}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {survey.module} • {survey.year}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-blue-600 font-medium">Total Surveys</div>
                    <div className="text-2xl font-bold text-blue-900 mt-1">{surveys.length}</div>
                </div>
            </div>
        </div>
    );
}
