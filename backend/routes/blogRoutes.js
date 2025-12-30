const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const {
    getBlogs,
    getBlog,
    getMyBlogs,
    createBlog,
    updateBlog,
    deleteBlog
} = require('../controllers/blogController');

// Public routes
router.get('/', getBlogs);
// Get single blog - can be accessed without auth, but auth allows viewing own drafts
// We need to handle this before the /doctor/my-blogs route to avoid route conflicts
router.get('/doctor/my-blogs', authorize, getMyBlogs);
// Get single blog (with optional auth for viewing own drafts)
router.get('/:id', (req, res, next) => {
    // Try to get user from token, but don't require it
    const token = req.header('x-auth-token');
    if (token) {
        const jwt = require('jsonwebtoken');
        require('dotenv').config();
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            // Token invalid, continue without user
            console.log('Token verification failed:', err.message);
        }
    }
    next();
}, getBlog);

// Protected routes (doctor only)
router.post('/', authorize, createBlog);
router.put('/:id', authorize, updateBlog);
router.delete('/:id', authorize, deleteBlog);

module.exports = router;


