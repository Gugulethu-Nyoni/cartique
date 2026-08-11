/**
 * @semantq/storefront
 *
 * WishlistRenderer — Wishlist listing page
 *
 * Phase 2: Purpose-built wishlist row layout
 * - Owns wishlist row UI (not catalog cards)
 * - Image | Info | Actions layout
 * - Heart toggle, Add to Cart, Remove
 * - Accurate item count
 * - Empty state
 */

export default class WishlistRenderer {
    constructor(context = {}) {
        Object.assign(this, context);

        this.onBackToShop = null;

        if (this.features?.debug) {
            console.log('[WishlistRenderer] Initialized');
        }
    }

    // ==========================================================
    // MAIN RENDER
    // ==========================================================

    render() {
        if (!this.wishlist) {
            if (this.features?.debug) {
                console.warn('[WishlistRenderer] Wishlist service not available');
            }
            return;
        }

        const items = this.wishlist.getAll();

        // Hide all storefront UIs
        this._hideAllUIs();

        // Build the page
        const mainContent = document.getElementById('cartique-main-content');
        if (!mainContent) return;

        // Remove existing wishlist page
        const existing = document.getElementById('cartique-wishlist-page');
        if (existing) existing.remove();

        const page = document.createElement('div');
        page.id = 'cartique-wishlist-page';
        page.className = 'cartique-wishlist-page';

        // Build header
        page.innerHTML = this._buildPageHTML();

        mainContent.appendChild(page);

        if (items.length === 0) {
            this._showEmptyState(page);
            return;
        }

        // Resolve products from IDs
        const productMap = this._buildProductMap();
        const resolvedItems = items
            .map(id => productMap.get(this._normalizeId(id)))
            .filter(Boolean);

        if (resolvedItems.length === 0) {
            this._showEmptyState(page);
            return;
        }

        this._renderProductRows(page, resolvedItems);
        this._updateCount(resolvedItems.length);
        this._attachEvents(page);
    }

    // ==========================================================
    // ID NORMALIZATION
    // ==========================================================

    _normalizeId(id) {
        if (id === null || id === undefined) return null;
        if (typeof id === 'string' && /^\d+$/.test(id)) {
            return Number(id);
        }
        return id;
    }

    // ==========================================================
    // PRODUCT MAP
    // ==========================================================

    _buildProductMap() {
        const map = new Map();
        (this.products || []).forEach(product => {
            map.set(this._normalizeId(product.id), product);
        });
        return map;
    }

    // ==========================================================
    // UI HELPERS
    // ==========================================================

    _hideAllUIs() {
        const ids = [
            'cartique-product-displays',
            'single-product-view-container',
            'cartique-cart-page',
            'cartique-sidebar',
            'cartique-menu-anchor-top',
            'cartique-controls',
            'cartique-product-footer',
            'cartique-sticky-nav'
        ];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        const mainContent = document.getElementById('cartique-main-content');
        if (mainContent) {
            mainContent.classList.add('cartique-full-width');
        }
    }

    _buildPageHTML() {
        return `
            <div class="cartique-wishlist-page-header">
                <button class="cartique-wishlist-back-btn" id="wishlist-back-btn">
                    ← Continue Shopping
                </button>
                <h1>My Wishlist</h1>
                <p class="cartique-wishlist-count" id="wishlist-count"></p>
            </div>
            <div class="cartique-wishlist-product-list" id="wishlist-product-list">
            </div>
        `;
    }

    _buildEmptyStateHTML() {
        const heartSVG = this._createHeartSVG(false);
        const heartStr = heartSVG ? heartSVG.outerHTML : '';
        
        return `
            <div class="cartique-wishlist-empty">
                <div class="cartique-wishlist-empty-icon">
                    ${heartStr}
                </div>
                <h2>Your wishlist is empty</h2>
                <p>Save your favourite products and find them here later.</p>
                <button class="cartique-wishlist-continue-btn" id="wishlist-continue-btn">
                    Continue Shopping
                </button>
            </div>
        `;
    }

