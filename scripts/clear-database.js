const mongoose = require('mongoose');
const User = require('../models/User');
const Message = require('../models/Message');
const Meeting = require('../models/Meeting');
const Notification = require('../models/Notification');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mentormentee', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB database');
  
  try {
    // Clear all collections
    await User.deleteMany({});
    console.log('Deleted all users');
    
    await Message.deleteMany({});
    console.log('Deleted all messages');
    
    await Meeting.deleteMany({});
    console.log('Deleted all meetings');
    
    await Notification.deleteMany({});
    console.log('Deleted all notifications');
    
    console.log('\nDatabase cleared successfully!');
    console.log('All users, messages, meetings, and notifications have been removed.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
});
