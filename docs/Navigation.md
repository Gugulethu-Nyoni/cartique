# Cartique Navigation & SEO Routing Capabilities

## Overview

Cartique Storefront implements SEO-friendly, semantic URL routing designed for modern eCommerce experiences.

The routing layer provides clean, human-readable URLs for products, categories, search queries, and customer interactions while maintaining deep-link refresh support and graceful fallback handling.

The objective is to ensure that every important commercial entity — products, categories, and collections — has a predictable URL structure suitable for both customers and search engines.



# Supported Routing Capabilities

## 1. Shop Base Route

The storefront base route acts as the primary catalogue entry point.

Example:

```
https://example.com/shop/
```

Behaviour:

* Loads the product catalogue
* Initializes storefront state
* Applies default catalogue rendering
* Supports all downstream navigation paths



# 2. Product SEO Routes

Products are accessible through human-readable slugs instead of database IDs.

Format:

```
/shop/product/{product-slug}
```

Examples:

```
https://example.com/shop/product/womens-linen-summer-dress

https://example.com/shop/product/mens-premium-cotton-hoodie

https://example.com/shop/product/leather-crossbody-handbag
```

Capabilities:

* Product slug resolution
* Direct product loading
* Deep-link refresh support
* Graceful missing product handling

Invalid product example:

```
https://example.com/shop/product/non-existent-product
```

Expected behaviour:

* Display "Product not found"
* Provide regression path back to the shop catalogue



# 3. Category SEO Routes

Categories use semantic URLs based on category names.

Format:

```
/shop/category/{category-slug}
```

Examples:

```
https://example.com/shop/category/womens-dresses

https://example.com/shop/category/mens-fashion

https://example.com/shop/category/accessories

https://example.com/shop/category/summer-collection
```

Capabilities:

* Category slug resolution
* Product filtering by category
* Category-specific catalogue rendering
* Deep-link support

Invalid category example:

```
https://example.com/shop/category/not-a-real-category
```

Expected behaviour:

* Display "Category not found"
* Provide return path to `/shop/`



# 4. Search SEO Routes

Search queries are represented as URL paths rather than temporary UI state.

Format:

```
/shop/search/{search-term}
```

Examples:

```
https://example.com/shop/search/linen-dress

https://example.com/shop/search/black-jeans

https://example.com/shop/search/sneakers
```

Capabilities:

* Search state restoration from URL
* Search indexing compatibility
* Product filtering
* Shareable search results

Invalid search example:

```
https://example.com/shop/search/non-existent-item
```

Expected behaviour:

* Display no-results state
* Provide regression path back to `/shop/`



# 5. Cart URL State

Cart state supports hash-based navigation.

Example:

```
https://example.com/shop/#cart
```

Capabilities:

* Opens cart drawer directly
* Maintains storefront context
* Supports shareable cart interactions



# 6. Query Parameter Support

Cartique also supports query-based storefront filtering.

Example:

```
https://example.com/shop/?search=linen
```

Capabilities:

* Search restoration
* Campaign landing page support
* Marketing URL compatibility

Example use cases:

```
Facebook Ads → /shop/?search=summer-dresses

Email Campaign → /shop/?search=leather-handbags

Google Shopping Campaign → /shop/?category=sneakers
```



# SEO-Friendly URL Design Principles

Cartique URLs follow modern eCommerce SEO principles:

### Human readable

Preferred:

```
/shop/product/womens-black-leather-jacket
```

Avoid:

```
/shop/product?id=48291
```



### Keyword meaningful

URLs contain commercial intent:

```
/shop/category/womens-activewear
```

rather than:

```
/shop/category/cat12
```



### Search-engine friendly

The routing system supports:

* Crawlable URLs
* Shareable links
* Browser refresh persistence
* Structured product/category discovery



# Future SEO Automation Integration (Semantq Sitemap Generator)

Cartique routing has been designed to integrate with the Semantq framework sitemap generation capabilities.

The planned workflow is:

1. Query the commerce database for:

   * Products
   * Categories
   * Collections
   * Other indexable commercial entities

2. Generate SEO-friendly URLs automatically.

Example generated routes:

```
/shop/product/womens-summer-dress

/shop/product/mens-running-shoes

/shop/category/womens-fashion

/shop/category/sale-items
```

3. Add generated URLs into the sitemap for search engine indexing.

This will allow the storefront URL structure to remain synchronized with live commerce data.



## Note

The sitemap automation workflow is planned as part of the wider Semantq SEO tooling layer. Detailed implementation specifications (database queries, sitemap formats, update frequency, and indexing strategy) will be documented separately once finalized.
