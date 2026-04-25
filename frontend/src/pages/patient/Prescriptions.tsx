import { API_BASE_URL } from '../../config';
import { useEffect, useState } from 'react';
import { useModal } from '../../contexts/ModalContext';
import { formatBDDate } from '../../utils/dateUtils';

const Prescriptions = () => {
    const { showAlert } = useModal();
    // We will reuse the getMyAppointments(filter='history') or create a dedicated one.
    // Ideally we fetch completed appointments, then for each fetch prescription details or just render meaningful data if backend returned it.
    // The current backend `getMyAppointments` doesn't join prescriptions.
    // Let's rely on fetching `history` appointments, and then user clicks 'View Prescription'.
    // Or we fetch specialized prescription list.
    // For simplicity, let's list completed appointments and allow viewing details.

    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
    const [viewingId, setViewingId] = useState<string | null>(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/patient/dashboard/appointments?filter=history`, {
                headers: { 'x-auth-token': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                // Filter only completed ones roughly
                setAppointments(data.filter((a: any) => a.status === 'completed'));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewPrescription = async (id: string) => {
        setViewingId(id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/patient/dashboard/appointments/${id}`, {
                headers: { 'x-auth-token': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedPrescription(data);
            }
        } catch (error) {
            showAlert({ message: 'Failed to load prescription', type: 'error' });
        } finally {
            setViewingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">আপনার প্রেসক্রিপশন সমূহ</h3>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : appointments.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <p>কোন প্রেসক্রিপশন পাওয়া যায়নি।</p>
                        </div>
                    ) : (
                        appointments.map(apt => (
                            <div key={apt.appointment_id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white">Dr. {apt.doctor_name}</h4>
                                    <p className="text-sm text-gray-500">{formatBDDate(apt.date)} - {apt.specialty}</p>
                                </div>
                                <button
                                    onClick={() => handleViewPrescription(apt.appointment_id)}
                                    disabled={viewingId === apt.appointment_id}
                                    className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold rounded-lg text-sm hover:bg-purple-200 transition-colors"
                                >
                                    {viewingId === apt.appointment_id ? 'Loading...' : 'View Prescription'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            {selectedPrescription && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                            <div>
                                <h2 className="text-2xl font-bold text-primary">Roudromoyee Online Clinic</h2>
                                <p className="text-sm text-gray-500">Digital Prescription</p>
                            </div>
                            <button onClick={() => setSelectedPrescription(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Doctor & Patient Info */}
                            <div className="flex justify-between text-sm">
                                <div>
                                    <p className="font-bold text-lg text-gray-800 dark:text-white">{selectedPrescription.doctor_name}</p>
                                    <p className="text-gray-500">{selectedPrescription.specialty}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800 dark:text-white">Patient: {selectedPrescription.patient_name}</p>
                                    <p className="text-gray-500">Date: {formatBDDate(selectedPrescription.date)}</p>
                                </div>
                            </div>

                            {/* Medicines */}
                            {selectedPrescription.prescription ? (
                                <>
                                    <div>
                                        <h3 className="font-bold border-b border-gray-200 dark:border-gray-600 pb-2 mb-4 text-gray-800 dark:text-white">Medicines (Rx)</h3>
                                        <div className="space-y-4">
                                            {selectedPrescription.prescription.medicines.map((med: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-gray-800 dark:text-white text-lg">{med.name}</p>
                                                        <p className="text-sm text-gray-500">{med.instruction}</p>
                                                    </div>
                                                    <div className="text-right text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                        {med.dose} | {med.duration}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Advice */}
                                    {selectedPrescription.prescription.advice && (
                                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                                            <h4 className="font-bold text-yellow-800 dark:text-yellow-500 mb-2">Advice</h4>
                                            <p className="text-gray-700 dark:text-gray-300">{selectedPrescription.prescription.advice}</p>
                                        </div>
                                    )}

                                    {/* Follow Up */}
                                    {selectedPrescription.prescription.follow_up_date && (
                                        <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <p className="font-bold text-primary">Next Visit: {formatBDDate(selectedPrescription.prescription.follow_up_date)}</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12 text-gray-400 italic">
                                    Prescription details awaiting...
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                            <button
                                onClick={() => window.print()}
                                className="px-6 py-2 bg-gray-800 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-black transition-colors"
                            >
                                <span className="material-symbols-outlined">print</span>
                                Print / Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prescriptions;
