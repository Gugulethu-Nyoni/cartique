# Cartique Theme Development Guide

## 1. Purpose

A Cartique theme is a storefront presentation layer built on top of the Cartique commerce platform.

Cartique owns the underlying commerce data, state, and capabilities. A theme controls how that information is presented to customers.

The goal of the theme system is to make standard theme development feel like ordinary web development while retaining a robust, extensible JavaScript API for advanced developers.

The guiding principle is:

> **Cartique owns the data and commerce capabilities. The theme owns the customer-facing presentation.**



# 2. Theme Development Model

Cartique supports two levels of theme development.

```text
CARTIQUE THEME DEVELOPMENT
│
├── Level 1 — Standard Theme Authoring
│   ├── HTML
│   ├── CSS
│   └── Optional JavaScript
│
└── Level 2 — Advanced Authoring
    └── Direct JavaScript / Cartique APIs
```

### Level 1 — Standard Theme Authoring

This is the recommended approach for most theme developers.

Components are written as:

```text
ProductCard/
├── ProductCard.html
├── ProductCard.css
└── ProductCard.js
```

HTML provides structure.

CSS provides presentation.

JavaScript provides optional behaviour.

### Level 2 — Advanced Authoring

Advanced developers may work directly with Cartique's JavaScript component and renderer APIs.

This provides lower-level control over:

* rendering
* lifecycle
* state
* DOM
* event handling
* custom component behaviour

The advanced API does not create a different data model. It uses the same Cartique context and commerce contracts as standard theme components.



# 3. Existing Theme Architecture

The current theme infrastructure is:

```text
storefront/src/theme/
├── ComponentRegistry.js
├── DefaultTheme.js
├── ThemeConfig.js
├── ThemeLoader.js
├── ThemeManager.js
├── ThemeRegistry.js
├── catalog/
│   ├── default/
│   │   ├── theme.config.js
│   │   └── theme.css
│   └── fashion/
│       ├── components/
│       │   ├── ProductCard.js
│       │   └── index.js
│       ├── theme.config.js
│       └── theme.css
└── index.js
```

This architecture should be extended rather than replaced.

The shared infrastructure manages:

```text
ThemeRegistry
ThemeManager
ThemeLoader
ThemeConfig
ComponentRegistry
```

Individual theme directories contain theme-specific presentation and configuration.



# 4. Theme Directory Structure

A theme can be extended with component directories as required.

A future complete theme may look like:

```text
storefront/src/theme/catalog/default/
├── components/
│   ├── Header/
│   │   ├── Header.html
│   │   ├── Header.css
│   │   └── Header.js
│   ├── Hero/
│   │   ├── Hero.html
│   │   ├── Hero.css
│   │   └── Hero.js
│   ├── ProductCard/
│   │   ├── ProductCard.html
│   │   ├── ProductCard.css
│   │   └── ProductCard.js
│   ├── PageFooter/
│   │   ├── PageFooter.html
│   │   ├── PageFooter.css
│   │   └── PageFooter.js
│   └── index.js
├── theme.config.js
└── theme.css
```

# !!!SingleProduct UI, Wishlist, On Page cart - Cart drawer components missing 

A component directory should only be created when a theme requires a theme-specific implementation.

Shared engines and platform capabilities should remain in their existing shared locations.



# 5. Shared Cartique Foundation vs Theme Layer

Not everything visible in the storefront is a theme component.

Cartique contains shared capabilities such as:

```text
storefront/src/renderers/
├── ProductRenderer
├── gallery/
│   ├── GalleryEngine
│   ├── GalleryFactory
│   └── modes/
└── other shared renderers
```

These provide functionality that themes can consume.

The theme layer provides the visual expression of those capabilities.

For example:

```text
Product Gallery
    │
    ├── Shared capability
    │   ├── GalleryEngine
    │   └── GalleryFactory
    │
    └── Theme choice
        ├── classic
        ├── horizontal
        └── editorial
```

A theme developer should reuse shared capabilities wherever possible instead of rebuilding them.



