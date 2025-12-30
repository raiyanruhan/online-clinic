import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatBDDate, formatBDTime } from '../../utils/dateUtils';

const Home = ({ setActiveTab }: { setActiveTab: (tab: any) => void }) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) setUser(JSON.parse(userStr));
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/patient/dashboard/stats', {
                headers: { 'x-auth-token': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    const nextAppt = stats?.nextAppointment;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">স্বাগতম, {user?.name}!</h2>
                    <p className="opacity-90 max-w-lg text-lg">আপনার স্বাস্থ্যই আমাদের অগ্রাধিকার। অ্যাপয়েন্টমেন্ট এবং প্রেসক্রিপশন সহজেই দেখুন।</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Next Appointment */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">event_upcoming</span>
                        পরবর্তী অ্যাপয়েন্টমেন্ট
                    </h3>

                    {nextAppt ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-l-4 border-l-primary border-gray-100 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0">
                                        {nextAppt.doctor_image ? (
                                            <img src={nextAppt.doctor_image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <span className="material-symbols-outlined text-3xl">person</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-800 dark:text-white">{nextAppt.doctor_name || 'Doctor'}</h4>
                                        <p className="text-primary font-medium">{nextAppt.specialty}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-lg">calendar_today</span>
                                                {formatBDDate(nextAppt.date)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-lg">schedule</span>
                                                {formatBDTime(nextAppt.time)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 w-full md:w-auto">
                                    {nextAppt.meeting_link ? (
                                        <a
                                            href={nextAppt.meeting_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">videocam</span>
                                            Consult Now
                                        </a>
                                    ) : (
                                        <button disabled className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-400 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined">videocam_off</span>
                                            Link Pending
                                        </button>
                                    )}
                                    <div className="text-center text-xs text-gray-400">
                                        Status: <span className="uppercase font-bold text-primary">{nextAppt.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-dashed border-gray-300 dark:border-gray-700 text-center">
                            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">event_busy</span>
                            <p className="text-gray-500">আপনার কোনো আসন্ন অ্যাপয়েন্টমেন্ট নেই।</p>
                            <Link to="/doctors" className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-bold">
                                নতুন অ্যাপয়েন্টমেন্ট নিন
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">আপনার কার্যক্রম</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.stats?.upcoming || 0}</span>
                            <span className="text-sm text-blue-800 dark:text-blue-300 font-medium">আসন্ন</span>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-800 flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats?.stats?.completed || 0}</span>
                            <span className="text-sm text-purple-800 dark:text-purple-300 font-medium">সম্পন্ন</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setActiveTab('appointments')}
                        className="w-full py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-xl transition-all shadow-sm group flex items-center justify-between px-6"
                    >
                        <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary">সকল অ্যাপয়েন্টমেন্ট দেখুন</span>
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
