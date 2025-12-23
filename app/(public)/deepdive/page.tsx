'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Module, Indicator, Category } from '@/lib/services/database';
import TrendChart from '@/components/features/TrendChart';

// Dynamic import for Leaflet (No SSR)
const LeafletMap = dynamic(() => import('@/components/features/LeafletMap'), {
    ssr: false,
    loading: () => <div className="h-full flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function DeepDivePage() {
    // Data State
    const [modules, setModules] = useState<Module[]>([]);
    const [indicators, setIndicators] = useState<Record<string, Category> | null>(null);
    const [compIndicators, setCompIndicators] = useState<Record<string, Category> | null>(null);

    // Primary Selection State
    const [selectedModule, setSelectedModule] = useState<string>('ndhs');
    const [selectedYear, setSelectedYear] = useState<string>('2024');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedIndicatorKey, setSelectedIndicatorKey] = useState<string>('');
    const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);

    // Comparison Selection State
    const [showComparison, setShowComparison] = useState(false);
    const [compModule, setCompModule] = useState<string>('ndhs');
    const [compYear, setCompYear] = useState<string>('2018'); // Default to previous survey
    const [compCategory, setCompCategory] = useState<string>('');
    const [compIndicatorKey, setCompIndicatorKey] = useState<string>('');
    const [compIndicator, setCompIndicator] = useState<Indicator | null>(null);

    // UI State
    const [viewMode, setViewMode] = useState<'chart' | 'map'>('chart');
    const [chartType, setChartType] = useState<string>('bar');
    const [stateData, setStateData] = useState<any[]>([]);
    const [drilldownZone, setDrilldownZone] = useState<string | null>(null);

    const zoneStateMapping: Record<string, string[]> = {
        'North Central': ['Benue', 'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Plateau', 'FCT'],
        'North East': ['Adamawa', 'Bauchi', 'Borno', 'Gombe', 'Taraba', 'Yobe'],
        'North West': ['Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Sokoto', 'Zamfara'],
        'South East': ['Abia', 'Anambra', 'Ebonyi', 'Enugu', 'Imo'],
        'South South': ['Akwa Ibom', 'Bayelsa', 'Cross River', 'Delta', 'Edo', 'Rivers'],
        'South West': ['Ekiti', 'Lagos', 'Ogun', 'Ondo', 'Osun', 'Oyo']
    };

    // -- Fetch Modules --
    useEffect(() => {
        fetch('/api/modules').then(r => r.json()).then(res => {
            if (res.success) setModules(res.data);
        });
    }, []);

    // -- Fetch State Data for MAP or DRILLDOWN --
    useEffect(() => {
        if ((viewMode === 'map' || drilldownZone) && selectedIndicatorKey && selectedCategory && selectedModule && selectedYear && !selectedIndicator?.isTrend) {
            // Fetch detailed state breakdown
            fetch(`/api/data/state?module=${selectedModule}&year=${selectedYear}&category=${selectedCategory}&indicator=${selectedIndicatorKey}`)
                .then(r => r.json())
                .then(data => {
                    setStateData(Array.isArray(data) ? data : []);
                })
                .catch(err => {
                    console.error("Failed to fetch state data", err);
                    setStateData([]);
                });
        }
    }, [viewMode, selectedIndicatorKey, selectedCategory, selectedModule, selectedYear, selectedIndicator]);

    // -- Fetch Primary Indicators --

    useEffect(() => {
        if (selectedModule && selectedYear) {
            fetch(`/api/indicators/${selectedModule}/${selectedYear}`).then(r => r.json()).then(res => {
                if (res.success && res.data.indicators) {
                    setIndicators(res.data.indicators);
                    setSelectedCategory(''); setSelectedIndicatorKey(''); setSelectedIndicator(null);
                }
            });
        }
    }, [selectedModule, selectedYear]);

    // -- Fetch Comparison Indicators --
    useEffect(() => {
        if (showComparison && compModule && compYear) {
            fetch(`/api/indicators/${compModule}/${compYear}`).then(r => r.json()).then(res => {
                if (res.success && res.data.indicators) {
                    setCompIndicators(res.data.indicators);
                    // Don't auto-reset category if user is toggling back and forth, but simple logic for now:
                    setCompCategory(''); setCompIndicatorKey(''); setCompIndicator(null);
                }
            });
        } else if (!showComparison) {
            setCompIndicator(null);
        }
    }, [showComparison, compModule, compYear]);

    // -- Handle Primary Indicator Selection --
    useEffect(() => {
        if (selectedIndicatorKey && selectedCategory && indicators) {
            const ind = indicators[selectedCategory]?.items[selectedIndicatorKey];
            setSelectedIndicator(ind || null);
        }
    }, [selectedIndicatorKey, selectedCategory, indicators]);

    // -- Handle Comparison Indicator Selection --
    useEffect(() => {
        if (compIndicatorKey && compCategory && compIndicators) {
            const ind = compIndicators[compCategory]?.items[compIndicatorKey];
            setCompIndicator(ind || null);
        }
    }, [compIndicatorKey, compCategory, compIndicators]);


    // -- Construct Chart Data --
    const getChartData = () => {
        if (!selectedIndicator) return null;

        if (drilldownZone) {
            if (stateData.length === 0) return null;

            const states = zoneStateMapping[drilldownZone] || [];
            // Filter stateData (assumed array of {State, Value})
            const filteredData = stateData.filter((d: any) => states.includes(d.State));
            // Sort by states order defined in mapping or alphabetical
            const sortedData = states.map(state => {
                const found = filteredData.find((d: any) => d.State === state);
                return found ? Number(found.Value) : 0;
            });

            return {
                labels: states,
                datasets: [{
                    label: `${selectedIndicator.title} - ${drilldownZone} (${selectedYear})`,
                    data: sortedData,
                    backgroundColor: 'rgba(21, 128, 61, 0.7)',
                    borderColor: '#15803d',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            };
        }

        const labels = selectedIndicator.zonal ? ['North Central', 'North East', 'North West', 'South East', 'South South', 'South West'] : selectedIndicator.labels;

        let datasets = [];

        // Primary Dataset
        if (selectedIndicator.isTrend && selectedIndicator.datasets) {
            datasets = [...selectedIndicator.datasets];
        } else if (selectedIndicator.zonal && selectedIndicator.zonal.length > 0) {
            datasets.push({
                label: `${selectedIndicator.title} (${selectedYear})`,
                data: selectedIndicator.zonal,
                backgroundColor: 'rgba(21, 128, 61, 0.7)', // Green-700
                borderColor: '#15803d',
                borderWidth: 1,
                borderRadius: 4
            });
        }

        // Comparison Dataset
        if (showComparison && compIndicator) {
            // Ensure compatibility (Zonal vs Trend)
            // Simple case: Both are Zonal
            if (selectedIndicator.zonal && compIndicator.zonal && compIndicator.zonal.length > 0) {
                datasets.push({
                    label: `${compIndicator.title} (${compYear})`,
                    data: compIndicator.zonal,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)', // Blue-500
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    borderRadius: 4
                });
            }
        }

        if (datasets.length === 0) {
            // Fallback: If no zonal/trend data, but specific National Value exists, show single bar
            if (selectedIndicator.val != null) {
                return {
                    labels: ['National Average'],
                    datasets: [{
                        label: `${selectedIndicator.title}`,
                        data: [selectedIndicator.val],
                        backgroundColor: 'rgba(21, 128, 61, 0.7)',
                        borderColor: '#15803d',
                        borderWidth: 1,
                        borderRadius: 4,
                        barThickness: 60 // Make it look decent as a single bar
                    }]
                };
            }
            return null;
        }

        return { labels, datasets };
    };

    return (
        <div className="flex-grow w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen bg-gray-50/50 font-inter">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 fade-in-up">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 font-outfit">Deep Insight</h2>
                    <p className="text-slate-500 mt-1">Deep dive into indicators with zonal breakdowns and comparative analysis.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"><span>🔗</span> Share</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"><span className="text-red-600">📄</span> Export PDF</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"><span className="text-green-600">📊</span> CSV</button>
                </div>
            </div>

            {/* Configuration Card */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Configuration</h3>
                </div>

                <div className="p-6 space-y-6">
                    {/* Primary Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                        <div className="lg:col-span-3">
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Module</label>
                            <select
                                value={selectedModule}
                                onChange={(e) => {
                                    const modId = e.target.value;
                                    setSelectedModule(modId);
                                    // Auto-select latest year for this module
                                    const mod = modules.find(m => m.id === modId);
                                    if (mod && mod.yearsAvailable && mod.yearsAvailable.length > 0) {
                                        setSelectedYear(mod.yearsAvailable[0]);
                                    }
                                }}
                                className="w-full text-sm border-slate-200 rounded-lg focus:ring-green-500 focus:border-green-500 bg-slate-50 p-2.5"
                            >
                                {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div className="lg:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Year</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-lg focus:ring-green-500 focus:border-green-500 bg-slate-50 p-2.5"
                            >
                                {modules.find(m => m.id === selectedModule)?.yearsAvailable?.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                )) || <option value="2024">2024</option>}
                            </select>
                        </div>
                        <div className="lg:col-span-3">
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category</label>
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full text-sm border-slate-200 rounded-lg focus:ring-green-500 focus:border-green-500 bg-slate-50 p-2.5">
                                <option value="">Select Category</option>
                                {indicators && Object.entries(indicators).map(([key, cat]) => <option key={key} value={key}>{cat.title}</option>)}
                            </select>
                        </div>
                        <div className="lg:col-span-4">
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Indicator</label>
                            <select value={selectedIndicatorKey} onChange={(e) => setSelectedIndicatorKey(e.target.value)} disabled={!selectedCategory} className="w-full text-sm border-slate-200 rounded-lg focus:ring-green-500 focus:border-green-500 bg-slate-50 p-2.5 disabled:opacity-50">
                                <option value="">Select Indicator</option>
                                {selectedCategory && indicators && Object.entries(indicators[selectedCategory]?.items || {}).map(([key, ind]) => <option key={key} value={key}>{ind.title}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Comparison Toggle */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <label className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setShowComparison(!showComparison)}>
                            <div className={`w-9 h-5 rounded-full relative transition-colors ${showComparison ? 'bg-green-600' : 'bg-slate-200'}`}>
                                <div className={`absolute top-[2px] left-[2px] bg-white w-4 h-4 rounded-full transition-all ${showComparison ? 'translate-x-[16px]' : ''}`}></div>
                            </div>
                            <span className="text-sm font-bold text-slate-700">Compare with another dataset</span>
                        </label>

                        {/* Comparison Filters */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mt-4 transition-all duration-300 ${showComparison ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
                            <div className="lg:col-span-3">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Comp. Module</label>
                                <select
                                    value={compModule}
                                    onChange={(e) => {
                                        const modId = e.target.value;
                                        setCompModule(modId);
                                        // Auto-select latest year for this module
                                        const mod = modules.find(m => m.id === modId);
                                        if (mod && mod.yearsAvailable && mod.yearsAvailable.length > 0) {
                                            setCompYear(mod.yearsAvailable[0]);
                                        }
                                    }}
                                    className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white p-2.5"
                                >
                                    {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                            </div>
                            <div className="lg:col-span-2">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Year</label>
                                <select
                                    value={compYear}
                                    onChange={(e) => setCompYear(e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white p-2.5"
                                >
                                    {modules.find(m => m.id === compModule)?.yearsAvailable?.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    )) || <option value="2024">2024</option>}
                                </select>
                            </div>
                            <div className="lg:col-span-3">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category</label>
                                <select value={compCategory} onChange={(e) => setCompCategory(e.target.value)} className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white p-2.5">
                                    <option value="">Select Category</option>
                                    {compIndicators && Object.entries(compIndicators).map(([key, cat]) => <option key={key} value={key}>{cat.title}</option>)}
                                </select>
                            </div>
                            <div className="lg:col-span-4">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Indicator</label>
                                <select value={compIndicatorKey} onChange={(e) => setCompIndicatorKey(e.target.value)} disabled={!compCategory} className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white p-2.5 disabled:opacity-50">
                                    <option value="">Select Indicator</option>
                                    {compCategory && compIndicators && Object.entries(compIndicators[compCategory]?.items || {}).map(([key, ind]) => <option key={key} value={key}>{ind.title}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/50 border-t border-gray-100 flex justify-end">
                    <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
                        <span>🔍</span> Apply Filters
                    </button>
                </div>
            </section>

            {/* Landing Page - Show when no indicator is selected */}
            {!selectedIndicatorKey && (
                <div className="space-y-8">
                    {/* Hero Section */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-14 fade-in-up">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
                        <div className="relative z-10 text-center max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-full mb-6">
                                <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">🎯</span>
                                </div>
                                <span className="text-white text-sm font-bold">Advanced Analytics Platform</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 font-outfit leading-tight">Deep Dive Analysis</h1>
                            <p className="text-xl text-purple-100 mb-8 leading-relaxed max-w-3xl mx-auto">
                                Unlock deeper insights with zonal breakdowns, year-over-year comparisons, interactive maps, and AI-powered interpretations.
                            </p>
                            <div className="inline-flex items-center gap-2 bg-yellow-400/20 border-2 border-yellow-400/40 backdrop-blur-sm px-6 py-3 rounded-xl text-yellow-100 text-sm font-bold">
                                <span className="text-xl">👆</span>
                                <span>Configure your analysis above to begin</span>
                            </div>
                        </div>
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>
                    </div>

                    {/* Capabilities Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: '🗺️',
                                title: 'Zonal Mapping',
                                description: 'Interactive geographic visualization across Nigerian zones and states',
                                color: 'from-orange-500 to-red-600',
                                bgColor: 'from-orange-50 to-red-50'
                            },
                            {
                                icon: '🔄',
                                title: 'Comparative Analysis',
                                description: 'Side-by-side comparison of indicators across different years',
                                color: 'from-blue-500 to-cyan-600',
                                bgColor: 'from-blue-50 to-cyan-50'
                            },
                            {
                                icon: '💡',
                                title: 'Smart Insights',
                                description: 'AI-generated interpretations and actionable recommendations',
                                color: 'from-purple-500 to-pink-600',
                                bgColor: 'from-purple-50 to-pink-50'
                            },
                            {
                                icon: '📊',
                                title: 'Enhanced Charts',
                                description: 'Larger visualizations with detailed data tables and legends',
                                color: 'from-green-500 to-emerald-600',
                                bgColor: 'from-green-50 to-emerald-50'
                            }
                        ].map((cap, idx) => (
                            <div key={idx} className={`bg-gradient-to-br ${cap.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all group hover:-translate-y-1`} style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className={`w-16 h-16 bg-gradient-to-br ${cap.color} rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                                    {cap.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 text-lg">{cap.title}</h3>
                                <p className="text-sm text-gray-700 leading-relaxed">{cap.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Features Showcase */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Advanced Features */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                                    ⚡
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 font-outfit">Advanced Features</h3>
                                    <p className="text-sm text-gray-600">Powerful tools for comprehensive data analysis</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { icon: '📈', title: 'Trend Visualization', desc: 'Track indicator changes over multiple survey years' },
                                    { icon: '🎨', title: 'Chart Customization', desc: 'Switch between bar charts, line graphs, and maps' },
                                    { icon: '📋', title: 'Detailed Data Tables', desc: 'Comprehensive zone-by-zone data breakdowns' },
                                    { icon: '🔍', title: 'Regional Insights', desc: 'North-South divide analysis and zone comparisons' }
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors group">
                                        <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{feature.icon}</span>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm mb-1">{feature.title}</h4>
                                            <p className="text-xs text-gray-600">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Usage Guide */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                                    📚
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 font-outfit">How to Use</h3>
                                    <p className="text-sm text-gray-700">Follow these steps for deep analysis</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    {
                                        step: '1',
                                        title: 'Configure Filters',
                                        desc: 'Select module, year, category, and indicator from the configuration panel above',
                                        color: 'from-green-500 to-green-600'
                                    },
                                    {
                                        step: '2',
                                        title: 'Enable Comparison',
                                        desc: 'Toggle comparison mode to analyze year-over-year changes',
                                        color: 'from-blue-500 to-blue-600'
                                    },
                                    {
                                        step: '3',
                                        title: 'Explore Visualizations',
                                        desc: 'Switch between chart and map views for different perspectives',
                                        color: 'from-purple-500 to-purple-600'
                                    },
                                    {
                                        step: '4',
                                        title: 'Review Insights',
                                        desc: 'Read AI-generated interpretations and recommendations below charts',
                                        color: 'from-orange-500 to-orange-600'
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4 bg-white rounded-xl p-4 border border-green-200 shadow-sm">
                                        <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-white font-black flex-shrink-0 shadow-md`}>
                                            {item.step}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-1 text-sm">{item.title}</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPjwvc3ZnPg==')] opacity-30"></div>
                        <div className="relative z-10">
                            <div className="text-5xl mb-5">🚀</div>
                            <h3 className="text-3xl font-black text-white mb-4 font-outfit">Ready to Dive Deep?</h3>
                            <p className="text-purple-100 text-lg mb-6 max-w-2xl mx-auto">
                                Use the configuration panel above to select your data and unlock powerful insights
                            </p>
                            <div className="flex items-center justify-center gap-2 text-white/90 text-sm font-semibold">
                                <span className="text-2xl">⬆️</span>
                                <span>Start by configuring your filters in the panel above</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* National KPI Card */}
            {selectedIndicator && (
                <section className="bg-white rounded-xl border border-gray-200 shadow-sm fade-in-up p-6 flex items-center justify-between" style={{ animationDelay: '0.15s' }}>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xl shadow-lg shadow-green-900/10">📈</div>
                            <div>
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">National Average</h3>
                                <p className="text-sm text-slate-700 font-medium">{selectedIndicator.title}</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-green-800">
                            {(() => {
                                if (selectedIndicator.val != null && String(selectedIndicator.val) !== '') return selectedIndicator.val;

                                // Fallback: Calculate from zonal data if available
                                if (selectedIndicator.zonal && selectedIndicator.zonal.length > 0) {
                                    const valid = (selectedIndicator.zonal as any[])
                                        .map((v) => (v !== null && v !== '') ? Number(v) : null)
                                        .filter((v: number | null): v is number => v !== null && !isNaN(v));

                                    if (valid.length > 0) {
                                        return (valid.reduce((a: number, b: number) => a + b, 0) / valid.length).toFixed(1);
                                    }
                                }
                                return 'N/A';
                            })()}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded">{selectedIndicator.unit || 'percentage'}</div>
                    </div>
                </section>
            )}

            {/* Visualization Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in-up" style={{ animationDelay: '0.2s' }}>

                {/* Left: Chart/Map Viewer */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[650px] flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h3 className="font-bold text-slate-800">{viewMode === 'chart' ? 'Zonal Breakdown' : 'Geographic Map'}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Visual representation across zones/states</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button onClick={() => setViewMode('chart')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewMode === 'chart' ? 'bg-white shadow-sm text-slate-700' : 'text-slate-500 hover:text-slate-700'}`}>Chart</button>
                                    <button onClick={() => setViewMode('map')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-slate-700' : 'text-slate-500 hover:text-slate-700'}`}>Map</button>
                                </div>
                                {viewMode === 'chart' && (
                                    <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="text-xs border-slate-200 rounded-md bg-white py-1.5 px-2 outline-none">
                                        <option value="bar">Bar Chart</option>
                                        <option value="line">Line Chart</option>
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 p-6 relative flex items-center justify-center">
                            {selectedIndicator ? (
                                viewMode === 'chart' ? (
                                    getChartData() ? (
                                        <div className="w-full flex flex-col h-full">
                                            {drilldownZone && (
                                                <button
                                                    onClick={() => setDrilldownZone(null)}
                                                    className="mb-4 self-start flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    <span>←</span> Back to National View
                                                </button>
                                            )}
                                            <TrendChart
                                                type={selectedIndicator.isTrend ? 'line' : (chartType as any)}
                                                data={getChartData()}
                                                height={520}
                                                onDrilldown={(zone) => {
                                                    if (!selectedIndicator.isTrend && !drilldownZone) {
                                                        setDrilldownZone(zone);
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">No chart data available</div>
                                    )
                                ) : (
                                    // Render Leaflet Map
                                    selectedIndicator.zonal && selectedIndicator.zonal.length > 0 ? (
                                        <LeafletMap zonalData={selectedIndicator.zonal} unit={selectedIndicator.unit} />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <p>No zonal data available for map</p>
                                        </div>
                                    )
                                )
                            ) : (
                                <div className="text-center text-gray-400">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔍</div>
                                    <p>Select variables above to view data</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Interpretation Section */}
                    {selectedIndicator && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-blue-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-xl">💡</div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Data Interpretation & Insights</h3>
                                        <p className="text-blue-100 text-xs mt-0.5">Detailed analysis of {selectedIndicator.title}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {(() => {
                                    const rawZonal = selectedIndicator.zonal || [];
                                    const hasZonalData = rawZonal.length > 0;


                                    // National Only View
                                    if (!hasZonalData) {
                                        return (
                                            <div className="bg-white rounded-lg p-4 border border-blue-100">
                                                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                                                    <span className="text-blue-600">📊</span> National Overview
                                                </h4>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    The national average for <strong className="text-blue-600">{selectedIndicator.title}</strong> stands at <strong className="text-green-600">{selectedIndicator.val}{['percent', 'percentage'].includes(selectedIndicator.unit || '') ? '%' : ''}</strong> as of {selectedYear}.
                                                    <br /><br />
                                                    Detailed zonal or state-level breakdowns are not available for this specific indicator in the current dataset. The figure represents the aggregated national statistic.
                                                </p>
                                            </div>
                                        );
                                    }

                                    // Existing Zonal Logic
                                    // Coerce string inputs to numbers
                                    const zonalData = (rawZonal as any[]).map((v) => (v !== null && v !== undefined && v !== '') ? Number(v) : null);
                                    const zones = ['North Central', 'North East', 'North West', 'South East', 'South South', 'South West'];

                                    // Filter for valid numbers
                                    const validData = zonalData.filter((v: number | null): v is number => v !== null && !isNaN(v));

                                    // If no valid data, do not render analysis
                                    if (validData.length === 0) return null;

                                    const maxValue = Math.max(...validData);
                                    const minValue = Math.min(...validData);
                                    const avgValue = validData.reduce((a: number, b: number) => a + b, 0) / validData.length;

                                    // Safely get zones
                                    const maxIndex = zonalData.findIndex((v: number | null) => v !== null && Math.abs(v - maxValue) < 0.0001);
                                    const minIndex = zonalData.findIndex((v: number | null) => v !== null && Math.abs(v - minValue) < 0.0001);
                                    const maxZone = maxIndex !== -1 ? zones[maxIndex] : 'Unknown Zone';
                                    const minZone = minIndex !== -1 ? zones[minIndex] : 'Unknown Zone';

                                    // Safely calculate national avg
                                    const nationalVal = selectedIndicator.val != null ? Number(selectedIndicator.val) : null;
                                    const nationalAvg = (nationalVal != null && !isNaN(nationalVal)) ? nationalVal : avgValue.toFixed(1);

                                    // Calculate regional patterns safely
                                    const northernZones = zonalData.slice(0, 3).filter((v: number | null): v is number => v !== null);
                                    const southernZones = zonalData.slice(3, 6).filter((v: number | null): v is number => v !== null);

                                    const northAvg = northernZones.length > 0 ? northernZones.reduce((a: number, b: number) => a + b, 0) / northernZones.length : 0;
                                    const southAvg = southernZones.length > 0 ? southernZones.reduce((a: number, b: number) => a + b, 0) / southernZones.length : 0;

                                    const northSouthDiff = Math.abs(southAvg - northAvg);
                                    const hasRegionalData = northernZones.length > 0 && southernZones.length > 0;

                                    return (
                                        <>
                                            {/* Overview */}
                                            <div className="bg-white rounded-lg p-4 border border-blue-100">
                                                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                                                    <span className="text-blue-600">📊</span> Overview
                                                </h4>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    The national average for <strong className="text-blue-600">{selectedIndicator.title}</strong> stands at <strong className="text-green-600">{nationalAvg}{['percent', 'percentage'].includes(selectedIndicator.unit || '') ? '%' : ''}</strong> as of {selectedYear}.
                                                    This indicator shows significant regional variation, with values ranging from <strong className="text-orange-600">{minValue.toFixed(1)}{['percent', 'percentage'].includes(selectedIndicator.unit || '') ? '%' : ''}</strong> in {minZone} to <strong className="text-green-600">{maxValue.toFixed(1)}{['percent', 'percentage'].includes(selectedIndicator.unit || '') ? '%' : ''}</strong> in {maxZone},
                                                    representing a difference of <strong>{(maxValue - minValue).toFixed(1)} percentage points</strong>.
                                                </p>
                                            </div>

                                            {/* Regional Analysis */}
                                            <div className="bg-white rounded-lg p-4 border border-blue-100">
                                                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                                                    <span className="text-blue-600">🗺️</span> Regional Patterns
                                                </h4>
                                                <div className="space-y-3">
                                                    {hasRegionalData && (
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                                                            <p className="text-sm text-slate-700 leading-relaxed">
                                                                <strong>North-South Divide:</strong> The southern zones average <strong className={southAvg > northAvg ? 'text-green-600' : 'text-orange-600'}>{southAvg.toFixed(1)}%</strong> while northern zones average <strong className={northAvg > southAvg ? 'text-green-600' : 'text-orange-600'}>{northAvg.toFixed(1)}%</strong>,
                                                                indicating {northSouthDiff > 5 ? 'a substantial' : 'a moderate'} {southAvg > northAvg ? 'advantage for the South' : 'advantage for the North'} ({northSouthDiff.toFixed(1)} percentage point difference).
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                                                        <p className="text-sm text-slate-700 leading-relaxed">
                                                            <strong>Top Performer:</strong> {maxZone} leads with {maxValue.toFixed(1)}%, performing {avgValue > 0 ? ((maxValue / avgValue - 1) * 100).toFixed(1) : '0'}% above the national average,
                                                            suggesting effective {selectedIndicator.title.toLowerCase().includes('health') ? 'health interventions and service delivery' : selectedIndicator.title.toLowerCase().includes('education') ? 'educational programs and access' : 'program implementation'} in this region.
                                                        </p>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                                                        <p className="text-sm text-slate-700 leading-relaxed">
                                                            <strong>Area of Concern:</strong> {minZone} shows the lowest rate at {minValue.toFixed(1)}%, falling {avgValue > 0 ? ((1 - minValue / avgValue) * 100).toFixed(1) : '0'}% below the national average.
                                                            This gap highlights the need for targeted interventions and resource allocation to improve {selectedIndicator.title.toLowerCase()} in this zone.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Comparison Insights - Show only when comparison is active */}
                                            {showComparison && compIndicator && compIndicator.zonal && (
                                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                                                    <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                                                        <span className="text-purple-600">🔄</span> Comparative Analysis ({selectedYear} vs {compYear})
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {zones.map((zone, idx) => {
                                                            const current = zonalData[idx];
                                                            const rawPrev = compIndicator.zonal![idx];
                                                            const previous = rawPrev != null ? Number(rawPrev) : null;
                                                            if (current == null || previous == null) return null;
                                                            const change = current - previous;
                                                            const percentChange = previous !== 0 ? ((change / previous) * 100) : 0;
                                                            return (
                                                                <div key={zone} className="flex items-center justify-between text-xs bg-white rounded px-3 py-2 border border-purple-100">
                                                                    <span className="font-medium text-slate-700">{zone}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-slate-500">{previous.toFixed(1)}% → {current.toFixed(1)}%</span>
                                                                        <span className={`font-bold ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                                                            {change > 0 ? '↑' : change < 0 ? '↓' : '→'} {Math.abs(percentChange).toFixed(1)}%
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Key Takeaways */}
                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                                                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                                                    <span className="text-green-600">✓</span> Key Takeaways & Recommendations
                                                </h4>
                                                <ul className="space-y-2 text-sm text-slate-700">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-green-600 font-black mt-0.5">•</span>
                                                        <span>Regional disparities of {(maxValue - minValue).toFixed(1)} percentage points indicate the need for zone-specific strategies rather than one-size-fits-all approaches.</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-green-600 font-black mt-0.5">•</span>
                                                        <span>Best practices from {maxZone} should be documented and adapted for implementation in lower-performing zones, particularly {minZone}.</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-green-600 font-black mt-0.5">•</span>
                                                        <span>Priority interventions should target zones performing below the national average ({avgValue.toFixed(1)}%) to achieve equitable outcomes across all regions.</span>
                                                    </li>
                                                    {showComparison && compIndicator && (
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-green-600 font-black mt-0.5">•</span>
                                                            <span>Year-over-year changes suggest {zonalData.filter((v: number | null, i: number) => v !== null && v > (Number(compIndicator.zonal![i]) || 0)).length > 3 ? 'positive momentum' : 'mixed progress'}, requiring sustained efforts and monitoring.</span>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div >
                    )
                    }
                </div >

                {/* Right: Data Table */}
                < div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[500px] overflow-hidden" >
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/30">
                        <h3 className="font-bold text-slate-800 text-sm">Data Table</h3>
                        <select className="text-xs border-slate-200 rounded bg-white py-1 px-2"><option>All Zones</option></select>
                    </div>

                    <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-gray-200">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Zone</th>
                                    <th className="px-6 py-3 font-medium text-right text-green-700">Val (A)</th>
                                    {showComparison && <th className="px-6 py-3 font-medium text-right text-blue-700">Val (B)</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {selectedIndicator && selectedIndicator.zonal && selectedIndicator.zonal.length > 0 ? (
                                    ['North Central', 'North East', 'North West', 'South East', 'South South', 'South West'].map((zone, idx) => (
                                        <tr key={zone} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3 font-medium text-slate-700">{zone}</td>
                                            <td className="px-6 py-3 text-right text-slate-600">
                                                {selectedIndicator.zonal![idx] != null ? `${selectedIndicator.zonal![idx]}%` : '-'}
                                            </td>
                                            {showComparison && (
                                                <td className="px-6 py-3 text-right text-blue-600 font-medium">
                                                    {compIndicator && compIndicator.zonal && compIndicator.zonal[idx] != null ? `${compIndicator.zonal[idx]}%` : '-'}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    selectedIndicator && selectedIndicator.val != null ? (
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3 font-medium text-slate-700">National Average</td>
                                            <td className="px-6 py-3 text-right text-slate-600">
                                                {selectedIndicator.val}%
                                            </td>
                                            {showComparison && <td className="px-6 py-3 text-right text-blue-600 font-medium">-</td>}
                                        </tr>
                                    ) : (
                                        <tr><td colSpan={showComparison ? 3 : 2} className="px-6 py-8 text-center text-gray-400 text-xs">No data available for table</td></tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div >
            </section >
        </div >
    );
}
