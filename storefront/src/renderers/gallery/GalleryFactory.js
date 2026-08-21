/**
 * GalleryFactory — Resolve gallery mode and create engine
 */

import GalleryEngine from './GalleryEngine.js';
import ClassicMode from './modes/ClassicMode.js';
import HorizontalMode from './modes/HorizontalMode.js';
import EditorialMode from './modes/EditorialMode.js';

export default class GalleryFactory {
    static VALID_MODES = ['classic', 'horizontal', 'editorial'];
    static DEFAULT_MODE = 'classic';

    /**
     * Resolve configured mode to valid mode name
     * @param {string} configured - Raw configured value
     * @returns {string} Valid mode name
     */
    static resolveMode(configured) {
        const normalized = String(configured || '').toLowerCase().trim();
        return this.VALID_MODES.includes(normalized) 
            ? normalized 
            : this.DEFAULT_MODE;
    }

    /**
     * Create gallery engine with appropriate presentation mode
     * @param {Array} images - Raw image URLs
     * @param {string} mode - Requested mode
     * @param {Object} context - Context object (product, features, etc.)
     * @returns {GalleryEngine} Engine with mode attached
     */
    static create(images, mode = this.DEFAULT_MODE, context = {}) {
        const resolvedMode = this.resolveMode(mode);
        const engine = new GalleryEngine(images, context);
        
        let presentationMode;
        switch(resolvedMode) {
            case 'horizontal':
                presentationMode = new HorizontalMode(engine);
                break;
            case 'editorial':
                presentationMode = new EditorialMode(engine);
                break;
            case 'classic':
            default:
                presentationMode = new ClassicMode(engine);
                break;
        }
        
        engine.mode = presentationMode;
        engine.modeName = resolvedMode;
        
        return engine;
    }
}
