/**
 * @semantq/storefront
 *
 * StorefrontCore — Core engine for Cartique storefront
 * 
 * This class handles the main lifecycle, state management,
 * and core functionality of the storefront.
 */

import { deepMerge } from './utils/object.js';
import { addEventListener, cleanupEventListeners } from './utils/dom.js';
import { debounce } from './utils/performance.js';
import DefaultTheme from './theme/DefaultTheme.js';
import NotificationService from './services/NotificationService.js';
import CartiqueAdapter from './adapters/CartiqueAdapter.js';
import PricingService from './services/PricingService.js';
import CartService from './services/CartService.js';
import LocaleService from './services/LocaleService.js';
// Import renderers
import ProductRenderer from './renderers/ProductRenderer.js';
import CollectionRenderer from './renderers/CollectionRenderer.js';
import CartRenderer from './renderers/CartRenderer.js';
import CartiqueInspector from './debug/CartiqueInspector.js';

export default class StorefrontCore {
  constructor(products, features = {}, callbacks = {}, kernel = null) {
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
    this.currencySymbol = this.features.currencySymbol || '$';

    // 3. Data State Management
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

    // 4. Component Lifecycle References
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

    // 4.5 Initialize Inspector (debug mode)
    this.inspector = new CartiqueInspector({
      enabled: this.features.debug || false,
      maxHistory: 50,
      version: '2.0.0'
    });

    // 5. Initialize Theme
    this.theme = new DefaultTheme({
      features: this.features,
      containerId: this.features.containerId
    });

    // 6. Initialize Services
    this.services = {
      pricing: new PricingService({
        currencySymbol: this.currencySymbol,
        products: this.products,
        formatPrice: this.formatPrice.bind(this),
        features: this.features,
        callbacks: this.callbacks
      }),
      cart: new CartService({
        products: this.products,
        features: this.features,
        callbacks: this.callbacks
      }),
      locale: new LocaleService({
        currencySymbol: this.currencySymbol,
        features: this.features,
        callbacks: this.callbacks
      })
    };

    // 7. Initialize Notification Service
    this.notification = new NotificationService({
      container: this.container,
      features: this.features,
      callbacks: this.callbacks
    });

    // 8. Initialize Adapter (SINGLE initialization - removed duplicates)
    this.adapter = new CartiqueAdapter(this.kernel, {
      legacyMode: this.features.kernelMode !== true,
      debug: this.features.debug || false,
      onDecision: (decision) => this.recordDecision(decision)
    });

    // 9. Pass adapter to services
    if (this.services?.pricing?.setAdapter) {
      this.services.pricing.setAdapter(this.adapter);
    }
    if (this.services?.cart?.setAdapter) {
      this.services.cart.setAdapter(this.adapter);
    }

    // 10. Create minimal renderer context (NO RENDER METHODS)
    this.rendererContext = {
      // Data
      products: this.products,
      features: this.features,
      callbacks: this.callbacks,
      container: this.container,
      
      // Utilities (from imports)
      addEventListener,
      debounce,
      
      // Services
      services: this.services,
      theme: this.theme,
      adapter: this.adapter,
      kernel: this.kernel,
      notification: this.notification,
      
      // Core state
      currencySymbol: this.currencySymbol,
      filteredProducts: this.filteredProducts,
      currentLayout: this.currentLayout,
      currentSearchQuery: this.currentSearchQuery,
      activeCategoryId: this.activeCategoryId,
      activeFilters: this.activeFilters,
      singleProductViewActive: this.singleProductViewActive,
      previousViewState: this.previousViewState,
      templateHolder: this.templateHolder,
      itemsPerBatch: this.itemsPerBatch,
      loadedCount: this.loadedCount,
      
      // UI Actions (bound methods)
      showCart: this.showCart.bind(this),
      closeCart: this.closeCart.bind(this),
      showCartPage: this.showCartPage.bind(this),
      closeCartPage: this.closeCartPage.bind(this),
      setLayout: this.setLayout.bind(this),
      handleSearch: this.handleSearch.bind(this),
      handleSort: this.handleSort.bind(this),
      applyAllFilters: this.applyAllFilters.bind(this),
      applyFilters: this.applyFilters.bind(this),
      handleFilterChange: this.handleFilterChange.bind(this),
      clearAllFilters: this.clearAllFilters.bind(this),
      addToCart: this.services.cart.addToCart.bind(this.services.cart),
      checkout: this.services.cart.checkout.bind(this.services.cart),
      showSingleProductView: this.showSingleProductView.bind(this),
      returnToListView: this.returnToListView.bind(this),
      setupInfiniteScroll: this.setupInfiniteScroll.bind(this),
      loadMoreProducts: this.loadMoreProducts.bind(this),
      renderCatalogueMenu: this.renderCatalogueMenu.bind(this),
      renderSidebarFilters: this.renderSidebarFilters.bind(this),
      renderProductDisplays: this.renderProductDisplays.bind(this),
      renderProducts: this.renderProducts.bind(this),
      
      // Formatting
      formatPrice: this.formatPrice.bind(this),
      formatDate: this.formatDate.bind(this),
      
      // Customer and place
      customer: this.customer || null,
      place: this.place || null
    };

    // 11. Initialize Renderers with minimal context
    this.productRenderer = new ProductRenderer(this.rendererContext);
    this.collectionRenderer = new CollectionRenderer(this.rendererContext);
    this.cartRenderer = new CartRenderer(this.rendererContext);

    // 12. Register URL state restorers
    this.registerUrlStateRestorer(this.restoreCartState);
    this.registerUrlStateRestorer(this.restoreSearchState);

    // 13. Fire off the Engine
    this.init();
  }

