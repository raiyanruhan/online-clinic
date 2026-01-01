import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatBDDateTime } from '../../utils/dateUtils';
import AppointmentDetail from './AppointmentDetail';
import AppointmentCountdown from '../../components/AppointmentCountdown';

const Overview = ({ setActiveTab }: { setActiveTab: (tab: any) => void }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ todayCount: 0, upcomingCount: 0, completedToday: 0 });
    const [loading, setLoading] = useState(true);
    const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [nextAppointment, setNextAppointment] = useState<any>(null);
    const [showJoinAnimation, setShowJoinAnimation] = useState(false);
    const [joinCountdown, setJoinCountdown] = useState(10);
    const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const hasStartedCountdown = useRef(false);

    useEffect(() => {
        fetchStats();
        fetchUpcomingAppointments();
    }, []);

    useEffect(() => {
        // Find the next appointment with meeting link
        if (upcomingAppointments.length > 0) {
            const nextApt = upcomingAppointments.find((apt: any) => apt.meeting_link) || upcomingAppointments[0];
            setNextAppointment(nextApt);
        } else {
            setNextAppointment(null);
        }
    }, [upcomingAppointments]);

    useEffect(() => {
        if (!nextAppointment || !nextAppointment.meeting_link) {
            return;
        }

        // Reset countdown flag when appointment changes
        hasStartedCountdown.current = false;

        const updateCountdown = () => {
            // Don't show popup if appointment is completed
            if (nextAppointment.status === 'completed') {
                if (showJoinAnimation) {
                    setShowJoinAnimation(false);
                }
                return;
            }

            const appointmentDate = new Date(nextAppointment.date);
            const timeStr = nextAppointment.time.toString();
            const [hours, minutes] = timeStr.substring(0, 5).split(':').map(Number);
            appointmentDate.setHours(hours, minutes, 0, 0);

            const now = new Date();
            const diff = appointmentDate.getTime() - now.getTime();
            const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds

            // If more than 10 minutes past appointment time, don't show popup
            if (diff < -tenMinutesInMs) {
                if (showJoinAnimation) {
                    setShowJoinAnimation(false);
                }
                return;
            }

            if (diff <= 0) {
                // Appointment time has arrived (but not more than 10 minutes past)
                // Only show popup if we're within 10 minutes after appointment time
                if (diff >= -tenMinutesInMs && nextAppointment.meeting_link && !hasStartedCountdown.current && !showJoinAnimation) {
                    hasStartedCountdown.current = true;
                    setShowJoinAnimation(true);
                    startJoinCountdown(nextAppointment.meeting_link);
                }
                return;
            }

            // Check if we're within 10 seconds of appointment time (and not completed, and not more than 10 mins past)
            if (diff <= 10000 && diff > 0 && nextAppointment.meeting_link && !hasStartedCountdown.current && !showJoinAnimation && nextAppointment.status !== 'completed') {
                hasStartedCountdown.current = true;
                setShowJoinAnimation(true);
                startJoinCountdown(nextAppointment.meeting_link);
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
    }, [nextAppointment, showJoinAnimation]);

    const startJoinCountdown = (meetingLink: string) => {
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
            const response = await api.get<any>('/api/doctor/dashboard/stats');
            
            if (response.data) {
                setStats(response.data);
            } else if (response.status === 401) {
                // Token issue - API utility will handle redirect
                return;
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUpcomingAppointments = async () => {
        setLoadingAppointments(true);
        try {
            const { api } = await import('../../utils/api');
            const response = await api.get<any>('/api/doctor/dashboard/appointments?filter=upcoming');
            
            if (response.data) {
                const data = response.data;
                // Backend already sorts by date ASC, time ASC
                // Just filter out past appointments for today
                const now = new Date();
                const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                
                const filtered = data.filter((apt: any) => {
                    // Include upcoming and ready appointments
                    if (apt.status !== 'upcoming' && apt.status !== 'ready') return false;
                    
                    // Filter out past appointments for today only
                    if (apt.date === todayStr) {
                        // For today, check if time has passed
                        const timeStr = apt.time.toString();
                        const [hours, minutes] = timeStr.substring(0, 5).split(':').map(Number);
                        const aptTime = new Date();
                        aptTime.setHours(hours, minutes, 0, 0);
                        return aptTime >= now;
                    }
                    // For future dates, include all
                    return true;
                });
                
                // Sort by date and time (earliest first) - combine date and time for accurate sorting
                const sorted = filtered.sort((a: any, b: any) => {
                    const dateTimeA = `${a.date}T${a.time.toString().substring(0, 5)}`;
                    const dateTimeB = `${b.date}T${b.time.toString().substring(0, 5)}`;
                    return dateTimeA.localeCompare(dateTimeB);
                });
                
                setUpcomingAppointments(sorted);
            } else if (response.status === 401) {
                // Token issue - API utility will handle redirect
                return;
            }
        } catch (error) {
            console.error('Error fetching upcoming appointments:', error);
        } finally {
            setLoadingAppointments(false);
        }
    };

    if (loading) return <div>Loading stats...</div>;

    return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Join Animation Overlay */}
            {showJoinAnimation && nextAppointment?.meeting_link && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center transition-opacity duration-300 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl transition-all duration-300">
                        <div className="text-center space-y-4 sm:space-y-6">
                            <div className="relative">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="material-symbols-outlined text-4xl sm:text-5xl text-white">videocam</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-12 h-12 sm:w-14 sm:h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-xl sm:text-2xl tabular-nums">{joinCountdown}</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">Joining Meeting...</h3>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Redirecting in <span className="font-bold text-primary">{joinCountdown}</span> seconds</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => {
                                        if (countdownIntervalRef.current) {
                                            clearInterval(countdownIntervalRef.current);
                                            countdownIntervalRef.current = null;
                                        }
                                        setShowJoinAnimation(false);
                                        window.open(nextAppointment.meeting_link, '_blank');
                                    }}
                                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white font-bold rounded-lg sm:rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    <span className="material-symbols-outlined text-lg sm:text-xl">play_arrow</span>
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
                                    className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg sm:rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-start gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg sm:rounded-xl shrink-0">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl">calendar_today</span>
                    </div>
                    <div className="text-left">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Today's Appointments</p>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.todayCount}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-start gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg sm:rounded-xl shrink-0">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl">check_circle</span>
                    </div>
                    <div className="text-left">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Completed Today</p>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.completedToday}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-start gap-3 sm:gap-4 sm:col-span-2 lg:col-span-1">
                    <div className="p-2.5 sm:p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg sm:rounded-xl shrink-0">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl">upcoming</span>
                    </div>
                    <div className="text-left">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Upcoming Total</p>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.upcomingCount}</h3>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4 sm:space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col gap-4 sm:gap-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-3 sm:gap-4 text-center sm:text-left">
                            <div className="flex-1">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">Ready to start consultations?</h2>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Your upcoming appointments sorted by time.</p>
                            </div>
                            <button
                                onClick={() => setActiveTab('appointments')}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white font-bold rounded-lg sm:rounded-xl shadow-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
                            >
                                View All Appointments
                                <span className="material-symbols-outlined text-lg sm:text-xl">arrow_forward</span>
                            </button>
                        </div>
                        
                        {/* Upcoming Appointments List */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 max-h-[400px] overflow-y-auto border border-gray-200 dark:border-gray-700">
                            {loadingAppointments ? (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-6 sm:py-8 text-sm sm:text-base">Loading appointments...</div>
                            ) : upcomingAppointments.length === 0 ? (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-6 sm:py-8">
                                    <span className="material-symbols-outlined text-3xl sm:text-4xl mb-2 block opacity-50">event_busy</span>
                                    <p className="text-sm sm:text-base">No upcoming appointments</p>
                                </div>
                            ) : (
                                <div className="space-y-2 sm:space-y-3">
                                    {upcomingAppointments.map((apt) => (
                                        <div
                                            key={apt.appointment_id}
                                            onClick={() => setSelectedAppointment(apt)}
                                            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3 sm:p-4 cursor-pointer transition-all border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30"
                                        >
                                            <div className="flex flex-col gap-3 sm:gap-4">
                                                {/* Patient Info Section */}
                                                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-base sm:text-lg shrink-0">
                                                        {apt.patient_name?.[0] || 'P'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base lg:text-lg truncate">{apt.patient_name || 'Patient'}</h4>
                                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 sm:gap-2 mt-0.5">
                                                            <span className="material-symbols-outlined text-xs sm:text-sm">schedule</span>
                                                            <span className="break-words">{formatBDDateTime(apt.date, apt.time)}</span>
                                                        </p>
                                                        {apt.symptoms && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2 break-words">Symptoms: {apt.symptoms}</p>
                                                        )}
                                                        {apt.meeting_link && (
                                                            <div className="mt-2">
                                                                <AppointmentCountdown
                                                                    date={apt.date}
                                                                    time={apt.time}
                                                                    meetingLink={apt.meeting_link}
                                                                    onJoinTime={() => {
                                                                        // Only show animation for the next appointment (first one in list)
                                                                        if (upcomingAppointments[0]?.appointment_id === apt.appointment_id && !showJoinAnimation) {
                                                                            setNextAppointment(apt);
                                                                            setShowJoinAnimation(true);
                                                                            startJoinCountdown(apt.meeting_link);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Action Buttons Section */}
                                                <div className="flex flex-col sm:flex-row gap-2 w-full">
                                                    {apt.meeting_link && (
                                                        <a
                                                            href={apt.meeting_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md shadow-green-600/20"
                                                        >
                                                            <span className="material-symbols-outlined text-base sm:text-lg">videocam</span>
                                                            <span>Join Call</span>
                                                        </a>
                                                    )}
                                                    <div className="flex gap-2 flex-1">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedAppointment(apt);
                                                            }}
                                                            className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-primary dark:text-primary-300 font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-base sm:text-lg">visibility</span>
                                                            <span className="hidden sm:inline">View</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/doctor/prescription/${apt.appointment_id}`);
                                                            }}
                                                            className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-primary text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-base sm:text-lg">prescriptions</span>
                                                            <span className="hidden sm:inline">Prescription</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
                        <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-1">Share Your Knowledge</h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Write a blog post to help patients with health tips and advice.</p>
                        </div>
                        <button
                            onClick={() => navigate('/write-blog')}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white font-bold rounded-lg sm:rounded-xl shadow-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
                        >
                            <span className="material-symbols-outlined text-lg sm:text-xl">edit</span>
                            Write Blog
                        </button>
                    </div>
                </div>
            </div>

            {/* Appointment Detail Modal */}
            {selectedAppointment && (
                <AppointmentDetail
                    appointment={selectedAppointment}
                    onClose={() => {
                        setSelectedAppointment(null);
                        fetchUpcomingAppointments();
                        fetchStats();
                    }}
                />
            )}
        </div>
    );
};

export default Overview;
