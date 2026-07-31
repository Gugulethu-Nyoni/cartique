/**
 * ------------------------------------------------------------
 * Cartique Theme Benchmark
 * Component: ProductImage
 * Theme: Fashion
 * ------------------------------------------------------------
 */

export default class ProductImage {

    constructor(ctx = {}) {
        this.ctx = ctx;
    }

    render() {

        const {
            product = {}
        } = this.ctx;

        return `

<div
    class="fashion-product-image"
    data-cartique-component="ProductImage">

    <img

        src="${product.image || ''}"

        alt="${product.name || ''}"

        class="fashion-product-image__image"

        data-cartique-element="image"

    >

    <div
        class="fashion-product-image__overlay"
        data-cartique-element="overlay">

    </div>

</div>

`;

    }

}
