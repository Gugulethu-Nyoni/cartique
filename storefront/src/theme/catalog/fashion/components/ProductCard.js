/**
 * Fashion Product Card
 * 
 * Overrides default ProductCard for fashion theme
 */

export default class FashionProductCard {
    constructor(context) {
        Object.assign(this, context);
    }

    render(product, decision) {
        const item = decision?.items?.[0] || {};
        const totals = decision?.totals || {};
        const unitPrice = item.unitPrice?.amount || product.price || 0;
        const image = product.image || '';
        const currency = this.currencySymbol || 'R';

        return `
            <div class="fashion-product-card" data-product-id="${product.id}">
                <div class="fashion-product-image">
                    ${image ? `<img src="${image}" alt="${product.title}" loading="lazy" />` : ''}
                    <span class="fashion-badge">NEW</span>
                </div>
                <div class="fashion-product-info">
                    <div class="fashion-product-brand">${product.brand || 'LUXURY'}</div>
                    <h3 class="fashion-product-name">${product.title}</h3>
                    <div class="fashion-product-price">${currency}${unitPrice}</div>
                    ${decision?.journal?.entries?.length ? `
                        <details class="fashion-decision-journal">
                            <summary>How this price was calculated</summary>
                            <div class="fashion-journal-entries">
                                ${decision.journal.entries.map(e => `
                                    <div class="fashion-journal-entry">
                                        <strong>${e.resolver}</strong>: ${e.reason}
                                    </div>
                                `).join('')}
                            </div>
                        </details>
                    ` : ''}
                    <button class="fashion-add-to-cart" data-product-id="${product.id}">
                        ADD TO CART
                    </button>
                </div>
            </div>
        `;
    }
}
