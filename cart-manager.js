// ============================================
// ENHANCED CART MANAGER
// ============================================

class CartManager {
    constructor() {
        this.cart = StorageManager.getCart();
        this.init();
    }

    init() {
        this.updateCart();
        this.attachEventListeners();
    }

    attachEventListeners() {
        const cartToggle = document.getElementById('cart-toggle');
        const cartClose = document.getElementById('cart-close');
        const cartOverlay = document.getElementById('cart-overlay');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.openCart());
        }

        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }
    }

    openCart() {
        const cartPanel = document.getElementById('cart-panel');
        const cartOverlay = document.getElementById('cart-overlay');

        cartPanel.classList.remove('translate-x-full');
        cartOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        const cartPanel = document.getElementById('cart-panel');
        const cartOverlay = document.getElementById('cart-overlay');

        cartPanel.classList.add('translate-x-full');
        cartOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }

    updateCart() {
        this.cart = StorageManager.getCart();
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartCount = document.getElementById('cart-count');

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
            cartTotal.textContent = '$0.00';
            cartCount.textContent = '0';
            return;
        }

        let total = 0;
        cartItems.innerHTML = this.cart.map((item, index) => {
            const itemTotal = parseFloat(item.price) * item.quantity;
            total += itemTotal;

            return `
        <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg bg-gray-200">
          <div class="flex-1">
            <h3 class="font-heading font-semibold text-charcoal mb-1">${item.name}</h3>
            <p class="text-sm text-gray-600 mb-1">
              ${item.color ? `Color: ${item.color}` : ''}
              ${item.size ? ` • Size: ${item.size}` : ''}
            </p>
            <p class="text-primary font-bold">$${item.price}</p>
            <div class="flex items-center gap-2 mt-2">
              <button class="decrease-qty text-charcoal hover:text-primary transition-colors duration-200 w-6 h-6 flex items-center justify-center border border-gray-300 rounded" data-index="${index}">-</button>
              <span class="text-charcoal font-semibold w-8 text-center">${item.quantity}</span>
              <button class="increase-qty text-charcoal hover:text-primary transition-colors duration-200 w-6 h-6 flex items-center justify-center border border-gray-300 rounded" data-index="${index}">+</button>
            </div>
          </div>
          <button class="remove-item text-gray-400 hover:text-primary transition-colors duration-200" data-index="${index}">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;
        }).join('');

        cartTotal.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);

        // Attach event listeners
        this.attachCartItemListeners();
    }

    attachCartItemListeners() {
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                const newQuantity = this.cart[index].quantity + 1;
                StorageManager.updateCartQuantity(index, newQuantity);
                this.updateCart();
            });
        });

        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                const newQuantity = this.cart[index].quantity - 1;
                StorageManager.updateCartQuantity(index, newQuantity);
                this.updateCart();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                StorageManager.removeFromCart(index);
                this.updateCart();
            });
        });
    }

    checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Check if user is logged in
        if (!window.authManager || !window.authManager.isLoggedIn()) {
            // Close cart first
            this.closeCart();

            // Show login modal
            if (window.authModal) {
                alert('Please login to continue with checkout');
                window.authModal.openLogin();
            } else {
                window.location.href = 'login.html';
            }
            return;
        }

        // Close cart and redirect to checkout
        this.closeCart();
        window.location.href = 'checkout.html';
    }
}

// Initialize cart manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});
