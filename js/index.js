// ============================================
// Mobile menu toggle
// ============================================
const mobileToggle = document.getElementById('mobileMenuToggle');
const mobileOverlay = document.getElementById('mobileNavOverlay');
const mobileClose = document.getElementById('mobileNavClose');

function toggleMobileMenu() {
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
}
if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileMenu);
if (mobileClose) mobileClose.addEventListener('click', toggleMobileMenu);
// Close overlay when clicking a link
document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
});

// ============================================
// Cart counter with localStorage (persistence)
// ============================================
let cartCount = 0;
const cartBadge = document.getElementById('cartCount');
const buyBtns = document.querySelectorAll('.buy-btn');

// Load from localStorage
function loadCartCount() {
    const saved = localStorage.getItem('airforce_cart_count');
    if (saved !== null && !isNaN(parseInt(saved))) {
        cartCount = parseInt(saved);
    } else {
        cartCount = 0;
    }
    updateBadge();
}
function updateBadge() {
    if (cartBadge) cartBadge.textContent = cartCount;
    localStorage.setItem('airforce_cart_count', cartCount);
}
function addToCart() {
    cartCount++;
    updateBadge();
}

// Attach event listeners to all Buy buttons
buyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Get product info from card
        const card = btn.closest('.product-card');
        const img = card.querySelector('.product-img img');
        const imagePath = img ? img.getAttribute('src') : '';
        const productName = btn.getAttribute('data-product') || 'Product';
        const priceElem = card.querySelector('.price');
        const price = priceElem ? priceElem.innerText.replace('¥', '') : '0';
        
        if (window.addToCartGlobal) {
            window.addToCartGlobal(productName, price, null, '', imagePath);
        } else {
            // Fallback: only update counter
            cartCount++;
            updateBadge();
        }
        console.log(`Added ${productName} to cart. Total: ${cartCount}`);
    });
});

// Initialize on page load
loadCartCount();

// ============================================
// Hero play button (placeholder)
// ============================================
const playBtn = document.querySelector('.hero-play');
if (playBtn) {
    playBtn.addEventListener('click', () => {
        alert('Video promo would play here (integration placeholder).');
    });
}

// ============================================
// Explore more button (placeholder)
// ============================================
const exploreBtn = document.querySelector('.explore-btn');
if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
        window.location.href = 'collection.html'; // redirect to product page
    });
}
// ============================================
// Cart icon redirect to cart.html
// ============================================
const cartIcon = document.getElementById('cartBtn');
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
}

// ============================================
// Global Search (首页)
// ============================================
const searchOverlay = document.getElementById('searchOverlay');
const globalSearchInput = document.getElementById('globalSearchInput');
const globalSearchSubmit = document.getElementById('globalSearchSubmit');
const searchClose = document.getElementById('searchClose');
const searchIcon = document.querySelector('.search-btn');

// 打开搜索浮层
if (searchIcon && searchOverlay) {
    searchIcon.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        setTimeout(() => globalSearchInput?.focus(), 100);
    });
}
// 关闭浮层
if (searchClose) {
    searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });
}
// 点击遮罩关闭（点击背景关闭）
if (searchOverlay) {
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    });
}
// ESC 关闭
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay?.classList.contains('active')) {
        searchOverlay.classList.remove('active');
    }
});
// 执行搜索：跳转到 collection.html 带查询参数
function performGlobalSearch() {
    const query = globalSearchInput?.value.trim();
    if (query) {
        window.location.href = `collection.html?search=${encodeURIComponent(query)}`;
    } else {
        alert('Please enter a search term');
    }
}
if (globalSearchSubmit) {
    globalSearchSubmit.addEventListener('click', performGlobalSearch);
}
if (globalSearchInput) {
    globalSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performGlobalSearch();
    });
}
// ... 前面的代码保持不变 ...

// ============================================
// Product card click redirect to product.html
// ============================================
document.querySelectorAll('.featured-products .product-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // 如果点击的是 Buy 按钮，则不跳转（让 Buy 按钮自己的事件处理）
        if (e.target.classList.contains('buy-btn')) return;
        
        // 从卡片内的 h3 标签获取产品名称
        const h3 = card.querySelector('h3');
        if (h3) {
            const productName = h3.innerText.trim();
            window.location.href = `product.html?id=${encodeURIComponent(productName)}`;
        }
    });
});