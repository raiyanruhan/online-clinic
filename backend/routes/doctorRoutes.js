const router = require('express').Router();
const { addDoctor, getDoctors, getDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { getAvailableSlots, getAvailableDates } = require('../controllers/doctorDashboardController');

router.post('/', addDoctor);
router.get('/', getDoctors);

// Public endpoints to get available slots/dates for booking (must be before /:id route)
// These routes must come before the generic /:id route to avoid route conflicts
router.get('/:doctorId/available-dates', getAvailableDates);
router.get('/:doctorId/available-slots', getAvailableSlots);

// Generic doctor routes (must come after specific routes)
router.get('/:id', getDoctor);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);

module.exports = router;
