import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="relative mt-auto bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 text-white overflow-hidden">
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-transparent to-green-900/50 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

                    {/* About Section */}
                    <div className="space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center font-bold text-xl">
                                D
                            </div>
                            <h3 className="text-2xl font-bold">Dataio</h3>
                        </div>
                        <p className="text-blue-100 text-sm leading-relaxed">
                            Empowering Nigeria with comprehensive health and population data insights for informed decision-making and policy development.
                        </p>

                        {/* Social Media Icons */}
                        <div className="flex gap-3 pt-2">
                            {[
                                { name: 'Facebook', icon: '📘', url: '#' },
                                { name: 'Twitter', icon: '🐦', url: '#' },
                                { name: 'LinkedIn', icon: '💼', url: '#' },
                                { name: 'Instagram', icon: '📷', url: '#' }
                            ].map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    aria-label={social.name}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300"
                                >
                                    <span className="text-lg">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                        <ul className="space-y-2">
                            {[
                                { name: 'Data Explorer', url: '/explorer', icon: '📊' },
                                { name: 'Xplore Analysis', url: '/xplore', icon: '🔍' },
                                { name: 'Data Sources', url: '#', icon: '📁' },
                                { name: 'Documentation', url: '#', icon: '📖' },
                                { name: 'About Us', url: '/about', icon: 'ℹ️' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.url}
                                        className="group flex items-center gap-2 text-blue-100 hover:text-white transition-all duration-200"
                                    >
                                        <span className="text-sm group-hover:scale-110 transition-transform">{link.icon}</span>
                                        <span className="relative">
                                            {link.name}
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-green-400 group-hover:w-full transition-all duration-300" />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Resources</h4>
                        <ul className="space-y-2">
                            {[
                                { name: 'Help Center', url: '#', icon: '❓' },
                                { name: 'Tutorials', url: '#', icon: '🎓' },
                                { name: 'Downloads', url: '#', icon: '⬇️' },
                                { name: 'Terms of Use', url: '/terms', icon: '📜' },
                                { name: 'Privacy Policy', url: '/privacy', icon: '🔒' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.url}
                                        className="group flex items-center gap-2 text-blue-100 hover:text-white transition-all duration-200"
                                    >
                                        <span className="text-sm group-hover:scale-110 transition-transform">{link.icon}</span>
                                        <span className="relative">
                                            {link.name}
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-green-400 group-hover:w-full transition-all duration-300" />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Get Started */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Get Started</h4>
                        <div className="space-y-3">
                            <button className="w-full px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 text-sm font-medium">
                                📤 Export Data
                            </button>
                            <button className="w-full px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 text-sm font-medium">
                                🔗 Share View
                            </button>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 pt-4">
                            <p className="text-sm text-blue-100">
                                <span className="font-semibold text-white">📧 Email:</span><br />
                                <a href="mailto:info@dataio.gov.ng" className="hover:text-white transition-colors">
                                    info@dataio.gov.ng
                                </a>
                            </p>
                            <p className="text-sm text-blue-100">
                                <span className="font-semibold text-white">📞 Phone:</span><br />
                                <a href="tel:+2348012345678" className="hover:text-white transition-colors">
                                    +234 801 234 5678
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom Bar */}
                <div className="pt-8 mt-8 border-t border-white/20">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <p className="text-blue-100">
                                © 2024 National Population Commission
                            </p>
                            <p className="flex items-center gap-1 text-blue-100">
                                Made with <span className="text-red-400 animate-pulse">❤️</span> in Nigeria
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/terms" className="text-blue-100 hover:text-white transition-colors">
                                Terms
                            </Link>
                            <Link href="/privacy" className="text-blue-100 hover:text-white transition-colors">
                                Privacy
                            </Link>
                            {['Accessibility', 'Sitemap'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    className="text-blue-100 hover:text-white transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
