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
      checkoutUrl: '#',
      checkoutUrlMode: 'self', // options are self or blank default is self
      sidebar: true,
      sidebarDisplay: 'block',
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
    this.filePath = 'page.html';

    // Template holder for merged components
    this.templateHolder = null;

    this.init();

  this.debouncedSearch = this.debounce(this.handleSearch.bind(this), 300);

  this.completeInitialization();
  }


  // Debounce function
debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

  async init() {

    if (!this.features.sidebar) this.features.sidebarDisplay ='none';

    // Add critical CSS before anything else renders
  this.injectCriticalCSS();

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

    // Set default colors for light theme
    const lightThemeColors = {
        '--theme-primary': '#ffffff',  // White background
        '--theme-secondary': '#f8f8f8',  // Soft off-white for subtle contrast
        '--theme-text': '#222222',  // Darker text for readability
        '--theme-text-secondary': '#666666',  // Softer secondary text color
        '--theme-border': '#e0e0e0',  // Light border
        '--theme-accent': '#2a2a2a',  // Subtle accent color
        '--theme-shadow': '0 6px 12px rgba(0, 0, 0, 0.08)'  // Soft shadow
    };

    // Set colors for dark theme
    const darkThemeColors = {
        '--theme-primary': '#1a1a1a',  // Deep modern black
        '--theme-secondary': '#252525',  // Soft dark gray
        '--theme-text': '#ffffff',  // Clean white text
        '--theme-text-secondary': '#bbbbbb',  // Softer secondary text
        '--theme-border': '#444444',  // Dark border
        '--theme-shadow': '0 6px 12px rgba(0, 0, 0, 0.3)'  // Deeper shadow
    };

    // Choose the appropriate theme based on the current theme
    const themeColors = this.features.theme === 'dark' ? darkThemeColors : lightThemeColors;

    // Apply the theme colors
    Object.keys(themeColors).forEach(key => {
        root.style.setProperty(key, themeColors[key]);
    });

    // Override the accent color which is fixed in your logic
root.style.setProperty('--theme-accent', '#333333');  // Set to a deep charcoal gray for a sleek modern feel

}


injectCriticalCSS() {
  const criticalCSS = `
    #${this.features.containerId} {
      visibility: hidden;
      opacity: 0;
    }
    .cartique-container {
      position: relative;
      min-height: 100vh;
    }
    /* Add other critical styles here */
  `;

  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
}


