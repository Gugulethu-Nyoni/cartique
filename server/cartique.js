"use strict";

const CARTIQUE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

:root {
  --font-family: 'Poppins', sans-serif;
  --theme-primary: #ffffff;
  --theme-secondary: #f8f8f8;
  --theme-text: #222222;
  --theme-text-secondary: #666666;
  --theme-border: #e0e0e0;
  --theme-accent: #2a2a2a;
  --theme-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  --btn-bg: #ffffff;
  --btn-border: #000000;
  --btn-text: #000000;
  --btn-hover-bg: #000000;
  --btn-hover-text: #ffffff;
  --spv-btn-bg: #000000;
  --spv-btn-border: #ffffff;
  --spv-btn-text: #ffffff;
  --spv-btn-hover-bg: #ffffff;
  --spv-btn-hover-text: #000000;
  --cartique-accent: #000000;
}

[data-theme="dark"] {
  --theme-primary: #1a1a1a;
  --theme-secondary: #252525;
  --theme-text: #ffffff;
  --theme-text-secondary: #bbbbbb;
  --theme-border: #444444;
  --theme-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  --btn-bg: #000000;
  --btn-border: #ffffff;
  --btn-text: #ffffff;
  --btn-hover-bg: #ffffff;
  --btn-hover-text: #000000;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* =============================================
   LAYOUT
   ============================================= */
.cartique-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9fafb;
  font-family: var(--font-family);
  padding: 1rem;
}

.cartique-main-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cartique-full-width {
  width: 100% !important;
}

/* =============================================
   CONTROLS
   ============================================= */
.cartique-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--theme-primary);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: var(--theme-shadow);
}

.cartique-controls .cartique-search {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--theme-border);
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.cartique-controls .cartique-search:focus {
  border-color: var(--cartique-accent);
}

.cartique-controls .cartique-sort {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--theme-border);
  border-radius: 10px;
  font-size: 1rem;
  background-color: var(--theme-primary);
  cursor: pointer;
  outline: none;
  transition: border-color 0.3s ease;
}

.cartique-controls .cartique-sort:focus {
  border-color: var(--cartique-accent);
}

.cartique-view-toggles {
  display: flex;
  gap: 1rem;
}

.cartique-controls .cartique-view-toggle {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  background-color: var(--theme-border);
  color: var(--theme-text);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cartique-controls .cartique-view-toggle:hover {
  background-color: var(--cartique-accent);
  color: #fff;
}

/* Shopping Cart Icon */
.cartique-controls .shopping-cart-icon {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: var(--theme-primary);
  border: 1px solid var(--theme-border);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--theme-shadow);
  z-index: 999;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.cartique-controls .shopping-cart-icon:hover {
  background-color: var(--theme-secondary);
  transform: scale(1.1);
}

/* =============================================
   PRODUCT GRID
   ============================================= */
.cartique-product-displays {
  flex: 1;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cartique-product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 20px;
}

.cartique-product-grid .cartique_product_card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  padding: 0 0 60px 0;
}

.cartique-product-grid .cartique_product_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.cartique-product-grid .cartique_product_image_container {
  position: relative;
  margin: -4px -6px 0 -4px;
  padding-top: 66.67%;
  overflow: hidden;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: calc(100% + 5px);
  background: #f0f0f0;
}

.cartique-product-grid .cartique_product_image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  transform-origin: center;
}

.cartique_product_image:hover {
  transform: scale(1.2);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.cartique-product-grid .cartique_product_title {
  font-size: 18px;
  margin: 15px 15px 10px;
  color: #333;
  text-align: center;
}

.cartique-product-grid .cartique_product_description {
  font-size: 14px;
  color: #777;
  margin: 0 15px 10px;
  text-align: center;
}

.cartique-product-grid .currency-price-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px;
}

.cartique-product-grid .currency-price-display span {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.cartique-product-grid .cartique_product_price {
  font-size: 16px;
  color: #333;
  text-align: center;
}

.cartique-product-grid .cartique_saleprice_price {
  font-size: 16px;
  color: #ff4757;
  font-weight: bold;
  text-align: center;
}

.cartique-product-grid .cartique_cta {
  display: block;
  background-color: var(--cartique-accent);
  color: #fff;
  text-align: center;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  margin: 15px;
  transition: opacity 0.3s ease;
}

.cartique-product-grid .cartique_cta:hover {
  opacity: 0.9;
}

/* Slide Up Add to Cart */
.cartique-product-grid .slide.up {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 98%;
  background-color: var(--theme-primary);
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  transition: bottom 0.3s ease, border 0.3s ease, border-radius 0.3s ease;
  z-index: 1;
  margin-bottom: 10px;
}

.cartique-product-grid .cartique_product_card:hover .slide.up {
  bottom: 0;
  border: 1px solid var(--theme-border);
  border-radius: 8px;
}

/* Grid Add to Cart Button */
.cartique-product-grid .cartique_add_to_cart {
  width: 100%;
  padding: 10px;
  background-color: var(--btn-bg);
  color: var(--btn-text);
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  border: 0.5px solid var(--theme-border);
  border-radius: 10px;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  display: block;
  margin-left: auto;
  margin-right: auto;
  box-shadow: var(--theme-shadow);
}

.cartique-product-grid .cartique_product_card:hover .cartique_add_to_cart {
  opacity: 1;
  background-color: var(--cartique-accent);
  color: #fff;
  transform: translateY(0);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cartique-product-grid .cartique_add_to_cart:focus {
  outline: 0.5px solid var(--theme-border);
}

/* =============================================
   PRODUCT LIST VIEW
   ============================================= */
.cartique_product_listings .cartique_product_listing {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  background-color: var(--theme-primary);
  box-shadow: var(--theme-shadow);
  margin-bottom: 20px;
}

.cartique_product_listings .cartique_product_image_container {
  flex: 0 0 40%;
  max-width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
}

.cartique_product_listings .cartique_product_image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.cartique_product_listings .product-details-animate {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cartique_product_listings .cartique_product_title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--theme-text);
  margin: 0;
}

.cartique_product_listings .cartique_product_description {
  font-size: 1rem;
  color: var(--theme-text-secondary);
  margin: 0;
}

.cartique_product_listings .currency-price-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cartique_product_listings .cartique_product_price {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--theme-text);
}

.cartique_product_listings .cartique_saleprice_price {
  font-size: 1rem;
  color: var(--theme-text-secondary);
  text-decoration: line-through;
}

.cartique_product_listings .slide.up {
  margin-top: 10px;
}

/* List Add to Cart Button */
.cartique_product_listings .cartique_add_to_cart {
  background-color: var(--btn-bg);
  border: 2px solid var(--cartique-accent);
  color: var(--btn-text);
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cartique_product_listings .cartique_add_to_cart:hover {
  background-color: var(--cartique-accent);
  color: #fff;
}

/* =============================================
   SINGLE PRODUCT VIEW
   ============================================= */
#single-product-view-container {
  flex: 1;
  margin-bottom: 20px;
}

.single-product-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.product-content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.product-image-column {
  position: relative;
}

.product-image-column .product-image-container {
    position: relative;
    width: 100%;
    padding-top: 75%; /* 4:3 aspect ratio */
    overflow: hidden;
    border-radius: 8px;
    background: #f5f5f5;
}

.product-image-column img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain; /* CHANGED from cover to contain */
    border-radius: 8px;
    background: #f5f5f5;
}

.product-info-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-info-column h2 {
  font-size: 28px;
  margin-bottom: 15px;
  color: var(--theme-text);
}

.price-container {
  margin: 15px 0;
  font-size: 24px;
}

.sale-price {
  color: #e63946;
  font-weight: bold;
}

.original-price {
  text-decoration: line-through;
  color: #666;
  margin-right: 10px;
}

.product-description {
  margin-bottom: 30px;
  text-align: justify;
}

.product-meta {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* SPV Add to Cart Button */
.spv-cartique_add_to_cart {
  width: 100%;
  max-width: 300px;
  padding: 12px;
  background-color: var(--cartique-accent);
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  border: 0.5px solid var(--theme-border);
  border-radius: 10px;
  cursor: pointer;
  box-shadow: var(--theme-shadow);
  transition: all 0.2s ease;
  align-self: flex-start;
}

.spv-cartique_add_to_cart:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.back-to-products {
  background: none;
  border: none;
  color: var(--theme-text);
  cursor: pointer;
  margin-bottom: 30px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* =============================================
   PRODUCT TABS
   ============================================= */
.product-tabs-container {
  grid-column: 1 / -1;
  margin-top: 40px;
  border-top: 1px solid var(--theme-border);
  padding-top: 30px;
}

.product-tabs-header {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid var(--theme-border);
  margin-bottom: 20px;
}

.tab-button {
  background: none;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  color: var(--theme-text-secondary);
  position: relative;
  margin: 0 10px;
}

.tab-button.active {
  color: var(--theme-text);
  font-weight: bold;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--cartique-accent);
}

.tab-content {
  display: none;
  padding: 20px 0;
  line-height: 1.6;
}

.tab-content.active {
  display: block;
}

/* =============================================
   PRODUCT DETAILS TABLE
   ============================================= */
.product-details-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--theme-border);
}

.detail-key {
  font-weight: 600;
  color: var(--theme-text);
  text-transform: capitalize;
}

.detail-value {
  color: var(--theme-text-secondary);
}

/* =============================================
   PRODUCT REVIEWS
   ============================================= */
.product-reviews {
  font-family: var(--font-family);
  color: var(--theme-text);
}

.reviews-summary {
  display: flex;
  gap: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--theme-border);
  margin-bottom: 2rem;
}

.reviews-average {
  text-align: center;
  min-width: 120px;
}

.reviews-rating-number {
  font-size: 3rem;
  font-weight: 700;
  display: block;
  line-height: 1;
}

.reviews-stars {
  margin: 0.5rem 0;
}

.star {
  font-size: 1.2rem;
}

.star.filled {
  color: var(--cartique-accent);
}