# 6. Cartique Data Is the Single Source of Truth

Cartique owns the canonical storefront data.

Themes consume that data.

Themes must not create competing product, pricing, inventory, review, customer, or cart models.

The runtime may ultimately hydrate this data from databases, APIs, or adapters. Theme code should not need to know where the data originated.

The development demo mirrors this production model using:

```text
app.js
+
products.js
```

The intention is:

```text
Development
app.js + products.js
       ↓
Storefront context
       ↓
Theme

Production
Database / API
       ↓
Cartique adapter
       ↓
Same storefront context
       ↓
Same theme
```

A theme should therefore continue working when demo data is replaced by live data.



# 7. Storefront Data Contract

The storefront context is composed from multiple sources.

Conceptually:

```text
Storefront Context
│
├── Merchant / Brand
├── Catalogue
├── Customer / User
├── Commerce State
├── Navigation
├── Theme / Configuration
└── Marketing / Content
```

The exact runtime object supplied to a component depends on the component contract, but the underlying data model remains consistent.



# 8. Merchant and Brand Data

Storefront-level components such as headers, heroes, and page footers need merchant information.

The storefront data contract should support information such as:

```text
storefront.brand.name
storefront.brand.tagline
storefront.brand.logo
storefront.brand.favicon

storefront.contact.email
storefront.contact.phone
storefront.contact.whatsapp

storefront.address.street
storefront.address.city
storefront.address.province
storefront.address.country
storefront.address.postalCode

storefront.social.instagram
storefront.social.facebook
storefront.social.tiktok
storefront.social.youtube

storefront.policies.privacyUrl
storefront.policies.termsUrl
storefront.policies.returnsUrl
storefront.policies.shippingUrl
```

This information may originate from merchant configuration in development and from persistent merchant/business configuration in production.



# 9. Product Data Contract

A product-facing component receives a canonical `product` context.

Typical product fields are:

```text
product.id
product.sku
product.slug
product.title
product.short_description
product.description
product.status

product.image
product.product_images

product.attributes
product.metadata
product.currency

product.variants
product.categories
product.media
product.reviews
```

### Example

```javascript
product.title
product.image
product.slug
product.description
product.product_images
```



# 10. Product Card Example

A developer creating:

```text
ProductCard/
├── ProductCard.html
├── ProductCard.css
└── ProductCard.js
```

can work directly with the product context.

### ProductCard.html

```html
<article class="product-card">
    <img src="{ product.image }" alt="{ product.title }">

    <h3>{ product.title }</h3>

    <p>{ product.short_description }</p>

    <span>
        { product.variants[0].price }
    </span>
</article>
```

The braces represent Cartique template interpolation.

The developer does not need to construct the HTML through JavaScript.



# 11. Template Interpolation

The standard theme authoring model uses simple single-brace interpolation:

```html
{ product.title }
{ product.image }
{ product.variants[0].price }
{ storefront.brand.name }
```

The initial authoring model should remain intentionally simple.

Supported conceptually:

```text
{ object.property }
{ object.property.childProperty }
{ object.array[0].property }
```

The goal is to provide data access without creating a second programming language.

The initial template model should not attempt to become a complete templating framework.

Avoid embedding arbitrary JavaScript expressions in templates.

For example, a theme should not rely on expressions such as:

```html
{ product.title.toUpperCase() }
```

or:

```html
{ product.variants.filter(...) }
```

Complex logic belongs in JavaScript.



# 12. Variant Data

Variants are available through:

```javascript
product.variants
```

A selected/default variant may be represented by the renderer/component context where applicable.

Direct access examples:

```javascript
product.variants[0].id
product.variants[0].sku
product.variants[0].price
product.variants[0].compareAtPrice
product.variants[0].bulkPrice
product.variants[0].bulkMinimumQty
product.variants[0].inventory
product.variants[0].variant_image
product.variants[0].attributes
```

Variant attributes:

```javascript
product.variants[0].attributes[0].key
product.variants[0].attributes[0].value
product.variants[0].attributes[0].dataType
```

