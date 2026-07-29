/**
 * @semantq/storefront
 *
 * CollectionRenderer — Catalog, filters, menu, infinite scroll
 *
 * Migrated from: cartique/storefront/src/Storefront.js
 * Phase 2: Updated to call async methods from ProductRenderer.
 */

export default class CollectionRenderer {
    constructor(context) {
        Object.assign(this, context);
    }

    /**
     * Renders the catalogue menu (mega, inline, or stacked)
     */
    renderCatalogueMenu() {
        // 1. Get config and set defaults if keys are missing
        const cfg = this.features.menu;
        if (!cfg || !cfg.enabled) return;

        // Set Defaults: type -> mega, position -> top
        const menuType = cfg.type || 'mega';
        const menuPosition = cfg.position || 'top';
        const menuColumns = cfg.megaMenuColumns || 3;

        // 2. Determine Target Container using the defaulted position
        let anchor;
        if (menuPosition === 'custom' && cfg.containerId) {
            anchor = document.getElementById(cfg.containerId);
        } else {
            const anchorId = menuPosition === 'sidebar' ? 'cartique-menu-anchor-sidebar' : 'cartique-menu-anchor-top';
            anchor = document.getElementById(anchorId);
        }
        
        if (!anchor) return;

        const categories = this.categories || this._extractCategories();
        const activeId = String(this.activeCategoryId || 'all');
        
        let innerHtml = '';

        // Use menuType variable instead of cfg.type
        if (menuType === 'mega') {
            innerHtml = `
                <div class="cartique-mega-wrapper">
                    <button class="mega-trigger" aria-expanded="false">
                        ${cfg.label || 'Categories'} <span class="chevron"></span>
                    </button>
                    <div class="mega-content" style="grid-template-columns: repeat(${menuColumns}, 1fr);">
                        <div class="mega-item ${activeId === 'all' ? 'active' : ''}" data-cat-id="all">
                            <strong>All Products</strong>
                        </div>
                        ${categories.map(cat => `
                            <div class="mega-item ${activeId === String(cat.id) ? 'active' : ''}" data-cat-id="${cat.id}">
                                <span class="cat-name">${cat.name}</span>
                                ${cfg.showCounts ? `<span class="count">(${cat.count})</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>`;
        } else {
            const isInline = menuType === 'inline';
            innerHtml = `
                <div class="cartique-menu-container type-${menuType} ${cfg.collapseOnMobile ? 'mobile-collapse' : ''}">
                    <ul class="cartique-menu-list">
                        ${!isInline ? `<li class="menu-label">${cfg.label || 'Categories'}</li>` : ''}
                        <li class="cartique-menu-item ${activeId === 'all' ? 'active' : ''}" data-cat-id="all">All</li>
                        ${categories.map((cat, index) => `
                            <li class="cartique-menu-item ${activeId === String(cat.id) ? 'active' : ''} 
                                ${isInline && index >= (cfg.maxVisibleItems || 5) ? 'item-hidden' : ''}" 
                                data-cat-id="${cat.id}">
                                <span class="cat-name">${cat.name}</span>
                                ${cfg.showCounts ? `<span class="cat-count">(${cat.count})</span>` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>`;
        }

        anchor.innerHTML = innerHtml;
        this._attachMenuEvents(anchor);
        
        // Toggle Logic for Mega
        if (menuType === 'mega') {
            const wrapper = anchor.querySelector('.cartique-mega-wrapper');
            const trigger = anchor.querySelector('.mega-trigger');
            
            // Remove existing listeners to prevent duplicates
            const newTrigger = trigger.cloneNode(true);
            trigger.parentNode.replaceChild(newTrigger, trigger);
            
            newTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                wrapper.classList.toggle('is-open');
            });
            
            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!wrapper.contains(e.target)) {
                    wrapper.classList.remove('is-open');
                }
            });
        }
    }

    /**
     * Applies category and attribute filters to products
     * @deprecated Use applyAllFilters() instead
     */
    async applyFilters(activeFilters) {
        const hasActiveFilters = Object.keys(activeFilters).length > 0;

        if (!hasActiveFilters) {
            // If nothing is checked, show everything
            this.filteredProducts = [...this.allProducts];
        } else {
            this.filteredProducts = this.allProducts.filter(product => {
                // A product must match AT LEAST ONE value in EVERY active group (AND logic between groups)
                return Object.entries(activeFilters).every(([group, selectedValues]) => {
                    const productValue = product[group]; 
                    return selectedValues.includes(productValue);
                });
            });
        }

        // 3. Re-render the Catalogue
        await this.renderProductDisplays(); 
    }

    /**
     * Applies all active filters (category, search, attributes) to products
     * Updates filteredProducts and triggers re-render
     */
    async applyAllFilters() {
        this.filteredProducts = this.products.filter(product => {
            // 1. Category Filter (from mega menu ID OR sidebar name)
            let matchesCategory = true;
            
            // Check mega menu category (by ID)
            if (this.activeCategoryId) {
                matchesCategory = product.categories?.some(
                    c => String(c.id) === String(this.activeCategoryId)
                );
            }
            
            // Check sidebar category filter (by name) - AND logic with mega menu
            if (matchesCategory && this.activeFilters['category']?.length > 0) {
                const productCategoryNames = product.categories?.map(c => c.name) || [];
                matchesCategory = this.activeFilters['category'].some(
                    catName => productCategoryNames.includes(catName)
                );
            }

            if (!matchesCategory) return false;

            // 2. Search Query Filter
            const query = this.currentSearchQuery;
            const matchesSearch = !query || 
                (product.title?.toLowerCase().includes(query) || 
                 product.description?.toLowerCase().includes(query));

            if (!matchesSearch) return false;

            // 3. Sidebar Attribute Filters (excluding 'category' which we already handled)
            const attributeFilters = Object.entries(this.activeFilters).filter(
                ([key]) => key !== 'category'
            );
            
            const matchesAttributes = attributeFilters.every(([key, selectedValues]) => {
                if (!selectedValues || !selectedValues.length) return true;
                
                if (key === 'priceRange') {
                    const effectivePrice = product.sale_price || product.price || 
                        Math.min(...(product.variants?.map(v => v.sale_price || v.price) || [product.price]));
                    return selectedValues.some(rangeLabel => this._checkPriceMatch(effectivePrice, rangeLabel));
                }

                return product.variants?.some(variant => 
                    variant.attributes?.some(attr => 
                        attr.key.toLowerCase() === key.toLowerCase() && 
                        selectedValues.includes(attr.value)
                    )
                );
            });

            return matchesAttributes;
        });

        this.loadedCount = 0;
        await this.renderProductDisplays();
    }

    /**
     * Extracts unique categories from products with counts
     * @returns {Array} Array of category objects { id, name, count }
     */
    _extractCategories() {
        const catMap = new Map();
        this.products.forEach(product => {
            product.categories?.forEach(cat => {
                if (!catMap.has(cat.id)) {
                    catMap.set(cat.id, { id: cat.id, name: cat.name, count: 0 });
                }
                catMap.get(cat.id).count++;
            });
        });
        return Array.from(catMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * Attaches click events to menu items for category filtering
     * @param {HTMLElement} container - The menu container
     */
    _attachMenuEvents(container) {
        // 1. Handle Category Selection (Pills, List Items, and Mega Items)
        const selectors = '.cartique-menu-item, .mega-item';
        
        container.querySelectorAll(selectors).forEach(item => {
            item.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const catId = item.getAttribute('data-cat-id');
                const catName = item.querySelector('.cat-name')?.textContent;
                
                this.activeCategoryId = (catId === 'all') ? null : catId;

                // Close Mega Menu
                const wrapper = container.querySelector('.cartique-mega-wrapper');
                if (wrapper) wrapper.classList.remove('is-open');

                // FIX: Sync sidebar category checkboxes
                if (catId === 'all') {
                    // Uncheck all category checkboxes in sidebar
                    document.querySelectorAll('input[data-type="category"]').forEach(cb => {
                        cb.checked = false;
                    });
                    // Clear category from activeFilters
                    delete this.activeFilters['category'];
                }

                await this.renderCatalogueMenu();
                await this.applyAllFilters();
            });
        });

        // 2. Accessibility: Close Mega Menu on 'Escape' key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const wrapper = container.querySelector('.cartique-mega-wrapper');
                if (wrapper) wrapper.classList.remove('is-open');
            }
        });
    }

    /**
     * Resolves the container for menu placement
     * @param {Object} menu - Menu configuration
     * @returns {HTMLElement} The resolved container
     */
    _resolveMenuContainer(menu) {
        // Priority 1: Custom ID provided in HTML
        if (menu.position === 'custom' && menu.containerId) {
            let customEl = document.getElementById(menu.containerId);
            if (!customEl) {
                console.warn(`Cartique: #${menu.containerId} not found. Creating placeholder.`);
                customEl = document.createElement('div');
                customEl.id = menu.containerId;
                this.container.prepend(customEl); // Fallback placement
            }
            return customEl;
        }

        // Priority 2: Injected into the Sidebar
        if (menu.position === 'sidebar') {
            return this.container.querySelector('.cartique-sidebar-inner');
        }

        // Priority 3: Default Top Position
        return this.container.querySelector('.cartique-header-nav');
    }

    /**
     * Renders the filter sidebar with dynamic filter groups
     * @param {Array} filterGroups - Array of filter group configurations
     */
    renderFilterSidebar(filterGroups) {
        const sidebar = document.getElementById('cartique-sidebar-component');
        if (!sidebar) return;

        // 1. Static Price Section
        let html = `
            <div class="filter-group price-group">
                <div class="filter-header">
                    <span>Price</span>
                    <span class="chevron"></span>
                </div>
                <div class="price-slider-wrapper">
                     <div class="range-input">
                        <input type="range" class="range-min" min="0" max="1000" value="0">
                        <input type="range" class="range-max" min="0" max="1000" value="1000">
                     </div>
                     <div class="slider-track"></div>
                </div>
            </div>
            <hr class="sidebar-divider">
        `;

        // 2. Dynamic Content-Agnostic Sections
        html += filterGroups.map(group => `
            <div class="filter-group" data-filter-type="${group.id}">
                <div class="filter-header collapsible" onclick="this.parentElement.classList.toggle('is-collapsed')">
                    <span>${group.label}</span>
                    <span class="chevron"></span>
                </div>
                <div class="filter-content">
                    <div class="filter-search-container">
                        <span class="search-icon">🔍</span>
                        <input type="text" class="filter-search-input" placeholder="Search" onkeyup="filterList(this)">
                    </div>
                    <div class="filter-meta">Showing ${group.options.length} of ${group.options.length} options</div>
                    <div class="filter-options-list">
                        ${group.options.map(opt => `
                            <label class="filter-option">
                                <div class="checkbox-wrapper">
                                    <input type="checkbox" data-value="${opt.value}">
                                    <span class="checkmark"></span>
                                </div>
                                <span class="option-name">${opt.label}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
            <hr class="sidebar-divider">
        `).join('');

        sidebar.innerHTML = html;
    }

    /**
     * Renders sidebar filter sections from features configuration
     */
    renderSidebarFilters() {
        const container = document.getElementById('cartique-filter-sidebar');
        if (!container) return;

        const filters = { ...this.features.sidebarFeatures.filters };
        let finalHTML = '';

        // FIX: Add categories as the first filter group if sidebar is enabled
        if (this.categories && this.categories.length > 0) {
            const categoryNames = this.categories.map(cat => cat.name).sort();
            finalHTML += this.generateFilterHTML('category', categoryNames);
        }

        // Handle Price Range
        if (filters.priceRange) {
            finalHTML += this.generateFilterHTML('priceRange', filters.priceRange);
            delete filters.priceRange;
        }

        // Handle everything else dynamically
        finalHTML += Object.entries(filters).map(([group, options]) => {
            return this.generateFilterHTML(group, options);
        }).join('');

        container.innerHTML = finalHTML;

        // Attach event listener
        container.addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"]')) {
                this.handleFilterChange(e.target);
            }
        });
    }

    /**
     * Generates HTML for a filter section
     * @param {string} group - Filter group identifier
     * @param {Array} options - Filter options
     * @returns {string} HTML string
     */
    generateFilterHTML(group, options) {
        const title = group.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        return `
            <div class="filter-section collapsed" data-filter-group="${group}">
                <div class="filter-header" onclick="this.parentElement.classList.toggle('collapsed')">
                    ${title}
                    <span class="chevron"></span>
                </div>
                <div class="filter-content">
                    <div class="options-list">
                        ${options.map(val => `
                            <label class="option-item">
                                <input type="checkbox" data-type="${group}" value="${val}">
                                <span class="checkbox-custom"></span>
                                ${val}
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
            <hr class="filter-divider">
        `;
    }

    /**
     * Handles filter checkbox change events
     * @param {HTMLElement} element - The changed checkbox
     */
    async handleFilterChange(element) {
        const activeFilters = {};
        const checkedBoxes = document.querySelectorAll('.option-item input:checked');

        // Map current state from UI
        checkedBoxes.forEach(cb => {
            const type = cb.dataset.type;
            if (!activeFilters[type]) activeFilters[type] = [];
            activeFilters[type].push(cb.value);
        });

        // Store active filters and apply all filters together
        this.activeFilters = activeFilters;
        await this.applyAllFilters();
    }

    /**
     * Checks if a price matches a range label
     * @param {number} price - The price to check
     * @param {string} label - The range label (e.g., "R100-R200")
     * @returns {boolean}
     */
    _checkPriceMatch(price, label) {
        // Extract all numbers from the string (e.g., "R100-R200" -> [100, 200])
        const numbers = label.match(/\d+/g)?.map(Number);
        if (!numbers) return false;
        
        if (label.includes('Under')) {
            return price < numbers[0];
        }
        if (label.includes('Over')) {
            return price > numbers[0];
        }
        if (numbers.length === 2) {
            // Range case: e.g., "R100-R200"
            return price >= numbers[0] && price <= numbers[1];
        }
        return false;
    }

    /**
     * Initializes mobile filter UI elements
     */
    initMobileFilters() {
        const sidebar = document.getElementById('cartique-sidebar');
        if (!sidebar) return;

        // Add Mobile Trigger Bar to Body if it doesn't exist
        if (!document.querySelector('.mobile-filter-trigger')) {
            const trigger = document.createElement('div');
            trigger.className = 'mobile-filter-trigger';
            trigger.innerHTML = `Filter Products`;
            trigger.onclick = () => this.toggleMobileSidebar(true);
            document.body.appendChild(trigger);
        }

        // Add Close Button/Header to Sidebar if it doesn't exist
        if (!sidebar.querySelector('.filter-close-btn')) {
            const closeHeader = document.createElement('div');
            closeHeader.className = 'filter-close-btn';
            closeHeader.innerHTML = `
                <span>Filters</span>
                <span style="font-size: 24px;">&times;</span>
            `;
            closeHeader.onclick = () => this.toggleMobileSidebar(false);
            sidebar.prepend(closeHeader);
        }
    }

    /**
     * Toggles sidebar visibility on mobile
     * @param {boolean} open - Whether to open or close
     */
    toggleMobileSidebar(open) {
        const sidebar = document.getElementById('cartique-sidebar');
        if (!sidebar) return;

        if (open) {
            sidebar.classList.add('is-active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            sidebar.classList.remove('is-active');
            document.body.style.overflow = ''; // Restore background scrolling
        }
    }

    /**
     * Sets up filter event listeners for mobile
     */
    setupFilterEventListeners() {
        const sidebar = document.getElementById('cartique-sidebar');
        if (!sidebar) return;

        sidebar.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                // A. RUN YOUR FILTERING LOGIC
                // Ensure this function processes your 'filteredProducts' array
                this.handleFilterChange(e); 

                // B. MOBILE-SPECIFIC: Slide away after checking
                if (window.innerWidth <= 767) {
                    // 400ms delay allows user to see the "check" before it slides
                    setTimeout(() => {
                        this.toggleMobileSidebar(false);
                    }, 400);
                }
            }
        });
    }

    /**
     * Clears all active filters
     */
    async clearAllFilters() {
        // Uncheck all checkboxes
        const checkboxes = document.querySelectorAll('#cartique-filter-sidebar input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = false;
        });

        // Reset internal state
        this.activeFilters = {}; 
        this.filteredProducts = null; // Revert to original product list
        this.loadedCount = 0; // Reset infinite scroll

        // Re-render
        const layout = this.currentLayout || 'grid';
        await this.renderProducts(layout, this.products);

        // If on mobile, stay open so user can see it cleared, or close manually
        console.log("Filters cleared, state reset.");
    }

    /**
     * Renders mobile-specific UI elements
     */
    renderMobileUI() {
        const sidebar = document.getElementById('cartique-sidebar');
        const sidebarComponent = document.getElementById('cartique-sidebar-component');
        
        // 1. Inject the Bottom Filter Bar (The Trigger)
        if (!document.querySelector('.mobile-filter-trigger')) {
            const filterBar = document.createElement('div');
            filterBar.className = 'mobile-filter-trigger';
            filterBar.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 6h16M7 12h10M10 18h4"/>
                    </svg>
                    FILTER
                </div>
            `;
            filterBar.onclick = () => this.toggleMobileSidebar(true);
            document.body.appendChild(filterBar);
        }

        // 2. Inject the Sidebar Mobile Header (Title + Close + Clear)
        if (sidebar && !document.querySelector('.filter-mobile-header')) {
            const header = document.createElement('div');
            header.className = 'filter-mobile-header';
            header.innerHTML = `
                <span style="font-weight: 800; font-size: 1.2rem;">Filters</span>
                <div style="display: flex; gap: 20px; align-items: center;">
                    <button onclick="window.galleryInstance.clearAllFilters()" 
                            style="background:none; border:none; color:#888; text-decoration:underline; font-size:12px; cursor:pointer;">
                        Clear All
                    </button>
                    <span onclick="window.galleryInstance.toggleMobileSidebar(false)" 
                          style="font-size: 28px; cursor: pointer; line-height: 1;">&times;</span>
                </div>
            `;
            sidebar.prepend(header);
        }
    }

    /**
     * Sets up IntersectionObserver for infinite scroll
     */
    setupInfiniteScroll() {
        // Clean up previous observer if it exists
        if (this.observer) this.observer.disconnect();

        // Determine which container is active
        const layout = this.currentLayout || 'grid';
        const gridContainer = document.getElementById('cartique-product-grid');
        const listContainer = document.getElementById('cartique-product-list');
        const activeContainer = layout === 'grid' ? gridContainer : listContainer;
        
        if (!activeContainer) return;

        // Remove existing sentinel if any
        const existingSentinel = document.getElementById('cartique-scroll-sentinel');
        if (existingSentinel) {
            existingSentinel.remove();
        }

        // Create a new sentinel inside the active product container
        const sentinel = document.createElement('div');
        sentinel.id = 'cartique-scroll-sentinel';
        sentinel.style.cssText = 'grid-column: 1/-1; height: 50px; display: flex; align-items: center; justify-content: center; width: 100%;';
        activeContainer.appendChild(sentinel);

        this.observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.loadMoreProducts();
            }
        }, { rootMargin: '200px' });

        this.observer.observe(sentinel);
    }

    /**
     * Loads the next batch of products
     */
    async loadMoreProducts() {
        console.group("🚀 Infinite Scroll: Loading Batch");
        
        const productsSource = this.filteredProducts || this.products;
        const sentinel = document.getElementById('cartique-scroll-sentinel');

        // Safety guard
        if (this.loadedCount >= productsSource.length) {
            if (this.observer) this.observer.disconnect();
            if (sentinel) {
                sentinel.classList.remove('is-loading');
                sentinel.style.display = 'none'; 
            }
            console.groupEnd();
            return;
        }

        // Get the active container
        const layout = this.currentLayout || 'grid';
        const container = layout === 'grid' 
            ? document.getElementById('cartique-product-grid')
            : document.getElementById('cartique-product-list');
        
        if (!container) {
            console.groupEnd();
            return;
        }

        const nextBatch = productsSource.slice(
            this.loadedCount, 
            this.loadedCount + this.itemsPerBatch
        );

        if (sentinel) {
            sentinel.classList.add('is-loading');
            sentinel.innerHTML = '<div class="cartique-loader"></div>';
        }

        setTimeout(async () => {
            const fragment = document.createDocumentFragment();

            for (const product of nextBatch) {
                const el = (layout === 'grid') 
                    ? await this.createProductCard(product) 
                    : await this.createProductListing(product);
                
                if (el) {
                    el.classList.add('cartique-fade-in');
                    fragment.appendChild(el);
                }
            }

            // Insert BEFORE the sentinel so it stays at the bottom
            container.insertBefore(fragment, sentinel);
            
            this.loadedCount += nextBatch.length;
            
            if (sentinel) {
                sentinel.classList.remove('is-loading');
                sentinel.innerHTML = ''; 
            }

            if (this.loadedCount >= productsSource.length) {
                console.log("End of catalog reached. Disconnecting observer.");
                if (this.observer) this.observer.disconnect();
                if (sentinel) sentinel.style.display = 'none';
            }
            
            console.log(`Success: Added ${nextBatch.length} items. Total: ${this.loadedCount}`);
            console.groupEnd();
        }, 400); 
    }
}