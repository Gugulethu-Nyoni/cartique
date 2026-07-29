/**
 * @semantq/storefront
 *
 * CollectionRenderer — Catalog, filters, menu, infinite scroll
 *
 * Phase 2D: Direct CommercialDecision consumption — no legacy wrapper.
 * Phase 3.6.1: Renderer stabilization — container creation and fallbacks.
 */

export default class CollectionRenderer {
    constructor(context = {}) {
        Object.assign(this, context);
    }

    /**
     * Renders the catalogue menu (mega, inline, or stacked)
     */
    async renderCatalogueMenu() {
        // Check if menu is enabled
        const cfg = this.features?.menu;
        if (!cfg || !cfg.enabled) {
            return;
        }

        // Find container
        let anchor = document.getElementById('cartique-menu-anchor-top');
        if (!anchor) {
            anchor = document.getElementById('cartique-menu-anchor-sidebar');
        }
        if (!anchor) {
            // Create anchor if missing
            const mainContent = document.getElementById('cartique-main-content');
            if (mainContent) {
                anchor = document.createElement('div');
                anchor.id = 'cartique-menu-anchor-top';
                mainContent.prepend(anchor);
            } else {
                console.warn('Menu anchor not found, skipping menu render');
                return;
            }
        }

        // Get categories
        const categories = this.categories || this._extractCategories?.() || [];
        const activeId = String(this.activeCategoryId || 'all');

        // Build simple menu HTML
        let html = `
            <div class="cartique-menu-container">
                <ul class="cartique-menu-list">
                    <li class="cartique-menu-item ${activeId === 'all' ? 'active' : ''}" data-cat-id="all">
                        All Products
                    </li>
                    ${categories.map(cat => `
                        <li class="cartique-menu-item ${activeId === String(cat.id) ? 'active' : ''}" data-cat-id="${cat.id}">
                            <span class="cat-name">${cat.name}</span>
                            ${cfg.showCounts ? `<span class="cat-count">(${cat.count})</span>` : ''}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        anchor.innerHTML = html;

        // Attach click events
        anchor.querySelectorAll('.cartique-menu-item').forEach(item => {
            this.addEventListener(item, 'click', async (e) => {
                e.preventDefault();
                const catId = item.getAttribute('data-cat-id');
                this.activeCategoryId = (catId === 'all') ? null : catId;
                await this.renderCatalogueMenu();
                if (typeof this.applyAllFilters === 'function') {
                    await this.applyAllFilters();
                }
            });
        });
    }

    /**
     * Applies category and attribute filters to products
     * @deprecated Use applyAllFilters() instead
     */
    async applyFilters(activeFilters) {
        const hasActiveFilters = Object.keys(activeFilters || {}).length > 0;

        if (!hasActiveFilters) {
            this.filteredProducts = [...this.products || []];
        } else {
            this.filteredProducts = (this.products || []).filter(product => {
                return Object.entries(activeFilters).every(([group, selectedValues]) => {
                    const productValue = product[group]; 
                    return selectedValues.includes(productValue);
                });
            });
        }

        if (typeof this.renderProductDisplays === 'function') {
            await this.renderProductDisplays();
        }
    }

    /**
     * Applies all active filters (category, search, attributes) to products
     * Updates filteredProducts and triggers re-render
     */
    async applyAllFilters() {
        if (!this.products || !Array.isArray(this.products)) {
            console.warn('Products not available for filtering');
            this.filteredProducts = [];
            return;
        }

        this.filteredProducts = this.products.filter(product => {
            // 1. Category Filter
            let matchesCategory = true;
            
            if (this.activeCategoryId) {
                matchesCategory = product.categories?.some(
                    c => String(c.id) === String(this.activeCategoryId)
                ) || false;
            }
            
            if (matchesCategory && this.activeFilters?.['category']?.length > 0) {
                const productCategoryNames = product.categories?.map(c => c.name) || [];
                matchesCategory = this.activeFilters['category'].some(
                    catName => productCategoryNames.includes(catName)
                );
            }

            if (!matchesCategory) return false;

            // 2. Search Query Filter
            const query = this.currentSearchQuery || '';
            const matchesSearch = !query || 
                (product.title?.toLowerCase().includes(query) || 
                 product.description?.toLowerCase().includes(query));

            if (!matchesSearch) return false;

            // 3. Sidebar Attribute Filters
            const attributeFilters = Object.entries(this.activeFilters || {}).filter(
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
                        String(attr.key).toLowerCase() === String(key).toLowerCase() && 
                        selectedValues.includes(attr.value)
                    )
                ) || false;
            });

