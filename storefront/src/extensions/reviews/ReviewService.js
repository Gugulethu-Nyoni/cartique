/**
 * @semantq/storefront/extensions/reviews
 *
 * ReviewService — Review business logic
 *
 * Migrated from: cartique/storefront/src/Storefront.js
 * Phase 1: Pure extraction. No refactoring.
 *
 * TODO: Phase 2 — Connect to API backend.
 */

export default class ReviewService {
    constructor(context) {
        Object.assign(this, context);
    }

    /**
     * Submits a product review
     * @param {HTMLElement} form - The review form
     * @param {Object} product - The product
     */
    async submitReview(form, product) {
        const ratingInput = form.querySelector('input[name="rating"]:checked');
        const rating = ratingInput ? parseInt(ratingInput.value) : null;
        const comment = form.querySelector('#review-comment')?.value?.trim() || '';
        
        if (!rating) {
            alert('Please select a rating');
            return;
        }
        
        const payload = { productId: product.id, rating, comment: comment || null };
        
        if (this.callbacks?.onReviewSubmit) {
            this.callbacks.onReviewSubmit({
                ...payload,
                onSuccess: (result) => {
                    if (!product.reviews) product.reviews = [];
                    product.reviews.unshift({
                        id: Date.now(),
                        productId: result.productId,
                        customerId: result.customerId,
                        customer: result.customer || { id: result.customerId, name: 'You' },
                        rating: result.rating,
                        comment: result.comment,
                        status: result.status || 'approved',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    });
                    const reviewsTab = document.querySelector('[data-tab-content="reviews"]');
                    if (reviewsTab) reviewsTab.innerHTML = this.renderProductReviews(product);
                    form.reset();
                },
                onError: (error) => {
                    console.error('Review submission failed:', error);
                }
            });
            return;
        }
        
        this.submitReviewVanilla(payload, product);
        form.reset();
    }

    /**
     * Submits a review without callbacks
     * @param {Object} payload - The review data
     * @param {Object} product - The product
     */
    submitReviewVanilla(payload, product) {
        if (!product.reviews) product.reviews = [];
        product.reviews.unshift({
            id: Date.now(),
            productId: payload.productId,
            customerId: 0,
            customer: { id: 0, name: 'Guest' },
            rating: payload.rating,
            comment: payload.comment,
            status: 'approved',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        const reviewsTab = document.querySelector('[data-tab-content="reviews"]');
        if (reviewsTab) reviewsTab.innerHTML = this.renderProductReviews(product);
    }
}