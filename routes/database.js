const express = require('express');
const User = require('../models/User');
const Message = require('../models/Message');
const Meeting = require('../models/Meeting');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');
const adminOrMentorMiddleware = require('../middleware/admin');

const router = express.Router();

// @route   GET /api/database/stats
// @desc    Get database statistics
// @access  Private (Admins and Mentors only)
router.get('/stats', authMiddleware, adminOrMentorMiddleware, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const messageCount = await Message.countDocuments();
    const meetingCount = await Meeting.countDocuments();
    const notificationCount = await Notification.countDocuments();

    res.json({
      users: userCount,
      messages: messageCount,
      meetings: meetingCount,
      notifications: notificationCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/database/users
// @desc    Get all users
// @access  Private (Admins and Mentors only)
router.get('/users', authMiddleware, adminOrMentorMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/database/messages
// @desc    Get all messages
// @access  Private (Admins and Mentors only)
router.get('/messages', authMiddleware, adminOrMentorMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const messages = await Message.find()
      .populate('sender', 'name username')
      .populate('receiver', 'name username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments();

    res.json({
      messages,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/database/meetings
// @desc    Get all meetings
// @access  Private (Admins and Mentors only)
router.get('/meetings', authMiddleware, adminOrMentorMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const meetings = await Meeting.find()
      .populate('mentor', 'name username')
      .populate('student', 'name username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Meeting.countDocuments();

    res.json({
      meetings,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/database/notifications
// @desc    Get all notifications
// @access  Private (Admins and Mentors only)
router.get('/notifications', authMiddleware, adminOrMentorMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find()
      .populate('user', 'name username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments();

    res.json({
      notifications,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;