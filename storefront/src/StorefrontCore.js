/**
 * @semantq/storefront
 *
 * StorefrontCore — Core engine for Cartique storefront
 * 
 * This class handles the main lifecycle, state management,
 * and core functionality of the storefront.
 *
 * Architecture:
 *   StorefrontCore (Orchestrator)
 *       ├── ProductRenderer (owns: layout, product rendering, single product)
 *       ├── CollectionRenderer (owns: search, sort, filters, categories)
 *       ├── CartRenderer (owns: cart UI)
 *       └── CartService (owns: cart data, localStorage, stock)
 * 
 * Communication: Callback-based (no direct method calls between renderers)
 */

import { deepMerge } from './utils/object.js';
import { addEventListener, cleanupEventListeners } from './utils/dom.js';
import { debounce } from './utils/performance.js';
import NotificationService from './services/NotificationService.js';
import CartiqueAdapter from './adapters/CartiqueAdapter.js';
import PricingService from './services/PricingService.js';
import CartService from './services/CartService.js';
import LocaleService from './services/LocaleService.js';
import ProductRenderer from './renderers/ProductRenderer.js';
import CollectionRenderer from './renderers/CollectionRenderer.js';
import CartRenderer from './renderers/CartRenderer.js';
import CartiqueInspector from './debug/CartiqueInspector.js';
import ThemeManager from './theme/ThemeManager.js';

export default class StorefrontCore {
  constructor(products, features = {}, callbacks = {}, kernel = null) {
    // ==========================================================
    // 1. VALIDATION
    // ==========================================================
    if (!products || !Array.isArray(products)) {
      throw new Error('Cartique requires an array of products');
    }

    // ==========================================================
    // 2. DEFAULT CONFIGURATION
    // ==========================================================
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
        type: 'inline',
        position: 'top',
        containerId: 'cartique-catalogue-menu',
        label: 'Categories',
        showCounts: true,
        megaMenuColumns: 3
      },
      sidebarFeatures: {
        filters: {}
      }
    };

    this.features = deepMerge(this.defaultFeatures, features);
    
    // Remove fallback — use features.currencySymbol directly
    this.currencySymbol = this.features.currencySymbol;

    // ==========================================================
    // 3. DATA STATE MANAGEMENT
    // ==========================================================
    this.products = products;
    this.filteredProducts = [...products];
    this.categories = this._extractCategories();
    this.currentSearchQuery = '';
    this.urlStateRestorers = [];
    this.currentSortType = '';
    this.currentLayout = 'grid';
    this.activeCategoryId = null;
    this.activeFilters = {};
    this.singleProductViewActive = false;
    this.previousViewState = null;

    // ==========================================================
    // 3.5 SHARED STATE OBJECT (SINGLE SOURCE OF TRUTH)
    // ==========================================================
    this.state = {
      // Product display
      currentLayout: 'grid',

      
      // Search
      currentSearchQuery: '',
      
      // Sorting
      currentSortType: '',
      
      // Products
      products: this.products || [],
      filteredProducts: this.filteredProducts || [],
      
      // Filters
      activeCategoryId: null,
      activeFilters: {},
      
      // Views
      singleProductViewActive: false,
      previousViewState: null,
      
      // Pagination
      itemsPerBatch: this.features.itemsPerPage || 12,
      loadedCount: 0,
      
      // Selected product for single view
      selectedProduct: null,
      
      // No fallback — use features.currencySymbol directly
      currencySymbol: this.features?.currencySymbol,
      cartDecision: null,

    };

    // ==========================================================
    // 3.6 STATE UPDATE METHOD (WITH DEBUG LOGGING)
    // ==========================================================
    this.updateState = (key, value) => {
      this.state[key] = value;
      // Also update legacy properties for backward compatibility
      if (key === 'currentLayout') this.currentLayout = value;
      if (key === 'currentSearchQuery') this.currentSearchQuery = value;
      if (key === 'currentSortType') this.currentSortType = value;
      if (key === 'filteredProducts') this.filteredProducts = value;
      if (key === 'activeCategoryId') this.activeCategoryId = value;
      if (key === 'activeFilters') this.activeFilters = value;
      if (key === 'singleProductViewActive') this.singleProductViewActive = value;
      if (key === 'previousViewState') this.previousViewState = value;
      if (key === 'loadedCount') this.loadedCount = value;
      if (key === 'selectedProduct') this.selectedProduct = value;
      if (key === 'currencySymbol') this.currencySymbol = value;
      
      if (this.features.debug) {
        console.log('[STATE UPDATE]', key, '→', value);
      }
    };

    // ==========================================================
    // 4. COMPONENT LIFECYCLE REFERENCES
    // ==========================================================
    this.container = null;
    this.templateHolder = null;
    this.eventListeners = new Map();
    this.toastTimer1 = null;
    this.toastTimer2 = null;
    this.redirectTimer = null;
    this.itemsPerBatch = this.features.itemsPerPage || 12;
    this.loadedCount = this.itemsPerBatch;
    this.callbacks = callbacks || {};
    this.kernel = kernel;

    // Initialize guard to prevent double initialization
    this._initialized = false;

    // Bind addEventListener to this instance
    this.addEventListener = addEventListener.bind(this);

    // ==========================================================
    // 5. INSPECTOR (Debug Mode)
    // ==========================================================
    this.inspector = new CartiqueInspector({
      enabled: this.features.debug || false,
      maxHistory: 50,
      version: '2.0.0'
    });

    // ==========================================================
    // 6. THEME MANAGER (New theme system)
    // ==========================================================
    // ==========================================================
