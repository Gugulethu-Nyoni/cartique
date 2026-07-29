/**
 * @semantq/storefront/services
 *
 * NotificationService — Toast and alert management
 *
 * Migrated from: cartique/storefront/src/Storefront.js
 * Phase 1: Pure extraction. No refactoring.
 */

export default class NotificationService {
    constructor(context) {
        Object.assign(this, context);
    }

    /**
     * Shows an error message
     * @param {string} message - The error message
     */
    showErrorMessage(message) {
        // Create and show error message
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
        
        this.container.prepend(errorDiv);
    }

    /**
     * Shows checkout alert toast
     */
    showCheckoutAlert() {
        const toast = document.querySelector('.toast');
        const closeIcon = document.querySelector('.toast .close');

        if (!toast || !closeIcon) return;

        // Clear existing timeouts
        this.clearToastTimeouts();

        // Show toast
        toast.classList.add('active');

        // Close handler
        const closeHandler = () => {
            toast.classList.remove('active');
            this.clearToastTimeouts();
        };
        
        this.addEventListener(closeIcon, 'click', closeHandler, { once: true });

        // Auto-hide after 5 seconds and redirect
        this.toastTimer1 = setTimeout(() => {
            toast.classList.remove('active');
        }, 5000);

        // Redirect after 5 seconds
        this.redirectTimer = setTimeout(() => {
            const cart = JSON.parse(localStorage.getItem('cartiqueCart'));
            console.log('Checkout cart:', JSON.stringify(cart, null, 2));
            
            if (this.features.checkoutUrl && this.features.checkoutUrl !== '#') {
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
     * @param {string} message - The alert message
     */
    showStockAlert(message) {
        // Check if toast container exists, create if not
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        // Create stock alert toast following the same pattern as checkout alert
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

        // Add stock-specific styling while maintaining consistency
        toast.style.cssText = `
            background: #fff3cd;
            border-left: 4px solid #ffc107;
        `;

        // Update text colors for visibility
        const titleEl = toast.querySelector('.text-1');
        const messageEl = toast.querySelector('.text-2');
        if (titleEl) titleEl.style.color = '#856404';
        if (messageEl) messageEl.style.color = '#856404';

        toastContainer.appendChild(toast);
        
        // Show with animation
        setTimeout(() => toast.classList.add('active'), 10);
        
        // Close button handler
        const closeBtn = toast.querySelector('.close');
        const closeToast = () => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        };
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeToast);
        }
        
        // Auto dismiss after 4 seconds (slightly faster than checkout since it's an error)
        const autoDismiss = setTimeout(() => {
            closeToast();
        }, 4000);
        
        // Clean up timeout if manually closed
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