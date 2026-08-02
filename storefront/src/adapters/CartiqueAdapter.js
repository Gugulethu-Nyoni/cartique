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
 * 
 * Phase 2D: Returns CommercialDecision directly, no legacy wrapper.
 * Phase 3: Records decisions for debugging.
 */

export default class CartiqueAdapter {
    constructor(kernel, options = {}) {
        this.kernel = kernel;
        this.legacyMode = options.legacyMode ?? true;
        this.debug = options.debug ?? false;
        this.currencySymbol = options.currencySymbol || 'USD';
        this.onDecision = options.onDecision || null;  // Phase 3: Decision recording callback
        this._findProduct = null;  // Optional product lookup function
    }

    /**
     * Set legacy mode on/off
     * Phase 2A: legacyMode = true
     * Phase 2B: legacyMode = false
     */
    setLegacyMode(mode) {
        this.legacyMode = mode;
    }

    /**
     * Set currency symbol
     */
    setCurrencySymbol(symbol) {
        this.currencySymbol = symbol;
    }

    /**
     * Set product lookup function for normalization
     */
    setProductLookup(fn) {
        this._findProduct = fn;
    }

    // ==========================================================
    // STOREFRONT CONTRACT
    // ==========================================================

    /**
     * Resolve pricing for a single sellable
     * Returns: CommercialDecision directly (Phase 2D)
     */
    async resolvePricing(request) {
        if (!this.legacyMode && this.kernel) {
            return this._resolveWithKernel(request);
        }
        // Phase 2D: Return CommercialDecision even in legacy mode
        return this._resolveLegacyToDecision(request);
    }

