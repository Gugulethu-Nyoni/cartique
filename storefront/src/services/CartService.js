/**
 * @semantq/storefront/services
 *
 * CartService — Cart operations
 *
 * Migrated from: cartique/storefront/src/Storefront.js
 * Phase 2: Integrated adapter for inventory resolution.
 */

export default class CartService {
    constructor(context) {
        Object.assign(this, context);
    }

    /**
     * Adds a product to the cart
     * @param {Event} event - The click event
     */
    async addToCart(event) {
        const productId = parseInt(event.target.id);
        const product = this.products.find(p => p.id === productId);

        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        // STOCK CHECK
        const variant = this.adapter.resolveVariant(product, product.variantId);
        const inventory = await this.adapter.resolveInventory({
            sellable: product,
            variant: variant
        });
        const availableStock = inventory.quantity || 0;
        if (availableStock === 0) {
            this.showStockAlert('This product is SOLD OUT');
            return;
        }

        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const existingIndex = cart.findIndex(item => item.id === product.id);

        if (existingIndex === -1) {
            // New item - can add 1
            cart.push({
                ...product,
                cart_quantity: 1
            });
        } else {
            // Existing item - check if adding more exceeds stock
            const newQuantity = cart[existingIndex].cart_quantity + 1;
            if (newQuantity > availableStock) {
                this.showStockAlert(
                    `Only ${availableStock} available. You already have ${cart[existingIndex].cart_quantity} in cart.`
                );
                return;
            }
            cart[existingIndex].cart_quantity = newQuantity;
        }

        localStorage.setItem('cartiqueCart', JSON.stringify(cart));
        this.showCart();
    }

    /**
     * Handles checkout action
     */
    checkout() {
        // Check if cart page is open
        const cartPage = document.getElementById('cartique-cart-page');
        if (cartPage) {
            // We're on the cart page - remove it first
            cartPage.remove();
            
            // Restore the main view
            const productDisplays = document.getElementById('cartique-product-displays');
            const sidebar = document.getElementById('cartique-sidebar');
            const menuAnchor = document.getElementById('cartique-menu-anchor-top');
            const controls = document.getElementById('cartique-controls');
            const footer = document.getElementById('cartique-product-footer');
            
            if (productDisplays) productDisplays.style.display = 'block';
            if (sidebar) sidebar.style.display = this.features.sidebarDisplay;
            if (menuAnchor) menuAnchor.style.display = '';
            if (controls) controls.style.display = '';
            if (footer) footer.style.display = this.features.footerDisplay;
            
            const mainContent = document.getElementById('cartique-main-content');
            if (mainContent) {
                if (this.features.sidebarDisplay === 'none') {
                    mainContent.classList.add('cartique-full-width');
                } else {
                    mainContent.classList.remove('cartique-full-width');
                }
            }
            
            this.singleProductViewActive = false;
        } else {
            // Close the slide-in cart
            this.closeCart();
        }
        
        // Show the checkout alert
        this.showCheckoutAlert();
    }

    /**
     * Sets the adapter instance
     * @param {Object} adapter - The adapter instance
     */
    setAdapter(adapter) {
        this.adapter = adapter;
    }
}