.star.half {
  background: linear-gradient(90deg, var(--cartique-accent) 50%, #ccc 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.star.empty {
  color: #ccc;
}

.reviews-count {
  font-size: 0.85rem;
  color: var(--theme-text-secondary);
}

.reviews-distribution {
  flex: 1;
  max-width: 300px;
}

.distribution-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.distribution-label {
  font-size: 0.85rem;
  min-width: 35px;
}

.distribution-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.distribution-fill {
  height: 100%;
  background: var(--cartique-accent);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.distribution-count {
  font-size: 0.8rem;
  color: var(--theme-text-secondary);
  min-width: 20px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.review-card {
  padding: 1rem;
  border: 1px solid var(--theme-border);
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.review-date {
  font-size: 0.8rem;
  color: var(--theme-text-secondary);
}

.review-author {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.review-comment {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--theme-text-secondary);
}

.reviews-empty {
  text-align: center;
  padding: 2rem;
  color: var(--theme-text-secondary);
}

/* Review Form */
.review-form-container {
  border-top: 1px solid var(--theme-border);
  padding-top: 2rem;
}

.review-form-container h4 {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-rating-input label,
.review-comment-input label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.star-rating-input {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  gap: 0.25rem;
}

.star-rating-input input {
  display: none;
}

.star-rating-input label {
  font-size: 1.5rem;
  color: #ccc;
  cursor: pointer;
  transition: color 0.2s;
}

.star-rating-input input:checked ~ label,
.star-rating-input label:hover,
.star-rating-input label:hover ~ label {
  color: var(--cartique-accent);
}

.review-comment-input textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  font-family: var(--font-family);
  font-size: 0.95rem;
  resize: vertical;
  min-height: 100px;
}

.review-comment-input textarea:focus {
  outline: none;
  border-color: var(--cartique-accent);
}

.review-submit-btn {
  padding: 12px 24px;
  background-color: var(--cartique-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  align-self: flex-start;
}

.review-submit-btn:hover {
  opacity: 0.9;
}

/* =============================================
   CART SLIDER
   ============================================= */
.cart-slide {
  font-family: var(--font-family);
  position: fixed;
  top: 0;
  right: -100%;
  width: 350px;
  height: 100%;
  background-color: var(--theme-primary);
  box-shadow: -2px 0 15px var(--theme-shadow);
  transition: right 0.3s ease;
  z-index: 10000;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.cart-slide.open {
  right: 0;
}

.cart-close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 30px;
  color: var(--theme-text);
  cursor: pointer;
  z-index: 1001;
  transition: color 0.3s ease;
}

.cart-close-btn:hover {
  color: var(--cartique-accent);
}

.cart-header h2 {
  font-size: 22px;
  color: var(--theme-text);
  margin-bottom: 15px;
}

.cart-items {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 5px;
}

.cart-item {
  padding: 10px;
  border: 0px solid var(--theme-border);
  border-radius: 10px;
  background-color: var(--theme-secondary);
  color: var(--theme-text);
  box-shadow: var(--theme-shadow);
  transition: box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out;
  margin-bottom: 15px;
}

.cart-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.cart-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.cart-item-thumbnail img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.cart-item-details {
  flex-grow: 1;
  padding-left: 10px;
}

.cart-item-details h5 {
  font-size: 16px;
  margin: 0;
  color: var(--theme-text);
}

.cart-item-details p {
  font-size: 14px;
  margin: 5px 0;
  color: var(--theme-text-secondary);
}

.cart-item-details span {
  font-size: 14px;
  font-weight: bold;
  color: var(--theme-text);
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 5px;
}

.qty-btn {
  background: var(--cartique-accent);
  color: white;
  border: none;
  width: 25px;
  height: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.qty-btn:hover {
  opacity: 0.8;
}

.cart-item-quantity input {
  width: 35px;
  text-align: center;
  font-size: 14px;
  border: 1px solid var(--theme-border);
  padding: 5px;
  color: var(--theme-text);
  border-radius: 3px;
}

.cart-item-remove button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.cart-item-remove button:hover {
  color: red;
}

.cart-footer {
  padding-top: 10px;
  border-top: 1px solid var(--theme-border);
}

.cart-subtotal {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  color: var(--theme-text);
  margin-bottom: 10px;
}

/* Cart Footer Buttons */
.cart-footer .cart-btn {
  width: 100%;
  padding: 12px;
  background-color: var(--btn-bg);
  color: var(--btn-text);
  border: 0.5px solid var(--cartique-accent);
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 16px;
  font-family: var(--font-family);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.cart-footer .cart-btn:hover {
  background-color: var(--cartique-accent);
  color: #fff;
}

.cart-footer .cart-btn:focus {
  outline: 2px solid var(--theme-border);
}

.cart-footer a {
  text-transform: none;
  text-decoration: none;
}

/* Cart overlay */
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: none;
  z-index: 9999;
  transition: background 0.3s ease;
}

/* =============================================
   CART PAGE VIEW
   ============================================= */
.cartique-cart-page {
  width: 100%;
  background: var(--theme-primary);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: var(--theme-shadow);
  font-family: var(--font-family);
}

.cart-page-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--theme-border);
}

.cart-page-header h2 {
  font-size: 1.5rem;
  color: var(--theme-text);
  margin: 0;
}

.cart-page-back {
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--theme-text);
  cursor: pointer;
  padding: 0.5rem 0;
  transition: opacity 0.2s;
}

.cart-page-back:hover {
  opacity: 0.7;
}

.cart-page-empty {
  text-align: center;
  padding: 3rem 1rem;
}

.cart-page-empty-content {
  margin-top: 3rem;
}

.cart-page-empty-content p {
  font-size: 1.1rem;
  color: var(--theme-text-secondary);
  margin-bottom: 1.5rem;
}

.cart-page-back-btn {
  padding: 12px 24px;
  background-color: var(--btn-bg);
  color: var(--btn-text);
  border: 1px solid var(--btn-border);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cart-page-back-btn:hover {
  background-color: var(--cartique-accent);
  color: #fff;
}

.cart-page-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.cart-page-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  border: 1px solid var(--theme-border);
  border-radius: 10px;
  background: var(--theme-primary);
  transition: box-shadow 0.2s;
}

.cart-page-item:hover {
  box-shadow: var(--theme-shadow);
}

.cart-page-item-image {
  width: 100px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.cart-page-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-page-item-details {
  flex: 1;
}

.cart-page-item-details h3 {
  font-size: 1rem;
  color: var(--theme-text);
  margin: 0 0 0.25rem;
}

.cart-page-item-price {
  font-size: 0.95rem;
  color: var(--theme-text);
  margin: 0 0 0.75rem;
  font-weight: 600;
}

.cart-page-item-original {
  text-decoration: line-through;
  color: var(--theme-text-secondary);
  font-weight: 400;
  margin-left: 0.5rem;
  font-size: 0.85rem;
}

.cart-page-item-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-page-quantity {
  display: flex;
  align-items: center;
  border: 1px solid var(--theme-border);
  border-radius: 6px;
  overflow: hidden;
}

.cart-page-qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--theme-secondary);
  color: var(--theme-text);
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.cart-page-qty-btn:hover {
  background: var(--theme-border);
}

.cart-page-qty-input {
  width: 40px;
  height: 32px;
  text-align: center;
  border: none;
  border-left: 1px solid var(--theme-border);
  border-right: 1px solid var(--theme-border);
  font-size: 0.9rem;
  color: var(--theme-text);
  background: var(--theme-primary);
}

.cart-page-remove {
  background: none;
  border: none;
  color: #e63946;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
}

.cart-page-remove:hover {
  opacity: 0.7;
  text-decoration: underline;
}

.cart-page-item-total {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--theme-text);
  min-width: 80px;
  text-align: right;
}

.cart-page-footer {
  border-top: 1px solid var(--theme-border);
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.cart-page-subtotal {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--theme-text);
}

/* Cart Page Checkout Button */
.cart-page-checkout {
  width: 100%;
  max-width: 400px;
  padding: 14px;
  background-color: var(--cartique-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.cart-page-checkout:hover {
  opacity: 0.9;
}

.cart-page-continue {
  background: none;
  border: none;
  color: var(--theme-text);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: opacity 0.2s;
}

.cart-page-continue:hover {
  opacity: 0.7;
  text-decoration: underline;
}

/* =============================================
   TOAST NOTIFICATIONS
   ============================================= */
#toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 11000;
  pointer-events: none;
}

#toast-container .toast {
  position: relative;
  right: 0;
  border-radius: 8px;
  background: var(--theme-primary);
  border: 1px solid var(--theme-border);
  border-left: 5px solid var(--cartique-accent);
  padding: 16px 35px 16px 20px;
  box-shadow: var(--theme-shadow);
  transform: translateX(calc(100% + 30px));
  transition: transform 0.3s ease-in-out;
  opacity: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  max-width: 420px;
  font-family: var(--font-family);
}

#toast-container .toast.active {
  transform: translateX(0);
  opacity: 1;
  pointer-events: auto;
}

#toast-container .toast .toast-content {
  display: flex;
  align-items: center;
  width: 100%;
}

#toast-container .toast-content .svg {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  width: 35px;
  min-width: 35px;
  background-color: var(--cartique-accent);
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

#toast-container .toast-content .message {
  display: flex;
  flex-direction: column;
  margin: 0 16px;
  flex: 1;
}

#toast-container .message .text {
  font-size: 14px;
  font-weight: 400;
  color: var(--theme-text-secondary);
  line-height: 1.4;
}

#toast-container .message .text.text-1 {
  font-weight: 600;
  color: var(--theme-text);
  font-size: 15px;
}

#toast-container .toast .close {
  position: absolute;
  top: 10px;
  right: 12px;
  padding: 0;
  cursor: pointer;
  opacity: 0.4;
  color: var(--theme-text);
  background: none;
  border: none;
  font-size: 18px;
  line-height: 1;
  transition: opacity 0.2s;
}

#toast-container .toast .close:hover {
  opacity: 1;
}

#toast-container .toast .progress {
  display: none;
}

/* =============================================
   CARTIQUE MENU
   ============================================= */
#cartique-menu-anchor-top,
#cartique-menu-anchor-sidebar {
  position: relative;
  z-index: 100;
  margin-bottom: 20px;
  width: 100%;
}

.cartique-menu-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.cartique-menu-item,
.mega-item {
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  user-select: none;
}

.cat-count,
.count {
  font-size: 0.85em;
  opacity: 0.6;
  margin-left: 4px;
  font-weight: normal;
}

.type-inline .cartique-menu-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.type-inline .cartique-menu-item {
  background: #f5f5f5;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 14px;
  white-space: nowrap;
}

.type-inline .cartique-menu-item.active {
  background: var(--cartique-accent);
  color: #fff;
}

.type-inline .item-hidden {
  display: none;
}

.type-stacked .cartique-menu-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.type-stacked .menu-label {
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 10px 0;
  color: #666;
}

.type-stacked .cartique-menu-item {
  padding: 10px;
  border-radius: 4px;
}

.type-stacked .cartique-menu-item:hover {
  background: #f9f9f9;
}

.type-stacked .cartique-menu-item.active {
  background: #f0f0f0;
  font-weight: 600;
  color: var(--cartique-accent);
  border-left: 3px solid var(--cartique-accent);
}

.cartique-mega-wrapper {
  position: relative;
  width: 100%;
}

.mega-trigger {
  width: 100%;
  padding: 14px;
  background: #fff;
  border: 1px solid #ddd;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.mega-trigger::after {
  content: '▼';
  font-size: 10px;
  transition: transform 0.3s;
}

.cartique-mega-wrapper.is-open .mega-trigger::after {
  transform: rotate(180deg);
}

.mega-content {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 1000;
  border: 1px solid #ddd;
  border-top: none;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 24px;
  gap: 12px;
}

.cartique-mega-wrapper.is-open .mega-content {
  display: grid !important;
}

.mega-item {
  padding: 8px;
  border-radius: 4px;
}

.mega-item:hover {
  background: #f5f5f5;
}

.mega-item.active {
  color: var(--cartique-accent);
  font-weight: 700;
  background: #f0f0f0;
}

/* =============================================
   SIDEBAR SEARCH FILTER
   ============================================= */
.cartique-sidebar {
  width: 100%;
  max-width: 320px;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  margin-bottom: 1rem !important;
  position: -webkit-sticky;
  position: sticky;
  top: 20px;
  align-self: flex-start;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  z-index: 100;
}

.filter-section {
  margin-bottom: 10px;
}

.filter-divider {
  border: 0;
  border-top: 1px solid #f0f0f0;
  margin: 10px 0;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 15px;
  padding: 8px 0;
  cursor: pointer;
  user-select: none;
}

.filter-header .chevron {
  display: inline-block;
  transition: transform 0.3s ease;
}

.filter-header .chevron::after {
  content: '▲';
  font-size: 10px;
  display: block;
}

.filter-section.collapsed .chevron {
  transform: rotate(180deg);
}

.filter-section.collapsed .filter-content {
  display: none;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 250px;
  overflow-y: auto;
  padding: 5px 0;
}

.cartique-sidebar::-webkit-scrollbar {
  width: 4px;
}

.cartique-sidebar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.option-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;
}

.option-item:hover {
  color: var(--cartique-accent);
}

.option-item input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 1.5px solid #cbd5e0;
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
  background: #fff;
  transition: all 0.2s;
}

.option-item input:checked + .checkbox-custom {
  background: var(--cartique-accent);
  border-color: var(--cartique-accent);
}

.option-item input:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.mobile-filter-trigger {
  display: none;
}

.filter-close-btn {
  display: none;
}

/* =============================================
   INFINITE SCROLL
   ============================================= */
#cartique-scroll-sentinel {
  grid-column: 1 / -1;
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  transition: opacity 0.3s ease;
  visibility: hidden;
}

#cartique-scroll-sentinel.is-loading {
  visibility: visible;
}

#cartique-scroll-sentinel.is-loading::after {
  content: "Loading more products...";
  font-size: 14px;
  color: #888;
  margin-left: 10px;
}

.cartique-loader {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--cartique-accent);
  border-radius: 50%;
  animation: cartique-spin 0.8s linear infinite;
  display: none;
}

#cartique-scroll-sentinel.is-loading .cartique-loader {
  display: block;
}

@keyframes cartique-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.cartique-fade-in {
  opacity: 0;
  transform: translateY(15px);
  animation: cartique-entrance 0.5s ease forwards;
}

@keyframes cartique-entrance {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =============================================
   SHOPPING CART EMPTY STATE
   ============================================= */
#shopping-cart-empty {
  display: none;
  font-family: var(--font-family);
  color: var(--theme-text);
  background-color: var(--theme-secondary);
  border: 1px solid var(--theme-border);
  padding: 10px;
  border-radius: 5px;
  box-shadow: var(--theme-shadow);
  font-size: 16px;
  text-align: center;
  margin: 20px 0;
}

#shopping-cart-empty.show {
  display: block;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Hide cart item templates */
.cart-item-template {
  display: none !important;
}

/* =============================================
   PRODUCT FOOTER
   ============================================= */
