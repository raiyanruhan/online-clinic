import { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const SERVICES = [
    {
        id: 1,
        name: 'গাইনোকোলজি',
        category: 'গাইনোকোলজি',
        description: 'গর্ভকালীন সেবা, প্রসব পরবর্তী যত্ন এবং নারীদের সব ধরনের জটিল রোগের বিশেষজ্ঞ চিকিৎসা।',
        icon: 'pregnant_woman',
        color: 'rose',
        link: '/doctors?category=গাইনোকোলজি'
    },
    {
        id: 2,
        name: 'শিশুরোগ',
        category: 'শিশুরোগ',
        description: 'নবজাতক থেকে কিশোর পর্যন্ত শিশুদের সব ধরণের রোগের যত্ন ও টীকাদান কর্মসূচি।',
        icon: 'child_care',
        color: 'blue',
        link: '/doctors?category=শিশুরোগ'
    },
    {
        id: 3,
        name: 'জেনারেল মেডিসিন',
        category: 'জেনারেল মেডিসিন',
        description: 'ঠান্ডা, জ্বর, ইনফেকশন সহ সাধারণ যে কোনো স্বাস্থ্য সমস্যার প্রাথমিক ও উন্নত চিকিৎসা।',
        icon: 'stethoscope',
        color: 'emerald',
        link: '/doctors?category=জেনারেল মেডিসিন'
    },
    {
        id: 4,
        name: 'মানসিক স্বাস্থ্য',
        category: 'মানসিক স্বাস্থ্য',
        description: 'মানসিক চাপ, উদ্বেগ এবং হতাশা কাটিয়ে উঠতে বিশেষজ্ঞ কাউন্সেলিং এবং থেরাপি।',
        icon: 'psychology',
        color: 'purple',
        link: '/doctors?category=মানসিক স্বাস্থ্য'
    },
    {
        id: 5,
        name: 'পুষ্টি ও ডায়েট',
        category: 'পুষ্টি ও ডায়েট',
        description: 'স্বাস্থ্যকর জীবনযাপনের জন্য ব্যক্তিগত ডায়েট চার্ট এবং পুষ্টি পরামর্শ।',
        icon: 'nutrition',
        color: 'orange',
        link: '/doctors?category=পুষ্টি ও ডায়েট'
    },
    {
        id: 6,
        name: 'চর্মরোগ',
        category: 'চর্মরোগ',
        description: 'ত্বক, চুল এবং নখের যেকোনো সমস্যার জন্য আধুনিক ও কার্যকর চিকিৎসা ব্যবস্থা।',
        icon: 'dermatology',
        color: 'pink',
        link: '/doctors?category=চর্মরোগ'
    },
    {
        id: 7,
        name: 'ডায়াবেটিস কেয়ার',
        category: 'ডায়াবেটিস কেয়ার',
        description: 'ডায়াবেটিস নিয়ন্ত্রণ ও জীবনযাত্রার মান উন্নয়নে বিশেষজ্ঞ পরামর্শ ও নিয়মিত চেকআপ।',
        icon: 'blood_pressure',
        color: 'cyan',
        link: '/doctors?category=ডায়াবেটিস কেয়ার'
    },
    {
        id: 8,
        name: 'ভিডিও কনসালটেশন',
        category: 'ভিডিও কনসালটেশন',
        description: 'ঘরে বসেই অভিজ্ঞ ডাক্তারের সাথে ভিডিও কলের মাধ্যমে সরাসরি পরামর্শ নিন।',
        icon: 'video_call',
        color: 'indigo',
        link: '/doctors?category=ভিডিও কনসালটেশন'
    },
];

const Services = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const filteredServices = useMemo(() => {
        return SERVICES.filter(service => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    service.name?.toLowerCase().includes(query) ||
                    service.description?.toLowerCase().includes(query) ||
                    service.category?.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            return true;
        });
    }, [searchQuery]);

    const handleViewDoctors = (link: string) => {
        navigate(link);
    };
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

                {/* Search Bar */}
                <div className="sticky top-[72px] z-40 w-full bg-[#FAFAFA]/95 dark:bg-[#201212]/95 backdrop-blur-sm py-4 border-b border-gray-200/50 dark:border-gray-800/50">
                    <div className="layout-container px-4 md:px-10 lg:px-40">
                        <div className="flex justify-center">
                            <div className="relative w-full max-w-md">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="material-symbols-outlined text-gray-400">search</span>
                                </div>
                                <input
                                    className="block w-full rounded-lg border-0 bg-white py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6 dark:bg-[#2a2a2a] dark:text-white dark:ring-gray-700"
                                    placeholder="সেবা খুঁজুন (যেমন: শিশুরোগ, ডায়াবেটিস)..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                <section className="py-12 bg-background-light dark:bg-background-dark">
                    <div className="layout-container px-4 md:px-10 lg:px-40">
                        {filteredServices.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                                <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">search_off</span>
                                <p className="text-gray-500 mb-4">কোন সেবা পাওয়া যায়নি।</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                    }}
                                    className="text-primary font-bold hover:underline"
                                >
                                    ফিল্টার সাফ করুন
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredServices.map((service) => {
                                    const colorClasses: Record<string, string> = {
                                        rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
                                        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                                        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
                                        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                                        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
                                        pink: 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
                                        cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
                                        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
                                    };

                                    return (
                                        <div
                                            key={service.id}
                                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:bg-[#2a2a2a] dark:border-gray-700 text-center"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full ${colorClasses[service.color]}`}>
                                                    <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                                                </div>
                                                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{service.name}</h3>
                                                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700 flex justify-center">
                                                <button
                                                    onClick={() => handleViewDoctors(service.link)}
                                                    className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group-hover:gap-2"
                                                >
                                                    আরও জানুন <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
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
