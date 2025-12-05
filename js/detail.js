// -----------------------------------------------------------------------------------
// 1. FIREBASE INITIALIZATION BLOCK (For User ID Generation)
// -----------------------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
    getFirestore, 
    setLogLevel 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"; 

// Note: setLogLevel is optional, but kept for matching the original block
setLogLevel('debug'); 

let db, auth, userId; // Global variable for the User ID
const apiKey = ""; // Assuming this is defined elsewhere or unused
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; // Kept from original

async function initializeFirebase() {
    // These global variables (__firebase_config, __initial_auth_token) are assumed to be 
    // defined in your build environment, or they default to empty/mock values.
    try {
        const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);

        if (typeof __initial_auth_token !== 'undefined') {
            await signInWithCustomToken(auth, __initial_auth_token);
        } else {
            await signInAnonymously(auth);
        }
        
        // Use authenticated UID or a safe fallback
        // The userId will be used for review attribution.
        userId = auth.currentUser?.uid || crypto.randomUUID(); 
        console.log("Firebase initialized. User ID:", userId.substring(0, 10) + '...');
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        // Fallback in case of complete failure
        userId = 'fallback-' + Math.random().toString(36).substring(2, 10);
    }
}
initializeFirebase();
// -----------------------------------------------------------------------------------
// END FIREBASE INITIALIZATION
// -----------------------------------------------------------------------------------


