/**
 * SIMS - Student Information Management System
 * Dashboard Module: Student greeting, stats, schedule, notices, quick actions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure session exists
  const student = window.SIMS.requireAuth();
  if (!student) return;

  renderNavbarUser(student);
  renderDashboardData(student);
  initDashboardEvents();
});

// Render user profile into Navbar
function renderNavbarUser(student) {
  const navAvatar = document.getElementById('navUserAvatar');
  const navName = document.getElementById('navUserName');
  const navReg = document.getElementById('navUserReg');

  if (navAvatar) navAvatar.src = student.avatar || 'assets/images/student.jpg';
  if (navName) navName.textContent = student.name;
  if (navReg) navReg.textContent = student.registerNumber;
}

// Generate dynamic greeting according to local time
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Populate Dashboard Page
function renderDashboardData(student) {
  // Greeting & Student info
  const greetingEl = document.getElementById('dashboardGreeting');
  const studentNameEl = document.getElementById('dashboardStudentName');
  const regNoEl = document.getElementById('dashboardRegNo');
  const deptEl = document.getElementById('dashboardDept');
  const yearSectionEl = document.getElementById('dashboardYearSection');
  const avatarEl = document.getElementById('dashboardAvatar');

  if (greetingEl) greetingEl.textContent = `${getGreeting()}, ${student.name.split(' ')[0]}! 👋`;
  if (studentNameEl) studentNameEl.textContent = student.name;
  if (regNoEl) regNoEl.textContent = student.registerNumber;
  if (deptEl) deptEl.textContent = student.department;
  if (yearSectionEl) yearSectionEl.textContent = `${student.year} • Section ${student.section}`;
  if (avatarEl) avatarEl.src = student.avatar || 'assets/images/student.jpg';

  // Stats
  const statCgpa = document.getElementById('statCgpa');
  const statAttendance = document.getElementById('statAttendance');
  const statCredits = document.getElementById('statCredits');
  const statRank = document.getElementById('statRank');

  if (statCgpa) statCgpa.textContent = student.stats?.cgpa || '8.74';
  if (statAttendance) statAttendance.textContent = student.stats?.attendance || '92.5%';
  if (statCredits) statCredits.textContent = `${student.stats?.creditsEarned || '112'} / ${student.stats?.creditsRequired || '160'}`;
  if (statRank) statRank.textContent = student.stats?.classRank || 'Top 10%';

  // Profile Summary Card
  const sumName = document.getElementById('sumName');
  const sumReg = document.getElementById('sumReg');
  const sumDept = document.getElementById('sumDept');
  const sumYear = document.getElementById('sumYear');
  const sumEmail = document.getElementById('sumEmail');
  const sumPhone = document.getElementById('sumPhone');
  const sumAdvisor = document.getElementById('sumAdvisor');

  if (sumName) sumName.textContent = student.name;
  if (sumReg) sumReg.textContent = student.registerNumber;
  if (sumDept) sumDept.textContent = student.department;
  if (sumYear) sumYear.textContent = `${student.year} (${student.section})`;
  if (sumEmail) sumEmail.textContent = student.email;
  if (sumPhone) sumPhone.textContent = `+91 ${student.phone}`;
  if (sumAdvisor) sumAdvisor.textContent = student.advisor || 'Dr. Ramesh Kumar, Ph.D';

  // Schedule list
  renderSchedule(student.schedule || []);

  // Notices list
  renderNotices(student.notices || []);
}

// Render Timetable / Classes
function renderSchedule(scheduleList) {
  const container = document.getElementById('scheduleContainer');
  if (!container) return;

  if (scheduleList.length === 0) {
    container.innerHTML = `<div class="text-center py-4 text-muted"><i class="bi bi-calendar-x fs-2 d-block mb-2"></i>No scheduled classes today.</div>`;
    return;
  }

  container.innerHTML = scheduleList.map(item => `
    <div class="schedule-item">
      <div class="schedule-time-box">
        <span class="schedule-time"><i class="bi bi-clock me-1 text-primary"></i> ${item.time}</span>
        <span class="schedule-room"><i class="bi bi-geo-alt me-1"></i> ${item.room}</span>
      </div>
      <div class="schedule-details">
        <div class="schedule-code">${item.code}</div>
        <div class="schedule-title">${item.title}</div>
        <div class="schedule-prof"><i class="bi bi-person me-1"></i> ${item.faculty}</div>
      </div>
      <span class="badge ${item.status === 'Ongoing' ? 'bg-success' : 'bg-secondary'} rounded-pill">
        ${item.status}
      </span>
    </div>
  `).join('');
}

// Render Announcements
function renderNotices(noticesList) {
  const container = document.getElementById('noticesContainer');
  if (!container) return;

  if (noticesList.length === 0) {
    container.innerHTML = `<div class="text-center py-4 text-muted">No current announcements.</div>`;
    return;
  }

  container.innerHTML = noticesList.map(notice => `
    <div class="notice-item">
      <div class="notice-bullet"></div>
      <div class="notice-content">
        <div class="notice-title">
          ${notice.title}
          ${notice.isNew ? '<span class="badge bg-danger ms-1" style="font-size: 0.65rem;">NEW</span>' : ''}
        </div>
        <div class="notice-meta">
          <span class="badge ${notice.badge}">${notice.category}</span>
          <span><i class="bi bi-calendar3 me-1"></i> ${notice.date}</span>
        </div>
      </div>
      <button class="btn btn-sm btn-outline-secondary rounded-circle" onclick="window.viewNoticeDetails('${notice.title.replace(/'/g, "\\'")}', '${notice.date}', '${notice.category}')" title="Read notice">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  `).join('');
}

// Notice Details Modal Helper
window.viewNoticeDetails = function(title, date, category) {
  const modalEl = document.getElementById('noticeDetailModal');
  if (!modalEl) return;
  
  document.getElementById('modalNoticeTitle').textContent = title;
  document.getElementById('modalNoticeDate').textContent = date;
  document.getElementById('modalNoticeCategory').textContent = category;
  
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

// Event handlers
function initDashboardEvents() {
  // Logout Trigger
  const logoutButtons = document.querySelectorAll('.logout-btn');
  logoutButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalEl = document.getElementById('logoutModal');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      } else {
        if (confirm('Are you sure you want to sign out?')) {
          window.SIMS.logoutStudent();
        }
      }
    });
  });

  const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', () => {
      window.SIMS.logoutStudent();
    });
  }

  // ID Card Modal
  const idCardModalEl = document.getElementById('idCardModal');
  if (idCardModalEl) {
    idCardModalEl.addEventListener('show.bs.modal', () => {
      const student = window.SIMS.getCurrentStudent();
      if (!student) return;
      document.getElementById('idCardName').textContent = student.name;
      document.getElementById('idCardReg').textContent = student.registerNumber;
      document.getElementById('idCardDept').textContent = student.department;
      document.getElementById('idCardBatch').textContent = student.batch || '2021-2025';
      document.getElementById('idCardBlood').textContent = student.bloodGroup || 'O+';
      document.getElementById('idCardEmergency').textContent = student.parentPhone || student.phone;
      document.getElementById('idCardPhoto').src = student.avatar || 'assets/images/student.jpg';
    });
  }
}
