/**
 * @semantq/storefront
 *
 * ProductRenderer — Product presentation logic
 *
 * Phase 2D: Direct CommercialDecision consumption — no legacy wrapper.
 * Phase 3.6.1: Renderer stabilization — container creation and fallbacks.
 * Phase 3.6.2: Safe context method checks.
 * Phase 3.6.3: Callback-based UI interactions.
 * Phase 3.7.1: Shared state integration.
 * Phase 3.7: Add to Cart pipeline, Back navigation, FOUC prevention.
 * Phase 2: Theme Component System integration.
 * Phase 3.8.2: Bulk pricing display on product UI.
 *
 * Single ownership: Layout + Product Display
 */

export default class ProductRenderer {
    constructor(context = {}) {
        Object.assign(this, context);
        
        // Validate shared state
        if (!this.state) {
            throw new Error('ProductRenderer requires shared state object');
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
        
        // Ensure debounce exists
        if (!this.debounce) {
            this.debounce = (func, wait, immediate = false) => {
                let timeout;
                return function executedFunction(...args) {
                    const context = this;
                    const later = () => {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    const callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            };
        }
        
        // CALLBACK CONTRACT
        this.onSearch = null;
        this.onSort = null;
        this.onBackToList = null;
        this.onFilterChange = null;
        this.onClearFilters = null;
        this.onLayoutChange = null;
        
        // THEME COMPONENTS
        this.themeManager = context.themeManager || null;
        this.componentRegistry = context.componentRegistry || null;
    }

    // ==========================================================
    // BULK PRICING DISPLAY HELPER
    // ==========================================================

    /**
     * Get bulk pricing display data from product variant
     * @param {Object} variant - Product variant
     * @param {number} quantity - Optional quantity for bulk status
     * @returns {Object} Bulk pricing display data
     */
    _getBulkPricingDisplay(variant, quantity = 0) {
        const defaultDisplay = {
            hasBulk: false,
            isBulk: false,
            retailPrice: variant?.price || 0,
            bulkPrice: null,
            unitPrice: variant?.price || 0,
            minimumQty: null,
            heading: null,
            message: null,
            displayPrice: null,
            bulkDisplayPrice: null,
            staticDisplay: {
                label: null,
                price: null,
                minQty: null
            }
        };

        if (!variant) return defaultDisplay;

        const retailPrice = variant.price || 0;
        const bulkPrice = variant.bulkPrice;
        const minimumQty = variant.bulkMinimumQty;
        const hasBulk = bulkPrice !== null && bulkPrice !== undefined && minimumQty !== null;
        const isBulk = hasBulk && quantity >= minimumQty;
        const unitPrice = isBulk ? bulkPrice : retailPrice;

        if (!hasBulk) {
            return defaultDisplay;
        }

        return {
            hasBulk: hasBulk,
            isBulk: isBulk,
            retailPrice: retailPrice,
            bulkPrice: bulkPrice,
            unitPrice: unitPrice,
            minimumQty: minimumQty,
            heading: isBulk ? '✓ Bulk Price Applied' : 'BULK PRICE',
            message: `Minimum ${minimumQty} items`,
            displayPrice: `${this.currencySymbol}${this.formatPrice(unitPrice)} each`,
            bulkDisplayPrice: `${this.currencySymbol}${this.formatPrice(bulkPrice)} each`,
            staticDisplay: {
                label: 'BULK PRICE',
                price: `${this.currencySymbol}${this.formatPrice(bulkPrice)} each`,
                minQty: `Minimum ${minimumQty} items`
            }
        };
    }


    /**
     * Synchronize all wishlist heart buttons with current state
     * Called after wishlist changes via StorefrontCore callback
     */
    updateWishlistStates() {
      if (!this.wishlist) return;

      const hearts = document.querySelectorAll('.cartique-wishlist-heart');
      hearts.forEach((button) => {
        const productId = button.dataset.productId;
        if (!productId) return;

        const isSaved = this.wishlist.has(productId);
        this._updateWishlistHeart(button, isSaved);
      });
    }

    /**
     * Create a wishlist heart button for a product
     * @param {Object} product - Product with .id property
     * @returns {HTMLElement|null} Heart button element
     */
    /**
     * Create Cartique-native SVG heart icon
     * @param {boolean} isSaved - Whether heart should be filled
     * @returns {SVGElement} SVG heart icon
     */
    _createWishlistHeartIcon(isSaved = false) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('width', '20');
      svg.setAttribute('height', '20');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.classList.add('cartique-heart-icon');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute(
        'd',
        'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z'
      );
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '1.8');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');

      if (isSaved) {
        path.setAttribute('fill', 'currentColor');
      } else {
        path.setAttribute('fill', 'none');
      }

      svg.appendChild(path);
      return svg;
    }

    /**
     * Update an existing wishlist heart button
     * @param {HTMLElement} button - The heart button element
     * @param {boolean} isSaved - Whether heart should be filled
     */
    _updateWishlistHeart(button, isSaved) {
      if (!button) return;

      button.setAttribute('aria-label', isSaved ? 'Remove from wishlist' : 'Add to wishlist');
      button.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
      button.classList.toggle('is-saved', isSaved);

      const existingIcon = button.querySelector('.cartique-heart-icon');
      if (existingIcon) existingIcon.remove();

      button.appendChild(this._createWishlistHeartIcon(isSaved));
    }

    _createWishlistHeart(product) {
      if (!this.wishlist) return null;

      const productId = product.id;
      const isSaved = this.wishlist.has(productId);

      const heart = document.createElement('button');
      heart.className = 'cartique-wishlist-heart';
      heart.dataset.productId = productId;
      heart.type = 'button';
      heart.setAttribute('aria-label', isSaved ? 'Remove from wishlist' : 'Add to wishlist');
      heart.setAttribute('aria-pressed', isSaved ? 'true' : 'false');

      heart.appendChild(this._createWishlistHeartIcon(isSaved));

      if (isSaved) {
        heart.classList.add('is-saved');
      }

      heart.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!this.wishlist) return;

        const result = this.wishlist.toggle(productId);
        if (result.success) {
          const nowSaved = this.wishlist.has(productId);
          this._updateWishlistHeart(heart, nowSaved);

          heart.classList.remove('heart-pop');
          void heart.offsetWidth;
          heart.classList.add('heart-pop');
        }
      });

      return heart;
    }

    renderEmptyState({
        title = 'No products found',
        message = '',
        action = 'Return to shop',
        containerId = null
    } = {}) {

        let container;

        if (containerId) {
            container = document.getElementById(containerId);
        }

        if (!container) {
            container =
                document.getElementById('single-product-view-container') ||
                document.getElementById('cartique-product-displays') ||
                document.getElementById('cartique-main-content');
        }

        if (!container) {
            console.warn('[ProductRenderer] Empty state container missing');
            return;
        }

        container.innerHTML = `
            <div class="no-results-msg"
                 style="width:100%; text-align:center; padding:4rem 1rem;">

                <h2>${title}</h2>

                <p style="font-size:1.2rem;color:#555;margin:1rem 0;">
                    ${message}
                </p>

                <button
                    onclick="window.location.href=document.querySelector('base')?.href || '/'"
                    style="
                        cursor:pointer;
                        background:none;
                        border:none;
                        border-bottom:1px solid #000;
                        font-weight:600;
                    ">
                    ${action}
                </button>

            </div>
        `;
    }

    async renderSingleProduct(product) {
        if (!product) {
            console.error('Product not found');
            return this.renderEmptyState({
                title: 'Product not found',
                message: 'The product you are looking for does not exist.'
            });
        }

        // Track product view
        if (this.behavior) {
            this.behavior.productView(product.id, {
                metadata: { source: 'single_product' }
            });
        }

        // Save current state
        this.previousViewState = {
            layout: this.state.currentLayout,
            searchQuery: this.state.currentSearchQuery,
            sortType: this.state.currentSortType,
            scrollPosition: window.scrollY
        };

        // Hide main views and controls
        const productDisplays = document.getElementById('cartique-product-displays');
        const sidebar = document.getElementById('cartique-sidebar');
        const controls = document.getElementById('cartique-controls');
        const menuAnchor = document.getElementById('cartique-menu-anchor-top');
        const footer = document.getElementById('cartique-product-footer');

        if (productDisplays) productDisplays.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
        if (controls) controls.style.display = 'none';
        if (menuAnchor) menuAnchor.style.display = 'none';
        if (footer) footer.style.display = 'none';
        
        // Make main content full width
        const mainContent = document.getElementById('cartique-main-content');
        if (mainContent) {
            mainContent.classList.add('cartique-full-width');
        }
        
        this.state.singleProductViewActive = true;
        this.singleProductViewActive = true; // Legacy alias
        
        // Render the single product view
        let container = document.getElementById('single-product-view-container');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'single-product-view-container';
            const mainContentEl = document.getElementById('cartique-main-content');
            if (mainContentEl) {
                mainContentEl.appendChild(container);
            } else {
                document.body.appendChild(container);
            }
        }

        container.innerHTML = '';
        
        const productView = document.createElement('div');
        productView.className = 'single-product-view';
        
        // --- BULK PRICING: Single Product View ---
        let variant = null;
        try {
            variant = this.adapter?.getSelectedVariant(product);
        } catch (e) {
            console.warn('Failed to get variant:', e.message);
            variant = { price: product.price || 0 };
        }
        
        // Get bulk pricing display for product UI
        const bulkDisplayUI = this._getBulkPricingDisplay(variant);
        
        let decision;
        try {
            decision = await this.adapter?.resolvePricing({
                sellable: product,
                variant: variant,
                quantity: 1,
                customer: this.customer,
                place: this.place
            });
        } catch (e) {
            console.warn('Pricing resolution failed:', e.message);
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
        const savings = bulkAdjustment?.metadata?.savings || 0;

        const bulkDisplay = {
            hasBulk: hasBulk,
            isBulk: hasBulk,
            retailPrice: retailPrice,
            bulkPrice: bulkPrice,
            unitPrice: unitPrice,
            minimumQty: bulkMinQty,
            heading: hasBulk ? 'Bulk Price Applied' : 'BULK PRICE',
            message: bulkMinQty ? `Minimum ${bulkMinQty} items` : null,
            displayPrice: `${this.currencySymbol}${this.formatPrice(unitPrice)} each`,
            bulkDisplayPrice: bulkPrice ? `${this.currencySymbol}${this.formatPrice(bulkPrice)} each` : null,
            staticDisplay: {
                label: 'BULK PRICE',
                price: bulkPrice ? `${this.currencySymbol}${this.formatPrice(bulkPrice)} each` : null,
                minQty: bulkMinQty ? `Minimum ${bulkMinQty} items` : null
            }
        };
        
        // Build price HTML with bulk section
        let priceHTML = `
            <div class="price-container">
                ${product.sale_price && product.original_price ? `
                    <span class="original-price">${this.currencySymbol}${this.formatPrice(product.original_price)}</span>
                    <span class="sale-price">${this.currencySymbol}${this.formatPrice(product.sale_price)}</span>
                ` : product.sale_price ? `
                    <span class="original-price">${this.currencySymbol}${this.formatPrice(product.price)}</span>
                    <span class="sale-price">${this.currencySymbol}${this.formatPrice(product.sale_price)}</span>
                ` : `
                    <span class="price">${this.currencySymbol}${this.formatPrice(product.price)}</span>
                `}
                ${hasBulk && savings > 0 ? `<span class="savings-badge">Save ${this.currencySymbol}${this.formatPrice(savings)}</span>` : ''}
            </div>
        `;
        
        // Add bulk pricing section if available (from cart decision)
        if (bulkDisplay && bulkDisplay.hasBulk && bulkDisplay.staticDisplay) {
            priceHTML += `
                <div class="cartique-bulk-pricing single-product">
                    <div class="bulk-header">${bulkDisplay.heading || 'BULK PRICE'}</div>
                    <div class="bulk-price-row">
                        <span class="bulk-price">${bulkDisplay.bulkDisplayPrice || ''}</span>
                    </div>
                    <div class="bulk-min-row">
                        <span class="bulk-min-qty">${bulkDisplay.message || ''}</span>
                    </div>
                </div>
            `;
        }
        
        // Add bulk pricing display from product variant (shown before purchase)
        if (bulkDisplayUI && bulkDisplayUI.hasBulk) {
            priceHTML += `
                <div class="cartique-bulk-pricing product-display single-product">
                    <div class="bulk-info">
                        <span class="bulk-label">Bulk Price Available</span>
                        <span class="bulk-price">${bulkDisplayUI.bulkDisplayPrice}</span>
                        <span class="bulk-min-qty">${bulkDisplayUI.message}</span>
                    </div>
                </div>
            `;
        }
        // --- END BULK PRICING ---
        
        productView.innerHTML = `
            <button class="back-to-products">← Back to Products</button>
            <div class="product-content-wrapper">
                <div class="product-image-column">
                    <div class="product-image-container">
                        <img src="${product.image || ''}" alt="${product.title || ''}" loading="lazy">
                    </div>
                </div>
                <div class="product-info-column">
                    <div class="product-meta">
                        <h2>${product.title || ''}</h2>
                        ${priceHTML}
                        <p class="product-description">${product.description || ''}</p>
                    </div>
                    <button class="spv-cartique_add_to_cart" data-product-id="${product.id}">ADD TO CART</button>
                </div>
            </div>
            <div class="product-tabs-container">
                <div class="product-tabs-header">
                    <button class="tab-button" data-tab="details">Product Details</button>
                    <button class="tab-button active" data-tab="reviews">Reviews</button>
                </div>
                <div class="tab-content" data-tab-content="details">
                    ${this.renderProductDetails(product)}
                </div>
                <div class="tab-content active" data-tab-content="reviews">
                    ${this.renderProductReviews(product)}
                </div>
            </div>
        `;

        // Back button — uses onBackToList callback
        const backBtn = productView.querySelector('.back-to-products');
        if (backBtn) {
            backBtn.onclick = async (e) => {
                e.preventDefault();
                
                if (this.features?.debug) {
                    console.log('[TRACE] Back button clicked');
                    console.trace();
                }
                
                if (typeof this.onBackToList === 'function') {
                    await this.onBackToList();
                } else {
                    console.warn('[TRACE] this.onBackToList is not a function');
                }
            };
        }

        // Add to Cart button — uses dataset.productId
        const addToCartBtn = productView.querySelector('.spv-cartique_add_to_cart');
        if (addToCartBtn) {
            addToCartBtn.dataset.productId = product.id;
            addToCartBtn.onclick = async (e) => {
                e.preventDefault();
                const productId = Number(e.currentTarget.dataset.productId);
                
                if (this.features?.debug) {
                    console.log('[TRACE] SPV Add to Cart clicked:', productId);
                    console.trace();
                }
                
                if (productId && typeof this.addToCart === 'function') {
                    await this.addToCart({ productId, quantity: 1 });
                }
            };
        }

        // Tab buttons
        const tabButtons = productView.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            if (this.addEventListener) {
                this.addEventListener(button, 'click', () => {
                    productView.querySelectorAll('.tab-button, .tab-content').forEach(el => {
                        el.classList.remove('active');
                    });
                    button.classList.add('active');
                    const tabName = button.dataset.tab;
                    const content = productView.querySelector(`[data-tab-content="${tabName}"]`);
                    if (content) content.classList.add('active');
                });
            }
        });

        // Append to DOM first
        // Add wishlist heart to product page
        const wishlistContainer = document.createElement('div');
        wishlistContainer.className = 'cartique-wishlist-container';
        wishlistContainer.style.cssText = 'margin: 8px 0;';
        const spvHeart = this._createWishlistHeart(product);
        if (spvHeart) {
          wishlistContainer.appendChild(spvHeart);
          const infoColumn = productView.querySelector('.product-info-column .product-meta');
          if (infoColumn) {
            infoColumn.appendChild(wishlistContainer);
          } else {
            productView.querySelector('.product-details-animate')?.appendChild(wishlistContainer);
          }
        }

        container.appendChild(productView);
        container.style.display = 'block';
        
        // Attach review form submit listener
        const submitBtn = container.querySelector('#review-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const form = document.getElementById('review-form');
                if (!form) return;
                
                const ratingInput = form.querySelector('input[name="rating"]:checked');
                
                if (!ratingInput) {
                    alert('Please select a rating');
                    return;
                }
                
                const productId = parseInt(form.querySelector('#review-product-id').value);
                const product = this.products?.find(p => p.id === productId);
                if (product && typeof this.submitReview === 'function') {
                    this.submitReview(form, product);
                }
            });
        }
        
        // Scroll to single product view after DOM renders
        requestAnimationFrame(() => {
            const singleView = document.querySelector('.single-product-view');
            if (singleView) {
                singleView.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.documentElement.scrollTop = 0;
            const mainContent = document.getElementById('cartique-main-content');
            if (mainContent) mainContent.scrollTop = 0;
        });
    }

    renderProductDetails(product) {
        const attributes = product?.variants?.[0]?.attributes || [];
        
        if (attributes.length === 0) {
            return '<p>No additional details available.</p>';
        }
        
        return `
            <div class="product-details-list">
                ${attributes.map(attr => `
                    <div class="detail-row">
                        <span class="detail-key">${String(attr.key).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <span class="detail-value">${attr.value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderProductReviews(product) {
        const reviews = product?.reviews || [];
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;
        
        const distribution = [5, 4, 3, 2, 1].map(star => ({
            star,
            count: reviews.filter(r => r.rating === star).length,
            percentage: reviews.length > 0 
                ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
                : 0
        }));
        
        return `
            <div class="product-reviews">
                <div class="reviews-summary">
                    <div class="reviews-average">
                        <span class="reviews-rating-number">${avgRating}</span>
                        <div class="reviews-stars">
                            ${this.renderStars ? this.renderStars(parseFloat(avgRating)) : ''}
                        </div>
                        <span class="reviews-count">${reviews.length} review${reviews.length !== 1 ? 's' : ''}</span>
                    </div>
                    ${this.features?.reviews?.showRatingDistribution ? `
                    <div class="reviews-distribution">
                        ${distribution.map(d => `
                            <div class="distribution-row">
                                <span class="distribution-label">${d.star} ★</span>
                                <div class="distribution-bar">
                                    <div class="distribution-fill" style="width: ${d.percentage}%"></div>
                                </div>
                                <span class="distribution-count">${d.count}</span>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
                
                <div class="reviews-list">
                    ${reviews.length === 0 ? `
                        <p class="reviews-empty">No reviews yet. Be the first to review this product!</p>
                    ` : reviews.map(review => `
                        <div class="review-card">
                            <div class="review-header">
                                <div class="review-stars">
                                    ${this.renderStars ? this.renderStars(review.rating) : ''}
                                </div>
                                <span class="review-date">${this.formatDate ? this.formatDate(review.createdAt) : ''}</span>
                            </div>
                            <p class="review-author">${review.customer?.name || 'Anonymous'}</p>
                            ${review.comment ? `<p class="review-comment">${review.comment}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <div class="review-form-container">
                    <h4>Write a Review</h4>
                    <form id="review-form" class="review-form">
                        <input type="hidden" id="review-product-id" value="${product.id}">
                        <div class="review-rating-input">
                            <label>Your Rating:</label>
                            <div class="star-rating-input">
                                ${[5,4,3,2,1].map(star => `
                                    <input type="radio" id="star${star}" name="rating" value="${star}">
                                    <label for="star${star}" title="${star} star${star > 1 ? 's' : ''}">★</label>
                                `).join('')}
                            </div>
                        </div>
                        <div class="review-comment-input">
                            <label for="review-comment">Your Review:</label>
                            <textarea id="review-comment" name="comment" rows="4" placeholder="Share your experience with this product..."></textarea>
                        </div>
                        <button type="button" class="review-submit-btn" id="review-submit-btn">Submit Review</button>
                    </form>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const numRating = parseFloat(rating) || 0;
        const fullStars = Math.floor(numRating);
        const hasHalf = (numRating % 1) >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
        
        return `
            ${'<span class="star filled">★</span>'.repeat(Math.max(0, fullStars))}
            ${hasHalf ? '<span class="star half">★</span>' : ''}
            ${'<span class="star empty">★</span>'.repeat(Math.max(0, emptyStars))}
        `;
    }

    /**
     * Create a product card — supports theme components with fallback
     * @param {Object} product - Product data
     * @returns {Promise<HTMLElement|null>}
     */
    async createProductCard(product) {
        // Get variant and decision first (needed for both theme and default)
        let variant = null;
        try {
            variant = this.adapter?.getSelectedVariant(product);
        } catch (e) {
            console.warn('Failed to get variant:', e.message);
            variant = { price: product.price || 0 };
        }
        
        // Get bulk pricing display for product UI
        const bulkDisplayUI = this._getBulkPricingDisplay(variant);
        
        let decision;
        try {
            decision = await this.adapter?.resolvePricing({
                sellable: product,
                variant: variant,
                quantity: 1,
                customer: this.customer,
                place: this.place
            });
        } catch (e) {
            console.warn('Pricing resolution failed:', e.message);
            decision = { items: [{ unitPrice: { amount: 0 } }], adjustments: [], totals: { subtotal: { amount: 0 } } };
        }

        // Check if theme has custom ProductCard component
        const theme = this.themeManager?.currentName || 'default';
        const override = this.componentRegistry?.get(theme, 'ProductCard');

        if (this.features?.debug) {
            console.log('[Theme Component Lookup]', {
                theme,
                override: override ? 'Found' : 'Not found',
                productId: product.id
            });
        }

        // If theme has an override, use it
        if (override) {
            try {
                const card = new override(this);
                const result = card.render(product, decision);

                // Handle string result (HTML)
                if (typeof result === 'string') {
                    const wrapper = document.createElement('div');
                    wrapper.innerHTML = result;
                    const element = wrapper.firstElementChild;
                    if (element) {
                        this._attachThemeCardEvents(element, product);
                        return element;
                    }
                    return wrapper;
                }

                // Handle HTMLElement result
                if (result instanceof HTMLElement) {
                    this._attachThemeCardEvents(result, product);
                    return result;
                }

                return result;
            } catch (error) {
                console.warn('[ProductRenderer] Theme card failed, falling back to default:', error);
                // Fall through to default
            }
        }

        // Fallback to default rendering
        return this._createDefaultProductCard(product, variant, decision, bulkDisplayUI);
    }

    /**
     * Create default product card (fallback)
     * @param {Object} product - Product data
     * @param {Object} variant - Product variant
     * @param {Object} decision - CommercialDecision
     * @param {Object} bulkDisplayUI - Bulk pricing display data
     * @returns {HTMLElement}
     */
    _createDefaultProductCard(product, variant, decision, bulkDisplayUI) {
        const wrapper = this.templateHolder?.content?.getElementById('cartique-product-grid-component');
        if (!wrapper) {
            console.warn('Grid component template not found');
            return null;
        }

        const productCardTemplate = wrapper.firstElementChild?.cloneNode(true);
        if (!productCardTemplate) return null;

        this.updateProductElement(productCardTemplate, product);

        // --- BULK PRICING DISPLAY: Product UI (shown before purchase) ---
        if (bulkDisplayUI && bulkDisplayUI.hasBulk) {
            const priceContainer = productCardTemplate.querySelector('.currency-price-display');
            if (priceContainer) {
                const existing = priceContainer.querySelector('.cartique-bulk-pricing-display');
                if (existing) existing.remove();

                const bulkEl = document.createElement('div');
                bulkEl.className = 'cartique-bulk-pricing-display product-display';
                bulkEl.innerHTML = `
                    <div class="bulk-info">
                        <span class="bulk-label">Bulk Price Available</span>
                        <span class="bulk-price">${bulkDisplayUI.bulkDisplayPrice}</span>
                        <span class="bulk-min-qty">${bulkDisplayUI.message}</span>
                    </div>
                `;
                priceContainer.appendChild(bulkEl);
            }
        }
        // --- END BULK PRICING DISPLAY ---

        // Extract data from CommercialDecision directly (cart bulk logic)
        const item = decision?.items?.[0] || {};
        const adjustments = decision?.adjustments || [];
        
        const hasBulk = adjustments.some(a => 
            a.type === 'bulk_discount' || 
            a.label?.toLowerCase().includes('bulk')
        );
        const unitPrice = item.unitPrice?.amount || 0;
        const retailPrice = item.comparePrice?.amount || variant?.price || 0;
        
        const bulkAdjustment = adjustments.find(a => a.type === 'bulk_discount');
        const bulkPrice = bulkAdjustment?.metadata?.bulkPrice || null;
        const bulkMinQty = bulkAdjustment?.metadata?.minimumQty || null;

        const bulkDisplay = {
            hasBulk: hasBulk,
            isBulk: hasBulk,
            retailPrice: retailPrice,
            bulkPrice: bulkPrice,
            unitPrice: unitPrice,
            minimumQty: bulkMinQty,
            heading: hasBulk ? 'Bulk Price Applied' : 'BULK PRICE',
            message: bulkMinQty ? `Minimum ${bulkMinQty} items` : null,
            displayPrice: `${this.currencySymbol}${this.formatPrice(unitPrice)} each`,
            bulkDisplayPrice: bulkPrice ? `${this.currencySymbol}${this.formatPrice(bulkPrice)} each` : null,
            staticDisplay: {
                label: 'BULK PRICE',
                price: bulkPrice ? `${this.currencySymbol}${this.formatPrice(bulkPrice)} each` : null,
                minQty: bulkMinQty ? `Minimum ${bulkMinQty} items` : null
            }
        };

        if (bulkDisplay.hasBulk) {
            const priceContainer = productCardTemplate.querySelector('.currency-price-display');
            if (priceContainer) {
                const existing = priceContainer.querySelector('.cartique-bulk-pricing');
                if (existing) existing.remove();

                const bulkEl = document.createElement('div');
                bulkEl.className = 'cartique-bulk-pricing';
                bulkEl.innerHTML = `
                    <div class="bulk-label">${bulkDisplay.staticDisplay.label}</div>
                    <div class="bulk-price">${bulkDisplay.staticDisplay.price}</div>
                    <div class="bulk-min-qty">${bulkDisplay.staticDisplay.minQty}</div>
                `;
                priceContainer.appendChild(bulkEl);
            }
        }

        // Image click handler
        const imgContainer = productCardTemplate.querySelector('.cartique_product_image_container');
        if (imgContainer && this.addEventListener) {
            imgContainer.dataset.productId = product.id;
            imgContainer.style.cursor = 'pointer';
            this.addEventListener(imgContainer, 'click', async (e) => {
                e.preventDefault();
                if (typeof this.renderSingleProduct === 'function') {
                    await this.renderSingleProduct(product);
                }
            });
        }

        // Add to Cart button
        const addToCartBtn = productCardTemplate.querySelector('.cartique_add_to_cart');
        if (addToCartBtn) {
            addToCartBtn.dataset.productId = product.id;
            addToCartBtn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = Number(e.currentTarget.dataset.productId);
                
                if (this.features?.debug) {
                    console.log('[TRACE] Add to Cart clicked:', productId);
                    console.trace();
                }
                
                if (productId && typeof this.addToCart === 'function') {
                    await this.addToCart({ productId, quantity: 1 });
                } else {
                    console.warn('[TRACE] this.addToCart is not a function');
                }
            };
        }

        // Add wishlist heart to product card
        const heartWrapper = document.createElement('div');
        heartWrapper.className = 'cartique-wishlist-heart-wrapper';
        const heart = this._createWishlistHeart(product);
        if (heart) {
          heartWrapper.appendChild(heart);
          const imgContainer = productCardTemplate.querySelector('.cartique_product_image_container');
          if (imgContainer) {
            imgContainer.style.position = 'relative';
            imgContainer.appendChild(heartWrapper);
          }
        }

        return productCardTemplate;
    }

    /**
     * Attach events to theme component card
     * @param {HTMLElement} element - The card element
     * @param {Object} product - Product data
     */
    _attachThemeCardEvents(element, product) {
        // Add to cart button
        const addBtn = element.querySelector('[data-action="add-to-cart"], .fashion-add-to-cart, .add-to-cart, .cartique_add_to_cart');
        if (addBtn && this.addEventListener) {
            addBtn.dataset.productId = product.id;
            this.addEventListener(addBtn, 'click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = Number(e.currentTarget.dataset.productId);
                if (productId && typeof this.addToCart === 'function') {
                    await this.addToCart({ productId, quantity: 1 });
                }
            });
        }

        // Image click - view product
        const imageContainer = element.querySelector('[data-action="view-product"], .fashion-product-image, .product-image, .cartique_product_image_container');
        if (imageContainer && this.addEventListener) {
            imageContainer.style.cursor = 'pointer';
            this.addEventListener(imageContainer, 'click', async (e) => {
                e.preventDefault();
                if (typeof this.renderSingleProduct === 'function') {
                    await this.renderSingleProduct(product);
                }
            });
        }

        // Any other data-action elements
        const actionElements = element.querySelectorAll('[data-action]');
        actionElements.forEach(el => {
            const action = el.dataset.action;
            if (action === 'add-to-cart' || action === 'view-product') return;

            this.addEventListener(el, 'click', (e) => {
                e.preventDefault();
                if (this.features?.debug) {
                    console.log(`[ProductRenderer] Theme action: ${action}`, { product, element: el });
                }
            });
        });
    }

    async createProductListing(product) {
        const wrapper = this.templateHolder?.content?.getElementById('cartique-product-list-component');
        if (!wrapper) {
            console.warn('List component template not found');
            return null;
        }

        const productListingTemplate = wrapper.firstElementChild?.cloneNode(true);
        if (!productListingTemplate) return null;

        productListingTemplate.classList.add('cartique-product-listing');
        await this.updateProductElement(productListingTemplate, product);

        // --- BULK PRICING DISPLAY: Product UI (shown before purchase) ---
        let variant = null;
        try {
            variant = this.adapter?.getSelectedVariant(product);
        } catch (e) {
            console.warn('Failed to get variant:', e.message);
            variant = { price: product.price || 0 };
        }
        
        const bulkDisplayUI = this._getBulkPricingDisplay(variant);
        
        if (bulkDisplayUI && bulkDisplayUI.hasBulk) {
            const priceContainer = productListingTemplate.querySelector('.currency-price-display');
            if (priceContainer) {
                const existing = priceContainer.querySelector('.cartique-bulk-pricing-display');
                if (existing) existing.remove();

                const bulkEl = document.createElement('div');
                bulkEl.className = 'cartique-bulk-pricing-display product-display list-view';
                bulkEl.innerHTML = `
                    <div class="bulk-info">
                        <span class="bulk-label">Bulk Price Available</span>
                        <span class="bulk-price">${bulkDisplayUI.bulkDisplayPrice}</span>
                        <span class="bulk-min-qty">${bulkDisplayUI.message}</span>
                    </div>
                `;
                priceContainer.appendChild(bulkEl);
            }
        }
        // --- END BULK PRICING DISPLAY ---

        // --- BULK PRICING: List Card (cart bulk logic) ---
        let decision;
        try {
            decision = await this.adapter?.resolvePricing({
                sellable: product,
                variant: variant,
                quantity: 1,
                customer: this.customer,
                place: this.place
            });
        } catch (e) {
            console.warn('Pricing resolution failed:', e.message);
            decision = { items: [{ unitPrice: { amount: 0 } }], adjustments: [], totals: { subtotal: { amount: 0 } } };
        }

        // Extract data from CommercialDecision directly
        const item = decision?.items?.[0] || {};
        const adjustments = decision?.adjustments || [];
        
        const hasBulk = adjustments.some(a => 
            a.type === 'bulk_discount' || 
            a.label?.toLowerCase().includes('bulk')
        );
        const unitPrice = item.unitPrice?.amount || 0;
        const retailPrice = item.comparePrice?.amount || variant?.price || 0;
        
        const bulkAdjustment = adjustments.find(a => a.type === 'bulk_discount');
        const bulkPrice = bulkAdjustment?.metadata?.bulkPrice || null;
        const bulkMinQty = bulkAdjustment?.metadata?.minimumQty || null;

        const bulkDisplay = {
            hasBulk: hasBulk,
            isBulk: hasBulk,
            retailPrice: retailPrice,
            bulkPrice: bulkPrice,
            unitPrice: unitPrice,
            minimumQty: bulkMinQty,
            heading: hasBulk ? 'Bulk Price Applied' : 'BULK PRICE',
            message: bulkMinQty ? `Minimum ${bulkMinQty} items` : null,
            displayPrice: `${this.currencySymbol}${this.formatPrice(unitPrice)} each`,
            bulkDisplayPrice: bulkPrice ? `${this.currencySymbol}${this.formatPrice(bulkPrice)} each` : null,
            staticDisplay: {
                label: 'BULK PRICE',
                price: bulkPrice ? `${this.currencySymbol}${this.formatPrice(bulkPrice)} each` : null,
                minQty: bulkMinQty ? `Minimum ${bulkMinQty} items` : null
            }
        };

        if (bulkDisplay.hasBulk) {
            const priceContainer = productListingTemplate.querySelector('.currency-price-display');
            if (priceContainer) {
                const existing = priceContainer.querySelector('.cartique-bulk-pricing');
                if (existing) existing.remove();

                const bulkEl = document.createElement('div');
                bulkEl.className = 'cartique-bulk-pricing list-view';
                bulkEl.innerHTML = `
                    <span class="bulk-label">${bulkDisplay.staticDisplay.label}</span>
                    <span class="bulk-price">${bulkDisplay.staticDisplay.price}</span>
                    <span class="bulk-min-qty">${bulkDisplay.staticDisplay.minQty}</span>
                `;
                priceContainer.appendChild(bulkEl);
            }
        }
        // --- END BULK PRICING ---

        // Image click handler
        const imgContainer = productListingTemplate.querySelector('.cartique_product_image_container');
        if (imgContainer && this.addEventListener) {
            imgContainer.dataset.productId = product.id;
            imgContainer.style.cursor = 'pointer';
            this.addEventListener(imgContainer, 'click', async (e) => {
                e.preventDefault();
                if (typeof this.renderSingleProduct === 'function') {
                    await this.renderSingleProduct(product);
                }
            });
        }

        const img = productListingTemplate.querySelector('#image');
        if (img) {
            img.loading = 'lazy';
            img.decoding = 'async';
        }

        // Add to Cart button
        const addToCartBtn = productListingTemplate.querySelector('.cartique_add_to_cart');
        if (addToCartBtn) {
            addToCartBtn.dataset.productId = product.id;
            addToCartBtn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = Number(e.currentTarget.dataset.productId);
                
                if (this.features?.debug) {
                    console.log('[TRACE] Add to Cart clicked:', productId);
                    console.trace();
                }
                
                if (productId && typeof this.addToCart === 'function') {
                    await this.addToCart({ productId, quantity: 1 });
                } else {
                    console.warn('[TRACE] this.addToCart is not a function');
                }
            };
        }

        return productListingTemplate;
    }

    async updateProductElement(element, product) {
        // Update all product fields EXCEPT currency
        for (const [key, value] of Object.entries(product || {})) {
            if (key === 'currency') continue;
            
            const target = element.querySelector(`#${key}`);
            if (!target) continue;

            switch (target.tagName) {
            case 'IMG':
                target.src = value || '';
                target.alt = product?.title || '';
                break;
            case 'A':
                target.href = value || '';
                break;
            default:
                target.textContent = value || '';
            }
        }

        // Update ALL currency symbols
        const currencyEls = element.querySelectorAll('#currency');
        currencyEls.forEach(el => {
            el.textContent = this.currencySymbol || '$';
            el.style.color = '';
            el.style.fontWeight = '';
        });

        // Handle pricing
        const priceEl = element.querySelector('#price');
        const salePriceEl = element.querySelector('#sale_price');
        const salePriceCurrencyEl = element.querySelector('#sale_price_currency');

        if (product?.sale_price && product?.original_price) {
            if (priceEl) {
                priceEl.textContent = this.formatPrice(product.original_price);
                priceEl.style.textDecoration = 'line-through';
                priceEl.style.color = '#666';
                priceEl.style.opacity = '0.7';
                priceEl.style.fontWeight = '';
            }
            if (salePriceEl) {
                salePriceEl.textContent = this.formatPrice(product.sale_price);
                salePriceEl.style.display = 'block';
                salePriceEl.style.color = 'red';
                salePriceEl.style.fontWeight = 'bold';
                const saleContainer = salePriceEl.closest('span');
                if (saleContainer) saleContainer.style.display = '';
            }
            if (salePriceCurrencyEl) {
                salePriceCurrencyEl.textContent = this.currencySymbol || '$';
                salePriceCurrencyEl.style.display = '';
                salePriceCurrencyEl.style.color = 'red';
                salePriceCurrencyEl.style.fontWeight = 'bold';
            }
        } else if (product?.sale_price) {
            if (priceEl) {
                priceEl.textContent = this.formatPrice(product.price);
                priceEl.style.textDecoration = 'line-through';
                priceEl.style.color = '#666';
                priceEl.style.opacity = '0.7';
                priceEl.style.fontWeight = '';
            }
            if (salePriceEl) {
                salePriceEl.textContent = this.formatPrice(product.sale_price);
                salePriceEl.style.display = 'block';
                salePriceEl.style.color = 'red';
                salePriceEl.style.fontWeight = 'bold';
                const saleContainer = salePriceEl.closest('span');
                if (saleContainer) saleContainer.style.display = '';
            }
            if (salePriceCurrencyEl) {
                salePriceCurrencyEl.textContent = this.currencySymbol || '$';
                salePriceCurrencyEl.style.display = '';
                salePriceCurrencyEl.style.color = 'red';
                salePriceCurrencyEl.style.fontWeight = 'bold';
            }
        } else {
            if (priceEl) {
                priceEl.textContent = this.formatPrice(product?.price || 0);
                priceEl.style.textDecoration = '';
                priceEl.style.color = '';
                priceEl.style.opacity = '';
                priceEl.style.fontWeight = '';
            }
            if (salePriceEl) {
                salePriceEl.textContent = '';
                salePriceEl.style.display = 'none';
                const saleContainer = salePriceEl.closest('span');
                if (saleContainer) saleContainer.style.display = 'none';
            }
            if (salePriceCurrencyEl) {
                salePriceCurrencyEl.textContent = '';
                salePriceCurrencyEl.style.display = 'none';
                salePriceCurrencyEl.style.color = '';
                salePriceCurrencyEl.style.fontWeight = '';
            }
        }

        // STOCK MANAGEMENT
        let variant = null;
        try {
            variant = this.adapter?.getSelectedVariant(product);
        } catch (e) {
            console.warn('Failed to get variant for stock:', e.message);
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
        
        const stockCount = inventory?.quantity || 0;
        const addToCartBtn = element.querySelector('.cartique_add_to_cart');
        
        if (addToCartBtn) {
            addToCartBtn.dataset.stock = stockCount;
            addToCartBtn.dataset.productId = product?.id;
            
            if (stockCount === 0) {
                addToCartBtn.disabled = true;
                addToCartBtn.style.opacity = '0.5';
                addToCartBtn.style.cursor = 'not-allowed';
                addToCartBtn.title = 'SOLD OUT';
                
                const btnText = addToCartBtn.querySelector('span') || addToCartBtn;
                if (btnText && btnText.textContent?.includes('ADD TO CART')) {
                    btnText.textContent = 'SOLD OUT';
                }
            } else if (stockCount > 0 && stockCount <= 5) {
                addToCartBtn.disabled = false;
                addToCartBtn.style.opacity = '1';
                addToCartBtn.style.cursor = 'pointer';
                addToCartBtn.title = `Only ${stockCount} left in stock`;
                
                const btnText = addToCartBtn.querySelector('span') || addToCartBtn;
                if (btnText && btnText.textContent?.includes('SOLD OUT')) {
                    btnText.textContent = 'ADD TO CART';
                }
            } else {
                addToCartBtn.disabled = false;
                addToCartBtn.style.opacity = '1';
                addToCartBtn.style.cursor = 'pointer';
                addToCartBtn.title = '';
                
                const btnText = addToCartBtn.querySelector('span') || addToCartBtn;
                if (btnText && btnText.textContent?.includes('SOLD OUT')) {
                    btnText.textContent = 'ADD TO CART';
                }
            }
        }

        // Optional: Add stock indicator
        const existingStockIndicator = element.querySelector('.cartique-stock-indicator');
        if (existingStockIndicator) {
            existingStockIndicator.remove();
        }
        
        if (stockCount === 0) {
            const stockIndicator = document.createElement('div');
            stockIndicator.className = 'cartique-stock-indicator out-of-stock';
            stockIndicator.textContent = 'SOLD OUT';
            stockIndicator.style.cssText = `
                color: #ff4444;
                font-size: 12px;
                font-weight: 600;
                margin-top: 8px;
                text-transform: uppercase;
            `;
            
            if (addToCartBtn && addToCartBtn.parentNode) {
                addToCartBtn.parentNode.insertBefore(stockIndicator, addToCartBtn.nextSibling);
            } else {
                element.appendChild(stockIndicator);
            }
        } else if (stockCount > 0 && stockCount <= 5) {
            const stockIndicator = document.createElement('div');
            stockIndicator.className = 'cartique-stock-indicator low-stock';
            stockIndicator.textContent = `Only ${stockCount} left`;
            stockIndicator.style.cssText = `
                color: #ff8c00;
                font-size: 12px;
                font-weight: 600;
                margin-top: 8px;
            `;
            
            if (addToCartBtn && addToCartBtn.parentNode) {
                addToCartBtn.parentNode.insertBefore(stockIndicator, addToCartBtn.nextSibling);
            } else {
                element.appendChild(stockIndicator);
            }
        }
    }

    async renderProductDisplays() {
        const displayData = this.state.filteredProducts || this.products || [];
        const layout = this.state.currentLayout || 'grid';

        const gridContainer = document.getElementById('cartique-product-grid');
        const listContainer = document.getElementById('cartique-product-list');

        if (layout === 'grid') {
            if (listContainer) listContainer.style.display = 'none';
            if (gridContainer) {
                gridContainer.style.display = 'grid';
                await this.renderProducts('grid', displayData);
            }
        } else {
            if (gridContainer) gridContainer.style.display = 'none';
            if (listContainer) {
                listContainer.style.display = 'block';
                await this.renderProducts('list', displayData);
            }
        }

        console.log(`[UI] Rendered ${displayData.length} products in ${layout} view.`);
    }

    async renderProducts(layout, data) {
        const container = layout === 'grid' 
            ? document.getElementById('cartique-product-grid')
            : document.getElementById('cartique-product-list');

        if (!container) {
            console.warn(`[ProductRenderer] Container #cartique-product-${layout} not found`);
            return;
        }

        this.state.itemsPerBatch = this.features?.itemsPerPage || 12;
        this.state.loadedCount = this.state.itemsPerBatch;
        this.itemsPerBatch = this.state.itemsPerBatch;
        this.loadedCount = this.state.loadedCount;
        
        container.innerHTML = '';
        
        const productsToRender = data || this.state.filteredProducts || [];

        if (productsToRender.length === 0) {
            container.innerHTML = `
                <div class="no-results-msg" style="grid-column: 1 / -1; width: 100%; text-align: center; padding: 4rem 1rem;">
                    <p style="font-size: 1.2rem; color: #555; margin-bottom: 1rem;">No products found matching these criteria.</p>
                    <button onclick="window.location.href = window.location.pathname" style="cursor: pointer; border-bottom: 1px solid #000; background: none; border: none; font-weight: 600;">
                        Reset all filters
                    </button>
                </div>`;
            return;
        }

        const initialSlice = productsToRender.slice(0, this.state.itemsPerBatch);
        const fragment = document.createDocumentFragment();
        
        for (const product of initialSlice) {
            let productElement;
            try {
                productElement = layout === 'grid'
                    ? await this.createProductCard(product)
                    : await this.createProductListing(product);
            } catch (e) {
                console.warn('Product creation failed:', e.message);
                continue;
            }
            
            if (productElement) fragment.appendChild(productElement);
        }

        container.appendChild(fragment);

        if (productsToRender.length > this.state.itemsPerBatch && typeof this.setupInfiniteScroll === 'function') {
            this.setupInfiniteScroll();
        }
    }

    async renderMainFrame() {
        const containerId = this.features?.containerId || 'cartique';
        let container = this.container || document.getElementById(containerId);
        
        if (!container) {
            if (this.features?.debug) {
                console.warn(`#${containerId} missing. Creating demo mount.`);
            }
            container = document.createElement('div');
            container.id = containerId;
            document.getElementById('cartique')?.appendChild(container) || document.body.appendChild(container);
            this.container = container;
        }

        const mainFrameTemplate = document.createElement('template');
        mainFrameTemplate.innerHTML = `
            <div class="cartique-container" id="cartique-container">
                <aside class="cartique-sidebar" id="cartique-sidebar" style="display: ${this.features?.sidebarDisplay || 'block'}">
                    <div id="cartique-menu-anchor-sidebar" class="cartique-menu-anchor"></div>
                    <div id="cartique-sidebar-content"></div>
                </aside>
                <main class="cartique-main-content" id="cartique-main-content">
                    <div id="cartique-menu-anchor-top" class="cartique-menu-anchor"></div>
                    <div class="cartique-controls" id="cartique-controls">
                        <div class="cartique-search-container" id="cartique-search-container"></div>
                        <div class="cartique-sort-container" id="cartique-sort-container"></div>
                        <div class="cartique-view-toggles-container" id="cartique-view-toggles-container"></div>
                        <div class="shopping-cart-icon-container" id="shopping-cart-icon-container"></div>
                    </div>
                    <div class="cartique-product-displays" id="cartique-product-displays">
                        <div class="cartique-product-grid" id="cartique-product-grid"></div>
                        <div class="cartique-product-list" id="cartique-product-list"></div>
                    </div>
                    <footer class="cartique-product-footer" id="cartique-product-footer" style="display:${this.features?.footerDisplay || 'block'}"></footer>
                </main>
            </div>
            <div id="cartique-hidden-blocks"></div>
            <div class="cart-overlay" id="cart-slide-overlay"></div>
            <div id="toast-container">
                <div class="toast">
                    <div class="toast-content">
                        <span class="svg">✓</span>
                        <div class="message">
                            <span class="text text-1">Success</span>
                            <span class="text text-2">You will now be redirected to complete your checkout.</span>
                        </div>
                    </div>
                    <button class="close">&times;</button>
                </div>
            </div>
        `;

        container.appendChild(mainFrameTemplate.content.cloneNode(true));
        
        const overlay = document.getElementById('cart-slide-overlay');
        if (overlay && this.addEventListener) {
            this.addEventListener(overlay, 'click', () => {
                if (typeof this.closeCart === 'function') {
                    this.closeCart();
                }
            });
        }
    }

    async renderSidebar() {
        const sidebarWrapper = this.templateHolder?.content?.getElementById('cartique-sidebar-component');
        if (!sidebarWrapper) {
            console.warn('Sidebar template not found');
            return;
        }

        let sidebarContainer = document.getElementById('cartique-sidebar');
        if (!sidebarContainer) {
            const mainContent = document.getElementById('cartique-main-content');
            if (mainContent) {
                sidebarContainer = document.createElement('aside');
                sidebarContainer.id = 'cartique-sidebar';
                sidebarContainer.className = 'cartique-sidebar';
                mainContent.prepend(sidebarContainer);
            } else {
                console.warn('No #cartique-main-content found for sidebar');
                return;
            }
        }

        sidebarContainer.innerHTML = '';
        sidebarContainer.appendChild(sidebarWrapper.cloneNode(true));
    }

    async renderControls() {
        const ensureContainer = (id) => {
            let el = document.getElementById(id);
            if (!el) {
                el = document.createElement('div');
                el.id = id;
                const controls = document.getElementById('cartique-controls');
                if (controls) {
                    controls.appendChild(el);
                } else {
                    const mainContent = document.getElementById('cartique-main-content');
                    if (mainContent) {
                        mainContent.appendChild(el);
                    }
                }
            }
            return el;
        };

        // Search — uses onSearch callback
        const searchWrapper = this.templateHolder?.content?.getElementById('cartique-search-container-component');
        if (searchWrapper) {
            const searchContainer = ensureContainer('cartique-search-container');
            searchContainer.innerHTML = '';
            searchContainer.appendChild(searchWrapper.cloneNode(true));
            
            const searchInput = searchContainer.querySelector('.cartique-search');
            if (searchInput && this.addEventListener) {
                const debouncedHandler = this.debounce ? 
                    this.debounce(() => {
                        if (typeof this.onSearch === 'function') {
                            this.onSearch(searchInput.value);
                        }
                    }, 300) : 
                    () => {
                        if (typeof this.onSearch === 'function') {
                            this.onSearch(searchInput.value);
                        }
                    };
                this.addEventListener(searchInput, 'input', debouncedHandler);
            }
        }

        // Sort — uses onSort callback
        const sortWrapper = this.templateHolder?.content?.getElementById('cartique-sort-container-component');
        if (sortWrapper) {
            const sortContainer = ensureContainer('cartique-sort-container');
            sortContainer.innerHTML = '';
            sortContainer.appendChild(sortWrapper.cloneNode(true));
            
            const sortDropdown = sortContainer.querySelector('.cartique-sort');
            if (sortDropdown && this.addEventListener) {
                this.addEventListener(sortDropdown, 'change', () => {
                    if (typeof this.onSort === 'function') {
                        this.onSort(sortDropdown.value);
                    }
                });
            }
        }

        // View toggles
        const togglesWrapper = this.templateHolder?.content?.getElementById('cartique-view-toggles-container-component');
        if (togglesWrapper) {
            const togglesContainer = ensureContainer('cartique-view-toggles-container');
            togglesContainer.innerHTML = '';
            togglesContainer.appendChild(togglesWrapper.cloneNode(true));
        }

        // Cart icon
        const cartIconWrapper = this.templateHolder?.content?.getElementById('shopping-cart-icon-container-component');
        if (cartIconWrapper) {
            const cartIconContainer = ensureContainer('shopping-cart-icon-container');
            cartIconContainer.innerHTML = '';
            cartIconContainer.appendChild(cartIconWrapper.cloneNode(true));
            
            const cartIcon = document.getElementById('shopping-cart-icon');
            if (cartIcon && this.addEventListener) {
                this.addEventListener(cartIcon, 'click', () => {
                    if (typeof this.showCart === 'function') {
                        this.showCart();
                    }
                });
            }
        }
    }

    async renderFooter() {
        const wrapper = this.templateHolder?.content?.getElementById('cartique-product-footer-component');
        if (!wrapper) {
            console.warn('Footer template not found');
            return;
        }

        let footerContainer = document.getElementById('cartique-product-footer');
        if (!footerContainer) {
            const mainContent = document.getElementById('cartique-main-content');
            if (mainContent) {
                footerContainer = document.createElement('footer');
                footerContainer.id = 'cartique-product-footer';
                footerContainer.className = 'cartique-product-footer';
                mainContent.appendChild(footerContainer);
            } else {
                console.warn('No #cartique-main-content found for footer');
                return;
            }
        }

        footerContainer.innerHTML = '';
        footerContainer.appendChild(wrapper.firstElementChild.cloneNode(true));
    }

    /**
     * Sets the layout — delegates to StorefrontCore via callback
     */
    async setLayout(layout) {
        if (!['grid', 'list'].includes(layout)) {
            console.warn('Invalid layout:', layout);
            return;
        }
        
        if (this.state.currentLayout === layout) return;
        
        // Delegate to StorefrontCore via callback
        if (typeof this.onLayoutChange === 'function') {
            this.onLayoutChange(layout);
        }
    }
}