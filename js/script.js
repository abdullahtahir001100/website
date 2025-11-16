
        // --- CAPTCHA Data and Logic (Existing) ---
        const CAPTCHA_IMAGES 
 = [
            { src: 'images/1.jpg', label: 'Modern Calligraphy' },
            { src: 'images/9.jpg', label: 'Surah Rehman' },
            { src: 'images/2.jpg', label: 'Surah Kausar', isTarget: true }, // The target image
            { src: 'images/3.jpg', label: '99 Names of Allah' },
            { src: 'images/4.jpg', label: 'Surah Ad-Duha' },
 
            { src: 'images/5.jpg', label: 'Four Kul' },
            { src: 'images/6.jpg', label: 'Surah Rehman' },
            { src: 'images/7.jpg', label: 'Ocean Paintaing' },
            { src: 'images/11.jpg', label: 'Darood e Ibrhimi' }
        ];
 const CAPTCHA_MODAL_OVERLAY = document.getElementById('captchaModalOverlay');
        const CAPTCHA_GRID = document.getElementById('captchaGrid');
        const CAPTCHA_CHECK_DISPLAY = document.getElementById('captchaCheckDisplay');
        const CAPTCHA_VERIFIED_INPUT = document.getElementById('captchaVerified');
        const CAPTCHA_LABEL = document.getElementById('captchaLabel');
 const CAPTCHA_ERROR = document.getElementById('captchaError');
        const CAPTCHA_FAILURE_MESSAGE = document.getElementById('captchaFailure');


        // Function to shuffle an array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
 [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
 }

        // 1. Generate and display the CAPTCHA grid
        function generateCaptchaGrid() {
            CAPTCHA_GRID.innerHTML = '';
 CAPTCHA_FAILURE_MESSAGE.style.display = 'none';

            const targetImage = CAPTCHA_IMAGES.find(img => img.isTarget);
            let nonTargetImages = CAPTCHA_IMAGES.filter(img => !img.isTarget);

            const imagesForGrid = shuffleArray(nonTargetImages).slice(0, 8);
 imagesForGrid.push(targetImage);

            const shuffledGridImages = shuffleArray(imagesForGrid);

            shuffledGridImages.forEach((img, index) => {
                const item = document.createElement('div');
                item.className = 'captcha-image-item';
                item.setAttribute('data-index', index);
                item.setAttribute('data-target', img.isTarget ? 'true' : 'false');

                const 
 imageTag = document.createElement('img');
                imageTag.src = img.src;
                imageTag.alt = img.label;

                item.appendChild(imageTag);
                CAPTCHA_GRID.appendChild(item);

                item.addEventListener('click', () => {
           
                         handleImageSelection(item);
                });
            });
 }

        // 2. Handle image selection validation
        function handleImageSelection(selectedItem) {
            document.querySelectorAll('.captcha-image-item').forEach(item => {
                item.classList.remove('selected');
            });
 selectedItem.classList.add('selected');

            if (selectedItem.getAttribute('data-target') === 'true') {
                CAPTCHA_VERIFIED_INPUT.value = 'true';
 CAPTCHA_CHECK_DISPLAY.classList.add('checked');
                CAPTCHA_CHECK_DISPLAY.setAttribute('aria-checked', 'true');
                CAPTCHA_ERROR.style.display = 'none';
                setTimeout(() => {
                    CAPTCHA_MODAL_OVERLAY.style.display = 'none';
                }, 300);
 CAPTCHA_FAILURE_MESSAGE.style.display = 'none';
            } else {
                CAPTCHA_VERIFIED_INPUT.value = 'false';
 CAPTCHA_CHECK_DISPLAY.classList.remove('checked');
                CAPTCHA_CHECK_DISPLAY.setAttribute('aria-checked', 'false');
                CAPTCHA_FAILURE_MESSAGE.textContent = 'Incorrect selection. Please try again.';
                CAPTCHA_FAILURE_MESSAGE.style.display = 'block';
 }
        }

        CAPTCHA_LABEL.addEventListener('click', () => {
            if (CAPTCHA_VERIFIED_INPUT.value === 'false') {
                generateCaptchaGrid();
                CAPTCHA_MODAL_OVERLAY.style.display = 'flex';
                CAPTCHA_ERROR.style.display = 'none';
            }
 
        });

        CAPTCHA_MODAL_OVERLAY.addEventListener('click', (e) => {
            if (e.target === CAPTCHA_MODAL_OVERLAY) {
                CAPTCHA_MODAL_OVERLAY.style.display = 'none';
            }
        });
 // --- Core Modal/Navigation Logic (Existing) ---
        let blocks = document.getElementsByClassName('block');
 let answer = document.getElementsByClassName('jsconst');
        for (let i = 0; i < blocks.length; i++) {
            blocks[i].onclick = function () {
                answer[i].classList.toggle('blocker');
 };
        }

        const userBtn = document.getElementById('form1');
        const modalOverlay = document.querySelector('.modal-overlay');
 const closeBtn = document.querySelector('.modal-box .close-btn');
        const views = document.querySelectorAll('.view-container');
        const passwordToggles = document.querySelectorAll('.password-toggle');
        const navLinks = document.getElementById('nav-links');
 const openMenuIcon = document.getElementById('menu-icon');
        const closeMenuIcon = document.getElementById('close-icon');

        function hideModal() {
            modalOverlay.style.display = 'none';
 }

        window.showView = function (viewId) {
            views.forEach(view => {
                view.style.display = 'none';
            });
 const viewToShow = document.getElementById(viewId);
            if (viewToShow) {
                viewToShow.style.display = 'block';
 }
        };

        function showModal(e) {
            e.preventDefault();
 modalOverlay.style.display = 'flex';
            showView('loginView');
        }

        function togglePassword(e) {
            const icon = e.currentTarget;
 const input = icon.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
 }

        window.toggleNav = function () {
            navLinks.classList.toggle('active');
            closeMenuIcon.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
        };
 if (userBtn) {
            userBtn.addEventListener('click', showModal);
 }
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal();
        });
 modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                hideModal();
            }
        });
 passwordToggles.forEach(icon => {
            icon.addEventListener('click', togglePassword);
        });
 modalOverlay.style.display = 'none';


        // --- VALIDATION LOGIC FOR REGISTRATION FORM (Existing) ---
        document.addEventListener('DOMContentLoaded', () => {
            const registerForm = document.getElementById('registerForm');
            const nameInput = document.getElementById('registerNameInput');
            const passwordInput = document.getElementById('registerPasswordInput');
            const confirmPasswordInput = document.getElementById('registerConfirmPasswordInput');
            const passwordMatchError = document.getElementById('passwordMatchError');
   
                 const nameError = document.getElementById('nameError');

            const passwordLengthError = document.createElement('div');
            passwordLengthError.id = 'passwordLengthError';
            passwordLengthError.className = 'error-message';

            if (passwordInput && passwordInput.parentNode) {
                passwordInput.parentNode.insertBefore(passwordLengthError, passwordInput.nextSibling.nextSibling);
            
 }

            const validatePasswordMatch = () => {
                const password = passwordInput.value;
 const confirmPassword = confirmPasswordInput.value;
                let isValid = true;

                if (password.length > 0 && password.length < 8) {
                    passwordLengthError.textContent = "Password must be at least 8 characters long.";
 passwordInput.classList.add('input-error');
                    isValid = false;
                } else {
                    passwordLengthError.textContent = "";
 passwordInput.classList.remove('input-error');
                }

                if (confirmPassword.length > 0 && password !== confirmPassword) {
                    passwordMatchError.textContent = "Passwords do not match.";
 confirmPasswordInput.classList.add('input-error');
                    if (isValid) isValid = false;
                } else if (confirmPassword.length > 0) {
                    passwordMatchError.textContent = "";
 confirmPasswordInput.classList.remove('input-error');
                } else if (confirmPassword.length === 0) {
                    passwordMatchError.textContent = "";
 confirmPasswordInput.classList.remove('input-error');
                }

                if (passwordLengthError.textContent) {
                    passwordMatchError.textContent = "";
 confirmPasswordInput.classList.remove('input-error');
                }

                return isValid;
            };
 if (passwordInput && confirmPasswordInput) {
                passwordInput.addEventListener('input', validatePasswordMatch);
 confirmPasswordInput.addEventListener('input', validatePasswordMatch);
            }


            const validateName = () => {
                const name = nameInput.value.trim();
 const forbiddenName = "admin";
                let isValid = true;

                if (name.toLowerCase() === forbiddenName) {
                    nameError.textContent = `The name "${name}" is reserved and cannot be used.`;
 nameInput.classList.add('input-error');
                    isValid = false;
                } else {
                    nameError.textContent = "";
 nameInput.classList.remove('input-error');
                }
                return isValid;
            };
 if (nameInput) {
                nameInput.addEventListener('input', validateName);
 }


            if (registerForm) {
                registerForm.addEventListener('submit', (e) => {
                    e.preventDefault();

                    const isNameValid = validateName();
                    const isPasswordValid = validatePasswordMatch();
 
                    const isCaptchaCorrect = CAPTCHA_VERIFIED_INPUT.value === 'true';

                    if (!isCaptchaCorrect) {
                        CAPTCHA_ERROR.style.display = 'block';
                    } else {
      
                                     CAPTCHA_ERROR.style.display = 'none';
                    }

                    if (isNameValid && isPasswordValid && isCaptchaCorrect) {
                        // Registration successful 
                        registerForm.reset();
                        CAPTCHA_VERIFIED_INPUT.value = 'false';
                        CAPTCHA_CHECK_DISPLAY.classList.remove('checked');
                        CAPTCHA_CHECK_DISPLAY.setAttribute('aria-checked', 'false');
                        CAPTCHA_ERROR.style.display = 'none';
                    }
                });
 }

            showView('loginView');
        });
        
        // ===========================================
        // === API FETCH, SORTING, AND DETAIL REDIRECTION LOGIC ===
        // ===========================================

        const scrollUpBtn = document.getElementById('scrollUpBtn');
        const scrollDownBtn = document.getElementById('scrollDownBtn');
        const rightAdPopup = document.getElementById('rightAdPopup');
        const adCloseBtn = document.getElementById('adCloseBtn');


        // New API Endpoint and Data Fetching
        const API_URL = 'https://backend-web-1.vercel.app/api/products'; 
        const PRODUCTS_CONTAINER = document.getElementById('products-container');

        // Mock Data updated to use 'mainImage' and 'click_count' fields
        const MOCK_PRODUCTS = [
            { _id: '6916650f47f1087d3467f1f3', title: 'Modern Calligraphy', price: '2600.00', mainImage: 'images/1.jpg', click_count: 150 },
            { _id: 'a8b7c6d5e4f3g2h1i0j9k8l7', title: 'Ayat al Kursi', price: '1400.00', mainImage: 'images/9.jpg', click_count: 120 },
            { _id: 'f2d4c6b8a0e9d7c5b3a1f0e2', title: 'Surah Rehman', price: '1200.00', mainImage: 'images/9.jpg', click_count: 180 },
            { _id: '103', title: 'Surah Kausar', price: '1600.00', mainImage: 'images/2.jpg', click_count: 90 },
            { _id: '104', title: '99 Nams of Allah', price: '2500.00', mainImage: 'images/3.jpg', click_count: 110 },
            { _id: '105', title: 'Surah Ad-Duha', price: '1200.00', mainImage: 'images/4.jpg', click_count: 80 },
            { _id: '106', title: 'Four Kul', price: '2600.00', mainImage: 'images/5.jpg', click_count: 160 },
            { _id: '107', title: 'Surah Rehman (Large)', price: '1700.00', mainImage: 'images/6.jpg', click_count: 130 },
            { _id: '108', title: 'Ocean Paintaing', price: '200.00', mainImage: 'images/7.jpg', click_count: 50 },
            { _id: '109', title: 'Beauty Of Quran', price: '1400.00', mainImage: 'images/1.jpg', click_count: 140 },
            { _id: '110', title: 'Ayat al Kursi (Set)', price: '1400.00', mainImage: 'images/9.jpg', click_count: 100 },
            { _id: '111', title: 'Darood e Ibrhimi', price: '2600.00', mainImage: 'images/11.jpg', click_count: 170 },
            { _id: '112', title: 'Kaswa Paintaing', price: '3000.00', mainImage: 'images/10.jpg', click_count: 70 },
        ];


        function generateProductHtml(product) {
            // detail.html?id=...
            const detailUrl = `detail.html?id=${product._id}`;
            // Use product.mainImage for the image source
            const imageUrl = product.mainImage || 'images/default.jpg'; 

            return `
                <div class="product" data-id="${product._id}">
                    <div class="image">
                        <img src="${imageUrl}" alt="${product.title}">
                    </div>
                    <div class="info">
                        <h6>${product.title}</h6>
                        <h5 data-price="${product.price}">$${product.price}</h5>
                        <button class="view-details-btn" onclick="window.location.href='${detailUrl}'">VIEW DETAILS</button>
                    </div>
                </div>
            `;
        }

        async function fetchProductsAndRender() {
            let products = [];
            
            try {
                const response = await fetch(API_URL); 

                if (response.ok) {
                    products = await response.json();
                } else {
                    // API fetch failed, using mock data
                    products = MOCK_PRODUCTS;
                }
            } catch (error) {
                // Network error, using mock data
                products = MOCK_PRODUCTS;
            }

            // 1. Sort products based on 'click_count' (descending) 
            products.sort((a, b) => (b.click_count || 0) - (a.click_count || 0));

            // 2. Limit to the top 9 products
            products = products.slice(0, 9);


            // 3. Render the sorted and limited products
            if (PRODUCTS_CONTAINER) {
                PRODUCTS_CONTAINER.innerHTML = ''; // Clear existing content

                if (products.length === 0) {
                    PRODUCTS_CONTAINER.innerHTML = '<p style="text-align: center; width: 100%;">No artwork found.</p>';
                    return;
                }
                
                let productsHtml = '';
                products.forEach(product => {
                    productsHtml += generateProductHtml(product);
                });

                PRODUCTS_CONTAINER.innerHTML = productsHtml;
            }
        }
        
        // ===========================================
        // === PAGE SCROLLING LOGIC (Existing) ===
        // ===========================================
        
        // Function to scroll to the top
        function scrollToTop() {
            window.scrollTo({
         
                       top: 0,
                behavior: 'smooth'
            });
 }

        // Function to scroll down by a calculated amount
        function scrollToNextSection() {
            // Scroll down by 80% of the viewport height for a noticeable jump
            const scrollDistance = window.innerHeight * 0.8;
 window.scrollBy({
                top: scrollDistance,
                behavior: 'smooth'
            });
 }

        // Function to show/hide the 'Scroll Up' button
        function toggleScrollUpButton() {
            // Show button if user has scrolled down more than 300px
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                scrollUpBtn.classList.add('show');
 } else {
                scrollUpBtn.classList.remove('show');
 }
        }

        // ===========================================
        // === ADVERTISEMENT POPUP LOGIC (Prevents Re-show if already visible) ===
        // ===========================================
        
        function showAdPopup() {
            if (!rightAdPopup) return;
            // Check if ad is already visible 
            if (rightAdPopup.classList.contains('show') && rightAdPopup.style.display !== 'none') {
                setTimeout(showAdPopup, 5000); 
 return; 
            }

            // If not visible, show it
            rightAdPopup.style.display = 'block';
 setTimeout(() => {
                rightAdPopup.classList.add('show');
            }, 50);
            // Set the next timer to re-check after 5 seconds
            setTimeout(showAdPopup, 5000);
 }

        function hideAdPopup() {
            if (rightAdPopup) {
                rightAdPopup.classList.remove('show');
                // Wait for the transition to finish before hiding display
                setTimeout(() => {
                    rightAdPopup.style.display = 'none';
                    // Immediately set a new timer so it reappears after 5 seconds
                    setTimeout(showAdPopup, 5000); 
                }, 300);
 }
        }
        
        // Attach close event listener
        if (adCloseBtn) {
            adCloseBtn.addEventListener('click', hideAdPopup);
 }
        
        // --- Initialization on Load ---
        document.addEventListener('DOMContentLoaded', () => {
            // Fetch products and render them sorted by click count
            fetchProductsAndRender();
            
            // Scroll button listeners
            if (scrollUpBtn && scrollDownBtn) {
                
                scrollUpBtn.addEventListener('click', scrollToTop);
                scrollDownBtn.addEventListener('click', scrollToNextSection);
                window.addEventListener('scroll', toggleScrollUpButton);
                toggleScrollUpButton(); // Run once on load to check initial position
            }
            
            // Start the advertising loop 3 seconds after the page loads
            setTimeout(showAdPopup, 3000);
 });