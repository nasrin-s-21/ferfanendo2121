/**
 * SIMS - Student Information Management System
 * Authentication Module: Login, Register, Password Toggles & Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initLoginForm();
  initRegisterForm();
  initForgotPasswordModal();
  checkUrlParams();
});

// Toast Notification Utility
function showToast(message, type = 'info', title = '') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'sims-toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'bi-check-circle-fill text-success',
    error: 'bi-exclamation-octagon-fill text-danger',
    warning: 'bi-exclamation-triangle-fill text-warning',
    info: 'bi-info-circle-fill text-primary'
  };

  const defaultTitles = {
    success: 'Success',
    error: 'Error',
    warning: 'Notice',
    info: 'Information'
  };

  const toast = document.createElement('div');
  toast.className = `sims-toast toast-${type}`;
  toast.innerHTML = `
    <i class="bi ${icons[type] || icons.info} fs-4"></i>
    <div class="flex-grow-1">
      <div class="fw-bold mb-1" style="font-size: 0.9rem;">${title || defaultTitles[type]}</div>
      <div style="font-size: 0.85rem; color: #475569;">${message}</div>
    </div>
    <button type="button" class="btn-close btn-sm ms-2" aria-label="Close"></button>
  `;

  const closeBtn = toast.querySelector('.btn-close');
  closeBtn.addEventListener('click', () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  });

  container.appendChild(toast);

  // Auto remove after 4.5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4500);
}

// Global Password Visibility Toggle
function initPasswordToggles() {
  const toggleBtns = document.querySelectorAll('.password-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('i');

      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
        btn.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
        btn.setAttribute('aria-label', 'Show password');
      }
    });
  });
}

// Login Page Logic
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  // Auto-fill demo credentials button
  const fillDemoBtn = document.getElementById('fillDemoBtn');
  if (fillDemoBtn) {
    fillDemoBtn.addEventListener('click', () => {
      document.getElementById('registerNumber').value = '21CS108';
      document.getElementById('password').value = 'Student@123';
      showToast('Demo credentials auto-filled! Click "Sign In" to proceed.', 'info', 'Demo Credentials Loaded');
    });
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check validity
    if (!loginForm.checkValidity()) {
      e.stopPropagation();
      loginForm.classList.add('was-validated');
      showToast('Please fill in both Register Number and Password.', 'warning', 'Required Fields');
      return;
    }

    const regNo = document.getElementById('registerNumber').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('loginSubmitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    // Show loading state
    submitBtn.disabled = true;
    if (btnSpinner) btnSpinner.classList.remove('d-none');
    if (btnText) btnText.textContent = 'Verifying Credentials...';

    // Simulate network authentication call (delay 600ms)
    setTimeout(() => {
      const result = window.SIMS.loginStudent(regNo, password);

      if (result.success) {
        showToast(`Welcome back, ${result.student.name}! Redirecting to Dashboard...`, 'success', 'Login Successful');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      } else {
        // Reset button
        submitBtn.disabled = false;
        if (btnSpinner) btnSpinner.classList.add('d-none');
        if (btnText) btnText.textContent = 'Sign In to Portal';

        showToast(result.message, 'error', 'Authentication Failed');
        const passInput = document.getElementById('password');
        passInput.classList.add('is-invalid');
        passInput.focus();
      }
    }, 600);
  });
}

// Registration Page Logic
function initRegisterForm() {
  const regForm = document.getElementById('registerForm');
  if (!regForm) return;

  const passwordInput = document.getElementById('regPassword');
  const confirmPasswordInput = document.getElementById('regConfirmPassword');
  const strengthBar = document.getElementById('passwordStrengthBar');
  const strengthText = document.getElementById('passwordStrengthText');

  // Password strength meter
  if (passwordInput && strengthBar && strengthText) {
    passwordInput.addEventListener('input', () => {
      const val = passwordInput.value;
      let score = 0;
      if (val.length >= 6) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const fill = strengthBar.querySelector('.password-strength-fill');
      if (val.length === 0) {
        fill.style.width = '0%';
        fill.style.backgroundColor = '#e2e8f0';
        strengthText.textContent = '';
      } else if (score <= 1) {
        fill.style.width = '25%';
        fill.style.backgroundColor = '#ef4444';
        strengthText.textContent = 'Weak password';
        strengthText.style.color = '#ef4444';
      } else if (score === 2) {
        fill.style.width = '50%';
        fill.style.backgroundColor = '#f59e0b';
        strengthText.textContent = 'Moderate password';
        strengthText.style.color = '#f59e0b';
      } else if (score === 3) {
        fill.style.width = '75%';
        fill.style.backgroundColor = '#3b82f6';
        strengthText.textContent = 'Strong password';
        strengthText.style.color = '#3b82f6';
      } else {
        fill.style.width = '100%';
        fill.style.backgroundColor = '#10b981';
        strengthText.textContent = 'Very strong password!';
        strengthText.style.color = '#10b981';
      }
    });
  }

  // Real-time password confirmation check
  if (confirmPasswordInput && passwordInput) {
    confirmPasswordInput.addEventListener('input', () => {
      if (confirmPasswordInput.value !== passwordInput.value) {
        confirmPasswordInput.setCustomValidity("Passwords do not match");
      } else {
        confirmPasswordInput.setCustomValidity("");
      }
    });
  }

  // Registration Form Submission
  regForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check custom password match
    if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordInput.setCustomValidity("Passwords do not match");
      confirmPasswordInput.classList.add('is-invalid');
      showToast('Passwords do not match. Please verify your password confirmation.', 'warning', 'Password Mismatch');
    } else {
      confirmPasswordInput.setCustomValidity("");
      confirmPasswordInput.classList.remove('is-invalid');
    }

    // Phone checks
    const phoneInput = document.getElementById('regPhone');
    if (phoneInput && !/^\d{10}$/.test(phoneInput.value.trim())) {
      phoneInput.setCustomValidity("Please enter a valid 10-digit mobile number");
    } else if (phoneInput) {
      phoneInput.setCustomValidity("");
    }

    const parentPhoneInput = document.getElementById('regParentPhone');
    if (parentPhoneInput && !/^\d{10}$/.test(parentPhoneInput.value.trim())) {
      parentPhoneInput.setCustomValidity("Please enter a valid 10-digit mobile number");
    } else if (parentPhoneInput) {
      parentPhoneInput.setCustomValidity("");
    }

    // Pincode check
    const pinInput = document.getElementById('regPincode');
    if (pinInput && !/^\d{6}$/.test(pinInput.value.trim())) {
      pinInput.setCustomValidity("Please enter a valid 6-digit postal code");
    } else if (pinInput) {
      pinInput.setCustomValidity("");
    }

    if (!regForm.checkValidity()) {
      e.stopPropagation();
      regForm.classList.add('was-validated');
      
      // Find first invalid input and focus
      const firstInvalid = regForm.querySelector(':invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      showToast('Please correct the highlighted errors in the form before submitting.', 'error', 'Validation Incomplete');
      return;
    }

    const submitBtn = document.getElementById('regSubmitBtn');
    const btnText = document.getElementById('regBtnText');
    const btnSpinner = document.getElementById('regBtnSpinner');

    submitBtn.disabled = true;
    if (btnSpinner) btnSpinner.classList.remove('d-none');
    if (btnText) btnText.textContent = 'Enrolling Student...';

    // Build payload
    const studentData = {
      name: document.getElementById('regName').value.trim(),
      registerNumber: document.getElementById('regRegisterNo').value.trim().toUpperCase(),
      dob: document.getElementById('regDob').value,
      gender: document.getElementById('regGender').value,
      email: document.getElementById('regEmail').value.trim(),
      phone: document.getElementById('regPhone').value.trim(),
      department: document.getElementById('regDepartment').value,
      year: document.getElementById('regYear').value,
      section: document.getElementById('regSection').value,
      address: document.getElementById('regAddress').value.trim(),
      city: document.getElementById('regCity').value.trim(),
      district: document.getElementById('regDistrict').value.trim(),
      state: document.getElementById('regState').value,
      pincode: document.getElementById('regPincode').value.trim(),
      parentName: document.getElementById('regParentName').value.trim(),
      parentPhone: document.getElementById('regParentPhone').value.trim(),
      password: passwordInput.value
    };

    // Simulate API call
    setTimeout(() => {
      const result = window.SIMS.registerStudent(studentData);

      if (result.success) {
        showToast('Registration completed successfully! Setting up your portal access...', 'success', 'Enrollment Confirmed');
        // Auto-login newly registered student
        window.SIMS.setCurrentStudent(result.student);
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1200);
      } else {
        submitBtn.disabled = false;
        if (btnSpinner) btnSpinner.classList.add('d-none');
        if (btnText) btnText.textContent = 'Complete Registration';
        showToast(result.message, 'error', 'Registration Failed');
      }
    }, 700);
  });
}

// Forgot Password Modal
function initForgotPasswordModal() {
  const fpForm = document.getElementById('forgotPasswordForm');
  if (!fpForm) return;

  fpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fpRegNo = document.getElementById('fpRegisterNo').value.trim();
    const fpEmail = document.getElementById('fpEmail').value.trim();

    if (!fpRegNo || !fpEmail) {
      showToast('Please enter both Register Number and Registered Email.', 'warning');
      return;
    }

    const modalSubmitBtn = document.getElementById('fpSubmitBtn');
    modalSubmitBtn.disabled = true;
    modalSubmitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Sending Reset Link...';

    setTimeout(() => {
      modalSubmitBtn.disabled = false;
      modalSubmitBtn.innerHTML = 'Send Password Reset Instructions';
      
      // Close modal
      const modalEl = document.getElementById('forgotPasswordModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

      showToast(`A password reset link and 6-digit OTP has been dispatched to ${fpEmail}. (Demo OTP: 442901)`, 'success', 'Reset Link Dispatched');
      fpForm.reset();
    }, 900);
  });
}

// URL Params check for redirected states
function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('authRequired') === 'true') {
    showToast('Please sign in with your student credentials to access that page.', 'warning', 'Session Required');
  }
  if (params.get('loggedOut') === 'true') {
    showToast('You have been safely signed out. See you next time!', 'info', 'Signed Out');
  }
}

window.showToast = showToast;
