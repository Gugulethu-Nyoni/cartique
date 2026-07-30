/**
 * ThemeRegistry — Available themes registry with metadata
 */

import defaultThemeConfig from './catalog/default/theme.config.js';
import fashionThemeConfig from './catalog/fashion/theme.config.js';

export default class ThemeRegistry {
    constructor() {
        this.themes = new Map();

        // Register built-in themes
        this.register('default', defaultThemeConfig, {
            source: 'builtin',
            path: 'catalog/default'
        });

        this.register('fashion', fashionThemeConfig, {
            source: 'builtin',
            path: 'catalog/fashion'
        });
    }

    register(name, config, options = {}) {
        if (!config || typeof config !== 'object') {
            throw new Error(`[ThemeRegistry] Invalid theme config for "${name}"`);
        }

        const metadata = {
            source: options.source || 'custom',
            path: options.path || `catalog/${name}`,
            installed: options.installed || false,
            version: config.version || '1.0.0',
            ...options
        };

        this.themes.set(name, {
            config,
            metadata
        });

        return this;
    }

    get(name) {
        const entry = this.themes.get(name);
        return entry ? entry.config : null;
    }

    getInfo(name) {
        const entry = this.themes.get(name);
        if (!entry) return null;
        return {
            name,
            ...entry.metadata
        };
    }

    getEntry(name) {
        return this.themes.get(name) || null;
    }

    has(name) {
        return this.themes.has(name);
    }

    list() {
        return Array.from(this.themes.keys());
    }

    listWithInfo() {
        return Array.from(this.themes.entries()).map(([name, entry]) => ({
            name,
            ...entry.metadata
        }));
    }

    getConfig(name) {
        const entry = this.themes.get(name);
        if (!entry) {
            console.warn(`[ThemeRegistry] Theme "${name}" not found, using default`);
            return this.themes.get('default')?.config;
        }
        return entry.config;
    }

    remove(name) {
        if (name === 'default') {
            console.warn('[ThemeRegistry] Cannot remove default theme');
            return false;
        }
        return this.themes.delete(name);
    }
}
