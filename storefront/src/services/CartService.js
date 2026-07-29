/**
 * @semantq/storefront/services
 *
 * CartService — Cart operations
 *
 * Phase 2: Integrated adapter for inventory resolution.
 * Phase 3.7.1: Shared state integration, dataset-based product ID, callback-based updates.
 */

export default class CartService {
    constructor(context = {}) {
        Object.assign(this, context);
        
        //  Validate shared state
        if (!this.state) {
            throw new Error('CartService requires shared state object');
        }
        
        // Callback property (set by StorefrontCore)
        this.onCartUpdated = null;
    }

    /**
     * Adds a product to the cart
     * @param {Event} event - The click event
     */
    async addToCart(event) {
        //  Use dataset instead of id for better separation
        const productId = Number(event.target.dataset.productId);
        
        if (!productId) {
            console.error('No product ID found in dataset');
            return;
        }
        
        const product = this.products.find(p => p.id === productId);

        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        // STOCK CHECK
        let variant = null;
        try {
            variant = this.adapter.resolveVariant(product, product.variantId);
        } catch (e) {
            console.warn('Variant resolution failed:', e.message);
            variant = { inventory: 10 };
        }
        
        let inventory;
        try {
            inventory = await this.adapter.resolveInventory({
                sellable: product,
                variant: variant
            });
        } catch (e) {
            console.warn('Inventory resolution failed:', e.message);
            inventory = { quantity: 10 };
        }
        
        const availableStock = inventory.quantity || 0;
        
        if (availableStock === 0) {
            if (typeof this.showStockAlert === 'function') {
                this.showStockAlert('This product is SOLD OUT');
            }
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
                if (typeof this.showStockAlert === 'function') {
                    this.showStockAlert(
                        `Only ${availableStock} available. You already have ${cart[existingIndex].cart_quantity} in cart.`
                    );
                }
                return;
            }
            cart[existingIndex].cart_quantity = newQuantity;
        }

        localStorage.setItem('cartiqueCart', JSON.stringify(cart));
        
        //  Use callback instead of direct UI call
        if (typeof this.onCartUpdated === 'function') {
            this.onCartUpdated();
        }
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
            if (sidebar) sidebar.style.display = this.features?.sidebarDisplay;
            if (menuAnchor) menuAnchor.style.display = '';
            if (controls) controls.style.display = '';
            if (footer) footer.style.display = this.features?.footerDisplay;
            
            const mainContent = document.getElementById('cartique-main-content');
            if (mainContent) {
                if (this.features?.sidebarDisplay === 'none') {
                    mainContent.classList.add('cartique-full-width');
                } else {
                    mainContent.classList.remove('cartique-full-width');
                }
            }
            
            this.state.singleProductViewActive = false;
            this.singleProductViewActive = false; // Legacy alias
        } else {
            //  Use callback instead of direct UI call
            if (typeof this.onCartUpdated === 'function') {
                this.onCartUpdated();
            }
        }
        
        // Show the checkout alert
        if (typeof this.showCheckoutAlert === 'function') {
            this.showCheckoutAlert();
        }
    }

    /**
     * Sets the adapter instance
     * @param {Object} adapter - The adapter instance
     */
    setAdapter(adapter) {
        this.adapter = adapter;
    }
}