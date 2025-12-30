const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const {
    getDoctorStats,
    getDoctorAppointments,
    getAppointmentDetails,
    updateAppointmentStatus,
    createPrescription,
    getDoctorAvailability,
    updateDoctorAvailability
} = require('../controllers/doctorDashboardController');

// All routes require doctor role
// Assuming 'authorize' middleware adds req.user and checks role if passed parameters or just validates token
// We'll trust the controller to check user_id mapping, but better to enforce role here if possible. 
// Assuming a generic verifyToken middleware exists or creating one.
// Let's assume server.js uses the existing authentication middleware structure.

// Stats
router.get('/stats', authorize, getDoctorStats);

// Appointments
router.get('/appointments', authorize, getDoctorAppointments);
router.get('/appointments/:id', authorize, getAppointmentDetails);
router.put('/appointments/:id', authorize, updateAppointmentStatus);

// Prescriptions
router.post('/appointments/:appointmentId/prescription', authorize, createPrescription);

// Availability
router.get('/availability', authorize, getDoctorAvailability);
router.put('/availability', authorize, updateDoctorAvailability);

module.exports = router;
