// ============================================
// LOGIN & SIGNUP MODAL COMPONENTS
// ============================================

class AuthModal {
  constructor() {
    this.loginModal = null;
    this.signupModal = null;
    this.init();
  }

  init() {
    this.createModals();
    this.attachEventListeners();
  }

  createModals() {
    // Login Modal
    const loginModalHTML = `
      <div id="login-modal" class="modal-overlay">
        <div class="modal-content auth-modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Login to ByteBazaar</h2>
            <button class="modal-close" id="login-modal-close" aria-label="Close">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div id="login-alert" class="auth-alert" style="display: none;"></div>
            <form id="login-modal-form" class="auth-form">
              <div class="form-group">
                <label for="login-modal-email" class="form-label">
                  Email Address <span class="required">*</span>
                </label>
                <input
                  type="email"
                  id="login-modal-email"
                  class="form-input"
                  placeholder="your@email.com"
                  required
                  autocomplete="email"
                >
              </div>

              <div class="form-group">
                <label for="login-modal-password" class="form-label">
                  Password <span class="required">*</span>
                </label>
                <div class="password-toggle">
                  <input
                    type="password"
                    id="login-modal-password"
                    class="form-input"
                    placeholder="Enter your password"
                    required
                    autocomplete="current-password"
                  >
                  <button type="button" class="password-toggle-btn" id="login-toggle-password">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <button type="submit" class="auth-submit" id="login-modal-submit">
                Login
              </button>
            </form>

            <div class="auth-divider">or</div>

            <p class="text-center text-sm text-gray-600">
              Don't have an account? 
              <button id="switch-to-signup" class="auth-link">Sign up here</button>
            </p>
          </div>
        </div>
      </div>
    `;

    // Signup Modal
    const signupModalHTML = `
      <div id="signup-modal" class="modal-overlay">
        <div class="modal-content auth-modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Create Account</h2>
            <button class="modal-close" id="signup-modal-close" aria-label="Close">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div id="signup-alert" class="auth-alert" style="display: none;"></div>
            <form id="signup-modal-form" class="auth-form">
              <div class="form-group">
                <label for="signup-modal-name" class="form-label">
                  Full Name <span class="required">*</span>
                </label>
                <input
                  type="text"
                  id="signup-modal-name"
                  class="form-input"
                  placeholder="John Doe"
                  required
                  autocomplete="name"
                >
              </div>

              <div class="form-group">
                <label for="signup-modal-email" class="form-label">
                  Email Address <span class="required">*</span>
                </label>
                <input
                  type="email"
                  id="signup-modal-email"
                  class="form-input"
                  placeholder="your@email.com"
                  required
                  autocomplete="email"
                >
              </div>

              <div class="form-group">
                <label for="signup-modal-password" class="form-label">
                  Password <span class="required">*</span>
                </label>
                <div class="password-toggle">
                  <input
                    type="password"
                    id="signup-modal-password"
                    class="form-input"
                    placeholder="At least 6 characters"
                    required
                    autocomplete="new-password"
                  >
                  <button type="button" class="password-toggle-btn" id="signup-toggle-password">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="signup-modal-confirm-password" class="form-label">
                  Confirm Password <span class="required">*</span>
                </label>
                <div class="password-toggle">
                  <input
                    type="password"
                    id="signup-modal-confirm-password"
                    class="form-input"
                    placeholder="Re-enter your password"
                    required
                    autocomplete="new-password"
                  >
                  <button type="button" class="password-toggle-btn" id="signup-toggle-confirm-password">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <button type="submit" class="auth-submit" id="signup-modal-submit">
                Create Account
              </button>
            </form>

            <div class="auth-divider">or</div>

            <p class="text-center text-sm text-gray-600">
              Already have an account? 
              <button id="switch-to-login" class="auth-link">Login here</button>
            </p>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', loginModalHTML);
    document.body.insertAdjacentHTML('beforeend', signupModalHTML);

    this.loginModal = document.getElementById('login-modal');
    this.signupModal = document.getElementById('signup-modal');
  }

  attachEventListeners() {
    // Open modal buttons
    const loginBtn = document.getElementById('login-modal-btn');
    const signupBtn = document.getElementById('signup-modal-btn');

    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.openLogin());
    }

    if (signupBtn) {
      signupBtn.addEventListener('click', () => this.openSignup());
    }

    // Close buttons
    document.getElementById('login-modal-close').addEventListener('click', () => this.closeLogin());
    document.getElementById('signup-modal-close').addEventListener('click', () => this.closeSignup());

    // Switch between modals
    document.getElementById('switch-to-signup').addEventListener('click', () => {
      this.closeLogin();
      this.openSignup();
    });

    document.getElementById('switch-to-login').addEventListener('click', () => {
      this.closeSignup();
      this.openLogin();
    });

    // Close on overlay click
    this.loginModal.addEventListener('click', (e) => {
      if (e.target === this.loginModal) this.closeLogin();
    });

    this.signupModal.addEventListener('click', (e) => {
      if (e.target === this.signupModal) this.closeSignup();
    });

    // Password toggles
    this.setupPasswordToggle('login-toggle-password', 'login-modal-password');
    this.setupPasswordToggle('signup-toggle-password', 'signup-modal-password');
    this.setupPasswordToggle('signup-toggle-confirm-password', 'signup-modal-confirm-password');

    // Form submissions
    document.getElementById('login-modal-form').addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('signup-modal-form').addEventListener('submit', (e) => this.handleSignup(e));
  }

  setupPasswordToggle(buttonId, inputId) {
    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);

    button.addEventListener('click', () => {
      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;

      button.innerHTML = type === 'password'
        ? `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>`
        : `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>`;
    });
  }

  openLogin() {
    this.loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLogin() {
    this.loginModal.classList.remove('active');
    document.body.style.overflow = '';
    this.clearLoginForm();
  }

  openSignup() {
    this.signupModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeSignup() {
    this.signupModal.classList.remove('active');
    document.body.style.overflow = '';
    this.clearSignupForm();
  }

  clearLoginForm() {
    document.getElementById('login-modal-form').reset();
    document.getElementById('login-alert').style.display = 'none';
  }

  clearSignupForm() {
    document.getElementById('signup-modal-form').reset();
    document.getElementById('signup-alert').style.display = 'none';
  }

  showAlert(elementId, message, type) {
    const alertDiv = document.getElementById(elementId);
    alertDiv.className = `auth-alert ${type}`;
    alertDiv.innerHTML = `
      <span class="auth-alert-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span>${message}</span>
    `;
    alertDiv.style.display = 'flex';
  }

  handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-modal-email').value.trim();
    const password = document.getElementById('login-modal-password').value;
    const submitBtn = document.getElementById('login-modal-submit');

    if (!email || !password) {
      this.showAlert('login-alert', 'Please fill in all fields', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    setTimeout(() => {
      const result = window.authManager.login(email, password);

      if (result.success) {
        this.showAlert('login-alert', result.message, 'success');
        setTimeout(() => {
          this.closeLogin();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Login';
        }, 1000);
      } else {
        this.showAlert('login-alert', result.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      }
    }, 500);
  }

  handleSignup(e) {
    e.preventDefault();

    const fullName = document.getElementById('signup-modal-name').value.trim();
    const email = document.getElementById('signup-modal-email').value.trim();
    const password = document.getElementById('signup-modal-password').value;
    const confirmPassword = document.getElementById('signup-modal-confirm-password').value;
    const submitBtn = document.getElementById('signup-modal-submit');

    if (!fullName || !email || !password || !confirmPassword) {
      this.showAlert('signup-alert', 'Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      this.showAlert('signup-alert', 'Passwords do not match', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';

    setTimeout(() => {
      const result = window.authManager.signup({
        fullName,
        email,
        password
      });

      if (result.success) {
        this.showAlert('signup-alert', result.message, 'success');
        setTimeout(() => {
          this.closeSignup();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Create Account';
        }, 1000);
      } else {
        this.showAlert('signup-alert', result.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    }, 500);
  }
}

// Initialize auth modal
document.addEventListener('DOMContentLoaded', () => {
  window.authModal = new AuthModal();
});
