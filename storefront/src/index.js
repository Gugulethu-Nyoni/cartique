/**
 * @semantq/storefront
 *
 * Commerce Representation Framework
 *
 * Phase 1: Exports only.
 * Phase 2: Full integration.
 */

export { default as StorefrontCore } from './StorefrontCore.js';

// Renderers
export { default as ProductRenderer } from './renderers/ProductRenderer.js';
export { default as CollectionRenderer } from './renderers/CollectionRenderer.js';
export { default as CartRenderer } from './renderers/CartRenderer.js';

// Services
export { default as PricingService } from './services/PricingService.js';
export { default as CartService } from './services/CartService.js';
export { default as CouponService } from './services/CouponService.js';
export { default as WishlistService } from './services/WishlistService.js';
export { default as LocaleService } from './services/LocaleService.js';
export { default as NotificationService } from './services/NotificationService.js';

// Extensions
export * as Reviews from './extensions/reviews/index.js';

// Theme
export { default as DefaultTheme } from './theme/DefaultTheme.js';

// Adapters
export { default as CartiqueAdapter } from './adapters/CartiqueAdapter.js';

// Utils
export * from './utils/object.js';
export * from './utils/performance.js';
export * from './utils/dom.js';

// Models
export * from './models/index.js';
