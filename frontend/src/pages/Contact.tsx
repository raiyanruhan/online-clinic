import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
    // FAQ State
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <div className="flex flex-col min-h-screen font-display bg-[#FAFAFA] dark:bg-[#1a1a1a] text-[#333333] dark:text-[#e5e5e5] transition-colors duration-300">
            <Header />
            
            <main className="flex-grow flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto overflow-hidden">
                <div className="w-full lg:w-1/2 p-6 lg:p-16 flex flex-col justify-center">
                    <div className="mb-12">
                        <p className="text-sm font-bold tracking-widest text-[#1F8A9E] uppercase mb-2">সাহায্য প্রয়োজন?</p>
                        <h1 className="text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight text-[#333333] dark:text-[#e5e5e5] leading-none font-display">
                            যোগাযোগ
                        </h1>
                    </div>
                    <div className="mb-12 max-w-md">
                        <p className="text-lg text-[#555555] dark:text-[#a3a3a3] leading-relaxed">
                            যেকোনো প্রশ্ন, অ্যাপয়েন্টমেন্ট বা পরামর্শের জন্য আমাদের সাথে যোগাযোগ করুন। আমরা আপনার পাশে আছি, সর্বদা।
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8 mb-16">
                        <div className="group">
                            <h3 className="text-xl font-bold text-[#1F8A9E] mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-2xl">call</span>
                                মোবাইল
                            </h3>
                            <p className="text-sm text-[#555555] dark:text-[#a3a3a3] mb-1">সরাসরি কল করুন</p>
                            <a className="text-lg font-medium hover:text-[#C62828] transition-colors block" href="tel:+8801993609470">
                                +৮৮০ ১৯৯৩-৬০৯৪৭০
                            </a>
                        </div>
                        <div className="group">
                            <h3 className="text-xl font-bold text-[#1F8A9E] mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-2xl">mail</span>
                                ইমেইল
                            </h3>
                            <p className="text-sm text-[#555555] dark:text-[#a3a3a3] mb-1">বিস্তারিত লিখুন</p>
                            <a className="text-lg font-medium hover:text-[#C62828] transition-colors block break-words" href="mailto:roudromoyee.clinic@gmail.com">
                                roudromoyee.clinic@gmail.com
                            </a>
                        </div>
                        <div className="group">
                            <h3 className="text-xl font-bold text-[#1F8A9E] mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-2xl">public</span>
                                সোশ্যাল মিডিয়া
                            </h3>
                            <p className="text-sm text-[#555555] dark:text-[#a3a3a3] mb-1">ফলো করুন</p>
                            <a className="text-lg font-medium hover:text-[#C62828] transition-colors inline-flex items-center gap-1 group-hover:gap-2 duration-300" href="https://www.facebook.com/share/1JWe4pK4T6/" target="_blank" rel="noreferrer">
                                ফেইসবুক পেইজ <span className="material-symbols-outlined text-sm">arrow_outward</span>
                            </a>
                        </div>
                        <div className="group">
                            <h3 className="text-xl font-bold text-[#1F8A9E] mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-2xl">location_on</span>
                                ঠিকানা
                            </h3>
                            <p className="text-sm text-[#555555] dark:text-[#a3a3a3] mb-1">আমাদের ক্লিনিক</p>
                            <p className="text-lg font-medium">
                                বাড়ি #১২, রোড #৪, ধানমন্ডি,<br />ঢাকা - ১২০৫, বাংলাদেশ
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-10">
                        <h2 className="text-2xl font-bold text-[#333333] dark:text-[#e5e5e5] mb-6">সচরাচর জিজ্ঞাসা (FAQ)</h2>
                        <div className="space-y-4">
                            <div className="group bg-[#EDEDED] dark:bg-[#2d2d2d] rounded-lg p-4 cursor-pointer" onClick={() => toggleFAQ(0)}>
                                <div className="flex items-center justify-between font-medium text-[#333333] dark:text-[#e5e5e5]">
                                    কিভাবে অ্যাপয়েন্টমেন্ট বুক করব?
                                    <span className={`material-symbols-outlined transition duration-300 ${openFAQ === 0 ? '-rotate-180' : ''}`}>expand_more</span>
                                </div>
                                {openFAQ === 0 && (
                                    <p className="mt-4 text-[#555555] dark:text-[#a3a3a3] leading-relaxed">
                                        আপনি আমাদের ওয়েবসাইটের মাধ্যমে অথবা সরাসরি মোবাইল নম্বরে কল করে অ্যাপয়েন্টমেন্ট বুক করতে পারেন।
                                    </p>
                                )}
                            </div>
                            <div className="group bg-[#EDEDED] dark:bg-[#2d2d2d] rounded-lg p-4 cursor-pointer" onClick={() => toggleFAQ(1)}>
                                <div className="flex items-center justify-between font-medium text-[#333333] dark:text-[#e5e5e5]">
                                    আপনারা কি অনলাইন পরামর্শ দেন?
                                    <span className={`material-symbols-outlined transition duration-300 ${openFAQ === 1 ? '-rotate-180' : ''}`}>expand_more</span>
                                </div>
                                {openFAQ === 1 && (
                                    <p className="mt-4 text-[#555555] dark:text-[#a3a3a3] leading-relaxed">
                                        হ্যাঁ, আমরা ভিডিও কলের মাধ্যমে বিশেষজ্ঞ ডাক্তারের পরামর্শ সেবা প্রদান করি।
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 relative bg-[#F4F7F6] dark:bg-[#2d2d2d] flex items-center justify-center p-10 min-h-[500px]">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#1F8A9E]/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C62828]/5 rounded-full blur-2xl"></div>
                    </div>
                    <div className="relative z-10 w-full max-w-lg aspect-square">
                        <svg className="w-full h-full drop-shadow-lg" fill="none" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="250" cy="250" fill="#EDEDED" opacity="0.5" r="220"></circle>
                            <path d="M180 280 C150 280, 140 250, 160 220 
                 L190 180 C200 165, 215 160, 230 170 
                 L250 185 C260 192, 260 205, 250 215 
                 C270 235, 290 255, 310 275 
                 C320 265, 335 265, 345 275 
                 L365 295 C375 305, 370 325, 355 335 
                 L310 365 C280 385, 250 380, 220 350
                 Z" fill="white" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                            <path d="M220 350 C200 380, 180 390, 150 380 
                 C120 370, 110 340, 130 310
                 C140 295, 160 290, 180 295" fill="none" stroke="#1F8A9E" strokeLinecap="round" strokeWidth="2"></path>
                            <circle cx="250" cy="250" fill="none" r="180" stroke="#1F8A9E" strokeDasharray="4 6" strokeWidth="1.5"></circle>
                            <path d="M350 150 Q400 150 400 200 Q400 230 380 240 L370 260 L350 240 Q300 240 300 200 Q300 150 350 150 Z" fill="white" opacity="0.9" stroke="#333" strokeWidth="2"></path>
                            <circle cx="335" cy="195" fill="#1F8A9E" r="4"></circle>
                            <circle cx="350" cy="195" fill="#1F8A9E" r="4"></circle>
                            <circle cx="365" cy="195" fill="#1F8A9E" r="4"></circle>
                            <circle cx="400" cy="150" fill="#C62828" r="12"></circle>
                            <text fill="white" fontFamily="sans-serif" fontSize="14" fontWeight="bold" x="400" y="155">!</text>
                            <path d="M120 400 Q150 450 220 450 Q280 450 300 400" fill="none" stroke="#1F8A9E" strokeLinecap="round" strokeWidth="3"></path>
                        </svg>
                        <p className="text-center mt-6 text-sm text-gray-500 font-medium tracking-wide">আপনার সুস্থতাই আমাদের অঙ্গীকার</p>
                    </div>
                    <div className="hidden lg:flex absolute bottom-12 right-12 bg-white/90 dark:bg-black/80 backdrop-blur p-6 rounded-xl max-w-xs shadow-xl border border-white/20 z-20">
                        <div>
                            <p className="text-sm font-bold text-[#C62828] mb-1">জরুরী প্রয়োজনে</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">+৮৮০ ১৯৯৩-৬০৯৪৭০</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">২৪/৭ আমাদের হটলাইন খোলা থাকে।</p>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default Contact;
