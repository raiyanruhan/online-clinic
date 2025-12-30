const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const { initiateGoogleAuth, handleGoogleCallback } = require('../controllers/googleAuthController');

router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/google', initiateGoogleAuth);
router.get('/google/callback', handleGoogleCallback);

module.exports = router;
