export default class Cartique {
  constructor(products, features = {}) {
    // Default features
    this.defaultFeatures = {
      grid: true, // Default layout
      pagination: true, // Enable pagination
      columns: 4, // Number of columns in grid layout
      rows: 10, // Number of rows per page
      theme: 'dark', // Default theme
      search: true, // Enable search
      sorting: true, // Enable sorting
      containerId: 'cartique', // Default container ID
      sale: false, // Enable sale badges and strike-through pricing
    };

    // Merge user-provided features with defaults
    this.features = { ...this.defaultFeatures, ...features };

    // Initialize
    this.products = products;
    this.container = document.querySelector(`#${this.features.containerId}`);
    if (!this.container) {
      console.error(`Container with ID "${this.features.containerId}" not found.`);
      return;
    }

    this.init();
  }

  init() {
    this.applyTheme();
    this.renderLayout();
    this.initFeatures();
  }

  applyTheme() {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', this.features.theme);
  }

  renderLayout() {
    this.container.innerHTML = '';
    if (this.features.grid) {
      this.renderGrid();
    } else {
      this.renderList();
    }
  }

  renderGrid() {
    const grid = document.createElement('div');
    grid.className = 'product-grid';
    grid.style.gridTemplateColumns = `repeat(${this.features.columns}, 1fr)`;

    // Slice products based on rows per page
    const visibleProducts = this.features.pagination
      ? this.products.slice(0, this.features.rows)
      : this.products;

    visibleProducts.forEach(product => {
      grid.appendChild(this.createProductCard(product));
    });

    this.container.appendChild(grid);

    // Render pagination if enabled
    if (this.features.pagination) {
      this.renderPagination();
    }
  }

  renderList() {
    const list = document.createElement('div');
    list.className = 'product-list';

    // Slice products based on rows per page
    const visibleProducts = this.features.pagination
      ? this.products.slice(0, this.features.rows)
      : this.products;

    visibleProducts.forEach(product => {
      list.appendChild(this.createProductCard(product));
    });

    this.container.appendChild(list);

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
    const totalPages = Math.ceil(this.products.length / this.features.rows);
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
    this.products = this.products.slice(start, end);
    this.renderLayout();
  }

  initFeatures() {
    if (this.features.search) {
      this.initSearch();
    }
    if (this.features.sorting) {
      this.initSorting();
    }
  }

  initSearch() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search products...';
    searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

    searchContainer.appendChild(searchInput);
    this.container.prepend(searchContainer);
  }

  handleSearch(query) {
    const filteredProducts = this.products.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    this.products = filteredProducts;
    this.renderLayout();
  }

  initSorting() {
    const sortContainer = document.createElement('div');
    sortContainer.className = 'sort-container';

    const sortSelect = document.createElement('select');
    sortSelect.innerHTML = `
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="title-asc">Title: A to Z</option>
      <option value="title-desc">Title: Z to A</option>
    `;
    sortSelect.addEventListener('change', (e) => this.handleSort(e.target.value));

    sortContainer.appendChild(sortSelect);
    this.container.prepend(sortContainer);
  }

  handleSort(sortType) {
    const [field, order] = sortType.split('-');
    this.products.sort((a, b) => {
      if (order === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    this.renderLayout();
  }
}