.cartique-product-footer {
  padding: 1.5rem;
  background-color: #ffffff;
  text-align: center;
  margin-top: auto;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  order: 999;
}

/* =============================================
   RESPONSIVE - DESKTOP
   ============================================= */
@media (min-width: 769px) {
  .cartique-container {
    flex-direction: row;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .cartique-sidebar {
    width: 30%;
    margin-bottom: 0;
  }

  .cartique-main-content {
    width: 70%;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .cartique-main-content.cartique-full-width {
    width: 100%;
  }

  .cartique-controls {
    flex-direction: row;
  }

  .cartique-controls .cartique-search {
    flex: 1;
  }

  .cartique-controls .cartique-sort {
    width: auto;
  }

  .cartique-view-toggles {
    flex: 0;
  }

  .cartique-mega-wrapper:hover .mega-content {
    display: grid !important;
  }
}

/* =============================================
   RESPONSIVE - TABLET
   ============================================= */
@media (max-width: 1024px) {
  .cartique-product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* =============================================
   RESPONSIVE - MOBILE
   ============================================= */
@media (max-width: 768px) {
  .cartique-product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cartique-controls .shopping-cart-icon {
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
  }

  .cartique_product_listings .cartique_product_listing {
    flex-direction: column;
    gap: 15px;
  }

  .cartique_product_listings .cartique_product_image_container {
    flex: 0 0 auto;
    max-width: 100%;
  }

  .cartique_product_listings .cartique_product_image {
    height: auto;
  }

  .cartique_product_listings .product-details-animate {
    gap: 6px;
  }

  .cartique_product_listings .cartique_product_title {
    font-size: 1.25rem;
  }

  .cartique_product_listings .cartique_product_description {
    font-size: 0.9rem;
  }

  .cartique_product_listings .cartique_product_price {
    font-size: 1.1rem;
  }

  .cartique_product_listings .cartique_saleprice_price {
    font-size: 0.9rem;
  }

  .cartique_product_listings .cartique_add_to_cart {
    width: 100%;
    padding: 12px 20px;
  }

  .cart-slide {
    width: 100%;
  }

  .cart-header h2 {
    font-size: 18px;
  }

  .cart-item-thumbnail img {
    width: 40px;
    height: 40px;
  }

  .cart-item-details h5 {
    font-size: 14px;
  }

  .cart-item-details p {
    font-size: 12px;
  }

  .qty-btn {
    width: 20px;
    height: 20px;
    font-size: 14px;
  }

  .cart-footer .cart-btn {
    font-size: 14px;
    padding: 10px;
  }

  .product-content-wrapper {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .spv-cartique_add_to_cart {
    max-width: 100%;
  }

  .reviews-summary {
    flex-direction: column;
    gap: 1.5rem;
  }

  .reviews-average {
    text-align: left;
  }

  .reviews-distribution {
    max-width: 100%;
  }

  .cartique-cart-page {
    padding: 1rem;
  }

  .cart-page-item {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .cart-page-item-image {
    width: 80px;
    height: 60px;
  }

  .cart-page-item-total {
    width: 100%;
    text-align: left;
    padding-left: 92px;
  }

  .cart-page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .cart-page-subtotal,
  .cart-page-checkout {
    max-width: 100%;
  }

  .type-stacked .cartique-menu-list {
    align-items: center;
    text-align: center;
  }

  .type-stacked .menu-label {
    width: 100%;
    text-align: center;
  }

  .type-stacked .cartique-menu-item {
    width: 100%;
    max-width: 320px;
  }

  .type-stacked .cartique-menu-item.active {
    border-left: none;
    border-bottom: 2px solid var(--cartique-accent);
    border-radius: 0;
  }

  .mobile-collapse.type-inline .cartique-menu-list {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 10px;
    -webkit-overflow-scrolling: touch;
  }

  .mobile-collapse.type-inline .item-hidden {
    display: block;
  }

  .mega-content {
    position: relative;
    top: 0;
    box-shadow: none;
    border: 1px solid #eee;
    grid-template-columns: 1fr 1fr !important;
    padding: 15px;
  }

  .cartique-mega-wrapper:not(.is-open) .mega-content {
    display: none !important;
  }

  #toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }

  #toast-container .toast {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .cartique-product-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

/* =============================================
   MOBILE FILTER SIDEBAR
   ============================================= */
@media (max-width: 767px) {
  .cartique-sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 100%;
    max-width: 100%;
    height: 100vh;
    max-height: 100vh;
    margin: 0;
    border-radius: 0;
    z-index: 9999;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 1.5rem;
    box-sizing: border-box;
    background: #fff;
    box-shadow: none;
  }

  .cartique-sidebar.is-active {
    left: 0;
  }

  .mobile-filter-trigger {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: var(--cartique-accent);
    color: #ffffff;
    align-items: center;
    justify-content: center;
    z-index: 9998;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
  }

  .filter-close-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-bottom: 20px;
    font-weight: 700;
    font-size: 18px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 20px;
    cursor: pointer;
    color: #000;
  }
}

/* =============================================
   Z-INDEX LAYERING SYSTEM
   ============================================= */
.shopping-cart-icon {
  z-index: 999 !important;
}

#toast-container .toast:not(.active) {
  pointer-events: none;
}

.cartique-mega-wrapper .mega-content {
  z-index: 1000 !important;
}

.cart-slide {
  z-index: 10000 !important;
}

.cart-overlay {
  z-index: 9999 !important;
}

@media (max-width: 767px) {
  .cartique-sidebar.is-active {
    z-index: 9999 !important;
  }

  .mobile-filter-trigger {
    z-index: 9998 !important;
  }

  .cart-slide.open {
    z-index: 10000 !important;
  }

  .cart-overlay {
    z-index: 9999 !important;
  }
}
`;



export default class Cartique {
 constructor(products, features = {}, callbacks = {}) {
    // 1. Validation
    if (!products || !Array.isArray(products)) {
        throw new Error('Cartique requires an array of products');
    }

    // 2. Default Configuration & Feature Merging
    this.defaultFeatures = {
        grid: true,
        pagination: true,
        columns: 3,
        rows: 10,
        sidebar: true,
        footer: true,
        search: true,
        sorting: true,
        sale: false,
        theme: 'light',
        themeColor: '#2a2a2a', 
        containerId: 'cartique',
        containerClass: 'cartique-container',
        checkoutUrl: '#',
        checkoutUrlMode: 'self',
        sidebarDisplay: 'block',
        footerDisplay: 'block',
        menu: {
            enabled: false,
            type: 'inline', // 'mega', 'inline', 'stacked'
            position: 'top', // 'top', 'sidebar', 'custom'
            containerId: 'cartique-catalogue-menu',
            label: 'Categories',
            showCounts: true,
            megaMenuColumns: 3
        },
        sidebarFeatures: {
            filters: {}, // Dynamically injected from extractVariantFilters
        }
    };

    // Deep merge to ensure nested objects like sidebarFeatures aren't overwritten
    this.features = this.deepMerge(this.defaultFeatures, features);
    this.currencySymbol = this.features.currencySymbol || '$';


    // 3. Data State Management
    this.products = products;
    this.filteredProducts = [...products];
    this.categories = this._extractCategories(); 
    
    // UI State Tracking
    this.currentSearchQuery = '';
    this.currentSortType = '';
    this.currentLayout = 'grid';
    this.activeCategoryId = null;
    this.activeFilters = {}; // Key format: { color: Set(['Red']), size: Set(['XL']) }
    this.singleProductViewActive = false;
    this.previousViewState = null;

    // 4. Component Lifecycle References
    this.container = null;
    this.templateHolder = null;
    this.eventListeners = new Map();
    
    // Cleanup Timers
    this.toastTimer1 = null;
    this.toastTimer2 = null;
    this.redirectTimer = null;

    this.itemsPerBatch = this.features.itemsPerPage || 12;
    this.loadedCount = this.itemsPerBatch;

    this.callbacks = callbacks || {};

    // 5. Fire off the Engine
    this.init();
}


/* FILTERS AND SHOP MENU CAT BASED PAGES SIMULATION */

injectCSS() {
    // Prevent duplicate injection
    if (document.getElementById('cartique-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'cartique-styles';
    style.textContent = `
        /* Critical render styles */
        #${this.features.containerId} {
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .cartique-container {
            position: relative;
            min-height: 100vh;
        }
        
        /* Main Cartique CSS */
        ${CARTIQUE_CSS}
    `;
    document.head.appendChild(style);
}


applyTheme() {
    // Set accent color
    const accentColor = this.features.themeColor || '#2a2a2a';
    document.documentElement.style.setProperty('--cartique-accent', accentColor);
    document.documentElement.style.setProperty('--theme-accent', accentColor);
    
    // Set theme mode (light/dark)
    const themeMode = this.features.theme === 'dark' ? 'dark' : 'light';
    const containerElement = document.getElementById(this.features.containerId);
    if (containerElement) {
        containerElement.setAttribute('data-theme', themeMode);
    }
}



applyAllFilters() {
    this.filteredProducts = this.products.filter(product => {
        // 1. Category Filter (from mega menu ID OR sidebar name)
        let matchesCategory = true;
        
        // Check mega menu category (by ID)
        if (this.activeCategoryId) {
            matchesCategory = product.categories?.some(
                c => String(c.id) === String(this.activeCategoryId)
            );
        }
        
        // Check sidebar category filter (by name) - AND logic with mega menu
        if (matchesCategory && this.activeFilters['category']?.length > 0) {
            const productCategoryNames = product.categories?.map(c => c.name) || [];
            matchesCategory = this.activeFilters['category'].some(
                catName => productCategoryNames.includes(catName)
            );
        }

        if (!matchesCategory) return false;

        // 2. Search Query Filter
        const query = this.currentSearchQuery;
        const matchesSearch = !query || 
            (product.title?.toLowerCase().includes(query) || 
             product.description?.toLowerCase().includes(query));

        if (!matchesSearch) return false;

        // 3. Sidebar Attribute Filters (excluding 'category' which we already handled)
        const attributeFilters = Object.entries(this.activeFilters).filter(
            ([key]) => key !== 'category'
        );
        
        const matchesAttributes = attributeFilters.every(([key, selectedValues]) => {
            if (!selectedValues || !selectedValues.length) return true;
            
            if (key === 'priceRange') {
                const effectivePrice = product.sale_price || product.price || 
                    Math.min(...(product.variants?.map(v => v.sale_price || v.price) || [product.price]));
                return selectedValues.some(rangeLabel => this._checkPriceMatch(effectivePrice, rangeLabel));
            }

            return product.variants?.some(variant => 
                variant.attributes?.some(attr => 
                    attr.key.toLowerCase() === key.toLowerCase() && 
                    selectedValues.includes(attr.value)
                )
            );
        });

        return matchesAttributes;
    });

    this.loadedCount = 0;
    this.renderProductDisplays();
}





_attachMenuEvents(container) {
    const selectors = '.cartique-menu-item, .mega-item';
    
    container.querySelectorAll(selectors).forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const catId = item.getAttribute('data-cat-id');
            const catName = item.querySelector('.cat-name')?.textContent;
            
            this.activeCategoryId = (catId === 'all') ? null : catId;

            // Close Mega Menu
            const wrapper = container.querySelector('.cartique-mega-wrapper');
            if (wrapper) wrapper.classList.remove('is-open');

            // FIX: Sync sidebar category checkboxes
            if (catId === 'all') {
                // Uncheck all category checkboxes in sidebar
                document.querySelectorAll('input[data-type="category"]').forEach(cb => {
                    cb.checked = false;
                });
                // Clear category from activeFilters
                delete this.activeFilters['category'];
            }

            this.renderCatalogueMenu();
            this.applyAllFilters();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const wrapper = container.querySelector('.cartique-mega-wrapper');
            if (wrapper) wrapper.classList.remove('is-open');
        }
    });
}

/* END SHOP CATS/MENU FUNCTIONALITY ISSUES */



/* CARTIQUE MENU IMPLEMENTATION */

_extractCategories() {
    const catMap = new Map();
    this.products.forEach(product => {
        product.categories?.forEach(cat => {
            if (!catMap.has(cat.id)) {
                catMap.set(cat.id, { id: cat.id, name: cat.name, count: 0 });
            }
            catMap.get(cat.id).count++;
        });
    });
    return Array.from(catMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}


async renderCatalogueMenu() {
    // 1. Get config and set defaults if keys are missing
    const cfg = this.features.menu;
    if (!cfg || !cfg.enabled) return;

    // Set Defaults: type -> mega, position -> top
    const menuType = cfg.type || 'mega';
    const menuPosition = cfg.position || 'top';
    const menuColumns = cfg.megaMenuColumns || 3;

    // 2. Determine Target Container using the defaulted position
    let anchor;
    if (menuPosition === 'custom' && cfg.containerId) {
        anchor = document.getElementById(cfg.containerId);
    } else {
        const anchorId = menuPosition === 'sidebar' ? 'cartique-menu-anchor-sidebar' : 'cartique-menu-anchor-top';
        anchor = document.getElementById(anchorId);
    }
    
    if (!anchor) return;

    const categories = this.categories || this._extractCategories();
    const activeId = String(this.activeCategoryId || 'all');
    
    let innerHtml = '';

    // Use menuType variable instead of cfg.type
    if (menuType === 'mega') {
        innerHtml = `
            <div class="cartique-mega-wrapper">
                <button class="mega-trigger" aria-expanded="false">
                    ${cfg.label || 'Categories'} <span class="chevron"></span>
                </button>
                <div class="mega-content" style="grid-template-columns: repeat(${menuColumns}, 1fr);">
                    <div class="mega-item ${activeId === 'all' ? 'active' : ''}" data-cat-id="all">
                        <strong>All Products</strong>
                    </div>
                    ${categories.map(cat => `
                        <div class="mega-item ${activeId === String(cat.id) ? 'active' : ''}" data-cat-id="${cat.id}">
                            <span class="cat-name">${cat.name}</span>
                            ${cfg.showCounts ? `<span class="count">(${cat.count})</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>`;
    } else {
        const isInline = menuType === 'inline';
        innerHtml = `
            <div class="cartique-menu-container type-${menuType} ${cfg.collapseOnMobile ? 'mobile-collapse' : ''}">
                <ul class="cartique-menu-list">
                    ${!isInline ? `<li class="menu-label">${cfg.label || 'Categories'}</li>` : ''}
                    <li class="cartique-menu-item ${activeId === 'all' ? 'active' : ''}" data-cat-id="all">All</li>
                    ${categories.map((cat, index) => `
                        <li class="cartique-menu-item ${activeId === String(cat.id) ? 'active' : ''} 
                            ${isInline && index >= (cfg.maxVisibleItems || 5) ? 'item-hidden' : ''}" 
                            data-cat-id="${cat.id}">
                            <span class="cat-name">${cat.name}</span>
                            ${cfg.showCounts ? `<span class="cat-count">(${cat.count})</span>` : ''}
                        </li>
                    `).join('')}
                </ul>
            </div>`;
    }

    anchor.innerHTML = innerHtml;
    this._attachMenuEvents(anchor);
    
    // Toggle Logic for Mega
    // Toggle Logic for Mega
if (menuType === 'mega') {
    const wrapper = anchor.querySelector('.cartique-mega-wrapper');
    const trigger = anchor.querySelector('.mega-trigger');
    
    // Remove existing listeners to prevent duplicates
    const newTrigger = trigger.cloneNode(true);
    trigger.parentNode.replaceChild(newTrigger, trigger);
    
    newTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        wrapper.classList.toggle('is-open');
    });
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('is-open');
        }
    });
}


}


_resolveMenuContainer(menu) {
    // Priority 1: Custom ID provided in HTML
    if (menu.position === 'custom' && menu.containerId) {
        let customEl = document.getElementById(menu.containerId);
        if (!customEl) {
            console.warn(`Cartique: #${menu.containerId} not found. Creating placeholder.`);
            customEl = document.createElement('div');
            customEl.id = menu.containerId;
            this.container.prepend(customEl); // Fallback placement
        }
        return customEl;
    }

    // Priority 2: Injected into the Sidebar
    if (menu.position === 'sidebar') {
        return this.container.querySelector('.cartique-sidebar-inner');
    }

    // Priority 3: Default Top Position
    return this.container.querySelector('.cartique-header-nav');
}



applyFilters() {
    this.filteredProducts = this.products.filter(product => {
        // 1. Category Filter
        const matchesCategory = !this.activeCategoryId || 
            product.categories.some(c => c.id === parseInt(this.activeCategoryId));

        // 2. Variant Attribute Filter
        const matchesAttributes = Object.entries(this.activeFilters).every(([key, selectedValues]) => {
            if (!selectedValues.length) return true;
            
            // Check if any variant has an attribute matching the selected filters
            return product.variants?.some(variant => 
                variant.attributes.some(attr => 
                    attr.key.toLowerCase() === key.toLowerCase() && 
                    selectedValues.includes(attr.value)
                )
            );
        });

        return matchesCategory && matchesAttributes;
    });

    this.renderProducts();
}



_attachMenuEvents(container) {
    // 1. Handle Category Selection (Pills, List Items, and Mega Items)
    const selectors = '.cartique-menu-item, .mega-item';
    
    container.querySelectorAll(selectors).forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const catId = item.getAttribute('data-cat-id');
            
            // Update the active state in the class
            this.activeCategoryId = (catId === 'all') ? null : catId;

            // UI: Close Mega Menu if it's open
            const wrapper = container.querySelector('.cartique-mega-wrapper');
            if (wrapper) {
                wrapper.classList.remove('is-open');
            }

            // UI: Re-render the menu to show the new "active" state
            this.renderCatalogueMenu();

            // TRIGGER FILTER: Call your existing filter/search logic
            // Note: Replace 'handleSearch' with your actual product filtering method name
            if (typeof this.handleSearch === 'function') {
                this.handleSearch();
            } else if (typeof this.renderProductDisplays === 'function') {
                this.renderProductDisplays();
            }
        });
    });

    // 2. Accessibility: Close Mega Menu on 'Escape' key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const wrapper = container.querySelector('.cartique-mega-wrapper');
            if (wrapper) wrapper.classList.remove('is-open');
        }
    });
}

