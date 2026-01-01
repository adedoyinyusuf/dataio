export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p className="text-sm text-gray-500 mb-8">Last Updated: January 1, 2026</p>

                <div className="prose prose-blue max-w-none space-y-8">
                    {/* Introduction */}
                    <section>
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
                            <p className="text-gray-700 leading-relaxed font-medium">
                                The National Population Commission ("NPC", "we", "us", or "our") is committed to protecting your privacy
                                and ensuring compliance with the Nigeria Data Protection Regulation (NDPR) 2019 and all applicable data protection laws.
                            </p>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use the Dataio platform ("Platform").
                        </p>
                    </section>

                    {/* Legal Framework */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Legal Framework and Compliance</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Our data practices comply with:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                            <li><strong>Nigeria Data Protection Regulation (NDPR) 2019</strong> - Enforced by NITDA</li>
                            <li><strong>Nigerian Communications Act 2003</strong></li>
                            <li><strong>Freedom of Information Act 2011</strong></li>
                            <li><strong>Constitution of the Federal Republic of Nigeria 1999 (as amended)</strong></li>
                            <li><strong>NPC Act 2006</strong> - Establishing the National Population Commission</li>
                        </ul>
                    </section>

                    {/* Data We Display */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Nature of Data on the Platform</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.1 Aggregated Statistical Data Only</h3>
                        <div className="bg-green-50 border-l-4 border-green-600 p-6 my-4">
                            <p className="text-gray-700 leading-relaxed font-medium">
                                ✅ This Platform displays ONLY aggregated, anonymized statistical data.
                            </p>
                            <p className="text-gray-700 leading-relaxed mt-2">
                                ❌ NO personally identifiable information (PII) is collected, stored, or displayed.
                            </p>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 Types of Statistical Data</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                            <li>Health indicators (maternal health, child health, immunization rates)</li>
                            <li>Demographic statistics (population distribution, urbanization)</li>
                            <li>Socioeconomic indicators (education, employment)</li>
                            <li>Geographic aggregations (national, zonal, state-level)</li>
                            <li>Trend data across survey years</li>
                        </ul>

                        <p className="text-gray-700 leading-relaxed mt-4">
                            All data is derived from nationally representative surveys and meets strict anonymization standards to prevent re-identification.
                        </p>
                    </section>

                    {/* Platform Usage Data */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information We Collect About Platform Usage</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.1 Automatically Collected Information</h3>
                        <p className="text-gray-700 leading-relaxed">
                            When you access the Platform, we may automatically collect:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                            <li><strong>Technical Data:</strong> IP address, browser type, device type, operating system</li>
                            <li><strong>Usage Data:</strong> Pages viewed, time spent on pages, navigation paths</li>
                            <li><strong>Log Data:</strong> Access times, error logs, referring URLs</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.2 Cookies and Tracking Technologies</h3>
                        <div className="bg-gray-50 rounded-lg p-6 my-4">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We use essential cookies to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Maintain session information</li>
                                <li>Remember your preferences (e.g., selected modules, view settings)</li>
                                <li>Analyze Platform usage patterns</li>
                                <li>Improve Platform performance and user experience</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                <strong>You can disable cookies</strong> through your browser settings, but this may affect Platform functionality.
                            </p>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.3 Admin User Information</h3>
                        <p className="text-gray-700 leading-relaxed">
                            For authenticated admin users only, we collect:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                            <li>Email address (for authentication)</li>
                            <li>Login credentials (encrypted)</li>
                            <li>Activity logs (for security and audit purposes)</li>
                        </ul>
                    </section>

                    {/* How We Use Information */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Use Collected Information</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Platform usage information is used solely for:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                            <li><strong>Platform Operation:</strong> Maintaining and improving Platform functionality</li>
                            <li><strong>Analytics:</strong> Understanding user behavior to enhance user experience</li>
                            <li><strong>Security:</strong> Detecting and preventing fraudulent activity or security breaches</li>
                            <li><strong>Compliance:</strong> Meeting legal obligations under Nigerian law</li>
                            <li><strong>Research:</strong> Understanding data access patterns for public health research</li>
                        </ul>
                    </section>

                    {/* Data Security */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security Measures</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We implement industry-standard security measures to protect information:
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 my-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 mb-2">🔒 Technical Safeguards</h4>
                                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc list-inside">
                                    <li>SSL/TLS encryption in transit</li>
                                    <li>Encrypted database storage</li>
                                    <li>Regular security audits</li>
                                    <li>Firewall protection</li>
                                </ul>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 mb-2">👥 Administrative Safeguards</h4>
                                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc list-inside">
                                    <li>Role-based access control</li>
                                    <li>Staff training on data protection</li>
                                    <li>Incident response procedures</li>
                                    <li>Regular compliance reviews</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
                            <p className="text-sm text-gray-700">
                                <strong>⚠️ Note:</strong> While we implement robust security measures, no system is completely secure.
                                We cannot guarantee absolute security of data transmitted over the internet.
                            </p>
                        </div>
                    </section>

                    {/* Data Retention */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                            <li><strong>Statistical Data:</strong> Retained indefinitely for historical research and trend analysis</li>
                            <li><strong>Usage Logs:</strong> Retained for 12 months, then anonymized or deleted</li>
                            <li><strong>Admin Data:</strong> Retained for the duration of employment/contract plus 2 years for audit purposes</li>
                        </ul>
                    </section>

                    {/* Data Sharing */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Sharing and Disclosure</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.1 We DO NOT Sell Your Data</h3>
                        <div className="bg-red-50 border-l-4 border-red-600 p-6 my-4">
                            <p className="text-gray-700 leading-relaxed font-medium">
                                ✅ We DO NOT sell, rent, or trade any user information to third parties.
                            </p>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.2 Limited Sharing Scenarios</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We may share aggregated, non-personal information with:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                            <li><strong>Government Agencies:</strong> Federal ministries, departments, and agencies for policy development</li>
                            <li><strong>Research Partners:</strong> Academic institutions and international development organizations (with data use agreements)</li>
                            <li><strong>Service Providers:</strong> Cloud hosting, analytics services (under strict confidentiality agreements)</li>
                            <li><strong>Legal Compliance:</strong> When required by Nigerian law or court order</li>
                        </ul>
                    </section>

                    {/* Your Rights Under NDPR */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights Under NDPR</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Under the Nigeria Data Protection Regulation, you have the following rights:
                        </p>

                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-gray-800">Right to Access</h4>
                                <p className="text-sm text-gray-700">Request copies of your personal data (if any is collected)</p>
                            </div>
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-gray-800">Right to Rectification</h4>
                                <p className="text-sm text-gray-700">Request correction of inaccurate personal data</p>
                            </div>
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-gray-800">Right to Erasure</h4>
                                <p className="text-sm text-gray-700">Request deletion of your personal data (subject to legal obligations)</p>
                            </div>
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-gray-800">Right to Object</h4>
                                <p className="text-sm text-gray-700">Object to processing of your personal data</p>
                            </div>
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-gray-800">Right to Lodge a Complaint</h4>
                                <p className="text-sm text-gray-700">Contact NITDA regarding data protection concerns</p>
                            </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed mt-6">
                            To exercise these rights, contact our Data Protection Officer (see Section 11).
                        </p>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            This Platform is not directed to children under 18. We do not knowingly collect personal information from children.
                            If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                        </p>
                    </section>

                    {/* International Data Transfers */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Data is primarily stored on servers located within Nigeria. If data is transferred outside Nigeria for hosting
                            or backup purposes, we ensure:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                            <li>Compliance with NDPR requirements for international transfers</li>
                            <li>Adequate data protection safeguards (e.g., Standard Contractual Clauses)</li>
                            <li>Notification to NITDA when required</li>
                        </ul>
                    </section>

                    {/* Contact Information */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Data Protection Officer & Contact</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            For privacy-related inquiries, data access requests, or to exercise your NDPR rights:
                        </p>

                        <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                            <div>
                                <h4 className="font-semibold text-gray-800">Data Protection Officer</h4>
                                <p className="text-gray-700">National Population Commission</p>
                            </div>
                            <div>
                                <p className="text-gray-700">📍 Plot 774, Cadastral Zone AO, Central Business District</p>
                                <p className="text-gray-700">PMB 218, Garki, Abuja, Nigeria</p>
                            </div>
                            <div>
                                <p className="text-gray-700">📧 Email: <a href="mailto:dpo@dataio.gov.ng" className="text-blue-600 hover:text-blue-700">dpo@dataio.gov.ng</a></p>
                                <p className="text-gray-700">📞 Phone: +234 (0) 9 670 2610</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-6 mt-4">
                            <h4 className="font-semibold text-gray-800 mb-2">NITDA Contact (Regulatory Authority)</h4>
                            <p className="text-sm text-gray-700">National Information Technology Development Agency (NITDA)</p>
                            <p className="text-sm text-gray-700">📧 <a href="mailto:info@nitda.gov.ng" className="text-blue-600">info@nitda.gov.ng</a></p>
                            <p className="text-sm text-gray-700">🌐 <a href="https://nitda.gov.ng" className="text-blue-600" target="_blank" rel="noopener noreferrer">www.nitda.gov.ng</a></p>
                        </div>
                    </section>

                    {/* Policy Updates */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.
                            Material changes will be communicated via:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                            <li>Prominent notice on the Platform homepage</li>
                            <li>Email notification to registered admin users</li>
                            <li>Updated "Last Modified" date at the top of this policy</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Continued use of the Platform after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    {/* Consent */}
                    <section className="bg-green-50 rounded-lg p-6 mt-8">
                        <h2 className="text-xl font-bold text-green-900 mb-4">Your Consent</h2>
                        <p className="text-gray-700 leading-relaxed">
                            By using this Platform, you consent to this Privacy Policy and agree to its terms.
                            If you do not agree, please do not use the Platform.
                        </p>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">
                        © 2024-2026 National Population Commission, Federal Republic of Nigeria
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Committed to Data Protection and Privacy in accordance with Nigerian Law
                    </p>
                </div>
            </div>
        </div>
    );
}