            return matchesAttributes;
        });

        this.loadedCount = 0;
        if (typeof this.renderProductDisplays === 'function') {
            await this.renderProductDisplays();
        }
    }

    /**
     * Extracts unique categories from products with counts
     * @returns {Array} Array of category objects { id, name, count }
     */
    _extractCategories() {
        if (!this.products || !Array.isArray(this.products)) {
            return [];
        }
        
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
     * Resolves the container for menu placement
     * @param {Object} menu - Menu configuration
     * @returns {HTMLElement} The resolved container
     */
    _resolveMenuContainer(menu) {
        if (!menu) return null;
        
        if (menu.position === 'custom' && menu.containerId) {
            let customEl = document.getElementById(menu.containerId);
            if (!customEl) {
                console.warn(`Cartique: #${menu.containerId} not found. Creating placeholder.`);
                customEl = document.createElement('div');
                customEl.id = menu.containerId;
                const container = document.getElementById('cartique-container');
                if (container) {
                    container.prepend(customEl);
                } else {
                    document.body.appendChild(customEl);
                }
            }
            return customEl;
        }

        if (menu.position === 'sidebar') {
            return document.querySelector('.cartique-sidebar-inner') || document.getElementById('cartique-sidebar');
        }

        return document.getElementById('cartique-menu-anchor-top') || document.getElementById('cartique-header-nav');
    }

    /**
     * Renders the filter sidebar with dynamic filter groups
     * @param {Array} filterGroups - Array of filter group configurations
     */
    renderFilterSidebar(filterGroups = []) {
        let sidebar = document.getElementById('cartique-sidebar-component');
        if (!sidebar) {
            sidebar = document.getElementById('cartique-sidebar');
            if (!sidebar) {
                console.warn('Sidebar not found for filter rendering');
                return;
            }
        }

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
        if (filterGroups && filterGroups.length > 0) {
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
                        <div class="filter-meta">Showing ${group.options?.length || 0} of ${group.options?.length || 0} options</div>
                        <div class="filter-options-list">
                            ${(group.options || []).map(opt => `
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
        }

        sidebar.innerHTML = html;
    }

    /**
     * Renders sidebar filter sections from features configuration
     */
    renderSidebarFilters() {
        const container = document.getElementById('cartique-filter-sidebar');
        if (!container) {
            console.warn('Filter sidebar container not found');
            return;
        }

        const filters = { ...this.features?.sidebarFeatures?.filters || {} };
        let finalHTML = '';

        // Add categories as the first filter group if sidebar is enabled
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
        this.addEventListener(container, 'change', (e) => {
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
    generateFilterHTML(group, options = []) {
        const title = String(group).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
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

        checkedBoxes.forEach(cb => {
            const type = cb.dataset.type;
            if (!activeFilters[type]) activeFilters[type] = [];
            activeFilters[type].push(cb.value);
        });

        this.activeFilters = activeFilters;
        if (typeof this.applyAllFilters === 'function') {
            await this.applyAllFilters();
        }
    }

    /**
     * Checks if a price matches a range label
     * @param {number} price - The price to check
     * @param {string} label - The range label (e.g., "R100-R200")
     * @returns {boolean}
     */
    _checkPriceMatch(price, label) {
        if (!label) return false;
        
        const numbers = String(label).match(/\d+/g)?.map(Number);
        if (!numbers) return false;
        
        if (label.includes('Under')) {
            return price < numbers[0];
        }
        if (label.includes('Over')) {
            return price > numbers[0];
        }
        if (numbers.length === 2) {
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

        if (!document.querySelector('.mobile-filter-trigger')) {
            const trigger = document.createElement('div');
            trigger.className = 'mobile-filter-trigger';
            trigger.innerHTML = `Filter Products`;
            trigger.onclick = () => this.toggleMobileSidebar(true);
            document.body.appendChild(trigger);
        }

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
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('is-active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Sets up filter event listeners for mobile
     */
    setupFilterEventListeners() {
        const sidebar = document.getElementById('cartique-sidebar');
        if (!sidebar) return;

        this.addEventListener(sidebar, 'change', (e) => {
            if (e.target.type === 'checkbox') {
                this.handleFilterChange(e);
                if (window.innerWidth <= 767) {
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
        const checkboxes = document.querySelectorAll('#cartique-filter-sidebar input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = false;
        });

        this.activeFilters = {};
        this.filteredProducts = null;
        this.loadedCount = 0;

        const layout = this.currentLayout || 'grid';
        if (typeof this.renderProducts === 'function') {
            await this.renderProducts(layout, this.products);
        }
        
        console.log('Filters cleared, state reset.');
    }

    /**
     * Renders mobile-specific UI elements
     */
    renderMobileUI() {
        const sidebar = document.getElementById('cartique-sidebar');
        
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

        if (sidebar && !document.querySelector('.filter-mobile-header')) {
            const header = document.createElement('div');
            header.className = 'filter-mobile-header';
            header.innerHTML = `
                <span style="font-weight: 800; font-size: 1.2rem;">Filters</span>
                <div style="display: flex; gap: 20px; align-items: center;">
                    <button onclick="window.galleryInstance?.clearAllFilters?.()" 
                            style="background:none; border:none; color:#888; text-decoration:underline; font-size:12px; cursor:pointer;">
                        Clear All
                    </button>
                    <span onclick="window.galleryInstance?.toggleMobileSidebar?.(false)" 
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
        if (this.observer) this.observer.disconnect();

        const layout = this.currentLayout || 'grid';
        const gridContainer = document.getElementById('cartique-product-grid');
        const listContainer = document.getElementById('cartique-product-list');
        const activeContainer = layout === 'grid' ? gridContainer : listContainer;
        
        if (!activeContainer) {
            console.warn('Active container not found for infinite scroll');
            return;
        }

        const existingSentinel = document.getElementById('cartique-scroll-sentinel');
        if (existingSentinel) {
            existingSentinel.remove();
        }

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
        console.group('🚀 Infinite Scroll: Loading Batch');
        
        const productsSource = this.filteredProducts || this.products || [];
        const sentinel = document.getElementById('cartique-scroll-sentinel');

        if (this.loadedCount >= productsSource.length) {
            if (this.observer) this.observer.disconnect();
            if (sentinel) {
                sentinel.classList.remove('is-loading');
                sentinel.style.display = 'none';
            }
            console.groupEnd();
            return;
        }

        const layout = this.currentLayout || 'grid';
        const container = layout === 'grid' 
            ? document.getElementById('cartique-product-grid')
            : document.getElementById('cartique-product-list');
        
        if (!container) {
            console.warn('Container not found for infinite scroll');
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
                let el;
                try {
                    el = (layout === 'grid') 
                        ? await this.createProductCard(product) 
                        : await this.createProductListing(product);
                } catch (e) {
                    console.warn('Product creation failed:', e.message);
                    continue;
                }
                
                if (el) {
                    el.classList.add('cartique-fade-in');
                    fragment.appendChild(el);
                }
            }

            container.insertBefore(fragment, sentinel);
            
            this.loadedCount += nextBatch.length;
            
            if (sentinel) {
                sentinel.classList.remove('is-loading');
                sentinel.innerHTML = '';
            }

            if (this.loadedCount >= productsSource.length) {
                console.log('End of catalog reached. Disconnecting observer.');
                if (this.observer) this.observer.disconnect();
                if (sentinel) sentinel.style.display = 'none';
            }
            
            console.log(`Success: Added ${nextBatch.length} items. Total: ${this.loadedCount}`);
            console.groupEnd();
        }, 400);
    }

    /**
     * Handles sort
     */
    async handleSort(event) {
        const sortType = event?.target?.value;
        if (!sortType) return;
        
        this.currentSortType = sortType;

        const sortedProducts = [...(this.filteredProducts || this.products || [])];

        switch (sortType) {
            case 'price-asc':
                sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'title-asc':
                sortedProducts.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                break;
            case 'title-desc':
                sortedProducts.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
                break;
            default:
                break;
        }

        this.filteredProducts = sortedProducts;
        this.loadedCount = 0;
        if (typeof this.renderProductDisplays === 'function') {
            await this.renderProductDisplays();
        }
    }
}