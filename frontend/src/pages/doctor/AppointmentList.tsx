import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentDetail from './AppointmentDetail';
import { formatBDDate, formatBDTime, formatBDDateTime } from '../../utils/dateUtils';

type SortOption = 'date' | 'time' | 'patient' | 'status';
type SortOrder = 'asc' | 'desc';

const AppointmentList = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [sortedAppointments, setSortedAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [sortBy, setSortBy] = useState<SortOption>('status');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        sortAppointments(appointments, sortBy, sortOrder);
    }, [appointments, sortBy, sortOrder]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/doctor/dashboard/appointments`, {
                headers: { 'x-auth-token': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const sortAppointments = (apts: any[], by: SortOption, order: SortOrder) => {
        const sorted = [...apts].sort((a, b) => {
            let comparison = 0;
            
            switch (by) {
                case 'date':
                    // Sort by date, then by time
                    if (a.date !== b.date) {
                        comparison = a.date.localeCompare(b.date);
                    } else {
                        const timeA = a.time.toString().substring(0, 5);
                        const timeB = b.time.toString().substring(0, 5);
                        comparison = timeA.localeCompare(timeB);
                    }
                    break;
                case 'time':
                    // Sort by time, then by date
                    const timeA = a.time.toString().substring(0, 5);
                    const timeB = b.time.toString().substring(0, 5);
                    if (timeA !== timeB) {
                        comparison = timeA.localeCompare(timeB);
                    } else {
                        comparison = a.date.localeCompare(b.date);
                    }
                    break;
                case 'patient':
                    // Sort by patient name
                    const nameA = (a.patient_name || '').toLowerCase();
                    const nameB = (b.patient_name || '').toLowerCase();
                    comparison = nameA.localeCompare(nameB);
                    break;
                case 'status':
                    // Sort by status (ready, upcoming, completed, cancelled)
                    const statusOrder = { 'ready': 1, 'upcoming': 2, 'completed': 3, 'cancelled': 4 };
                    const statusA = statusOrder[a.status as keyof typeof statusOrder] || 0;
                    const statusB = statusOrder[b.status as keyof typeof statusOrder] || 0;
                    comparison = statusA - statusB;
                    // If same status, sort by date
                    if (comparison === 0) {
                        comparison = a.date.localeCompare(b.date);
                    }
                    break;
            }
            
            return order === 'asc' ? comparison : -comparison;
        });
        
        setSortedAppointments(sorted);
    };

    const handleSortChange = (newSortBy: SortOption) => {
        if (newSortBy === sortBy) {
            // Toggle order if same sort option
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('asc'); // Default to ascending for new sort
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Sort Controls */}
            <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">All Appointments</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{sortedAppointments.length} appointment{sortedAppointments.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sort by:</span>
                        <div className="flex flex-wrap gap-2">
                            {(['date', 'time', 'patient', 'status'] as SortOption[]).map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleSortChange(option)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                        sortBy === option
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <span className="capitalize">{option}</span>
                                    {sortBy === option && (
                                        <span className="ml-1.5">
                                            {sortOrder === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading appointments...</div>
                ) : sortedAppointments.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">event_busy</span>
                        <p>No appointments found.</p>
                    </div>
                ) : (
                    sortedAppointments.map((apt) => (
                        <div key={apt.appointment_id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg shrink-0">
                                    {apt.patient_name?.[0] || 'P'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white text-lg">{apt.patient_name || 'Patient'}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">schedule</span>
                                        {formatBDDateTime(apt.date, apt.time)}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold capitalize ${apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {apt.status}
                                        </span>
                                        {apt.symptoms && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                                                Symptoms: {apt.symptoms}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    onClick={() => setSelectedAppointment(apt)}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-primary font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
                                >
                                    View Details
                                </button>
                                {(apt.status === 'ready' || apt.status === 'upcoming') && apt.meeting_link && (
                                    <a
                                        href={apt.meeting_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">videocam</span>
                                        Join Meeting
                                    </a>
                                )}
                                {apt.status === 'upcoming' && (
                                    <button
                                        onClick={() => navigate(`/doctor/prescription/${apt.appointment_id}`)}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">prescriptions</span>
                                        Write Prescription
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            {selectedAppointment && (
                <AppointmentDetail
                    appointment={selectedAppointment}
                    onClose={() => { setSelectedAppointment(null); fetchAppointments(); }}
                />
            )}
        </div>
    );
};

export default AppointmentList;
