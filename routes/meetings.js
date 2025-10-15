const express = require('express');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { createMeetingNotification } = require('../utils/notificationHelper');

const router = express.Router();

// @route   POST /api/meetings
// @desc    Schedule a new meeting
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { mentorId, studentId, title, description, date, duration, meetingLink } = req.body;

    // Validate mentor and student
    const mentor = await User.findById(mentorId);
    const student = await User.findById(studentId);
    
    if (!mentor || !student) {
      return res.status(404).json({ message: 'Mentor or student not found' });
    }

    // Create new meeting
    const meeting = new Meeting({
      mentor: mentorId,
      student: studentId,
      title,
      description,
      date: new Date(date),
      duration,
      meetingLink
    });

    await meeting.save();

    // Populate mentor and student details
    await meeting.populate('mentor', 'name username');
    await meeting.populate('student', 'name username');

    // Create notifications for both mentor and student
    await createMeetingNotification(mentorId, title, date);
    await createMeetingNotification(studentId, title, date);

    res.status(201).json(meeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/meetings
// @desc    Get all meetings for current user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [{ mentor: req.userId }, { student: req.userId }]
    })
      .populate('mentor', 'name username')
      .populate('student', 'name username')
      .sort({ date: 1 });

    res.json(meetings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/meetings/upcoming
// @desc    Get upcoming meetings for current user
// @access  Private
router.get('/upcoming', authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const meetings = await Meeting.find({
      $or: [{ mentor: req.userId }, { student: req.userId }],
      date: { $gte: now },
      status: 'scheduled'
    })
      .populate('mentor', 'name username')
      .populate('student', 'name username')
      .sort({ date: 1 });

    res.json(meetings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/meetings/:id/status
// @desc    Update meeting status
// @access  Private
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    )
      .populate('mentor', 'name username')
      .populate('student', 'name username');

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    res.json(meeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/meetings/progress-report
// @desc    Get progress report for student (completed meetings stats)
// @access  Private
router.get('/progress-report', authMiddleware, async (req, res) => {
  try {
    // Check if viewing another student's progress (for mentors)
    const { studentId } = req.query;
    
    let targetStudentId = req.userId; // Default to current user
    
    // If studentId is provided, verify mentor access
    if (studentId) {
      const currentUser = await User.findById(req.userId);
      
      // Only mentors can view other students' progress
      if (currentUser.role !== 'mentor') {
        return res.status(403).json({ message: 'Only mentors can view student progress' });
      }
      
      targetStudentId = studentId;
    }
    
    // Get all completed meetings for the target student
    const completedMeetings = await Meeting.find({
      student: targetStudentId,
      status: 'completed'
    })
      .populate('mentor', 'name username')
      .sort({ date: -1 });

    // Calculate statistics
    const totalMeetings = completedMeetings.length;
    const totalDuration = completedMeetings.reduce((sum, meeting) => sum + meeting.duration, 0);
    
    // Get meetings by month for trend analysis
    const meetingsByMonth = {};
    const durationByMonth = {};
    
    completedMeetings.forEach(meeting => {
      const monthKey = new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      meetingsByMonth[monthKey] = (meetingsByMonth[monthKey] || 0) + 1;
      durationByMonth[monthKey] = (durationByMonth[monthKey] || 0) + meeting.duration;
    });

    // Get scheduled meetings count
    const scheduledMeetings = await Meeting.countDocuments({
      student: targetStudentId,
      status: 'scheduled',
      date: { $gte: new Date() }
    });

    // Get cancelled meetings count
    const cancelledMeetings = await Meeting.countDocuments({
      student: targetStudentId,
      status: 'cancelled'
    });

    res.json({
      totalCompleted: totalMeetings,
      totalDuration: totalDuration, // in minutes
      totalHours: Math.floor(totalDuration / 60),
      totalMinutes: totalDuration % 60,
      scheduledMeetings,
      cancelledMeetings,
      averageDuration: totalMeetings > 0 ? Math.round(totalDuration / totalMeetings) : 0,
      recentMeetings: completedMeetings.slice(0, 5), // Last 5 completed meetings
      meetingsByMonth,
      durationByMonth
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;