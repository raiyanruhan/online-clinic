import { useState, useEffect } from 'react';
import { formatBDDate } from '../utils/dateUtils';

interface PrescriptionViewProps {
    appointment: any;
    onClose: () => void;
}

const PrescriptionView = ({ appointment, onClose }: PrescriptionViewProps) => {
    const [medicineDetails, setMedicineDetails] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        // Fetch medicine details for each medicine in the prescription
        if (appointment?.prescription?.medicines) {
            const fetchMedicineDetails = async () => {
                const details: { [key: string]: any } = {};
                for (const med of appointment.prescription.medicines) {
                    if (med.name) {
                        // Extract medicine name without prefix (tab., liq., etc.)
                        const cleanName = med.name.replace(/^(tab\.|liq\.|cap\.|inj\.|top\.|drop|spray)\s+/i, '').trim();
                        if (cleanName) {
                            try {
                                const res = await fetch(`http://localhost:5000/api/medicines/search?query=${encodeURIComponent(cleanName)}`);
                                if (res.ok) {
                                    const data = await res.json();
                                    // Find exact match first, otherwise take first result
                                    const exactMatch = data.find((m: any) => 
                                        m.brandName.toLowerCase() === cleanName.toLowerCase()
                                    );
                                    if (exactMatch) {
                                        details[med.name] = exactMatch;
                                    } else if (data.length > 0) {
                                        details[med.name] = data[0];
                                    }
                                }
                            } catch (error) {
                                console.error('Error fetching medicine details:', error);
                            }
                        }
                    }
                }
                setMedicineDetails(details);
            };
            fetchMedicineDetails();
        }
    }, [appointment]);

    const doctor = {
        name: appointment?.doctor_name || '',
        qualification: appointment?.doctor_qualification || '',
        specialty: appointment?.doctor_specialty || '',
        experience: appointment?.doctor_experience || '',
        designation: appointment?.doctor_designation || '',
        institute: appointment?.doctor_institute || '',
        image_url: appointment?.doctor_image_url || appointment?.doctor_image || ''
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl w-full border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Prescription</h2>
                <button 
                    onClick={onClose} 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined text-xl sm:text-2xl">close</span>
                </button>
            </div>

            {/* Prescription Content */}
            <div className="p-4 sm:p-6 lg:p-8">
                    {/* Doctor Details Section */}
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 border-b-2 border-gray-200 dark:border-gray-700 mb-4 sm:mb-6">
                        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center md:items-center">
                            {/* Doctor Image/Icon */}
                            <div className="shrink-0">
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl sm:rounded-2xl overflow-hidden shadow-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    {doctor.image_url ? (
                                        <img 
                                            src={doctor.image_url} 
                                            alt={doctor.name || 'Doctor'} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="material-symbols-outlined text-3xl sm:text-4xl md:text-5xl text-gray-400">person</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Doctor Info */}
                            <div className="flex-1 w-full md:w-auto text-center md:text-left">
                                <h1 className="text-secondary text-lg sm:text-xl md:text-2xl font-bold leading-tight mb-2 flex items-center justify-center md:justify-start gap-2">
                                    {doctor.name || 'Dr. Name'}
                                    <span className="material-symbols-outlined text-green-500 icon-filled text-base sm:text-lg md:text-xl" title="ভেরিফাইড">verified</span>
                                </h1>
                                
                                {doctor.qualification && (
                                    <p className="text-text-main/80 dark:text-gray-300 text-sm sm:text-base md:text-lg mb-1">
                                        {doctor.qualification}
                                    </p>
                                )}
                                
                                {doctor.specialty && (
                                    <p className="text-text-main/60 dark:text-gray-400 text-xs sm:text-sm md:text-base font-medium mb-3">
                                        {doctor.specialty}
                                    </p>
                                )}
                                
                                <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 justify-center md:justify-start">
                                    {doctor.experience && (
                                        <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-1.5 sm:gap-2">
                                            <span className="material-symbols-outlined text-secondary text-xs sm:text-sm">medical_services</span>
                                            <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">
                                                {doctor.experience}
                                            </span>
                                        </div>
                                    )}
                                    {doctor.institute && (
                                        <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-1.5 sm:gap-2">
                                            <span className="material-symbols-outlined text-secondary text-xs sm:text-sm">apartment</span>
                                            <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">
                                                {doctor.institute}
                                            </span>
                                        </div>
                                    )}
                                    {doctor.designation && (
                                        <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-1.5 sm:gap-2">
                                            <span className="material-symbols-outlined text-secondary text-xs sm:text-sm">badge</span>
                                            <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">
                                                {doctor.designation}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Patient Info Section */}
                    <div className="p-4 sm:p-6 lg:p-8 border-b-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-4 sm:mb-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Name:</label>
                                <div className="text-gray-800 dark:text-white font-medium text-sm sm:text-base lg:text-lg border-b-2 border-gray-400 dark:border-gray-500 pb-1.5 sm:pb-2 min-h-[1.5rem] sm:min-h-[2rem] break-words">
                                    {appointment?.patient_name || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Age:</label>
                                <div className="text-gray-800 dark:text-white font-medium text-sm sm:text-base lg:text-lg border-b-2 border-gray-400 dark:border-gray-500 pb-1.5 sm:pb-2 min-h-[1.5rem] sm:min-h-[2rem]">
                                    {appointment?.patient_age || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Sex:</label>
                                <div className="text-gray-800 dark:text-white font-medium text-sm sm:text-base lg:text-lg border-b-2 border-gray-400 dark:border-gray-500 pb-1.5 sm:pb-2 min-h-[1.5rem] sm:min-h-[2rem]">
                                    {appointment?.patient_gender || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Wt:</label>
                                <div className="text-gray-800 dark:text-white font-medium text-sm sm:text-base lg:text-lg border-b-2 border-gray-400 dark:border-gray-500 pb-1.5 sm:pb-2 min-h-[1.5rem] sm:min-h-[2rem]">
                                    {appointment?.patient_weight ? `${appointment.patient_weight} kg` : 'N/A'}
                                </div>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Date:</label>
                                <div className="text-gray-800 dark:text-white font-medium text-sm sm:text-base lg:text-lg border-b-2 border-gray-400 dark:border-gray-500 pb-1.5 sm:pb-2 min-h-[1.5rem] sm:min-h-[2rem]">
                                    {appointment?.date ? formatBDDate(appointment.date) : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prescription Body with Watermark */}
                    <div className="relative p-4 sm:p-6 lg:p-8 min-h-[400px] sm:min-h-[600px] bg-white dark:bg-gray-800">
                        {/* Watermark Background */}
                        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none overflow-hidden">
                            <div className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2">
                                <span className="material-symbols-outlined text-[150px] sm:text-[250px] lg:text-[350px] text-[#8B1538] dark:text-pink-300">pregnant_woman</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Chief Complaints Section */}
                            {appointment?.symptoms && (
                                <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Chief Complaints:</h3>
                                    <p className="text-base text-gray-800 dark:text-gray-200 break-words">{appointment.symptoms}</p>
                                </div>
                            )}

                            {/* On Examination Section */}
                            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">On Examination:</h3>
                                <p className="text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                    {appointment?.prescription?.on_examination || 'N/A'}
                                </p>
                                </div>

                            {/* Medicines Section */}
                            {appointment?.prescription?.medicines && appointment.prescription.medicines.length > 0 && (
                                <div className="mb-4 sm:mb-6">
                                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Medicines</h3>
                                    <div className="space-y-3 sm:space-y-4">
                                        {appointment.prescription.medicines.map((med: any, idx: number) => {
                                            const details = medicineDetails[med.name];
                                            return (
                                                <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 lg:p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    {/* Mobile Layout - Stacked */}
                                                    <div className="block sm:hidden space-y-3">
                                                        <div>
                                                            <p className="font-bold text-gray-800 dark:text-white text-base break-words">{med.name}</p>
                                                            {details && (
                                                                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                                                    {details.generic && details.generic !== med.name && (
                                                                        <p className="break-words"><span className="font-semibold">Generic:</span> {details.generic}</p>
                                                                    )}
                                                                    {details.strength && (
                                                                        <p><span className="font-semibold">Strength:</span> {details.strength}</p>
                                                                    )}
                                                                    {details.dosageForm && (
                                                                        <p><span className="font-semibold">Form:</span> {details.dosageForm}</p>
                                                                    )}
                                                                    {details.manufacturer && (
                                                                        <p className="break-words"><span className="font-semibold">Manufacturer:</span> {details.manufacturer}</p>
                                                                    )}
                                                                    {details.drugClass && (
                                                                        <p className="break-words"><span className="font-semibold">Drug Class:</span> {details.drugClass}</p>
                                                                    )}
                                                                    {details.indication && (
                                                                        <p className="break-words"><span className="font-semibold">Indication:</span> {details.indication}</p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Dose</label>
                                                                <p className="text-sm text-gray-800 dark:text-white font-medium break-words">{med.dose || 'N/A'}</p>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Duration</label>
                                                                <p className="text-sm text-gray-800 dark:text-white font-medium break-words">{med.duration || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Instruction</label>
                                                            <p className="text-sm text-gray-800 dark:text-white break-words">{med.instruction || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Desktop Layout - Grid */}
                                                    <div className="hidden md:grid md:grid-cols-12 md:gap-4">
                                                        {/* Medicine Name and Details */}
                                                        <div className="md:col-span-4">
                                                            <p className="font-bold text-gray-800 dark:text-white text-base lg:text-lg break-words">{med.name}</p>
                                                            {details && (
                                                                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                                                    {details.generic && details.generic !== med.name && (
                                                                        <p className="break-words"><span className="font-semibold">Generic:</span> {details.generic}</p>
                                                                    )}
                                                                    {details.strength && (
                                                                        <p><span className="font-semibold">Strength:</span> {details.strength}</p>
                                                                    )}
                                                                    {details.dosageForm && (
                                                                        <p><span className="font-semibold">Form:</span> {details.dosageForm}</p>
                                                                    )}
                                                                    {details.manufacturer && (
                                                                        <p className="break-words"><span className="font-semibold">Manufacturer:</span> {details.manufacturer}</p>
                                                                    )}
                                                                    {details.drugClass && (
                                                                        <p className="break-words"><span className="font-semibold">Drug Class:</span> {details.drugClass}</p>
                                                                    )}
                                                                    {details.indication && (
                                                                        <p className="break-words"><span className="font-semibold">Indication:</span> {details.indication}</p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Dose */}
                                                        <div className="md:col-span-2">
                                                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Dose</label>
                                                            <p className="text-sm lg:text-base text-gray-800 dark:text-white font-medium break-words">{med.dose || 'N/A'}</p>
                                                        </div>
                                                        {/* Duration */}
                                                        <div className="md:col-span-2">
                                                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Duration</label>
                                                            <p className="text-sm lg:text-base text-gray-800 dark:text-white font-medium break-words">{med.duration || 'N/A'}</p>
                                                        </div>
                                                        {/* Instruction */}
                                                        <div className="md:col-span-4">
                                                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Instruction</label>
                                                            <p className="text-sm lg:text-base text-gray-800 dark:text-white break-words">{med.instruction || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Tablet Layout - Grid (between mobile and desktop) */}
                                                    <div className="hidden sm:grid md:hidden sm:grid-cols-12 sm:gap-3">
                                                        {/* Medicine Name and Details */}
                                                        <div className="sm:col-span-12 mb-2">
                                                            <p className="font-bold text-gray-800 dark:text-white text-base break-words">{med.name}</p>
                                                            {details && (
                                                                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                                                    {details.generic && details.generic !== med.name && (
                                                                        <p className="break-words"><span className="font-semibold">Generic:</span> {details.generic}</p>
                                                                    )}
                                                                    {details.strength && (
                                                                        <p><span className="font-semibold">Strength:</span> {details.strength}</p>
                                                                    )}
                                                                    {details.dosageForm && (
                                                                        <p><span className="font-semibold">Form:</span> {details.dosageForm}</p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Dose, Duration, Instruction in row */}
                                                        <div className="sm:col-span-4">
                                                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Dose</label>
                                                            <p className="text-sm text-gray-800 dark:text-white font-medium break-words">{med.dose || 'N/A'}</p>
                                                        </div>
                                                        <div className="sm:col-span-4">
                                                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Duration</label>
                                                            <p className="text-sm text-gray-800 dark:text-white font-medium break-words">{med.duration || 'N/A'}</p>
                                                        </div>
                                                        <div className="sm:col-span-4">
                                                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Instruction</label>
                                                            <p className="text-sm text-gray-800 dark:text-white break-words">{med.instruction || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Investigation Section */}
                            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Investigation:</h3>
                                <p className="text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                    {appointment?.prescription?.investigation || 'N/A'}
                                </p>
                            </div>

                            {/* Advice Section */}
                            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Advice:</h3>
                                <p className="text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                    {appointment?.prescription?.advice || 'N/A'}
                                </p>
                                </div>

                            {/* Follow-up Date */}
                            {appointment?.prescription?.follow_up_date && (
                                <div className="text-center pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <p className="font-bold text-primary text-base sm:text-lg lg:text-xl">
                                        Next Visit: {formatBDDate(appointment.prescription.follow_up_date)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                    onClick={() => window.print()}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-800 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors text-sm sm:text-base"
                >
                    <span className="material-symbols-outlined text-lg sm:text-xl">print</span>
                    <span className="hidden sm:inline">Print / Download PDF</span>
                    <span className="sm:hidden">Print</span>
                </button>
                <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default PrescriptionView;

