/**
 * ComponentRegistry — Theme component overrides
 */

export default class ComponentRegistry {
    constructor() {
        this.components = new Map();
        this.defaults = new Map();
    }

    /**
     * Register a component for a theme
     */
    register(themeName, componentName, component) {
        if (!this.components.has(themeName)) {
            this.components.set(themeName, new Map());
        }
        this.components.get(themeName).set(componentName, component);
    }

    /**
     * Register a default component
     */
    registerDefault(componentName, component) {
        this.defaults.set(componentName, component);
    }

    /**
     * Get a component for a theme (with fallback to default)
     */
    get(themeName, componentName) {
        const themeComponents = this.components.get(themeName);
        if (themeComponents && themeComponents.has(componentName)) {
            return themeComponents.get(componentName);
        }
        return this.defaults.get(componentName) || null;
    }

    /**
     * Check if a theme has a component override
     */
    hasOverride(themeName, componentName) {
        const themeComponents = this.components.get(themeName);
        return themeComponents ? themeComponents.has(componentName) : false;
    }

    /**
     * Get all overrides for a theme
     */
    getOverrides(themeName) {
        const themeComponents = this.components.get(themeName);
        return themeComponents ? Object.fromEntries(themeComponents) : {};
    }

    /**
     * List all registered components for a theme
     */
    list(themeName) {
        const themeComponents = this.components.get(themeName);
        return themeComponents ? Array.from(themeComponents.keys()) : [];
    }

    /**
     * List all default components
     */
    listDefaults() {
        return Array.from(this.defaults.keys());
    }

    /**
     * Remove a component override
     */
    remove(themeName, componentName) {
        const themeComponents = this.components.get(themeName);
        if (themeComponents) {
            return themeComponents.delete(componentName);
        }
        return false;
    }

    /**
     * Clear all overrides for a theme
     */
    clear(themeName) {
        return this.components.delete(themeName);
    }
}
