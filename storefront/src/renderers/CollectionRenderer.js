/**
 * @semantq/storefront
 *
 * CollectionRenderer — Catalog, filters, menu, infinite scroll
 *
 * Phase 2D: Direct CommercialDecision consumption — no legacy wrapper.
 * Phase 3.6.1: Renderer stabilization — container creation and fallbacks.
 * Phase 3.6.2: Safe context method checks and recursion prevention.
 * Phase 3.6.3: Callback-based UI interactions.
 * Phase 3.7.1: Shared state integration.
 * Phase 3.7: Category filtering, back navigation, single render trigger.
 *
 * Single ownership: Search, Sort, Filters, Categories
 */

export default class CollectionRenderer {
    constructor(context = {}) {
        Object.assign(this, context);
        
        // Validate shared state
        if (!this.state) {
            throw new Error('CollectionRenderer requires shared state object');
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
        
        // Prevent recursion flags
        this._isRenderingMenu = false;
        this._isRenderingFilters = false;
        
        // CALLBACK CONTRACT
        this.onFilterApplied = null;
        this.onCategorySelect = null;
    }



        renderEmptyState({
        title = 'No products found',
        message = '',
        action = 'Return to shop'
    } = {}) {

        const container =
            document.getElementById('cartique-product-grid') ||
            document.getElementById('cartique-product-displays') ||
            document.getElementById('cartique-main-content');

        if (!container) {
            console.warn('[CollectionRenderer] Empty state container missing');
            return;
        }

        container.innerHTML = `
            <div class="no-results-msg"
                 style="grid-column:1/-1;width:100%;text-align:center;padding:4rem 1rem;">

                <h2>${title}</h2>

                <p style="font-size:1.2rem;color:#555;margin:1rem 0;">
                    ${message}
                </p>

                <button
                    onclick="window.location.href=document.querySelector('base')?.href || '/shop/'"
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
    

    /**
     * Handles search query from ProductRenderer
     * @param {string} query - The search query
     */
    handleSearch(query) {
        if (this.features?.debug) {
            console.log('[TRACE] CollectionRenderer.handleSearch:', query);
            console.trace();
        }
        
        this.state.currentSearchQuery = query || '';
        this.currentSearchQuery = this.state.currentSearchQuery; // Legacy alias
        this.applyAllFilters();

        if (this.behavior && query) {
            this.behavior.searchPerformed(query, {
                metadata: { source: 'search_bar' }
            });
        }
    }

    /**
     * Handles sort from ProductRenderer
     * @param {string} sortType - The sort type (price-asc, price-desc, title-asc, title-desc)
     */
    handleSort(sortType) {
        if (this.features?.debug) {
            console.log('[TRACE] CollectionRenderer.handleSort:', sortType);
            console.trace();
        }
        
        if (!sortType) return;
        this.state.currentSortType = sortType;
        this.currentSortType = this.state.currentSortType; // Legacy alias
        this.applyAllFilters();
    }

    /**
     * Handles category selection from menu
     * @param {string} catId - The category ID (or 'all' for all products)
     */
    async handleCategorySelect(catId) {
        if (this.features?.debug) {
            console.log('[TRACE] CollectionRenderer.handleCategorySelect:', catId);
            console.trace();
        }

        // Update state
        this.activeCategoryId = (catId === 'all') ? null : catId;
        this.state.activeCategoryId = this.activeCategoryId;

        // Update UI using INSTANCE container, NOT global query
        const containerId = this.features?.containerId || 'cartique';
        const container = document.getElementById(containerId);
        if (container) {
            const menuContainer = container.querySelector('[data-menu-container]');
            if (menuContainer) {
                menuContainer.querySelectorAll('.cartique-menu-item').forEach(item => {
                    const isActive = item.dataset.catId === catId;
                    item.classList.toggle('active', isActive);
                });
            }
        }

        // Apply filters — triggers onFilterApplied → render (ONLY ONE)
        await this.applyAllFilters();

        // Track category view
        if (this.behavior && this.activeCategoryId) {
            this.behavior.categoryView(this.activeCategoryId, {
                metadata: { source: 'category_menu' }
            });
        }
        
        // Trigger callback if set
        if (typeof this.onCategorySelect === 'function') {
            this.onCategorySelect(this.activeCategoryId);
        }
    }

    /**
     * ✅ Handle back to list view from single product
     */
    async handleBackToList() {
        if (this.features?.debug) {
            console.log('[TRACE] CollectionRenderer.handleBackToList called');
            console.trace();
        }

        // Reset state
        this.state.singleProductViewActive = false;
        this.singleProductViewActive = false;
        this.state.selectedProduct = null;

        // Clear single product DOM
        const containerId = this.features?.containerId || 'cartique';
        const container = document.getElementById(containerId);
        if (container) {
            const productView = container.querySelector('#single-product-view-container');
            if (productView) {
                productView.innerHTML = '';
                productView.style.display = 'none';
            }
        }

        // Show product grid
        const grid = document.getElementById('cartique-product-grid');
        if (grid) {
            grid.style.display = 'grid';
        }

        // Re-render collection
        await this.applyAllFilters();
    }

    /**
     * Renders the catalogue menu (mega, inline, or stacked)
     * Safe version — no recursion
     */
    async renderCatalogueMenu() {
        // Prevent recursion
        if (this._isRenderingMenu) {
            console.warn('CollectionRenderer: renderCatalogueMenu already in progress, skipping');
            return;
        }
        
        this._isRenderingMenu = true;
        
        try {
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
                    anchor.dataset.menuContainer = 'true';
                    mainContent.prepend(anchor);
                } else {
                    console.warn('Menu anchor not found, skipping menu render');
                    return;
                }
            }

            // Get categories
            const categories = this.categories || this._extractCategories?.() || [];
            const activeId = String(this.state.activeCategoryId || 'all');

            // Build simple menu HTML
            let html = `
                <div class="cartique-menu-container" data-menu-container>
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
                if (this.addEventListener) {
                    this.addEventListener(item, 'click', async (e) => {
                        e.preventDefault();
                        const catId = item.getAttribute('data-cat-id');
                        await this.handleCategorySelect(catId);
                    });
                }
            });
        } finally {
            this._isRenderingMenu = false;
        }
    }

    /**
     * Internal menu render — no recursion
     */
    async _renderMenuInternal() {
        const cfg = this.features?.menu;
        if (!cfg || !cfg.enabled) return;

        let anchor = document.getElementById('cartique-menu-anchor-top');
        if (!anchor) {
            anchor = document.getElementById('cartique-menu-anchor-sidebar');
        }
        if (!anchor) return;

        const categories = this.categories || this._extractCategories?.() || [];
        const activeId = String(this.state.activeCategoryId || 'all');

        let html = `
            <div class="cartique-menu-container" data-menu-container>
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
    }

    /**
     * Applies category and attribute filters to products
     * @deprecated Use applyAllFilters() instead
     */
    async applyFilters(activeFilters) {
        if (this.features?.debug) {
            console.log('[TRACE] CollectionRenderer.applyFilters (deprecated):', activeFilters);
            console.trace();
        }
        
        const hasActiveFilters = Object.keys(activeFilters || {}).length > 0;

        if (!hasActiveFilters) {
            this.state.filteredProducts = [...(this.products || [])];
            this.filteredProducts = this.state.filteredProducts; // Legacy alias
        } else {
            this.state.filteredProducts = (this.products || []).filter(product => {
                return Object.entries(activeFilters).every(([group, selectedValues]) => {
                    const productValue = product[group]; 
                    return selectedValues.includes(productValue);
                });
            });
            this.filteredProducts = this.state.filteredProducts; // Legacy alias
        }

        await this._notifyFilterApplied();
    }

    /**
     * Applies all active filters (category, search, attributes) to products
     * Updates filteredProducts and triggers re-render
     */
    async applyAllFilters() {
        if (this.features?.debug) {
            console.log('[TRACE] applyAllFilters called');
            console.trace();
        }

        // Always start from the master product list
        let result = [...(this.products || [])];

        // --- CATEGORY FILTER ---
        if (this.state.activeCategoryId) {
            result = result.filter(product =>
                product.categories?.some(c => 
                    String(c.id) === String(this.state.activeCategoryId)
                )
            );
        }

        // --- ATTRIBUTE FILTERS ---
        if (this.state.activeFilters && Object.keys(this.state.activeFilters).length > 0) {
            result = result.filter(product => {
                return Object.entries(this.state.activeFilters).every(([key, selectedValues]) => {
                    if (!selectedValues || !selectedValues.length) return true;
                    
                    if (key === 'priceRange') {
                        const price = product.price || 0;
                        return selectedValues.some(rangeLabel => {
                            const numbers = rangeLabel.match(/\d+/g)?.map(Number);
                            if (!numbers) return false;
                            if (rangeLabel.includes('Under')) return price < numbers[0];
                            if (rangeLabel.includes('Over')) return price > numbers[0];
                            if (numbers.length === 2) return price >= numbers[0] && price <= numbers[1];
                            return false;
                        });
                    }

                    return product.variants?.some(variant =>
                        variant.attributes?.some(attr =>
                            attr.key.toLowerCase() === key.toLowerCase() &&
                            selectedValues.includes(attr.value)
                        )
                    );
                });
            });
        }

        // --- SEARCH ---
        if (this.state.currentSearchQuery) {
            const query = this.state.currentSearchQuery.toLowerCase().trim();
            result = result.filter(product => {
                const searchableText = [
                    product.name,
                    product.title,
                    product.description,
                    product.sku
                ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
                return searchableText.includes(query);
            });
        }

        // --- SORT ---
        switch (this.state.currentSortType) {
            case 'price-asc':
                result.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-desc':
                result.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'title-asc':
                result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                break;
            case 'title-desc':
                result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
                break;
        }

        // Update state
this.state.filteredProducts = result;
this.filteredProducts = result;


// Empty result handling
if (result.length === 0) {

    const searchQuery = this.state.currentSearchQuery;

    if (searchQuery) {
        this.renderEmptyState({
            title: 'No products found',
            message: `We could not find any products matching "${searchQuery}".`
        });
        return;
    }

    if (this.state.activeCategoryId) {
        this.renderEmptyState({
            title: 'No products found',
            message: 'This category currently has no products.'
        });
        return;
    }
}


// Single render trigger
if (typeof this.onFilterApplied === 'function') {
    if (this.features?.debug) {
        console.log('[TRACE] calling onFilterApplied with', result.length, 'products');
        console.trace();
    }

    this.onFilterApplied(result);
}

    }

    /**
     * Notify that filters have been applied
     * Calls onFilterApplied callback if set
     */
    async _notifyFilterApplied() {
        if (this.features?.debug) {
            console.log('[TRACE] _notifyFilterApplied called');
            console.trace();
        }
        
        if (typeof this.onFilterApplied === 'function') {
            await this.onFilterApplied(this.state.filteredProducts);
        } else if (typeof this.renderProductDisplays === 'function') {
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
     * Safe version — no recursion
     */
    renderSidebarFilters() {
        // Prevent recursion
        if (this._isRenderingFilters) {
            console.warn('CollectionRenderer: renderSidebarFilters already in progress, skipping');
            return;
        }
        
        this._isRenderingFilters = true;
        
        try {
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
            if (this.addEventListener) {
                this.addEventListener(container, 'change', (e) => {
                    if (e.target.matches('input[type="checkbox"]')) {
                        this.handleFilterChange(e.target);
                    }
                });
            }
        } finally {
            this._isRenderingFilters = false;
        }
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
        if (this.features?.debug) {
            console.log('[TRACE] CollectionRenderer.handleFilterChange');
            console.trace();
        }
        
        const activeFilters = {};
        const checkedBoxes = document.querySelectorAll('.option-item input:checked');

        checkedBoxes.forEach(cb => {
            const type = cb.dataset.type;
            if (!activeFilters[type]) activeFilters[type] = [];
            activeFilters[type].push(cb.value);
        });

        this.state.activeFilters = activeFilters;
        this.activeFilters = activeFilters; // Legacy alias
        await this.applyAllFilters();
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

        if (this.addEventListener) {
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
    }

    /**
     * Clears all active filters
     */
    async clearAllFilters() {
        if (this.features?.debug) {
            console.log('[TRACE] CollectionRenderer.clearAllFilters');
            console.trace();
        }
        
        const checkboxes = document.querySelectorAll('#cartique-filter-sidebar input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = false;
        });

        // Reset state
        this.state.activeFilters = {};
        this.state.filteredProducts = null;
        this.state.loadedCount = 0;
        this.state.currentSearchQuery = '';
        this.state.currentSortType = '';
        this.state.activeCategoryId = null;
        
        // Legacy aliases
        this.activeFilters = {};
        this.filteredProducts = null;
        this.loadedCount = 0;
        this.currentSearchQuery = '';
        this.currentSortType = '';
        this.activeCategoryId = null;

        // Re-render
        await this.applyAllFilters();
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

        const layout = this.state.currentLayout || 'grid';
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
        
        const productsSource = this.state.filteredProducts || this.products || [];
        const sentinel = document.getElementById('cartique-scroll-sentinel');

        if (this.state.loadedCount >= productsSource.length) {
            if (this.observer) this.observer.disconnect();
            if (sentinel) {
                sentinel.classList.remove('is-loading');
                sentinel.style.display = 'none';
            }
            console.groupEnd();
            return;
        }

        const layout = this.state.currentLayout || 'grid';
        const container = layout === 'grid' 
            ? document.getElementById('cartique-product-grid')
            : document.getElementById('cartique-product-list');
        
        if (!container) {
            console.warn('Container not found for infinite scroll');
            console.groupEnd();
            return;
        }

        const itemsPerBatch = this.state.itemsPerBatch || this.features?.itemsPerPage || 12;
        const nextBatch = productsSource.slice(
            this.state.loadedCount, 
            this.state.loadedCount + itemsPerBatch
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
            
            this.state.loadedCount += nextBatch.length;
            this.loadedCount = this.state.loadedCount; // Legacy alias
            
            if (sentinel) {
                sentinel.classList.remove('is-loading');
                sentinel.innerHTML = '';
            }

            if (this.state.loadedCount >= productsSource.length) {
                console.log('End of catalog reached. Disconnecting observer.');
                if (this.observer) this.observer.disconnect();
                if (sentinel) sentinel.style.display = 'none';
            }
            
            console.log(`Success: Added ${nextBatch.length} items. Total: ${this.state.loadedCount}`);
            console.groupEnd();
        }, 400);
    }
}