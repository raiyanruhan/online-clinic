import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Home from './Home';
import MyAppointments from './MyAppointments';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab') || 'home';
    const [activeTab, setActiveTab] = useState<'home' | 'appointments'>(tabFromUrl as 'home' | 'appointments' || 'home');

    useEffect(() => {
        const tab = searchParams.get('tab') || 'home';
        if (tab === 'home' || tab === 'appointments') {
            setActiveTab(tab);
        } else {
            // Invalid tab, redirect to home
            navigate('/dashboard?tab=home', { replace: true });
        }
    }, [searchParams, navigate]);

    const handleTabChange = (tab: 'home' | 'appointments') => {
        setActiveTab(tab);
        navigate(`/dashboard?tab=${tab}`, { replace: true });
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-text-main dark:text-gray-100">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-bangla text-gray-800 dark:text-white mb-2">আপনার ড্যাশবোর্ড</h1>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">আপনার স্বাস্থ্য সেবা ম্যানেজ করুন</p>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700 w-full sm:w-auto overflow-x-auto">
                        <button
                            onClick={() => handleTabChange('home')}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'home' ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            হোম
                        </button>
                        <button
                            onClick={() => handleTabChange('appointments')}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'appointments' ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            অ্যাপয়েন্টমেন্ট
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[500px]">
                    {activeTab === 'home' && <Home setActiveTab={(tab) => handleTabChange(tab as 'home' | 'appointments')} />}
                    {activeTab === 'appointments' && <MyAppointments />}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PatientDashboard;
