import { API_BASE_URL } from '../../config';
import { useState, useEffect } from 'react';
import { useModal } from '../../contexts/ModalContext';
import { formatBDDate, formatBDTime, getCurrentBDDate } from '../../utils/dateUtils';

const Appointments = () => {
    const { showAlert } = useModal();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past' | 'all'>('today');
    const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });

    // Filters
    const [filters, setFilters] = useState({
        startDate: getCurrentBDDate(),
        endDate: '',
        doctorId: '',
        status: '',
        specialty: '',
        patientName: ''
    });

    useEffect(() => {
        fetchDoctors();
        fetchAppointments();
    }, [filters, pagination.page, activeTab]);

    const fetchDoctors = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/doctors`);
            if (res.ok) {
                const data = await res.json();
                setDoctors(data);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const today = getCurrentBDDate();
            
            let queryParams = new URLSearchParams();
            
            // Apply tab-based date filtering
            if (activeTab === 'today') {
                queryParams.append('startDate', today);
                queryParams.append('endDate', today);
            } else if (activeTab === 'upcoming') {
                queryParams.append('startDate', today);
                // Don't filter by status here - let backend handle it or show all future appointments
            } else if (activeTab === 'past') {
                queryParams.append('endDate', today);
                // Show completed and cancelled appointments
            }
            
            // Apply manual filters
            if (filters.startDate && activeTab !== 'today') {
                queryParams.set('startDate', filters.startDate);
            }
            if (filters.endDate) {
                queryParams.set('endDate', filters.endDate);
            }
            if (filters.doctorId) {
                queryParams.append('doctorId', filters.doctorId);
            }
            if (filters.status && activeTab === 'all') {
                queryParams.append('status', filters.status);
            }
            if (filters.specialty) {
                queryParams.append('specialty', filters.specialty);
            }
            if (filters.patientName) {
                queryParams.append('patientName', filters.patientName);
            }
            
            queryParams.append('page', pagination.page.toString());
            queryParams.append('limit', pagination.limit.toString());

            const res = await fetch(`${API_BASE_URL}/api/admin/appointments?${queryParams}`, {
                headers: { 'x-auth-token': token || '' }
            });
            
            if (res.ok) {
                const data = await res.json();
                setAppointments(data.appointments || []);
                setPagination(prev => ({
                    ...prev,
                    total: data.pagination?.total || 0,
                    totalPages: data.pagination?.totalPages || 0
                }));
            } else {
                showAlert({ message: 'Failed to load appointments', type: 'error' });
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            showAlert({ message: 'Error loading appointments', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({
            startDate: getCurrentBDDate(),
            endDate: '',
            doctorId: '',
            status: '',
            specialty: '',
            patientName: ''
        });
        setActiveTab('today');
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const copyMeetingLink = (link: string) => {
        navigator.clipboard.writeText(link);
        showAlert({ message: 'Meeting link copied to clipboard', type: 'success' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            case 'upcoming':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'cancelled':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const handleViewDetails = async (appointmentId: number) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/admin/appointments/${appointmentId}`, {
                headers: { 'x-auth-token': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                console.log('Appointment details loaded:', data);
                setSelectedAppointment(data);
            } else {
                const errorData = await res.json().catch(() => ({ message: 'Failed to load appointment details' }));
                console.error('Failed to load appointment details:', errorData);
                showAlert({ message: errorData.message || 'Failed to load appointment details', type: 'error' });
            }
        } catch (error) {
            console.error('Error fetching appointment details:', error);
            showAlert({ message: 'Error loading appointment details', type: 'error' });
        }
    };

    const handleUpdateAppointment = async (appointmentId: number, updates: any) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/admin/appointments/${appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify(updates)
            });
            
            if (res.ok) {
                showAlert({ message: 'Appointment updated successfully', type: 'success' });
                fetchAppointments();
                setSelectedAppointment(null);
            } else {
                const error = await res.json();
                showAlert({ message: error.message || 'Failed to update appointment', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            showAlert({ message: 'Error updating appointment', type: 'error' });
        }
    };

    const uniqueSpecialties = Array.from(new Set(doctors.map(d => d.specialty).filter(Boolean)));

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">Appointments Management</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and filter all appointments</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 sm:gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                {(['today', 'upcoming', 'past', 'all'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors capitalize whitespace-nowrap ${
                            activeTab === tab
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor</label>
                        <select
                            value={filters.doctorId}
                            onChange={(e) => handleFilterChange('doctorId', e.target.value)}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        >
                            <option value="">All Doctors</option>
                            {doctors.map(doc => (
                                <option key={doc.doctor_id} value={doc.doctor_id}>{doc.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        >
                            <option value="">All Status</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialty</label>
                        <select
                            value={filters.specialty}
                            onChange={(e) => handleFilterChange('specialty', e.target.value)}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        >
                            <option value="">All Specialties</option>
                            {uniqueSpecialties.map(spec => (
                                <option key={spec} value={spec}>{spec}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient Name</label>
                        <input
                            type="text"
                            value={filters.patientName}
                            onChange={(e) => handleFilterChange('patientName', e.target.value)}
                            placeholder="Search by name..."
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                    </div>
                </div>
                <div className="mt-3 sm:mt-4 flex justify-end">
                    <button
                        onClick={clearFilters}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-8 sm:py-12">
                        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                        <span className="material-symbols-outlined text-4xl sm:text-6xl text-gray-300 dark:text-gray-600 mb-3 sm:mb-4 block">event_busy</span>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No appointments found</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Date & Time</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Patient</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Doctor</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Meeting Link</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {appointments.map((apt) => (
                                        <tr key={apt.appointment_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-3 text-sm text-gray-800 dark:text-white">
                                                <div>{formatBDDate(apt.date)}</div>
                                                <div className="text-gray-500 dark:text-gray-400">{formatBDTime(apt.time)}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-800 dark:text-white">
                                                <div className="font-medium">{apt.patient_name}</div>
                                                {apt.patient_email && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{apt.patient_email}</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="font-medium text-gray-800 dark:text-white">{apt.doctor_name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{apt.doctor_specialty}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(apt.status)}`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {apt.meeting_link ? (
                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={apt.meeting_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
                                                        >
                                                            <span className="material-symbols-outlined text-base">video_call</span>
                                                            Join Meeting
                                                        </a>
                                                        <button
                                                            onClick={() => copyMeetingLink(apt.meeting_link)}
                                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                            title="Copy link"
                                                        >
                                                            <span className="material-symbols-outlined text-base">content_copy</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500 text-sm">No link</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleViewDetails(apt.appointment_id)}
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
                            {appointments.map((apt) => (
                                <div key={apt.appointment_id} className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm sm:text-base text-gray-800 dark:text-white truncate">{apt.patient_name}</div>
                                            {apt.patient_email && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{apt.patient_email}</div>
                                            )}
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase shrink-0 ${getStatusColor(apt.status)}`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2 text-xs sm:text-sm">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-base">schedule</span>
                                            <span>{formatBDDate(apt.date)} at {formatBDTime(apt.time)}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-base">medical_services</span>
                                            <div>
                                                <div className="font-medium text-gray-800 dark:text-white">{apt.doctor_name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{apt.doctor_specialty}</div>
                                            </div>
                                        </div>
                                        
                                        {apt.meeting_link && (
                                            <div className="flex items-center gap-2 pt-1">
                                                <a
                                                    href={apt.meeting_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm font-medium"
                                                >
                                                    <span className="material-symbols-outlined text-base">video_call</span>
                                                    Join Meeting
                                                </a>
                                                <button
                                                    onClick={() => copyMeetingLink(apt.meeting_link)}
                                                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                                    title="Copy link"
                                                >
                                                    <span className="material-symbols-outlined text-base">content_copy</span>
                                                </button>
                                            </div>
                                        )}
                                        
                                        <button
                                            onClick={() => handleViewDetails(apt.appointment_id)}
                                            className="w-full mt-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5"
                                        >
                                            <span className="material-symbols-outlined text-base">visibility</span>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                        disabled={pagination.page === 1}
                                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                        disabled={pagination.page >= pagination.totalPages}
                                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Appointment Detail Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setSelectedAppointment(null);
                    }
                }}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Appointment Details</h2>
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined text-xl sm:text-2xl">close</span>
                            </button>
                        </div>
                        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
                            {/* Patient Info */}
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">Patient Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Name</label>
                                        <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white break-words">{selectedAppointment.patient_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Age</label>
                                        <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">{selectedAppointment.patient_age || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Gender</label>
                                        <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">{selectedAppointment.patient_gender || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Weight</label>
                                        <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">{selectedAppointment.patient_weight || 'N/A'}</p>
                                    </div>
                                    {selectedAppointment.patient_email && (
                                        <div className="col-span-1 sm:col-span-2">
                                            <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Email</label>
                                            <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white break-words">{selectedAppointment.patient_email}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Doctor Info */}
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">Doctor Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Name</label>
                                        <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white break-words">{selectedAppointment.doctor_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Specialty</label>
                                        <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white break-words">{selectedAppointment.doctor_specialty}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">Appointment Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Date</label>
                                        <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">{formatBDDate(selectedAppointment.date)}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Time</label>
                                        <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">{formatBDTime(selectedAppointment.time)}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Status</label>
                                        <select
                                            value={selectedAppointment.status}
                                            onChange={(e) => setSelectedAppointment({ ...selectedAppointment, status: e.target.value })}
                                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                        >
                                            <option value="upcoming">Upcoming</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    {selectedAppointment.symptoms && (
                                        <div className="col-span-1 sm:col-span-2">
                                            <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Symptoms</label>
                                            <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white break-words">{selectedAppointment.symptoms}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Meeting Link */}
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">Meeting Link</h3>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                    <input
                                        type="text"
                                        value={selectedAppointment.meeting_link || ''}
                                        onChange={(e) => setSelectedAppointment({ ...selectedAppointment, meeting_link: e.target.value })}
                                        placeholder="Enter meeting link..."
                                        className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                    />
                                    {selectedAppointment.meeting_link && (
                                        <>
                                            <a
                                                href={selectedAppointment.meeting_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1.5 text-sm font-medium"
                                            >
                                                <span className="material-symbols-outlined text-base sm:text-lg">video_call</span>
                                                Join
                                            </a>
                                            <button
                                                onClick={() => copyMeetingLink(selectedAppointment.meeting_link)}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
                                            >
                                                <span className="material-symbols-outlined text-base sm:text-lg">content_copy</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Prescription */}
                            {selectedAppointment.prescription ? (
                                <div className="space-y-3 sm:space-y-4">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">Prescription</h3>
                                    
                                    {/* Chief Complaints */}
                                    {selectedAppointment.symptoms && (
                                        <div>
                                            <label className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 block">Chief Complaints:</label>
                                            <p className="text-sm sm:text-base text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg break-words">{selectedAppointment.symptoms}</p>
                                        </div>
                                    )}

                                    {/* On Examination */}
                                    {selectedAppointment.prescription.on_examination && (
                                        <div>
                                            <label className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 block">On Examination:</label>
                                            <p className="text-sm sm:text-base text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg whitespace-pre-wrap break-words">{selectedAppointment.prescription.on_examination}</p>
                                        </div>
                                    )}

                                    {/* Medicines */}
                                    {selectedAppointment.prescription.medicines && (
                                        <div>
                                            <label className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Medicines:</label>
                                            <div className="space-y-2">
                                                {(() => {
                                                    try {
                                                        const medicines = typeof selectedAppointment.prescription.medicines === 'string' 
                                                            ? JSON.parse(selectedAppointment.prescription.medicines)
                                                            : selectedAppointment.prescription.medicines;
                                                        return medicines.map((med: any, idx: number) => (
                                                            <div key={idx} className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                                                <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white break-words">{med.name}</p>
                                                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                                                                    <div>
                                                                        <span className="text-gray-500 dark:text-gray-400">Dose: </span>
                                                                        <span className="text-gray-800 dark:text-white font-medium break-words">{med.dose || 'N/A'}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-500 dark:text-gray-400">Duration: </span>
                                                                        <span className="text-gray-800 dark:text-white font-medium break-words">{med.duration || 'N/A'}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-500 dark:text-gray-400">Instruction: </span>
                                                                        <span className="text-gray-800 dark:text-white font-medium break-words">{med.instruction || 'N/A'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ));
                                                    } catch (e) {
                                                        console.error('Error parsing medicines:', e);
                                                        return <p className="text-red-500 text-sm">Error loading medicines</p>;
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    {/* Investigation */}
                                    {selectedAppointment.prescription.investigation && (
                                        <div>
                                            <label className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 block">Investigation:</label>
                                            <p className="text-sm sm:text-base text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg whitespace-pre-wrap break-words">{selectedAppointment.prescription.investigation}</p>
                                        </div>
                                    )}

                                    {/* Advice */}
                                    {selectedAppointment.prescription.advice && (
                                        <div>
                                            <label className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 block">Advice:</label>
                                            <p className="text-sm sm:text-base text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg whitespace-pre-wrap break-words">{selectedAppointment.prescription.advice}</p>
                                        </div>
                                    )}

                                    {/* Follow-up Date */}
                                    {selectedAppointment.prescription.follow_up_date && (
                                        <div>
                                            <label className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 block">Follow-up Date:</label>
                                            <p className="text-sm sm:text-base text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg">{formatBDDate(selectedAppointment.prescription.follow_up_date)}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">Prescription</h3>
                                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 italic">No prescription available for this appointment.</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setSelectedAppointment(null)}
                                    className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleUpdateAppointment(selectedAppointment.appointment_id, {
                                        status: selectedAppointment.status,
                                        meeting_link: selectedAppointment.meeting_link
                                    })}
                                    className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-red-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointments;
