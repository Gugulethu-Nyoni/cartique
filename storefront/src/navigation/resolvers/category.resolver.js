export default function resolveCategory(products, input) {
    if (!input) return null;

    const normalized = input.toLowerCase().trim().replace(/-/g, ' ');

    for (const product of products) {
        for (const category of product.categories || []) {
            const categoryName = category.name.toLowerCase();

            if (categoryName === normalized) {
                return category.id;
            }

            if (categoryName.includes(normalized)) {
                return category.id;
            }
        }
    }

    return null;
}
