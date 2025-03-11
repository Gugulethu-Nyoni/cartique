"use strict";

export default class Cartique {
  constructor(products, features = {}) {
    // Default features
    this.defaultFeatures = {
      grid: true, // Default layout
      pagination: true, // Enable pagination
      columns: 3, // Number of columns in grid layout
      rows: 10, // Number of rows per page
      theme: 'dark', // Default theme
      search: true, // Enable search
      sorting: true, // Enable sorting
      containerId: 'cartique', // Default container ID
      containerClass: 'cartique-container',
      sale: false, // Enable sale badges and strike-through pricing
      sidebarFeatures: {
        filters: {
          Color: ['Red', 'Blue', 'Green'],
          Size: ['S', 'M', 'L'],
          Brand: ['Adidas', 'Nike', 'Puma'],
        },
      },
    };

    // Merge user-provided features with defaults
    this.features = { ...this.defaultFeatures, ...features };

    // Initialize
    this.products = products; // Original products
    this.filteredProducts = [...products]; // Filtered products for display
    this.container = document.querySelector(`#${this.features.containerId}`);
    if (!this.container) {
      console.error(`Container with ID "${this.features.containerId}" not found.`);
      return;
    }

    // State for search and sorting
    this.currentSearchQuery = '';
    this.currentSortType = '';

    // References to search and sorting containers
    this.searchContainer = null;
    this.sortContainer = null;

    // Path to the merged HTML file
    this.filePath = 'build/routes/store/store.html';

    // Template holder for merged components
    this.templateHolder = null;

    this.init();
  }

  async init() {
    this.applyTheme();
    await this.fetchAndExtractComponents(); // Ensure templates are fully fetched before proceeding

    // Render UI components sequentially after fetching
    await this.renderMainFrame();
    await this.renderSidebar();
    await this.renderControls();
    await this.renderProductDisplays();
    await this.renderFooter();
    await this.renderCartSlider();
    await this.renderCartItemTemplate();

    // Set default layout to grid
    this.setLayout('grid');

    // Add event listeners for layout toggles
    const gridButton = document.querySelector('.grid-icon');
    const listButton = document.querySelector('.list-icon');

    if (gridButton && listButton) {
        gridButton.addEventListener('click', () => this.setLayout('grid'));
        listButton.addEventListener('click', () => this.setLayout('list'));
    }
}

  applyTheme() {
    const containerElement = document.getElementById(this.features.containerId);
    //containerElement.classList.add(this.features.containerClass);

    const root = document.documentElement;
    root.style.setProperty('--theme-primary', this.features.theme === 'dark' ? '#1e1e1e' : '#ffffff');
    root.style.setProperty('--theme-secondary', this.features.theme === 'dark' ? '#2e2e2e' : '#f9f9f9');
    root.style.setProperty('--theme-text', this.features.theme === 'dark' ? '#ffffff' : '#333333');
    root.style.setProperty('--theme-text-secondary', this.features.theme === 'dark' ? '#cccccc' : '#777777');
    root.style.setProperty('--theme-border', this.features.theme === 'dark' ? '#444444' : '#dddddd');
    root.style.setProperty('--theme-accent', '#d43f00');
    root.style.setProperty('--theme-shadow', '0 4px 8px rgba(0, 0, 0, 0.1)');
  }

