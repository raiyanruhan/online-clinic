import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useModal } from '../contexts/ModalContext';

const BottomNavigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showAlert } = useModal();
    const [user, setUser] = useState<any>(null);
    const [closestAppointment, setClosestAppointment] = useState<any>(null);
    const [loadingAppointment, setLoadingAppointment] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, [location]);

    useEffect(() => {
        if (user && (user.role === 'doctor' || user.role === 'patient')) {
            fetchClosestAppointment();
        }
    }, [user]);

    const fetchClosestAppointment = async () => {
        if (!user) return;
        
        setLoadingAppointment(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoadingAppointment(false);
                return;
            }

            if (user.role === 'doctor') {
                // Fetch doctor's upcoming appointments
                const res = await fetch('http://localhost:5000/api/doctor/dashboard/appointments?filter=upcoming', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                if (res.ok) {
                    const appointments = await res.json();
                    // Find the closest appointment (earliest date and time)
                    if (appointments.length > 0) {
                        const closest = appointments[0]; // Already sorted by date ASC, time ASC
                        if (closest.meeting_link && closest.status === 'ready') {
                            setClosestAppointment(closest);
                        } else {
                            setClosestAppointment(null);
                        }
                    } else {
                        setClosestAppointment(null);
                    }
                }
            } else if (user.role === 'patient') {
                // Fetch patient's latest appointment with meeting link
                const res = await fetch('http://localhost:5000/api/patient/dashboard/stats', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.nextAppointment && data.nextAppointment.meeting_link) {
                        setClosestAppointment(data.nextAppointment);
                    } else {
                        setClosestAppointment(null);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching appointment:', error);
            setClosestAppointment(null);
        } finally {
            setLoadingAppointment(false);
        }
    };

    const handleJoinMeeting = () => {
        if (closestAppointment && closestAppointment.meeting_link) {
            window.open(closestAppointment.meeting_link, '_blank');
        }
    };

    const handleBookAppointment = () => {
        if (!user) {
            // Store the intended destination
            localStorage.setItem('redirectAfterLogin', '/doctors');
            navigate('/login');
        } else {
            navigate('/doctors');
        }
    };

    const handleAppointmentClick = () => {
        if (!user) {
            localStorage.setItem('redirectAfterLogin', '/dashboard?tab=appointments');
            navigate('/login');
        } else {
            if (user.role === 'patient') {
                navigate('/dashboard?tab=appointments');
            } else if (user.role === 'doctor') {
                navigate('/dashboard?tab=appointments');
            } else {
                navigate('/dashboard?tab=appointments');
            }
        }
    };

    const handleJoinDoctorAppointment = () => {
        if (closestAppointment) {
            if (closestAppointment.meeting_link && closestAppointment.status === 'ready') {
                // Join the meeting directly
                window.open(closestAppointment.meeting_link, '_blank');
            } else {
                // Navigate to appointments tab with appointment ID to open detail modal
                navigate(`/dashboard?tab=appointments&appointmentId=${closestAppointment.appointment_id}`);
            }
        }
    };

    // No login navigation
    if (!user) {
        return (
            <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
                <div className="flex items-center justify-around h-16 px-2">
                    {/* Login */}
                    <Link
                        to="/login"
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname === '/login' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">login</span>
                        <span className="text-[10px] font-medium">লগিন</span>
                    </Link>

                    {/* Home */}
                    <Link
                        to="/"
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">home</span>
                        <span className="text-[10px] font-medium">হোম</span>
                    </Link>

                    {/* Blog */}
                    <Link
                        to="/blog"
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname.startsWith('/blog') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">article</span>
                        <span className="text-[10px] font-medium">ব্লগ</span>
                    </Link>

                    {/* Appointment - redirects to login first */}
                    <button
                        onClick={handleBookAppointment}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname.startsWith('/appointment') || location.pathname.startsWith('/doctors')
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">event</span>
                        <span className="text-[10px] font-medium">অ্যপয়েনমেন্ট</span>
                    </button>

                    {/* Doctors */}
                    <Link
                        to="/doctors"
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname.startsWith('/doctors') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">medical_services</span>
                        <span className="text-[10px] font-medium">ডাক্তার</span>
                    </Link>
                </div>
            </nav>
        );
    }

    // Doctor navigation
    if (user.role === 'doctor') {
        return (
            <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
                <div className="flex items-center justify-around h-16 px-2">
                    {/* Dashboard */}
                    <Link
                        to="/dashboard?tab=overview"
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname.startsWith('/dashboard') && location.search.includes('tab=overview')
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">dashboard</span>
                        <span className="text-[10px] font-medium">ড্যাশবোর্ড</span>
                    </Link>

                    {/* Appointments */}
                    <Link
                        to="/dashboard?tab=appointments"
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname.startsWith('/dashboard') && location.search.includes('tab=appointments')
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">event</span>
                        <span className="text-[10px] font-medium">অ্যপয়েনমেন্ট</span>
                    </Link>

                    {/* Blog */}
                    <Link
                        to="/dashboard?tab=blogs"
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname.startsWith('/dashboard') && location.search.includes('tab=blogs')
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">article</span>
                        <span className="text-[10px] font-medium">ব্লগ</span>
                    </Link>

                    {/* Join Button - for closest appointment */}
                    <button
                        onClick={handleJoinDoctorAppointment}
                        disabled={!closestAppointment}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            closestAppointment 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        }`}
                        title={closestAppointment ? 'Join closest appointment' : 'No upcoming appointments'}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">video_call</span>
                        <span className="text-[10px] font-medium">জয়েন</span>
                    </button>
                </div>
            </nav>
        );
    }

    // Patient navigation
    if (user.role === 'patient') {
        return (
            <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
                <div className="flex items-center justify-around h-16 px-2">
                    {/* Join Now - Latest Meeting */}
                    <button
                        onClick={handleJoinMeeting}
                        disabled={!closestAppointment}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            closestAppointment 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        }`}
                        title={closestAppointment ? 'Join latest meeting' : 'No active meetings'}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">Connect_Without_Contact</span>
                        <span className="text-[10px] font-medium">জয়েন</span>
                    </button>

                    {/* Book Now */}
                    <button
                        onClick={() => navigate('/doctors')}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname.startsWith('/doctors') || location.pathname.startsWith('/appointment')
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">Library_Add_Check
                        </span>
                        <span className="text-[10px] font-medium">বুক করুন</span>
                    </button>

                    {/* Home */}
                    <Link
                        to="/dashboard?tab=home"
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname.startsWith('/dashboard')
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">atr
                        </span>
                        <span className="text-[10px] font-medium">ড্যাশবোর্ড</span>
                    </Link>

                    {/* Blog */}
                    <Link
                        to="/blog"
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname.startsWith('/blog') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">article</span>
                        <span className="text-[10px] font-medium">ব্লগ</span>
                    </Link>
                </div>
            </nav>
        );
    }

    // Admin navigation
    if (user.role === 'admin') {
        return (
            <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
                <div className="flex items-center justify-around h-16 px-2">
                    {/* Dashboard */}
                    <Link
                        to="/admin-dashboard/overview"
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname.includes('/admin-dashboard/overview') || (location.pathname === '/admin-dashboard' && !location.pathname.includes('/appointments') && !location.pathname.includes('/reports') && !location.pathname.includes('/doctors'))
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">dashboard</span>
                        <span className="text-[10px] font-medium">ড্যাশবোর্ড</span>
                    </Link>

                    {/* Appointments */}
                    <Link
                        to="/admin-dashboard/appointments"
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname.includes('/admin-dashboard/appointments')
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">event</span>
                        <span className="text-[10px] font-medium">অ্যপয়েনমেন্ট</span>
                    </Link>

                    {/* Doctors */}
                    <Link
                        to="/admin-dashboard/doctors"
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname.includes('/admin-dashboard/doctors')
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">medical_services</span>
                        <span className="text-[10px] font-medium">ডাক্তার</span>
                    </Link>

                    {/* Reports */}
                    <Link
                        to="/admin-dashboard/reports"
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            location.pathname.includes('/admin-dashboard/reports')
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl mb-0.5">assessment</span>
                        <span className="text-[10px] font-medium">রিপোর্ট</span>
                    </Link>
                </div>
            </nav>
        );
    }

    return null;
};

export default BottomNavigation;