/* END CARTIQUE MENU IMPLEMENTATION */









/* ==========================================================
   START SECTION: SIDEBAR SEARCH FILTERS
   ========================================================== */


renderFilterSidebar(filterGroups) {
    const sidebar = document.getElementById('cartique-sidebar-component');
    if (!sidebar) return;

    // 1. Static Price Section
    let html = `
        <div class="filter-group price-group">
            <div class="filter-header">
                <span>Price</span>
                <span class="chevron"></span>
            </div>
            <div class="price-slider-wrapper">
                 <div class="range-input">
                    <input type="range" class="range-min" min="0" max="1000" value="0">
                    <input type="range" class="range-max" min="0" max="1000" value="1000">
                 </div>
                 <div class="slider-track"></div>
            </div>
        </div>
        <hr class="sidebar-divider">
    `;

    // 2. Dynamic Content-Agnostic Sections
    html += filterGroups.map(group => `
        <div class="filter-group" data-filter-type="${group.id}">
            <div class="filter-header collapsible" onclick="this.parentElement.classList.toggle('is-collapsed')">
                <span>${group.label}</span>
                <span class="chevron"></span>
            </div>
            <div class="filter-content">
                <div class="filter-search-container">
                    <span class="search-icon">🔍</span>
                    <input type="text" class="filter-search-input" placeholder="Search" onkeyup="filterList(this)">
                </div>
                <div class="filter-meta">Showing ${group.options.length} of ${group.options.length} options</div>
                <div class="filter-options-list">
                    ${group.options.map(opt => `
                        <label class="filter-option">
                            <div class="checkbox-wrapper">
                                <input type="checkbox" data-value="${opt.value}">
                                <span class="checkmark"></span>
                            </div>
                            <span class="option-name">${opt.label}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        </div>
        <hr class="sidebar-divider">
    `).join('');

    sidebar.innerHTML = html;
}




/* ==========================================================
   START SECTION: SIDEBAR SEARCH FILTERS
   ========================================================== */


renderSidebarFilters() {
    const container = document.getElementById('cartique-filter-sidebar');
    if (!container) return;

    const filters = { ...this.features.sidebarFeatures.filters };
    let finalHTML = '';

    // FIX: Add categories as the first filter group if sidebar is enabled
    if (this.categories && this.categories.length > 0) {
        const categoryNames = this.categories.map(cat => cat.name).sort();
        finalHTML += this.generateFilterHTML('category', categoryNames);
    }

    // Handle Price Range
    if (filters.priceRange) {
        finalHTML += this.generateFilterHTML('priceRange', filters.priceRange);
        delete filters.priceRange;
    }

    // Handle everything else dynamically
    finalHTML += Object.entries(filters).map(([group, options]) => {
        return this.generateFilterHTML(group, options);
    }).join('');

    container.innerHTML = finalHTML;

    // Attach event listener
    container.addEventListener('change', (e) => {
        if (e.target.matches('input[type="checkbox"]')) {
            this.handleFilterChange(e.target);
        }
    });
}


// Helper method to keep the code DRY and avoid "wrecking" the working template
generateFilterHTML(group, options) {
    const title = group.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return `
        <div class="filter-section collapsed" data-filter-group="${group}">
            <div class="filter-header" onclick="this.parentElement.classList.toggle('collapsed')">
                ${title}
                <span class="chevron"></span>
            </div>
            <div class="filter-content">
                <div class="options-list">
                    ${options.map(val => `
                        <label class="option-item">
                            <input type="checkbox" data-type="${group}" value="${val}">
                            <span class="checkbox-custom"></span>
                            ${val}
                        </label>
                    `).join('')}
                </div>
            </div>
        </div>
        <hr class="filter-divider">
    `;
}


handleFilterChange(element) {
    const activeFilters = {};
    const checkedBoxes = document.querySelectorAll('.option-item input:checked');

    // Map current state from UI
    checkedBoxes.forEach(cb => {
        const type = cb.dataset.type;
        if (!activeFilters[type]) activeFilters[type] = [];
        activeFilters[type].push(cb.value);
    });

    // Store active filters and apply all filters together
    this.activeFilters = activeFilters;
    this.applyAllFilters();
}


_checkPriceMatch(price, label) {
    // Extract all numbers from the string (e.g., "R100-R200" -> [100, 200])
    const numbers = label.match(/\d+/g)?.map(Number);
    if (!numbers) return false;
    
    if (label.includes('Under')) {
        return price < numbers[0];
    }
    if (label.includes('Over')) {
        return price > numbers[0];
    }
    if (numbers.length === 2) {
        // Range case: e.g., "R100-R200"
        return price >= numbers[0] && price <= numbers[1];
    }
    return false;
}





applyFilters(activeFilters) {
    const hasActiveFilters = Object.keys(activeFilters).length > 0;

    if (!hasActiveFilters) {
        // If nothing is checked, show everything
        this.filteredProducts = [...this.allProducts];
    } else {
        this.filteredProducts = this.allProducts.filter(product => {
            // A product must match AT LEAST ONE value in EVERY active group (AND logic between groups)
            return Object.entries(activeFilters).every(([group, selectedValues]) => {
                const productValue = product[group]; 
                return selectedValues.includes(productValue);
            });
        });
    }

    // 3. Re-render the Catalogue
    this.renderProductDisplays(); 
}

/// MOBILE FILTERS 

/* CONSOLIDATED SIDEBAR & FILTER LOGIC 
   Place these methods within your main Product Gallery Class 
*/

/**
 * 1. INITIALIZE MOBILE UI
 * Call this once during your class constructor or init()
 */
initMobileFilters() {
    const sidebar = document.getElementById('cartique-sidebar');
    if (!sidebar) return;

    // Add Mobile Trigger Bar to Body if it doesn't exist
    if (!document.querySelector('.mobile-filter-trigger')) {
        const trigger = document.createElement('div');
        trigger.className = 'mobile-filter-trigger';
        trigger.innerHTML = `Filter Products`;
        trigger.onclick = () => this.toggleMobileSidebar(true);
        document.body.appendChild(trigger);
    }

    // Add Close Button/Header to Sidebar if it doesn't exist
    if (!sidebar.querySelector('.filter-close-btn')) {
        const closeHeader = document.createElement('div');
        closeHeader.className = 'filter-close-btn';
        closeHeader.innerHTML = `
            <span>Filters</span>
            <span style="font-size: 24px;">&times;</span>
        `;
        closeHeader.onclick = () => this.toggleMobileSidebar(false);
        sidebar.prepend(closeHeader);
    }
}

/**
 * 2. TOGGLE SIDEBAR VISIBILITY
 * Handles the "is-active" class and body scrolling
 */
toggleMobileSidebar(open) {
    const sidebar = document.getElementById('cartique-sidebar');
    if (!sidebar) return;

    if (open) {
        sidebar.classList.add('is-active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        sidebar.classList.remove('is-active');
        document.body.style.overflow = ''; // Restore background scrolling
    }
}

/**
 * 3. UPDATE EVENT LISTENERS
 * Connects checkbox changes to the "slide away" behavior
 */
setupFilterEventListeners() {
    const sidebar = document.getElementById('cartique-sidebar');
    if (!sidebar) return;

    sidebar.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            // A. RUN YOUR FILTERING LOGIC
            // Ensure this function processes your 'filteredProducts' array
            this.handleFilterChange(e); 

            // B. MOBILE-SPECIFIC: Slide away after checking
            if (window.innerWidth <= 767) {
                // 400ms delay allows user to see the "check" before it slides
                setTimeout(() => {
                    this.toggleMobileSidebar(false);
                }, 400);
            }
        }
    });
}

/**
 * 4. CLEAR ALL FILTERS
 * Ensures state is cleared and DOM is updated
 */
clearAllFilters() {
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('#cartique-filter-sidebar input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = false;
    });

    // Reset internal state
    this.activeFilters = {}; 
    this.filteredProducts = null; // Revert to original product list
    this.loadedCount = 0; // Reset infinite scroll

    // Re-render
    const layout = this.currentLayout || 'grid';
    this.renderProducts(layout, this.products);

    // If on mobile, stay open so user can see it cleared, or close manually
    console.log("Filters cleared, state reset.");
}


renderMobileUI() {
    const sidebar = document.getElementById('cartique-sidebar');
    const sidebarComponent = document.getElementById('cartique-sidebar-component');
    
    // 1. Inject the Bottom Filter Bar (The Trigger)
    if (!document.querySelector('.mobile-filter-trigger')) {
        const filterBar = document.createElement('div');
        filterBar.className = 'mobile-filter-trigger';
        filterBar.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 6h16M7 12h10M10 18h4"/>
                </svg>
                FILTER
            </div>
        `;
        filterBar.onclick = () => this.toggleMobileSidebar(true);
        document.body.appendChild(filterBar);
    }

    // 2. Inject the Sidebar Mobile Header (Title + Close + Clear)
    if (sidebar && !document.querySelector('.filter-mobile-header')) {
        const header = document.createElement('div');
        header.className = 'filter-mobile-header';
        header.innerHTML = `
            <span style="font-weight: 800; font-size: 1.2rem;">Filters</span>
            <div style="display: flex; gap: 20px; align-items: center;">
                <button onclick="window.galleryInstance.clearAllFilters()" 
                        style="background:none; border:none; color:#888; text-decoration:underline; font-size:12px; cursor:pointer;">
                    Clear All
                </button>
                <span onclick="window.galleryInstance.toggleMobileSidebar(false)" 
                      style="font-size: 28px; cursor: pointer; line-height: 1;">&times;</span>
            </div>
        `;
        sidebar.prepend(header);
    }
}

