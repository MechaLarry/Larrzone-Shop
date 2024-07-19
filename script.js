document.addEventListener("DOMContentLoaded", function() {
    // Fetch the product data from the API
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
            initializeCart();
        })
        .catch(error => console.error('Error fetching products:', error));

    // Function to display products on the page
    function displayProducts(products) {
        const productList = document.getElementById('product-list');

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('col-md-4', 'mb-4');

            productCard.innerHTML = `
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-description">${product.description}</p>
                        <p class="card-price">$${product.price}</p>
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}" data-name="${product.title}" data-price="${product.price}">Add to Cart</button>
                        <div class="comments-section mt-3">
                            <h6>Comments</h6>
                            <div id="comments-list-${product.id}" class="comments-list"></div>
                            <form id="comment-form-${product.id}" class="comment-form">
                                <div class="form-group">
                                    <input type="text" class="form-control" placeholder="Your Name" id="comment-name-${product.id}" required>
                                </div>
                                <div class="form-group">
                                    <textarea class="form-control" placeholder="Your Comment" id="comment-text-${product.id}" required></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Submit Comment</button>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            productList.appendChild(productCard);

            // Add event listener for comment form submission
            const commentForm = document.getElementById(`comment-form-${product.id}`);
            commentForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const name = document.getElementById(`comment-name-${product.id}`).value;
                const commentText = document.getElementById(`comment-text-${product.id}`).value;
                addComment(product.id, name, commentText);
            });
        });

        // Add event listeners to "Add to Cart" buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    // Function to add comments
    function addComment(productId, name, commentText) {
        const commentsList = document.getElementById(`comments-list-${productId}`);
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <strong>${name}</strong>: ${commentText}
        `;
        commentsList.appendChild(commentElement);

        // Optionally, clear the form fields after submission
        document.getElementById(`comment-name-${productId}`).value = '';
        document.getElementById(`comment-text-${productId}`).value = '';
    }

    // Function to initialize the cart
    function initializeCart() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartTotal = parseFloat(localStorage.getItem('cartTotal')) || 0.00;

        updateCart(cartItems, cartTotal);
    }

    // Function to add items to the cart
    function addToCart(event) {
        const button = event.target;
        const productId = button.getAttribute('data-id');
        const productName = button.getAttribute('data-name');
        const productPrice = parseFloat(button.getAttribute('data-price'));

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let cartTotal = parseFloat(localStorage.getItem('cartTotal')) || 0.00;

        const cartItem = {
            id: productId,
            name: productName,
            price: productPrice
        };

        cartItems.push(cartItem);
        cartTotal += productPrice;

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('cartTotal', cartTotal.toFixed(2));

        updateCart(cartItems, cartTotal);
    }

    // Function to update the cart display
    function updateCart(cartItems, cartTotal) {
        const cartItemsList = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');

        cartItemsList.innerHTML = '';
        cartItems.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            if (document.body.classList.contains('dark-mode')) {
                listItem.classList.add('dark-mode');
            }
            listItem.innerHTML = `
                ${item.name} - $${item.price} 
                <button class="btn btn-danger btn-sm float-right remove-item" data-index="${index}">Remove</button>
            `;
            cartItemsList.appendChild(listItem);
        });

        cartTotalElement.textContent = cartTotal.toFixed(2);

        // Add event listeners to "Remove" buttons
        const removeItemButtons = document.querySelectorAll('.remove-item');
        removeItemButtons.forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }

    // Function to remove items from the cart
    function removeItem(event) {
        const button = event.target;
        const index = button.getAttribute('data-index');

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let cartTotal = parseFloat(localStorage.getItem('cartTotal')) || 0.00;

        cartTotal -= cartItems[index].price;
        cartItems.splice(index, 1);

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('cartTotal', cartTotal.toFixed(2));

        updateCart(cartItems, cartTotal);
    }

    // Function to handle checkout process
    document.getElementById('checkout-button').addEventListener('click', () => {
        $('#cartModal').modal('hide');
        $('#checkoutModal').modal('show');
    });

    // Show payment details based on selected payment method
    document.getElementById('payment-method').addEventListener('change', function() {
        const paymentMethod = this.value;
        document.querySelectorAll('.payment-details').forEach(el => el.style.display = 'none');
        if (paymentMethod === 'card') {
            document.getElementById('card-details').style.display = 'block';
        } else if (paymentMethod === 'mpesa') {
            document.getElementById('mpesa-details').style.display = 'block';
        }
    });

    // Handle form submission
    document.getElementById('checkout-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Payment submitted successfully!'); // Replace with actual payment processing logic
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartTotal');
        initializeCart();
        $('#checkoutModal').modal('hide');
    });

    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check the initial dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    }

    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });

    function enableDarkMode() {
        body.classList.add('dark-mode');
        document.querySelectorAll('.navbar, .card, .modal-content, .list-group-item').forEach(el => el.classList.add('dark-mode'));
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.checked = true;
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        document.querySelectorAll('.navbar, .card, .modal-content, .list-group-item').forEach(el => el.classList.remove('dark-mode'));
        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.checked = false;
    }
});