  async fetchAndExtractComponents() {
    try {
      // Fetch the merged HTML file
      const response = await fetch(this.filePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch components: ${response.statusText}`);
      }

      // Get the HTML content
      const htmlContent = await response.text();

      // Create a template element to hold the fetched HTML
      this.templateHolder = document.createElement('template');
      this.templateHolder.innerHTML = htmlContent;

      console.log("template",htmlContent);

      // Validate that the template holder was created successfully
      if (!this.templateHolder.content) {
        throw new Error('Failed to create template holder for components.');
      }
    } catch (error) {
      console.error('Error fetching or extracting components:', error);
    }
  }

  async renderMainFrame() {
    const mainFrameTemplate = document.createElement('template');
    mainFrameTemplate.innerHTML = `
      <div class="cartique-container" id="cartique-container">
        <aside class="cartique-sidebar" id="cartique-sidebar"></aside>
        <main class="cartique-main-content" id="cartique-main-content">
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
          <footer class="cartique-product-footer" id="cartique-product-footer"></footer>
        </main>
      </div>

      <div id="cartique-hidden-blocks"> </div>

      <div class="cart-overlay" id="cart-slide-overlay"></div>

    `;

    // Clone the template content and append it to the container
    this.container.appendChild(mainFrameTemplate.content.cloneNode(true));

   // now we can get overlay by document id to attach event listener for closing cart slider

    const overlay = document.getElementById('cart-slide-overlay');
    if (overlay) overlay.addEventListener('click', this.closeCart.bind(this));


  }




  async renderSidebar() {
  const sidebarWrapper = this.templateHolder.content.getElementById('cartique-sidebar-component').cloneNode(true);
  
  // Extract the inner contents (excluding the wrapper div)
  const sidebarContents = Array.from(sidebarWrapper.childNodes); 
  
  // Append only the contents, not the wrapper itself
  const sidebarContainer = document.getElementById('cartique-sidebar');
  sidebarContents.forEach(child => sidebarContainer.appendChild(child));
}


  async renderControls() {
  const searchWrapper = this.templateHolder.content.getElementById('cartique-search-container-component').cloneNode(true);
  const searchContainer = document.getElementById('cartique-search-container');
  Array.from(searchWrapper.childNodes).forEach(child => searchContainer.appendChild(child));

  const sortWrapper = this.templateHolder.content.getElementById('cartique-sort-container-component').cloneNode(true);
  const sortContainer = document.getElementById('cartique-sort-container');
  Array.from(sortWrapper.childNodes).forEach(child => sortContainer.appendChild(child));

  const togglesWrapper = this.templateHolder.content.getElementById('cartique-view-toggles-container-component').cloneNode(true);
  const togglesContainer = document.getElementById('cartique-view-toggles-container');
  Array.from(togglesWrapper.childNodes).forEach(child => togglesContainer.appendChild(child));

  const cartIconWrapper = this.templateHolder.content.getElementById('shopping-cart-icon-container-component').cloneNode(true);
  const cartIconContainer = document.getElementById('shopping-cart-icon-container');
  Array.from(cartIconWrapper.childNodes).forEach(child => cartIconContainer.appendChild(child));

  //appended to document 
  const cartIconClickEvent = document.getElementById('shopping-cart-icon');
  if(cartIconClickEvent) cartIconClickEvent.addEventListener('click', this.showCart.bind(this)); 



}


  async renderProductDisplays() {
  const gridWrapper = this.templateHolder.content.getElementById('cartique-product-grid-component').cloneNode(true);
  const gridContainer = document.getElementById('cartique-product-grid');
  Array.from(gridWrapper.childNodes).forEach(child => gridContainer.appendChild(child));

  const listWrapper = this.templateHolder.content.getElementById('cartique-product-list-component').cloneNode(true);
  const listContainer = document.getElementById('cartique-product-list');
  Array.from(listWrapper.childNodes).forEach(child => listContainer.appendChild(child));

  // Render products in the default layout (grid)
  this.renderProducts('grid');
}


  async renderProducts(layout) {
  // Determine the container based on the layout
  const container = layout === 'grid'
    ? document.getElementById('cartique-product-grid')
    : document.getElementById('cartique-product-list');

  // Clear the container before rendering new products
  container.innerHTML = '';

  // Remove inline styles & control layout via CSS classes
  container.classList.toggle('grid-view', layout === 'grid');
  container.classList.toggle('list-view', layout !== 'grid');

  // Iterate over the products and create product cards
  const visibleProducts = this.features.pagination
    ? this.filteredProducts.slice(0, this.features.rows * this.features.columns)
    : this.filteredProducts;

  visibleProducts.forEach((product) => {
    const productCard = this.createProductCard(product);
    container.appendChild(productCard);
  });
}




  createProductCard(product) {
  // Clone the product card template (removing the outermost wrapper)
  const wrapper = this.templateHolder.content.getElementById('cartique-product-grid-component').cloneNode(true);
  
  // Extract the inner product card (first child of the wrapper)
  const productCardTemplate = wrapper.firstElementChild.cloneNode(true);

  // Iterate over the product object and update elements
  for (const [key, value] of Object.entries(product)) {
    const element = productCardTemplate.querySelector(`#${key}`);
    if (element) {
      if (element.tagName === 'IMG') {
        element.src = value; 
      } else if (element.tagName === 'A') {
        element.href = value;
      } else {
        element.textContent = value; 
      }
    }
  }

  // Handle sale price visibility
  const salePriceElement = productCardTemplate.querySelector('#sale_price');
  if (salePriceElement && !product.sale_price) {
    salePriceElement.style.display = 'none'; // Hide if no sale price
  } else {
    const priceElement = productCardTemplate.querySelector('#price');
    priceElement.style.textDecoration = "line-through";

    const salePriceCurrencyElement = productCardTemplate.querySelector('#sale_price_currency');
    salePriceCurrencyElement.textContent = product.currency;
  }

  return productCardTemplate;
}



createProductCard(product) {
  //console.log("Product",product);
  // Clone the product card template (removing the outermost wrapper)
  const wrapper = this.templateHolder.content.getElementById('cartique-product-grid-component').cloneNode(true);
  
  // Extract the inner product card (first child of the wrapper)
  const productCardTemplate = wrapper.firstElementChild.cloneNode(true);

  // Iterate over the product object and update elements
  for (const [key, value] of Object.entries(product)) {
    const element = productCardTemplate.querySelector(`#${key}`);
    if (element) {
      if (element.tagName === 'IMG') {
        element.src = value; 
      } else if (element.tagName === 'A') {
        element.href = value;
      } else {
        element.textContent = value; 
      }
    }
  }

  // Handle sale price visibility
  const salePriceElement = productCardTemplate.querySelector('#sale_price');
  if (salePriceElement && !product.sale_price) {
    salePriceElement.style.display = 'none'; // Hide if no sale price
  } else {
    const priceElement = productCardTemplate.querySelector('#price');
    priceElement.style.textDecoration = "line-through";

    const salePriceCurrencyElement = productCardTemplate.querySelector('#sale_price_currency');
    salePriceCurrencyElement.textContent = product.currency;
  }


  const addToCartElement = productCardTemplate.querySelector('.cartique_add_to_cart');
  if (addToCartElement) {
 //attach event listener
    addToCartElement.id = product.id;
    //addToCartElement.addEventListener('click', this.addToCart);
  addToCartElement.addEventListener('click', (event) => this.addToCart(event));


  }

  return productCardTemplate;
}



  setLayout(layout) {
    // Hide the inactive layout and show the active one
    if (layout === 'grid') {
      document.getElementById('cartique-product-grid').style.display = 'grid';
      document.getElementById('cartique-product-list').style.display = 'none';
    } else {
      document.getElementById('cartique-product-grid').style.display = 'none';
      document.getElementById('cartique-product-list').style.display = 'block';
    }

    // Re-render products in the selected layout
    this.renderProducts(layout);
  }

  async renderFooter() {
    const wrapper = this.templateHolder.content.getElementById('cartique-product-footer-component').cloneNode(true);
   // attach event listener to cart close icon
      const footer = wrapper.firstElementChild.cloneNode(true);
    document.getElementById('cartique-product-footer').appendChild(footer);
  }


  async renderCartSlider() {
    const wrapper = this.templateHolder.content.getElementById('cartique-cart-overlay-component').cloneNode(true);
   // attach event listener to cart close icon
   // if (wrapper) alert("Got it");

    const cardSlider = wrapper.firstElementChild.cloneNode(true);
    const cartCloseButton = cardSlider.querySelector('#cart-close-btn');

    cartCloseButton.addEventListener('click', this.closeCart);
    document.getElementById('cartique-hidden-blocks').appendChild(cardSlider);
  }



  async renderCartItemTemplate() {
    const wrapper = this.templateHolder.content.getElementById('cartique-cart-item-component').cloneNode(true);
   // attach event listener to cart close icon
   // if (wrapper) alert("Got it");

    const itemTemplate = wrapper.firstElementChild.cloneNode(true);
    //const cartCloseButton = cardSlider.querySelector('#cart-close-btn');
    //cartCloseButton.addEventListener('click', this.closeCart);
    document.getElementById('cartique-hidden-blocks').appendChild(itemTemplate);
  }






addToCart(event) {
  const productId = parseInt(event.target.id);
  const product = this.products.find((product) => product.id === productId);

  if (product) {
    console.log("Adding this product to cart:", product);

    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];

    // Check if the product already exists in the cart
    if (!cart.some((item) => item.id === product.id)) {
      cart.push(product); // Add product if not in cart
      localStorage.setItem('cartiqueCart', JSON.stringify(cart));
      console.log("Product added to cart.");
    } else {
      console.log("Product is already in the cart.");
    }

    this.showCart();
  } else {
    console.error("Product not found.");
    // Optionally show a message to the user about the error
  }
}


showCart() {
  /* ADD PRODUCT TO THE CART ITEMS CONTAINER */
  const cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];

