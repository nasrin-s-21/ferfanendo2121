# Apex SIMS - Student Information Management System

A modern, responsive, college-style frontend web application for student information and academic management. Built strictly adhering to the **Frontend Development Prompt** specifications.

---

## 🚀 Live Demo & Getting Started

Simply open `login.html` (or `index.html`) in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).

### 🔑 Demo Credentials
- **Student Register Number**: `21CS108`
- **Password**: `Student@123`
*(A quick **"Auto Fill"** helper button is also available directly on the login screen for instant one-click testing)*

---

## 📁 Clean Frontend Folder Structure

```text
nisha/
├── index.html            # Entry router (redirects to dashboard or login based on session)
├── login.html            # Page 1: Student Login Portal
├── register.html         # Page 2: Comprehensive Student Registration Form
├── dashboard.html        # Page 3: Student Academic Dashboard
├── profile.html          # Page 4: Student Profile (View & Edit Modes)
├── docx                  # Original prompt specification
├── css/
│   ├── style.css         # Core Design System, CSS tokens, navbar, toasts & common components
│   ├── auth.css          # Login & registration split hero layout & form styles
│   └── dashboard.css     # Dashboard cards, schedule, notices, ID card & profile view/edit styles
├── js/
│   ├── mock-data.js      # Mock database (localStorage) & session management
│   ├── auth.js           # Login, registration validation, password toggles, and toast alerts
│   ├── dashboard.js      # Dynamic greeting, academic stats, timetable & notice renders
│   └── profile.js        # View/Edit mode switching, real-time validation, and profile updates
└── assets/
    └── images/
        ├── campus.jpg    # Modern university collegiate architectural banner
        └── student.jpg   # High-resolution collegiate student profile portrait
```

---

## 🛠️ Technology Stack
- **HTML5**: Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`)
- **CSS3**: Vanilla CSS with modern custom properties, glassmorphism, responsive grid, micro-animations
- **JavaScript (ES6+)**: Modular scripts, client-side validation, `localStorage` persistence
- **Bootstrap 5.3.3 & Bootstrap Icons 1.11.3**: Robust grid system, responsive utilities, and iconography
- **Google Fonts**: *Outfit* (headings) and *Plus Jakarta Sans* (interface typography)

---

## ✨ Implemented Pages & Features

### 1. Login Page (`login.html`)
- **Student Register Number** input with uppercase formatting
- **Password** input with interactive **Show/Hide toggle**
- **Form validation** with inline feedback and toast notifications
- **Loading states** on the sign-in button
- **Forgot Password Modal** with simulated OTP dispatch
- **Demo Credentials Bar** with instant auto-fill button
- Responsive collegiate split-pane layout featuring campus branding and accreditation badges

### 2. Student Registration Page (`register.html`)
Organized into 5 logical sections containing all 18 required fields:
1. **Personal Information**: Student Name, Register Number, Date of Birth, Gender
2. **Academic Details**: Department, Year of Study, Section
3. **Contact & Location Information**: Email, Mobile Phone, Permanent Address, City, District, State, Pincode
4. **Parent / Guardian Information**: Parent Name, Parent Phone
5. **Account Security**: Password (with strength meter), Confirm Password (with real-time match validation), Show/Hide toggles
- Strict client-side regex validations (10-digit phones, 6-digit postal code, valid email)
- Immediate auto-login upon registration and persistence into `localStorage`

### 3. Student Dashboard (`dashboard.html`)
- **Dynamic Welcome Banner**: Greeting personalized to time of day (*Good morning / afternoon / evening, Aarav!*), academic status badge, and student details
- **4 Stat Metric Cards**:
  - Cumulative GPA (CGPA)
  - Overall Attendance Percentage (with safe threshold indicator)
  - Credits Earned / Required
  - Department Class Rank
- **Class & Lab Schedule** with live status pills (Ongoing / Upcoming)
- **Official Circulars & Notices** with category badges and read modals
- **Student Profile Summary Card** with quick access links
- **Interactive Quick Services**:
  - Digital Student ID Card modal (printable with barcode & photo)
  - Grade sheet download trigger
  - Fee clearance status
- **Session Logout** with confirmation dialog

### 4. Student Profile Page (`profile.html`)
- **Profile Header**: Campus cover banner, verified student badge, and student portrait
- **View Mode**: Clean tabbed layout organizing:
  - Personal Information (Name, Reg No, DOB, Gender, Blood Group, Nationality)
  - Academic Information (Department, Degree, Year, Semester, Section, Roll No, Advisor)
  - Contact Details (Email, Phone, Address, City, District, State, Pincode)
  - Parent / Guardian Information (Parent Name, Parent Phone, Relation, Parent Email, Occupation)
- **Edit Mode**: Toggled via the *"Edit Student Profile"* button
  - Pre-filled interactive input fields
  - Form validation with sticky save/cancel action bar
  - Loading spinner during save operation
  - Instant synchronization with `localStorage` and dynamic UI updates without page reloads
