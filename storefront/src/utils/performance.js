/**
 * @semantq/storefront/utils
 *
 * Performance utilities
 *
 * Migrated from: cartique/storefront/src/Storefront.js
 * Phase 1: Pure extraction. No refactoring.
 */

/**
 * Debounces a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in ms
 * @param {boolean} immediate - Whether to call immediately
 * @returns {Function} Debounced function
 */
export function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}