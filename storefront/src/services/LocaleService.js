/**
 * @semantq/storefront/services
 *
 * LocaleService — Formatting utilities
 *
 * Migrated from: cartique/storefront/src/Storefront.js
 * Phase 1: Pure extraction. No refactoring.
 */

export default class LocaleService {
    constructor(context) {
        Object.assign(this, context);
    }

    /**
     * Format price with 2 decimal places
     * @param {number|string} price - The price to format
     * @returns {string} Formatted price with 2 decimal places
     */
    formatPrice(price) {
        if (price === undefined || price === null || isNaN(price)) {
            return '0.00';
        }
        return Number(price).toFixed(2);
    }

    /**
     * Formats a date string
     * @param {string} dateString - The date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
}