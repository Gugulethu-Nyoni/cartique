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
import WishlistService from './services/WishlistService.js';
import LocaleService from './services/LocaleService.js';
import ProductRenderer from './renderers/ProductRenderer.js';
import CollectionRenderer from './renderers/CollectionRenderer.js';
import CartRenderer from './renderers/CartRenderer.js';
import WishlistRenderer from './renderers/WishlistRenderer.js';
import CartiqueInspector from './debug/CartiqueInspector.js';
import ThemeManager from './theme/ThemeManager.js';
import Router from './navigation/Router.js';
import RouteRegistry from './navigation/RouteRegistry.js';
import searchRoute from './navigation/routes/search.route.js';
import categoryRoute from './navigation/routes/category.route.js';
import cartRoute from './navigation/routes/cart.route.js';
import productRoute from './navigation/routes/product.route.js';
import wishlistRoute from './navigation/routes/wishlist.route.js';
import CapabilityTrace from './debug/CapabilityTrace.js';
import { BehaviorTracker } from './behavior/index.js';
import Logger from './debug/Logger.js';


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
    // 4.5 CAPABILITY TRACE (Debug Layer)
    // ==========================================================
    this.capabilityTrace = new CapabilityTrace(
        this.features?.debug === true
    );

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
    // 6.5 BEHAVIOR TRACKER
    // ==========================================================
    const behavior = new BehaviorTracker({
        enabled: this.features?.behavior?.enabled !== false,
        transport: this.features?.behavior?.transport || 'fetch',
        baseUrl: this.features?.behavior?.baseUrl || '/api',
        endpoint: this.features?.behavior?.endpoint || '/storefront/events',
        apiHandler: this.features?.behavior?.apiHandler || null,
        batchSize: this.features?.behavior?.batchSize || 10,
        batchInterval: this.features?.behavior?.batchInterval || 5000,
        debug: this.features?.debug || false
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
        state: this.state,
        showCheckoutAlert: () => {
          this.notification.showCheckoutAlert();
        },
        showStockAlert: (message) => {
          this.notification.showStockAlert(message);
        },
        behavior: behavior
      }),
      wishlist: new WishlistService({
        products: this.products,
        features: this.features,
        callbacks: this.callbacks,
        state: this.state,
        behavior: behavior
      }),
      behavior: behavior,
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
    // 9. ADAPTER (SINGLE INITIALIZATION)
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

