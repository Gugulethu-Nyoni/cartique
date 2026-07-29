# Cartique Class - Skeletal Structure

```javascript
export default class Cartique {
  constructor(products, features = {}, callbacks = {}) {
    // 1. Validation
    // 2. Default Configuration & Feature Merging
    // 3. Data State Management
    // 4. Component Lifecycle References
    // 5. Fire off the Engine
  }

  // ==========================================================
  // PUBLIC API - START PUBLIC API BLOCK
  // ==========================================================

  /**
   * Opens the cart page programmatically
   * @public
   */
  openCart() {}

  // ==========================================================
  // URL STATE RESTORATION
  // ==========================================================

  /**
   * Returns current browser URL state
   * @returns {Object} { pathname, hash, params }
   */
  getCurrentRoute() {}

  /**
   * Restores Cartique UI state from current URL
   * Called once after initialization
   */
  restoreStateFromUrl() {}

  /**
   * Restores cart state from URL
   * Checks for #cart hash or ?ui=cart query parameter
   */
  restoreCartState() {}

  // ==========================================================
  // PUBLIC SEARCH API
  // ==========================================================

  /**
   * Sets the current search query and executes the search
   * @param {string} query - The search/filter query
   */
  setSearchQuery(query = '') {}

  /**
   * Clears the current search query
   */
  clearSearchQuery() {}

  /**
   * Returns the current search query
   * @returns {string}
   */
  getSearchQuery() {}

  // ==========================================================
  // URL STATE RESTORATION — Registration Helper
  // ==========================================================

  /**
   * Registers a URL state restorer function
   * @param {Function} restorer - The restorer function
   */
  registerUrlStateRestorer(restorer) {}

  /**
   * Restores search state from URL
   * Checks for ?search=query parameter
   */
  restoreSearchState() {}

  /* END PUBLIC API BLOCK */

  // ==========================================================
  // FILTERS AND SHOP MENU CAT BASED PAGES SIMULATION
  // ==========================================================

  /**
   * Injects CSS styles into the document head
   */
  injectCSS() {}

  /**
   * Applies theme color and mode to the document
   */
  applyTheme() {}

  /**
   * Applies all active filters (category, search, attributes) to products
   * Updates filteredProducts and triggers re-render
   */
  applyAllFilters() {}

  /**
   * Attaches click events to menu items for category filtering
   * @param {HTMLElement} container - The menu container
   */
  _attachMenuEvents(container) {}

  /* END SHOP CATS/MENU FUNCTIONALITY ISSUES */

  // ==========================================================
  // CARTIQUE MENU IMPLEMENTATION
  // ==========================================================

  /**
   * Extracts unique categories from products with counts
   * @returns {Array} Array of category objects { id, name, count }
   */
  _extractCategories() {}

  /**
   * Formats price with 2 decimal places
   * @param {number|string} price - The price to format
   * @returns {string} Formatted price
   */
  formatPrice(price) {}

  /**
   * Renders the catalogue menu (mega, inline, or stacked)
   */
  renderCatalogueMenu() {}

  /**
   * Resolves the container for menu placement
   * @param {Object} menu - Menu configuration
   * @returns {HTMLElement} The resolved container
   */
  _resolveMenuContainer(menu) {}

  /**
   * Applies category and attribute filters to products
   * @deprecated Use applyAllFilters() instead
   */
  applyFilters() {}

  /**
   * Attaches click events to menu items
   * @param {HTMLElement} container - The menu container
   */
  _attachMenuEvents(container) {}

  /* END CARTIQUE MENU IMPLEMENTATION */

  // ==========================================================
  // START SECTION: SIDEBAR SEARCH FILTERS
  // ==========================================================

  /**
   * Renders the filter sidebar with dynamic filter groups
   * @param {Array} filterGroups - Array of filter group configurations
   */
  renderFilterSidebar(filterGroups) {}

  /**
   * Renders sidebar filter sections from features configuration
   */
  renderSidebarFilters() {}

  /**
   * Generates HTML for a filter section
   * @param {string} group - Filter group identifier
   * @param {Array} options - Filter options
   * @returns {string} HTML string
   */
  generateFilterHTML(group, options) {}

  /**
   * Handles filter checkbox change events
   * @param {HTMLElement} element - The changed checkbox
   */
  handleFilterChange(element) {}

  /**
   * Checks if a price matches a range label
   * @param {number} price - The price to check
   * @param {string} label - The range label (e.g., "R100-R200")
   * @returns {boolean}
   */
  _checkPriceMatch(price, label) {}

  /**
   * Applies active filters to products
   * @param {Object} activeFilters - The active filter state
   * @deprecated Use applyAllFilters() instead
   */
  applyFilters(activeFilters) {}

  /// MOBILE FILTERS 

  /**
   * Initializes mobile filter UI elements
   */
  initMobileFilters() {}

  /**
   * Toggles sidebar visibility on mobile
   * @param {boolean} open - Whether to open or close
   */
  toggleMobileSidebar(open) {}

  /**
   * Sets up filter event listeners for mobile
   */
  setupFilterEventListeners() {}

  /**
   * Clears all active filters
   */
  clearAllFilters() {}

  /**
   * Renders mobile-specific UI elements
   */
  renderMobileUI() {}

  /* ==========================================================
     END SECTION: SIDEBAR SEARCH FILTERS
     ========================================================== */

  // ==========================================================
  // START SECTION: HANDLE BULK PRICING 
  // ==========================================================

  /**
   * Checks if a variant has bulk pricing available
   * @param {Object} variant - The product variant
   * @returns {boolean}
   */
  hasBulkPricing(variant) {}

  /**
   * Gets bulk pricing display data for UI components
   * @param {Object} variant - The product variant
   * @param {number} quantity - Current quantity
   * @returns {Object} Bulk pricing display data
   */
  getBulkPricingDisplay(variant, quantity = 0) {}

  /**
   * Gets the selected variant from a product
   * @param {Object} product - The product
   * @returns {Object} The selected variant
   */
  getSelectedVariant(product) {}

  /**
   * Finds a variant by ID across all products
   * @param {string|number} variantId - The variant ID
   * @returns {Object|null} The found variant or null
   */
  findVariant(variantId) {}

  /**
   * Calculates unit price with bulk pricing consideration
   * @param {Object} variant - The product variant
   * @param {number} quantity - The quantity
   * @returns {Object} Pricing information
   */
  getUnitPrice(variant, quantity = 1) {}

  /* ==========================================================
     END SECTION: HANDLE BULK PRICING 
     ========================================================== */

  // ==========================================================
  // START SECTION: INFINITE SCROLL
  // ==========================================================

  /**
   * Sets up IntersectionObserver for infinite scroll
   */
  setupInfiniteScroll() {}

  /**
   * Loads the next batch of products
   */
  loadMoreProducts() {}

  /* ==========================================================
     END SECTION: INFINITE SCROLL
     ========================================================== */

  // ==========================================================
  // UTILITY METHODS
  // ==========================================================

  /**
   * Deep merges two objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   */
  deepMerge(target, source) {}

  /**
   * Checks if a value is an object (not array)
   * @param {*} item - The value to check
   * @returns {boolean}
   */
  isObject(item) {}

  /**
   * Debounces a function
   * @param {Function} func - The function to debounce
   * @param {number} wait - Wait time in ms
   * @param {boolean} immediate - Whether to call immediately
   * @returns {Function} Debounced function
   */
  debounce(func, wait, immediate = false) {}

  /**
   * Gets product stock count
   * @param {Object} product - The product
   * @returns {number} Stock count
   */
  getProductStock(product) {}

  // ==========================================================
  // INITIALIZATION
  // ==========================================================

  /**
   * Initializes the Cartique instance
   */
  async init() {}

  /**
   * Initializes product display containers
   */
  initializeContainers() {}

  /**
   * Applies minimal theme styling
   * @deprecated Use applyTheme() instead
   */
  applyMinimalTheme() {}

  /**
   * Completes initialization and restores state
   */
  completeInitialization() {}

  /**
   * Fetches and extracts component templates
   */
  async fetchAndExtractComponents() {}

  /**
   * Renders all main components
   */
  async renderAllComponents() {}

  // ==========================================================
  // RENDER METHODS
  // ==========================================================

  /**
   * Renders the main frame layout
   */
  async renderMainFrame() {}

  /**
   * Renders the sidebar
   */
  async renderSidebar() {}

  /**
   * Renders controls (search, sort, view toggles, cart icon)
   */
  async renderControls() {}

  /**
   * Sets up event listeners
   */
  setupEventListeners() {}

  /**
   * Adds event listener with cleanup tracking
   */
  addEventListener(element, event, handler) {}

  /**
   * Cleans up all tracked event listeners
   */
  cleanupEventListeners() {}

  /**
   * Renders product displays in the active layout
   */
  async renderProductDisplays() {}

  /**
   * Renders products into the specified layout container
   * @param {string} layout - 'grid' or 'list'
   * @param {Array} data - Optional specific data set
   */
  renderProducts(layout, data) {}

  /**
   * Creates a product card for grid layout
   * @param {Object} product - The product
   * @returns {HTMLElement} The product card element
   */
  createProductCard(product) {}

  /**
   * Creates a product listing for list layout
   * @param {Object} product - The product
   * @returns {HTMLElement} The product listing element
   */
  createProductListing(product) {}

  /**
   * Updates a product element with data
   * @param {HTMLElement} element - The product element
   * @param {Object} product - The product data
   */
  updateProductElement(element, product) {}

  /**
   * Sets the active layout (grid or list)
   * @param {string} layout - 'grid' or 'list'
   */
  setLayout(layout) {}

  /**
   * Renders the footer
   */
  async renderFooter() {}

  /**
   * Renders the cart slider
   */
  async renderCartSlider() {}

  /**
   * Renders the cart item template
   */
  async renderCartItemTemplate() {}

  // ==========================================================
  // VIEW CART BLOCK
  // ==========================================================

  /**
   * Shows the full cart page
   */
  showCartPage() {}

  /**
   * Renders the cart page
   */
  renderCartPage() {}

  /**
   * Attaches events to cart page elements
   * @param {HTMLElement} cartPage - The cart page element
   */
  attachCartPageEvents(cartPage) {}

  /**
   * Closes the cart page and returns to previous view
   */
  closeCartPage() {}

  /**
   * Decreases quantity on cart page
   * @param {number} productId - The product ID
   */
  decreasePageQty(productId) {}

  /**
   * Increases quantity on cart page
   * @param {number} productId - The product ID
   */
  increasePageQty(productId) {}

  /**
   * Removes item from cart page
   * @param {number} productId - The product ID
   */
  removePageItem(productId) {}

  // ==========================================================
  // INTERNAL UI HANDLER
  // ==========================================================

  /**
   * Handles search input events
   * @param {Event} event - The input event
   */
  handleSearch(event) {}

  /**
   * Handles sort dropdown changes
   * @param {Event} event - The change event
   */
  handleSort(event) {}

  /**
   * Adds a product to the cart
   * @param {Event} event - The click event
   */
  addToCart(event) {}

  /**
   * Shows the cart slider
   */
  showCart() {}

  /**
   * Closes the cart slider
   */
  closeCart() {}

  /**
   * Updates a cart item in the slider
   * @param {HTMLElement} cartItem - The cart item element
   * @param {Object} product - The product
   */
  updateCartItem(cartItem, product) {}

  /**
   * Adds event listeners to cart item
   * @param {HTMLElement} cartItem - The cart item element
   * @param {number} productId - The product ID
   */
  addCartItemEventListeners(cartItem, productId) {}

  /**
   * Removes item from cart slider
   * @param {Event} event - The click event
   */
  removeCartItem(event) {}

  /**
   * Decreases quantity in cart slider
   * @param {Event} event - The click event
   */
  decreaseQtyItem(event) {}

  /**
   * Increases quantity in cart slider
   * @param {Event} event - The click event
   */
  increaseQtyItem(event) {}

  /**
   * Closes cart slider
   */
  closeCart() {}

  /**
   * Handles checkout action
   */
  checkout() {}

  /**
   * Shows checkout alert toast
   */
  showCheckoutAlert() {}

  /**
   * Shows stock alert toast
   * @param {string} message - The alert message
   */
  showStockAlert(message) {}

  /**
   * Clears toast timers
   */
  clearToastTimeouts() {}

  // ==========================================================
  // SINGLE PRODUCT VIEW
  // ==========================================================

  /**
   * Shows single product view
   * @param {number} productId - The product ID
   */
  showSingleProductView(productId) {}

  /**
   * Renders single product view
   * @param {Object} product - The product
   */
  renderSingleProduct(product) {}

  /**
   * Renders product details tab
   * @param {Object} product - The product
   * @returns {string} HTML string
   */
  renderProductDetails(product) {}

  /**
   * Renders product reviews tab
   * @param {Object} product - The product
   * @returns {string} HTML string
   */
  renderProductReviews(product) {}

  /**
   * Renders star rating HTML
   * @param {number} rating - The rating value
   * @returns {string} HTML string
   */
  renderStars(rating) {}

  /**
   * Formats a date string
   * @param {string} dateString - The date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {}

  /**
   * Submits a product review
   * @param {HTMLElement} form - The review form
   * @param {Object} product - The product
   */
  async submitReview(form, product) {}

  /**
   * Submits a review without callbacks
   * @param {Object} payload - The review data
   * @param {Object} product - The product
   */
  submitReviewVanilla(payload, product) {}

  /**
   * Returns to the product list view
   */
  returnToListView() {}

  /**
   * Shows an error message
   * @param {string} message - The error message
   */
  showErrorMessage(message) {}

  /**
   * Cleans up the component on destruction
   */
  destroy() {}
}
```