/* ==========================================================
   END SECTION: SIDEBAR SEARCH FILTERS
   ========================================================== */



/* ==========================================================
   START SECTION: INFINITE SCROLL
   ========================================================== */

setupInfiniteScroll() {
    // Clean up previous observer if it exists
    if (this.observer) this.observer.disconnect();

    // Determine which container is active
    const layout = this.currentLayout || 'grid';
    const gridContainer = document.getElementById('cartique-product-grid');
    const listContainer = document.getElementById('cartique-product-list');
    const activeContainer = layout === 'grid' ? gridContainer : listContainer;
    
    if (!activeContainer) return;

    // Remove existing sentinel if any
    const existingSentinel = document.getElementById('cartique-scroll-sentinel');
    if (existingSentinel) {
        existingSentinel.remove();
    }

    // Create a new sentinel inside the active product container
    const sentinel = document.createElement('div');
    sentinel.id = 'cartique-scroll-sentinel';
    sentinel.style.cssText = 'grid-column: 1/-1; height: 50px; display: flex; align-items: center; justify-content: center; width: 100%;';
    activeContainer.appendChild(sentinel);

    this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            this.loadMoreProducts();
        }
    }, { rootMargin: '200px' });

    this.observer.observe(sentinel);
}


loadMoreProducts() {
    console.group("🚀 Infinite Scroll: Loading Batch");
    
    const productsSource = this.filteredProducts || this.products;
    const sentinel = document.getElementById('cartique-scroll-sentinel');

    // Safety guard
    if (this.loadedCount >= productsSource.length) {
        if (this.observer) this.observer.disconnect();
        if (sentinel) {
            sentinel.classList.remove('is-loading');
            sentinel.style.display = 'none'; 
        }
        console.groupEnd();
        return;
    }

    // Get the active container
    const layout = this.currentLayout || 'grid';
    const container = layout === 'grid' 
        ? document.getElementById('cartique-product-grid')
        : document.getElementById('cartique-product-list');
    
    if (!container) {
        console.groupEnd();
        return;
    }

    const nextBatch = productsSource.slice(
        this.loadedCount, 
        this.loadedCount + this.itemsPerBatch
    );

    if (sentinel) {
        sentinel.classList.add('is-loading');
        sentinel.innerHTML = '<div class="cartique-loader"></div>';
    }

    setTimeout(() => {
        const fragment = document.createDocumentFragment();

        nextBatch.forEach(product => {
            const el = (layout === 'grid') 
                ? this.createProductCard(product) 
                : this.createProductListing(product);
            
            if (el) {
                el.classList.add('cartique-fade-in');
                fragment.appendChild(el);
            }
        });

        // Insert BEFORE the sentinel so it stays at the bottom
        container.insertBefore(fragment, sentinel);
        
        this.loadedCount += nextBatch.length;
        
        if (sentinel) {
            sentinel.classList.remove('is-loading');
            sentinel.innerHTML = ''; 
        }

        if (this.loadedCount >= productsSource.length) {
            console.log("End of catalog reached. Disconnecting observer.");
            if (this.observer) this.observer.disconnect();
            if (sentinel) sentinel.style.display = 'none';
        }
        
        console.log(`Success: Added ${nextBatch.length} items. Total: ${this.loadedCount}`);
        console.groupEnd();
    }, 400); 
}

/* ==========================================================
   END SECTION: INFINITE SCROLL
   ========================================================== */



  // Deep merge helper method
  deepMerge(target, source) {
    const output = { ...target };
    
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }
    
    return output;
  }

  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }



  // Debounce with immediate option
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const context = this;
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }


 async init() {
  try {
    // Inject CSS (must be first)
    this.injectCSS();
    
    // Apply theme color
    this.applyTheme();

    // 1. Sync display states from features
    const sidebarEnabled = this.features.sidebar && 
                          (this.features.sidebarFeatures?.enabled !== false);
    this.features.sidebarDisplay = sidebarEnabled ? 'block' : 'none';
    this.features.footerDisplay = this.features.footer ? 'block' : 'none';

    // 2. DOM setup
    this.container = document.querySelector(`#${this.features.containerId}`);
    if (!this.container) {
      throw new Error(`Container with ID "${this.features.containerId}" not found`);
    }
    
    // 3. Component Loading
    await this.fetchAndExtractComponents();
    
    // 4. Injects main structural components into the DOM
    await this.renderAllComponents();

    // 5. Prepare Product Layout Shelves
    this.initializeContainers();
    
    // 6. Dynamic Filter Injection
    if (sidebarEnabled && this.features.sidebarFeatures?.filters) {
        this.renderSidebarFilters(); 
    }
    
    // 7. Initial Product Render
    this.renderProductDisplays();

    // 8. Interactivity & Completion
    this.setupEventListeners();
    this.completeInitialization();
    
  } catch (error) {
    console.error('Failed to initialize Cartique:', error);
    this.showErrorMessage('Failed to load product catalog');
  }
}



initializeContainers() {
    // Prepare Grid Container
    const gridWrapper = this.templateHolder.content.getElementById('cartique-product-grid-component');
    const gridContainer = document.getElementById('cartique-product-grid');
    if (gridWrapper && gridContainer) {
        gridContainer.innerHTML = ''; // Clean slate
        gridContainer.appendChild(gridWrapper.cloneNode(true));
    }

    // Prepare List Container
    const listWrapper = this.templateHolder.content.getElementById('cartique-product-list-component');
    const listContainer = document.getElementById('cartique-product-list');
    if (listWrapper && listContainer) {
        listContainer.innerHTML = ''; // Clean slate
        listContainer.appendChild(listWrapper.cloneNode(true));
    }
}



    applyMinimalTheme() {
        const accentColor = this.features.themeColor || this.features.theme || '#2a2a2a';
        document.documentElement.style.setProperty('--cartique-accent', accentColor);
        document.documentElement.style.setProperty('--theme-accent', accentColor);
        
        const containerElement = document.getElementById(this.features.containerId);
        if (containerElement) {
            containerElement.classList.add(`theme-${this.features.theme}`);
        }
    }

  

  completeInitialization() {
    const container = document.getElementById(this.features.containerId);
    if (container) {
      container.style.visibility = 'visible';
      container.style.opacity = '1';
    }
  }

  async fetchAndExtractComponents() {
    const cartiqueComponents = document.getElementById('cartique-components');
    
    if (!cartiqueComponents) {
      throw new Error('Could not find #cartique-components in the DOM');
    }

    this.templateHolder = document.createElement('template');
    this.templateHolder.innerHTML = cartiqueComponents.innerHTML;
    
    if (!this.templateHolder.content) {
      throw new Error('Failed to create template holder for components');
    }
  }

  async renderAllComponents() {
    const renderMethods = [
        this.renderMainFrame.bind(this),          
        this.renderSidebar.bind(this),
        this.renderCatalogueMenu.bind(this),     
        this.renderControls.bind(this),
        this.renderProductDisplays.bind(this),
        this.renderFooter.bind(this),
        this.renderCartSlider.bind(this),
        this.renderCartItemTemplate.bind(this)
    ];

    for (const method of renderMethods) {
        try {
            await method();
        } catch (error) {
            console.error(`Render failed for method: ${method.name}`, error);
        }
    }

    // FIX: Apply sidebar visibility
    const sidebar = document.getElementById('cartique-sidebar');
    if (sidebar) {
        sidebar.style.display = this.features.sidebarDisplay;
        // Toggle full-width class on main content
        const mainContent = document.getElementById('cartique-main-content');
        if (mainContent) {
            if (this.features.sidebarDisplay === 'none') {
                mainContent.classList.add('cartique-full-width');
            } else {
                mainContent.classList.remove('cartique-full-width');
            }
        }
    }

    // FIX: Only render sidebar filters if sidebar is enabled
    const sidebarEnabled = this.features.sidebar && 
                          (this.features.sidebarFeatures?.enabled !== false);
    if (sidebarEnabled && this.features.sidebarFeatures?.filters) {
        this.renderSidebarFilters(); 
    }
}




  async renderMainFrame() {
  const mainFrameTemplate = document.createElement('template');
  mainFrameTemplate.innerHTML = `
    <div class="cartique-container" id="cartique-container">
      
      <aside class="cartique-sidebar" id="cartique-sidebar" style="display: ${this.features.sidebarDisplay}">
        <div id="cartique-menu-anchor-sidebar" class="cartique-menu-anchor"></div>
        <div id="cartique-sidebar-content"></div> 
      </aside>

      <main class="cartique-main-content" id="cartique-main-content">
        
        <div id="cartique-menu-anchor-top" class="cartique-menu-anchor"></div>

        <div class="cartique-controls" id="cartique-controls">
          <div class="cartique-search-container" id="cartique-search-container"></div>
          <div class="cartique-sort-container" id="cartique-sort-container"></div>
          <div class="cartique-view-toggles-container" id="cartique-view-toggles-container"></div>
          <div class="shopping-cart-icon-container" id="shopping-cart-icon-container"></div>
        </div>

        <div class="cartique-product-displays" id="cartique-product-displays">
          <div class="cartique-product-grid" id="cartique-product-grid"></div>
          <div class="cartique-product-list" id="cartique-product-list"></div>
        </div>

        <footer class="cartique-product-footer" id="cartique-product-footer" style="display:${this.features.footerDisplay}"></footer>
      </main>
    </div>
    <!--
    <div id="cartique-hidden-blocks" style="display:none;"></div>
    --> 
    <div id="cartique-hidden-blocks"></div>
    <div class="cart-overlay" id="cart-slide-overlay"></div>

    <div id="toast-container">
    <div class="toast">
        <div class="toast-content">
            <span class="svg">✓</span>
            <div class="message">
                <span class="text text-1">Success</span>
                <span class="text text-2">You will now be redirected to complete your checkout.</span>
            </div>
        </div>
        <button class="close">&times;</button>
    </div>
</div>
  `;

  this.container.appendChild(mainFrameTemplate.content.cloneNode(true));
  
  // Set up overlay click handler
  const overlay = document.getElementById('cart-slide-overlay');
  if (overlay) {
    this.addEventListener(overlay, 'click', this.closeCart.bind(this));
  }
}


  async renderSidebar() {
    const sidebarWrapper = this.templateHolder.content.getElementById('cartique-sidebar-component');
    if (!sidebarWrapper) return;

    const sidebarContainer = document.getElementById('cartique-sidebar');
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = '';
    sidebarContainer.appendChild(sidebarWrapper.cloneNode(true));
  }

  async renderControls() {
    // Search
    const searchWrapper = this.templateHolder.content.getElementById('cartique-search-container-component');
    if (searchWrapper) {
      const searchContainer = document.getElementById('cartique-search-container');
      searchContainer.innerHTML = '';
      searchContainer.appendChild(searchWrapper.cloneNode(true));
      
      const searchInput = searchContainer.querySelector('.cartique-search');
      if (searchInput) {
        this.addEventListener(searchInput, 'input', 
          this.debounce(this.handleSearch.bind(this), 300)
        );
      }
    }

    // Sort
    const sortWrapper = this.templateHolder.content.getElementById('cartique-sort-container-component');
    if (sortWrapper) {
      const sortContainer = document.getElementById('cartique-sort-container');
      sortContainer.innerHTML = '';
      sortContainer.appendChild(sortWrapper.cloneNode(true));
      
      const sortDropdown = sortContainer.querySelector('.cartique-sort');
      if (sortDropdown) {
        this.addEventListener(sortDropdown, 'change', this.handleSort.bind(this));
      }
    }

    // View toggles
    const togglesWrapper = this.templateHolder.content.getElementById('cartique-view-toggles-container-component');
    if (togglesWrapper) {
      const togglesContainer = document.getElementById('cartique-view-toggles-container');
      togglesContainer.innerHTML = '';
      togglesContainer.appendChild(togglesWrapper.cloneNode(true));
    }

    // Cart icon
    const cartIconWrapper = this.templateHolder.content.getElementById('shopping-cart-icon-container-component');
    if (cartIconWrapper) {
      const cartIconContainer = document.getElementById('shopping-cart-icon-container');
      cartIconContainer.innerHTML = '';
      cartIconContainer.appendChild(cartIconWrapper.cloneNode(true));
      
      const cartIcon = document.getElementById('shopping-cart-icon');
      if (cartIcon) {
        this.addEventListener(cartIcon, 'click', this.showCart.bind(this));
      }
    }
  }

  setupEventListeners() {
    // Layout toggles
    const gridButton = document.querySelector('.cartique-grid-view');
    const listButton = document.querySelector('.cartique-list-view');
    
    if (gridButton) {
      this.addEventListener(gridButton, 'click', () => this.setLayout('grid'));
    }
    
    if (listButton) {
      this.addEventListener(listButton, 'click', () => this.setLayout('list'));
    }
  }

  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    
    // Store for cleanup
    const key = `${element.id || element.className}-${event}`;
    if (!this.eventListeners.has(key)) {
      this.eventListeners.set(key, []);
    }
    this.eventListeners.get(key).push({ element, event, handler });
  }

  cleanupEventListeners() {
    this.eventListeners.forEach((listeners, key) => {
      listeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
    });
    this.eventListeners.clear();
  }

  async renderProductDisplays() {
    // 1. Determine Source Data
    // Use filtered products if available, otherwise fall back to the master list
    const displayData = this.filteredProducts || this.products;

    // 2. Determine Active Layout
    // Defaults to 'grid' if no layout state is stored
    const layout = this.currentLayout || 'grid';

    // 3. Locate UI Containers
    const gridContainer = document.getElementById('cartique-product-grid');
    const listContainer = document.getElementById('cartique-product-list');

    // 4. Handle Visibility & Rendering Logic
    // We toggle displays to 'none' for the inactive layout to prevent 
    // products from stacking or appearing twice on the page.
    if (layout === 'grid') {
        if (listContainer) listContainer.style.display = 'none';
        if (gridContainer) {
            gridContainer.style.display = 'grid';
            this.renderProducts('grid', displayData);
        }
    } else {
        if (gridContainer) gridContainer.style.display = 'none';
        if (listContainer) {
            listContainer.style.display = 'block';
            this.renderProducts('list', displayData);
        }
    }

    console.log(`[UI] Rendered ${displayData.length} products in ${layout} view.`);
}



 /**
 * Renders products into the specified layout container.
 * @param {string} layout - 'grid' or 'list'
 * @param {Array} data - Optional specific data set to render
 */
