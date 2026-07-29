/**
 * @semantq/storefront/extensions/reviews
 *
 * ReviewRenderer — Review presentation
 *
 * Migrated from: cartique/storefront/src/Storefront.js
 * Phase 1: Pure extraction. No refactoring.
 *
 * This is an extension — theme decides placement.
 */

export default class ReviewRenderer {
    constructor(context) {
        Object.assign(this, context);
    }

    /**
     * Renders product reviews tab
     * @param {Object} product - The product
     * @returns {string} HTML string
     */
    renderProductReviews(product) {
        const reviews = product.reviews || [];
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;
        
        const distribution = [5, 4, 3, 2, 1].map(star => ({
            star,
            count: reviews.filter(r => r.rating === star).length,
            percentage: reviews.length > 0 
                ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
                : 0
        }));
        
        return `
            <div class="product-reviews">
                <div class="reviews-summary">
                    <div class="reviews-average">
                        <span class="reviews-rating-number">${avgRating}</span>
                        <div class="reviews-stars">
                            ${this.renderStars(parseFloat(avgRating))}
                        </div>
                        <span class="reviews-count">${reviews.length} review${reviews.length !== 1 ? 's' : ''}</span>
                    </div>
                    ${this.features.reviews?.showRatingDistribution ? `
                    <div class="reviews-distribution">
                        ${distribution.map(d => `
                            <div class="distribution-row">
                                <span class="distribution-label">${d.star} ★</span>
                                <div class="distribution-bar">
                                    <div class="distribution-fill" style="width: ${d.percentage}%"></div>
                                </div>
                                <span class="distribution-count">${d.count}</span>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
                
                <div class="reviews-list">
                    ${reviews.length === 0 ? `
                        <p class="reviews-empty">No reviews yet. Be the first to review this product!</p>
                    ` : reviews.map(review => `
                        <div class="review-card">
                            <div class="review-header">
                                <div class="review-stars">
                                    ${this.renderStars(review.rating)}
                                </div>
                                <span class="review-date">${this.formatDate(review.createdAt)}</span>
                            </div>
                            <p class="review-author">${review.customer?.name || 'Anonymous'}</p>
                            ${review.comment ? `<p class="review-comment">${review.comment}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <div class="review-form-container">
                    <h4>Write a Review</h4>
                    <form id="review-form" class="review-form">
                        <input type="hidden" id="review-product-id" value="${product.id}">
                        <div class="review-rating-input">
                            <label>Your Rating:</label>
                            <div class="star-rating-input">
                                ${[5,4,3,2,1].map(star => `
                                    <input type="radio" id="star${star}" name="rating" value="${star}">
                                    <label for="star${star}" title="${star} star${star > 1 ? 's' : ''}">★</label>
                                `).join('')}
                            </div>
                        </div>
                        <div class="review-comment-input">
                            <label for="review-comment">Your Review:</label>
                            <textarea id="review-comment" name="comment" rows="4" placeholder="Share your experience with this product..."></textarea>
                        </div>
                        <button type="button" class="review-submit-btn" id="review-submit-btn">Submit Review</button>
                    </form>
                </div>
            </div>
        `;
    }

    /**
     * Renders star rating HTML
     * @param {number} rating - The rating value
     * @returns {string} HTML string
     */
    renderStars(rating) {
        const numRating = parseFloat(rating) || 0;
        const fullStars = Math.floor(numRating);
        const hasHalf = (numRating % 1) >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
        
        return `
            ${'<span class="star filled">★</span>'.repeat(fullStars)}
            ${hasHalf ? '<span class="star half">★</span>' : ''}
            ${'<span class="star empty">★</span>'.repeat(emptyStars)}
        `;
    }
}