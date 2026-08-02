/**
 * @semantq/storefront/services
 *
 * CartService — Cart operations
 *
 * Phase 2: Integrated adapter for inventory resolution.
 * Phase 3.7.1: Shared state integration, dataset-based product ID, callback-based updates.
 * Phase 3.7: Intent-based addToCart, proper quantity handling, debug traces.
 * Phase 3.8: Kernel synchronization.
 */

export default class CartService {
    constructor(context = {}) {
        Object.assign(this, context);
        
        // Validate shared state
        if (!this.state) {
            throw new Error('CartService requires shared state object');
        }
        
        // Callback property (set by StorefrontCore)
        this.onCartUpdated = null;
        
        // Sync promise guard for concurrency
        this._syncPromise = null;
        this._lastDecision = null;
    }

    // ==========================================================
    // KERNEL SYNCHRONIZATION
    // ==========================================================

    /**
     * Synchronize cart state with Cartique Kernel
     * Creates CommercialDecision from current cart
     * Concurrency-safe - prevents overlapping sync operations
     */
    async syncWithKernel() {
        // Prevent concurrent syncs
        if (this._syncPromise) {
            if (this.features?.debug) {
                console.log('[Cart] Sync already in progress, waiting...');
            }
            return this._syncPromise;
        }
        
        this._syncPromise = this._performKernelSync();
        
        try {
            return await this._syncPromise;
        } finally {
            this._syncPromise = null;
        }
    }

    /**
     * Internal: Perform actual kernel synchronization
     * @returns {Promise<Object>} CommercialDecision
     */
    async _performKernelSync() {
        if (!this.adapter || typeof this.adapter.resolveCart !== 'function') {
            if (this.features?.debug) {
                console.warn('[Cart] Cannot sync with kernel - adapter missing');
            }
            return null;
        }
        
        // Get cart from localStorage
        let cart = [];
        try {
            const stored = localStorage.getItem('cartiqueCart');
            if (stored) {
                cart = JSON.parse(stored);
                if (!Array.isArray(cart)) cart = [];
            }
        } catch (e) {
            if (this.features?.debug) {
                console.warn('[Cart] Failed to parse cart from localStorage:', e);
            }
            cart = [];
        }
        
        // Build request (customer handled by adapter)
        const request = {
            items: cart.map(item => ({
                productId: item.id,
                variantId: item.variantId || null,
                quantity: item.cart_quantity || 1,
                sellable: item
            })),
            customer: this.customer || null,
            place: this.place || null,
            contexts: {
                currency: this.features?.currencySymbol || 'ZAR',
                debug: this.features?.debug || false
            }
        };
        
        try {
            const decision = await this.adapter.resolveCart(request);
            this._lastDecision = decision;
            
            if (this.features?.debug) {
                console.log('[Cart] Synced with kernel:', 
                    decision.items?.length || 0, 
                    'items, subtotal:', 
                    decision.totals?.subtotal?.amount || 0
                );
            }
            
            return decision;
        } catch (error) {
            console.error('[Cart] Kernel sync failed:', error);
            return null;
        }
    }

    /**
     * Get the last synced decision
     * @returns {Object|null} CommercialDecision
     */
    getLastDecision() {
        return this._lastDecision || null;
    }

    // ==========================================================
    // CART OPERATIONS
    // ==========================================================

    /**
     * Adds a product to the cart using an intent object
     * @param {Object} intent - The add to cart intent { productId, quantity }
     */
    async addToCart(intent) {
        // Debug trace
        if (this.features?.debug) {
            console.log('[TRACE] CartService.addToCart called with:', intent);
            console.trace();
        }

        const productId = intent?.productId;
        const quantity = intent?.quantity || 1;

        // Validate productId
        if (!productId) {
            console.error('CartService: No productId provided in intent');
            return;
        }

        // Check both this.products and this.state.products
        const product = this.products?.find(p => p.id === productId)
            || this.state?.products?.find(p => p.id === productId);
        
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

        // Get current cart
        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const existingIndex = cart.findIndex(item => item.id === product.id);

        if (existingIndex === -1) {
            // New item - add with requested quantity
            cart.push({
                ...product,
                cart_quantity: quantity
            });
        } else {
            // Existing item - check if adding more exceeds stock
            const newQuantity = cart[existingIndex].cart_quantity + quantity;
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

        // Save to localStorage
        localStorage.setItem('cartiqueCart', JSON.stringify(cart));
        
        // ✅ TRACE: Cart before kernel sync
        console.log(
            '[TRACE] CART BEFORE KERNEL SYNC',
            JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('cartiqueCart'))))
        );
        
        // Debug trace before callback
        if (this.features?.debug) {
            console.log('[TRACE] Cart updated, calling onCartUpdated');
            console.trace();
        }
        
        // Use callback instead of direct UI call
        if (typeof this.onCartUpdated === 'function') {
            this.onCartUpdated();
        }
        
        // Sync with kernel after cart update
        await this.syncWithKernel();
    }

    /**
     * Remove an item from the cart
     * @param {number} productId - Product ID to remove
     */
    async removeItem(productId) {
        if (this.features?.debug) {
            console.log('[TRACE] CartService.removeItem called:', productId);
            console.trace();
        }
        
        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cartiqueCart', JSON.stringify(cart));
        
        // Sync with kernel after removal
        await this.syncWithKernel();
        
        // Notify UI
        if (typeof this.onCartUpdated === 'function') {
            this.onCartUpdated();
        }
    }

    /**
     * Update quantity of an item in the cart
     * @param {number} productId - Product ID
     * @param {number} quantity - New quantity
     */
    async updateQuantity(productId, quantity) {
        if (this.features?.debug) {
            console.log('[TRACE] CartService.updateQuantity called:', { productId, quantity });
            console.trace();
        }
        
        if (quantity < 0) return;
        
        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const index = cart.findIndex(item => item.id === productId);
        
        if (index === -1) return;
        
        if (quantity === 0) {
            cart.splice(index, 1);
        } else {
            cart[index].cart_quantity = quantity;
        }
        
        localStorage.setItem('cartiqueCart', JSON.stringify(cart));
        
        // Sync with kernel after update
        await this.syncWithKernel();
        
        // Notify UI
        if (typeof this.onCartUpdated === 'function') {
            this.onCartUpdated();
        }
    }

    /**
     * Handles checkout action
     */
    async checkout() {
        if (this.features?.debug) {
            console.log('[TRACE] CartService.checkout called');
            console.trace();
        }
        
        // Sync with kernel before checkout
        await this.syncWithKernel();
        
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
            // Use callback instead of direct UI call
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