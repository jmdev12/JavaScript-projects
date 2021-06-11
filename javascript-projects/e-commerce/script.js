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

const EventsModule = (() => {

    const cartItemEvents = function (item) {

        // Delete button
        document.querySelector(`#delete-${item.code}`).addEventListener('click', function () {
            CartModule.deleteItem(item.id);
        });

        // Increase quantity button
        document.querySelector(`#add-${item.code}`).addEventListener('click', function () {
            CartModule.increaseQuantity(item.id);
        });

        // Decrease quantity button
        document.querySelector(`#remove-${item.code}`).addEventListener('click', function () {
            CartModule.decreaseQuantity(item.id);
        });

    }

    // Bind event to add to cart buttons
    const addItemEvent = function (item) {
        document.querySelector(`#${item.code}`).addEventListener('click', function () {
            CartModule.addItem(item.id)
        });
    }

    return {
        addItemEvent,
        cartItemEvents
    }

})()



const CartModule = (() => {
    const cartItemTemplate = document.querySelector("#cart-item-template");
    const cartEmptyTemplate = document.querySelector("#cart-empty-template");
    const productTemplate = document.querySelector("#product-template");
    const cartArr = [];

    const cartLength = () => cart.length;

    const DOMElements = {

        refreshCart: function () {

            let summary = 0;
            let totalItems = 0;

            // Delete cart elements from DOM
            itemsContainer.innerHTML = '';
            itemsCount.innerHTML = `(${cartLength()})`;

            // Render cart items
            if (cartLength()) {
                cart.forEach(item => {

                    // Get item template
                    const cartItem = document.importNode(cartItemTemplate.content, true);

                    // Set IDs
                    cartItem.querySelector(".control.remove").setAttribute("id", `remove-${item.code}`);
                    cartItem.querySelector(".control.add").setAttribute("id", `add-${item.code}`);
                    cartItem.querySelector(".delete").setAttribute("id", `delete-${item.code}`);

                    // Insert item data
                    cartItem.querySelector(".thumbnail img").setAttribute('src', `assets/images/${item.img}`);
                    cartItem.querySelector(".name").textContent = item.name;
                    cartItem.querySelector(".number").textContent = item.quantity;
                    cartItem.querySelector(".price").textContent = item.price + "$";

                    // Append to DOM
                    itemsContainer.appendChild(cartItem);
                    totalItems += item.quantity;

                    // Increase total cart value
                    summary += item.total;

                    // Bind events to buttons
                    EventsModule.cartItemEvents(item);

                });

                cartIcon.classList.add("filled");
                cartIcon.querySelector(".number").innerHTML = totalItems;

            } else {

                // Append empty cart template to DOM
                const cartEmpty = document.importNode(cartEmptyTemplate.content, true)
                itemsContainer.appendChild(cartEmpty)
                cartIcon.classList.remove("filled");

            }

            // Display total cart value
            cartSummary.innerHTML = `${summary.toFixed(2)}$`;
        },

        renderItems: function () {

            // Render items on page
            if (productsContainer) {
                cartItems.forEach(item => {

                    // Render single product
                    const product = document.importNode(productTemplate.content, true);
                    product.querySelector('.name').innerHTML = item.name;
                    product.querySelector('.price').innerHTML = item.price + "$";
                    product.querySelector('.image-container img').setAttribute('src', `assets/images/${item.img}`);
                    product.querySelector('.image-container .add-button').setAttribute('id', item.code);
                    productsContainer.append(product);

                    // Bind event to "Add to cart" button
                    EventsModule.addItemEvent(item);

                });

                DOMElements.refreshCart()
            }

            // Render list of items on checkout screen
            else if (checkoutItems) {

                const checkoutItemTemplate = document.querySelector("#checkout-item-template");
                const totalPrice = document.querySelector(".total-price");
                const summaryBreak = document.querySelector(".checkout-items hr")
                let total = 0;

                // Render items at checkout
                cart.forEach(item => {

                    const checkoutItem = document.importNode(checkoutItemTemplate.content, true);
                    checkoutItem.querySelector(".data.total").innerHTML = item.total + "$";
                    checkoutItem.querySelector(".name").innerHTML = `${item.name} x ${item.quantity}`;
                    checkoutItems.insertBefore(checkoutItem, summaryBreak);

                    // Increase total price
                    total += item.total;

                });

                // Show the total cart value
                totalPrice.innerHTML = total.toFixed(2) + "$";

            }
        }
    }


    // Define custom cart array
    const cart = new Proxy(cartArr, {

        set: function (target, name, value, receiver) {

            target[name] = value;

            // Refresh cart everytime array is updated
            if (!checkoutItems) {
                DOMElements.refreshCart();
            }

            return true;

        },

        get: function (target, name) {
            return target[name];
        }

    });


    // Get index of item in cart
    const getIndex = function (id) {
        return cart.findIndex(x => x.id == id);
    }


    // Fetch cart from localStorage
    const fetchCart = (function () {
        cart.splice(0, cart.length, ...JSON.parse(localStorage.getItem("cart")));
    })()


    // Save cart to localStorage
    const setCart = function () {
        localStorage.setItem("cart", JSON.stringify(cart));
    }


    const addItem = function (id) {

        // Increase item quantity if already in cart
        if (getIndex(id) > -1) {
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
            setCart();

            showAlert(); // Alert about succesfully adding item to cart

        }
    }


    // Delete item from cart
    const deleteItem = function (id) {

        // Get index of item in cart
        const index = getIndex(id);

        // Delete item
        if (index > -1) {
            cart.splice(index, 1);
        }

        // Save and re-render cart
        setCart();

    }


    // Increase amount of item in cart
    const increaseQuantity = function (id) {

        const index = getIndex(id)
        let item = cart[index];

        item.quantity++;
        item.total += item.price;

        DOMElements.refreshCart();
        setCart();

    }


    // Decrease amount of item in cart
    const decreaseQuantity = function (id) {

        const index = getIndex(id);
        const item = cart[index];
        item.quantity--;
        item.total -= item.price;

        if (item.quantity == 0) {
            deleteItem(id);
            return;
        }

        DOMElements.refreshCart();
        setCart();

    }


    return {
        increaseQuantity,
        decreaseQuantity,
        deleteItem,
        addItem,
        renderItems: DOMElements.renderItems
    }

}
)()



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

document.addEventListener("DOMContentLoaded", CartModule.renderItems());
burger.addEventListener("click", openNav);
navClose.addEventListener("click", openNav);
