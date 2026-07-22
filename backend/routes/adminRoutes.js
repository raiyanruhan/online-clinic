const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const {
    verifyAdmin,
    getAdminStats,
    getAllAppointments,
    getAppointmentDetails,
    updateAppointment,
    getMonthlyReport,
    getDoctorWorkload
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(authorize);
router.use(verifyAdmin);

// Dashboard stats
router.get('/stats', getAdminStats);

// Appointments
router.get('/appointments', getAllAppointments);
router.get('/appointments/:id', getAppointmentDetails);
router.put('/appointments/:id', updateAppointment);

// Reports
router.get('/reports/monthly', getMonthlyReport);

// Doctor workload
router.get('/doctors/workload', getDoctorWorkload);

module.exports = router;
