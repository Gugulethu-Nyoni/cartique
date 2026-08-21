/**
 * Gallery unit tests
 * Run with: node tests/gallery/gallery.test.js
 */

import GalleryEngine from '../../storefront/src/renderers/gallery/GalleryEngine.js';
import GalleryFactory from '../../storefront/src/renderers/gallery/GalleryFactory.js';

// Test helpers
function assert(condition, message) {
    if (!condition) {
        console.error(`FAIL: ${message}`);
        process.exit(1);
    }
    console.log(`PASS: ${message}`);
}

// Test GalleryEngine
console.log('\n=== GalleryEngine Tests ===\n');

// Test 1: Normalization with duplicates
const engine1 = new GalleryEngine(
    ['img1.jpg', 'img1.jpg', 'img2.jpg'],
    { product: { title: 'Test Product' } }
);
assert(engine1.imageCount === 2, 'Deduplicates images');
assert(engine1.images[0].type === 'image', 'Media model has type field');
assert(engine1.images[0].alt === 'Test Product — image 1', 'Generates correct alt text');
assert(engine1.images[0].loading === 'eager', 'First image loads eager');
assert(engine1.images[1].loading === 'lazy', 'Subsequent images load lazy');

// Test 2: Normalization with empty values
const engine2 = new GalleryEngine(
    ['', null, undefined, 'img1.jpg'],
    { product: { title: 'Test' } }
);
assert(engine2.imageCount === 1, 'Filters empty values');

// Test 3: Navigation boundaries
const engine3 = new GalleryEngine(['a.jpg', 'b.jpg', 'c.jpg']);
engine3.goTo(-1);
assert(engine3.currentIndex === 0, 'goTo(-1) stays at 0');
engine3.goTo(99);
assert(engine3.currentIndex === 0, 'goTo(99) stays at 0');
engine3.next();
assert(engine3.currentIndex === 1, 'next() works');
engine3.next();
assert(engine3.currentIndex === 2, 'next() works again');
engine3.next();
assert(engine3.currentIndex === 0, 'next() wraps around');
engine3.previous();
assert(engine3.currentIndex === 2, 'previous() wraps around');

// Test 4: Lightbox semantics
const engine4 = new GalleryEngine(['a.jpg', 'b.jpg', 'c.jpg']);
engine4.openLightbox(2);
assert(engine4.currentIndex === 2, 'openLightbox updates currentIndex');
assert(engine4.lightboxIndex === 2, 'openLightbox sets lightboxIndex');
assert(engine4.isLightboxOpen === true, 'openLightbox sets isLightboxOpen');
engine4.lightboxNext();
assert(engine4.lightboxIndex === 0, 'lightboxNext wraps around');
engine4.lightboxPrevious();
assert(engine4.lightboxIndex === 2, 'lightboxPrevious wraps around');
engine4.closeLightbox();
assert(engine4.isLightboxOpen === false, 'closeLightbox works');
assert(engine4.lightboxIndex === null, 'closeLightbox resets lightboxIndex');

// Test 5: Destroy
const engine5 = new GalleryEngine(['a.jpg', 'b.jpg']);
engine5.destroy();
assert(engine5.images.length === 0, 'destroy clears images');
assert(engine5.currentIndex === 0, 'destroy resets currentIndex');

// Test GalleryFactory
console.log('\n=== GalleryFactory Tests ===\n');

assert(GalleryFactory.resolveMode(undefined) === 'classic', 'undefined -> classic');
assert(GalleryFactory.resolveMode(null) === 'classic', 'null -> classic');
assert(GalleryFactory.resolveMode('') === 'classic', 'empty string -> classic');
assert(GalleryFactory.resolveMode('classic') === 'classic', 'classic -> classic');
assert(GalleryFactory.resolveMode('horizontal') === 'horizontal', 'horizontal -> horizontal');
assert(GalleryFactory.resolveMode('editorial') === 'editorial', 'editorial -> editorial');
assert(GalleryFactory.resolveMode('invalid') === 'classic', 'invalid -> classic');
assert(GalleryFactory.resolveMode('CLASSIC') === 'classic', 'case-insensitive');

// Test engine creation
const engine6 = GalleryFactory.create(['a.jpg', 'b.jpg'], 'classic');
assert(engine6.modeName === 'classic', 'Creates classic engine');
assert(engine6.mode !== null, 'Classic mode attached');

const engine7 = GalleryFactory.create(['a.jpg', 'b.jpg'], 'horizontal');
assert(engine7.modeName === 'horizontal', 'Creates horizontal engine');

const engine8 = GalleryFactory.create(['a.jpg', 'b.jpg'], 'editorial');
assert(engine8.modeName === 'editorial', 'Creates editorial engine');

const engine9 = GalleryFactory.create(['a.jpg', 'b.jpg'], undefined);
assert(engine9.modeName === 'classic', 'Default mode is classic');

console.log('\n✅ All tests passed\n');