// Then after everything is loaded
completeInitialization() {
  document.getElementById(this.features.containerId).style.visibility = 'visible';
  document.getElementById(this.features.containerId).style.opacity = '1';
}

  async fetchAndExtractComponents() {
  try {
    // Find the div with id "cartique-components"
    const cartiqueComponents = document.getElementById('cartique-components');

    if (!cartiqueComponents) {
      throw new Error('Could not find #cartique-components in the DOM.');
    }

    // Extract the inner HTML of the div
    const innerHTML = cartiqueComponents.innerHTML;

    // Create a template element to hold the extracted HTML
    this.templateHolder = document.createElement('template');
    this.templateHolder.innerHTML = innerHTML;
    
    //alert('Template extracted HEre');
    console.log("Template extracted:", innerHTML);

    // Validate that the template holder was created successfully
    if (!this.templateHolder.content) {
      throw new Error('Failed to create template holder for components.');
    }
  } catch (error) {
    console.error('Error extracting components:', error);
  }
}




  async renderMainFrame() {
        //alert('Rendering MainFrame');

    const mainFrameTemplate = document.createElement('template');
    mainFrameTemplate.innerHTML = `
      <div class="cartique-container" id="cartique-container">
        <aside class="cartique-sidebar" id="cartique-sidebar" style="display: ${this.features.sidebarDisplay}"></aside>
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

      <div id="cartique-hidden-blocks" style="display:none;"> </div>

      <div class="cart-overlay" id="cart-slide-overlay"></div>

  <div id="toast-container">
  <div class="toast">
    <div class="toast-content">
      <span class="svg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <g data-name="60-Check">
            <path d="M16 0a16 16 0 1 0 16 16A16 16 0 0 0 16 0zm0 30a14 14 0 1 1 14-14 14 14 0 0 1-14 14z"/>
            <path d="m13 20.59-4.29-4.3-1.42 1.42 5 5a1 1 0 0 0 1.41 0l11-11-1.41-1.41z"/>
          </g>
        </svg>
      </span>
      <div class="message">
        <span class="text text-1">Success</span>
        <span class="text text-2">
         You will now be redirected to the login page to login and complete your checkout. 
        </span>
      </div>
    </div>
    <i class="fa-solid fa-xmark close"></i>
    <div class="progress active"></div>
  </div>
</div>



    `;

    // Clone the template content and append it to the container
    this.container.appendChild(mainFrameTemplate.content.cloneNode(true));

   // now we can get overlay by document id to attach event listener for closing cart slider

    const overlay = document.getElementById('cart-slide-overlay');
    if (overlay) overlay.addEventListener('click', this.closeCart.bind(this));


  }




  async renderSidebar() {
  const sidebarWrapper = this.templateHolder.content.getElementById('cartique-sidebar-component').cloneNode(true);
  //if (sidebarWrapper)         alert('Rendering Sidebar');

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

  // Attach debounced event listener to the search input
  const searchInput = searchContainer.querySelector('.cartique-search');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => this.debouncedSearch(event));
  }

  const sortWrapper = this.templateHolder.content.getElementById('cartique-sort-container-component').cloneNode(true);
  const sortContainer = document.getElementById('cartique-sort-container');
  Array.from(sortWrapper.childNodes).forEach(child => sortContainer.appendChild(child));

  // Attach event listener to the sort dropdown
  const sortDropdown = sortContainer.querySelector('.cartique-sort');
  if (sortDropdown) {
    sortDropdown.addEventListener('change', (event) => this.handleSort(event));
  }

  const togglesWrapper = this.templateHolder.content.getElementById('cartique-view-toggles-container-component').cloneNode(true);
  const togglesContainer = document.getElementById('cartique-view-toggles-container');
  Array.from(togglesWrapper.childNodes).forEach(child => togglesContainer.appendChild(child));



  // Add event listeners for layout toggles
  const gridButton = document.querySelector('.cartique-grid-view');
  if (gridButton) {
    gridButton.addEventListener('click', () => this.setLayout('grid'));
  }
  const listButton = document.querySelector('.cartique-list-view');
  if (listButton) {
    listButton.addEventListener('click', () => this.setLayout('list'));
  }




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
  const container = layout === 'grid'
    ? document.getElementById('cartique-product-grid')
    : document.getElementById('cartique-product-list');

  // Clear the container before rendering new products
  container.innerHTML = '';

  // Set the layout classes
  container.classList.toggle('grid-view', layout === 'grid');
  container.classList.toggle('list-view', layout !== 'grid');

  // Render the filtered products
  const visibleProducts = this.features.pagination
    ? this.filteredProducts.slice(0, this.features.rows * this.features.columns)
    : this.filteredProducts;

  visibleProducts.forEach((product) => {
    const productElement = layout === 'grid'
      ? this.createProductCard(product) // Use Grid layout
      : this.createProductListing(product); // Use List layout
    container.appendChild(productElement);
  });
}


/*

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

*/


