"use strict";

export default class Cartique {
 constructor(products, features = {}) {
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
        theme: 'dark',
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
    
    // UI State Tracking
    this.currentSearchQuery = '';
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

    // 5. Fire off the Engine
    this.init();
}


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
    if (menuType === 'mega') {
        const wrapper = anchor.querySelector('.cartique-mega-wrapper');
        const trigger = anchor.querySelector('.mega-trigger');
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            wrapper.classList.toggle('is-open');
        });
        document.addEventListener('click', () => wrapper.classList.remove('is-open'), { once: true });
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

    // 1. Handle Price Range First
    if (filters.priceRange) {
        finalHTML += this.generateFilterHTML('priceRange', filters.priceRange);
        delete filters.priceRange;
    }

    // 2. Handle everything else dynamically
    finalHTML += Object.entries(filters).map(([group, options]) => {
        return this.generateFilterHTML(group, options);
    }).join('');

    container.innerHTML = finalHTML;

    // 3. ATTACH EVENT LISTENER (Event Delegation)
    // This catches changes from any checkbox inside the container automatically
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
    console.group("🔍 Cartique Filter Debug");
    
    const activeFilters = {};
    const checkedBoxes = document.querySelectorAll('.option-item input:checked');

    // 1. Map current state from UI
    checkedBoxes.forEach(cb => {
        const type = cb.dataset.type;
        if (!activeFilters[type]) activeFilters[type] = [];
        activeFilters[type].push(cb.value);
    });

    console.log("Active Filters:", activeFilters);

    // 2. Filter Logic
    if (Object.keys(activeFilters).length === 0) {
        this.filteredProducts = [...this.products];
    } else {
        this.filteredProducts = this.products.filter(product => {
            // AND logic: Every active filter category must be satisfied
            return Object.entries(activeFilters).every(([group, selectedValues]) => {
                
                // --- Case A: Price Range Logic (Sale Aware) ---
                if (group === 'priceRange') {
                    // Priority: Top-level sale -> Top-level price -> Lowest variant (sale or reg)
                    const effectivePrice = product.sale_price || product.price || 
                        Math.min(...product.variants.map(v => v.sale_price || v.price));
                    
                    return selectedValues.some(rangeLabel => this._checkPriceMatch(effectivePrice, rangeLabel));
                }

                // --- Case B: Variant Attributes (Color, Size, etc.) ---
                return product.variants?.some(variant => {
                    return variant.attributes?.some(attr => {
                        return attr.key === group && selectedValues.includes(String(attr.value));
                    });
                });
            });
        });
    }

    console.log("Filtered Results Size:", this.filteredProducts.length);
    console.groupEnd();

    // 3. Trigger UI Update
    this.renderProductDisplays();
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
   START SECTION: INFINITE SCROLL
   ========================================================== */

setupInfiniteScroll() {
    // Clean up previous observer if it exists
    if (this.observer) this.observer.disconnect();

    // Create a sentinel element if it doesn't exist
    let sentinel = document.getElementById('cartique-scroll-sentinel');
    if (!sentinel) {
        sentinel = document.createElement('div');
        sentinel.id = 'cartique-scroll-sentinel';
        sentinel.style.cssText = 'grid-column: 1/-1; height: 50px; display: flex; align-items: center; justify-content: center; width: 100%;';
        this.container.appendChild(sentinel);
    }

    this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            this.loadMoreProducts();
        }
    }, { rootMargin: '200px' }); // Loads 200px before reaching the bottom for smoothness

    this.observer.observe(sentinel);
}


