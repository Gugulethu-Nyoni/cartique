/**
 * ThemeLoader — Load theme CSS + config
 * 
 * Uses external CSS for library compatibility
 */

export default class ThemeLoader {
    constructor(options = {}) {
        this.catalogPath = options.catalogPath || '/catalog/';
        this.loadedThemes = new Map();
    }

    async load(name) {
        if (this.loadedThemes.has(name)) {
            return this.loadedThemes.get(name);
        }

        const config = await this.loadConfig(name);
        const css = this.loadCSS(name);

        const theme = {
            name,
            config,
            css,
            extended: config.extends ? await this.load(config.extends) : null
        };

        this.loadedThemes.set(name, theme);
        return theme;
    }

    async loadConfig(name) {
        try {
            const module = await import(`./catalog/${name}/theme.config.js`);
            return module.default || module;
        } catch (error) {
            console.warn(`[ThemeLoader] Failed to load config for "${name}":`, error);
            if (name !== 'default') {
                return await this.loadConfig('default');
            }
            throw new Error(`[ThemeLoader] Unable to load any theme config`);
        }
    }

    loadCSS(name) {
        const base = this.catalogPath.endsWith('/')
            ? this.catalogPath
            : `${this.catalogPath}/`;

        return {
            url: `${base}${name}/theme.css`,
            id: `cartique-theme-${name}`
        };
    }

    getThemePath(name) {
        const base = this.catalogPath.endsWith('/')
            ? this.catalogPath
            : `${this.catalogPath}/`;
        return `${base}${name}/`;
    }
}