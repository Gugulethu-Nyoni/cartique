/**
 * ThemeManager — Orchestrates theme loading and switching
 */

import ThemeRegistry from './ThemeRegistry.js';
import ThemeLoader from './ThemeLoader.js';
import ComponentRegistry from './ComponentRegistry.js';

export default class ThemeManager {
    constructor(options = {}) {
        this.options = options;

        this.registry = new ThemeRegistry();
        this.loader = new ThemeLoader({
            catalogPath: options.catalogPath || '/catalog/'
        });
        this.componentRegistry = new ComponentRegistry();

        this._registerDefaultThemes();

        this.currentTheme = null;
        this.currentName = 'default';
        this._listeners = [];
        this._isLoaded = false;
        this._cssLoaded = false;
        this._previewToken = null;
    }

    _registerDefaultThemes() {
        const options = this.options;
        if (options.themes) {
            Object.entries(options.themes).forEach(([name, config]) => {
                this.registry.register(name, config, { source: 'custom' });
            });
        }
    }

    async initialize(name = 'default') {
        const theme = await this._load(name);
        this.currentTheme = theme;
        this.currentName = name;

        this._applyCSS(theme);
        this._applyVariables(theme.config);

        // Apply components
        await this._applyComponents(name);

        this._isLoaded = true;
        this._emit('theme:initialized', { name, theme });
        return theme;
    }

    async _load(name) {
        if (!this.registry.has(name)) {
            console.warn(`[ThemeManager] Theme "${name}" not registered, using default`);
            name = 'default';
        }

        try {
            return await this.loader.load(name);
        } catch (error) {
            console.error(`[ThemeManager] Failed to load theme "${name}":`, error);
            throw error;
        }
    }

    /**
     * Load component overrides for a theme
     * Pure data loading — no side effects
     * @param {string} name - Theme name
     * @returns {Promise<Object|null>} Component map or null
     */
    async _loadComponents(name) {
        try {
            const module = await import(`./catalog/${name}/components/index.js`);
            return module.default || module;
        } catch (error) {
            if (this.options.debug) {
                console.log(`[ThemeManager] No components found for theme "${name}"`);
            }
            return null;
        }
    }

    /**
     * Apply component overrides to registry
     * This mutates the registry (side effect)
     * @param {string} name - Theme name
     */
    async _applyComponents(name) {
        const components = await this._loadComponents(name);
        if (!components) return;

        Object.entries(components).forEach(([componentName, component]) => {
            this.componentRegistry.register(name, componentName, component);
            if (this.options.debug) {
                console.log(`[ThemeManager] Registered ${componentName} for theme "${name}"`);
            }
        });

        console.log(`[ThemeManager] Loaded ${Object.keys(components).length} components for theme "${name}"`);
    }

    async load(name) {
        return this._load(name);
    }

    async switch(name) {
        if (!this.registry.has(name)) {
            throw new Error(`[ThemeManager] Theme "${name}" not registered`);
        }

        if (this.currentName === name) {
            return this.currentTheme;
        }

        const previous = this.currentName;

        // Unload current CSS
        this._unloadCSS();

        // Load new theme
        const theme = await this._load(name);
        this.currentTheme = theme;
        this.currentName = name;

        // Apply CSS, variables, components
        this._applyCSS(theme);
        this._applyVariables(theme.config);
        await this._applyComponents(name);

        this._emit('theme:switched', { from: previous, to: name });

        return theme;
    }

    async preview(name) {
        if (!this.registry.has(name)) {
            throw new Error(`[ThemeManager] Theme "${name}" not registered`);
        }

        // Store current state
        const previousTheme = this.currentTheme;
        const previousName = this.currentName;

        // Race condition guard
        const previewToken = Date.now();
        this._previewToken = previewToken;

        // Load theme data (NO side effects)
        const theme = await this._load(name);

        if (this._previewToken !== previewToken) {
            return {
                restore: () => ({
                    restored: false,
                    reason: 'Preview superseded'
                })
            };
        }

        // Apply visually (NO state changes)
        this._applyCSS(theme);
        this._applyVariables(theme.config);

        // Apply components for preview
        await this._applyComponents(name);

        this._emit('theme:preview', { name, theme });

        return {
            restore: () => {
                if (!previousTheme) {
                    return { restored: false, reason: 'No previous theme' };
                }

                // Restore previous theme
                this._applyCSS(previousTheme);
                this._applyVariables(previousTheme.config);

                // Restore previous components
                const prevComponents = this.componentRegistry.getOverrides(previousName);
                Object.entries(prevComponents).forEach(([compName, comp]) => {
                    this.componentRegistry.register(previousName, compName, comp);
                });

                // Restore state
                this.currentTheme = previousTheme;
                this.currentName = previousName;

                this._emit('theme:preview:restored', { name: previousName });

                return { restored: true, name: previousName };
            }
        };
    }

    current() {
        return {
            name: this.currentName,
            theme: this.currentTheme
        };
    }

    list() {
        return this.registry.list();
    }

    getThemeInfo(name) {
        return this.registry.getInfo(name);
    }

    getComponent(componentName) {
        return this.componentRegistry.get(this.currentName, componentName);
    }

    getComponentOverrides() {
        return this.componentRegistry.getOverrides(this.currentName);
    }

    getComponentRegistry() {
        return this.componentRegistry;
    }

    on(event, callback) {
        this._listeners.push({ event, callback });
        return () => this._removeListener(event, callback);
    }

    _emit(event, data) {
        this._listeners
            .filter(l => l.event === event)
            .forEach(l => l.callback(data));
    }

    _removeListener(event, callback) {
        this._listeners = this._listeners.filter(l =>
            !(l.event === event && l.callback === callback)
        );
    }

    _applyCSS(theme) {
        if (!theme || !theme.css) return;

        this._unloadCSS();

        const link = document.createElement('link');
        link.id = theme.css.id || 'cartique-theme-styles';
        link.rel = 'stylesheet';
        link.href = theme.css.url;

        link.onload = () => {
            this._cssLoaded = true;
            this._emit('theme:css:loaded', { theme: this.currentName });
        };

        link.onerror = () => {
            console.warn(`[ThemeManager] Failed to load CSS: ${theme.css.url}`);
            if (this.currentName !== 'default') {
                const defaultEntry = this.registry.getEntry('default');
                if (defaultEntry) {
                    const fallbackCSS = {
                        url: '/catalog/default/theme.css',
                        id: 'cartique-theme-default'
                    };
                    this._applyCSS({ css: fallbackCSS });
                }
            }
        };

        document.head.prepend(link);
    }

    _unloadCSS() {
        const themes = document.querySelectorAll('[id^="cartique-theme-"]');
        themes.forEach(theme => {
            theme.remove();
        });
        this._cssLoaded = false;
    }

    _applyVariables(config) {
        if (!config || !config.variables) return;

        const root = document.documentElement;
        const vars = config.variables;

        if (vars.primary) root.style.setProperty('--cartique-theme-primary', vars.primary);
        if (vars.accent) root.style.setProperty('--cartique-theme-accent', vars.accent);
        if (vars.background) root.style.setProperty('--cartique-theme-background', vars.background);
        if (vars.text) root.style.setProperty('--cartique-theme-text', vars.text);
        if (vars.radius) root.style.setProperty('--cartique-theme-radius', vars.radius);
    }

    destroy() {
        this._unloadCSS();
        this._listeners = [];
        this.currentTheme = null;
        this.currentName = null;
        this._isLoaded = false;
        this._cssLoaded = false;
        this._emit('theme:destroyed');
    }
}