renderProducts(layout, data) {
    const container = layout === 'grid' 
      ? document.getElementById('cartique-product-grid')
      : document.getElementById('cartique-product-list');

    if (!container) return;

    // 1. RESET STATE: Reset the count for the infinite scroll batch
    this.itemsPerBatch = this.features.itemsPerPage || 12;
    this.loadedCount = this.itemsPerBatch;
    container.innerHTML = '';
    
    const productsToRender = data || this.filteredProducts || [];

    // 2. EMPTY STATE GUARD
    if (productsToRender.length === 0) {
        container.innerHTML = `
            <div class="no-results-msg" style="grid-column: 1 / -1; width: 100%; text-align: center; padding: 4rem 1rem;">
                <p style="font-size: 1.2rem; color: #555; margin-bottom: 1rem;">No products found matching these criteria.</p>
                <button onclick="location.reload()" style="cursor: pointer; border-bottom: 1px solid #000; background: none; border: none; font-weight: 600;">
                    Reset all filters
                </button>
            </div>`;
        return;
    }

    // 3. INITIAL SLICE: Only render the first batch
    const initialSlice = productsToRender.slice(0, this.itemsPerBatch);

    // 4. BATCH RENDER (Fragment)
    const fragment = document.createDocumentFragment();
    initialSlice.forEach(product => {
      const productElement = layout === 'grid'
        ? this.createProductCard(product)
        : this.createProductListing(product);
      
      if (productElement) fragment.appendChild(productElement);
    });

    container.appendChild(fragment);

    // 5. INITIALIZE INFINITE SCROLL OBSERVER
    // We only start observing if there are more products left to load
    if (productsToRender.length > this.itemsPerBatch) {
        this.setupInfiniteScroll();
    }
}





  createProductCard(product) {
    const wrapper = this.templateHolder.content.getElementById('cartique-product-grid-component');
    if (!wrapper) return null;

    const productCardTemplate = wrapper.firstElementChild?.cloneNode(true);
    if (!productCardTemplate) return null;

    this.updateProductElement(productCardTemplate, product);
    
    // Add image click handler
    const imgContainer = productCardTemplate.querySelector('.cartique_product_image_container');
    if (imgContainer) {
        imgContainer.dataset.productId = product.id;
        imgContainer.style.cursor = 'pointer';
        this.addEventListener(imgContainer, 'click', (e) => {
            e.preventDefault();
            this.showSingleProductView(product.id);
        });
    }

    // FIX: Add lazy loading
    const img = productCardTemplate.querySelector('#image');
    if (img) {
        img.loading = 'lazy';
        img.decoding = 'async';
    }

    // Add to cart button
    const addToCartBtn = productCardTemplate.querySelector('.cartique_add_to_cart');
    if (addToCartBtn) {
        addToCartBtn.id = product.id;
        this.addEventListener(addToCartBtn, 'click', (e) => this.addToCart(e));
    }

    return productCardTemplate;
}


  createProductListing(product) {
    const wrapper = this.templateHolder.content.getElementById('cartique-product-list-component');
    if (!wrapper) return null;

    const productListingTemplate = wrapper.firstElementChild?.cloneNode(true);
    if (!productListingTemplate) return null;

    productListingTemplate.classList.add('cartique-product-listing');
    this.updateProductElement(productListingTemplate, product);

    // FIX: Add image click handler for single product view
    const imgContainer = productListingTemplate.querySelector('.cartique_product_image_container');
    if (imgContainer) {
        imgContainer.dataset.productId = product.id;
        imgContainer.style.cursor = 'pointer';
        this.addEventListener(imgContainer, 'click', (e) => {
            e.preventDefault();
            this.showSingleProductView(product.id);
        });
    }

    // FIX: Add lazy loading to image
    const img = productListingTemplate.querySelector('#image');
    if (img) {
        img.loading = 'lazy';
        img.decoding = 'async';
    }

    // Add to cart button
    const addToCartBtn = productListingTemplate.querySelector('.cartique_add_to_cart');
    if (addToCartBtn) {
        addToCartBtn.id = product.id;
        this.addEventListener(addToCartBtn, 'click', (e) => this.addToCart(e));
    }

    return productListingTemplate;
}


  updateProductElement(element, product) {
    // Update all product fields EXCEPT currency
    for (const [key, value] of Object.entries(product)) {
        if (key === 'currency') continue; // Skip - handled below
        
        const target = element.querySelector(`#${key}`);
        if (!target) continue;

        switch (target.tagName) {
        case 'IMG':
            target.src = value;
            target.alt = product.title || '';
            break;
        case 'A':
            target.href = value;
            break;
        default:
            target.textContent = value;
        }
    }

    // Update ALL currency symbols (both regular and sale)
    const currencyEls = element.querySelectorAll('#currency');
    currencyEls.forEach(el => {
        el.textContent = this.currencySymbol || '$';
        el.style.color = '';
        el.style.fontWeight = '';
    });

    // Handle pricing
    const priceEl = element.querySelector('#price');
    const salePriceEl = element.querySelector('#sale_price');
    const salePriceCurrencyEl = element.querySelector('#sale_price_currency');

    if (product.sale_price && product.original_price) {
        if (priceEl) {
            priceEl.textContent = product.original_price;
            priceEl.style.textDecoration = 'line-through';
            priceEl.style.color = '#666';
            priceEl.style.opacity = '0.7';
            priceEl.style.fontWeight = '';
        }
        if (salePriceEl) {
            salePriceEl.textContent = product.sale_price;
            salePriceEl.style.display = 'block';
            salePriceEl.style.color = 'red';
            salePriceEl.style.fontWeight = 'bold';
            const saleContainer = salePriceEl.closest('span');
            if (saleContainer) saleContainer.style.display = '';
        }
        if (salePriceCurrencyEl) {
            salePriceCurrencyEl.textContent = this.currencySymbol || '$';
            salePriceCurrencyEl.style.display = '';
            salePriceCurrencyEl.style.color = 'red';
            salePriceCurrencyEl.style.fontWeight = 'bold';
        }
    } else if (product.sale_price) {
        if (priceEl) {
            priceEl.textContent = product.price;
            priceEl.style.textDecoration = 'line-through';
            priceEl.style.color = '#666';
            priceEl.style.opacity = '0.7';
            priceEl.style.fontWeight = '';
        }
        if (salePriceEl) {
            salePriceEl.textContent = product.sale_price;
            salePriceEl.style.display = 'block';
            salePriceEl.style.color = 'red';
            salePriceEl.style.fontWeight = 'bold';
            const saleContainer = salePriceEl.closest('span');
            if (saleContainer) saleContainer.style.display = '';
        }
        if (salePriceCurrencyEl) {
            salePriceCurrencyEl.textContent = this.currencySymbol || '$';
            salePriceCurrencyEl.style.display = '';
            salePriceCurrencyEl.style.color = 'red';
            salePriceCurrencyEl.style.fontWeight = 'bold';
        }
    } else {
        if (priceEl) {
            priceEl.textContent = product.price;
            priceEl.style.textDecoration = '';
            priceEl.style.color = '';
            priceEl.style.opacity = '';
            priceEl.style.fontWeight = '';
        }
        if (salePriceEl) {
            salePriceEl.textContent = '';
            salePriceEl.style.display = 'none';
            const saleContainer = salePriceEl.closest('span');
            if (saleContainer) saleContainer.style.display = 'none';
        }
        if (salePriceCurrencyEl) {
            salePriceCurrencyEl.textContent = '';
            salePriceCurrencyEl.style.display = 'none';
            salePriceCurrencyEl.style.color = '';
            salePriceCurrencyEl.style.fontWeight = '';
        }
    }
}



  setLayout(layout) {
    const gridContainer = document.getElementById('cartique-product-grid');
    const listContainer = document.getElementById('cartique-product-list');

    if (gridContainer && listContainer) {
      gridContainer.style.display = layout === 'grid' ? 'grid' : 'none';
      listContainer.style.display = layout === 'list' ? 'block' : 'none';
      this.currentLayout = layout;
      this.renderProducts(layout);
    }
  }

  async renderFooter() {
    const wrapper = this.templateHolder.content.getElementById('cartique-product-footer-component');
    if (wrapper) {
      const footerContainer = document.getElementById('cartique-product-footer');
      if (footerContainer) {
        footerContainer.innerHTML = '';
        footerContainer.appendChild(wrapper.firstElementChild.cloneNode(true));
      }
    }
  }

  async renderCartSlider() {
    const wrapper = this.templateHolder.content.getElementById('cartique-cart-slider-component');
    if (!wrapper) return;

    const cartSlider = wrapper.firstElementChild.cloneNode(true);
    const hiddenBlocks = document.getElementById('cartique-hidden-blocks');
    
    if (hiddenBlocks) {
        hiddenBlocks.appendChild(cartSlider);
        
        // Close button
        const closeBtn = cartSlider.querySelector('#cart-close-btn');
        if (closeBtn) {
            this.addEventListener(closeBtn, 'click', this.closeCart.bind(this));
        }

        // FIX: Checkout - use the button directly, not the link
        const checkoutBtn = cartSlider.querySelector('#checkout-btn');
        if (checkoutBtn) {
            this.addEventListener(checkoutBtn, 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.checkout();
            });
        }

        // View Cart button
        const viewCartBtn = cartSlider.querySelector('#view-cart-btn');
        if (viewCartBtn) {
            this.addEventListener(viewCartBtn, 'click', (e) => {
                e.preventDefault();
                this.showCartPage();
            });
        }
    }
}