  const displayEmptyCartMessage = () => {
    const emptyCartMessage = document.getElementById('shopping-cart-empty');
    emptyCartMessage.classList.add('show');
  };

  const hideEmptyCartMessage = () => {
    const emptyCartMessage = document.getElementById('shopping-cart-empty');
    emptyCartMessage.classList.remove('show');
  };

  // Display or hide the empty cart message
  if (cart.length === 0) {
    displayEmptyCartMessage();
  } else {
    hideEmptyCartMessage();
  }

  const cartContainer = document.getElementById('cart-items-container');
  cartContainer.innerHTML = ''; // Clear previous items

  const wrapper = this.templateHolder.content.getElementById('cartique-cart-item-component').cloneNode(true);
  const cartItemTemplate = wrapper.firstElementChild.cloneNode(true);

  if (!cartItemTemplate) {
    console.error("No template found.");
    return;
  }

  let subTotal = 0;
  let subTotalElement = document.getElementById('subtotal');
  subTotalElement.textContent = '0.00'; // Reset subtotal initially

  // Loop through each product in the cart
  cart.forEach((product) => {
    const cartItem = cartItemTemplate.cloneNode(true); // Clone template for each product

    const removeItemElement = cartItem.querySelector('#remove-item');
    if (removeItemElement) {
      removeItemElement.id = product.id;
      removeItemElement.addEventListener('click', (event) => this.removeCartItem(event));
    }


    /// handle decrease-qty and increase-qty listeners 

    const decreaseQtyElement = cartItem.querySelector('.decrease-qty');
    if (decreaseQtyElement) {
      decreaseQtyElement.id = `decrease_quantity_${product.id}`;
      decreaseQtyElement.addEventListener('click', (event) => this.decreaseQtyItem(event));
    }


    const increaseQtyElement = cartItem.querySelector('.increase-qty');
    if (increaseQtyElement) {
      increaseQtyElement.id = `increase_quantity_${product.id}`;
      increaseQtyElement.addEventListener('click', (event) => this.increaseQtyItem(event));
    }

    const quantityInputElement = cartItem.querySelector('.quantity');
    if (quantityInputElement) {
      quantityInputElement.id = `quantity_${product.id}`;
    }



    // Loop through product keys and update corresponding elements
    Object.keys(product).forEach((key) => {
      const targetElement = cartItem.querySelector(`#${key}`);
      if (targetElement) {
        if (key === "sale_price") {
          const priceElement = cartItem.querySelector('.cartique_cart_product_price');
          if (priceElement) {
            priceElement.style.textDecoration = "line-through"; // Strike-through if sale_price exists
          }
          targetElement.textContent = product[key]; // Set the sale price text
          subTotal += product[key]; // Add the sale price to subtotal
        } else if (key === "price" && !product.sale_price) {
  targetElement.textContent = product[key]; // Set the price text
  subTotal += parseFloat(product[key]); // Add the price to subtotal
}
else if (key === "image") {
          targetElement.src = product[key]; // Set image src
        } else if (key === "currency") {
          const currencyElement = cartItem.querySelector(`#${key}`);
          if (currencyElement) {
            currencyElement.textContent = product[key]; // Set text content for currency
          }
        } else {
          targetElement.textContent = product[key]; // Set text content for other keys
        }
      }
    });

    // Append the updated item to the cart container
    cartContainer.appendChild(cartItem);
  });

