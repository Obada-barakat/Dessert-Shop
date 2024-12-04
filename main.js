fetch('./assets/data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayProducts(data);
    })
    .catch(error => console.log('Error fetching the JSON file', error))


const cartItems = [];
let cart = document.querySelector('nav.cart');
const cartTitle = document.querySelector('nav.cart h2');

// display products:
function displayProducts(products) {
    let productsContainer = document.querySelector("div.products-container");
        products.forEach(product => {
                const productCard = createProductCard(product);
                productsContainer.appendChild(productCard);
        })
}

// creates a product card:
function createProductCard(product) {
    const productCard = document.createElement('div');
        productCard.className = "productCard";
        // product image and button:
        const btnImageDiv = document.createElement('div');
            btnImageDiv.className = "image-btn-div";

        const productImage = document.createElement('picture');
            const desktop = document.createElement("source");
                desktop.srcset = product.image.desktop;
                desktop.media = "(min-width: 1200px)";

            const tablet = document.createElement("source");
                tablet.srcset = product.image.tablet;
                tablet.media = "(min-width: 768px)";
            
            const mobile = document.createElement("source");
                mobile.srcset = product.image.mobile;
                mobile.media = "(max-width: 767px)";

            const img = document.createElement("img");
                img.src = product.image.mobile;
        productImage.append(desktop, tablet, mobile, img);
        // productImage.src = product.image.mobile;
            img.id = `${product.name.replace(/\s+/g, "-")}-img`;
            img.alt = product.name;
        
        const btnsDiv = document.createElement("div");
            btnsDiv.className = "buttons-div";
        const addToCartBtn = document.createElement('button');
            addToCartBtn.className = "addToCartBtn";
            addToCartBtn.id = `original-${product.name.replace(/\s+/g, "-")}`;
            addToCartBtn.innerHTML = `<img src="./assets/images/icon-add-to-cart.svg" alt="add-to-cart" class="basket">Add To Cart`;
                addToCartBtn.addEventListener("click", () => {
                    if (!addToCartBtn.classList.contains("clicked")) {
                        addsItems(product, addToCartBtn);
                        displayOrderConfirmation(product)
                    }
                });
        btnsDiv.append(addToCartBtn);
        
        // product Info
        const productInfo = document.createElement('div');
        productInfo.className = "productInfo";
        productInfo.innerHTML = `
        <p>${product.category}</p>
        <h2>${product.name}</h2>
        <p>$${product.price}</p>
        `;
        btnImageDiv.append(productImage, btnsDiv);
        productCard.append(btnImageDiv, productInfo);
        return productCard;
}


function addsItems(product, addToCartBtn) {
    addToCartBtn.classList.add("clicked");
    addToCartBtn.innerHTML = `
        <p class="decrement"><img src="./assets/images/icon-decrement-quantity.svg"></p>
        <p class="quantity"></p>
        <p class="increment"><img src="./assets/images/icon-increment-quantity.svg"></p>
    `;
    addToCart(
        {
            itemName: product.name,
            itemPrice: product.price,
        } 
    )
    add_remove_btns(product);
    imageBorder(product)
}

function displayOrderConfirmation(item) {
    const existingItem = cartItems.find(cartItem => cartItem.itemName === item.name) || cartItems.find(cartItem => cartItem.itemName === item.itemName);
    const confirmationMessage = document.querySelector("nav.cofirmation-message");

    const list = document.querySelector('ul.items-list') || document.createElement("ul");
        list.className = "items-list";

        const choosenItem = document.createElement("li");
            choosenItem.className = "choosen-item";
            choosenItem.id = `item-${item.name.replace(/\s+/g, "-")}`
            console.log(choosenItem)
        const quantity = item.quantity ? item.quantity : 1;

        let productName = "";
        if (item.name.split("").length > 20) {
            productName = `${item.name.split("").splice(0, 20).join("")}...`;
        } else {
            productName = item.name
        }
        choosenItem.innerHTML = `
            <div id="image">
                <img src=${item.image.thumbnail} alt="Product Image">
            </div>
            <div id="details">
                <P id="product-name" title=${item.name}>${productName}</P>
                <span id="quantity">${quantity}x</span>
                <span id="price">@${item.price}</span>
            </div>
            <div id="total-price">$${item.price * quantity}</div>
        `

        const totalOrder = document.querySelector("div#order-total") || document.createElement("div");
            totalOrder.id = "order-total";

            totalOrder.innerHTML = `
                <p>Order Total</p>
                <p class="totalPrice"></p>
            `;
            list.append(choosenItem, totalOrder);

            const startNewOrderBtn = document.querySelector("button#Start-new-order") || document.createElement("button");
                startNewOrderBtn.textContent = "Start New Order";
                startNewOrderBtn.id = "Start-new-order";
                startNewOrderBtn.addEventListener("click", startNewOrder)
        
            confirmationMessage.append(list, startNewOrderBtn)
            orderTotalDisplay();
}

