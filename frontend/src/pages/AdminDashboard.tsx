import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Overview from './admin/Overview';
import Appointments from './admin/Appointments';
import Reports from './admin/Reports';
import Doctors from './admin/Doctors';

type Page = 'overview' | 'appointments' | 'reports' | 'doctors';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [prevPath, setPrevPath] = useState(location.pathname);

    // Get active page from URL
    const getActivePageFromPath = (): Page => {
        const path = location.pathname;
        if (path.includes('/appointments')) return 'appointments';
        if (path.includes('/reports')) return 'reports';
        if (path.includes('/doctors')) return 'doctors';
        return 'overview';
    };

    const activePage = getActivePageFromPath();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(userStr);
        if (user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        // Redirect to overview if on base admin-dashboard route
        if (location.pathname === '/admin-dashboard' || location.pathname === '/admin-dashboard/') {
            navigate('/admin-dashboard/overview', { replace: true });
        }
    }, [navigate, location.pathname]);

    // Handle loading state on route change
    useEffect(() => {
        if (location.pathname !== prevPath) {
            setIsLoading(true);
            setPrevPath(location.pathname);
            // Simulate loading time (can be adjusted based on actual page load)
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [location.pathname, prevPath]);

    const menuItems = [
        { id: 'overview' as Page, label: 'Overview', icon: 'dashboard', path: '/admin-dashboard/overview' },
        { id: 'appointments' as Page, label: 'Appointments', icon: 'event', path: '/admin-dashboard/appointments' },
        { id: 'reports' as Page, label: 'Reports', icon: 'assessment', path: '/admin-dashboard/reports' },
        { id: 'doctors' as Page, label: 'Doctors', icon: 'medical_services', path: '/admin-dashboard/doctors' }
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col" style={{ marginTop: '-72px', paddingTop: '72px' }}>
            <Header />
            
            <div className="flex flex-1 relative" style={{ height: 'calc(100vh - 72px)' }}>
                {/* Sidebar - Hidden on mobile */}
                <aside className={`hidden lg:block lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 fixed inset-y-0 left-0 z-30`} style={{ top: '72px', height: 'calc(100vh - 72px)' }}>
                    <div className="h-full flex flex-col">
                        {/* Sidebar Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">analytics</span>
                                    Admin Panel
                                </h2>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="flex-1 p-4 space-y-2 overflow-hidden">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        activePage === item.id
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* Sidebar Footer */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Admin Dashboard v1.0
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto relative lg:ml-64 w-full">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
                            </div>
                        </div>
                    )}
                    <div className="p-4 md:p-6 lg:p-8">
                        <Routes>
                            <Route path="overview" element={<Overview />} />
                            <Route path="appointments" element={<Appointments />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="doctors" element={<Doctors />} />
                            <Route path="" element={<Navigate to="overview" replace />} />
                            <Route path="*" element={<Navigate to="overview" replace />} />
                        </Routes>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default AdminDashboard;
