'use client';

import { useState } from 'react';
import { updateDataValue } from '@/app/lib/data-actions';

export default function DataEditorTable({ indicators, surveyId }: { indicators: any[]; surveyId: string }) {
    const [editing, setEditing] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [saving, setSaving] = useState(false);

    // Group by indicator
    const grouped = indicators.reduce((acc: any, row) => {
        if (!acc[row.id]) {
            acc[row.id] = {
                id: row.id,
                title: row.title,
                category: row.category,
                data: []
            };
        }
        if (row.data_id) {
            acc[row.id].data.push({
                id: row.data_id,
                year: row.data_year,
                value: row.value
            });
        }
        return acc;
    }, {});

    const indicatorList = Object.values(grouped);

    const handleEdit = (dataId: string, currentValue: string) => {
        setEditing(dataId);
        setEditValue(currentValue || '');
    };

    const handleSave = async (dataId: string, indicatorId: string) => {
        setSaving(true);
        const result = await updateDataValue(dataId, parseFloat(editValue), indicatorId);
        if (result.success) {
            setEditing(null);
        } else {
            alert('Failed to save: ' + result.error);
        }
        setSaving(false);
    };

    return (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Indicator</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {indicatorList.map((ind: any) => (
                            ind.data.length > 0 ? (
                                ind.data.map((data: any, idx: number) => (
                                    <tr key={data.id} className="hover:bg-gray-50">
                                        {idx === 0 && (
                                            <>
                                                <td rowSpan={ind.data.length} className="px-6 py-4 text-sm font-medium text-gray-900 border-r">
                                                    {ind.title}
                                                </td>
                                                <td rowSpan={ind.data.length} className="px-6 py-4 text-sm text-gray-500 border-r">
                                                    {ind.category}
                                                </td>
                                            </>
                                        )}
                                        <td className="px-6 py-4 text-sm text-gray-500">{data.year}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {editing === data.id ? (
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="font-medium text-gray-900">{data.value}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {editing === data.id ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSave(data.id, ind.id)}
                                                        disabled={saving}
                                                        className="text-green-600 hover:text-green-700 disabled:opacity-50"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditing(null)}
                                                        className="text-gray-600 hover:text-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleEdit(data.id, data.value)}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr key={ind.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{ind.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{ind.category}</td>
                                    <td colSpan={3} className="px-6 py-4 text-sm text-gray-400 italic">No data available</td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