document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // API Endpoints
    // ----------------------------------------------------
    const API_URL = 'https://backend-web-1.vercel.app/api/products'; 
    const REVIEWS_API_URL = 'https://backend-web-1.vercel.app/api/reviews';     // Local Reviews API

    let ALL_PRODUCTS_DATA = [];

    // ----------------------------------------------------
    // DOM Element Selectors (Selected for clarity)
    // ----------------------------------------------------
    const productImage = document.querySelector('.product-image');
    const productTitle = document.querySelector('.product-title');
    const productPrice = document.querySelector('.product-price');
    const summaryText = document.querySelector('.summary-text');
    const featuresList = document.querySelector('.features-box ul');
    const descriptionPane = document.getElementById('description');
    const artistPane = document.getElementById('artist');
    const relatedProductsGrid = document.querySelector('.related-products .product-grid');
    const reviewsList = document.getElementById('reviews-list');
    const reviewsTabButton = document.querySelector('.tab-button[data-tab="reviews"]');
    const modal = document.getElementById('productAddedModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const continueShoppingButton = document.getElementById('continueShoppingButton');
    const modalTitle = document.getElementById('modalProductTitle');
    const modalImage = document.getElementById('modalProductImage');
    const modalOption = document.getElementById('modalProductOption');
    const modalViewCartBtn = document.getElementById('modalViewCartBtn');

    if (closeModalButton) closeModalButton.addEventListener('click', () => modal.classList.add('hidden'));
    if (continueShoppingButton) continueShoppingButton.addEventListener('click', () => modal.classList.add('hidden'));


    // ----------------------------------------------------
    // Utility Functions
    // ----------------------------------------------------
    function getProductIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function formatPrice(price) {
        if (typeof price === 'number') {
            return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        }
        return String(price || 'Price TBD');
    }
    
    function renderStars(rating) {
        const fullStar = '★';
        const emptyStar = '☆';
        const count = Math.round(rating); 
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<span class="star">${i <= count ? fullStar : emptyStar}</span>`;
        }
        return stars;
    }
    
    // Function to display form feedback instead of alert()
    function displayFormFeedback(message, isError = false) {
        const feedbackEl = document.getElementById('review-feedback');
        if (!feedbackEl) return;
        
        feedbackEl.textContent = message;
        feedbackEl.classList.remove('hidden', 'text-green-600', 'text-red-600');
        
        if (isError) {
            feedbackEl.classList.add('text-red-600');
        } else {
            feedbackEl.classList.add('text-green-600');
        }
        
        // Hide message after 5 seconds
        setTimeout(() => {
            feedbackEl.classList.add('hidden');
        }, 5000);
    }


    // --- 1. Load Product Details from Vercel API ---
    async function loadProductDetails() {
        const productId = getProductIdFromUrl() || '6659c4701e91307af047545e'; 
        
        if (!productId) {
            displayErrorMessage("Product ID not found in URL.");
            return;
        }

        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                // Simplified mock data handler for stability
                const mockData = [{ "_id": "6659c4701e91307af047545e", "title": "Ascension of Light", "artist": "Elara Vane", "price": 450.00, "category": "Abstract", "style": "Geometric", "medium": "Acrylic on Canvas", "dimensions": "30in x 40in", "subject": "Light, Form", "mainImage": "https://placehold.co/500x500/fecaca/991b1b?text=Ascension", "description": "A dynamic exploration of color gradients.", "artistBio": "Elara Vane is a Berlin-based artist." }];
                const mainProduct = mockData.find(p => String(p._id) === String(productId));
                
                if (!mainProduct) throw new Error("Product not found.");

                ALL_PRODUCTS_DATA = mockData.map(product => ({
                    ...product, id: product._id, image: product.mainImage, price: formatPrice(product.price)
                }));
                
                renderMainProduct(mainProduct);
                renderSmallImages(mainProduct);
                setupAddToCart(mainProduct);
                loadReviews(mainProduct.id); 
                setupReviewForm(mainProduct.id); 
                return;
            }

            const rawProducts = await response.json();
            ALL_PRODUCTS_DATA = rawProducts.map(product => ({
                ...product,
                id: product._id, 
                image: product.mainImage, 
                price: formatPrice(product.price)
            }));
            const mainProduct = ALL_PRODUCTS_DATA.find(p => String(p.id) === String(productId));

            if (mainProduct) {
                renderMainProduct(mainProduct);
                renderSmallImages(mainProduct);
                renderRelatedProducts(mainProduct, ALL_PRODUCTS_DATA);
                setupAddToCart(mainProduct);
                loadReviews(mainProduct.id); 
                setupReviewForm(mainProduct.id);
            } else {
                displayErrorMessage(`Product with ID "${productId}" not found.`);
            }

        } catch (error) {
            console.error('Error fetching product data:', error);
            displayErrorMessage('Could not load product details. Check the server connection or console for errors.');
        }
    }

    // --- Error Display Function (Unchanged) ---
    function displayErrorMessage(message) {
        if (productTitle) productTitle.textContent = 'Product Not Available';
        if (productImage) productImage.src = 'https://placehold.co/500x500/f87171/991b1b?text=Error';
        if (descriptionPane) descriptionPane.innerHTML = `<p class="text-red-500">${message}</p>`;
    }

    // --- 2-7. Rendering Functions (Details, Tabs, Images, Related Products, Cart) ---
    // (These functions are kept as provided)
    function renderMainProduct(product) {
        if (productImage) productImage.src = product.image || 'https://placehold.co/500x500/cccccc/333333?text=Main+Product+Image';
        if (productTitle) productTitle.textContent = product.title || 'Untitled Artwork';
        if (productPrice) productPrice.textContent = product.price;

        if (summaryText) {
            summaryText.textContent = `A stunning original piece, "${product.title || 'Untitled'}", by ${product.artist || 'Unknown Artist'}.`;
        }

        if (featuresList) {
            featuresList.innerHTML = `
                <li>**Medium:** ${product.medium || 'N/A'}</li>
                <li>**Style:** ${product.style || 'N/A'}</li>
                <li>**Dimensions:** ${product.dimensions || 'N/A'}</li>
            `;
        }
        document.title = `${product.title || 'Product'} | InkByHand`;
        renderTabContent(product);
    }
    
    function renderTabContent(product) {
        if (descriptionPane) descriptionPane.innerHTML = `<p class="mb-6">${product.description || 'No detailed description available.'}</p>`;
        if (artistPane) artistPane.innerHTML = `<p class="mb-6">${product.artistBio || 'No artist biography available.'}</p>`;
    }
    
    function renderSmallImages(product) {
        const allImages = [product.image, ...(product.smallImages || [])].filter((v, i, a) => a.indexOf(v) === i);
        let smallImgsContainer = document.querySelector('.small-images-container');
        if (!smallImgsContainer) return;
        smallImgsContainer.innerHTML = '';

        allImages.forEach((src, index) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.classList.add('small-img-wrapper');
            const img = document.createElement('img');
            img.src = src;
            img.classList.add('small-img-thumbnail', 'transition-all');
            if (index === 0) img.classList.add('active-thumbnail'); 
            img.addEventListener('click', (e) => {
                if (productImage) productImage.src = e.target.src;
                document.querySelectorAll('.small-img-thumbnail').forEach(t => t.classList.remove('active-thumbnail'));
                e.target.classList.add('active-thumbnail');
            });
            imgWrapper.appendChild(img);
            smallImgsContainer.appendChild(imgWrapper);
        });
    }
    
    function renderRelatedProducts(mainProduct, allProducts) {
        if (!relatedProductsGrid) return;
        relatedProductsGrid.innerHTML = '';
        const filteredProducts = allProducts.filter(p => p.id !== mainProduct.id);
        let related = filteredProducts.filter(p => p.style === mainProduct.style || p.artist === mainProduct.artist);
        const neededCount = 4 - related.length;
        if (neededCount > 0) {
            const fallback = filteredProducts.filter(p => !related.some(r => r.id === p.id)).slice(0, neededCount);
            related.push(...fallback);
        }

        related.slice(0, 4).forEach(relatedProduct => {
            const card = document.createElement('a');
            card.href = `detail.html?id=${relatedProduct.id}`;
            card.classList.add('product-card');
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

    function setupAddToCart(product) {
        document.getElementById("add-to-cart-btns")?.addEventListener("click", () => {
            const selectEl = document.querySelector("#hidden-native-select");
            const selectedOptionText = selectEl.options[selectEl.selectedIndex].text.replace('Option: ', '').trim();
            const qty = parseInt(document.getElementById("quantity").value) || 1;

            if (selectEl.selectedIndex === 0) {
                console.error('Please select an option first.');
                return;
            }

            const cartItem = {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                qty: qty,
                option: selectedOptionText 
            };

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingItemIndex = cart.findIndex(item => item.id === cartItem.id && item.option === cartItem.option);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].qty += qty;
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            // Show Modal
            if (modal) {
                modalTitle.textContent = cartItem.title;
                modalImage.src = cartItem.image;
                modalOption.textContent = `Option: ${cartItem.option}, Qty: ${cartItem.qty}`;
                const totalItemsInCart = cart.reduce((total, item) => total + item.qty, 0);
                modalViewCartBtn.textContent = `View cart (${totalItemsInCart})`;
                modal.classList.remove('hidden');
            }

            updateCartCountDisplay(cart);
        });

        updateCartCountDisplay(JSON.parse(localStorage.getItem("cart")) || []);
    }
    
    function updateCartCountDisplay(cart) {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cart.reduce((total, item) => total + item.qty, 0);
        }
    }


    // --- 8. Load and Display Reviews (using local API) ---
    async function loadReviews(productId) {
        if (!reviewsList) return;
        reviewsList.innerHTML = '<p class="text-center text-gray-500">Loading reviews...</p>';

        try {
            const response = await fetch(`${REVIEWS_API_URL}?productId=${productId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json(); 
            const reviews = result.data || []; 
            
            if (reviewsTabButton) {
                reviewsTabButton.textContent = `Reviews (${reviews.length})`;
            }

            if (reviews.length === 0) {
                reviewsList.innerHTML = '<p class="text-center text-gray-500">No reviews yet. Be the first!</p>';
                return;
            }

            // Display Reviews
            reviewsList.innerHTML = '';
            reviews.forEach(review => {
                const dateString = review.createdAt || review.date; 
                const date = dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
                
                // Use stored userId for name if available, otherwise fallback
                const isUserReview = review.userId && userId && review.userId === userId;
                const author = review.name || (review.userId ? `User_${review.userId.substring(0, 8)}...` : 'Anonymous');
                
                // Check if the current user is the author (basic check)
                const isAuthorClass = isUserReview ? 'font-bold text-blue-600' : 'font-semibold text-gray-800';

                const reviewCard = document.createElement('div');
                reviewCard.classList.add('review-card', 'p-4', 'border-b', 'border-gray-100', 'space-y-1');
                reviewCard.innerHTML = `
                    <div class="review-header flex justify-between items-center">
                        <span class="review-author ${isAuthorClass}">${author} ${isUserReview ? '(You)' : ''}</span>
                        <span class="review-date text-sm text-gray-500">${date}</span>
                    </div>
                    <div class="review-rating text-lg">${renderStars(review.rating)}</div>
                    <p class="review-body text-gray-600">${review.review}</p>
                `;
                reviewsList.appendChild(reviewCard);
            });

        } catch (error) {
            console.error("Error loading reviews:", error);
            reviewsList.innerHTML = '<p class="text-center text-red-500">Could not load reviews. Check the local API server connection or CORS settings.</p>';
        }
    }


    // --- 9. Setup Review Form Submission (UPDATED for Firebase userId) ---
    function setupReviewForm(productId) {
        const reviewForm = document.getElementById('review-form');
        const ratingValueInput = document.getElementById('rating-value');
        const starRatingContainer = document.getElementById('star-rating');

        if (!reviewForm || !starRatingContainer) return; 

        // Ensure you have an element with id="review-feedback" in your HTML to display messages
        if (!document.getElementById('review-feedback')) {
            const feedbackPlaceholder = document.createElement('p');
            feedbackPlaceholder.id = 'review-feedback';
            feedbackPlaceholder.classList.add('mt-2', 'hidden');
            reviewForm.parentNode.insertBefore(feedbackPlaceholder, reviewForm.nextSibling);
        }

        // 1. Initialize Star UI (Unchanged)
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.classList.add('star', 'text-2xl', 'cursor-pointer');
            star.textContent = '☆';
            star.setAttribute('data-rating', i);
            star.addEventListener('click', () => {
                const newRating = parseInt(star.getAttribute('data-rating'));
                ratingValueInput.value = newRating;
                document.querySelectorAll('#star-rating .star').forEach(s => {
                    s.classList.remove('rated');
                    s.textContent = '☆';
                    if (parseInt(s.getAttribute('data-rating')) <= newRating) {
                        s.textContent = '★';
                        s.classList.add('rated');
                    }
                });
            });
            starRatingContainer.appendChild(star);
        }

        // 2. Handle Form Submission (Updated to use global userId)
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const rating = parseInt(ratingValueInput.value);
            const reviewText = document.getElementById('review-text').value.trim();
            
            // Wait for Firebase to initialize and set userId if it hasn't yet
            if (!userId) {
                displayFormFeedback('System is initializing, please try again in a moment.', true);
                return;
            }
            
            // --- USE GLOBAL userId ---
            const currentUserId = userId; 
            const reviewerName = `User_${currentUserId.substring(0, 6)}`; 
            // --- END USE GLOBAL userId ---

            if (rating === 0 || reviewText.length < 5) {
                displayFormFeedback('Please provide a rating (1-5 stars) and a review of at least 5 characters.', true);
                return;
            }

            try {
                const reviewData = {
                    productId: productId,
                    name: reviewerName,      // Use generated name
                    userId: currentUserId,   // <-- Send the Firebase/Anon User ID
                    rating: rating,
                    review: reviewText,      
                };

                const response = await fetch(REVIEWS_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reviewData)
                });

                if (!response.ok) {
                    const errorDetails = await response.json();
                    throw new Error(`Submission failed: ${errorDetails.message || response.statusText}`);
                }
                
                displayFormFeedback("Review submitted successfully!", false);
                reviewForm.reset();
                
                // Reset star UI
                ratingValueInput.value = 0;
                document.querySelectorAll('#star-rating .star').forEach(s => {
                    s.textContent = '☆';
                    s.classList.remove('rated');
                });
                
                // Wait briefly before reloading reviews to ensure the backend update propagates
                setTimeout(() => loadReviews(productId), 500); 

            } catch (e) {
                console.error("Error submitting review: ", e);
                displayFormFeedback(`Failed to submit review. Details: ${e.message}`, true);
            }
        });
    }


    // --- 7. Initialization and Other DOM/UI Logic (Unchanged) ---
    loadProductDetails(); 

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

    if (tabButtons.length > 0) {
        switchTab(tabButtons[0].getAttribute('data-tab'));
    }

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
        if (openMenuIcon && closeMenuIcon) {
            openMenuIcon.style.display = navLinks.classList.contains('active') ? 'none' : 'block';
            closeMenuIcon.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
        }
    };
});