import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CONTACT } from '../config';

const Contact = () => {
    // FAQ State
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <div className="flex flex-col min-h-screen font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-300">
            <Header />

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Page Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <p className="text-xs sm:text-sm font-bold tracking-widest text-secondary dark:text-teal-400 uppercase mb-2 sm:mb-3">সাহায্য প্রয়োজন?</p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-main dark:text-white leading-tight font-display mb-4 sm:mb-6">
                        যোগাযোগ
                    </h1>
                    <p className="text-base sm:text-lg text-text-sub dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        যেকোনো প্রশ্ন, অ্যাপয়েন্টমেন্ট বা পরামর্শের জন্য আমাদের সাথে যোগাযোগ করুন। আমরা আপনার পাশে আছি, সর্বদা।
                    </p>
                </div>

                {/* Contact Information Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl sm:text-3xl text-primary">call</span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-text-main dark:text-white">মোবাইল</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-text-sub dark:text-gray-400 mb-2 sm:mb-3">সরাসরি কল করুন</p>
                        <a className="text-base sm:text-lg font-medium hover:text-primary transition-colors block break-words" href={`tel:${CONTACT.phone}`}>
                            {CONTACT.phoneDisplay}
                        </a>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl sm:text-3xl text-secondary dark:text-teal-400">mail</span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-text-main dark:text-white">ইমেইল</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-text-sub dark:text-gray-400 mb-2 sm:mb-3">বিস্তারিত লিখুন</p>
                        <a className="text-sm sm:text-base font-medium hover:text-primary transition-colors block break-all" href={`mailto:${CONTACT.email}`}>
                            {CONTACT.email}
                        </a>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl sm:text-3xl text-blue-600 dark:text-blue-400">groups</span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-text-main dark:text-white">সোশ্যাল মিডিয়া</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-text-sub dark:text-gray-400 mb-2 sm:mb-3">ফলো করুন</p>
                        <a className="text-base sm:text-lg font-medium hover:text-primary transition-colors inline-flex items-center gap-1 group" href="https://www.facebook.com/share/1JWe4pK4T6/" target="_blank" rel="noreferrer">
                            ফেইসবুক পেইজ <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_outward</span>
                        </a>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl sm:text-3xl text-green-600 dark:text-green-400">location_on</span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-text-main dark:text-white">ঠিকানা</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-text-sub dark:text-gray-400 mb-2 sm:mb-3">আমাদের ক্লিনিক</p>
                        <p className="text-sm sm:text-base font-medium leading-relaxed">
                            {CONTACT.address}
                        </p>
                    </div>
                </div>

                {/* Emergency Contact Card */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 border border-primary/20 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                        <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary">emergency</span>
                        <h2 className="text-xl sm:text-2xl font-bold text-text-main dark:text-white">জরুরী প্রয়োজনে</h2>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-primary mb-2 sm:mb-3">
                        <a href={`tel:${CONTACT.phone}`} className="hover:underline">{CONTACT.phoneDisplay}</a>
                    </p>
                    <p className="text-xs sm:text-sm text-text-sub dark:text-gray-400">২৪/৭ আমাদের হটলাইন খোলা থাকে</p>
                </div>

                {/* FAQ Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8 sm:pt-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-main dark:text-white mb-6 sm:mb-8 text-center sm:text-left">সচরাচর জিজ্ঞাসা (FAQ)</h2>
                    <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto sm:mx-0">
                        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-5 cursor-pointer shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700" onClick={() => toggleFAQ(0)}>
                            <div className="flex items-center justify-between font-medium text-text-main dark:text-white">
                                <span className="text-sm sm:text-base pr-4">কিভাবে অ্যাপয়েন্টমেন্ট বুক করব?</span>
                                <span className={`material-symbols-outlined text-xl sm:text-2xl transition-transform duration-300 flex-shrink-0 ${openFAQ === 0 ? '-rotate-180' : ''}`}>expand_more</span>
                            </div>
                            {openFAQ === 0 && (
                                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-text-sub dark:text-gray-400 leading-relaxed">
                                    আপনি আমাদের ওয়েবসাইটের মাধ্যমে অথবা সরাসরি মোবাইল নম্বরে কল করে অ্যাপয়েন্টমেন্ট বুক করতে পারেন।
                                </p>
                            )}
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-5 cursor-pointer shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700" onClick={() => toggleFAQ(1)}>
                            <div className="flex items-center justify-between font-medium text-text-main dark:text-white">
                                <span className="text-sm sm:text-base pr-4">আপনারা কি অনলাইন পরামর্শ দেন?</span>
                                <span className={`material-symbols-outlined text-xl sm:text-2xl transition-transform duration-300 flex-shrink-0 ${openFAQ === 1 ? '-rotate-180' : ''}`}>expand_more</span>
                            </div>
                            {openFAQ === 1 && (
                                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-text-sub dark:text-gray-400 leading-relaxed">
                                    হ্যাঁ, আমরা ভিডিও কলের মাধ্যমে বিশেষজ্ঞ ডাক্তারের পরামর্শ সেবা প্রদান করি।
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