async renderCartItemTemplate() {
    const wrapper = this.templateHolder.content.getElementById('cartique-cart-item-component');
    if (!wrapper) return;

    const itemTemplate = wrapper.firstElementChild.cloneNode(true);
    const hiddenBlocks = document.getElementById('cartique-hidden-blocks');
    
    if (hiddenBlocks) {
        // FIX: Add a class to identify this as the template and hide it
        itemTemplate.classList.add('cart-item-template');
        itemTemplate.style.display = 'none';
        hiddenBlocks.appendChild(itemTemplate);
    }
}


/* VIEW CART BLOCK */


showCartPage() {
    // Close the slide-in cart
    this.closeCart();
    
    // If we're in single product view, clean that up first
    if (this.singleProductViewActive) {
        const singleProductView = document.getElementById('single-product-view-container');
        if (singleProductView) singleProductView.style.display = 'none';
    }
    
    // Hide product displays, sidebar, controls, menu
    const productDisplays = document.getElementById('cartique-product-displays');
    const sidebar = document.getElementById('cartique-sidebar');
    const menuAnchor = document.getElementById('cartique-menu-anchor-top');
    const controls = document.getElementById('cartique-controls');
    const footer = document.getElementById('cartique-product-footer');
    
    if (productDisplays) productDisplays.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
    if (menuAnchor) menuAnchor.style.display = 'none';
    if (controls) controls.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    // Make main content full width
    const mainContent = document.getElementById('cartique-main-content');
    if (mainContent) {
        mainContent.classList.add('cartique-full-width');
    }
    
    this.singleProductViewActive = true;
    this.renderCartPage();
}


renderCartPage() {
    const cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    const mainContent = document.getElementById('cartique-main-content');
    
    if (!mainContent) return;

    // Remove existing cart page if any
    const existingCartPage = document.getElementById('cartique-cart-page');
    if (existingCartPage) existingCartPage.remove();

    const cartPage = document.createElement('div');
    cartPage.id = 'cartique-cart-page';
    cartPage.className = 'cartique-cart-page';

    if (cart.length === 0) {
        cartPage.innerHTML = `
            <div class="cart-page-empty">
                <div class="cart-page-header">
                    <button class="cart-page-back" id="cart-page-back">← Back to Shop</button>
                    <h2>Shopping Cart</h2>
                </div>
                <div class="cart-page-empty-content">
                    <p>Your cart is empty.</p>
                    <button class="cart-page-back-btn" id="cart-page-back-btn">Continue Shopping</button>
                </div>
            </div>
        `;
    } else {
        let subtotal = 0;
        let itemsHTML = '';
        
        cart.forEach(product => {
            const price = parseFloat(product.sale_price || product.price) || 0;
            const quantity = product.cart_quantity || 1;
            const itemTotal = price * quantity;
            subtotal += itemTotal;
            
            itemsHTML += `
                <div class="cart-page-item" data-product-id="${product.id}">
                    <div class="cart-page-item-image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="cart-page-item-details">
                        <h3>${product.title}</h3>
                        <p class="cart-page-item-price">
                            ${this.currencySymbol}${price.toFixed(2)}
                            ${product.sale_price ? `<span class="cart-page-item-original">${this.currencySymbol}${product.price}</span>` : ''}
                        </p>
                        <div class="cart-page-item-actions">
                            <div class="cart-page-quantity">
                                <button class="cart-page-qty-btn decrease-page-qty" data-id="${product.id}">−</button>
                                <input type="text" class="cart-page-qty-input" value="${quantity}" readonly data-id="${product.id}">
                                <button class="cart-page-qty-btn increase-page-qty" data-id="${product.id}">+</button>
                            </div>
                            <button class="cart-page-remove" data-id="${product.id}">Remove</button>
                        </div>
                    </div>
                    <div class="cart-page-item-total">
                        ${this.currencySymbol}${itemTotal.toFixed(2)}
                    </div>
                </div>
            `;
        });
        
        cartPage.innerHTML = `
            <div class="cart-page-container">
                <div class="cart-page-header">
                    <button class="cart-page-back" id="cart-page-back">← Back to Shop</button>
                    <h2>Shopping Cart (${cart.length} ${cart.length === 1 ? 'item' : 'items'})</h2>
                </div>
                <div class="cart-page-items">
                    ${itemsHTML}
                </div>
                <div class="cart-page-footer">
                    <div class="cart-page-subtotal">
                        <span>Subtotal</span>
                        <span>${this.currencySymbol}${subtotal.toFixed(2)}</span>
                    </div>
                    <button class="cart-page-checkout" id="cart-page-checkout">Proceed to Checkout</button>
                    <button class="cart-page-continue" id="cart-page-continue">Continue Shopping</button>
                </div>
            </div>
        `;
    }

    mainContent.appendChild(cartPage);

    // Attach event listeners
    this.attachCartPageEvents(cartPage);
}

attachCartPageEvents(cartPage) {
    // Back button
    const backBtn = cartPage.querySelector('#cart-page-back');
    if (backBtn) {
        this.addEventListener(backBtn, 'click', () => this.closeCartPage());
    }

    // Continue shopping buttons
    const continueBtns = cartPage.querySelectorAll('#cart-page-back-btn, #cart-page-continue');
    continueBtns.forEach(btn => {
        this.addEventListener(btn, 'click', () => this.closeCartPage());
    });

    // Quantity decrease buttons
    cartPage.querySelectorAll('.decrease-page-qty').forEach(btn => {
        this.addEventListener(btn, 'click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            this.decreasePageQty(productId);
            this.renderCartPage();
        });
    });

    // Quantity increase buttons
    cartPage.querySelectorAll('.increase-page-qty').forEach(btn => {
        this.addEventListener(btn, 'click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            this.increasePageQty(productId);
            this.renderCartPage();
        });
    });

    // Remove buttons
    cartPage.querySelectorAll('.cart-page-remove').forEach(btn => {
        this.addEventListener(btn, 'click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            this.removePageItem(productId);
            this.renderCartPage();
        });
    });

// Checkout button
const checkoutBtn = cartPage.querySelector('#cart-page-checkout');
if (checkoutBtn) {
    this.addEventListener(checkoutBtn, 'click', (e) => {
        e.preventDefault();
        this.checkout();
    });
}


}


closeCartPage() {
    const cartPage = document.getElementById('cartique-cart-page');
    if (cartPage) cartPage.remove();

    // Check if we came from single product view
    const singleProductView = document.getElementById('single-product-view-container');
    const wasInSingleView = singleProductView && singleProductView.style.display === 'none' && 
                            singleProductView.innerHTML !== '';
    
    if (wasInSingleView) {
        // Return to single product view
        if (singleProductView) singleProductView.style.display = 'block';
    } else {
        // Return to product grid
        const productDisplays = document.getElementById('cartique-product-displays');
        const sidebar = document.getElementById('cartique-sidebar');
        const menuAnchor = document.getElementById('cartique-menu-anchor-top');
        const controls = document.getElementById('cartique-controls');
        const footer = document.getElementById('cartique-product-footer');
        
        if (productDisplays) productDisplays.style.display = 'block';
        if (sidebar) sidebar.style.display = this.features.sidebarDisplay;
        if (menuAnchor) menuAnchor.style.display = '';
        if (controls) controls.style.display = '';
        if (footer) footer.style.display = this.features.footerDisplay;
    }
    
    // Restore full-width state
    const mainContent = document.getElementById('cartique-main-content');
    if (mainContent) {
        if (this.features.sidebarDisplay === 'none' || wasInSingleView) {
            mainContent.classList.add('cartique-full-width');
        } else {
            mainContent.classList.remove('cartique-full-width');
        }
    }

    if (!wasInSingleView) {
        this.singleProductViewActive = false;
    }
}



