import Header from '../components/Header';
import Footer from '../components/Footer';
import { CONTACT } from '../config';

const TermsOfService = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Terms of Service</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Agreement to Terms</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            These Terms of Service ("Terms") constitute a legally binding agreement between you and Roudromoyee Online Clinic ("we," "our," or "us") governing your access to and use of our digital healthcare platform, including our website, mobile application, and related services (collectively, the "Service"). By accessing, browsing, or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            If you do not agree to these Terms, you must not access or use the Service. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting. Your continued use of the Service after modifications constitutes acceptance of the updated Terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Eligibility and Account Registration</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            To use certain features of the Service, you must:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Be at least 18 years of age, or have the consent of a parent or legal guardian if you are a minor</li>
                            <li>Have the legal capacity to enter into binding agreements</li>
                            <li>Provide accurate, current, and complete information during registration</li>
                            <li>Maintain and promptly update your account information to keep it accurate and current</li>
                            <li>Maintain the security and confidentiality of your account credentials</li>
                            <li>Accept responsibility for all activities that occur under your account</li>
                            <li>Notify us immediately of any unauthorized use of your account or any other breach of security</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            You may not create multiple accounts, transfer your account to another person, or use another person's account without authorization. We reserve the right to suspend or terminate accounts that violate these requirements or engage in fraudulent, abusive, or illegal activities.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Description of Service</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            Roudromoyee Online Clinic provides a digital platform that facilitates connections between patients and licensed healthcare providers for telemedicine consultations, appointment scheduling, prescription management, and related healthcare services. We act as an intermediary platform and do not provide medical services directly. All medical services are provided by independent, licensed healthcare professionals who are not our employees or agents.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Acceptable Use</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Violate any applicable local, state, national, or international law or regulation</li>
                            <li>Infringe upon the rights of others, including intellectual property rights, privacy rights, or other legal rights</li>
                            <li>Transmit any malicious code, viruses, worms, or other harmful or destructive content</li>
                            <li>Attempt to gain unauthorized access to the Service, other accounts, computer systems, or networks</li>
                            <li>Interfere with or disrupt the Service, servers, or networks connected to the Service</li>
                            <li>Use automated systems, bots, scrapers, or similar tools to access or collect data from the Service without authorization</li>
                            <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with any person or entity</li>
                            <li>Harass, abuse, threaten, or harm other users or healthcare providers</li>
                            <li>Post, upload, or transmit any content that is defamatory, obscene, pornographic, or otherwise objectionable</li>
                            <li>Use the Service to solicit, advertise, or promote products or services without our prior written consent</li>
                            <li>Reverse engineer, decompile, or disassemble any portion of the Service</li>
                            <li>Remove, alter, or obscure any proprietary notices or labels on the Service</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">User Content and Information</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            You are solely responsible for all information, data, text, messages, and other content that you submit, post, or transmit through the Service ("User Content"). By submitting User Content, you represent and warrant that:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>You own or have the necessary rights and permissions to use and authorize us to use the User Content</li>
                            <li>The User Content is accurate, truthful, and not misleading</li>
                            <li>The User Content does not violate any third-party rights, including intellectual property, privacy, or publicity rights</li>
                            <li>The User Content complies with all applicable laws and regulations</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            You grant us a non-exclusive, worldwide, royalty-free, perpetual, irrevocable, and sublicensable license to use, reproduce, modify, adapt, publish, translate, distribute, and display your User Content for the purpose of operating and providing the Service. We reserve the right to remove, edit, or refuse to post any User Content that violates these Terms or is otherwise objectionable.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Medical Services and Healthcare Providers</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            Healthcare services available through our platform are provided by independent, licensed healthcare professionals. We do not:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Employ, control, or supervise healthcare providers</li>
                            <li>Guarantee the availability, quality, or outcome of medical services</li>
                            <li>Endorse or recommend specific healthcare providers, treatments, or medications</li>
                            <li>Make medical diagnoses or provide medical advice</li>
                            <li>Assume responsibility for medical decisions made by healthcare providers or patients</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            The relationship between you and healthcare providers is independent of Roudromoyee Online Clinic. Healthcare providers are solely responsible for the medical services they provide, including diagnosis, treatment, prescriptions, and professional judgment. You acknowledge that medical services involve inherent risks, and you assume all risks associated with receiving medical care through our platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Payment Terms</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            Payment for services is required in accordance with the pricing and payment terms displayed on the Service. You agree to:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Provide accurate and complete payment information</li>
                            <li>Authorize us to charge your payment method for all fees and charges</li>
                            <li>Pay all applicable fees, taxes, and charges in a timely manner</li>
                            <li>Notify us immediately of any changes to your payment information</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            All fees are non-refundable unless otherwise required by law or as specified in our refund policy. We reserve the right to change our pricing at any time, with notice to users. If you dispute any charges, you must contact us within 30 days of the charge date.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Intellectual Property Rights</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            The Service, including its design, text, graphics, logos, icons, images, software, and other content, is owned by Roudromoyee Online Clinic or its licensors and is protected by copyright, trademark, patent, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of the Service without our prior written consent. All rights not expressly granted to you are reserved by us.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Disclaimers of Warranties</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ACCURACY. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE FROM VIRUSES OR OTHER HARMFUL COMPONENTS. WE DO NOT WARRANT THE ACCURACY, COMPLETENESS, OR USEFULNESS OF ANY INFORMATION ON THE SERVICE.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Limitation of Liability</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ROUDROMOYEE ONLINE CLINIC, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF OR INABILITY TO USE THE SERVICE, REGARDLESS OF THE THEORY OF LIABILITY AND WHETHER OR NOT WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE USE OF OR INABILITY TO USE THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED DOLLARS, WHICHEVER IS GREATER.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Indemnification</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            You agree to indemnify, defend, and hold harmless Roudromoyee Online Clinic, its officers, directors, employees, agents, and licensors from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including reasonable attorneys' fees) arising out of or relating to your use of the Service, your violation of these Terms, your violation of any rights of another, or your User Content.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Termination</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Your right to use the Service will immediately cease</li>
                            <li>We may delete your account and all associated data, subject to legal and regulatory retention requirements</li>
                            <li>All provisions of these Terms that by their nature should survive termination will survive, including ownership provisions, warranty disclaimers, and limitations of liability</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            You may terminate your account at any time by contacting us or using account deletion features available in the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Governing Law and Dispute Resolution</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions. Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the applicable arbitration association, except where prohibited by law. You waive any right to participate in a class-action lawsuit or class-wide arbitration.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Severability</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect and enforceable.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Entire Agreement</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            These Terms, together with our Privacy Policy and any other legal notices published by us on the Service, constitute the entire agreement between you and Roudromoyee Online Clinic concerning the Service and supersede all prior or contemporaneous communications and proposals, whether electronic, oral, or written.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Information</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                            If you have questions about these Terms, please contact us at:
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                            Email: {CONTACT.email}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            Address: {CONTACT.address}
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;

