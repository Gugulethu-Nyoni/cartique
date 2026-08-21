/**
 * GalleryEngine — Core gallery state & logic
 * 
 * Owns: media, currentIndex, lightbox state, navigation, lifecycle
 * Does NOT own: DOM rendering, presentation
 */

export default class GalleryEngine {
    constructor(images = [], context = {}) {
        this.context = context;
        this.images = this.normalizeImages(images);
        this.currentIndex = 0;
        this.isLightboxOpen = false;
        this.lightboxIndex = null;
        this._subscribers = [];
        this._destroyed = false;
    }

    /**
     * Normalize raw image URLs into canonical media objects
     * @param {Array} images - Raw image URLs
     * @returns {Array} Normalized media objects
     */
    normalizeImages(images) {
        const productTitle = this.context?.product?.title || 'Product image';
        
        return images
            .filter(Boolean)
            .filter((img, index, arr) => arr.indexOf(img) === index)
            .map((img, index) => ({
                type: 'image',
                src: img,
                alt: `${productTitle} — image ${index + 1}`,
                loading: index === 0 ? 'eager' : 'lazy'
            }));
    }

    /**
     * Get total image count
     */
    get imageCount() {
        return this.images.length;
    }

    /**
     * Get current image object
     */
    get currentImage() {
        return this.images[this.currentIndex] || null;
    }

    /**
     * Subscribe to state changes
     * @param {Function} listener - Called on every state change
     * @returns {Function} Unsubscribe function
     */
    subscribe(listener) {
        this._subscribers.push(listener);
        return () => {
            this._subscribers = this._subscribers.filter(l => l !== listener);
        };
    }

    /**
     * Notify all subscribers of state change
     */
    _notify() {
        if (this._destroyed) return;
        this._subscribers.forEach(listener => listener(this));
    }

    /**
     * Navigate to specific image index
     * @param {number} index - Target index
     */
    goTo(index) {
        if (index < 0 || index >= this.imageCount) return;
        if (this.currentIndex === index && !this.isLightboxOpen) return;
        
        this.currentIndex = index;
        this._notify();
    }

    /**
     * Navigate to next image (wraps around)
     */
    next() {
        this.goTo((this.currentIndex + 1) % this.imageCount);
    }

    /**
     * Navigate to previous image (wraps around)
     */
    previous() {
        this.goTo((this.currentIndex - 1 + this.imageCount) % this.imageCount);
    }

    /**
     * Open lightbox at specific index
     * Also updates currentIndex to match
     * @param {number} index - Image index to open
     */
    openLightbox(index = this.currentIndex) {
        this.currentIndex = index;
        this.lightboxIndex = index;
        this.isLightboxOpen = true;
        this._notify();
    }

    /**
     * Close lightbox
     */
    closeLightbox() {
        this.isLightboxOpen = false;
        this.lightboxIndex = null;
        this._notify();
    }

    /**
     * Navigate lightbox to next image
     */
    lightboxNext() {
        if (!this.isLightboxOpen) return;
        this.lightboxIndex = (this.lightboxIndex + 1) % this.imageCount;
        this._notify();
    }

    /**
     * Navigate lightbox to previous image
     */
    lightboxPrevious() {
        if (!this.isLightboxOpen) return;
        this.lightboxIndex = (this.lightboxIndex - 1 + this.imageCount) % this.imageCount;
        this._notify();
    }

    /**
     * Destroy engine and clean up
     */
    destroy() {
        this._destroyed = true;
        this._subscribers = [];
        this.images = [];
        this.currentIndex = 0;
        this.isLightboxOpen = false;
        this.lightboxIndex = null;
    }
}
