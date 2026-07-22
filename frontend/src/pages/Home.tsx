import { API_BASE_URL, CONTACT } from '../config';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SPECIALTIES = [
    { label: 'মেডিসিন', icon: 'stethoscope', color: 'bg-blue-50 text-blue-600', param: 'General Medicine' },
    { label: 'গাইনি', icon: 'pregnant_woman', color: 'bg-pink-50 text-pink-600', param: 'Gynecology & Obs.' },
    { label: 'শিশু', icon: 'child_care', color: 'bg-orange-50 text-orange-600', param: 'Pediatrics' },
    { label: 'দন্ত', icon: 'dentistry', color: 'bg-red-50 text-red-600', param: 'Cardiology' },
    { label: 'চর্মরোগ', icon: 'dermatology', color: 'bg-teal-50 text-teal-600', param: 'Dermatology' },
    { label: 'মানসিক', icon: 'psychology', color: 'bg-purple-50 text-purple-600', param: 'Psychiatry' },
    { label: 'স্বাস্থ্য ও পুষ্টি', icon: 'hearing', color: 'bg-indigo-50 text-indigo-600', param: 'ENT' },
    { label: 'এমবিবিএস ডাক্তার', icon: 'cardiology', color: 'bg-indigo-50 text-indigo-600', param: 'ENT' },
];

const STATS = [
    { value: '১০+', label: 'নিবন্ধিত ডাক্তার', icon: 'groups' },
    { value: '১০০+', label: 'সন্তুষ্ট রোগী', icon: 'favorite' },
    { value: '২৪/৭', label: 'সেবা প্রদান', icon: 'schedule' },
    { value: '১০০%', label: 'সন্তুষ্টির হার', icon: 'verified' },
];

