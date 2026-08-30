const express = require('express');
const router = express.Router();
const { signup, login, refreshTokenHandler, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshTokenHandler);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
