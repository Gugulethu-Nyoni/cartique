/**
 * CartiqueAdapter — Connects storefront to commerce kernel
 * 
 * Phase 2A: Legacy fallback mode (safe)
 * Phase 2B: Kernel → CommercialDecision mode
 * 
 * The storefront never knows what the kernel looks like.
 * Only the adapter changes.
 * 
 * API Contract:
 *   - resolvePricing({ sellable, variant, quantity, customer, place, contexts })
 *   - resolveCart({ items, customer, place, contexts })
 *   - resolveInventory({ sellable })
 *   - resolveCatalog({ search, filters, sort, page, limit })
 *   - resolveVariant(sellable, variantId)  // UI helper
 *   - getSelectedVariant(sellable)         // UI helper
 */

export default class CartiqueAdapter {
    constructor(kernel, options = {}) {
        this.kernel = kernel;
        this.legacyMode = options.legacyMode ?? true;
        this.debug = options.debug ?? false;
    }

    /**
     * Set legacy mode on/off
     * Phase 2A: legacyMode = true
     * Phase 2B: legacyMode = false
     */
    setLegacyMode(mode) {
        this.legacyMode = mode;
    }

    // ==========================================================
    // STOREFRONT CONTRACT
    // ==========================================================

    /**
     * Resolve pricing for a single sellable
     * Returns: Legacy pricing object (Phase 2A) or wrapped CommercialDecision (Phase 2B)
     */
    async resolvePricing(request) {
        if (!this.legacyMode && this.kernel) {
            return this._resolveWithKernel(request);
        }
        return this._resolveLegacy(request);
    }

    /**
     * Resolve entire cart
     * Returns: Legacy cart object (Phase 2A) or wrapped CommercialDecision (Phase 2B)
     */
    async resolveCart(request) {
        if (!this.legacyMode && this.kernel) {
            return this._resolveCartWithKernel(request);
        }
        return this._resolveCartLegacy(request);
    }

    /**
     * Resolve inventory
     * Phase 2B: Delegates to kernel when available
     */
    async resolveInventory(request) {
        // TODO: Phase 2B — Use kernel inventory resolver when implemented
        return this._resolveInventoryLegacy(request);
    }

    /**
     * Resolve catalog (query layer)
     * Phase 2B: Delegates to kernel.query() when available
     */
    async resolveCatalog(query) {
        // TODO: Phase 2B — Use kernel.query() when implemented
        return this._resolveCatalogLegacy(query);
    }

    // ==========================================================
    // UI HELPERS (Keep during Phase 2)
    // ==========================================================

    /**
     * Find variant by ID (UI helper)
     * Keep for UI responsiveness — not commerce logic
     */
    resolveVariant(sellable, variantId) {
        if (!sellable || !sellable.variants) return null;
        if (variantId) {
            return sellable.variants.find(v => String(v.id) === String(variantId));
        }
        return sellable.variants[0] || null;
    }

    /**
     * Get selected variant (UI helper)
     * Keep for UI responsiveness
     */
    getSelectedVariant(sellable) {
        if (!sellable || !sellable.variants || sellable.variants.length === 0) {
            return null;
        }
        return sellable.variants[0];
    }

    // ==========================================================
    // KERNEL RESOLVERS (Phase 2B)
    // ==========================================================

    async _resolveWithKernel(request) {
        const sellable = request.sellable;
        const quantity = request.quantity || 1;
        const customer = request.customer;
        const place = request.place;
        const contexts = request.contexts || [];

        try {
            const decision = await this.kernel.resolve({
                sellable: sellable,
                customer: customer,
                place: place,
                configuration: { quantity: quantity },
                contexts: contexts
            });

            // Return wrapped response with both legacy and decision
            return {
                legacy: {
                    unitPrice: decision.items?.[0]?.unitPrice?.amount || 0,
                    totalPrice: decision.totals?.subtotal?.amount || 0,
                    isBulk: decision.adjustments?.some(a => a.type === 'bulk_discount') || false,
                    retailPrice: decision.items?.[0]?.comparePrice?.amount || decision.items?.[0]?.unitPrice?.amount || 0,
                    bulkPrice: null,
                    bulkMinimumQty: null,
                    quantity: quantity
                },
                decision: decision,
                _fromKernel: true
            };
        } catch (error) {
            if (this.debug) {
                console.warn('[CartiqueAdapter] Kernel resolve failed, falling back to legacy:', error);
            }
            return this._resolveLegacy(request);
        }
    }

