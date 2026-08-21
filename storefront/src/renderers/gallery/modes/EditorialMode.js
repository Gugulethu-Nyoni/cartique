/**
 * EditorialMode — Asymmetric grid + lightbox
 * Premium presentation mode
 */

export default class EditorialMode {
    constructor(engine) {
        this.engine = engine;
        this.container = null;
        this.lightbox = null;
        
        this._unsubscribe = engine.subscribe(() => this._updateDOM());
    }

    render() {
        const { images, imageCount } = this.engine;
        
        return `
            <div class="cartique-gallery gallery-editorial" 
                 data-gallery-mode="editorial"
                 role="region" 
                 aria-label="Product image gallery">
                
                <!-- Asymmetric Grid -->
                <div class="gallery-editorial-grid">
                    ${images.map((img, index) => `
                        <button 
                            class="gallery-grid-item ${index === 0 ? 'featured' : ''}"
                            data-gallery-item="${index}"
                            aria-label="View image ${index + 1}"
                            type="button"
                        >
                            <img src="${img.src}" 
                                 alt="${img.alt}"
                                 loading="${img.loading}">
                        </button>
                    `).join('')}
                </div>
                
                <!-- Counter -->
                <div class="gallery-counter">
                    ${imageCount} images
                </div>
            </div>
            
            <!-- Lightbox -->
            <div class="gallery-lightbox" data-gallery-lightbox hidden>
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <img src="" alt="" class="lightbox-image">
                    <button class="lightbox-close" 
                            aria-label="Close lightbox"
                            type="button">×</button>
                    <button class="lightbox-prev" 
                            aria-label="Previous image"
                            type="button">←</button>
                    <button class="lightbox-next" 
                            aria-label="Next image"
                            type="button">→</button>
                </div>
            </div>
        `;
    }

    attachEvents(container) {
        this.container = container;
        this.lightbox = container.querySelector('[data-gallery-lightbox]');
        
        const gridItems = container.querySelectorAll('.gallery-grid-item');
        
        gridItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.galleryItem, 10);
                this.engine.openLightbox(index);
            });
        });
        
        if (this.lightbox) {
            const closeBtn = this.lightbox.querySelector('.lightbox-close');
            const prevBtn = this.lightbox.querySelector('.lightbox-prev');
            const nextBtn = this.lightbox.querySelector('.lightbox-next');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.engine.closeLightbox());
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.engine.lightboxPrevious());
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.engine.lightboxNext());
            }
            
            // Close lightbox when clicking overlay
            const overlay = this.lightbox.querySelector('.lightbox-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => this.engine.closeLightbox());
            }
        }
    }

    _updateDOM() {
        if (!this.container || !this.lightbox) return;
        
        const { isLightboxOpen, lightboxIndex, images } = this.engine;
        
        // Update lightbox visibility
        this.lightbox.hidden = !isLightboxOpen;
        
        if (isLightboxOpen && lightboxIndex !== null) {
            const lightboxImage = this.lightbox.querySelector('.lightbox-image');
            if (lightboxImage && images[lightboxIndex]) {
                lightboxImage.src = images[lightboxIndex].src;
                lightboxImage.alt = images[lightboxIndex].alt;
            }
        }
    }

    destroy() {
        if (this._unsubscribe) {
            this._unsubscribe();
        }
        this.container = null;
        this.lightbox = null;
    }
}
