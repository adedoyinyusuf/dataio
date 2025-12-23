'use client';

import { useState } from 'react';
import { toggleModuleStatus } from '@/app/lib/admin-actions';
// import { Switch } from '@/components/ui/switch'; // Assuming no UI lib yet

export default function ModuleTable({ modules }: { modules: any[] }) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleToggle = async (id: string, current: boolean) => {
        setLoading(id);
        await toggleModuleStatus(id, current);
        setLoading(null);
    };

    return (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enabled</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {modules.map((m) => (
                        <tr key={m.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {m.name}
                                <div className="text-xs text-gray-400 font-mono">{m.id}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                                {m.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={() => handleToggle(m.id, m.enabled)}
                                    disabled={loading === m.id}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${m.enabled ? 'bg-green-600' : 'bg-gray-200'}`}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${m.enabled ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900">Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