// Cart page specific methods that don't open slide-in
decreasePageQty(productId) {
    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    const index = cart.findIndex(item => item.id === productId);

    if (index !== -1) {
        if (cart[index].cart_quantity > 1) {
            cart[index].cart_quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        localStorage.setItem('cartiqueCart', JSON.stringify(cart));
    }
}

increasePageQty(productId) {
    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    const index = cart.findIndex(item => item.id === productId);

    if (index !== -1) {
        cart[index].cart_quantity += 1;
        localStorage.setItem('cartiqueCart', JSON.stringify(cart));
    }
}

removePageItem(productId) {
    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem('cartiqueCart', JSON.stringify(cart));
}



/* END VIEW CART BLOCK */

  handleSearch(event) {
    const query = event?.target?.value?.trim().toLowerCase() || '';
    this.currentSearchQuery = query;
    this.applyAllFilters();
}


  handleSort(event) {
    const sortType = event.target.value;
    this.currentSortType = sortType;

    const sortedProducts = [...this.filteredProducts];

    switch (sortType) {
      case 'price-asc':
        sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'title-asc':
        sortedProducts.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'title-desc':
        sortedProducts.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
    }

    this.filteredProducts = sortedProducts;
    this.loadedCount = 0;
    this.renderProductDisplays();
}


  addToCart(event) {
    const productId = parseInt(event.target.id);
    const product = this.products.find(p => p.id === productId);

    if (!product) {
      console.error('Product not found:', productId);
      return;
    }

    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex === -1) {
      cart.push({
        ...product,
        cart_quantity: 1
      });
    } else {
      cart[existingIndex].cart_quantity += 1;
    }

    localStorage.setItem('cartiqueCart', JSON.stringify(cart));
    this.showCart();
  }

  showCart() {
    const cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    const cartContainer = document.getElementById('cart-items-container');
    
    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    // Show/hide empty cart message
    const emptyMsg = document.getElementById('shopping-cart-empty');
    const viewBtn = document.getElementById('view-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (emptyMsg) emptyMsg.classList.toggle('show', cart.length === 0);
    if (viewBtn) viewBtn.style.display = cart.length === 0 ? 'none' : 'block';
    if (checkoutBtn) checkoutBtn.style.display = cart.length === 0 ? 'none' : 'block';

    // Calculate total
    let subtotal = 0;

    // Render cart items
    cart.forEach(product => {
      const wrapper = this.templateHolder.content.getElementById('cartique-cart-item-component');
      if (!wrapper) return;

      const cartItem = wrapper.firstElementChild.cloneNode(true);
      
      // Update product data
      this.updateCartItem(cartItem, product);
      
      // Add event listeners
      this.addCartItemEventListeners(cartItem, product.id);
      
      // Calculate subtotal
      const price = parseFloat(product.sale_price || product.price) || 0;
      const quantity = product.cart_quantity || 1;
      subtotal += price * quantity;
      
      cartContainer.appendChild(cartItem);
    });

    // Update subtotal display
    const subtotalEl = document.getElementById('subtotal');
    const currencyEl = document.getElementById('subtotal-currency');
    
    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
    if (currencyEl && cart.length > 0) {
      currencyEl.textContent = this.currencySymbol || '$';
    }

    // Show the hidden blocks container
    const hiddenBlocks = document.getElementById('cartique-hidden-blocks');
    if (hiddenBlocks) {
      hiddenBlocks.style.display = 'block';
    }

    // Open cart slider and overlay
    const cartSlide = document.getElementById('cart-slide');
    const overlay = document.getElementById('cart-slide-overlay');
    
    if (cartSlide) cartSlide.classList.add('open');
    if (overlay) overlay.style.display = 'block';
}

closeCart() {
    const cartSlide = document.getElementById('cart-slide');
    const overlay = document.getElementById('cart-slide-overlay');
    const hiddenBlocks = document.getElementById('cartique-hidden-blocks');

    if (cartSlide) cartSlide.classList.remove('open');
    if (overlay) overlay.style.display = 'none';
    
    // Hide hidden blocks after transition completes
    if (hiddenBlocks) {
      setTimeout(() => {
        hiddenBlocks.style.display = 'none';
      }, 350); // Match the CSS transition duration
    }
}


  updateCartItem(cartItem, product) {
    // Update image
    const imgEl = cartItem.querySelector('#image');
    if (imgEl) {
        imgEl.src = product.image || '';
        imgEl.alt = product.title || '';
    }

    // Update title
    const titleEl = cartItem.querySelector('#title');
    if (titleEl) titleEl.textContent = product.title || '';

    // Update currency symbols
    const currencyEls = cartItem.querySelectorAll('#currency');
    currencyEls.forEach(el => el.textContent = this.currencySymbol || '$');

    // Handle pricing
    const priceEl = cartItem.querySelector('#price');
    const salePriceEl = cartItem.querySelector('#sale_price');
    
    if (product.sale_price) {
        // HAS SALE PRICE - show both
        if (priceEl) {
            priceEl.textContent = product.price;
            priceEl.style.textDecoration = 'line-through';
        }
        if (salePriceEl) {
            salePriceEl.textContent = product.sale_price;
            salePriceEl.style.display = '';
        }
        // Show all currency spans
        currencyEls.forEach(el => el.parentElement.style.display = '');
    } else {
        // NO SALE PRICE - hide the sale price section completely
        if (priceEl) {
            priceEl.textContent = product.price;
            priceEl.style.textDecoration = '';
        }
        if (salePriceEl) {
            salePriceEl.textContent = '';
            salePriceEl.style.display = 'none';
            // FIX: Hide the parent span that contains the sale currency + sale price
            const saleParentSpan = salePriceEl.parentElement;
            if (saleParentSpan && saleParentSpan.tagName === 'SPAN') {
                saleParentSpan.style.display = 'none';
            }
        }
    }

    // Set quantity
    const quantityInput = cartItem.querySelector('.quantity');
    if (quantityInput) {
        quantityInput.value = product.cart_quantity || 1;
        quantityInput.id = `quantity_${product.id}`;
    }
}

  addCartItemEventListeners(cartItem, productId) {
    const removeBtn = cartItem.querySelector('#remove-item');
    const decreaseBtn = cartItem.querySelector('.decrease-qty');
    const increaseBtn = cartItem.querySelector('.increase-qty');

    if (removeBtn) {
      removeBtn.id = productId;
      this.addEventListener(removeBtn, 'click', (e) => this.removeCartItem(e));
    }

    if (decreaseBtn) {
      decreaseBtn.id = `decrease_quantity_${productId}`;
      this.addEventListener(decreaseBtn, 'click', (e) => this.decreaseQtyItem(e));
    }

    if (increaseBtn) {
      increaseBtn.id = `increase_quantity_${productId}`;
      this.addEventListener(increaseBtn, 'click', (e) => this.increaseQtyItem(e));
    }
  }

  removeCartItem(event) {
    const productId = parseInt(event.target.id);
    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem('cartiqueCart', JSON.stringify(cart));
    this.showCart();
  }

  decreaseQtyItem(event) {
    const productId = parseInt(event.target.id.replace('decrease_quantity_', ''));
    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    const index = cart.findIndex(item => item.id === productId);

    if (index !== -1) {
      if (cart[index].cart_quantity > 1) {
        cart[index].cart_quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
      
      localStorage.setItem('cartiqueCart', JSON.stringify(cart));
      this.showCart();
    }
  }

  increaseQtyItem(event) {
    const productId = parseInt(event.target.id.replace('increase_quantity_', ''));
    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    const index = cart.findIndex(item => item.id === productId);

    if (index !== -1) {
      cart[index].cart_quantity += 1;
      localStorage.setItem('cartiqueCart', JSON.stringify(cart));
      this.showCart();
    }
  }

  closeCart() {
    const cartSlide = document.getElementById('cart-slide');
    const overlay = document.getElementById('cart-slide-overlay');
    const hiddenBlocks = document.getElementById('cartique-hidden-blocks');

    if (cartSlide) cartSlide.classList.remove('open');
    if (overlay) overlay.style.display = 'none';
    if (hiddenBlocks) hiddenBlocks.style.display = 'none';
  }

  checkout() {
    // Check if cart page is open
    const cartPage = document.getElementById('cartique-cart-page');
    if (cartPage) {
        // We're on the cart page - remove it first
        cartPage.remove();
        
        // Restore the main view
        const productDisplays = document.getElementById('cartique-product-displays');
        const sidebar = document.getElementById('cartique-sidebar');
        const menuAnchor = document.getElementById('cartique-menu-anchor-top');
        const controls = document.getElementById('cartique-controls');
        const footer = document.getElementById('cartique-product-footer');
        
        if (productDisplays) productDisplays.style.display = 'block';
        if (sidebar) sidebar.style.display = this.features.sidebarDisplay;
        if (menuAnchor) menuAnchor.style.display = '';
        if (controls) controls.style.display = '';
        if (footer) footer.style.display = this.features.footerDisplay;
        
        const mainContent = document.getElementById('cartique-main-content');
        if (mainContent) {
            if (this.features.sidebarDisplay === 'none') {
                mainContent.classList.add('cartique-full-width');
            } else {
                mainContent.classList.remove('cartique-full-width');
            }
        }
        
        this.singleProductViewActive = false;
    } else {
        // Close the slide-in cart
        this.closeCart();
    }
    
    // Show the checkout alert
    this.showCheckoutAlert();
}



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



  clearToastTimeouts() {
    if (this.toastTimer1) clearTimeout(this.toastTimer1);
    if (this.redirectTimer) clearTimeout(this.redirectTimer);
}


  showSingleProductView(productId) {
    productId = Number(productId);
    const product = this.products.find(p => p.id === productId);

    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    // Save current state
    this.previousViewState = {
        layout: this.currentLayout,
        searchQuery: this.currentSearchQuery,
        sortType: this.currentSortType,
        scrollPosition: window.scrollY
    };

    // Hide main views and controls
    const productDisplays = document.getElementById('cartique-product-displays');
    const sidebar = document.getElementById('cartique-sidebar');
    const controls = document.getElementById('cartique-controls');
    const menuAnchor = document.getElementById('cartique-menu-anchor-top');
    const footer = document.getElementById('cartique-product-footer');

    if (productDisplays) productDisplays.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
    if (controls) controls.style.display = 'none';
    if (menuAnchor) menuAnchor.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    // Make main content full width
    const mainContent = document.getElementById('cartique-main-content');
    if (mainContent) {
        mainContent.classList.add('cartique-full-width');
    }
    
    this.singleProductViewActive = true;
    this.renderSingleProduct(product);
    
    // FIX: Scroll to single product view after DOM renders
    requestAnimationFrame(() => {
        const singleView = document.querySelector('.single-product-view');
        if (singleView) {
            singleView.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
        if (mainContent) mainContent.scrollTop = 0;
    });
}

  renderSingleProduct(product) {
    let container = document.getElementById('single-product-view-container');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'single-product-view-container';
      document.getElementById('cartique-main-content').appendChild(container);
    }

    container.innerHTML = '';
    
    const productView = document.createElement('div');
    productView.className = 'single-product-view';
    productView.innerHTML = `
      <button class="back-to-products">← Back to Products</button>
      <div class="product-content-wrapper">
        <div class="product-image-column">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
        </div>
        <div class="product-info-column">
          <div class="product-meta">
            <h2>${product.title}</h2>
            <div class="price-container">
              ${product.sale_price && product.original_price ? `
                <span class="original-price">${this.currencySymbol}${product.original_price}</span>
                <span class="sale-price">${this.currencySymbol}${product.sale_price}</span>
              ` : product.sale_price ? `
                <span class="original-price">${this.currencySymbol}${product.price}</span>
                <span class="sale-price">${this.currencySymbol}${product.sale_price}</span>
              ` : `
                <span class="price">${this.currencySymbol}${product.price}</span>
              `}
            </div>
            <p class="product-description">${product.description}</p>
          </div>
          <button class="spv-cartique_add_to_cart" id="${product.id}">ADD TO CART</button>
        </div>
      </div>
      <div class="product-tabs-container">
        <div class="product-tabs-header">
            <button class="tab-button" data-tab="details">Product Details</button>
            <button class="tab-button active" data-tab="reviews">Reviews</button>
        </div>
        <div class="tab-content" data-tab-content="details">
            ${this.renderProductDetails(product)}
        </div>
        <div class="tab-content active" data-tab-content="reviews">
            ${this.renderProductReviews(product)}
        </div>
    </div>
    `;

    // Add event listeners
    const backBtn = productView.querySelector('.back-to-products');
    const addToCartBtn = productView.querySelector('.spv-cartique_add_to_cart');
    const tabButtons = productView.querySelectorAll('.tab-button');

    if (backBtn) {
      this.addEventListener(backBtn, 'click', () => this.returnToListView());
    }

    if (addToCartBtn) {
      this.addEventListener(addToCartBtn, 'click', (e) => this.addToCart(e));
    }

    tabButtons.forEach(button => {
      this.addEventListener(button, 'click', () => {
        productView.querySelectorAll('.tab-button, .tab-content').forEach(el => {
          el.classList.remove('active');
        });
        button.classList.add('active');
        const tabName = button.dataset.tab;
        const content = productView.querySelector(`[data-tab-content="${tabName}"]`);
        if (content) content.classList.add('active');
      });
    });

    // Append to DOM first
    container.appendChild(productView);
    container.style.display = 'block';
    
    // Attach review form submit listener
    const submitBtn = container.querySelector('#review-submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const form = document.getElementById('review-form');
            if (!form) return;
            
            const ratingInput = form.querySelector('input[name="rating"]:checked');
            
            if (!ratingInput) {
                alert('Please select a rating');
                return;
            }
            
            const productId = parseInt(form.querySelector('#review-product-id').value);
            const product = this.products.find(p => p.id === productId);
            if (product) {
                this.submitReview(form, product);
            }
        });
    }
}



renderProductDetails(product) {
    const attributes = product.variants?.[0]?.attributes || [];
    
    if (attributes.length === 0) {
        return '<p>No additional details available.</p>';
    }
    
    return `
        <div class="product-details-list">
            ${attributes.map(attr => `
                <div class="detail-row">
                    <span class="detail-key">${attr.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <span class="detail-value">${attr.value}</span>
                </div>
            `).join('')}
        </div>
    `;
}



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

formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}


// In cartique_3.js, find submitReview() and add:
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



  returnToListView() {
    const singleProductView = document.getElementById('single-product-view-container');
    const productDisplays = document.getElementById('cartique-product-displays');
    const sidebar = document.getElementById('cartique-sidebar');
    const controls = document.getElementById('cartique-controls');
    const menuAnchor = document.getElementById('cartique-menu-anchor-top');
    const footer = document.getElementById('cartique-product-footer');

    if (singleProductView) singleProductView.style.display = 'none';
    if (productDisplays) productDisplays.style.display = 'block';
    if (sidebar) sidebar.style.display = this.features.sidebarDisplay;
    if (controls) controls.style.display = '';
    if (menuAnchor) menuAnchor.style.display = '';
    if (footer) footer.style.display = this.features.footerDisplay;
    
    // Restore full-width state based on sidebar config
    const mainContent = document.getElementById('cartique-main-content');
    if (mainContent) {
        if (this.features.sidebarDisplay === 'none') {
            mainContent.classList.add('cartique-full-width');
        } else {
            mainContent.classList.remove('cartique-full-width');
        }
    }

    this.singleProductViewActive = false;

    // Restore scroll position
    if (this.previousViewState?.scrollPosition) {
        window.scrollTo(0, this.previousViewState.scrollPosition);
    }
}

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

  // Cleanup method for when component is destroyed
  destroy() {
    this.cleanupEventListeners();
    this.clearToastTimeouts();
    
    // Remove any dynamically added elements
    const singleProductView = document.getElementById('single-product-view-container');
    if (singleProductView) singleProductView.remove();
    
    // Clear container
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}