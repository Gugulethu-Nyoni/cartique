"use strict"
const CARTIQUE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
`;


export default class Cartique {
 constructor(products, features = {}, callbacks = {}) {
    // 1. Validation
    if (!products || !Array.isArray(products)) {
        throw new Error('Cartique requires an array of products');
    }

    // 2. Default Configuration & Feature Merging
    this.defaultFeatures = {
        grid: true,
        pagination: true,
        columns: 3,
        rows: 10,
        sidebar: true,
        footer: true,
        search: true,
        sorting: true,
        sale: false,
        theme: 'light',
        themeColor: '#2a2a2a', 
        containerId: 'cartique',
        containerClass: 'cartique-container',
        checkoutUrl: '#',
        checkoutUrlMode: 'self',
        sidebarDisplay: 'block',
        footerDisplay: 'block',
        menu: {
            enabled: false,
            type: 'inline', // 'mega', 'inline', 'stacked'
            position: 'top', // 'top', 'sidebar', 'custom'
            containerId: 'cartique-catalogue-menu',
            label: 'Categories',
            showCounts: true,
            megaMenuColumns: 3
        },
        sidebarFeatures: {
            filters: {}, // Dynamically injected from extractVariantFilters
        }
    };

    // Deep merge to ensure nested objects like sidebarFeatures aren't overwritten
    this.features = this.deepMerge(this.defaultFeatures, features);
    this.currencySymbol = this.features.currencySymbol || '$';


    // 3. Data State Management
    this.products = products;
    this.filteredProducts = [...products];
    this.categories = this._extractCategories(); 
    
    
    // Initialize search state
    this.currentSearchQuery = '';

    // Register URL state restorers
    this.urlStateRestorers = [];

    this.registerUrlStateRestorer(this.restoreCartState);
    this.registerUrlStateRestorer(this.restoreSearchState);



    this.currentSortType = '';
    this.currentLayout = 'grid';
    this.activeCategoryId = null;
    this.activeFilters = {}; // Key format: { color: Set(['Red']), size: Set(['XL']) }
    this.singleProductViewActive = false;
    this.previousViewState = null;

    // 4. Component Lifecycle References
    this.container = null;
    this.templateHolder = null;
    this.eventListeners = new Map();
    
    // Cleanup Timers
    this.toastTimer1 = null;
    this.toastTimer2 = null;
    this.redirectTimer = null;

    this.itemsPerBatch = this.features.itemsPerPage || 12;
    this.loadedCount = this.itemsPerBatch;

    this.callbacks = callbacks || {};

    // 5. Fire off the Engine
    this.init();
}




// ==========================================================
// PUBLIC API - START PUBLIC API BLOCK
// ==========================================================

/**
 * Opens the cart page programmatically.
 * This is the public method for external integration.
 * 
 * @example
 * cartique.openCart();
 */
openCart() {
  console.log('🔍 4. openCart() called');
    this.showCartPage();
    //this.showCartPage();
}



// ==========================================================
// URL STATE RESTORATION
// ==========================================================

/**
 * Returns the current browser URL state.
 * Used internally for URL-based state restoration.
 * 
 * @returns {Object} { pathname, hash, params }
 */
getCurrentRoute() {
    return {
        pathname: window.location.pathname,
        hash: window.location.hash.toLowerCase(),
        params: new URLSearchParams(window.location.search)
    };
}

/**
 * Restores Cartique UI state from the current URL.
 * Called once after initialisation.
 * 
 * This is the entry point for all URL-based state restoration.
 * 
 * Future extensions:
 * - restoreSearchState()
 * - restoreProductState()
 * - restoreCategoryState()
 */
restoreStateFromUrl() {
      console.log('🔍 1. restoreStateFromUrl() called');

    this.restoreCartState();
}

/**
 * Restores cart state from URL.
 * Checks for #cart hash or ?ui=cart query parameter.
 */
restoreCartState() {
   console.log('🔍 2. restoreCartState() called');
    const route = this.getCurrentRoute();
    console.log('🔍    route.hash:', route.hash);
    console.log('🔍    route.params.get("ui"):', route.params.get('ui'));
    
    if (route.hash === '#cart' || route.params.get('ui') === 'cart') {
        console.log('🔍 3. Cart route detected — calling openCart()');
        this.openCart();
    }
}







// ==========================================================
// PUBLIC SEARCH API
// ==========================================================

// ==========================================================
// URL STATE RESTORATION — Registration Helper
// ==========================================================

/**
 * Registers a URL state restorer function.
 * Prevents duplicate registration of the same restorer.
 * Restorers are executed in registration order.
 * 
 * @param {Function} restorer - The restorer function
 */
registerUrlStateRestorer(restorer) {
    if (typeof restorer !== 'function') {
        return;
    }

    if (!this.urlStateRestorers.includes(restorer)) {
        this.urlStateRestorers.push(restorer);
    }
}


// ==========================================================
// INTERNAL IMPLEMENTATION — Search Command Handler
// ==========================================================

/**
 * Internal API. Do not call directly.
 * Use setSearchQuery() from outside Cartique.
 * 
 * Executes the search operation against the current catalogue.
 * Updates search state and invokes the filtering pipeline.
 * 
 * Future extensions:
 * - Remote search (Algolia/Meilisearch/ElasticSearch)
 * - Search normalisation (diacritics, synonyms, stemming)
 * - Search analytics and history
 * - Debounced search
 * - Search suggestions
 * 
 * @param {string} rawQuery - The raw search query
 */
performSearch(rawQuery = '') {
    const normalisedQuery = String(rawQuery).trim();

    if (normalisedQuery === this.currentSearchQuery) {
        return;
    }

    this.currentSearchQuery = normalisedQuery;
    this.applyAllFilters();
}



/**
 * Sets the current search query and executes the search operation.
 * This is the only supported public way to change search state.
 * 
 * @param {string} query - The search/filter query
 * @example cartique.setSearchQuery("oud");
 */
setSearchQuery(query = '') {
    this.performSearch(query);
}

/**
 * Clears the current search query.
 * @example cartique.clearSearchQuery();
 */
clearSearchQuery() {
    this.setSearchQuery('');
}

/**
 * Returns the current search query.
 * @returns {string} The current search query
 * @example const query = cartique.getSearchQuery();
 */
getSearchQuery() {
    return this.currentSearchQuery;
}


// ==========================================================
// URL STATE RESTORATION
// ==========================================================

/**
 * Returns the current browser URL state.
 * @returns {Object} { pathname, hash, params }
 */
getCurrentRoute() {
    return {
        pathname: window.location.pathname,
        hash: window.location.hash.toLowerCase(),
        params: new URLSearchParams(window.location.search)
    };
}

/**
 * Restores Cartique state from the current URL.
 * Called once after initialisation.
 * 
 * Registered restorers are executed in registration order.
 */
restoreStateFromUrl() {
    this.urlStateRestorers.forEach(fn => fn.call(this));
}

/**
 * Restores cart state from URL.
 * Checks for #cart hash or ?ui=cart query parameter.
 */
restoreCartState() {
    const route = this.getCurrentRoute();

    if (
        route.hash === '#cart' ||
        route.params.get('ui') === 'cart'
    ) {
        this.openCart();
    }
}

/**
 * Restores search state from URL.
 * Checks for ?search=query parameter.
 */
restoreSearchState() {
    const route = this.getCurrentRoute();
    const query = route.params.get('search');

    if (query !== null) {
        this.performSearch(query);
    }
}



/* END PUBLIC API BLOCK */









/* FILTERS AND SHOP MENU CAT BASED PAGES SIMULATION */

injectCSS() {
    // Prevent duplicate injection
    if (document.getElementById('cartique-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'cartique-styles';
    style.textContent = `
        /* Critical render styles */
        #${this.features.containerId} {
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .cartique-container {
            position: relative;
            min-height: 100vh;
        }
        
        /* Main Cartique CSS */
        ${CARTIQUE_CSS}
    `;
    document.head.appendChild(style);
}


applyTheme() {
    // Set accent color
    const accentColor = this.features.themeColor || '#2a2a2a';
    document.documentElement.style.setProperty('--cartique-accent', accentColor);
    document.documentElement.style.setProperty('--theme-accent', accentColor);
    
    // Set theme mode (light/dark)
    const themeMode = this.features.theme === 'dark' ? 'dark' : 'light';
    const containerElement = document.getElementById(this.features.containerId);
    if (containerElement) {
        containerElement.setAttribute('data-theme', themeMode);
    }
}



applyAllFilters() {
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
    this.renderProductDisplays();
}





_attachMenuEvents(container) {
    const selectors = '.cartique-menu-item, .mega-item';
    
    container.querySelectorAll(selectors).forEach(item => {
        item.addEventListener('click', (e) => {
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

            this.renderCatalogueMenu();
            this.applyAllFilters();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const wrapper = container.querySelector('.cartique-mega-wrapper');
            if (wrapper) wrapper.classList.remove('is-open');
        }
    });
}

/* END SHOP CATS/MENU FUNCTIONALITY ISSUES */



/* CARTIQUE MENU IMPLEMENTATION */

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
 * Format price with 2 decimal places
 * @param {number|string} price - The price to format
 * @returns {string} Formatted price with 2 decimal places
 */
formatPrice(price) {
    if (price === undefined || price === null || isNaN(price)) {
        return '0.00';
    }
    return Number(price).toFixed(2);
}


async renderCatalogueMenu() {
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



applyFilters() {
    this.filteredProducts = this.products.filter(product => {
        // 1. Category Filter
        const matchesCategory = !this.activeCategoryId || 
            product.categories.some(c => c.id === parseInt(this.activeCategoryId));

        // 2. Variant Attribute Filter
        const matchesAttributes = Object.entries(this.activeFilters).every(([key, selectedValues]) => {
            if (!selectedValues.length) return true;
            
            // Check if any variant has an attribute matching the selected filters
            return product.variants?.some(variant => 
                variant.attributes.some(attr => 
                    attr.key.toLowerCase() === key.toLowerCase() && 
                    selectedValues.includes(attr.value)
                )
            );
        });

        return matchesCategory && matchesAttributes;
    });

    this.renderProducts();
}



_attachMenuEvents(container) {
    // 1. Handle Category Selection (Pills, List Items, and Mega Items)
    const selectors = '.cartique-menu-item, .mega-item';
    
    container.querySelectorAll(selectors).forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const catId = item.getAttribute('data-cat-id');
            
            // Update the active state in the class
            this.activeCategoryId = (catId === 'all') ? null : catId;

            // UI: Close Mega Menu if it's open
            const wrapper = container.querySelector('.cartique-mega-wrapper');
            if (wrapper) {
                wrapper.classList.remove('is-open');
            }

            // UI: Re-render the menu to show the new "active" state
            this.renderCatalogueMenu();

            // TRIGGER FILTER: Call your existing filter/search logic
            // Note: Replace 'handleSearch' with your actual product filtering method name
            if (typeof this.handleSearch === 'function') {
                this.handleSearch();
            } else if (typeof this.renderProductDisplays === 'function') {
                this.renderProductDisplays();
            }
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

/* END CARTIQUE MENU IMPLEMENTATION */









/* ==========================================================
   START SECTION: SIDEBAR SEARCH FILTERS
   ========================================================== */


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




/* ==========================================================
   START SECTION: SIDEBAR SEARCH FILTERS
   ========================================================== */


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


// Helper method to keep the code DRY and avoid "wrecking" the working template
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


handleFilterChange(element) {
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
    this.applyAllFilters();
}


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





applyFilters(activeFilters) {
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
    this.renderProductDisplays(); 
}

/// MOBILE FILTERS 

/* CONSOLIDATED SIDEBAR & FILTER LOGIC 
   Place these methods within your main Product Gallery Class 
*/

/**
 * 1. INITIALIZE MOBILE UI
 * Call this once during your class constructor or init()
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
 * 2. TOGGLE SIDEBAR VISIBILITY
 * Handles the "is-active" class and body scrolling
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
 * 3. UPDATE EVENT LISTENERS
 * Connects checkbox changes to the "slide away" behavior
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
 * 4. CLEAR ALL FILTERS
 * Ensures state is cleared and DOM is updated
 */
clearAllFilters() {
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
    this.renderProducts(layout, this.products);

    // If on mobile, stay open so user can see it cleared, or close manually
    console.log("Filters cleared, state reset.");
}


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

/* ==========================================================
   END SECTION: SIDEBAR SEARCH FILTERS
   ========================================================== */


/* ==========================================================
   START SECTION: HANDLE BULK PRICING 
   ========================================================== */


/* ==========================================================
   START SECTION: HANDLE BULK PRICING 
   ========================================================== */

hasBulkPricing(variant) {
    return variant?.bulkPrice != null && variant?.bulkMinimumQty != null;
}


/**
 * Get bulk pricing display data
 * One source of truth for all UI components
 */
getBulkPricingDisplay(variant, quantity = 0) {
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

    if (!variant || !this.hasBulkPricing(variant)) {
        return defaultDisplay;
    }

    const retailPrice = variant.price;
    const bulkPrice = variant.bulkPrice;
    const minimumQty = variant.bulkMinimumQty;
    const isBulk = quantity >= minimumQty;
    const unitPrice = isBulk ? bulkPrice : retailPrice;

    return {
        hasBulk: true,
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
 * Get selected variant
 */
getSelectedVariant(product) {
    if (product.variants && product.variants.length > 0) {
        return product.variants[0];
    }
    return {
        id: product.id,
        price: product.price || 0,
        bulkPrice: product.bulkPrice,
        bulkMinimumQty: product.bulkMinimumQty,
        inventory: product.inventory || 0
    };
}

/**
 * Find variant by ID across all products
 */
findVariant(variantId) {
    if (!variantId) return null;
    
    for (const product of this.products) {
        if (product.variants) {
            const variant = product.variants.find(v => v.id === variantId);
            if (variant) return variant;
        }
        // Check if product itself is the variant
        if (product.id === variantId) {
            return {
                id: product.id,
                price: product.price || 0,
                bulkPrice: product.bulkPrice,
                bulkMinimumQty: product.bulkMinimumQty,
                inventory: product.inventory || 0,
                attributes: product.attributes || []
            };
        }
    }
    return null;
}

/**
 * Calculate unit price - simple retail vs bulk
 */
getUnitPrice(variant, quantity = 1) {
    const retailPrice = variant?.price || 0;
    const bulkPrice = variant?.bulkPrice;
    const bulkMinQty = variant?.bulkMinimumQty;

    const isBulk = bulkPrice && bulkMinQty && quantity >= bulkMinQty;
    const unitPrice = isBulk ? bulkPrice : retailPrice;

    return {
        unitPrice: unitPrice,
        isBulk: isBulk,
        retailPrice: retailPrice,
        bulkPrice: bulkPrice,
        bulkMinimumQty: bulkMinQty,
        quantity: quantity,
        totalPrice: unitPrice * quantity
    };
}

/* ==========================================================
   END SECTION: HANDLE BULK PRICING 
   ========================================================== */


/* ==========================================================
   END SECTION: HANDLE BULK PRICING 
   ========================================================== */









/* ==========================================================
   START SECTION: INFINITE SCROLL
   ========================================================== */

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


loadMoreProducts() {
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

    setTimeout(() => {
        const fragment = document.createDocumentFragment();

        nextBatch.forEach(product => {
            const el = (layout === 'grid') 
                ? this.createProductCard(product) 
                : this.createProductListing(product);
            
            if (el) {
                el.classList.add('cartique-fade-in');
                fragment.appendChild(el);
            }
        });

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

/* ==========================================================
   END SECTION: INFINITE SCROLL
   ========================================================== */



  // Deep merge helper method
  deepMerge(target, source) {
    const output = { ...target };
    
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }
    
    return output;
  }

  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }



  // Debounce with immediate option
  debounce(func, wait, immediate = false) {
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
  }


  // Add this method to the Cartique class
getProductStock(product) {
    // Check for inventory directly on product
    if (typeof product.inventory === 'number') {
        return product.inventory;
    }
    
    // Check for totalInventory (from your API)
    if (typeof product.totalInventory === 'number') {
        return product.totalInventory;
    }
    
    // Check variants for inventory
    if (product.variants?.length) {
        return product.variants.reduce((total, v) => {
            return total + (typeof v.inventory === 'number' ? v.inventory : 0);
        }, 0);
    }
    
    // Default: assume in stock if no inventory data
    return 10;
}



 async init() {
  try {
    // Inject CSS (must be first)
    this.injectCSS();
    
    // Apply theme color
    this.applyTheme();

    // 1. Sync display states from features
    const sidebarEnabled = this.features.sidebar && 
                          (this.features.sidebarFeatures?.enabled !== false);
    this.features.sidebarDisplay = sidebarEnabled ? 'block' : 'none';
    this.features.footerDisplay = this.features.footer ? 'block' : 'none';

    // 2. DOM setup
    this.container = document.querySelector(`#${this.features.containerId}`);
    if (!this.container) {
      throw new Error(`Container with ID "${this.features.containerId}" not found`);
    }
    
    // 3. Component Loading
    await this.fetchAndExtractComponents();
    
    // 4. Injects main structural components into the DOM
    await this.renderAllComponents();

    // 5. Prepare Product Layout Shelves
    this.initializeContainers();
    
    // 6. Dynamic Filter Injection
    if (sidebarEnabled && this.features.sidebarFeatures?.filters) {
        this.renderSidebarFilters(); 
    }
    
    // 7. Initial Product Render
    this.renderProductDisplays();

    // 8. Interactivity & Completion
    this.setupEventListeners();
    this.completeInitialization();
    
  } catch (error) {
    console.error('Failed to initialize Cartique:', error);
    this.showErrorMessage('Failed to load product catalog');
  }
}



