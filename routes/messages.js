const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { createBroadcastNotification, createMessageNotification } = require('../utils/notificationHelper');

const router = express.Router();

// @route   POST /api/messages/broadcast
// @desc    Send a broadcast message to all users
// @access  Private
router.post('/broadcast', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;

    // Get all users except current user
    const allUsers = await User.find({ _id: { $ne: req.userId } }).select('_id');
    
    // Create messages for all users
    const messages = allUsers.map(user => ({
      sender: req.userId,
      receiver: user._id,
      content,
      isBroadcast: true
    }));

    // Insert all messages
    const savedMessages = await Message.insertMany(messages);

    // Get current user details
    const currentUser = await User.findById(req.userId).select('name username role');

    // Create notifications for all recipients
    const messagePreview = content.length > 50 ? content.substring(0, 50) + '...' : content;
    for (const user of allUsers) {
      await createBroadcastNotification(user._id, currentUser.name, messagePreview);
    }

    res.status(201).json({
      message: 'Broadcast sent successfully',
      count: savedMessages.length,
      sender: currentUser
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages/all
// @desc    Get all broadcast messages (group chat)
// @access  Private
router.get('/all', authMiddleware, async (req, res) => {
  try {
    // Get all messages where receiver is current user OR sender is current user
    // This creates a group chat effect
    const messages = await Message.find({
      $or: [
        { receiver: req.userId },
        { sender: req.userId }
      ]
    })
      .populate('sender', 'name username role')
      .populate('receiver', 'name username role')
      .sort({ createdAt: 1 })
      .limit(100); // Limit to last 100 messages

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/messages
// @desc    Send a new message
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Create new message
    const message = new Message({
      sender: req.userId,
      receiver: receiverId,
      content
    });

    await message.save();

    // Populate sender and receiver details
    await message.populate('sender', 'name username');
    await message.populate('receiver', 'name username');

    // Create notification for receiver
    const sender = await User.findById(req.userId).select('name');
    const messagePreview = content.length > 50 ? content.substring(0, 50) + '...' : content;
    await createMessageNotification(receiverId, sender.name, messagePreview);

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages/unread-count
// @desc    Get count of unread messages for current user
// @access  Private
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiver: req.userId,
      read: false
    });

    res.json({ count: unreadCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages
// @desc    Get all messages for current user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.userId }, { receiver: req.userId }]
    })
      .populate('sender', 'name username')
      .populate('receiver', 'name username')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages/conversation/:userId
// @desc    Get conversation between current user and another user
// @access  Private
router.get('/conversation/:userId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.userId }
      ]
    })
      .populate('sender', 'name username')
      .populate('receiver', 'name username')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { receiver: req.userId, sender: req.params.userId, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, receiver: req.userId },
      { $set: { read: true } },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;