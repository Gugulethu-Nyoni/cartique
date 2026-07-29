Yes. This is exactly the right next document to create.

Before touching code, we should define the **new `@semantq/storefront` class contract**.

The important architectural shift:

Old:

```
Cartique.js

Products
   ↓
Filtering
   ↓
Pricing
   ↓
Variants
   ↓
Cart
   ↓
Rendering
```

New:

```
@semantq/cartique (Kernel)

Persistence
    ↓
Commerce Model
    ↓
Resolvers
    ↓
CommercialDecision
    ↓
CatalogResult


              ↓


@semantq/storefront

Theme
    ↓
Templates
    ↓
Components
    ↓
UI State
    ↓
Browser
```

The Storefront does **not know what a product price is**.

It knows how to represent:

```
CommercialDecision
CatalogResult
CartState
CustomerState
Theme
```

---

# @semantq/storefront

## Storefront Class - Skeletal Structure

```javascript
export default class Storefront {

  constructor(kernel, options = {}) {

    // 1. Validate kernel connection

    // 2. Load configuration

    // 3. Initialize UI state

    // 4. Initialize theme system

    // 5. Initialize component registry

    // 6. Start storefront lifecycle

  }


  // ==========================================================
  // PUBLIC API
  // ==========================================================


  /**
   * Mount storefront into DOM
   */
  mount(selector) {}


  /**
   * Destroy storefront instance
   */
  destroy() {}



  /**
   * Change active theme
   */
  setTheme(theme) {}



  /**
   * Open cart drawer
   */
  openCart() {}



  /**
   * Close cart drawer
   */
  closeCart() {}



  /**
   * Navigate to product
   */
  openProduct(id) {}



  /**
   * Change catalogue layout
   */
  setLayout(layout) {}



  /**
   * Refresh storefront from kernel state
   */
  refresh() {}



  // ==========================================================
  // KERNEL CONNECTION
  // ==========================================================


  /**
   * Connect commerce kernel
   */
  connectKernel(kernel) {}



  /**
   * Request catalog data
   */
  async loadCatalog(query = {}) {}



  /**
   * Request commercial decision
   */
  async resolveDecision(input) {}



  /**
   * Subscribe to kernel updates
   */
  subscribeKernelEvents() {}



  /**
   * Handle kernel decision updates
   */
  handleDecisionUpdate(decision) {}



  // ==========================================================
  // THEME SYSTEM
  // ==========================================================


  /**
   * Load storefront theme
   *
   * Example:
   *
   * fashion
   * electronics
   * marketplace
   */
  async loadTheme(theme) {}



  /**
   * Load theme assets
   */
  async loadThemeAssets() {}



  /**
   * Load theme templates
   */
  async loadThemeTemplates() {}



  /**
   * Apply theme configuration
   */
  applyTheme() {}



  // ==========================================================
  // TEMPLATE REGISTRY
  // ==========================================================


  /**
   * Register template
   */
  registerTemplate(name, template) {}



  /**
   * Retrieve template
   */
  getTemplate(name) {}



  /**
   * Render template
   */
  renderTemplate(name, data) {}



  // ==========================================================
  // COMPONENT SYSTEM
  // ==========================================================


  /**
   * Register UI component
   */
  registerComponent(name, component) {}



  /**
   * Mount component
   */
  mountComponent(name, container) {}



  /**
   * Update component
   */
  updateComponent(name, data) {}



  /**
   * Remove component
   */
  destroyComponent(name) {}



  // ==========================================================
  // UI STATE MANAGEMENT
  // ==========================================================


  /**
   * Storefront state only
   *
   * NOT commerce state
   */
  state = {


    layout: "grid",

    theme: null,

    cartOpen:false,

    activeProduct:null,

    search:"",

    filters:{}

  }



  /**
   * Update UI state
   */
  setState(change) {}



  /**
   * Get UI state
   */
  getState() {}



  // ==========================================================
  // CATALOGUE REPRESENTATION
  // ==========================================================


  /**
   * Render catalogue
   */
  renderCatalog(catalog) {}



  /**
   * Render product grid
   */
  renderProductGrid(products) {}



  /**
   * Render product list
   */
  renderProductList(products) {}



  /**
   * Render product card
   */
  renderProductCard(item) {}



  /**
   * Render product listing
   */
  renderProductListing(item) {}



  // ==========================================================
  // COMMERCIAL DECISION REPRESENTATION
  // ==========================================================


  /**
   * Render resolved commerce decision
   */
  renderDecision(decision) {}



  /**
   * Render price display
   */
  renderMoney(money) {}



  /**
   * Render adjustments
   *
   * discounts
   * promotions
   * taxes
   */
  renderAdjustments(adjustments) {}



  /**
   * Render availability
   */
  renderAvailability(inventory) {}



  /**
   * Render shipping information
   */
  renderShipping(shipping) {}



  // ==========================================================
  // CART REPRESENTATION
  // ==========================================================


  /**
   * Render cart
   */
  renderCart(cartState) {}



  /**
   * Render cart item
   */
  renderCartItem(item) {}



  /**
   * Update cart display
   */
  updateCart(cartState) {}



  // ==========================================================
  // PRODUCT DETAIL VIEW
  // ==========================================================


  /**
   * Render product page
   */
  renderProductPage(product) {}



  /**
   * Render product information
   */
  renderProductDetails(product) {}



  /**
   * Render reviews
   */
  renderReviews(reviews) {}



  // ==========================================================
  // EVENTS
  // ==========================================================


  /**
   * Attach DOM events
   */
  bindEvents() {}



  /**
   * Handle UI event
   */
  handleEvent(event) {}



  /**
   * Emit storefront event
   */
  emit(event, payload) {}



  /**
   * Listen for storefront event
   */
  on(event, callback) {}



  // ==========================================================
  // UTILITIES
  // ==========================================================


  debounce() {}

  sanitizeHTML() {}

  formatDate() {}

}
```

