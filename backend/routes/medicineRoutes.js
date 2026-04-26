const express = require('express');
const router = express.Router();
const { searchMedicines } = require('../controllers/medicineController');

// Public route - no authentication needed for medicine search
router.get('/search', searchMedicines);

module.exports = router;




