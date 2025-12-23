import React from 'react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg mb-4">
                ℹ️
            </div>
            <h1 className="text-4xl font-black text-gray-900 font-outfit">About Dataio</h1>
            <p className="text-xl text-gray-600 max-w-2xl text-center leading-relaxed">
                Dataio is Nigeria's premier platform for demographic and health data exploration.
                We empower researchers, policymakers, and the public with accessible, interactive, and insightful data visualizations.
            </p>
        </div>
    );
}
