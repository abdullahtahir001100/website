
        // --- CAPTCHA Data and Logic (Existing) ---
        const CAPTCHA_IMAGES = [
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

                const imageTag = document.createElement('img');
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
            openMenuIcon.style.display = navLinks.classList.contains('active') ? 'none' : 'block';
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
                        console.log("Registration form submission successful!");

                        const modalBox = document.querySelector('.modal-box');
                        const successMessage = document.createElement('div');
                        successMessage.textContent = "Registration successful! (Data would now be sent to the server.)";
                        successMessage.className = 'error-message temp-message';
                        successMessage.style.cssText = 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; margin-bottom: 10px; padding: 10px; border-radius: 5px; text-align: center;';

                        const existingMessage = modalBox.querySelector('.temp-message');
                        if (existingMessage) {
                            modalBox.removeChild(existingMessage);
                        }
                        modalBox.insertBefore(successMessage, modalBox.querySelector('.modal-title').nextSibling);
                        setTimeout(() => {
                            if (modalBox.contains(successMessage)) {
                                modalBox.removeChild(successMessage);
                            }
                            registerForm.reset();
                            CAPTCHA_VERIFIED_INPUT.value = 'false';
                            CAPTCHA_CHECK_DISPLAY.classList.remove('checked');
                            CAPTCHA_CHECK_DISPLAY.setAttribute('aria-checked', 'false');
                            CAPTCHA_ERROR.style.display = 'none';

                        }, 3000);
                    } else {
                        console.log("Registration form validation failed.");
                    }
                });
            }

            showView('loginView');
        });
        // ===========================================
        // === UPDATED ADD TO CART & LOCALSTORAGE LOGIC (Existing) ===
        // ===========================================

        const cartNotificationOverlay = document.getElementById('cartNotificationOverlay');
        const cartNotificationBox = cartNotificationOverlay ? cartNotificationOverlay.querySelector('.cart-notification-box') : null;
        const cartCountElement = document.getElementById('cart-count');
        const scrollUpBtn = document.getElementById('scrollUpBtn');
        const scrollDownBtn = document.getElementById('scrollDownBtn');
        
        // ADVERTISEMENT ELEMENTS
        const rightAdPopup = document.getElementById('rightAdPopup');
        const adCloseBtn = document.getElementById('adCloseBtn');


        // Function to show the success popup
        function showCartNotification() {
            if (cartNotificationOverlay && cartNotificationBox) {
                cartNotificationOverlay.style.display = 'flex';
                setTimeout(() => {
                    cartNotificationBox.classList.add('show');
                }, 10);
                // Hide the popup automatically after 3 seconds
                setTimeout(() => {
                    cartNotificationBox.classList.remove('show');
                    setTimeout(() => {
                        cartNotificationOverlay.style.display = 'none';
                    }, 300); // Wait for transition to finish
                }, 3000);
            }
        }

        // Function: Update the cart item count displayed in the header
        function updateCartCount() {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            // Calculate the total quantity by summing the 'qty' of all items
            const totalItems = cart.reduce((total, item) => total + item.qty, 0);

            if (cartCountElement) {
                if (totalItems > 0) {
                    // Display the count if there are items
                    cartCountElement.textContent = totalItems;
                    cartCountElement.style.display = 'block'; // Show the counter
                } else {
                    // Hide the counter if the cart is empty
                    cartCountElement.style.display = 'none';
                }
            }
        }

        // Function to handle adding the item to the cart
        function addToCart(e) {
            e.preventDefault();
            // Find the closest product container element
            const productDiv = e.target.closest('.product');
            if (!productDiv) return;

            // Extract product details
            const productId = productDiv.getAttribute('data-id');
            const productTitle = productDiv.querySelector('.info h6').textContent.trim();
            const priceElement = productDiv.querySelector('.info h5');
            const productPrice = priceElement.getAttribute('data-price');
            const productImage = productDiv.querySelector('.image img').getAttribute('src');
            if (!productId || !productTitle || !productPrice || !productImage) {
                console.error("Missing required product data attributes. Check product HTML structure.");
                return;
            }

            // Create new item object
            const newItem = {
                id: productId,
                title: productTitle,
                price: productPrice,
                image: productImage,
                qty: 1,
                selectVal: 'Original'
            };
            // 1. Load current cart from localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // 2. Check if the item already exists in the cart (by ID)
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                // If it exists, just increase the quantity (optional: cap at max 5)
                if (existingItem.qty < 5) {
                    existingItem.qty++;
                }
            } else {
                // If new, add it
                cart.push(newItem);
            }

            // 3. Save updated cart back to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            // 4. Show confirmation popup
            showCartNotification();
            // 5. Update cart count after adding an item
            updateCartCount();
            console.log(`Product ID ${productId} added/updated in cart.`, cart);
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
        // === UPDATED: ADVERTISEMENT POPUP LOGIC (Prevents Re-show if already visible) ===
        // ===========================================
        
        function showAdPopup() {
            if (!rightAdPopup) return; 

            // Check if ad is already visible (display: block AND has 'show' class for transition)
            if (rightAdPopup.classList.contains('show') && rightAdPopup.style.display !== 'none') {
                console.log("Ad already visible. Skipping re-display.");
                // Set the next timer to re-check after 5 seconds
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
                    // if the user closes it manually.
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
            // Target buttons with the class 'add-to-cart-btn'
            const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', addToCart);
            });
            // Load the current cart count when the page loads
            updateCartCount();
            
            // Scroll button listeners
            if (scrollUpBtn && scrollDownBtn) {
                scrollUpBtn.addEventListener('click', scrollToTop);
                scrollDownBtn.addEventListener('click', scrollToNextSection);
                window.addEventListener('scroll', toggleScrollUpButton);
                toggleScrollUpButton(); // Run once on load to check initial position
            }
            
            // Start the advertising loop 5 seconds after the page loads
            setTimeout(showAdPopup, 3000); 
        });
