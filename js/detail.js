document.addEventListener('DOMContentLoaded', () => {
    // ⚠️ IMPORTANT: Verify this API URL is correct and your server is running.
    const API_URL = 'http://localhost:5000/api/products';
    let ALL_PRODUCTS_DATA = []; 

    // DOM Elements
    const productImage = document.querySelector('.product-image');
    const productTitle = document.querySelector('.product-title');
    const productPrice = document.querySelector('.product-price');
    const summaryText = document.querySelector('.summary-text');
    const featuresList = document.querySelector('.features-box ul');
    const descriptionPane = document.getElementById('description');
    const artistPane = document.getElementById('artist');
    const relatedProductsGrid = document.querySelector('.related-products .product-grid');
    const addToCartBtn = document.getElementById("add-to-cart-btns");
    const goToCartBtn = document.getElementById("go-to-cart-btn");
    const smallImagesContainer = document.querySelector('.small-images-container');

    // --- Helper Functions ---
    function getProductIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function formatPrice(price) {
        if (typeof price === 'number') {
            return `$${price.toLocaleString('en-US')}`;
        }
        return String(price || 'Price TBD');
    }
    
    function displayErrorMessage(message) {
        if (productTitle) productTitle.textContent = 'Product Not Available';
        if (productPrice) productPrice.textContent = '';
        if (summaryText) summaryText.textContent = message;
        if (productImage) productImage.src = 'images/placeholder-error.png';
        if (descriptionPane) descriptionPane.innerHTML = `<p style="color: red;">${message}</p>`;
        if (artistPane) artistPane.innerHTML = `<p style="color: red;">Artist details not available.</p>`;
        if (relatedProductsGrid) relatedProductsGrid.innerHTML = '<p>No related products loaded.</p>';
        console.error("DETAIL PAGE ERROR:", message);
    }

    // --- 1. Fetch ALL Products and Find the Selected One ---
    async function loadProductDetails() {
        const productId = getProductIdFromUrl();
        if (!productId) {
            displayErrorMessage("Product ID not found in URL.");
            return;
        }

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawProducts = await response.json();

            // Map, format, and ensure IDs are treated as strings
            ALL_PRODUCTS_DATA = rawProducts.map(product => ({
                ...product,
                id: String(product._id), 
                image: product.mainImage,
                price: formatPrice(product.price)
            }));

            const mainProduct = ALL_PRODUCTS_DATA.find(p => p.id === productId);

            if (mainProduct) {
                renderMainProduct(mainProduct);
                renderSmallImages(mainProduct);
                renderRelatedProducts(mainProduct, ALL_PRODUCTS_DATA);
                setupAddToCart(mainProduct);
            } else {
                displayErrorMessage(`Product with ID "${productId}" not found in the API response.`);
            }

        } catch (error) {
            console.error('Error fetching product data:', error);
            displayErrorMessage('Could not load product details. Check the server connection or API URL.');
        }
    }
    
    // --- 2. Render Main Product Details ---
    function renderMainProduct(product) {
        if (productImage) productImage.src = product.image || 'images/placeholder.png';
        if (productTitle) productTitle.textContent = product.title || 'Untitled Artwork';
        if (productPrice) productPrice.textContent = product.price;

        if (summaryText) {
            summaryText.textContent = `A stunning original piece, "${product.title || 'Untitled'}", by ${product.artist || 'Unknown Artist'}. This ${product.category || 'artwork'} is executed in the **${product.style || 'Contemporary'}** style using ${product.medium || 'Mixed Media'} medium, measuring ${product.dimensions || 'N/A'}. It is a unique piece, part of our curated collection.`;
        }

        if (featuresList) {
            featuresList.innerHTML = `
                <li>**Medium:** ${product.medium || 'N/A'}</li>
                <li>**Style:** ${product.style || 'N/A'}</li>
                <li>**Subject:** ${product.subject || 'N/A'}</li>
                <li>**Dimensions:** ${product.dimensions || 'N/A'}</li>
            `;
        }
        document.title = `${product.title || 'Product'} | ARTIFY`;
        renderTabContent(product);
    }

    // --- 3. Render Tab Content (omitted for brevity, structure remains same) ---
    function renderTabContent(product) { /* ... function body ... */ }
    
    // --- 4. Render Small Images (omitted for brevity, structure remains same) ---
    function renderSmallImages(product) { /* ... function body ... */ }

    // --- 5. Render Related Products (omitted for brevity, structure remains same) ---
    function renderRelatedProducts(mainProduct, allProducts) { /* ... function body ... */ }

    // --- 6. Cart Management Functions ---
    function updateCartButtonDisplay(isAdded) {
        if (addToCartBtn) addToCartBtn.style.display = isAdded ? 'none' : 'block';
        if (goToCartBtn) goToCartBtn.style.display = isAdded ? 'block' : 'none';
    }
    
    function setupAddToCart(product) {
        if (goToCartBtn) {
            goToCartBtn.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
        }
        
        if (!addToCartBtn) return;
        updateCartButtonDisplay(false); 
        
        addToCartBtn.addEventListener("click", () => {
            const selectVal = document.querySelector("#hidden-native-select")?.value;

            // Check if an option was actually selected (not the placeholder)
            if (!selectVal) {
                alert("Please select a valid option before adding to cart.");
                return;
            }
            
            const qty = parseInt(document.getElementById("quantity").value) || 1;

            // 🛑 STORING MINIMAL DATA: ID, QTY, and OPTION 🛑
            const cartItem = {
                id: product.id,        
                qty: qty,              
                option: selectVal      
            };
            
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingItemIndex = cart.findIndex(item => item.id === cartItem.id && item.option === cartItem.option);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].qty += qty;
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            const popup = document.getElementById('cartPopup');
            if (popup) {
                popup.textContent = 'Item added to cart!';
                popup.classList.add('show');
                setTimeout(() => popup.classList.remove('show'), 2500);
            }
            
            updateCartButtonDisplay(true); 
            setTimeout(() => updateCartButtonDisplay(false), 2500);

            const cartCountElement = document.getElementById('cart-count');
            if(cartCountElement) {
                cartCountElement.textContent = cart.reduce((total, item) => total + item.qty, 0);
            }
        });
        
        // Initial cart count display
        const initialCart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartCountElement = document.getElementById('cart-count');
        if(cartCountElement) {
            cartCountElement.textContent = initialCart.reduce((total, item) => total + item.qty, 0);
        }
    }


    // --- 7. Initialization and Other DOM/UI Logic ---
    loadProductDetails(); 

    // --- Tab Switching Logic (omitted for brevity, structure remains same) ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    // ... (rest of tab logic) ...
    
    // --- Quantity Input Validation (omitted for brevity, structure remains same) ---
    const quantityInput = document.getElementById('quantity');
    // ... (rest of quantity logic) ...


    // --- Custom Select Dropdown Logic (CORRECTED) ---
    const wrapper = document.querySelector('.custom-select-wrapper');
    if (wrapper) {
        const nativeSelect = wrapper.querySelector('.hidden-native-select');
        const customButton = wrapper.querySelector('.select-selected');
        const customItems = wrapper.querySelector('.select-items');

        function closeAllSelect() {
            customButton.classList.remove('select-arrow-active');
            customItems.classList.remove('select-open');
        }

        // Initialize custom options
        Array.from(nativeSelect.options).forEach((option) => {
            // Skip the placeholder option defined by value="" 
            if (option.value === "" && option.disabled) {
                // Initialize the custom button text to the placeholder
                customButton.innerHTML = option.innerHTML.trim() + '<span class="arrow"></span>';
                return;
            }

            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = option.innerHTML;

            itemDiv.addEventListener('click', function(e) {
                // Set native select value
                nativeSelect.value = option.value;
                customButton.innerHTML = this.innerHTML + '<span class="arrow"></span>';

                // Handle 'same-as-selected' class visually
                const currentlySelected = customItems.querySelector('.same-as-selected');
                if (currentlySelected) currentlySelected.classList.remove('same-as-selected');
                this.classList.add('same-as-selected');
                closeAllSelect();
                e.stopPropagation();
            });

            customItems.appendChild(itemDiv);
        });

        // Toggle dropdown
        customButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = customItems.classList.contains('select-open');
            document.querySelectorAll('.select-open').forEach(item => item.classList.remove('select-open'));
            document.querySelectorAll('.select-arrow-active').forEach(item => item.classList.remove('select-arrow-active'));

            if (!isOpen) {
                customItems.classList.add('select-open');
                customButton.classList.add('select-arrow-active');
            } else {
                closeAllSelect();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target)) {
                closeAllSelect();
            }
        });
    }

    // --- Mobile Menu Toggle Logic ---
    const navLinks = document.getElementById('nav-links');
    const openMenuIcon = document.getElementById('menu-icon');
    const closeMenuIcon = document.getElementById('close-icon');
    window.toggleNav = function () {
        if (!navLinks) return;
        navLinks.classList.toggle('active');
        openMenuIcon.style.display = navLinks.classList.contains('active') ? 'none' : 'block';
        closeMenuIcon.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
    };
});