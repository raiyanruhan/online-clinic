import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../contexts/ModalContext';

const AppointmentDetail = ({ appointment, onClose }: { appointment: any, onClose: () => void }) => {
    const { showAlert } = useModal();
    const navigate = useNavigate();
    const [meetingLink, setMeetingLink] = useState(appointment.meeting_link || '');
    const [status, setStatus] = useState(appointment.status);

    const handleUpdateStatus = async (newStatus: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/doctor/dashboard/appointments/${appointment.appointment_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({ status: newStatus, meeting_link: meetingLink })
            });
            
            if (res.ok) {
                setStatus(newStatus);
                showAlert({ message: `Appointment marked as ${newStatus}`, type: 'success' });
                if (newStatus === 'completed') onClose();
            } else {
                const errorData = await res.json();
                showAlert({ message: errorData.message || `Failed to update appointment status`, type: 'error' });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showAlert({ message: 'Error updating appointment status', type: 'error' });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4" onClick={(e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        }}>
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-start sm:items-center p-3 sm:p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex-1 min-w-0 pr-2">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                            Appointment Details
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Patient: <span className="font-semibold text-primary break-words">{appointment.patient_name}</span></p>
                    </div>
                    <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors shrink-0">
                        <span className="material-symbols-outlined text-xl sm:text-2xl">close</span>
                    </button>
                </div>

                <div className="p-3 sm:p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        {/* Patient Info */}
                        <div className="space-y-4 sm:space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border border-blue-100 dark:border-blue-800">
                                <h3 className="text-sm sm:text-base font-bold text-blue-800 dark:text-blue-300 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                                    <span className="material-symbols-outlined text-base sm:text-lg">person</span>
                                    Patient Information
                                </h3>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Name</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white text-right break-words ml-2">{appointment.patient_name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Age/Gender</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white text-right">{appointment.patient_age || 'N/A'} / {appointment.patient_gender || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Wait Time</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white">10 mins</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">Symptoms</h3>
                                <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                                    {appointment.symptoms || "No symptoms provided."}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 sm:space-y-6">
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4">
                                <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white">Consultation Actions</h3>

                                {(status === 'ready' || status === 'upcoming') && meetingLink && (
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-600 dark:text-gray-400">Meeting Link</label>
                                        <a
                                            href={meetingLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-600/20"
                                        >
                                            <span className="material-symbols-outlined text-base sm:text-lg">videocam</span>
                                            <span>Join Google Meet</span>
                                        </a>
                                    </div>
                                )}
                                {(!meetingLink || (status !== 'ready' && status !== 'upcoming')) && (
                                    <div className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
                                        {!meetingLink ? 'Meeting link will be generated automatically' : 'Meeting not available'}
                                    </div>
                                )}

                                <button
                                    onClick={() => handleUpdateStatus('completed')}
                                    disabled={status === 'completed' || !appointment.prescription}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-colors flex items-center justify-center gap-1.5 sm:gap-2 ${
                                        status === 'completed' || !appointment.prescription
                                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                    title={!appointment.prescription ? 'Please write prescription before completing appointment' : ''}
                                >
                                    <span className="material-symbols-outlined text-base sm:text-lg">check_circle</span>
                                    <span>{status === 'completed' ? 'Consultation Completed' : 'Mark as Completed'}</span>
                                </button>
                                {!appointment.prescription && status !== 'completed' && (
                                    <p className="text-xs text-amber-600 dark:text-amber-400 text-center mt-1">
                                        Please write prescription before completing appointment
                                    </p>
                                )}
                            </div>

                            {status === 'cancelled' ? (
                                <div className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed">
                                    <span className="material-symbols-outlined text-base sm:text-lg">block</span>
                                    <span className="text-center">Cannot Write Prescription (Appointment Cancelled)</span>
                                </div>
                            ) : status === 'completed' ? (
                                <div className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed">
                                    <span className="material-symbols-outlined text-base sm:text-lg">check_circle</span>
                                    <span className="text-center">Prescription Already Written (Appointment Completed)</span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        navigate(`/doctor/prescription/${appointment.appointment_id}`);
                                        onClose();
                                    }}
                                    className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-primary hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-base sm:text-lg">prescriptions</span>
                                    <span>Write Prescription</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetail;
