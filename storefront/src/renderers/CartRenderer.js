/**
 * @semantq/storefront
 *
 * CartRenderer — Cart presentation logic
 *
 * Phase 2D: Direct CommercialDecision consumption — no legacy wrapper.
 * Phase 3.6.1: Renderer stabilization — container creation and fallbacks.
 * Phase 3.6.2: Safe context method checks.
 * Phase 3.8: Navigation state restoration and CommercialDecision consumption.
 * Phase 3.8.1: CartRenderer migration completion — single enrichment pipeline.
 * Phase 3.8.2: Final fixes — strike-through, quantity buttons, checkout, view cart.
 */

export default class CartRenderer {
    constructor(context = {}) {
        Object.assign(this, context);

        // Ensure cartService is available
        this.cartService = context.services?.cart || context.cartService || null;

        if (this.features?.debug) {
            console.log("[TRACE] CartRenderer cartService:", this.cartService);
            console.log("[TRACE] CartRenderer state:", this.state);
        }
        
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

    snapshotState() {
        if (this.cartService && typeof this.cartService.snapshotState === 'function') {
            this.cartService.snapshotState();
            return;
        }

        this._stateSnapshot = {
            layout: this.state?.currentLayout || 'grid',
            search: this.state?.currentSearchQuery || '',
            category: this.state?.activeCategoryId || null,
            filters: this.state?.activeFilters || {},
            scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
            product: this.state?.selectedProduct || null,
            view: this.state?.singleProductViewActive || false,
            gridDisplay: document.getElementById('cartique-product-grid')?.style.display || '',
            listDisplay: document.getElementById('cartique-product-list')?.style.display || ''
        };

        if (this.features?.debug) {
            console.log('[CartRenderer] State snapshot taken:', this._stateSnapshot);
        }
    }

    restoreState() {
        if (this.cartService && typeof this.cartService.restoreState === 'function') {
            this.cartService.restoreState();
            return;
        }

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

        if (this.state) {
            this.state.currentLayout = snapshot.layout;
            this.state.currentSearchQuery = snapshot.search;
            this.state.activeCategoryId = snapshot.category;
            this.state.activeFilters = snapshot.filters || {};
            this.state.selectedProduct = snapshot.product;
            this.state.singleProductViewActive = snapshot.view;
        }

        if (typeof window !== 'undefined' && snapshot.scrollY > 0) {
            requestAnimationFrame(() => {
                window.scrollTo(0, snapshot.scrollY);
            });
        }

        const gridContainer = document.getElementById('cartique-product-grid');
        const listContainer = document.getElementById('cartique-product-list');

        if (gridContainer && snapshot.gridDisplay) {
            gridContainer.style.display = snapshot.gridDisplay;
        }
        if (listContainer && snapshot.listDisplay) {
            listContainer.style.display = snapshot.listDisplay;
        }

        if (typeof this.onCartRestored === 'function') {
            this.onCartRestored();
        }

        this._stateSnapshot = null;
    }

    // ==========================================================
    // PRICING DISPLAY HELPER
    // ==========================================================

    _getPricingDisplay(line, adjustments = []) {
        const sellingPrice = line.unitPrice?.amount || 0;
        const retailPrice = line.comparePrice?.amount || sellingPrice;
        
        const hasBulk = adjustments.some(a => 
            a.type === 'bulk_discount' || 
            a.label?.toLowerCase().includes('bulk')
        );
        
        const bulkAdjustment = adjustments.find(a => a.type === 'bulk_discount');
        const bulkPrice = bulkAdjustment?.metadata?.bulkPrice || null;
        const bulkMinQty = bulkAdjustment?.metadata?.minimumQty || null;
        const savings = bulkAdjustment?.metadata?.savings || 0;
        
        return {
            retailPrice: retailPrice,
            sellingPrice: sellingPrice,
            hasDiscount: retailPrice > sellingPrice,
            isBulk: hasBulk,
            bulkPrice: bulkPrice,
            bulkMinimumQty: bulkMinQty,
            savings: savings,
            displayRetail: `${this.currencySymbol}${this.formatPrice(retailPrice)}`,
            displaySelling: `${this.currencySymbol}${this.formatPrice(sellingPrice)}`,
            displayBulk: bulkPrice ? `${this.currencySymbol}${this.formatPrice(bulkPrice)}` : null,
            displaySavings: savings > 0 ? `${this.currencySymbol}${this.formatPrice(savings)}` : null,
            bulkMessage: bulkMinQty ? `Minimum ${bulkMinQty} items` : null
        };
    }

    _getLegacyPricingDisplay(variant, quantity) {
        const retailPrice = variant.price || 0;
        const bulkPrice = variant.bulkPrice || null;
        const bulkMinQty = variant.bulkMinimumQty || null;
        const isBulk = bulkPrice && bulkMinQty && quantity >= bulkMinQty;
        const sellingPrice = isBulk ? bulkPrice : retailPrice;
        
        return {
            retailPrice: retailPrice,
            sellingPrice: sellingPrice,
            hasDiscount: isBulk && retailPrice > sellingPrice,
            isBulk: isBulk,
            bulkPrice: bulkPrice,
            bulkMinimumQty: bulkMinQty,
            savings: isBulk ? (retailPrice - sellingPrice) * quantity : 0,
            displayRetail: `${this.currencySymbol}${this.formatPrice(retailPrice)}`,
            displaySelling: `${this.currencySymbol}${this.formatPrice(sellingPrice)}`,
            displayBulk: bulkPrice ? `${this.currencySymbol}${this.formatPrice(bulkPrice)}` : null,
            displaySavings: isBulk ? `${this.currencySymbol}${this.formatPrice((retailPrice - sellingPrice) * quantity)}` : null,
            bulkMessage: bulkMinQty ? `Minimum ${bulkMinQty} items` : null
        };
    }

    // ==========================================================
    // SHARED ENRICHMENT PIPELINE
    // ==========================================================

    _enrichCartDecisionItem(decisionItem) {
        const line = decisionItem?.items?.[0] || {};
        const adjustments = decisionItem?.adjustments || [];
        
        const sellableId = line.sellableId || 'unknown';
        const productId = String(sellableId);
        const product = this.products?.find(p => String(p.id) === productId);
        
        const pricing = this._getPricingDisplay(line, adjustments);
        
        return {
            id: productId,
            title: product?.title || `Product ${productId}`,
            image: product?.image || '',
            description: product?.description || '',
            categories: product?.categories || [],
            sku: product?.sku || '',
            quantity: line.quantity || 1,
            pricing: pricing,
            unitPrice: pricing.sellingPrice,
            comparePrice: pricing.retailPrice,
            total: line.total?.amount || 0,
            isBulk: pricing.isBulk,
            bulkPrice: pricing.bulkPrice,
            bulkMinimumQty: pricing.bulkMinimumQty,
            savings: pricing.savings,
            adjustments: adjustments,
            _raw: {
                decision: decisionItem,
                product: product,
                line: line
            }
        };
    }

    _enrichLegacyCartItem(product) {
        const variant = product.variants?.[0] || { price: product.price || 0 };
        const quantity = product.cart_quantity || 1;
        const pricing = this._getLegacyPricingDisplay(variant, quantity);
        
        return {
            id: String(product.id),
            title: product.title || `Product ${product.id}`,
            image: product.image || '',
            description: product.description || '',
            quantity: quantity,
            pricing: pricing,
            unitPrice: pricing.sellingPrice,
            comparePrice: pricing.retailPrice,
            total: pricing.sellingPrice * quantity,
            isBulk: pricing.isBulk,
            bulkPrice: pricing.bulkPrice,
            bulkMinimumQty: pricing.bulkMinimumQty,
            savings: pricing.savings,
            adjustments: [],
            _raw: { product: product, variant: variant }
        };
    }

    _getEnrichedCart() {
        const decision = this.cartService?.getCurrentDecision?.() || null;
        const cartDecision = this.state?.cartDecision || decision;

        if (this.features?.debug) {
            console.log('[TRACE] Enriching cart from decision:', cartDecision);
        }

        if (cartDecision?.items?.length > 0) {
            const items = cartDecision.items.map(item => this._enrichCartDecisionItem(item));
            const subtotal = cartDecision.totals?.subtotal?.amount || 0;
            return {
                items: items,
                subtotal: subtotal,
                totals: cartDecision.totals || {},
                from: 'decision'
            };
        }

        console.warn('[TRACE] No decision available, falling back to localStorage');
        const cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const items = cart.map(item => this._enrichLegacyCartItem(item));
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const currency = this.currencySymbol || 'R';
        
        return {
            items: items,
            subtotal: subtotal,
            totals: {
                subtotal: { amount: subtotal, currency: currency },
                total: { amount: subtotal, currency: currency },
                tax: { amount: 0, currency: currency },
                shipping: { amount: 0, currency: currency }
            },
            from: 'legacy'
        };
    }

    // ==========================================================
    // RENDER METHODS
    // ==========================================================

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

        //  KEEP: Drawer lives in hidden blocks (original architecture)
        let hiddenBlocks = document.getElementById('cartique-hidden-blocks');
        if (!hiddenBlocks) {
            hiddenBlocks = document.createElement('div');
            hiddenBlocks.id = 'cartique-hidden-blocks';
            hiddenBlocks.style.display = 'none';
            document.body.appendChild(hiddenBlocks);
        }

        hiddenBlocks.appendChild(cartSlider);

        const closeBtn = cartSlider.querySelector('#cart-close-btn');
        if (closeBtn && this.addEventListener) {
            this.addEventListener(closeBtn, 'click', () => {
                if (typeof this.closeCart === 'function') {
                    this.closeCart();
                }
            });
        }

        const checkoutBtn = cartSlider.querySelector('#checkout-btn');
        if (checkoutBtn && this.addEventListener) {
            this.addEventListener(checkoutBtn, 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.cartService && typeof this.cartService.checkout === 'function') {
                    this.cartService.checkout();
                }
            });
        }

        const viewCartBtn = cartSlider.querySelector('#view-cart-btn');
        if (viewCartBtn && this.addEventListener) {
            this.addEventListener(viewCartBtn, 'click', (e) => {
                e.preventDefault();
                if (typeof this.navigateToCartPage === 'function') {
                    this.navigateToCartPage();
                } else if (typeof this.showCartPage === 'function') {
                    this.showCartPage();
                }
            });
        }

        //  Click outside drawer (overlay) closes it — bind once
        const overlay = document.getElementById('cart-slide-overlay');
        if (overlay && !overlay.dataset.cartBound && this.addEventListener) {
            overlay.dataset.cartBound = 'true';
            this.addEventListener(overlay, 'click', () => {
                if (typeof this.closeCart === 'function') {
                    this.closeCart();
                }
            });
        }
        
        //  Prevent drawer clicks from bubbling to overlay
        if (this.addEventListener) {
            this.addEventListener(cartSlider, 'click', (e) => {
                e.stopPropagation();
            });
        }
    }


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

    async renderCartPage() {
        console.log('🔍 6. renderCartPage() called');

        const enriched = this._getEnrichedCart();
        const items = enriched.items;
        const totals = enriched.totals;

        if (this.features?.debug) {
            console.log('[TRACE] Rendered cart items:', items.length);
            console.log('[TRACE] Cart subtotal:', enriched.subtotal);
            console.log('[TRACE] Cart source:', enriched.from);
        }

        const mainContent = document.getElementById('cartique-main-content');
        if (!mainContent) {
            console.warn('Main content container not found for cart page');
            return;
        }

        const existingCartPage = document.getElementById('cartique-cart-page');
        if (existingCartPage) existingCartPage.remove();

        const cartPage = document.createElement('div');
        cartPage.id = 'cartique-cart-page';
        cartPage.className = 'cartique-cart-page';

        if (items.length === 0) {
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
            mainContent.appendChild(cartPage);
            this.attachCartPageEvents(cartPage);

            if (this.behavior) {
                this.behavior.cartView({
                    metadata: {
                        source: 'cart_page',
                        itemCount: 0,
                        subtotal: 0
                    }
                });
            }

            return;
        }

        let itemsHTML = '';

        for (const item of items) {
            const quantity = item.quantity;
            const pricing = item.pricing;
            const lineTotal = item.total;

            let priceHTML = '';
            let bulkStatusHTML = '';

            if (pricing.isBulk && pricing.retailPrice > pricing.sellingPrice) {
                priceHTML = `
                    <span class="original-price-strikethrough">${pricing.displayRetail}</span>
                    <span class="bulk-price-active">${pricing.displaySelling}</span>
                `;
                bulkStatusHTML = `
                    <div class="cart-page-bulk-status active">
                        <span class="bulk-heading-active">✓ Bulk Price Applied</span>
                        <span class="bulk-min-qty">${pricing.bulkMessage || ''}</span>
                    </div>
                `;
            } else {
                priceHTML = `
                    <span class="retail-price">${pricing.displaySelling}</span>
                `;
            }

            itemsHTML += `
                <div class="cart-page-item" data-product-id="${item.id}">
                    <div class="cart-page-item-image">
                        <img src="${item.image}" alt="${item.title}" loading="lazy">
                    </div>
                    <div class="cart-page-item-details">
                        <h3>${item.title}</h3>
                        <p class="cart-page-item-price">
                            ${priceHTML}
                        </p>
                        ${bulkStatusHTML}
                        <div class="cart-page-item-actions">
                            <div class="cart-page-quantity">
                                <button class="cart-page-qty-btn decrease-page-qty" data-id="${item.id}">−</button>
                                <input type="text" class="cart-page-qty-input" value="${quantity}" readonly data-id="${item.id}">
                                <button class="cart-page-qty-btn increase-page-qty" data-id="${item.id}">+</button>
                            </div>
                            <button class="cart-page-remove" data-id="${item.id}">Remove</button>
                        </div>
                    </div>
                    <div class="cart-page-item-total">
                        ${this.currencySymbol}${this.formatPrice(lineTotal)}
                    </div>
                </div>
            `;
        }

        const subtotalAmount = totals?.subtotal?.amount || enriched.subtotal;

        cartPage.innerHTML = `
            <div class="cart-page-container">
                <div class="cart-page-header">
                    <button class="cart-page-back" id="cart-page-back">← Back to Shop</button>
                    <h2>Shopping Cart (${items.length} ${items.length === 1 ? 'item' : 'items'})</h2>
                </div>
                <div class="cart-page-items">
                    ${itemsHTML}
                </div>
                <div class="cart-page-footer">
                    <div class="cart-page-subtotal">
                        <span>Subtotal</span>
                        <span>${this.currencySymbol}${this.formatPrice(subtotalAmount)}</span>
                    </div>
                    <button class="cart-page-checkout" id="cart-page-checkout">Proceed to Checkout</button>
                    <button class="cart-page-continue" id="cart-page-continue">Continue Shopping</button>
                </div>
            </div>
        `;

        mainContent.appendChild(cartPage);
        this.attachCartPageEvents(cartPage);

        if (this.behavior) {
            this.behavior.cartView({
                metadata: {
                    source: 'cart_page',
                    itemCount: items.length,
                    subtotal: subtotalAmount || 0
                }
            });
        }
    }

    async showCart() {
        const enriched = this._getEnrichedCart();
        const items = enriched.items;
        const subtotal = enriched.subtotal;

        if (this.features?.debug) {
            console.log('[TRACE] SLIDER ITEMS:', items.length);
            console.log('[TRACE] SLIDER SUBTOTAL:', subtotal);
        }

        const cartContainer = document.getElementById('cart-items-container');
        if (!cartContainer) {
            console.warn('Cart items container not found');
            return;
        }

        cartContainer.innerHTML = '';

        // ✅ FIX: Scope lookups to runtime drawer inside hidden blocks
        const hiddenBlocks = document.getElementById('cartique-hidden-blocks');
        const cartSlideEl = hiddenBlocks?.querySelector('#cart-slide');
        
        if (!cartSlideEl) {
            console.warn('[CartRenderer] Runtime cart drawer not found in hidden blocks');
        }
        
        const emptyMsg = cartSlideEl?.querySelector('#shopping-cart-empty');
        const viewBtn = cartSlideEl?.querySelector('#view-cart-btn');
        const checkoutBtn = cartSlideEl?.querySelector('#checkout-btn');
        
        if (emptyMsg) emptyMsg.classList.toggle('show', items.length === 0);
        if (viewBtn) viewBtn.style.display = items.length === 0 ? 'none' : 'block';
        if (checkoutBtn) checkoutBtn.style.display = items.length === 0 ? 'none' : 'block';

        for (const item of items) {
            const wrapper = this.templateHolder?.content?.getElementById('cartique-cart-item-component');
            if (!wrapper) continue;

            const cartItem = wrapper.firstElementChild?.cloneNode(true);
            if (!cartItem) continue;
            
            await this._renderCartItem(cartItem, item);
            this.addCartItemEventListeners(cartItem, item.id);
            
            cartContainer.appendChild(cartItem);
        }

        const subtotalEl = document.getElementById('subtotal');
        const subtotalCurrencyEl = document.getElementById('subtotal-currency');
        
        if (subtotalEl) subtotalEl.textContent = this.formatPrice(subtotal);
        if (subtotalCurrencyEl) subtotalCurrencyEl.textContent = this.currencySymbol || 'R';

        // ✅ KEEP: Original visibility lifecycle
        if (hiddenBlocks) {
            hiddenBlocks.style.display = 'block';
        }

        const overlay = document.getElementById('cart-slide-overlay');
        
        if (cartSlideEl) cartSlideEl.classList.add('open');
        if (overlay) overlay.style.display = 'block';
    }

    closeCart() {
        // ✅ KEEP: Original close lifecycle with scoped lookup
        const hiddenBlocks = document.getElementById('cartique-hidden-blocks');
        const cartSlideEl = hiddenBlocks?.querySelector('#cart-slide');
        const overlay = document.getElementById('cart-slide-overlay');

        if (cartSlideEl) cartSlideEl.classList.remove('open');
        if (overlay) overlay.style.display = 'none';
        
        if (hiddenBlocks) {
            setTimeout(() => {
                hiddenBlocks.style.display = 'none';
            }, 350);
        }
    }

    async _renderCartItem(cartItem, item) {
        const imgEl = cartItem.querySelector('#image');
        if (imgEl) {
            imgEl.src = item.image;
            imgEl.alt = item.title;
            imgEl.loading = 'lazy';
        }

        const titleEl = cartItem.querySelector('#title');
        if (titleEl) titleEl.textContent = item.title;

        const priceEl = cartItem.querySelector('#price');
        const salePriceEl = cartItem.querySelector('#sale_price');
        const currencyEls = cartItem.querySelectorAll('#currency');

        currencyEls.forEach(el => el.textContent = this.currencySymbol || 'R');

        const existingBulkMsg = cartItem.querySelector('.cart-bulk-status');
        if (existingBulkMsg) existingBulkMsg.remove();

        const pricing = item.pricing;

        const bulkDisplay = {
            hasBulk: pricing.isBulk,
            isBulk: pricing.isBulk,
            retailPrice: pricing.retailPrice,
            bulkPrice: pricing.bulkPrice,
            unitPrice: pricing.sellingPrice,
            minimumQty: pricing.bulkMinimumQty,
            heading: pricing.isBulk ? '✓ Bulk Price Applied' : 'BULK PRICE',
            message: pricing.bulkMessage || null,
            displayPrice: pricing.displaySelling,
            bulkDisplayPrice: pricing.displayBulk,
            staticDisplay: {
                label: 'BULK PRICE',
                price: pricing.displayBulk,
                minQty: pricing.bulkMessage
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
                        ${bulkDisplay.bulkDisplayPrice || bulkDisplay.displayPrice}
                    </div>
                    <div class="bulk-min-qty">${bulkDisplay.message || ''}</div>
                `;
                detailsDiv.appendChild(bulkStatus);
            }

            // ✅ KEEP: Raw numbers for price, currency handled by #currency span
            if (bulkDisplay.isBulk && pricing.retailPrice > pricing.sellingPrice) {
                if (priceEl) {
                    priceEl.textContent = this.formatPrice(pricing.retailPrice);
                    priceEl.style.textDecoration = 'line-through';
                    priceEl.style.color = '#6c757d';
                    priceEl.style.fontSize = '14px';
                    priceEl.style.opacity = '0.7';
                }
                
                if (salePriceEl) {
                    salePriceEl.textContent = this.formatPrice(pricing.sellingPrice);
                    salePriceEl.style.display = 'inline';
                    salePriceEl.style.color = '#28a745';
                    salePriceEl.style.fontWeight = 'bold';
                    salePriceEl.style.fontSize = '18px';
                    
                    const parentSpan = salePriceEl.parentElement;
                    if (parentSpan) parentSpan.style.display = 'inline';
                }
            } else {
                if (priceEl) {
                    priceEl.textContent = this.formatPrice(pricing.sellingPrice);
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
                priceEl.textContent = this.formatPrice(pricing.sellingPrice);
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

        const quantityInput = cartItem.querySelector('.quantity');
        if (quantityInput) {
            quantityInput.value = item.quantity;
            quantityInput.id = `quantity_${item.id}`;
        }
    }

    async updateCartItem(cartItem, product) {
        const item = this._enrichLegacyCartItem(product);
        await this._renderCartItem(cartItem, item);
    }

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

    removeCartItem(event) {
        const productId = parseInt(event.target.id);
        if (this.cartService && typeof this.cartService.removeItem === 'function') {
            this.cartService.removeItem(productId);
        } else {
            let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
            cart = cart.filter(product => product.id !== productId);
            localStorage.setItem('cartiqueCart', JSON.stringify(cart));
            if (this.cartService?.syncWithKernel) {
                this.cartService.syncWithKernel();
            }
        }
        this.showCart();
    }

    decreaseQtyItem(event) {
        const productId = parseInt(event.target.id.replace('decrease_quantity_', ''));
        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const index = cart.findIndex(item => item.id === productId);

        if (index !== -1) {
            const newQuantity = cart[index].cart_quantity - 1;
            if (this.cartService && typeof this.cartService.updateQuantity === 'function') {
                this.cartService.updateQuantity(productId, newQuantity);
            } else {
                if (newQuantity > 0) {
                    cart[index].cart_quantity = newQuantity;
                } else {
                    cart.splice(index, 1);
                }
                localStorage.setItem('cartiqueCart', JSON.stringify(cart));
                if (this.cartService?.syncWithKernel) {
                    this.cartService.syncWithKernel();
                }
            }
        }
        this.showCart();
    }

    async increaseQtyItem(event) {
        const productId = parseInt(event.target.id.replace('increase_quantity_', ''));
        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const index = cart.findIndex(item => item.id === productId);

        if (index !== -1) {
            const newQuantity = cart[index].cart_quantity + 1;
            
            const product = this.products?.find(p => p.id === productId);
            if (product) {
                let variant = null;
                try {
                    variant = this.adapter?.resolveVariant(product, product.variantId);
                } catch (e) {
                    variant = { inventory: 10 };
                }
                let inventory;
                try {
                    inventory = await this.adapter?.resolveInventory({
                        sellable: product,
                        variant: variant
                    });
                } catch (e) {
                    inventory = { quantity: 10 };
                }
                const availableStock = inventory?.quantity || 0;
                if (newQuantity > availableStock) {
                    if (typeof this.showStockAlert === 'function') {
                        this.showStockAlert(
                            `Cannot add more. Only ${availableStock} available in total.`
                        );
                    }
                    return;
                }
            }
            
            if (this.cartService && typeof this.cartService.updateQuantity === 'function') {
                this.cartService.updateQuantity(productId, newQuantity);
            } else {
                cart[index].cart_quantity = newQuantity;
                localStorage.setItem('cartiqueCart', JSON.stringify(cart));
                if (this.cartService?.syncWithKernel) {
                    this.cartService.syncWithKernel();
                }
            }
        }
        this.showCart();
    }

    /**
     * Navigate to full cart page from any context
     */
        navigateToCartPage() {
        console.log('🔍 Navigating to cart page...');
        
        // Snapshot browsing state only — cart navigation must never restore single product view
        this.snapshotState();
        
        // Cart page owns the viewport. Kill single product ownership.
        if (this.state) {
            this.state.singleProductViewActive = false;
            this.state.selectedProduct = null;
            this.state.currentView = 'cart';
        }
        
        // Close drawer if open
        this.closeCart();
        
        // Hide all storefront UIs — cart page owns the viewport
        const productDisplays = document.getElementById('cartique-product-displays');
        const sidebar = document.getElementById('cartique-sidebar');
        const menuAnchor = document.getElementById('cartique-menu-anchor-top');
        const controls = document.getElementById('cartique-controls');
        const singleProductView = document.getElementById('single-product-view-container');
        const stickyNav = document.getElementById('cartique-sticky-nav');
        
        if (productDisplays) productDisplays.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
        if (menuAnchor) menuAnchor.style.display = 'none';
        if (controls) controls.style.display = 'none';
        if (singleProductView) singleProductView.style.display = 'none';
        if (stickyNav) stickyNav.style.display = 'none';
        
        // Make main content full width
        const mainContent = document.getElementById('cartique-main-content');
        if (mainContent) {
            mainContent.classList.add('cartique-full-width');
        }
        
        // Remove any active wishlist page — cart owns the viewport
        const wishlistPage = document.getElementById('cartique-wishlist-page');
        if (wishlistPage) {
            if (this.features?.debug) {
                console.log('[TRACE][CART] Removing active wishlist page');
            }
            wishlistPage.remove();
        }
        
        this.renderCartPage();
        
        // Scroll to top
        requestAnimationFrame(() => {
            const cartPage = document.getElementById('cartique-cart-page');
            if (cartPage) {
                cartPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (mainContent) mainContent.scrollTop = 0;
        });
    }


    showCartPage() {
        console.log('🔍 5. showCartPage() called (legacy)');
        this.navigateToCartPage();
    }

         closeCartPage() {
        // Clear #cart hash from URL — sync URL state with UI state
        window.history.replaceState(null, '', window.location.pathname + window.location.search);

        const cartPage = document.getElementById('cartique-cart-page');
        if (cartPage) cartPage.remove();

        // Restore browsing context (filters, search, scroll)
        this.restoreState();
        
        // Cart exit always returns to storefront grid. Never restore single product view.
        const singleProductViewEl = document.getElementById('single-product-view-container');
        const productDisplays = document.getElementById('cartique-product-displays');
        const sidebar = document.getElementById('cartique-sidebar');
        const menuAnchor = document.getElementById('cartique-menu-anchor-top');
        const controls = document.getElementById('cartique-controls');
        const footer = document.getElementById('cartique-product-footer');
        
        if (singleProductViewEl) singleProductViewEl.style.display = 'none';
        if (productDisplays) productDisplays.style.display = 'block';
        if (sidebar) sidebar.style.display = this.features?.sidebarDisplay;
        if (menuAnchor) menuAnchor.style.display = '';
        if (controls) controls.style.display = '';
        if (footer) footer.style.display = this.features?.footerDisplay;
        
        this.state.singleProductViewActive = false;
        this.state.selectedProduct = null;
        this.state.currentView = 'products';
        
        const mainContent = document.getElementById('cartique-main-content');
        if (mainContent) {
            if (this.features?.sidebarDisplay === 'none') {
                mainContent.classList.add('cartique-full-width');
            } else {
                mainContent.classList.remove('cartique-full-width');
            }
        }
    }

    


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
                this.addEventListener(btn, 'click', async (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    console.log('[CartRenderer] Decrease page quantity:', productId);
                    
                    if (this.cartService && typeof this.cartService.updateQuantity === 'function') {
                        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
                        const index = cart.findIndex(item => item.id === productId);
                        if (index !== -1) {
                            const newQty = cart[index].cart_quantity - 1;
                            await this.cartService.updateQuantity(productId, newQty);
                            await this.renderCartPage();
                        }
                    }
                });
            }
        });

        cartPage.querySelectorAll('.increase-page-qty').forEach(btn => {
            if (this.addEventListener) {
                this.addEventListener(btn, 'click', async (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    console.log('[CartRenderer] Increase page quantity:', productId);
                    
                    if (this.cartService && typeof this.cartService.updateQuantity === 'function') {
                        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
                        const index = cart.findIndex(item => item.id === productId);
                        if (index !== -1) {
                            const newQty = cart[index].cart_quantity + 1;
                            
                            const product = this.products?.find(p => p.id === productId);
                            if (product) {
                                let variant = null;
                                try {
                                    variant = this.adapter?.resolveVariant(product, product.variantId);
                                } catch (e) {
                                    variant = { inventory: 10 };
                                }
                                let inventory;
                                try {
                                    inventory = await this.adapter?.resolveInventory({
                                        sellable: product,
                                        variant: variant
                                    });
                                } catch (e) {
                                    inventory = { quantity: 10 };
                                }
                                const availableStock = inventory?.quantity || 0;
                                if (newQty > availableStock) {
                                    if (typeof this.showStockAlert === 'function') {
                                        this.showStockAlert(
                                            `Cannot add more. Maximum available: ${availableStock}`
                                        );
                                    }
                                    return;
                                }
                            }
                            
                            await this.cartService.updateQuantity(productId, newQty);
                            await this.renderCartPage();
                        }
                    }
                });
            }
        });

        cartPage.querySelectorAll('.cart-page-remove').forEach(btn => {
            if (this.addEventListener) {
                this.addEventListener(btn, 'click', async (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    console.log('[CartRenderer] Remove page item:', productId);
                    
                    if (this.cartService && typeof this.cartService.removeItem === 'function') {
                        await this.cartService.removeItem(productId);
                        await this.renderCartPage();
                    }
                });
            }
        });

        // ✅ KEEP: Checkout button with fallback
        const checkoutBtn = cartPage.querySelector('#cart-page-checkout');
        if (checkoutBtn && this.addEventListener) {
            this.addEventListener(checkoutBtn, 'click', async (e) => {
                e.preventDefault();
                console.log('[CartRenderer] Checkout clicked');
                if (this.cartService && typeof this.cartService.checkout === 'function') {
                    await this.cartService.checkout();
                } else if (this.features?.checkoutUrl) {
                    console.log('[CartRenderer] Redirecting to checkout:', this.features.checkoutUrl);
                    window.location.href = this.features.checkoutUrl;
                } else {
                    console.warn('[CartRenderer] No checkout method available');
                    alert('Checkout not configured');
                }
            });
        }
    }

    decreasePageQty(productId) {
        console.warn('[CartRenderer] decreasePageQty is deprecated. Use CartService.updateQuantity instead.');
        if (this.cartService && typeof this.cartService.updateQuantity === 'function') {
            let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
            const index = cart.findIndex(item => item.id === productId);
            if (index !== -1) {
                const newQty = cart[index].cart_quantity - 1;
                this.cartService.updateQuantity(productId, newQty);
            }
        } else {
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
    }

    async increasePageQty(productId) {
        console.warn('[CartRenderer] increasePageQty is deprecated. Use CartService.updateQuantity instead.');
        if (this.cartService && typeof this.cartService.updateQuantity === 'function') {
            let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
            const index = cart.findIndex(item => item.id === productId);
            if (index !== -1) {
                const newQty = cart[index].cart_quantity + 1;
                
                const product = this.products?.find(p => p.id === productId);
                if (product) {
                    let variant = null;
                    try {
                        variant = this.adapter?.resolveVariant(product, product.variantId);
                    } catch (e) {
                        variant = { inventory: 10 };
                    }
                    let inventory;
                    try {
                        inventory = await this.adapter?.resolveInventory({
                            sellable: product,
                            variant: variant
                        });
                    } catch (e) {
                        inventory = { quantity: 10 };
                    }
                    const availableStock = inventory?.quantity || 0;
                    if (newQty > availableStock) {
                        if (typeof this.showStockAlert === 'function') {
                            this.showStockAlert(
                                `Cannot add more. Maximum available: ${availableStock}`
                            );
                        }
                        return;
                    }
                }
                
                this.cartService.updateQuantity(productId, newQty);
            }
        } else {
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
                    variant = { inventory: 10 };
                }
                let inventory;
                try {
                    inventory = await this.adapter?.resolveInventory({
                        sellable: product,
                        variant: variant
                    });
                } catch (e) {
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
    }

    removePageItem(productId) {
        console.warn('[CartRenderer] removePageItem is deprecated. Use CartService.removeItem instead.');
        if (this.cartService && typeof this.cartService.removeItem === 'function') {
            this.cartService.removeItem(productId);
        } else {
            let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('cartiqueCart', JSON.stringify(cart));
        }
    }
}