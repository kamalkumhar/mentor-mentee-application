const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resource = require('../models/Resource');
const authMiddleware = require('../middleware/auth');
const { createNotification } = require('../utils/notificationHelper');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow common file types
    const allowedTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt|zip|rar|jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, PPT, XLS, TXT, ZIP, and image files are allowed!'));
    }
  }
});

// @route   POST /api/resources/upload
// @desc    Upload a new resource file (mentor only)
// @access  Private
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    // Check if user is a mentor
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (user.role !== 'mentor') {
      // Delete uploaded file if user is not a mentor
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({ message: 'Only mentors can upload resources' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description } = req.body;

    // Create new resource
    const resource = new Resource({
      title: title || req.file.originalname,
      description: description || '',
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      uploadedBy: req.userId
    });

    await resource.save();

    // Populate mentor details
    await resource.populate('uploadedBy', 'name username');

    // Create notifications for all students assigned to this mentor
    const students = await User.find({ role: 'student', mentor: req.userId });
    for (const student of students) {
      await createNotification(
        student._id,
        'New Resource Available',
        `Your mentor ${user.name} has uploaded a new resource: ${resource.title}`
      );
    }

    res.status(201).json({
      message: 'Resource uploaded successfully',
      resource
    });
  } catch (error) {
    console.error(error);
    // Delete file if database save failed
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   GET /api/resources
// @desc    Get all resources
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);

    let resources;
    
    if (user.role === 'mentor') {
      // Mentor sees only their uploaded resources
      resources = await Resource.find({ uploadedBy: req.userId })
        .populate('uploadedBy', 'name username')
        .sort({ uploadedAt: -1 });
    } else {
      // Student sees resources uploaded by their mentor
      if (!user.mentor) {
        return res.json([]);
      }
      resources = await Resource.find({ uploadedBy: user.mentor })
        .populate('uploadedBy', 'name username')
        .sort({ uploadedAt: -1 });
    }

    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/resources/download/:id
// @desc    Download a resource file
// @access  Private
router.get('/download/:id', authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if file exists
    if (!fs.existsSync(resource.filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Send file
    res.download(resource.filePath, resource.originalName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/resources/:id
// @desc    Delete a resource (mentor only)
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can delete resources' });
    }

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if the mentor owns this resource
    if (resource.uploadedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    // Delete file from filesystem
    if (fs.existsSync(resource.filePath)) {
      fs.unlinkSync(resource.filePath);
    }

    // Delete from database
    await Resource.findByIdAndDelete(req.params.id);

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
