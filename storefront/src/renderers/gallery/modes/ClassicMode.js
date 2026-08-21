/**
 * ClassicMode — Vertical thumbnails + large hero
 * Default ecommerce gallery presentation
 */

export default class ClassicMode {
    constructor(engine) {
        this.engine = engine;
        this.container = null;
        
        // Subscribe to engine state changes
        this._unsubscribe = engine.subscribe(() => this._updateDOM());
    }

    /**
     * Render Classic gallery HTML
     * @returns {string} HTML string
     */
    render() {
        const { images, currentIndex, imageCount } = this.engine;
        
        return `
            <div class="cartique-gallery gallery-classic" 
                 data-gallery-mode="classic"
                 role="region" 
                 aria-label="Product image gallery">
                
                <div class="gallery-classic-layout">
                    <!-- Vertical Thumbnails -->
                    <div class="gallery-thumbnails-vertical" role="tablist">
                        ${images.map((img, index) => `
                            <button 
                                class="gallery-thumbnail ${index === currentIndex ? 'active' : ''}"
                                data-gallery-item="${index}"
                                role="tab"
                                aria-selected="${index === currentIndex}"
                                aria-label="View image ${index + 1}"
                                type="button"
                            >
                                <img src="${img.src}" 
                                     alt="Thumbnail ${index + 1}"
                                     loading="lazy">
                            </button>
                        `).join('')}
                    </div>
                    
                    <!-- Hero Image -->
                    <div class="gallery-hero-container">
                        <img 
                            src="${images[currentIndex].src}" 
                            alt="${images[currentIndex].alt}" 
                            loading="${images[currentIndex].loading}"
                            class="gallery-hero-image"
                        >
                        
                        <!-- Navigation Arrows -->
                        <button class="gallery-arrow gallery-prev" 
                                aria-label="Previous image"
                                data-gallery-action="prev"
                                type="button">
                            ←
                        </button>
                        <button class="gallery-arrow gallery-next" 
                                aria-label="Next image"
                                data-gallery-action="next"
                                type="button">
                            →
                        </button>
                        
                        <!-- Counter -->
                        <div class="gallery-counter">
                            ${currentIndex + 1} / ${imageCount}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners to container
     * @param {HTMLElement} container - Gallery root element
     */
    attachEvents(container) {
        this.container = container;
        
        const prevBtn = container.querySelector('[data-gallery-action="prev"]');
        const nextBtn = container.querySelector('[data-gallery-action="next"]');
        const thumbnails = container.querySelectorAll('.gallery-thumbnail');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.engine.previous());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.engine.next());
        }
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.galleryItem, 10);
                this.engine.goTo(index);
            });
        });
    }

    /**
     * Update DOM based on engine state
     */
    _updateDOM() {
        if (!this.container) return;
        
        const { currentIndex, imageCount, currentImage } = this.engine;
        
        // Update hero image
        const heroImage = this.container.querySelector('.gallery-hero-image');
        if (heroImage && currentImage) {
            heroImage.src = currentImage.src;
            heroImage.alt = currentImage.alt;
        }
        
        // Update active thumbnail
        this.container.querySelectorAll('.gallery-thumbnail').forEach(thumb => {
            const index = parseInt(thumb.dataset.galleryItem, 10);
            thumb.classList.toggle('active', index === currentIndex);
            thumb.setAttribute('aria-selected', String(index === currentIndex));
        });
        
        // Update counter
        const counter = this.container.querySelector('.gallery-counter');
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${imageCount}`;
        }
    }

    /**
     * Clean up
     */
    destroy() {
        if (this._unsubscribe) {
            this._unsubscribe();
        }
        this.container = null;
    }
}