    /**
     * Resolve entire cart
     * Returns: Cart resolution with CommercialDecision items (Phase 2D)
     */
    async resolveCart(request) {
        // Normalize incoming request (idempotent - supports both legacy and kernel formats)
        const normalized = this._normalizeCartRequest(request);
        
        // Ensure customer context exists
        if (!normalized.customer) {
            normalized.customer = {
                id: 'guest',
                type: 'guest',
                name: 'Guest User'
            };
        }
        
        if (!this.legacyMode && this.kernel) {
            return this._resolveCartWithKernel(normalized);
        }
        return this._resolveCartLegacyToDecision(normalized);
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
    // CART NORMALIZATION (Phase 3.8)
    // ==========================================================

    /**
     * Normalize cart request to expected schema
     * Idempotent - supports both legacy and kernel formats
     * 
     * @param {Object} request - Raw cart request
     * @param {Array} request.items - Cart items (legacy or kernel format)
     * @returns {Object} Normalized request with canonical item format
     */
    _normalizeCartRequest(request) {
        if (!request) return { items: [], customer: null, place: null, contexts: {} };
        
        return {
            ...request,
            items: (request.items || []).map(item => {
                // Support both legacy (id) and kernel (productId) formats
                const productId = item.productId || item.id;
                // Support both legacy (variants[0].id) and kernel (variantId) formats
                const variantId = item.variantId || (item.variants?.[0]?.id) || null;
                // Support both legacy (cart_quantity) and kernel (quantity) formats
                const quantity = item.quantity || item.cart_quantity || 1;
                
                // Find the sellable product if not already present and we have a lookup
                let sellable = item.sellable || null;
                if (!sellable && this._findProduct && productId) {
                    sellable = this._findProduct(productId);
                }
                
                return {
                    productId: productId,
                    variantId: variantId,
                    quantity: quantity,
                    sellable: sellable || item,
                    // Preserve original for fallback
                    _original: item
                };
            })
        };
    }

    // ==========================================================
    // KERNEL RESOLVERS (Phase 2B/2D)
    // ==========================================================

    /**
     * Resolve pricing with kernel
     * Returns CommercialDecision directly
     */
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

            // Phase 3: Record decision for debugging
            if (this.onDecision) {
                this.onDecision(decision);
            }

            // Phase 2D: Return CommercialDecision directly
            return decision;
        } catch (error) {
            if (this.debug) {
                console.warn('[CartiqueAdapter] Kernel resolve failed, falling back to legacy:', error);
            }
            return this._resolveLegacyToDecision(request);
        }
    }

    /**
     * Resolve cart with kernel
     * Returns aggregated CommercialDecision structure
     */
    async _resolveCartWithKernel(request) {
        // Items are already normalized by _normalizeCartRequest
        const items = request.items || [];
        const decisions = [];

        for (const item of items) {
            const decision = await this._resolveWithKernel({
                sellable: item.sellable || { id: item.productId },
                variant: item.variantId ? { id: item.variantId } : null,
                quantity: item.quantity || 1,
                customer: request.customer,
                place: request.place,
                contexts: request.contexts
            });
            decisions.push(decision);
        }

        // Aggregate decisions
        let subtotal = 0;
        let total = 0;
        let tax = 0;
        let shipping = 0;
        const allAdjustments = [];

        for (const decision of decisions) {
            if (decision) {
                subtotal += decision.totals?.subtotal?.amount || 0;
                total += decision.totals?.total?.amount || 0;
                tax += decision.totals?.tax?.amount || 0;
                shipping += decision.totals?.shipping?.amount || 0;
                if (decision.adjustments) {
                    allAdjustments.push(...decision.adjustments);
                }
            }
        }

        // Return aggregated CommercialDecision-like structure
        return {
            items: decisions,
            totals: {
                subtotal: { amount: subtotal, currency: this.currencySymbol },
                total: { amount: total, currency: this.currencySymbol },
                tax: { amount: tax, currency: this.currencySymbol },
                shipping: { amount: shipping, currency: this.currencySymbol }
            },
            adjustments: allAdjustments,
            _fromKernel: true,
            decisions: decisions
        };
    }

    // ==========================================================
    // LEGACY TO COMMERCIAL DECISION CONVERTERS (Phase 2D)
    // ==========================================================

    /**
     * Convert legacy pricing to CommercialDecision
     * Phase 2D: Always returns CommercialDecision
     */
    _resolveLegacyToDecision(request) {
        const sellable = request.sellable;
        const variant = request.variant || this.getSelectedVariant(sellable);
        const quantity = request.quantity || 1;

        // Handle case where variant is null
        if (!variant) {
            const emptyDecision = this._createEmptyDecision(request);
            // Phase 3: Record empty decision for debugging
            if (this.onDecision) {
                this.onDecision(emptyDecision);
            }
            return emptyDecision;
        }

        const retailPrice = variant.price || 0;
        const comparePrice = variant.comparePrice || null;
        const bulkPrice = variant.bulkPrice;
        const bulkMinQty = variant.bulkMinimumQty;
        const isBulk = bulkPrice && bulkMinQty && quantity >= bulkMinQty;
        const unitPrice = isBulk ? bulkPrice : retailPrice;
        const totalPrice = unitPrice * quantity;

        // Build adjustments array
        const adjustments = [];
        if (isBulk && bulkPrice !== null) {
            adjustments.push({
                type: 'bulk_discount',
                label: 'Bulk Discount',
                amount: (retailPrice - bulkPrice) * quantity,
                currency: this.currencySymbol,
                metadata: {
                    retailPrice: retailPrice,
                    bulkPrice: bulkPrice,
                    minimumQty: bulkMinQty,
                    quantity: quantity,
                    savings: (retailPrice - bulkPrice) * quantity
                }
            });
        }

        // Build items array
        const items = [{
            sellableId: sellable?.id || 'unknown',
            variantId: variant?.id || null,
            quantity: quantity,
            unitPrice: {
                amount: unitPrice,
                currency: this.currencySymbol
            },
            comparePrice: comparePrice ? {
                amount: comparePrice,
                currency: this.currencySymbol
            } : null,
            total: {
                amount: totalPrice,
                currency: this.currencySymbol
            },
            metadata: {
                isBulk: isBulk,
                hasBulkPricing: bulkPrice !== null && bulkMinQty !== null
            }
        }];

        // Build CommercialDecision
        const decision = {
            type: 'commercial_decision',
            version: '1.0',
            timestamp: new Date().toISOString(),
            items: items,
            adjustments: adjustments,
            totals: {
                subtotal: {
                    amount: totalPrice,
                    currency: this.currencySymbol
                },
                total: {
                    amount: totalPrice,
                    currency: this.currencySymbol
                }
            },
            metadata: {
                source: 'legacy-adapter',
                legacyMode: true
            }
        };

        // Phase 3: Record decision for debugging
        if (this.onDecision) {
            this.onDecision(decision);
        }

        return decision;
    }

    /**
     * Convert legacy cart to CommercialDecision structure
     * Phase 2D: Always returns CommercialDecision structure
     */
    _resolveCartLegacyToDecision(request) {
        // Items are already normalized by _normalizeCartRequest
        const items = request.items || [];
        const decisions = [];
        let subtotal = 0;

        for (const item of items) {
            // Use the sellable from normalized item, or create a minimal one
            const sellable = item.sellable || { id: item.productId };
            const variant = item.variantId ? { id: item.variantId } : null;
            
            const decision = this._resolveLegacyToDecision({
                sellable: sellable,
                variant: variant,
                quantity: item.quantity || 1
            });
            decisions.push(decision);
            subtotal += decision.totals?.subtotal?.amount || 0;
        }

        return {
            items: decisions,
            totals: {
                subtotal: { amount: subtotal, currency: this.currencySymbol },
                total: { amount: subtotal, currency: this.currencySymbol },
                tax: { amount: 0, currency: this.currencySymbol },
                shipping: { amount: 0, currency: this.currencySymbol }
            },
            adjustments: [],
            _legacy: true,
            decisions: decisions
        };
    }

    /**
     * Create an empty CommercialDecision
     */
    _createEmptyDecision(request) {
        const { sellable, quantity = 1 } = request;
        return {
            type: 'commercial_decision',
            version: '1.0',
            timestamp: new Date().toISOString(),
            items: [{
                sellableId: sellable?.id || 'unknown',
                variantId: null,
                quantity: quantity,
                unitPrice: { amount: 0, currency: this.currencySymbol },
                comparePrice: null,
                total: { amount: 0, currency: this.currencySymbol }
            }],
            adjustments: [],
            totals: {
                subtotal: { amount: 0, currency: this.currencySymbol },
                total: { amount: 0, currency: this.currencySymbol }
            },
            metadata: {
                source: 'empty-decision',
                legacyMode: true
            }
        };
    }

    // ==========================================================
    // LEGACY RESOLVERS (Phase 2A — Safe fallback, kept for backward compatibility)
    // ==========================================================

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

    // ==========================================================
    // LEGACY COMPATIBILITY (Deprecated — Phase 2D)
    // ==========================================================

    /**
     * @deprecated Use resolvePricing() instead
     * Legacy wrapper for backward compatibility
     */
    _resolveLegacy(request) {
        const decision = this._resolveLegacyToDecision(request);
        const item = decision.items?.[0] || {};
        const adjustments = decision.adjustments || [];
        const isBulk = adjustments.some(a => a.type === 'bulk_discount');
        const bulkAdjustment = adjustments.find(a => a.type === 'bulk_discount');

        return {
            unitPrice: item.unitPrice?.amount || 0,
            totalPrice: item.total?.amount || 0,
            isBulk: isBulk,
            retailPrice: item.comparePrice?.amount || item.unitPrice?.amount || 0,
            bulkPrice: bulkAdjustment?.metadata?.bulkPrice || null,
            bulkMinimumQty: bulkAdjustment?.metadata?.minimumQty || null,
            quantity: item.quantity || 1,
            _legacy: true
        };
    }

    /**
     * @deprecated Use resolveCart() instead
     * Legacy cart wrapper for backward compatibility
     */
    _resolveCartLegacy(request) {
        const result = this._resolveCartLegacyToDecision(request);
        return {
            items: result.items.map((decision, index) => {
                const item = decision.items?.[0] || {};
                const originalItem = request.items?.[index] || {};
                return {
                    ...originalItem,
                    pricing: {
                        unitPrice: item.unitPrice?.amount || 0,
                        totalPrice: item.total?.amount || 0,
                        isBulk: decision.adjustments?.some(a => a.type === 'bulk_discount') || false,
                        retailPrice: item.comparePrice?.amount || item.unitPrice?.amount || 0,
                        bulkPrice: null,
                        bulkMinimumQty: null,
                        quantity: item.quantity || 1,
                        _legacy: true
                    }
                };
            }),
            subtotal: result.totals?.subtotal?.amount || 0,
            total: result.totals?.total?.amount || 0,
            tax: result.totals?.tax?.amount || 0,
            shipping: result.totals?.shipping?.amount || 0,
            adjustments: result.adjustments || [],
            _legacy: true
        };
    }
}