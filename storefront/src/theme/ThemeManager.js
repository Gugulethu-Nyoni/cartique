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
            const theme = await this.loader.load(name);

            // Load component overrides for this theme
            const components = await this._loadComponents(name);
            if (components) {
                Object.entries(components).forEach(([componentName, Component]) => {
                    this.componentRegistry.register(name, componentName, Component);
                });
                console.log(`[ThemeManager] Loaded ${Object.keys(components).length} components for theme "${name}"`);
            }

            return theme;
        } catch (error) {
            console.error(`[ThemeManager] Failed to load theme "${name}":`, error);
            throw error;
        }
    }

    async _loadComponents(name) {
        try {
            const module = await import(`./catalog/${name}/components/index.js`);
            return module.default || module;
        } catch (error) {
            // No component overrides for this theme
            return null;
        }
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

        this._unloadCSS();

        const theme = await this._load(name);
        this.currentTheme = theme;
        this.currentName = name;
        this._applyCSS(theme);
        this._applyVariables(theme.config);

        this._emit('theme:switched', { from: previous, to: name });

        return theme;
    }

    async preview(name) {
        if (!this.registry.has(name)) {
            throw new Error(`[ThemeManager] Theme "${name}" not registered`);
        }

        const previousTheme = this.currentTheme;
        const previousName = this.currentName;

        const theme = await this._load(name);
        this._applyCSS(theme);
        this._applyVariables(theme.config);

        this._emit('theme:preview', { name, theme });

        return {
            restore: () => {
                if (!previousTheme) return;
                this._applyCSS(previousTheme);
                this._applyVariables(previousTheme.config);
                this.currentTheme = previousTheme;
                this.currentName = previousName;
                this._emit('theme:preview:restored', { name: previousName });
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
