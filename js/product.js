// ============================================
// Product page: data, gallery, variants, add to cart
// ============================================

// ---------- Product Data (8 products, matching collection.js) ----------
const productsData = [
    { id: 1, name: "FISHING ROD RED", shortName: "FISHING ROD", price: 20000.00, originalPrice: 25000.00, model: "AF-RED-2026", brand: "DAIWA SALTIGA", rating: 4.8, reviews: 128, description: "Professional-grade carbon fiber fishing rod in striking red finish. Engineered for sensitivity, distance, and absolute control. Aerospace-grade prepreg carbon construction with heat-press cured blank for zero voids. Faster tip recovery with unmatched backbone strength.", image: "assets/images/prod1.png", gallery: ["assets/images/prod1.png", "assets/images/rec1.png", "assets/images/rec3.png"], colors: [{ name: "Red", hex: "#C0392B", img: "assets/images/prod1.png" }, { name: "Black", hex: "#2C3E50", img: "assets/images/prod2.png" }], sizes: ["1.8M", "2.1M", "2.4M", "2.7M"] },
    { id: 2, name: "FISHING ROD BULE", shortName: "FISHING ROD", price: 20000.00, originalPrice: 25000.00, model: "AF-BLU-2026", brand: "DAIWA SALTIGA", rating: 4.7, reviews: 95, description: "Smooth blue carbon fiber rod for superior casting. Lightweight and durable.", image: "assets/images/prod2.png", gallery: ["assets/images/prod2.png", "assets/images/rec2.png", "assets/images/rec4.png"], colors: [{ name: "Blue", hex: "#2980B9", img: "assets/images/prod2.png" }, { name: "Black", hex: "#2C3E50", img: "assets/images/prod1.png" }], sizes: ["1.8M", "2.1M", "2.4M", "2.7M"] },
    { id: 3, name: "FISHING ROD GREEN", shortName: "FISHING ROD", price: 20000.00, originalPrice: 25000.00, model: "AF-GRN-2026", brand: "DAIWA SALTIGA", rating: 4.9, reviews: 203, description: "Forest green finish with enhanced sensitivity. Ideal for freshwater fishing.", image: "assets/images/prod3.png", gallery: ["assets/images/prod3.png", "assets/images/rec1.png", "assets/images/rec2.png"], colors: [{ name: "Green", hex: "#27AE60", img: "assets/images/prod3.png" }], sizes: ["1.8M", "2.1M", "2.4M", "2.7M"] },
    { id: 4, name: "SALTIGA BULE", shortName: "SALTIGA", price: 899.00, originalPrice: 1099.00, model: "SALTIGA-10/15/350/15/35", brand: "DAIWA SALTIGA", rating: 4.9, reviews: 312, description: "High-performance saltwater spinning reel. 10+1 ball bearings, carbon drag, waterproof seal.", image: "assets/images/prod4.png", gallery: ["assets/images/prod4.png", "assets/images/rec1.png", "assets/images/rec3.png"], colors: [{ name: "Blue", hex: "#3498DB", img: "assets/images/prod4.png" }, { name: "Black", hex: "#2C3E50", img: "assets/images/prod5.png" }], sizes: ["3000", "4000", "5000"] },
    { id: 5, name: "SALTIGA GREY", shortName: "SALTIGA", price: 899.00, originalPrice: 1099.00, model: "SALTIGA-10/15/350/15/35", brand: "DAIWA SALTIGA", rating: 4.8, reviews: 278, description: "Sleek grey finish, same rugged performance. Corrosion resistant.", image: "assets/images/prod5.png", gallery: ["assets/images/prod5.png", "assets/images/rec2.png", "assets/images/rec4.png"], colors: [{ name: "Grey", hex: "#7F8C8D", img: "assets/images/prod5.png" }], sizes: ["3000", "4000", "5000"] },
    { id: 6, name: "SALTIGA WHITE", shortName: "SALTIGA", price: 899.00, originalPrice: 1099.00, model: "SALTIGA-10/15/350/15/35", brand: "DAIWA SALTIGA", rating: 4.7, reviews: 156, description: "Limited edition white. Premium aesthetics and performance.", image: "assets/images/prod6.png", gallery: ["assets/images/prod6.png", "assets/images/rec1.png", "assets/images/rec2.png"], colors: [{ name: "White", hex: "#ECF0F1", img: "assets/images/prod6.png" }], sizes: ["3000", "4000", "5000"] },
    { id: 7, name: "BRAIDED LINE", shortName: "BRAIDED LINE", price: 200.00, originalPrice: 280.00, model: "AF-BRAID-8", brand: "Air Force", rating: 4.6, reviews: 87, description: "8-strand braided line. Zero stretch, high abrasion resistance.", image: "assets/images/prod7.png", gallery: ["assets/images/prod7.png", "assets/images/rec3.png", "assets/images/rec4.png"], colors: [{ name: "Green", hex: "#27AE60", img: "assets/images/prod7.png" }, { name: "Black", hex: "#2C3E50", img: "assets/images/prod1.png" }], sizes: ["10lb", "20lb", "30lb"] },
    { id: 8, name: "MONOFILAMENT LINE", shortName: "MONO LINE", price: 400.00, originalPrice: 520.00, model: "AF-MONO-10", brand: "Air Force", rating: 4.5, reviews: 62, description: "High-quality monofilament line. Low memory, excellent knot strength.", image: "assets/images/prod8.png", gallery: ["assets/images/prod8.png", "assets/images/rec2.png", "assets/images/rec4.png"], colors: [{ name: "Clear", hex: "#CCCCCC", img: "assets/images/prod8.png" }], sizes: ["12lb", "15lb", "20lb"] }
];