    async _resolveCartWithKernel(request) {
        const items = request.items || [];
        const decisions = [];

        for (const item of items) {
            const result = await this._resolveWithKernel({
                sellable: item.sellable,
                variant: item.variant,
                quantity: item.quantity || 1,
                customer: request.customer,
                place: request.place,
                contexts: request.contexts
            });
            decisions.push(result);
        }

        // Aggregate decisions
        let subtotal = 0;
        let total = 0;
        const allAdjustments = [];

        for (const result of decisions) {
            const decision = result.decision;
            if (decision) {
                subtotal += decision.totals?.subtotal?.amount || 0;
                total += decision.totals?.total?.amount || 0;
                if (decision.adjustments) {
                    allAdjustments.push(...decision.adjustments);
                }
            }
        }

        return {
            items: decisions,
            subtotal: subtotal,
            total: total,
            tax: 0,
            shipping: 0,
            adjustments: allAdjustments,
            _fromKernel: true,
            decisions: decisions
        };
    }

    // ==========================================================
    // LEGACY RESOLVERS (Phase 2A — Safe fallback)
    // ==========================================================

    _resolveLegacy(request) {
        const sellable = request.sellable;
        const variant = request.variant || this.getSelectedVariant(sellable);
        const quantity = request.quantity || 1;

        if (!variant) {
            return {
                unitPrice: 0,
                totalPrice: 0,
                isBulk: false,
                retailPrice: 0,
                bulkPrice: null,
                bulkMinimumQty: null,
                quantity: quantity,
                _legacy: true
            };
        }

        const retailPrice = variant.price || 0;
        const bulkPrice = variant.bulkPrice;
        const bulkMinQty = variant.bulkMinimumQty;
        const isBulk = bulkPrice && bulkMinQty && quantity >= bulkMinQty;
        const unitPrice = isBulk ? bulkPrice : retailPrice;

        return {
            unitPrice: unitPrice,
            totalPrice: unitPrice * quantity,
            isBulk: isBulk,
            retailPrice: retailPrice,
            bulkPrice: bulkPrice,
            bulkMinimumQty: bulkMinQty,
            quantity: quantity,
            _legacy: true
        };
    }

    _resolveCartLegacy(request) {
        const items = request.items || [];
        let subtotal = 0;
        const resolvedItems = [];

        for (const item of items) {
            const pricing = this._resolveLegacy({
                sellable: item.sellable,
                variant: item.variant || this.getSelectedVariant(item.sellable),
                quantity: item.quantity || 1
            });
            subtotal += pricing.totalPrice;
            resolvedItems.push({
                ...item,
                pricing: pricing
            });
        }

        return {
            items: resolvedItems,
            subtotal: subtotal,
            total: subtotal,
            tax: 0,
            shipping: 0,
            adjustments: [],
            _legacy: true
        };
    }

    _resolveInventoryLegacy(request) {
        const sellable = request.sellable;
        if (typeof sellable?.inventory === 'number') {
            return { quantity: sellable.inventory, status: 'available' };
        }
        if (sellable?.variants?.length) {
            const total = sellable.variants.reduce((sum, v) => sum + (typeof v.inventory === 'number' ? v.inventory : 0), 0);
            return { quantity: total, status: total > 0 ? 'available' : 'out_of_stock' };
        }
        return { quantity: 10, status: 'unknown' };
    }

    _resolveCatalogLegacy(query) {
        // Legacy catalog resolution — will be replaced by kernel.query() in Phase 2B
        return { items: [], total: 0 };
    }
}
