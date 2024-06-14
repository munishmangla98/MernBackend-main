const express = require('express');
const { getUserProfile, updateUserProfile, getUserBlogs } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get user profile
router.get('/:id', getUserProfile);

// Update user profile
router.put('/', auth, updateUserProfile);

// Get blogs by user
router.get('/:id/blogs', getUserBlogs);

module.exports = router;