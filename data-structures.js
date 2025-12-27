// ============================================
// DATA STRUCTURES & STORAGE MANAGEMENT
// ============================================

const StorageManager = {
    // Cart Management
    getCart: () => {
        const cart = localStorage.getItem('techub_cart');
        return cart ? JSON.parse(cart) : [];
    },

    saveCart: (cart) => {
        localStorage.setItem('techub_cart', JSON.stringify(cart));
    },

    addToCart: (product) => {
        const cart = StorageManager.getCart();
        const existingIndex = cart.findIndex(
            item => item.id === product.id &&
                item.color === product.color &&
                item.size === product.size
        );

        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                color: product.color,
                size: product.size || null,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }

        StorageManager.saveCart(cart);
        return cart;
    },

    removeFromCart: (index) => {
        const cart = StorageManager.getCart();
        cart.splice(index, 1);
        StorageManager.saveCart(cart);
        return cart;
    },

    updateCartQuantity: (index, quantity) => {
        const cart = StorageManager.getCart();
        if (quantity <= 0) {
            return StorageManager.removeFromCart(index);
        }
        cart[index].quantity = quantity;
        StorageManager.saveCart(cart);
        return cart;
    },

    clearCart: () => {
        localStorage.removeItem('techub_cart');
    },

    // Favorites Management (per user)
    getFavorites: () => {
        const currentUser = localStorage.getItem('techub_current_user');
        if (!currentUser) return [];

        const user = JSON.parse(currentUser);
        const favorites = localStorage.getItem(`techub_favorites_${user.id}`);
        return favorites ? JSON.parse(favorites) : [];
    },

    saveFavorites: (favorites) => {
        const currentUser = localStorage.getItem('techub_current_user');
        if (!currentUser) return;

        const user = JSON.parse(currentUser);
        localStorage.setItem(`techub_favorites_${user.id}`, JSON.stringify(favorites));
    },

    toggleFavorite: (product) => {
        const favorites = StorageManager.getFavorites();
        const existingIndex = favorites.findIndex(item => item.id === product.id);

        if (existingIndex > -1) {
            favorites.splice(existingIndex, 1);
        } else {
            favorites.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                addedAt: new Date().toISOString()
            });
        }

        StorageManager.saveFavorites(favorites);
        return favorites;
    },

    isFavorite: (productId) => {
        const favorites = StorageManager.getFavorites();
        return favorites.some(item => item.id === productId);
    },

    // Orders Management (per user)
    getOrders: () => {
        const currentUser = localStorage.getItem('techub_current_user');
        if (!currentUser) return [];

        const user = JSON.parse(currentUser);
        const orders = localStorage.getItem(`techub_orders_${user.id}`);
        return orders ? JSON.parse(orders) : [];
    },

    saveOrders: (orders) => {
        const currentUser = localStorage.getItem('techub_current_user');
        if (!currentUser) return;

        const user = JSON.parse(currentUser);
        localStorage.setItem(`techub_orders_${user.id}`, JSON.stringify(orders));
    },

    createOrder: (cartItems, total) => {
        const orders = StorageManager.getOrders();
        const newOrder = {
            id: 'ORD-' + Date.now(),
            items: cartItems,
            total: total,
            status: 'pending',
            orderDate: new Date().toISOString(),
            statusHistory: [
                {
                    status: 'pending',
                    date: new Date().toISOString(),
                    message: 'Order placed successfully'
                }
            ]
        };

        orders.unshift(newOrder);
        StorageManager.saveOrders(orders);
        StorageManager.clearCart();
        return newOrder;
    },

    updateOrderStatus: (orderId, newStatus) => {
        const orders = StorageManager.getOrders();
        const orderIndex = orders.findIndex(order => order.id === orderId);

        if (orderIndex > -1) {
            orders[orderIndex].status = newStatus;
            orders[orderIndex].statusHistory.push({
                status: newStatus,
                date: new Date().toISOString(),
                message: StorageManager.getStatusMessage(newStatus)
            });
            StorageManager.saveOrders(orders);
        }

        return orders;
    },

    cancelOrder: (orderId) => {
        const orders = StorageManager.getOrders();
        const order = orders.find(order => order.id === orderId);

        if (order && (order.status === 'pending' || order.status === 'packed')) {
            return StorageManager.updateOrderStatus(orderId, 'cancelled');
        }

        return null;
    },

    getStatusMessage: (status) => {
        const messages = {
            'pending': 'Order placed successfully',
            'packed': 'Order has been packed',
            'shipped': 'Order is on the way',
            'delivered': 'Order delivered successfully',
            'cancelled': 'Order has been cancelled'
        };
        return messages[status] || 'Status updated';
    }
};

