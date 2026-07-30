/**
 * @semantq/storefront/theme
 *
 * DefaultTheme — Built-in storefront theme
 *
 * Phase 1: Pure extraction. No refactoring.
 * Phase 3.7.1: Browser environment guard for Node/SSR.
 * Phase 3.7: FOUC prevention, loading class methods, initialize method.
 *
 * TODO: Phase 2 — Move navigation to Router.
 */

const CARTIQUE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
`;

export default class DefaultTheme {
    constructor(context = {}) {
        Object.assign(this, context);
        this._initialized = false;
    }

    /**
     * Check if running in browser environment
     * @returns {boolean}
     */
    isBrowser() {
        return typeof document !== 'undefined' && typeof window !== 'undefined';
    }

    /**
     * Initialize the theme — CSS injection + FOUC prevention
     */
    async initialize() {
        if (this._initialized) {
            return;
        }
        
        if (!this.isBrowser()) {
            return;
        }
        
        // Hide container using internal CSS class
        this.addLoadingClass();
        
        // Load CSS
        this.injectCSS();
        this.applyTheme();
        
        this._initialized = true;
        
        if (this.features?.debug) {
            console.log('[DefaultTheme] Initialized');
        }
    }

    /**
     * Add loading class to container (internal CSS)
     */
    addLoadingClass() {
        if (!this.isBrowser()) return;
        
        const containerId = this.features?.containerId || 'cartique';
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.add('cartique-loading');
            container.style.visibility = 'hidden';
            container.style.opacity = '0';
            container.style.transition = 'opacity 0.25s ease, visibility 0.25s ease';
        }
    }

    /**
     * Remove loading class (reveal container)
     */
    removeLoadingClass() {
        if (!this.isBrowser()) return;
        
        const containerId = this.features?.containerId || 'cartique';
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.remove('cartique-loading');
            container.style.visibility = 'visible';
            container.style.opacity = '1';
        }
    }

    /**
     * Injects CSS styles into the document head
     * Browser guard for Node/SSR environments
     */
    injectCSS() {
        // Browser guard for Node/SSR environments
        if (!this.isBrowser()) {
            return;
        }
        
        // Prevent duplicate injection
        if (document.getElementById('cartique-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'cartique-styles';
        style.textContent = `
            /* Critical render styles */
            #${this.features.containerId} {
                visibility: hidden;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .cartique-container {
                position: relative;
                min-height: 100vh;
            }
            
            /* =============================================
               FOUC PREVENTION — Internal Cartique CSS
               ============================================= */
            .cartique-loading {
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.25s ease, visibility 0.25s ease;
            }
            
            /* Main Cartique CSS */
            ${CARTIQUE_CSS}
        `;
        document.head.appendChild(style);
        
        if (this.features?.debug) {
            console.log('[DefaultTheme] CSS injected');
        }
    }

    /**
     * Applies theme color and mode to the document
     * Browser guard for Node/SSR environments
     */
    applyTheme() {
        // Browser guard for Node/SSR environments
        if (!this.isBrowser()) {
            return;
        }
        
        // Set accent color
        const accentColor = this.features.themeColor || '#2a2a2a';
        document.documentElement.style.setProperty('--cartique-accent', accentColor);
        document.documentElement.style.setProperty('--theme-accent', accentColor);
        
        // Set theme mode (light/dark)
        const themeMode = this.features.theme === 'dark' ? 'dark' : 'light';
        const containerElement = document.getElementById(this.features.containerId);
        if (containerElement) {
            containerElement.setAttribute('data-theme', themeMode);
        }
        
        if (this.features?.debug) {
            console.log('[DefaultTheme] Theme applied:', themeMode);
        }
    }

    /**
     * Applies minimal theme styling
     * @deprecated Use applyTheme() instead
     * Browser guard for Node/SSR environments
     */
    applyMinimalTheme() {
        // Browser guard for Node/SSR environments
        if (!this.isBrowser()) {
            return;
        }
        
        const accentColor = this.features.themeColor || this.features.theme || '#2a2a2a';
        document.documentElement.style.setProperty('--cartique-accent', accentColor);
        document.documentElement.style.setProperty('--theme-accent', accentColor);
        
        const containerElement = document.getElementById(this.features.containerId);
        if (containerElement) {
            containerElement.classList.add(`theme-${this.features.theme}`);
        }
    }
}