/**
 * @semantq/storefront
 *
 * CartRenderer — Cart presentation logic
 *
 * Phase 2D: Direct CommercialDecision consumption — no legacy wrapper.
 * Phase 3.6.1: Renderer stabilization — container creation and fallbacks.
 * Phase 3.6.2: Safe context method checks.
 * Phase 3.8: Navigation state restoration.
 */

export default class CartRenderer {
    constructor(context = {}) {
        Object.assign(this, context);
        
        // Ensure eventListeners exists
        if (!this.eventListeners) {
            this.eventListeners = new Map();
        }
        
        // Ensure addEventListener is bound
        if (!this.addEventListener) {
            this.addEventListener = (el, event, handler) => {
                el.addEventListener(event, handler);
                const key = `${el.id || el.className}-${event}`;
                if (!this.eventListeners.has(key)) {
                    this.eventListeners.set(key, []);
                }
                this.eventListeners.get(key).push({ element: el, event, handler });
            };
        }
        
        // Callback property for cart restoration
        this.onCartRestored = null;
        
        // State snapshot storage
        this._stateSnapshot = null;
    }

    // ==========================================================
    // STATE SNAPSHOT & RESTORE (for navigation)
    // ==========================================================

    /**
     * Snapshot current state before navigation
     * Uses CartService.snapshotState if available, or creates its own
     */
    snapshotState() {
        // Try to use CartService's snapshot method first
        if (this.cartService && typeof this.cartService.snapshotState === 'function') {
            this.cartService.snapshotState();
            return;
        }

        // Fallback: snapshot state directly
        this._stateSnapshot = {
            layout: this.state?.currentLayout || 'grid',
            search: this.state?.currentSearchQuery || '',
            category: this.state?.activeCategoryId || null,
            filters: this.state?.activeFilters || {},
            scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
            product: this.state?.selectedProduct || null,
            view: this.state?.singleProductViewActive || false,
            // Store references to product grid and list containers
            gridDisplay: document.getElementById('cartique-product-grid')?.style.display || '',
            listDisplay: document.getElementById('cartique-product-list')?.style.display || ''
        };

        if (this.features?.debug) {
            console.log('[CartRenderer] State snapshot taken:', this._stateSnapshot);
        }
    }

