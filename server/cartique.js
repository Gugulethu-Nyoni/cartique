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

    this.init();
  }

  init() {
  this.applyTheme();
  this.renderSidebar(); // Render sidebar first
  this.productDisplays = this.renderProductDisplays(); // Store the returned productDisplays element
  this.renderLayout(); 
}

  applyTheme() {
    const containerElement = document.getElementById(this.features.containerId);
    containerElement.classList.add(this.features.containerClass);

    const root = document.documentElement;
    root.style.setProperty('--theme-primary', this.features.theme === 'dark' ? '#1e1e1e' : '#ffffff');
    root.style.setProperty('--theme-secondary', this.features.theme === 'dark' ? '#2e2e2e' : '#f9f9f9');
    root.style.setProperty('--theme-text', this.features.theme === 'dark' ? '#ffffff' : '#333333');
    root.style.setProperty('--theme-text-secondary', this.features.theme === 'dark' ? '#cccccc' : '#777777');
    root.style.setProperty('--theme-border', this.features.theme === 'dark' ? '#444444' : '#dddddd');
    root.style.setProperty('--theme-accent', '#d43f00');
    root.style.setProperty('--theme-shadow', '0 4px 8px rgba(0, 0, 0, 0.1)');
  }

  renderSidebar() {
    console.log('inside renderSidebar function');

    const sidebarHTML = `
      <aside class="sidebar">
        <h2>Filters</h2>
        <div class="filter-section">
          <h4>Price Range</h4>
          <input type="range" min="0" max="100" value="50" class="price-range">
          <div class="price-range-labels">
            <span>Low</span><span class="price-range-value">50</span><span>High</span>
          </div>
        </div>
        <div class="checkbox-filters">
          ${Object.keys(this.features.sidebarFeatures.filters)
            .map(
              (filterKey) => `
                <h4>${filterKey}</h4>
                <ul>
                  ${this.features.sidebarFeatures.filters[filterKey]
                    .map(
                      (filterValue) => `
                      <li>
                        <label>
                          <input type="checkbox">${filterValue}
                        </label>
                      </li>
                    `
                    )
                    .join('')}
                </ul>
              `
            )
            .join('')}
        </div>
      </aside>
    `;

    // Append the sidebar HTML to the main container
    this.container.insertAdjacentHTML('afterbegin', sidebarHTML);
  }

  renderProductDisplays() {
  // Create the product displays section
  const productDisplays = document.createElement('div');
  productDisplays.className = 'product-displays';

  // Render the top row (search, sorting, grid/list icons)
  const topRow = document.createElement('div');
  topRow.className = 'top-row';

  // Search input
  if (this.features.search) {
    this.initSearch();
    topRow.appendChild(this.searchContainer);
  }

  // Sorting dropdown
  if (this.features.sorting) {
    this.initSorting();
    topRow.appendChild(this.sortContainer);
  }

  // Grid/List icons
  const layoutIcons = document.createElement('div');
  layoutIcons.className = 'layout-icons';
  layoutIcons.innerHTML = `
    <button class="grid-icon">Grid</button>
    <button class="list-icon">List</button>
  `;
  layoutIcons.querySelector('.grid-icon').addEventListener('click', () => this.setLayout('grid'));
  layoutIcons.querySelector('.list-icon').addEventListener('click', () => this.setLayout('list'));
  topRow.appendChild(layoutIcons);

  // Append top row to product displays section
  productDisplays.appendChild(topRow);

  // Append product displays section to the main container
  this.container.appendChild(productDisplays);

  return productDisplays; // Return the productDisplays element
}


  setLayout(layout) {
    this.features.grid = layout === 'grid';
    this.renderLayout();
  }

  renderLayout() {
  // Clear only the product grid area
  const productGrid = this.container.querySelector('.product-grid');
  if (productGrid) {
    productGrid.innerHTML = '';
  } else {
    const productGrid = document.createElement('div');
    productGrid.className = 'product-grid';
    this.container.appendChild(productGrid);
  }

  // Render the product grid or list
  if (this.features.grid) {
    this.renderGrid();
  } else {
    this.renderList();
  }

  // Initial render
  if (!this.filteredProductsRendered) {
    this.filteredProductsRendered = true;
    if (this.features.grid) {
      this.renderGrid();
    } else {
      this.renderList();
    }
  }
}

  renderGrid() {
  const grid = document.createElement('div');
  grid.className = 'product-grid';
  grid.style.gridTemplateColumns = `repeat(${this.features.columns}, 1fr)`; // Update grid columns

  // Use filtered products for display
  const visibleProducts = this.features.pagination
    ? this.filteredProducts.slice(0, this.features.rows)
    : this.filteredProducts;

  visibleProducts.forEach((product) => {
    grid.appendChild(this.createProductCard(product));
  });

  // Append the grid to the product displays section
  const existingGrid = this.productDisplays.querySelector('.product-grid');
  if (existingGrid) {
    existingGrid.replaceWith(grid); // Replace existing grid
  } else {
    this.productDisplays.appendChild(grid); // Append new grid
  }

  // Render pagination if enabled
  if (this.features.pagination) {
    this.renderPagination();
  }
}
  renderList() {
    const list = document.createElement('div');
    list.className = 'product-list';

    // Use filtered products for display
    const visibleProducts = this.features.pagination
      ? this.filteredProducts.slice(0, this.features.rows)
      : this.filteredProducts;

    visibleProducts.forEach((product) => {
      list.appendChild(this.createProductCard(product));
    });

    this.container.querySelector('.product-grid').appendChild(list);

    // Render pagination if enabled
    if (this.features.pagination) {
      this.renderPagination();
    }
  }

  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Product Image
    const image = document.createElement('img');
    image.src = product.image || 'placeholder.jpg';
    image.alt = product.title;

    // Product Title
    const title = document.createElement('h3');
    title.textContent = product.title;

    // Product Description
    const description = document.createElement('p');
    description.textContent = product.description;

    // Product Price
    const price = document.createElement('div');
    if (this.features.sale && product.sale_price) {
      price.innerHTML = `
        <span class="original-price">${product.currency} ${product.normal_price}</span>
        <span class="sale-price">${product.currency} ${product.sale_price}</span>
      `;
    } else {
      price.textContent = `${product.currency} ${product.price}`;
    }

    // Append elements to card
    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(price);

    return card;
  }

  renderPagination() {
    const totalPages = Math.ceil(this.filteredProducts.length / this.features.rows);
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.addEventListener('click', () => this.goToPage(i));
      paginationContainer.appendChild(button);
    }

    this.container.appendChild(paginationContainer);
  }

  goToPage(page) {
    const start = (page - 1) * this.features.rows;
    const end = start + this.features.rows;
    this.filteredProducts = this.filteredProducts.slice(start, end);
    this.renderLayout();
  }

  initSearch() {
    this.searchContainer = document.createElement('div');
    this.searchContainer.className = 'search-container';

    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.placeholder = 'Search products...';
    this.searchInput.value = this.currentSearchQuery;

    let searchTimeout = null;
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.handleSearch(e.target.value);
      }, 500);
    });

    this.searchContainer.appendChild(this.searchInput);
  }

  handleSearch(query) {
    query = query.trim();

    if (query === '') {
      this.filteredProducts = [...this.products]; // Display all products when search query is empty
    } else {
      this.currentSearchQuery = query;

      this.filteredProducts = this.products.filter(
        (product) =>
          product.title.toLowerCase().includes(this.currentSearchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(this.currentSearchQuery.toLowerCase())
      );
    }

    this.updateProductDisplay();
  }

  updateProductDisplay() {
    // Clear only the product container, not the search and sort components
    this.container.querySelectorAll('.product-grid, .product-list, .pagination').forEach((el) => el.remove());

    // Render products without affecting search input
    if (this.features.grid) {
      this.renderGrid();
    } else {
      this.renderList();
    }
  }

  initSorting() {
    this.sortContainer = document.createElement('div');
    this.sortContainer.className = 'sort-container';

    const sortSelect = document.createElement('select');
    sortSelect.innerHTML = `
      <option value=""> Sort Products </option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="title-asc">Title: A to Z</option>
      <option value="title-desc">Title: Z to A</option>
    `;
    sortSelect.value = this.currentSortType; // Preserve sorting state
    sortSelect.addEventListener('change', (e) => this.handleSort(e.target.value));

    this.sortContainer.appendChild(sortSelect);
  }

  handleSort(sortType) {
    this.currentSortType = sortType;
    const [field, order] = sortType.split('-');
    this.filteredProducts.sort((a, b) => {
      if (order === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    this.renderLayout();
  }
}