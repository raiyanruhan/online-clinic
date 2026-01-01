import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, [navigate]); // Check on navigation changes

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (user?.role === 'admin') return '/admin-dashboard';
        return '/dashboard';
    };

    // Admin menu items
    const adminMenuItems = [
        { id: 'overview', label: 'Overview', icon: 'dashboard', path: '/admin-dashboard/overview' },
        { id: 'appointments', label: 'Appointments', icon: 'event', path: '/admin-dashboard/appointments' },
        { id: 'reports', label: 'Reports', icon: 'assessment', path: '/admin-dashboard/reports' },
        { id: 'doctors', label: 'Doctors', icon: 'medical_services', path: '/admin-dashboard/doctors' }
    ];

    // Get active admin page from URL
    const getActiveAdminPage = () => {
        const path = location.pathname;
        if (path.includes('/appointments')) return 'appointments';
        if (path.includes('/reports')) return 'reports';
        if (path.includes('/doctors')) return 'doctors';
        return 'overview';
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border-color bg-white/95 backdrop-blur-sm dark:bg-background-dark/95 transition-all duration-300">
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-3">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        <div className="flex items-center justify-between whitespace-nowrap">
                            <Link to="/" className="flex items-center gap-3 text-primary cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                                <img src="/logo.png" alt="Roudromoyee Online Clinic" className="h-12 w-auto object-contain" />

                            </Link>

                            <div className="hidden lg:flex flex-1 justify-end gap-8 items-center">
                                <div className="flex items-center gap-8">
                                    <Link to="/" className="text-text-main dark:text-gray-200 text-base font-medium hover:text-primary transition-colors relative group">
                                        হোম
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                    </Link>
                                    <Link to="/services" className="text-text-main dark:text-gray-200 text-base font-medium hover:text-primary transition-colors relative group">
                                        সেবাসমূহ
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                    </Link>
                                    <Link to="/doctors" className="text-text-main dark:text-gray-200 text-base font-medium hover:text-primary transition-colors relative group">
                                        ডাক্তারগণ
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                    </Link>
                                    <Link to="/blog" className="text-text-main dark:text-gray-200 text-base font-medium hover:text-primary transition-colors relative group">
                                        ব্লগ
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                    </Link>
                                    <Link to="/contact" className="text-text-main dark:text-gray-200 text-base font-medium hover:text-primary transition-colors relative group">
                                        যোগাযোগ
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                    </Link>
                                </div>
                                <div className="flex gap-3">
                                    {user ? (
                                        <>
                                            <Link to={getDashboardLink()} className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 bg-primary hover:bg-red-700 active:scale-95 transition-all text-white text-sm font-bold shadow-sm shadow-primary/20">
                                                <span className="truncate">ড্যাশবোর্ড</span>
                                            </Link>
                                            <button onClick={handleLogout} className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-all">
                                                লগ আউট
                                            </button>
                                        </>
                                    ) : (
                                        <Link to="/login" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 bg-primary hover:bg-red-700 active:scale-95 transition-all text-white text-sm font-bold shadow-sm shadow-primary/20">
                                            <span className="truncate">লগ ইন</span>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Mobile Menu Icon */}
                            <div className="lg:hidden">
                                <button
                                    onClick={toggleMenu}
                                    className="p-2 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined">menu</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <>
                <div 
                    className={`lg:hidden fixed inset-0 transition-opacity duration-300 ease-in-out ${
                        isMenuOpen ? 'opacity-100 pointer-events-auto z-[105]' : 'opacity-0 pointer-events-none z-[-1]'
                    }`}
                    style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(4px)',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100vw',
                        height: '100vh'
                    }}
                    onClick={toggleMenu}
                ></div>
                
                {/* Sidebar Menu with slide animation */}
                <div 
                    className={`shadow-2xl flex flex-col p-6 lg:hidden transition-transform duration-300 ease-in-out ${
                        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    style={{ 
                        position: 'fixed',
                        top: '0px',
                        right: '0px',
                        height: '100vh',
                        width: '280px',
                        backgroundColor: '#ffffff',
                        opacity: 1,
                        backdropFilter: 'none',
                        zIndex: 110,
                        overflowY: 'auto',
                        willChange: 'transform',
                        pointerEvents: 'auto',
                        paddingBottom: '80px'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-primary">{user?.role === 'admin' ? 'Admin Panel' : 'মেনু'}</h3>
                            <button onClick={toggleMenu} className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        {user?.role === 'admin' ? (
                            // Admin Menu Items
                            <div className="flex flex-col gap-3">
                                {adminMenuItems.map((item) => {
                                    const isActive = getActiveAdminPage() === item.id;
                                    return (
                                        <Link
                                            key={item.id}
                                            to={item.path}
                                            onClick={toggleMenu}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                                isActive
                                                    ? 'bg-primary text-white shadow-md'
                                                    : 'text-gray-800 hover:text-primary hover:bg-gray-100'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined">{item.icon}</span>
                                            <span className="text-lg font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            // Regular Navigation Links (for non-admin users)
                            <div className="flex flex-col gap-6">
                                <Link to="/" onClick={toggleMenu} className="text-lg font-medium text-gray-800 hover:text-primary transition-colors">হোম</Link>
                                <Link to="/services" onClick={toggleMenu} className="text-lg font-medium text-gray-800 hover:text-primary transition-colors">সেবাসমূহ</Link>
                                <Link to="/doctors" onClick={toggleMenu} className="text-lg font-medium text-gray-800 hover:text-primary transition-colors">ডাক্তারগণ</Link>
                                <Link to="/blog" onClick={toggleMenu} className="text-lg font-medium text-gray-800 hover:text-primary transition-colors">ব্লগ</Link>
                                <Link to="/contact" onClick={toggleMenu} className="text-lg font-medium text-gray-800 hover:text-primary transition-colors">যোগাযোগ</Link>
                            </div>
                        )}
                        <div className="mt-auto flex flex-col gap-4 pb-4">
                            {user ? (
                                <>
                                    <Link to={getDashboardLink()} onClick={toggleMenu} className="w-full flex items-center justify-center rounded-full h-12 bg-primary text-white font-bold shadow-lg">ড্যাশবোর্ড</Link>
                                    <button onClick={() => { handleLogout(); toggleMenu(); }} className="w-full flex items-center justify-center rounded-full h-12 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-bold">লগ আউট</button>
                                </>
                            ) : (
                                <button onClick={() => { navigate('/login'); toggleMenu(); }} className="w-full flex items-center justify-center rounded-full h-12 bg-primary text-white font-bold shadow-lg">লগ ইন</button>
                            )}
                        </div>
                    </div>
            </>
        </header>
    );
};

export default Header;