if (this.services?.cart?.syncWithKernel) {
  this.services.cart.syncWithKernel().catch(err => {
    console.warn('[StorefrontCore] Initial cart sync failed:', err);
  });
}

    // ==========================================================
    // 9.5 NAVIGATION LAYER
    // ==========================================================
    this.routeRegistry = new RouteRegistry([cartRoute, productRoute, categoryRoute, searchRoute, wishlistRoute]);
    this.router = new Router({ storefront: this });

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
      
      currencySymbol: this.features?.currencySymbol,
      
      // SHARED STATE (SINGLE SOURCE OF TRUTH)
      state: this.state,
      
      // LEGACY ALIASES
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
      
      addToCart: this.services.cart.addToCart.bind(this.services.cart),
      behavior: this.services.behavior,
      wishlist: this.services.wishlist,
      
      // Formatting
      formatPrice: this.formatPrice.bind(this),
      formatDate: this.formatDate.bind(this),
      
      // Customer and place
      customer: this.customer || null,
      place: this.place || null
    };

    // ==========================================================
    // 11. CREATE RENDERERS
    // ==========================================================
    this.productRenderer = new ProductRenderer({
      ...baseRendererContext,
      themeManager: this.themeManager,
      componentRegistry: this.themeManager.componentRegistry,
      container: this.container
    });

    this.collectionRenderer = new CollectionRenderer({
      ...baseRendererContext,
      themeManager: this.themeManager,
      componentRegistry: this.themeManager.componentRegistry,
      container: this.container
    });

    this.wishlistRenderer = new WishlistRenderer({
      ...baseRendererContext,
      productRenderer: this.productRenderer,
      wishlist: this.services.wishlist,
      products: this.products,
      adapter: this.adapter,
      currencySymbol: this.currencySymbol,
      addToCart: this.services.cart.addToCart.bind(this.services.cart),
      behavior: this.services.behavior,
      container: this.container,
      features: this.features,
      formatPrice: this.formatPrice.bind(this)
    });

    this.wishlistRenderer.onBackToShop = async () => {
      if (this.features?.debug) {
        console.log('[TRACE][STOREFRONT] Wishlist onBackToShop() START');
        console.trace();
      }

      // 1. Remove wishlist page from the DOM
      const wishlistPage = document.getElementById('cartique-wishlist-page');
      if (wishlistPage) {
        if (this.features?.debug) {
          console.log('[TRACE][STOREFRONT] Removing wishlist page');
        }
        wishlistPage.remove();
      } else if (this.features?.debug) {
        console.warn('[TRACE][STOREFRONT] Wishlist page not found');
      }

      // 2. Update browser URL without reloading the page
      if (this.features?.debug) {
        console.log('[TRACE][STOREFRONT] Navigating URL to /shop');
      }
      window.history.pushState({}, '', '/shop');

      // 3. Restore the existing product UI lifecycle
      if (typeof this.productRenderer?.onBackToList === 'function') {
        if (this.features?.debug) {
          console.log('[TRACE][STOREFRONT] Delegating to productRenderer.onBackToList()');
        }

        try {
          await this.productRenderer.onBackToList();
          if (this.features?.debug) {
            console.log('[TRACE][STOREFRONT] productRenderer.onBackToList() completed');
          }
        } catch (error) {
          console.error('[TRACE][STOREFRONT] onBackToList() failed:', error);
        }
      } else {
        console.warn('[TRACE][STOREFRONT] productRenderer.onBackToList() is not available');
      }

      if (this.features?.debug) {
        console.log('[TRACE][STOREFRONT] Wishlist onBackToShop() COMPLETE');
      }
    };

    this.cartRenderer = new CartRenderer({
      ...baseRendererContext,
      themeManager: this.themeManager,
      componentRegistry: this.themeManager.componentRegistry,
      container: this.container,
      cartService: this.services.cart
    });

    // ==========================================================
    // 12. WIRE CALLBACKS
    // ==========================================================
    
    this.productRenderer.onSearch = (query) => {
      this.capabilityTrace?.log('SEARCH', 'ProductRenderer → CollectionRenderer', query);
      this.collectionRenderer.handleSearch(query);
    };
    
    this.productRenderer.onSort = (sortType) => {
      if (this.features?.debug) {
        console.log('[TRACE] onSort triggered:', sortType);
      }
      this.collectionRenderer.handleSort(sortType);
    };
    
    this.productRenderer.onBackToList = async () => {
      console.log('[TRACE][PRODUCT] onBackToList() START');
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
    
    this.productRenderer.onLayoutChange = (layout) => {
      if (this.features?.debug) {
        console.log('[TRACE] onLayoutChange triggered:', layout);
      }
      this.updateState('currentLayout', layout);
      this.productRenderer.renderProductDisplays();
    };
    
    this.collectionRenderer.onFilterApplied = (filteredProducts) => {
      if (this.features?.debug) {
        console.log('[TRACE] onFilterApplied triggered with', filteredProducts.length, 'products');
        console.trace();
      }
      this.updateState('filteredProducts', filteredProducts);
      this.productRenderer.filteredProducts = filteredProducts;
      this.productRenderer.renderProductDisplays();
    };
    
    this.collectionRenderer.onCategorySelect = () => {
      if (this.features?.debug) {
        console.log('[TRACE] onCategorySelect triggered');
      }
    };
    
    this.services.cart.onCartUpdated = async (source = 'drawer') => {
      if (this.features?.debug) {
        console.log('[TRACE] onCartUpdated triggered from:', source);
        console.trace();
      }

      if (source === 'drawer') {
        if (this.cartRenderer && typeof this.cartRenderer.showCart === 'function') {
          if (this.features?.debug) {
            console.log('[TRACE] Calling CartRenderer.showCart()');
          }
          await this.cartRenderer.showCart();
          if (this.features?.debug) {
            console.log('[TRACE] CartRenderer.showCart completed');
          }
        }
      } else if (source === 'page') {
        if (this.cartRenderer && typeof this.cartRenderer.renderCartPage === 'function') {
          if (this.features?.debug) {
            console.log('[TRACE] Calling CartRenderer.renderCartPage()');
          }
          await this.cartRenderer.renderCartPage();
          if (this.features?.debug) {
            console.log('[TRACE] CartRenderer.renderCartPage completed');
          }
        }
      } else {
        if (this.cartRenderer && typeof this.cartRenderer.showCart === 'function') {
          await this.cartRenderer.showCart();
        }
      }
    };

    // ==========================================================
    // 13. URL STATE RESTORERS
    // ==========================================================
    this.services.wishlist.onWishlistUpdated = () => {
      if (this.features?.debug) {
        console.log('[TRACE] Wishlist updated');
      }
      this.productRenderer?.updateWishlistStates?.();
      this.collectionRenderer?.updateWishlistStates?.();
    };

    this.registerUrlStateRestorer(this.restoreCartState);
    this.registerUrlStateRestorer(this.restoreSearchState);
  }

  // ==========================================================
  // HELPERS
  // ==========================================================

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

  async openCart() {
    console.log('openCart() called');
    await this.showCartPage();
  }



    setupUrlStateListeners() {
    if (!this.isBrowser()) return;

    window.addEventListener('hashchange', async () => {
      console.log('hashchange detected:', window.location.hash);

      if (this.router && typeof this.router.handle === 'function') {
        this.router.handle();
      } else {
        await this.restoreStateFromUrl();
      }
    });
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
    for (const restorer of this.urlStateRestorers) {
      await restorer.call(this);
    }
  }

  async restoreCartState() {
    console.log('restoreCartState() called');
    const route = this.getCurrentRoute();
    if (route.hash === '#cart' || route.params.get('ui') === 'cart') {
      await this.openCart();
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

  search(query) {
    this.capabilityTrace?.log('SEARCH', 'Public API called', query);
    return this.setSearchQuery(query);
  }



      category(input) {
    this.capabilityTrace?.log('CATEGORY', 'Public API called', input);
    const id = this.findCategoryId(input);
    this.capabilityTrace?.log('CATEGORY', 'Resolved category ID', id);

    if (!id) {
      this.capabilityTrace?.log('CATEGORY', 'Category not found', input);
      return this.productRenderer?.renderEmptyState({
        title: 'Category not found',
        message: `We could not find category: "${input}"`
      });
    }

    if (this.collectionRenderer && typeof this.collectionRenderer.handleCategorySelect === 'function') {
      return this.collectionRenderer.handleCategorySelect(id);
    }
  }
  

  findCategoryId(input) {
    if (input == null) return null;

    if (!Number.isNaN(Number(input))) {
      return Number(input);
    }


    const slugify = (value) =>
      String(value)
        .toLowerCase()
        .trim()
        .replace(/&/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');


    const inputSlug = slugify(input);


    const category = (this.categories || []).find(cat => {

      const nameSlug = slugify(cat.name);

      const explicitSlug = cat.slug
        ? slugify(cat.slug)
        : null;


      return (
        nameSlug === inputSlug ||
        explicitSlug === inputSlug
      );

    });


    return category ? category.id : null;
  }
  

  findProductBySlug(slug) {
    return this.products.find(product => product.slug === slug);
  }

  product(slug) {
    this.capabilityTrace?.log('PRODUCT', 'Public API called', slug);
    const product = this.findProductBySlug(slug);
    if (!product) {
      this.capabilityTrace?.log('PRODUCT', 'Product not found', slug);
      return this.productRenderer?.renderEmptyState({
        title: 'Product not found',
        message: `We could not find: "${slug}"`
      });
    }
    return this.showSingleProductView(product.id);
  }
  async setSearchQuery(query = '') {
    this.capabilityTrace?.log('SEARCH', 'Delegating to ProductRenderer', query);
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

  setTheme(name) {
    return this.themeManager.switch(name);
  }

  getTheme() {
    return this.themeManager.current();
  }

  listThemes() {
    return this.themeManager.list();
  }

  previewTheme(name) {
    return this.themeManager.preview(name);
  }

  getThemeInfo(name) {
    return this.themeManager.getThemeInfo(name);
  }

  getThemeManager() {
    return this.themeManager;
  }

  // ==========================================================
  // INITIALIZATION
  // ==========================================================

  async init() {
    if (this._initialized) {
      console.warn('Storefront already initialized');
      return;
    }

    this._initialized = true;

    try {
      const initialTheme = this.features.theme || 'default';
      await this.themeManager.initialize(initialTheme);
      
      const sidebarEnabled = this.features.sidebar &&
        (this.features.sidebarFeatures?.enabled !== false);
      this.features.sidebarDisplay = sidebarEnabled ? 'block' : 'none';
      this.features.footerDisplay = this.features.footer ? 'block' : 'none';

      if (this.isBrowser()) {
        this.container = document.querySelector(`#${this.features.containerId}`);
        
        if (!this.container) {
          throw new Error(`Container with ID "${this.features.containerId}" not found`);
        }
        
        this.productRenderer.container = this.container;
        this.collectionRenderer.container = this.container;
        this.cartRenderer.container = this.container;
        
        this.notification.container = this.container;
      }

      await this.fetchAndExtractComponents();
      await this.renderAllComponents();
      
      if (this.features?.debug) {
        console.log('[TRACE] Initial product render');
      }
      await this.productRenderer.renderProductDisplays();
      
      this.setupEventListeners();
      await this.completeInitialization();
      
    } catch (error) {
      console.error('Failed to initialize Cartique:', error);
      this.notification.showErrorMessage('Failed to load product catalog');
    }
  }

  async fetchAndExtractComponents() {
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

    this.setupUrlStateListeners();

    this.initializeNavigation();
  }
  

  initializeNavigation() {
    this.capabilityTrace?.log('ROUTER', 'Navigation bootstrap started');

    if (!this.router) {
      this.capabilityTrace?.error(
        'ROUTER',
        'Router unavailable',
        new Error('Router not initialized')
      );
      return;
    }

    this.router.handle();
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
