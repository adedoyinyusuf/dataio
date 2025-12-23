import CSVImportForm from '@/components/admin/CSVImportForm';
import Link from 'next/link';

export default function ImportDataPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Import Data</h1>
                    <p className="text-sm text-gray-500">Upload CSV files to add or update trend data</p>
                </div>
                <Link
                    href="/admin/data-editor/export"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    Need a template? Export existing data →
                </Link>
            </div>

            <CSVImportForm />

            {/* Important Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="font-semibold text-amber-900 mb-3">⚠️ Important Notes</h3>
                <ul className="text-sm text-amber-800 space-y-2 list-disc list-inside">
                    <li>CSV must use <strong>comma separation</strong>, not semicolons or tabs</li>
                    <li>Indicator IDs must exactly match existing indicators (export data to get correct IDs)</li>
                    <li>If data already exists for an indicator + year combination, it will be <strong>updated</strong></li>
                    <li>Invalid rows will be skipped with error messages shown</li>
                    <li>Large files may take some time to process</li>
                </ul>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
                <Link
                    href="/admin/data-editor"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                >
                    ← Back to Data Editor
                </Link>
                <Link
                    href="/admin/indicators"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                >
                    View Indicators →
                </Link>
            </div>
        </div>
    );
}
