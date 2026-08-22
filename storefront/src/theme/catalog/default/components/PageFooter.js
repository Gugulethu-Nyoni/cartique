/**
 * PageFooter - Site footer (skeletal)
 * Brand info, navigation columns, legal links
 */

export default class PageFooter {
    constructor(context = {}) {
        this.context = context;
        this.config = context.storefrontData || {};
    }

    render() {
        const { brand, footer, policies } = this.config;
        const brandName = brand?.name || 'Cartique';
        const tagline = brand?.tagline || '';
        const columns = footer?.columns || [];

        return `
            <footer class="cq-page-footer" data-block="page-footer">
                <div class="cq-footer-inner">
                    <div class="cq-footer-brand">
                        <h3 class="cq-footer-brand-name">${brandName}</h3>
                        ${tagline ? `<p class="cq-footer-tagline">${tagline}</p>` : ''}
                    </div>
                    <div class="cq-footer-columns">
                        ${columns.map(col => `
                            <div class="cq-footer-col">
                                <h4 class="cq-footer-col-heading">${col.heading || ''}</h4>
                                <ul class="cq-footer-links">
                                    ${(col.links || []).map(link => `
                                        <li><a href="${link.href || '#'}">${link.label}</a></li>
                                    `).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="cq-footer-bottom">
                    <div class="cq-footer-legal">
                        ${policies?.privacyUrl ? `<a href="${policies.privacyUrl}">Privacy</a>` : ''}
                        ${policies?.termsUrl ? `<a href="${policies.termsUrl}">Terms</a>` : ''}
                        ${policies?.returnsUrl ? `<a href="${policies.returnsUrl}">Returns</a>` : ''}
                    </div>
                    <p class="cq-footer-copyright">© 2026 ${brandName}. All rights reserved.</p>
                </div>
            </footer>
        `;
    }
}
