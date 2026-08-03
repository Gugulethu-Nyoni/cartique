export default {
    name: 'cart',

    match(route) {
        return route.hash === '#cart';
    },

    execute(context, route) {
        context.capabilityTrace?.log('CART', 'Cart hash detected');
        context.openCart();
    }
};
