/**
 * @semantq/storefront/services
 *
 * WishlistService — Persistent guest wishlist
 *
 * Phase 1: localStorage-backed anonymous wishlist
 * - Stores only product IDs (not full product objects)
 * - ID-agnostic (supports numbers, strings, UUIDs)
 * - Subscriber pattern for UI updates
 * - Safe for Node/browser environments
 */

export default class WishlistService {
  constructor(context = {}) {
    Object.assign(this, context);
    
    // Storage key
    this.STORAGE_KEY = 'cartiqueWishlist';
    
    // Internal state
    this.items = this._load();
    this.subscribers = new Set();
    
    // Callback set by StorefrontCore
    this.onWishlistUpdated = null;
    
    if (this.features?.debug) {
      console.log('[Wishlist] Initialized with', this.items.length, 'items');
    }
  }

  // ==========================================================
  // ID NORMALIZATION
  // ==========================================================

  /**
   * Normalize product ID to consistent type
   * - Numeric strings become numbers
   * - UUIDs/strings remain as strings
   * - Handles both number and string IDs
   */
  _normalizeId(id) {
    if (id === null || id === undefined) return null;
    // If it's a string that looks like a number, convert to number
    if (typeof id === 'string' && /^\d+$/.test(id)) {
      return Number(id);
    }
    return id;
  }

  // ==========================================================
  // PERSISTENCE
  // ==========================================================

  /**
   * Load wishlist from localStorage
   * Safe for Node.js environments (returns empty array)
   */
  _load() {
    // Guard: localStorage may not exist (Node, private browsing)
    if (typeof localStorage === 'undefined') {
      if (this.features?.debug) {
        console.warn('[Wishlist] localStorage unavailable, using in-memory only');
      }
      return [];
    }

    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) {
        // Malformed data - fix it
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
        return [];
      }
      
      return data;
    } catch (e) {
      // Malformed JSON or other error
      if (this.features?.debug) {
        console.warn('[Wishlist] Failed to load from localStorage:', e.message);
      }
      // Attempt to fix malformed data
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
      } catch (_) {
        // Ignore
      }
      return [];
    }
  }

  /**
   * Save wishlist to localStorage
   * Safe for Node.js environments (silently fails)
   */
  _save() {
    // Guard: localStorage may not exist (Node, private browsing)
    if (typeof localStorage === 'undefined') {
      if (this.features?.debug) {
        console.warn('[Wishlist] localStorage unavailable, in-memory only');
      }
      return;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      if (this.features?.debug) {
        console.warn('[Wishlist] Failed to save to localStorage:', e.message);
      }
      // In-memory only fallback
    }
  }

  // ==========================================================
  // NOTIFICATION
  // ==========================================================

  /**
   * Notify all subscribers and StorefrontCore callback
   * Subscriber failures are caught and logged
   */
  _notify() {
    const state = this.getAll();
    
    // Notify subscribers
    this.subscribers.forEach(listener => {
      try {
        listener(state);
      } catch (e) {
        if (this.features?.debug) {
          console.warn('[Wishlist] Subscriber error:', e.message);
        }
      }
    });
    
    // Notify StorefrontCore callback
    if (typeof this.onWishlistUpdated === 'function') {
      try {
        this.onWishlistUpdated();
      } catch (e) {
        if (this.features?.debug) {
          console.warn('[Wishlist] Callback error:', e.message);
        }
      }
    }
  }

  // ==========================================================
  // PUBLIC API
  // ==========================================================

  /**
   * Add a product to the wishlist
   * @param {string|number} productId - Product identifier
   * @returns {Object} { success, added, productId }
   */
  add(productId) {
    const normalized = this._normalizeId(productId);
    if (normalized === null) {
      if (this.features?.debug) {
        console.warn('[Wishlist] Invalid product ID:', productId);
      }
      return { success: false, added: false, productId };
    }
    
    if (this.items.includes(normalized)) {
      return { success: true, added: false, productId: normalized };
    }
    
    this.items.push(normalized);
    this._save();
    this._notify();

    if (this.behavior) {
      this.behavior.wishlistAdd(normalized, {
        metadata: { source: 'wishlist_service' }
      });
    }
    
    if (this.features?.debug) {
      console.log('[TRACE] Wishlist added:', normalized);
    }
    
    return { success: true, added: true, productId: normalized };
  }

  /**
   * Remove a product from the wishlist
   * @param {string|number} productId - Product identifier
   * @returns {Object} { success, removed, productId }
   */
  remove(productId) {
    const normalized = this._normalizeId(productId);
    if (normalized === null) {
      if (this.features?.debug) {
        console.warn('[Wishlist] Invalid product ID:', productId);
      }
      return { success: false, removed: false, productId };
    }
    
    const index = this.items.indexOf(normalized);
    if (index === -1) {
      return { success: true, removed: false, productId: normalized };
    }
    
    this.items.splice(index, 1);
    this._save();
    this._notify();

    if (this.behavior) {
      this.behavior.wishlistRemove(normalized, {
        metadata: { source: 'wishlist_service' }
      });
    }
    
    if (this.features?.debug) {
      console.log('[TRACE] Wishlist removed:', normalized);
    }
    
    return { success: true, removed: true, productId: normalized };
  }

  /**
   * Toggle a product's wishlist status
   * @param {string|number} productId - Product identifier
   * @returns {Object} { success, added, productId }
   */
  toggle(productId) {
    const normalized = this._normalizeId(productId);
    if (normalized === null) {
      if (this.features?.debug) {
        console.warn('[Wishlist] Invalid product ID:', productId);
      }
      return { success: false, added: false, productId };
    }
    
    const isPresent = this.items.includes(normalized);
    if (isPresent) {
      this.remove(normalized);
      return { success: true, added: false, productId: normalized };
    } else {
      this.add(normalized);
      return { success: true, added: true, productId: normalized };
    }
  }

  /**
   * Check if a product is in the wishlist
   * @param {string|number} productId - Product identifier
   * @returns {boolean}
   */
  has(productId) {
    const normalized = this._normalizeId(productId);
    if (normalized === null) return false;
    return this.items.includes(normalized);
  }

  /**
   * Get all wishlist items (copy of internal array)
   * @returns {Array} Array of product IDs
   */
  getAll() {
    return [...this.items];
  }

  /**
   * Get wishlist count
   * @returns {number}
   */
  count() {
    return this.items.length;
  }

  /**
   * Clear all wishlist items
   */
  clear() {
    this.items = [];
    this._save();
    this._notify();
    
    if (this.features?.debug) {
      console.log('[TRACE] Wishlist cleared');
    }
  }

  /**
   * Subscribe to wishlist changes
   * @param {Function} listener - Called with state array on changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener) {
    if (typeof listener !== 'function') {
      if (this.features?.debug) {
        console.warn('[Wishlist] subscribe requires a function');
      }
      return () => {};
    }
    
    this.subscribers.add(listener);
    
    // Immediately notify with current state
    try {
      listener(this.getAll());
    } catch (e) {
      if (this.features?.debug) {
        console.warn('[Wishlist] Initial subscriber notification failed:', e.message);
      }
    }
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(listener);
    };
  }

  /**
   * Unsubscribe a listener
   * @param {Function} listener - The listener to remove
   */
  unsubscribe(listener) {
    this.subscribers.delete(listener);
  }
}
