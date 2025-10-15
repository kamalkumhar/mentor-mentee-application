const Notification = require('../models/Notification');

// Socket.io instance will be set from server
let io = null;

function setIO(ioInstance) {
  io = ioInstance;
}

/**
 * Create a notification for a user
 * @param {ObjectId} userId - User to send notification to
 * @param {String} title - Notification title
 * @param {String} message - Notification message
 * @param {String} type - Notification type (info, warning, success, error)
 * @param {ObjectId} relatedId - Related document ID (optional)
 * @param {String} relatedType - Related document type (optional)
 */
async function createNotification(userId, title, message, type = 'info', relatedId = null, relatedType = null) {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      relatedId,
      relatedType
    });

    await notification.save();
    
    // Emit real-time notification via Socket.io
    if (io) {
      io.to(`user_${userId}`).emit('new_notification', notification);
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Create notification for new message
 */
async function createMessageNotification(receiverId, senderName, messagePreview) {
  return await createNotification(
    receiverId,
    `💬 New message from ${senderName}`,
    messagePreview,
    'info',
    null,
    'message'
  );
}

/**
 * Create notification for broadcast message
 */
async function createBroadcastNotification(receiverId, senderName, messagePreview) {
  return await createNotification(
    receiverId,
    `📢 Broadcast message from ${senderName}`,
    messagePreview,
    'info',
    null,
    'message'
  );
}

/**
 * Create notification for meeting scheduled
 */
async function createMeetingNotification(userId, meetingTitle, meetingTime) {
  return await createNotification(
    userId,
    `📅 Meeting scheduled: ${meetingTitle}`,
    `Scheduled for ${new Date(meetingTime).toLocaleString()}`,
    'success',
    null,
    'meeting'
  );
}

/**
 * Create notification for assignment uploaded
 */
async function createAssignmentNotification(mentorId, studentName, assignmentTitle) {
  return await createNotification(
    mentorId,
    `📚 Assignment submitted by ${studentName}`,
    assignmentTitle,
    'warning',
    null,
    'system'
  );
}

/**
 * Create notification for mentee request
 */
async function createMenteeRequestNotification(mentorId, studentName) {
  return await createNotification(
    mentorId,
    `👤 New mentee request`,
    `${studentName} has requested to be your mentee`,
    'info',
    null,
    'system'
  );
}

/**
 * Create notification for profile update
 */
async function createProfileUpdateNotification(userId, updateType) {
  return await createNotification(
    userId,
    `✏️ Profile updated`,
    `Your ${updateType} has been updated successfully`,
    'success',
    null,
    'system'
  );
}

/**
 * Create notification for CGPA improvement
 */
async function createCGPANotification(mentorId, studentName, newCGPA) {
  return await createNotification(
    mentorId,
    `📊 Progress update`,
    `${studentName}'s CGPA has improved to ${newCGPA}`,
    'success',
    null,
    'system'
  );
}

module.exports = {
  setIO,
  createNotification,
  createMessageNotification,
  createBroadcastNotification,
  createMeetingNotification,
  createAssignmentNotification,
  createMenteeRequestNotification,
  createProfileUpdateNotification,
  createCGPANotification
};
