/**
 * Shopping Cart Management Module
 * Handles all cart operations using localStorage
 */

class ShoppingCart {
    constructor() {
        this.storageKey = 'techboks_cart';
        this.initializeCart();
    }

    /**
     * Initialize cart from localStorage or create empty cart
     */
    initializeCart() {
        const savedCart = localStorage.getItem(this.storageKey);
        if (!savedCart) {
            this.cart = [];
            this.saveCart();
        } else {
            try {
                this.cart = JSON.parse(savedCart);
            } catch (e) {
                console.error('Fejl ved indlæsning af kurv:', e);
                this.cart = [];
                this.saveCart();
            }
        }
    }

    /**
     * Save cart to localStorage
     */
    saveCart() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
        this.updateCartBadge();
    }

    /**
     * Add product to cart or update quantity if already exists
     * @param {Object} product - Product object with id, name, price, image
     * @param {number} quantity - Quantity to add (default 1)
     */
    addToCart(product, quantity = 1) {
        // Validate input
        if (!product || !product.id) {
            console.error('Ugyldigt produkt');
            return false;
        }

        quantity = Math.max(1, parseInt(quantity) || 1);

        // Check if product already in cart
        const existingItem = this.cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.saveCart();
        return true;
    }

    /**
     * Remove product from cart by ID
     * @param {string} productId - Product ID to remove
     */
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    /**
     * Update quantity of a product in cart
     * @param {string} productId - Product ID
     * @param {number} quantity - New quantity
     */
    updateQuantity(productId, quantity) {
        quantity = Math.max(1, parseInt(quantity) || 1);
        const item = this.cart.find(item => item.id === productId);

        if (item) {
            item.quantity = quantity;
            this.saveCart();
            return true;
        }
        return false;
    }

    /**
     * Get all items in cart
     * @return {Array} Cart items
     */
    getCart() {
        return this.cart;
    }

    /**
     * Get cart item count
     * @return {number} Total number of items
     */
    getItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Get total price of all items in cart
     * @return {number} Total price
     */
    getSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    /**
     * Clear entire cart
     */
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    /**
     * Check if cart is empty
     * @return {boolean} True if cart is empty
     */
    isEmpty() {
        return this.cart.length === 0;
    }

    /**
     * Update cart badge in header
     */
    updateCartBadge() {
        const badge = document.getElementById('cart-count-badge');
        const count = this.getItemCount();

        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    }
}

// Create global instance
const cart = new ShoppingCart();
window.cart = cart;

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'info'
 */
function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `notification notification-${type}`;
    toast.textContent = message;

    const style = document.createElement('style');
    if (!document.getElementById('notification-styles')) {
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #333;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
                max-width: 300px;
                word-wrap: break-word;
            }
            .notification-success {
                background: #4caf50;
            }
            .notification-error {
                background: #f44336;
            }
            .notification-info {
                background: #2196f3;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
