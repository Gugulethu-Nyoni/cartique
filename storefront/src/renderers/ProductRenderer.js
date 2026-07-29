/**
 * @semantq/storefront
 *
 * ProductRenderer — Product presentation logic
 *
 * Migrated from: cartique/storefront/src/Storefront.js
 * Phase 2: Replaced legacy commerce methods with adapter calls.
 */

export default class ProductRenderer {
    constructor(context) {
        Object.assign(this, context);
    }

    async renderSingleProduct(product) {
        if (!product) {
            console.error('Product not found');
            return;
        }

        // Save current state
        this.previousViewState = {
            layout: this.currentLayout,
            searchQuery: this.currentSearchQuery,
            sortType: this.currentSortType,
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
        
        this.singleProductViewActive = true;
        
        // Render the single product view (this is the actual rendering part)
        let container = document.getElementById('single-product-view-container');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'single-product-view-container';
            document.getElementById('cartique-main-content').appendChild(container);
        }

        container.innerHTML = '';
        
        const productView = document.createElement('div');
        productView.className = 'single-product-view';
        
        // --- BULK PRICING: Single Product View ---
        const variant = this.adapter.getSelectedVariant(product);
        const pricingResult = await this.adapter.resolvePricing({
            sellable: product,
            variant: variant,
            quantity: 1,
            customer: this.customer,
            place: this.place
        });
        const pricing = pricingResult.legacy || pricingResult;
        
        const bulkDisplay = {
            hasBulk: pricingResult.decision?.adjustments?.some(a => a.type === 'bulk_discount') || false,
            isBulk: pricingResult.decision?.adjustments?.some(a => a.type === 'bulk_discount') || false,
            retailPrice: pricing.retailPrice || variant?.price || 0,
            bulkPrice: pricing.bulkPrice || null,
            unitPrice: pricing.unitPrice || 0,
            minimumQty: pricing.bulkMinimumQty || null,
            heading: pricing.isBulk ? '✓ Bulk Price Applied' : 'BULK PRICE',
            message: pricing.bulkMinimumQty ? `Minimum ${pricing.bulkMinimumQty} items` : null,
            displayPrice: `${this.currencySymbol}${pricing.unitPrice} each`,
            bulkDisplayPrice: pricing.bulkPrice ? `${this.currencySymbol}${pricing.bulkPrice} each` : null,
            staticDisplay: {
                label: 'BULK PRICE',
                price: pricing.bulkPrice ? `${this.currencySymbol}${pricing.bulkPrice} each` : null,
                minQty: pricing.bulkMinimumQty ? `Minimum ${pricing.bulkMinimumQty} items` : null
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
            </div>
        `;
        
        // Add bulk pricing section if available
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
        // --- END BULK PRICING ---
        
        productView.innerHTML = `
            <button class="back-to-products">← Back to Products</button>
            <div class="product-content-wrapper">
                <div class="product-image-column">
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.title}" loading="lazy">
                    </div>
                </div>
                <div class="product-info-column">
                    <div class="product-meta">
                        <h2>${product.title}</h2>
                        ${priceHTML}
                        <p class="product-description">${product.description}</p>
                    </div>
                    <button class="spv-cartique_add_to_cart" id="${product.id}">ADD TO CART</button>
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

        // Add event listeners
        const backBtn = productView.querySelector('.back-to-products');
        const addToCartBtn = productView.querySelector('.spv-cartique_add_to_cart');
        const tabButtons = productView.querySelectorAll('.tab-button');

        if (backBtn) {
            this.addEventListener(backBtn, 'click', () => this.returnToListView());
        }

        if (addToCartBtn) {
            this.addEventListener(addToCartBtn, 'click', async (e) => {
                await this.addToCart(e);
            });
        }

        tabButtons.forEach(button => {
            this.addEventListener(button, 'click', () => {
                productView.querySelectorAll('.tab-button, .tab-content').forEach(el => {
                    el.classList.remove('active');
                });
                button.classList.add('active');
                const tabName = button.dataset.tab;
                const content = productView.querySelector(`[data-tab-content="${tabName}"]`);
                if (content) content.classList.add('active');
            });
        });

        // Append to DOM first
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
                const product = this.products.find(p => p.id === productId);
                if (product) {
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
        const attributes = product.variants?.[0]?.attributes || [];
        
        if (attributes.length === 0) {
            return '<p>No additional details available.</p>';
        }
        
        return `
            <div class="product-details-list">
                ${attributes.map(attr => `
                    <div class="detail-row">
                        <span class="detail-key">${attr.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <span class="detail-value">${attr.value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async createProductCard(product) {
        const wrapper = this.templateHolder.content.getElementById('cartique-product-grid-component');
        if (!wrapper) return null;

        const productCardTemplate = wrapper.firstElementChild?.cloneNode(true);
        if (!productCardTemplate) return null;

        await this.updateProductElement(productCardTemplate, product);

        // --- BULK PRICING: Grid Card ---
        const variant = this.adapter.getSelectedVariant(product);
        const pricingResult = await this.adapter.resolvePricing({
            sellable: product,
            variant: variant,
            quantity: 1,
            customer: this.customer,
            place: this.place
        });
        const pricing = pricingResult.legacy || pricingResult;

        const bulkDisplay = {
            hasBulk: pricingResult.decision?.adjustments?.some(a => a.type === 'bulk_discount') || false,
            isBulk: pricingResult.decision?.adjustments?.some(a => a.type === 'bulk_discount') || false,
            retailPrice: pricing.retailPrice || variant?.price || 0,
            bulkPrice: pricing.bulkPrice || null,
            unitPrice: pricing.unitPrice || 0,
            minimumQty: pricing.bulkMinimumQty || null,
            heading: pricing.isBulk ? '✓ Bulk Price Applied' : 'BULK PRICE',
            message: pricing.bulkMinimumQty ? `Minimum ${pricing.bulkMinimumQty} items` : null,
            displayPrice: `${this.currencySymbol}${pricing.unitPrice} each`,
            bulkDisplayPrice: pricing.bulkPrice ? `${this.currencySymbol}${pricing.bulkPrice} each` : null,
            staticDisplay: {
                label: 'BULK PRICE',
                price: pricing.bulkPrice ? `${this.currencySymbol}${pricing.bulkPrice} each` : null,
                minQty: pricing.bulkMinimumQty ? `Minimum ${pricing.bulkMinimumQty} items` : null
            }
        };

        if (bulkDisplay.hasBulk) {
            // Find the currency-price-display container
            const priceContainer = productCardTemplate.querySelector('.currency-price-display');
            if (priceContainer) {
                // Remove existing bulk indicator if any
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
        // --- END BULK PRICING ---

        // Add image click handler
        const imgContainer = productCardTemplate.querySelector('.cartique_product_image_container');
        if (imgContainer) {
            imgContainer.dataset.productId = product.id;
            imgContainer.style.cursor = 'pointer';
            this.addEventListener(imgContainer, 'click', (e) => {
                e.preventDefault();
                this.showSingleProductView(product.id);
            });
        }

        // Add to cart button
        const addToCartBtn = productCardTemplate.querySelector('.cartique_add_to_cart');
        if (addToCartBtn) {
            addToCartBtn.id = product.id;
            this.addEventListener(addToCartBtn, 'click', (e) => this.addToCart(e));
        }

        return productCardTemplate;
    }

    async createProductListing(product) {
        const wrapper = this.templateHolder.content.getElementById('cartique-product-list-component');
        if (!wrapper) return null;

        const productListingTemplate = wrapper.firstElementChild?.cloneNode(true);
        if (!productListingTemplate) return null;

        productListingTemplate.classList.add('cartique-product-listing');
        await this.updateProductElement(productListingTemplate, product);

        // --- BULK PRICING: List Card ---
        const variant = this.adapter.getSelectedVariant(product);
        const pricingResult = await this.adapter.resolvePricing({
            sellable: product,
            variant: variant,
            quantity: 1,
            customer: this.customer,
            place: this.place
        });
        const pricing = pricingResult.legacy || pricingResult;

        const bulkDisplay = {
            hasBulk: pricingResult.decision?.adjustments?.some(a => a.type === 'bulk_discount') || false,
            isBulk: pricingResult.decision?.adjustments?.some(a => a.type === 'bulk_discount') || false,
            retailPrice: pricing.retailPrice || variant?.price || 0,
            bulkPrice: pricing.bulkPrice || null,
            unitPrice: pricing.unitPrice || 0,
            minimumQty: pricing.bulkMinimumQty || null,
            heading: pricing.isBulk ? '✓ Bulk Price Applied' : 'BULK PRICE',
            message: pricing.bulkMinimumQty ? `Minimum ${pricing.bulkMinimumQty} items` : null,
            displayPrice: `${this.currencySymbol}${pricing.unitPrice} each`,
            bulkDisplayPrice: pricing.bulkPrice ? `${this.currencySymbol}${pricing.bulkPrice} each` : null,
            staticDisplay: {
                label: 'BULK PRICE',
                price: pricing.bulkPrice ? `${this.currencySymbol}${pricing.bulkPrice} each` : null,
                minQty: pricing.bulkMinimumQty ? `Minimum ${pricing.bulkMinimumQty} items` : null
            }
        };

        if (bulkDisplay.hasBulk) {
            // Find the currency-price-display container
            const priceContainer = productListingTemplate.querySelector('.currency-price-display');
            if (priceContainer) {
                // Remove existing bulk indicator if any
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

        // FIX: Add image click handler for single product view
        const imgContainer = productListingTemplate.querySelector('.cartique_product_image_container');
        if (imgContainer) {
            imgContainer.dataset.productId = product.id;
            imgContainer.style.cursor = 'pointer';
            this.addEventListener(imgContainer, 'click', (e) => {
                e.preventDefault();
                this.showSingleProductView(product.id);
            });
        }

        // FIX: Add lazy loading to image
        const img = productListingTemplate.querySelector('#image');
        if (img) {
            img.loading = 'lazy';
            img.decoding = 'async';
        }

        // Add to cart button
        const addToCartBtn = productListingTemplate.querySelector('.cartique_add_to_cart');
        if (addToCartBtn) {
            addToCartBtn.id = product.id;
            this.addEventListener(addToCartBtn, 'click', (e) => this.addToCart(e));
        }

        return productListingTemplate;
    }

    async updateProductElement(element, product) {
        // Update all product fields EXCEPT currency
        for (const [key, value] of Object.entries(product)) {
            if (key === 'currency') continue; // Skip - handled below
            
            const target = element.querySelector(`#${key}`);
            if (!target) continue;

            switch (target.tagName) {
            case 'IMG':
                target.src = value;
                target.alt = product.title || '';
                break;
            case 'A':
                target.href = value;
                break;
            default:
                target.textContent = value;
            }
        }

        // Update ALL currency symbols (both regular and sale)
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

        if (product.sale_price && product.original_price) {
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
        } else if (product.sale_price) {
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
                priceEl.textContent = this.formatPrice(product.price);
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

        // STOCK MANAGEMENT: Handle Add to Cart button state and stock display
        const variant = this.adapter.getSelectedVariant(product);
        const inventory = await this.adapter.resolveInventory({
            sellable: product,
            variant: variant
        });
        const stockCount = inventory.quantity || 0;
        const addToCartBtn = element.querySelector('.cartique_add_to_cart');
        
        if (addToCartBtn) {
            // Store stock data as dataset attributes for later validation
            addToCartBtn.dataset.stock = stockCount;
            addToCartBtn.dataset.productId = product.id;
            
            if (stockCount === 0) {
                // SOLD OUT - disable button
                addToCartBtn.disabled = true;
                addToCartBtn.style.opacity = '0.5';
                addToCartBtn.style.cursor = 'not-allowed';
                addToCartBtn.title = 'SOLD OUT';
                
                // Update button text to show SOLD OUT
                const btnText = addToCartBtn.querySelector('span') || addToCartBtn;
                if (btnText && btnText.textContent?.includes('ADD TO CART')) {
                    btnText.textContent = 'SOLD OUT';
                }
            } else if (stockCount > 0 && stockCount <= 5) {
                // Low stock - enable but show warning
                addToCartBtn.disabled = false;
                addToCartBtn.style.opacity = '1';
                addToCartBtn.style.cursor = 'pointer';
                addToCartBtn.title = `Only ${stockCount} left in stock`;
                
                // Optionally show stock count on the button
                const btnText = addToCartBtn.querySelector('span') || addToCartBtn;
                if (btnText && btnText.textContent?.includes('SOLD OUT')) {
                    btnText.textContent = 'ADD TO CART';
                }
            } else {
                // Normal stock - enable button
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

        // Optional: Add stock indicator near the product
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
            
            // Insert after the add to cart button or at the end of the element
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
        // 1. Determine Source Data
        // Use filtered products if available, otherwise fall back to the master list
        const displayData = this.filteredProducts || this.products;

        // 2. Determine Active Layout
        // Defaults to 'grid' if no layout state is stored
        const layout = this.currentLayout || 'grid';

        // 3. Locate UI Containers
        const gridContainer = document.getElementById('cartique-product-grid');
        const listContainer = document.getElementById('cartique-product-list');

        // 4. Handle Visibility & Rendering Logic
        // We toggle displays to 'none' for the inactive layout to prevent 
        // products from stacking or appearing twice on the page.
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

        if (!container) return;

        // 1. RESET STATE: Reset the count for the infinite scroll batch
        this.itemsPerBatch = this.features.itemsPerPage || 12;
        this.loadedCount = this.itemsPerBatch;
        container.innerHTML = '';
        
        const productsToRender = data || this.filteredProducts || [];

        // 2. EMPTY STATE GUARD
        if (productsToRender.length === 0) {
            container.innerHTML = `
                <div class="no-results-msg" style="grid-column: 1 / -1; width: 100%; text-align: center; padding: 4rem 1rem;">
                    <p style="font-size: 1.2rem; color: #555; margin-bottom: 1rem;">No products found matching these criteria.</p>
                    <button onclick="location.reload()" style="cursor: pointer; border-bottom: 1px solid #000; background: none; border: none; font-weight: 600;">
                        Reset all filters
                    </button>
                </div>`;
            return;
        }

        // 3. INITIAL SLICE: Only render the first batch
        const initialSlice = productsToRender.slice(0, this.itemsPerBatch);

        // 4. BATCH RENDER (Fragment)
        const fragment = document.createDocumentFragment();
        for (const product of initialSlice) {
            const productElement = layout === 'grid'
                ? await this.createProductCard(product)
                : await this.createProductListing(product);
            
            if (productElement) fragment.appendChild(productElement);
        }

        container.appendChild(fragment);

        // 5. INITIALIZE INFINITE SCROLL OBSERVER
        // We only start observing if there are more products left to load
        if (productsToRender.length > this.itemsPerBatch) {
            this.setupInfiniteScroll();
        }
    }

    renderMainFrame() {
        const mainFrameTemplate = document.createElement('template');
        mainFrameTemplate.innerHTML = `
            <div class="cartique-container" id="cartique-container">
                
                <aside class="cartique-sidebar" id="cartique-sidebar" style="display: ${this.features.sidebarDisplay}">
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

                    <footer class="cartique-product-footer" id="cartique-product-footer" style="display:${this.features.footerDisplay}"></footer>
                </main>
            </div>
            <!--
            <div id="cartique-hidden-blocks" style="display:none;"></div>
            --> 
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

        this.container.appendChild(mainFrameTemplate.content.cloneNode(true));
        
        // Set up overlay click handler
        const overlay = document.getElementById('cart-slide-overlay');
        if (overlay) {
            this.addEventListener(overlay, 'click', this.closeCart.bind(this));
        }
    }

    renderSidebar() {
        const sidebarWrapper = this.templateHolder.content.getElementById('cartique-sidebar-component');
        if (!sidebarWrapper) return;

        const sidebarContainer = document.getElementById('cartique-sidebar');
        if (!sidebarContainer) return;

        sidebarContainer.innerHTML = '';
        sidebarContainer.appendChild(sidebarWrapper.cloneNode(true));
    }

    renderControls() {
        // Search
        const searchWrapper = this.templateHolder.content.getElementById('cartique-search-container-component');
        if (searchWrapper) {
            const searchContainer = document.getElementById('cartique-search-container');
            searchContainer.innerHTML = '';
            searchContainer.appendChild(searchWrapper.cloneNode(true));
            
            const searchInput = searchContainer.querySelector('.cartique-search');
            if (searchInput) {
                this.addEventListener(searchInput, 'input', 
                    this.debounce(this.handleSearch.bind(this), 300)
                );
            }
        }

        // Sort
        const sortWrapper = this.templateHolder.content.getElementById('cartique-sort-container-component');
        if (sortWrapper) {
            const sortContainer = document.getElementById('cartique-sort-container');
            sortContainer.innerHTML = '';
            sortContainer.appendChild(sortWrapper.cloneNode(true));
            
            const sortDropdown = sortContainer.querySelector('.cartique-sort');
            if (sortDropdown) {
                this.addEventListener(sortDropdown, 'change', this.handleSort.bind(this));
            }
        }

        // View toggles
        const togglesWrapper = this.templateHolder.content.getElementById('cartique-view-toggles-container-component');
        if (togglesWrapper) {
            const togglesContainer = document.getElementById('cartique-view-toggles-container');
            togglesContainer.innerHTML = '';
            togglesContainer.appendChild(togglesWrapper.cloneNode(true));
        }

        // Cart icon
        const cartIconWrapper = this.templateHolder.content.getElementById('shopping-cart-icon-container-component');
        if (cartIconWrapper) {
            const cartIconContainer = document.getElementById('shopping-cart-icon-container');
            cartIconContainer.innerHTML = '';
            cartIconContainer.appendChild(cartIconWrapper.cloneNode(true));
            
            const cartIcon = document.getElementById('shopping-cart-icon');
            if (cartIcon) {
                this.addEventListener(cartIcon, 'click', this.showCart.bind(this));
            }
        }
    }

    renderFooter() {
        const wrapper = this.templateHolder.content.getElementById('cartique-product-footer-component');
        if (wrapper) {
            const footerContainer = document.getElementById('cartique-product-footer');
            if (footerContainer) {
                footerContainer.innerHTML = '';
                footerContainer.appendChild(wrapper.firstElementChild.cloneNode(true));
            }
        }
    }

    async setLayout(layout) {
        const gridContainer = document.getElementById('cartique-product-grid');
        const listContainer = document.getElementById('cartique-product-list');

        if (gridContainer && listContainer) {
            gridContainer.style.display = layout === 'grid' ? 'grid' : 'none';
            listContainer.style.display = layout === 'list' ? 'block' : 'none';
            this.currentLayout = layout;
            await this.renderProducts(layout);
        }
    }
}