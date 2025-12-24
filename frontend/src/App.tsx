import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import DoctorDetails from './pages/DoctorDetails';
import BookAppointment from './pages/BookAppointment';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Prescription from './pages/Prescription';

import Doctors from './pages/Doctors';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import PageTransition from './components/PageTransition';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/doctors" element={<PageTransition><Doctors /></PageTransition>} />
        <Route path="/doctor-details" element={<PageTransition><DoctorDetails /></PageTransition>} />
        <Route path="/appointment" element={<PageTransition><BookAppointment /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><PatientDashboard /></PageTransition>} />
        <Route path="/doctor-dashboard" element={<PageTransition><DoctorDashboard /></PageTransition>} />
        <Route path="/prescription" element={<PageTransition><Prescription /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
