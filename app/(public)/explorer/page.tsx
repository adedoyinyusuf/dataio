'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Module, Indicator, SurveyData } from '@/lib/services/database';
import TrendChart from '@/components/features/TrendChart';
import SurveyOverview from '@/components/features/SurveyOverview';
import DynamicIcon from '@/components/ui/DynamicIcon';
import StatsCarousel from '@/components/features/StatsCarousel';

export default function ExplorerPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [loadingModules, setLoadingModules] = useState(true);

    // Data State
    const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
    const [loadingData, setLoadingData] = useState(false);
    const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
    const [viewMode, setViewMode] = useState<'default' | 'regional'>('default');
    const [currentYear, setCurrentYear] = useState("2024");
    const [drilldownZone, setDrilldownZone] = useState<string | null>(null);

    // Fetch Modules
    useEffect(() => {
        async function fetchModules() {
            try {
                const res = await fetch('/api/modules');
                const json = await res.json();
                if (json.success) {
                    setModules(json.data);
                }
            } catch (err) {
                console.error('Failed to fetch modules', err);
            } finally {
                setLoadingModules(false);
            }
        }
        fetchModules();
    }, []);

    // Fetch Survey Data when Module Changes
    useEffect(() => {
        if (!selectedModule) {
            setSurveyData(null);
            return;
        }

        async function fetchData() {
            setLoadingData(true);
            try {
                console.log(`Fetching indicators for module: ${selectedModule}, year: ${currentYear}`);
                const res = await fetch(`/api/indicators/${selectedModule}/${currentYear}`);
                const json = await res.json();
                console.log('API Response:', json);

                if (json.success && json.data) {
                    setSurveyData(json.data);
                } else {
                    console.error('No data found or request failed:', json);
                    setSurveyData(null);
                }
            } catch (error) {
                console.error('Failed to fetch survey data', error);
                setSurveyData(null);
            } finally {
                setLoadingData(false);
            }
        }

        fetchData();
    }, [selectedModule, currentYear]);

    // Reset view mode when indicator changes
    useEffect(() => {
        setViewMode('default');
        setDrilldownZone(null);
    }, [selectedIndicator]);

    const handleModuleSelect = (moduleId: string) => {
        setSelectedModule(moduleId);
        setSelectedIndicator(null);

        // Automatically set the year to the first available year for this module
        const module = modules.find(m => m.id === moduleId);
        if (module && module.yearsAvailable && module.yearsAvailable.length > 0) {
            const firstYear = module.yearsAvailable[0]; // Years are already sorted DESC
            console.log(`Setting year to ${firstYear} for module ${moduleId}`);
            setCurrentYear(firstYear);
        } else {
            // Fallback to 2024 if no years available
            setCurrentYear("2024");
        }
    };

    const handleYearChange = (year: string) => {
        setCurrentYear(year);
        setSelectedIndicator(null);
    };

    // Get available years for the selected module
    const currentModule = modules.find(m => m.id === selectedModule);
    const yearsAvailable = currentModule?.yearsAvailable || [currentYear];

    const handleDrilldown = (zoneName: string) => {
        console.log(`Drilldown clicked for zone: ${zoneName}`);
        setDrilldownZone(zoneName);
    };

    // Get state data for a specific zone
    const getStateDataForZone = (zoneName: string, stateData: Record<string, number> | null) => {
        if (!stateData) return null;

        const zoneStateMapping: Record<string, string[]> = {
            'North Central': ['Benue', 'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Plateau', 'FCT'],
            'North East': ['Adamawa', 'Bauchi', 'Borno', 'Gombe', 'Taraba', 'Yobe'],
            'North West': ['Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Sokoto', 'Zamfara'],
            'South East': ['Abia', 'Anambra', 'Ebonyi', 'Enugu', 'Imo'],
            'South South': ['Akwa Ibom', 'Bayelsa', 'Cross River', 'Delta', 'Edo', 'Rivers'],
            'South West': ['Ekiti', 'Lagos', 'Ogun', 'Ondo', 'Osun', 'Oyo']
        };

        const states = zoneStateMapping[zoneName] || [];
        const filtered: Record<string, number> = {};

        states.forEach(state => {
            if (stateData[state] !== undefined) {
                filtered[state] = stateData[state];
            }
        });

        return Object.keys(filtered).length > 0 ? filtered : null;
    };

    const getChartData = (ind: Indicator) => {
        if (ind.isTrend && ind.labels && ind.datasets) {
            return {
                labels: ind.labels,
                datasets: ind.datasets.map(ds => ({
                    ...ds,
                    borderColor: ds.borderColor || '#16a34a',
                    backgroundColor: ind.labels?.some(l => isNaN(Number(l))) ? '#16a34a' : (ds.backgroundColor || '#16a34a'),
                    tension: 0.3,
                    // If categorical, ensure it's treated like a bar dataset props if needed
                    borderWidth: ind.labels?.some(l => isNaN(Number(l))) ? 0 : 2,
                    borderRadius: ind.labels?.some(l => isNaN(Number(l))) ? 4 : 0
                }))
            };
        }

        // Handle Zonal Data (if exists and has values)
        if (ind.zonal && ind.zonal.length > 0) {
            return {
                labels: ['North Central', 'North East', 'North West', 'South East', 'South South', 'South West'],
                datasets: [{
                    label: ind.title,
                    data: ind.zonal,
                    backgroundColor: [
                        '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a'
                    ],
                    borderWidth: 0,
                    borderRadius: 4
                }]
            };
        }

        // Handle National Only Data
        if (ind.val != null) {
            return {
                labels: ['National Average'],
                datasets: [{
                    label: ind.title,
                    data: [ind.val],
                    backgroundColor: ['#16a34a'],
                    borderWidth: 0,
                    borderRadius: 4,
                    barThickness: 50 // Make the single bar look better
                }]
            };
        }

        return null;
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[700px] fade-in-up" style={{ animationDelay: '0.1s' }}>

            {selectedModule && (
                <Sidebar
                    selectedModuleId={selectedModule}
                    selectedYear={currentYear}
                    yearsAvailable={yearsAvailable}
                    onSelectYear={handleYearChange}
                    indicators={surveyData?.indicators || null}
                    loading={loadingData}
                    onSelectIndicator={(cat, key, ind) => setSelectedIndicator(ind)}
                />
            )}

            <div className="flex-grow flex flex-col gap-6">

                {/* Module Selection */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loadingModules ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl an imate-pulse"></div>
                        ))
                    ) : (
                        modules.map(mod => (
                            <div
                                key={mod.id}
                                onClick={() => handleModuleSelect(mod.id)}
                                className={`
                            border rounded-xl p-6 transition-all cursor-pointer group relative overflow-hidden
                            ${selectedModule === mod.id
                                        ? 'bg-white border-green-600 shadow-md ring-1 ring-green-600'
                                        : 'bg-white border-gray-200 hover:shadow-lg hover:-translate-y-1'
                                    }
                        `}
                            >
                                {selectedModule === mod.id && (
                                    <div className="absolute top-0 left-0 w-1 h-full bg-green-600"></div>
                                )}
                                <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110
                            ${selectedModule === mod.id ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'}
                        `}>
                                    <DynamicIcon
                                        iconName={mod.icon}
                                        className="text-2xl"
                                    />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">{mod.name}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2">{mod.description}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Dashboard Content */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 min-h-[500px] flex flex-col">
                    {!selectedModule ? (
                        <div className="overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar">
                            {/* Hero Section */}
                            {/* Hero Section */}
                            <StatsCarousel />

                            {/* Features Grid */}
                            <div className="grid md:grid-cols-3 gap-6 mb-10">
                                {[
                                    {
                                        icon: '🔍',
                                        title: 'Browse Indicators',
                                        description: 'Explore hundreds of health and demographic indicators organized by categories.',
                                        color: 'from-blue-500 to-blue-600'
                                    },
                                    {
                                        icon: '📈',
                                        title: 'Interactive Charts',
                                        description: 'Visualize data with dynamic bar charts, line graphs, and regional breakdowns.',
                                        color: 'from-green-500 to-green-600'
                                    },
                                    {
                                        icon: '🎯',
                                        title: 'Quick Insights',
                                        description: 'Get instant access to national averages, trends, and key statistics.',
                                        color: 'from-purple-500 to-purple-600'
                                    }
                                ].map((feature, idx) => (
                                    <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all group">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Start Guide */}
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-8 border border-indigo-200 mb-10">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
                                        🚀
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Start Guide</h3>
                                        <p className="text-sm text-gray-700">Follow these simple steps to explore the data</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { step: '1', title: 'Select a Module', desc: 'Click any module card above (e.g., Nigeria DHS, Fertility, Health)' },
                                        { step: '2', title: 'Choose an Indicator', desc: 'Browse categories in the sidebar and select an indicator to analyze' },
                                        { step: '3', title: 'Explore Visualizations', desc: 'View charts, regional breakdowns, and detailed statistics' }
                                    ].map((item) => (
                                        <div key={item.step} className="flex items-start gap-4 bg-white rounded-lg p-4 border border-indigo-100">
                                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                                                {item.step}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                                <p className="text-sm text-gray-600">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Available Modules Preview */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Available Modules</h3>
                                        <p className="text-sm text-gray-600 mt-1">{modules.length} data modules ready to explore</p>
                                    </div>
                                    <div className="text-3xl">📚</div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {modules.slice(0, 6).map((mod) => (
                                        <div key={mod.id} onClick={() => handleModuleSelect(mod.id)} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-all group">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
                                                <DynamicIcon iconName={mod.icon} className="text-lg" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm truncate">{mod.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{currentYear} Data</p>
                                            </div>
                                            <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                        </div>
                                    ))}
                                </div>
                                {modules.length > 6 && (
                                    <p className="text-center text-sm text-gray-500 mt-4">+ {modules.length - 6} more modules available above</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="fade-in-up">
                            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{modules.find(m => m.id === selectedModule)?.name}</h2>
                                    <p className="text-sm text-gray-500">{currentYear} Dashboard</p>
                                </div>
                            </div>

                            {!selectedIndicator ? (
                                <>
                                    {surveyData ? (
                                        selectedModule === 'ndhs' ? (
                                            // Special NDHS Module Landing Page
                                            <div className="space-y-8">
                                                {/* Hero Section with Report Cover */}
                                                <div className="grid lg:grid-cols-2 gap-8">
                                                    {/* Report Cover */}
                                                    <div className="relative group">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                                        <div className="relative bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all">
                                                            <img
                                                                src="/assets/images/ndhs-2024-cover.png"
                                                                alt="NDHS 2024 Report Cover"
                                                                className="w-full h-auto rounded-lg shadow-lg"
                                                            />
                                                            <div className="mt-6 text-center">
                                                                <h3 className="text-xl font-bold text-gray-900 mb-2">Nigeria Demographic and Health Survey</h3>
                                                                <p className="text-sm text-gray-600 mb-4">2023-24 Final Report</p>
                                                                <button className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold text-sm hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto">
                                                                    <span>📄</span> View Full Report
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Survey Overview */}
                                                    <div className="space-y-6">
                                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                                                            <div className="flex items-start gap-4 mb-4">
                                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                                                                    📚
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-xl font-black text-gray-900 mb-1">About the Survey</h3>
                                                                    <p className="text-sm text-gray-600">Comprehensive national health survey</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                                                The 2023-24 Nigeria Demographic and Health Survey (NDHS) is a comprehensive national survey that provides up-to-date information on population and health indicators in Nigeria.
                                                            </p>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="bg-white rounded-lg p-3 border border-blue-200">
                                                                    <p className="text-xs text-gray-600 mb-1">Survey Period</p>
                                                                    <p className="font-bold text-gray-900">2023-2024</p>
                                                                </div>
                                                                <div className="bg-white rounded-lg p-3 border border-blue-200">
                                                                    <p className="text-xs text-gray-600 mb-1">Coverage</p>
                                                                    <p className="font-bold text-gray-900">Nationwide</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                                            <div className="flex items-start gap-4 mb-4">
                                                                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                                                                    🎯
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-xl font-black text-gray-900 mb-1">Key Focus Areas</h3>
                                                                    <p className="text-sm text-gray-600">Main survey topics</p>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {[
                                                                    { icon: '👶', text: 'Fertility' },
                                                                    { icon: '👨‍👩‍👧‍👦', text: 'Family Planning' },
                                                                    { icon: '🏥', text: 'Maternal Health' },
                                                                    { icon: '👧', text: 'Child Health' },
                                                                    { icon: '💊', text: 'Immunization' },
                                                                    { icon: '🎗️', text: 'HIV/AIDS' }
                                                                ].map((item, idx) => (
                                                                    <div key={idx} className="flex items-center gap-2 bg-white rounded-lg p-2 border border-green-200">
                                                                        <span className="text-lg">{item.icon}</span>
                                                                        <span className="text-xs font-semibold text-gray-700">{item.text}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Demographics Stats Cards */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div>
                                                            <h3 className="text-2xl font-bold text-gray-900">Key Demographics</h3>
                                                            <p className="text-sm text-gray-600 mt-1">Population statistics from NDHS 2023-24</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                        {[
                                                            {
                                                                icon: '👥',
                                                                label: 'Households Surveyed',
                                                                value: '40,600+',
                                                                subtitle: 'Nationally representative',
                                                                color: 'from-blue-500 to-blue-600',
                                                                bgColor: 'from-blue-50 to-cyan-50'
                                                            },
                                                            {
                                                                icon: '👩',
                                                                label: 'Women Interviewed',
                                                                value: '41,000+',
                                                                subtitle: 'Age 15-49 years',
                                                                color: 'from-pink-500 to-rose-600',
                                                                bgColor: 'from-pink-50 to-rose-50'
                                                            },
                                                            {
                                                                icon: '👨',
                                                                label: 'Men Interviewed',
                                                                value: '13,400+',
                                                                subtitle: 'Age 15-59 years',
                                                                color: 'from-indigo-500 to-purple-600',
                                                                bgColor: 'from-indigo-50 to-purple-50'
                                                            },
                                                            {
                                                                icon: '📍',
                                                                label: 'States Covered',
                                                                value: '37',
                                                                subtitle: 'All states + FCT',
                                                                color: 'from-green-500 to-emerald-600',
                                                                bgColor: 'from-green-50 to-emerald-50'
                                                            }
                                                        ].map((stat, idx) => (
                                                            <div key={idx} className={`bg-gradient-to-br ${stat.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all group hover:-translate-y-1`} style={{ animationDelay: `${idx * 0.1}s` }}>
                                                                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                                                    {stat.icon}
                                                                </div>
                                                                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                                                                <div className="text-sm font-bold text-gray-700 mb-1">{stat.label}</div>
                                                                <div className="text-xs text-gray-600">{stat.subtitle}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Quick Navigation */}
                                                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPjwvc3ZnPg==')] opacity-30"></div>
                                                    <div className="relative z-10 text-center">
                                                        <div className="text-4xl mb-4">🔍</div>
                                                        <h3 className="text-2xl font-bold text-white mb-3">Start Exploring Data</h3>
                                                        <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                                                            Browse through categories in the sidebar to explore specific health and demographic indicators from the NDHS 2023-24 survey.
                                                        </p>
                                                        <div className="flex items-center justify-center gap-2 text-white/90 text-sm font-semibold">
                                                            <span className="text-xl">👈</span>
                                                            <span>Select a category from the sidebar to begin</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : selectedModule === 'nmis' ? (
                                            // Special NMIS Module Landing Page
                                            <div className="space-y-8">
                                                {/* Hero Section with Report Cover */}
                                                <div className="grid lg:grid-cols-2 gap-8">
                                                    {/* Report Cover */}
                                                    <div className="relative group">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                                        <div className="relative bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all">
                                                            <img
                                                                src="/assets/images/nmis-2021-cover.png"
                                                                alt="NMIS 2021 Report Cover"
                                                                className="w-full h-auto rounded-lg shadow-lg"
                                                            />
                                                            <div className="mt-6 text-center">
                                                                <h3 className="text-xl font-bold text-gray-900 mb-2">Nigeria Malaria Indicator Survey</h3>
                                                                <p className="text-sm text-gray-600 mb-4">2021 Final Report</p>
                                                                <button className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold text-sm hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto">
                                                                    <span>📄</span> View Full Report
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Survey Overview */}
                                                    <div className="space-y-6">
                                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                                            <div className="flex items-start gap-4 mb-4">
                                                                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                                                                    🦟
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-xl font-black text-gray-900 mb-1">About the Survey</h3>
                                                                    <p className="text-sm text-gray-600">National malaria indicators assessment</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                                                The 2021 Nigeria Malaria Indicator Survey (NMIS) provides comprehensive data on malaria prevention, treatment, and control efforts across Nigeria.
                                                            </p>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="bg-white rounded-lg p-3 border border-green-200">
                                                                    <p className="text-xs text-gray-600 mb-1">Survey Period</p>
                                                                    <p className="font-bold text-gray-900">2021</p>
                                                                </div>
                                                                <div className="bg-white rounded-lg p-3 border border-green-200">
                                                                    <p className="text-xs text-gray-600 mb-1">Coverage</p>
                                                                    <p className="font-bold text-gray-900">Nationwide</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                                                            <div className="flex items-start gap-4 mb-4">
                                                                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                                                                    🎯
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-xl font-black text-gray-900 mb-1">Key Focus Areas</h3>
                                                                    <p className="text-sm text-gray-600">Main survey topics</p>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {[
                                                                    { icon: '🛏️', text: 'ITN Coverage' },
                                                                    { icon: '💊', text: 'Treatment Seeking' },
                                                                    { icon: '🔬', text: 'Parasitemia' },
                                                                    { icon: '👶', text: 'Child Anemia' },
                                                                    { icon: '🏥', text: 'IRS Coverage' },
                                                                    { icon: '💉', text: 'IPT in Pregnancy' }
                                                                ].map((item, idx) => (
                                                                    <div key={idx} className="flex items-center gap-2 bg-white rounded-lg p-2 border border-orange-200">
                                                                        <span className="text-lg">{item.icon}</span>
                                                                        <span className="text-xs font-semibold text-gray-700">{item.text}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Demographics Stats Cards */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div>
                                                            <h3 className="text-2xl font-bold text-gray-900">Survey Statistics</h3>
                                                            <p className="text-sm text-gray-600 mt-1">Sample size from NMIS 2021</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                        {[
                                                            {
                                                                icon: '👥',
                                                                label: 'Households Surveyed',
                                                                value: '7,700+',
                                                                subtitle: 'Nationally representative',
                                                                color: 'from-green-500 to-green-600',
                                                                bgColor: 'from-green-50 to-emerald-50'
                                                            },
                                                            {
                                                                icon: '👩',
                                                                label: 'Women Interviewed',
                                                                value: '8,400+',
                                                                subtitle: 'Age 15-49 years',
                                                                color: 'from-orange-500 to-red-600',
                                                                bgColor: 'from-orange-50 to-red-50'
                                                            },
                                                            {
                                                                icon: '👶',
                                                                label: 'Children Tested',
                                                                value: '8,000+',
                                                                subtitle: 'Age 6-59 months',
                                                                color: 'from-blue-500 to-cyan-600',
                                                                bgColor: 'from-blue-50 to-cyan-50'
                                                            },
                                                            {
                                                                icon: '📍',
                                                                label: 'States Covered',
                                                                value: '37',
                                                                subtitle: 'All states + FCT',
                                                                color: 'from-purple-500 to-purple-600',
                                                                bgColor: 'from-purple-50 to-pink-50'
                                                            }
                                                        ].map((stat, idx) => (
                                                            <div key={idx} className={`bg-gradient-to-br ${stat.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all group hover:-translate-y-1`} style={{ animationDelay: `${idx * 0.1}s` }}>
                                                                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                                                    {stat.icon}
                                                                </div>
                                                                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                                                                <div className="text-sm font-bold text-gray-700 mb-1">{stat.label}</div>
                                                                <div className="text-xs text-gray-600">{stat.subtitle}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Quick Navigation */}
                                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPjwvc3ZnPg==')] opacity-30"></div>
                                                    <div className="relative z-10 text-center">
                                                        <div className="text-4xl mb-4">🔍</div>
                                                        <h3 className="text-2xl font-black text-white mb-3 font-outfit">Start Exploring Malaria Data</h3>
                                                        <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                                                            Browse through categories in the sidebar to explore malaria indicators, ITN coverage, treatment seeking behavior, and more from the NMIS 2021 survey.
                                                        </p>
                                                        <div className="flex items-center justify-center gap-2 text-white/90 text-sm font-semibold">
                                                            <span className="text-xl">👈</span>
                                                            <span>Select a category from the sidebar to begin</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // Default SurveyOverview for other modules
                                            <SurveyOverview
                                                data={surveyData}
                                                year={currentYear}
                                                moduleId={selectedModule}
                                            />
                                        )
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">Loading module statistics...</div>
                                    )}
                                </>
                            ) : (
                                <div className="fade-in-up space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedIndicator.title}</h2>
                                            <p className="text-gray-500 mt-1">{selectedIndicator.desc || selectedIndicator.context}</p>
                                        </div>
                                        <div className="text-right">
                                            {!selectedIndicator.labels?.some((l: string) => isNaN(Number(l))) && (
                                                <>
                                                    <div className="text-3xl font-bold text-green-600">
                                                        {selectedIndicator.val ? `${selectedIndicator.val}${selectedIndicator.unit || '%'}` : 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-gray-400 uppercase font-semibold mt-1">National Average</div>
                                                </>
                                            )}
                                            {selectedIndicator.labels?.some((l: string) => isNaN(Number(l))) && (
                                                <div className="text-3xl font-bold text-green-600">
                                                    Distribution
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2 border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                                    {drilldownZone ? `${drilldownZone} States` :
                                                        (viewMode === 'regional' ? 'Regional Breakdown' :
                                                            (selectedIndicator.isTrend ? (selectedIndicator.labels?.some((l: string) => isNaN(Number(l))) ? 'Distribution Analysis' : 'Trend Analysis') :
                                                                (selectedIndicator.zonal && selectedIndicator.zonal.length > 0) ? 'Regional Breakdown' : 'National Overview'))}
                                                </h3>
                                                <div className="flex gap-2">
                                                    {selectedIndicator.isTrend && selectedIndicator.zonal && selectedIndicator.zonal.length > 0 && !drilldownZone && (
                                                        <button
                                                            onClick={() => setViewMode(prev => prev === 'default' ? 'regional' : 'default')}
                                                            className="text-xs font-semibold px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                                                        >
                                                            {viewMode === 'default' ? '🌍 View Regional Breakdown' : '📊 View Distribution'}
                                                        </button>
                                                    )}
                                                    {drilldownZone && (
                                                        <button
                                                            onClick={() => setDrilldownZone(null)}
                                                            className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                                        >
                                                            ← Back to National
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {getChartData(selectedIndicator) ? (
                                                <>
                                                    {drilldownZone && selectedIndicator.stateData ? (
                                                        // Show state chart for drilldown
                                                        (() => {
                                                            const zoneStates = getStateDataForZone(drilldownZone, selectedIndicator.stateData);
                                                            if (!zoneStates) {
                                                                return <div className="h-[300px] flex items-center justify-center text-gray-400">No state data available for this zone.</div>;
                                                            }
                                                            const stateChartData = {
                                                                labels: Object.keys(zoneStates),
                                                                datasets: [{
                                                                    label: selectedIndicator.title,
                                                                    data: Object.values(zoneStates),
                                                                    backgroundColor: [
                                                                        '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'
                                                                    ],
                                                                    borderWidth: 0,
                                                                    borderRadius: 4
                                                                }]
                                                            };
                                                            return <TrendChart type="bar" data={stateChartData} height={300} />;
                                                        })()
                                                    ) : viewMode === 'regional' && selectedIndicator.zonal && selectedIndicator.zonal.length > 0 ? (
                                                        // Show forced zonal chart for trends toggled to regional view
                                                        <TrendChart
                                                            type="bar"
                                                            data={{
                                                                labels: ['North Central', 'North East', 'North West', 'South East', 'South South', 'South West'],
                                                                datasets: [{
                                                                    label: 'Regional Breakdown',
                                                                    data: selectedIndicator.zonal,
                                                                    backgroundColor: ['#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534'],
                                                                    borderWidth: 0,
                                                                    borderRadius: 4
                                                                }]
                                                            }}
                                                            height={300}
                                                            onDrilldown={selectedIndicator.stateData ? handleDrilldown : undefined}
                                                        />
                                                    ) : (
                                                        // Show main chart (Trend or Default Zonal)
                                                        <TrendChart
                                                            type={selectedIndicator.isTrend && !selectedIndicator.labels?.some((l: string) => isNaN(Number(l))) ? 'line' : 'bar'}
                                                            data={getChartData(selectedIndicator)}
                                                            height={300}
                                                            onDrilldown={!selectedIndicator.isTrend && selectedIndicator.stateData ? handleDrilldown : undefined}
                                                        />
                                                    )}

                                                    {/* Data Interpretation */}
                                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                        <h4 className="flex items-center gap-2 text-blue-800 font-bold mb-2 text-sm">
                                                            <span>💡</span> Data Interpretation
                                                        </h4>
                                                        <div className="text-sm text-blue-900 space-y-2 leading-relaxed">
                                                            {drilldownZone && selectedIndicator.stateData ? (
                                                                // Interpretation for state drilldown
                                                                (() => {
                                                                    const zoneStates = getStateDataForZone(drilldownZone, selectedIndicator.stateData);
                                                                    if (!zoneStates) return null;
                                                                    const values = Object.values(zoneStates);
                                                                    const states = Object.keys(zoneStates);
                                                                    const maxValue = Math.max(...values);
                                                                    const minValue = Math.min(...values);
                                                                    const avgValue = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
                                                                    const maxState = states[values.indexOf(maxValue)];
                                                                    const minState = states[values.indexOf(minValue)];

                                                                    return (
                                                                        <>
                                                                            <p>
                                                                                <strong>State-level analysis for {drilldownZone}:</strong> Among the {states.length} states in this zone,
                                                                                <strong className="text-green-700"> {maxState}</strong> shows the highest value at <strong>{maxValue}{selectedIndicator.unit || '%'}</strong>,
                                                                                while <strong className="text-orange-700">{minState}</strong> has the lowest at <strong>{minValue}{selectedIndicator.unit || '%'}</strong>.
                                                                            </p>
                                                                            <p>
                                                                                The average across all states in {drilldownZone} is <strong>{avgValue}{selectedIndicator.unit || '%'}</strong>,
                                                                                with a range of <strong>{(maxValue - minValue).toFixed(1)} percentage points</strong> between states,
                                                                                indicating {maxValue - minValue > 20 ? 'significant' : 'moderate'} variation within the zone.
                                                                            </p>
                                                                        </>
                                                                    );
                                                                })()
                                                            ) : selectedIndicator.isTrend ? (
                                                                // Interpretation for trend/distribution charts
                                                                (() => {
                                                                    const isCategorical = selectedIndicator.labels?.some(l => isNaN(Number(l)));
                                                                    if (isCategorical) {
                                                                        let specificInsight: React.ReactNode = "";
                                                                        const t = selectedIndicator.title.toLowerCase();

                                                                        // Helper to get value by fuzzy label match
                                                                        const getVal = (key: string) => {
                                                                            const idx = selectedIndicator.labels?.findIndex((l: string) => l.toLowerCase().includes(key));
                                                                            if (idx !== undefined && idx !== -1 && selectedIndicator.datasets?.[0]?.data) {
                                                                                const val = selectedIndicator.datasets[0].data[idx];
                                                                                const numVal = Number(val);
                                                                                if (!isNaN(numVal)) {
                                                                                    return numVal.toFixed(1) + (selectedIndicator.unit === 'percent' || selectedIndicator.unit === '%' ? '%' : selectedIndicator.unit || '');
                                                                                }
                                                                            }
                                                                            return 'N/A';
                                                                        };

                                                                        if (t.includes('iptp uptake')) {
                                                                            const dose2 = getVal('2+');
                                                                            const dose3 = getVal('3+');
                                                                            specificInsight = <> Notice the drop-off between uptake of 2+ doses <strong className="text-green-700">({dose2})</strong> and the recommended 3+ doses <strong className="text-green-700">({dose3})</strong>, highlighting a critical gap in continuity of care.</>;
                                                                        } else if (t.includes('child disease') || t.includes('disease prevalence')) {
                                                                            const rdt = getVal('rdt');
                                                                            const micro = getVal('microscopy');
                                                                            const anaemia = getVal('anaemia');
                                                                            specificInsight = <> RDT positivity is <strong className="text-green-700">{rdt}</strong>, significantly higher than Microscopy at <strong className="text-green-700">{micro}</strong>. The high prevalence of Anaemia <strong className="text-orange-700">({anaemia})</strong> is a major co-morbidity.</>;
                                                                        } else if (t.includes('fever care')) {
                                                                            const advice = getVal('advice'); // "Sought Advice/Treatment"
                                                                            const act = getVal('act'); // "Received ACT"
                                                                            specificInsight = <> While <strong className="text-green-700">{advice}</strong> of caregivers sought advice, only <strong className="text-green-700">{act}</strong> of children received ACTs, indicating a gap in appropriate treatment access.</>;
                                                                        } else if (t.includes('population by age')) {
                                                                            specificInsight = " The chart demonstrates Nigeria's significant youth bulge, with a vast majority of the population under the age of 30, which has major implications for resource planning.";
                                                                        } else if (t.includes('household headship')) {
                                                                            const male = getVal('male headed');
                                                                            const female = getVal('female headed');
                                                                            specificInsight = <> Male-headed households account for <strong className="text-green-700">{male}</strong> compared to <strong className="text-green-700">{female}</strong> for female-headed households.</>;
                                                                        } else if (t.includes('access to utilities')) {
                                                                            const water = getVal('water');
                                                                            const sanitation = getVal('sanitation');
                                                                            specificInsight = <> Access to improved water sources is <strong className="text-green-700">{water}</strong>, while improved sanitation lags behind at <strong className="text-orange-700">{sanitation}</strong>.</>;
                                                                        }

                                                                        return (
                                                                            <p>
                                                                                This chart displays the distribution of <strong>{selectedIndicator.title}</strong>.{specificInsight}
                                                                                {!specificInsight && (selectedIndicator.analysis || " Analyze the distribution to understand the prevailing characteristics of the surveyed population.")}
                                                                            </p>
                                                                        );
                                                                    }
                                                                    return (
                                                                        <p>
                                                                            This chart shows the temporal trends for <strong>{selectedIndicator.title}</strong> across multiple survey years.
                                                                            {selectedIndicator.analysis || " Track how the indicator has evolved over time to identify patterns, improvements, or areas requiring intervention."}
                                                                        </p>
                                                                    );
                                                                })()
                                                            ) : (
                                                                // Interpretation for zonal charts
                                                                (() => {
                                                                    // Check if we actually have zonal data
                                                                    if (!selectedIndicator.zonal || selectedIndicator.zonal.length === 0) {
                                                                        // National Only Interpretation
                                                                        return (
                                                                            <>
                                                                                <p>
                                                                                    <strong>National Overview:</strong> The national average for this indicator is
                                                                                    <strong className="text-green-700"> {selectedIndicator.val}{['percent', 'percentage'].includes(selectedIndicator.unit || '') ? '%' : (selectedIndicator.unit || '')}</strong>.
                                                                                </p>
                                                                                <p className="mt-2">
                                                                                    Detailed regional breakdowns are not available for this specific indicator in the current dataset.
                                                                                    The figure represents the aggregated national statistic from the survey.
                                                                                </p>
                                                                            </>
                                                                        );
                                                                    }

                                                                    const zones = ['North Central', 'North East', 'North West', 'South East', 'South South', 'South West'];
                                                                    const validZonal = selectedIndicator.zonal.filter(v => v !== null && !isNaN(String(v) as any));

                                                                    if (validZonal.length === 0) return null;

                                                                    const maxValue = Math.max(...validZonal);
                                                                    const minValue = Math.min(...validZonal);
                                                                    const avgValue = (validZonal.reduce((a, b) => a + b, 0) / validZonal.length).toFixed(1);

                                                                    // Find indices carefully
                                                                    const maxIndex = selectedIndicator.zonal.findIndex(v => Number(v) === maxValue);
                                                                    const minIndex = selectedIndicator.zonal.findIndex(v => Number(v) === minValue);

                                                                    const maxZone = maxIndex !== -1 ? zones[maxIndex] : 'Unknown';
                                                                    const minZone = minIndex !== -1 ? zones[minIndex] : 'Unknown';

                                                                    return (
                                                                        <>
                                                                            <p>
                                                                                <strong>Regional analysis:</strong> <strong className="text-green-700">{maxZone}</strong> leads with the highest value of
                                                                                <strong> {maxValue}{selectedIndicator.unit || '%'}</strong>, while <strong className="text-orange-700">{minZone}</strong> shows
                                                                                the lowest at <strong>{minValue}{selectedIndicator.unit || '%'}</strong>.
                                                                            </p>
                                                                            <p>
                                                                                The national average is <strong>{avgValue}{selectedIndicator.unit || '%'}</strong>.
                                                                                There is a <strong>{(maxValue - minValue).toFixed(1)} percentage point</strong> gap between the highest and lowest performing zones,
                                                                                highlighting {maxValue - minValue > 30 ? 'substantial regional disparities' : 'regional variations'} that may require targeted interventions.
                                                                            </p>
                                                                            <p className="text-xs mt-2 text-blue-700">
                                                                                💡 <em>Tip: Click on any zone bar to see state-level breakdown for that zone.</em>
                                                                            </p>
                                                                        </>
                                                                    );
                                                                })()
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="h-[300px] flex items-center justify-center text-gray-400">No chart data available</div>
                                            )}
                                        </div>
                                        <div className="space-y-6">
                                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                                                <h4 className="flex items-center gap-2 text-blue-800 font-bold mb-3">
                                                    <span>💡</span> Key Insight
                                                </h4>
                                                <p className="text-blue-900 text-sm leading-relaxed">
                                                    {selectedIndicator.analysis ||
                                                        ((selectedIndicator.zonal && selectedIndicator.zonal.length > 0)
                                                            ? "Data shows significant regional variations which may require targeted interventions."
                                                            : "This indicator represents a national aggregate figure.")
                                                    }
                                                </p>
                                            </div>
                                            {selectedIndicator.zonal && selectedIndicator.zonal.length > 0 && (
                                                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                                                    <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase">Highest Region</h4>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">
                                                            {(() => {
                                                                const zones = ['North Central', 'North East', 'North West', 'South East', 'South South', 'South West'];
                                                                const validZonal = selectedIndicator.zonal?.filter(v => v !== null && !isNaN(String(v) as any)) || [];
                                                                if (validZonal.length === 0) return 'N/A';
                                                                const maxVal = Math.max(...validZonal);
                                                                const idx = selectedIndicator.zonal!.findIndex(v => Number(v) === maxVal);
                                                                return idx !== -1 ? zones[idx] : 'N/A';
                                                            })()}
                                                        </span>
                                                        <span className="font-bold text-gray-900">
                                                            {(() => {
                                                                const validZonal = selectedIndicator.zonal?.filter(v => v !== null && !isNaN(String(v) as any)) || [];
                                                                return validZonal.length > 0 ? Math.max(...validZonal) : 0;
                                                            })()}%
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
