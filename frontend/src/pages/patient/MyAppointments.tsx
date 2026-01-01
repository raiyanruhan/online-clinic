import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../contexts/ModalContext';
import { formatBDDate, formatBDTime, formatBDDateTime } from '../../utils/dateUtils';

type SortOption = 'date' | 'time' | 'doctor' | 'status';
type SortOrder = 'asc' | 'desc';

const MyAppointments = () => {
    const navigate = useNavigate();
    const { showAlert, showConfirm } = useModal();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [sortedAppointments, setSortedAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<number | null>(null);
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
            const res = await fetch(`http://localhost:5000/api/patient/dashboard/appointments`, {
                headers: { 'x-auth-token': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                // Convert has_prescription to boolean if it comes as string
                const processedData = data.map((apt: any) => {
                    // Check multiple ways the value might come from PostgreSQL
                    const hasPrescription = apt.has_prescription === true || 
                                          apt.has_prescription === 'true' || 
                                          apt.has_prescription === 1 || 
                                          apt.has_prescription === 't' ||
                                          apt.prescription_id !== null ||
                                          apt.prescription_id !== undefined;
                    console.log('Appointment:', apt.appointment_id, 'has_prescription:', apt.has_prescription, 'prescription_id:', apt.prescription_id, 'converted:', hasPrescription);
                    return {
                        ...apt,
                        has_prescription: !!hasPrescription // Force to boolean
                    };
                });
                setAppointments(processedData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (appointmentId: number, doctorName: string, date: string, time: string) => {
        const confirmed = await showConfirm({
            title: 'Cancel Appointment',
            message: `Are you sure you want to cancel your appointment with ${doctorName} on ${formatBDDateTime(date, time)}?`,
            confirmText: 'Yes, Cancel',
            cancelText: 'No, Keep It',
            type: 'warning'
        });

        if (!confirmed) return;

        setCancellingId(appointmentId);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/patient/dashboard/appointments/${appointmentId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                }
            });

            if (res.ok) {
                const data = await res.json();
                showAlert({ message: data.message || 'Appointment cancelled successfully', type: 'success' });
                // Refresh appointments list
                fetchAppointments();
            } else {
                // Try to parse error message
                let errorMessage = 'Failed to cancel appointment';
                try {
                    const error = await res.json();
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    // If response is not JSON (e.g., HTML error page), use status text
                    errorMessage = `Failed to cancel appointment (${res.status} ${res.statusText})`;
                }
                showAlert({ message: errorMessage, type: 'error' });
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            showAlert({ message: 'Failed to cancel appointment. Please try again.', type: 'error' });
        } finally {
            setCancellingId(null);
        }
    };

    const sortAppointments = (apts: any[], by: SortOption, order: SortOrder) => {
        const sorted = [...apts].sort((a, b) => {
            let comparison = 0;
            
            switch (by) {
                case 'date':
                    if (a.date !== b.date) {
                        comparison = a.date.localeCompare(b.date);
                    } else {
                        const timeA = a.time.toString().substring(0, 5);
                        const timeB = b.time.toString().substring(0, 5);
                        comparison = timeA.localeCompare(timeB);
                    }
                    break;
                case 'time':
                    const timeA = a.time.toString().substring(0, 5);
                    const timeB = b.time.toString().substring(0, 5);
                    if (timeA !== timeB) {
                        comparison = timeA.localeCompare(timeB);
                    } else {
                        comparison = a.date.localeCompare(b.date);
                    }
                    break;
                case 'doctor':
                    const nameA = (a.doctor_name || '').toLowerCase();
                    const nameB = (b.doctor_name || '').toLowerCase();
                    comparison = nameA.localeCompare(nameB);
                    break;
                case 'status':
                    const statusOrder = { 'upcoming': 1, 'completed': 2, 'cancelled': 3 };
                    const statusA = statusOrder[a.status as keyof typeof statusOrder] || 0;
                    const statusB = statusOrder[b.status as keyof typeof statusOrder] || 0;
                    comparison = statusA - statusB;
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
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('asc');
        }
    };

    const handleViewAppointment = (appointmentId: number) => {
        console.log('Viewing appointment:', appointmentId);
        navigate(`/patient/appointment/${appointmentId}`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Sort Controls */}
            <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">Sort by:</span>
                    <div className="flex flex-wrap gap-2">
                {(['date', 'time', 'doctor', 'status'] as SortOption[]).map((option) => (
                <button
                        key={option}
                        onClick={() => handleSortChange(option)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                            sortBy === option
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                        {sortBy === option && (
                                    <span className="ml-1 sm:ml-2">
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                </button>
                ))}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                    <div className="p-6 sm:p-8 text-center text-gray-500 text-sm sm:text-base">Loading...</div>
                ) : sortedAppointments.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center text-gray-500">
                        <span className="material-symbols-outlined text-3xl sm:text-4xl mb-2 text-gray-300 block">event_busy</span>
                        <p className="text-sm sm:text-base">কোন অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।</p>
                    </div>
                ) : (
                    sortedAppointments.map((apt) => (
                        <div key={apt.appointment_id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                                {/* Left Side - Doctor Info (Mobile and Desktop) */}
                                <div className="flex gap-3 sm:gap-4 items-start md:items-center flex-1 min-w-0">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0">
                                    {apt.doctor_image ? (
                                        <img src={apt.doctor_image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <span className="material-symbols-outlined text-xl sm:text-2xl">person</span>
                                        </div>
                                    )}
                                </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-800 dark:text-white text-base sm:text-lg truncate">{apt.doctor_name || 'Unspecified Doctor'}</h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">{apt.specialty}</p>
                                        {/* Mobile: Date and Time Info - shown below doctor info */}
                                        <div className="md:hidden flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm">
                                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                                <span className="material-symbols-outlined text-sm sm:text-base">calendar_today</span>
                                            {formatBDDate(apt.date)}
                                        </span>
                                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                                <span className="material-symbols-outlined text-sm sm:text-base">schedule</span>
                                            {formatBDTime(apt.time)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                                {/* Right Side - Date/Time, Status, Actions (Desktop Only) */}
                                <div className="hidden md:flex md:items-center md:gap-4">
                                    {/* Date and Time Info - Desktop Only */}
                                    <div className="flex flex-col gap-1.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                                            <span className="material-symbols-outlined text-base">calendar_today</span>
                                            <span>{formatBDDate(apt.date)}</span>
                                        </div>
                                        <div className="flex items-center justify-end gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                                            <span className="material-symbols-outlined text-base">schedule</span>
                                            <span>{formatBDTime(apt.time)}</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap ${
                                    apt.status === 'upcoming' 
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                                        : apt.status === 'completed' 
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                        : apt.status === 'cancelled'
                                        ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                    }`}>
                                    {apt.status}
                                </span>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                {apt.status === 'ready' && apt.meeting_link && (
                                    <a
                                        href={apt.meeting_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-colors shadow-md shadow-green-600/20"
                                    >
                                        <span className="material-symbols-outlined text-lg">videocam</span>
                                                <span>Join</span>
                                    </a>
                                )}

                                {(apt.status === 'upcoming' || apt.status === 'ready') && (
                                    <button
                                        onClick={() => handleCancelAppointment(apt.appointment_id, apt.doctor_name, apt.date, apt.time)}
                                        disabled={cancellingId === apt.appointment_id}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-colors shadow-md shadow-red-500/20"
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            {cancellingId === apt.appointment_id ? 'hourglass_empty' : 'cancel'}
                                        </span>
                                                <span>{cancellingId === apt.appointment_id ? 'Cancelling...' : 'Cancel'}</span>
                                    </button>
                                )}

                                {/* Show prescription button for any appointment with prescription, or grayed out for completed without prescription */}
                                {(apt.has_prescription || apt.status === 'completed') && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            console.log('Button clicked for appointment:', apt.appointment_id, 'has_prescription:', apt.has_prescription);
                                            if (apt.has_prescription) {
                                                handleViewAppointment(apt.appointment_id);
                                            }
                                        }}
                                        disabled={!apt.has_prescription}
                                        className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-colors shadow-md ${
                                            apt.has_prescription
                                                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20 cursor-pointer'
                                                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        }`}
                                        title={!apt.has_prescription ? 'Prescription not available yet' : 'View Prescription'}
                                    >
                                        <span className="material-symbols-outlined text-lg">prescriptions</span>
                                                <span>View Prescription</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile: Status and Actions Section */}
                                <div className="md:hidden flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                    {/* Status Badge */}
                                    <div className="flex justify-center sm:justify-start w-full sm:w-auto">
                                        <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap ${
                                            apt.status === 'upcoming' 
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                                                : apt.status === 'completed' 
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                : apt.status === 'cancelled'
                                                ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2 flex-1 sm:flex-initial">
                                        {apt.status === 'ready' && apt.meeting_link && (
                                            <a
                                                href={apt.meeting_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors shadow-md shadow-green-600/20"
                                            >
                                                <span className="material-symbols-outlined text-base sm:text-lg">videocam</span>
                                                <span>Join</span>
                                            </a>
                                        )}

                                        {(apt.status === 'upcoming' || apt.status === 'ready') && (
                                            <button
                                                onClick={() => handleCancelAppointment(apt.appointment_id, apt.doctor_name, apt.date, apt.time)}
                                                disabled={cancellingId === apt.appointment_id}
                                                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors shadow-md shadow-red-500/20"
                                            >
                                                <span className="material-symbols-outlined text-base sm:text-lg">
                                                    {cancellingId === apt.appointment_id ? 'hourglass_empty' : 'cancel'}
                                                </span>
                                                <span>{cancellingId === apt.appointment_id ? 'Cancelling...' : 'Cancel'}</span>
                                            </button>
                                        )}

                                        {/* Show prescription button for any appointment with prescription, or grayed out for completed without prescription */}
                                        {(apt.has_prescription || apt.status === 'completed') && (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    console.log('Button clicked for appointment:', apt.appointment_id, 'has_prescription:', apt.has_prescription);
                                                    if (apt.has_prescription) {
                                                        handleViewAppointment(apt.appointment_id);
                                                    }
                                                }}
                                                disabled={!apt.has_prescription}
                                                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors shadow-md ${
                                                    apt.has_prescription
                                                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20 cursor-pointer'
                                                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                                }`}
                                                title={!apt.has_prescription ? 'Prescription not available yet' : 'View Prescription'}
                                            >
                                                <span className="material-symbols-outlined text-base sm:text-lg">prescriptions</span>
                                                <span className="hidden sm:inline">View Prescription</span>
                                                <span className="sm:hidden">Prescription</span>
                                    </button>
                                )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
