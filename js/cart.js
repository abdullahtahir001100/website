document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://backend-web-1-yb6q.vercel.app/api/products';

    // DOM Elements for cart state management
    const emptyCartSection = document.getElementById('emptyCart');
    const fullCartContent = document.getElementById('fullCartContent');
    const mainhead = document.getElementById('cardHead');
    const cartContainer = document.getElementById("cart-items");
    const cartCountElement = document.getElementById('cart-count');

    // DOM Elements for totals
    const subtotalEl = document.getElementById('cartSubtotal');

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let productLookup = {}; // To store fetched product details globally

    // Helper to format price (ensures "Rs" is added and numbers are clean)
    function formatPrice(price) {
        const numPrice = parseFloat(price);
        if (!isNaN(numPrice)) {
            return `${numPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Rs`;
        }
        return '0 Rs';
    }

    /**
     * Calculates and updates the Cart Subtotal.
     * @param {number} currentSubTotal - The pre-calculated subtotal amount.
     */
    function calculateTotals(currentSubTotal) {
        // Update Subtotal display
        if (subtotalEl) subtotalEl.textContent = formatPrice(currentSubTotal) + " $";
    }

    // --- 1. Fetch Product Details and Render Cart ---
    async function loadAndRenderCart() {
        if (cart.length === 0) {
            // Display empty cart state
            if (emptyCartSection) {
                emptyCartSection.style.display = 'block';
                
                // --- INSERTING EMPTY CART MESSAGE AND LINK HERE ---
                emptyCartSection.innerHTML = `
                    <div style="text-align: center; padding: 50px;">
                        <h2 style="font-size: 1.5rem; margin-bottom: 10px;">Your Cart is empty 🛒</h2>
                        <p style="margin-bottom: 20px;">Time to go back to get or buy some items!</p>
                        <a href="index.html" style="background-color: #3b82f6; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
                            Continue Shopping
                        </a>
                    </div>
                `;
                // ---------------------------------------------------
                
                let cartitemscontainer = document.getElementsByClassName('cart-items-container');
                let none = document.getElementById('none');
                
                // Safely hide cart related containers
                if (cartitemscontainer.length > 0) {
                    cartitemscontainer[0].style.display = 'none';
                }
                if (none) {
                    none.style.display = 'none';
                }
            }
            if (mainhead) mainhead.style.display = 'none';
            if (fullCartContent) fullCartContent.style.display = 'none';
            if (cartCountElement) cartCountElement.textContent = '0';
            return;
        }

        try {
            // Display full cart content containers
            if (emptyCartSection) emptyCartSection.style.display = 'none';
            if (fullCartContent) fullCartContent.style.display = 'flex';
            if (mainhead) mainhead.style.display = 'flex';

            // Fetch all products to get details
            const response = await fetch(API_URL);
            if (!response.ok) {
                // Fallback to mock data if API fails
                console.warn('API call failed. Using mock data for cart lookup.');
                const mockData = [
                    { "_id": "6659c4701e91307af047545e", "title": "GLOW & WHITE KOREAN GOLD CREAM", "price": 2000.00, "mainImage": "https://placehold.co/100x100/fecaca/991b1b?text=Cream" },
                    { "_id": "6659c4701e91307af047545f", "title": "Coastal Painting", "price": 280.00, "mainImage": "https://placehold.co/100x100/dbeafe/1e40af?text=Art2" },
                ];
                if (cart.length > 0 && cart.every(item => !productLookup[item.id])) {
                    cart = [{ id: "6659c4701e91307af047545e", qty: 1, option: "Standard" }];
                }
                processCartData(mockData);
                return;
            }
            const rawProducts = await response.json();
            processCartData(rawProducts);
        } catch (error) {
            console.error('Error loading cart data:', error);
            if (cartContainer) cartContainer.innerHTML = '<div class="text-red-500 text-center py-4">Error loading products. Check API connection.</div>';
        }
    }

    function processCartData(rawProducts) {
        // Map products to an easy lookup dictionary using the unique ID
        productLookup = {};
        rawProducts.forEach(product => {
            productLookup[String(product._id)] = {
                title: product.title || 'Untitled',
                image: product.mainImage || 'https://placehold.co/100x100/cccccc/333333?text=Art',
                price: parseFloat(product.price) || 0,
            };
        });

        let combinedCartHtml = '';
        let totalItems = 0;
        let subTotal = 0; // Final numeric subtotal

        // 2. Combine Local Cart Data with Fetched API Data
        cart.forEach((item, index) => {
            const productDetails = productLookup[item.id];

            if (!productDetails) {
                console.warn(`Details for product ID ${item.id} not found. Skipping item.`);
                return;
            }

            const itemPriceValue = productDetails.price; // Numeric Price
            const itemSubtotal = itemPriceValue * item.qty; // Numeric Subtotal
            subTotal += itemSubtotal;
            totalItems += item.qty;

            // Rendering the streamlined cart item structure
            combinedCartHtml += `
                <div class="cart-product-item" data-index="${index}">
                    
                    <div class="product-details-group">
                        <img src="${productDetails.image}" alt="${productDetails.title}" class="product-image" onerror="this.onerror=null;this.src='https://placehold.co/100x100/cccccc/333333?text=Art';">
                        
                        <div class="product-info">
                            <div class="product-name">${productDetails.title}</div>
                            <div class="product-price-inline">${formatPrice(itemPriceValue)}</div>
                        </div>
                    </div>

                    <div class="qty-column  md:flex">
                        <div class="quantity-control">
                            
                            <input type="number" value="${item.qty}" min="1" max="5" class="quantity-input" data-index="${index}" readonly> 
                            <img src="images/delete.png" class="remove-btn" data-index="${index}" alt="Remove Item">
                        </div>
                    </div>
                    
                    <div class="total-column hidden md:block">
                        ${formatPrice(itemSubtotal)}
                         <img src="images/delete.png" class="remove-btn" data-index="${index}" alt="Remove Item">
                    
                    </div>
                    
                    

                </div> 
            `;
        });

        // 3. Render the full cart content and update item count
        if (cartContainer) cartContainer.innerHTML = combinedCartHtml;
        if (cartCountElement) cartCountElement.textContent = totalItems;

        // 4. Calculate and Update Totals
        calculateTotals(subTotal);

        // 5. Setup Event Listeners
        setupListeners();
    }

    // --- 2. Setup All Button Listeners (Remove and Quantity) ---
    function updateCart(newCart) {
        localStorage.setItem("cart", JSON.stringify(newCart));
        // Reload the page to fully re-render and recalculate totals
        location.reload();
    }

    function setupListeners() {
        // 1. Remove Button Listener
        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                const indexToRemove = parseInt(e.target.getAttribute('data-index'));
                let currentCart = JSON.parse(localStorage.getItem("cart")) || [];

                if (indexToRemove >= 0 && indexToRemove < currentCart.length) {
                    currentCart.splice(indexToRemove, 1);
                    updateCart(currentCart);
                } else {
                    console.error("Attempted to remove item with invalid index.");
                }
            });
        });

        // 2. Quantity Change Listeners (Plus/Minus buttons)
        document.querySelectorAll(".qty-plus").forEach(button => {
            button.addEventListener("click", (e) => {
                const indexToUpdate = parseInt(e.target.getAttribute('data-index'));
                let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
                if (indexToUpdate >= 0 && indexToUpdate < currentCart.length) {
                    const item = currentCart[indexToUpdate];
                    if (item.qty < 5) { // Assuming max quantity is 5
                        item.qty++;
                        updateCart(currentCart);
                    }
                }
            });
        });

        document.querySelectorAll(".qty-minus").forEach(button => {
            button.addEventListener("click", (e) => {
                const indexToUpdate = parseInt(e.target.getAttribute('data-index'));
                let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
                if (indexToUpdate >= 0 && indexToUpdate < currentCart.length) {
                    const item = currentCart[indexToUpdate];
                    if (item.qty > 1) {
                        item.qty--;
                        updateCart(currentCart);
                    }
                }
            });
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


    // --- Initialization ---
    loadAndRenderCart();

});
let dbd = document.getElementById('cart-items');
let dd = document.getElementsByClassName('cart-product-item');

// This check relies on elements being loaded and rendered, which happens asynchronously
// inside loadAndRenderCart. It's safer to move this logic *inside* loadAndRenderCart 
// after rendering if you need to style the container based on item count, but 
// for simple direct access on load, keep it here.
// console.log(dd.length); // Removed for cleaner console
if (dd.length <= 3 && dbd) {
    dbd.style.height = '100%';
}