import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatBDDate, formatBDTime } from '../../utils/dateUtils';

const Home = ({ setActiveTab }: { setActiveTab: (tab: any) => void }) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
    const [showJoinAnimation, setShowJoinAnimation] = useState(false);
    const [joinCountdown, setJoinCountdown] = useState(10);
    const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const hasStartedCountdown = useRef(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) setUser(JSON.parse(userStr));
        fetchStats();
    }, []);

    useEffect(() => {
        if (!stats?.nextAppointment) return;

        // Reset countdown flag when appointment changes
        hasStartedCountdown.current = false;

        const updateCountdown = () => {
            const appointment = stats.nextAppointment;
            
            // Don't show popup if appointment is completed
            if (appointment.status === 'completed') {
                setTimeRemaining(null);
                if (showJoinAnimation) {
                    setShowJoinAnimation(false);
                }
                return;
            }

            const appointmentDate = new Date(appointment.date);
            const timeStr = appointment.time.toString();
            const [hours, minutes] = timeStr.substring(0, 5).split(':').map(Number);
            appointmentDate.setHours(hours, minutes, 0, 0);

            const now = new Date();
            const diff = appointmentDate.getTime() - now.getTime();
            const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds

            // If more than 10 minutes past appointment time, don't show popup
            if (diff < -tenMinutesInMs) {
                setTimeRemaining(null);
                if (showJoinAnimation) {
                    setShowJoinAnimation(false);
                }
                return;
            }

            if (diff <= 0) {
                // Appointment time has arrived (but not more than 10 minutes past)
                setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
                // Only show popup if we're within 10 minutes after appointment time
                if (diff >= -tenMinutesInMs && appointment.meeting_link && !hasStartedCountdown.current && !showJoinAnimation) {
                    hasStartedCountdown.current = true;
                    setShowJoinAnimation(true);
                    startJoinCountdown(appointment.meeting_link);
                }
                return;
            }

            const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
            const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsRemaining = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeRemaining({ hours: hoursRemaining, minutes: minutesRemaining, seconds: secondsRemaining });

            // Check if we're within 10 seconds of appointment time (and not completed, and not more than 10 mins past)
            if (diff <= 10000 && diff > 0 && appointment.meeting_link && !hasStartedCountdown.current && !showJoinAnimation && appointment.status !== 'completed') {
                hasStartedCountdown.current = true;
                setShowJoinAnimation(true);
                startJoinCountdown(appointment.meeting_link);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => {
            clearInterval(interval);
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
        };
    }, [stats?.nextAppointment]);

    const startJoinCountdown = (meetingLink: string) => {
        // Clear any existing interval
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
        }

        let count = 10;
        setJoinCountdown(count);

        const countdownInterval = setInterval(() => {
            count--;
            setJoinCountdown(count);

            if (count <= 0) {
                clearInterval(countdownInterval);
                countdownIntervalRef.current = null;
                // Hide animation immediately
                setShowJoinAnimation(false);
                // Auto-redirect to meeting
                window.open(meetingLink, '_blank');
            }
        }, 1000);

        countdownIntervalRef.current = countdownInterval;
    };

    const fetchStats = async () => {
        try {
            const { api } = await import('../../utils/api');
            const response = await api.get<any>('/api/patient/dashboard/stats');
            
            if (response.data) {
                console.log('Patient Stats Data:', response.data);
                console.log('Next Appointment:', response.data.nextAppointment);
                setStats(response.data);
            } else if (response.error) {
                console.error('Failed to fetch stats:', response.error);
                // Don't show error to user if it's just a token issue (handled by API utility)
                if (response.status === 401) {
                    // Token issue - API utility will handle redirect
                    return;
                }
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    const nextAppt = stats?.nextAppointment;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Join Animation Overlay */}
            {showJoinAnimation && nextAppt?.meeting_link && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center transition-opacity duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transition-all duration-300">
                        <div className="text-center space-y-6">
                            <div className="relative">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="material-symbols-outlined text-5xl text-white">videocam</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-2xl tabular-nums">{joinCountdown}</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Joining Meeting...</h3>
                                <p className="text-gray-600 dark:text-gray-400">Redirecting in <span className="font-bold text-primary">{joinCountdown}</span> seconds</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        if (countdownIntervalRef.current) {
                                            clearInterval(countdownIntervalRef.current);
                                            countdownIntervalRef.current = null;
                                        }
                                        setShowJoinAnimation(false);
                                        window.open(nextAppt.meeting_link, '_blank');
                                    }}
                                    className="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">play_arrow</span>
                                    Join Now
                                </button>
                                <button
                                    onClick={() => {
                                        if (countdownIntervalRef.current) {
                                            clearInterval(countdownIntervalRef.current);
                                            countdownIntervalRef.current = null;
                                        }
                                        setShowJoinAnimation(false);
                                    }}
                                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

{/* Welcome Card */}
<div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm">
  {/* subtle background accent */}
  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100" />

  <div className="relative p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
    {/* Icon */}
    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shrink-0">
      <span className="material-symbols-outlined text-2xl sm:text-3xl">Concierge</span>
    </div>

    {/* Text */}
    <div className="flex-1 text-center sm:text-left">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1">
        স্বাগতম, {user?.name}
      </h2>
      <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">আপনার স্বাস্থ্যই আমাদের অগ্রাধিকার।</p>
    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {/* Next Appointment */}
                <div className="lg:col-span-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg sm:text-xl">event_upcoming</span>
                        পরবর্তী অ্যাপয়েন্টমেন্ট
                    </h3>

                    {nextAppt ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-l-4 border-l-primary border-gray-100 dark:border-gray-700 relative overflow-hidden">
                            {/* Animated background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-pulse"></div>
                            
                            <div className="relative z-10">
                                <div className="flex flex-col gap-4 sm:gap-6">
                                    {/* Doctor Info Section */}
                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0 ring-2 ring-primary/20 animate-in zoom-in duration-500">
                                        {nextAppt.doctor_image ? (
                                            <img src={nextAppt.doctor_image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <span className="material-symbols-outlined text-2xl sm:text-3xl">person</span>
                                            </div>
                                        )}
                                    </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white truncate">{nextAppt.doctor_name || 'Doctor'}</h4>
                                            <p className="text-primary font-medium text-sm sm:text-base truncate">{nextAppt.specialty}</p>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-base sm:text-lg">calendar_today</span>
                                                {formatBDDate(nextAppt.date)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-base sm:text-lg">schedule</span>
                                                {formatBDTime(nextAppt.time)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                    {/* Countdown Timer and Action Buttons */}
                                    <div className="flex flex-col gap-3">
                                        {/* Countdown Timer */}
                                        {timeRemaining !== null && (
                                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 text-center font-medium">Time Remaining</p>
                                                <div className="flex items-center justify-center gap-1 sm:gap-2">
                                                    <div className="text-center">
                                                        <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums animate-in fade-in duration-300">
                                                            {String(timeRemaining.hours).padStart(2, '0')}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Hours</div>
                                                    </div>
                                                    <span className="text-blue-600 dark:text-blue-400 text-lg sm:text-xl font-bold animate-pulse">:</span>
                                                    <div className="text-center">
                                                        <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums animate-in fade-in duration-300">
                                                            {String(timeRemaining.minutes).padStart(2, '0')}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Minutes</div>
                                                    </div>
                                                    <span className="text-blue-600 dark:text-blue-400 text-lg sm:text-xl font-bold animate-pulse">:</span>
                                                    <div className="text-center">
                                                        <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums animate-in fade-in duration-300">
                                                            {String(timeRemaining.seconds).padStart(2, '0')}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Seconds</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-2">
                                    {nextAppt.meeting_link ? (
                                        <a
                                            href={nextAppt.meeting_link}
                                            target="_blank"
                                            rel="noreferrer"
                                                    className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900 transition-colors duration-150 flex items-center justify-center gap-2 border border-green-700 hover:shadow-xl active:scale-95 text-sm sm:text-base"
                                                    style={{ boxShadow: "0 4px 24px 0 rgba(34,197,94,0.20)" }}
                                        >
                                                    <span className="material-symbols-outlined text-lg sm:text-xl">videocam</span>
                                                    <span className="tracking-wide">Consult Now</span>
                                        </a>
                                    ) : (
                                                <button disabled className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-700 text-gray-400 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base">
                                                    <span className="material-symbols-outlined text-lg sm:text-xl">videocam_off</span>
                                            Link Pending
                                        </button>
                                    )}
                                    <div className="text-center text-xs text-gray-400">
                                        Status: <span className="uppercase font-bold text-primary">{nextAppt.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-dashed border-gray-300 dark:border-gray-700 text-center">
                            <span className="material-symbols-outlined text-3xl sm:text-4xl text-gray-300 mb-2">event_busy</span>
                            <p className="text-sm sm:text-base text-gray-500">আপনার কোনো আসন্ন অ্যাপয়েন্টমেন্ট নেই।</p>
                            <Link to="/doctors" className="mt-4 inline-block px-4 sm:px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-bold">
                                নতুন অ্যাপয়েন্টমেন্ট নিন
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">আপনার কার্যক্রম</h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center text-center">
                            <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.stats?.upcoming || 0}</span>
                            <span className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 font-medium">আসন্ন</span>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-100 dark:border-purple-800 flex flex-col items-center justify-center text-center">
                            <span className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">{stats?.stats?.completed || 0}</span>
                            <span className="text-xs sm:text-sm text-purple-800 dark:text-purple-300 font-medium">সম্পন্ন</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setActiveTab('appointments')}
                        className="w-full py-3 sm:py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-xl transition-all shadow-sm group flex items-center justify-between px-4 sm:px-6"
                    >
                        <span className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary">সকল অ্যাপয়েন্টমেন্ট দেখুন</span>
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors text-lg sm:text-xl">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