function updateConfirmationOrder(item) {
    const cartItem = document.getElementById(`item-${item.itemName.replace(/\s+/g, "-")}`)
    const quantityElement = cartItem.querySelector("span#quantity");
        if (cartItem && item.quantity > 0) {
            quantityElement.textContent = `${item.quantity}x`;
            cartItem.querySelector("div#total-price").textContent = `$${item.quantity * item.itemPrice}`
        } else {
            cartItem.remove();
        }
        orderTotalDisplay()
}

const confirmationBtn = document.querySelector("button#confirm-order")
    confirmationBtn.addEventListener("click", orderConfirmed);

function orderConfirmed () {
    const confirmationMessage = document.querySelector("nav.cofirmation-message");
    const overlayDiv = document.querySelector("div#overlay");
        overlayDiv.addEventListener("click", startNewOrder)
    setTimeout(() => {
        confirmationMessage.classList.add("active")
        overlayDiv.classList.add("active")
    }, 400)
}

function startNewOrder() {
    const confirmationMessage = document.querySelector("nav.cofirmation-message");
    const overlayDiv = document.querySelector("div#overlay");
    const confirmStartNewOrder = document.querySelector("div.reorder");
    confirmStartNewOrder.classList.add("active");
    document.querySelector("button#confrim-start-new-order").addEventListener("click", () => {
        setTimeout(() => {
            confirmationMessage.classList.remove("active")
            overlayDiv.classList.remove("active");
            confirmStartNewOrder.classList.remove("active");
            cartItems.splice(0)
            setTimeout(() => {
                window.location.reload();
            }, 400)
        }, 400)
    });
    document.querySelector("button#cancel").addEventListener("click", () => {
        confirmStartNewOrder.classList.remove("active");
    })
}

function orderTotalDisplay () {
    let totalAmount = 0;
    const orderTotal = document.querySelector("div#order-total");
        cartItems.forEach(item => {
            totalAmount += (item.itemPrice * item.quantity)
        })
        orderTotal.querySelector("p.totalPrice").textContent = `$${totalAmount}`;
}

function imageBorder (product) {
    let image = document.querySelector(`#${product.name.replace(/\s+/g, "-")}-img`);
    image.className = "added"
}

// Change the button display
function add_remove_btns(product) {
    const item = document.querySelector(`button#original-${product.name.replace(/\s+/g, "-")}`);
    item.querySelector("p.decrement").addEventListener("click", (e) => {
        e.stopPropagation();
        decreseItems(product)
    })
    item.querySelector("p.increment").addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart( {itemName: product.name, itemPrice: product.price} )
    })
}

// decrement the cart items
function decreseItems (product) {
        let decresedItem = cartItems.find(cartItem => cartItem.itemName === product.name);
        if (decresedItem.quantity > 1) {
            decresedItem.quantity -= 1;
            updateButtonDisplay(decresedItem);
            updateCartQuantityDisplay(decresedItem);
            updateConfirmationOrder(decresedItem)
        } else {
            decresedItem.quantity = 0;
            const index = cartItems.indexOf(decresedItem);
                if (index > -1) {
                    cartItems.splice(index, 1);
                }
                removeCartItemDisplay(decresedItem)
                updateConfirmationOrder(decresedItem)
                updateCartTitle()
                setTimeout(() => {
                    let image = document.querySelector(`#${product.name.replace(/\s+/g, "-")}-img`)
                    image.classList.remove("added");
                }, 400)
            }

}


// adding items to the cart
function addToCart(item) {
    const existingItem = cartItems.find(cartItem => cartItem.itemName === item.itemName);
    if (existingItem) {
        existingItem.quantity += 1;
        updateCartQuantityDisplay(existingItem);
        updateButtonDisplay(existingItem);
        updateConfirmationOrder(existingItem)
    } else {
        item.quantity = 1;
        cartItems.push(item);
        displayNewCartItem(item);
        updateButtonDisplay(item);
    }
    updateCartTitle();
}