initializeContainers() {
    // Prepare Grid Container
    const gridWrapper = this.templateHolder.content.getElementById('cartique-product-grid-component');
    const gridContainer = document.getElementById('cartique-product-grid');
    if (gridWrapper && gridContainer) {
        gridContainer.innerHTML = ''; // Clean slate
        gridContainer.appendChild(gridWrapper.cloneNode(true));
    }

    // Prepare List Container
    const listWrapper = this.templateHolder.content.getElementById('cartique-product-list-component');
    const listContainer = document.getElementById('cartique-product-list');
    if (listWrapper && listContainer) {
        listContainer.innerHTML = ''; // Clean slate
        listContainer.appendChild(listWrapper.cloneNode(true));
    }
}



    applyMinimalTheme() {
        const accentColor = this.features.themeColor || this.features.theme || '#2a2a2a';
        document.documentElement.style.setProperty('--cartique-accent', accentColor);
        document.documentElement.style.setProperty('--theme-accent', accentColor);
        
        const containerElement = document.getElementById(this.features.containerId);
        if (containerElement) {
            containerElement.classList.add(`theme-${this.features.theme}`);
        }
    }

  

  completeInitialization() {
    const container = document.getElementById(this.features.containerId);
    if (container) {
      container.style.visibility = 'visible';
      container.style.opacity = '1';
    }

     // Restore state from URL after everything is rendered
    this.restoreStateFromUrl();
  }

  async fetchAndExtractComponents() {
    const cartiqueComponents = document.getElementById('cartique-components');
    
    if (!cartiqueComponents) {
      throw new Error('Could not find #cartique-components in the DOM');
    }

    this.templateHolder = document.createElement('template');
    this.templateHolder.innerHTML = cartiqueComponents.innerHTML;
    
    if (!this.templateHolder.content) {
      throw new Error('Failed to create template holder for components');
    }
  }

  async renderAllComponents() {
    const renderMethods = [
        this.renderMainFrame.bind(this),          
        this.renderSidebar.bind(this),
        this.renderCatalogueMenu.bind(this),     
        this.renderControls.bind(this),
        this.renderProductDisplays.bind(this),
        this.renderFooter.bind(this),
        this.renderCartSlider.bind(this),
        this.renderCartItemTemplate.bind(this)
    ];

    for (const method of renderMethods) {
        try {
            await method();
        } catch (error) {
            console.error(`Render failed for method: ${method.name}`, error);
        }
    }

    // FIX: Apply sidebar visibility
    const sidebar = document.getElementById('cartique-sidebar');
    if (sidebar) {
        sidebar.style.display = this.features.sidebarDisplay;
        // Toggle full-width class on main content
        const mainContent = document.getElementById('cartique-main-content');
        if (mainContent) {
            if (this.features.sidebarDisplay === 'none') {
                mainContent.classList.add('cartique-full-width');
            } else {
                mainContent.classList.remove('cartique-full-width');
            }
        }
    }

    // FIX: Only render sidebar filters if sidebar is enabled
    const sidebarEnabled = this.features.sidebar && 
                          (this.features.sidebarFeatures?.enabled !== false);
    if (sidebarEnabled && this.features.sidebarFeatures?.filters) {
        this.renderSidebarFilters(); 
    }
}




  async renderMainFrame() {
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


  async renderSidebar() {
    const sidebarWrapper = this.templateHolder.content.getElementById('cartique-sidebar-component');
    if (!sidebarWrapper) return;

    const sidebarContainer = document.getElementById('cartique-sidebar');
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = '';
    sidebarContainer.appendChild(sidebarWrapper.cloneNode(true));
  }

  async renderControls() {
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

  setupEventListeners() {
    // Layout toggles
    const gridButton = document.querySelector('.cartique-grid-view');
    const listButton = document.querySelector('.cartique-list-view');
    
    if (gridButton) {
      this.addEventListener(gridButton, 'click', () => this.setLayout('grid'));
    }
    
    if (listButton) {
      this.addEventListener(listButton, 'click', () => this.setLayout('list'));
    }
  }

  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    
    // Store for cleanup
    const key = `${element.id || element.className}-${event}`;
    if (!this.eventListeners.has(key)) {
      this.eventListeners.set(key, []);
    }
    this.eventListeners.get(key).push({ element, event, handler });
  }

  cleanupEventListeners() {
    this.eventListeners.forEach((listeners, key) => {
      listeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
    });
    this.eventListeners.clear();
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
            this.renderProducts('grid', displayData);
        }
    } else {
        if (gridContainer) gridContainer.style.display = 'none';
        if (listContainer) {
            listContainer.style.display = 'block';
            this.renderProducts('list', displayData);
        }
    }

    console.log(`[UI] Rendered ${displayData.length} products in ${layout} view.`);
}



 /**
 * Renders products into the specified layout container.
 * @param {string} layout - 'grid' or 'list'
 * @param {Array} data - Optional specific data set to render
 */
