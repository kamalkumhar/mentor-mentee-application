const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { generateToken } = require('../utils/jwt');
const { assignStudentToTeacher } = require('../utils/assignment');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password, role, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      username,
      password,
      role: role || 'student',
      profile: profile || {},
      // Set mentor field for students
      ...(role === 'student' && { mentor: null }),
      // Set students array for mentors
      ...(role === 'mentor' && { students: [] })
    });

    await user.save();

    // If this is a student, assign them to a teacher
    if (user.role === 'student') {
      await assignStudentToTeacher(user._id);
      
      // Re-fetch user with populated mentor
      await user.populate('mentor', 'name');
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        profile: user.profile,
        mentor: user.mentor
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Populate mentor for students
    if (user.role === 'student') {
      await user.populate('mentor', 'name');
    }

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        profile: user.profile,
        mentor: user.mentor
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    // Populate mentor for students
    if (user.role === 'student') {
      await user.populate('mentor', 'name');
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify if email exists for password reset
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { email, role } = req.body;

    // Find user by email and role
    const user = await User.findOne({ email, role });
    
    if (user) {
      res.json({ 
        exists: true,
        message: 'Email verified successfully'
      });
    } else {
      res.json({ 
        exists: false,
        message: 'No account found with this email and role. Please check your details or register.'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      exists: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset user password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, role, newPassword } = req.body;

    // Validate input
    if (!email || !role || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Email, role, and new password are required'
      });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find user by email and role
    const user = await User.findOne({ email, role });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found'
      });
    }

    // Update password (will be hashed by the pre-save middleware)
    user.password = newPassword;
    await user.save();

    res.json({ 
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

module.exports = router;