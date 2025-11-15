document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api/products';
    let ALL_PRODUCTS_DATA = []; // To store all products for related items

    const productImage = document.querySelector('.product-image');
    const productTitle = document.querySelector('.product-title');
    const productPrice = document.querySelector('.product-price');
    const summaryText = document.querySelector('.summary-text');
    const featuresList = document.querySelector('.features-box ul');
    const descriptionPane = document.getElementById('description');
    const artistPane = document.getElementById('artist');
    const relatedProductsGrid = document.querySelector('.related-products .product-grid');

    // Helper to get the product ID from the URL
    function getProductIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    // Helper to format price (as done in product.js)
    function formatPrice(price) {
        if (typeof price === 'number') {
            return `$${price.toLocaleString('en-US')}`;
        }
        return String(price || 'Price TBD');
    }

    // --- 1. Fetch ALL Products and Find the Selected One ---
    async function loadProductDetails() {
        const productId = getProductIdFromUrl();
        if (!productId) {
            displayErrorMessage("Product ID not found in URL.");
            return;
        }

        try {
            // Fetch all products (needed for 'Related Products')
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawProducts = await response.json();

            // Map and format the data (same logic as in product.js)
            ALL_PRODUCTS_DATA = rawProducts.map(product => ({
                ...product,
                id: product._id, // Map _id to id
                image: product.mainImage, // Map mainImage to image
                price: formatPrice(product.price)
            }));

            // Find the main product for this page
            const mainProduct = ALL_PRODUCTS_DATA.find(p => String(p.id) === String(productId));

            if (mainProduct) {
                renderMainProduct(mainProduct);
                renderSmallImages(mainProduct);
                renderRelatedProducts(mainProduct, ALL_PRODUCTS_DATA);
                setupAddToCart(mainProduct);
            } else {
                displayErrorMessage(`Product with ID "${productId}" not found.`);
            }

        } catch (error) {
            console.error('Error fetching product data:', error);
            displayErrorMessage('Could not load product details. Check the server connection.');
        }
    }
    
    // --- Error Display Function ---
    function displayErrorMessage(message) {
        if (productTitle) productTitle.textContent = 'Product Not Available';
        if (productPrice) productPrice.textContent = '';
        if (summaryText) summaryText.textContent = message;
        if (productImage) productImage.src = 'images/placeholder-error.png'; // Add a fallback image
        if (descriptionPane) descriptionPane.innerHTML = `<p style="color: red;">${message}</p>`;
        if (artistPane) artistPane.innerHTML = `<p style="color: red;">Artist details not available.</p>`;
        if (relatedProductsGrid) relatedProductsGrid.innerHTML = '<p>No related products loaded.</p>';
    }


    // --- 2. Render Main Product Details ---
    function renderMainProduct(product) {
        // --- Product Info Section ---
        if (productImage) productImage.src = product.image || 'images/placeholder.png';
        if (productTitle) productTitle.textContent = product.title || 'Untitled Artwork';
        if (productPrice) productPrice.textContent = product.price;

        if (summaryText) {
            summaryText.textContent = `A stunning original piece, "${product.title || 'Untitled'}", by ${product.artist || 'Unknown Artist'}. This ${product.category || 'artwork'} is executed in the **${product.style || 'Contemporary'}** style using ${product.medium || 'Mixed Media'} medium, measuring ${product.dimensions || 'N/A'}. It is a unique piece, part of our curated collection.`;
        }

        // --- Features List ---
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

    // --- 3. Render Tab Content ---
    function renderTabContent(product) {
        // Use the 'description' and 'artistBio' from the API data
        const descriptionContent = product.description || 'No detailed description available for this piece.';
        const artistContent = product.artistBio || 'No artist biography available.';

        // --- Description Tab ---
        if (descriptionPane) {
            descriptionPane.innerHTML = `
                <h3>Conceptual Vision: A Study in Space and Light</h3>
                <p>${descriptionContent}</p>
                
                <h4>Technical Specifications:</h4>
                <ul class="spec-list">
                    <li>**Artist:** ${product.artist || 'N/A'}</li>
                    <li>**Medium:** ${product.medium || 'N/A'}</li>
                    <li>**Dimensions:** ${product.dimensions || 'N/A'}</li>
                    <li>**Style:** ${product.style || 'N/A'}</li>
                    <li>**Condition:** New, Original Artwork.</li>
                </ul>
            `;
        }

        // --- Artist Tab ---
        if (artistPane) {
            artistPane.innerHTML = `
                <h3>${product.artist || 'Artist'}: The Artist's Vision</h3>
                <p>${artistContent}</p>
                
                <div class="highlight-box">
                    <p>This original work is signed by ${product.artist || 'the artist'}, guaranteeing its authenticity.</p>
                </div>
            `;
        }
    }

    // --- 4. Render Small Images (No API change needed, structure remains same) ---
    function renderSmallImages(product) {
        if (!product.smallImages || product.smallImages.length === 0) return;

        let smallImgsContainer = document.querySelector('.small-images-container');
        if (!smallImgsContainer) {
            smallImgsContainer = document.createElement('div');
            smallImgsContainer.classList.add('small-images-container');
            document.querySelector('.image-column').appendChild(smallImgsContainer); // Append to image-column
        }
        smallImgsContainer.innerHTML = '';

        product.smallImages.forEach(src => {
            const imgWrapper = document.createElement('div');
            imgWrapper.classList.add('small-img-wrapper');

            const img = document.createElement('img');
            img.src = src;
            img.alt = `Thumbnail for ${product.title}`;
            img.classList.add('small-img-thumbnail');

            img.addEventListener('click', (e) => {
                if (productImage) productImage.src = e.target.src;
                document.querySelectorAll('.small-img-thumbnail').forEach(t => t.classList.remove('active-thumbnail'));
                e.target.classList.add('active-thumbnail');
            });

            imgWrapper.appendChild(img);
            smallImgsContainer.appendChild(imgWrapper);
        });
    }

    // --- 5. Render Related Products (Using fetched ALL_PRODUCTS_DATA) ---
    function renderRelatedProducts(mainProduct, allProducts) {
        if (!relatedProductsGrid) return;
        relatedProductsGrid.innerHTML = '';

        // Logic: Find 4 products that are not the current one, prioritizing same style or artist
        const related = allProducts.filter(p => 
            p.id !== mainProduct.id && 
            (p.style === mainProduct.style || p.artist === mainProduct.artist)
        );

        // Add fallback products if not enough related ones found
        const fallbackCount = 4 - related.length;
        if (related.length < 4) {
            const otherProducts = allProducts.filter(p => 
                p.id !== mainProduct.id && 
                related.every(r => r.id !== p.id)
            );
            related.push(...otherProducts.slice(0, fallbackCount));
        }

        related.slice(0, 4).forEach(relatedProduct => {
            const card = document.createElement('a');
            // Change link to open the detail page with the new product's ID
            card.href = `detail.html?id=${relatedProduct.id}`; 
            card.classList.add('product-card');

            card.innerHTML = `
                <div class="product-card-image-wrapper">
                    <img src="${relatedProduct.image || 'images/placeholder.png'}" alt="${relatedProduct.title}">
                </div>
                <div class="product-card-info">
                    <h3 class="product-card-title">${relatedProduct.title || 'N/A'}</h3>
                    <p class="product-card-category">${relatedProduct.category || 'N/A'}</p>
                    <p class="product-card-price">${relatedProduct.price}</p>
                </div>
            `;
            relatedProductsGrid.appendChild(card);
        });
    }

    // --- 6. Add to Cart Logic (now using the fetched product ID) ---
    function setupAddToCart(product) {
        document.getElementById("add-to-cart-btns").addEventListener("click", () => {
            const selectVal = document.querySelector("#hidden-native-select")?.value || "Unframed";
            const qty = parseInt(document.getElementById("quantity").value) || 1;

            const cartItem = {
                id: product.id, // Use the unique ID for cart item
                title: product.title,
                price: product.price,
                image: product.image,
                qty: qty,
                option: selectVal
            };
            
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            
            // Check if the item (by ID and option) already exists and update quantity
            const existingItemIndex = cart.findIndex(item => item.id === cartItem.id && item.option === cartItem.option);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].qty += qty;
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            const popup = document.getElementById('cartPopup');
            if (popup) {
                popup.classList.add('show');
                setTimeout(() => popup.classList.remove('show'), 2500);
            }
            
            // Update cart count display (optional, based on your cart structure)
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
    loadProductDetails(); // Start the process by fetching the details

    // --- Tab Switching Logic (No Change) ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const switchTab = (targetId) => {
        tabPanes.forEach(pane => pane.classList.add('hidden'));
        tabButtons.forEach(button => button.classList.remove('active'));
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.remove('hidden');
        const activeBtn = document.querySelector(`.tab-button[data-tab="${targetId}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    };
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => switchTab(e.currentTarget.getAttribute('data-tab')));
    });

    // --- Quantity Input Validation (No Change) ---
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            // Ensure quantity is at least 1 and not more than 5
            const val = parseInt(this.value);
            if (isNaN(val) || val < 1) this.value = 1;
            if (val > 5) this.value = 5; 
        });
    }

    // --- Custom Select Dropdown Logic (No Change) ---
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
            if (option.disabled && option.selected) return;

            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = option.innerHTML;

            if (option.selected && !option.disabled) {
                itemDiv.classList.add('same-as-selected');
                // The arrow span is added directly in the HTML for the custom button
                customButton.innerHTML = option.innerHTML.trim() + '<span class="arrow"></span>';
            }

            itemDiv.addEventListener('click', function(e) {
                nativeSelect.value = option.value;
                customButton.innerHTML = this.innerHTML + '<span class="arrow"></span>';

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


    // --- Mobile Menu Toggle Logic (Copied from bottom of your original JS) ---
    const navLinks = document.getElementById('nav-links');
    const openMenuIcon = document.getElementById('menu-icon');
    const closeMenuIcon = document.getElementById('close-icon');
    window.toggleNav = function () {
        navLinks.classList.toggle('active');
        openMenuIcon.style.display = navLinks.classList.contains('active') ? 'none' : 'block';
        closeMenuIcon.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
    };
});