import { Link } from 'react-router-dom';

const PatientDashboard = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-gray-100">
            {/* Simple Header for Dashboard */}
            <header className="bg-white dark:bg-[#1a1a1a] shadow-sm py-4 px-6 md:px-10 flex justify-between items-center">
                <div className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-3xl">local_hospital</span>
                    <span className="font-bold text-xl hidden md:block">হেলথকেয়ার বিডি</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-text-main dark:text-white">রাহিমা বেগম</p>
                            <p className="text-xs text-gray-500">আইডি: P-1024</p>
                        </div>
                        <div className="size-10 rounded-full bg-gray-200 overflow-hidden">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVH-8Wv7U5B9YnHozaYoOiGiPnbx-NmV5dEQazOMzt3GfR5HpY-ZwkZsKTzfzBYQYdEdhQNafNr3UTbl6bHKVcDWdcBqNtV2ef0lozJ0ExEJSi_olToydMkBccxLOr1UTF3CJEfzsNBqnr0qcogAWoFfkR600YDqXFeRnHeGFfzNlnjHuHz0vgErxEct9ookpS1h9lRFms-6L1ZCHhPMGEifk3qbbKDrLz8dWZl3HGSsEcr6xshmsuJpBHXwZRyKtVO3qqcXHKDv8" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8">
                {/* Wellness Card */}
                <div className="bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">শুভ সকাল, রাহিমা!</h1>
                        <p className="opacity-90 max-w-md">আজ আপনার একটি অ্যাপয়েন্টমেন্ট আছে। সুস্থ থাকার জন্য নিয়মিত ওষুধ সেবন করুন।</p>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upcoming Appointment */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">event_upcoming</span>
                            আসন্ন অ্যাপয়েন্টমেন্ট
                        </h2>
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left hover:shadow-md transition-shadow">
                            <div className="size-20 rounded-2xl bg-gray-100 flex flex-col items-center justify-center shrink-0 text-primary font-bold border border-primary/10">
                                <span className="text-sm uppercase text-gray-500">Oct</span>
                                <span className="text-3xl">25</span>
                            </div>
                            <div className="flex-1 space-y-1">
                                <h3 className="text-lg font-bold text-text-main dark:text-white">ডা. নুসরাত জাহান</h3>
                                <p className="text-secondary font-medium text-sm">গাইনোকোলজিস্ট</p>
                                <p className="text-gray-500 text-sm flex items-center justify-center sm:justify-start gap-1 mt-2">
                                    <span className="material-symbols-outlined text-base">schedule</span> ০৫:৩০ PM - ০৬:০০ PM
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 w-full sm:w-auto">
                                <button className="px-6 py-2 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-lg">videocam</span> জয়েন করুন
                                </button>
                                <button className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-text-sub dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                    রিসডিউল
                                </button>
                            </div>
                        </div>

                        {/* Recent History */}
                        <h2 className="text-xl font-bold text-text-main dark:text-white pt-4">অতীতের ইতিহাস</h2>
                         <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined">check_circle</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-text-main dark:text-white">জেনারেল চেকআপ</h4>
                                                <p className="text-xs text-gray-500">ডা. রফিক ইসলাম • ১২ অক্টোবর</p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-primary transition-colors" title="Download Prescription">
                                            <span className="material-symbols-outlined">download</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 h-full">
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-6">কুইক অ্যাকশন</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-2xl flex flex-col items-center gap-2 text-center cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors group">
                                    <div className="size-12 bg-white dark:bg-teal-800 text-teal-600 dark:text-teal-200 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">upload_file</span>
                                    </div>
                                    <span className="text-xs font-bold text-teal-800 dark:text-teal-100">রিপোর্ট আপলোড</span>
                                </div>
                                <div className="col-span-1 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex flex-col items-center gap-2 text-center cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group">
                                    <div className="size-12 bg-white dark:bg-purple-800 text-purple-600 dark:text-purple-200 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">pill</span>
                                    </div>
                                    <span className="text-xs font-bold text-purple-800 dark:text-purple-100">ঔষধের তালিকা</span>
                                </div>
                                <Link to="/" className="col-span-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <span className="material-symbols-outlined text-gray-500">logout</span>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">লগ আউট</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientDashboard;
