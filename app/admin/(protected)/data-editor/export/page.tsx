import Link from 'next/link';

export default function ExportPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
                <p className="text-sm text-gray-500">Download database contents as CSV files</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Indicators Export */}
                <div className="bg-white rounded-lg shadow border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Indicators List</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Export all indicators with their categories, surveys, and modules.
                    </p>
                    <a
                        href="/api/admin/export/indicators"
                        download
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Download Indicators CSV
                    </a>
                </div>

                {/* Data Export */}
                <div className="bg-white rounded-lg shadow border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Trend Data</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Export all trend data values with indicator metadata.
                    </p>
                    <a
                        href="/api/admin/export/data"
                        download
                        className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Download Data CSV
                    </a>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">📊 Export Information</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li><strong>Indicators CSV</strong>: Contains indicator definitions (no values)</li>
                    <li><strong>Data CSV</strong>: Contains actual data values with full context</li>
                    <li>Files are named with today's date for easy tracking</li>
                    <li>CSV format can be opened in Excel, Google Sheets, or any spreadsheet software</li>
                </ul>
            </div>

            <div className="flex justify-between">
                <Link href="/admin" className="text-blue-600 hover:text-blue-700">
                    ← Back to Dashboard
                </Link>
                <Link href="/admin/data-editor" className="text-blue-600 hover:text-blue-700">
                    Go to Data Editor →
                </Link>
            </div>
        </div>
    );
}