A clothing theme can therefore use:

```html
<span>{ product.variants[0].price }</span>
```

without creating its own variant representation.



# 13. Product Attributes and Metadata

Flexible product attributes are available through:

```javascript
product.attributes
```

Examples:

```javascript
product.attributes.origin
product.attributes.color
product.attributes.material
product.attributes.organic
```

Product metadata is available through:

```javascript
product.metadata
```

Examples:

```javascript
product.metadata.brand
product.metadata.unit
product.metadata.precision
```

These structures are intentionally flexible because different commerce categories use different product attributes.

Themes should inspect available attributes rather than assume a universal schema.



# 14. Categories

Products may provide:

```javascript
product.categories
```

Category data may include:

```javascript
product.categories[0].id
product.categories[0].name
product.categories[0].slug
product.categories[0].description
product.categories[0].parent_id
product.categories[0].sortOrder
```

Catalogue and navigation components may consume category collections supplied by the storefront.



# 15. Reviews

Product reviews are accessible through:

```javascript
product.reviews
```

A review may provide:

```javascript
product.reviews[0].id
product.reviews[0].rating
product.reviews[0].comment
product.reviews[0].status
product.reviews[0].createdAt
product.reviews[0].customer
```

Nested customer information may be optional.

A theme must not assume that every review contains complete customer information.



# 16. Product Gallery Data

The canonical gallery source is:

```javascript
product.image
product.product_images
```

The behaviour is:

```text
0–1 valid images
    → single-image presentation

2+ valid images
    → gallery activated
```

The active theme controls the presentation mode.

Current modes:

```text
classic
horizontal
editorial
```

The gallery engine remains shared.

Theme configuration determines the selected mode.

Example:

```javascript
components: {
    productGallery: 'horizontal'
}
```



# 17. Pricing and Commerce Truth

Themes may display commercial values supplied by Cartique:

```javascript
product.variants[0].price
product.variants[0].bulkPrice
product.variants[0].compareAtPrice
```

Themes must not become the source of truth for pricing.

A theme should not independently reimplement:

* pricing rules
* discount rules
* bulk-pricing rules
* inventory decisions
* commercial eligibility
* checkout calculations

Themes present the commercial truth supplied by Cartique.



# 18. Component Inventory

The Default Theme baseline covers the following user-facing areas.

## Global Storefront

```text
Announcement Bar
Utility / Contact Bar
Header
Main Navigation
Search
Account Controls
Cart Controls
Hero
```

## Catalogue

```text
Category Menu
Search
Sorting
Filters / Sidebar
Product Grid
Product List
Product Card
```

## Product Page

```text
Product Gallery
Product Information
Pricing
Bulk Pricing
Variants
Inventory
Wishlist
Add to Cart
Product Details
Reviews
```

## Commerce

```text
Cart Drawer
Shopping Cart
Cart Items
Checkout Entry
Toast / Notifications
```

## Page Footer

```text
Footer Navigation
Newsletter Subscription
Contact / Business Information
Social Links
Payment / Trust
Legal Links
Copyright
Custom Content
```



# 19. Component Context

Every theme component should have a documented context contract.

For example:

| Component      | Primary context                     |
| -- | -- |
| ProductCard    | `product`                           |
| ProductGallery | `product`                           |
| Product Detail | `product`                           |
| Reviews        | `product.reviews`                   |
| Product Grid   | product collection                  |
| Category Menu  | category collection                 |
| Header         | storefront / navigation data        |
| Hero           | storefront / marketing content      |
| Page Footer    | storefront / merchant configuration |
| Cart Item      | cart item context                   |
| Cart Drawer    | cart state                          |

The component documentation should define the exact dot-notation context available to the component.

A developer should never have to guess whether a value is available as:

```text
product
item
data
context
catalogue
state
```



# 20. HTML, CSS and JavaScript Responsibilities

## HTML

HTML defines:

* structure
* semantic markup
* content bindings
* accessibility attributes
* component hooks

Example:

