export default {
    name: 'category',

    match(route) {
        return route.params.has('category');
    },

    execute(context, route) {
        const categoryId = route.params.get('category');

        context.capabilityTrace?.log('CATEGORY', 'URL category extracted', categoryId);

        if (!categoryId) {
            return;
        }

        context.category(categoryId);
    }
};
