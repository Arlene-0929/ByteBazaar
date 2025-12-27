// ============================================
// FAVORITES MANAGEMENT
// ============================================

class FavoritesManager {
    constructor() {
        this.favorites = StorageManager.getFavorites();
        this.init();
    }

    init() {
        this.updateFavoriteButtons();
        this.attachEventListeners();
        this.updateFavoritesPage();
    }

    attachEventListeners() {
        // Add event listeners to all favorite buttons
        setTimeout(() => {
            document.querySelectorAll('.favorite-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Check if user is logged in
                    if (!window.authManager || !window.authManager.isLoggedIn()) {
                        alert('Please login to add favorites');
                        if (window.authModal) {
                            window.authModal.openLogin();
                        }
                        return;
                    }

                    const productId = btn.dataset.productId;
                    const productName = btn.dataset.productName;
                    const productPrice = btn.dataset.productPrice;
                    const productImage = btn.dataset.productImage;

                    this.toggleFavorite({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage
                    });
                });
            });
        }, 100);
    }

    toggleFavorite(product) {
        if (!window.authManager || !window.authManager.isLoggedIn()) {
            return;
        }

        this.favorites = StorageManager.toggleFavorite(product);
        this.updateFavoriteButtons();
        this.updateFavoritesPage();
    }

    updateFavoriteButtons() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const productId = btn.dataset.productId;
            const isFavorite = StorageManager.isFavorite(productId);

            if (isFavorite) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    updateFavoritesPage() {
        const favoritesContainer = document.getElementById('favorites-container');
        if (!favoritesContainer) return;

        this.favorites = StorageManager.getFavorites();

        if (this.favorites.length === 0) {
            favoritesContainer.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <h2 class="empty-state-title">No Favorites Yet</h2>
          <p class="empty-state-description">Start adding products to your favorites to see them here</p>
          <a href="index.html#products" class="empty-state-action">Browse Products</a>
        </div>
      `;
            return;
        }

        favoritesContainer.innerHTML = `
      <div class="favorites-grid">
        ${this.favorites.map(item => `
          <div class="favorite-card">
            <div class="favorite-image-container">
              <img src="${item.image}" alt="${item.name}" class="favorite-image">
              <button class="remove-favorite-btn" data-product-id="${item.id}">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="favorite-details">
              <h3 class="favorite-name">${item.name}</h3>
              <p class="favorite-price">$${item.price}</p>
              <button class="add-to-cart-from-favorite" 
                      data-product-id="${item.id}"
                      data-product-name="${item.name}"
                      data-product-price="${item.price}"
                      data-product-image="${item.image}">
                Add to Cart
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

        // Attach event listeners for remove buttons
        favoritesContainer.querySelectorAll('.remove-favorite-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                const product = this.favorites.find(f => f.id === productId);
                if (product) {
                    this.toggleFavorite(product);
                }
            });
        });

        // Attach event listeners for add to cart buttons
        favoritesContainer.querySelectorAll('.add-to-cart-from-favorite').forEach(btn => {
            btn.addEventListener('click', () => {
                const product = {
                    id: btn.dataset.productId,
                    name: btn.dataset.productName,
                    price: btn.dataset.productPrice,
                    image: btn.dataset.productImage
                };
                if (window.variantModal) {
                    window.variantModal.open(product);
                }
            });
        });
    }
}

// Initialize favorites manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.favoritesManager = new FavoritesManager();
});
