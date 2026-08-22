/**
 * FeaturedCategories - Category showcase grid (skeletal)
 * Displays top categories with item counts
 */

export default class FeaturedCategories {
    constructor(context = {}) {
        this.context = context;
        this.categories = context.categories || [];
    }

    render() {
        if (!this.categories.length) return '';

        return `
            <section class="cq-featured-categories" data-block="featured-categories">
                <h2 class="cq-section-heading">Shop by Category</h2>
                <div class="cq-category-grid">
                    ${this.categories.slice(0, 4).map(cat => `
                        <a href="#cat-${cat.id}" class="cq-category-card" data-cat-id="${cat.id}">
                            <span class="cq-category-name">${cat.name || ''}</span>
                            <span class="cq-category-count">
                                ${cat.count != null ? `${cat.count} items` : ''}
                            </span>
                        </a>
                    `).join('')}
                </div>
            </section>
        `;
    }
}
