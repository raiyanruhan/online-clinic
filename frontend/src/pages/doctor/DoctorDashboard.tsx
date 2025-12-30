import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Overview from './Overview';
import AppointmentList from './AppointmentList';
import AvailabilitySettings from './AvailabilitySettings';
import MyBlogs from './MyBlogs';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab') || 'overview';
    const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'availability' | 'blogs'>(tabFromUrl as 'overview' | 'appointments' | 'availability' | 'blogs' || 'overview');

    useEffect(() => {
        const tab = searchParams.get('tab') || 'overview';
        if (tab === 'overview' || tab === 'appointments' || tab === 'availability' || tab === 'blogs') {
            setActiveTab(tab);
        } else {
            // Invalid tab, redirect to overview
            navigate('/dashboard?tab=overview', { replace: true });
        }
    }, [searchParams, navigate]);

    const handleTabChange = (tab: 'overview' | 'appointments' | 'availability' | 'blogs') => {
        setActiveTab(tab);
        navigate(`/dashboard?tab=${tab}`, { replace: true });
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-gray-100">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold font-bangla text-gray-800 dark:text-white">Doctor Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage your appointments and patients</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/write-blog')}
                            className="px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined">edit</span>
                            Write Blog
                        </button>
                    <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => handleTabChange('overview')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => handleTabChange('appointments')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'appointments' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            Appointments
                        </button>
                        <button
                            onClick={() => handleTabChange('availability')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'availability' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            Availability
                        </button>
                        <button
                            onClick={() => handleTabChange('blogs')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'blogs' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            My Blogs
                        </button>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="min-h-[500px]">
                    {activeTab === 'overview' && <Overview setActiveTab={(tab) => handleTabChange(tab as 'overview' | 'appointments' | 'availability' | 'blogs')} />}
                    {activeTab === 'appointments' && <AppointmentList />}
                    {activeTab === 'availability' && <AvailabilitySettings />}
                    {activeTab === 'blogs' && <MyBlogs />}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DoctorDashboard;
