 // ----------------------------------------------------
        // FIREBASE INITIALIZATION BLOCK (Mandatory for Canvas)
        // ----------------------------------------------------
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        setLogLevel('debug');

        let db, auth, userId;
        const apiKey = "";
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

        async function initializeFirebase() {
            try {
                const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
                const app = initializeApp(firebaseConfig);
                db = getFirestore(app);
                auth = getAuth(app);

                if (typeof __initial_auth_token !== 'undefined') {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
                userId = auth.currentUser?.uid || crypto.randomUUID();
                console.log("Firebase initialized and user authenticated:", userId);
            } catch (error) {
                console.error("Firebase initialization failed:", error);
            }
        }
        initializeFirebase();
        // ----------------------------------------------------
        // END FIREBASE INITIALIZATION
        // ----------------------------------------------------

        document.addEventListener('DOMContentLoaded', () => {
            const API_URL = 'https://backend-web-1.vercel.app/api/products';
            let ALL_PRODUCTS_DATA = []; // To store all products for related items

            // DOM Elements for Product Details
            const productImage = document.querySelector('.product-image');
            const productTitle = document.querySelector('.product-title');
            const productPrice = document.querySelector('.product-price');
            const summaryText = document.querySelector('.summary-text');
            const featuresList = document.querySelector('.features-box ul');
            const descriptionPane = document.getElementById('description');
            const artistPane = document.getElementById('artist');
            const relatedProductsGrid = document.querySelector('.related-products .product-grid');

            // DOM Elements for the New Modal
            const modal = document.getElementById('productAddedModal');
            const closeModalButton = document.getElementById('closeModalButton');
            const continueShoppingButton = document.getElementById('continueShoppingButton');
            const modalTitle = document.getElementById('modalProductTitle');
            const modalImage = document.getElementById('modalProductImage');
            const modalOption = document.getElementById('modalProductOption');
            const modalViewCartBtn = document.getElementById('modalViewCartBtn');

            // --- Modal Event Listeners ---
            closeModalButton.addEventListener('click', () => modal.classList.add('hidden'));
            continueShoppingButton.addEventListener('click', () => modal.classList.add('hidden'));


            // Helper to get the product ID from the URL
            function getProductIdFromUrl() {
                const params = new URLSearchParams(window.location.search);
                return params.get('id');
            }

            // Helper to format price (as done in product.js)
            function formatPrice(price) {
                if (typeof price === 'number') {
                    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                }
                return String(price || 'Price TBD');
            }

            // --- 1. Fetch ALL Products and Find the Selected One ---
            async function loadProductDetails() {
                const productId = getProductIdFromUrl() || '6659c4701e91307af047545e'; // Fallback ID for testing
                // If there's no product ID, and no fallback, show error.
                if (!productId) {
                    displayErrorMessage("Product ID not found in URL.");
                    return;
                }

                try {
                    // Fetch all products (needed for 'Related Products')
                    const response = await fetch(API_URL);
                    if (!response.ok) {
                        // Use mock data if API fails (useful for development in Canvas environment)
                        console.warn('API call failed. Using mock data.');
                        const mockData = [
                            { "_id": "6659c4701e91307af047545e", "title": "Ascension of Light", "artist": "Elara Vane", "price": 450.00, "category": "Abstract", "style": "Geometric", "medium": "Acrylic on Canvas", "dimensions": "30in x 40in", "subject": "Light, Form", "mainImage": "https://placehold.co/500x500/fecaca/991b1b?text=Ascension", "smallImages": ["https://placehold.co/60x60/fecaca/991b1b?text=A1", "https://placehold.co/60x60/fecaca/991b1b?text=A2"], "description": "A dynamic exploration of color gradients and hard edges, symbolizing growth and emergence.", "artistBio": "Elara Vane is a Berlin-based artist renowned for her use of mathematical precision in composition." },
                            { "_id": "6659c4701e91307af047545f", "title": "Coastal Fog", "artist": "Silas Grey", "price": 280.00, "category": "Landscape", "style": "Impressionist", "medium": "Oil on Board", "dimensions": "18in x 24in", "subject": "Seascape", "mainImage": "https://placehold.co/500x500/dbeafe/1e40af?text=Coastal", "smallImages": ["https://placehold.co/60x60/dbeafe/1e40af?text=C1", "https://placehold.co/60x60/dbeafe/1e40af?text=C2"], "description": "Soft focus and muted tones capture the ephemeral quality of a morning fog rolling over the Pacific coast.", "artistBio": "Silas Grey is a master of natural light and atmosphere, capturing the subtle beauty of the Pacific Northwest." },
                            { "_id": "6659c4701e91307af0475460", "title": "Neon Dreamscape", "artist": "Kai Lin", "price": 620.00, "category": "Digital Art", "style": "Cyberpunk", "medium": "Giclée Print", "dimensions": "24in x 36in", "subject": "Cityscape", "mainImage": "https://placehold.co/500x500/ede9fe/6d28d9?text=Neon", "smallImages": ["https://placehold.co/60x60/ede9fe/6d28d9?text=N1"], "description": "A vibrant depiction of a futuristic metropolis bathed in electric pinks and blues.", "artistBio": "Kai Lin uses digital mediums to explore the intersection of technology and human emotion, creating dazzling future visions." },
                            { "_id": "6659c4701e91307af0475461", "title": "Desert Bloom", "artist": "Silas Grey", "price": 350.00, "category": "Landscape", "style": "Impressionist", "medium": "Watercolor", "dimensions": "12in x 16in", "subject": "Flora", "mainImage": "https://placehold.co/500x500/ffedd5/b45309?text=Desert", "smallImages": ["https://placehold.co/60x60/ffedd5/b45309?text=D1", "https://placehold.co/60x60/ffedd5/b45309?text=D2"], "description": "A delicate watercolor capturing the brief, intense beauty of desert flowers.", "artistBio": "Silas Grey is a master of natural light and atmosphere, capturing the subtle beauty of the Pacific Northwest." }
                        ];
                        const mainProduct = mockData.find(p => String(p._id) === String(productId));
                        if (!mainProduct) throw new Error("Mock product not found.");

                        ALL_PRODUCTS_DATA = mockData.map(product => ({
                            ...product,
                            id: product._id, // Map _id to id
                            image: product.mainImage, // Map mainImage to image
                            price: formatPrice(product.price)
                        }));
                        renderMainProduct(mainProduct);
                        renderSmallImages(mainProduct);
                        renderRelatedProducts(mainProduct, ALL_PRODUCTS_DATA);
                        setupAddToCart(mainProduct);
                        return;

                    }
                    const rawProducts = await response.json();

                    // Map and format the data
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
                    displayErrorMessage('Could not load product details. Check the server connection or console for errors.');
                }
            }

            // --- Error Display Function ---
            function displayErrorMessage(message) {
                if (productTitle) productTitle.textContent = 'Product Not Available';
                if (productPrice) productPrice.textContent = '';
                if (summaryText) summaryText.textContent = message;
                if (productImage) productImage.src = 'https://placehold.co/500x500/f87171/991b1b?text=Error';
                if (descriptionPane) descriptionPane.innerHTML = `<p class="text-red-500">${message}</p>`;
                if (artistPane) artistPane.innerHTML = `<p class="text-red-500">Artist details not available.</p>`;
                if (relatedProductsGrid) relatedProductsGrid.innerHTML = '<p class="text-center text-gray-500">No related products loaded.</p>';
            }


            // --- 2. Render Main Product Details ---
            function renderMainProduct(product) {
                // Fallback image handling
                productImage.onerror = function () { this.src = 'https://placehold.co/500x500/cccccc/333333?text=Image+Missing'; };

                // --- Product Info Section ---
                if (productImage) productImage.src = product.image || 'https://placehold.co/500x500/cccccc/333333?text=Main+Product+Image';
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

                document.title = `${product.title || 'Product'} | InkByHand`;
                renderTabContent(product);
            }

            // --- 3. Render Tab Content ---
            function renderTabContent(product) {
                const descriptionContent = product.description || 'No detailed description available for this piece.';
                const artistContent = product.artistBio || 'No artist biography available.';

                // --- Description Tab ---
                if (descriptionPane) {
                    descriptionPane.innerHTML = `
                        <h3 class="text-2xl font-bold mb-4 text-gray-900">Conceptual Vision: A Study in Space and Light</h3>
                        <p class="mb-6">${descriptionContent}</p>
                        
                        <h4 class="font-semibold text-xl mb-3">Technical Specifications:</h4>
                        <ul class="spec-list space-y-2">
                            <li><span class="font-bold">Artist:</span> ${product.artist || 'N/A'}</li>
                            <li><span class="font-bold">Medium:</span> ${product.medium || 'N/A'}</li>
                            <li><span class="font-bold">Dimensions:</span> ${product.dimensions || 'N/A'}</li>
                            <li><span class="font-bold">Style:</span> ${product.style || 'N/A'}</li>
                            <li><span class="font-bold">Condition:</span> New, Original Artwork.</li>
                        </ul>
                    `;
                }

                // --- Artist Tab ---
                if (artistPane) {
                    artistPane.innerHTML = `
                        <h3 class="text-2xl font-bold mb-4 text-gray-900">${product.artist || 'Artist'}: The Artist's Vision</h3>
                        <p class="mb-6">${artistContent}</p>
                        
                        <div class="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg shadow-sm">
                            <p class="text-yellow-800">This original work is signed by ${product.artist || 'the artist'}, guaranteeing its authenticity.</p>
                        </div>
                    `;
                }
            }

            // --- 4. Render Small Images ---
            function renderSmallImages(product) {
                // Ensure smallImages includes the main image for consistency
                const allImages = [product.image, ...(product.smallImages || [])].filter((v, i, a) => a.indexOf(v) === i);

                let smallImgsContainer = document.querySelector('.small-images-container');
                if (!smallImgsContainer) return;

                smallImgsContainer.innerHTML = '';

                allImages.forEach((src, index) => {
                    const imgWrapper = document.createElement('div');
                    imgWrapper.classList.add('small-img-wrapper');

                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = `Thumbnail ${index + 1} for ${product.title}`;
                    img.classList.add('small-img-thumbnail', 'transition-all');
                    if (index === 0) img.classList.add('active-thumbnail'); // Mark first as active

                    img.addEventListener('click', (e) => {
                        if (productImage) productImage.src = e.target.src;
                        document.querySelectorAll('.small-img-thumbnail').forEach(t => t.classList.remove('active-thumbnail'));
                        e.target.classList.add('active-thumbnail');
                    });

                    imgWrapper.appendChild(img);
                    smallImgsContainer.appendChild(imgWrapper);
                });
            }

            // --- 5. Render Related Products ---
            function renderRelatedProducts(mainProduct, allProducts) {
                if (!relatedProductsGrid) return;
                relatedProductsGrid.innerHTML = '';

                // Filter out the current product and prioritize related by style/artist
                const filteredProducts = allProducts.filter(p => p.id !== mainProduct.id);

                let related = filteredProducts.filter(p =>
                    p.style === mainProduct.style || p.artist === mainProduct.artist
                );

                // Fill the rest with general products if needed
                const neededCount = 4 - related.length;
                if (neededCount > 0) {
                    const fallback = filteredProducts.filter(p => !related.some(r => r.id === p.id)).slice(0, neededCount);
                    related.push(...fallback);
                }

                related.slice(0, 4).forEach(relatedProduct => {
                    const card = document.createElement('a');
                    card.href = `detail.html?id=${relatedProduct.id}`;
                    card.classList.add('product-card');
                    card.setAttribute('aria-label', `View ${relatedProduct.title}`);

                    card.innerHTML = `
                        <div class="product-card-image-wrapper">
                            <img src="${relatedProduct.image || 'https://placehold.co/500x500/cccccc/333333?text=Related+Art'}" alt="${relatedProduct.title}" onerror="this.onerror=null;this.src='https://placehold.co/500x500/cccccc/333333?text=Related+Art'">
                        </div>
                        <div class="product-card-info">
                            <h3 class="product-card-title">${relatedProduct.title || 'N/A'}</h3>
                            <p class="product-card-category">${relatedProduct.artist || 'Unknown Artist'}</p>
                            <p class="product-card-price">${relatedProduct.price}</p>
                        </div>
                    `;
                    relatedProductsGrid.appendChild(card);
                });
            }

            // --- 6. Add to Cart Logic (UPDATED for new Modal) ---
            function setupAddToCart(product) {
                document.getElementById("add-to-cart-btns").addEventListener("click", () => {
                    const selectEl = document.querySelector("#hidden-native-select");
                    const selectVal = selectEl.value; // Value from the hidden select
                    const selectedOptionText = selectEl.options[selectEl.selectedIndex].text.replace('Option: ', '').trim();
                    const qty = parseInt(document.getElementById("quantity").value) || 1;

                    if (selectEl.selectedIndex === 0) {
                        alert('Please select an option first.'); // Use console log instead of alert if possible
                        console.error('Please select an option first.');
                        return;
                    }

                    const cartItem = {
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.image,
                        qty: qty,
                        option: selectedOptionText // Use the display text for the option
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

                    // --- Show New Modal & Update Content ---
                    if (modal) {
                        // Populate modal content
                        modalTitle.textContent = cartItem.title;
                        modalImage.src = cartItem.image;
                        modalImage.onerror = function () { this.src = 'https://placehold.co/80x80/cccccc/333333?text=Art'; }; // Fallback
                        modalOption.textContent = `Option: ${cartItem.option}, Qty: ${cartItem.qty}`;

                        // Update cart count in the modal
                        const totalItemsInCart = cart.reduce((total, item) => total + item.qty, 0);
                        modalViewCartBtn.textContent = `View cart (${totalItemsInCart})`;

                        // Display the modal
                        modal.classList.remove('hidden');
                    }

                    // Update header cart count display
                    updateCartCountDisplay(cart);
                });

                // Initial cart count display
                updateCartCountDisplay(JSON.parse(localStorage.getItem("cart")) || []);
            }

            function updateCartCountDisplay(cart) {
                const cartCountElement = document.getElementById('cart-count');
                if (cartCountElement) {
                    cartCountElement.textContent = cart.reduce((total, item) => total + item.qty, 0);
                }
            }


            // --- 7. Initialization and Other DOM/UI Logic ---
            loadProductDetails(); // Start the process by fetching the details

            // --- Tab Switching Logic ---
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

            // --- Quantity Input Validation ---
            const quantityInput = document.getElementById('quantity');
            if (quantityInput) {
                quantityInput.addEventListener('change', function () {
                    const val = parseInt(this.value);
                    if (isNaN(val) || val < 1) this.value = 1;
                    if (val > 5) this.value = 5;
                });
            }

            // --- Custom Select Dropdown Logic ---
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
                        customButton.innerHTML = option.innerHTML.trim() + '<span class="arrow"></span>';
                    }

                    itemDiv.addEventListener('click', function (e) {
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
                customButton.addEventListener('click', function (e) {
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
                document.addEventListener('click', function (e) {
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
                navLinks.classList.toggle('active');
                openMenuIcon.style.display = navLinks.classList.contains('active') ? 'none' : 'block';
                closeMenuIcon.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
            };
        });