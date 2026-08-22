/**
 * AnnouncementBar - Top announcement banner
 * Renders promotional text with optional link
 */

export default class AnnouncementBar {
    constructor(context = {}) {
        this.context = context;
        this.config = context.storefrontData?.announcement || {};
    }

    render() {
        if (this.config.enabled === false) return '';

        const text = this.config.text || '';
        const href = this.config.href || null;

        return `
            <div class="cq-announcement-bar" data-block="announcement-bar">
                <div class="cq-announcement-inner">
                    ${href 
                        ? `<a href="${href}" class="cq-announcement-link">${text}</a>`
                        : `<span class="cq-announcement-text">${text}</span>`
                    }
                </div>
            </div>
        `;
    }
}
