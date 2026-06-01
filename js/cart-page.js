// ============================================
// Cart page: render, interact, sync with localStorage
// ============================================

// Helper: 从 localStorage 读取购物车数据
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

// 保存购物车到 localStorage，并更新全局计数和导航栏 badge
function saveCart(cart) {
    localStorage.setItem('airforce_cart', JSON.stringify(cart));
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('airforce_cart_count', totalCount);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = totalCount;
    // 触发自定义事件，让其他页面可以监听（可选）
    window.dispatchEvent(new CustomEvent('cartUpdated'));
}

// 渲染购物车列表
function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cart-items-container');
    const emptyMsg = document.getElementById('empty-cart-message');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');

    if (!cart.length) {
        container.innerHTML = '';
        emptyMsg.style.display = 'block';
        if (selectAllCheckbox) selectAllCheckbox.checked = false;
        updateSummary();
        return;
    }
    emptyMsg.style.display = 'none';
    container.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-select">
                <input type="checkbox" class="item-checkbox" ${item.selected ? 'checked' : ''}>
            </div>
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" 
                     onerror="this.src='assets/images/logo.png'; this.onerror=null;"
                     style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-model">${item.model || ''}</div>
                <div class="item-price">¥${item.price.toFixed(2)}</div>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn decr">-</button>
                <span class="quantity-num">${item.quantity}</span>
                <button class="quantity-btn incr">+</button>
            </div>
        </div>
    `).join('');

    // 绑定商品内的事件
    document.querySelectorAll('.cart-item').forEach(itemDiv => {
        const id = itemDiv.getAttribute('data-id');
        const checkbox = itemDiv.querySelector('.item-checkbox');
        const decrBtn = itemDiv.querySelector('.decr');
        const incrBtn = itemDiv.querySelector('.incr');

        checkbox.addEventListener('change', (e) => {
            updateItemSelected(id, checkbox.checked);
        });
        decrBtn.addEventListener('click', () => {
            changeQuantity(id, -1);
        });
        incrBtn.addEventListener('click', () => {
            changeQuantity(id, 1);
        });
    });

    // 全选状态同步
    const allCheckboxes = document.querySelectorAll('.item-checkbox');
    const allChecked = allCheckboxes.length > 0 && Array.from(allCheckboxes).every(cb => cb.checked);
    if (selectAllCheckbox) selectAllCheckbox.checked = allChecked;

    updateSummary();
}

// 更新单个商品的选中状态
function updateItemSelected(id, isSelected) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.selected = isSelected;
        saveCart(cart);
        renderCart(); // 重新渲染以更新 summary
    }
}

// 改变商品数量
function changeQuantity(id, delta) {
    let cart = getCart();
    const index = cart.findIndex(i => i.id === id);
    if (index === -1) return;
    const newQty = cart[index].quantity + delta;
    if (newQty <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity = newQty;
    }
    saveCart(cart);
    renderCart();
}

// 全选/全不选
function selectAll(checked) {
    let cart = getCart();
    cart = cart.map(item => ({ ...item, selected: checked }));
    saveCart(cart);
    renderCart();
}

// 删除所有选中商品
function deleteSelected() {
    let cart = getCart();
    const newCart = cart.filter(item => !item.selected);
    saveCart(newCart);
    renderCart();
}

// 更新底部汇总（选中数量、总价）
function updateSummary() {
    const cart = getCart();
    const selectedItems = cart.filter(item => item.selected);
    const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('selectedCountDisplay').innerText = selectedCount;
    document.getElementById('totalPriceDisplay').innerText = `¥ ${totalPrice.toFixed(2)}`;
    // 控制 checkout 按钮状态
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        if (selectedCount === 0) {
            checkoutBtn.classList.add('disabled');
        } else {
            checkoutBtn.classList.remove('disabled');
        }
    }
}

// 初始化页面
function initCartPage() {
    renderCart();

    // 全选复选框事件
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            selectAll(e.target.checked);
        });
    }

    // 删除按钮
    const deleteBtn = document.getElementById('deleteSelectedBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteSelected);
    }

    // 继续购物链接已经内嵌 a 标签
    // 结算按钮
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const selectedCount = parseInt(document.getElementById('selectedCountDisplay').innerText);
            if (selectedCount === 0) {
                alert('Please select at least one item');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
}

document.addEventListener('DOMContentLoaded', initCartPage);

// 购物车图标点击刷新当前页（可选）
const cartIcon = document.getElementById('cartBtn');
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        window.location.href = 'cart.html'; // 刷新当前购物车页面
    });
}

// ============================================
// Cart page search redirect
// ============================================
const cartSearchInput = document.querySelector('.search-input-wrapper input');
const cartSearchBtn = document.querySelector('.search-btn-cart');

function performCartSearch() {
    const query = cartSearchInput?.value.trim();
    if (query) {
        window.location.href = `collection.html?search=${encodeURIComponent(query)}`;
    } else {
        alert('Please enter a search term');
    }
}
if (cartSearchBtn) {
    cartSearchBtn.addEventListener('click', performCartSearch);
}
if (cartSearchInput) {
    cartSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performCartSearch();
    });
}