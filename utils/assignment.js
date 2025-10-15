const User = require('../models/User');

/**
 * Assign students to teachers based on branch and CGPA category
 * This is a simplified "ML-like" algorithm that distributes students fairly
 */
async function assignStudentsToTeachers() {
  try {
    // Get all teachers and students
    const teachers = await User.find({ role: 'mentor' }).populate('students');
    const students = await User.find({ role: 'student', mentor: { $exists: false } });
    
    if (teachers.length === 0 || students.length === 0) {
      console.log('No teachers or students to assign');
      return;
    }
    
    // Group students by branch and CGPA category
    const studentsByBranch = {};
    students.forEach(student => {
      const branch = student.profile.branch;
      const category = student.getCGPACategory();
      
      if (!studentsByBranch[branch]) {
        studentsByBranch[branch] = {
          topper: [],
          'mid-range': [],
          'low-range': []
        };
      }
      
      studentsByBranch[branch][category].push(student);
    });
    
    // For each branch, assign students to teachers
    for (const branch in studentsByBranch) {
      const teachersInBranch = teachers.filter(teacher => teacher.profile.branch === branch);
      
      if (teachersInBranch.length === 0) {
        console.log(`No teachers found for branch: ${branch}`);
        continue;
      }
      
      // Assign students in each category
      for (const category in studentsByBranch[branch]) {
        const studentsInCategory = studentsByBranch[branch][category];
        if (studentsInCategory.length === 0) continue;
        
        // Distribute students equally among teachers
        const studentsPerTeacher = Math.ceil(studentsInCategory.length / teachersInBranch.length);
        
        for (let i = 0; i < studentsInCategory.length; i++) {
          const student = studentsInCategory[i];
          const teacherIndex = Math.floor(i / studentsPerTeacher);
          const teacher = teachersInBranch[Math.min(teacherIndex, teachersInBranch.length - 1)];
          
          // Assign student to teacher
          student.mentor = teacher._id;
          teacher.students.push(student._id);
          
          // Save both student and teacher
          await student.save();
          await teacher.save();
        }
      }
    }
    
    console.log('Student-teacher assignment completed successfully');
  } catch (error) {
    console.error('Error during student-teacher assignment:', error);
  }
}

/**
 * Assign a single student to a teacher (used after student registration)
 */
async function assignStudentToTeacher(studentId) {
  try {
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      throw new Error('Invalid student');
    }
    
    // If student is already assigned, skip
    if (student.mentor) {
      return;
    }
    
    // Get the student's branch and CGPA category
    const branch = student.profile.branch;
    const category = student.getCGPACategory();
    
    // Find teachers in the same branch
    const teachersInBranch = await User.find({ 
      role: 'mentor', 
      'profile.branch': branch 
    }).populate('students');
    
    if (teachersInBranch.length === 0) {
      console.log(`No teachers found for branch: ${branch}`);
      return;
    }
    
    // Find the teacher with the least number of students in this category
    let assignedTeacher = teachersInBranch[0];
    let minStudents = assignedTeacher.students.length;
    
    for (const teacher of teachersInBranch) {
      if (teacher.students.length < minStudents) {
        minStudents = teacher.students.length;
        assignedTeacher = teacher;
      }
    }
    
    // Assign student to teacher
    student.mentor = assignedTeacher._id;
    assignedTeacher.students.push(student._id);
    
    // Save both student and teacher
    await student.save();
    await assignedTeacher.save();
    
    console.log(`Assigned student ${student.name} to teacher ${assignedTeacher.name}`);
  } catch (error) {
    console.error('Error assigning student to teacher:', error);
  }
}

module.exports = {
  assignStudentsToTeachers,
  assignStudentToTeacher
};