loadMoreProducts() {
    console.group("🚀 Infinite Scroll: Loading Batch");
    
    const productsSource = this.filteredProducts || this.products;
    const sentinel = document.getElementById('cartique-scroll-sentinel');

    // 1. SAFETY GUARD: If all products are already shown, kill the observer and hide sentinel
    if (this.loadedCount >= productsSource.length) {
        if (this.observer) this.observer.disconnect();
        if (sentinel) {
            sentinel.classList.remove('is-loading');
            sentinel.style.display = 'none'; 
        }
        console.groupEnd();
        return;
    }

    // 2. PREPARE DATA: Slice the next batch
    const nextBatch = productsSource.slice(
        this.loadedCount, 
        this.loadedCount + this.itemsPerBatch
    );

    // 3. UI FEEDBACK: Add the loading class (triggers the CSS loader and text)
    if (sentinel) {
        sentinel.classList.add('is-loading');
        // Inject loader div if not using the CSS-only approach
        sentinel.innerHTML = '<div class="cartique-loader"></div>';
    }

    // 4. EXECUTION: Smooth delay to prevent jarring UI jumps
    setTimeout(() => {
        const layout = this.currentLayout || 'grid';
        const container = document.getElementById(`cartique-product-${layout}`);
        const fragment = document.createDocumentFragment();

        nextBatch.forEach(product => {
            const el = (layout === 'grid') 
                ? this.createProductCard(product) 
                : this.createProductListing(product);
            
            if (el) {
                el.classList.add('cartique-fade-in'); // Trigger entrance animation
                fragment.appendChild(el);
            }
        });

        // Batch append to DOM
        container.appendChild(fragment);
        
        // Update loaded state by actual items added
        this.loadedCount += nextBatch.length;
        
        // 5. CLEANUP: Remove loading state and clear content
        if (sentinel) {
            sentinel.classList.remove('is-loading');
            sentinel.innerHTML = ''; 
        }

        // 6. TERMINATION: If we reached the end of the total product list
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


 async init() {
  try {
    // 1. Sync display states from features
    this.features.sidebarDisplay = this.features.sidebar ? 'block' : 'none';
    this.features.footerDisplay = this.features.footer ? 'block' : 'none';

    // 2. DOM setup & Theme
    this.container = document.querySelector(`#${this.features.containerId}`);
    if (!this.container) {
      throw new Error(`Container with ID "${this.features.containerId}" not found`);
    }

    this.applyMinimalTheme();
    this.injectCriticalCSS();
    
    // 3. Component Loading
    // Fetches the external HTML components (sidebar, search, etc.)
    await this.fetchAndExtractComponents();
    
    // Injects main structural components into the DOM
    await this.renderAllComponents();

    // --- NEW STEP: Prepare Product Layout Shelves ---
    // This sets up the grid and list containers ONCE to avoid duplication later
    this.initializeContainers();
    
    // 4. Dynamic Filter Injection
    if (this.features.sidebar && this.features.sidebarFeatures?.filters) {
      this.renderSidebarFilters(); 
    }
    
    // 5. Initial Product Render
    // Ensure we show products immediately on load
    this.renderProductDisplays();

    // 6. Interactivity & Completion
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
    // ONLY set the accent color to maintain original look
    const root = document.documentElement;
    root.style.setProperty('--theme-accent', '#333333');
    
    // Add theme class to container for CSS targeting
    const containerElement = document.getElementById(this.features.containerId);
    containerElement.classList.add(`theme-${this.features.theme}`);
  }

  injectCriticalCSS() {
    const criticalCSS = `
      #${this.features.containerId} {
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .cartique-container {
        position: relative;
        min-height: 100vh;
      }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }

  completeInitialization() {
    const container = document.getElementById(this.features.containerId);
    if (container) {
      container.style.visibility = 'visible';
      container.style.opacity = '1';
    }
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

    // 1. Render components sequentially
    for (const method of renderMethods) {
        try {
            await method();
        } catch (error) {
            console.error(`Render failed for method: ${method.name}`, error);
        }
    }

    // 2. Post-Render UI Adjustments
    // Now that renderSidebar() has finished, we can safely manipulate its style
    const sidebar = document.getElementById('cartique-sidebar');
    if (sidebar) {
        sidebar.style.display = this.features.sidebarDisplay;
    }

    // 3. Dynamic Sidebar Population
    // If sidebar is 'block', this is the moment to inject your dynamic productFilters
    if (this.features.sidebar && this.features.sidebarFeatures?.filters) {
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

    <div id="cartique-hidden-blocks" style="display:none;"></div>
    <div class="cart-overlay" id="cart-slide-overlay"></div>

    <div id="toast-container">
      <div class="toast">
        <div class="toast-content">
          <span class="svg">✓</span>
          <div class="message">
            <span class="text text-1">Success</span>
            <span class="text text-2">
              You will now be redirected to the login page to complete your checkout.
            </span>
          </div>
        </div>
        <i class="fa-solid fa-xmark close"></i>
        <div class="progress"></div>
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
    
    // Add image click handler
    const imgContainer = productCardTemplate.querySelector('.cartique_product_image_container');
    if (imgContainer) {
      imgContainer.dataset.productId = product.id;
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

    const addToCartBtn = productListingTemplate.querySelector('.cartique_add_to_cart');
    if (addToCartBtn) {
      addToCartBtn.id = product.id;
      this.addEventListener(addToCartBtn, 'click', (e) => this.addToCart(e));
    }

    return productListingTemplate;
  }

  updateProductElement(element, product) {
    for (const [key, value] of Object.entries(product)) {
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

    // Update REGULAR currency symbol
    const regularCurrencyElement = element.querySelector('#currency');
    if (regularCurrencyElement) {
        regularCurrencyElement.textContent = this.features.currencySymbol || '$';
        // Reset color for regular currency
        regularCurrencyElement.style.color = '';
    }

    // Handle sale price
    const salePriceElement = element.querySelector('#sale_price');
    if (salePriceElement) {
        if (product.sale_price) {
            salePriceElement.style.display = 'block';
            salePriceElement.textContent = product.sale_price;
            salePriceElement.style.color = 'red';
            
            // Update SALE PRICE currency symbol
            const salePriceCurrency = element.querySelector('#sale_price_currency');
            if (salePriceCurrency) {
                salePriceCurrency.textContent = this.features.currencySymbol || '$';
                salePriceCurrency.style.color = 'red';
                salePriceCurrency.style.fontWeight = 'bold';

            }
            
            // Strike through regular price
            const priceElement = element.querySelector('#price');
            if (priceElement) {
                priceElement.style.textDecoration = 'line-through';
                priceElement.style.color = '#666';
                priceElement.style.opacity = '0.7';
            }
        } else {
            salePriceElement.style.display = 'none';
            salePriceElement.style.color = '';
            
            // Reset sale price currency
            const salePriceCurrency = element.querySelector('#sale_price_currency');
            if (salePriceCurrency) {
                salePriceCurrency.textContent = '';
                salePriceCurrency.style.color = '';
            }
            
            // Reset regular price styling
            const priceElement = element.querySelector('#price');
            if (priceElement) {
                priceElement.style.textDecoration = '';
                priceElement.style.color = '';
                priceElement.style.opacity = '';
            }
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
      
      // Add close button event
      const closeBtn = cartSlider.querySelector('#cart-close-btn');
      if (closeBtn) {
        this.addEventListener(closeBtn, 'click', this.closeCart.bind(this));
      }

      // Add checkout button event
      const checkoutBtn = cartSlider.querySelector('#checkout-url');
      if (checkoutBtn) {
        this.addEventListener(checkoutBtn, 'click', this.checkout.bind(this));
      }
    }
  }

  async renderCartItemTemplate() {
    const wrapper = this.templateHolder.content.getElementById('cartique-cart-item-component');
    if (!wrapper) return;

    const itemTemplate = wrapper.firstElementChild.cloneNode(true);
    const hiddenBlocks = document.getElementById('cartique-hidden-blocks');
    
    if (hiddenBlocks) {
      hiddenBlocks.appendChild(itemTemplate);
    }
  }

  handleSearch(event) {
    const query = event.target.value.trim().toLowerCase();
    this.currentSearchQuery = query;

    this.filteredProducts = this.products.filter(product => {
      const titleMatch = product.title?.toLowerCase().includes(query) || false;
      const descMatch = product.description?.toLowerCase().includes(query) || false;
      return titleMatch || descMatch;
    });

    this.renderProducts(this.currentLayout);
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
      default:
        // Keep original order
        break;
    }

    this.filteredProducts = sortedProducts;
    this.renderProducts(this.currentLayout);
  }

  addToCart(event) {
    const productId = parseInt(event.target.id);
    const product = this.products.find(p => p.id === productId);

    if (!product) {
      console.error('Product not found:', productId);
      return;
    }

    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex === -1) {
      cart.push({
        ...product,
        cart_quantity: 1
      });
    } else {
      cart[existingIndex].cart_quantity += 1;
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

    // Calculate total
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
      
      // Calculate subtotal
      const price = parseFloat(product.sale_price || product.price) || 0;
      const quantity = product.cart_quantity || 1;
      subtotal += price * quantity;
      
      cartContainer.appendChild(cartItem);
    });

    // Update subtotal display
    const subtotalEl = document.getElementById('subtotal');
    const currencyEl = document.getElementById('subtotal-currency');
    
    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
    if (currencyEl && cart.length > 0) {
      currencyEl.textContent = cart[0].currency || '';
    }

    // Open cart slider
    const cartSlide = document.getElementById('cart-slide');
    const overlay = document.getElementById('cart-slide-overlay');
    
    if (cartSlide) cartSlide.classList.add('open');
    if (overlay) overlay.style.display = 'block';
  }

  updateCartItem(cartItem, product) {
    // Update all product fields
    Object.keys(product).forEach(key => {
      const element = cartItem.querySelector(`#${key}`);
      if (!element) return;

      if (key === 'image') {
        element.src = product[key];
      } else if (key === 'sale_price' && product.sale_price) {
        const priceElement = cartItem.querySelector('.cartique_cart_product_price');
        if (priceElement) priceElement.style.textDecoration = 'line-through';
        element.textContent = product[key];
      } else if (key === 'price' && !product.sale_price) {
        element.textContent = product[key];
      } else if (key === 'currency') {
        const currencyElements = cartItem.querySelectorAll(`#${key}`);
        currencyElements.forEach(el => el.textContent = product[key]);

      } else {
        element.textContent = product[key];
      }
    });

    // Set quantity
    const quantityInput = cartItem.querySelector('.quantity');
    if (quantityInput) {
      quantityInput.value = product.cart_quantity || 1;
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
      cart[index].cart_quantity += 1;
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
    this.closeCart();
    this.showCheckoutAlert();
  }

  showCheckoutAlert() {
    const toast = document.querySelector('.toast');
    const closeIcon = document.querySelector('.close');
    const progress = document.querySelector('.progress');

    if (!toast || !closeIcon || !progress) return;

    // Clear existing timeouts
    this.clearToastTimeouts();

    // Show toast
    toast.classList.add('active');
    progress.classList.add('active');

    // Set timeouts
    this.toastTimer1 = setTimeout(() => {
      toast.classList.remove('active');
    }, 2000);

    this.toastTimer2 = setTimeout(() => {
      progress.classList.remove('active');
    }, 2300);

    // Close handler
    this.addEventListener(closeIcon, 'click', () => {
      toast.classList.remove('active');
      progress.classList.remove('active');
      this.clearToastTimeouts();
    });

    // Redirect
    this.redirectTimer = setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem('cartiqueCart'));
      console.log('Checkout cart:', JSON.stringify(cart, null, 2));
      
      if (this.features.checkoutUrl && this.features.checkoutUrl !== '#') {
        window.location.href = this.features.checkoutUrl;
      }
    }, 5000);
  }

  clearToastTimeouts() {
    if (this.toastTimer1) clearTimeout(this.toastTimer1);
    if (this.toastTimer2) clearTimeout(this.toastTimer2);
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

    // Hide main views
    document.getElementById('cartique-product-displays').style.display = 'none';
    document.getElementById('cartique-sidebar').style.display = 'none';
    
    this.singleProductViewActive = true;
    this.renderSingleProduct(product);
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
            <div class="price-container">
              ${product.sale_price ? `
                <span class="original-price">${this.features.currencySymbol}${product.price}</span>
                <span class="sale-price">${this.features.currencySymbol}${product.sale_price}</span>
              ` : `
                <span class="price">${this.features.currencySymbol}${product.price}</span>
              `}
            </div>
            <p class="product-description">${product.description}</p>
          </div>
          <button class="spv-cartique_add_to_cart" id="${product.id}">ADD TO CART</button>
        </div>
      </div>
      <div class="product-tabs-container">
        <div class="product-tabs-header">
          <button class="tab-button active" data-tab="details">Product Details</button>
          <button class="tab-button" data-tab="reviews">Reviews</button>
        </div>
        <div class="tab-content active" data-tab-content="details">
          ${product.details || 'No additional details available.'}
        </div>
        <div class="tab-content" data-tab-content="reviews">
          ${product.reviews || 'No reviews yet.'}
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
        // Update active tabs
        productView.querySelectorAll('.tab-button, .tab-content').forEach(el => {
          el.classList.remove('active');
        });
        
        button.classList.add('active');
        const tabName = button.dataset.tab;
        const content = productView.querySelector(`[data-tab-content="${tabName}"]`);
        if (content) content.classList.add('active');
      });
    });

    container.appendChild(productView);
    container.style.display = 'block';
  }

  returnToListView() {
    const singleProductView = document.getElementById('single-product-view-container');
    const productDisplays = document.getElementById('cartique-product-displays');
    const sidebar = document.getElementById('cartique-sidebar');

    if (singleProductView) singleProductView.style.display = 'none';
    if (productDisplays) productDisplays.style.display = 'block';
    if (sidebar) sidebar.style.display = this.features.sidebarDisplay;

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