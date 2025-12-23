'use client';

import { useState } from 'react';
import { importCSV } from '@/app/lib/import-actions';

export default function CSVImportForm() {
    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setImporting(true);
        const formData = new FormData();
        formData.append('file', file);

        const res = await importCSV(formData);
        setResult(res);
        setImporting(false);
        if (res.success) {
            setFile(null);
            (e.target as HTMLFormElement).reset();
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload CSV File
                    </label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-lg file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100
                            cursor-pointer"
                    />
                </div>

                {file && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        Selected: <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!file || importing}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {importing ? 'Importing...' : 'Import Data'}
                </button>
            </form>

            {result && (
                <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <h3 className={`font-semibold mb-2 ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                        {result.success ? '✅ Import Successful!' : '❌ Import Failed'}
                    </h3>
                    <div className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                        {result.message}
                        {result.imported && <div className="mt-2">Rows imported: <span className="font-bold">{result.imported}</span></div>}
                        {result.errors && (
                            <div className="mt-2 space-y-1">
                                <div className="font-medium">Errors:</div>
                                {result.errors.slice(0, 5).map((err: string, i: number) => (
                                    <div key={i} className="text-xs">• {err}</div>
                                ))}
                                {result.errors.length > 5 && <div className="text-xs">...and {result.errors.length - 5} more</div>}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CSV Format Guide */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">📋 CSV Format Guide</h3>
                <div className="text-sm text-blue-800 space-y-2">
                    <p><strong>Required Columns:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><code className="bg-blue-100 px-1 rounded">indicator_id</code> - UUID of the indicator</li>
                        <li><code className="bg-blue-100 px-1 rounded">year</code> - Year of the data (e.g., 2024)</li>
                        <li><code className="bg-blue-100 px-1 rounded">value</code> - Numeric value</li>
                    </ul>
                    <p className="mt-3"><strong>Example CSV:</strong></p>
                    <pre className="bg-blue-100 p-2 rounded text-xs overflow-x-auto">
                        indicator_id,year,value
                        abc123-def456-...,2024,56.5
                        abc123-def456-...,2023,54.2
                    </pre>
                    <p className="mt-3 text-xs italic">💡 Tip: Export existing data first to see the correct format</p>
                </div>
            </div>
        </div>
    );
}