    _showEmptyState(page) {
        const productList = page.querySelector('#wishlist-product-list');
        if (productList) {
            productList.innerHTML = this._buildEmptyStateHTML();
        }

        const countEl = page.querySelector('#wishlist-count');
        if (countEl) {
            countEl.textContent = '0 items';
        }

        this._attachEvents(page);
    }

    _updateCount(count) {
        const countEl = document.querySelector('#wishlist-count');
        if (countEl) {
            countEl.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
        }
    }

    // ==========================================================
    // PRODUCT ROWS
    // ==========================================================

    _renderProductRows(page, products) {
        const productList = page.querySelector('#wishlist-product-list');
        if (!productList) return;

        productList.innerHTML = '';

        products.forEach(product => {
            const row = this._createWishlistRow(product);
            if (row) {
                productList.appendChild(row);
            }
        });
    }

    _createWishlistRow(product) {
        const row = document.createElement('div');
        row.className = 'cartique-wishlist-row';
        row.dataset.productId = product.id;

        const variant = this._getSelectedVariant(product);
        const price = variant?.price || product.price || 0;
        const inventory = variant?.inventory ?? 10;
        const inStock = inventory > 0;

        row.innerHTML = `
            <div class="cartique-wishlist-row-image">
                <a href="/shop/product/${product.slug || product.id}">
                    <img src="${product.image || ''}" 
                         alt="${product.title || ''}" 
                         loading="lazy"
                         onerror="this.style.display='none'" />
                </a>
            </div>
            <div class="cartique-wishlist-row-info">
                <h3>
                    <a href="/shop/product/${product.slug || product.id}">
                        ${product.title || ''}
                    </a>
                </h3>
                ${product.description ? 
                    `<p class="cartique-wishlist-row-desc">${this._truncateDescription(product.description)}</p>` 
                    : ''}
                <p class="cartique-wishlist-row-price">
                    ${this._getCurrencySymbol()}${this._formatPrice(price)}
                </p>
                ${this._renderVariantPills(variant)}
                ${this._renderStockStatus(inventory)}
            </div>
            <div class="cartique-wishlist-row-actions">
                <button class="cartique-wishlist-heart is-saved" 
                        data-product-id="${product.id}"
                        aria-label="Remove from wishlist" 
                        aria-pressed="true">
                </button>
                <button class="cartique-wishlist-add-to-cart" 
                        data-product-id="${product.id}"
                        ${!inStock ? 'disabled' : ''}>
                    ${inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button class="cartique-wishlist-remove" 
                        data-product-id="${product.id}">
                    Remove
                </button>
            </div>
        `;

        // Add heart icon to button
        const heartBtn = row.querySelector('.cartique-wishlist-heart');
        if (heartBtn) {
            heartBtn.appendChild(this._createHeartSVG(true));
        }

        this._attachRowEvents(row, product, heartBtn);
        return row;
    }

    // ==========================================================
    // SVG HEART
    // ==========================================================

    _createHeartSVG(isSaved = false) {
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
        path.setAttribute('fill', isSaved ? 'currentColor' : 'none');

        svg.appendChild(path);
        return svg;
    }

    // ==========================================================
    // EVENT HANDLERS
    // ==========================================================

