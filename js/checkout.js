// ============================================
// Checkout page: load cart (selected items), address, payment, discount
// ============================================

// Helper: get cart from localStorage
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

// Helper: save cart
function saveCart(cart) {
    localStorage.setItem('airforce_cart', JSON.stringify(cart));
    // Update badge count globally (optional)
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('airforce_cart_count', totalCount);
    const badges = document.querySelectorAll('#cartCount');
    badges.forEach(badge => {
        if (badge) badge.textContent = totalCount;
    });
}

// Discount calculation
function calculateDiscount(total) {
    if (total >= 10000) return 688;
    if (total >= 5000) return 288;
    if (total >= 3000) return 128;
    return 0;
}

// Render address
function renderAddress() {
    const stored = localStorage.getItem('airforce_address');
    let addressHtml = '';
    if (stored) {
        try {
            const addr = JSON.parse(stored);
            addressHtml = `${addr.name}\n${addr.phone}\n${addr.address}`;
        } catch(e) {
            addressHtml = 'No address saved. Click Add/Modify.';
        }
    } else {
        addressHtml = 'No address saved. Click Add/Modify.';
    }
    const addressText = document.getElementById('addressText');
    if (addressText) addressText.innerText = addressHtml;
}

// Edit address (simple prompt)
function editAddress() {
    let address = { name: '', phone: '', address: '' };
    const stored = localStorage.getItem('airforce_address');
    if (stored) {
        try {
            address = JSON.parse(stored);
        } catch(e) {}
    }
    const newName = prompt('Enter your full name:', address.name);
    if (newName !== null) address.name = newName;
    const newPhone = prompt('Enter your phone number:', address.phone);
    if (newPhone !== null) address.phone = newPhone;
    const newAddr = prompt('Enter your address (use new line if needed):', address.address);
    if (newAddr !== null) address.address = newAddr;
    localStorage.setItem('airforce_address', JSON.stringify(address));
    renderAddress();
}

// Render selected cart items
function renderSelectedItems() {
    const cart = getCart();
    const selectedItems = cart.filter(item => item.selected === true);
    const container = document.getElementById('cart-items-container');
    if (!container) return;
    
    if (selectedItems.length === 0) {
        container.innerHTML = '<div class="empty-cart-message">No items selected. <a href="cart.html">Go to Cart</a></div>';
        document.getElementById('itemCount').innerText = '0 items';
        document.getElementById('totalPrice').innerText = '0.00RMB';
        document.getElementById('discountAmount').innerText = '0.00RMB';
        document.getElementById('finalPrice').innerText = '0.00RMB';
        document.getElementById('discountBadge').innerText = 'Discount:-0.00RMB';
        const placeBtn = document.getElementById('placeOrderBtn');
        if (placeBtn) placeBtn.classList.add('disabled');
        return;
    }
    
    let totalItems = 0;
    let subtotal = 0;
    let itemsHtml = '';
    selectedItems.forEach(item => {
        totalItems += item.quantity;
        subtotal += item.price * item.quantity;
        itemsHtml += `
            <div class="cart-item" data-id="${item.id}">
                <div class="checkout-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/logo.png'">
                </div>
                <div class="checkout-item-info">
                    <div class="item-model">${item.model || item.name}</div>
                    <div class="item-brand">DAIWA SALTIGA</div>
                    <div class="item-desc">${item.name}</div>
                </div>
                <div class="checkout-item-price">
                    <div class="item-price-amount">${item.price.toFixed(2)}RMB</div>
                    <div class="item-quantity">x${item.quantity}</div>
                </div>
            </div>
        `;
    });
    container.innerHTML = itemsHtml;
    document.getElementById('itemCount').innerText = `${totalItems} items`;
    document.getElementById('totalPrice').innerText = `${subtotal.toFixed(2)}RMB`;
    
    const discount = calculateDiscount(subtotal);
    const final = subtotal - discount;
    document.getElementById('discountAmount').innerText = `-${discount.toFixed(2)}RMB`;
    document.getElementById('finalPrice').innerText = `${final.toFixed(2)}RMB`;
    document.getElementById('discountBadge').innerText = `Discount:-${discount.toFixed(2)}RMB`;
    
    // Store final price for later use (optional)
    window.finalAmount = final;
    window.selectedCart = selectedItems;
}

// Payment method selection
function initPaymentSelection() {
    const options = document.querySelectorAll('.payment-option');
    options.forEach(opt => {
        opt.addEventListener('click', () => {
            options.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            const placeBtn = document.getElementById('placeOrderBtn');
            if (placeBtn) placeBtn.classList.remove('disabled');
        });
    });
}

// Place order
function placeOrder() {
    const selectedPayment = document.querySelector('.payment-option.selected');
    if (!selectedPayment) {
        alert('Please select a payment method');
        return;
    }
    const cart = getCart();
    const selectedItems = cart.filter(item => item.selected);
    if (selectedItems.length === 0) {
        alert('Your cart is empty or no items selected.');
        window.location.href = 'cart.html';
        return;
    }
    // Remove selected items from cart
    const newCart = cart.filter(item => !item.selected);
    saveCart(newCart);
    alert('Order placed successfully!');
    window.location.href = 'index.html';
}

// Initialize page
function initCheckout() {
    renderAddress();
    renderSelectedItems();
    initPaymentSelection();
    
    const editBtn = document.getElementById('editAddressBtn');
    if (editBtn) editBtn.addEventListener('click', editAddress);
    
    const placeBtn = document.getElementById('placeOrderBtn');
    if (placeBtn) placeBtn.addEventListener('click', placeOrder);
}

document.addEventListener('DOMContentLoaded', initCheckout);