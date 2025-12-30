import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root text-text-main dark:text-white transition-colors duration-300">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-white dark:bg-background-dark overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" data-aos="fade-left" data-aos-duration="2000"></div>
                    <div className="absolute top-40 -left-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" data-aos="fade-right" data-aos-duration="2000"></div>

                    <div className="layout-container flex h-full grow flex-col relative z-10">
                        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-8 md:py-16">
                            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                                <div>
                                    <div className="flex flex-col-reverse gap-8 px-4 lg:flex-row lg:items-center">
                                        <div className="flex flex-col gap-6 flex-[1.5] lg:pr-8 text-center lg:text-left" data-aos="fade-up" data-aos-duration="1000">
                                            <div className="flex flex-col gap-3">
                                                <div className="inline-flex items-center gap-2 self-center lg:self-start bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20 hover:bg-secondary/20 transition-colors cursor-default">
                                                    <span className="material-symbols-outlined text-secondary text-sm">verified</span>
                                                    <span className="text-secondary text-sm font-semibold">বিশ্বস্ত টেলিমেডিসিন সেবা</span>
                                                </div>
                                                <h1 className="text-text-main dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                                                    আপনার স্বাস্থ্য, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">আমাদের দায়িত্ব</span>
                                                </h1>
                                                <h2 className="text-text-sub dark:text-gray-300 text-lg md:text-xl font-normal leading-relaxed mt-2 max-w-lg mx-auto lg:mx-0">
                                                    ঘরে বসেই অভিজ্ঞ ডাক্তারের পরামর্শ নিন। কোনো সিরিয়াল ধরার ঝামেলা ছাড়াই, আপনার এবং আপনার পরিবারের সুস্বাস্থ্য নিশ্চিত করুন।
                                                </h2>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-2">
                                                <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-primary hover:bg-red-700 hover:-translate-y-1 transition-all text-white text-base font-bold shadow-lg shadow-primary/30 active:scale-95 group">
                                                    <span className="truncate group-hover:mr-2 transition-all">অনলাইন কনসাল্টেশন নিন</span>
                                                    <span className="material-symbols-outlined ml-2 text-xl group-hover:scale-110 transition-transform">video_call</span>
                                                </button>
                                                <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-white border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:hover:bg-gray-800/50 text-text-main dark:text-white text-base font-bold transition-all hover:-translate-y-1 active:scale-95">
                                                    <span className="truncate">অ্যাপ ডাউনলোড করুন</span>
                                                    <span className="material-symbols-outlined ml-2 text-xl">download</span>
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-6 mt-4 justify-center lg:justify-start text-sm text-text-sub dark:text-gray-400">
                                                <div className="flex items-center gap-2 group cursor-default">
                                                    <span className="material-symbols-outlined text-green-600 icon-filled group-hover:scale-110 transition-transform">check_circle</span>
                                                    <span className="group-hover:text-green-600 transition-colors">৫০+ বিশেষজ্ঞ ডাক্তার</span>
                                                </div>
                                                <div className="flex items-center gap-2 group cursor-default">
                                                    <span className="material-symbols-outlined text-green-600 icon-filled group-hover:scale-110 transition-transform">check_circle</span>
                                                    <span className="group-hover:text-green-600 transition-colors">৫০০০+ রোগী সেবা</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full flex justify-end" data-aos="fade-left" data-aos-duration="1200" data-aos-delay="200">
                                            <div className="w-full max-w-[380px] h-[320px] rounded-3xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative shadow-2xl shadow-gray-200 dark:shadow-black/50 hover:shadow-primary/20 transition-shadow duration-500">
                                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700" style={{ backgroundImage: 'url("https://res.cloudinary.com/dzjrhl1vi/image/upload/v1766557263/uploads/1766557242708-ChatGPT%20Image%20Dec%2023%2C%202025%2C%2010_34_23%20PM.png.png")' }}></div>
                                                {/* Decorative floating elements */}

                                                <div className="absolute top-6 right-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-float">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust Indicators */}
                <section className="border-y border-border-color bg-gray-50 dark:bg-gray-900/50 py-10" data-aos="fade-up" data-aos-offset="100">
                    <div className="layout-container">
                        <div className="px-4 md:px-10 lg:px-40 flex justify-center">
                            <div className="layout-content-container max-w-[960px] w-full flex flex-wrap justify-center md:justify-between gap-8 md:gap-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <div className="flex items-center gap-3 font-bold text-lg md:text-xl text-gray-500 hover:text-primary transition-colors cursor-default group">
                                    <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">local_hospital</span> BMDC Verified
                                </div>
                                <div className="flex items-center gap-3 font-bold text-lg md:text-xl text-gray-500 hover:text-secondary transition-colors cursor-default group">
                                    <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">security</span> SSL Secured
                                </div>
                                <div className="flex items-center gap-3 font-bold text-lg md:text-xl text-gray-500 hover:text-blue-600 transition-colors cursor-default group">
                                    <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">workspace_premium</span> ISO Certified
                                </div>
                                <div className="flex items-center gap-3 font-bold text-lg md:text-xl text-gray-500 hover:text-green-600 transition-colors cursor-default group">
                                    <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">support_agent</span> 24/7 Support
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-16 md:py-24 bg-background-light dark:bg-background-dark relative" id="services">
                    <div className="layout-container flex flex-col items-center">
                        <div className="px-4 md:px-10 lg:px-40 w-full flex justify-center">
                            <div className="layout-content-container flex flex-col max-w-[960px] w-full gap-12">
                                <div className="flex flex-col items-center text-center gap-4" data-aos="fade-up">
                                    <span className="text-primary font-bold tracking-widest uppercase text-xs bg-primary/10 px-3 py-1 rounded-full">আমাদের সেবাসমূহ</span>
                                    <h2 className="text-text-main dark:text-white text-3xl md:text-5xl font-bold leading-tight">বিশেষায়িত স্বাস্থ্যসেবা</h2>
                                    <p className="text-text-sub dark:text-gray-400 max-w-2xl text-lg">আপনার এবং আপনার পরিবারের জন্য আমাদের রয়েছে অভিজ্ঞ ডাক্তারদের নিয়ে গঠিত বিশেষায়িত বিভাগ।</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                    {/* Service 1 */}
                                    <div className="group bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-transparent hover:border-primary/20 flex flex-col items-center text-center gap-6 cursor-pointer hover:-translate-y-2" data-aos="fade-up" data-aos-delay="0">
                                        <div className="size-20 rounded-full bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-300 group-hover:scale-110 group-hover:bg-pink-100 transition-all duration-300">
                                            <span className="material-symbols-outlined text-4xl">pregnant_woman</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">গাইনোকোলজি</h3>
                                            <p className="text-sm text-text-sub dark:text-gray-400">মহিলাদের স্বাস্থ্য ও প্রসূতি সেবা</p>
                                        </div>
                                    </div>
                                    {/* Service 2 */}
                                    <div className="group bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-transparent hover:border-primary/20 flex flex-col items-center text-center gap-6 cursor-pointer hover:-translate-y-2" data-aos="fade-up" data-aos-delay="100">
                                        <div className="size-20 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                                            <span className="material-symbols-outlined text-4xl">stethoscope</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">জেনারেল মেডিসিন</h3>
                                            <p className="text-sm text-text-sub dark:text-gray-400">সাধারণ রোগ ও পরামর্শ</p>
                                        </div>
                                    </div>
                                    {/* Service 3 */}
                                    <div className="group bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-transparent hover:border-primary/20 flex flex-col items-center text-center gap-6 cursor-pointer hover:-translate-y-2" data-aos="fade-up" data-aos-delay="200">
                                        <div className="size-20 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-300 group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
                                            <span className="material-symbols-outlined text-4xl">child_care</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">পেডিয়াট্রিক্স</h3>
                                            <p className="text-sm text-text-sub dark:text-gray-400">শিশুদের স্বাস্থ্য ও যত্ন</p>
                                        </div>
                                    </div>
                                    {/* Service 4 */}
                                    <div className="group bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-transparent hover:border-primary/20 flex flex-col items-center text-center gap-6 cursor-pointer hover:-translate-y-2" data-aos="fade-up" data-aos-delay="300">
                                        <div className="size-20 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-300 group-hover:scale-110 group-hover:bg-teal-100 transition-all duration-300">
                                            <span className="material-symbols-outlined text-4xl">dermatology</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">ডার্মাটোলজি</h3>
                                            <p className="text-sm text-text-sub dark:text-gray-400">চর্ম ও যৌন রোগ</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center mt-6">
                                    <Link to="/services" className="flex items-center justify-center gap-2 text-primary font-bold hover:gap-4 transition-all group px-4 py-2 hover:bg-primary/5 rounded-full">
                                        সকল সেবা দেখুন <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                <section className="py-16 md:py-24 bg-white dark:bg-surface-dark/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                    <div className="layout-container flex flex-col items-center relative z-10">
                        <div className="px-4 md:px-10 lg:px-40 w-full flex justify-center">
                            <div className="layout-content-container flex flex-col max-w-[960px] w-full gap-12">
                                <div className="flex flex-col md:flex-row gap-10 items-start md:items-center justify-between" data-aos="fade-left">
                                    <div className="flex flex-col gap-4 max-w-lg">
                                        <span className="text-primary font-bold tracking-widest uppercase text-xs">সহজ প্রক্রিয়া</span>
                                        <h2 className="text-secondary dark:text-teal-400 text-3xl md:text-5xl font-bold leading-tight">
                                            কিভাবে কাজ করে?
                                        </h2>
                                        <p className="text-text-main dark:text-gray-300 text-base font-normal leading-normal">মাত্র ৩টি সহজ ধাপে ঘরে বসেই অভিজ্ঞ ডাক্তারের পরামর্শ নিন। কোনো প্রযুক্তিগত জ্ঞান ছাড়াই খুব সহজে ব্যবহারযোগ্য।</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Step 1 */}
                                    <div className="relative flex flex-col gap-6 rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-surface-dark p-8 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2" data-aos="fade-up" data-aos-delay="0">
                                        <div className="absolute -top-5 -right-5 size-14 rounded-full bg-secondary text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-secondary/30 group-hover:scale-110 transition-transform">১</div>
                                        <div className="text-primary bg-primary/5 w-fit p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <span className="material-symbols-outlined text-4xl">calendar_month</span>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <h3 className="text-text-main dark:text-white text-xl font-bold leading-tight">অ্যাপয়েন্টমেন্ট বুক করুন</h3>
                                            <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed">আপনার সমস্যার ধরণ অনুযায়ী পছন্দের ডাক্তার এবং সুবিধাজনক সময় নির্বাচন করুন।</p>
                                        </div>
                                    </div>
                                    {/* Step 2 */}
                                    <div className="relative flex flex-col gap-6 rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-surface-dark p-8 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2" data-aos="fade-up" data-aos-delay="150">
                                        <div className="absolute -top-5 -right-5 size-14 rounded-full bg-secondary text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-secondary/30 group-hover:scale-110 transition-transform">২</div>
                                        <div className="text-primary bg-primary/5 w-fit p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <span className="material-symbols-outlined text-4xl">payments</span>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <h3 className="text-text-main dark:text-white text-xl font-bold leading-tight">পেমেন্ট সম্পন্ন করুন</h3>
                                            <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed">বিকাশ, নগদ বা রকেটের মাধ্যমে খুব সহজেই পেমেন্ট সম্পন্ন করে বুকিং নিশ্চিত করুন।</p>
                                        </div>
                                    </div>
                                    {/* Step 3 */}
                                    <div className="relative flex flex-col gap-6 rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-surface-dark p-8 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2" data-aos="fade-up" data-aos-delay="300">
                                        <div className="absolute -top-5 -right-5 size-14 rounded-full bg-secondary text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-secondary/30 group-hover:scale-110 transition-transform">৩</div>
                                        <div className="text-primary bg-primary/5 w-fit p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <span className="material-symbols-outlined text-4xl">video_camera_front</span>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <h3 className="text-text-main dark:text-white text-xl font-bold leading-tight">ভিডিও কলে কথা বলুন</h3>
                                            <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed">নির্দিষ্ট সময়ে অ্যাপের মাধ্যমে ডাক্তারের সাথে ভিডিও কলে যুক্ত হয়ে পরামর্শ নিন।</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Doctors Preview Section */}
                <section className="py-16 md:py-24 bg-background-light dark:bg-background-dark" id="doctors">
                    <div className="layout-container flex flex-col items-center">
                        <div className="px-4 md:px-10 lg:px-40 w-full flex justify-center">
                            <div className="layout-content-container flex flex-col max-w-[960px] w-full gap-12">
                                <div className="flex items-end justify-between" data-aos="fade-right">
                                    <div className="flex flex-col gap-4">
                                        <span className="text-primary font-bold tracking-widest uppercase text-xs">আমাদের বিশেষজ্ঞ ডাক্তারগণ</span>
                                        <h2 className="text-text-main dark:text-white text-3xl md:text-5xl font-bold leading-tight">সেরা ডাক্তারদের খুঁজুন</h2>
                                    </div>
                                    <a href="/doctors" className="hidden md:flex items-center gap-1 text-secondary font-bold hover:underline hover:gap-2 transition-all">
                                        সকল ডাক্তার দেখুন <span className="material-symbols-outlined text-sm">arrow_outward</span>
                                    </a>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                    {/* Doctor Card 1 */}
                                    <div className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1" data-aos="fade-up" data-aos-delay="0">
                                        <div className="flex items-start gap-4">
                                            <div className="size-24 rounded-2xl bg-gray-200 bg-cover bg-center shrink-0 transition-transform duration-500 shadow-md" style={{ backgroundImage: 'url("https://res.cloudinary.com/dzjrhl1vi/image/upload/v1766557263/uploads/1766557242708-ChatGPT%20Image%20Dec%2023%2C%202025%2C%2010_34_23%20PM.png.png")' }}></div>
                                            <div className="flex flex-col">
                                                <h3 className="text-xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">ডাঃ ফারহানা আহমেদ</h3>
                                                <p className="text-sm text-secondary font-medium">গাইনোকোলজি বিশেষজ্ঞ</p>
                                                <p className="text-xs text-text-sub dark:text-gray-400 mt-1">MBBS, FCPS (Gynae)</p>
                                                <div className="flex items-center gap-1 mt-2 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-md w-fit">
                                                    <span className="material-symbols-outlined text-yellow-400 text-sm icon-filled">star</span>
                                                    <span className="text-xs font-bold text-text-main dark:text-white">4.9</span>
                                                    <span className="text-xs text-text-sub dark:text-gray-400 ml-1">(120)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-text-sub dark:text-gray-400">কনসাল্টেশন ফি</span>
                                                <span className="text-lg font-bold text-primary">৳ ৫০০</span>
                                            </div>
                                            <button className="bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm">
                                                বুক করুন
                                            </button>
                                        </div>
                                    </div>
                                    {/* Doctor Card 2 */}
                                    <div className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1" data-aos="fade-up" data-aos-delay="100">
                                        <div className="flex items-start gap-4">
                                            <div className="size-24 rounded-2xl bg-gray-200 bg-cover bg-center shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-md" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDkJykY5wpEcOJ8mjglODSMzCjX1ykvDW34xLcqwaD8ydOMKUYVAyRQWQQQmjvRuW-XA1EGYvC3uMUotY5fWT3UsE7SzyYwV9FB353yWdxNwgJ8bintfjLfqk58pvxVYLdjMXgYrb9Xz6glS-XW51-uH8XQFov8TyvNWAL9WEBxOhBvrN2yTybTnvQOVwbOOueFlLBwqN58i2frzX8wEgPircao59MKeZ7H--4zIT_iSck6oFjwcp3JrqK8lQCdlwdEx8INXeNs0BY")' }}></div>
                                            <div className="flex flex-col">
                                                <h3 className="text-xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">ডাঃ রফিক ইসলাম</h3>
                                                <p className="text-sm text-secondary font-medium">জেনারেল ফিজিশিয়ান</p>
                                                <p className="text-xs text-text-sub dark:text-gray-400 mt-1">MBBS, MD (Medicine)</p>
                                                <div className="flex items-center gap-1 mt-2 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-md w-fit">
                                                    <span className="material-symbols-outlined text-yellow-400 text-sm icon-filled">star</span>
                                                    <span className="text-xs font-bold text-text-main dark:text-white">4.8</span>
                                                    <span className="text-xs text-text-sub dark:text-gray-400 ml-1">(85)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-text-sub dark:text-gray-400">কনসাল্টেশন ফি</span>
                                                <span className="text-lg font-bold text-primary">৳ ৩০০</span>
                                            </div>
                                            <button className="bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm">
                                                বুক করুন
                                            </button>
                                        </div>
                                    </div>
                                    {/* Doctor Card 3 */}
                                    <div className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1" data-aos="fade-up" data-aos-delay="200">
                                        <div className="flex items-start gap-4">
                                            <div className="size-24 rounded-2xl bg-gray-200 bg-cover bg-center shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-md" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCnER4a7tWBK9RVjn4-9u3SqR7U1SeTHffyHdxFj7KvK5mm8ZlUnDUcM8pLIu9d5I0Nfx9JOUBhtMXxHx2LSWwMk1fubPwhHx_CTR0fHJOmT_Qyx_lWv9qhsZ_G1uEoY9NBeGpRvToswQd6vQwgxHechQdVw5dAL80m0W0jbJMvovOqWa3V9qKpTsUovMymeeRGFNg4wrffntjfhiPEDD6d03xTATglIujPpKCjKmBPI0Kz70aX1tBKFnIhYZVvTVBikTUfBwRowOE")' }}></div>
                                            <div className="flex flex-col">
                                                <h3 className="text-xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">ডাঃ নায়লা খান</h3>
                                                <p className="text-sm text-secondary font-medium">শিশু বিশেষজ্ঞ</p>
                                                <p className="text-xs text-text-sub dark:text-gray-400 mt-1">MBBS, DCH</p>
                                                <div className="flex items-center gap-1 mt-2 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-md w-fit">
                                                    <span className="material-symbols-outlined text-yellow-400 text-sm icon-filled">star</span>
                                                    <span className="text-xs font-bold text-text-main dark:text-white">5.0</span>
                                                    <span className="text-xs text-text-sub dark:text-gray-400 ml-1">(200)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-text-sub dark:text-gray-400">কনসাল্টেশন ফি</span>
                                                <span className="text-lg font-bold text-primary">৳ ৪০০</span>
                                            </div>
                                            <button className="bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm">
                                                বুক করুন
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <a href="/doctors" className="md:hidden flex justify-center items-center gap-1 text-secondary font-bold hover:underline mt-8">
                                    সকল ডাক্তার দেখুন <span className="material-symbols-outlined text-sm">arrow_outward</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-background-light dark:bg-background-dark">
                    <div className="layout-container">
                        <div className="px-4 md:px-10 lg:px-40 flex justify-center">
                            <div className="layout-content-container max-w-[960px] w-full flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-primary to-orange-600 rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-primary/30 relative overflow-hidden group">
                                {/* Decorative Circles */}
                                <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-black/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>

                                <div className="flex flex-col gap-6 text-center md:text-left z-10 flex-1">
                                    <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight">জরুরী ডাক্তার প্রয়োজন?</h2>
                                    <p className="text-white/90 text-lg md:text-xl font-medium">আমাদের হটলাইন নাম্বারে কল করুন অথবা হোয়াটসঅ্যাপে মেসেজ দিন। আমরা আছি আপনার পাশে।</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 z-10 w-full md:w-auto">
                                    <button className="bg-white text-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all w-full md:w-auto">
                                        <span className="material-symbols-outlined icon-filled">call</span> ১৬২৬৩
                                    </button>
                                    <button className="bg-green-500 text-white hover:bg-green-600 font-bold py-4 px-8 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all w-full md:w-auto">
                                        <span className="material-symbols-outlined">chat</span> WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Sticky Floating Action Button */}
            <a href="#" aria-label="Chat on WhatsApp" className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-xl hover:scale-110 transition-transform flex items-center justify-center group">
                <span className="material-symbols-outlined text-3xl">chat</span>
                <span className="absolute right-full mr-4 bg-white dark:bg-gray-800 text-text-main dark:text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    চ্যাট করুন
                </span>
            </a>

            <Footer />
        </div>
    );
};

export default Home;
