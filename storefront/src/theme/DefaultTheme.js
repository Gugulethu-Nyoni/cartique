/**
 * @semantq/storefront/theme
 *
 * DefaultTheme — Built-in storefront theme
 *
 * Migrated from: cartique/storefront/src/Storefront.js
 * Phase 1: Pure extraction. No refactoring.
 * Phase 3.7.1: Browser environment guard for Node/SSR.
 *
 * TODO: Phase 2 — Move navigation to Router.
 */

const CARTIQUE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
`;

export default class DefaultTheme {
    constructor(context) {
        Object.assign(this, context);
    }

    /**
     * Injects CSS styles into the document head
     * Browser guard for Node/SSR environments
     */
    injectCSS() {
        // ✅ Browser guard for Node/SSR environments
        if (typeof document === 'undefined') {
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
            
            /* Main Cartique CSS */
            ${CARTIQUE_CSS}
        `;
        document.head.appendChild(style);
    }

    /**
     * Applies theme color and mode to the document
     * Browser guard for Node/SSR environments
     */
    applyTheme() {
        // ✅ Browser guard for Node/SSR environments
        if (typeof document === 'undefined') {
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
    }

    /**
     * Applies minimal theme styling
     * @deprecated Use applyTheme() instead
     * Browser guard for Node/SSR environments
     */
    applyMinimalTheme() {
        // ✅ Browser guard for Node/SSR environments
        if (typeof document === 'undefined') {
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