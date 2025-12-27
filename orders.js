// ============================================
// ORDERS MANAGEMENT
// ============================================

class OrdersManager {
    constructor() {
        this.orders = StorageManager.getOrders();
        this.init();
    }

    init() {
        this.updateOrdersPage();
    }

    createOrder(cartItems, total) {
        const order = StorageManager.createOrder(cartItems, total);
        this.orders = StorageManager.getOrders();
        return order;
    }

    cancelOrder(orderId) {
        const result = StorageManager.cancelOrder(orderId);
        if (result) {
            this.orders = result;
            this.updateOrdersPage();
            return true;
        }
        return false;
    }

    getStatusProgress(status) {
        const statuses = ['pending', 'packed', 'shipped', 'delivered'];
        const currentIndex = statuses.indexOf(status);
        return ((currentIndex + 1) / statuses.length) * 100;
    }

    canCancelOrder(status) {
        return status === 'pending' || status === 'packed';
    }

    renderOrderStatus(order) {
        const statuses = [
            { key: 'pending', label: 'Pending', icon: '📦' },
            { key: 'packed', label: 'Packed', icon: '📋' },
            { key: 'shipped', label: 'Shipped', icon: '🚚' },
            { key: 'delivered', label: 'Delivered', icon: '✓' }
        ];

        const currentStatusIndex = statuses.findIndex(s => s.key === order.status);
        const isCancelled = order.status === 'cancelled';

        return `
      <div class="order-status-tracker">
        <div class="status-steps">
          <div class="status-progress" style="width: ${isCancelled ? '0%' : this.getStatusProgress(order.status)}%"></div>
          ${statuses.map((status, index) => {
            const isActive = index === currentStatusIndex && !isCancelled;
            const isCompleted = index < currentStatusIndex && !isCancelled;
            const statusClass = isCancelled ? 'cancelled' : (isActive ? 'active' : (isCompleted ? 'completed' : ''));

            return `
              <div class="status-step ${statusClass}">
                <div class="status-icon">
                  ${isCancelled && index === 0 ? '✕' : status.icon}
                </div>
                <span class="status-label">${isCancelled && index === 0 ? 'Cancelled' : status.label}</span>
              </div>
            `;
        }).join('')}
        </div>
      </div>
    `;
    }

    updateOrdersPage() {
        const ordersContainer = document.getElementById('orders-container');
        if (!ordersContainer) return;

        this.orders = StorageManager.getOrders();

        if (this.orders.length === 0) {
            ordersContainer.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <h2 class="empty-state-title">No Orders Yet</h2>
          <p class="empty-state-description">You haven't placed any orders yet. Start shopping!</p>
          <a href="index.html#products" class="empty-state-action">Browse Products</a>
        </div>
      `;
            return;
        }

        ordersContainer.innerHTML = this.orders.map(order => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <div class="order-id">${order.id}</div>
            <div class="order-date">${new Date(order.orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</div>
          </div>
          <span class="order-status-badge ${order.status}">${order.status}</span>
        </div>

        ${this.renderOrderStatus(order)}

        <div class="order-items">
          ${order.items.map(item => `
            <div class="order-item">
              <img src="${item.image}" alt="${item.name}" class="order-item-image">
              <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-variant">
                  ${item.color ? `Color: ${item.color}` : ''}
                  ${item.size ? ` • Size: ${item.size}` : ''}
                  ${item.quantity > 1 ? ` • Qty: ${item.quantity}` : ''}
                </div>
              </div>
              <div class="order-item-price">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
            </div>
          `).join('')}
        </div>

        <div class="order-footer">
          <div class="order-total">Total: $${order.total.toFixed(2)}</div>
          <button 
            class="cancel-order-btn" 
            data-order-id="${order.id}"
            ${!this.canCancelOrder(order.status) ? 'disabled' : ''}>
            ${order.status === 'cancelled' ? 'Cancelled' : 'Cancel Order'}
          </button>
        </div>
      </div>
    `).join('');

        // Attach event listeners for cancel buttons
        ordersContainer.querySelectorAll('.cancel-order-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const orderId = btn.dataset.orderId;
                if (confirm('Are you sure you want to cancel this order?')) {
                    const success = this.cancelOrder(orderId);
                    if (success) {
                        alert('Order cancelled successfully');
                    } else {
                        alert('Unable to cancel this order');
                    }
                }
            });
        });
    }

    // Simulate order status progression (for demo purposes)
    simulateOrderProgress(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order || order.status === 'cancelled') return;

        const statusFlow = ['pending', 'packed', 'shipped', 'delivered'];
        const currentIndex = statusFlow.indexOf(order.status);

        if (currentIndex < statusFlow.length - 1) {
            const nextStatus = statusFlow[currentIndex + 1];
            StorageManager.updateOrderStatus(orderId, nextStatus);
            this.orders = StorageManager.getOrders();
            this.updateOrdersPage();
        }
    }
}

// Initialize orders manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ordersManager = new OrdersManager();
});
