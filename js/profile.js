/**
 * SIMS - Student Information Management System
 * Profile Module: View mode, Edit mode, Validation, and Profile Update Persistence
 */

document.addEventListener('DOMContentLoaded', () => {
  const student = window.SIMS.requireAuth();
  if (!student) return;

  renderNavbarUser(student);
  renderProfileView(student);
  populateEditForm(student);
  initProfileEvents();

  // Check if opened with ?edit=true
  const params = new URLSearchParams(window.location.search);
  if (params.get('edit') === 'true') {
    enableEditMode();
  }
});

function renderNavbarUser(student) {
  const navAvatar = document.getElementById('navUserAvatar');
  const navName = document.getElementById('navUserName');
  const navReg = document.getElementById('navUserReg');

  if (navAvatar) navAvatar.src = student.avatar || 'assets/images/student.jpg';
  if (navName) navName.textContent = student.name;
  if (navReg) navReg.textContent = student.registerNumber;
}

// Render data in VIEW MODE
function renderProfileView(student) {
  // Header Info
  const headerAvatar = document.getElementById('profileHeaderAvatar');
  const headerName = document.getElementById('profileHeaderName');
  const headerDept = document.getElementById('profileHeaderDept');
  const headerReg = document.getElementById('profileHeaderReg');
  const headerBatch = document.getElementById('profileHeaderBatch');

  if (headerAvatar) headerAvatar.src = student.avatar || 'assets/images/student.jpg';
  if (headerName) headerName.textContent = student.name;
  if (headerDept) headerDept.textContent = `${student.degree || student.department}`;
  if (headerReg) headerReg.textContent = student.registerNumber;
  if (headerBatch) headerBatch.textContent = `Batch: ${student.batch || '2021-2025'}`;

  // 1. Personal Information
  setText('viewName', student.name);
  setText('viewRegNo', student.registerNumber);
  setText('viewDob', formatDate(student.dob));
  setText('viewGender', student.gender);
  setText('viewBloodGroup', student.bloodGroup || 'O+');
  setText('viewNationality', student.nationality || 'Indian');

  // 2. Academic Information
  setText('viewDepartment', student.department);
  setText('viewDegree', student.degree || 'B.Tech Computer Science');
  setText('viewYear', student.year);
  setText('viewSemester', student.semester || 'Semester VI');
  setText('viewSection', student.section);
  setText('viewRollNo', student.rollNumber || student.registerNumber);
  setText('viewAdvisor', student.advisor || 'Dr. Ramesh Kumar, Ph.D');
  setText('viewAdvisorEmail', student.advisorEmail || 'advisor@apex.edu.in');
  setText('viewEnrollmentYear', student.enrollmentYear || '2021');

  // 3. Contact Information
  setText('viewEmail', student.email);
  setText('viewPhone', `+91 ${student.phone}`);
  setText('viewAddress', student.address);
  setText('viewCity', student.city);
  setText('viewDistrict', student.district);
  setText('viewState', student.state);
  setText('viewPincode', student.pincode);

  // 4. Parent / Guardian Information
  setText('viewParentName', student.parentName);
  setText('viewParentPhone', `+91 ${student.parentPhone}`);
  setText('viewParentRelation', student.parentRelation || 'Parent/Guardian');
  setText('viewParentEmail', student.parentEmail || 'Not Provided');
  setText('viewParentOccupation', student.parentOccupation || 'Not Specified');
}

// Populate inputs in EDIT MODE
function populateEditForm(student) {
  setInputValue('editName', student.name);
  setInputValue('editDob', student.dob);
  setInputValue('editGender', student.gender);
  setInputValue('editBloodGroup', student.bloodGroup || 'O+');
  
  // Academic (Note: Reg No is read-only)
  const regNoField = document.getElementById('editRegNo');
  if (regNoField) regNoField.value = student.registerNumber;
  setInputValue('editDepartment', student.department);
  setInputValue('editDegree', student.degree || 'B.Tech - Artificial Intelligence & Data Science');
  setInputValue('editYear', student.year);
  setInputValue('editSemester', student.semester || 'Semester VI');
  setInputValue('editSection', student.section);
  setInputValue('editRollNo', student.rollNumber || student.registerNumber);
  setInputValue('editAdvisor', student.advisor || 'Dr. Ramesh Kumar, Ph.D (HOD - CSE)');

  // Contact
  setInputValue('editEmail', student.email);
  setInputValue('editPhone', student.phone);
  setInputValue('editAddress', student.address);
  setInputValue('editCity', student.city);
  setInputValue('editDistrict', student.district);
  setInputValue('editState', student.state);
  setInputValue('editPincode', student.pincode);

  // Parent
  setInputValue('editParentName', student.parentName);
  setInputValue('editParentPhone', student.parentPhone);
  setInputValue('editParentRelation', student.parentRelation || 'Father');
  setInputValue('editParentEmail', student.parentEmail || '');
  setInputValue('editParentOccupation', student.parentOccupation || '');
}

// Helper setter functions
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || '—';
}

function setInputValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || '';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  } catch (e) {}
  return dateStr;
}

// Switch between view and edit
function enableEditMode() {
  document.getElementById('profileViewSection').classList.add('d-none');
  document.getElementById('profileEditSection').classList.remove('d-none');
  document.getElementById('editModeBanner').classList.remove('d-none');
  document.getElementById('topEditToggleBtn').classList.add('d-none');
  window.scrollTo({ top: 220, behavior: 'smooth' });
}

function disableEditMode() {
  document.getElementById('profileViewSection').classList.remove('d-none');
  document.getElementById('profileEditSection').classList.add('d-none');
  document.getElementById('editModeBanner').classList.add('d-none');
  document.getElementById('topEditToggleBtn').classList.remove('d-none');
}

// Event Bindings
function initProfileEvents() {
  // Top Edit Button
  const topEditBtn = document.getElementById('topEditToggleBtn');
  if (topEditBtn) {
    topEditBtn.addEventListener('click', enableEditMode);
  }

  // Cancel Button in Edit Form
  const cancelBtn = document.getElementById('cancelEditBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      const student = window.SIMS.getCurrentStudent();
      populateEditForm(student); // reset to original
      disableEditMode();
      window.showToast('Edit discarded. Retained existing profile information.', 'info', 'Changes Cancelled');
    });
  }

  // Edit Profile Form Submission
  const editForm = document.getElementById('profileEditForm');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Custom validations
      const phoneInput = document.getElementById('editPhone');
      if (phoneInput && !/^\d{10}$/.test(phoneInput.value.trim())) {
        phoneInput.setCustomValidity("Please enter a valid 10-digit mobile number");
      } else if (phoneInput) {
        phoneInput.setCustomValidity("");
      }

      const parentPhoneInput = document.getElementById('editParentPhone');
      if (parentPhoneInput && !/^\d{10}$/.test(parentPhoneInput.value.trim())) {
        parentPhoneInput.setCustomValidity("Please enter a valid 10-digit mobile number");
      } else if (parentPhoneInput) {
        parentPhoneInput.setCustomValidity("");
      }

      const pinInput = document.getElementById('editPincode');
      if (pinInput && !/^\d{6}$/.test(pinInput.value.trim())) {
        pinInput.setCustomValidity("Please enter a valid 6-digit postal code");
      } else if (pinInput) {
        pinInput.setCustomValidity("");
      }

      if (!editForm.checkValidity()) {
        e.stopPropagation();
        editForm.classList.add('was-validated');
        const firstInvalid = editForm.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        window.showToast('Please fix the highlighted validation errors.', 'error', 'Validation Error');
        return;
      }

      const saveBtn = document.getElementById('saveProfileBtn');
      const saveBtnText = document.getElementById('saveBtnText');
      const saveBtnSpinner = document.getElementById('saveBtnSpinner');

      // Loading state
      saveBtn.disabled = true;
      if (saveBtnSpinner) saveBtnSpinner.classList.remove('d-none');
      if (saveBtnText) saveBtnText.textContent = 'Saving Profile...';

      // Assemble updated fields
      const updatedFields = {
        name: document.getElementById('editName').value.trim(),
        dob: document.getElementById('editDob').value,
        gender: document.getElementById('editGender').value,
        bloodGroup: document.getElementById('editBloodGroup').value,
        department: document.getElementById('editDepartment').value,
        degree: document.getElementById('editDegree').value.trim(),
        year: document.getElementById('editYear').value,
        semester: document.getElementById('editSemester').value,
        section: document.getElementById('editSection').value,
        rollNumber: document.getElementById('editRollNo').value.trim(),
        advisor: document.getElementById('editAdvisor').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        address: document.getElementById('editAddress').value.trim(),
        city: document.getElementById('editCity').value.trim(),
        district: document.getElementById('editDistrict').value.trim(),
        state: document.getElementById('editState').value,
        pincode: document.getElementById('editPincode').value.trim(),
        parentName: document.getElementById('editParentName').value.trim(),
        parentPhone: document.getElementById('editParentPhone').value.trim(),
        parentRelation: document.getElementById('editParentRelation').value,
        parentEmail: document.getElementById('editParentEmail').value.trim(),
        parentOccupation: document.getElementById('editParentOccupation').value.trim()
      };

      // Simulate API call & update storage
      setTimeout(() => {
        const result = window.SIMS.updateStudentProfile(updatedFields);

        saveBtn.disabled = false;
        if (saveBtnSpinner) saveBtnSpinner.classList.add('d-none');
        if (saveBtnText) saveBtnText.textContent = 'Save Profile Changes';

        if (result.success) {
          // Re-render view mode and navbar
          renderProfileView(result.student);
          renderNavbarUser(result.student);
          disableEditMode();
          window.showToast('Student profile updated and saved successfully!', 'success', 'Profile Updated');
        } else {
          window.showToast(result.message || 'Failed to update profile.', 'error', 'Error');
        }
      }, 700);
    });
  }

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
}
