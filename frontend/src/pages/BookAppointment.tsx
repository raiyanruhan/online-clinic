import { API_BASE_URL } from '../config';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useModal } from '../contexts/ModalContext';
import Calendar from '../components/Calendar';
import TimeSelector from '../components/TimeSelector';
import { formatBDDate, formatBDTime, formatBDDateTime } from '../utils/dateUtils';

const BookAppointment = () => {
    const { doctorId } = useParams<{ doctorId: string }>();
    const navigate = useNavigate();
    const { showAlert } = useModal();
    const [doctor, setDoctor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [allSlots, setAllSlots] = useState<string[]>([]); // All possible slots for the day
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [loadingDates, setLoadingDates] = useState(false);
    const [hasActiveAppointment, setHasActiveAppointment] = useState(false);
    const [activeAppointmentInfo, setActiveAppointmentInfo] = useState<any>(null);

    // Validation Errors State
    const [validationErrors, setValidationErrors] = useState<{
        patient_name?: string;
        patient_age?: string;
        patient_weight?: string;
        phone?: string;
    }>({});

    // Form State
    const [formData, setFormData] = useState({
        patient_name: '',
        patient_age: '',
        patient_gender: 'Male', // Default
        patient_weight: '',
        phone: '',
        symptoms: '',
        date: '',
        time: ''
    });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            
            // Prevent doctors and admins from booking appointments
            if (user.role === 'doctor' || user.role === 'admin') {
                showAlert({ 
                    message: user.role === 'doctor' 
                        ? 'Doctors cannot book appointments. Please use your doctor dashboard.' 
                        : 'Admins cannot book appointments.', 
                    type: 'error' 
                });
                navigate('/dashboard');
                return;
            }
            
            setFormData(prev => ({
                ...prev,
                patient_name: user.name || '',
            }));
        }
        fetchDoctor();
        fetchAvailableDates();
        checkActiveAppointment();
    }, [doctorId, navigate, showAlert]);

    const checkActiveAppointment = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/patient/dashboard/appointments`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                // Check if there's an upcoming appointment (exclude cancelled)
                const upcoming = data.filter((apt: any) => apt.status === 'upcoming');
                if (upcoming.length > 0) {
                    setHasActiveAppointment(true);
                    setActiveAppointmentInfo(upcoming[0]);
                } else {
                    setHasActiveAppointment(false);
                    setActiveAppointmentInfo(null);
                }
            }
        } catch (error) {
            console.error('Error checking active appointment:', error);
        }
    };

    const fetchAvailableDates = async () => {
        if (!doctorId) return;
        setLoadingDates(true);
        try {
            // Calculate date range (next 60 days)
            const today = new Date();
            const endDate = new Date(today);
            endDate.setDate(today.getDate() + 60);
            
            const startDateStr = today.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];
            
            // Fetch available dates in one API call
            const res = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/available-dates?startDate=${startDateStr}&endDate=${endDateStr}`);
            if (res.ok) {
                const data = await res.json();
                setAvailableDates(data.availableDates || []);
            } else {
                // If 404, the route might not be registered - log for debugging
                if (res.status === 404) {
                    console.warn(`Route not found: /api/doctors/${doctorId}/available-dates - Server may need restart`);
                }
                setAvailableDates([]);
            }
        } catch (error) {
            console.error('Error fetching available dates:', error);
            setAvailableDates([]);
        } finally {
            setLoadingDates(false);
        }
    };

    const fetchDoctor = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}`);
            if (res.ok) {
                const data = await res.json();
                setDoctor(data);
            } else {
                showAlert({ message: 'Doctor not found', type: 'error' });
                navigate('/doctors');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async (date: string) => {
        if (!date || !doctorId) return;
        
        setLoadingSlots(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/available-slots?date=${date}`);
            if (res.ok) {
                const data = await res.json();
                console.log('Available slots response:', data);
                setAvailableSlots(data.availableSlots || []);
                // Store all slots (including booked ones) to show them all
                setAllSlots(data.allSlots || data.availableSlots || []);
                // Store booked slots to show them as disabled
                setBookedSlots(data.bookedSlots || []);
                // Clear selected time if it's not available, is booked, or is past
                if (formData.time) {
                    const isAvailable = data.availableSlots?.includes(formData.time);
                    const isBooked = data.bookedSlots?.some((booked: string) => {
                        const normalizedTime = formData.time.length > 5 ? formData.time.substring(0, 5) : formData.time;
                        const normalizedBooked = booked.length > 5 ? booked.substring(0, 5) : booked;
                        return normalizedTime === normalizedBooked;
                    });
                    // Check if time is past (for today)
                    let isPast = false;
                    if (date) {
                        const today = new Date();
                        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                        if (date === todayStr) {
                            const [slotHours, slotMinutes] = formData.time.split(':').map(Number);
                            const slotTime = new Date();
                            slotTime.setHours(slotHours, slotMinutes, 0, 0);
                            const now = new Date();
                            isPast = slotTime < now;
                        }
                    }
                    if (!isAvailable || isBooked || isPast) {
                        setFormData(prev => ({ ...prev, time: '' }));
                    }
                }
            } else {
                const error = await res.json();
                console.error('Error fetching slots:', error);
                setAvailableSlots([]);
                setAllSlots([]);
                setBookedSlots([]);
                if (error.message) {
                    console.log(error.message);
                }
            }
        } catch (error) {
            console.error('Error fetching available slots:', error);
            setAvailableSlots([]);
            setAllSlots([]);
            setBookedSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    // Validation Functions
    const validatePhone = (phone: string): string | undefined => {
        if (!phone) {
            return 'ফোন নাম্বার প্রয়োজন';
        }
        // Remove spaces and special characters, keep only digits
        const digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length !== 11) {
            return 'ফোন নাম্বার অবশ্যই ১১ সংখ্যার হতে হবে (যেমন: 01712345678)';
        }
        // Check if it starts with valid Bangladeshi mobile prefixes
        const validPrefixes = ['013', '014', '015', '016', '017', '018', '019'];
        const prefix = digitsOnly.substring(0, 3);
        if (!validPrefixes.includes(prefix)) {
            return 'বৈধ বাংলাদেশী মোবাইল নাম্বার লিখুন';
        }
        return undefined;
    };

    const validateAge = (age: string): string | undefined => {
        if (!age) {
            return 'বয়স প্রয়োজন';
        }
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 0) {
            return 'বৈধ বয়স লিখুন';
        }
        if (ageNum > 121) {
            return 'বয়স ১২১ বছরের বেশি হতে পারবে না';
        }
        return undefined;
    };

    const validateWeight = (weight: string): string | undefined => {
        if (!weight) {
            return undefined; // Weight is optional
        }
        const weightNum = parseFloat(weight);
        if (isNaN(weightNum) || weightNum < 0) {
            return 'বৈধ ওজন লিখুন';
        }
        if (weightNum > 330) {
            return 'ওজন ৩৩০ কেজির বেশি হতে পারবে না';
        }
        return undefined;
    };

    const validateForm = (): boolean => {
        const errors: typeof validationErrors = {};

        // Validate name
        if (!formData.patient_name.trim()) {
            errors.patient_name = 'রোগীর নাম প্রয়োজন';
        }

        // Validate age
        const ageError = validateAge(formData.patient_age);
        if (ageError) {
            errors.patient_age = ageError;
        }

        // Validate weight (optional but must be valid if provided)
        if (formData.patient_weight) {
            const weightError = validateWeight(formData.patient_weight);
            if (weightError) {
                errors.patient_weight = weightError;
            }
        }

        // Validate phone
        const phoneError = validatePhone(formData.phone);
        if (phoneError) {
            errors.phone = phoneError;
        }

        // Validate date and time
        if (!formData.date) {
            showAlert({ message: 'অনুগ্রহ করে তারিখ নির্বাচন করুন', type: 'warning' });
            return false;
        }
        if (!formData.time) {
            showAlert({ message: 'অনুগ্রহ করে সময় নির্বাচন করুন', type: 'warning' });
            return false;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent any bubbling that might cause auto-submit

        // Validate form before submission
        if (!validateForm()) {
            // Show first error message
            const firstError = Object.values(validationErrors)[0];
            if (firstError) {
                showAlert({ message: firstError, type: 'error' });
            }
            return;
        }

        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showAlert({ message: 'Please login to book an appointment', type: 'warning' });
                navigate('/login');
                return;
            }

            // Normalize phone number (remove spaces and special characters)
            const normalizedPhone = formData.phone.replace(/\D/g, '');

            const res = await fetch(`${API_BASE_URL}/api/patient/dashboard/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    doctor_id: doctorId,
                    ...formData,
                    phone: normalizedPhone
                })
            });

            if (res.ok) {
                showAlert({ message: 'Appointment booked successfully!', type: 'success' });
                navigate('/dashboard'); // Redirect to patient dashboard
            } else {
                const error = await res.json();
                showAlert({ message: error.message || 'Failed to book appointment', type: 'error' });
            }
        } catch (error) {
            console.error('Booking error:', error);
            showAlert({ message: 'Something went wrong', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                        <p className="mt-4 text-gray-500 text-sm sm:text-base">Loading...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-gray-100">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-8">
                {hasActiveAppointment && activeAppointmentInfo && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start gap-2 sm:gap-3">
                            <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-xl sm:text-2xl shrink-0">warning</span>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-1 text-sm sm:text-base">Active Appointment Found</h3>
                                <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-400 mb-2 break-words">
                                    You already have an active appointment scheduled for{' '}
                                    <span className="font-semibold">
                                        {formatBDDateTime(activeAppointmentInfo.date, activeAppointmentInfo.time)}
                                    </span>
                                </p>
                                <p className="text-xs text-yellow-600 dark:text-yellow-500 break-words">
                                    You can only have one active appointment at a time. Please complete or cancel your existing appointment before booking a new one.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                    {/* Main Booking Form */}
                    <div className="flex-1 space-y-4 sm:space-y-6">
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h1 className="text-xl sm:text-2xl font-bold text-text-main dark:text-white mb-4 sm:mb-6 border-b border-gray-100 dark:border-gray-800 pb-3 sm:pb-4">
                                অ্যাপয়েন্টমেন্ট বুকিং
                            </h1>

                            <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-6">
                                <div className="space-y-2 sm:space-y-4">
                                    <label className="block text-xs sm:text-sm font-bold text-text-main dark:text-white">
                                        রোগীর নাম <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white ${
                                            validationErrors.patient_name ? 'border-2 border-red-500' : ''
                                        }`}
                                        placeholder="আপনার নাম লিখুন"
                                        value={formData.patient_name}
                                        onChange={e => {
                                            setFormData({ ...formData, patient_name: e.target.value });
                                            if (validationErrors.patient_name) {
                                                setValidationErrors(prev => ({ ...prev, patient_name: undefined }));
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!formData.patient_name.trim()) {
                                                setValidationErrors(prev => ({ ...prev, patient_name: 'রোগীর নাম প্রয়োজন' }));
                                            }
                                        }}
                                    />
                                    {validationErrors.patient_name && (
                                        <p className="text-xs text-red-500 mt-1">{validationErrors.patient_name}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-xs sm:text-sm font-bold text-text-main dark:text-white">
                                            বয়স <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="121"
                                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white ${
                                                validationErrors.patient_age ? 'border-2 border-red-500' : ''
                                            }`}
                                            placeholder="বয়স"
                                            value={formData.patient_age}
                                            onChange={e => {
                                                const value = e.target.value;
                                                // Only allow numbers
                                                if (value === '' || /^\d+$/.test(value)) {
                                                    setFormData({ ...formData, patient_age: value });
                                                    if (validationErrors.patient_age) {
                                                        setValidationErrors(prev => ({ ...prev, patient_age: undefined }));
                                                    }
                                                }
                                            }}
                                            onBlur={() => {
                                                const error = validateAge(formData.patient_age);
                                                if (error) {
                                                    setValidationErrors(prev => ({ ...prev, patient_age: error }));
                                                }
                                            }}
                                        />
                                        {validationErrors.patient_age && (
                                            <p className="text-xs text-red-500 mt-1">{validationErrors.patient_age}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs sm:text-sm font-bold text-text-main dark:text-white">লিঙ্গ</label>
                                        <select
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white"
                                            value={formData.patient_gender}
                                            onChange={e => setFormData({ ...formData, patient_gender: e.target.value })}
                                        >
                                            <option value="Male">পুরুষ (Male)</option>
                                            <option value="Female">মহিলা (Female)</option>
                                            <option value="Other">অন্যান্য (Other)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 sm:col-span-2 md:col-span-1">
                                        <label className="block text-xs sm:text-sm font-bold text-text-main dark:text-white">ওজন (কেজি)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="330"
                                            step="0.1"
                                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white ${
                                                validationErrors.patient_weight ? 'border-2 border-red-500' : ''
                                            }`}
                                            placeholder="ওজন"
                                            value={formData.patient_weight}
                                            onChange={e => {
                                                const value = e.target.value;
                                                // Allow numbers and one decimal point
                                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                    setFormData({ ...formData, patient_weight: value });
                                                    if (validationErrors.patient_weight) {
                                                        setValidationErrors(prev => ({ ...prev, patient_weight: undefined }));
                                                    }
                                                }
                                            }}
                                            onBlur={() => {
                                                if (formData.patient_weight) {
                                                    const error = validateWeight(formData.patient_weight);
                                                    if (error) {
                                                        setValidationErrors(prev => ({ ...prev, patient_weight: error }));
                                                    }
                                                }
                                            }}
                                        />
                                        {validationErrors.patient_weight && (
                                            <p className="text-xs text-red-500 mt-1">{validationErrors.patient_weight}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 sm:space-y-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-bold text-text-main dark:text-white mb-2 sm:mb-3">তারিখ নির্বাচন করুন</label>
                                        {loadingDates ? (
                                            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center">
                                                <div className="text-gray-500 text-sm sm:text-base">Loading calendar...</div>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                            <Calendar
                                                selectedDate={formData.date}
                                                onDateSelect={(date) => {
                                                    setFormData({ ...formData, date, time: '' });
                                                    fetchAvailableSlots(date);
                                                }}
                                                availableDates={availableDates}
                                                minDate={(() => {
                                                    // Get today's date in local timezone (YYYY-MM-DD format)
                                                    const today = new Date();
                                                    const year = today.getFullYear();
                                                    const month = String(today.getMonth() + 1).padStart(2, '0');
                                                    const day = String(today.getDate()).padStart(2, '0');
                                                    return `${year}-${month}-${day}`;
                                                })()}
                                            />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs sm:text-sm font-bold text-text-main dark:text-white">সময় নির্বাচন করুন</label>
                                    {!formData.date ? (
                                        <div className="w-full px-3 sm:px-4 py-4 sm:py-6 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 text-center">
                                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-3xl sm:text-4xl mb-2 block">calendar_today</span>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Please select a date first</p>
                                        </div>
                                    ) : (
                                        <TimeSelector
                                            availableSlots={allSlots.length > 0 ? allSlots : availableSlots}
                                            selectedTime={formData.time}
                                            onTimeSelect={(time) => {
                                                // Don't allow selecting booked slots or past times
                                                const isBooked = bookedSlots.some(booked => {
                                                    const normalizedTime = time.length > 5 ? time.substring(0, 5) : time;
                                                    const normalizedBooked = booked.length > 5 ? booked.substring(0, 5) : booked;
                                                    return normalizedTime === normalizedBooked;
                                                });
                                                
                                                // Check if time is past (for today)
                                                let isPast = false;
                                                if (formData.date) {
                                                    const today = new Date();
                                                    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                                                    if (formData.date === todayStr) {
                                                        const [slotHours, slotMinutes] = time.split(':').map(Number);
                                                        const slotTime = new Date();
                                                        slotTime.setHours(slotHours, slotMinutes, 0, 0);
                                                        const now = new Date();
                                                        isPast = slotTime < now;
                                                    }
                                                }
                                                
                                                if (!isBooked && !isPast) {
                                                    setFormData({ ...formData, time });
                                                }
                                            }}
                                            loading={loadingSlots}
                                            bookedSlots={bookedSlots}
                                            selectedDate={formData.date}
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs sm:text-sm font-bold text-text-main dark:text-white">
                                        ফোন নাম্বার <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white ${
                                            validationErrors.phone ? 'border-2 border-red-500' : ''
                                        }`}
                                        placeholder="01712345678"
                                        value={formData.phone}
                                        onChange={e => {
                                            const value = e.target.value;
                                            // Allow digits, spaces, and common separators
                                            if (/^[\d\s\-+()]*$/.test(value) || value === '') {
                                                setFormData({ ...formData, phone: value });
                                                if (validationErrors.phone) {
                                                    setValidationErrors(prev => ({ ...prev, phone: undefined }));
                                                }
                                            }
                                        }}
                                        onBlur={() => {
                                            const error = validatePhone(formData.phone);
                                            if (error) {
                                                setValidationErrors(prev => ({ ...prev, phone: error }));
                                            }
                                        }}
                                    />
                                    {validationErrors.phone && (
                                        <p className="text-xs text-red-500 mt-1">{validationErrors.phone}</p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        ১১ সংখ্যার বাংলাদেশী মোবাইল নাম্বার লিখুন (যেমন: 01712345678)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs sm:text-sm font-bold text-text-main dark:text-white">সমস্যা সম্পর্কে লিখুন</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white resize-y"
                                        placeholder="আপনার শারীরিক সমস্যা সংক্ষেপে লিখুন..."
                                        value={formData.symptoms}
                                        onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || hasActiveAppointment}
                                    className={`w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                                        hasActiveAppointment
                                            ? 'bg-gray-400 cursor-not-allowed text-white'
                                            : 'bg-primary hover:bg-red-700 text-white'
                                    }`}
                                >
                                    {hasActiveAppointment 
                                        ? 'You already have an active appointment' 
                                        : submitting 
                                        ? 'Booking...' 
                                        : 'কনফার্ম করুন'
                                    }
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="w-full lg:w-96 space-y-4 sm:space-y-6">
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 dark:border-gray-800 lg:sticky lg:top-24">
                            <h3 className="text-base sm:text-lg font-bold text-text-main dark:text-white mb-3 sm:mb-4">বুকিং সারাংশ</h3>
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gray-200 bg-cover bg-center shrink-0"
                                    style={doctor?.image_url ? { backgroundImage: `url("${doctor.image_url}")` } : {}}>
                                    {!doctor?.image_url && <span className="material-symbols-outlined text-2xl sm:text-4xl text-gray-400 m-auto flex h-full items-center justify-center">person</span>}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-text-main dark:text-white text-sm sm:text-base truncate">{doctor?.name}</h4>
                                    <p className="text-xs text-gray-500 truncate">{doctor?.specialty}</p>
                                </div>
                            </div>
                            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-text-sub dark:text-gray-400">
                                <div className="flex justify-between items-center">
                                    <span>তারিখ</span>
                                    <span className="font-bold text-text-main dark:text-white text-right break-words ml-2">{formData.date ? formatBDDate(formData.date) : '--'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>সময়</span>
                                    <span className="font-bold text-text-main dark:text-white text-right break-words ml-2">{formData.time ? formatBDTime(formData.time) : '--'}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <span className="font-bold text-text-main dark:text-white">ফি</span>
                                    <span className="font-bold text-primary text-base sm:text-lg">৳ {doctor?.fee || '0'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookAppointment;
