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
 * Phase 3.8: Variant resolution, currency propagation, diagnostics.
 */

export default class CartiqueAdapter {
    constructor(kernel, options = {}) {
        this.kernel = kernel;
        this.legacyMode = options.legacyMode ?? true;
        this.debug = options.debug ?? false;
        this.currencySymbol = options.currencySymbol || 'ZAR';
        this.onDecision = options.onDecision || null;
        this._findProduct = null;
    }

    /**
     * Set legacy mode on/off
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
        return this._resolveLegacyToDecision(request);
    }

    /**
     * Resolve entire cart
     * Returns: Cart resolution with CommercialDecision items (Phase 2D)
     * 
     * Phase 3.8: Deterministic routing — always uses legacy path
     * Kernel path disabled until it can prove identical output
     */
    async resolveCart(request) {
        const normalized = this._normalizeCartRequest(request);
        
        // ✅ TRACE: Log normalized items received by kernel
        console.log(
            '[TRACE] KERNEL RECEIVED ITEMS',
            JSON.parse(JSON.stringify(normalized.items))
        );
        
        if (!normalized.customer) {
            normalized.customer = {
                id: 'guest',
                type: 'guest',
                name: 'Guest User'
            };
        }
        
        return this._resolveCartLegacyToDecision(normalized);
    }

    /**
     * Resolve inventory
     */
    async resolveInventory(request) {
        return this._resolveInventoryLegacy(request);
    }

    /**
     * Resolve catalog (query layer)
     */
    async resolveCatalog(query) {
        return this._resolveCatalogLegacy(query);
    }

    // ==========================================================
    // UI HELPERS
    // ==========================================================

    resolveVariant(sellable, variantId) {
        if (!sellable || !sellable.variants) return null;
        if (variantId) {
            return sellable.variants.find(v => String(v.id) === String(variantId));
        }
        return sellable.variants[0] || null;
    }

    getSelectedVariant(sellable) {
        if (!sellable || !sellable.variants || sellable.variants.length === 0) {
            return null;
        }
        return sellable.variants[0];
    }

    // ==========================================================
    // VARIANT RESOLUTION (Phase 3.8)
    // ==========================================================

    /**
     * Get full variant object from sellable data
     * Preserves all pricing information
     *
     * @param {Object} sellable - Product/sellable object
     * @param {string|number} variantId - Variant ID to find (optional)
     * @returns {Object|null} Full variant object or null
     */
    _getVariant(sellable, variantId) {
        if (!sellable) return null;

        // Already resolved variant object
        if (sellable.id && sellable.price !== undefined && !sellable.variants) {
            return sellable;
        }

        if (!sellable.variants?.length) {
            return null;
        }

        if (!variantId) {
            return sellable.variants[0] || null;
        }

        return sellable.variants.find(
            v => String(v.id) === String(variantId)
        ) || null;
    }

    // ==========================================================
    // CART NORMALIZATION (Phase 3.8)
    // ==========================================================

    /**
     * Normalize cart request to expected schema
     * Idempotent - supports both legacy and kernel formats
     */
    _normalizeCartRequest(request) {
        if (!request) return { items: [], customer: null, place: null, contexts: {} };
        
        return {
            ...request,
            items: (request.items || []).map(item => {
                const productId = item.productId || item.id;
                const variantId = item.variantId || (item.variants?.[0]?.id) || null;
                const quantity = item.quantity || item.cart_quantity || item.qty || 1;
                
                let sellable = item.sellable || null;
                if (!sellable && this._findProduct && productId) {
                    sellable = this._findProduct(productId);
                }
                if (!sellable) {
                    sellable = item;
                }
                
                return {
                    productId: productId,
                    variantId: variantId,
                    quantity: quantity,
                    sellable: sellable,
                    currency: sellable?.currency || item.currency || this.currencySymbol,
                    _original: item
                };
            })
        };
    }

    // ==========================================================
    // KERNEL RESOLVERS (Kept for future parity)
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

            if (this.onDecision) {
                this.onDecision(decision);
            }

