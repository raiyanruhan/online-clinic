import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useModal } from '../../contexts/ModalContext';
import { formatBDDate } from '../../utils/dateUtils';

const PrescriptionEditor = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();
    const { showAlert } = useModal();
    
    const [appointment, setAppointment] = useState<any>(null);
    const [doctor, setDoctor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Prescription State
    const [medicines, setMedicines] = useState<{ name: string, dose: string, duration: string, instruction: string }[]>([
        { name: '', dose: '', duration: '', instruction: '' }
    ]);
    const [advice, setAdvice] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [needsFollowUp, setNeedsFollowUp] = useState(false);
    const [diagnosis, setDiagnosis] = useState('');
    
    // Medicine suggestions state
    const [medicineSuggestions, setMedicineSuggestions] = useState<{ [key: number]: any[] }>({});
    const [showSuggestions, setShowSuggestions] = useState<{ [key: number]: boolean }>({});
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        if (appointmentId) {
            fetchAppointmentDetails();
        }
    }, [appointmentId]);

    useEffect(() => {
        if (appointment) {
            console.log('Appointment data:', appointment);
            fetchDoctorInfo();
        }
    }, [appointment]);

    const fetchAppointmentDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/doctor/dashboard/appointments/${appointmentId}`, {
                headers: { 'x-auth-token': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                console.log('Fetched appointment data:', data);
                setAppointment(data);
                
                // Extract and set doctor info immediately after setting appointment
                const doctorData = {
                    name: data.doctor_name || data.doctor?.name || '',
                    qualification: data.doctor_qualification || data.doctor?.qualification || '',
                    specialty: data.doctor_specialty || data.doctor?.specialty || '',
                    experience: data.doctor_experience || data.doctor?.experience || '',
                    designation: data.doctor_designation || data.doctor?.designation || '',
                    institute: data.doctor_institute || data.doctor?.institute || '',
                    bio: data.doctor_bio || data.doctor?.bio || '',
                    image_url: data.doctor_image_url || data.doctor?.image_url || ''
                };
                console.log('Setting doctor data from fetch:', doctorData);
                setDoctor(doctorData);
                
                // Load existing prescription if available
                if (data.prescription) {
                    setMedicines(data.prescription.medicines || [{ name: '', dose: '', duration: '', instruction: '' }]);
                    setAdvice(data.prescription.advice || '');
                    const followUp = data.prescription.follow_up_date || '';
                    setFollowUpDate(followUp);
                    setNeedsFollowUp(!!followUp);
                    setDiagnosis(data.prescription.diagnosis || '');
                }
            } else {
                showAlert({ message: 'Appointment not found', type: 'error' });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 500);
            }
        } catch (error) {
            console.error('Error fetching appointment:', error);
            showAlert({ message: 'Error loading appointment', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctorInfo = () => {
        // Extract doctor info from appointment (already fetched from backend)
        if (appointment) {
            const doctorData = {
                name: appointment.doctor_name || appointment.doctor?.name,
                qualification: appointment.doctor_qualification || appointment.doctor?.qualification,
                specialty: appointment.doctor_specialty || appointment.doctor?.specialty,
                experience: appointment.doctor_experience || appointment.doctor?.experience,
                designation: appointment.doctor_designation || appointment.doctor?.designation,
                institute: appointment.doctor_institute || appointment.doctor?.institute,
                bio: appointment.doctor_bio || appointment.doctor?.bio,
                image_url: appointment.doctor_image_url || appointment.doctor?.image_url
            };
            console.log('Setting doctor data:', doctorData);
            setDoctor(doctorData);
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
        
        // Reset selected index when typing
        setSelectedSuggestionIndex(prev => ({ ...prev, [index]: -1 }));
        
        // Fetch suggestions when medicine name changes
        if (field === 'name') {
            const { query, dosageFilter } = extractSearchQuery(value);
            // Allow search if:
            // 1. Query has 2+ chars (normal search)
            // 2. There's a dosage filter and total input is at least the prefix length (e.g., "tab." = 4 chars)
            const hasDosageFilter = !!dosageFilter;
            const minLengthForDosageFilter = 4; // "tab." is 4 chars
            if (query.length >= 2 || (hasDosageFilter && value.trim().length >= minLengthForDosageFilter)) {
                fetchMedicineSuggestions(index, query, dosageFilter);
            } else if (value.length < 2) {
                setMedicineSuggestions(prev => ({ ...prev, [index]: [] }));
                setShowSuggestions(prev => ({ ...prev, [index]: false }));
                setSelectedSuggestionIndex(prev => ({ ...prev, [index]: -1 }));
            }
        }
    };
    
    const getDosageFormAbbreviation = (dosageForm: string): string => {
        if (!dosageForm) return '';
        const form = dosageForm.toLowerCase();
        if (form.includes('tablet')) return 'tab.';
        if (form.includes('syrup') || form.includes('liquid') || form.includes('suspension') || form.includes('solution')) return 'liq.';
        if (form.includes('capsule')) return 'cap.';
        if (form.includes('injection') || form.includes('injectable')) return 'inj.';
        if (form.includes('cream') || form.includes('ointment') || form.includes('gel')) return 'top.';
        if (form.includes('drop')) return 'drop';
        if (form.includes('spray')) return 'spray';
        return '';
    };
    
    const extractSearchQuery = (value: string): { query: string; dosageFilter?: string } => {
        const trimmed = value.trim();
        // Check for dosage form prefixes at the start
        const dosagePrefixes = [
            { prefix: 'tab.', filter: 'tablet' },
            { prefix: 'liq.', filter: 'liquid' },
            { prefix: 'cap.', filter: 'capsule' },
            { prefix: 'inj.', filter: 'injection' },
            { prefix: 'top.', filter: 'topical' },
            { prefix: 'drop', filter: 'drop' },
            { prefix: 'spray', filter: 'spray' }
        ];
        
        for (const { prefix, filter } of dosagePrefixes) {
            if (trimmed.toLowerCase().startsWith(prefix)) {
                const remaining = trimmed.substring(prefix.length).trim();
                // Return the remaining text as query, and the filter
                // Even if remaining is empty, we still want to filter by dosage form
                return { query: remaining, dosageFilter: filter };
            }
        }
        
        // No prefix found, return original value
        return { query: trimmed };
    };
    
    const fetchMedicineSuggestions = async (index: number, query: string, dosageFilter?: string) => {
        try {
            let url = `http://localhost:5000/api/medicines/search?query=${encodeURIComponent(query)}`;
            if (dosageFilter) {
                url += `&dosageFilter=${encodeURIComponent(dosageFilter)}`;
            }
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setMedicineSuggestions(prev => ({ ...prev, [index]: data }));
                setShowSuggestions(prev => ({ ...prev, [index]: true }));
                setSelectedSuggestionIndex(prev => ({ ...prev, [index]: -1 }));
            }
        } catch (error) {
            console.error('Error fetching medicine suggestions:', error);
        }
    };
    
    const selectMedicine = (index: number, medicine: any) => {
        const newMedicines = [...medicines];
        let medicineName = medicine.brandName;
        
        // Append dosage form abbreviation if available
        const dosageForm = medicine.dosageForm || '';
        const abbreviation = getDosageFormAbbreviation(dosageForm);
        if (abbreviation) {
            medicineName = `${abbreviation} ${medicine.brandName}`;
        }
        
        newMedicines[index].name = medicineName;
        setMedicines(newMedicines);
        setShowSuggestions(prev => ({ ...prev, [index]: false }));
        setMedicineSuggestions(prev => ({ ...prev, [index]: [] }));
        setSelectedSuggestionIndex(prev => ({ ...prev, [index]: -1 }));
    };
    
    const handleMedicineKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        const suggestions = medicineSuggestions[index] || [];
        const currentIndex = selectedSuggestionIndex[index] ?? -1;
        
        if (!showSuggestions[index] || suggestions.length === 0) {
            return;
        }
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = currentIndex < suggestions.length - 1 ? currentIndex + 1 : 0;
                setSelectedSuggestionIndex(prev => ({ ...prev, [index]: nextIndex }));
                // Scroll into view
                const nextElement = document.getElementById(`suggestion-${index}-${nextIndex}`);
                if (nextElement) {
                    nextElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : suggestions.length - 1;
                setSelectedSuggestionIndex(prev => ({ ...prev, [index]: prevIndex }));
                // Scroll into view
                const prevElement = document.getElementById(`suggestion-${index}-${prevIndex}`);
                if (prevElement) {
                    prevElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
                break;
            case 'Enter':
                e.preventDefault();
                if (currentIndex >= 0 && currentIndex < suggestions.length) {
                    selectMedicine(index, suggestions[currentIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowSuggestions(prev => ({ ...prev, [index]: false }));
                setSelectedSuggestionIndex(prev => ({ ...prev, [index]: -1 }));
                break;
        }
    };

    const handleRemoveMedicine = (index: number) => {
        if (medicines.length > 1) {
            const newMedicines = medicines.filter((_, i) => i !== index);
            setMedicines(newMedicines);
        }
    };

    const handleSavePrescription = async () => {
        if (!appointmentId) return;
        
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/doctor/dashboard/appointments/${appointmentId}/prescription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({
                    medicines: medicines.filter(m => m.name.trim()),
                    advice,
                    follow_up_date: needsFollowUp ? (followUpDate || null) : null,
                    diagnosis: diagnosis || null
                })
            });

            if (res.ok) {
                showAlert({ message: 'Prescription saved and sent to patient!', type: 'success' });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 500);
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

    if (loading) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading prescription...</p>
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

    if (appointment.status === 'cancelled') {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md text-center">
                    <span className="material-symbols-outlined text-red-500 text-6xl mb-4 block">cancel</span>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Appointment Cancelled</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        This appointment has been cancelled. Prescriptions cannot be created for cancelled appointments.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const currentDate = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span>Back to Dashboard</span>
                    </button>

                    {/* Prescription Pad */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        {/* Prescription Header - Doctor Details Section */}
                        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 border-b-2 border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                {/* Doctor Image/Icon */}
                                <div className="shrink-0">
                                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        {doctor?.image_url ? (
                                            <img 
                                                src={doctor.image_url} 
                                                alt={doctor?.name || 'Doctor'} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="material-symbols-outlined text-4xl md:text-5xl text-gray-400">person</span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Doctor Info */}
                                <div className="flex-1">
                                    <h1 className="text-secondary text-xl md:text-2xl font-bold leading-tight mb-2 flex items-center gap-2">
                                        {doctor?.name || appointment?.doctor_name || 'Dr. Name'}
                                        <span className="material-symbols-outlined text-green-500 icon-filled text-lg md:text-xl" title="ভেরিফাইড">verified</span>
                                    </h1>
                                    
                                    {(doctor?.qualification || appointment?.doctor_qualification) && (
                                        <p className="text-text-main/80 dark:text-gray-300 text-base md:text-lg mb-1">
                                            {doctor?.qualification || appointment?.doctor_qualification}
                                        </p>
                                    )}
                                    
                                    {(doctor?.specialty || appointment?.doctor_specialty) && (
                                        <p className="text-text-main/60 dark:text-gray-400 text-sm md:text-base font-medium mb-3">
                                            {doctor?.specialty || appointment?.doctor_specialty}
                                        </p>
                                    )}
                                    
                                    <div className="flex flex-wrap gap-3 mt-2">
                                        {(doctor?.experience || appointment?.doctor_experience) && (
                                            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-secondary text-sm">medical_services</span>
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                    {doctor?.experience || appointment?.doctor_experience}
                                                </span>
                                            </div>
                                        )}
                                        {(doctor?.institute || appointment?.doctor_institute) && (
                                            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-secondary text-sm">apartment</span>
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                    {doctor?.institute || appointment?.doctor_institute}
                                                </span>
                                            </div>
                                        )}
                                        {(doctor?.designation || appointment?.doctor_designation) && (
                                            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-secondary text-sm">badge</span>
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                    {doctor?.designation || appointment?.doctor_designation}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Patient Info Section - Below Header */}
                        <div className="p-6 sm:p-8 border-b-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Name:</label>
                                    <div className="text-gray-800 dark:text-white font-medium text-lg border-b-2 border-gray-400 dark:border-gray-500 pb-2 min-h-[2rem]">
                                        {appointment.patient_name || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Age:</label>
                                    <div className="text-gray-800 dark:text-white font-medium text-lg border-b-2 border-gray-400 dark:border-gray-500 pb-2 min-h-[2rem]">
                                        {appointment.patient_age || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Sex:</label>
                                    <div className="text-gray-800 dark:text-white font-medium text-lg border-b-2 border-gray-400 dark:border-gray-500 pb-2 min-h-[2rem]">
                                        {appointment.patient_gender || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Wt:</label>
                                    <div className="text-gray-800 dark:text-white font-medium text-lg border-b-2 border-gray-400 dark:border-gray-500 pb-2 min-h-[2rem]">
                                        {appointment.patient_weight ? `${appointment.patient_weight} kg` : 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Date:</label>
                                    <div className="text-gray-800 dark:text-white font-medium text-lg border-b-2 border-gray-400 dark:border-gray-500 pb-2 min-h-[2rem]">
                                        {formatBDDate(appointment.date)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Prescription Body with Watermark */}
                        <div className="relative p-6 sm:p-8 min-h-[600px] bg-white dark:bg-gray-800">
                            {/* Watermark Background - Large Mother and Baby Icon */}
                            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none overflow-hidden">
                                <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2">
                                    <span className="material-symbols-outlined text-[250px] sm:text-[350px] text-[#8B1538] dark:text-pink-300">pregnant_woman</span>
                                </div>
                                {/* Decorative wavy lines at bottom right */}
                                <div className="absolute bottom-8 right-8 opacity-10">
                                    <svg width="100" height="40" viewBox="0 0 100 40" fill="none">
                                        <path d="M0 20 Q25 10, 50 20 T100 20" stroke="#8B1538" strokeWidth="2" fill="none"/>
                                        <path d="M0 25 Q25 15, 50 25 T100 25" stroke="#8B1538" strokeWidth="1.5" fill="none"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Symptoms Section */}
                                {appointment.symptoms && (
                                    <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Chief Complaints:</h3>
                                        <p className="text-gray-800 dark:text-gray-200">{appointment.symptoms}</p>
                                    </div>
                                )}

                                {/* Diagnosis Section */}
                                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Diagnosis:</h3>
                                    <textarea
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px] resize-y"
                                        placeholder="Enter diagnosis..."
                                        value={diagnosis}
                                        onChange={e => setDiagnosis(e.target.value)}
                                    />
                                </div>

                                {/* Medicines Section */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Medicines</h3>
                                        <button
                                            onClick={handleAddMedicine}
                                            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-lg transition-colors flex items-center gap-2 text-sm"
                                        >
                                            <span className="material-symbols-outlined text-lg">add</span>
                                            Add Medicine
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {medicines.map((med, idx) => (
                                            <div key={idx} className="grid grid-cols-12 gap-3 items-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="col-span-12 sm:col-span-4 relative">
                                                    <input
                                                        placeholder="Medicine Name"
                                                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                                        value={med.name}
                                                        onChange={e => handleMedicineChange(idx, 'name', e.target.value)}
                                                        onKeyDown={e => handleMedicineKeyDown(idx, e)}
                                                        onFocus={() => {
                                                            if (med.name.length >= 2 && medicineSuggestions[idx]?.length > 0) {
                                                                setShowSuggestions(prev => ({ ...prev, [idx]: true }));
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            // Delay hiding suggestions to allow click
                                                            setTimeout(() => {
                                                                setShowSuggestions(prev => ({ ...prev, [idx]: false }));
                                                            }, 200);
                                                        }}
                                                    />
                                                    {showSuggestions[idx] && medicineSuggestions[idx]?.length > 0 && (
                                                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                            {medicineSuggestions[idx].map((suggestion, sugIdx) => {
                                                                const isSelected = selectedSuggestionIndex[idx] === sugIdx;
                                                                return (
                                                                    <div
                                                                        key={sugIdx}
                                                                        id={`suggestion-${idx}-${sugIdx}`}
                                                                        onMouseDown={(e) => {
                                                                            e.preventDefault(); // Prevent blur event
                                                                            selectMedicine(idx, suggestion);
                                                                        }}
                                                                        onMouseEnter={() => {
                                                                            setSelectedSuggestionIndex(prev => ({ ...prev, [idx]: sugIdx }));
                                                                        }}
                                                                        className={`p-3 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
                                                                            isSelected 
                                                                                ? 'bg-primary/20 dark:bg-primary/30' 
                                                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                                        }`}
                                                                    >
                                                                        <div className="font-semibold text-gray-800 dark:text-white text-sm">
                                                                            {suggestion.brandName}
                                                                            {suggestion.source === 'generic' && (
                                                                                <span className="ml-2 text-xs text-primary font-normal">(Generic)</span>
                                                                            )}
                                                                        </div>
                                                                        {suggestion.generic && suggestion.generic !== suggestion.brandName && (
                                                                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                                                {suggestion.generic}
                                                                            </div>
                                                                        )}
                                                                        {suggestion.strength && (
                                                                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                                                                                {suggestion.strength} {suggestion.dosageForm}
                                                                            </div>
                                                                        )}
                                                                        {suggestion.drugClass && (
                                                                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                                                                                {suggestion.drugClass}
                                                                            </div>
                                                                        )}
                                                                        {suggestion.indication && (
                                                                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 italic">
                                                                                {suggestion.indication}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-span-6 sm:col-span-2">
                                                    <input
                                                        placeholder="Dose (1+0+1)"
                                                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                                        value={med.dose}
                                                        onChange={e => handleMedicineChange(idx, 'dose', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-6 sm:col-span-2">
                                                    <input
                                                        placeholder="Duration (7 days)"
                                                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                                        value={med.duration}
                                                        onChange={e => handleMedicineChange(idx, 'duration', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-10 sm:col-span-3">
                                                    <input
                                                        placeholder="Instruction (After meal)"
                                                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                                        value={med.instruction}
                                                        onChange={e => handleMedicineChange(idx, 'instruction', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-2 sm:col-span-1 flex justify-center">
                                                    <button
                                                        onClick={() => handleRemoveMedicine(idx)}
                                                        disabled={medicines.length === 1}
                                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Advice Section */}
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Clinical Advice / Notes:</label>
                                    <textarea
                                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white h-32 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                        placeholder="Rest for 2 days. Drink plenty of water. Avoid heavy lifting..."
                                        value={advice}
                                        onChange={e => setAdvice(e.target.value)}
                                    />
                                </div>

                                {/* Follow-up Date */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <input
                                            type="checkbox"
                                            id="needsFollowUp"
                                            checked={needsFollowUp}
                                            onChange={(e) => {
                                                setNeedsFollowUp(e.target.checked);
                                                if (!e.target.checked) {
                                                    setFollowUpDate('');
                                                }
                                            }}
                                            className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary/20 focus:ring-2 cursor-pointer"
                                        />
                                        <label htmlFor="needsFollowUp" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                                            Follow-up Date Required
                                        </label>
                                    </div>
                                    {needsFollowUp && (
                                        <input
                                            type="date"
                                            min={currentDate}
                                            className="w-full sm:w-auto p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                            value={followUpDate}
                                            onChange={e => setFollowUpDate(e.target.value)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 sm:p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col sm:flex-row gap-4 justify-end">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSavePrescription}
                                disabled={isSaving}
                                className="px-8 py-3 bg-primary hover:bg-red-700 disabled:bg-gray-400 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">save</span>
                                        Save & Send Prescription
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PrescriptionEditor;

