// ============================================
// Collection page: product data, pagination, rendering
// ============================================

// ---------- Product Data (8 main) ----------
const allProductsData = [
    { id: 1, name: "FISHING ROD RED", price: "20000.00RMB", img: "assets/images/prod1.png", alt: "Fishing rod red" },
    { id: 2, name: "FISHING ROD BULE", price: "20000.00RMB", img: "assets/images/prod2.png", alt: "Fishing rod blue" },
    { id: 3, name: "FISHING ROD GREEN", price: "20000.00RMB", img: "assets/images/prod3.png", alt: "Fishing rod green" },
    { id: 4, name: "SALTIGA BULE", price: "899.00RMB", img: "assets/images/prod4.png", alt: "Saltiga blue reel" },
    { id: 5, name: "SALTIGA GREY", price: "899.00RMB", img: "assets/images/prod5.png", alt: "Saltiga grey reel" },
    { id: 6, name: "SALTIGA WHITE", price: "899.00RMB", img: "assets/images/prod6.png", alt: "Saltiga white reel" },
    { id: 7, name: "BRAIDED LINE", price: "200.00RMB/M", img: "assets/images/prod7.png", alt: "Braided fishing line" },
    { id: 8, name: "MONOFILAMENT LINE", price: "400.00RMB/M", img: "assets/images/prod8.png", alt: "Monofilament line" }
];

// ---------- Search State ----------
let currentSearchQuery = '';

// Get filtered products based on current search query
function getFilteredProducts() {
    if (!currentSearchQuery) return allProductsData;
    const lowerQuery = currentSearchQuery.toLowerCase();
    return allProductsData.filter(product => 
        product.name.toLowerCase().includes(lowerQuery)
    );
}

// ---------- Pagination Data ----------
let extendedProducts = [];
const productsPerPage = 8;
let currentPage = 1;
let productsGrid = document.getElementById('products-grid');
let paginationContainer = document.getElementById('pagination');

// Rebuild extended product list (24 items) from given base products
function rebuildExtendedProducts(baseProducts) {
    const newExtended = [];
    for (let i = 0; i < 24; i++) {
        const original = baseProducts[i % baseProducts.length];
        newExtended.push({
            ...original,
            id: i + 1,
            name: original.name + (Math.floor(i / baseProducts.length) > 0 ? ` ${Math.floor(i / baseProducts.length)}` : "")
        });
    }
    extendedProducts = newExtended;
}

// ---------- Render main products ----------
function renderProducts(page) {
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const pageProducts = extendedProducts.slice(start, end);
    
    productsGrid.classList.add('fade-out');
    setTimeout(() => {
        if (pageProducts.length === 0) {
            productsGrid.innerHTML = `<div style="text-align:center; padding: 60px; grid-column: 1/-1;">No products found for "${currentSearchQuery}"</div>`;
            productsGrid.classList.remove('fade-out');
            return;
        }
        productsGrid.innerHTML = pageProducts.map(product => `
            <article class="product-card" data-product-id="${product.id}" data-product-name="${product.name}">
                <div class="product-img">
                    <img src="${product.img}" alt="${product.alt}" onerror="this.src='assets/images/logo.png'">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price-row">
                        <span class="product-price">${product.price}</span>
                        <button class="buy-btn" data-name="${product.name}" data-price="${product.price}">Buy</button>
                    </div>
                </div>
            </article>
        `).join('');
        productsGrid.classList.remove('fade-out');
        
        attachBuyEvents();
        attachCardClickEvents();
    }, 200);
}

// ---------- Attach event handlers ----------
function attachBuyEvents() {
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.removeEventListener('click', buyHandler);
        btn.addEventListener('click', buyHandler);
    });
}
function buyHandler(e) {
    e.stopPropagation();
    const name = this.getAttribute('data-name');
    const price = this.getAttribute('data-price');
    const card = this.closest('.product-card');
    const img = card.querySelector('.product-img img');
    const imagePath = img ? img.getAttribute('src') : '';
    if (window.addToCartGlobal) {
        window.addToCartGlobal(name, price, null, '', imagePath);
    } else {
        console.warn('cart.js not loaded');
    }
}
function attachCardClickEvents() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.removeEventListener('click', cardClickHandler);
        card.addEventListener('click', cardClickHandler);
    });
}
function cardClickHandler(e) {
    if (e.target.classList.contains('buy-btn')) return;
    const productName = this.getAttribute('data-product-name') || this.querySelector('h3')?.innerText;
    if (productName) {
        window.location.href = `product.html?id=${encodeURIComponent(productName)}`;
    }
}

// ---------- Pagination UI ----------
function renderPagination() {
    const totalPages = Math.ceil(extendedProducts.length / productsPerPage);
    let buttonsHtml = '';
    for (let i = 1; i <= totalPages; i++) {
        buttonsHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    buttonsHtml += `<button class="arrow next-page" ${currentPage === totalPages ? 'disabled' : ''}>&gt;</button>`;
    paginationContainer.innerHTML = buttonsHtml;
    
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newPage = parseInt(btn.getAttribute('data-page'));
            if (!isNaN(newPage) && newPage !== currentPage) {
                currentPage = newPage;
                renderProducts(currentPage);
                renderPagination();
            }
        });
    });
    const nextBtn = document.querySelector('.next-page');
    if (nextBtn && !nextBtn.hasAttribute('disabled')) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts(currentPage);
                renderPagination();
            }
        });
    }
}

// ---------- Render recommended products (static) ----------
const recommendedData = [
    { id: 101, name: "SALTIGA BULE", price: "899.00RMB", img: "assets/images/rec1.png", alt: "Saltiga blue reel" },
    { id: 102, name: "SPRC Premium Rod Bag", price: "2000.00RMB", img: "assets/images/rec2.png", alt: "Rod bag" },
    { id: 103, name: "FISHING ROD", price: "8999.00RMB", img: "assets/images/rec3.png", alt: "Premium fishing rod" },
    { id: 104, name: "FISHING ROD", price: "8999.00RMB", img: "assets/images/rec4.png", alt: "Another fishing rod" }
];

function renderRecommended() {
    const recGrid = document.getElementById('rec-grid');
    recGrid.innerHTML = recommendedData.map(product => `
        <article class="product-card" data-product-name="${product.name}">
            <div class="product-img">
                <img src="${product.img}" alt="${product.alt}" onerror="this.src='assets/images/logo.png'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price-row">
                    <span class="product-price">${product.price}</span>
                    <button class="buy-btn" data-name="${product.name}" data-price="${product.price}">Buy</button>
                </div>
            </div>
        </article>
    `).join('');
    document.querySelectorAll('#rec-grid .buy-btn').forEach(btn => {
        btn.removeEventListener('click', buyHandler);
        btn.addEventListener('click', buyHandler);
    });
    document.querySelectorAll('#rec-grid .product-card').forEach(card => {
        card.removeEventListener('click', cardClickHandler);
        card.addEventListener('click', cardClickHandler);
    });
}

// ---------- Initialization (search + render) ----------
function initCollection() {
    // 读取 URL 参数 search
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    if (search) {
        currentSearchQuery = search;
        console.log(`Searching for: ${currentSearchQuery}`);
    }
    // 根据搜索词过滤产品数据
    const filtered = getFilteredProducts();
    rebuildExtendedProducts(filtered);
    currentPage = 1;
    renderProducts(1);
    renderPagination();
    renderRecommended();
}

initCollection();

// ============================================
// Cart icon redirect
// ============================================
const cartIcon = document.getElementById('cartBtn');
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
}