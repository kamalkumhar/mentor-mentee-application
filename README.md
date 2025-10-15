# Mentor-Mentee Platform

## Overview
The Mentor-Mentee Platform is a modern web application designed to facilitate connections between mentors (teachers) and mentees (students), enabling structured guidance through real-time communication, scheduling, and progress tracking.

## Features
- User Authentication (Student and Mentor roles)
- Real-time Messaging with Socket.IO
- Meeting Scheduling and Management
- Progress Tracking with CGPA monitoring
- Database Viewer (Mentor-only access)
- Responsive UI with Modern CSS and Animations

## New Features Added
- Enhanced Student Registration with Year and CGPA tracking
- Student Dashboard showing personalized name and average CGPA
- Improved data model to store student academic information
- Role-based access control for all features

## Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.IO
- **Frontend**: HTML5, CSS3, Vanilla JavaScript

## Setup Instructions
1. Clone the repository
2. Install dependencies: `npm install`
3. Make sure MongoDB is running on your system
4. Start the server: `npm start`
5. Access the application at http://localhost:3000

## Available Scripts
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run populate-db` - Populate the database with sample data
- `npm run both` - Run both backend and frontend servers (if configured)

## Access Points
- **Home Page**: http://localhost:3000/
- **Student Registration**: http://localhost:3000/student/register.html
- **Mentor Registration**: http://localhost:3000/mentor/register.html
- **Student Login**: http://localhost:3000/student/login.html
- **Mentor Login**: http://localhost:3000/mentor/login.html

### Student Dashboard
- **Dashboard**: http://localhost:3000/student/dashboard.html
- **Chat**: http://localhost:3000/student/chat.html
- **Meetings**: http://localhost:3000/student/meetings.html
- **Notifications**: http://localhost:3000/student/notifications.html
- **Profile**: http://localhost:3000/student/profile.html

### Mentor Dashboard
- **Dashboard**: http://localhost:3000/mentor/dashboard.html
- **Chat**: http://localhost:3000/mentor/chat.html
- **Meetings**: http://localhost:3000/mentor/meetings.html
- **Notifications**: http://localhost:3000/mentor/notifications.html
- **Profile**: http://localhost:3000/mentor/profile.html
- **Mentees**: http://localhost:3000/mentor/mentees.html

### Admin/Mentor Only
- **Database Viewer**: http://localhost:3000/database-viewer.html (Accessible only by mentors)

## Security
The database viewer is now protected and can only be accessed by:
- Authenticated users
- Users with the role of 'mentor' (teachers)

Students will be denied access to the database viewer.

## Database Population

To populate the database with sample data for testing:

```bash
npm run populate-db
```

This will create:
- 4 sample users (1 mentor, 3 students)
- 5 sample messages between users
- 2 sample meetings
- 3 sample notifications

## Database Viewer

Access the database viewer at: http://localhost:3000/database-viewer.html

The viewer allows authorized users (mentors only) to:
- See statistics overview of all data
- View users, messages, meetings, and notifications in tabular format
- Navigate through paginated data
- Switch between different data types using tabs

Unauthorized users will be:
- Redirected to the login page if not authenticated
- Shown an access denied message if they don't have the proper role

## Recent Improvements
1. Enhanced Student Registration:
   - Added "Current Year" selection (1st to 4th year)
   - Added CGPA fields for each semester based on the student's current year
   - Students must enter CGPA for completed semesters
   - Validation ensures proper CGPA values (0-10)

2. Updated Student Dashboard:
   - Personalized welcome message with student's name
   - Average CGPA calculation and display
   - Removed recent activities section as requested

3. Data Model Updates:
   - Extended User model to include student-specific fields
   - Added currentYear and cgpa fields for students
   - Implemented getAverageCGPA method for CGPA calculations