  /**
   * Record a CommercialDecision for debugging
   * @param {CommercialDecision} decision
   */
  recordDecision(decision) {
    if (this.inspector && this.inspector.enabled) {
      this.inspector.record(decision);
    }
  }

  /**
   * Extracts unique categories from products
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

  // ==========================================================
  // PUBLIC API
  // ==========================================================

  /**
   * Opens the cart page programmatically
   */
  openCart() {
    console.log('🔍 4. openCart() called');
    this.showCartPage();
  }

  // ==========================================================
  // URL STATE RESTORATION
  // ==========================================================

  /**
   * Returns the current browser URL state
   */
  getCurrentRoute() {
    return {
      pathname: window.location.pathname,
      hash: window.location.hash.toLowerCase(),
      params: new URLSearchParams(window.location.search)
    };
  }

  /**
   * Restores Cartique UI state from the current URL
   */
  async restoreStateFromUrl() {
    console.log('🔍 1. restoreStateFromUrl() called');
    await this.restoreCartState();
  }

  /**
   * Restores cart state from URL
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

  /**
   * Restores search state from URL
   */
  async restoreSearchState() {
    const route = this.getCurrentRoute();
    const query = route.params.get('search');

    if (query !== null) {
      await this.performSearch(query);
    }
  }

  /**
   * Registers a URL state restorer function
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
  // PUBLIC SEARCH API
  // ==========================================================

  /**
   * Sets the current search query
   */
  async setSearchQuery(query = '') {
    await this.performSearch(query);
  }

  /**
   * Clears the current search query
   */
  async clearSearchQuery() {
    await this.setSearchQuery('');
  }

  /**
   * Returns the current search query
   */
  getSearchQuery() {
    return this.currentSearchQuery;
  }

  /**
   * Executes the search operation
   */
  async performSearch(rawQuery = '') {
    const normalisedQuery = String(rawQuery).trim();

    if (normalisedQuery === this.currentSearchQuery) {
      return;
    }

    this.currentSearchQuery = normalisedQuery;
    await this.applyAllFilters();
  }

  // ==========================================================
  // SINGLE PRODUCT VIEW
  // ==========================================================

  /**
   * Returns to the product list view
   */
  async returnToListView() {
    await this.productRenderer.returnToListView();
  }

  // ==========================================================
  // DELEGATED RENDERER METHODS (KEEP THESE)
  // ==========================================================

  /**
   * Renders product displays
   */
  async renderProductDisplays() {
    await this.productRenderer.renderProductDisplays();
  }

  /**
   * Renders products in a layout
   */
  async renderProducts(layout, data) {
    await this.productRenderer.renderProducts(layout, data);
  }

  /**
   * Sets the layout
   */
  async setLayout(layout) {
    await this.productRenderer.setLayout(layout);
  }

  /**
   * Renders a single product view
   */
  async renderSingleProduct(product) {
    await this.productRenderer.renderSingleProduct(product);
  }

