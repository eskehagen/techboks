/**
 * EmailJS Configuration
 *
 * Get your credentials from:
 * https://dashboard.emailjs.com/
 *
 * Steps:
 * 1. Sign up at emailjs.com
 * 2. Create Email Service (Gmail recommended)
 * 3. Create Email Template for order notifications
 * 4. Copy your Service ID, Template ID, and Public Key below
 *
 * DO NOT commit real credentials to git!
 */

// Replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_0i00ugn';      // service_xxxxx
const EMAILJS_TEMPLATE_ID = 'template_e8lx22e';   // template_xxxxx
const EMAILJS_PUBLIC_KEY = 'GFpk4dyr0duLMEobN';     // pk_xxxxx

// Email that will receive orders
const SHOP_EMAIL = 'eskehagen@gmail.com';

/**
 * Initialize EmailJS
 * This should be called when the checkout page loads
 */
function initializeEmailJS() {
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init(EMAILJS_PUBLIC_KEY);
            console.log('✓ EmailJS initialized successfully');
            return true;
        } catch (error) {
            console.error('✗ Failed to initialize EmailJS:', error);
            return false;
        }
    } else {
        console.warn('⚠ EmailJS library not loaded');
        return false;
    }
}

/**
 * Send order email to shop owner
 * @param {Object} orderData - Order information
 * @returns {Promise} EmailJS send result
 */
function sendOrderEmailToShop(orderData) {
    return new Promise((resolve, reject) => {
        // Check if EmailJS is configured
        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE') {
            reject(new Error('EmailJS not configured. Please set up credentials in emailjs-config.js'));
            return;
        }

        // Check if emailjs library is loaded
        if (typeof emailjs === 'undefined') {
            reject(new Error('EmailJS library not loaded. Please check internet connection.'));
            return;
        }

        const templateParams = {
            to_email: SHOP_EMAIL,
            customer_name: orderData.customerName,
            customer_email: orderData.customerEmail,
            customer_phone: orderData.customerPhone,
            customer_address: orderData.customerAddress,
            shipping_method: orderData.shippingMethod === 'pickup' ? 'Afhentning' : 'Post',
            shipping_cost: orderData.shippingCost,
            items_list: formatItemsList(orderData.items),
            subtotal: orderData.subtotal,
            total: orderData.total,
            order_date: new Date().toLocaleString('da-DK')
        };

        try {
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(response => {
                    console.log('✓ Order email sent to shop:', response);
                    resolve(response);
                })
                .catch(error => {
                    console.error('✗ Failed to send order email:', error);
                    reject(error);
                });
        } catch (error) {
            console.error('✗ EmailJS send error:', error);
            reject(error);
        }
    });
}

/**
 * Send confirmation email to customer
 * @param {Object} orderData - Order information
 * @returns {Promise} EmailJS send result
 */
function sendOrderConfirmationToCustomer(orderData) {
    // This is optional - you can set up a separate template for customer confirmations
    // For now, just log it
    console.log('Customer confirmation email would be sent to:', orderData.customerEmail);
    return Promise.resolve();
}

/**
 * Format items list for email
 * @param {Array} items - Array of cart items
 * @returns {string} Formatted items list
 */
function formatItemsList(items) {
    return items.map(item =>
        `• ${item.name} × ${item.quantity} = ${item.price * item.quantity} kr`
    ).join('\n');
}