```html
<article class="product-card">
    <img src="{ product.image }" alt="{ product.title }">
    <h3>{ product.title }</h3>
</article>
```

## CSS

CSS defines:

* layout
* typography
* colour
* spacing
* responsiveness
* interaction presentation

Example:

```css
.product-card {
    display: grid;
    gap: 1rem;
}

.product-card img {
    width: 100%;
    object-fit: contain;
}
```

## JavaScript

JavaScript is optional and provides:

* component behaviour
* event handling
* custom interaction
* derived presentation state
* advanced DOM behaviour

Simple components may not require a JavaScript file at all.



# 21. Standard Component Structure

The preferred theme authoring structure is:

```text
ComponentName/
├── ComponentName.html
├── ComponentName.css
└── ComponentName.js
```

For a static component:

```text
Hero/
├── Hero.html
└── Hero.css
```

For an interactive component:

```text
ProductCard/
├── ProductCard.html
├── ProductCard.css
└── ProductCard.js
```



# 22. JavaScript as an Optional Layer

The standard authoring model should not require JavaScript for simple presentation.

For example:

```text
BrandLogo/
├── BrandLogo.html
└── BrandLogo.css
```

can remain entirely declarative.

A ProductCard may require:

```text
ProductCard/
├── ProductCard.html
├── ProductCard.css
└── ProductCard.js
```

for actions such as add-to-cart or variant selection.

Cartique should own the component lifecycle and context delivery.



# 23. Advanced JavaScript Authoring

Advanced developers are not restricted to the HTML/CSS/JS abstraction.

The lower-level Cartique component APIs remain available for custom implementations.

This allows advanced developers to implement components directly in JavaScript when necessary.

Conceptually:

```javascript
export default class CustomComponent {
    render(context) {
        // full control
    }

    mount(element) {
        // custom behavior
    }

    destroy() {
        // cleanup
    }
}
```

The advanced model should be used when the standard authoring layer genuinely becomes a limitation.

It should not be required for ordinary theme development.



# 24. Progressive Complexity

Cartique themes should support a natural progression:

```text
Designer / beginner
    ↓
HTML + CSS

Front-end developer
    ↓
HTML + CSS + optional JS

Advanced Cartique developer
    ↓
Direct JavaScript / runtime APIs
```

This is intentional.

The standard theme authoring model should remain approachable without removing the power available to experienced developers.



# 25. Theme Configuration

Each theme defines:

```text
theme.config.js
```

Example:

```javascript
export default {
    name: 'Default',
    version: '1.0.0',
    extends: null,

    variables: {
        primary: '#655793',
        accent: '#655793',
        background: '#ffffff',
        text: '#111111',
        radius: '8px'
    },

    components: {
        productCard: 'default',
        productGrid: 'default',
        cartDrawer: 'default',
        productGallery: 'horizontal'
    }
};
```

Theme configuration determines how the theme selects or configures presentation components.



# 26. Theme vs Appearance Mode

Cartique currently contains both:

* storefront theme selection
* light/dark appearance behaviour

These should be treated as separate concepts.

A storefront theme refers to:

```text
default
fashion
```

while appearance refers to:

```text
light
dark
```

Theme development should not confuse these concepts.



# 27. Header Baseline

A complete Default Theme header may contain:

```text
Announcement Bar
Utility / Contact Bar
Brand / Logo
Main Navigation
Search
Account
Cart
```

Header modules should be independently configurable where the architecture supports it.

Typical merchant data includes:

```text
storefront.brand.logo
storefront.brand.name

storefront.contact.email
storefront.contact.phone

storefront.navigation
```



# 28. Hero Baseline

The Hero component is a theme presentation component.

It may consume configurable storefront content such as:

```text
storefront.hero.image
storefront.hero.heading
storefront.hero.description
storefront.hero.cta.label
storefront.hero.cta.href
```

A hero does not need to be database-backed.

Merchant-provided configuration and static content are valid sources.



# 29. Page Footer Baseline

The existing Cartique `footer` feature should not automatically be assumed to represent a complete storefront page footer.

