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

## Prerequisites
Before running this project, make sure you have:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## Local Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/kamalkumhar/mentormentee.git
cd mentormentee
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory by copying the example:
```bash
# On Windows (PowerShell)
Copy-Item .env.example .env

# On Mac/Linux
cp .env.example .env
```

Edit the `.env` file and update the values:
```env
MONGODB_URI=mongodb://localhost:27017/mentormentee
JWT_SECRET=your_super_secret_jwt_key_here_change_this
PORT=3000
NODE_ENV=development
```

**Important**: Change `JWT_SECRET` to a random secure string!

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows (if MongoDB is installed as a service)
net start MongoDB

# On Mac/Linux
mongod
```

### 5. Start the Server
```bash
npm start
```

### 6. Access the Application
Open your browser and go to: **http://localhost:3000**

## Important Notes

### No Dummy Data
This application does NOT auto-populate with dummy users. All users must register through the registration forms.

- The database starts empty on first run
- Users must register manually via Student/Mentor registration pages
- The `populate-database.js` script is ONLY for testing purposes and should be run manually if needed
- No automatic dummy data is created when the server starts

### Mobile Optimization
Fully responsive design for mobile devices
- Hamburger menu navigation
- Touch-friendly interface
- Optimized layouts for screens 480px, 768px, and 1024px+

## Deploy to Vercel

### Step 1: Setup MongoDB Atlas (Free Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a free account
3. Create a new cluster (free tier - M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)
6. Replace `<password>` with your actual password
7. Add `/mentormentee` at the end of the connection string

### Step 2: Deploy to Vercel
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Sign in with GitHub
4. Click "Add New Project"
5. Import your repository
6. Add Environment Variables:
   - `MONGODB_URI` = Your MongoDB Atlas connection string from Step 1
   - `JWT_SECRET` = Any random secure string (e.g., `mySecretKey12345`)
   - `NODE_ENV` = `production`
7. Click "Deploy"
8. Wait 2-3 minutes for deployment
9. Your app will be live at `https://your-app.vercel.app`

**Note:** Real-time chat features won't work on Vercel (Socket.IO not supported). For full features with chat, use Render.com or Railway.app.

### Alternative: Deploy to Render.com (Supports Real-time Chat)
1. Go to [Render.com](https://render.com)
2. Create account and connect GitHub
3. Create new "Web Service"
4. Add Environment Variables (same as Vercel)
5. Deploy - full Socket.IO support!

## Available Scripts
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon (if nodemon is installed)
- `npm run populate-db` - **[TESTING ONLY]** Manually populate database with sample users for testing
- `node scripts/clear-database.js` - Clear all data from the database

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
