'use client';

import { useState } from 'react';

export default function WhatsAppWidget() {
    const [isOpen, setIsOpen] = useState(false);

    // You can replace this with the actual support number
    const phoneNumber = "2349000000000";
    const message = "Hello! I have a question about Dataio.";

    const handleWhatsAppClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Box Popup */}
            {isOpen && (
                <div className="mb-4 w-72 bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-[#128C7E] p-4 text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                            🎧
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Customer Support</h3>
                            <p className="text-xs text-white/80">Typically replies instantly</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="ml-auto text-white/80 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-4 bg-[#e5ddd5] min-h-[200px] flex flex-col justify-end">
                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-gray-800 max-w-[85%] self-start mb-4 relative before:content-[''] before:absolute before:top-0 before:left-[-8px] before:w-0 before:h-0 before:border-t-[10px] before:border-t-white before:border-l-[10px] before:border-l-transparent">
                            Hello! 👋 <br />
                            How can we help you with Dataio today?
                            <div className="text-[10px] text-gray-400 text-right mt-1">10:00 AM</div>
                        </div>
                    </div>

                    <div className="p-3 bg-white border-t border-gray-100">
                        <button
                            onClick={handleWhatsAppClick}
                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-colors shadow-lg"
                        >
                            <span>Start Chat</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-all duration-300 group z-50"
                aria-label="Chat on WhatsApp"
            >
                {isOpen ? (
                    <span className="text-2xl font-bold">✕</span>
                ) : (
                    <svg viewBox="0 0 32 32" className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 2C8.28 2 2 8.28 2 16c0 2.68.75 5.19 2.05 7.37L2.4 29.6l6.45-1.63C10.74 29.17 13.3 30 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5c-2.34 0-4.55-.66-6.44-1.81l-.46-.28-3.9 1 .98-3.7-.29-.48C4.52 20.25 3.5 18.22 3.5 16 3.5 9.1 9.1 3.5 16 3.5c6.9 0 12.5 5.6 12.5 12.5S22.9 28.5 16 28.5z" />
                        <path d="M21.78 19.33c-.32-.16-1.92-.95-2.22-1.06-.3-.11-.52-.16-.73.16-.21.32-.85 1.06-1.04 1.27-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.58-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.64.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.73-1.76-1-2.4-.26-.64-.53-.55-.73-.56-.18 0-.39-.01-.6-.01-.21 0-.55.08-.84.39-.29.32-1.12 1.1-1.12 2.67 0 1.58 1.15 3.1 1.31 3.32.16.21 2.27 3.47 5.5 4.86.77.33 1.37.53 1.84.68.78.25 1.49.21 2.06.13.64-.09 1.92-.79 2.19-1.55.27-.76.27-1.41.19-1.55-.08-.14-.3-.22-.62-.38z" />
                    </svg>
                )}
            </button>
        </div>
    );
}