// Product Variants Configuration
const ProductVariants = {
    'iPhone 14 Pro Max': {
        colors: [
            { name: 'Midnight Black', hex: '#1a1a1a', image: 'Products/ip14midnightblack.png' },
            { name: 'Silver', hex: '#c0c0c0', image: 'Products/ip14 silver.png' },
            { name: 'Deep Purple', hex: '#3a243b', image: 'Products/ip14deeppurple.png' },
            { name: 'Gold', hex: '#d4c9b1', image: 'Products/ip14gold.png' }
        ],
        sizes: ['128GB', '256GB', '512GB'],
        basePrices: {
            '128GB': 57000,
            '256GB': 63000,
            '512GB': 69000
        }
    },
    'Samsung Galaxy S23 Ultra': {
        colors: [
            { name: 'Phantom Black', hex: '#0F0F0F', image: 'Products/SamsungGalaxyS23Ultra Phantom Black.png' },
            { name: 'Green', hex: '#27423a', image: 'Products/SamsungGalaxyS23Ultra green.png' },
            { name: 'Lavander', hex: '#E6E6FA', image: 'Products/SamsungGalaxyS23Ultra Lavander.png' },
            { name: 'Cream', hex: '#FFFDD0', image: 'Products/SamsungGalaxyS23Ultra Creame.png' }
        ],
        sizes: ['256GB', '512GB', '1TB'],
        basePrices: {
            '256GB': 50000,
            '512GB': 76000,
            '1TB': 114000
        }
    },
    'Google Pixel 10 Pro': {
        colors: [
            { name: 'Obsidian', hex: '#0a0e27', image: 'Products/Google Pixel 10 Pro Obsidian.png' },
            { name: 'Porcelain', hex: '#f5f5f5', image: 'Products/Google Pixel 10 Pro Porcelain.png' },
            { name: 'Moonstone', hex: '#5481a8', image: 'Products/Google Pixel 10 Pro Moonstone.png' },
            { name: 'Jade', hex: '#c9dbb8', image: 'Products/Google Pixel 10 Pro Jade.png' }
        ],
        sizes: ['128GB', '256GB', '512GB'],
        basePrices: {
            '128GB': 44000,
            '256GB': 50000,
            '512GB': 57000
        }
    },
    'iPhone 17 Promax': {
        colors: [
            { name: 'Cosmic Orange', hex: '#F77314', image: 'Products/ip17 promax Cosmicorange.png' },
            { name: 'Deep Blue', hex: '#2B3145', image: 'Products/ip17 promax Deepblue.png' },
            { name: 'Silver', hex: '#F5F5F5', image: 'Products/ip17 promax silver.png' }
        ],
        sizes: ['256GB', '512GB', '1TB', '2TB'],
        basePrices: {
            '256GB': 86990,
            '512GB': 101990,
            '1TB': 116990,
            '2TB': 146990
        }
    },
    'Galaxy Z Flip7': {
        colors: [
            { name: 'Blue Shadow', hex: '#97A7E4', image: 'Products/Galaxy Z Flip7 Blueshadow.png' },
            { name: 'Jet Black', hex: '#232526', image: 'Products/Galaxy Z Flip7 Jetblack.png' },
            { name: 'Coral Red', hex: '#F9B492', image: 'Products/Galaxy Z Flip7 Coral Red.png' },
            { name: 'Mint', hex: '#A0C9AC', image: 'Products/Galaxy Z Flip7 Mint.png' }
        ],
        sizes: ['256GB', '512GB'],
        basePrices: {
            '256GB': 60000,
            '512GB': 67000
        }
    },
    'Pixel 10 Pro Fold': {
        colors: [
            { name: 'Moonstone', hex: '#a4b5d6', image: 'Products/Pixel 10 Pro Fold Moonstone.png' },
            { name: 'Jade', hex: '#cfddc3', image: 'Products/Pixel 10 Pro Fold Jade.png' }
        ],
        sizes: ['512GB', '1TB'],
        basePrices: {
            '512GB': 95000,
            '1TB': 108000
        }
    },
    'iPhone 16': {
        colors: [
            { name: 'Ultramarine', hex: '#758dd9', image: 'Products/iPhone16 Ultramarine.png' },
            { name: 'Black', hex: '#302e47', image: 'Products/iPhone16 Black.png' },
            { name: 'White', hex: '#f0f2f2', image: 'Products/iPhone16 White.png' },
            { name: 'Pink', hex: '#e698c7', image: 'Products/iPhone16 Pink.png' },
            { name: 'Teal', hex: '#4bbdb7', image: 'Products/iPhone16 Teal.png' }
        ],
        sizes: ['128GB', '256GB'],
        basePrices: {
            '128GB': 57990,
            '256GB': 64990
        }
    },
    'Galaxy S25 Ultra': {
        colors: [
            { name: 'Titanium Silverblue', hex: '#b6c9ea', image: 'Products/Galaxy S25 Ultra Titanium Silverblue.png' },
            { name: 'Titanium Gray', hex: '#dbd6d2', image: 'Products/Galaxy S25 Ultra Titanium Gray.png' },
            { name: 'Titanium Black', hex: '#38383c', image: 'Products/Galaxy S25 Ultra Titanium Black.png' },
            { name: 'Titanium Whitesilver', hex: '#ececee', image: 'Products/Galaxy S25 Ultra Titanium Whitesilver.png' }
        ],
        sizes: ['256GB', '512GB'],

        basePrices: {
            '256GB': 85000,
            '512GB': 94000
        }
    },
    'ROG Zephyrus G14': {
        colors: [
            { name: 'Eclipse Gray ', hex: '#737272', image: 'Products/ROG Zephyrus G14 Eclipse Gray.png' },
            { name: 'Moonlight White', hex: '#ececec', image: 'Products/ROG Zephyrus G14 Moonlight White.png' }
        ],
        sizes: ['32GB RAM', '64GB RAM'],
        basePrices: {
            '32GB RAM': 159000,
            '64GB RAM': 179000
        }
    },
    'MacBook Pro 16': {
        colors: [
            { name: 'Space Gray', hex: '#3c3c3c', image: 'Products/MacBook Pro 16 Space Gray.png' },
            { name: 'Silver', hex: '#f0f0f0', image: 'Products/MacBook Pro 16 Silver.png' }
        ],
        sizes: ['512GB SSD', '1TB SSD', '2TB SSD'],
        basePrices: {
            '512GB SSD': 99990,
            '1TB SSD': 112990,
            '2TB SSD': 138990
        }
    },
    'Galaxy Buds3 Pro': {
        colors: [
            { name: 'White', hex: '#f2f3f5', image: 'Products/Galaxy Buds3 Pro White.png' },
            { name: 'Silver', hex: '#7d7e83', image: 'Products/Galaxy Buds3 Pro Silver.png' }
        ],
        sizes: null
    },
    'AirPods Max': {
        colors: [
            { name: 'Blue', hex: '#58788c', image: 'Products/AirPods Max Blue.png' },
            { name: 'Purple', hex: '#796c8a', image: 'Products/AirPods Max Purple.png' },
            { name: 'Midnight', hex: '#213348', image: 'Products/AirPods Max Midnight.png' },
            { name: 'Starlight', hex: '#eae1d7', image: 'Products/AirPods Max Starlight.png' },
            { name: 'Orange', hex: '#f5bda3', image: 'Products/AirPods Max Orange.png' }
        ],
        sizes: null
    },
    'Apple Watch SE 3': {
        colors: [
            { name: 'Starlight', hex: '#c3c18c', image: 'Products/Apple Watch SE 3 Starlight.png' },
            { name: 'Midnight', hex: '#4b5762', image: 'Products/Apple Watch SE 3 Midnight.png' }
        ],
        sizes: null
    },
    'Galaxy Tab S11 Ultra': {
        colors: [
            { name: 'Gray', hex: '#5d6b88', image: 'Products/Galaxy Tab S11 Ultra.png' }
        ],
        sizes: ['256GB', '512GB'],
        basePrices: {
            '256GB': 86000,
            '512GB': 92000,
        }
    },
    'iPad Air 11': {
        colors: [
            { name: 'Silver', hex: '#d7d7d7', image: 'Products/ipad silver.png' },
            { name: 'Yellow', hex: '#dec859', image: 'Products/ipad yellow.png' },
            { name: 'Blue', hex: '#7391b4', image: 'Products/ipad blue.png' },
            { name: 'Pink', hex: '#fd8698', image: 'Products/ipad pink.png' }
        ],
        sizes: ['128GB', '256GB', '512GB'],
        basePrices: {
            '128GB': 24990,
            '256GB': 31990,
            '512GB': 45990
        }
    },
    'Galaxy SmartTag2 ': {
        colors: [
            { name: 'Black', hex: '#000000', image: 'Products/Galaxy SmartTag2 Black.png' },
            { name: 'White', hex: '#ffffff', image: 'Products/Galaxy SmartTag2 White.png' }
        ],
        sizes: null
    },
    'Galaxy Fit3': {
        colors: [
            { name: 'Silver', hex: '#dfdfdf', image: 'Products/Galaxy fit3 Silver.png' },
            { name: 'Gray', hex: '#313235', image: 'Products/Galaxy fit3 Gray.png' },
            { name: 'Pink Gold', hex: '#f2d9d0', image: 'Products/Galaxy fit3 pinkgold.png' }
        ],
        sizes: null
    },
    'Magic Mouse - White Multi-Touch Surface': {
        colors: [
            { name: 'Black', hex: '#000000', image: 'Products/Magic Mouse - White Multi-Touch Surface Black.png' },
            { name: 'White', hex: '#c0c0c0', image: 'Products/Magic Mouse - White Multi-Touch Surface White.png' }
        ],
        sizes: null
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageManager, ProductVariants };
}
