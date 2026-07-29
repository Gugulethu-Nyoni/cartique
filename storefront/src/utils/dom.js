/**
 * @semantq/storefront/utils
 *
 * DOM utilities
 *
 * Migrated from: cartique/storefront/src/Storefront.js
 * Phase 1: Pure extraction. No refactoring.
 */

/**
 * Adds event listener with cleanup tracking
 * @param {HTMLElement} element - The element to attach to
 * @param {string} event - The event name
 * @param {Function} handler - The event handler
 */
export function addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    
    // Store for cleanup
    const key = `${element.id || element.className}-${event}`;
    if (!this.eventListeners.has(key)) {
        this.eventListeners.set(key, []);
    }
    this.eventListeners.get(key).push({ element, event, handler });
}

/**
 * Cleans up all tracked event listeners
 */
export function cleanupEventListeners() {
    this.eventListeners.forEach((listeners, key) => {
        listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
    });
    this.eventListeners.clear();
}