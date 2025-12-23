'use client';

import { useState } from 'react';
import { Category, Indicator } from '@/lib/services/database';
import { ChevronDown, ChevronRight, Search, BarChart3, Calendar } from 'lucide-react';

interface SidebarProps {
    selectedModuleId: string | null;
    selectedYear: string;
    yearsAvailable?: string[]; // New prop
    onSelectYear?: (year: string) => void; // New prop
    indicators: Record<string, Category> | null;
    onSelectIndicator: (categoryKey: string, indicatorKey: string, indicator: Indicator) => void;
    loading?: boolean;
}

export default function Sidebar({
    selectedModuleId,
    selectedYear,
    yearsAvailable = [],
    onSelectYear,
    indicators,
    onSelectIndicator,
    loading
}: SidebarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
    const [activeIndicatorKey, setActiveIndicatorKey] = useState<string | null>(null);

    const toggleCategory = (key: string) => {
        setOpenCategories(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleIndicatorClick = (catKey: string, indKey: string, ind: Indicator) => {
        setActiveIndicatorKey(indKey);
        onSelectIndicator(catKey, indKey, ind);
    };

    // Helper for Category Icons
    const getCategoryIcon = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes('maternal')) return '🤰';
        if (t.includes('fertility')) return '🌱';
        if (t.includes('child')) return '👶';
        if (t.includes('vaccin')) return '💉';
        if (t.includes('hiv')) return '🎗️';
        if (t.includes('malaria')) return '🦟';
        if (t.includes('empowerment')) return '👩‍🎓';
        if (t.includes('disability')) return '♿';
        return '📂';
    };

    const filteredCategories = indicators
        ? Object.entries(indicators).filter(([_, cat]) => {
            if (!searchTerm) return true;
            if (cat.title.toLowerCase().includes(searchTerm.toLowerCase())) return true;
            return Object.values(cat.items).some(ind =>
                ind.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        })
        : [];

    return (
        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6 transition-transform duration-300">

            {/* Year Selector */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow relative group">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Survey Year</p>
                            <h3 className="text-lg font-bold text-gray-900">
                                {selectedYear} {selectedModuleId === 'nmis' ? 'MIS' : selectedModuleId === 'ndhs' ? 'NDHS' : ''}
                            </h3>
                        </div>
                    </div>
                    <ChevronDown className="text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
                </div>

                {/* Overlay Select for Functionality */}
                {yearsAvailable && yearsAvailable.length > 0 && onSelectYear && (
                    <select
                        value={selectedYear}
                        onChange={(e) => onSelectYear(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={!selectedModuleId} // Disable if no module selected
                    >
                        {yearsAvailable.map(year => (
                            <option key={year} value={year}>
                                {year} {selectedModuleId === 'nmis' ? 'MIS' : selectedModuleId === 'ndhs' ? 'NDHS' : ''}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Data Explorer */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden h-[600px]">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg text-green-700">
                            <BarChart3 size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Data Explorer</h3>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search indicators..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-200 text-sm rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                        />
                        <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {loading && <div className="p-8 text-center text-gray-400 animate-pulse">Loading indicators...</div>}
                    {!loading && !selectedModuleId && <div className="p-8 text-center text-gray-500 text-sm">Select a module above.</div>}

                    {!loading && selectedModuleId && indicators && Object.keys(indicators).length === 0 && (
                        <div className="p-8 text-center text-red-400 text-sm">No indicators found.</div>
                    )}

                    {!loading && filteredCategories.map(([key, category]) => (
                        <div key={key} className="border-b border-gray-50 last:border-0 rounded-lg overflow-hidden">
                            <div
                                onClick={() => toggleCategory(key)}
                                className={`
                                p-3 cursor-pointer flex items-center justify-between text-sm font-semibold text-gray-700 select-none
                                transition-colors hover:bg-gray-50
                                ${openCategories[key] ? 'bg-gray-50 text-green-800' : ''}
                            `}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg opacity-80">{getCategoryIcon(category.title)}</span>
                                    <span>{category.title}</span>
                                </div>
                                {openCategories[key] ? <ChevronDown size={16} className="text-green-600" /> : <ChevronRight size={16} className="text-gray-400" />}
                            </div>

                            {(openCategories[key] || searchTerm) && (
                                <div className="bg-gray-50/50 p-1 pb-2 space-y-0.5">
                                    {Object.entries(category.items).map(([indKey, ind]) => (
                                        <div
                                            key={indKey}
                                            className={`
                                            mx-2 p-2 pl-9 text-sm rounded-md cursor-pointer transition-all border border-transparent 
                                            ${activeIndicatorKey === indKey
                                                    ? 'bg-white text-green-700 shadow-sm border-green-100 font-medium'
                                                    : 'text-gray-600 hover:bg-white hover:text-green-700 hover:shadow-sm'}
                                        `}
                                            onClick={() => handleIndicatorClick(key, indKey, ind)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${activeIndicatorKey === indKey ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                {ind.title}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