            return decision;
        } catch (error) {
            if (this.debug) {
                console.warn('[CartiqueAdapter] Kernel resolve failed, falling back to legacy:', error);
            }
            return this._resolveLegacyToDecision(request);
        }
    }

    /**
     * Kernel cart resolver — kept for future parity
     * Currently unused (resolveCart uses legacy path)
     */
    async _resolveCartWithKernel(request) {
        const items = request.items || [];
        const decisions = [];

        for (const item of items) {
            const sellable = item.sellable || null;
            const variant = this._getVariant(sellable, item.variantId);
            const currency = sellable?.currency ||
                             variant?.currency ||
                             item.currency ||
                             this.currencySymbol;

            const decision = await this._resolveWithKernel({
                sellable: sellable,
                variant: variant,
                quantity: item.quantity || 1,
                currency: currency,
                customer: request.customer,
                place: request.place,
                contexts: request.contexts
            });
            
            decisions.push(decision);
        }

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

        const currency = items[0]?.currency || this.currencySymbol;

        return {
            items: decisions,
            totals: {
                subtotal: { amount: subtotal, currency: currency },
                total: { amount: total, currency: currency },
                tax: { amount: tax, currency: currency },
                shipping: { amount: shipping, currency: currency }
            },
            adjustments: allAdjustments,
            _fromKernel: true,
            decisions: decisions
        };
    }

    // ==========================================================
    // LEGACY TO COMMERCIAL DECISION CONVERTERS
    // ==========================================================

    /**
     * Convert legacy pricing to CommercialDecision
     * Phase 2D: Always returns CommercialDecision
     */
    _resolveLegacyToDecision(request) {
        const sellable = request.sellable;

        let variant = request.variant || this._getVariant(
            sellable,
            request.variantId
        );

        if (variant && variant.price === undefined && sellable?.price !== undefined) {
            variant = {
                ...variant,
                price: sellable.price,
                currency: sellable.currency
            };
        }

        const quantity = request.quantity || 1;

        const currency = request.currency ||
                         sellable?.currency ||
                         variant?.currency ||
                         this.currencySymbol;

        if (this.debug) {
            console.group('[CartiqueAdapter] Pricing');
            console.log('Sellable', sellable);
            console.log('Variant', variant);
            console.log('Retail', variant?.price);
            console.log('Bulk', variant?.bulkPrice);
            console.log('Currency', currency);
            console.groupEnd();
        }

        if (!variant) {
            const emptyDecision = this._createEmptyDecision(request, currency);
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

        if (this.debug && unitPrice === 0) {
            console.error("[CartiqueAdapter] ZERO PRICE DETECTED", {
                sellable: sellable,
                variant: variant,
                quantity: quantity
            });
        }

        const adjustments = [];
        if (isBulk && bulkPrice !== null) {
            adjustments.push({
                type: 'bulk_discount',
                label: 'Bulk Discount',
                amount: (retailPrice - bulkPrice) * quantity,
                currency: currency,
                metadata: {
                    retailPrice: retailPrice,
                    bulkPrice: bulkPrice,
                    minimumQty: bulkMinQty,
                    quantity: quantity,
                    savings: (retailPrice - bulkPrice) * quantity
                }
            });
        }

        const items = [{
            sellableId: sellable?.id || 'unknown',
            variantId: variant?.id || null,
            quantity: quantity,
            unitPrice: {
                amount: unitPrice,
                currency: currency
            },
            comparePrice: comparePrice ? {
                amount: comparePrice,
                currency: currency
            } : null,
            total: {
                amount: totalPrice,
                currency: currency
            },
            metadata: {
                isBulk: isBulk,
                hasBulkPricing: bulkPrice !== null && bulkMinQty !== null
            }
        }];

        const decision = {
            type: 'commercial_decision',
            version: '1.0',
            timestamp: new Date().toISOString(),
            items: items,
            adjustments: adjustments,
            totals: {
                subtotal: {
                    amount: totalPrice,
                    currency: currency
                },
                total: {
                    amount: totalPrice,
                    currency: currency
                }
            },
            metadata: {
                source: 'legacy-adapter',
                legacyMode: true
            }
        };

        if (this.onDecision) {
            this.onDecision(decision);
        }

        return decision;
    }

    /**
     * Convert legacy cart to CommercialDecision structure
     * Phase 2D: Always returns CommercialDecision structure
     * 
     * IMPORTANT: This method receives ALREADY NORMALIZED request
     * from resolveCart(). Do NOT call _normalizeCartRequest() here.
     */
    _resolveCartLegacyToDecision(request) {
        const items = request.items || [];

        const decisions = [];
        let subtotal = 0;

        for (const item of items) {
            const sellable = item.sellable || null;
            const variant = this._getVariant(sellable, item.variantId);

            const currency = sellable?.currency ||
                             variant?.currency ||
                             item.currency ||
                             this.currencySymbol;

            if (this.debug) {
                console.group('[CartiqueAdapter] Cart Item');
                console.log('Item', item);
                console.log('Sellable', sellable);
                console.log('Variant', variant);
                console.log('Currency', currency);
                console.groupEnd();
            }

            const decision = this._resolveLegacyToDecision({
                sellable: sellable,
                variant: variant,
                quantity: item.quantity || 1,
                currency: currency
            });

            decisions.push(decision);
            subtotal += decision.totals?.subtotal?.amount || 0;
        }

        const currency = items[0]?.currency || this.currencySymbol;

        return {
            items: decisions,
            totals: {
                subtotal: { amount: subtotal, currency: currency },
                tax: { amount: 0, currency: currency },
                shipping: { amount: 0, currency: currency },
                total: { amount: subtotal, currency: currency }
            },
            adjustments: [],
            _legacy: true,
            decisions: decisions
        };
    }

    /**
     * Create an empty CommercialDecision
     */
    _createEmptyDecision(request, currency = null) {
        const { sellable, quantity = 1 } = request;
        const cur = currency || sellable?.currency || this.currencySymbol;
        return {
            type: 'commercial_decision',
            version: '1.0',
            timestamp: new Date().toISOString(),
            items: [{
                sellableId: sellable?.id || 'unknown',
                variantId: null,
                quantity: quantity,
                unitPrice: { amount: 0, currency: cur },
                comparePrice: null,
                total: { amount: 0, currency: cur }
            }],
            adjustments: [],
            totals: {
                subtotal: { amount: 0, currency: cur },
                total: { amount: 0, currency: cur }
            },
            metadata: {
                source: 'empty-decision',
                legacyMode: true
            }
        };
    }

    // ==========================================================
    // LEGACY RESOLVERS (Phase 2A — Safe fallback)
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
        return { items: [], total: 0 };
    }

    // ==========================================================
    // LEGACY COMPATIBILITY (Deprecated — Phase 2D)
    // ==========================================================

    /**
     * @deprecated Use resolvePricing() instead
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