---

## Notes on Method Flow and Structure

### Initialization Flow:
1. `constructor()` → calls `init()`
2. `init()` → calls:
   - `injectCSS()`
   - `applyTheme()`
   - `fetchAndExtractComponents()`
   - `renderAllComponents()` → calls multiple render methods
   - `initializeContainers()`
   - `renderSidebarFilters()`
   - `renderProductDisplays()`
   - `setupEventListeners()`
   - `completeInitialization()` → calls `restoreStateFromUrl()`

### Filtering Flow:
1. User interacts with UI (search, category, sidebar filters)
2. `handleSearch()`, `_attachMenuEvents()`, or `handleFilterChange()` called
3. `applyAllFilters()` called → filters products using:
   - Category filter (from menu or sidebar)
   - Search query
   - Attribute filters (from sidebar)
4. `renderProductDisplays()` called → updates UI

### Cart Flow:
1. `addToCart()` → adds item to localStorage
2. `showCart()` → opens slider
3. Quantity changes → `increaseQtyItem()` / `decreaseQtyItem()`
4. `checkout()` → shows toast, redirects
5. `showCartPage()` → full cart view
6. `openCart()` → public API for cart page

### Single Product View Flow:
1. User clicks product image
2. `showSingleProductView()` called
3. State saved in `previousViewState`
4. `renderSingleProduct()` called
5. User can return with `returnToListView()`

### Bulk Pricing Flow:
1. `hasBulkPricing()` checks variant
2. `getBulkPricingDisplay()` generates display data
3. Applied in:
   - Product cards (`createProductCard()`)
   - Product listings (`createProductListing()`)
   - Cart items (`updateCartItem()`)
   - Single product view (`renderSingleProduct()`)
4. `getUnitPrice()` calculates pricing with bulk consideration

### Infinite Scroll Flow:
1. `renderProducts()` renders initial batch
2. `setupInfiniteScroll()` creates sentinel
3. Observer triggers `loadMoreProducts()`
4. Products loaded in batches until all displayed