The Default Theme Page Footer is a separate conceptual component.

Baseline modules:

```text
PageFooter
├── Brand / About
├── Footer Navigation
├── Newsletter Subscription
├── Contact Information
├── Social Links
├── Payment / Trust
├── Legal
├── Copyright
└── Custom Content
```

The footer should support both dynamic and configured content.



# 30. Newsletter Subscription

The Default Theme should provide a conventional ecommerce newsletter capability.

Typical presentation:

```text
Stay in the loop
Get new products, offers and announcements.

[ Email Address                 ] [ Subscribe ]
```

The capability should eventually support subscription types such as:

```text
newsletter
specials
promotions
new products
merchant-defined subscriptions
```

Subscription persistence remains a Cartique/platform responsibility.

The theme consumes the subscription capability.



# 31. Custom Content

Not all storefront content needs to come from a database.

A component may consume:

```text
Database / API data
+
Theme configuration
+
Merchant static content
+
Catalogue data
+
Custom content
```

For example:

```text
Hero image
Footer contact details
Announcement text
Business address
Social links
Marketing copy
```

may all be configuration-backed.

This flexibility allows merchants and theme developers to build complete storefronts without requiring every piece of content to become a database entity.



# 32. Theme Component Registration

Theme-specific components must follow the existing theme registration mechanism.

The current architecture uses:

```text
ComponentRegistry
ThemeRegistry
ThemeManager
```

A new component should be registered using the existing mechanism rather than introducing an independent registry.

The registration contract should remain consistent across themes.



# 33. Default Theme as the Baseline

The Default Theme is the canonical benchmark for:

* storefront completeness
* component coverage
* data mapping
* ecommerce usability
* responsive behaviour
* configuration patterns
* fallback behaviour
* accessibility expectations

The Fashion Theme may look completely different.

It should nevertheless understand and satisfy the same underlying Cartique capability and data contracts.



# 34. Developing a New Theme

A theme developer should follow this process:

```text
1. Identify the component to change
        ↓
2. Read its context/data contract
        ↓
3. Determine whether a shared Cartique capability already exists
        ↓
4. Create a theme-specific component only when needed
        ↓
5. Implement HTML
        ↓
6. Implement CSS
        ↓
7. Add JavaScript only when behaviour requires it
        ↓
8. Register the component
        ↓
9. Configure it in theme.config.js
        ↓
10. Test against real Cartique product/storefront data
```



# 35. Component Development Checklist

Before considering a theme component complete:

```text
[ ] Source of truth identified
[ ] Component context documented
[ ] Dot-notation data documented
[ ] Required data identified
[ ] Optional data identified
[ ] Shared Cartique capability checked
[ ] HTML separated from CSS
[ ] JavaScript used only where necessary
[ ] Enable/disable behaviour defined where appropriate
[ ] Empty/fallback state defined
[ ] Responsive behaviour implemented
[ ] Accessibility considered
[ ] Custom/static content supported where appropriate
[ ] No competing commerce/product data model created
[ ] Existing registration mechanism used
[ ] No unrelated core code modified
```



# 36. Core Theme Rule

The Cartique theme system can be summarized as:

```text
                    CARTIQUE PLATFORM
                          │
             ┌────────────┴────────────┐
             │                         │
         DATA / STATE             CAPABILITIES
             │                         │
             └────────────┬────────────┘
                          │
                   COMPONENT CONTRACT
                          │
               ┌──────────┴──────────┐
               ▼                     ▼
        STANDARD AUTHORING      ADVANCED JS
        HTML + CSS + JS         Runtime APIs
               │                     │
               └──────────┬──────────┘
                          ▼
                    CARTIQUE THEME
```

### The fundamental rule

> **Cartique owns the data, commerce logic, shared capabilities, and component lifecycle. Theme developers own the presentation and optional component behaviour.**

A well-built Cartique theme should therefore be:

**simple enough to author with standard web technologies, structured enough to remain maintainable, and powerful enough for advanced developers to work directly with the Cartique runtime when necessary.**
