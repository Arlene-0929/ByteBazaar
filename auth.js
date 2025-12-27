// ============================================
// AUTHENTICATION & USER MANAGEMENT
// ============================================

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('techub_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            // Delay UI update to ensure DOM is ready
            setTimeout(() => {
                this.updateUIForLoggedInUser();
            }, 100);
        } else {
            setTimeout(() => {
                this.updateUIForLoggedOutUser();
            }, 100);
        }
    }

    // Get all users from localStorage
    getAllUsers() {
        const users = localStorage.getItem('techub_users');
        return users ? JSON.parse(users) : [];
    }

    // Save users to localStorage
    saveUsers(users) {
        localStorage.setItem('techub_users', JSON.stringify(users));
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    isValidPassword(password) {
        // At least 6 characters
        return password.length >= 6;
    }

    // Check if email already exists
    emailExists(email) {
        const users = this.getAllUsers();
        return users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Sign up new user
    signup(userData) {
        const { fullName, email, password } = userData;

        // Validation
        if (!fullName || fullName.trim().length < 2) {
            return { success: false, message: 'Full name must be at least 2 characters' };
        }

        if (!this.isValidEmail(email)) {
            return { success: false, message: 'Please enter a valid email address' };
        }

        if (this.emailExists(email)) {
            return { success: false, message: 'Email already registered' };
        }

        if (!this.isValidPassword(password)) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        // Create new user
        const newUser = {
            id: 'USER-' + Date.now(),
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            password: password, // In production, this should be hashed
            createdAt: new Date().toISOString(),
            addresses: [],
            defaultAddressId: null
        };

        // Save user
        const users = this.getAllUsers();
        users.push(newUser);
        this.saveUsers(users);

        // Auto login after signup
        this.login(email, password);

        return { success: true, message: 'Account created successfully!' };
    }

    // Login user
    login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Set current user
        this.currentUser = user;
        localStorage.setItem('techub_current_user', JSON.stringify(user));
        this.updateUIForLoggedInUser();

        return { success: true, message: 'Login successful!', user };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('techub_current_user');
        this.updateUIForLoggedOutUser();
        window.location.href = 'index.html';
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Update user data
    updateUser(updatedData) {
        if (!this.currentUser) return false;

        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);

        if (userIndex > -1) {
            users[userIndex] = { ...users[userIndex], ...updatedData };
            this.saveUsers(users);

            // Update current user
            this.currentUser = users[userIndex];
            localStorage.setItem('techub_current_user', JSON.stringify(this.currentUser));

            return true;
        }

        return false;
    }

    // Add address to user
    addAddress(addressData) {
        if (!this.currentUser) return false;

        const newAddress = {
            id: 'ADDR-' + Date.now(),
            ...addressData,
            createdAt: new Date().toISOString()
        };

        const addresses = [...(this.currentUser.addresses || []), newAddress];

        // If this is set as default or it's the first address
        let defaultAddressId = this.currentUser.defaultAddressId;
        if (addressData.isDefault || addresses.length === 1) {
            defaultAddressId = newAddress.id;
        }

        this.updateUser({ addresses, defaultAddressId });
        return newAddress;
    }

    // Update address
    updateAddress(addressId, addressData) {
        if (!this.currentUser) return false;

        const addresses = this.currentUser.addresses.map(addr =>
            addr.id === addressId ? { ...addr, ...addressData } : addr
        );

        let defaultAddressId = this.currentUser.defaultAddressId;
        if (addressData.isDefault) {
            defaultAddressId = addressId;
        }

        this.updateUser({ addresses, defaultAddressId });
        return true;
    }

    // Get default address
    getDefaultAddress() {
        if (!this.currentUser || !this.currentUser.defaultAddressId) return null;

        return this.currentUser.addresses.find(
            addr => addr.id === this.currentUser.defaultAddressId
        );
    }

    // Update UI for logged in user
    updateUIForLoggedInUser() {
        // Hide auth buttons
        const authButtons = document.getElementById('auth-buttons');
        if (authButtons) {
            authButtons.classList.add('hidden');
            authButtons.classList.remove('flex');
        }

        // Show user dropdown
        const userDropdown = document.getElementById('user-dropdown-container');
        if (userDropdown) {
            userDropdown.classList.remove('hidden');
        }

        // Populate user dropdown menu
        const userDropdownMenu = document.getElementById('user-dropdown-menu');
        if (userDropdownMenu && this.currentUser) {
            userDropdownMenu.innerHTML = `
        <div class="account-dropdown">
          <div class="account-info">
            <p class="account-name">${this.currentUser.fullName}</p>
            <p class="account-email">${this.currentUser.email}</p>
          </div>
          <button id="my-account-btn" class="account-menu-item">My Account</button>
          <a href="orders.html" class="account-menu-item">My Orders</a>
          <a href="favorites.html" class="account-menu-item">Favorites</a>
          <button id="logout-btn" class="account-menu-item logout-btn">Logout</button>
        </div>
      `;

            // Attach handlers
            const myAccountBtn = document.getElementById('my-account-btn');
            if (myAccountBtn) {
                myAccountBtn.addEventListener('click', () => {
                    if (window.accountPanel) {
                        window.accountPanel.open();
                    }
                });
            }

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => this.logout());
            }
        }
    }

    // Update UI for logged out user
    updateUIForLoggedOutUser() {
        // Show auth buttons
        const authButtons = document.getElementById('auth-buttons');
        if (authButtons) {
            authButtons.classList.remove('hidden');
            authButtons.classList.add('flex');
        }

        // Hide user dropdown
        const userDropdown = document.getElementById('user-dropdown-container');
        if (userDropdown) {
            userDropdown.classList.add('hidden');
        }
    }

    // Require authentication
    requireAuth(redirectUrl = 'login.html') {
        if (!this.isLoggedIn()) {
            // Save intended destination
            localStorage.setItem('techub_redirect_after_login', window.location.href);
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    // Redirect after login
    redirectAfterLogin() {
        const redirectUrl = localStorage.getItem('techub_redirect_after_login');
        localStorage.removeItem('techub_redirect_after_login');

        if (redirectUrl) {
            window.location.href = redirectUrl;
        } else {
            window.location.href = 'index.html';
        }
    }
}

// Initialize auth manager
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
