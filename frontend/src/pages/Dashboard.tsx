import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PatientDashboard from './patient/PatientDashboard';
import DoctorDashboard from './doctor/DoctorDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }
        const userData = JSON.parse(userStr);
        setUser(userData);
        
        // Set default tab if none specified
        if (!searchParams.get('tab')) {
            if (userData?.role === 'doctor') {
                navigate('/dashboard?tab=overview', { replace: true });
            } else {
                navigate('/dashboard?tab=home', { replace: true });
            }
        }
        
        setLoading(false);
    }, [navigate, searchParams]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (user?.role === 'doctor') {
        return <DoctorDashboard />;
    }

    if (user?.role === 'admin') {
        return <AdminDashboard />;
    }

    // Default to patient dashboard
    return <PatientDashboard />;
};

export default Dashboard;