// remove items from the cart
function removeFromCart(item) {
    if (item.quantity > 1) {
        item.quantity -= 1;
        updateButtonDisplay(item)
        updateCartQuantityDisplay(item);
        updateConfirmationOrder(item)
    } else {
        item.quantity = 0;
        const index = cartItems.indexOf(item);
            if (index > -1) {
                cartItems.splice(index, 1);
            }
            removeCartItemDisplay(item);
            updateConfirmationOrder(item);
            setTimeout(() => {
                document.querySelector(`#${item.itemName.replace(/\s+/g, "-")}-img`).classList.remove("added")
            }, 400)
    }
    updateCartTitle();
}

// update the product button display // needs to be updated after finshing the buttons design
function updateButtonDisplay(item) {
    let addBtn = document.querySelector(`button#original-${item.itemName.replace(/\s+/g, "-")}`)
    if (item.quantity > 0) {
            addBtn.querySelector('p.quantity').textContent = item.quantity;
            addBtn.querySelector('p.quantity').classList.add("pop");
            setTimeout(() => {
                addBtn.querySelector('p.quantity').classList.remove("pop")
            }, 400)
        } else {
            addBtn.classList.replace("clicked", "readded");
            setTimeout(() => {
                addBtn.innerHTML = `<img src="./assets/images/icon-add-to-cart.svg" alt="add-to-cart" class="basket">Add To Cart`;
            }, 400);
        }
}


// updating the cart title dynimaclly 
function updateCartTitle() {
    cartTitle.textContent = `Your Cart (${cartItems.length})`;
}


// creating new cart
function displayNewCartItem(item) {
    let emptyCart = document.querySelector('nav.cart div#illustrate-empty-cart');
        emptyCart.className = "non-empty-cart";    
    
    const itemsList = document.querySelector('nav.cart ul') || document.createElement('ul');
    // product li 
        const newItem = document.createElement('li');
            newItem.id = `cart-item-${item.itemName.replace(/\s+/g, '-')}`;
            setTimeout(() => {
                newItem.classList.add("added");
            }, 20)
            newItem.innerHTML = `
            <div class="item">
                <h3>${item.itemName}</h3>
                    <p id="quantity">x${item.quantity}</p>
                    <p>@ $${item.itemPrice}</p>
                    <p id="totalPrice">$${item.itemPrice * item.quantity}</p>
            </div>
            <div class="remove-item">
                <img src="./assets/images/icon-remove-item.svg">
            </div>
            `;
            newItem.querySelector("img").addEventListener("click", () => {
                removeFromCart(item)
            })
            itemsList.appendChild(newItem);
            cart.appendChild(itemsList);
            
            displayOrderTotal();
}

// display the order total amount after the ul list 
function displayOrderTotal () {
    let orderTotal = document.querySelector("div#illustrate-choosen-item");
        orderTotal.className = "total-order-added";
        (() => {
            cart.appendChild(orderTotal)
        })();
        updateOrderTotalDisplay()
}


// update the total amount after each action 
function updateOrderTotalDisplay() {
    let totalAmount = 0;
    let orderTotal = document.querySelector('div#illustrate-choosen-item');
        cartItems.forEach(item => {
            totalAmount += (item.itemPrice * item.quantity)
        })
        orderTotal.querySelector('p.totalPrice').textContent = `$${totalAmount}`
}


function updateCartQuantityDisplay(item) {
    const cartItem = document.getElementById(`cart-item-${item.itemName.replace(/\s+/g, '-')}`);
    const quantityElement = cartItem.querySelector('#quantity');
    if (cartItem) {
        quantityElement.textContent = `x${item.quantity}`;
        cartItem.querySelector("#totalPrice").textContent = `$${item.quantity * item.itemPrice}`;
            setTimeout(() => {
                quantityElement.classList.add('changed');
                    setTimeout(() => {
                        quantityElement.classList.remove('changed');
                    }, 200)
            }, 10)
        updateOrderTotalDisplay();
    }
}

function removeCartItemDisplay(item) {
    const cartItem = document.getElementById(`cart-item-${item.itemName.replace(/\s+/g, '-')}`);
    if (cartItem) {
        cartItem.classList.add('removed')
        setTimeout(() => {
            cartItem.remove();
            cartItems.length < 1 ? baseFunctionDisplay() : updateOrderTotalDisplay();
            updateButtonDisplay(item);
        }, 300)
    }
}

function baseFunctionDisplay() {
    let emptyCart = document.querySelector("nav.cart div.non-empty-cart");
    let orderTotal = document.querySelector("div#illustrate-choosen-item")
        emptyCart.classList.remove("non-empty-cart");
        emptyCart.classList.add("empty-cart");

    setTimeout(() => {
        orderTotal.classList.remove("show-order-details")
        orderTotal.classList.add("order-details")
    }, 20)
}
