import { cartItems } from './cart-items.js';

const burger = document.querySelector(".burger");
const navClose = document.querySelector(".close-nav");
const nav = document.querySelector(".fulscreen-nav")
const cartContainer = document.querySelector(".cart");
const cartIcon = document.querySelector(".cart-icon");
const closeCart = document.querySelector(".cart .close");
const productsContainer = document.querySelector(".products-row");
const itemsContainer = document.querySelector(".cart-items");
const itemsCount = document.querySelector(".cart .items-quantity");
const cartSummary = document.querySelector(".cart .total-price");
const alert = document.querySelector(".alert-success");
const checkoutItems = document.querySelector(".checkout-items");
let cart = [];


document.addEventListener("DOMContentLoaded", renderItems);

function addToCart(id) {

    // Increase item quantity if already in cart
    if (cartIndex(id) > -1) {
        increaseQuantity(id);
        showAlert();
        return;
    }

    // Add item to cart if not present there
    else {

        // Find item in array with products
        const index = cartItems.findIndex(x => x.id == id);
        const item = cartItems[index];

        // Set amount and total price
        item.quantity = 1;
        item.total = item.price;

        // Save to storage
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));

        refreshCart();
        showAlert(); // Alert about succesfully adding item to cart

    }
}

// Delete item from cart
function deleteItem(id) {

    // Get index of item in cart
    const index = cartIndex(id);

    // Delete item
    if (index > -1) {
        cart.splice(index, 1);
    }

    // Save and re-render cart
    localStorage.setItem("cart", JSON.stringify(cart));
    refreshCart();

}

// Fetch cart from localStorage
function fetchCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Get index of item in cart
function cartIndex(id) {
    return cart.findIndex(x => x.id == id);
}

// Increase amount of item in cart
function increaseQuantity(id) {

    const index = cartIndex(id)
    const item = cart[index];

    item.quantity++;
    item.total += item.price;
    localStorage.setItem("cart", JSON.stringify(cart));
    refreshCart();

}

// Decrease amount of item in cart
function decreaseQuantity(id) {

    const index = cartIndex(id);
    const item = cart[index];
    item.quantity--;
    item.total -= item.price;

    if (item.quantity == 0) {
        deleteItem(id);
        return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    refreshCart();

}

function renderItems() {

    cart = fetchCart();

    // Render items on page
    if (productsContainer) {
        cartItems.forEach(item => {
            productsContainer.innerHTML += `
                <div class="col-lg-4 col-md-6">
                    <div class="product">
                        <div class="image-container">
                            <img src="assets/images/${item.img}" alt="">
                            <div class="overlay">
                                <button class="add-button" id="${item.code}">Add to cart</button>
                            </div>
                        </div>
                        <div class="description">
                            <h3 class="name">${item.name}</h3>
                            <p class="price">${item.price}$</p>
                        </div>
                    </div>
                </div>
            `;
        });

        // Bind event to "Add to cart" button
        cartItems.forEach(item => {
            document.querySelector(`#${item.code}`).addEventListener('click', function () {
                addToCart(item.id)
            });
        })
        refreshCart()
    }

    // Render list of items on checkout screen
    else if (checkoutItems) {
        let total = 0;
        cart.forEach(item => {
            checkoutItems.innerHTML += `
            <div class="item">
                <div class="product d-flex align-items-center">
                    <h2 class="name">${item.name} x  ${item.quantity}</h2>
                    <div class="data total">
                    ${item.total}$
                </div>
                </div>           
            </div>
            `;
            total += item.total;
        });

        checkoutItems.innerHTML += `
            <hr>
            <div class="d-flex summary justify-content-between">
                <span>Total: </span>
                <span>${total}$</span>
            </div>
        `;

    }
}

function refreshCart() {

    let summary = 0;
    let totalItems = 0;

    // Delete cart elements from DOM
    itemsContainer.innerHTML = '';
    itemsCount.innerHTML = `(${cart.length})`;
    if (cart.length) {
        cart.forEach(item => {
            itemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="thumbnail">
                        <img src="assets/images/${item.img}" alt="">
                    </div>
                    <div class="d-flex justify-content-around description">
                        <div class="name-container">
                            <span class="name">
                                ${item.name}
                            </span>
                            <div class="quantity">
                                <span class="control remove" id="remove-${item.code}">
                                    <svg width="16" height="2" viewBox="0 0 16 2" fill="none" xmlns="http://www.w3.org/2000/svg"><line y1="1" x2="16" y2="1" stroke="black" stroke-width="2" /></svg>
                                </span>
                                <span class="number">${item.quantity}</span>
                                <span class="control add" id="add-${item.code}">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><line y1="8" x2="16" y2="8" stroke="black" stroke-width="2" /><line x1="8" y1="16" x2="8" stroke="black" stroke-width="2" /></svg>
                                </span>
                            </div>
                        </div>
                        <div>
                            <div class="delete" id="delete-${item.code}">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="6.34319" y1="17.6568" x2="17.6569" y2="6.34314" stroke="black" stroke-width="2" /> <line x1="17.6568" y1="17.6569" x2="6.34308" y2="6.34317" stroke="black" stroke-width="2" /> </svg>
                            </div>
                            <span class="price">${(item.total).toFixed(2)}$</span>
                        </div>
                    </div>
                </div>`;
            totalItems += item.quantity;
        });
        cartIcon.classList.add("filled");
        cartIcon.querySelector(".number").innerHTML = totalItems;
    } else {
        itemsContainer.innerHTML = `
            <div class="cart-empty">
                <p>Your cart is empty!</p>
            </div>
        `;
        cartIcon.classList.remove("filled");
    }

    // Bind events to buttons on each element
    cart.forEach(item => {
        summary += item.total;

        // Delete button
        document.querySelector(`#delete-${item.code}`).addEventListener('click', function () {
            deleteItem(item.id);
        });

        // Increase quantity button
        document.querySelector(`#add-${item.code}`).addEventListener('click', function () {
            increaseQuantity(item.id);
        });

        // Decrease quantity button
        document.querySelector(`#remove-${item.code}`).addEventListener('click', function () {
            decreaseQuantity(item.id);
        });
    });

    cartSummary.innerHTML = `${summary.toFixed(2)}$`;
}

// Display notification
function showAlert() {
    alert.classList.add('visible');
    setTimeout(() => {
        alert.classList.remove("visible");
    }, 6000)
}

// Handle navbar and cart opening
function openCart() {
    cartContainer.classList.toggle("active");
}
function openNav() {
    nav.classList.toggle("active");
    burger.classList.toggle("active");
}


if (cartContainer) {
    cartIcon.addEventListener("click", openCart);
    closeCart.addEventListener("click", openCart);
}
burger.addEventListener("click", openNav);
navClose.addEventListener("click", openNav);