// 6. THEME MANAGER (New theme system)
// ==========================================================
this.themeManager = new ThemeManager({
    catalogPath: this.features.catalogPath || '/catalog/',
    themes: this.features.themes || {},
    debug: this.features.debug || false
});

// Refresh UI components after theme change
this.themeManager.on('theme:switched', async ({ from, to }) => {

    if (this.features?.debug) {
        console.log(
            `[Theme Render Refresh] ${from} → ${to}`
        );
    }

    if (!this.productRenderer || !this.container) {
        console.warn(
            '[Theme Render Refresh] Renderer not ready'
        );
        return;
    }

    try {
        this.productRenderer.container = this.container;

        await this.productRenderer.renderProductDisplays();

    } catch (error) {
        console.error(
            '[Theme Render Refresh] Failed:',
            error
        );
    }

});

    // ==========================================================
    // 7. SERVICES
    // ==========================================================
    this.services = {
      pricing: new PricingService({
        currencySymbol: this.currencySymbol,
        products: this.products,
        formatPrice: this.formatPrice.bind(this),
        features: this.features,
        callbacks: this.callbacks,
        state: this.state
      }),
      cart: new CartService({
        products: this.products,
        features: this.features,
        callbacks: this.callbacks,
        showCart: this.showCart.bind(this),
        state: this.state
      }),
      locale: new LocaleService({
        currencySymbol: this.currencySymbol,
        features: this.features,
        callbacks: this.callbacks,
        state: this.state
      })
    };

    // ==========================================================
    // 8. NOTIFICATION SERVICE
    // ==========================================================
    this.notification = new NotificationService({
      container: this.container,
      eventListeners: this.eventListeners,
      features: this.features,
      callbacks: this.callbacks
    });

    // ==========================================================
// 9. ADAPTER (SINGLE INITIALIZATION — REMOVED DUPLICATES)
// ==========================================================
this.adapter = new CartiqueAdapter(this.kernel, {
  legacyMode: this.features.kernelMode !== true,
  debug: this.features.debug || false,
  onDecision: (decision) => this.recordDecision(decision)
});

// Pass adapter to services
if (this.services?.pricing?.setAdapter) {
  this.services.pricing.setAdapter(this.adapter);
}
if (this.services?.cart?.setAdapter) {
  this.services.cart.setAdapter(this.adapter);
}

