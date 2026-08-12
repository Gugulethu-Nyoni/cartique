import { products } from '../../../storefront/demo/shop/products.js';

export class ProductRepository {
    constructor(dataSource = products) {
        this.dataSource = dataSource;
    }

    findById(id) {
        return this.dataSource.find(product => product.id === id);
    }

    findAll() {
        return this.dataSource;
    }

    findVariant(productId, variantId) {
        const product = this.findById(productId);
        return product?.variants?.find(
            variant => variant.id === variantId
        );
    }
}
