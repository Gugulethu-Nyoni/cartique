/**
 * TrustStrip - USP/trust indicators
 * Displays key selling points with icons
 */

export default class TrustStrip {
    constructor(context = {}) {
        this.context = context;
        this.config = context.storefrontData?.usps || [];
    }

    render() {
        if (!this.config.length) return '';

        return `
            <section class="cq-trust-strip" data-block="trust-strip">
                ${this.config.map(usp => `
                    <div class="cq-trust-item">
                        ${usp.icon ? `<span class="cq-trust-icon">${usp.icon}</span>` : ''}
                        <span class="cq-trust-title">${usp.title || ''}</span>
                        ${usp.description ? `<span class="cq-trust-desc">${usp.description}</span>` : ''}
                    </div>
                `).join('')}
            </section>
        `;
    }
}