//  Trigger initial cart sync after adapter is set
// Note: The sync method is concurrency-safe, so multiple calls are fine.
if (this.services?.cart?.syncWithKernel) {
  // Don't await here - let it run in background
  // The init() will handle the full initialization
  this.services.cart.syncWithKernel().catch(err => {
    console.warn('[StorefrontCore] Initial cart sync failed:', err);
  });
}

    // ==========================================================
    // 10. RENDERER CONTEXT (WITH SHARED STATE + LEGACY ALIASES)
    // ==========================================================
    const baseRendererContext = {
      // Data
      products: this.products,
      features: this.features,
      callbacks: this.callbacks,
      container: this.container,
      eventListeners: this.eventListeners,
      
      // No fallback — use features.currencySymbol directly
      currencySymbol: this.features?.currencySymbol,
      
      // SHARED STATE (SINGLE SOURCE OF TRUTH)
      state: this.state,
      
      // LEGACY ALIASES (for backward compatibility, gradually remove)
      filteredProducts: this.state.filteredProducts,
      currentLayout: this.state.currentLayout,
      currentSearchQuery: this.state.currentSearchQuery,
      activeCategoryId: this.state.activeCategoryId,
      activeFilters: this.state.activeFilters,
      singleProductViewActive: this.state.singleProductViewActive,
      previousViewState: this.state.previousViewState,
      loadedCount: this.state.loadedCount,
      itemsPerBatch: this.state.itemsPerBatch,
      
      // Utilities
      addEventListener: this.addEventListener,
      debounce,
      cleanupEventListeners: cleanupEventListeners.bind(this),
      
      // Services
      services: this.services,
      adapter: this.adapter,
      kernel: this.kernel,
      notification: this.notification,
      
      // Add to Cart (wired once, passed to all renderers)
      addToCart: this.services.cart.addToCart.bind(this.services.cart),
      
      // Formatting
      formatPrice: this.formatPrice.bind(this),
      formatDate: this.formatDate.bind(this),
      
      // Customer and place
      customer: this.customer || null,
      place: this.place || null
    };

    // ==========================================================
    // 11. CREATE RENDERERS (WITH THEMEMANAGER + COMPONENTREGISTRY)
    // ==========================================================
    this.productRenderer = new ProductRenderer({
      ...baseRendererContext,
      themeManager: this.themeManager,
      componentRegistry: this.themeManager.componentRegistry,
      container: this.container  // Pass container reference
    });

    this.collectionRenderer = new CollectionRenderer({
      ...baseRendererContext,
      themeManager: this.themeManager,
      componentRegistry: this.themeManager.componentRegistry,
      container: this.container  // Pass container reference
    });

    this.cartRenderer = new CartRenderer({
      ...baseRendererContext,
      themeManager: this.themeManager,
      componentRegistry: this.themeManager.componentRegistry,
      container: this.container,  // Pass container reference
      cartService: this.services.cart  //  ADD THIS

    });

    // ==========================================================
    // 12. WIRE CALLBACKS
    // ==========================================================
    
    // ProductRenderer → CollectionRenderer (search, sort, back)
    this.productRenderer.onSearch = (query) => {
      if (this.features?.debug) {
        console.log('[TRACE] onSearch triggered:', query);
      }
      this.collectionRenderer.handleSearch(query);
    };
    
    this.productRenderer.onSort = (sortType) => {
      if (this.features?.debug) {
        console.log('[TRACE] onSort triggered:', sortType);
      }
      this.collectionRenderer.handleSort(sortType);
    };
    
    this.productRenderer.onBackToList = async () => {
    if (this.features?.debug) {
        console.trace("[TRACE] onBackToList triggered");
    }

    await this.collectionRenderer.handleBackToList();

    const productDisplays = document.getElementById("cartique-product-displays");
    const sidebar = document.getElementById("cartique-sidebar");
    const controls = document.getElementById("cartique-controls");
    const menuAnchor = document.getElementById("cartique-menu-anchor-top");
    const mainContent = document.getElementById("cartique-main-content");

    if (productDisplays) {
        productDisplays.style.display = "block";
    }

    if (sidebar) {
        sidebar.style.display = this.features?.sidebarDisplay || "";
    }

    if (controls) {
        controls.style.display = "";
    }

    if (menuAnchor) {
        menuAnchor.style.display = "";
    }

    if (mainContent) {
        mainContent.classList.add("cartique-full-width");
    }
};

    
    this.productRenderer.onFilterChange = (filters) => {
      if (this.features?.debug) {
        console.log('[TRACE] onFilterChange triggered:', filters);
      }
      this.collectionRenderer.handleFilterChange(filters);
    };
    
    this.productRenderer.onClearFilters = () => {
      if (this.features?.debug) {
        console.log('[TRACE] onClearFilters triggered');
      }
      this.collectionRenderer.clearAllFilters();
    };
    
    // ProductRenderer → StorefrontCore (layout change)
    this.productRenderer.onLayoutChange = (layout) => {
      if (this.features?.debug) {
        console.log('[TRACE] onLayoutChange triggered:', layout);
      }
      this.updateState('currentLayout', layout);
      this.productRenderer.renderProductDisplays();
    };
    
    // CollectionRenderer → StorefrontCore → ProductRenderer (filter results)
    this.collectionRenderer.onFilterApplied = (filteredProducts) => {
      if (this.features?.debug) {
        console.log('[TRACE] onFilterApplied triggered with', filteredProducts.length, 'products');
        console.trace();
      }
      this.updateState('filteredProducts', filteredProducts);
      this.productRenderer.filteredProducts = filteredProducts;
      // Single render trigger — ONLY HERE
      this.productRenderer.renderProductDisplays();
    };
    
    // Updated: onCategorySelect — no render here, onFilterApplied handles it
    this.collectionRenderer.onCategorySelect = () => {
      if (this.features?.debug) {
        console.log('[TRACE] onCategorySelect triggered');
      }
      // No render here — onFilterApplied handles it
    };
    
    // CartService → CartRenderer (cart updated) — async with debug
    this.services.cart.onCartUpdated = async () => {
      if (this.features?.debug) {
        console.log('[TRACE] onCartUpdated triggered');
        console.trace();
      }

      if (this.cartRenderer && typeof this.cartRenderer.showCart === 'function') {
        if (this.features?.debug) {
          console.log('[TRACE] Calling CartRenderer.showCart()');
        }
        await this.cartRenderer.showCart();
        if (this.features?.debug) {
          console.log('[TRACE] CartRenderer.showCart completed');
        }
      } else {
        console.warn('[TRACE] CartRenderer not available or showCart missing');
        console.warn('[TRACE] cartRenderer:', this.cartRenderer);
      }
    };

    // ==========================================================
    // 13. URL STATE RESTORERS
    // ==========================================================
    this.registerUrlStateRestorer(this.restoreCartState);
    this.registerUrlStateRestorer(this.restoreSearchState);

    // ==========================================================
    // 14. NOTE: this.init() is NOT called here.
    // Caller must call storefront.init() explicitly.
    // ==========================================================
  }

  // ==========================================================
  // HELPERS
  // ==========================================================

  /**
   * Check if running in browser environment
   * @returns {boolean}
   */
  isBrowser() {
    return typeof document !== 'undefined' && typeof window !== 'undefined';
  }

  recordDecision(decision) {
    if (this.inspector && this.inspector.enabled) {
      this.inspector.record(decision);
    }
  }

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

  // ==========================================================
  // PUBLIC API
  // ==========================================================

  openCart() {
    console.log('openCart() called');
    this.showCartPage();
  }

  // ==========================================================
  // URL STATE RESTORATION
  // ==========================================================

  getCurrentRoute() {
    if (!this.isBrowser()) {
      return {
        pathname: '',
        hash: '',
        params: new URLSearchParams()
      };
    }

    return {
      pathname: window.location.pathname,
      hash: window.location.hash.toLowerCase(),
      params: new URLSearchParams(window.location.search)
    };
  }

  async restoreStateFromUrl() {
    console.log('restoreStateFromUrl() called');
    await this.restoreCartState();
  }

  restoreCartState() {
    console.log('restoreCartState() called');
    const route = this.getCurrentRoute();
    if (route.hash === '#cart' || route.params.get('ui') === 'cart') {
      this.openCart();
    }
  }

  async restoreSearchState() {
    const route = this.getCurrentRoute();
    const query = route.params.get('search');
    if (query !== null) {
      if (this.productRenderer && this.productRenderer.onSearch) {
        this.productRenderer.onSearch(query);
      }
    }
  }

  registerUrlStateRestorer(restorer) {
    if (typeof restorer !== 'function') return;
    if (!this.urlStateRestorers.includes(restorer)) {
      this.urlStateRestorers.push(restorer);
    }
  }

  // ==========================================================
  // PUBLIC SEARCH API
  // ==========================================================

  async setSearchQuery(query = '') {
    if (this.productRenderer && this.productRenderer.onSearch) {
      this.productRenderer.onSearch(query);
    }
  }

  async clearSearchQuery() {
    if (this.productRenderer && this.productRenderer.onSearch) {
      this.productRenderer.onSearch('');
    }
  }

  getSearchQuery() {
    return this.currentSearchQuery;
  }

  // ==========================================================
  // SINGLE PRODUCT VIEW
  // ==========================================================

  async showSingleProductView(productId) {
    const product = this.products.find(p => p.id === productId);
    if (product && this.productRenderer) {
      this.updateState('selectedProduct', product);
      await this.productRenderer.renderSingleProduct(product);
    }
  }

  async returnToListView() {
    if (this.productRenderer && this.productRenderer.onBackToList) {
      await this.productRenderer.onBackToList();
    }
  }

  // ==========================================================
  // LAYOUT
  // ==========================================================

  async setLayout(layout) {
    if (!this.productRenderer) {
      console.warn('ProductRenderer not available for setLayout');
      return;
    }
    try {
      await this.productRenderer.setLayout(layout);
    } catch (error) {
      console.warn('setLayout failed:', error.message);
    }
  }

  // ==========================================================
  // CART METHODS
  // ==========================================================

  showCart() {
    if (!this.cartRenderer) return;
    try {
      this.cartRenderer.showCart();
    } catch (error) {
      console.warn('showCart failed:', error.message);
    }
  }

  closeCart() {
    if (!this.cartRenderer) return;
    try {
      this.cartRenderer.closeCart();
    } catch (error) {
      console.warn('closeCart failed:', error.message);
    }
  }

  showCartPage() {
    if (!this.cartRenderer) return;
    try {
      this.cartRenderer.showCartPage();
    } catch (error) {
      console.warn('showCartPage failed:', error.message);
    }
  }

  closeCartPage() {
    if (!this.cartRenderer) return;
    try {
      this.cartRenderer.closeCartPage();
    } catch (error) {
      console.warn('closeCartPage failed:', error.message);
    }
  }

  // ==========================================================
  // FORMATTING
  // ==========================================================

  formatPrice(price) {
    if (price === undefined || price === null || isNaN(price)) {
      return '0.00';
    }
    return Number(price).toFixed(2);
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // ==========================================================
  // THEME MANAGEMENT API
  // ==========================================================

  /**
   * Switch to a different theme
   * @param {string} name - Theme name
   * @returns {Promise<Object>} Theme object
   */
  setTheme(name) {
    return this.themeManager.switch(name);
  }

  /**
   * Get current theme information
   * @returns {Object} { name, theme }
   */
  getTheme() {
    return this.themeManager.current();
  }

  /**
   * List available themes
   * @returns {Array<string>} Theme names
   */
  listThemes() {
    return this.themeManager.list();
  }

  /**
   * Preview a theme without switching
   * @param {string} name - Theme name
   * @returns {Promise<Object>} { restore: Function }
   */
  previewTheme(name) {
    return this.themeManager.preview(name);
  }

  /**
   * Get theme information
   * @param {string} name - Theme name
   * @returns {Object} Theme info
   */
  getThemeInfo(name) {
    return this.themeManager.getThemeInfo(name);
  }

  /**
   * Get the ThemeManager instance
   * @returns {ThemeManager}
   */
  getThemeManager() {
    return this.themeManager;
  }

  // ==========================================================
  // INITIALIZATION
  // ==========================================================

  /**
   * Initializes the Cartique instance
   * Must be called explicitly after instantiation
   */
  async init() {
    if (this._initialized) {
      console.warn('Storefront already initialized');
      return;
    }

    this._initialized = true;

    try {
      // 1. Initialize Theme Manager
      const initialTheme = this.features.theme || 'default';
      await this.themeManager.initialize(initialTheme);
      
      // 2. Sync display states
      const sidebarEnabled = this.features.sidebar &&
        (this.features.sidebarFeatures?.enabled !== false);
      this.features.sidebarDisplay = sidebarEnabled ? 'block' : 'none';
      this.features.footerDisplay = this.features.footer ? 'block' : 'none';

      // 3. DOM setup
      if (this.isBrowser()) {
        this.container = document.querySelector(`#${this.features.containerId}`);
        
        if (!this.container) {
          throw new Error(`Container with ID "${this.features.containerId}" not found`);
        }
        
        // Bind resolved DOM container to renderers
        this.productRenderer.container = this.container;
        this.collectionRenderer.container = this.container;
        this.cartRenderer.container = this.container;
        
        this.notification.container = this.container;
      }

      // 4. Component loading & rendering
      await this.fetchAndExtractComponents();
      await this.renderAllComponents();
      
      if (this.features?.debug) {
        console.log('[TRACE] Initial product render');
      }
      await this.productRenderer.renderProductDisplays();
      
      // 5. Event listeners & completion
      this.setupEventListeners();
      await this.completeInitialization();
      
    } catch (error) {
      console.error('Failed to initialize Cartique:', error);
      this.notification.showErrorMessage('Failed to load product catalog');
    }
  }

  async fetchAndExtractComponents() {
    // Browser guard for Node/SSR environments
    if (!this.isBrowser()) {
      this.templateHolder = null;
      return;
    }

    const cartiqueComponents = document.getElementById('cartique-components');
    if (!cartiqueComponents) {
      throw new Error('Could not find #cartique-components in the DOM');
    }

    this.templateHolder = document.createElement('template');
    this.templateHolder.innerHTML = cartiqueComponents.innerHTML;

    if (!this.templateHolder.content) {
      throw new Error('Failed to create template holder for components');
    }

    this.productRenderer.templateHolder = this.templateHolder;
    this.collectionRenderer.templateHolder = this.templateHolder;
    this.cartRenderer.templateHolder = this.templateHolder;
  }

  async renderAllComponents() {
    try { await this.productRenderer.renderMainFrame(); } catch (e) { console.warn('renderMainFrame failed:', e.message); }
    try { await this.productRenderer.renderSidebar(); } catch (e) { console.warn('renderSidebar failed:', e.message); }
    try { await this.collectionRenderer.renderCatalogueMenu(); } catch (e) { console.warn('renderCatalogueMenu failed:', e.message); }
    try { await this.productRenderer.renderControls(); } catch (e) { console.warn('renderControls failed:', e.message); }
    try { await this.productRenderer.renderFooter(); } catch (e) { console.warn('renderFooter failed:', e.message); }
    try { await this.cartRenderer.renderCartSlider(); } catch (e) { console.warn('renderCartSlider failed:', e.message); }
    try { await this.cartRenderer.renderCartItemTemplate(); } catch (e) { console.warn('renderCartItemTemplate failed:', e.message); }

    // Only run DOM operations in browser
    if (this.isBrowser()) {
      const sidebar = document.getElementById('cartique-sidebar');
      if (sidebar) {
        sidebar.style.display = this.features.sidebarDisplay;
        const mainContent = document.getElementById('cartique-main-content');
        if (mainContent) {
          if (this.features.sidebarDisplay === 'none') {
            mainContent.classList.add('cartique-full-width');
          } else {
            mainContent.classList.remove('cartique-full-width');
          }
        }
      }

      const sidebarEnabled = this.features.sidebar &&
        (this.features.sidebarFeatures?.enabled !== false);
      if (sidebarEnabled && this.features.sidebarFeatures?.filters) {
        try {
          await this.collectionRenderer.renderSidebarFilters();
        } catch (e) {
          console.warn('renderSidebarFilters failed:', e.message);
        }
      }
    }
  }

  setupEventListeners() {
    // Browser guard for Node/SSR environments
    if (!this.isBrowser()) return;

    const gridButton = document.querySelector('.cartique-grid-view');
    const listButton = document.querySelector('.cartique-list-view');

    if (gridButton) {
      this.addEventListener(gridButton, 'click', () => this.setLayout('grid'));
    }

    if (listButton) {
      this.addEventListener(listButton, 'click', () => this.setLayout('list'));
    }
  }

  async completeInitialization() {
    const container = document.getElementById(this.features.containerId);
    if (container) {
      container.style.visibility = 'visible';
      container.style.opacity = '1';
    }
    await this.restoreStateFromUrl();
  }

  destroy() {
    cleanupEventListeners.call(this);
    if (this.toastTimer1) clearTimeout(this.toastTimer1);
    if (this.toastTimer2) clearTimeout(this.toastTimer2);
    if (this.redirectTimer) clearTimeout(this.redirectTimer);

    const singleProductView = document.getElementById('single-product-view-container');
    if (singleProductView) singleProductView.remove();

    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}