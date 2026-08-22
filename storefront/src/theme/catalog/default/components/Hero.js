/**
 * Hero - Main hero section (skeletal)
 * Image background with overlay content
 */

export default class Hero {
    constructor(context = {}) {
        this.context = context;
        this.config = context.storefrontData?.hero || {};
    }

    render() {
        if (this.config.enabled === false) return '';

        const { image, eyebrow, heading, description, ctaText, ctaLink } = this.config;

        return `
            <section class="cq-theme-hero" data-block="hero">
                ${image ? `<div class="cq-hero-bg" style="background-image:url('${image}')"></div>` : ''}
                <div class="cq-hero-content">
                    ${eyebrow ? `<span class="cq-hero-eyebrow">${eyebrow}</span>` : ''}
                    ${heading ? `<h1 class="cq-hero-heading">${heading}</h1>` : ''}
                    ${description ? `<p class="cq-hero-description">${description}</p>` : ''}
                    ${ctaText ? `<a href="${ctaLink || '#'}" class="cq-hero-cta">${ctaText}</a>` : ''}
                </div>
            </section>
        `;
    }
}
