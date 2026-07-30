/**
 * Setup for Node tests
 * Handles .css?inline imports
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Mock CSS imports for Node
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Add CSS import handler
const originalImport = global.import;
global.import = async (specifier) => {
    if (specifier.includes('.css?inline')) {
        const cssPath = specifier.replace('?inline', '');
        const fullPath = resolve(__dirname, '../../../', cssPath);
        try {
            const css = readFileSync(fullPath, 'utf-8');
            return { default: css };
        } catch (e) {
            return { default: '' };
        }
    }
    return originalImport(specifier);
};
