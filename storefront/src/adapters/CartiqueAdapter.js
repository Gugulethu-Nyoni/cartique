/**
 * @semantq/storefront
 *
 * CartiqueAdapter — Connects storefront to commerce kernel
 *
 * NEW — Not migrated from Storefront.js.
 * Phase 1: Placeholder structure.
 *
 * TODO: Phase 2 — Implement kernel connection.
 */

export default class CartiqueAdapter {
    constructor(kernel) {
        this.kernel = kernel;
    }

    async query(params) {
        // TODO: Phase 2 implementation
        return { items: [], total: 0 };
    }

    async resolveProduct(productId, variantId) {
        // TODO: Phase 2 implementation
        return null;
    }

    async getCart() {
        // TODO: Phase 2 implementation
        return { items: [] };
    }

    async addItem(intent) {
        // TODO: Phase 2 implementation
        return { valid: true };
    }

    async updateItem(index, quantity) {
        // TODO: Phase 2 implementation
        return { valid: true };
    }

    async removeItem(index) {
        // TODO: Phase 2 implementation
        return { valid: true };
    }
}
