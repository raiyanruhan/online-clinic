import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import DoctorDetails from './pages/DoctorDetails';
import BookAppointment from './pages/BookAppointment';
import PatientDashboard from './pages/PatientDashboard';
import Dashboard from './pages/Dashboard';
import Prescription from './pages/Prescription';

import Doctors from './pages/Doctors';
import Services from './pages/Services';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import PageTransition from './components/PageTransition';
import Login from './pages/Login';

import Register from './pages/Register';

import AdminDashboard from './pages/AdminDashboard';
import WriteBlog from './pages/doctor/WriteBlog';
import PrescriptionEditor from './pages/doctor/PrescriptionEditor';
import AppointmentView from './pages/patient/AppointmentView';
import BottomNavigation from './components/BottomNavigation';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import MedicalDisclaimer from './pages/MedicalDisclaimer';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
                <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
                <Route path="/blog/:id" element={<PageTransition><BlogDetail /></PageTransition>} />
                <Route path="/write-blog" element={<PageTransition><WriteBlog /></PageTransition>} />
                <Route path="/write-blog/:id" element={<PageTransition><WriteBlog /></PageTransition>} />
                <Route path="/doctor/prescription/:appointmentId" element={<PageTransition><PrescriptionEditor /></PageTransition>} />
                <Route path="/patient/appointment/:appointmentId" element={<PageTransition><AppointmentView /></PageTransition>} />
                <Route path="/doctors" element={<PageTransition><Doctors /></PageTransition>} />
                <Route path="/doctors/:id" element={<PageTransition><DoctorDetails /></PageTransition>} />
                <Route path="/appointment/:doctorId" element={<PageTransition><BookAppointment /></PageTransition>} />
                <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
                <Route path="/prescription" element={<PageTransition><Prescription /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
                <Route path="/terms-of-service" element={<PageTransition><TermsOfService /></PageTransition>} />
                <Route path="/medical-disclaimer" element={<PageTransition><MedicalDisclaimer /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    return (
        <Router>
            <AnimatedRoutes />
            {/* Global Bottom Navigation - Mobile Only */}
            <BottomNavigation />
        </Router>
    );
}

export default App;
