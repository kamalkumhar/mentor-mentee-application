const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('mentor', 'name username');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, title, bio, avatar, skills, education, experience } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (title) updates['profile.title'] = title;
    if (bio !== undefined) updates['profile.bio'] = bio;
    if (avatar) updates['profile.avatar'] = avatar;
    if (skills) updates['profile.skills'] = skills;
    if (education) {
      // Handle both string and array formats
      if (typeof education === 'string') {
        updates['profile.education'] = [{ institution: education, degree: '', year: '' }];
      } else if (Array.isArray(education)) {
        updates['profile.education'] = education;
      }
    }
    if (experience) updates['profile.experience'] = experience;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/:id/assign-mentor
// @desc    Assign a mentor to a student
// @access  Private (Mentor only)
router.put('/:id/assign-mentor', authMiddleware, async (req, res) => {
  try {
    const { mentorId } = req.body;
    const studentId = req.params.id;

    // Verify the current user is a mentor
    const currentUser = await User.findById(req.userId);
    if (currentUser.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can assign students' });
    }

    // Verify the mentor exists
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Verify the student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Assign the mentor to the student
    student.mentor = mentorId;
    await student.save();

    // Return updated student with populated mentor
    const updatedStudent = await User.findById(studentId)
      .select('-password')
      .populate('mentor', 'name username');

    res.json({
      message: 'Mentor assigned successfully',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Assign mentor error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;