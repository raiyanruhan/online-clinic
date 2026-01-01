const router = require('express').Router();
const { register, login, refreshToken } = require('../controllers/authController');
const { initiateGoogleAuth, handleGoogleCallback } = require('../controllers/googleAuthController');
const authorize = require('../middleware/authorize');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', authorize, refreshToken); // Protected route - requires valid token

// Google OAuth routes
router.get('/google', initiateGoogleAuth);
router.get('/google/callback', handleGoogleCallback);

module.exports = router;