// Global state
let currentProduct = null;
let selectedSize = '';
let selectedColor = '';
let selectedQuantity = 1;
let selectedColorImage = '';

// DOM elements
const productNameEl = document.getElementById('product-name');
const currentPriceEl = document.getElementById('current-price');
const originalPriceEl = document.getElementById('original-price');
const starsEl = document.getElementById('product-stars');
const reviewCountEl = document.getElementById('review-count');
const productMetaEl = document.getElementById('product-meta');
const sizeOptionsDiv = document.getElementById('size-options');
const colorOptionsDiv = document.getElementById('color-options');
const qtyValueSpan = document.getElementById('qty-value');
const addToCartBtn = document.getElementById('addToCartBtn');
const mainImg = document.getElementById('main-product-img');
const thumbnailList = document.getElementById('thumbnail-list');
const productDescriptionDiv = document.getElementById('product-description');
const breadcrumbProductSpan = document.getElementById('breadcrumb-product-name');
const relatedGrid = document.getElementById('related-products-grid');

// Helper: render stars
function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    let stars = '';
    for (let i = 0; i < full; i++) stars += '★';
    if (half) stars += '½';
    const empty = 5 - full - half;
    for (let i = 0; i < empty; i++) stars += '☆';
    return stars;
}

// Render gallery thumbnails
function renderThumbnails(gallery) {
    thumbnailList.innerHTML = '';
    gallery.forEach((imgSrc, idx) => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.alt = `Thumbnail ${idx + 1}`;
        if (imgSrc === mainImg.src) thumb.classList.add('active');
        thumb.addEventListener('click', () => {
            mainImg.src = imgSrc;
            document.querySelectorAll('.thumbnail-list img').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
        thumbnailList.appendChild(thumb);
    });
}

// Render size options
function renderSizes(sizes) {
    sizeOptionsDiv.innerHTML = '';
    sizes.forEach(size => {
        const btn = document.createElement('button');
        btn.textContent = size;
        btn.classList.add('size-btn');
        if (size === selectedSize) btn.classList.add('selected');
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = size;
            updateAddToCartButton();
        });
        sizeOptionsDiv.appendChild(btn);
    });
}

// Render color options
function renderColors(colors) {
    colorOptionsDiv.innerHTML = '';
    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.style.backgroundColor = color.hex;
        colorDiv.classList.add('color-option');
        if (color.name === selectedColor) colorDiv.classList.add('selected');
        colorDiv.title = color.name;
        colorDiv.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
            colorDiv.classList.add('selected');
            selectedColor = color.name;
            selectedColorImage = color.img;
            // Update main image to this color's image
            mainImg.src = color.img;
            // Also update gallery (if needed, use product.gallery but we can keep main)
            updateAddToCartButton();
        });
        colorOptionsDiv.appendChild(colorDiv);
    });
}

// Enable/disable Add to Cart button
function updateAddToCartButton() {
    if (selectedSize && selectedColor) {
        addToCartBtn.disabled = false;
    } else {
        addToCartBtn.disabled = true;
    }
}

