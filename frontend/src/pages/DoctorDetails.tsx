import Header from '../components/Header';
import Footer from '../components/Footer';

const DoctorDetails = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-gray-100">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Doctor Details */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Profile Header Card */}
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-6">
                            <div className="shrink-0 flex flex-col items-center md:items-start gap-4">
                                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-md">
                                    <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-MVRHF2uiM2XhkYw8nRrvzbYk0YwBpDIABa6ke4nRpYEVwFHDRg_AFruaD-wzwUOYbjBjI1HvqOC-F8P45VccHMJXBGnGORilXYBc81z6mN8c9tUKNMhcurL_OqskZlS1ipG4qtb0j23XusXYdzdWhKJCuS55kz0yLrZ6muT0-SjTB3SCdueF_IaQ4K-E3i6zGWYowKQvSk-BlI0l8RwGDQ2f6fw3WrUNy4XItvQHhWyX9y7EcUu685jnj30rrIMG0-P-VAJMPGA")'}}></div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200">
                                    <span className="material-symbols-outlined text-sm icon-filled">verified</span>
                                    <span>BMDC ভেরিফাইড</span>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 text-center md:text-left">
                                <div className="flex justify-between items-start w-full">
                                    <div>
                                        <h1 className="text-secondary text-2xl md:text-3xl font-bold leading-tight mb-2">ডা. নুসরাত জাহান</h1>
                                        <p className="text-text-main/80 dark:text-gray-300 text-base md:text-lg mb-1">এমবিবিএস, এফসিপিএস (গাইনি)</p>
                                        <p className="text-text-main/60 dark:text-gray-400 text-sm md:text-base font-medium mb-3">গাইনোকোলজিস্ট এবং অবস্টেট্রিশিয়ান</p>
                                    </div>
                                    <button aria-label="Share" className="hidden md:flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                                        <span className="material-symbols-outlined">share</span>
                                    </button>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-secondary">medical_services</span>
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">১০+ বছর অভিজ্ঞতা</span>
                                    </div>
                                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-secondary text-lg icon-filled">star</span>
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">৪.৮ (১২০+ রিভিউ)</span>
                                    </div>
                                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-secondary text-lg">language</span>
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">বাংলা</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="text-secondary text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">person</span>
                                আমার সম্পর্কে
                            </h3>
                            <div className="text-text-main/80 dark:text-gray-300 text-base leading-relaxed space-y-4">
                                <p>
                                    আমি ডা. নুসরাত জাহান, ঢাকা মেডিকেল কলেজ থেকে এমবিবিএস এবং পরবর্তীতে এফসিপিএস (গাইনি) সম্পন্ন করেছি। গত ১০ বছর ধরে আমি মহিলাদের প্রজনন স্বাস্থ্য, গর্ভাবস্থা এবং প্রসবকালীন সেবা নিয়ে কাজ করছি।
                                </p>
                                <p>
                                    আমার লক্ষ্য হলো প্রতিটি রোগীকে তার প্রয়োজন অনুযায়ী সঠিক এবং সহানুভূতিশীল চিকিৎসা প্রদান করা। আমি বিশ্বাস করি, রোগীর কথা মনোযোগ দিয়ে শোনা চিকিৎসার একটি গুরুত্বপূর্ণ অংশ।
                                </p>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-secondary text-xl font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined">rate_review</span>
                                    রোগীদের মতামত
                                </h3>
                                <a href="#" className="text-primary text-sm font-bold hover:underline">সব দেখুন</a>
                            </div>
                            <div className="grid gap-4">
                                <div className="bg-background-light dark:bg-gray-800 p-4 rounded-xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-gray-300 overflow-hidden">
                                                <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBaDjNMy36xwjTnyD6GBl-uL5_Wi04QYDusZbgCQPqJO7D3BfuIfrUO25xhZav-qFoLMd8SOa-PW2SPQxb6psji8PEsKlaVzkk7rIwBqOd-fWUUWZgbJ0eq6zwQANCr3geZd0iKsQeYMlOtuM6YGUK-RarU6Wjxoi_IQhtWjIsT_t0Rep38EcPWQmypQjud_MMpKik6bbdExAzvccJ2gDtNWD6hJVv-tV7SwiYmC4chRt5XX_zrqzPBC5__iZPBnFW2U-o5VqBA2VY")'}}></div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-text-main dark:text-white">ফারহানা আক্তার</p>
                                                <p className="text-xs text-gray-500">২ দিন আগে</p>
                                            </div>
                                        </div>
                                        <div className="flex text-yellow-500">
                                            <span className="material-symbols-outlined text-sm icon-filled">star</span>
                                            <span className="material-symbols-outlined text-sm icon-filled">star</span>
                                            <span className="material-symbols-outlined text-sm icon-filled">star</span>
                                            <span className="material-symbols-outlined text-sm icon-filled">star</span>
                                            <span className="material-symbols-outlined text-sm icon-filled">star</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        ম্যাডাম খুব ভালো। উনি খুব সময় নিয়ে আমার সমস্যা শুনেছেন। আমি উনার ব্যবহারে মুগ্ধ।
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Widget */}
                    <div className="lg:col-span-4 relative h-full">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl shadow-lg border border-secondary/20 overflow-hidden">
                                <div className="bg-secondary p-4 text-white text-center">
                                    <h3 className="text-lg font-bold">অ্যাপয়েন্টমেন্ট নিন</h3>
                                    <p className="text-teal-100 text-sm">চেম্বার: পপুলার ডায়াগনস্টিক সেন্টার, ধানমন্ডি</p>
                                </div>
                                <div className="p-5 flex flex-col gap-6">
                                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">কনসালটেশন ফি</span>
                                        <span className="text-primary font-bold text-lg">৳ ১০০০</span>
                                    </div>
                                    <button className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                        <span>বুক করুন</span>
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DoctorDetails;
