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
            setFormData(prev => ({
                ...prev,
                patient_name: user.name || '',
            }));
        }
        fetchDoctor();
        fetchAvailableDates();
        checkActiveAppointment();
    }, [doctorId]);

    const checkActiveAppointment = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('http://localhost:5000/api/patient/dashboard/appointments', {
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
            const res = await fetch(`http://localhost:5000/api/doctors/${doctorId}/available-dates?startDate=${startDateStr}&endDate=${endDateStr}`);
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
            const res = await fetch(`http://localhost:5000/api/doctors/${doctorId}`);
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
            const res = await fetch(`http://localhost:5000/api/doctors/${doctorId}/available-slots?date=${date}`);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showAlert({ message: 'Please login to book an appointment', type: 'warning' });
                navigate('/login');
                return;
            }

            const res = await fetch('http://localhost:5000/api/patient/dashboard/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    doctor_id: doctorId,
                    ...formData
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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-gray-100">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-8">
                {hasActiveAppointment && activeAppointmentInfo && (
                    <div className="mb-6 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-2xl">warning</span>
                            <div className="flex-1">
                                <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-1">Active Appointment Found</h3>
                                <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
                                    You already have an active appointment scheduled for{' '}
                                    <span className="font-semibold">
                                        {formatBDDateTime(activeAppointmentInfo.date, activeAppointmentInfo.time)}
                                    </span>
                                </p>
                                <p className="text-xs text-yellow-600 dark:text-yellow-500">
                                    You can only have one active appointment at a time. Please complete or cancel your existing appointment before booking a new one.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Booking Form */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h1 className="text-2xl font-bold text-text-main dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                                অ্যাপয়েন্টমেন্ট বুকিং
                            </h1>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-text-main dark:text-white">রোগীর নাম</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white"
                                        placeholder="আপনার নাম লিখুন"
                                        value={formData.patient_name}
                                        onChange={e => setFormData({ ...formData, patient_name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-text-main dark:text-white">বয়স</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white"
                                            placeholder="বয়স"
                                            value={formData.patient_age}
                                            onChange={e => setFormData({ ...formData, patient_age: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-text-main dark:text-white">লিঙ্গ</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white"
                                            value={formData.patient_gender}
                                            onChange={e => setFormData({ ...formData, patient_gender: e.target.value })}
                                        >
                                            <option value="Male">পুরুষ (Male)</option>
                                            <option value="Female">মহিলা (Female)</option>
                                            <option value="Other">অন্যান্য (Other)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-text-main dark:text-white">ওজন (কেজি)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white"
                                            placeholder="ওজন"
                                            value={formData.patient_weight}
                                            onChange={e => setFormData({ ...formData, patient_weight: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-text-main dark:text-white mb-3">তারিখ নির্বাচন করুন</label>
                                        {loadingDates ? (
                                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                                                <div className="text-gray-500">Loading calendar...</div>
                                            </div>
                                        ) : (
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
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-text-main dark:text-white">সময় নির্বাচন করুন</label>
                                    {!formData.date ? (
                                        <div className="w-full px-4 py-6 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 text-center">
                                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-4xl mb-2 block">calendar_today</span>
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">Please select a date first</p>
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
                                    <label className="block text-sm font-bold text-text-main dark:text-white">ফোন নাম্বার</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white"
                                        placeholder="017XXXXXXXX"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-text-main dark:text-white">সমস্যা সম্পর্কে লিখুন</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 dark:text-white"
                                        placeholder="আপনার শারীরিক সমস্যা সংক্ষেপে লিখুন..."
                                        value={formData.symptoms}
                                        onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || hasActiveAppointment}
                                    className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
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
                    <div className="w-full lg:w-96 space-y-6">
                        <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800 sticky top-24">
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">বুকিং সারাংশ</h3>
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="size-16 rounded-xl bg-gray-200 bg-cover bg-center"
                                    style={doctor?.image_url ? { backgroundImage: `url("${doctor.image_url}")` } : {}}>
                                    {!doctor?.image_url && <span className="material-symbols-outlined text-4xl text-gray-400 m-auto flex h-full items-center justify-center">person</span>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-main dark:text-white">{doctor?.name}</h4>
                                    <p className="text-xs text-gray-500">{doctor?.specialty}</p>
                                </div>
                            </div>
                            <div className="space-y-3 text-sm text-text-sub dark:text-gray-400">
                                <div className="flex justify-between">
                                    <span>তারিখ</span>
                                    <span className="font-bold text-text-main dark:text-white">{formData.date || '--'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>সময়</span>
                                    <span className="font-bold text-text-main dark:text-white">{formData.time || '--'}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <span className="font-bold text-text-main dark:text-white">ফি</span>
                                    <span className="font-bold text-primary text-lg">৳ {doctor?.fee || '0'}</span>
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
