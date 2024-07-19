document.addEventListener("DOMContentLoaded", function() {
    let products = []; // Store products globally

    // Fetch the product data from the API
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(fetchedProducts => {
            products = fetchedProducts; // Store fetched products
            displayProducts(products);
            initializeCart();
        })
        .catch(error => console.error('Error fetching products:', error));

    // Function to display products
    function displayProducts(productsToDisplay) {
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // Clear existing products

        productsToDisplay.forEach(product => {
            const productCard = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">$${product.price}</p>
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            productList.insertAdjacentHTML('beforeend', productCard);
        });

        // Add event listeners for "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                const product = products.find(p => p.id == productId);
                addToCart(product);
            });
        });
    }

    // Function to handle search
    function handleSearch(query) {
        const filteredProducts = products.filter(product => 
            product.title.toLowerCase().includes(query.toLowerCase())
        );
        displayProducts(filteredProducts);
    }

    // Event listeners for search
    document.getElementById('search-button').addEventListener('click', () => {
        const searchInput = document.getElementById('search-input').value;
        handleSearch(searchInput);
    });

    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchInput = document.getElementById('search-input').value;
            handleSearch(searchInput);
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
