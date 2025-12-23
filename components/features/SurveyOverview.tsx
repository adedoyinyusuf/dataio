'use client';

import { SurveyData } from '@/lib/services/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBookOpen,
    faPercentage,
    faArrowUp,
    faPersonDress,
    faPerson,
    faDownload,
    faFilePdf,
    faHome,
    faChild
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

interface SurveyOverviewProps {
    data: SurveyData;
    year: string;
    moduleId: string;
}

export default function SurveyOverview({ data, year, moduleId }: SurveyOverviewProps) {
    console.log('SurveyOverview received data:', data);

    if (!data || !data.stats) {
        return (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
                <p className="font-bold">Error: Survey statistics are missing or incomplete.</p>
                <p className="text-sm mt-2">Data received: {JSON.stringify(data)}</p>
            </div>
        );
    }

    const isNeds = moduleId === 'neds';

    // Config for Cards
    const card2 = isNeds ? {
        label: 'Households Interviewed',
        value: data.stats.women,
        icon: faHome,
        colorClass: 'text-purple-600',
        bgClass: 'bg-purple-100'
    } : {
        label: 'Women Interviewed',
        value: data.stats.women,
        icon: faPersonDress,
        colorClass: 'text-purple-600',
        bgClass: 'bg-purple-100'
    };

    const card3 = isNeds ? {
        label: 'Children Interviewed',
        value: data.stats.men,
        icon: faChild,
        colorClass: 'text-blue-600',
        bgClass: 'bg-blue-100'
    } : {
        label: 'Men Interviewed',
        value: data.stats.men,
        icon: faPerson,
        colorClass: 'text-blue-600',
        bgClass: 'bg-blue-100'
    };

    const reportCover = (moduleId === 'ndhs' && year === '2024') ||
        (moduleId === 'neds' && year === '2020') ||
        (moduleId === 'naiis' && year === '2018') ||
        (moduleId === 'nmis' && year === '2021')
        ? `/assets/images/${moduleId}-${year}-cover.png`
        : null;

    // Dynamic Theme Colors
    const themeColor = {
        bgLight: moduleId === 'neds' ? 'bg-blue-50' : 'bg-green-50',
        bgMedium: moduleId === 'neds' ? 'bg-blue-100' : 'bg-green-100',
        bgDark: moduleId === 'neds' ? 'bg-blue-600' : 'bg-green-600',
        bgDarkHover: moduleId === 'neds' ? 'hover:bg-blue-700' : 'hover:bg-green-700',
        textDark: moduleId === 'neds' ? 'text-blue-700' : 'text-green-700',
        textMedium: moduleId === 'neds' ? 'text-blue-600' : 'text-green-600',
        border: moduleId === 'neds' ? 'border-blue-200' : 'border-green-200',
        gradient: moduleId === 'neds' ? 'from-blue-600 to-indigo-600' : 'from-green-600 to-emerald-600'
    };

    return (
        <div className="fade-in-up space-y-10">
            {/* Header Section with Split Layout */}
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Left: Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${themeColor.bgLight} ${themeColor.border} ${themeColor.textDark} text-sm font-bold uppercase tracking-wider mb-6 border`}>
                            <FontAwesomeIcon icon={faBookOpen} />
                            <span>Survey Report</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">{data.label}</h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">{data.desc}</p>
                    </div>

                    {/* Right: Report Cover & Download Action */}
                    {reportCover && (
                        <div className="lg:w-1/3 flex flex-col items-center lg:items-end">
                            <div className="relative group">
                                <div className={`absolute -inset-1 bg-gradient-to-r ${themeColor.gradient} rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200`}></div>
                                <div className="relative">
                                    <img
                                        src={reportCover}
                                        alt={`${data.label} Report Cover`}
                                        className="w-64 md:w-80 rounded-xl shadow-2xl border border-gray-100 transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-1"
                                    />
                                </div>
                            </div>
                            <button className={`mt-8 inline-flex items-center gap-3 px-8 py-4 ${themeColor.bgDark} ${themeColor.bgDarkHover} text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full md:w-auto justify-center`}>
                                <FontAwesomeIcon icon={faDownload} />
                                <span>Download Full Report</span>
                            </button>
                            <p className="mt-3 text-xs text-gray-400 italic text-center lg:text-right">
                                Official Technical Report
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 max-w-7xl mx-auto"></div>

            {/* Stats Cards - 3 Column Grid */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Response Rate Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-100 transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                <FontAwesomeIcon icon={faPercentage} className="text-green-600 text-3xl" />
                            </div>
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 flex items-center gap-1">
                                <FontAwesomeIcon icon={faArrowUp} className="text-xs" />+2.4%
                            </span>
                        </div>
                        <div className="text-5xl font-black text-gray-900 mb-2 tracking-tight">{data.stats?.response ?? 'N/A'}%</div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Response Rate</div>
                    </div>

                    {/* Card 2 (Women/Households) */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-100 transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-6">
                            <div className={`w-16 h-16 ${card2.bgClass} rounded-2xl flex items-center justify-center group-hover:brightness-95 transition-all`}>
                                <FontAwesomeIcon icon={card2.icon} className={`${card2.colorClass} text-3xl`} />
                            </div>
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 flex items-center gap-1">
                                <FontAwesomeIcon icon={faArrowUp} className="text-xs" />+1.5%
                            </span>
                        </div>
                        <div className="text-5xl font-black text-gray-900 mb-2 tracking-tight">{card2.value ? card2.value.toLocaleString() : 'N/A'}</div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{card2.label}</div>
                    </div>

                    {/* Card 3 (Men/Children) */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-100 transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-6">
                            <div className={`w-16 h-16 ${card3.bgClass} rounded-2xl flex items-center justify-center group-hover:brightness-95 transition-all`}>
                                <FontAwesomeIcon icon={card3.icon} className={`${card3.colorClass} text-3xl`} />
                            </div>
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 flex items-center gap-1">
                                <FontAwesomeIcon icon={faArrowUp} className="text-xs" />+0.8%
                            </span>
                        </div>
                        <div className="text-5xl font-black text-gray-900 mb-2 tracking-tight">{card3.value ? card3.value.toLocaleString() : 'N/A'}</div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{card3.label}</div>
                    </div>
                </div>
            </div>

            {/* Note: Detailed Report and Data Quality Cards removed for cleaner layout as requested */}
        </div>
    );
}
