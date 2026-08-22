/**
 * CustomContentBlock - Arbitrary HTML section (skeletal)
 * For merchant-provided custom content
 */

export default class CustomContentBlock {
    constructor(context = {}) {
        this.context = context;
        this.config = context.storefrontData?.customContent || {};
    }

    render() {
        if (this.config.enabled === false) return '';

        return `
            <section class="cq-custom-content" data-block="custom">
                ${this.config.html || ''}
            </section>
        `;
    }
}
