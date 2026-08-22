/**
 * SocialProof - Testimonials section (skeletal)
 * Customer quotes and reviews
 */

export default class SocialProof {
    constructor(context = {}) {
        this.context = context;
        this.config = context.storefrontData?.testimonials || [];
    }

    render() {
        if (!this.config.length) return '';

        return `
            <section class="cq-social-proof" data-block="social-proof">
                <h2 class="cq-section-heading">What Customers Say</h2>
                <div class="cq-testimonial-list">
                    ${this.config.map(t => `
                        <blockquote class="cq-testimonial">
                            <p class="cq-testimonial-quote">"${t.quote || ''}"</p>
                            <cite class="cq-testimonial-customer">— ${t.customer || 'Anonymous'}</cite>
                        </blockquote>
                    `).join('')}
                </div>
            </section>
        `;
    }
}
