/**
 * @semantq/storefront/services
 *
 * PricingService — Pricing and bulk calculations
 *
 * Phase 2D: Simplified to delegate to adapter for CommercialDecision.
 * Most methods are kept for backward compatibility but delegate to adapter.
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
        if (this.adapter) {
            try {
                // Use adapter to check bulk pricing
                const decision = this.adapter._resolveLegacyToDecision({
                    sellable: { variants: [variant] },
                    variant: variant,
                    quantity: 1
                });
                const adjustments = decision.adjustments || [];
                return adjustments.some(a => 
                    a.type === 'bulk_discount' || 
                    a.label?.toLowerCase().includes('bulk')
                );
            } catch (e) {
                // Fall through to legacy check
            }
        }
        // Legacy check
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

        if (!variant) return defaultDisplay;

        // Try adapter first
        if (this.adapter) {
            try {
                const decision = this.adapter._resolveLegacyToDecision({
                    sellable: { variants: [variant] },
                    variant: variant,
                    quantity: quantity || 1
                });

                const item = decision.items?.[0] || {};
                const adjustments = decision.adjustments || [];
                
                const hasBulk = adjustments.some(a => 
                    a.type === 'bulk_discount' || 
                    a.label?.toLowerCase().includes('bulk')
                );
                const unitPrice = item.unitPrice?.amount || 0;
                const retailPrice = item.comparePrice?.amount || variant?.price || 0;
                
                const bulkAdjustment = adjustments.find(a => a.type === 'bulk_discount');
                const bulkPrice = bulkAdjustment?.metadata?.bulkPrice || null;
                const bulkMinQty = bulkAdjustment?.metadata?.minimumQty || null;

                const isBulk = hasBulk && quantity >= (bulkMinQty || 0);

                return {
                    hasBulk: hasBulk,
                    isBulk: isBulk,
                    retailPrice: retailPrice,
                    bulkPrice: bulkPrice,
                    unitPrice: unitPrice,
                    minimumQty: bulkMinQty,
                    heading: isBulk ? '✓ Bulk Price Applied' : 'BULK PRICE',
                    message: bulkMinQty ? `Minimum ${bulkMinQty} items` : null,
                    displayPrice: `${this.currencySymbol}${this.formatPrice(unitPrice)} each`,
                    bulkDisplayPrice: bulkPrice ? `${this.currencySymbol}${this.formatPrice(bulkPrice)} each` : null,
                    staticDisplay: {
                        label: 'BULK PRICE',
                        price: bulkPrice ? `${this.currencySymbol}${this.formatPrice(bulkPrice)} each` : null,
                        minQty: bulkMinQty ? `Minimum ${bulkMinQty} items` : null
                    }
                };
            } catch (e) {
                // Fall through to legacy
            }
        }

        // Legacy fallback
        if (!this.hasBulkPricing(variant)) {
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
        // Delegate to adapter if available
        if (this.adapter) {
            try {
                return this.adapter.getSelectedVariant(product);
            } catch (e) {
                // Fall through to legacy
            }
        }
        
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
        // Delegate to adapter if available
        if (this.adapter && variantId) {
            try {
                // Search across products using adapter
                for (const product of this.products) {
                    const variant = this.adapter.resolveVariant(product, variantId);
                    if (variant) return variant;
                }
            } catch (e) {
                // Fall through to legacy
            }
        }
        
        if (!variantId) return null;
        
        for (const product of this.products) {
            if (product.variants) {
                const variant = product.variants.find(v => String(v.id) === String(variantId));
                if (variant) return variant;
            }
            if (String(product.id) === String(variantId)) {
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
        // Delegate to adapter if available
        if (this.adapter) {
            try {
                const decision = this.adapter._resolveLegacyToDecision({
                    sellable: { variants: [variant] },
                    variant: variant,
                    quantity: quantity
                });
                
                const item = decision.items?.[0] || {};
                const adjustments = decision.adjustments || [];
                const totals = decision.totals || {};
                
                const hasBulk = adjustments.some(a => 
                    a.type === 'bulk_discount' || 
                    a.label?.toLowerCase().includes('bulk')
                );
                const unitPrice = item.unitPrice?.amount || 0;
                const retailPrice = item.comparePrice?.amount || variant?.price || 0;
                const bulkPrice = adjustments.find(a => a.type === 'bulk_discount')?.metadata?.bulkPrice || null;
                const bulkMinQty = adjustments.find(a => a.type === 'bulk_discount')?.metadata?.minimumQty || null;

                return {
                    unitPrice: unitPrice,
                    isBulk: hasBulk,
                    retailPrice: retailPrice,
                    bulkPrice: bulkPrice,
                    bulkMinimumQty: bulkMinQty,
                    quantity: quantity,
                    totalPrice: totals.subtotal?.amount || 0
                };
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
        // Delegate to adapter if available
        if (this.adapter) {
            try {
                const inventory = this.adapter.resolveInventory({
                    sellable: product,
                    variant: this.adapter.getSelectedVariant(product)
                });
                if (inventory && typeof inventory.quantity === 'number') {
                    return inventory.quantity;
                }
            } catch (e) {
                // Fall through to legacy
            }
        }
        
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