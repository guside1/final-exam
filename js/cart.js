// ============================================
// Global shopping cart (localStorage)
// Structure: { id, name, model, price, quantity, image, selected }
// ============================================

// 获取当前购物车数组
function getCart() {
    const stored = localStorage.getItem('airforce_cart');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch(e) {
            return [];
        }
    }
    return [];
}

// 保存购物车并更新全局计数
function saveCart(cart) {
    localStorage.setItem('airforce_cart', JSON.stringify(cart));
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('airforce_cart_count', totalCount);
    // 更新所有页面的导航栏角标
    const badges = document.querySelectorAll('#cartCount');
    badges.forEach(badge => {
        if (badge) badge.textContent = totalCount;
    });
    window.dispatchEvent(new CustomEvent('cartUpdated'));
}

// 添加商品到购物车（供首页/产品页调用）
window.addToCartGlobal = function(productName, productPrice, productId = null, productModel = '', productImage = '') {
    let cart = getCart();
    const id = productId || productName.replace(/\s/g, '_');
    const existing = cart.find(item => item.id === id);
    
    // Determine final image path
    let finalImage = productImage;
    if (!finalImage) {
        // Name to image mapping for known products
        const nameMap = {
            'FISHING ROD RED': 'assets/images/prod1.png',
            'FISHING ROD BULE': 'assets/images/prod2.png',
            'FISHING ROD GREEN': 'assets/images/prod3.png',
            'SALTIGA BULE': 'assets/images/prod4.png',
            'SALTIGA GREY': 'assets/images/prod5.png',
            'SALTIGA WHITE': 'assets/images/prod6.png',
            'BRAIDED LINE': 'assets/images/prod7.png',
            'MONOFILAMENT LINE': 'assets/images/prod8.png',
            'Titan Pro Carbon': 'assets/images/product1.jpg',
            'Driftwood Spinning Rod': 'assets/images/product2.jpg',
            'Summit Casting Rod': 'assets/images/product3.jpg'
        };
        finalImage = nameMap[productName] || 'assets/images/logo.png';
    }
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: productName,
            model: productModel,
            price: parseFloat(productPrice),
            quantity: 1,
            image: finalImage,
            selected: true
        });
    }
    saveCart(cart);
    console.log(`Added ${productName} to cart.`);
};

// 页面加载时同步导航栏计数
document.addEventListener('DOMContentLoaded', () => {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('#cartCount');
    badges.forEach(badge => {
        if (badge) badge.textContent = totalCount;
    });
});