  /**
   * Shows a single product view
   */
  async showSingleProductView(productId) {
    await this.productRenderer.showSingleProductView(productId);
  }

  /**
   * Renders product details
   */
  renderProductDetails(product) {
    return this.productRenderer.renderProductDetails(product);
  }

  /**
   * Renders product reviews
   */
  renderProductReviews(product) {
    return this.productRenderer.renderProductReviews(product);
  }

  /**
   * Renders stars for ratings
   */
  renderStars(rating) {
    return this.productRenderer.renderStars(rating);
  }

  /**
   * Submits a review
   */
  async submitReview(form, product) {
    await this.productRenderer.submitReview(form, product);
  }

  /**
   * Renders the catalogue menu
   */
  async renderCatalogueMenu() {
    if (!this.collectionRenderer) {
      console.warn('CollectionRenderer not available for menu');
      return;
    }
    try {
      await this.collectionRenderer.renderCatalogueMenu();
    } catch (error) {
      console.warn('renderCatalogueMenu failed:', error.message);
    }
  }

  /**
   * Applies all filters
   */
  async applyAllFilters() {
    if (!this.collectionRenderer) {
      console.warn('CollectionRenderer not available for filters');
      return;
    }
    try {
      await this.collectionRenderer.applyAllFilters();
    } catch (error) {
      console.warn('applyAllFilters failed:', error.message);
    }
  }

  /**
   * Applies filters
   */
  async applyFilters(activeFilters) {
    if (!this.collectionRenderer) {
      console.warn('CollectionRenderer not available for filters');
      return;
    }
    try {
      await this.collectionRenderer.applyFilters(activeFilters);
    } catch (error) {
      console.warn('applyFilters failed:', error.message);
    }
  }

  /**
   * Handles filter changes
   */
  async handleFilterChange(element) {
    if (!this.collectionRenderer) {
      console.warn('CollectionRenderer not available for filter change');
      return;
    }
    try {
      await this.collectionRenderer.handleFilterChange(element);
    } catch (error) {
      console.warn('handleFilterChange failed:', error.message);
    }
  }

  /**
   * Clears all filters
   */
  async clearAllFilters() {
    if (!this.collectionRenderer) {
      console.warn('CollectionRenderer not available for clear filters');
      return;
    }
    try {
      await this.collectionRenderer.clearAllFilters();
    } catch (error) {
      console.warn('clearAllFilters failed:', error.message);
    }
  }

  /**
   * Renders sidebar filters
   */
  renderSidebarFilters() {
    if (!this.collectionRenderer) {
      console.warn('CollectionRenderer not available for sidebar filters');
      return;
    }
    try {
      this.collectionRenderer.renderSidebarFilters();
    } catch (error) {
      console.warn('renderSidebarFilters failed:', error.message);
    }
  }

  /**
   * Sets up infinite scroll
   */
  setupInfiniteScroll() {
    if (!this.collectionRenderer) {
      console.warn('CollectionRenderer not available for infinite scroll');
      return;
    }
    try {
      this.collectionRenderer.setupInfiniteScroll();
    } catch (error) {
      console.warn('setupInfiniteScroll failed:', error.message);
    }
  }

  /**
   * Loads more products
   */
  async loadMoreProducts() {
    if (!this.collectionRenderer) {
      console.warn('CollectionRenderer not available for load more');
      return;
    }
    try {
      await this.collectionRenderer.loadMoreProducts();
    } catch (error) {
      console.warn('loadMoreProducts failed:', error.message);
    }
  }

  /**
   * Shows the cart
   */
  showCart() {
    if (!this.cartRenderer) {
      console.warn('CartRenderer not available');
      return;
    }
    try {
      this.cartRenderer.showCart();
    } catch (error) {
      console.warn('showCart failed:', error.message);
    }
  }

  /**
   * Closes the cart
   */
  closeCart() {
    if (!this.cartRenderer) {
      console.warn('CartRenderer not available');
      return;
    }
    try {
      this.cartRenderer.closeCart();
    } catch (error) {
      console.warn('closeCart failed:', error.message);
    }
  }

  /**
   * Shows the cart page
   */
  showCartPage() {
    if (!this.cartRenderer) {
      console.warn('CartRenderer not available');
      return;
    }
    try {
      this.cartRenderer.showCartPage();
    } catch (error) {
      console.warn('showCartPage failed:', error.message);
    }
  }

