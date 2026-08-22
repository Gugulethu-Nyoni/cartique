/**
 * @semantq/cartique
 * 
 * Unified entry point for Cartique
 * 
 * Usage:
 *   import Cartique from './cartique.js';
 *   const shop = new Cartique(products, options);
 */

import StorefrontCore from './storefront/src/StorefrontCore.js';
import { ResolutionEngine } from './src/engine/ResolutionEngine.js';
import {
    VariantResolver,
    PricingResolver,
    PromotionResolver,
    TaxResolver,
    ShippingResolver
} from './src/engine/resolvers/index.js';
import { Customer, Place } from './src/commerce/index.js';

export default class Cartique {
    constructor(products = [], options = {}, storefrontData = {}) {
        // 1. Default options
        this.options = {
            kernelMode: true,
            debug: true,
            diagnostics: true,
            resolutionJournal: true,
            theme: 'default',
            currencySymbol: 'R',
            grid: true,
            columns: 2,
            itemsPerPage: 12,
            ...options
        };
        this.storefrontData = storefrontData;

        // 2. Create customer and place
        this.customer = options.customer || Customer.retail({ id: 'demo-user' });
        this.place = options.place || Place.southAfrica();

        // 3. Create kernel (with default resolvers)
        this.kernel = new ResolutionEngine({
        resolvers: [
            new VariantResolver(),
            new PricingResolver(),
            new PromotionResolver(),
            new TaxResolver(),
            new ShippingResolver()
        ]
    });

        // 4. Create storefront
        this.storefront = new StorefrontCore(
            products,
            {
                ...this.options,
                kernel: this.kernel,
                customer: this.customer,
                place: this.place
            },
            options.callbacks || {},
            this.kernel
        , this.storefrontData);

        // 5. Expose for debugging
        if (this.options.debug) {
            window.__cartique = {
                app: this,
                storefront: this.storefront,
                kernel: this.kernel,
                options: this.options
            };
            console.log('🛍️ Cartique ready');
            console.log('🔧 Debug: window.__cartique');
        }

        // 6. Return storefront for chaining
        return this.storefront;
    }
}
