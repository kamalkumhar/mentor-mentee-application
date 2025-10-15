const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const branchOptions = ['Computer', 'IT', 'EXTC', 'Chemical', 'Mechanical', 'Data Science', 'Civil'];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'mentor'],
    default: 'student'
  },
  profile: {
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    skills: [{ type: String }],
    education: [{
      institution: String,
      degree: String,
      year: String
    }],
    experience: [{
      company: String,
      position: String,
      duration: String
    }],
    // Student-specific fields
    currentYear: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: function() { return this.role === 'student'; }
    },
    cgpa: {
      type: Map,
      of: {
        sem1: { type: Number, min: 0, max: 10 },
        sem2: { type: Number, min: 0, max: 10 }
      },
      required: function() { return this.role === 'student'; },
      // Convert object to Map when setting
      set: function(val) {
        if (val && typeof val === 'object' && !(val instanceof Map)) {
          const map = new Map();
          for (const key in val) {
            map.set(key, val[key]);
          }
          return map;
        }
        return val;
      }
    },
    branch: {
      type: String,
      enum: branchOptions,
      required: function() { return this.role === 'student' || this.role === 'mentor'; }
    },
    division: {
      type: String,
      required: function() { return this.role === 'student'; }
    }
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make this optional initially
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate average CGPA
userSchema.methods.getAverageCGPA = function() {
  if (this.role !== 'student' || !this.profile.cgpa) return 0;
  
  let total = 0;
  let count = 0;
  
  for (let year = 1; year <= this.profile.currentYear; year++) {
    const yearKey = `year${year}`;
    // Handle both Map and object formats
    let yearCGPA;
    if (this.profile.cgpa instanceof Map) {
      yearCGPA = this.profile.cgpa.get(yearKey);
    } else {
      yearCGPA = this.profile.cgpa[yearKey];
    }
    
    if (yearCGPA) {
      if (yearCGPA.sem1 !== undefined && yearCGPA.sem1 !== null) {
        total += yearCGPA.sem1;
        count++;
      }
      if (yearCGPA.sem2 !== undefined && yearCGPA.sem2 !== null) {
        total += yearCGPA.sem2;
        count++;
      }
    }
  }
  
  return count > 0 ? (total / count).toFixed(2) : 0;
};

// Categorize student based on CGPA
userSchema.methods.getCGPACategory = function() {
  if (this.role !== 'student') return null;
  
  const avgCGPA = parseFloat(this.getAverageCGPA());
  if (avgCGPA >= 8.5) return 'topper';
  if (avgCGPA >= 6.0) return 'mid-range';
  return 'low-range';
};

module.exports = mongoose.model('User', userSchema);