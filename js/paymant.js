document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'https://backend-web-1-yb6q.vercel.app/api'; 
    
    // --- Elements ---
    const savedAddressGrid = document.getElementById('saved-addresses-container');
    const toggleNewAddrBtn = document.getElementById('toggle-new-address');
    const newAddrForm = document.getElementById('new-address-form');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const orderItemsPreview = document.getElementById('order-items-preview');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');

    // --- State ---
    let savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];
    let localCart = JSON.parse(localStorage.getItem('cart')) || [];
    let selectedAddressIndex = null;
    let fetchedProducts = [];
    let orderSubtotal = 0;

    // --- Helpers ---
    function cleanPrice(p) {
        const s = String(p).replace(/[^0-9.-]/g, '');
        return parseFloat(s) || 0;
    }

    function formatPrice(p) {
        return `$${cleanPrice(p).toLocaleString()}`;
    }

    // --- 1. Init ---
    async function initCheckout() {
        if (localCart.length === 0) {
            alert("Your cart is empty.");
            window.location.href = 'l.html';
            return;
        }

        // Show loading state
        if(orderItemsPreview) orderItemsPreview.innerHTML = '<div style="color:#666; padding:20px; text-align:center;">Loading latest prices...</div>';

        try {
            // Fetch product details from backend
            await fetchAndMergeProducts();
            renderOrderSummary();
        } catch (error) {
            console.error("Error fetching products:", error);
            if(orderItemsPreview) orderItemsPreview.innerHTML = '<div style="color:red;">Failed to load product details from server. Using local data.</div>';
            // Fallback render
            renderOrderSummary();
        }

        renderAddresses();

        // Auto-select address if exists
        if (savedAddresses.length > 0) {
            selectAddress(0);
        } else {
            if(newAddrForm) {
                newAddrForm.classList.add('active');
                gsap.fromTo(newAddrForm, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' });
            }
            if(toggleNewAddrBtn) toggleNewAddrBtn.style.display = 'none';
        }
    }

    // --- 2. Fetch & Merge Logic ---
    async function fetchAndMergeProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const allProducts = await response.json();
            const productLookup = {};
            
            allProducts.forEach(p => {
                // Handle both _id and id
                const id = p._id || p.id;
                productLookup[String(id)] = p;
            });

            fetchedProducts = localCart.map(item => {
                const backendProduct = productLookup[String(item.id)];
                
                if (!backendProduct) {
                    console.warn(`Product ${item.id} not found in backend.`);
                    // Return local data as fallback
                    return {
                        id: item.id,
                        qty: item.qty,
                        title: item.title,
                        price: parseFloat(item.price) || 0,
                        image: item.image,
                        option: item.option || 'Standard'
                    };
                }

                return {
                    id: item.id,
                    qty: item.qty,
                    title: backendProduct.title,
                    price: cleanPrice(backendProduct.price),
                    image: backendProduct.mainImage || backendProduct.image || item.image,
                    option: item.option || 'Standard'
                };
            }).filter(p => p !== null);

        } catch (error) {
            console.error("Fetching error", error);
            // Fallback to local data if API fails completely
            fetchedProducts = localCart.map(item => ({
                id: item.id,
                qty: item.qty,
                title: item.title,
                price: cleanPrice(item.price) || 0,
                image: item.image,
                option: item.option || 'Standard'
            }));
        }
    }

    // --- 3. Render Order Summary ---
    function renderOrderSummary() {
        if (!orderItemsPreview) return;
        
        let html = '';
        orderSubtotal = 0;

        fetchedProducts.forEach(item => {
            const lineTotal = item.price * item.qty;
            orderSubtotal += lineTotal;

            html += `
                <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">
                    <div style="display:flex; gap:10px;">
                        <img src="${item.image}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;">
                        <div>
                            <div style="color:#fff; font-size:0.9rem;">${item.title}</div>
                            <div style="color:#666; font-size:0.8rem;">Qty: ${item.qty}</div>
                        </div>
                    </div>
                    <div style="color:#fff; font-size:0.9rem;">${formatPrice(lineTotal)}</div>
                </div>
            `;
        });

        orderItemsPreview.innerHTML = html;
        if(subtotalEl) subtotalEl.textContent = formatPrice(orderSubtotal);
        if(totalEl) totalEl.textContent = formatPrice(orderSubtotal);
    }

    // --- 4. Render Addresses ---
    function renderAddresses() {
        if (!savedAddressGrid) return;
        savedAddressGrid.innerHTML = '';

        savedAddresses.forEach((addr, index) => {
            const card = document.createElement('div');
            card.className = `address-card-new ${selectedAddressIndex === index ? 'selected' : ''}`;
            card.onclick = () => selectAddress(index);

            // Create Card Content matching new CSS
            card.innerHTML = `
                <div class="addr-header">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div class="radio-wrapper"><div class="radio-dot"></div></div>
                        <span class="addr-name-tag">${addr.name}</span>
                    </div>
                    <div class="remove-link">REMOVE</div>
                </div>
                <div class="addr-body" style="padding-left: 34px;">
                    <span class="addr-line">${addr.street}</span>
                    <span class="addr-line">${addr.city}, ${addr.zip}</span>
                    <span class="addr-line">${addr.country}</span>
                    <span class="addr-phone">${addr.phone}</span>
                </div>
            `;
            
            // Add click listener for remove button specifically
            const removeBtn = card.querySelector('.remove-link');
            if(removeBtn) {
                removeBtn.onclick = (e) => {
                    e.stopPropagation();
                    removeAddress(index);
                };
            }

            savedAddressGrid.appendChild(card);
        });
        
        // Update Loco Scroll because height changed
        setTimeout(() => {
            // Check if locoScroll exists on window or if we can access the instance otherwise
            // Assuming global access or re-init logic handles it
            const scrollContainer = document.querySelector('[data-scroll-container]');
            // If strictly needed, we could dispatch an event
        }, 300);
    }

    function selectAddress(index) {
        selectedAddressIndex = index;
        // Visual Update - Efficiently toggle classes
        const cards = document.querySelectorAll('.address-card-new');
        cards.forEach((c, i) => {
            if (i === index) {
                c.classList.add('selected');
            } else {
                c.classList.remove('selected');
            }
        });
    }

    function removeAddress(index) {
        if(confirm("Delete this address?")) {
            savedAddresses.splice(index, 1);
            localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
            
            // If we deleted the selected one, deselect
            if (selectedAddressIndex === index) selectedAddressIndex = null;
            // If we deleted one above the selected one, decrement index
            else if (selectedAddressIndex > index) selectedAddressIndex--;
            
            renderAddresses();
            
            if(savedAddresses.length === 0) {
                 newAddrForm.classList.add('active');
                 gsap.fromTo(newAddrForm, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.5 });
                 toggleNewAddrBtn.style.display = 'none';
            }
        }
    }

    // --- 5. Add Address ---
    if(toggleNewAddrBtn) {
        toggleNewAddrBtn.onclick = (e) => {
             e.preventDefault();
             const isActive = newAddrForm.classList.contains('active');
             
             if(!isActive) {
                 newAddrForm.classList.add('active');
                 gsap.fromTo(newAddrForm, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' });
                 toggleNewAddrBtn.textContent = "- Cancel Adding";
             } else {
                 gsap.to(newAddrForm, { height: 0, opacity: 0, duration: 0.3, onComplete: () => {
                     newAddrForm.classList.remove('active');
                 }});
                 toggleNewAddrBtn.textContent = "+ Add New Address";
             }
             setTimeout(() => window.locoScroll && window.locoScroll.update(), 500);
        };
    }

    if (newAddrForm) {
        newAddrForm.onsubmit = (e) => {
            e.preventDefault();
            const newAddr = {
                name: document.getElementById('addr-name').value,
                phone: document.getElementById('addr-phone').value,
                street: document.getElementById('addr-street').value,
                city: document.getElementById('addr-city').value,
                zip: document.getElementById('addr-zip').value,
                country: document.getElementById('addr-country').value,
            };
            savedAddresses.push(newAddr);
            localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
            
            // Hide Form with Animation
            gsap.to(newAddrForm, { height: 0, opacity: 0, duration: 0.3, onComplete: () => {
                newAddrForm.classList.remove('active');
                newAddrForm.style.height = '';
                newAddrForm.reset();
            }});
            
            toggleNewAddrBtn.style.display = 'block';
            toggleNewAddrBtn.textContent = "+ Add New Address";

            selectAddress(savedAddresses.length - 1);
            renderAddresses();
        };
    }

    // --- 6. Place Order ---
    if(placeOrderBtn) {
        placeOrderBtn.onclick = async () => {
            if (selectedAddressIndex === null) {
                alert("Please select a shipping address.");
                return;
            }
            
            // Check if products loaded
            if (fetchedProducts.length === 0) {
                 alert("Your cart seems empty or failed to load. Please return to shop.");
                 return;
            }

            const address = savedAddresses[selectedAddressIndex];
            
            const originalText = placeOrderBtn.textContent;
            placeOrderBtn.textContent = "PROCESSING ORDER...";
            placeOrderBtn.style.opacity = "0.7";
            placeOrderBtn.disabled = true;

            // Prepare Payload
            const orderPayload = {
                customerName: address.name,
                customerPhone: address.phone,
                customerEmail: 'guest@checkout.com', // Or add email field if needed
                shippingAddress: {
                    streetAddress: address.street,
                    city: address.city,
                    zipCode: address.zip,
                    country: address.country,
                    province: 'N/A'
                },
                items: fetchedProducts.map(p => ({
                    productId: p.id,
                    productName: p.title,
                    quantity: p.qty,
                    price: p.price,
                    variant: p.option || 'Standard'
                })),
                subtotalAmount: orderSubtotal,
                totalAmount: orderSubtotal, // + Shipping if needed
                paymentMethod: 'cod',
                shippingFee: 0,
                discountAmount: 0
            };

            console.log("Submitting Order:", orderPayload);

            try {
                const res = await fetch(`${API_BASE_URL}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderPayload)
                });

                // Try to parse JSON, but handle non-JSON responses
                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error("Server Response Not JSON:", text);
                    throw new Error("Server Error: " + text.substring(0, 50));
                }

                if (res.ok && data.success) {
                    localStorage.removeItem('cart');
                    // Success Message
                    alert(`Order Placed Successfully! Order ID: ${data.data._id || 'Confirmed'}`);
                    window.location.href = 'l.html';
                } else {
                    throw new Error(data.message || "Order submission failed on server.");
                }
            } catch (err) {
                console.error(err);
                alert("Failed to place order: " + err.message);
                placeOrderBtn.textContent = originalText;
                placeOrderBtn.style.opacity = "1";
                placeOrderBtn.disabled = false;
            }
        };
    }

    initCheckout();

});