createProductCard(product) {
  //console.log("Product",product.id);
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


  // Add product ID to image container
  const imgContainer = productCardTemplate.querySelector('.cartique_product_image_container');
  imgContainer.dataset.productId = product.id;
  imgContainer.addEventListener('click', (e) => {
    e.preventDefault();
    this.showSingleProductView(product.id);
  });
  

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



createProductListing(product) {
  // Clone the product list template (removing the outermost wrapper)
  const wrapper = this.templateHolder.content.getElementById('cartique-product-list-component').cloneNode(true);

  // Extract the inner product listing (first child of the wrapper)
  const productListingTemplate = wrapper.firstElementChild.cloneNode(true);

  // Add a class to differentiate list layout
  productListingTemplate.classList.add('cartique-product-listing');

  // Iterate over the product object and update elements
  for (const [key, value] of Object.entries(product)) {
    const element = productListingTemplate.querySelector(`#${key}`);
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
  const salePriceElement = productListingTemplate.querySelector('#sale_price');
  if (salePriceElement && !product.sale_price) {
    salePriceElement.style.display = 'none'; // Hide if no sale price
  } else {
    const priceElement = productListingTemplate.querySelector('#price');
    priceElement.style.textDecoration = 'line-through';

    const salePriceCurrencyElement = productListingTemplate.querySelector('#sale_price_currency');
    salePriceCurrencyElement.textContent = product.currency;
  }

  // Attach event listener to the "Add to Cart" button
  const addToCartElement = productListingTemplate.querySelector('.cartique_add_to_cart');
  if (addToCartElement) {
    addToCartElement.id = product.id;
    addToCartElement.addEventListener('click', (event) => this.addToCart(event));
  }

  return productListingTemplate;
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



/* START SEARCH SORT LAYOUT FUNCTION BLOCKS */

handleSearch(event) {
  const searchQuery = event.target.value.trim().toLowerCase(); // Get the search query

  // Update the current search query
  this.currentSearchQuery = searchQuery;

  // Filter the products
  this.filteredProducts = this.products.filter(product => {
    // Check if the product title or description matches the search query
    return (
      product.title.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery)
    );
  });

  // Re-render the products in the current layout
  const currentLayout = document.getElementById('cartique-product-grid').style.display === 'grid' ? 'grid' : 'list';
  this.renderProducts(currentLayout);
}





handleSort(event) {
  const sortType = event.target.value; // Get the selected sort option

  // Update the current sort type
  this.currentSortType = sortType;

  // Sort the products based on the selected option
  switch (sortType) {
    case 'price-asc':
      this.filteredProducts.sort((a, b) => a.price - b.price); // Price: Low to High
      break;
    case 'price-desc':
      this.filteredProducts.sort((a, b) => b.price - a.price); // Price: High to Low
      break;
    case 'title-asc':
      this.filteredProducts.sort((a, b) => a.title.localeCompare(b.title)); // Title: A to Z
      break;
    case 'title-desc':
      this.filteredProducts.sort((a, b) => b.title.localeCompare(a.title)); // Title: Z to A
      break;
    default:
      // No sorting (default order)
      this.filteredProducts = [...this.products];
      break;
  }

  // Re-render the products in the current layout
  const currentLayout = document.getElementById('cartique-product-grid').style.display === 'grid' ? 'grid' : 'list';
  this.renderProducts(currentLayout);
}



  /* END SORT LAYOUT FUNCTION BLOCKS */







  async renderCartSlider() {
    const wrapper = this.templateHolder.content.getElementById('cartique-cart-slider-component').cloneNode(true);
   // attach event listener to cart close icon
   // if (wrapper) alert("Got it");

    const cardSlider = wrapper.firstElementChild.cloneNode(true);
    const cartCloseButton = cardSlider.querySelector('#cart-close-btn');


    ///<a herf="#" id="checkout-url">

    //const htmlExtract = wrapper.firstElementChild.cloneNode(true);
   


    cartCloseButton.addEventListener('click', this.closeCart);
    document.getElementById('cartique-hidden-blocks').style.display = 'block';
    document.getElementById('cartique-hidden-blocks').appendChild(cardSlider);
    document.getElementById('cartique-hidden-blocks').style.display = 'none';

 const checkoutUrl = document.getElementById('checkout-url');
if (checkoutUrl) {
    // Set the checkout URL

// attach an event 
  checkoutUrl.addEventListener('click', this.checkout.bind(this));

  /*
    checkoutUrl.href = this.features.checkoutUrl;

    // Ensure the correct format for checkoutUrlMode (with an underscore)
    let checkoutUrlMode = this.features.checkoutUrlMode;

    if (checkoutUrlMode) {
        // Prepend '_' if not already present
        if (!checkoutUrlMode.startsWith('_')) {
            checkoutUrlMode = `_${checkoutUrlMode}`;
        }

        // Set the target with the properly formatted mode
        checkoutUrl.target = checkoutUrlMode;
    }
*/

}





  }



  async renderCartItemTemplate() {
    const wrapper = this.templateHolder.content.getElementById('cartique-cart-item-component').cloneNode(true);
   // attach event listener to cart close icon
   // if (wrapper) alert("Got it");

    const itemTemplate = wrapper.firstElementChild.cloneNode(true);
    //const cartCloseButton = cardSlider.querySelector('#cart-close-btn');
    //cartCloseButton.addEventListener('click', this.closeCart);
    document.getElementById('cartique-hidden-blocks').style.display = 'block';
    document.getElementById('cartique-hidden-blocks').appendChild(itemTemplate);
    document.getElementById('cartique-hidden-blocks').style.display = 'none';

  }






addToCart(event) {
  const productId = parseInt(event.target.id);
  const product = this.products.find((product) => product.id === productId);

  if (product) {
    console.log("Adding this product to cart:", product);

    let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];

    // Check if the product already exists in the cart
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    
    if (existingProductIndex === -1) {
      // Add product with cart_quantity set to 1 if not in cart
      const productWithQuantity = {
        ...product,
        cart_quantity: 1
      };
      cart.push(productWithQuantity);
      localStorage.setItem('cartiqueCart', JSON.stringify(cart));
      console.log("Product added to cart.");
    } else {
      // If product exists, you could increment quantity here if you want
      // cart[existingProductIndex].cart_quantity += 1;
      // localStorage.setItem('cartiqueCart', JSON.stringify(cart));
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

  console.log("Cart with cart_quantity", cart);

document.getElementById('cartique-hidden-blocks').style.display = 'block';

  const displayEmptyCartMessage = () => {
    const emptyCartMessage = document.getElementById('shopping-cart-empty');
    emptyCartMessage.classList.add('show');

    // hide view cart and checkout buttons if hidden

    document.getElementById("view-cart-btn").style.display = "none";
    document.getElementById("checkout-btn").style.display = "none";
  };

  const hideEmptyCartMessage = () => {
    const emptyCartMessage = document.getElementById('shopping-cart-empty');
    emptyCartMessage.classList.remove('show');

        // show view cart and checkout buttons if hidden
    document.getElementById("view-cart-btn").style.display = "block";
    document.getElementById("checkout-btn").style.display = "block";
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
        } else if (key === "currency" && typeof product.sale_price === 'number' && product.sale_price > 0) {

    const currencyElements = cartItem.querySelectorAll(`#${key}`);  
      // Select all elements with the matching id or class
      currencyElements.forEach(currencyElement => {
        currencyElement.textContent = product[key];  
      });


        } else if (key === "currency") {

    const currencyElement = cartItem.querySelector(`#${key}`);  
      // Select all elements with the matching id or class
      
        currencyElement.textContent = product[key];  
      


        } 



        else {
          targetElement.textContent = product[key]; // Set text content for other keys
        }
      }

/// now update quantity with quanity from product object 
if (key === 'cart_quantity') {
const productQuantityElement = cartItem.querySelector(`#quantity_${product.id}`); 
productQuantityElement.value = product.cart_quantity;

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


  //document.getElementById('cartique-hidden-blocks').style.display = 'none';
}







closeCart() {
  document.getElementById('cart-slide').classList.remove('open');
  document.getElementById('cart-slide-overlay').style.display = 'none';

  document.getElementById('cartique-hidden-blocks').style.display = 'none';

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

  // Get current cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
  
  // Find product in products list and in cart
  const product = this.products.find(product => product.id === productId);
  const cartItemIndex = cart.findIndex(item => item.id === productId);

  if (!product || cartItemIndex === -1) {
    console.error(`Product with ID ${productId} not found in products or cart`);
    return;
  }

  const productPrice = product.sale_price || product.price;
  let currentSubtotal = parseFloat(subtotalElement.textContent) || 0;

  if (quantityInputElement) {
    let newQty = Math.max(parseInt(quantityInputElement.value) - 1, 0);
    quantityInputElement.value = newQty;

    // Update cart quantity in localStorage
    if (newQty === 0) {
      this.removeCartItemBasedOnQty(productId);
    } else {
      // Update the quantity in the cart
      cart[cartItemIndex].cart_quantity = newQty;
      localStorage.setItem('cartiqueCart', JSON.stringify(cart));
    }

    // Update subtotal but ensure it doesn't go negative
    const newSubtotal = Math.max(currentSubtotal - productPrice, 0);
    subtotalElement.textContent = newSubtotal.toFixed(2);
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

  // Get current cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
  
  // Find product in products list and in cart
  const product = this.products.find(product => product.id === productId);
  const cartItemIndex = cart.findIndex(item => item.id === productId);

  if (!product || cartItemIndex === -1) {
    console.error(`Product with ID ${productId} not found in products or cart`);
    return;
  }

  const productPrice = product.sale_price || product.price;
  let currentSubtotal = parseFloat(subtotalElement.textContent) || 0;

  if (quantityInputElement) {
    let newQty = parseInt(quantityInputElement.value) + 1;
    quantityInputElement.value = newQty;

    // Update cart quantity in localStorage
    cart[cartItemIndex].cart_quantity = newQty;
    localStorage.setItem('cartiqueCart', JSON.stringify(cart));

    // Update subtotal
    const newSubtotal = currentSubtotal + productPrice;
    subtotalElement.textContent = newSubtotal.toFixed(2);
  } else {
    console.error(`Element with ID ${quantityInputId} not found`);
  }
}



checkout() {
  /*
    const cart = JSON.parse(localStorage.getItem('cartiqueCart'));

    if (!cart) {
        console.error('Cart is empty or not found in localStorage.');
        return;
    }

    const checkoutUrl = this.features.checkoutUrl;

    if (!checkoutUrl) {
        console.error('Checkout URL is not defined.');
        return;
    }

    const requestData = {
        cart: cart,
    };

    fetch(checkoutUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Checkout successful:', data);
        this.showCheckoutAlert();
    })
    .catch(error => {
        console.error('Error during checkout:', error);
    });
*/

  this.closeCart();

  this.showCheckoutAlert();

}


showCheckoutAlert() {
  const toast = document.querySelector(".toast");
  const closeIcon = document.querySelector(".close");
  const progress = document.querySelector(".progress");

  // Clear any existing timeouts to prevent multiple toasts
  this.clearToastTimeouts();

  // Show the toast and progress animation
  toast.classList.add("active");
  progress.classList.add("active");

  // Set new timeouts
  this.toastTimer1 = setTimeout(() => {
    toast.classList.remove("active");
  }, 5000);

  this.toastTimer2 = setTimeout(() => {
    progress.classList.remove("active");
  }, 5300);

  // Close icon functionality
  closeIcon.onclick = () => {
    toast.classList.remove("active");
    progress.classList.remove("active");
    this.clearToastTimeouts();
  };

  // Redirect after the toast disappears (after 5 seconds)
  this.redirectTimer = setTimeout(() => {
    if (this.features.checkoutUrl && this.isValidUrl(this.features.checkoutUrl)) {
      let cart = JSON.parse(localStorage.getItem('cartiqueCart'));
      console.log("checkout Cart", JSON.stringify(cart, null, 2));
      window.location.href = this.features.checkoutUrl;
    } else {
      console.error("Invalid checkout URL");
    }
  }, 5000);
}

clearToastTimeouts() {
  if (this.toastTimer1) clearTimeout(this.toastTimer1);
  if (this.toastTimer2) clearTimeout(this.toastTimer2);
  if (this.redirectTimer) clearTimeout(this.redirectTimer);
}

isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}


// Cartique class main wrapper
}