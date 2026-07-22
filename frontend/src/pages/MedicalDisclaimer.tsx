import Header from '../components/Header';
import Footer from '../components/Footer';
import { CONTACT } from '../config';

const MedicalDisclaimer = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Medical Disclaimer</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Important Notice</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            PLEASE READ THIS MEDICAL DISCLAIMER CAREFULLY BEFORE USING THE ROUDROMOYEE ONLINE CLINIC PLATFORM. THIS DISCLAIMER CONTAINS IMPORTANT INFORMATION ABOUT THE LIMITATIONS OF OUR SERVICE AND YOUR RESPONSIBILITIES WHEN USING TELEMEDICINE SERVICES.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            By accessing or using Roudromoyee Online Clinic ("the Service"), you acknowledge that you have read, understood, and agree to be bound by this Medical Disclaimer. If you do not agree with any part of this disclaimer, you must not use the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Not a Substitute for Professional Medical Care</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            THE SERVICE IS NOT INTENDED TO REPLACE, SUBSTITUTE FOR, OR SUPERSEDE PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT. THE INFORMATION, CONTENT, AND SERVICES PROVIDED THROUGH THE PLATFORM ARE FOR INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY AND DO NOT CONSTITUTE MEDICAL ADVICE.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            Roudromoyee Online Clinic is a technology platform that facilitates connections between patients and licensed healthcare providers. We do not provide medical services, make medical diagnoses, prescribe medications, or offer medical treatment. All medical services are provided by independent, licensed healthcare professionals who are responsible for their own professional judgment and medical decisions.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Emergency Situations</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            THE SERVICE IS NOT INTENDED FOR USE IN MEDICAL EMERGENCIES OR URGENT SITUATIONS. IF YOU ARE EXPERIENCING A MEDICAL EMERGENCY, YOU SHOULD IMMEDIATELY:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Call your local emergency services number (such as 999 or 911) immediately</li>
                            <li>Go to the nearest emergency room or urgent care facility</li>
                            <li>Seek immediate in-person medical attention</li>
                            <li>Do not delay seeking emergency medical care because of information obtained through the Service</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            Examples of medical emergencies include but are not limited to: chest pain, difficulty breathing, severe allergic reactions, loss of consciousness, severe trauma, suspected stroke or heart attack, severe burns, poisoning, or any condition that you believe may be life-threatening.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Limitations of Telemedicine</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            Telemedicine consultations have inherent limitations that may affect the quality of care:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Healthcare providers cannot perform physical examinations through telemedicine</li>
                            <li>Technical issues, such as poor internet connection or audio/video quality, may interfere with consultations</li>
                            <li>Some medical conditions require in-person evaluation, physical examination, laboratory tests, or imaging studies that cannot be performed remotely</li>
                            <li>Telemedicine may not be appropriate for all medical conditions, symptoms, or situations</li>
                            <li>Healthcare providers may determine that an in-person visit is necessary and may decline to provide treatment through telemedicine</li>
                            <li>Prescription medications may not be appropriate for all conditions treated through telemedicine</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            You acknowledge and agree that telemedicine has limitations and that healthcare providers may recommend or require in-person medical care when appropriate.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Accuracy of Information</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            While we strive to ensure the accuracy and reliability of information on the Service, we do not warrant or guarantee the accuracy, completeness, timeliness, or usefulness of any information, content, or services provided through the platform. Medical knowledge and practices evolve, and information may become outdated. You should not rely solely on information from the Service for medical decision-making.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            You are responsible for providing accurate, complete, and truthful information to healthcare providers. Failure to provide accurate information may result in incorrect diagnosis, inappropriate treatment, or other adverse outcomes for which we are not responsible.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">No Medical Advice from Platform</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            Roudromoyee Online Clinic does not provide medical advice, diagnosis, or treatment. Any information, content, or materials on the Service, including but not limited to text, graphics, images, articles, blog posts, or educational content, are provided for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition, symptom, treatment, or medication. Never disregard professional medical advice or delay in seeking it because of something you have read or learned through the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Healthcare Provider Relationships</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            The relationship between you and healthcare providers who provide services through our platform is independent of Roudromoyee Online Clinic. Healthcare providers are independent contractors and are not our employees, agents, or representatives. We do not control, supervise, or direct the medical judgment, diagnosis, treatment decisions, or professional conduct of healthcare providers.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            Healthcare providers are solely responsible for the medical services they provide, including but not limited to diagnosis, treatment recommendations, prescriptions, and professional judgment. We are not liable for any acts, omissions, errors, or negligence of healthcare providers.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">No Guarantee of Outcomes</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            We do not guarantee, warrant, or represent that any particular medical outcome, result, or benefit will be achieved through the use of the Service. Medical treatment outcomes vary based on numerous factors, including the nature of the condition, patient compliance, individual patient characteristics, and other factors beyond our control. You acknowledge that medical services involve inherent risks and uncertainties.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Prescription Medications</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            If a healthcare provider prescribes medication through the Service:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>You are responsible for informing the healthcare provider of all medications you are currently taking, including prescription drugs, over-the-counter medications, vitamins, and supplements</li>
                            <li>You are responsible for informing the healthcare provider of any allergies, adverse reactions, or medical conditions that may affect the safety of prescribed medications</li>
                            <li>You must follow the healthcare provider's instructions regarding dosage, frequency, and duration of medication use</li>
                            <li>You should not share prescription medications with others or use medications prescribed for someone else</li>
                            <li>You should report any adverse reactions or side effects to your healthcare provider immediately</li>
                            <li>Prescription medications may have side effects, interactions, or contraindications that you should discuss with your healthcare provider</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            We are not responsible for the appropriateness, effectiveness, or safety of medications prescribed by healthcare providers, or for any adverse effects resulting from medication use.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Your Responsibilities</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            When using the Service, you are responsible for:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Providing accurate, complete, and truthful information about your medical history, symptoms, medications, and health status</li>
                            <li>Following the advice and treatment recommendations of healthcare providers</li>
                            <li>Seeking immediate emergency care when experiencing medical emergencies</li>
                            <li>Following up with healthcare providers as recommended</li>
                            <li>Informing healthcare providers of any changes in your condition or any adverse reactions to treatment</li>
                            <li>Maintaining continuity of care with your primary care physician or other healthcare providers when appropriate</li>
                            <li>Understanding the limitations of telemedicine and seeking in-person care when necessary</li>
                            <li>Ensuring you have adequate internet connection and technical equipment for telemedicine consultations</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">No Liability for Medical Decisions</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, ROUDROMOYEE ONLINE CLINIC, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY MEDICAL DECISIONS, DIAGNOSES, TREATMENTS, PRESCRIPTIONS, OR OUTCOMES RESULTING FROM THE USE OF THE SERVICE OR INTERACTIONS WITH HEALTHCARE PROVIDERS. WE ARE NOT RESPONSIBLE FOR THE QUALITY, ACCURACY, OR APPROPRIATENESS OF MEDICAL SERVICES PROVIDED BY HEALTHCARE PROVIDERS.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Third-Party Content and Links</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            The Service may contain links to third-party websites, resources, or content. We do not endorse, control, or assume responsibility for any third-party content, websites, or services. Accessing third-party content is at your own risk, and you should review the terms and privacy policies of any third-party websites you visit.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Changes to This Disclaimer</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            We reserve the right to modify this Medical Disclaimer at any time. Material changes will be posted on the Service with an updated "Last Updated" date. Your continued use of the Service after such changes constitutes acceptance of the updated disclaimer. You are responsible for reviewing this disclaimer periodically to stay informed of any changes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Acknowledgment</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO THIS MEDICAL DISCLAIMER. YOU UNDERSTAND THAT THE SERVICE IS NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL CARE AND THAT YOU SHOULD SEEK APPROPRIATE MEDICAL ATTENTION WHEN NECESSARY. YOU ASSUME ALL RISKS ASSOCIATED WITH THE USE OF THE SERVICE AND MEDICAL SERVICES PROVIDED THROUGH THE PLATFORM.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Information</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                            If you have questions about this Medical Disclaimer, please contact us at:
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

export default MedicalDisclaimer;