---

# Methods Removed From Old Cartique

These disappear completely.

## Commerce

Remove:

```
hasBulkPricing()

getBulkPricingDisplay()

getUnitPrice()

getSelectedVariant()

findVariant()

getProductStock()
```

Owned by:

```
@semantq/cartique
```

---

## Product Querying

Remove:

```
_extractCategories()

applyFilters()

applyAllFilters()

_checkPriceMatch()
```

Owned by:

```
Query Layer
```

---

## Product Data Handling

Remove:

```
products array
filteredProducts
```

Storefront receives:

```
CatalogResult
```

---

## Database Awareness

Remove:

```
fetch products
API calls
repositories
```

Storefront never talks to:

```
Prisma
REST
SQL
ERP
```

---

## Price Logic

Remove:

```
formatPrice()
```

Replace with:

```
renderMoney()
```

Because money is already resolved.

---

# What Happens To Current Files?

## products.js

Moves here:

```
@semantq/cartique

tests/
fixtures/
```

Example:

```
cartique/
 ├── fixtures/
 │     └── herbs.js
```

It becomes test data.

Not storefront data.

---

## Current app.js

Becomes:

```
storefront-demo.js
```

Its job:

```javascript
import Cartique from "@semantq/cartique";
import Storefront from "@semantq/storefront";


const kernel = new Cartique(repository);


const storefront = new Storefront(kernel,{
    theme:"default"
});


storefront.mount("#cartique");
```

That is the complete integration.

---

# Migration Strategy

I would **not rewrite the UI immediately**.

Phase 2:

1. Create new Storefront class
2. Connect kernel
3. Move existing rendering methods
4. Replace product objects with CatalogResult
5. Replace pricing display with CommercialDecision
6. Introduce theme loader

Then:

Phase 3:

Move current HTML templates into:

```
themes/default/
```

Example:

```
themes/

default/

   product-card.html
   product-list.html
   cart.html
   sidebar.html
   footer.html
   css/


fashion/

   product-card.html
   cart.html


electronics/

   product-card.html
```

---

This gives us the clean split:

```
@semantq/cartique

"The brain"


@semantq/storefront

"The face"
```

and importantly, the existing Cartique storefront does not get thrown away — it becomes the first official **default theme implementation**.
