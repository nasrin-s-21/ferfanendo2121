/**
 * SIMS - Student Information Management System
 * Mock Data & LocalStorage State Management
 */

const STORAGE_KEYS = {
  STUDENTS: 'sims_students_db',
  CURRENT_USER: 'sims_current_student',
  NOTIFICATIONS: 'sims_notifications'
};

// Seed student profile
const DEFAULT_STUDENT = {
  id: 'std_21cs108',
  name: 'Aarav Sharma',
  registerNumber: '21CS108',
  email: 'aarav.sharma@apex.edu.in',
  phone: '9876543210',
  dob: '2003-08-15',
  gender: 'Male',
  bloodGroup: 'O+',
  department: 'Computer Science and Engineering',
  departmentCode: 'CSE',
  degree: 'B.Tech - Artificial Intelligence & Data Science',
  year: '3rd Year',
  semester: 'Semester VI',
  section: 'A',
  rollNumber: '21CS108',
  enrollmentYear: '2021',
  batch: '2021 - 2025',
  advisor: 'Dr. Ramesh Kumar, Ph.D (HOD - CSE)',
  advisorEmail: 'r.kumar@apex.edu.in',
  address: 'Flat 402, Green Valley Apartments, College Road',
  city: 'Coimbatore',
  district: 'Coimbatore',
  state: 'Tamil Nadu',
  pincode: '641014',
  parentName: 'Suresh Sharma',
  parentPhone: '9845012345',
  parentRelation: 'Father',
  parentEmail: 'suresh.sharma@gmail.com',
  parentOccupation: 'Senior Software Architect',
  password: 'Student@123',
  avatar: 'assets/images/student.jpg',
  stats: {
    cgpa: '8.74',
    attendance: '92.5%',
    creditsEarned: '112',
    creditsRequired: '160',
    currentSemesterCredits: '22',
    classRank: '4 of 68',
    backlogs: '0'
  },
  schedule: [
    { code: 'CS601', title: 'Machine Learning & Deep Neural Nets', time: '09:00 AM - 10:30 AM', room: 'LH-302', faculty: 'Dr. S. Meenakshi', status: 'Ongoing' },
    { code: 'CS602', title: 'Cloud Computing & DevOps Lab', time: '11:00 AM - 01:00 PM', room: 'Computing Lab 4', faculty: 'Prof. K. Anand', status: 'Upcoming' },
    { code: 'CS603', title: 'Information & Network Security', time: '02:00 PM - 03:30 PM', room: 'LH-304', faculty: 'Dr. V. Rajesh', status: 'Upcoming' }
  ],
  notices: [
    { id: 1, title: 'End Semester Exam Timetable - May 2026 Released', category: 'Examinations', date: 'Sept 28, 2026', badge: 'bg-danger', isNew: true },
    { id: 2, title: 'Campus Placement Drive: Google, Microsoft & TCS registration open', category: 'Placements', date: 'Sept 26, 2026', badge: 'bg-primary', isNew: true },
    { id: 3, title: 'Submission of Minor Project Stage-II Documentation Deadline', category: 'Academics', date: 'Sept 22, 2026', badge: 'bg-warning text-dark', isNew: false },
    { id: 4, title: 'Annual Inter-College Technical Symposium: InnovateX 2026', category: 'Events', date: 'Sept 18, 2026', badge: 'bg-success', isNew: false }
  ]
};

// Initialize Mock Data
function initMockData() {
  const existingStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  if (!existingStudents) {
    const initialList = [DEFAULT_STUDENT];
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initialList));
  }
}

// Get all registered students
function getStudents() {
  initMockData();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS)) || [DEFAULT_STUDENT];
  } catch (e) {
    return [DEFAULT_STUDENT];
  }
}

// Get Currently Logged In Student
function getCurrentStudent() {
  initMockData();
  const currentStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (currentStr) {
    try {
      return JSON.parse(currentStr);
    } catch (e) {
      console.error('Error parsing current student session:', e);
    }
  }
  return null;
}

// Set Active Student Session
function setCurrentStudent(student) {
  if (student) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(student));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

// Login verification
function loginStudent(registerNumber, password) {
  const students = getStudents();
  const regClean = (registerNumber || '').trim().toUpperCase();
  const student = students.find(s => s.registerNumber.toUpperCase() === regClean && s.password === password);
  
  if (student) {
    setCurrentStudent(student);
    return { success: true, student };
  } else {
    return { success: false, message: 'Invalid Register Number or Password. Please try again or use the demo login.' };
  }
}

// Register new student
function registerStudent(studentData) {
  const students = getStudents();
  const regClean = studentData.registerNumber.trim().toUpperCase();
  
  // Check if register number exists
  const existing = students.find(s => s.registerNumber.toUpperCase() === regClean);
  if (existing) {
    return { success: false, message: `Register Number "${regClean}" is already registered! Please login.` };
  }

  // Check email
  const emailExisting = students.find(s => s.email.toLowerCase() === studentData.email.trim().toLowerCase());
  if (emailExisting) {
    return { success: false, message: `Email "${studentData.email}" is already registered!` };
  }

  // Assemble full student profile with standard college defaults
  const newStudent = {
    ...DEFAULT_STUDENT,
    ...studentData,
    id: 'std_' + Date.now(),
    registerNumber: regClean,
    avatar: 'assets/images/student.jpg',
    stats: {
      cgpa: '8.50',
      attendance: '95.0%',
      creditsEarned: '40',
      creditsRequired: '160',
      currentSemesterCredits: '20',
      classRank: 'Top 10%',
      backlogs: '0'
    }
  };

  students.push(newStudent);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  return { success: true, student: newStudent };
}

// Update student profile
function updateStudentProfile(updatedFields) {
  const current = getCurrentStudent();
  if (!current) return { success: false, message: 'No active session found.' };

  const students = getStudents();
  const updatedStudent = { ...current, ...updatedFields };

  // Update in array
  const index = students.findIndex(s => s.registerNumber.toUpperCase() === current.registerNumber.toUpperCase());
  if (index !== -1) {
    students[index] = updatedStudent;
  } else {
    students.push(updatedStudent);
  }

  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  setCurrentStudent(updatedStudent);

  return { success: true, student: updatedStudent };
}

// Logout
function logoutStudent() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  window.location.href = 'login.html';
}

// Auth Guard Helper
function requireAuth() {
  const student = getCurrentStudent();
  if (!student) {
    window.location.href = 'login.html?authRequired=true';
    return null;
  }
  return student;
}

// If already logged in, redirect away from guest pages
function redirectIfLoggedIn() {
  const student = getCurrentStudent();
  if (student) {
    // optional redirect, or provide a banner
    return student;
  }
  return null;
}

// Make available globally
window.SIMS = {
  STORAGE_KEYS,
  DEFAULT_STUDENT,
  initMockData,
  getStudents,
  getCurrentStudent,
  setCurrentStudent,
  loginStudent,
  registerStudent,
  updateStudentProfile,
  logoutStudent,
  requireAuth,
  redirectIfLoggedIn
};

// Auto init on load
initMockData();
