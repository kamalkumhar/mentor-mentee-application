# Mentor-Mentee Platform

## Overview
A modern web application designed to facilitate connections between mentors (teachers) and mentees (students), enabling structured guidance through real-time communication, scheduling, and progress tracking.

## Features
- User Authentication (Student and Mentor roles)
- Real-time Messaging with Socket.IO
- Meeting Scheduling and Management
- Progress Tracking with CGPA monitoring
- Database Viewer (Mentor-only access)
- Responsive UI with Modern CSS
- Mobile-optimized interface
- File upload for resources
- Notification system

## Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.IO
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **File Upload**: Multer
- **Security**: bcryptjs for password hashing

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- Git

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/kamalkumhar/mentor-mentee-application.git
cd mentor-mentee-application
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/mentormentee
JWT_SECRET=your_random_secret_key
PORT=3000
NODE_ENV=development
```

### 4. Start MongoDB
```bash
# Windows
net start MongoDB

# Mac/Linux
mongod
```

### 5. Run the Application
```bash
npm start
```

### 6. Access the Application
Open your browser: **http://localhost:3000**

## Available Scripts
- `npm start` - Start the server
- `npm run dev` - Start with nodemon (auto-reload)
- `npm run populate-db` - Populate database with test data

## Project Structure
```
mentor-mentee-platform/
├── middleware/          # Authentication & authorization
├── models/             # MongoDB schemas
├── public/             # Frontend files
│   ├── css/           # Stylesheets
│   ├── js/            # Client-side JavaScript
│   ├── mentor/        # Mentor pages
│   └── student/       # Student pages
├── routes/            # API routes
├── scripts/           # Utility scripts
├── utils/             # Helper functions
└── server.js          # Main server file
```

## Key Features

### For Students
- Register and create profile with CGPA tracking
- Connect with mentors
- Real-time chat messaging
- Schedule and manage meetings
- Access shared resources
- View notifications
- Track academic progress

### For Mentors
- Register and create mentor profile
- View and manage mentees
- Real-time chat with students
- Schedule meetings
- Upload and share resources
- Send notifications
- View student progress reports

## License
MIT

## Author
Kamal Kumhar
