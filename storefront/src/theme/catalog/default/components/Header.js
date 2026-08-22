/**
 * Header - Site navigation header (skeletal)
 * Brand logo, navigation menu, and action placeholders
 */

export default class Header {
    constructor(context = {}) {
        this.context = context;
        this.config = context.storefrontData || {};
    }

    render() {
        const brandName = this.config.brand?.name || 'Cartique';
        const menu = this.config.navigation?.menu || [];

        return `
            <header class="cq-theme-header" data-block="header">
                <div class="cq-header-logo">
                    <a href="/">${brandName}</a>
                </div>
                <nav class="cq-header-nav" aria-label="Primary">
                    <ul class="cq-nav-list">
                        ${menu.map(item => `
                            <li class="cq-nav-item">
                                <a href="${item.href || '#'}" class="cq-nav-link">${item.label}</a>
                            </li>
                        `).join('')}
                    </ul>
                </nav>
                <div class="cq-header-actions">
                    <span class="cq-header-action">Search</span>
                    <span class="cq-header-action">Account</span>
                    <span class="cq-header-action">Cart</span>
                </div>
            </header>
        `;
    }
}
