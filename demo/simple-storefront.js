/**
 * Simple Storefront Renderer
 * 
 * Renders products directly from kernel decisions
 */

import { ResolutionEngine } from '../src/engine/ResolutionEngine.js';
import { VariantResolver } from '../src/engine/resolvers/VariantResolver.js';
import { PricingResolver } from '../src/engine/resolvers/PricingResolver.js';
import { PromotionResolver } from '../src/engine/resolvers/PromotionResolver.js';
import { TaxResolver } from '../src/engine/resolvers/TaxResolver.js';
import { ShippingResolver } from '../src/engine/resolvers/ShippingResolver.js';
import { Customer, Place } from '../src/commerce/index.js';

export class SimpleStorefront {
    constructor(products, options = {}) {
        this.products = products;
        this.options = {
            currencySymbol: 'R',
            columns: 2,
            ...options
        };
        
        this.kernel = new ResolutionEngine({
            resolvers: [
                new VariantResolver(),
                new PricingResolver(),
                new PromotionResolver(),
                new TaxResolver(),
                new ShippingResolver()
            ]
        });
        
        this.customer = options.customer || Customer.retail({ id: 'demo' });
        this.place = options.place || Place.southAfrica();
        this.decisions = new Map();
        
        window.__simple = this;
    }
    
    async render(container) {
        const el = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
            
        if (!el) {
            console.error('Container not found');
            return;
        }
        
        let html = `<div style="display:grid;grid-template-columns:repeat(${this.options.columns},1fr);gap:1.5rem;">`;
        
        for (const product of this.products) {
            const decision = await this.resolveProduct(product);
            const card = this.renderCard(product, decision);
            html += card;
        }
        
        html += '</div>';
        el.innerHTML = html;
        
        el.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.productId;
                console.log('🛒 Add to cart:', id);
            });
        });
    }
    
    async resolveProduct(product) {
        // Get the first variant's ID
        const variant = product.variants?.[0] || {};
        const variantId = variant.id || null;
        
        const decision = await this.kernel.resolve({
            sellable: product,
            customer: this.customer,
            place: this.place,
            configuration: { 
                quantity: 1,
                selections: {
                    variantId: variantId
                }
            },
            contexts: []
        });
        this.decisions.set(product.id, decision);
        return decision;
    }
    
    renderCard(product, decision) {
        const item = decision.items?.[0] || {};
        const totals = decision.totals || {};
        const unitPrice = item.unitPrice?.amount || product.price || 0;
        const image = product.image || '';
        const isBulk = item.metadata?.isBulk || false;
        const currency = this.options.currencySymbol || 'R';
        const entries = decision.journal?.entries || [];
        
        return `
            <div class="product-card">
                ${image ? `<img src="${image}" alt="${product.title}" class="product-image">` : ''}
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description || ''}</p>
                <div style="display:flex;align-items:center;gap:0.5rem;margin:0.5rem 0;">
                    <span class="price">${currency}${unitPrice}</span>
                    ${isBulk ? '<span class="bulk-badge">Bulk</span>' : ''}
                </div>
                ${entries.length ? `
                    <details class="decision-journal">
                        <summary>How this price was calculated</summary>
                        <div style="padding:0.5rem;background:#f9fafb;border-radius:0.25rem;margin-top:0.25rem;">
                            ${entries.map(e => `
                                <div class="journal-entry">
                                    <strong>${e.resolver}</strong>: ${e.reason}
                                </div>
                            `).join('')}
                        </div>
                    </details>
                ` : ''}
                <div class="product-footer">
                    <button class="add-to-cart" data-product-id="${product.id}">ADD TO CART</button>
                </div>
            </div>
        `;
    }
}
