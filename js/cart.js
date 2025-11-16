document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://backend-web-1.vercel.app/api/products'; 

    // DOM Elements for cart state management
    const emptyCartSection = document.getElementById('emptyCart');
    const fullCartContent = document.getElementById('fullCartContent');
    const cartSummarySection = document.getElementById('cartSummary');
    const mainhead = document.getElementById('cardHead');
    const cartContainer = document.getElementById("cart-items");
    const cartCountElement = document.getElementById('cart-count'); 
    
    // DOM Elements for totals
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    const shippingFeeEl = document.getElementById('shippingFee'); // Element to read shipping fee from HTML

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let productLookup = {}; // To store fetched product details globally

    // Helper to format price (ensures "Rs" is added and numbers are clean)
    function formatPrice(price) {
        // Ensure price is a number before formatting
        const numPrice = parseFloat(price);
        if (!isNaN(numPrice)) {
            // Using toLocaleString for clean comma separation
            return `${numPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Rs`;
        }
        return '0 Rs';
    }
    
    // Helper to clean price string (e.g., "2,500 Rs" -> 2500)
    function parsePrice(priceString) {
        // Removes "Rs", commas, and trims whitespace, then converts to float
        return parseFloat(priceString.replace('Rs', '').replace(/[$,]/g, '').trim()) || 0;
    }

    /**
     * Calculates and updates the Cart Subtotal and Grand Total.
     * @param {number} currentSubTotal - The pre-calculated subtotal amount.
     */
    function calculateTotals(currentSubTotal) {
        // Read shipping fee from the HTML element's text content
        const shippingFeeText = shippingFeeEl ? shippingFeeEl.textContent : '250 Rs'; 
        const shippingFee = parsePrice(shippingFeeText); // Convert to number (should be 250)
        
        const grandTotal = currentSubTotal + shippingFee;

        // Update display
        if (subtotalEl) subtotalEl.textContent = formatPrice(currentSubTotal);
        if (totalEl) totalEl.textContent = formatPrice(grandTotal);
    }

    // --- 1. Fetch Product Details and Render Cart ---
    async function loadAndRenderCart() {
        if (cart.length === 0) {
            // Display empty cart state
            if (emptyCartSection) emptyCartSection.style.display = 'block';
            if (mainhead) mainhead.style.display = 'none';
            if (fullCartContent) fullCartContent.style.display = 'none';
            if (cartSummarySection) cartSummarySection.style.display = 'none';
            if (cartCountElement) cartCountElement.textContent = '0';
            return;
        }

        try {
            // Display full cart content containers
            if (emptyCartSection) emptyCartSection.style.display = 'none';
            if (fullCartContent) fullCartContent.style.display = 'block';
            if (mainhead) mainhead.style.display = 'block';
            if (cartSummarySection) cartSummarySection.style.display = 'block';

            // Fetch all products to get details (title, image, price)
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawProducts = await response.json();

            // Map products to an easy lookup dictionary using the unique ID
            productLookup = {};
            rawProducts.forEach(product => {
                productLookup[String(product._id)] = {
                    title: product.title || 'Untitled',
                    image: product.mainImage || 'images/placeholder.png',
                    // IMPORTANT: Ensure the price stored here is a NUMBER
                    price: parseFloat(product.price) || 0, 
                    formattedPrice: formatPrice(parseFloat(product.price) || 0),
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

                combinedCartHtml += `
                    <tr class="cart-product-row" data-id="${item.id}" data-option="${item.option}" data-index="${index}">
                        <td><img src="${productDetails.image}" alt="${productDetails.title}" class="product-image"></td>
                        <td class="product-name">${productDetails.title}</td>
                        <td class="product-option">${item.option}</td>
                        <td>
                             <input type="number" value="${item.qty}" min="1" class="quantity-input" max="5" readonly> 
                        </td>
                        <td class="product-price">${productDetails.formattedPrice}</td>
                        <td class="product-subtotal">${formatPrice(itemSubtotal)}</td>
                        <td class="remove-cell">
                            <img src="images/close.png" class="remove-btn" data-index="${index}" alt="Remove">
                        </td>
                    </tr> 
                `;
            });

            // 3. Render the full cart content and update item count
            if (cartContainer) cartContainer.innerHTML = combinedCartHtml;
            if (cartCountElement) cartCountElement.textContent = totalItems;
            
            // 4. Calculate and Update Totals
            calculateTotals(subTotal); 
            
            // 5. Setup Event Listeners for Removal
            setupRemoveListeners();

        } catch (error) {
            console.error('Error loading cart data:', error);
            if (cartContainer) cartContainer.innerHTML = '<tr><td colspan="7" style="color:red; text-align:center;">Error loading products. Check API connection.</td></tr>';
        }
    }
    
    // --- 2. Setup Remove Button Listeners ---
    function setupRemoveListeners() {
        const removeButtons = document.querySelectorAll(".remove-btn");

        removeButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const indexToRemove = parseInt(e.target.getAttribute('data-index'));
                let currentCart = JSON.parse(localStorage.getItem("cart")) || [];

                if (indexToRemove >= 0 && indexToRemove < currentCart.length) {
                    currentCart.splice(indexToRemove, 1);
                    localStorage.setItem("cart", JSON.stringify(currentCart));
                    // Reload the page to fully re-render and recalculate totals
                    location.reload(); 
                } else {
                    console.error("Attempted to remove item with invalid index.");
                }
            });
        });
    }

    // --- Initialization ---
    loadAndRenderCart();
    
    // --- Mobile Menu Toggle Logic (Assuming this is in dashboadover.js but included for context) ---
    window.toggleNav = function () {
        const navLinks = document.getElementById('nav-links');
        const openMenuIcon = document.getElementById('menu-icon');
        const closeMenuIcon = document.getElementById('close-icon');

        if (!navLinks) return;
        navLinks.classList.toggle('active');
        openMenuIcon.style.display = navLinks.classList.contains('active') ? 'none' : 'block';
        closeMenuIcon.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
    };
});