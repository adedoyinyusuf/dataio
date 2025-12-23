import React from 'react';
import WhatsAppWidget from '@/components/features/WhatsAppWidget';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg mb-4">
                📞
            </div>
            <h1 className="text-4xl font-black text-gray-900 font-outfit">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl text-center leading-relaxed">
                Have questions or feedback? We'd love to hear from you.
                Reach out to our support team for assistance or collaboration opportunities.
            </p>
            <a href="mailto:support@dataio.ng" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                Get in Touch
            </a>

            <WhatsAppWidget />
        </div>
    );
}
