document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api/products'; 

    // DOM Elements for cart state management
    const emptyCartSection = document.getElementById('emptyCart');
    const fullCartContent = document.getElementById('fullCartContent');
    const cartSummarySection = document.getElementById('cartSummary');
    const mainhead = document.getElementById('cardHead');
    const cartContainer = document.getElementById("cart-items");
    const cartCountElement = document.getElementById('cart-count'); 

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Helper to format price (matches detail.js)
    function formatPrice(price) {
        if (typeof price === 'number') {
            return `$${price.toLocaleString('en-US')}`;
        }
        return String(price || 'Price TBD');
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
            const productLookup = {};
            rawProducts.forEach(product => {
                productLookup[String(product._id)] = {
                    title: product.title || 'Untitled',
                    image: product.mainImage || 'images/placeholder.png',
                    price: product.price,
                    formattedPrice: formatPrice(product.price),
                };
            });

            let combinedCartHtml = '';
            let totalItems = 0;
            let subTotal = 0;

            // 2. Combine Local Cart Data with Fetched API Data
            cart.forEach((item, index) => {
                const productDetails = productLookup[item.id];
                
                if (!productDetails) {
                    console.warn(`Details for product ID ${item.id} not found in API response. Skipping item.`);
                    return; 
                }
                
                const itemPriceValue = productDetails.price || 0;
                const itemSubtotal = itemPriceValue * item.qty;
                subTotal += itemSubtotal;
                totalItems += item.qty;

                combinedCartHtml += `
                    <tr class="cart-product-row" data-id="${item.id}" data-option="${item.option}" data-index="${index}">
                        <td width="16.66%"><img src="${productDetails.image}" alt="${productDetails.title}" class="product-image"></td>
                        <td width="16.66%" class="product-name">${productDetails.title}</td>
                        <td width="16.66%" class="product-option">${item.option}</td>
                        <td width="16.66%">
                             <input type="number" value="${item.qty}" min="1" class="quantity-input" max="5" readonly>
                        </td>
                        <td width="16.66%" class="product-price">${productDetails.formattedPrice}</td>
                        <td width="16.66%" class="product-subtotal">${formatPrice(itemSubtotal)}</td>
                        <td width="16.66%" class="remove-cell">
                            <img src="images/close.png" class="remove-btn" data-index="${index}" alt="Remove">
                        </td>
                    </tr> 
                `;
            });

            // 3. Render the full cart content
            if (cartContainer) cartContainer.innerHTML = combinedCartHtml;

            // Update summary totals (Requires cartSubtotal and cartTotal elements in HTML)
            const subtotalEl = document.getElementById('cartSubtotal');
            const totalEl = document.getElementById('cartTotal');
            
            if (subtotalEl) subtotalEl.textContent = formatPrice(subTotal);
            if (totalEl) totalEl.textContent = formatPrice(subTotal); // Assuming Total = Subtotal + 0 Tax/Shipping for now
            if (cartCountElement) cartCountElement.textContent = totalItems;
            
            // 4. Setup Event Listeners for Removal
            setupRemoveListeners();

        } catch (error) {
            console.error('Error loading cart data:', error);
            // Display a user-friendly error if the fetch fails
            if (cartContainer) cartContainer.innerHTML = '<tr><td colspan="7" style="color:red; text-align:center;">Error loading products. Check API connection.</td></tr>';
        }
    }
    
    // --- 2. Setup Remove Button Listeners ---
    function setupRemoveListeners() {
        const removeButtons = document.querySelectorAll(".remove-btn");

        removeButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                // Get the current index dynamically
                const indexToRemove = parseInt(e.target.getAttribute('data-index'));
                
                // Get the updated cart (important if multiple items were removed before reload)
                let currentCart = JSON.parse(localStorage.getItem("cart")) || [];

                // Re-run the removal logic based on the data-index
                // We must use the original index logic to match your provided code structure
                if (indexToRemove >= 0 && indexToRemove < currentCart.length) {
                    currentCart.splice(indexToRemove, 1);
                    localStorage.setItem("cart", JSON.stringify(currentCart));
                    // Reload is the simplest way to re-render the cart with updated indices
                    location.reload(); 
                } else {
                    console.error("Attempted to remove item with invalid index.");
                }
            });
        });
    }

    // --- Initialization ---
    loadAndRenderCart();
});