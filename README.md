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

## Deploy to Render.com (Recommended - Full Features)

### Why Render?
- ✅ Free tier available
- ✅ Full Socket.IO support (real-time chat works!)
- ✅ Easy deployment from GitHub
- ✅ Automatic HTTPS
- ✅ Auto-restart on crashes

### Step 1: Setup MongoDB Atlas (Free Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create free account and sign in
3. Click "Build a Database" → Choose "Free" (M0) tier
4. Select cloud provider and region (closest to you)
5. Click "Create Cluster" (takes 3-5 minutes)
6. Go to "Database Access" → Add New User:
   - Username: `admin` (or any name)
   - Password: Create strong password (save it!)
7. Go to "Network Access" → Add IP Address:
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm
8. Go back to "Database" → Click "Connect" button
9. Choose "Drivers" → Select "Node.js" and version "4.1 or later"
10. Copy the connection string (it will look like):
    ```
    mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
    ```
11. **IMPORTANT**: Modify the connection string:
    - Replace `<password>` with your actual password (NO angle brackets!)
    - Add `/mentormentee` before the `?` 
    - Final correct format:
    ```
    mongodb+srv://admin:YourPassword123@cluster0.xxxxx.mongodb.net/mentormentee?retryWrites=true&w=majority
    ```
    **Example**: If password is `Pass123`, cluster is `cluster0.abc12.mongodb.net`:
    ```
    mongodb+srv://admin:Pass123@cluster0.abc12.mongodb.net/mentormentee?retryWrites=true&w=majority
    ```

### Step 2: Deploy to Render
1. Make sure your code is pushed to GitHub
2. Go to [Render.com](https://render.com) and sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub account (if not connected)
5. Select your repository: `mentor-mentee-application`
6. Configure:
   - **Name**: `mentor-mentee-platform` (or any name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Select **Free**
7. Click "Advanced" → Add Environment Variables:
   - **Key**: `MONGODB_URI` | **Value**: (paste your MongoDB connection string from Step 1)
   - **Key**: `JWT_SECRET` | **Value**: `mySecretKey123` (any random secure string)
   - **Key**: `NODE_ENV` | **Value**: `production`
8. Click "Create Web Service"
9. Wait 5-10 minutes for deployment
10. Your app will be live at: `https://mentor-mentee-platform.onrender.com`

### Step 3: Test Your Deployment
1. Open your Render URL
2. Register a new student and mentor
3. Test login, chat, meetings - everything should work!

**Note:** Free tier services may sleep after 15 minutes of inactivity. First request takes 30-60 seconds to wake up.

### Common Issues & Solutions

**Error: SSL/TLS Alert Internal Error (Error 80)**
- ✅ **Fixed in latest code!**
- Make sure your MongoDB connection string is correct
- Password should NOT have special characters like `@`, `#`, `%` (or URL encode them)
- Example bad password: `Pass@123` (use `Pass123` instead)
- Connection string format must be: `mongodb+srv://user:pass@cluster.mongodb.net/mentormentee?retryWrites=true&w=majority`

**Error: Could not connect to MongoDB**
- Check if IP address `0.0.0.0/0` is whitelisted in MongoDB Atlas
- Verify username and password are correct
- Make sure database name `mentormentee` is added in connection string

**Error: Application Error / Crash**
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set correctly
- Make sure `NODE_ENV=production` is set

**Chat not working**
- Socket.IO is fully supported on Render
- Clear browser cache and try again
- Check browser console for connection errors

### Alternative Options
- [Railway.app](https://railway.app) - Similar to Render, supports Socket.IO
- [Heroku](https://heroku.com) - Paid plans only now

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
