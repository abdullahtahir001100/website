document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://backend-web-1.vercel.app/api/products'; // Updated to match likely Vercel URL or user provided one

    // DOM Elements for cart state management
    const emptyCartSection = document.getElementById('emptyCart');
    const fullCartContent = document.getElementById('fullCartContent');
    const mainhead = document.getElementById('cardHead');
    const cartContainer = document.getElementById("cart-items");
    const cartCountElement = document.getElementById('cart-count');

    // DOM Elements for totals
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartFinalTotal'); // Added for total row

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let productLookup = {}; // To store fetched product details globally

    // Helper to format price
    function formatPrice(price) {
        const numPrice = parseFloat(price);
        if (!isNaN(numPrice)) {
            return `$${numPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        }
        return '$0';
    }

    /**
     * Calculates and updates the Cart Subtotal.
     * @param {number} currentSubTotal - The pre-calculated subtotal amount.
     */
    function calculateTotals(currentSubTotal) {
        // Update Subtotal display
        if (subtotalEl) subtotalEl.textContent = formatPrice(currentSubTotal);
        if (totalEl) totalEl.textContent = formatPrice(currentSubTotal); // Assuming free shipping for now
    }

    // --- 1. Fetch Product Details and Render Cart ---
    async function loadAndRenderCart() {
        // Update Count immediately
        if (cartCountElement) {
            const totalCount = cart.reduce((acc, item) => acc + (parseInt(item.qty)||1), 0);
            cartCountElement.textContent = totalCount;
        }

        if (cart.length === 0) {
            // Display empty cart state
            if (emptyCartSection) {
                emptyCartSection.style.display = 'block';
                
                // --- INSERTING EMPTY CART MESSAGE AND LINK HERE ---
                emptyCartSection.innerHTML = `
                    <div style="text-align: center; padding: 50px;">
                        <h2 class="playfair" style="font-size: 2rem; margin-bottom: 20px; color: #fff;">Your Collection is Empty</h2>
                        <p style="margin-bottom: 30px; color: #888;">The archive awaits your selection.</p>
                        <a href="index.html" style="background-color: #fff; color: #000; padding: 15px 30px; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; display: inline-block; font-weight: 700;">
                            View Works
                        </a>
                    </div>
                `;
            }
            if (mainhead) mainhead.style.display = 'none';
            if (fullCartContent) fullCartContent.style.display = 'none';
            
            // Refresh Loco Scroll
            setTimeout(() => window.locoScroll && window.locoScroll.update(), 100);
            return;
        }

        try {
            // Display full cart content containers
            if (emptyCartSection) emptyCartSection.style.display = 'none';
            if (fullCartContent) fullCartContent.style.display = 'flex';
            if (mainhead) mainhead.style.display = 'flex';

            // Fetch all products to get details
            const response = await fetch(API_URL);
            
            // Handle API error or map raw data
            let rawProducts = [];
            if (!response.ok) {
                console.warn('API call failed. Using fallback data.');
                // Fallback mock data matching detail.js structure
                 rawProducts = [
                    { "_id": "6659c4701e91307af047545e", "title": "Ascension of Light", "price": 450.00, "mainImage": "https://placehold.co/100x120/222/fff?text=Art" },
                    { "_id": "6659c4701e91307af047545f", "title": "Geometric Void", "price": 280.00, "mainImage": "https://placehold.co/100x120/222/fff?text=Void" },
                ];
            } else {
                rawProducts = await response.json();
            }

            processCartData(rawProducts);

        } catch (error) {
            console.error('Error loading cart data:', error);
            if (cartContainer) cartContainer.innerHTML = '<div style="color:red; text-align:center; padding: 20px;">Unable to load artwork details.</div>';
        }
    }

    function processCartData(rawProducts) {
        // Map products
        productLookup = {};
        rawProducts.forEach(product => {
            // Support both _id and id
            const pid = String(product._id || product.id);
            productLookup[pid] = {
                title: product.title || 'Untitled',
                image: product.mainImage || product.image || 'https://placehold.co/100x120/cccccc/333333?text=Art',
                price: parseFloat(product.price) || 0,
            };
        });

        let combinedCartHtml = '';
        let subTotal = 0; 
        let itemCount = 0;

        // 2. Combine Local Cart Data with Fetched API Data
        cart.forEach((item, index) => {
            const productDetails = productLookup[String(item.id)];

            // If product API fails to return the item in cart, we use what we have in localStorage if possible, or skip
            const displayTitle = productDetails?.title || item.title || "Unknown Artwork";
            const displayImage = productDetails?.image || item.image || "https://placehold.co/100x120/333/fff?text=N/A";
            const displayPrice = productDetails?.price || parseFloat(item.price) || 0;

            const itemSubtotal = displayPrice * item.qty; 
            subTotal += itemSubtotal;
            itemCount += item.qty;

            // Using FontAwesome for remove icon instead of image for reliability
            combinedCartHtml += `
                <div class="cart-product-item" data-index="${index}">
                    
                    <div class="product-details-group">
                        <img src="${displayImage}" alt="${displayTitle}" class="product-image">
                        
                        <div class="product-info">
                            <div class="product-name">${displayTitle}</div>
                            <p style="color: #666; font-size: 0.8rem;">${item.option || 'Standard'}</p>
                            <div class="product-price-inline">${formatPrice(displayPrice)}</div>
                        </div>
                    </div>

                    <div class="qty-column">
                        <div class="quantity-control">
                            <button class="qty-minus qty-btn" data-index="${index}">−</button>
                            <input type="number" value="${item.qty}" min="1" max="5" class="quantity-input" data-index="${index}" readonly> 
                            <button class="qty-plus qty-btn" data-index="${index}">+</button>
                        </div>
                    </div>
                    
                    <div class="total-column">
                        ${formatPrice(itemSubtotal)}
                        <i class="fas fa-trash remove-btn" data-index="${index}" style="margin-left: 20px;"></i>
                    </div>
                </div> 
            `;
        });

        // 3. Render
        if (cartContainer) cartContainer.innerHTML = combinedCartHtml;
        if (cartCountElement) cartCountElement.textContent = itemCount;

        // 4. Calculate
        calculateTotals(subTotal);

        // 5. Listeners
        setupListeners();

        // 6. Refresh Scroll Height
        setTimeout(() => window.locoScroll && window.locoScroll.update(), 200);
    }

    function updateCart(newCart) {
        localStorage.setItem("cart", JSON.stringify(newCart));
        // We can re-render instead of reload for smoother UX
        cart = newCart;
        loadAndRenderCart(); 
        // Or confirm via reload if preferred: location.reload();
    }

    function setupListeners() {
        // 1. Remove
        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                const indexToRemove = parseInt(e.target.getAttribute('data-index'));
                if (indexToRemove >= 0 && indexToRemove < cart.length) {
                    cart.splice(indexToRemove, 1);
                    updateCart(cart);
                }
            });
        });

        // 2. Quantity
        document.querySelectorAll(".qty-plus").forEach(button => {
            button.addEventListener("click", (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                if (cart[idx] && cart[idx].qty < 10) {
                    cart[idx].qty++;
                    updateCart(cart);
                }
            });
        });

        document.querySelectorAll(".qty-minus").forEach(button => {
            button.addEventListener("click", (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                if (cart[idx]) {
                    if (cart[idx].qty > 1) {
                        cart[idx].qty--;
                        updateCart(cart);
                    } else {
                        // Optional: Remove if < 1? For now just stay at 1
                    }
                }
            });
        });
    }

    // Toggle Nav for this page too if needed
    // (Handled by the script in html usually, but here for safety)
    
    loadAndRenderCart();

    // Checkout Button Listener
    const checkoutBtn = document.querySelector('.checkout-btn');
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            window.location.href = 'paymant.html';
        });
    }

});
