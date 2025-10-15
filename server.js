const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB connection with proper SSL configuration
const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mentormentee', mongoOptions)
  .then(() => {
    console.log('Connected to MongoDB database');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // Don't exit process, let Render retry
  });

const db = mongoose.connection;
db.on('error', (err) => {
  console.error('MongoDB runtime error:', err);
});
db.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});
db.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Set Socket.io instance for notifications
const notificationHelper = require('./utils/notificationHelper');
notificationHelper.setIO(io);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Mentor-Mentee Platform API' });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/database', require('./routes/database'));
app.use('/api/resources', require('./routes/resources'));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join a room based on user ID
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their personal room`);
  });
  
  // Join a room
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });
  
  // Handle sending messages
  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    // Broadcast message to the room
    socket.to(data.room).emit('receive_message', data);
  });
  
  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.to(data.room).emit('user_typing', data);
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;