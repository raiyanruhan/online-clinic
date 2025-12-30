import { useState } from 'react';
import { useModal } from '../../contexts/ModalContext';

const AppointmentDetail = ({ appointment, onClose }: { appointment: any, onClose: () => void }) => {
    const { showAlert } = useModal();
    const [view, setView] = useState<'details' | 'prescription'>('details');
    const [meetingLink, setMeetingLink] = useState(appointment.meeting_link || '');
    const [status, setStatus] = useState(appointment.status);

    // Prescription State
    const [medicines, setMedicines] = useState<{ name: string, dose: string, duration: string, instruction: string }[]>([{ name: '', dose: '', duration: '', instruction: '' }]);
    const [advice, setAdvice] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [isSaving, setIsSaving] = useState(false);

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
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleAddMedicine = () => {
        setMedicines([...medicines, { name: '', dose: '', duration: '', instruction: '' }]);
    };

    const handleMedicineChange = (index: number, field: string, value: string) => {
        const newMedicines = [...medicines];
        // @ts-ignore
        newMedicines[index][field] = value;
        setMedicines(newMedicines);
    };

    const handleRemoveMedicine = (index: number) => {
        const newMedicines = medicines.filter((_, i) => i !== index);
        setMedicines(newMedicines);
    };

    const handleSavePrescription = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/doctor/dashboard/appointments/${appointment.appointment_id}/prescription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({
                    medicines: medicines.filter(m => m.name), // Filter empty
                    advice,
                    follow_up_date: followUpDate
                })
            });

            if (res.ok) {
                showAlert({ message: 'Prescription created & sent to patient!', type: 'success' });
                setStatus('completed'); // Auto complete
                onClose();
            } else {
                const error = await res.json();
                showAlert({ message: error.message || 'Failed to save prescription', type: 'error' });
            }
        } catch (error) {
            console.error('Error saving prescription:', error);
            showAlert({ message: 'Error saving prescription', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 sticky top-0 z-10 backdrop-blur-md">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            {view === 'prescription' ? 'Write Prescription' : 'Appointment Details'}
                        </h2>
                        <p className="text-sm text-gray-500"> Patient: <span className="font-semibold text-primary">{appointment.patient_name}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6">
                    {/* View Switcher */}
                    {view === 'details' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Patient Info */}
                            <div className="space-y-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800">
                                    <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined">person</span>
                                        Patient Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">Name</span>
                                            <span className="font-semibold text-gray-800 dark:text-white">{appointment.patient_name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">Age/Gender</span>
                                            <span className="font-semibold text-gray-800 dark:text-white">{appointment.patient_age || 'N/A'} / {appointment.patient_gender || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">Wait Time</span>
                                            <span className="font-semibold text-gray-800 dark:text-white">10 mins</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-3">Symptoms</h3>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {appointment.symptoms || "No symptoms provided."}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-2xl space-y-4">
                                    <h3 className="font-bold text-gray-800 dark:text-white">Consultation Actions</h3>

                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-600 dark:text-gray-400">Meeting Link (WhatsApp/Meet)</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                                                placeholder="https://meet.google.com/..."
                                                value={meetingLink}
                                                onChange={e => setMeetingLink(e.target.value)}
                                            />
                                            <a
                                                href={meetingLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`p-2.5 rounded-lg flex items-center justify-center text-white transition-colors ${meetingLink ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
                                            >
                                                <span className="material-symbols-outlined">videocam</span>
                                            </a>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleUpdateStatus('completed')}
                                        disabled={status === 'completed'}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">check_circle</span>
                                        {status === 'completed' ? 'Consultation Completed' : 'Mark as Completed'}
                                    </button>
                                </div>

                                {status === 'cancelled' ? (
                                    <div className="w-full py-4 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 font-bold rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed">
                                        <span className="material-symbols-outlined">block</span>
                                        Cannot Write Prescription (Appointment Cancelled)
                                    </div>
                                ) : status === 'completed' ? (
                                    <div className="w-full py-4 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 font-bold rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed">
                                        <span className="material-symbols-outlined">check_circle</span>
                                        Prescription Already Written (Appointment Completed)
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setView('prescription')}
                                        className="w-full py-4 bg-primary hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">prescriptions</span>
                                        Write Prescription
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {status === 'cancelled' ? (
                                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border-2 border-red-200 dark:border-red-800 text-center">
                                    <span className="material-symbols-outlined text-red-500 dark:text-red-400 text-5xl mb-3 block">cancel</span>
                                    <h3 className="font-bold text-red-800 dark:text-red-300 text-lg mb-2">Appointment Cancelled</h3>
                                    <p className="text-red-700 dark:text-red-400 text-sm">
                                        This appointment has been cancelled. Prescriptions cannot be created for cancelled appointments.
                                    </p>
                                    <button
                                        onClick={() => setView('details')}
                                        className="mt-4 px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Back to Details
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30 text-sm text-red-800 dark:text-red-300 mb-6">
                                        <p><strong>Note:</strong> Creating a prescription will automatically mark this appointment as completed.</p>
                                    </div>

                            {/* Medicine List */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-gray-800 dark:text-white">Medicines</h3>
                                    <button onClick={handleAddMedicine} className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                        <span className="material-symbols-outlined text-lg">add</span> Add Medicine
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {medicines.map((med, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-2 items-start bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl">
                                            <div className="col-span-4">
                                                <input
                                                    placeholder="Medicine Name"
                                                    className="w-full p-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                    value={med.name}
                                                    onChange={e => handleMedicineChange(idx, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    placeholder="1+0+1"
                                                    className="w-full p-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                    value={med.dose}
                                                    onChange={e => handleMedicineChange(idx, 'dose', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    placeholder="7 days"
                                                    className="w-full p-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                    value={med.duration}
                                                    onChange={e => handleMedicineChange(idx, 'duration', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <input
                                                    placeholder="After meal"
                                                    className="w-full p-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                    value={med.instruction}
                                                    onChange={e => handleMedicineChange(idx, 'instruction', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-1 flex justify-center pt-1.5">
                                                <button onClick={() => handleRemoveMedicine(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded-md">
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Advice & Follow-up */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Clinical Advice / Notes</label>
                                    <textarea
                                        className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm h-32 focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Rest for 2 days. Drink plenty of water..."
                                        value={advice}
                                        onChange={e => setAdvice(e.target.value)}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Follow-up Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm"
                                        value={followUpDate}
                                        onChange={e => setFollowUpDate(e.target.value)}
                                    />
                                </div>
                            </div>

                                    {/* Actions */}
                                    <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <button
                                            onClick={() => setView('details')}
                                            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSavePrescription}
                                            disabled={isSaving || status === 'cancelled'}
                                            className={`flex-1 py-3 font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 ${
                                                status === 'cancelled'
                                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                                    : 'bg-primary hover:bg-red-700 text-white'
                                            }`}
                                        >
                                            {isSaving ? 'Processing...' : 'Save & Send Prescription'}
                                            <span className="material-symbols-outlined">send</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetail;
