/**
 * @semantq/storefront
 *
 * CouponService — Coupon validation and application
 *
 * NEW — Not migrated from Storefront.js.
 * Phase 1: Placeholder structure.
 *
 * TODO: Phase 2 — Implement coupon logic.
 */

export default class CouponService {
    constructor(context) {
        Object.assign(this, context);
    }

    validate(code) {
        // TODO: Phase 2 implementation
        return { valid: false, message: 'Coupon service not implemented' };
    }

    apply(cart, code) {
        // TODO: Phase 2 implementation
        return cart;
    }

    remove(cart) {
        // TODO: Phase 2 implementation
        return cart;
    }

    calculate(cart, coupon) {
        // TODO: Phase 2 implementation
        return { discount: 0 };
    }
}
