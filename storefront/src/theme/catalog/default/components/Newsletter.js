/**
 * Newsletter - Email signup form (skeletal)
 * Subscription form with success state
 */

export default class Newsletter {
    constructor(context = {}) {
        this.context = context;
        this.config = context.storefrontData?.newsletter || {};
    }

    render() {
        if (this.config.enabled === false) return '';

        const { heading, description, placeholder, buttonText } = this.config;

        return `
            <section class="cq-newsletter" data-block="newsletter">
                <div class="cq-newsletter-inner">
                    ${heading ? `<h2 class="cq-newsletter-heading">${heading}</h2>` : ''}
                    ${description ? `<p class="cq-newsletter-description">${description}</p>` : ''}
                    <form class="cq-newsletter-form" data-newsletter-form>
                        <input type="email" class="cq-newsletter-input" placeholder="${placeholder || 'Enter your email'}" required>
                        <button type="submit" class="cq-newsletter-submit">${buttonText || 'Subscribe'}</button>
                    </form>
                </div>
            </section>
        `;
    }

    attachEvents(container) {
        const form = container.querySelector('[data-newsletter-form]');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                form.innerHTML = '<p class="cq-newsletter-success">Thank you for subscribing!</p>';
            });
        }
    }
}
