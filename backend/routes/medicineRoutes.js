<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const { searchMedicines } = require('../controllers/medicineController');

// Public route - no authentication needed for medicine search
router.get('/search', searchMedicines);

module.exports = router;



=======
const express = require('express');
const router = express.Router();
const { searchMedicines } = require('../controllers/medicineController');

// Public route - no authentication needed for medicine search
router.get('/search', searchMedicines);

module.exports = router;




>>>>>>> 58b88cb347b3e55f9f6f8b45a0c9b6aa286b1e2e
