/**
 * @semantq/storefront/services
 *
 * PricingService — Pricing and bulk calculations
 *
 * Migrated from: cartique/storefront/src/Storefront.js
 * Phase 2: Added deprecation warnings. All methods now warn about adapter usage.
 */

export default class PricingService {
    constructor(context) {
        Object.assign(this, context);
    }

    /**
     * Checks if a variant has bulk pricing available
     * @param {Object} variant - The product variant
     * @returns {boolean}
     * @deprecated Use adapter.resolvePricing() instead
     */
    hasBulkPricing(variant) {
        console.warn('[PricingService] hasBulkPricing() is deprecated. Use adapter.resolvePricing().');
        return variant?.bulkPrice != null && variant?.bulkMinimumQty != null;
    }

    /**
     * Gets bulk pricing display data for UI components
     * One source of truth for all UI components
     * @param {Object} variant - The product variant
     * @param {number} quantity - Current quantity
     * @returns {Object} Bulk pricing display data
     * @deprecated Use adapter.resolvePricing() instead
     */
    getBulkPricingDisplay(variant, quantity = 0) {
        console.warn('[PricingService] getBulkPricingDisplay() is deprecated. Use adapter.resolvePricing().');
        
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
     * Gets the selected variant from a product
     * @param {Object} product - The product
     * @returns {Object} The selected variant
     * @deprecated Use adapter.getSelectedVariant() instead
     */
    getSelectedVariant(product) {
        console.warn('[PricingService] getSelectedVariant() is deprecated. Use adapter.getSelectedVariant().');
        
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
     * Finds a variant by ID across all products
     * @param {string|number} variantId - The variant ID
     * @returns {Object|null} The found variant or null
     * @deprecated Use adapter.resolveVariant() instead
     */
    findVariant(variantId) {
        console.warn('[PricingService] findVariant() is deprecated. Use adapter.resolveVariant().');
        
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
     * Calculates unit price with bulk pricing consideration
     * @param {Object} variant - The product variant
     * @param {number} quantity - The quantity
     * @returns {Object} Pricing information
     * @deprecated Use adapter.resolvePricing() instead
     */
    getUnitPrice(variant, quantity = 1) {
        console.warn('[PricingService] getUnitPrice() is deprecated. Use adapter.resolvePricing().');
        
        // Delegate to adapter if available
        if (this.adapter) {
            try {
                const result = this.adapter._resolveLegacy({
                    sellable: { variants: [variant] },
                    variant: variant,
                    quantity: quantity
                });
                return result;
            } catch (e) {
                // Fall through to legacy
            }
        }
        
        // Fallback to legacy calculation
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

    /**
     * Gets product stock count
     * @param {Object} product - The product
     * @returns {number} Stock count
     * @deprecated Use adapter.resolveInventory() instead
     */
    getProductStock(product) {
        console.warn('[PricingService] getProductStock() is deprecated. Use adapter.resolveInventory().');
        
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

    /**
     * Sets the adapter instance
     * @param {Object} adapter - The adapter instance
     */
    setAdapter(adapter) {
        this.adapter = adapter;
    }
}