  // Update the subtotal display after the loop
  if (subTotalElement) {
    subTotalElement.textContent = subTotal.toFixed(2); // Format the subtotal with two decimals
  }

  // Update currency (as it is the same for all items in this cart)
  const currencyElement = document.getElementById('subtotal-currency');
  if (currencyElement && cart.length > 0) {
    currencyElement.textContent = cart[0].currency; // Set the currency from the first product
  }

  // Open the cart slider and show the overlay
  document.getElementById('cart-slide').classList.add('open');
  document.getElementById('cart-slide-overlay').style.display = 'block';
}







closeCart() {
  document.getElementById('cart-slide').classList.remove('open');
  document.getElementById('cart-slide-overlay').style.display = 'none';
}


removeCartItem(event) {
//alert("Remove");
const productId = parseInt(event.target.id); 
let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
cart = cart.filter(product => product.id !== productId);
localStorage.setItem('cartiqueCart', JSON.stringify(cart));
this.showCart(); 

}


removeCartItemBasedOnQty(productId) {
let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
cart = cart.filter(product => product.id !== productId);
localStorage.setItem('cartiqueCart', JSON.stringify(cart));
this.showCart(); 

}



decreaseQtyItem(event) {
  const decreaserId = event.target.id; // Example: "decrease_quantity_1"
  const quantityInputId = decreaserId.replace('decrease_', ''); // "quantity_1"
  const quantityInputElement = document.getElementById(quantityInputId);

  const subtotalElement = document.getElementById('subtotal');
  const productId = parseInt(decreaserId.replace('decrease_quantity_', ''));

  // Find product once instead of twice
  const product = this.products.find(product => product.id === productId);
  if (!product) {
    console.error(`Product with ID ${productId} not found`);
    return;
  }

  const productPrice = product.sale_price || product.price;
  let currentSubtotal = parseFloat(subtotalElement.textContent) || 0; // Ensure it's a number

  if (quantityInputElement) {
    let newQty = Math.max(parseInt(quantityInputElement.value) - 1, 0);
    quantityInputElement.value = newQty;

    if (newQty === 0) this.removeCartItemBasedOnQty(productId);

    // Update subtotal but ensure it doesn't go negative
    const newSubtotal = Math.max(currentSubtotal - productPrice, 0);
    subtotalElement.textContent = newSubtotal.toFixed(2); // Keep 2 decimal places
  } else {
    console.error(`Element with ID ${quantityInputId} not found`);
  }
}




increaseQtyItem(event) {
  const increaserId = event.target.id; // Example: "increase_quantity_1"
  const quantityInputId = increaserId.replace('increase_', ''); // "quantity_1"
  const quantityInputElement = document.getElementById(quantityInputId);

  const subtotalElement = document.getElementById('subtotal');
  const productId = parseInt(increaserId.replace('increase_quantity_', ''));

  // Find product once instead of twice
  const product = this.products.find(product => product.id === productId);
  if (!product) {
    console.error(`Product with ID ${productId} not found`);
    return;
  }

  const productPrice = product.sale_price || product.price;
  let currentSubtotal = parseFloat(subtotalElement.textContent) || 0; // Ensure it's a number

  if (quantityInputElement) {
    let newQty = parseInt(quantityInputElement.value) + 1;
    quantityInputElement.value = newQty;

    // Update subtotal
    const newSubtotal = currentSubtotal + productPrice;
    subtotalElement.textContent = newSubtotal.toFixed(2); // Keep 2 decimal places
  } else {
    console.error(`Element with ID ${quantityInputId} not found`);
  }
}





// Cartique class main wrapper
}