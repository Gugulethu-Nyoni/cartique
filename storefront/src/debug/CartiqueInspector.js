/**
 * Cartique Inspector
 *
 * Developer debugging tools for inspecting CommercialDecision objects
 * 
 * Safe for both browser and Node.js environments.
 */

export default class CartiqueInspector {
    constructor(options = {}) {
        this.enabled = options.enabled || false;
        this.decisions = [];
        this.maxHistory = options.maxHistory || 50;
        this.version = options.version || '2.0.0';

        // Only expose to window if in browser
        if (this.enabled && typeof window !== 'undefined') {
            this.expose();
        }
    }

    /**
     * Record a CommercialDecision
     */
    record(decision) {
        if (!this.enabled || !decision) {
            return;
        }

        this.decisions.unshift(decision);

        if (this.decisions.length > this.maxHistory) {
            this.decisions.pop();
        }

        // Update window if in browser
        if (typeof window !== 'undefined') {
            this.expose();
        }
    }

    /**
     * Get the latest decision
     */
    latest() {
        return this.decisions[0] || null;
    }

    /**
     * Get all decision history
     */
    history() {
        return this.decisions;
    }

    /**
     * Get the journal from the latest decision
     */
    journal() {
        const decision = this.latest();
        return decision?.journal || null;
    }

    /**
     * Get diagnostics from the latest decision
     */
    diagnostics() {
        const decision = this.latest();
        return decision?.diagnostics || null;
    }

    /**
     * Get totals from the latest decision
     */
    totals() {
        const decision = this.latest();
        return decision?.totals || null;
    }

    /**
     * Get items from the latest decision
     */
    items() {
        const decision = this.latest();
        return decision?.items || [];
    }

    /**
     * Get adjustments from the latest decision
     */
    adjustments() {
        const decision = this.latest();
        return decision?.adjustments || [];
    }

    /**
     * Clear all recorded decisions
     */
    clear() {
        this.decisions = [];
        if (typeof window !== 'undefined') {
            this.expose();
        }
    }

    /**
     * Expose inspector to window for console debugging (browser only)
     */
    expose() {
        if (!this.enabled || typeof window === 'undefined') {
            return;
        }

        window.__cartique = {
            // Get latest decision
            latest: () => this.latest(),
            
            // Get all history
            history: () => this.history(),
            
            // Get journal from latest
            journal: () => this.journal(),
            
            // Get diagnostics from latest
            diagnostics: () => this.diagnostics(),
            
            // Get totals from latest
            totals: () => this.totals(),
            
            // Get items from latest
            items: () => this.items(),
            
            // Get adjustments from latest
            adjustments: () => this.adjustments(),
            
            // Clear history
            clear: () => this.clear(),
            
            // Raw decisions array
            decisions: this.decisions,
            
            // Inspector instance
            inspector: this,
            
            // Version
            version: this.version,
            
            // Help message
            help: () => {
                console.log('🛠️ Cartique Inspector Commands:');
                console.log('  __cartique.latest()     - Get latest CommercialDecision');
                console.log('  __cartique.history()    - Get all decision history');
                console.log('  __cartique.journal()    - Get resolution journal');
                console.log('  __cartique.diagnostics()- Get diagnostics');
                console.log('  __cartique.totals()     - Get totals');
                console.log('  __cartique.items()      - Get items');
                console.log('  __cartique.adjustments()- Get adjustments');
                console.log('  __cartique.clear()      - Clear history');
                console.log('  __cartique.decisions    - Raw decisions array');
                console.log('  __cartique.inspector    - Inspector instance');
            }
        };

        // Auto-show help
        if (this.decisions.length === 0) {
            console.log('🛠️ Cartique Inspector ready. Use __cartique.help() for commands.');
        } else {
            console.log(`🛠️ Cartique Inspector: ${this.decisions.length} decisions recorded.`);
        }
    }

    /**
     * Disable the inspector
     */
    disable() {
        this.enabled = false;
        if (typeof window !== 'undefined' && window.__cartique) {
            delete window.__cartique;
        }
    }

    /**
     * Enable the inspector
     */
    enable() {
        this.enabled = true;
        if (typeof window !== 'undefined') {
            this.expose();
        }
    }
}
