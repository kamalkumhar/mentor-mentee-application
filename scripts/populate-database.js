const mongoose = require('mongoose');
const User = require('../models/User');
const Message = require('../models/Message');
const Meeting = require('../models/Meeting');
const Notification = require('../models/Notification');
const { assignStudentsToTeachers } = require('../utils/assignment');

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
    // Clear existing data
    await User.deleteMany({});
    await Message.deleteMany({});
    await Meeting.deleteMany({});
    await Notification.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create sample users
    const users = [
      {
        name: 'Dr. Sarah Williams',
        email: 'sarah.williams@university.edu',
        username: 'sarah_williams',
        password: 'password123',
        role: 'mentor',
        profile: {
          bio: 'Experienced computer science professor with 15 years of teaching and mentoring experience.',
          skills: ['JavaScript', 'Python', 'Machine Learning', 'React', 'Node.js'],
          education: [{
            institution: 'MIT',
            degree: 'PhD in Computer Science',
            year: '2010'
          }],
          branch: 'Computer'
        },
        students: []
      },
      {
        name: 'Dr. Michael Chen',
        email: 'michael.chen@university.edu',
        username: 'michael_chen',
        password: 'password123',
        role: 'mentor',
        profile: {
          bio: 'Data science expert with focus on machine learning applications.',
          skills: ['Python', 'R', 'Machine Learning', 'TensorFlow'],
          education: [{
            institution: 'Stanford University',
            degree: 'PhD in Data Science',
            year: '2012'
          }],
          branch: 'Data Science'
        },
        students: []
      },
      {
        name: 'Alex Johnson',
        email: 'alex.johnson@student.edu',
        username: 'alex_johnson',
        password: 'password123',
        role: 'student',
        profile: {
          bio: 'Passionate computer science student focusing on web development and AI.',
          skills: ['JavaScript', 'Python', 'React', 'MongoDB'],
          education: [{
            institution: 'University of Technology',
            degree: 'BSc Computer Science',
            year: '2023'
          }],
          branch: 'Computer',
          division: 'A',
          currentYear: 3,
          cgpa: new Map([
            ['year1', { sem1: 3.5, sem2: 3.7 }],
            ['year2', { sem1: 3.8, sem2: 3.9 }],
            ['year3', { sem1: 3.7, sem2: null }]
          ])
        }
      },
      {
        name: 'Maria Rodriguez',
        email: 'maria.rodriguez@student.edu',
        username: 'maria_rodriguez',
        password: 'password123',
        role: 'student',
        profile: {
          bio: 'Data science student with a focus on machine learning and analytics.',
          skills: ['Python', 'R', 'SQL', 'Tableau'],
          education: [{
            institution: 'State University',
            degree: 'MSc Data Science',
            year: '2024'
          }],
          branch: 'Data Science',
          division: 'B',
          currentYear: 2,
          cgpa: new Map([
            ['year1', { sem1: 3.9, sem2: 4.0 }],
            ['year2', { sem1: 3.8, sem2: null }]
          ])
        }
      },
      {
        name: 'Thomas Peterson',
        email: 'thomas.peterson@student.edu',
        username: 'thomas_peterson',
        password: 'password123',
        role: 'student',
        profile: {
          bio: 'Engineering student interested in software development.',
          skills: ['Java', 'C++', 'Python', 'SQL'],
          education: [{
            institution: 'Engineering Institute',
            degree: 'BEng Software Engineering',
            year: '2022'
          }],
          branch: 'Computer',
          division: 'A',
          currentYear: 4,
          cgpa: new Map([
            ['year1', { sem1: 3.2, sem2: 3.4 }],
            ['year2', { sem1: 3.5, sem2: 3.6 }],
            ['year3', { sem1: 3.7, sem2: 3.8 }],
            ['year4', { sem1: 3.9, sem2: null }]
          ])
        }
      },
      {
        name: 'Emily Wilson',
        email: 'emily.wilson@student.edu',
        username: 'emily_wilson',
        password: 'password123',
        role: 'student',
        profile: {
          bio: 'Computer science student with interest in cybersecurity.',
          skills: ['Python', 'Network Security', 'Ethical Hacking'],
          education: [{
            institution: 'Tech University',
            degree: 'BSc Computer Science',
            year: '2023'
          }],
          branch: 'Computer',
          division: 'B',
          currentYear: 2,
          cgpa: new Map([
            ['year1', { sem1: 2.8, sem2: 3.0 }],
            ['year2', { sem1: 2.9, sem2: null }]
          ])
        }
      },
      {
        name: 'David Kim',
        email: 'david.kim@student.edu',
        username: 'david_kim',
        password: 'password123',
        role: 'student',
        profile: {
          bio: 'Data science student focusing on big data analytics.',
          skills: ['Python', 'Hadoop', 'Spark', 'SQL'],
          education: [{
            institution: 'Data Science Academy',
            degree: 'MSc Data Science',
            year: '2024'
          }],
          branch: 'Data Science',
          division: 'A',
          currentYear: 1,
          cgpa: new Map([
            ['year1', { sem1: 3.6, sem2: null }]
          ])
        }
      }
    ];
    
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);
    
    // Assign students to teachers
    await assignStudentsToTeachers();
    
    // Re-fetch users to get updated assignments
    const updatedUsers = await User.find({});
    const updatedMentors = updatedUsers.filter(user => user.role === 'mentor');
    const updatedStudents = updatedUsers.filter(user => user.role === 'student');
    
    // Find specific students and their mentors for messages
    const alex = updatedStudents.find(s => s.email === 'alex.johnson@student.edu');
    const maria = updatedStudents.find(s => s.email === 'maria.rodriguez@student.edu');
    const thomas = updatedStudents.find(s => s.email === 'thomas.peterson@student.edu');
    const emily = updatedStudents.find(s => s.email === 'emily.wilson@student.edu');
    const david = updatedStudents.find(s => s.email === 'david.kim@student.edu');
    
    const sarah = updatedMentors.find(m => m.email === 'sarah.williams@university.edu');
    const michael = updatedMentors.find(m => m.email === 'michael.chen@university.edu');
    
    // Create sample messages
    const messages = [
      {
        sender: alex._id,
        receiver: alex.mentor,
        content: 'Hi Dr. Williams! How are you doing today?'
      },
      {
        sender: alex.mentor,
        receiver: alex._id,
        content: 'Hello Alex! I\'m doing well, thanks for asking. How is your project coming along?'
      },
      {
        sender: alex._id,
        receiver: alex.mentor,
        content: 'It\'s going great! I\'ve completed the research phase and started on the implementation.'
      },
      {
        sender: maria._id,
        receiver: maria.mentor,
        content: 'Dr. Chen, could we schedule a meeting to discuss my thesis proposal?'
      },
      {
        sender: maria.mentor,
        receiver: maria._id,
        content: 'Of course, Maria! How about tomorrow at 2:00 PM?'
      }
    ];
    
    const createdMessages = await Message.insertMany(messages);
    console.log(`Created ${createdMessages.length} messages`);
    
    // Create sample meetings
    const meetings = [
      {
        mentor: alex.mentor,
        student: alex._id,
        title: 'Project Review',
        description: 'Review progress on the web development project',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        duration: 60,
        status: 'scheduled',
        meetingLink: 'https://meet.google.com/abc-defg-hij'
      },
      {
        mentor: maria.mentor,
        student: maria._id,
        title: 'Thesis Discussion',
        description: 'Discuss thesis proposal and research methodology',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 90,
        status: 'scheduled',
        meetingLink: 'https://meet.google.com/klm-nopq-rst'
      }
    ];
    
    const createdMeetings = await Meeting.insertMany(meetings);
    console.log(`Created ${createdMeetings.length} meetings`);
    
    // Create sample notifications
    const notifications = [
      {
        user: alex._id,
        title: 'New Message',
        message: 'You have a new message from Dr. Sarah Williams',
        type: 'info',
        relatedId: createdMessages[1]._id,
        relatedType: 'message'
      },
      {
        user: maria._id,
        title: 'Meeting Scheduled',
        message: 'Your meeting with Dr. Michael Chen has been scheduled',
        type: 'success',
        relatedId: createdMeetings[1]._id,
        relatedType: 'meeting'
      },
      {
        user: alex.mentor,
        title: 'New Message',
        message: 'You have a new message from Alex Johnson',
        type: 'info',
        relatedId: createdMessages[0]._id,
        relatedType: 'message'
      }
    ];
    
    const createdNotifications = await Notification.insertMany(notifications);
    console.log(`Created ${createdNotifications.length} notifications`);
    
    console.log('Database populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
});