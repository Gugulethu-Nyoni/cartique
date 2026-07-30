/**
 * @semantq/storefront/theme
 *
 * DefaultTheme — Built-in storefront theme
 *
 * CSS loaded from external theme stylesheet
 * FOUC prevention via .cartique-loading CSS class
 */

export default class DefaultTheme {
    constructor(context = {}) {
        Object.assign(this, context);
        this._initialized = false;
        this._cssLoaded = false;
    }

    isBrowser() {
        return typeof document !== 'undefined' && typeof window !== 'undefined';
    }

    async initialize() {
        if (this._initialized) return;
        if (!this.isBrowser()) return;

        this.addLoadingClass();
        await this.injectCSS();
        this.applyTheme();

        this._initialized = true;

        if (this.features?.debug) {
            console.log('[DefaultTheme] Initialized');
        }
    }

    /**
     * Inject theme stylesheet from external file
     * Removes legacy inline CSS before loading external
     */
    injectCSS() {
        return new Promise((resolve) => {
            if (!this.isBrowser()) {
                resolve();
                return;
            }

            // ✅ Remove legacy inline CSS FIRST
            const oldStyle = document.getElementById('cartique-styles');
            if (oldStyle) {
                if (this.features?.debug) {
                    console.log('[DefaultTheme] Removing legacy cartique-styles');
                }
                oldStyle.remove();
            }

            // ✅ Prevent duplicate external CSS
            const existingLink = document.getElementById('cartique-theme-default');
            if (existingLink) {
                this._cssLoaded = true;
                resolve();
                return;
            }

            const cssPath = this.features?.themeCSS 
                || '/storefront/src/themes/default/theme.css';

            if (this.features?.debug) {
                console.log('[DefaultTheme] Loading CSS:', cssPath);
            }

            const link = document.createElement('link');
            link.id = 'cartique-theme-default';
            link.rel = 'stylesheet';
            link.href = cssPath;

            link.onload = () => {
                this._cssLoaded = true;
                if (this.features?.debug) {
                    console.log('[DefaultTheme] CSS loaded:', cssPath);
                }
                resolve();
            };

            link.onerror = () => {
                console.error('[DefaultTheme] CSS failed loading:', cssPath);
                resolve();
            };

            document.head.prepend(link);
        });
    }

    addLoadingClass() {
        if (!this.isBrowser()) return;

        const containerId = this.features?.containerId || 'cartique';
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.add('cartique-loading');
        }
    }

    removeLoadingClass() {
        if (!this.isBrowser()) return;

        const containerId = this.features?.containerId || 'cartique';
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.remove('cartique-loading');
            container.classList.add('cartique-loaded');
        }
    }

    applyTheme() {
        if (!this.isBrowser()) return;

        const accentColor = this.features?.themeColor || '#655793';
        document.documentElement.style.setProperty('--cartique-accent', accentColor);
        document.documentElement.style.setProperty('--theme-accent', accentColor);

        const themeMode = this.features?.theme === 'dark' ? 'dark' : 'light';
        const containerId = this.features?.containerId || 'cartique';
        const containerElement = document.getElementById(containerId);
        if (containerElement) {
            containerElement.setAttribute('data-theme', themeMode);
        }

        if (this.features?.debug) {
            console.log('[DefaultTheme] Theme applied:', themeMode);
        }
    }

    setTheme(cssPath) {
        if (!this.isBrowser()) return;

        const link = document.getElementById('cartique-theme-default');
        if (!link) {
            console.warn('[DefaultTheme] Theme link not found');
            return;
        }

        link.href = cssPath;
        this._cssLoaded = false;
    }

    destroy() {
        if (!this.isBrowser()) return;

        const link = document.getElementById('cartique-theme-default');
        if (link) {
            link.remove();
        }

        const containerId = this.features?.containerId || 'cartique';
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.remove('cartique-loaded', 'cartique-loading');
        }

        this._initialized = false;
        this._cssLoaded = false;
        console.log('[DefaultTheme] Destroyed');
    }

    applyMinimalTheme() {
        this.applyTheme();
    }
}