    _attachRowEvents(row, product, heartBtn) {
        // Heart toggle
        if (heartBtn) {
            heartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this._handleHeartToggle(heartBtn, product, row);
            });
        }

        // Add to Cart
        const addToCartBtn = row.querySelector('.cartique-wishlist-add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await this._handleAddToCart(addToCartBtn, product);
            });
        }

        // Remove
        const removeBtn = row.querySelector('.cartique-wishlist-remove');
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this._handleRemove(product, row);
            });
        }
    }

    _attachEvents(page) {
        if (this.features?.debug) {
            console.log('[Wishlist] Attaching page events');
        }

        const backBtn = page.querySelector('#wishlist-back-btn');

        if (backBtn) {
            if (this.features?.debug) {
                console.log('[Wishlist] Back button found, attaching listener');
            }

            backBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (this.features?.debug) {
                    console.log('[TRACE] Wishlist back button clicked');
                    console.trace();
                }

                if (typeof this.onBackToShop === 'function') {
                    await this.onBackToShop();
                } else {
                    console.warn('[Wishlist] onBackToShop is not available');
                }
            });
        } else if (this.features?.debug) {
            console.warn('[Wishlist] Back button not found');
        }

        const continueBtn = page.querySelector('#wishlist-continue-btn');

        if (continueBtn) {
            if (this.features?.debug) {
                console.log('[Wishlist] Continue Shopping button found');
            }

            continueBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (typeof this.onBackToShop === 'function') {
                    await this.onBackToShop();
                } else {
                    console.warn('[Wishlist] onBackToShop is not available');
                }
            });
        }
    }

    _handleHeartToggle(heartBtn, product, row) {
        if (!this.wishlist) return;

        const result = this.wishlist.toggle(product.id);

        if (result.success && !result.added) {
            // Product was removed - animate row out
            row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            row.style.opacity = '0';
            row.style.transform = 'translateX(20px)';

            setTimeout(() => {
                row.remove();
                const remaining = document.querySelectorAll('.cartique-wishlist-row').length;
                this._updateCount(remaining);

                if (remaining === 0) {
                    const page = document.getElementById('cartique-wishlist-page');
                    if (page) this._showEmptyState(page);
                }
            }, 300);
        }

        // Sync catalog hearts
        if (this.productRenderer?.updateWishlistStates) {
            this.productRenderer.updateWishlistStates();
        }
    }

    async _handleAddToCart(button, product) {
        if (!this.addToCart) return;

        const originalText = button.textContent;
        button.textContent = 'Adding...';
        button.disabled = true;

        try {
            await this.addToCart({ productId: product.id, quantity: 1 });
            button.textContent = 'Added!';
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 1500);
        } catch (error) {
            button.textContent = originalText;
            button.disabled = false;
            if (this.features?.debug) {
                console.warn('[WishlistRenderer] Add to cart failed:', error);
            }
        }
    }

    _handleRemove(product, row) {
        if (!this.wishlist) return;

        this.wishlist.remove(product.id);

        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(20px)';

        setTimeout(() => {
            row.remove();
            const remaining = document.querySelectorAll('.cartique-wishlist-row').length;
            this._updateCount(remaining);

            if (remaining === 0) {
                const page = document.getElementById('cartique-wishlist-page');
                if (page) this._showEmptyState(page);
            }
        }, 300);

        if (this.productRenderer?.updateWishlistStates) {
            this.productRenderer.updateWishlistStates();
        }
    }

    // ==========================================================
    // UTILITY METHODS
    // ==========================================================

    _getSelectedVariant(product) {
        if (!product) return null;
        try {
            if (this.adapter?.resolveVariant) {
                return this.adapter.resolveVariant(product, product.variantId);
            }
        } catch (e) {
            // Ignore
        }
        return product.variants?.[0] || null;
    }

    _formatPrice(price) {
        if (price === undefined || price === null || isNaN(price)) return '0.00';
        return Number(price).toFixed(2);
    }

    _getCurrencySymbol() {
        return this.currencySymbol || 'R';
    }

    _truncateDescription(text, maxLength = 120) {
        if (!text || text.length <= maxLength) return text || '';
        return text.substring(0, maxLength).trim() + '...';
    }

    _renderVariantPills(variant) {
        if (!variant?.attributes?.length) return '';

        const pills = variant.attributes
            .filter(attr => attr.key !== 'pouch_size')
            .map(attr => 
                `<span class="cartique-wishlist-variant-pill">${attr.value}</span>`
            )
            .join('');

        return pills ? `<div class="cartique-wishlist-variant-pills">${pills}</div>` : '';
    }

    _renderStockStatus(inventory) {
        if (inventory === 0) {
            return '<p class="cartique-wishlist-stock out-of-stock">Out of Stock</p>';
        }
        if (inventory <= 5) {
            return `<p class="cartique-wishlist-stock low-stock">Only ${inventory} left</p>`;
        }
        return '<p class="cartique-wishlist-stock in-stock">In Stock</p>';
    }
}