    /**
     * Restore state after navigation
     */
    restoreState() {
        // Try to use CartService's restore method first
        if (this.cartService && typeof this.cartService.restoreState === 'function') {
            this.cartService.restoreState();
            return;
        }

        // Fallback: restore state directly
        if (!this._stateSnapshot) {
            if (this.features?.debug) {
                console.warn('[CartRenderer] No state snapshot to restore');
            }
            return;
        }

        const snapshot = this._stateSnapshot;

        if (this.features?.debug) {
            console.log('[CartRenderer] Restoring state:', snapshot);
        }

        // Restore UI state
        if (this.state) {
            this.state.currentLayout = snapshot.layout;
            this.state.currentSearchQuery = snapshot.search;
            this.state.activeCategoryId = snapshot.category;
            this.state.activeFilters = snapshot.filters || {};
            this.state.selectedProduct = snapshot.product;
            this.state.singleProductViewActive = snapshot.view;
        }

        // Restore scroll position
        if (typeof window !== 'undefined' && snapshot.scrollY > 0) {
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                window.scrollTo(0, snapshot.scrollY);
            });
        }

        // Restore product grid/list visibility
        const gridContainer = document.getElementById('cartique-product-grid');
        const listContainer = document.getElementById('cartique-product-list');

        if (gridContainer && snapshot.gridDisplay) {
            gridContainer.style.display = snapshot.gridDisplay;
        }
        if (listContainer && snapshot.listDisplay) {
            listContainer.style.display = snapshot.listDisplay;
        }

        // Notify renderers to refresh
        if (typeof this.onCartRestored === 'function') {
            this.onCartRestored();
        }

        this._stateSnapshot = null;
    }

    /**
     * Renders the cart slider
     */
    async renderCartSlider() {
        const wrapper = this.templateHolder?.content?.getElementById('cartique-cart-slider-component');
        if (!wrapper) {
            console.warn('Cart slider component template not found');
            return;
        }

        const cartSlider = wrapper.firstElementChild?.cloneNode(true);
        if (!cartSlider) {
            console.warn('Cart slider element not found in template');
            return;
        }

        let hiddenBlocks = document.getElementById('cartique-hidden-blocks');
        if (!hiddenBlocks) {
            hiddenBlocks = document.createElement('div');
            hiddenBlocks.id = 'cartique-hidden-blocks';
            document.body.appendChild(hiddenBlocks);
        }

        hiddenBlocks.appendChild(cartSlider);

        // Close button
        const closeBtn = cartSlider.querySelector('#cart-close-btn');
        if (closeBtn && this.addEventListener) {
            this.addEventListener(closeBtn, 'click', () => {
                if (typeof this.closeCart === 'function') {
                    this.closeCart();
                }
            });
        }

        // Checkout button
        const checkoutBtn = cartSlider.querySelector('#checkout-btn');
        if (checkoutBtn && this.addEventListener) {
            this.addEventListener(checkoutBtn, 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof this.checkout === 'function') {
                    this.checkout();
                }
            });
        }

        // View Cart button
        const viewCartBtn = cartSlider.querySelector('#view-cart-btn');
        if (viewCartBtn && this.addEventListener) {
            this.addEventListener(viewCartBtn, 'click', (e) => {
                e.preventDefault();
                if (typeof this.showCartPage === 'function') {
                    this.showCartPage();
                }
            });
        }
    }

    /**
     * Renders the cart item template
     */
    async renderCartItemTemplate() {
        const wrapper = this.templateHolder?.content?.getElementById('cartique-cart-item-component');
        if (!wrapper) {
            console.warn('Cart item template not found');
            return;
        }

        const itemTemplate = wrapper.firstElementChild?.cloneNode(true);
        if (!itemTemplate) {
            console.warn('Cart item element not found in template');
            return;
        }

        let hiddenBlocks = document.getElementById('cartique-hidden-blocks');
        if (!hiddenBlocks) {
            hiddenBlocks = document.createElement('div');
            hiddenBlocks.id = 'cartique-hidden-blocks';
            document.body.appendChild(hiddenBlocks);
        }

        itemTemplate.classList.add('cart-item-template');
        itemTemplate.style.display = 'none';
        hiddenBlocks.appendChild(itemTemplate);
    }

    /**
     * Renders the full cart page
     */
    async renderCartPage() {
        console.log('🔍 6. renderCartPage() called');

        const cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const mainContent = document.getElementById('cartique-main-content');
        
        if (!mainContent) {
            console.warn('Main content container not found for cart page');
            return;
        }

        // Remove existing cart page if any
        const existingCartPage = document.getElementById('cartique-cart-page');
        if (existingCartPage) existingCartPage.remove();

        const cartPage = document.createElement('div');
        cartPage.id = 'cartique-cart-page';
        cartPage.className = 'cartique-cart-page';

        if (cart.length === 0) {
            cartPage.innerHTML = `
                <div class="cart-page-empty">
                    <div class="cart-page-header">
                        <button class="cart-page-back" id="cart-page-back">← Back to Shop</button>
                        <h2>Shopping Cart</h2>
                    </div>
                    <div class="cart-page-empty-content">
                        <p>Your cart is empty.</p>
                        <button class="cart-page-back-btn" id="cart-page-back-btn">Continue Shopping</button>
                    </div>
                </div>
            `;
        } else {
            let subtotal = 0;
            let itemsHTML = '';
            
            for (const product of cart) {
                // Get variant using adapter
                let variant = null;
                try {
                    variant = this.adapter?.resolveVariant(product, product.variantId || product.id);
                } catch (e) {
                    console.warn('Variant resolution failed:', e.message);
                    variant = { price: product.price || 0 };
                }
                
                const quantity = product.cart_quantity || 1;
                
                // Get CommercialDecision from adapter
                let decision;
                try {
                    decision = await this.adapter?.resolvePricing({
                        sellable: { variants: [variant] },
                        variant: variant,
                        quantity: quantity,
                        customer: this.customer,
                        place: this.place
                    });
                } catch (e) {
                    console.warn('Pricing resolution failed for cart item:', e.message);
                    decision = { items: [{ unitPrice: { amount: 0 } }], adjustments: [], totals: { subtotal: { amount: 0 } } };
                }

                // Extract data from CommercialDecision directly
                const item = decision?.items?.[0] || {};
                const adjustments = decision?.adjustments || [];
                const totals = decision?.totals || {};
                
                const hasBulk = adjustments.some(a => 
                    a.type === 'bulk_discount' || 
                    a.label?.toLowerCase().includes('bulk')
                );
                const unitPrice = item.unitPrice?.amount || 0;
                const retailPrice = item.comparePrice?.amount || variant?.price || 0;
                const itemTotal = totals.subtotal?.amount || 0;
                
                const bulkAdjustment = adjustments.find(a => a.type === 'bulk_discount');
                const bulkPrice = bulkAdjustment?.metadata?.bulkPrice || null;
                const bulkMinQty = bulkAdjustment?.metadata?.minimumQty || null;
                
                subtotal += itemTotal;
                
                // Build bulk display
                const bulkDisplay = {
                    hasBulk: hasBulk,
                    isBulk: hasBulk,
                    retailPrice: retailPrice,
                    bulkPrice: bulkPrice,
                    unitPrice: unitPrice,
                    minimumQty: bulkMinQty,
                    heading: hasBulk ? '✓ Bulk Price Applied' : 'BULK PRICE',
                    message: bulkMinQty ? `Minimum ${bulkMinQty} items` : null,
                    displayPrice: `${this.currencySymbol}${this.formatPrice(unitPrice)} each`,
                    bulkDisplayPrice: bulkPrice ? `${this.currencySymbol}${this.formatPrice(bulkPrice)} each` : null,
                    staticDisplay: {
                        label: 'BULK PRICE',
                        price: bulkPrice ? `${this.currencySymbol}${this.formatPrice(bulkPrice)} each` : null,
                        minQty: bulkMinQty ? `Minimum ${bulkMinQty} items` : null
                    }
                };
                
                // Build price HTML with bulk info
                let priceHTML = '';
                let bulkStatusHTML = '';
                
                if (bulkDisplay && bulkDisplay.hasBulk) {
                    if (bulkDisplay.isBulk) {
                        priceHTML = `
                            <span class="original-price-strikethrough">${this.currencySymbol}${this.formatPrice(bulkDisplay.retailPrice)}</span>
                            <span class="bulk-price-active">${this.currencySymbol}${this.formatPrice(bulkDisplay.unitPrice)}</span>
                        `;
                        bulkStatusHTML = `
                            <div class="cart-page-bulk-status active">
                                <span class="bulk-heading-active">✓ Bulk Price Applied</span>
                                <span class="bulk-min-qty">${bulkDisplay.message}</span>
                            </div>
                        `;
                    } else {
                        priceHTML = `
                            <span class="retail-price">${this.currencySymbol}${this.formatPrice(bulkDisplay.retailPrice)}</span>
                        `;
                        bulkStatusHTML = `
                            <div class="cart-page-bulk-status">
                                <span class="bulk-heading">BULK PRICE</span>
                                <span class="bulk-price-available">${bulkDisplay.bulkDisplayPrice}</span>
                                <span class="bulk-min-qty">${bulkDisplay.message}</span>
                            </div>
                        `;
                    }
                } else {
                    priceHTML = `
                        <span class="retail-price">${this.currencySymbol}${this.formatPrice(product.price || variant?.price || 0)}</span>
                    `;
                }
                
                itemsHTML += `
                    <div class="cart-page-item" data-product-id="${product.id}" data-variant-id="${product.variantId || ''}">
                        <div class="cart-page-item-image">
                            <img src="${product.image || ''}" alt="${product.title || ''}">
                        </div>
                        <div class="cart-page-item-details">
                            <h3>${product.title || ''}</h3>
                            <p class="cart-page-item-price">
                                ${priceHTML}
                            </p>
                            ${bulkStatusHTML}
                            <div class="cart-page-item-actions">
                                <div class="cart-page-quantity">
                                    <button class="cart-page-qty-btn decrease-page-qty" data-id="${product.id}">−</button>
                                    <input type="text" class="cart-page-qty-input" value="${quantity}" readonly data-id="${product.id}">
                                    <button class="cart-page-qty-btn increase-page-qty" data-id="${product.id}">+</button>
                                </div>
                                <button class="cart-page-remove" data-id="${product.id}">Remove</button>
                            </div>
                        </div>
                        <div class="cart-page-item-total">
                            ${this.currencySymbol}${this.formatPrice(itemTotal)}
                        </div>
                    </div>
                `;
            }
            
            cartPage.innerHTML = `
                <div class="cart-page-container">
                    <div class="cart-page-header">
                        <button class="cart-page-back" id="cart-page-back">← Back to Shop</button>
                        <h2>Shopping Cart (${cart.length} ${cart.length === 1 ? 'item' : 'items'})</h2>
                    </div>
                    <div class="cart-page-items">
                        ${itemsHTML}
                    </div>
                    <div class="cart-page-footer">
                        <div class="cart-page-subtotal">
                            <span>Subtotal</span>
                            <span>${this.currencySymbol}${this.formatPrice(subtotal)}</span>
                        </div>
                        <button class="cart-page-checkout" id="cart-page-checkout">Proceed to Checkout</button>
                        <button class="cart-page-continue" id="cart-page-continue">Continue Shopping</button>
                    </div>
                </div>
            `;
        }

        mainContent.appendChild(cartPage);
        this.attachCartPageEvents(cartPage);
    }

    /**
     * Shows the cart slider
     */
    async showCart() {
        const cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const cartContainer = document.getElementById('cart-items-container');
        
        if (!cartContainer) {
            console.warn('Cart items container not found');
            return;
        }

        cartContainer.innerHTML = '';

        // Show/hide empty cart message
        const emptyMsg = document.getElementById('shopping-cart-empty');
        const viewBtn = document.getElementById('view-cart-btn');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (emptyMsg) emptyMsg.classList.toggle('show', cart.length === 0);
        if (viewBtn) viewBtn.style.display = cart.length === 0 ? 'none' : 'block';
        if (checkoutBtn) checkoutBtn.style.display = cart.length === 0 ? 'none' : 'block';

        // Calculate subtotal with bulk pricing
        let subtotal = 0;

        // Render cart items
        for (const product of cart) {
            const wrapper = this.templateHolder?.content?.getElementById('cartique-cart-item-component');
            if (!wrapper) {
                console.warn('Cart item template not found');
                continue;
            }

            const cartItem = wrapper.firstElementChild?.cloneNode(true);
            if (!cartItem) continue;
            
            // Update product data
            await this.updateCartItem(cartItem, product);
            
            // Add event listeners
            this.addCartItemEventListeners(cartItem, product.id);
            
            // Calculate subtotal with bulk pricing
            let variant = null;
            try {
                variant = this.adapter?.resolveVariant(product, product.variantId || product.id);
            } catch (e) {
                console.warn('Variant resolution failed:', e.message);
                variant = { price: product.price || 0 };
            }
            
            const quantity = product.cart_quantity || 1;
            let decision;
            try {
                decision = await this.adapter?.resolvePricing({
                    sellable: { variants: [variant] },
                    variant: variant,
                    quantity: quantity,
                    customer: this.customer,
                    place: this.place
                });
            } catch (e) {
                console.warn('Pricing resolution failed for cart item:', e.message);
                decision = { totals: { subtotal: { amount: 0 } } };
            }
            
            const totals = decision?.totals || {};
            subtotal += totals.subtotal?.amount || 0;
            
            cartContainer.appendChild(cartItem);
        }

        // Update subtotal display
        const subtotalEl = document.getElementById('subtotal');
        const subtotalCurrencyEl = document.getElementById('subtotal-currency');
        
        if (subtotalEl) subtotalEl.textContent = this.formatPrice(subtotal);
        if (subtotalCurrencyEl) subtotalCurrencyEl.textContent = this.currencySymbol || 'R';

        // Show the hidden blocks container
        const hiddenBlocks = document.getElementById('cartique-hidden-blocks');
        if (hiddenBlocks) {
            hiddenBlocks.style.display = 'block';
        }

        // Open cart slider and overlay
        const cartSlide = document.getElementById('cart-slide');
        const overlay = document.getElementById('cart-slide-overlay');
        
        if (cartSlide) cartSlide.classList.add('open');
        if (overlay) overlay.style.display = 'block';
    }

    /**
     * Closes the cart slider
     */
    closeCart() {
        const cartSlide = document.getElementById('cart-slide');
        const overlay = document.getElementById('cart-slide-overlay');
        const hiddenBlocks = document.getElementById('cartique-hidden-blocks');

        if (cartSlide) cartSlide.classList.remove('open');
        if (overlay) overlay.style.display = 'none';
        
        if (hiddenBlocks) {
            setTimeout(() => {
                hiddenBlocks.style.display = 'none';
            }, 350);
        }
    }

    /**
     * Updates a cart item in the slider
     */
    async updateCartItem(cartItem, product) {
        // Update image
        const imgEl = cartItem.querySelector('#image');
        if (imgEl) {
            imgEl.src = product.image || '';
            imgEl.alt = product.title || '';
        }

        // Update title
        const titleEl = cartItem.querySelector('#title');
        if (titleEl) titleEl.textContent = product.title || '';

        // Get variant using adapter
        let variant = null;
        try {
            if (product.variantId) {
                variant = this.adapter?.resolveVariant(product, product.variantId);
            }
            if (!variant && product.variants && product.variants.length > 0) {
                variant = product.variants[0];
            }
        } catch (e) {
            console.warn('Variant resolution failed:', e.message);
        }
        
        if (!variant) {
            variant = {
                id: product.id,
                price: product.price || 0,
                bulkPrice: product.bulkPrice,
                bulkMinimumQty: product.bulkMinimumQty,
                inventory: product.inventory || 0
            };
        }
        
        const quantity = product.cart_quantity || 1;

        // Get CommercialDecision from adapter
        let decision;
        try {
            decision = await this.adapter?.resolvePricing({
                sellable: { variants: [variant] },
                variant: variant,
                quantity: quantity,
                customer: this.customer,
                place: this.place
            });
        } catch (e) {
            console.warn('Pricing resolution failed for cart item:', e.message);
            decision = { items: [{ unitPrice: { amount: 0 } }], adjustments: [], totals: { subtotal: { amount: 0 } } };
        }

        // Extract data from CommercialDecision directly
        const item = decision?.items?.[0] || {};
        const adjustments = decision?.adjustments || [];
        const totals = decision?.totals || {};
        
        const hasBulk = adjustments.some(a => 
            a.type === 'bulk_discount' || 
            a.label?.toLowerCase().includes('bulk')
        );
        const unitPrice = item.unitPrice?.amount || 0;
        const retailPrice = item.comparePrice?.amount || variant?.price || 0;
        const totalPrice = totals.subtotal?.amount || 0;
        
        const bulkAdjustment = adjustments.find(a => a.type === 'bulk_discount');
        const bulkPrice = bulkAdjustment?.metadata?.bulkPrice || null;
        const bulkMinQty = bulkAdjustment?.metadata?.minimumQty || null;

        // Get price elements
        const priceEl = cartItem.querySelector('#price');
        const salePriceEl = cartItem.querySelector('#sale_price');
        const currencyEls = cartItem.querySelectorAll('#currency');

        // Update currency symbols
        currencyEls.forEach(el => el.textContent = this.currencySymbol || 'R');

        // Remove existing bulk status message
        const existingBulkMsg = cartItem.querySelector('.cart-bulk-status');
        if (existingBulkMsg) existingBulkMsg.remove();

        // Build bulk display from CommercialDecision
        const bulkDisplay = {
            hasBulk: hasBulk,
            isBulk: hasBulk,
            retailPrice: retailPrice,
            bulkPrice: bulkPrice,
            unitPrice: unitPrice,
            minimumQty: bulkMinQty,
            heading: hasBulk ? '✓ Bulk Price Applied' : 'BULK PRICE',
            message: bulkMinQty ? `Minimum ${bulkMinQty} items` : null,
            displayPrice: `${this.currencySymbol}${this.formatPrice(unitPrice)} each`,
            bulkDisplayPrice: bulkPrice ? `${this.currencySymbol}${this.formatPrice(bulkPrice)} each` : null,
            staticDisplay: {
                label: 'BULK PRICE',
                price: bulkPrice ? `${this.currencySymbol}${this.formatPrice(bulkPrice)} each` : null,
                minQty: bulkMinQty ? `Minimum ${bulkMinQty} items` : null
            }
        };

        if (bulkDisplay && bulkDisplay.hasBulk) {
            const detailsDiv = cartItem.querySelector('.cart-item-details');
            if (detailsDiv) {
                const bulkStatus = document.createElement('div');
                bulkStatus.className = 'cart-bulk-status';
                bulkStatus.innerHTML = `
                    <div class="bulk-heading ${bulkDisplay.isBulk ? 'active' : ''}">
                        ${bulkDisplay.heading}
                    </div>
                    <div class="bulk-price-display">
                        ${bulkDisplay.bulkDisplayPrice}
                    </div>
                    <div class="bulk-min-qty">${bulkDisplay.message}</div>
                `;
                detailsDiv.appendChild(bulkStatus);
            }

            if (bulkDisplay.isBulk) {
                if (priceEl) {
                    priceEl.textContent = this.formatPrice(bulkDisplay.retailPrice);
                    priceEl.style.textDecoration = 'line-through';
                    priceEl.style.color = '#6c757d';
                    priceEl.style.fontSize = '14px';
                    priceEl.style.opacity = '0.7';
                }
                
                if (salePriceEl) {
                    salePriceEl.textContent = this.formatPrice(bulkDisplay.unitPrice);
                    salePriceEl.style.display = 'inline';
                    salePriceEl.style.color = '#28a745';
                    salePriceEl.style.fontWeight = 'bold';
                    salePriceEl.style.fontSize = '18px';
                    
                    const parentSpan = salePriceEl.parentElement;
                    if (parentSpan) parentSpan.style.display = 'inline';
                }
            } else {
                if (priceEl) {
                    priceEl.textContent = this.formatPrice(bulkDisplay.retailPrice);
                    priceEl.style.textDecoration = 'none';
                    priceEl.style.color = '';
                    priceEl.style.fontSize = '';
                    priceEl.style.opacity = '';
                }
                
                if (salePriceEl) {
                    salePriceEl.textContent = '';
                    salePriceEl.style.display = 'none';
                    const parentSpan = salePriceEl.parentElement;
                    if (parentSpan) parentSpan.style.display = 'none';
                }
            }
        } else {
            if (priceEl) {
                priceEl.textContent = this.formatPrice(product.price || variant?.price || 0);
                priceEl.style.textDecoration = 'none';
                priceEl.style.color = '';
                priceEl.style.fontSize = '';
                priceEl.style.opacity = '';
            }
            
            if (salePriceEl) {
                salePriceEl.textContent = '';
                salePriceEl.style.display = 'none';
                const parentSpan = salePriceEl.parentElement;
                if (parentSpan) parentSpan.style.display = 'none';
            }
        }

        // Set quantity
        const quantityInput = cartItem.querySelector('.quantity');
        if (quantityInput) {
            quantityInput.value = quantity;
            quantityInput.id = `quantity_${product.id}`;
        }
    }

    /**
     * Adds event listeners to cart item
     */
    addCartItemEventListeners(cartItem, productId) {
        const removeBtn = cartItem.querySelector('#remove-item');
        const decreaseBtn = cartItem.querySelector('.decrease-qty');
        const increaseBtn = cartItem.querySelector('.increase-qty');

        if (removeBtn && this.addEventListener) {
            removeBtn.id = productId;
            this.addEventListener(removeBtn, 'click', (e) => this.removeCartItem(e));
        }

        if (decreaseBtn && this.addEventListener) {
            decreaseBtn.id = `decrease_quantity_${productId}`;
            this.addEventListener(decreaseBtn, 'click', (e) => this.decreaseQtyItem(e));
        }

        if (increaseBtn && this.addEventListener) {
            increaseBtn.id = `increase_quantity_${productId}`;
            this.addEventListener(increaseBtn, 'click', (e) => this.increaseQtyItem(e));
        }
    }

    /**
     * Removes item from cart slider
     */
    removeCartItem(event) {
        const productId = parseInt(event.target.id);
        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        cart = cart.filter(product => product.id !== productId);
        localStorage.setItem('cartiqueCart', JSON.stringify(cart));
        this.showCart();
    }

    /**
     * Decreases quantity in cart slider
     */
    decreaseQtyItem(event) {
        const productId = parseInt(event.target.id.replace('decrease_quantity_', ''));
        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const index = cart.findIndex(item => item.id === productId);

        if (index !== -1) {
            if (cart[index].cart_quantity > 1) {
                cart[index].cart_quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            
            localStorage.setItem('cartiqueCart', JSON.stringify(cart));
            this.showCart();
        }
    }

    /**
     * Increases quantity in cart slider
     */
    async increaseQtyItem(event) {
        const productId = parseInt(event.target.id.replace('increase_quantity_', ''));
        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const index = cart.findIndex(item => item.id === productId);

        if (index !== -1) {
            const product = this.products?.find(p => p.id === productId);
            if (!product) {
                console.warn('Product not found for quantity increase:', productId);
                return;
            }
            
            let variant = null;
            try {
                variant = this.adapter?.resolveVariant(product, product.variantId);
            } catch (e) {
                console.warn('Variant resolution failed:', e.message);
                variant = { inventory: 10 };
            }
            
            let inventory;
            try {
                inventory = await this.adapter?.resolveInventory({
                    sellable: product,
                    variant: variant
                });
            } catch (e) {
                console.warn('Inventory resolution failed:', e.message);
                inventory = { quantity: 10 };
            }
            
            const availableStock = inventory?.quantity || 0;
            const newQuantity = cart[index].cart_quantity + 1;
            
            if (newQuantity > availableStock) {
                if (typeof this.showStockAlert === 'function') {
                    this.showStockAlert(
                        `Cannot add more. Only ${availableStock} available in total.`
                    );
                }
                return;
            }
            
            cart[index].cart_quantity = newQuantity;
            localStorage.setItem('cartiqueCart', JSON.stringify(cart));
            this.showCart();
        }
    }

    /**
     * Shows the full cart page
     */
    showCartPage() {
        console.log('🔍 5. showCartPage() called');

        // Snapshot state before navigating to cart
        this.snapshotState();

        this.closeCart();
        
        const productDisplays = document.getElementById('cartique-product-displays');
        const sidebar = document.getElementById('cartique-sidebar');
        const menuAnchor = document.getElementById('cartique-menu-anchor-top');
        const controls = document.getElementById('cartique-controls');
        
        if (productDisplays) productDisplays.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
        if (menuAnchor) menuAnchor.style.display = 'none';
        if (controls) controls.style.display = 'none';
        
        const mainContent = document.getElementById('cartique-main-content');
        if (mainContent) {
            mainContent.classList.add('cartique-full-width');
        }
        
        this.singleProductViewActive = true;
        this.renderCartPage();
        
        requestAnimationFrame(() => {
            const cartPage = document.getElementById('cartique-cart-page');
            if (cartPage) {
                cartPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (mainContent) mainContent.scrollTop = 0;
        });
    }

    /**
     * Closes the cart page and returns to previous view
     */
    closeCartPage() {
        const cartPage = document.getElementById('cartique-cart-page');
        if (cartPage) cartPage.remove();

        const singleProductView = document.getElementById('single-product-view-container');
        const wasInSingleView = singleProductView && singleProductView.style.display === 'none' && 
                                singleProductView.innerHTML !== '';
        
        if (wasInSingleView) {
            if (singleProductView) singleProductView.style.display = 'block';
        } else {
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
        }
        
        const mainContent = document.getElementById('cartique-main-content');
        if (mainContent) {
            if (this.features?.sidebarDisplay === 'none' || wasInSingleView) {
                mainContent.classList.add('cartique-full-width');
            } else {
                mainContent.classList.remove('cartique-full-width');
            }
        }

        if (!wasInSingleView) {
            this.singleProductViewActive = false;
        }

        // Restore state after cart page is closed
        this.restoreState();
    }

    /**
     * Attaches events to cart page
     */
    attachCartPageEvents(cartPage) {
        const backBtn = cartPage.querySelector('#cart-page-back');
        if (backBtn && this.addEventListener) {
            this.addEventListener(backBtn, 'click', () => this.closeCartPage());
        }

        const continueBtns = cartPage.querySelectorAll('#cart-page-back-btn, #cart-page-continue');
        continueBtns.forEach(btn => {
            if (this.addEventListener) {
                this.addEventListener(btn, 'click', () => this.closeCartPage());
            }
        });

        cartPage.querySelectorAll('.decrease-page-qty').forEach(btn => {
            if (this.addEventListener) {
                this.addEventListener(btn, 'click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    this.decreasePageQty(productId);
                    this.renderCartPage();
                });
            }
        });

        cartPage.querySelectorAll('.increase-page-qty').forEach(btn => {
            if (this.addEventListener) {
                this.addEventListener(btn, 'click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    this.increasePageQty(productId);
                    this.renderCartPage();
                });
            }
        });

        cartPage.querySelectorAll('.cart-page-remove').forEach(btn => {
            if (this.addEventListener) {
                this.addEventListener(btn, 'click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    this.removePageItem(productId);
                    this.renderCartPage();
                });
            }
        });

        const checkoutBtn = cartPage.querySelector('#cart-page-checkout');
        if (checkoutBtn && this.addEventListener) {
            this.addEventListener(checkoutBtn, 'click', (e) => {
                e.preventDefault();
                if (typeof this.checkout === 'function') {
                    this.checkout();
                }
            });
        }
    }

    /**
     * Decreases quantity on cart page
     */
    decreasePageQty(productId) {
        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const index = cart.findIndex(item => item.id === productId);

        if (index !== -1) {
            if (cart[index].cart_quantity > 1) {
                cart[index].cart_quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            localStorage.setItem('cartiqueCart', JSON.stringify(cart));
        }
    }

    /**
     * Increases quantity on cart page
     */
    async increasePageQty(productId) {
        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const index = cart.findIndex(item => item.id === productId);

        if (index !== -1) {
            const product = this.products?.find(p => p.id === productId);
            if (!product) {
                console.warn('Product not found for quantity increase:', productId);
                return;
            }
            
            let variant = null;
            try {
                variant = this.adapter?.resolveVariant(product, product.variantId);
            } catch (e) {
                console.warn('Variant resolution failed:', e.message);
                variant = { inventory: 10 };
            }
            
            let inventory;
            try {
                inventory = await this.adapter?.resolveInventory({
                    sellable: product,
                    variant: variant
                });
            } catch (e) {
                console.warn('Inventory resolution failed:', e.message);
                inventory = { quantity: 10 };
            }
            
            const availableStock = inventory?.quantity || 0;
            const newQuantity = cart[index].cart_quantity + 1;
            
            if (newQuantity > availableStock) {
                if (typeof this.showStockAlert === 'function') {
                    this.showStockAlert(
                        `Cannot add more. Maximum available: ${availableStock}`
                    );
                }
                return;
            }
            
            cart[index].cart_quantity += 1;
            localStorage.setItem('cartiqueCart', JSON.stringify(cart));
        }
    }

    /**
     * Removes item from cart page
     */
    removePageItem(productId) {
        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        cart = cart.filter(product => product.id !== productId);
        localStorage.setItem('cartiqueCart', JSON.stringify(cart));
    }
}