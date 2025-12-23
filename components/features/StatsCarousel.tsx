'use client';

import { useState, useEffect } from 'react';

interface Stat {
    label: string;
    value: string;
    icon: string;
    color: string;
    description: string;
}

const stats: Stat[] = [
    {
        label: "National Coverage",
        value: "37",
        icon: "🌍",
        color: "text-blue-600",
        description: "States & FCT covered with comprehensive data"
    },
    {
        label: "Data Points",
        value: "40k+",
        icon: "📊",
        color: "text-green-600",
        description: "Households surveyed across the nation"
    },
    {
        label: "Health Indicators",
        value: "250+",
        icon: "🏥",
        color: "text-purple-600",
        description: "Key metrics on fertility, malaria, and more"
    },
    {
        label: "Demographics",
        value: "50k+",
        icon: "👥",
        color: "text-orange-600",
        description: "Respondents interviewed in recent surveys"
    }
];

export default function StatsCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % stats.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 mb-10 relative overflow-hidden shadow-sm h-[300px] flex items-center justify-center">
            {/* Background Decor Elements matching current slide color */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 transition-colors duration-1000`}></div>
            <div className={`absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-gray-50 to-gray-100 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4 transition-colors duration-1000`}></div>

            <div className="relative w-full max-w-4xl mx-auto z-10">
                <div className="flex items-center justify-between">
                    {/* Text Section */}
                    <div className="flex-1 space-y-4">
                        <div className="overflow-hidden h-[160px] relative">
                            {stats.map((stat, idx) => (
                                <div
                                    key={idx}
                                    className={`absolute inset-0 transition-all duration-700 ease-in-out transform
                                        ${idx === current ? 'opacity-100 translate-y-0' :
                                            idx < current ? 'opacity-0 -translate-y-full' : 'opacity-0 translate-y-full'
                                        }
                                    `}
                                >
                                    <div className="flex items-start gap-6">
                                        <div className={`w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-5xl shadow-sm border border-gray-100 ${stat.color}`}>
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <h2 className={`text-6xl font-black mb-2 tracking-tight ${stat.color}`}>
                                                {stat.value}
                                            </h2>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{stat.label}</h3>
                                            <p className="text-gray-500">{stat.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress / Navigation */}
                    <div className="flex flex-col gap-3 ml-12">
                        {stats.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 
                                    ${idx === current ? 'bg-gray-800 h-8' : 'bg-gray-300 hover:bg-gray-400'}
                                `}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-[-20px] left-0 mt-8 flex items-center gap-2 text-sm text-gray-400 font-medium animate-pulse">
                    <span>👆</span>
                    <span>Select a module above to start exploring</span>
                </div>
            </div>
        </div>
    );
}
