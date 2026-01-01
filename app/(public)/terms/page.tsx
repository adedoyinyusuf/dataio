export default function TermsOfUsePage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Use</h1>
                <p className="text-sm text-gray-500 mb-8">Last Updated: January 1, 2026</p>

                <div className="prose prose-blue max-w-none space-y-8">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Welcome to the Dataio platform ("Platform"), operated by the National Population Commission of Nigeria ("NPC", "we", "us", or "our").
                            By accessing or using this Platform, you agree to be bound by these Terms of Use and all applicable laws and regulations of the Federal Republic of Nigeria.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            If you do not agree with any part of these terms, you must not use this Platform.
                        </p>
                    </section>

                    {/* Platform Purpose */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Platform Purpose</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Dataio provides access to aggregated health and demographic statistical data collected through:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                            <li>Nigeria Demographic and Health Survey (NDHS)</li>
                            <li>Nigeria Multiple Indicator Cluster Survey (MICS)</li>
                            <li>National Immunization Coverage Survey (NICS)</li>
                            <li>Other nationally representative surveys</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            The Platform is designed for research, policy development, evidence-based decision-making, and public information purposes.
                        </p>
                    </section>

                    {/* User Eligibility */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Eligibility and Responsibilities</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.1 Eligibility</h3>
                        <p className="text-gray-700 leading-relaxed">
                            You must be at least 18 years old to use this Platform. By using the Platform, you represent and warrant that you meet this age requirement.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.2 Acceptable Use</h3>
                        <p className="text-gray-700 leading-relaxed">You agree to use the Platform only for lawful purposes. You shall not:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                            <li>Violate any Nigerian laws or regulations</li>
                            <li>Misrepresent or manipulate data for fraudulent purposes</li>
                            <li>Attempt to gain unauthorized access to the Platform or its systems</li>
                            <li>Interfere with or disrupt the Platform's operation</li>
                            <li>Use automated systems (bots, scrapers) without written permission</li>
                            <li>Reverse engineer or attempt to extract source code</li>
                            <li>Use data to identify individuals (re-identification prohibited)</li>
                        </ul>
                    </section>

                    {/* Data Usage Rights */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Usage Rights and Restrictions</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.1 License Grant</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use
                            the aggregated statistical data on the Platform for:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                            <li>Research and academic purposes</li>
                            <li>Policy analysis and development</li>
                            <li>Public health planning</li>
                            <li>Educational purposes</li>
                            <li>Non-commercial use (unless explicitly authorized)</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Data Attribution</h3>
                        <p className="text-gray-700 leading-relaxed">
                            When using or publishing data from this Platform, you must provide proper attribution:
                        </p>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                            <p className="text-sm text-gray-700 font-mono">
                                "Source: National Population Commission (NPC), Dataio Platform, [Dataset Name], [Year]. Available at: https://dataio.gov.ng"
                            </p>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.3 Data Integrity</h3>
                        <p className="text-gray-700 leading-relaxed">
                            You must not alter, modify, or misrepresent the data in any way that could mislead users or
                            misattribute findings to the NPC.
                        </p>
                    </section>

                    {/* Intellectual Property */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property Rights</h2>
                        <p className="text-gray-700 leading-relaxed">
                            All content on this Platform, including but not limited to text, graphics, logos, data visualizations,
                            software code, and compilation of data, is the property of the National Population Commission or its
                            content suppliers and is protected by Nigerian and international copyright laws.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            The National Population Commission name, logo, and related marks are trademarks of the Federal Government of Nigeria.
                        </p>
                    </section>

                    {/* Disclaimer */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Disclaimer of Warranties</h2>
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-4">
                            <p className="text-gray-700 leading-relaxed">
                                THE PLATFORM AND ALL DATA ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
                                INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                            </p>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                While we strive to ensure data accuracy, we do not warrant that the data is error-free, complete, or current.
                                Users should independently verify data before making critical decisions.
                            </p>
                        </div>
                    </section>

                    {/* Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
                        <p className="text-gray-700 leading-relaxed">
                            To the fullest extent permitted by Nigerian law, the NPC shall not be liable for any indirect, incidental,
                            special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly
                            or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                            <li>Your use or inability to use the Platform</li>
                            <li>Any reliance on data from the Platform</li>
                            <li>Unauthorized access to or alteration of your transmissions or data</li>
                            <li>Statements or conduct of any third party on the Platform</li>
                        </ul>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Governing Law and Dispute Resolution</h2>
                        <p className="text-gray-700 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria,
                            without regard to its conflict of law provisions.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Any dispute arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the
                            Federal High Court of Nigeria.
                        </p>
                    </section>

                    {/* Data Protection Compliance */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Compliance with NDPR</h2>
                        <p className="text-gray-700 leading-relaxed">
                            This Platform operates in compliance with the Nigeria Data Protection Regulation (NDPR) 2019 and all
                            regulations issued by the National Information Technology Development Agency (NITDA).
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            All personal data is anonymized and aggregated. No personally identifiable information (PII) is displayed
                            on this Platform.
                        </p>
                    </section>

                    {/* Modifications */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications to Terms</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting
                            to the Platform. Your continued use of the Platform after any modifications constitutes acceptance of the
                            updated Terms.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            We will notify users of material changes via prominent notice on the Platform.
                        </p>
                    </section>

                    {/* Contact Information */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
                        <p className="text-gray-700 leading-relaxed">
                            For questions about these Terms or the Platform, please contact:
                        </p>
                        <div className="bg-gray-50 rounded-lg p-6 mt-4 space-y-2">
                            <p className="text-gray-700"><strong>National Population Commission</strong></p>
                            <p className="text-gray-700">Plot 774, Cadastral Zone AO, Central Business District</p>
                            <p className="text-gray-700">PMB 218, Garki, Abuja, Nigeria</p>
                            <p className="text-gray-700">Email: <a href="mailto:info@dataio.gov.ng" className="text-blue-600 hover:text-blue-700">info@dataio.gov.ng</a></p>
                            <p className="text-gray-700">Phone: +234 (0) 9 670 2610</p>
                        </div>
                    </section>

                    {/* Severability */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Severability</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If any provision of these Terms is found to be unenforceable or invalid under Nigerian law, such provision
                            shall be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible
                            under applicable law, and the remaining provisions shall continue in full force and effect.
                        </p>
                    </section>

                    {/* Acknowledgment */}
                    <section className="bg-blue-50 rounded-lg p-6 mt-8">
                        <h2 className="text-xl font-bold text-blue-900 mb-4">Acknowledgment</h2>
                        <p className="text-gray-700 leading-relaxed">
                            BY USING THIS PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF USE, UNDERSTAND THEM,
                            AND AGREE TO BE BOUND BY THEM.
                        </p>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">
                        © 2024-2026 National Population Commission, Federal Republic of Nigeria
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        All Rights Reserved
                    </p>
                </div>
            </div>
        </div>
    );
}
