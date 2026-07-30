/**
 * Theme Config Schema
 */

export const themeConfigSchema = {
    name: 'string',
    version: 'string',
    extends: 'string|null',
    variables: {
        primary: 'string',
        accent: 'string',
        background: 'string',
        text: 'string',
        radius: 'string'
    },
    components: {
        productCard: 'string',
        productGrid: 'string',
        cartDrawer: 'string'
    }
};

export default themeConfigSchema;
