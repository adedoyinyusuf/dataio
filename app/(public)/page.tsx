'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Module } from '@/lib/services/database';
import DynamicIcon from '@/components/ui/DynamicIcon';

export default function LandingPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [loadingModules, setLoadingModules] = useState(true);
    const [stats, setStats] = useState({
        modules: 0,
        surveys: 0,
        indicators: 0,
        dataPoints: 0
    });

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
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            const res = await fetch('/api/stats');
            const json = await res.json();
            if (json.success) {
                setStats(json.data);
            }
        } catch (err) {
            console.error('Failed to fetch stats', err);
        }
    }

    return (
        <div className="space-y-0 fade-in-up">
            {/* Hero Banner with NAIIS Image */}
            <div className="relative overflow-hidden rounded-2xl mb-12 bg-gray-900" style={{ minHeight: '500px' }}>
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{ backgroundImage: "url('/naiis-banner.png')" }}
                ></div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/70 to-transparent"></div>

                {/* Content */}
                <div className="relative z-10 px-8 md:px-16 py-16 md:py-24">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-green-600/90 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            <span className="text-white text-sm font-medium">Powered by National Population Commission</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 font-outfit leading-tight">
                            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Dataio</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-100 mb-4 leading-relaxed">
                            Nigeria's Premier Data Platform
                        </p>

                        <p className="text-lg text-gray-200 mb-10 leading-relaxed">
                            Comprehensive health, education, and demographic data from NDHS, NEDS, NAIIS, and NMIS surveys.
                            Transform complex datasets into actionable insights with powerful visualization and analysis tools.
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link href="/explorer" className="px-10 py-5 bg-green-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 hover:bg-green-700 flex items-center gap-3 shadow-xl">
                                <span className="text-2xl">🚀</span> Explore Data
                            </Link>
                            <Link href="/deepdive" className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/30 flex items-center gap-3">
                                <span className="text-2xl">📊</span> Deep Dive Analysis
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-20 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Statistics Section */}
            <div className="mb-16">
                <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 rounded-2xl p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMyIgY3k9IjMiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 font-outfit">Platform Overview</h2>
                            <p className="text-green-100 text-lg">Comprehensive Nigerian health and demographic data at your fingertips</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Data Modules', value: stats.modules, icon: '🗂️' },
                                { label: 'Surveys', value: stats.surveys, icon: '📋' },
                                { label: 'Indicators', value: stats.indicators, icon: '📊' },
                                { label: 'Data Points', value: stats.dataPoints.toLocaleString(), icon: '📈' }
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all group">
                                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
                                    <div className="text-3xl md:text-4xl font-black text-white mb-2 font-outfit">{stat.value}</div>
                                    <div className="text-green-100 text-sm font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-white text-sm font-medium">Live data from NDHS, NEDS, and NAIIS surveys</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 font-outfit">Powerful Features</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">Dataio provides comprehensive tools for data exploration, visualization, and analysis</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            icon: '🔍',
                            title: 'Interactive Data Explorer',
                            description: 'Navigate through comprehensive health and demographic indicators with intuitive filters and search capabilities.',
                            gradient: 'from-blue-50 to-cyan-50',
                            iconBg: 'from-blue-500 to-cyan-600',
                            link: '/explorer'
                        },
                        {
                            icon: '📊',
                            title: 'Advanced Visualizations',
                            description: 'Transform data into stunning charts, graphs, and maps for better understanding and presentation.',
                            gradient: 'from-green-50 to-emerald-50',
                            iconBg: 'from-green-500 to-emerald-600',
                            link: '/explorer'
                        },
                        {
                            icon: '🎯',
                            title: 'Deep Dive Analysis',
                            description: 'Access detailed zonal breakdowns with comparative analysis and intelligent insights generation.',
                            gradient: 'from-purple-50 to-pink-50',
                            iconBg: 'from-purple-500 to-pink-600',
                            link: '/deepdive'
                        },
                        {
                            icon: '🗺️',
                            title: 'Geographic Mapping',
                            description: 'Visualize data across Nigerian states and zones with interactive, color-coded geographic maps.',
                            gradient: 'from-orange-50 to-red-50',
                            iconBg: 'from-orange-500 to-red-600',
                            link: '/deepdive'
                        },
                        {
                            icon: '📈',
                            title: 'Trend Analysis',
                            description: 'Track changes over time with historical data comparisons and year-over-year trend visualizations.',
                            gradient: 'from-indigo-50 to-blue-50',
                            iconBg: 'from-indigo-500 to-blue-600',
                            link: '/deepdive'
                        },
                        {
                            icon: '💾',
                            title: 'Export & Share',
                            description: 'Download data in multiple formats (CSV, PDF) and share insights with stakeholders easily.',
                            gradient: 'from-teal-50 to-green-50',
                            iconBg: 'from-teal-500 to-green-600',
                            link: '/explorer'
                        }
                    ].map((feature, idx) => (
                        <Link key={idx} href={feature.link} className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all group hover:-translate-y-2 block`}>
                            <div className={`w-16 h-16 bg-gradient-to-br ${feature.iconBg} rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">{feature.description}</p>
                            <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-3 transition-all">
                                <span>Learn more</span>
                                <span>→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Data Modules Preview */}
            <div className="mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 font-outfit">Available Data Modules</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">Explore our curated collection of health and demographic survey modules</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-10 border border-gray-200">
                    {loadingModules ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {modules.slice(0, 4).map((mod) => (
                                    <Link key={mod.id} href={`/explorer`} className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-xl transition-all group cursor-pointer">
                                        <div className="flex items-start gap-5">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-lg">
                                                <DynamicIcon iconName={mod.icon} className="text-2xl text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg text-gray-900 mb-2">{mod.name}</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed mb-4">{mod.description}</p>
                                                <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:gap-2 transition-all">
                                                    <span>Explore Module</span>
                                                    <span>→</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            {modules.length > 4 && (
                                <div className="text-center mt-8">
                                    <Link href="/explorer" className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-xl font-bold text-gray-700 transition-all hover:shadow-lg">
                                        <span>View all {modules.length} modules</span>
                                        <span>→</span>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Call to Action */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-16 mb-8">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPjwvc3ZnPg==')] opacity-40"></div>
                <div className="relative z-10 text-center">
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-6 font-outfit">Ready to Explore?</h3>
                    <p className="text-green-100 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                        Begin your journey into Nigeria's comprehensive health and demographic insights. Choose your preferred analysis tool.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/explorer" className="px-10 py-5 bg-white text-green-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3">
                            <span className="text-2xl">📊</span> Data Explorer
                        </Link>
                        <Link href="/deepdive" className="px-10 py-5 bg-green-700 text-white rounded-xl font-bold text-lg hover:bg-green-800 transition-all hover:scale-105 flex items-center gap-3 border-2 border-white/30">
                            <span className="text-2xl">🎯</span> Deep Dive
                        </Link>
                    </div>
                </div>
            </div>
        </div >
    );
}