  /**
   * Closes the cart page
   */
  closeCartPage() {
    if (!this.cartRenderer) {
      console.warn('CartRenderer not available');
      return;
    }
    try {
      this.cartRenderer.closeCartPage();
    } catch (error) {
      console.warn('closeCartPage failed:', error.message);
    }
  }

  /**
   * Handles search input
   */
  handleSearch(event) {
    this.performSearch(event?.target?.value);
  }

  /**
   * Handles sort
   */
  handleSort(event) {
    if (!this.collectionRenderer) {
      console.warn('CollectionRenderer not available for sort');
      return;
    }
    try {
      this.collectionRenderer.handleSort(event);
    } catch (error) {
      console.warn('handleSort failed:', error.message);
    }
  }

  // ==========================================================
  // FORMATTING UTILITIES
  // ==========================================================

  /**
   * Formats a price
   */
  formatPrice(price) {
    if (price === undefined || price === null || isNaN(price)) {
      return '0.00';
    }
    return Number(price).toFixed(2);
  }

  /**
   * Formats a date
   */
  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // ==========================================================
  // INITIALIZATION
  // ==========================================================

  /**
   * Initializes the Cartique instance
   */
  async init() {
    try {
      // Inject CSS (must be first)
      this.theme.injectCSS();
      this.theme.applyTheme();

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

      // Update notification container
      this.notification.container = this.container;
      this.rendererContext.container = this.container;

      // 3. Component Loading
      await this.fetchAndExtractComponents();

      // 4. Injects main structural components into the DOM
      await this.renderAllComponents();

      // 5. Initial Product Render
      await this.renderProductDisplays();

      // 6. Interactivity & Completion
      this.setupEventListeners();
      await this.completeInitialization();

    } catch (error) {
      console.error('Failed to initialize Cartique:', error);
      this.notification.showErrorMessage('Failed to load product catalog');
    }
  }

  /**
   * Fetches and extracts component templates
   */
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

    // Pass templateHolder to renderers
    this.productRenderer.templateHolder = this.templateHolder;
    this.collectionRenderer.templateHolder = this.templateHolder;
    this.cartRenderer.templateHolder = this.templateHolder;
    
    // Update renderer context
    this.rendererContext.templateHolder = this.templateHolder;
  }

  /**
   * Renders all main components — calls renderers directly
   */
  async renderAllComponents() {
    try {
      await this.productRenderer.renderMainFrame();
    } catch (e) {
      console.warn('renderMainFrame failed:', e.message);
    }

    try {
      await this.productRenderer.renderSidebar();
    } catch (e) {
      console.warn('renderSidebar failed:', e.message);
    }

    try {
      await this.collectionRenderer.renderCatalogueMenu();
    } catch (e) {
      console.warn('renderCatalogueMenu failed:', e.message);
    }

    try {
      await this.productRenderer.renderControls();
    } catch (e) {
      console.warn('renderControls failed:', e.message);
    }

    try {
      await this.productRenderer.renderFooter();
    } catch (e) {
      console.warn('renderFooter failed:', e.message);
    }

    try {
      await this.cartRenderer.renderCartSlider();
    } catch (e) {
      console.warn('renderCartSlider failed:', e.message);
    }

    try {
      await this.cartRenderer.renderCartItemTemplate();
    } catch (e) {
      console.warn('renderCartItemTemplate failed:', e.message);
    }

    // Apply sidebar visibility
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

    // Render sidebar filters if enabled
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

  /**
   * Sets up event listeners
   */
  setupEventListeners() {
    const gridButton = document.querySelector('.cartique-grid-view');
    const listButton = document.querySelector('.cartique-list-view');

    if (gridButton) {
      this.addEventListener(gridButton, 'click', () => this.setLayout('grid'));
    }

    if (listButton) {
      this.addEventListener(listButton, 'click', () => this.setLayout('list'));
    }
  }

  /**
   * Completes initialization and restores state
   */
  async completeInitialization() {
    const container = document.getElementById(this.features.containerId);
    if (container) {
      container.style.visibility = 'visible';
      container.style.opacity = '1';
    }

    await this.restoreStateFromUrl();
  }

  /**
   * Cleans up the component on destruction
   */
  destroy() {
    cleanupEventListeners.call(this);

    // Clear toast timeouts
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