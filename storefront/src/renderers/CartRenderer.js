/**
 * @semantq/storefront
 *
 * CartRenderer — Cart presentation logic
 *
 * Migrated from: cartique/storefront/src/Storefront.js
 * Phase 1: Pure extraction. No refactoring.
 *
 * TODO: Phase 2 — Move bulk pricing logic to PricingService.
 */

export default class CartRenderer {
    constructor(context) {
        Object.assign(this, context);
    }

    /**
     * Renders the cart slider
     */
    renderCartSlider() {
        const wrapper = this.templateHolder.content.getElementById('cartique-cart-slider-component');
        if (!wrapper) return;

        const cartSlider = wrapper.firstElementChild.cloneNode(true);
        const hiddenBlocks = document.getElementById('cartique-hidden-blocks');
        
        if (hiddenBlocks) {
            hiddenBlocks.appendChild(cartSlider);
            
            // Close button
            const closeBtn = cartSlider.querySelector('#cart-close-btn');
            if (closeBtn) {
                this.addEventListener(closeBtn, 'click', this.closeCart.bind(this));
            }

            // FIX: Checkout - use the button directly, not the link
            const checkoutBtn = cartSlider.querySelector('#checkout-btn');
            if (checkoutBtn) {
                this.addEventListener(checkoutBtn, 'click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.checkout();
                });
            }

            // View Cart button
            const viewCartBtn = cartSlider.querySelector('#view-cart-btn');
            if (viewCartBtn) {
                this.addEventListener(viewCartBtn, 'click', (e) => {
                    e.preventDefault();
                    this.showCartPage();
                });
            }
        }
    }

    /**
     * Renders the cart item template
     */
    renderCartItemTemplate() {
        const wrapper = this.templateHolder.content.getElementById('cartique-cart-item-component');
        if (!wrapper) return;

        const itemTemplate = wrapper.firstElementChild.cloneNode(true);
        const hiddenBlocks = document.getElementById('cartique-hidden-blocks');
        
        if (hiddenBlocks) {
            // FIX: Add a class to identify this as the template and hide it
            itemTemplate.classList.add('cart-item-template');
            itemTemplate.style.display = 'none';
            hiddenBlocks.appendChild(itemTemplate);
        }
    }

    /**
     * Renders the full cart page
     */
    renderCartPage() {
        console.log('🔍 6. renderCartPage() called');

        const cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const mainContent = document.getElementById('cartique-main-content');
        
        if (!mainContent) return;

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
            
            cart.forEach(product => {
                // Get variant for pricing
                const variant = this.findVariant(product.variantId || product.id);
                const quantity = product.cart_quantity || 1;
                
                // Calculate pricing with bulk support
                const pricing = await this.adapter.resolvePricing({
                    sellable: { variants: [variant] },
                    variant: variant,
                    quantity: quantity,
                    customer: this.customer,
                    place: this.place
                });
                
                const itemTotal = pricing.unitPrice * quantity;
                subtotal += itemTotal;
                
                // Get bulk display data
                const bulkDisplay = this.getBulkPricingDisplay(variant, quantity);
                
                // Build price HTML with bulk info
                let priceHTML = '';
                let bulkStatusHTML = '';
                
                if (bulkDisplay && bulkDisplay.hasBulk) {
                    if (bulkDisplay.isBulk) {
                        // Bulk is active - show strikethrough retail + bulk price
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
                        // Bulk available but not yet active
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
                    // No bulk pricing - standard display
                    priceHTML = `
                        <span class="retail-price">${this.currencySymbol}${this.formatPrice(product.price || variant?.price || 0)}</span>
                    `;
                }
                
                itemsHTML += `
                    <div class="cart-page-item" data-product-id="${product.id}" data-variant-id="${product.variantId || ''}">
                        <div class="cart-page-item-image">
                            <img src="${product.image}" alt="${product.title}">
                        </div>
                        <div class="cart-page-item-details">
                            <h3>${product.title}</h3>
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
            });
            
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

        // Attach event listeners
        this.attachCartPageEvents(cartPage);
    }

    /**
     * Shows the cart slider
     */
    showCart() {
        const cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const cartContainer = document.getElementById('cart-items-container');
        
        if (!cartContainer) return;

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
        cart.forEach(product => {
            const wrapper = this.templateHolder.content.getElementById('cartique-cart-item-component');
            if (!wrapper) return;

            const cartItem = wrapper.firstElementChild.cloneNode(true);
            
            // Update product data
            this.updateCartItem(cartItem, product);
            
            // Add event listeners
            this.addCartItemEventListeners(cartItem, product.id);
            
            // Calculate subtotal with bulk pricing
            const variant = this.findVariant(product.variantId || product.id);
            const quantity = product.cart_quantity || 1;
            const pricing = this.getUnitPrice(variant, quantity);
            subtotal += pricing.unitPrice * quantity;
            
            cartContainer.appendChild(cartItem);
        });

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
        
        // Hide hidden blocks after transition completes
        if (hiddenBlocks) {
            setTimeout(() => {
                hiddenBlocks.style.display = 'none';
            }, 350); // Match the CSS transition duration
        }
    }

    /**
     * Updates a cart item in the slider
     */
    updateCartItem(cartItem, product) {
        // Update image
        const imgEl = cartItem.querySelector('#image');
        if (imgEl) {
            imgEl.src = product.image || '';
            imgEl.alt = product.title || '';
        }

        // Update title
        const titleEl = cartItem.querySelector('#title');
        if (titleEl) titleEl.textContent = product.title || '';

        // Get variant - use product.variantId or find from product
        let variant = null;
        if (product.variantId) {
            variant = this.findVariant(product.variantId);
        }
        if (!variant && product.variants && product.variants.length > 0) {
            variant = product.variants[0];
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

        // Calculate pricing
        const pricing = this.getUnitPrice(variant, quantity);
        const totalPrice = pricing.unitPrice * quantity;

        // Get price elements
        const priceEl = cartItem.querySelector('#price');
        const salePriceEl = cartItem.querySelector('#sale_price');
        const currencyEls = cartItem.querySelectorAll('#currency');

        // Update currency symbols
        currencyEls.forEach(el => el.textContent = this.currencySymbol || 'R');

        // --- BULK PRICING: Cart Slide-in ---
        // Remove existing bulk status message
        const existingBulkMsg = cartItem.querySelector('.cart-bulk-status');
        if (existingBulkMsg) existingBulkMsg.remove();

        // Check if variant has bulk pricing
        const bulkDisplay = this.getBulkPricingDisplay(variant, quantity);

        if (bulkDisplay && bulkDisplay.hasBulk) {
            // Find the cart item details container
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

            // Update price display with strikethrough when bulk is active
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
                // Retail price - show normally
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
            // No bulk pricing - standard display
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
        // --- END BULK PRICING ---

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

        if (removeBtn) {
            removeBtn.id = productId;
            this.addEventListener(removeBtn, 'click', (e) => this.removeCartItem(e));
        }

        if (decreaseBtn) {
            decreaseBtn.id = `decrease_quantity_${productId}`;
            this.addEventListener(decreaseBtn, 'click', (e) => this.decreaseQtyItem(e));
        }

        if (increaseBtn) {
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
    increaseQtyItem(event) {
        const productId = parseInt(event.target.id.replace('increase_quantity_', ''));
        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const index = cart.findIndex(item => item.id === productId);

        if (index !== -1) {
            const product = this.products.find(p => p.id === productId);
            const availableStock = product ? this.getProductStock(product) : 0;
            const newQuantity = cart[index].cart_quantity + 1;
            
            if (newQuantity > availableStock) {
                this.showStockAlert(
                    `Cannot add more. Only ${availableStock} available in total.`
                );
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
        // Close the slide-in cart
        console.log('🔍 5. showCartPage() called');

        this.closeCart();
        
        // Hide product displays and sidebar
        const productDisplays = document.getElementById('cartique-product-displays');
        const sidebar = document.getElementById('cartique-sidebar');
        const menuAnchor = document.getElementById('cartique-menu-anchor-top');
        const controls = document.getElementById('cartique-controls');
        
        if (productDisplays) productDisplays.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
        if (menuAnchor) menuAnchor.style.display = 'none';
        if (controls) controls.style.display = 'none';
        
        // Make main content full width
        const mainContent = document.getElementById('cartique-main-content');
        if (mainContent) {
            mainContent.classList.add('cartique-full-width');
        }
        
        this.singleProductViewActive = true;
        this.renderCartPage();
        
        // FIX: Scroll to top of cart page
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

        // Check if we came from single product view
        const singleProductView = document.getElementById('single-product-view-container');
        const wasInSingleView = singleProductView && singleProductView.style.display === 'none' && 
                                singleProductView.innerHTML !== '';
        
        if (wasInSingleView) {
            // Return to single product view
            if (singleProductView) singleProductView.style.display = 'block';
        } else {
            // Return to product grid
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
        }
        
        // Restore full-width state
        const mainContent = document.getElementById('cartique-main-content');
        if (mainContent) {
            if (this.features.sidebarDisplay === 'none' || wasInSingleView) {
                mainContent.classList.add('cartique-full-width');
            } else {
                mainContent.classList.remove('cartique-full-width');
            }
        }

        if (!wasInSingleView) {
            this.singleProductViewActive = false;
        }
    }

    /**
     * Attaches events to cart page
     */
    attachCartPageEvents(cartPage) {
        // Back button
        const backBtn = cartPage.querySelector('#cart-page-back');
        if (backBtn) {
            this.addEventListener(backBtn, 'click', () => this.closeCartPage());
        }

        // Continue shopping buttons
        const continueBtns = cartPage.querySelectorAll('#cart-page-back-btn, #cart-page-continue');
        continueBtns.forEach(btn => {
            this.addEventListener(btn, 'click', () => this.closeCartPage());
        });

        // Quantity decrease buttons
        cartPage.querySelectorAll('.decrease-page-qty').forEach(btn => {
            this.addEventListener(btn, 'click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                this.decreasePageQty(productId);
                this.renderCartPage();
            });
        });

        // Quantity increase buttons
        cartPage.querySelectorAll('.increase-page-qty').forEach(btn => {
            this.addEventListener(btn, 'click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                this.increasePageQty(productId);
                this.renderCartPage();
            });
        });

        // Remove buttons
        cartPage.querySelectorAll('.cart-page-remove').forEach(btn => {
            this.addEventListener(btn, 'click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                this.removePageItem(productId);
                this.renderCartPage();
            });
        });

        // Checkout button
        const checkoutBtn = cartPage.querySelector('#cart-page-checkout');
        if (checkoutBtn) {
            this.addEventListener(checkoutBtn, 'click', (e) => {
                e.preventDefault();
                this.checkout();
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
    increasePageQty(productId) {
        let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
        const index = cart.findIndex(item => item.id === productId);

        if (index !== -1) {
            const product = this.products.find(p => p.id === productId);
            const availableStock = product ? this.getProductStock(product) : 0;
            const newQuantity = cart[index].cart_quantity + 1;
            
            if (newQuantity > availableStock) {
                this.showStockAlert(
                    `Cannot add more. Maximum available: ${availableStock}`
                );
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