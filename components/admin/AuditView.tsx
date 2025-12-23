'use client';

import { useState } from 'react';
import { cleanupEmptyCategories } from '@/app/lib/admin-actions';
import { AuditResult } from '@/app/lib/audit-service';

export default function AuditView({ data }: { data: AuditResult }) {
    const [cleaning, setCleaning] = useState(false);
    const [msg, setMsg] = useState('');

    const handleCleanup = async () => {
        setCleaning(true);
        const res = await cleanupEmptyCategories();
        if (res.success) {
            setMsg(`Deleted ${res.count} empty categories.`);
        } else {
            setMsg('Error: ' + res.error);
        }
        setCleaning(false);
    };

    return (
        <div className="space-y-8">
            {/* Summary Statistics */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-blue-600 font-medium">Total Surveys</div>
                    <div className="text-3xl font-bold text-blue-900 mt-1">{data.summary.totalSurveys}</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm text-green-600 font-medium">Total Categories</div>
                    <div className="text-3xl font-bold text-green-900 mt-1">{data.summary.totalCategories}</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="text-sm text-purple-600 font-medium">Total Indicators</div>
                    <div className="text-3xl font-bold text-purple-900 mt-1">{data.summary.totalIndicators}</div>
                </div>
            </div>

            {msg && (
                <div className="p-4 bg-blue-50 text-blue-700 rounded border border-blue-100">
                    {msg}
                </div>
            )}

            {/* Empty Categories Section */}
            <div className="bg-white rounded-lg shadow border p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Empty Categories</h2>
                    {data.emptyCategories.length > 0 && (
                        <button
                            onClick={handleCleanup}
                            disabled={cleaning}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                        >
                            {cleaning ? 'Cleaning...' : 'Delete All Empty'}
                        </button>
                    )}
                </div>

                {data.emptyCategories.length === 0 ? (
                    <p className="text-green-600 bg-green-50 p-3 rounded">No empty categories found. Structure is clean.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-2">Category</th>
                                    <th className="px-4 py-2">Survey</th>
                                    <th className="px-4 py-2">ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {data.emptyCategories.map((c) => (
                                    <tr key={c.id}>
                                        <td className="px-4 py-2 font-medium">{c.title}</td>
                                        <td className="px-4 py-2 text-gray-500">{c.survey}</td>
                                        <td className="px-4 py-2 text-xs text-gray-400 font-mono">{c.id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Surveys Without Indicators */}
            <div className="bg-white rounded-lg shadow border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Surveys Without Indicators</h2>
                {data.surveysWithoutIndicators.length === 0 ? (
                    <p className="text-green-600 bg-green-50 p-3 rounded">All surveys have indicators defined.</p>
                ) : (
                    <div className="space-y-2">
                        <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded mb-4">
                            These surveys have categories but no indicators defined. They may need data seeding.
                        </p>
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-2">Survey</th>
                                    <th className="px-4 py-2">Year</th>
                                    <th className="px-4 py-2">Categories</th>
                                    <th className="px-4 py-2">ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {data.surveysWithoutIndicators.map((s) => (
                                    <tr key={s.id}>
                                        <td className="px-4 py-2 font-medium">{s.name}</td>
                                        <td className="px-4 py-2 text-gray-500">{s.year}</td>
                                        <td className="px-4 py-2 text-gray-500">{s.categoryCount}</td>
                                        <td className="px-4 py-2 text-xs text-gray-400 font-mono">{s.id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