// Render product details
function renderProduct(product) {
    productNameEl.textContent = product.name;
    currentPriceEl.textContent = `¥${product.price.toLocaleString()}`;
    originalPriceEl.textContent = product.originalPrice ? `¥${product.originalPrice.toLocaleString()}` : '';
    starsEl.innerHTML = renderStars(product.rating);
    reviewCountEl.textContent = `(${product.reviews} reviews)`;
    productMetaEl.textContent = `Model: ${product.model} | Brand: ${product.brand}`;
    productDescriptionDiv.innerHTML = product.description;
    breadcrumbProductSpan.textContent = product.shortName || product.name;
    mainImg.src = product.image;
    selectedColorImage = product.image;
    // Render gallery
    renderThumbnails(product.gallery);
    // Render sizes
    selectedSize = '';
    selectedColor = '';
    renderSizes(product.sizes);
    renderColors(product.colors);
    selectedQuantity = 1;
    qtyValueSpan.textContent = selectedQuantity;
    updateAddToCartButton();
}

// Quantity controls
document.getElementById('qty-minus').addEventListener('click', () => {
    if (selectedQuantity > 1) {
        selectedQuantity--;
        qtyValueSpan.textContent = selectedQuantity;
    }
});
document.getElementById('qty-plus').addEventListener('click', () => {
    if (selectedQuantity < 99) {
        selectedQuantity++;
        qtyValueSpan.textContent = selectedQuantity;
    }
});

// Add to Cart
addToCartBtn.addEventListener('click', () => {
    if (!selectedSize || !selectedColor) {
        alert('Please select size and color');
        return;
    }
    if (!window.addToCartGlobal) {
        console.warn('cart.js not loaded');
        return;
    }
    const variantModel = `${currentProduct.model} | ${selectedSize} | ${selectedColor}`;
    const finalImage = selectedColorImage || currentProduct.image;
    // Since window.addToCartGlobal doesn't accept quantity, we need to call it once per quantity
    // Or we can modify cart.js to support quantity, but for simplicity we call it quantity times.
    // However, better to add a new function addToCartWithQuantity, but for now we simulate multiple calls.
    // Alternatively, we can directly manipulate the cart array, but let's use existing function.
    // We'll use a loop for quantity.
    for (let i = 0; i < selectedQuantity; i++) {
        window.addToCartGlobal(
            currentProduct.name,
            currentProduct.price,
            `${currentProduct.id}_${selectedSize}_${selectedColor}`,
            variantModel,
            finalImage
        );
    }
    // Button feedback
    const originalText = addToCartBtn.innerText;
    addToCartBtn.innerText = 'Added ✓';
    addToCartBtn.style.background = '#27AE60';
    setTimeout(() => {
        addToCartBtn.innerText = originalText;
        addToCartBtn.style.background = '';
    }, 2000);
});

// Wishlist (placeholder)
document.getElementById('wishlistAction').addEventListener('click', function() {
    this.classList.toggle('active');
    alert(this.classList.contains('active') ? 'Added to wishlist' : 'Removed from wishlist');
});

// Share (copy URL)
document.getElementById('shareAction').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard');
    }).catch(() => {
        alert('Unable to copy');
    });
});

// Render related products (exclude current, take first 4)
function renderRelated(currentId) {
    const related = productsData.filter(p => p.id !== currentId).slice(0, 4);
    relatedGrid.innerHTML = related.map(product => `
        <article class="product-card" data-product-name="${product.name}">
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/logo.png'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price-row">
                    <span class="product-price">¥${product.price.toLocaleString()}</span>
                    <button class="buy-btn" data-name="${product.name}" data-price="${product.price}">Buy</button>
                </div>
            </div>
        </article>
    `).join('');
    // Attach buy events
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const name = btn.getAttribute('data-name');
            const price = btn.getAttribute('data-price');
            if (window.addToCartGlobal) {
                window.addToCartGlobal(name, price);
            } else {
                console.warn('cart.js not loaded');
            }
        });
    });
    // Card click redirect
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('buy-btn')) return;
            const productName = card.getAttribute('data-product-name');
            if (productName) {
                window.location.href = `product.html?id=${encodeURIComponent(productName)}`;
            }
        });
    });
}

// Initialize page
function initProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');
    if (!productId) productId = urlParams.get('name');
    if (!productId) {
        window.location.href = 'collection.html';
        return;
    }
    // Try to find by name (decode) or id
    currentProduct = productsData.find(p => p.name === decodeURIComponent(productId) || p.id.toString() === productId);
    if (!currentProduct) {
        window.location.href = 'collection.html';
        return;
    }
    renderProduct(currentProduct);
    renderRelated(currentProduct.id);
}

initProductPage();

// ============================================
// Cart icon redirect to cart.html
// ============================================
const cartIcon = document.getElementById('cartBtn');
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
}