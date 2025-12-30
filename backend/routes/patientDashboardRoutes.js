const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const {
    getPatientStats,
    getMyAppointments,
    getAppointmentDetails,
    bookAppointment,
    cancelAppointment
} = require('../controllers/patientDashboardController');

// All routes require login
router.get('/stats', authorize, getPatientStats);
router.get('/appointments', authorize, getMyAppointments);
// More specific routes must come before generic routes
router.put('/appointments/:id/cancel', authorize, cancelAppointment);
router.get('/appointments/:id', authorize, getAppointmentDetails);
router.post('/book', authorize, bookAppointment);

module.exports = router;
