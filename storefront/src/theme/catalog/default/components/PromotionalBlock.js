/**
 * PromotionalBlock - Featured promotion/section (skeletal)
 * Image + content promotional block
 */

export default class PromotionalBlock {
    constructor(context = {}) {
        this.context = context;
        this.config = context.storefrontData?.promotionalBlock || {};
    }

    render() {
        if (this.config.enabled === false) return '';

        const { image, eyebrow, heading, description, ctaLabel, ctaHref } = this.config;

        return `
            <section class="cq-promotional-block" data-block="promotional">
                <div class="cq-promo-inner">
                    ${image ? `<div class="cq-promo-image"><img src="${image}" alt="${heading || ''}"></div>` : ''}
                    <div class="cq-promo-content">
                        ${eyebrow ? `<span class="cq-promo-eyebrow">${eyebrow}</span>` : ''}
                        ${heading ? `<h3 class="cq-promo-heading">${heading}</h3>` : ''}
                        ${description ? `<p class="cq-promo-description">${description}</p>` : ''}
                        ${ctaLabel ? `<a href="${ctaHref || '#'}" class="cq-promo-cta">${ctaLabel}</a>` : ''}
                    </div>
                </div>
            </section>
        `;
    }
}
