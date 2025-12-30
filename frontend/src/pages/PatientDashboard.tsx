import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
            navigate('/login');
        } else {
            if (userData) {
                setUser(JSON.parse(userData));
            }
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-gray-100">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8">
                {/* Wellness Card */}
                <div className="bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">স্বাগতম, {user ? user.name : 'ব্যবহারকারী'}!</h1>
                        <p className="opacity-90 max-w-md">আপনার ড্যাশবোর্ডে আপনাকে স্বাগতম। আপনার স্বাস্থ্য আমাদের অগ্রাধিকার।</p>
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
                        {/* Empty State */}
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                            <div className="size-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <span className="material-symbols-outlined text-3xl">calendar_today</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">কোন অ্যাপয়েন্টমেন্ট নেই</h3>
                            <p className="text-gray-500 mb-6">আপনার কোনো আসন্ন অ্যাপয়েন্টমেন্ট শিডিউল করা নেই।</p>
                            <Link to="/doctors" className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-red-700 transition-colors">
                                <span className="material-symbols-outlined">add_circle</span>
                                নতুন অ্যাপয়েন্টমেন্ট নিন
                            </Link>
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
                                <div onClick={handleLogout} className="col-span-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <span className="material-symbols-outlined text-gray-500">logout</span>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">লগ আউট</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientDashboard;