renderProducts(layout, data) {
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
    initialSlice.forEach(product => {
      const productElement = layout === 'grid'
        ? this.createProductCard(product)
        : this.createProductListing(product);
      
      if (productElement) fragment.appendChild(productElement);
    });

    container.appendChild(fragment);

    // 5. INITIALIZE INFINITE SCROLL OBSERVER
    // We only start observing if there are more products left to load
    if (productsToRender.length > this.itemsPerBatch) {
        this.setupInfiniteScroll();
    }
}





 createProductCard(product) {
    const wrapper = this.templateHolder.content.getElementById('cartique-product-grid-component');
    if (!wrapper) return null;

    const productCardTemplate = wrapper.firstElementChild?.cloneNode(true);
    if (!productCardTemplate) return null;

    this.updateProductElement(productCardTemplate, product);

    // --- BULK PRICING: Grid Card ---
    const variant = this.getSelectedVariant(product);
    const bulkDisplay = this.getBulkPricingDisplay(variant);

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




  createProductListing(product) {
    const wrapper = this.templateHolder.content.getElementById('cartique-product-list-component');
    if (!wrapper) return null;

    const productListingTemplate = wrapper.firstElementChild?.cloneNode(true);
    if (!productListingTemplate) return null;

    productListingTemplate.classList.add('cartique-product-listing');
    this.updateProductElement(productListingTemplate, product);

    // --- BULK PRICING: List Card ---
    const variant = this.getSelectedVariant(product);
    const bulkDisplay = this.getBulkPricingDisplay(variant);

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

  
 updateProductElement(element, product) {
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
    const stockCount = this.getProductStock(product);
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




  setLayout(layout) {
    const gridContainer = document.getElementById('cartique-product-grid');
    const listContainer = document.getElementById('cartique-product-list');

    if (gridContainer && listContainer) {
      gridContainer.style.display = layout === 'grid' ? 'grid' : 'none';
      listContainer.style.display = layout === 'list' ? 'block' : 'none';
      this.currentLayout = layout;
      this.renderProducts(layout);
    }
  }

  async renderFooter() {
    const wrapper = this.templateHolder.content.getElementById('cartique-product-footer-component');
    if (wrapper) {
      const footerContainer = document.getElementById('cartique-product-footer');
      if (footerContainer) {
        footerContainer.innerHTML = '';
        footerContainer.appendChild(wrapper.firstElementChild.cloneNode(true));
      }
    }
  }

  async renderCartSlider() {
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

async renderCartItemTemplate() {
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


/* VIEW CART BLOCK */


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
            const pricing = this.getUnitPrice(variant, quantity);
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



// Cart page specific methods that don't open slide-in
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



removePageItem(productId) {
    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem('cartiqueCart', JSON.stringify(cart));
}



/* END VIEW CART BLOCK */

 // ==========================================================
// INTERNAL UI HANDLER
// ==========================================================

/**
 * Handles search input events from Cartique's internal search box.
 * 
 * @param {Event} event - The input event
 */
handleSearch(event) {
    this.performSearch(event?.target?.value);
}


  handleSort(event) {
    const sortType = event.target.value;
    this.currentSortType = sortType;

    const sortedProducts = [...this.filteredProducts];

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
    }

    this.filteredProducts = sortedProducts;
    this.loadedCount = 0;
    this.renderProductDisplays();
}


  addToCart(event) {
    const productId = parseInt(event.target.id);
    const product = this.products.find(p => p.id === productId);

    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    // STOCK CHECK
    const availableStock = this.getProductStock(product);
    if (availableStock === 0) {
        this.showStockAlert('This product is SOLD OUT');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex === -1) {
        // New item - can add 1
        cart.push({
            ...product,
            cart_quantity: 1
        });
    } else {
        // Existing item - check if adding more exceeds stock
        const newQuantity = cart[existingIndex].cart_quantity + 1;
        if (newQuantity > availableStock) {
            this.showStockAlert(
                `Only ${availableStock} available. You already have ${cart[existingIndex].cart_quantity} in cart.`
            );
            return;
        }
        cart[existingIndex].cart_quantity = newQuantity;
    }

    localStorage.setItem('cartiqueCart', JSON.stringify(cart));
    this.showCart();
}



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

  removeCartItem(event) {
    const productId = parseInt(event.target.id);
    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem('cartiqueCart', JSON.stringify(cart));
    this.showCart();
  }

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



  closeCart() {
    const cartSlide = document.getElementById('cart-slide');
    const overlay = document.getElementById('cart-slide-overlay');
    const hiddenBlocks = document.getElementById('cartique-hidden-blocks');

    if (cartSlide) cartSlide.classList.remove('open');
    if (overlay) overlay.style.display = 'none';
    if (hiddenBlocks) hiddenBlocks.style.display = 'none';
  }

  checkout() {
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
        if (sidebar) sidebar.style.display = this.features.sidebarDisplay;
        if (menuAnchor) menuAnchor.style.display = '';
        if (controls) controls.style.display = '';
        if (footer) footer.style.display = this.features.footerDisplay;
        
        const mainContent = document.getElementById('cartique-main-content');
        if (mainContent) {
            if (this.features.sidebarDisplay === 'none') {
                mainContent.classList.add('cartique-full-width');
            } else {
                mainContent.classList.remove('cartique-full-width');
            }
        }
        
        this.singleProductViewActive = false;
    } else {
        // Close the slide-in cart
        this.closeCart();
    }
    
    // Show the checkout alert
    this.showCheckoutAlert();
}



  showCheckoutAlert() {
    const toast = document.querySelector('.toast');
    const closeIcon = document.querySelector('.toast .close');

    if (!toast || !closeIcon) return;

    // Clear existing timeouts
    this.clearToastTimeouts();

    // Show toast
    toast.classList.add('active');

    // Close handler
    const closeHandler = () => {
        toast.classList.remove('active');
        this.clearToastTimeouts();
    };
    
    this.addEventListener(closeIcon, 'click', closeHandler, { once: true });

    // Auto-hide after 5 seconds and redirect
    this.toastTimer1 = setTimeout(() => {
        toast.classList.remove('active');
    }, 5000);

    // Redirect after 5 seconds
    this.redirectTimer = setTimeout(() => {
        const cart = JSON.parse(localStorage.getItem('cartiqueCart'));
        console.log('Checkout cart:', JSON.stringify(cart, null, 2));
        
        if (this.features.checkoutUrl && this.features.checkoutUrl !== '#') {
            const mode = this.features.checkoutUrlMode || 'self';
            if (mode === '_blank') {
                window.open(this.features.checkoutUrl, '_blank');
            } else {
                window.location.href = this.features.checkoutUrl;
            }
        }
    }, 5000);
}



showStockAlert(message) {
    // Check if toast container exists, create if not
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Create stock alert toast following the same pattern as checkout alert
    const toast = document.createElement('div');
    toast.className = 'toast stock-alert';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="svg">⚠️</span>
            <div class="message">
                <span class="text text-1">Stock Alert</span>
                <span class="text text-2">${message}</span>
            </div>
        </div>
        <button class="close">&times;</button>
    `;

    // Add stock-specific styling while maintaining consistency
    toast.style.cssText = `
        background: #fff3cd;
        border-left: 4px solid #ffc107;
    `;

    // Update text colors for visibility
    const titleEl = toast.querySelector('.text-1');
    const messageEl = toast.querySelector('.text-2');
    if (titleEl) titleEl.style.color = '#856404';
    if (messageEl) messageEl.style.color = '#856404';

    toastContainer.appendChild(toast);
    
    // Show with animation
    setTimeout(() => toast.classList.add('active'), 10);
    
    // Close button handler
    const closeBtn = toast.querySelector('.close');
    const closeToast = () => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 300);
    };
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeToast);
    }
    
    // Auto dismiss after 4 seconds (slightly faster than checkout since it's an error)
    const autoDismiss = setTimeout(() => {
        closeToast();
    }, 4000);
    
    // Clean up timeout if manually closed
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoDismiss);
        }, { once: true });
    }
}


  clearToastTimeouts() {
    if (this.toastTimer1) clearTimeout(this.toastTimer1);
    if (this.redirectTimer) clearTimeout(this.redirectTimer);
}


  showSingleProductView(productId) {
    productId = Number(productId);
    const product = this.products.find(p => p.id === productId);

    if (!product) {
        console.error('Product not found:', productId);
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
    this.renderSingleProduct(product);
    
    // FIX: Scroll to single product view after DOM renders
    requestAnimationFrame(() => {
        const singleView = document.querySelector('.single-product-view');
        if (singleView) {
            singleView.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
        if (mainContent) mainContent.scrollTop = 0;
    });
}

  renderSingleProduct(product) {
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
    const variant = this.getSelectedVariant(product);
    const bulkDisplay = this.getBulkPricingDisplay(variant);
    
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
        this.addEventListener(addToCartBtn, 'click', (e) => this.addToCart(e));
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



renderProductReviews(product) {
    const reviews = product.reviews || [];
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
                        ${this.renderStars(parseFloat(avgRating))}
                    </div>
                    <span class="reviews-count">${reviews.length} review${reviews.length !== 1 ? 's' : ''}</span>
                </div>
                ${this.features.reviews?.showRatingDistribution ? `
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
                                ${this.renderStars(review.rating)}
                            </div>
                            <span class="review-date">${this.formatDate(review.createdAt)}</span>
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
        ${'<span class="star filled">★</span>'.repeat(fullStars)}
        ${hasHalf ? '<span class="star half">★</span>' : ''}
        ${'<span class="star empty">★</span>'.repeat(emptyStars)}
    `;
}

formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}


// In cartique_3.js, find submitReview() and add:
async submitReview(form, product) {
    const ratingInput = form.querySelector('input[name="rating"]:checked');
    const rating = ratingInput ? parseInt(ratingInput.value) : null;
    const comment = form.querySelector('#review-comment')?.value?.trim() || '';
    
    if (!rating) {
        alert('Please select a rating');
        return;
    }
    
    const payload = { productId: product.id, rating, comment: comment || null };
    
    if (this.callbacks?.onReviewSubmit) {
        this.callbacks.onReviewSubmit({
            ...payload,
            onSuccess: (result) => {
                if (!product.reviews) product.reviews = [];
                product.reviews.unshift({
                    id: Date.now(),
                    productId: result.productId,
                    customerId: result.customerId,
                    customer: result.customer || { id: result.customerId, name: 'You' },
                    rating: result.rating,
                    comment: result.comment,
                    status: result.status || 'approved',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                const reviewsTab = document.querySelector('[data-tab-content="reviews"]');
                if (reviewsTab) reviewsTab.innerHTML = this.renderProductReviews(product);
                form.reset();
            },
            onError: (error) => {
                console.error('Review submission failed:', error);
            }
        });
        return;
    }
    
    this.submitReviewVanilla(payload, product);
    form.reset();
}



submitReviewVanilla(payload, product) {
    if (!product.reviews) product.reviews = [];
    product.reviews.unshift({
        id: Date.now(),
        productId: payload.productId,
        customerId: 0,
        customer: { id: 0, name: 'Guest' },
        rating: payload.rating,
        comment: payload.comment,
        status: 'approved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    
    const reviewsTab = document.querySelector('[data-tab-content="reviews"]');
    if (reviewsTab) reviewsTab.innerHTML = this.renderProductReviews(product);
}



  returnToListView() {
    const singleProductView = document.getElementById('single-product-view-container');
    const productDisplays = document.getElementById('cartique-product-displays');
    const sidebar = document.getElementById('cartique-sidebar');
    const controls = document.getElementById('cartique-controls');
    const menuAnchor = document.getElementById('cartique-menu-anchor-top');
    const footer = document.getElementById('cartique-product-footer');

    if (singleProductView) singleProductView.style.display = 'none';
    if (productDisplays) productDisplays.style.display = 'block';
    if (sidebar) sidebar.style.display = this.features.sidebarDisplay;
    if (controls) controls.style.display = '';
    if (menuAnchor) menuAnchor.style.display = '';
    if (footer) footer.style.display = this.features.footerDisplay;
    
    // Restore full-width state based on sidebar config
    const mainContent = document.getElementById('cartique-main-content');
    if (mainContent) {
        if (this.features.sidebarDisplay === 'none') {
            mainContent.classList.add('cartique-full-width');
        } else {
            mainContent.classList.remove('cartique-full-width');
        }
    }

    this.singleProductViewActive = false;

    // Restore scroll position
    if (this.previousViewState?.scrollPosition) {
        window.scrollTo(0, this.previousViewState.scrollPosition);
    }
}

  showErrorMessage(message) {
    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'cartique-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      padding: 1rem;
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ffcdd2;
      border-radius: 4px;
      margin: 1rem;
      text-align: center;
    `;
    
    this.container.prepend(errorDiv);
  }

  // Cleanup method for when component is destroyed
  destroy() {
    this.cleanupEventListeners();
    this.clearToastTimeouts();
    
    // Remove any dynamically added elements
    const singleProductView = document.getElementById('single-product-view-container');
    if (singleProductView) singleProductView.remove();
    
    // Clear container
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
