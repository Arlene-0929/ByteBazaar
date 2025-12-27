// ============================================
// MY ACCOUNT PANEL COMPONENT
// ============================================

class AccountPanel {
  constructor() {
    this.panel = null;
    this.currentUser = null;
    this.init();
  }

  init() {
    this.createPanel();
    this.attachEventListeners();
  }

  createPanel() {
    const panelHTML = `
      <div id="account-panel" class="account-panel-overlay">
        <div class="account-panel-content">
          <div class="account-panel-header">
            <h2 class="account-panel-title">My Account</h2>
            <button class="account-panel-close" id="account-panel-close" aria-label="Close">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="account-panel-body">
            <!-- Profile Section -->
            <div class="account-section">
              <h3 class="account-section-title">Profile Information</h3>
              
              <div class="profile-picture-section">
                <div class="profile-picture-container">
                  <img id="profile-picture" src="" alt="Profile" class="profile-picture">
                  <div class="profile-picture-placeholder" id="profile-placeholder">
                    <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
                <div class="profile-picture-actions">
                  <input type="file" id="profile-picture-input" accept="image/*" style="display: none;">
                  <button id="upload-picture-btn" class="btn-secondary btn-small">Upload Photo</button>
                  <button id="remove-picture-btn" class="btn-secondary btn-small" style="display: none;">Remove</button>
                </div>
              </div>

              <div class="form-group">
                <label for="account-fullname" class="form-label">Full Name</label>
                <input
                  type="text"
                  id="account-fullname"
                  class="form-input"
                  placeholder="Your full name"
                >
              </div>

              <div class="form-group">
                <label for="account-email" class="form-label">Email Address</label>
                <input
                  type="email"
                  id="account-email"
                  class="form-input"
                  placeholder="your@email.com"
                  readonly
                  disabled
                >
              </div>
            </div>

            <!-- Shipping Address Section -->
            <div class="account-section">
              <h3 class="account-section-title">Shipping Address</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="account-address-name" class="form-label">Name</label>
                  <input
                    type="text"
                    id="account-address-name"
                    class="form-input"
                    placeholder="Recipient name"
                  >
                </div>

                <div class="form-group">
                  <label for="account-mobile" class="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    id="account-mobile"
                    class="form-input"
                    placeholder="09XX-XXX-XXXX"
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="account-street" class="form-label">House/Unit/Street</label>
                <input
                  type="text"
                  id="account-street"
                  class="form-input"
                  placeholder="123 Main Street, Unit 4B"
                >
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="account-province" class="form-label">Province</label>
                  <input
                    type="text"
                    id="account-province"
                    class="form-input"
                    placeholder="Province Name"
                  >
                </div>

                <div class="form-group">
                  <label for="account-municipality" class="form-label">Municipality</label>
                  <input
                    type="text"
                    id="account-municipality"
                    class="form-input"
                    placeholder="Municipality Name"
                  >
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="account-barangay" class="form-label">Barangay</label>
                  <input
                    type="text"
                    id="account-barangay"
                    class="form-input"
                    placeholder="Barangay Name"
                  >
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="account-postal" class="form-label">Postal Code</label>
                  <input
                    type="text"
                    id="account-postal"
                    class="form-input"
                    placeholder="1234"
                    maxlength="4"
                  >
                </div>
              </div>

              <label class="checkbox-group">
                <input type="checkbox" id="account-default-address">
                <div class="checkbox-label">
                  Set as Default Address
                  <div class="checkbox-description">Use this address for future orders</div>
                </div>
              </label>
            </div>
          </div>

          <div class="account-panel-footer">
            <button id="cancel-account-changes" class="btn-secondary">Cancel</button>
            <button id="save-account-changes" class="btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', panelHTML);
    this.panel = document.getElementById('account-panel');
  }

  attachEventListeners() {
    // Close button
    document.getElementById('account-panel-close').addEventListener('click', () => this.close());

    // Cancel button
    document.getElementById('cancel-account-changes').addEventListener('click', () => this.close());

    // Save button
    document.getElementById('save-account-changes').addEventListener('click', () => this.saveChanges());

    // Profile picture upload
    document.getElementById('upload-picture-btn').addEventListener('click', () => {
      document.getElementById('profile-picture-input').click();
    });

    document.getElementById('profile-picture-input').addEventListener('change', (e) => {
      this.handleProfilePictureUpload(e);
    });

    document.getElementById('remove-picture-btn').addEventListener('click', () => {
      this.removeProfilePicture();
    });

    // Close on overlay click
    this.panel.addEventListener('click', (e) => {
      if (e.target === this.panel) {
        this.close();
      }
    });
  }

  open() {
    if (!window.authManager || !window.authManager.isLoggedIn()) {
      return;
    }

    this.currentUser = window.authManager.getCurrentUser();
    this.loadUserData();
    this.panel.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.panel.classList.remove('active');
    document.body.style.overflow = '';
  }

  loadUserData() {
    if (!this.currentUser) return;

    // Load profile picture
    if (this.currentUser.profilePicture) {
      document.getElementById('profile-picture').src = this.currentUser.profilePicture;
      document.getElementById('profile-picture').style.display = 'block';
      document.getElementById('profile-placeholder').style.display = 'none';
      document.getElementById('remove-picture-btn').style.display = 'inline-block';
    } else {
      document.getElementById('profile-picture').style.display = 'none';
      document.getElementById('profile-placeholder').style.display = 'flex';
      document.getElementById('remove-picture-btn').style.display = 'none';
    }

    // Load profile info
    document.getElementById('account-fullname').value = this.currentUser.fullName || '';
    document.getElementById('account-email').value = this.currentUser.email || '';

    // Load default address
    const defaultAddress = window.authManager.getDefaultAddress();
    if (defaultAddress) {
      document.getElementById('account-address-name').value = defaultAddress.name || '';
      document.getElementById('account-mobile').value = defaultAddress.mobile || '';
      document.getElementById('account-street').value = defaultAddress.street || '';
      document.getElementById('account-province').value = defaultAddress.province || '';
      document.getElementById('account-municipality').value = defaultAddress.municipality || '';
      document.getElementById('account-barangay').value = defaultAddress.barangay || '';
      document.getElementById('account-postal').value = defaultAddress.postalCode || '';
      document.getElementById('account-default-address').checked = true;
    }
  }

  handleProfilePictureUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      document.getElementById('profile-picture').src = imageData;
      document.getElementById('profile-picture').style.display = 'block';
      document.getElementById('profile-placeholder').style.display = 'none';
      document.getElementById('remove-picture-btn').style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
  }

  removeProfilePicture() {
    document.getElementById('profile-picture').src = '';
    document.getElementById('profile-picture').style.display = 'none';
    document.getElementById('profile-placeholder').style.display = 'flex';
    document.getElementById('remove-picture-btn').style.display = 'none';
    document.getElementById('profile-picture-input').value = '';
  }

  saveChanges() {
    if (!window.authManager) return;

    // Get profile data
    const fullName = document.getElementById('account-fullname').value.trim();
    const profilePicture = document.getElementById('profile-picture').src;

    // Validate
    if (!fullName || fullName.length < 2) {
      alert('Please enter a valid full name');
      return;
    }

    // Get address data
    const addressName = document.getElementById('account-address-name').value.trim();
    const mobile = document.getElementById('account-mobile').value.trim();
    const street = document.getElementById('account-street').value.trim();
    const province = document.getElementById('account-province').value.trim();
    const municipality = document.getElementById('account-municipality').value.trim();
    const barangay = document.getElementById('account-barangay').value.trim();
    const postalCode = document.getElementById('account-postal').value.trim();
    const isDefault = document.getElementById('account-default-address').checked;

    // Update user profile
    window.authManager.updateUser({
      fullName,
      profilePicture: profilePicture.startsWith('data:') ? profilePicture : null
    });

    // Update or add address if any field is filled
    if (addressName || mobile || street || barangay || province || postalCode) {
      const defaultAddress = window.authManager.getDefaultAddress();

      const addressData = {
        name: addressName,
        mobile,
        street,
        province,
        municipality,
        barangay,
        postalCode,
        isDefault
      };

      if (defaultAddress) {
        window.authManager.updateAddress(defaultAddress.id, addressData);
      } else {
        window.authManager.addAddress(addressData);
      }
    }

    // Show success message
    alert('Changes saved successfully!');
    this.close();
  }
}

// Initialize account panel
document.addEventListener('DOMContentLoaded', () => {
  window.accountPanel = new AccountPanel();
});
