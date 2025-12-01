 // ----------------------------------------------------------------------------------
    // --- API & HELPER FUNCTIONS ---
    // ----------------------------------------------------------------------------------
    const API_BASE_URL = 'https://backend-web-1.vercel.app/api'; 
    
    /**
     * Cleans a string by removing non-numeric characters (except period and minus sign)
     * and converts it to a float. Returns 0 if parsing fails.
     */
    const cleanAndParse = (text) => {
        const cleaned = String(text).replace(/[^0-9.-]/g, ''); 
        return parseFloat(cleaned) || 0; 
    };

    /**
     * Shows a custom message box with an optional action (like 'reload') on OK click.
     */
    function showMessageBox(message, type = 'default', onOkAction = null) {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; justify-content: center; 
            align-items: center; z-index: 1000;
        `;
        const box = document.createElement('div');
        let color = '#333';
        if (type === 'success') color = 'var(--color-success)';
        if (type === 'error') color = 'var(--color-error)';
        if (type === 'warning') color = 'var(--color-warning)';
        box.style.cssText = `
            background: white;
            padding: 25px; border-radius: 8px; max-width: 400px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3); text-align: center;
            border-top: 5px solid ${color};
        `;
        
        let okButtonAction = `this.parentNode.parentNode.remove()`; // Default: just close
        
        // 🚨 NEW LOGIC: Refresh page on successful order to trigger 404 redirect
        if (onOkAction === 'reload') {
            okButtonAction = `this.parentNode.parentNode.remove(); window.location.reload();`;
        }

        box.innerHTML = `
            <p style="font-size: 1.1rem; margin-bottom: 20px;">${message}</p>
            <button onclick="${okButtonAction}" style="
                background-color: ${color}; color: white; padding: 10px 20px; 
                border: none; border-radius: 4px; cursor: pointer; font-weight: 500;
            ">OK</button>
        `;
        container.appendChild(box);
        document.body.appendChild(container);
    }

    // ----------------------------------------------------------------------------------
    // --- GLOBAL STATE & CONFIGURATION ---
    // ----------------------------------------------------------------------------------
    const LOCAL_CART = JSON.parse(localStorage.getItem("cart")) || [];
    let PRODUCTS = []; 
    let BASE_SUBTOTAL = 0;
    const BASE_SHIPPING = 250;
    
    // ----------------------------------------------------------------------------------
    // --- FETCH & MERGE PRODUCT DATA ---
    // ----------------------------------------------------------------------------------

    /**
     * Fetches product details from API and merges with local cart data (IDs, QTYs).
     */
    async function getMergedProducts() {
        if (LOCAL_CART.length === 0) {
            return [];
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawProducts = await response.json();
            
            const productLookup = {};
            rawProducts.forEach(product => {
                productLookup[String(product._id)] = {
                    title: product.title || 'Untitled',
                    image: product.mainImage || 'images/placeholder.png',
                    price: product.price,
                };
            });
            
            const mergedProducts = LOCAL_CART.map(item => {
                const details = productLookup[item.id];
                if (!details) {
                    console.warn(`Details for product ID ${item.id} not found in API.`);
                    return null;
                }

                const itemPriceValue = cleanAndParse(details.price || 0);
                
                // Calculate subtotal for the entire cart based on merged data
                BASE_SUBTOTAL += itemPriceValue * item.qty; 

                return {
                    id: item.id,
                    title: details.title,
                    image: details.image,
                    price: details.price,
                    qty: item.qty,
                    selectVal: item.option || 'Standard',
                    cleanPrice: itemPriceValue // Price used for calculation
                };
            }).filter(p => p !== null);

            return mergedProducts;

        } catch (error) {
            console.error('Error fetching product details for payment page:', error);
            const container = document.getElementById('product-list-container');
            if(container) container.innerHTML = '<p style="text-align: center; color: var(--color-error); padding: 10px;">Error loading products. Check API.</p>';
            return [];
        }
    }
    
    // ----------------------------------------------------------------------------------
    // --- PRODUCT LIST RENDERING ---
    // ----------------------------------------------------------------------------------

    async function renderProductList() { 
        // 🚨 Empty Cart Check: Redirects to 404 if no items in Local Storage
        if (LOCAL_CART.length === 0) {
            console.warn("Cart is empty. Redirecting to 404 page.");
            window.location.href = 'errors/backtohome.html';
            return; 
        }

        const container = document.getElementById('product-list-container');
        container.style.height = '4em';
        container.style.overflowY = 'scroll';
        BASE_SUBTOTAL = 0; 
        PRODUCTS = await getMergedProducts(); 

        let content = '';
        
        if (PRODUCTS.length === 0) {
            content = '<p style="text-align: center; color: var(--color-light-text); padding: 10px;">Your cart is empty. Please add items to proceed.</p>';
            document.getElementById('final-pay-button').disabled = true; 
        } else {
            PRODUCTS.forEach(product => {
                const totalProductPrice = product.cleanPrice * product.qty; 

                content += `
                    <div class="product-item">
                        <div class="product-item-details">
                            <img src="${product.image || 'https://placehold.co/40x40/ccc/fff?text=No+Img'}" alt="${product.title}" onerror="this.onerror=null; this.src='https://placehold.co/40x40/ccc/fff?text=No+Img';">
                            <div>
                                <span class="product-name">${product.title} (x${product.qty})</span>
                                <span class="product-variant">${product.selectVal || 'N/A'}</span> 
                            </div>
                        </div>
                        <span class="product-price">PKR ${totalProductPrice.toLocaleString()}</span>
                    </div>
                `;
            });
            document.getElementById('final-pay-button').disabled = !document.getElementById('terms-checkbox').checked;
        }

        container.innerHTML = content;
        document.getElementById('item-count').textContent = PRODUCTS.reduce((sum, p) => sum + p.qty, 0);
        document.getElementById('subtotal-amount').textContent = `PKR ${BASE_SUBTOTAL.toLocaleString()}`;

        // 2. Update totals based on the new subtotal
        applyPromoCode(); 
    }

    // ----------------------------------------------------------------------------------
    // --- GLOBAL FORM VALIDATION & SUBMISSION ---
    // ----------------------------------------------------------------------------------
    
    function toggleSubmitButton() {
        const checkbox = document.getElementById('terms-checkbox');
        const submitButton = document.getElementById('final-pay-button');
        submitButton.disabled = !checkbox.checked || PRODUCTS.length === 0;
    }

    async function validateAndSubmit(event) {
        event.preventDefault(); 

        // 1. Pre-validation checks
        if (PRODUCTS.length === 0) {
             showMessageBox("Your cart is empty. Cannot submit order.", 'error');
             return false;
        }
        if (!document.getElementById('terms-checkbox').checked) {
            showMessageBox("Please agree to the Terms of Service and Privacy Policy to proceed.", 'error');
            return false;
        }

        // 2. Validate Phone Number 
        const phoneInput = document.getElementById('phone');
        const phoneValue = phoneInput.value.trim();
        if (phoneValue.length !== 10 || !/^\d{10}$/.test(phoneValue)) {
            showMessageBox("Please enter a valid 10-digit phone number (excluding the '+92' prefix).", 'error');
            phoneInput.focus();
            return false;
        }
        
        // 3. Location Check
        if (!selectedLat || !selectedLng) {
             showMessageBox("Please select your delivery location on the map.", 'error');
             map.setView([initialLat, initialLng], 13);
             return false;
        }

        // 4. Validate Payment Details 
        const selectedMethod = document.querySelector('input[name="payment_method"]:checked').value;
        if (selectedMethod === 'card') {
            const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
            const expiry = document.getElementById('expiry').value;
            const cvv = document.getElementById('cvv').value;
            // ... (Card validation logic remains the same) ...
            if (cardNumber.length !== 16) { showMessageBox("Please enter a complete 16-digit Card Number.", 'error'); document.getElementById('card-number').focus(); return false; }
            if (!/^\d{2}\/\d{2}$/.test(expiry)) { showMessageBox("Please enter a valid Expiry Date in MM/YY format.", 'error'); document.getElementById('expiry').focus(); return false; }
            if (cvv.length !== 3) { showMessageBox("Please enter a valid 3-digit CVV.", 'error'); document.getElementById('cvv').focus(); return false; }
        } else if (selectedMethod === 'easypaisa') {
            const mobileNo = document.getElementById('mobile-no').value.trim();
            // ... (Mobile wallet validation logic remains the same) ...
            if (mobileNo.length !== 11 || !/^\d{11}$/.test(mobileNo)) { showMessageBox("Please enter a valid 11-digit EasyPaisa/JazzCash Mobile Account Number.", 'error'); document.getElementById('mobile-no').focus(); return false; }
        }
        
        // --- Collect Data for Backend ---
        const shippingAmountText = document.getElementById('shipping-amount').textContent;
        const shippingFee = shippingAmountText.includes('FREE') ? 0 : BASE_SHIPPING;
        const customerPhoneFormatted = `+92${phoneValue}`; 
        
        const orderPayload = {
            customerName: document.getElementById('name').value,
            customerPhone: customerPhoneFormatted, 
            customerEmail: document.getElementById('email').value,
            shippingAddress: {
                streetAddress: document.getElementById('full-address').value,
                city: document.getElementById('city').value,
                province: document.getElementById('province').value,
                country: 'Pakistan',
                zipCode: 'N/A'
            },
            geoLocation: { latitude: selectedLat, longitude: selectedLng },
            notes: document.getElementById('notes').value,
            items: PRODUCTS.map(p => ({
                productId: p.id,
                productName: p.title,
                variant: p.selectVal || 'Standard',
                quantity: p.qty,
                price: p.cleanPrice,
                imageUrl: p.image 
            })),
            subtotalAmount: cleanAndParse(document.getElementById('subtotal-amount').textContent),
            shippingFee: parseFloat(shippingFee), 
            discountCode: document.getElementById('promo-code-input').value.trim().toUpperCase(),
            discountAmount: cleanAndParse(document.getElementById('discount-amount').textContent),
            totalAmount: cleanAndParse(document.getElementById('total-payable').textContent),
            paymentMethod: selectedMethod,
        };
        
        console.log("--- Sending Order Payload to Backend ---", orderPayload);

        // 5. API Call
        const payButton = document.getElementById('final-pay-button');
        payButton.disabled = true;

        fetch(`${API_BASE_URL}/orders`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        })
        .then(async response => {
            payButton.disabled = false;
            
            if (!response.ok) {
                const errorText = await response.text(); 
                console.error('Server Error Detail:', errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || `Server responded with status ${response.status}`);
                } catch {
                    throw new Error(`Server Error (${response.status}): ${errorText.substring(0, 100)}...`);
                }
            }
            
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Clear the cart on successful submission
                localStorage.removeItem("cart");
                
                // 🚨 SUCCESS ACTION: Show success message and trigger page reload on OK click
                showMessageBox(`✅ Order placed successfully! Order ID: ${data.data._id}`, 'success', 'reload');
                
            } else {
                showMessageBox(`❌ Order failed: ${data.message}`, 'error');
            }
        })
        .catch(error => {
            payButton.disabled = false;
            console.error('Submission Error:', error);
            showMessageBox(`❌ Order Submission Failed: ${error.message || 'Check your console/network tab for details.'}`, 'error');
        });

        return true;
    }

    // ----------------------------------------------------------------------------------
    // --- MAP INTEGRATION AND LOCATION LOGIC (UNCHANGED) ---
    // ----------------------------------------------------------------------------------
    let map;
    let marker;
    const initialLat = 31.5497; 
    const initialLng = 74.3436;
    let selectedLat = initialLat;
    let selectedLng = initialLng;

    function initializeMap() {
         try {
             map = L.map('map-display').setView([initialLat, initialLng], 13);
             L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                 attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
             }).addTo(map);
             marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);

             map.on('click', (e) => updateLocation(e.latlng.lat, e.latlng.lng, true));
             marker.on('dragend', (e) => {
                 const latlng = marker.getLatLng();
                 updateLocation(latlng.lat, latlng.lng, true);
             });
             const searchBtn = document.getElementById('search-location-btn');
             const searchInput = document.getElementById('address-search-input');
             if (searchBtn) searchBtn.addEventListener('click', searchAddress);
             if (searchInput) searchInput.addEventListener('keypress', (e) => {
                 if (e.key === 'Enter') {
                     e.preventDefault(); 
                     searchAddress();
                 }
             });
             reverseGeocode(initialLat, initialLng);
         } catch (error) {
             const mapDiv = document.getElementById('map-display');
             if (mapDiv) {
                 mapDiv.innerHTML = '<p style="text-align: center; color: var(--color-error); padding: 50px;">Map failed to load. Please check your network connection.</p>';
             }
             console.error("Map Initialization Error:", error);
         }
    }

    function updateLocation(lat, lng, shouldReverseGeocode = false) {
        selectedLat = lat;
        selectedLng = lng;
        
        if (map) {
            map.setView([lat, lng], map.getZoom() > 14 ? map.getZoom() : 14);
        }
        if (marker) {
            marker.setLatLng([lat, lng]);
        }
        if (shouldReverseGeocode) {
            reverseGeocode(lat, lng);
        }
    }

    async function reverseGeocode(lat, lng) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data && data.address) {
                const address = data.address;
                const streetAddress = `${address.building || address.house_number || ''} ${address.road || address.neighbourhood || ''}`.trim();
                const city = address.city || address.town || address.village || address.county || '';
                const state = address.state || '';
                
                document.getElementById('address-search-input').value = data.display_name || 'Location Selected';
                document.getElementById('full-address').value = streetAddress; 
                document.getElementById('city').value = city; 
                document.getElementById('province').value = state;
            }
        } catch (error) {
            console.error('Reverse Geocoding Error:', error);
        }
    }

    async function searchAddress() {
        const query = document.getElementById('address-search-input').value.trim();
        if (!query) { showMessageBox('Please enter an address to search.', 'warning'); return; }

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        try {
            const response = await fetch(url);
            const results = await response.json();

            if (results.length > 0) {
                const result = results[0];
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);
                
                updateLocation(lat, lon, true);
                showMessageBox(`Search successful. Location moved to: ${result.display_name}`, 'success');
            } else {
                showMessageBox(`No results found for "${query}". Try a different search term.`, 'error');
            }
        } catch (error) {
            console.error('Forward Geocoding Error:', error);
            showMessageBox('Could not connect to search service.', 'error');
        }
    }
    
    // ----------------------------------------------------------------------------------
    // --- INPUT FORMATTING AND VALIDATION HELPERS (UNCHANGED) ---
    // ----------------------------------------------------------------------------------

    function formatCardNumber(input) {
        let value = input.value.replace(/\D/g, ''); 
        value = value.substring(0, 16); 
        let formatted = value.match(/.{1,4}/g)?.join(' ') || '';
        input.value = formatted;
    }

    function formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, ''); 
        value = value.substring(0, 4); 
        
        if (value.length >= 3) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        input.value = value;
    }

    function validateCVV(input) {
        let value = input.value.replace(/\D/g, ''); 
        value = value.substring(0, 3); 
        input.value = value;
    }

    function validateMobileWallet(input) {
        let value = input.value.replace(/\D/g, ''); 
        value = value.substring(0, 11); 
        input.value = value;
    }

    // ----------------------------------------------------------------------------------
    // --- PROMO CODE AND PAYMENT UI LOGIC (UNCHANGED) ---
    // ----------------------------------------------------------------------------------
    
    function updatePromoMessage(messageText, type) {
        const message = document.getElementById('promo-message');
        message.textContent = messageText;
        message.className = 'promo-message-style'; 
        if (type === 'success') {
            message.classList.add('promo-message-success');
        } else if (type === 'error') {
            message.classList.add('promo-message-error');
        } else {
             message.classList.add('promo-message-default');
        }
    }

    function togglePromoCode(event) {
        event.preventDefault();
        const area = document.getElementById('promo-code-area');
        area.style.display = area.style.display === 'block' ? 'none' : 'block';
        if (area.style.display === 'block') { 
            document.getElementById('promo-code-input').focus();
        }
    }

    function applyPromoCode() {
        const input = document.getElementById('promo-code-input').value.trim().toUpperCase();
        const discountAmountElement = document.getElementById('discount-amount');
        const shippingAmountElement = document.getElementById('shipping-amount');
        
        let currentSubtotal = BASE_SUBTOTAL;

        let flatDiscount = 0;
        let finalShipping = BASE_SHIPPING;
        let totalDisplayDiscount = 0;

        if (input === 'SAVE1000' && currentSubtotal > 1000) {
            flatDiscount = 1000;
            totalDisplayDiscount = flatDiscount;
            updatePromoMessage('✅ Success! PKR 1,000 discount applied!', 'success');
        } else if (input === 'FREESHIP') {
            finalShipping = 0;
            totalDisplayDiscount = BASE_SHIPPING;
            updatePromoMessage('✅ Success! Free Shipping applied!', 'success');
        } else if (input !== '') {
            finalShipping = BASE_SHIPPING;
            updatePromoMessage('❌ Invalid promo code or minimum spend not met.', 'error');
        } else {
            finalShipping = BASE_SHIPPING;
            updatePromoMessage('', 'default');
        }

        const finalTotal = currentSubtotal + finalShipping - flatDiscount;
        shippingAmountElement.textContent = finalShipping === 0 ? 'FREE' : `PKR ${finalShipping.toLocaleString()}`;
        shippingAmountElement.style.color = finalShipping === 0 ? 'var(--color-success)' : 'var(--color-text)';
        
        discountAmountElement.textContent = `-PKR ${totalDisplayDiscount.toLocaleString()}`;
        discountAmountElement.style.color = totalDisplayDiscount > 0 ? 'var(--color-success)' : 'blue';
        
        document.getElementById('total-payable').textContent = `PKR ${finalTotal.toLocaleString()}`;
        document.getElementById('final-pay-button').textContent = `Complete Order & Pay PKR ${finalTotal.toLocaleString()}`;
        
        const selectedMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'cod';
        showPaymentDetails(selectedMethod);
    }

    function showPaymentDetails(method) {
        const detailsDiv = document.getElementById('payment-details');
        let content = '';
        const currentTotal = document.getElementById('total-payable').textContent;

        if (method === 'card') {
            content = `
                <p class="payment-info-text">Please enter your card details below to complete the secure payment.</p>
                <div class="form-group" style="margin-top: 15px;">
                    <label for="card-number">Card Number</label>
                    <input type="text" id="card-number" placeholder="XXXX XXXX XXXX XXXX" required maxlength="19" oninput="formatCardNumber(this)">
                </div>
                <div class="flex-row-gap-10">
                    <div class="form-group flex-2-col">
                        <label for="expiry">Expiry (MM/YY)</label>
                        <input type="text" id="expiry" placeholder="MM/YY" required maxlength="5" oninput="formatExpiryDate(this)">
                    </div>
                    <div class="form-group flex-1-col">
                        <label for="cvv">CVV</label>
                        <input type="text" id="cvv" placeholder="XXX" required maxlength="3" oninput="validateCVV(this)">
                    </div>
                </div>
            `;
        } else if (method === 'easypaisa') {
            content = `
                <p class="payment-highlight-text">Complete your payment through EasyPaisa or JazzCash Mobile App.</p>
                <div class="form-group" style="margin-top: 15px;">
                    <label for="mobile-no">Mobile Account Number (11 digits)</label>
                    <input type="tel" id="mobile-no" placeholder="03XXXXXXXXX" required maxlength="11" oninput="validateMobileWallet(this)">
                </div>
                <p class="payment-warning-text">You will receive a one-time password (OTP) on your mobile number to confirm the transaction.</p>
            `;
        } else if (method === 'cod') {
            content = `
                <p class="cod-highlight">You have selected Cash on Delivery.</p>
                <p class="payment-info-text">
                    Please ensure you have the exact amount ready (<span id="cod-amount" style="font-weight: 700;">${currentTotal}</span>) when the delivery rider arrives.
                </p>
            `;
        } else if (method === 'bank') {
            content = `
                <p class="payment-highlight-text">Transfer the total amount to the account below (requires manual confirmation).</p>
                <div class="bank-details-box">
                    <p style="font-weight: 700;">Bank Name: Faysal Bank</p>
                    <p>IBAN: PKXXFABLXXXXXXXXXXXX</p>
                    <p>Account Title: Art Dashboard Pvt Ltd</p>
                    <p class="payment-warning-text" style="margin-top: 10px;">Note: Your order will be processed after payment confirmation.</p>
                </div>
            `;
        }
        
        detailsDiv.innerHTML = content;
        document.querySelectorAll('.payment-option').forEach(option => {
            option.classList.remove('is-checked');
        });
        const radio = document.querySelector('input[name="payment_method"][value="' + method + '"]');
        if (radio) {
            radio.parentElement.classList.add('is-checked');
        }
    }
    
    // ----------------------------------------------------------------------------------
    // --- INITIALIZATION ---
    // ----------------------------------------------------------------------------------
    
    document.addEventListener('DOMContentLoaded', () => {
        // 1. Initial product render (includes 404 check)
        renderProductList().then(() => { 
            // This code only runs if the cart was NOT empty
            initializeMap();
            toggleSubmitButton(); 
            
            const initialPaymentMethod = document.querySelector('input[name="payment_method"]:checked') 
                                            ? document.querySelector('input[name="payment_method"]:checked').value 
                                            : 'card';
            showPaymentDetails(initialPaymentMethod);
        });

        // 2. Event Listeners
        const form = document.getElementById('checkout-form'); 
        if (form) {
            form.addEventListener('submit', validateAndSubmit);
        } else {
            document.getElementById('final-pay-button').addEventListener('click', validateAndSubmit);
        }
        
        document.getElementById('terms-checkbox')?.addEventListener('change', toggleSubmitButton);
        document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
            radio.addEventListener('change', (e) => showPaymentDetails(e.target.value));
        });
        document.getElementById('apply-promo-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            applyPromoCode();
        });
        document.getElementById('promo-code-input')?.addEventListener('keypress', (e) => {
             if (e.key === 'Enter') {
                 e.preventDefault();
                 applyPromoCode();
             }
        });
    });