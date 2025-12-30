import Header from '../components/Header';
import Footer from '../components/Footer';

import { Link } from 'react-router-dom';

const Services = () => {
    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark text-text-main dark:text-white font-body transition-colors duration-300">
            <Header />

            <main className="flex-1">
                {/* Page Heading Section */}
                <section className="bg-white dark:bg-[#1e1e1e] py-12 md:py-16 border-b border-gray-100 dark:border-gray-800">
                    <div className="layout-container text-center px-4 md:px-10 lg:px-40">
                        <div className="flex flex-col items-center gap-4 max-w-3xl mx-auto">
                            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary dark:text-teal-400">
                                <span className="material-symbols-outlined text-sm">verified</span>
                                বিশ্বস্ত স্বাস্থ্যসেবা
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-secondary dark:text-teal-400">
                                আমাদের সেবাসমূহ
                            </h1>
                            <p className="text-lg text-text-sub dark:text-gray-400 leading-relaxed font-normal max-w-2xl">
                                আপনার এবং আপনার পরিবারের সুস্বাস্থ্য নিশ্চিত করতে আমরা আছি সর্বদা পাশে। বিশেষজ্ঞ ডাক্তার এবং আধুনিক প্রযুক্তির সমন্বয়ে আমাদের সেবা।
                            </p>
                        </div>
                    </div>
                </section>

                {/* Search/Filter Bar */}
                <div className="sticky top-[72px] z-40 w-full bg-[#FAFAFA]/95 dark:bg-[#201212]/95 backdrop-blur-sm py-4 border-b border-gray-200/50 dark:border-gray-800/50">
                    <div className="layout-container px-4 md:px-10 lg:px-40">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full sm:max-w-md">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="material-symbols-outlined text-gray-400">search</span>
                                </div>
                                <input
                                    className="block w-full rounded-lg border-0 bg-white py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6 dark:bg-[#2a2a2a] dark:text-white dark:ring-gray-700"
                                    placeholder="সেবা খুঁজুন (যেমন: শিশুরোগ, ডায়াবেটিস)..."
                                    type="text"
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                                <button className="whitespace-nowrap rounded-full bg-secondary text-white px-4 py-1.5 text-sm font-medium hover:bg-secondary/90 transition-colors">সকল সেবা</button>
                                <button className="whitespace-nowrap rounded-full bg-white border border-gray-200 text-gray-600 px-4 py-1.5 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-gray-300">নারী স্বাস্থ্য</button>
                                <button className="whitespace-nowrap rounded-full bg-white border border-gray-200 text-gray-600 px-4 py-1.5 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-gray-300">শিশুরোগ</button>
                                <button className="whitespace-nowrap rounded-full bg-white border border-gray-200 text-gray-600 px-4 py-1.5 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors dark:bg-[#2a2a2a] dark:border-gray-700 dark:text-gray-300">জরুরী সেবা</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                <section className="py-12 bg-background-light dark:bg-background-dark">
                    <div className="layout-container px-4 md:px-10 lg:px-40">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Service Card 1: Gynecology */}
                            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:bg-[#2a2a2a] dark:border-gray-700">
                                <div>
                                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                                        <span className="material-symbols-outlined text-3xl">pregnant_woman</span>
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">গাইনোকোলজি</h3>
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                                        গর্ভকালীন সেবা, প্রসব পরবর্তী যত্ন এবং নারীদের সব ধরনের জটিল রোগের বিশেষজ্ঞ চিকিৎসা।
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                                    <Link className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group-hover:gap-2" to="/doctors?category=গাইনোকোলজি">
                                        আরও জানুন <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                            {/* Service Card 2: Pediatrics */}
                            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:bg-[#2a2a2a] dark:border-gray-700">
                                <div>
                                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <span className="material-symbols-outlined text-3xl">child_care</span>
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">শিশুরোগ</h3>
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                                        নবজাতক থেকে কিশোর পর্যন্ত শিশুদের সব ধরণের রোগের যত্ন ও টীকাদান কর্মসূচি।
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                                    <Link className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group-hover:gap-2" to="/doctors?category=শিশুরোগ">
                                        আরও জানুন <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                            {/* Service Card 3: General Medicine */}
                            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:bg-[#2a2a2a] dark:border-gray-700">
                                <div>
                                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <span className="material-symbols-outlined text-3xl">stethoscope</span>
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">জেনারেল মেডিসিন</h3>
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                                        ঠান্ডা, জ্বর, ইনফেকশন সহ সাধারণ যে কোনো স্বাস্থ্য সমস্যার প্রাথমিক ও উন্নত চিকিৎসা।
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                                    <Link className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group-hover:gap-2" to="/doctors?category=জেনারেল মেডিসিন">
                                        আরও জানুন <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                            {/* Service Card 4: Mental Health */}
                            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:bg-[#2a2a2a] dark:border-gray-700">
                                <div>
                                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                        <span className="material-symbols-outlined text-3xl">psychology</span>
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">মানসিক স্বাস্থ্য</h3>
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                                        মানসিক চাপ, উদ্বেগ এবং হতাশা কাটিয়ে উঠতে বিশেষজ্ঞ কাউন্সেলিং এবং থেরাপি।
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                                    <Link className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group-hover:gap-2" to="/doctors?category=মানসিক স্বাস্থ্য">
                                        আরও জানুন <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                            {/* Service Card 5: Nutrition */}
                            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:bg-[#2a2a2a] dark:border-gray-700">
                                <div>
                                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                        <span className="material-symbols-outlined text-3xl">nutrition</span>
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">পুষ্টি ও ডায়েট</h3>
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                                        স্বাস্থ্যকর জীবনযাপনের জন্য ব্যক্তিগত ডায়েট চার্ট এবং পুষ্টি পরামর্শ।
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                                    <Link className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group-hover:gap-2" to="/doctors?category=পুষ্টি ও ডায়েট">
                                        আরও জানুন <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                            {/* Service Card 6: Dermatology */}
                            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:bg-[#2a2a2a] dark:border-gray-700">
                                <div>
                                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
                                        <span className="material-symbols-outlined text-3xl">dermatology</span>
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">চর্মরোগ</h3>
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                                        ত্বক, চুল এবং নখের যেকোনো সমস্যার জন্য আধুনিক ও কার্যকর চিকিৎসা ব্যবস্থা।
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                                    <Link className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group-hover:gap-2" to="/doctors?category=চর্মরোগ">
                                        আরও জানুন <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                            {/* Service Card 7: Diabetes Care */}
                            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:bg-[#2a2a2a] dark:border-gray-700">
                                <div>
                                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
                                        <span className="material-symbols-outlined text-3xl">blood_pressure</span>
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">ডায়াবেটিস কেয়ার</h3>
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                                        ডায়াবেটিস নিয়ন্ত্রণ ও জীবনযাত্রার মান উন্নয়নে বিশেষজ্ঞ পরামর্শ ও নিয়মিত চেকআপ।
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                                    <Link className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group-hover:gap-2" to="/doctors?category=ডায়াবেটিস কেয়ার">
                                        আরও জানুন <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                            {/* Service Card 8: Telemedicine */}
                            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:bg-[#2a2a2a] dark:border-gray-700">
                                <div>
                                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                        <span className="material-symbols-outlined text-3xl">video_call</span>
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">ভিডিও কনসালটেশন</h3>
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                                        ঘরে বসেই অভিজ্ঞ ডাক্তারের সাথে ভিডিও কলের মাধ্যমে সরাসরি পরামর্শ নিন।
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                                    <Link className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group-hover:gap-2" to="/doctors">
                                        আরও জানুন <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats/Trust Section */}
                <section className="border-y border-gray-200 bg-white py-12 dark:bg-[#1a1a1a] dark:border-gray-800">
                    <div className="layout-container px-4 md:px-10 lg:px-40">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="mb-2 text-4xl font-extrabold text-secondary font-display dark:text-teal-400">৫০+</div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">অভিজ্ঞ ডাক্তার</div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="mb-2 text-4xl font-extrabold text-secondary font-display dark:text-teal-400">১০k+</div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">সেবা গ্রহীতা</div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="mb-2 text-4xl font-extrabold text-secondary font-display dark:text-teal-400">৯৮%</div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">সন্তুষ্ট রোগী</div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="mb-2 text-4xl font-extrabold text-secondary font-display dark:text-teal-400">২৪/৭</div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">সাপোর্ট</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative isolate overflow-hidden bg-[#FAFAFA] dark:bg-[#201212] py-16 sm:py-24">
                    <div className="absolute inset-0 -z-10 opacity-20 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(#c72929 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                    <div className="layout-container px-4 md:px-10 lg:px-40">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                আপনি কি নিশ্চিত নন কোন সেবাটি প্রয়োজন?
                            </h2>
                            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
                                আমাদের সাপোর্ট টিমের সাথে কথা বলুন অথবা অনলাইনে প্রাথমিক চেকআপের জন্য অ্যাপয়েন্টমেন্ট নিন।
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <a className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all" href="#">
                                    অ্যাপয়েন্টমেন্ট নিন
                                </a>
                                <a className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-primary transition-colors flex items-center gap-1" href="#">
                                    <span className="material-symbols-outlined">call</span>
                                    কল করুন: ১৬xxx
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Services;
