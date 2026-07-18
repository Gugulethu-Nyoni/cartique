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
  z-index: 9998 !important;  /* Below cart overlay (9999) but above page header */
}

.cartique-mega-wrapper .mega-content {
  z-index: 1000 !important;
}

.cart-overlay {
  z-index: 9999 !important;  /* Just below cart slider */
}

.cart-slide {
  z-index: 10000 !important;  /* Top of everything */
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


/*  BULK PRICING UIs CSS */

  /* =============================================
   BULK PRICING - Shared Styles
   ============================================= */

.cartique-bulk-pricing {
    margin-top: 8px;
    padding: 6px 10px;
    background: #1a1a1a;
    border-radius: 4px;
    color: #ffffff;
    font-size: 12px;
    line-height: 1.4;
    font-family: var(--font-family);
}

.cartique-bulk-pricing .bulk-label {
    font-weight: 700;
    font-size: 10px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #ffd700;
    display: block;
}

.cartique-bulk-pricing .bulk-price {
    font-weight: 600;
    font-size: 14px;
    display: block;
    color: #ffffff;
}

.cartique-bulk-pricing .bulk-min-qty {
    font-size: 11px;
    opacity: 0.7;
    display: block;
    color: #ffffff;
}

/* Grid View */
.cartique-product-grid .cartique-bulk-pricing {
    margin: 4px 15px 8px;
    text-align: center;
}

/* List View */
.cartique-bulk-pricing.list-view {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px;
    font-size: 11px;
    margin-top: 4px;
    flex-wrap: wrap;
}

.cartique-bulk-pricing.list-view .bulk-label,
.cartique-bulk-pricing.list-view .bulk-price,
.cartique-bulk-pricing.list-view .bulk-min-qty {
    display: inline;
}

.cartique-bulk-pricing.list-view .bulk-label {
    font-size: 9px;
}

.cartique-bulk-pricing.list-view .bulk-price {
    font-size: 12px;
}

.cartique-bulk-pricing.list-view .bulk-min-qty {
    font-size: 10px;
}

/* =============================================
   SINGLE PRODUCT - Bulk Pricing
   ============================================= */

.cartique-bulk-pricing.single-product {
    margin: 12px 0 16px;
    padding: 12px 16px;
    background: #f8f9fa;
    border-left: 4px solid #1a1a1a;
    color: #1a1a1a;
    border-radius: 0 4px 4px 0;
}

.cartique-bulk-pricing.single-product .bulk-header {
    font-weight: 700;
    font-size: 13px;
    text-transform: uppercase;
    color: #1a1a1a;
    letter-spacing: 0.5px;
}

.cartique-bulk-pricing.single-product .bulk-header.active {
    color: #28a745;
}

.cartique-bulk-pricing.single-product .bulk-price {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    display: block;
    margin: 2px 0;
}

.cartique-bulk-pricing.single-product .bulk-min-qty {
    font-size: 12px;
    color: #6c757d;
    display: block;
}

/* =============================================
   CART SLIDE-IN - Bulk Status
   ============================================= */

.cart-bulk-status {
    margin-top: 6px;
    padding: 4px 0;
    font-size: 11px;
    font-family: var(--font-family);
    border-top: 1px solid rgba(0,0,0,0.05);
}

.cart-bulk-status .bulk-heading {
    font-weight: 600;
    color: #6c757d;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.cart-bulk-status .bulk-heading.active {
    color: #28a745;
}

.cart-bulk-status .bulk-price-display {
    font-weight: 500;
    font-size: 13px;
    color: #1a1a1a;
}

.cart-bulk-status .bulk-min-qty {
    color: #6c757d;
    font-size: 10px;
}

/* =============================================
   CART PAGE - Bulk Status
   ============================================= */

.cart-page-bulk-status {
    margin: 4px 0 8px;
    font-size: 12px;
    font-family: var(--font-family);
}

.cart-page-bulk-status .bulk-heading {
    font-weight: 600;
    color: #6c757d;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.cart-page-bulk-status .bulk-heading-active {
    font-weight: 600;
    color: #28a745;
    font-size: 12px;
}

.cart-page-bulk-status .bulk-price-available {
    font-weight: 500;
    color: #1a1a1a;
    font-size: 13px;
}

.cart-page-bulk-status .bulk-min-qty {
    color: #6c757d;
    font-size: 11px;
}

.cart-page-bulk-status.active {
    background: #f0faf0;
    padding: 4px 8px;
    border-radius: 4px;
    border-left: 3px solid #28a745;
}

/* Price strikethrough for bulk active state */
.cart-page-item-price .original-price-strikethrough {
    text-decoration: line-through;
    color: #6c757d;
    font-size: 14px;
    margin-right: 8px;
}

.cart-page-item-price .bulk-price-active {
    color: #28a745;
    font-weight: 700;
    font-size: 16px;
}

.cart-page-item-price .retail-price {
    color: #1a1a1a;
    font-weight: 600;
}

/* =============================================
   RESPONSIVE - Bulk Pricing
   ============================================= */

@media (max-width: 768px) {
    .cartique-bulk-pricing {
        font-size: 11px;
        padding: 5px 8px;
    }

    .cartique-bulk-pricing .bulk-price {
        font-size: 12px;
    }

    .cartique-bulk-pricing .bulk-min-qty {
        font-size: 10px;
    }

    .cartique-bulk-pricing.single-product {
        padding: 10px 12px;
        margin: 10px 0 12px;
    }

    .cartique-bulk-pricing.single-product .bulk-price {
        font-size: 16px;
    }

    .cartique-bulk-pricing.list-view {
        font-size: 10px;
        gap: 6px;
        padding: 3px 10px;
    }

    .cart-bulk-status {
        font-size: 10px;
    }

    .cart-bulk-status .bulk-price-display {
        font-size: 12px;
    }

    .cart-page-bulk-status {
        font-size: 11px;
    }

    .cart-page-item-price .original-price-strikethrough {
        font-size: 12px;
    }

    .cart-page-item-price .bulk-price-active {
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .cartique-bulk-pricing {
        font-size: 10px;
        padding: 4px 8px;
    }

    .cartique-bulk-pricing .bulk-price {
        font-size: 11px;
    }

    .cartique-bulk-pricing.single-product {
        padding: 8px 10px;
    }

    .cartique-bulk-pricing.single-product .bulk-price {
        font-size: 14px;
    }

    .cartique-bulk-pricing.list-view {
        font-size: 9px;
        padding: 2px 8px;
        gap: 4px;
    }
}








/* Variant Selector */
.cartique-variant-selector {
  margin: 12px 0;
}

.cartique-variant-group {
  margin-bottom: 8px;
}

.cartique-variant-label {
  font-weight: 600;
  font-size: 14px;
  display: block;
  margin-bottom: 4px;
}

.cartique-variant-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cartique-variant-option {
  padding: 6px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  background: #fff;
}

.cartique-variant-option:hover {
  border-color: #999;
}

.cartique-variant-option.selected {
  border-color: var(--cartique-accent, #2a2a2a);
  background: #f0f0f0;
}

.cartique-variant-option.out-of-stock {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Bulk Pricing */
.cartique-bulk-pricing {
  background: #f0f9f0;
  padding: 10px 14px;
  border-radius: 6px;
  border-left: 3px solid #28a745;
  margin: 8px 0;
}

.cartique-bulk-header {
  font-weight: 700;
  font-size: 13px;
  color: #1a7a3a;
}

.cartique-bulk-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 2px;
}

.cartique-bulk-price {
  font-weight: 700;
  font-size: 18px;
  color: #28a745;
}

.cartique-bulk-min {
  font-size: 12px;
  color: #555;
}

.cartique-bulk-savings {
  font-size: 12px;
  color: #1a7a3a;
  background: #d4edda;
  padding: 2px 8px;
  border-radius: 10px;
}

.cartique-bulk-active {
  font-size: 13px;
  color: #155724;
  font-weight: 600;
  margin-top: 4px;
}

/* Quantity Selector */
.cartique-quantity-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
}

.cartique-quantity-label {
  font-weight: 600;
  font-size: 14px;
}

.cartique-quantity-selector {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.cartique-qty-btn {
  background: #f5f5f5;
  border: none;
  padding: 6px 14px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
}

.cartique-qty-btn:hover {
  background: #e5e5e5;
}

.cartique-quantity-input {
  width: 50px;
  text-align: center;
  border: none;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  padding: 6px 0;
  font-size: 14px;
  font-weight: 600;
}

.cartique-quantity-input:focus {
  outline: none;
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
      currencySymbol: '$',
      quantity: true,
      lowStockThreshold: 5,
      itemsPerPage: 12,
      menu: {
        enabled: false,
        type: 'inline',
        position: 'top',
        containerId: 'cartique-catalogue-menu',
        label: 'Categories',
        showCounts: true,
        megaMenuColumns: 3
      },
      sidebarFeatures: {
        filters: {}
      }
    };

    this.features = this.deepMerge(this.defaultFeatures, features);
    this.currencySymbol = this.features.currencySymbol || '$';
    this.callbacks = callbacks || {};

    // 3. Data State Management
    this.products = products;
    this.filteredProducts = [...products];
    this.categories = this._extractCategories();

    // Variant state - internal to Cartique
    this.selectedVariants = new Map();
    this.currentQuantities = new Map();
    this.variantMaps = new Map();

    this._buildVariantMaps();

    // UI State Tracking
    this.currentSearchQuery = '';
    this.currentSortType = '';
    this.currentLayout = 'grid';
    this.activeCategoryId = null;
    this.activeFilters = {};
    this.singleProductViewActive = false;
    this.previousViewState = null;

    // 4. Component Lifecycle References
    this.container = null;
    this.templateHolder = null;
    this.eventListeners = new Map();

    // Event handlers for cleanup
    this._clickHandler = null;
    this._changeHandler = null;

    // Cleanup Timers
    this.toastTimer1 = null;
    this.toastTimer2 = null;
    this.redirectTimer = null;

    this.itemsPerBatch = this.features.itemsPerPage || 12;
    this.loadedCount = this.itemsPerBatch;

    // 5. Fire off the Engine
    this.init();
  }

  /* ==========================================================
     INITIALIZATION
     ========================================================== */

  async init() {
    try {
      this.injectCSS();
      this.applyTheme();

      const sidebarEnabled = this.features.sidebar &&
        (this.features.sidebarFeatures?.enabled !== false);
      this.features.sidebarDisplay = sidebarEnabled ? 'block' : 'none';
      this.features.footerDisplay = this.features.footer ? 'block' : 'none';

      this.container = document.querySelector(`#${this.features.containerId}`);
      if (!this.container) {
        throw new Error(`Container with ID "${this.features.containerId}" not found`);
      }

      await this.fetchAndExtractComponents();
      await this.renderAllComponents();
      this.initializeContainers();

      if (sidebarEnabled && this.features.sidebarFeatures?.filters) {
        this.renderSidebarFilters();
      }

      this.renderProductDisplays();
      this.setupEventListeners();
      this.completeInitialization();

    } catch (error) {
      console.error('Failed to initialize Cartique:', error);
      this.showErrorMessage('Failed to load product catalog');
    }
  }

  injectCSS() {
    if (document.getElementById('cartique-styles')) return;

    const style = document.createElement('style');
    style.id = 'cartique-styles';
    style.textContent = `
      #${this.features.containerId} {
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .cartique-container {
        position: relative;
        min-height: 100vh;
      }
      ${CARTIQUE_CSS}
    `;
    document.head.appendChild(style);
  }

  applyTheme() {
    const accentColor = this.features.themeColor || '#2a2a2a';
    document.documentElement.style.setProperty('--cartique-accent', accentColor);
    document.documentElement.style.setProperty('--theme-accent', accentColor);

    const themeMode = this.features.theme === 'dark' ? 'dark' : 'light';
    const containerElement = document.getElementById(this.features.containerId);
    if (containerElement) {
      containerElement.setAttribute('data-theme', themeMode);
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

    const sidebar = document.getElementById('cartique-sidebar');
    if (sidebar) {
      sidebar.style.display = this.features.sidebarDisplay;
      const mainContent = document.getElementById('cartique-main-content');
      if (mainContent) {
        if (this.features.sidebarDisplay === 'none') {
          mainContent.classList.add('cartique-full-width');
        } else {
          mainContent.classList.remove('cartique-full-width');
        }
      }
    }

    const sidebarEnabled = this.features.sidebar &&
      (this.features.sidebarFeatures?.enabled !== false);
    if (sidebarEnabled && this.features.sidebarFeatures?.filters) {
      this.renderSidebarFilters();
    }
  }

  /* ==========================================================
     RENDER METHODS
     ========================================================== */

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

    const togglesWrapper = this.templateHolder.content.getElementById('cartique-view-toggles-container-component');
    if (togglesWrapper) {
      const togglesContainer = document.getElementById('cartique-view-toggles-container');
      togglesContainer.innerHTML = '';
      togglesContainer.appendChild(togglesWrapper.cloneNode(true));
    }

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

      const closeBtn = cartSlider.querySelector('#cart-close-btn');
      if (closeBtn) {
        this.addEventListener(closeBtn, 'click', this.closeCart.bind(this));
      }

      const checkoutBtn = cartSlider.querySelector('#checkout-btn');
      if (checkoutBtn) {
        this.addEventListener(checkoutBtn, 'click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.checkout();
        });
      }

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
      itemTemplate.classList.add('cart-item-template');
      itemTemplate.style.display = 'none';
      hiddenBlocks.appendChild(itemTemplate);
    }
  }

  initializeContainers() {
    const gridWrapper = this.templateHolder.content.getElementById('cartique-product-grid-component');
    const gridContainer = document.getElementById('cartique-product-grid');
    if (gridWrapper && gridContainer) {
      gridContainer.innerHTML = '';
      gridContainer.appendChild(gridWrapper.cloneNode(true));
    }

    const listWrapper = this.templateHolder.content.getElementById('cartique-product-list-component');
    const listContainer = document.getElementById('cartique-product-list');
    if (listWrapper && listContainer) {
      listContainer.innerHTML = '';
      listContainer.appendChild(listWrapper.cloneNode(true));
    }
  }

  /* ==========================================================
     PRODUCT DISPLAY
     ========================================================== */

  async renderProductDisplays() {
    const displayData = this.filteredProducts || this.products;
    const layout = this.currentLayout || 'grid';

    const gridContainer = document.getElementById('cartique-product-grid');
    const listContainer = document.getElementById('cartique-product-list');

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
  }

  renderProducts(layout, data) {
    const container = layout === 'grid'
      ? document.getElementById('cartique-product-grid')
      : document.getElementById('cartique-product-list');

    if (!container) return;

    this.itemsPerBatch = this.features.itemsPerPage || 12;
    this.loadedCount = this.itemsPerBatch;
    container.innerHTML = '';

    const productsToRender = data || this.filteredProducts || [];

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

    const initialSlice = productsToRender.slice(0, this.itemsPerBatch);
    const fragment = document.createDocumentFragment();

    initialSlice.forEach(product => {
      const productElement = layout === 'grid'
        ? this.createProductCard(product)
        : this.createProductListing(product);

      if (productElement) fragment.appendChild(productElement);
    });

    container.appendChild(fragment);

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

    const variant = this.getCurrentVariant(product);
    const hasBulk = this.hasBulkPricing(variant);

    if (hasBulk) {
      const priceContainer = productCardTemplate.querySelector('.currency-price-display');
      if (priceContainer) {
        const existing = priceContainer.querySelector('.cartique-bulk-pricing');
        if (existing) existing.remove();

        const bulkEl = document.createElement('div');
        bulkEl.className = 'cartique-bulk-pricing';
        bulkEl.innerHTML = `
          <div class="bulk-label">BULK PRICE</div>
          <div class="bulk-price">${this.currencySymbol}${variant.bulkPrice} each</div>
          <div class="bulk-min-qty">Min ${variant.bulkMinimumQty} items</div>
        `;
        priceContainer.appendChild(bulkEl);
      }
    }

    const imgContainer = productCardTemplate.querySelector('.cartique_product_image_container');
    if (imgContainer) {
      imgContainer.dataset.productId = product.id;
      imgContainer.style.cursor = 'pointer';
      this.addEventListener(imgContainer, 'click', (e) => {
        e.preventDefault();
        this.showSingleProductView(product.id);
      });
    }

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

    const variant = this.getCurrentVariant(product);
    const hasBulk = this.hasBulkPricing(variant);

    if (hasBulk) {
      const priceContainer = productListingTemplate.querySelector('.currency-price-display');
      if (priceContainer) {
        const existing = priceContainer.querySelector('.cartique-bulk-pricing');
        if (existing) existing.remove();

        const bulkEl = document.createElement('div');
        bulkEl.className = 'cartique-bulk-pricing list-view';
        bulkEl.innerHTML = `
          <span class="bulk-label">BULK PRICE</span>
          <span class="bulk-price">${this.currencySymbol}${variant.bulkPrice} each</span>
          <span class="bulk-min-qty">Min ${variant.bulkMinimumQty} items</span>
        `;
        priceContainer.appendChild(bulkEl);
      }
    }

    const imgContainer = productListingTemplate.querySelector('.cartique_product_image_container');
    if (imgContainer) {
      imgContainer.dataset.productId = product.id;
      imgContainer.style.cursor = 'pointer';
      this.addEventListener(imgContainer, 'click', (e) => {
        e.preventDefault();
        this.showSingleProductView(product.id);
      });
    }

    const img = productListingTemplate.querySelector('#image');
    if (img) {
      img.loading = 'lazy';
      img.decoding = 'async';
    }

    const addToCartBtn = productListingTemplate.querySelector('.cartique_add_to_cart');
    if (addToCartBtn) {
      addToCartBtn.id = product.id;
      this.addEventListener(addToCartBtn, 'click', (e) => this.addToCart(e));
    }

    return productListingTemplate;
  }

  updateProductElement(element, product) {
    for (const [key, value] of Object.entries(product)) {
      if (key === 'currency') continue;

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

    const currencyEls = element.querySelectorAll('#currency');
    currencyEls.forEach(el => {
      el.textContent = this.currencySymbol || '$';
      el.style.color = '';
      el.style.fontWeight = '';
    });

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

    const stockCount = this.getProductStock(product);
    const addToCartBtn = element.querySelector('.cartique_add_to_cart');

    if (addToCartBtn) {
      addToCartBtn.dataset.stock = stockCount;
      addToCartBtn.dataset.productId = product.id;

      if (stockCount === 0) {
        addToCartBtn.disabled = true;
        addToCartBtn.style.opacity = '0.5';
        addToCartBtn.style.cursor = 'not-allowed';
        addToCartBtn.title = 'SOLD OUT';

        const btnText = addToCartBtn.querySelector('span') || addToCartBtn;
        if (btnText && btnText.textContent?.includes('ADD TO CART')) {
          btnText.textContent = 'SOLD OUT';
        }
      } else if (stockCount > 0 && stockCount <= 5) {
        addToCartBtn.disabled = false;
        addToCartBtn.style.opacity = '1';
        addToCartBtn.style.cursor = 'pointer';
        addToCartBtn.title = `Only ${stockCount} left in stock`;

        const btnText = addToCartBtn.querySelector('span') || addToCartBtn;
        if (btnText && btnText.textContent?.includes('SOLD OUT')) {
          btnText.textContent = 'ADD TO CART';
        }
      } else {
        addToCartBtn.disabled = false;
        addToCartBtn.style.opacity = '1';
        addToCartBtn.style.cursor = 'pointer';
        addToCartBtn.title = '';

        const btnText = addToCartBtn.querySelector('span') || addToCartBtn;
        if (btnText && btnText.textContent?.includes('SOLD OUT')) {
          btnText.textContent = 'ADD TO CART';
        }
      }
    }

    const existingStockIndicator = element.querySelector('.cartique-stock-indicator');
    if (existingStockIndicator) {
      existingStockIndicator.remove();
    }

    if (stockCount === 0) {
      const stockIndicator = document.createElement('div');
      stockIndicator.className = 'cartique-stock-indicator out-of-stock';
      stockIndicator.textContent = 'SOLD OUT';
      stockIndicator.style.cssText = `
        color: #ff4444;
        font-size: 12px;
        font-weight: 600;
        margin-top: 8px;
        text-transform: uppercase;
      `;

      if (addToCartBtn && addToCartBtn.parentNode) {
        addToCartBtn.parentNode.insertBefore(stockIndicator, addToCartBtn.nextSibling);
      } else {
        element.appendChild(stockIndicator);
      }
    } else if (stockCount > 0 && stockCount <= 5) {
      const stockIndicator = document.createElement('div');
      stockIndicator.className = 'cartique-stock-indicator low-stock';
      stockIndicator.textContent = `Only ${stockCount} left`;
      stockIndicator.style.cssText = `
        color: #ff8c00;
        font-size: 12px;
        font-weight: 600;
        margin-top: 8px;
      `;

      if (addToCartBtn && addToCartBtn.parentNode) {
        addToCartBtn.parentNode.insertBefore(stockIndicator, addToCartBtn.nextSibling);
      } else {
        element.appendChild(stockIndicator);
      }
    }
  }

  /* ==========================================================
     VARIANT & BULK PRICING HELPERS
     ========================================================== */

  _buildVariantMaps() {
    this.products.forEach(product => {
      if (product.variants && Array.isArray(product.variants)) {
        const map = new Map();
        product.variants.forEach(variant => {
          map.set(variant.id, variant);
        });
        this.variantMaps.set(product.id, map);
      }
    });
  }

  escapeHTML(str) {
    if (!str) return '';
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

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

  hasVariants(product) {
    return product && product.variants && Array.isArray(product.variants) && product.variants.length > 0;
  }

  getVariantAttributeObject(variant) {
    if (!variant || !variant.attributes) return {};

    if (!Array.isArray(variant.attributes)) {
      return variant.attributes;
    }

    const obj = {};
    variant.attributes.forEach(attr => {
      if (attr.key) {
        obj[attr.key] = attr.value;
      }
    });
    return obj;
  }

  getCurrentVariant(product) {
    if (!this.hasVariants(product)) {
      return {
        id: product.id,
        price: product.price || 0,
        bulkPrice: product.bulkPrice || null,
        bulkMinimumQty: product.bulkMinimumQty || null,
        inventory: product.inventory || 0,
        inventoryPolicy: product.inventoryPolicy || 'deny',
        image: product.image,
        attributes: product.attributes || {}
      };
    }

    const selected = this.selectedVariants.get(product.id);
    if (selected) return selected;

    const defaultVariant = product.variants.find(v => v.isDefault === true);
    if (defaultVariant) return defaultVariant;

    return product.variants[0];
  }

  getUnitPrice(variant, quantity = 1) {
    if (!variant) return 0;

    const price = variant.price || 0;

    if (
      variant.bulkPrice != null &&
      variant.bulkMinimumQty != null &&
      quantity >= variant.bulkMinimumQty
    ) {
      return variant.bulkPrice;
    }

    return price;
  }

  isAvailable(variant) {
    if (!variant) return false;

    if (variant.inventoryPolicy === 'continue') {
      return true;
    }

    return (variant.inventory || 0) > 0;
  }

  getVariantLabel(variant) {
    if (!variant) return '';
    const attrs = this.getVariantAttributeObject(variant);
    return Object.keys(attrs)
      .map(key => `${key}: ${attrs[key]}`)
      .join(', ');
  }

  getVariantAttributes(product) {
    if (!this.hasVariants(product)) return {};

    const attributes = {};
    product.variants.forEach(variant => {
      const attrs = this.getVariantAttributeObject(variant);
      Object.keys(attrs).forEach(key => {
        if (!attributes[key]) attributes[key] = [];
        const value = attrs[key];
        if (!attributes[key].includes(value)) {
          attributes[key].push(value);
        }
      });
    });

    return attributes;
  }

  hasVariantOptions(product) {
    if (!this.hasVariants(product)) return false;

    const attrSets = product.variants.map(v => {
      const attrs = this.getVariantAttributeObject(v);
      return JSON.stringify(Object.keys(attrs).sort().map(k => ({ key: k, value: attrs[k] })));
    });

    return new Set(attrSets).size > 1;
  }

  hasBulkPricing(variant) {
    return variant && variant.bulkPrice != null && variant.bulkMinimumQty != null;
  }

  /* ==========================================================
     VARIANT RENDER METHODS
     ========================================================== */

  renderVariantSelector(product) {
    if (!this.hasVariantOptions(product)) return '';

    const attributes = this.getVariantAttributes(product);
    const currentVariant = this.getCurrentVariant(product);
    const currentAttrs = this.getVariantAttributeObject(currentVariant);

    let html = `<div class="cartique-variant-selector" data-product-id="${product.id}">`;

    Object.keys(attributes).forEach(attrKey => {
      const values = attributes[attrKey];
      const label = this.escapeHTML(attrKey.charAt(0).toUpperCase() + attrKey.slice(1));
      const currentValue = this.escapeHTML(currentAttrs[attrKey] || values[0] || '');

      html += `
        <div class="cartique-variant-group" data-key="${this.escapeHTML(attrKey)}">
          <span class="cartique-variant-label">${label}: 
            <span class="cartique-selected-value">${currentValue}</span>
          </span>
          <div class="cartique-variant-options">
      `;

      values.forEach(value => {
        const variant = product.variants.find(v => {
          const attrs = this.getVariantAttributeObject(v);
          return attrs[attrKey] === value;
        });

        if (!variant) return;

        const isSelected = value === currentAttrs[attrKey];
        const available = this.isAvailable(variant);
        const safeValue = this.escapeHTML(value);

        html += `
          <div class="cartique-variant-option ${isSelected ? 'selected' : ''} ${!available ? 'out-of-stock' : ''}"
               data-product-id="${product.id}"
               data-variant-id="${variant.id}"
               data-attr-key="${this.escapeHTML(attrKey)}"
               data-attr-value="${safeValue}"
               role="button"
               tabindex="0">
            ${safeValue}
            ${!available ? ' (Sold Out)' : ''}
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  renderBulkPricing(product, quantity = 1) {
    const variant = this.getCurrentVariant(product);

    if (!this.hasBulkPricing(variant)) return '';

    const isBulk = quantity >= variant.bulkMinimumQty;
    const savings = variant.price - variant.bulkPrice;
    const savingsPercent = Math.round((savings / variant.price) * 100);

    return `
      <div class="cartique-bulk-header">📦 Bulk Price Available</div>
      <div class="cartique-bulk-row">
        <span class="cartique-bulk-price">${this.escapeHTML(this.currencySymbol + variant.bulkPrice.toFixed(2))}</span>
        <span class="cartique-bulk-min">Min ${this.escapeHTML(variant.bulkMinimumQty)} items</span>
        ${savingsPercent > 0 ? `<span class="cartique-bulk-savings">Save ${savingsPercent}%</span>` : ''}
      </div>
      ${isBulk ? '<div class="cartique-bulk-active">✓ Bulk price applied</div>' : ''}
    `;
  }

  renderQuantitySelector(productId, quantity = 1) {
    if (!this.features.quantity) return '';

    return `
      <div class="cartique-quantity-wrapper">
        <label class="cartique-quantity-label">Quantity:</label>
        <div class="cartique-quantity-selector">
          <button class="cartique-qty-btn cartique-qty-decrease" data-product-id="${productId}">−</button>
          <input type="number" 
                 class="cartique-quantity-input" 
                 value="${quantity}" 
                 min="1" 
                 step="1"
                 data-product-id="${productId}">
          <button class="cartique-qty-btn cartique-qty-increase" data-product-id="${productId}">+</button>
        </div>
      </div>
    `;
  }

  /* ==========================================================
     SINGLE PRODUCT VIEW
     ========================================================== */

  showSingleProductView(productId) {
    productId = Number(productId);
    const product = this.products.find(p => p.id === productId);

    if (!product) {
      console.error('Product not found:', productId);
      return;
    }

    this.previousViewState = {
      layout: this.currentLayout,
      searchQuery: this.currentSearchQuery,
      sortType: this.currentSortType,
      scrollPosition: window.scrollY
    };

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

    const mainContent = document.getElementById('cartique-main-content');
    if (mainContent) {
      mainContent.classList.add('cartique-full-width');
    }

    this.singleProductViewActive = true;
    this.renderSingleProduct(product);

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
      const mainContent = document.getElementById('cartique-main-content');
      if (!mainContent) return;
      container = document.createElement('div');
      container.id = 'single-product-view-container';
      mainContent.appendChild(container);
    }

    const variant = this.getCurrentVariant(product);
    const quantity = this.currentQuantities.get(product.id) || 1;
    const price = this.getUnitPrice(variant, quantity);
    const image = variant.image || product.image;
    const inventory = variant.inventory !== undefined ? variant.inventory : product.inventory || 0;
    const available = this.isAvailable(variant);

    const safeTitle = this.escapeHTML(product.title);
    const safeDescription = this.escapeHTML(product.description || '');
    const safeImage = this.escapeHTML(image);

    container.innerHTML = `
      <button class="back-to-products" data-product-id="${product.id}">← Back to Products</button>
      <div class="product-content-wrapper">
        <div class="product-image-column">
          <div class="product-image-container">
            <img src="${safeImage}" alt="${safeTitle}" loading="lazy">
          </div>
        </div>
        <div class="product-info-column">
          <div class="product-meta">
            <h2>${safeTitle}</h2>
            <div class="price-container">
              <span class="price">${this.escapeHTML(this.currencySymbol + price.toFixed(2))}</span>
            </div>
            ${this.renderVariantSelector(product)}
            <div class="cartique-bulk-pricing">
              ${this.renderBulkPricing(product, quantity)}
            </div>
            ${this.renderQuantitySelector(product.id, quantity)}
            <p class="product-description">${safeDescription}</p>
          </div>
          <button class="spv-cartique_add_to_cart" 
                  data-product-id="${product.id}"
                  data-variant-id="${variant.id || product.id}">
            ${available ? 'ADD TO CART' : 'SOLD OUT'}
          </button>
        </div>
      </div>
      <div class="product-tabs-container">
        <div class="product-tabs-header">
          <button class="tab-button active" data-tab="details">Product Details</button>
          <button class="tab-button" data-tab="reviews">Reviews</button>
        </div>
        <div class="tab-content active" data-tab-content="details">
          ${this.renderProductDetails(product)}
        </div>
        <div class="tab-content" data-tab-content="reviews">
          ${this.renderProductReviews(product)}
        </div>
      </div>
    `;

    this.attachSingleProductEvents(product);
  }

  updateSingleProductDisplay(product) {
    const container = document.getElementById('single-product-view-container');
    if (!container) return;

    const variant = this.getCurrentVariant(product);
    const quantity = this.currentQuantities.get(product.id) || 1;
    const price = this.getUnitPrice(variant, quantity);
    const image = variant.image || product.image;
    const inventory = variant.inventory !== undefined ? variant.inventory : product.inventory || 0;
    const available = this.isAvailable(variant);

    const priceEl = container.querySelector('.price-container .price');
    if (priceEl) {
      priceEl.textContent = `${this.currencySymbol}${price.toFixed(2)}`;
    }

    const imgEl = container.querySelector('.product-image-container img');
    if (imgEl) {
      imgEl.src = image;
    }

    const bulkContainer = container.querySelector('.cartique-bulk-pricing');
    if (bulkContainer) {
      bulkContainer.innerHTML = this.renderBulkPricing(product, quantity);
    }

    const btn = container.querySelector('.spv-cartique_add_to_cart');
    if (btn) {
      btn.dataset.variantId = variant.id || product.id;
      btn.textContent = available ? 'ADD TO CART' : 'SOLD OUT';
      btn.disabled = !available;
    }
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

    const mainContent = document.getElementById('cartique-main-content');
    if (mainContent) {
      if (this.features.sidebarDisplay === 'none') {
        mainContent.classList.add('cartique-full-width');
      } else {
        mainContent.classList.remove('cartique-full-width');
      }
    }

    this.singleProductViewActive = false;

    if (this.previousViewState?.scrollPosition) {
      window.scrollTo(0, this.previousViewState.scrollPosition);
    }
  }

  /* ==========================================================
     EVENT HANDLING
     ========================================================== */

  attachSingleProductEvents(product) {
    const container = document.getElementById('single-product-view-container');
    if (!container) return;

    if (this._clickHandler) {
      container.removeEventListener('click', this._clickHandler);
    }
    if (this._changeHandler) {
      container.removeEventListener('change', this._changeHandler);
    }

    this._clickHandler = (e) => {
      const option = e.target.closest('.cartique-variant-option');
      if (option) {
        this.selectVariant(option);
        return;
      }

      if (e.target.closest('.cartique-qty-decrease')) {
        this.changeQuantity(product.id, -1);
        return;
      }
      if (e.target.closest('.cartique-qty-increase')) {
        this.changeQuantity(product.id, 1);
        return;
      }

      if (e.target.closest('.spv-cartique_add_to_cart')) {
        this.addToCart(e);
        return;
      }

      if (e.target.closest('.back-to-products')) {
        this.returnToListView();
        return;
      }

      const tab = e.target.closest('.tab-button');
      if (tab) {
        container.querySelectorAll('.tab-button, .tab-content').forEach(el => {
          el.classList.remove('active');
        });
        tab.classList.add('active');
        const tabName = tab.dataset.tab;
        const content = container.querySelector(`[data-tab-content="${tabName}"]`);
        if (content) content.classList.add('active');
      }
    };

    this._changeHandler = (e) => {
      const qtyInput = e.target.closest('.cartique-quantity-input');
      if (qtyInput) {
        let val = parseInt(qtyInput.value) || 1;
        val = Math.max(1, val);
        qtyInput.value = val;
        this.currentQuantities.set(product.id, val);
        this.updateSingleProductDisplay(product);
      }
    };

    container.addEventListener('click', this._clickHandler);
    container.addEventListener('change', this._changeHandler);
  }

  setupEventListeners() {
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

  /* ==========================================================
     ACTIONS
     ========================================================== */

  selectVariant(element) {
    const productId = Number(element.dataset.productId);
    const variantId = Number(element.dataset.variantId);

    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const variant = this.variantMaps.get(productId)?.get(variantId);
    if (!variant) return;

    this.selectedVariants.set(productId, variant);

    const container = element.closest('.cartique-variant-selector');
    if (container) {
      const groupKey = element.dataset.attrKey;
      container.querySelectorAll(`.cartique-variant-option[data-attr-key="${groupKey}"]`).forEach(el => {
        el.classList.remove('selected');
      });
      element.classList.add('selected');

      const groupContainer = element.closest('.cartique-variant-group');
      if (groupContainer) {
        const labelEl = groupContainer.querySelector('.cartique-selected-value');
        if (labelEl) {
          labelEl.textContent = element.dataset.attrValue;
        }
      }
    }

    this.updateSingleProductDisplay(product);
  }

  changeQuantity(productId, delta) {
    const current = this.currentQuantities.get(productId) || 1;
    const newQty = Math.max(1, current + delta);
    this.currentQuantities.set(productId, newQty);

    const container = document.getElementById('single-product-view-container');
    if (container) {
      const input = container.querySelector('.cartique-quantity-input');
      if (input) input.value = newQty;
    }

    const product = this.products.find(p => p.id === productId);
    if (product) this.updateSingleProductDisplay(product);
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

  /* ==========================================================
     SEARCH, FILTER, SORT
     ========================================================== */

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

  applyAllFilters() {
    this.filteredProducts = this.products.filter(product => {
      let matchesCategory = true;

      if (this.activeCategoryId) {
        matchesCategory = product.categories?.some(
          c => String(c.id) === String(this.activeCategoryId)
        );
      }

      if (matchesCategory && this.activeFilters['category']?.length > 0) {
        const productCategoryNames = product.categories?.map(c => c.name) || [];
        matchesCategory = this.activeFilters['category'].some(
          catName => productCategoryNames.includes(catName)
        );
      }

      if (!matchesCategory) return false;

      const query = this.currentSearchQuery;
      const matchesSearch = !query ||
        (product.title?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query));

      if (!matchesSearch) return false;

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

  _checkPriceMatch(price, label) {
    const numbers = label.match(/\d+/g)?.map(Number);
    if (!numbers) return false;

    if (label.includes('Under')) {
      return price < numbers[0];
    }
    if (label.includes('Over')) {
      return price > numbers[0];
    }
    if (numbers.length === 2) {
      return price >= numbers[0] && price <= numbers[1];
    }
    return false;
  }

  /* ==========================================================
     SIDEBAR FILTERS
     ========================================================== */

  renderSidebarFilters() {
    const container = document.getElementById('cartique-filter-sidebar');
    if (!container) return;

    const filters = { ...this.features.sidebarFeatures.filters };
    let finalHTML = '';

    if (this.categories && this.categories.length > 0) {
      const categoryNames = this.categories.map(cat => cat.name).sort();
      finalHTML += this.generateFilterHTML('category', categoryNames);
    }

    if (filters.priceRange) {
      finalHTML += this.generateFilterHTML('priceRange', filters.priceRange);
      delete filters.priceRange;
    }

    finalHTML += Object.entries(filters).map(([group, options]) => {
      return this.generateFilterHTML(group, options);
    }).join('');

    container.innerHTML = finalHTML;

    container.addEventListener('change', (e) => {
      if (e.target.matches('input[type="checkbox"]')) {
        this.handleFilterChange(e.target);
      }
    });
  }

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

    checkedBoxes.forEach(cb => {
      const type = cb.dataset.type;
      if (!activeFilters[type]) activeFilters[type] = [];
      activeFilters[type].push(cb.value);
    });

    this.activeFilters = activeFilters;
    this.applyAllFilters();
  }

  /* ==========================================================
     CATALOGUE MENU
     ========================================================== */

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
    const cfg = this.features.menu;
    if (!cfg || !cfg.enabled) return;

    const menuType = cfg.type || 'mega';
    const menuPosition = cfg.position || 'top';
    const menuColumns = cfg.megaMenuColumns || 3;

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

    if (menuType === 'mega') {
      const wrapper = anchor.querySelector('.cartique-mega-wrapper');
      const trigger = anchor.querySelector('.mega-trigger');

      const newTrigger = trigger.cloneNode(true);
      trigger.parentNode.replaceChild(newTrigger, trigger);

      newTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        wrapper.classList.toggle('is-open');
      });

      document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
          wrapper.classList.remove('is-open');
        }
      });
    }
  }

  _attachMenuEvents(container) {
    const selectors = '.cartique-menu-item, .mega-item';

    container.querySelectorAll(selectors).forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();

        const catId = item.getAttribute('data-cat-id');

        this.activeCategoryId = (catId === 'all') ? null : catId;

        const wrapper = container.querySelector('.cartique-mega-wrapper');
        if (wrapper) wrapper.classList.remove('is-open');

        if (catId === 'all') {
          document.querySelectorAll('input[data-type="category"]').forEach(cb => {
            cb.checked = false;
          });
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

  /* ==========================================================
     CART
     ========================================================== */

  addToCart(event) {
    const button = event.target.closest('.cartique_add_to_cart, .spv-cartique_add_to_cart');
    if (!button) return;

    const productId = Number(button.dataset.productId);
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const variant = this.getCurrentVariant(product);
    const quantity = this.currentQuantities.get(productId) || 1;
    const price = this.getUnitPrice(variant, quantity);
    const image = variant.image || product.image;
    const inventory = variant.inventory !== undefined ? variant.inventory : product.inventory || 0;

    if (!this.isAvailable(variant)) {
      this.showStockAlert('This product is SOLD OUT');
      return;
    }

    const variantLabel = this.getVariantLabel(variant);

    const cartItem = {
      id: product.id,
      title: product.title,
      image: image,
      variantId: variant.id,
      cart_quantity: quantity,
      unitPrice: price,
      variantLabel: variantLabel || '',
    };

    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    const existingIndex = cart.findIndex(item => item.variantId === variant.id);

    if (existingIndex === -1) {
      cart.push(cartItem);
    } else {
      const newQuantity = cart[existingIndex].cart_quantity + quantity;
      if (newQuantity > inventory) {
        this.showStockAlert(`Only ${inventory} available. You have ${cart[existingIndex].cart_quantity} in cart.`);
        return;
      }
      cart[existingIndex].cart_quantity = newQuantity;
      cart[existingIndex].unitPrice = price;
    }

    localStorage.setItem('cartiqueCart', JSON.stringify(cart));
    this.showCart();
  }

  showCart() {
    const cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    const cartContainer = document.getElementById('cart-items-container');

    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    const emptyMsg = document.getElementById('shopping-cart-empty');
    const viewBtn = document.getElementById('view-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (emptyMsg) emptyMsg.classList.toggle('show', cart.length === 0);
    if (viewBtn) viewBtn.style.display = cart.length === 0 ? 'none' : 'block';
    if (checkoutBtn) checkoutBtn.style.display = cart.length === 0 ? 'none' : 'block';

    let subtotal = 0;

    cart.forEach(product => {
      const wrapper = this.templateHolder.content.getElementById('cartique-cart-item-component');
      if (!wrapper) return;

      const cartItem = wrapper.firstElementChild.cloneNode(true);

      this.updateCartItem(cartItem, product);
      this.addCartItemEventListeners(cartItem, product.id);

      const variant = this.getCurrentVariant(product);
      const quantity = product.cart_quantity || 1;
      const price = this.getUnitPrice(variant, quantity);
      subtotal += price * quantity;

      cartContainer.appendChild(cartItem);
    });

    const subtotalEl = document.getElementById('subtotal');
    const subtotalCurrencyEl = document.getElementById('subtotal-currency');

    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
    if (subtotalCurrencyEl) subtotalCurrencyEl.textContent = this.currencySymbol || 'R';

    const hiddenBlocks = document.getElementById('cartique-hidden-blocks');
    if (hiddenBlocks) {
      hiddenBlocks.style.display = 'block';
    }

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

    if (hiddenBlocks) {
      setTimeout(() => {
        hiddenBlocks.style.display = 'none';
      }, 350);
    }
  }

  updateCartItem(cartItem, product) {
    const imgEl = cartItem.querySelector('#image');
    if (imgEl) {
      imgEl.src = product.image || '';
      imgEl.alt = product.title || '';
    }

    const titleEl = cartItem.querySelector('#title');
    if (titleEl) titleEl.textContent = product.title || '';

    let variant = null;
    if (product.variantId) {
      variant = this.variantMaps.get(product.id)?.get(product.variantId);
    }
    if (!variant && product.variants && product.variants.length > 0) {
      variant = product.variants[0];
    }
    if (!variant) {
      variant = {
        id: product.id,
        price: product.price || 0,
        bulkPrice: product.bulkPrice,
        bulkMinimumQty: product.bulkMinimumQty,
        inventory: product.inventory || 0
      };
    }

    const quantity = product.cart_quantity || 1;
    const price = this.getUnitPrice(variant, quantity);
    const totalPrice = price * quantity;

    const priceEl = cartItem.querySelector('#price');
    const salePriceEl = cartItem.querySelector('#sale_price');
    const currencyEls = cartItem.querySelectorAll('#currency');

    currencyEls.forEach(el => el.textContent = this.currencySymbol || 'R');

    const existingBulkMsg = cartItem.querySelector('.cart-bulk-status');
    if (existingBulkMsg) existingBulkMsg.remove();

    const hasBulk = this.hasBulkPricing(variant);

    if (hasBulk && quantity >= variant.bulkMinimumQty) {
      if (priceEl) {
        priceEl.textContent = variant.price;
        priceEl.style.textDecoration = 'line-through';
        priceEl.style.color = '#6c757d';
        priceEl.style.fontSize = '14px';
        priceEl.style.opacity = '0.7';
      }

      if (salePriceEl) {
        salePriceEl.textContent = variant.bulkPrice;
        salePriceEl.style.display = 'inline';
        salePriceEl.style.color = '#28a745';
        salePriceEl.style.fontWeight = 'bold';
        salePriceEl.style.fontSize = '18px';

        const parentSpan = salePriceEl.parentElement;
        if (parentSpan) parentSpan.style.display = 'inline';
      }

      const detailsDiv = cartItem.querySelector('.cart-item-details');
      if (detailsDiv) {
        const bulkStatus = document.createElement('div');
        bulkStatus.className = 'cart-bulk-status';
        bulkStatus.innerHTML = `
          <div class="bulk-heading active">✓ Bulk Price Applied</div>
          <div class="bulk-price-display">${this.currencySymbol}${variant.bulkPrice} each</div>
          <div class="bulk-min-qty">Min ${variant.bulkMinimumQty} items</div>
        `;
        detailsDiv.appendChild(bulkStatus);
      }
    } else {
      if (priceEl) {
        priceEl.textContent = variant.price || product.price || 0;
        priceEl.style.textDecoration = 'none';
        priceEl.style.color = '';
        priceEl.style.fontSize = '';
        priceEl.style.opacity = '';
      }

      if (salePriceEl) {
        salePriceEl.textContent = '';
        salePriceEl.style.display = 'none';
        const parentSpan = salePriceEl.parentElement;
        if (parentSpan) parentSpan.style.display = 'none';
      }
    }

    const quantityInput = cartItem.querySelector('.quantity');
    if (quantityInput) {
      quantityInput.value = quantity;
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
      const product = this.products.find(p => p.id === productId);
      const availableStock = product ? this.getProductStock(product) : 0;
      const newQuantity = cart[index].cart_quantity + 1;

      if (newQuantity > availableStock) {
        this.showStockAlert(
          `Cannot add more. Only ${availableStock} available in total.`
        );
        return;
      }

      cart[index].cart_quantity = newQuantity;
      localStorage.setItem('cartiqueCart', JSON.stringify(cart));
      this.showCart();
    }
  }

  /* ==========================================================
     CART PAGE
     ========================================================== */

  showCartPage() {
    this.closeCart();

    const productDisplays = document.getElementById('cartique-product-displays');
    const sidebar = document.getElementById('cartique-sidebar');
    const menuAnchor = document.getElementById('cartique-menu-anchor-top');
    const controls = document.getElementById('cartique-controls');

    if (productDisplays) productDisplays.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
    if (menuAnchor) menuAnchor.style.display = 'none';
    if (controls) controls.style.display = 'none';

    const mainContent = document.getElementById('cartique-main-content');
    if (mainContent) {
      mainContent.classList.add('cartique-full-width');
    }

    this.singleProductViewActive = true;
    this.renderCartPage();

    requestAnimationFrame(() => {
      const cartPage = document.getElementById('cartique-cart-page');
      if (cartPage) {
        cartPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (mainContent) mainContent.scrollTop = 0;
    });
  }

  renderCartPage() {
    const cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    const mainContent = document.getElementById('cartique-main-content');

    if (!mainContent) return;

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
        const variant = this.getCurrentVariant(product);
        const quantity = product.cart_quantity || 1;
        const price = this.getUnitPrice(variant, quantity);
        const itemTotal = price * quantity;
        subtotal += itemTotal;

        const hasBulk = this.hasBulkPricing(variant);
        const isBulk = hasBulk && quantity >= variant.bulkMinimumQty;

        let priceHTML = '';
        let bulkStatusHTML = '';

        if (isBulk) {
          priceHTML = `
            <span class="original-price-strikethrough">${this.currencySymbol}${variant.price.toFixed(2)}</span>
            <span class="bulk-price-active">${this.currencySymbol}${variant.bulkPrice.toFixed(2)}</span>
          `;
          bulkStatusHTML = `
            <div class="cart-page-bulk-status active">
              <span class="bulk-heading-active">✓ Bulk Price Applied</span>
              <span class="bulk-min-qty">Min ${variant.bulkMinimumQty} items</span>
            </div>
          `;
        } else if (hasBulk) {
          priceHTML = `
            <span class="retail-price">${this.currencySymbol}${variant.price.toFixed(2)}</span>
          `;
          bulkStatusHTML = `
            <div class="cart-page-bulk-status">
              <span class="bulk-heading">BULK PRICE</span>
              <span class="bulk-price-available">${this.currencySymbol}${variant.bulkPrice.toFixed(2)} each</span>
              <span class="bulk-min-qty">Min ${variant.bulkMinimumQty} items</span>
            </div>
          `;
        } else {
          priceHTML = `
            <span class="retail-price">${this.currencySymbol}${(product.price || variant?.price || 0).toFixed(2)}</span>
          `;
        }

        itemsHTML += `
          <div class="cart-page-item" data-product-id="${product.id}" data-variant-id="${product.variantId || ''}">
            <div class="cart-page-item-image">
              <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="cart-page-item-details">
              <h3>${product.title}</h3>
              <p class="cart-page-item-price">${priceHTML}</p>
              ${bulkStatusHTML}
              <div class="cart-page-item-actions">
                <div class="cart-page-quantity">
                  <button class="cart-page-qty-btn decrease-page-qty" data-id="${product.id}">−</button>
                  <input type="text" class="cart-page-qty-input" value="${quantity}" readonly data-id="${product.id}">
                  <button class="cart-page-qty-btn increase-page-qty" data-id="${product.id}">+</button>
                </div>
                <button class="cart-page-remove" data-id="${product.id}">Remove</button>
              </div>
            </div>
            <div class="cart-page-item-total">${this.currencySymbol}${itemTotal.toFixed(2)}</div>
          </div>
        `;
      });

      cartPage.innerHTML = `
        <div class="cart-page-container">
          <div class="cart-page-header">
            <button class="cart-page-back" id="cart-page-back">← Back to Shop</button>
            <h2>Shopping Cart (${cart.length} ${cart.length === 1 ? 'item' : 'items'})</h2>
          </div>
          <div class="cart-page-items">${itemsHTML}</div>
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
    this.attachCartPageEvents(cartPage);
  }

  attachCartPageEvents(cartPage) {
    const backBtn = cartPage.querySelector('#cart-page-back');
    if (backBtn) {
      this.addEventListener(backBtn, 'click', () => this.closeCartPage());
    }

    const continueBtns = cartPage.querySelectorAll('#cart-page-back-btn, #cart-page-continue');
    continueBtns.forEach(btn => {
      this.addEventListener(btn, 'click', () => this.closeCartPage());
    });

    cartPage.querySelectorAll('.decrease-page-qty').forEach(btn => {
      this.addEventListener(btn, 'click', (e) => {
        const productId = parseInt(e.target.dataset.id);
        this.decreasePageQty(productId);
        this.renderCartPage();
      });
    });

    cartPage.querySelectorAll('.increase-page-qty').forEach(btn => {
      this.addEventListener(btn, 'click', (e) => {
        const productId = parseInt(e.target.dataset.id);
        this.increasePageQty(productId);
        this.renderCartPage();
      });
    });

    cartPage.querySelectorAll('.cart-page-remove').forEach(btn => {
      this.addEventListener(btn, 'click', (e) => {
        const productId = parseInt(e.target.dataset.id);
        this.removePageItem(productId);
        this.renderCartPage();
      });
    });

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

    const singleProductView = document.getElementById('single-product-view-container');
    const wasInSingleView = singleProductView && singleProductView.style.display === 'none' &&
      singleProductView.innerHTML !== '';

    if (wasInSingleView) {
      if (singleProductView) singleProductView.style.display = 'block';
    } else {
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
      const product = this.products.find(p => p.id === productId);
      const availableStock = product ? this.getProductStock(product) : 0;
      const newQuantity = cart[index].cart_quantity + 1;

      if (newQuantity > availableStock) {
        this.showStockAlert(
          `Cannot add more. Maximum available: ${availableStock}`
        );
        return;
      }

      cart[index].cart_quantity += 1;
      localStorage.setItem('cartiqueCart', JSON.stringify(cart));
    }
  }

  removePageItem(productId) {
    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem('cartiqueCart', JSON.stringify(cart));
  }

  /* ==========================================================
     CHECKOUT
     ========================================================== */

  checkout() {
    const cartPage = document.getElementById('cartique-cart-page');
    if (cartPage) {
      cartPage.remove();

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
      this.closeCart();
    }

    this.showCheckoutAlert();
  }

  showCheckoutAlert() {
    const toast = document.querySelector('.toast');
    const closeIcon = document.querySelector('.toast .close');

    if (!toast || !closeIcon) return;

    this.clearToastTimeouts();

    toast.classList.add('active');

    const closeHandler = () => {
      toast.classList.remove('active');
      this.clearToastTimeouts();
    };

    this.addEventListener(closeIcon, 'click', closeHandler, { once: true });

    this.toastTimer1 = setTimeout(() => {
      toast.classList.remove('active');
    }, 5000);

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

  /* ==========================================================
     STOCK & ALERTS
     ========================================================== */

  getProductStock(product) {
    if (typeof product.inventory === 'number') {
      return product.inventory;
    }

    if (typeof product.totalInventory === 'number') {
      return product.totalInventory;
    }

    if (product.variants?.length) {
      return product.variants.reduce((total, v) => {
        return total + (typeof v.inventory === 'number' ? v.inventory : 0);
      }, 0);
    }

    return 10;
  }

  showStockAlert(message) {
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

  clearToastTimeouts() {
    if (this.toastTimer1) clearTimeout(this.toastTimer1);
    if (this.redirectTimer) clearTimeout(this.redirectTimer);
  }

  /* ==========================================================
     REVIEWS
     ========================================================== */

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
                ${[5, 4, 3, 2, 1].map(star => `
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

  /* ==========================================================
     INFINITE SCROLL
     ========================================================== */

  setupInfiniteScroll() {
    if (this.observer) this.observer.disconnect();

    const layout = this.currentLayout || 'grid';
    const gridContainer = document.getElementById('cartique-product-grid');
    const listContainer = document.getElementById('cartique-product-list');
    const activeContainer = layout === 'grid' ? gridContainer : listContainer;

    if (!activeContainer) return;

    const existingSentinel = document.getElementById('cartique-scroll-sentinel');
    if (existingSentinel) {
      existingSentinel.remove();
    }

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
    const productsSource = this.filteredProducts || this.products;
    const sentinel = document.getElementById('cartique-scroll-sentinel');

    if (this.loadedCount >= productsSource.length) {
      if (this.observer) this.observer.disconnect();
      if (sentinel) {
        sentinel.classList.remove('is-loading');
        sentinel.style.display = 'none';
      }
      return;
    }

    const layout = this.currentLayout || 'grid';
    const container = layout === 'grid'
      ? document.getElementById('cartique-product-grid')
      : document.getElementById('cartique-product-list');

    if (!container) return;

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

      container.insertBefore(fragment, sentinel);

      this.loadedCount += nextBatch.length;

      if (sentinel) {
        sentinel.classList.remove('is-loading');
        sentinel.innerHTML = '';
      }

      if (this.loadedCount >= productsSource.length) {
        if (this.observer) this.observer.disconnect();
        if (sentinel) sentinel.style.display = 'none';
      }
    }, 400);
  }

  /* ==========================================================
     ERROR & CLEANUP
     ========================================================== */

  showErrorMessage(message) {
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

  destroy() {
    const container = document.getElementById('single-product-view-container');
    if (container) {
      if (this._clickHandler) {
        container.removeEventListener('click', this._clickHandler);
        this._clickHandler = null;
      }
      if (this._changeHandler) {
        container.removeEventListener('change', this._changeHandler);
        this._changeHandler = null;
      }
    }

    this.selectedVariants.clear();
    this.currentQuantities.clear();
    this.variantMaps.clear();

    this.cleanupEventListeners();
    this.clearToastTimeouts();

    const singleProductView = document.getElementById('single-product-view-container');
    if (singleProductView) singleProductView.remove();

    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}