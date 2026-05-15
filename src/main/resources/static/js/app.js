const API_BASE = '/api';

// Utility to show alert notifications
function showAlert(message, type = 'success') {
    const alertEl = document.createElement('div');
    alertEl.className = `alert ${type} show`;
    alertEl.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(alertEl);

    setTimeout(() => {
        alertEl.classList.remove('show');
        setTimeout(() => alertEl.remove(), 300);
    }, 3000);
}

// Authentication handling
function checkAuth() {
    const userId = localStorage.getItem('userId');
    const path = window.location.pathname;
    
    if (!userId && !path.includes('login.html')) {
        window.location.href = 'login.html';
    } else if (userId && path.includes('login.html')) {
        window.location.href = 'products.html';
    }
}

function logout() {
    localStorage.removeItem('userId');
    window.location.href = 'login.html';
}

// Login
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('userId', data.userId);
            window.location.href = 'products.html';
        } else {
            showAlert('Invalid username or password', 'error');
        }
    } catch (error) {
        showAlert('Error connecting to server', 'error');
    }
}

// Load Products
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        let products = await response.json();
        
        // Image Overrides for broken database links without restarting backend
        const overrides = {
            1: "/images/apple.png", // Apple
            7: "/images/onion.png", // Red onion
            10: "/images/lentils.png" // Lentils
        };
        products = products.map(p => ({
            ...p,
            imageUrl: overrides[p.id] || p.imageUrl
        }));

        const grid = document.getElementById('productGrid');
        
        if (!grid) return;

        grid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.imageUrl}" alt="${product.name}" class="product-img">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">₹${product.price.toFixed(2)}</p>
                    <button class="btn btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showAlert('Failed to load products', 'error');
    }
}

// Add to Cart
async function addToCart(productId) {
    const userId = localStorage.getItem('userId');
    try {
        const response = await fetch(`${API_BASE}/cart/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, productId })
        });

        if (response.ok) {
            showAlert('Item added to cart!');
        } else {
            showAlert('Failed to add item', 'error');
        }
    } catch (error) {
        showAlert('Error connecting to server', 'error');
    }
}

// Load Cart
async function loadCart() {
    const userId = localStorage.getItem('userId');
    const cartContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    
    if (!cartContainer) return;

    try {
        const response = await fetch(`${API_BASE}/cart/${userId}`);
        let items = await response.json();
        
        // Image Overrides for cart items as well
        const overrides = {
            1: "/images/apple.png",
            7: "/images/onion.png",
            10: "/images/lentils.png"
        };
        items = items.map(item => {
            if(overrides[item.product.id]) {
                item.product.imageUrl = overrides[item.product.id];
            }
            return item;
        });

        if (items.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalEl.innerText = '₹0.00';
            subtotalEl.innerText = '₹0.00';
            taxEl.innerText = '₹0.00';
            document.getElementById('checkoutBtn').disabled = true;
            return;
        }

        let subtotal = 0;
        cartContainer.innerHTML = items.map(item => {
            const itemTotal = item.product.price * item.quantity;
            subtotal += itemTotal;
            return `
                <div class="cart-item">
                    <img src="${item.product.imageUrl}" alt="${item.product.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.product.name}</div>
                        <div class="cart-item-price">₹${item.product.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-qty">
                        Qty: 
                        <select class="qty-dropdown" style="padding: 2px 6px; border-radius: 4px; border: 1px solid #ddd;" onchange="updateSummary()">
                            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => `<option value="${num}" ${num === item.quantity ? 'selected' : ''}>${num}</option>`).join('')}
                        </select>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `;
        }).join('');

        // Expose updateSummary for the dropdown
        window.updateSummary = function() {
            let userSubtotal = 0;
            document.querySelectorAll('.cart-item').forEach(el => {
                const pText = el.querySelector('.cart-item-price').innerText.replace('₹', '');
                const uPrice = parseFloat(pText);
                const uQty = parseInt(el.querySelector('.qty-dropdown').value, 10);
                userSubtotal += (uPrice * uQty);
            });
            const userTax = userSubtotal * 0.08;
            document.getElementById('subtotal').innerText = `₹${userSubtotal.toFixed(2)}`;
            document.getElementById('tax').innerText = `₹${userTax.toFixed(2)}`;
            document.getElementById('cartTotal').innerText = `₹${(userSubtotal + userTax).toFixed(2)}`;
        };

        const tax = subtotal * 0.08; // 8% dummy tax
        const total = subtotal + tax;

        subtotalEl.innerText = `₹${subtotal.toFixed(2)}`;
        taxEl.innerText = `₹${tax.toFixed(2)}`;
        cartTotalEl.innerText = `₹${total.toFixed(2)}`;
        document.getElementById('checkoutBtn').disabled = false;

    } catch (error) {
        showAlert('Failed to load cart', 'error');
    }
}

// Remove from Cart
async function removeFromCart(cartItemId) {
    try {
        const response = await fetch(`${API_BASE}/cart/remove/${cartItemId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showAlert('Item removed');
            loadCart(); // reload cart
        }
    } catch (error) {
        showAlert('Error removing item', 'error');
    }
}

// Checkout
async function handleCheckout() {
    const userId = localStorage.getItem('userId');
    try {
        const response = await fetch(`${API_BASE}/cart/checkout/${userId}`, {
            method: 'POST'
        });

        if (response.ok) {
            // Redirect to dummy checkout page
            window.location.href = 'checkout.html';
        }
    } catch (error) {
        showAlert('Checkout failed', 'error');
    }
}

// Initialization on load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Setup listeners based on page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    
    if (document.getElementById('productGrid')) loadProducts();
    if (document.getElementById('cartItems')) loadCart();
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);
});
