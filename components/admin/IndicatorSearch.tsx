'use client';

import { useState } from 'react';

export default function IndicatorSearch({ initialIndicators }: { initialIndicators: any[] }) {
    const [search, setSearch] = useState('');
    const [moduleFilter, setModuleFilter] = useState('all');

    const filtered = initialIndicators.filter(ind => {
        const matchesSearch = ind.title.toLowerCase().includes(search.toLowerCase()) ||
            ind.category?.toLowerCase().includes(search.toLowerCase());
        const matchesModule = moduleFilter === 'all' || ind.module === moduleFilter;
        return matchesSearch && matchesModule;
    });

    const modules = [...new Set(initialIndicators.map(i => i.module))];

    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Search indicators by title or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={moduleFilter}
                    onChange={(e) => setModuleFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Modules</option>
                    {modules.map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
                Showing {filtered.length} of {initialIndicators.length} indicators
            </div>

            {/* Indicators Table */}
            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indicator</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filtered.map((ind) => (
                            <tr key={ind.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{ind.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{ind.category}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{ind.module}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{ind.year}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
