import Header from '../components/Header';
import Footer from '../components/Footer';
import { CONTACT } from '../config';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Privacy Policy</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Introduction</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            Roudromoyee Online Clinic ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our digital healthcare platform, including our website, mobile application, and related services (collectively, the "Service").
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with our policies and practices, please do not use our Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Information We Collect</h2>
                        
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Personal Information</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            We collect information that you provide directly to us, including but not limited to:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Name, date of birth, gender, and contact information (email address, phone number, mailing address)</li>
                            <li>Medical history, health conditions, symptoms, medications, and other health-related information</li>
                            <li>Payment information, billing address, and insurance details</li>
                            <li>Account credentials, including username and password</li>
                            <li>Profile photographs and identification documents when required for verification</li>
                            <li>Communications with healthcare providers through our platform</li>
                            <li>Appointment history, prescriptions, and treatment records</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Automatically Collected Information</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            When you use our Service, we automatically collect certain information about your device and usage patterns:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Device information, including IP address, browser type, operating system, and device identifiers</li>
                            <li>Usage data, including pages visited, time spent on pages, click patterns, and navigation paths</li>
                            <li>Location information, if you grant permission for location-based services</li>
                            <li>Cookies, web beacons, and similar tracking technologies</li>
                            <li>Log files that record system activity and errors</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Information from Third Parties</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            We may receive information about you from third-party sources, including healthcare providers, insurance companies, payment processors, and authentication services. This information may be combined with information we collect directly from you.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">How We Use Your Information</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            We use the information we collect for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>To provide, maintain, and improve our healthcare services, including facilitating appointments, consultations, and prescription management</li>
                            <li>To process payments, verify insurance coverage, and manage billing</li>
                            <li>To communicate with you about your account, appointments, services, and important updates</li>
                            <li>To enable healthcare providers to access your medical information necessary for treatment</li>
                            <li>To personalize your experience and deliver relevant content</li>
                            <li>To detect, prevent, and address technical issues, security threats, and fraudulent activity</li>
                            <li>To comply with legal obligations, respond to legal requests, and protect our rights and interests</li>
                            <li>To conduct research and analytics to improve our services, provided that such research uses de-identified or anonymized data</li>
                            <li>To send you marketing communications, if you have opted in to receive them</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Information Sharing and Disclosure</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            We do not sell your personal information. We may share your information in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>With healthcare providers who are providing services to you through our platform</li>
                            <li>With service providers and business partners who assist us in operating our Service, such as payment processors, cloud hosting providers, and analytics services, under strict confidentiality agreements</li>
                            <li>When required by law, court order, or government regulation, or to respond to valid legal requests</li>
                            <li>To protect the rights, property, or safety of Roudromoyee Online Clinic, our users, or others</li>
                            <li>In connection with a merger, acquisition, or sale of assets, with notice to affected users</li>
                            <li>With your explicit consent or at your direction</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Data Security</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            We implement industry-standard technical, administrative, and physical security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include encryption of data in transit and at rest, access controls, regular security assessments, and employee training. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Data Retention</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Medical records and health information may be retained for extended periods as required by healthcare regulations. When information is no longer needed, we will securely delete or anonymize it in accordance with our data retention policies.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Your Rights and Choices</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            Depending on your jurisdiction, you may have certain rights regarding your personal information, including:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>The right to access and receive a copy of your personal information</li>
                            <li>The right to correct inaccurate or incomplete information</li>
                            <li>The right to request deletion of your personal information, subject to legal and operational requirements</li>
                            <li>The right to object to or restrict certain processing activities</li>
                            <li>The right to data portability</li>
                            <li>The right to withdraw consent where processing is based on consent</li>
                            <li>The right to opt out of marketing communications</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            To exercise these rights, please contact us using the information provided in the Contact section below. We will respond to your request within a reasonable timeframe and in accordance with applicable law.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Cookies and Tracking Technologies</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            We use cookies and similar tracking technologies to collect and store information about your preferences and activities. You can control cookies through your browser settings, though disabling cookies may limit your ability to use certain features of our Service. For more information about our use of cookies, please refer to our Cookie Policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Children's Privacy</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately, and we will take steps to delete such information.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">International Data Transfers</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your jurisdiction. By using our Service, you consent to the transfer of your information to these countries. We take appropriate safeguards to ensure your information receives adequate protection.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Changes to This Privacy Policy</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by posting the updated policy on our Service and updating the "Last Updated" date. Your continued use of the Service after such changes constitutes acceptance of the updated Privacy Policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
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

export default PrivacyPolicy;

