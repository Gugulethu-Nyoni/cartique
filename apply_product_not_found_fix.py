from pathlib import Path

# -------------------------------------------------
# ProductRenderer.js
# -------------------------------------------------

renderer_path = Path("storefront/src/renderers/ProductRenderer.js")

renderer = renderer_path.read_text()


marker = "    async renderSingleProduct"

empty_state = r'''
    renderEmptyState({
        title = 'No products found',
        message = '',
        action = 'Return to shop',
        containerId = null
    } = {}) {

        let container;

        if (containerId) {
            container = document.getElementById(containerId);
        }

        if (!container) {
            container =
                document.getElementById('single-product-view-container') ||
                document.getElementById('cartique-product-displays') ||
                document.getElementById('cartique-main-content');
        }

        if (!container) {
            console.warn('[ProductRenderer] Empty state container missing');
            return;
        }

        container.innerHTML = `
            <div class="no-results-msg"
                 style="width:100%; text-align:center; padding:4rem 1rem;">

                <h2>${title}</h2>

                <p style="font-size:1.2rem;color:#555;margin:1rem 0;">
                    ${message}
                </p>

                <button
                    onclick="window.location.href=document.querySelector('base')?.href || '/'"
                    style="
                        cursor:pointer;
                        background:none;
                        border:none;
                        border-bottom:1px solid #000;
                        font-weight:600;
                    ">
                    ${action}
                </button>

            </div>
        `;
    }

'''

if "renderEmptyState({" not in renderer:

    if marker not in renderer:
        raise Exception("Could not find renderSingleProduct marker")

    renderer = renderer.replace(
        marker,
        empty_state + marker,
        1
    )


old_block = """        if (!product) {
            console.error('Product not found');
            return;
        }"""


new_block = """        if (!product) {
            console.error('Product not found');
            return this.renderEmptyState({
                title: 'Product not found',
                message: 'The product you are looking for does not exist.'
            });
        }"""


if old_block in renderer:
    renderer = renderer.replace(
        old_block,
        new_block,
        1
    )


renderer_path.write_text(renderer)


# -------------------------------------------------
# StorefrontCore.js
# -------------------------------------------------

core_path = Path("storefront/src/StorefrontCore.js")

core = core_path.read_text()


old_product_method = """  product(slug) {
    this.capabilityTrace?.log('PRODUCT', 'Public API called', slug);
    const product = this.findProductBySlug(slug);
    if (!product) {
      this.capabilityTrace?.log('PRODUCT', 'Product not found', slug);
      return;
    }
    return this.showSingleProductView(product.id);
  }"""


new_product_method = """  product(slug) {
    this.capabilityTrace?.log('PRODUCT', 'Public API called', slug);
    const product = this.findProductBySlug(slug);
    if (!product) {
      this.capabilityTrace?.log('PRODUCT', 'Product not found', slug);
      return this.productRenderer?.renderEmptyState({
        title: 'Product not found',
        message: `We could not find: "${slug}"`
      });
    }
    return this.showSingleProductView(product.id);
  }"""


if old_product_method not in core:
    raise Exception("Could not find StorefrontCore product() method")


core = core.replace(
    old_product_method,
    new_product_method,
    1
)

core_path.write_text(core)


print("✅ Product not found handling applied")
