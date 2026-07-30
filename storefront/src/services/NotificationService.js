/**
 * @semantq/storefront/services
 *
 * NotificationService — UI notifications
 *
 * Safe for both browser and Node.js environments.
 * Phase 3.7: Removed green emoji, replaced with checkmark icon.
 */

export default class NotificationService {
    constructor(context = {}) {
        Object.assign(this, context);
        this.toastTimer1 = null;
        this.redirectTimer = null;
    }

    /**
     * Shows an error message
     */
    showErrorMessage(message) {
        // Only run in browser
        if (typeof document === 'undefined') {
            console.warn('[NotificationService] showErrorMessage called in non-browser environment:', message);
            return;
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'cartique-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            padding: 1rem;
            background: #ffebee;
            color: #c62828;
            border: 1px solid #ffcdd2;
            border-radius: 4px;
            margin: 1rem;
            text-align: center;
        `;
        
        if (this.container) {
            this.container.prepend(errorDiv);
        } else {
            document.body.prepend(errorDiv);
        }
    }

    /**
     * Shows checkout alert toast
     */
    showCheckoutAlert() {
        if (typeof document === 'undefined') {
            console.warn('[NotificationService] showCheckoutAlert called in non-browser environment');
            return;
        }

        const toast = document.querySelector('.toast');
        const closeIcon = document.querySelector('.toast .close');

        if (!toast || !closeIcon) return;

        this.clearToastTimeouts();

        // ✅ Remove green emoji, use SVG checkmark
        const svgEl = toast.querySelector('.svg');
        if (svgEl) {
            svgEl.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            svgEl.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                background: #4caf50;
                border-radius: 50%;
                color: white;
                flex-shrink: 0;
            `;
        }

        toast.classList.add('active');

        const closeHandler = () => {
            toast.classList.remove('active');
            this.clearToastTimeouts();
        };
        
        if (this.addEventListener) {
            this.addEventListener(closeIcon, 'click', closeHandler, { once: true });
        } else {
            closeIcon.addEventListener('click', closeHandler);
        }

        this.toastTimer1 = setTimeout(() => {
            toast.classList.remove('active');
        }, 5000);

        this.redirectTimer = setTimeout(() => {
            const cart = JSON.parse(localStorage.getItem('cartiqueCart'));
            console.log('Checkout cart:', JSON.stringify(cart, null, 2));
            
            if (this.features?.checkoutUrl && this.features.checkoutUrl !== '#') {
                const mode = this.features.checkoutUrlMode || 'self';
                if (mode === '_blank') {
                    window.open(this.features.checkoutUrl, '_blank');
                } else {
                    window.location.href = this.features.checkoutUrl;
                }
            }
        }, 5000);
    }

    /**
     * Shows stock alert toast
     */
    showStockAlert(message) {
        if (typeof document === 'undefined') {
            console.warn('[NotificationService] showStockAlert called in non-browser environment:', message);
            return;
        }

        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = 'toast stock-alert';
        toast.innerHTML = `
            <div class="toast-content">
                <span class="svg">⚠️</span>
                <div class="message">
                    <span class="text text-1">Stock Alert</span>
                    <span class="text text-2">${message}</span>
                </div>
            </div>
            <button class="close">&times;</button>
        `;

        toast.style.cssText = `
            background: #fff3cd;
            border-left: 4px solid #ffc107;
        `;

        const titleEl = toast.querySelector('.text-1');
        const messageEl = toast.querySelector('.text-2');
        if (titleEl) titleEl.style.color = '#856404';
        if (messageEl) messageEl.style.color = '#856404';

        toastContainer.appendChild(toast);
        
        setTimeout(() => toast.classList.add('active'), 10);
        
        const closeBtn = toast.querySelector('.close');
        const closeToast = () => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        };
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeToast);
        }
        
        const autoDismiss = setTimeout(() => {
            closeToast();
        }, 4000);
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(autoDismiss);
            }, { once: true });
        }
    }

    /**
     * Clears toast timers
     */
    clearToastTimeouts() {
        if (this.toastTimer1) clearTimeout(this.toastTimer1);
        if (this.redirectTimer) clearTimeout(this.redirectTimer);
    }
}