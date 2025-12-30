import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatBDDate, formatBDTime, formatBDDateTime } from '../../utils/dateUtils';
import AppointmentDetail from './AppointmentDetail';

const Overview = ({ setActiveTab }: { setActiveTab: (tab: any) => void }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ todayCount: 0, upcomingCount: 0, completedToday: 0 });
    const [loading, setLoading] = useState(true);
    const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    useEffect(() => {
        fetchStats();
        fetchUpcomingAppointments();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/doctor/dashboard/stats', {
                headers: { 'x-auth-token': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
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
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/doctor/dashboard/appointments?filter=upcoming', {
                headers: { 'x-auth-token': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
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
            }
        } catch (error) {
            console.error('Error fetching upcoming appointments:', error);
        } finally {
            setLoadingAppointments(false);
        }
    };

    if (loading) return <div>Loading stats...</div>;

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                        <span className="material-symbols-outlined text-3xl">calendar_today</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Today's Appointments</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.todayCount}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
                        <span className="material-symbols-outlined text-3xl">check_circle</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Completed Today</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.completedToday}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
                        <span className="material-symbols-outlined text-3xl">upcoming</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Upcoming Total</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.upcomingCount}</h3>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Ready to start consultations?</h2>
                                <p className="text-gray-600 dark:text-gray-400">Your upcoming appointments sorted by time.</p>
                            </div>
                            <button
                                onClick={() => setActiveTab('appointments')}
                                className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-red-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                                View All Appointments
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                        
                        {/* Upcoming Appointments List */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 max-h-[400px] overflow-y-auto border border-gray-200 dark:border-gray-700">
                            {loadingAppointments ? (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-8">Loading appointments...</div>
                            ) : upcomingAppointments.length === 0 ? (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                    <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">event_busy</span>
                                    <p>No upcoming appointments</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingAppointments.map((apt) => (
                                        <div
                                            key={apt.appointment_id}
                                            onClick={() => setSelectedAppointment(apt)}
                                            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-4 cursor-pointer transition-all border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                                                        {apt.patient_name?.[0] || 'P'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-gray-800 dark:text-white text-lg truncate">{apt.patient_name || 'Patient'}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-base">schedule</span>
                                                            {formatBDDateTime(apt.date, apt.time)}
                                                        </p>
                                                        {apt.symptoms && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">Symptoms: {apt.symptoms}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedAppointment(apt);
                                                        }}
                                                        className="px-4 py-2 bg-white dark:bg-gray-700 text-primary dark:text-primary-300 font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/doctor/prescription/${apt.appointment_id}`);
                                                        }}
                                                        className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">prescriptions</span>
                                                        Prescription
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Share Your Knowledge</h3>
                            <p className="text-gray-600 dark:text-gray-400">Write a blog post to help patients with health tips and advice.</p>
                        </div>
                        <button
                            onClick={() => navigate('/write-blog')}
                            className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-red-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined">edit</span>
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
