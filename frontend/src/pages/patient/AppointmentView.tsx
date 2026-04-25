import { API_BASE_URL } from '../../config';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useModal } from '../../contexts/ModalContext';
import { formatBDDate, formatBDTime } from '../../utils/dateUtils';
import PrescriptionView from '../../components/PrescriptionView';

const AppointmentView = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();
    const { showAlert } = useModal();
    const [appointment, setAppointment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (appointmentId) {
            fetchAppointmentDetails();
        }
    }, [appointmentId]);

    const fetchAppointmentDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/patient/dashboard/appointments/${appointmentId}`, {
                headers: { 'x-auth-token': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setAppointment(data);
            } else {
                showAlert({ message: 'Appointment not found', type: 'error' });
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error fetching appointment:', error);
            showAlert({ message: 'Error loading appointment', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading appointment...</p>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">Appointment not found</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-1 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/dashboard?tab=appointments')}
                        className="mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg sm:text-xl">arrow_back</span>
                        <span>Back to Appointments</span>
                    </button>

                    {/* Appointment Details Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-4 sm:mb-6">
                        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Appointment Details</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <h3 className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Doctor</h3>
                                    <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white break-words">{appointment.doctor_name || 'N/A'}</p>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words">{appointment.specialty || ''}</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Date & Time</h3>
                                    <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white break-words">
                                        {formatBDDate(appointment.date)} at {formatBDTime(appointment.time)}
                                    </p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Status</h3>
                                    <span className={`inline-block px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                        appointment.status === 'upcoming' 
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                                            : appointment.status === 'completed' 
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                            : appointment.status === 'cancelled'
                                            ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                    }`}>
                                        {appointment.status}
                                    </span>
                                </div>
                                
                                {appointment.symptoms && (
                                    <div className="col-span-1 sm:col-span-2">
                                        <h3 className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Symptoms</h3>
                                        <p className="text-sm sm:text-base text-gray-800 dark:text-white break-words">{appointment.symptoms}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Prescription Section */}
                    {appointment.prescription ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <PrescriptionView
                                appointment={appointment}
                                onClose={() => navigate('/dashboard?tab=appointments')}
                            />
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center">
                            <span className="material-symbols-outlined text-4xl sm:text-6xl text-gray-300 dark:text-gray-600 mb-3 sm:mb-4 block">prescriptions</span>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">No Prescription Available</h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                The doctor has not written a prescription for this appointment yet.
                            </p>
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default AppointmentView;

