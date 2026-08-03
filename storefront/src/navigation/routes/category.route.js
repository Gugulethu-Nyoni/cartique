import resolveCategory from '../resolvers/category.resolver.js';

export default {
    name: 'category',

    match(route) {
        return route.params.has('category');
    },

    execute(context, route) {
        const categoryInput = route.params.get('category');

        context.capabilityTrace?.log('CATEGORY', 'Category input received', categoryInput);

        const categoryId = resolveCategory(
            context.collectionRenderer?.products || context.products,
            categoryInput
        );

        context.capabilityTrace?.log('CATEGORY', 'Resolved category ID', categoryId);

        if (!categoryId) {
            return;
        }

        context.category(categoryId);
    }
};
