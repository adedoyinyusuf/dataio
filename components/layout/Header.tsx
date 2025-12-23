'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
    const pathname = usePathname();
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark');
    };

    const navLinks = [
        { href: '/', label: 'Home', icon: '🏠' },
        { href: '/explorer', label: 'Explorer', icon: '📊' },
        { href: '/deepdive', label: 'Deep Dive', icon: '🎯' }
    ];

    const rightLinks = [
        { href: '/about', label: 'About', icon: 'ℹ️' },
        { href: '/contact', label: 'Contact Us', icon: '📞' }
    ];

    return (
        <header className="glass-header sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                {/* Logo & Title */}
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-900/20 group-hover:-translate-y-1 transition-transform cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                            <polyline points="2 17 12 22 22 17"></polyline>
                            <polyline points="2 12 12 17 22 12"></polyline>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-none">Dataio</h1>
                        <p className="text-xs font-semibold text-green-700 tracking-wide uppercase mt-1">Data Explorer</p>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl p-1.5">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
                                    flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all
                                    ${isActive
                                        ? 'bg-white text-green-600 shadow-md'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                    }
                                `}
                            >
                                <span className="text-base">{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Context Badge & Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        {rightLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                                    ${pathname === link.href
                                        ? 'bg-gray-100 text-green-700'
                                        : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <span>{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>


                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>
        </header>
    );
}