const Home = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/doctors`);
            if (res.ok) {
                const data = await res.json();
                setDoctors(data.slice(0, 8));
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoadingDoctors(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/doctors?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/doctors');
        }
    };

    const handleSpecialty = (param: string) => {
        navigate(`/doctors?specialty=${encodeURIComponent(param)}`);
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-gray-50 dark:bg-background-dark text-text-main dark:text-white transition-colors duration-300 pb-16 md:pb-0 overflow-x-hidden">
            <Header />

            <main className="flex-1">

                {/* ── HERO ── */}
                <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-rose-500 overflow-hidden">
                    {/* Medical cross watermark */}
                    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-5">
                        <span className="material-symbols-outlined absolute -top-16 -right-16 text-[500px] text-white">local_hospital</span>
                        <span className="material-symbols-outlined absolute -bottom-24 -left-16 text-[400px] text-white">medication</span>
                    </div>
                    {/* Radial glow */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                    <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-14 md:py-20 flex flex-col items-center text-center gap-6">

                        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl">
                            আপনার স্বাস্থ্য,<br />
                            <span className="text-yellow-300">আমাদের অগ্রাধিকার</span>
                        </h1>
                        <p className="text-white/80 text-base md:text-lg max-w-xl">
                            ঘরে বসেই অভিজ্ঞ ডাক্তারের পরামর্শ নিন। সহজে বুক করুন, নিরাপদে থাকুন।
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="w-full max-w-2xl mt-2">
                            <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border-2 border-white/30 focus-within:border-yellow-300 transition-colors">
                                <span className="material-symbols-outlined text-gray-400 ml-4 text-2xl select-none">search</span>
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="ডাক্তার বা বিশেষজ্ঞ খুঁজুন..."
                                    className="flex-1 bg-transparent py-4 px-3 text-text-main dark:text-white placeholder-gray-400 text-sm md:text-base outline-none"
                                />
                                <button
                                    type="submit"
                                    className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-5 md:px-7 m-1.5 rounded-xl transition-colors text-sm md:text-base whitespace-nowrap"
                                >
                                    খুঁজুন
                                </button>
                            </div>
                        </form>

                        {/* Specialty Chips */}
                        <div className="flex flex-wrap justify-center gap-2 mt-1">
                            {SPECIALTIES.map(s => (
                                <button
                                    key={s.param}
                                    onClick={() => handleSpecialty(s.param)}
                                    className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20 transition-all hover:-translate-y-0.5"
                                >
                                    <span className="material-symbols-outlined text-sm">{s.icon}</span>
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── STATS BAR ── */}
                <section className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="max-w-5xl mx-auto px-4 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700">
                        {STATS.map(s => (
                            <div key={s.label} className="flex flex-col items-center gap-0.5 px-4 py-2">
                                <span className="text-primary text-xl md:text-2xl font-black">{s.value}</span>
                                <span className="text-text-sub dark:text-gray-400 text-[11px] md:text-xs text-center">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── SPECIALTY GRID ── */}
                <section className="py-12 md:py-16 bg-gray-50 dark:bg-background-dark">
                    <div className="max-w-5xl mx-auto px-4 md:px-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-primary text-xs font-bold uppercase tracking-widest">বিশেষজ্ঞ</p>
                                <h2 className="text-text-main dark:text-white text-xl md:text-3xl font-bold mt-0.5">বিভাগ অনুযায়ী খুঁজুন</h2>
                            </div>
                            <Link to="/doctors" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                                সব দেখুন <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                            {SPECIALTIES.map(s => (
                                <button
                                    key={s.param}
                                    onClick={() => handleSpecialty(s.param)}
                                    className="flex flex-col items-center gap-2 bg-white dark:bg-surface-dark rounded-2xl p-3 md:p-4 border border-gray-100 dark:border-gray-700 hover:border-primary/30 hover:shadow-md transition-all group hover:-translate-y-1"
                                >
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
                                        <span className="material-symbols-outlined text-xl md:text-2xl">{s.icon}</span>
                                    </div>
                                    <span className="text-[10px] md:text-xs font-semibold text-text-main dark:text-gray-300 text-center leading-tight">{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── DOCTORS GRID ── */}
                <section className="py-12 md:py-16 bg-white dark:bg-surface-dark/20" id="doctors">
                    <div className="max-w-5xl mx-auto px-4 md:px-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-primary text-xs font-bold uppercase tracking-widest">আমাদের ডাক্তার</p>
                                <h2 className="text-text-main dark:text-white text-xl md:text-3xl font-bold mt-0.5">অভিজ্ঞ বিশেষজ্ঞগণ</h2>
                            </div>
                            <Link to="/doctors" className="hidden md:flex items-center gap-1 text-primary text-sm font-bold hover:underline">
                                সকল ডাক্তার <span className="material-symbols-outlined text-sm">arrow_outward</span>
                            </Link>
                        </div>

                        {loadingDoctors ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-52 animate-pulse"></div>
                                ))}
                            </div>
                        ) : doctors.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {doctors.map((doctor, index) => (
                                    <div
                                        key={doctor.doctor_id}
                                        className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                                        style={{ animationDelay: `${index * 60}ms` }}
                                    >
                                        {/* Doctor image */}
                                        <div className="relative h-44 bg-gradient-to-br from-red-50 to-rose-100 dark:from-gray-700 dark:to-gray-600">
                                            {doctor.image_url ? (
                                                <img
                                                    src={doctor.image_url}
                                                    alt={doctor.name}
                                                    className="w-full h-full object-cover object-top"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-7xl text-red-200 dark:text-gray-500">account_circle</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-3 flex flex-col gap-1.5 flex-1">
                                            <h3 className="font-bold text-text-main dark:text-white text-sm group-hover:text-primary transition-colors line-clamp-1">{doctor.name}</h3>
                                            <p className="text-primary text-xs font-semibold line-clamp-1">{doctor.specialty || 'General Medicine'}</p>
                                            <p className="text-text-sub dark:text-gray-400 text-[11px] line-clamp-1">{doctor.qualification || 'MBBS'}</p>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className="material-symbols-outlined text-yellow-400 text-xs icon-filled">star</span>
                                                ))}
                                                <span className="text-text-sub dark:text-gray-400 text-[11px] ml-1">4.8 (50+)</span>
                                            </div>

                                            {/* Fee + Book */}
                                            <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100 dark:border-gray-700">
                                                <div>
                                                    <p className="text-[10px] text-text-sub dark:text-gray-400">ফি</p>
                                                    <p className="text-primary font-bold text-sm">৳{doctor.fee || '—'}</p>
                                                </div>
                                                <Link
                                                    to={`/appointment/${doctor.doctor_id}`}
                                                    className="bg-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    বুক করুন
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 text-gray-400">
                                <span className="material-symbols-outlined text-5xl mb-3 block">person_search</span>
                                <p>কোনো ডাক্তার পাওয়া যায়নি।</p>
                                <Link to="/doctors" className="text-primary font-bold mt-2 inline-block">সব দেখুন</Link>
                            </div>
                        )}

                        <div className="flex justify-center mt-6 md:hidden">
                            <Link to="/doctors" className="flex items-center gap-1 text-primary font-bold hover:underline text-sm">
                                সকল ডাক্তার দেখুন <span className="material-symbols-outlined text-sm">arrow_outward</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── HOW IT WORKS ── */}
                <section className="py-12 md:py-16 bg-gray-50 dark:bg-background-dark">
                    <div className="max-w-5xl mx-auto px-4 md:px-8">
                        <div className="text-center mb-10">
                            <p className="text-primary text-xs font-bold uppercase tracking-widest">সহজ প্রক্রিয়া</p>
                            <h2 className="text-text-main dark:text-white text-xl md:text-3xl font-bold mt-0.5">মাত্র ৩ ধাপে সেবা নিন</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                            {/* Connector line (desktop) */}
                            <div className="hidden md:block absolute top-10 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>

                            {[
                                { step: '১', icon: 'search', title: 'ডাক্তার বেছে নিন', desc: 'বিশেষজ্ঞ বা রোগ অনুযায়ী উপযুক্ত ডাক্তার খুঁজুন।' },
                                { step: '২', icon: 'calendar_month', title: 'সময় বুক করুন', desc: 'সুবিধামতো তারিখ ও সময় বেছে নিয়ে অ্যাপয়েন্টমেন্ট নিশ্চিত করুন।' },
                                { step: '৩', icon: 'video_camera_front', title: 'ভিডিওতে কথা বলুন', desc: 'নির্ধারিত সময়ে ডাক্তারের সাথে সরাসরি ভিডিও কলে পরামর্শ নিন।' },
                            ].map((item) => (
                                <div key={item.step} className="relative flex flex-col items-center text-center gap-4 bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                                            <span className="material-symbols-outlined text-primary text-3xl">{item.icon}</span>
                                        </div>
                                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shadow">{item.step}</span>
                                    </div>
                                    <h3 className="font-bold text-text-main dark:text-white">{item.title}</h3>
                                    <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FEATURES STRIP ── */}
                <section className="py-10 bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-gray-800">
                    <div className="max-w-5xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: 'verified_user', label: 'BMDC যাচাইকৃত', sub: 'সকল ডাক্তার নিবন্ধিত', color: 'text-blue-500' },
                            { icon: 'lock', label: 'সম্পূর্ণ গোপনীয়', sub: 'তথ্য সুরক্ষিত', color: 'text-green-500' },
                            { icon: 'receipt_long', label: 'ই-প্রেসক্রিপশন', sub: 'ডিজিটাল ব্যবস্থাপত্র', color: 'text-purple-500' },
                            { icon: 'support_agent', label: '২৪/৭ সহায়তা', sub: 'সবসময় পাশে আছি', color: 'text-red-500' },
                        ].map(f => (
                            <div key={f.label} className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center shrink-0 ${f.color}`}>
                                    <span className="material-symbols-outlined text-xl">{f.icon}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-text-main dark:text-white text-sm">{f.label}</p>
                                    <p className="text-text-sub dark:text-gray-400 text-xs mt-0.5">{f.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── EMERGENCY CTA ── */}
                <section className="py-12 md:py-16 bg-gray-50 dark:bg-background-dark">
                    <div className="max-w-5xl mx-auto px-4 md:px-8">
                        <div className="bg-gradient-to-r from-red-700 to-rose-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden shadow-2xl shadow-red-500/20">
                            <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4"></div>
                            <div className="absolute left-16 bottom-0 w-40 h-40 bg-black/10 rounded-full translate-y-1/2"></div>
                            <span className="material-symbols-outlined text-white/20 text-[200px] absolute -right-8 top-1/2 -translate-y-1/2">emergency</span>

                            <div className="flex-1 text-center md:text-left z-10">
                                <h2 className="text-white text-2xl md:text-3xl font-extrabold">জরুরী ডাক্তার দরকার?</h2>
                                <p className="text-white/80 mt-2 text-sm md:text-base">আমাদের হটলাইনে কল করুন অথবা এখনই অ্যাপয়েন্টমেন্ট বুক করুন।</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 z-10">
                                <Link
                                    to="/doctors"
                                    className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur text-white font-bold py-3 px-6 rounded-xl border border-white/30 transition-colors"
                                >
                                    <span className="material-symbols-outlined">calendar_month</span> এখনই বুক করুন
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* WhatsApp FAB */}
            <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="hidden md:flex fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-xl hover:scale-110 transition-transform items-center justify-center group"
            >
                <span className="material-symbols-outlined text-3xl">chat</span>
                <span className="absolute right-full mr-3 bg-white dark:bg-gray-800 text-text-main dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    চ্যাট করুন
                </span>
            </a>

            <Footer />
        </div>
    );
};

export default Home;
