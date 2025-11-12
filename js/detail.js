  
        document.addEventListener('DOMContentLoaded', () => {

            // --- Product Data Logic ---
            const getSelectedProduct = () => {
                try {
                    const storedData = localStorage.getItem('selectedProduct');
                    return storedData ? JSON.parse(storedData) : null;
                } catch (e) {
                    console.error("Error reading or parsing selected product from localStorage:", e);
                    return null;
                }
            };

            const mainProduct = getSelectedProduct();

            if (!mainProduct) {
                console.error("No product found in localStorage. Displaying static content.");
                // Optionally redirect or display an error message here
                return;
            }

            const productImage = document.querySelector('.product-image');
            const productTitle = document.querySelector('.product-title');
            const productPrice = document.querySelector('.product-price');
            const summaryText = document.querySelector('.summary-text');
            const featuresList = document.querySelector('.features-box ul');

            function renderMainProduct(product) {
                if (productImage) productImage.src = product.image;
                if (productTitle) productTitle.textContent = product.title;
                if (productPrice) productPrice.textContent = product.price;

                if (summaryText) {
                    summaryText.textContent = `A stunning original piece, "${product.title}", by ${product.artist}. This ${product.category} is executed in the **${product.style}** style using ${product.medium} medium, measuring ${product.dimensions}. It is a unique piece, part of our curated collection.`;
                }

                if (featuresList) {
                    featuresList.innerHTML = `
                        <li>**Medium:** ${product.medium} on Canvas</li>
                        <li>**Style:** ${product.style}</li>
                        <li>**Subject:** ${product.subject}</li>
                        <li>**Dimensions:** ${product.dimensions}</li>
                    `;
                }

                document.title = `${product.title} | ARTIFY`;
                renderTabContent(product);
            }

            function renderTabContent(product) {
                const descriptionContent = product.descriptionText ||
                    `<p>This original piece, titled **${product.title}**, is a powerful example of the **${product.style}** movement. The artist, **${product.artist}**, masterfully employs form and color to evoke a profound sense of tranquility and balance. The controlled use of **${product.color}** ${product.medium} on canvas creates depth and texture, allowing the viewer's eye to complete the ${product.subject} theme. This unique work is accompanied by a Certificate of Authenticity (COA) guaranteeing its origin and singularity.</p>`;

                const artistContent = product.artistBioText ||
                    `<p>Based in the **${product.country}**, ${product.artist} is known for their work in the ${product.style} style. Their journey is marked by a dedication to ${product.medium}, line work, and spatial relationships. This particular piece, **${product.title}**, represents a deep exploration of the ${product.subject} subject. Their works are held in private collections across the globe. Acquiring a work by ${product.artist} is an investment in a pure, lasting vision of modern aesthetics.</p>`;

                const descriptionPane = document.getElementById('description');
                if (descriptionPane) {
                    descriptionPane.innerHTML = `
                        <h3>Conceptual Vision: A Study in Space and Light</h3>
                        ${descriptionContent}
                        
                        <h4>Technical Specifications:</h4>
                        <ul class="spec-list">
                            <li>**Artist:** ${product.artist}</li>
                            <li>**Medium:** ${product.medium} on Canvas</li>
                            <li>**Dimensions:** ${product.dimensions}</li>
                            <li>**Orientation:** ${product.orientation}</li>
                            <li>**Style:** ${product.style}</li>
                            <li>**Condition:** New, Original Artwork.</li>
                        </ul>

                        <p class="tab-quote">
                            "Art should feel inevitable, like the horizon." — ${product.artist} (Placeholder Quote).
                        </p>
                    `;
                }

                const artistPane = document.getElementById('artist');
                if (artistPane) {
                    artistPane.innerHTML = `
                        <h3>${product.artist}: The Artist's Vision</h3>
                        ${artistContent}
                        
                        <div class="highlight-box">
                            <p>This original work is signed by ${product.artist}, guaranteeing its authenticity.</p>
                        </div>
                    `;
                }
            }

            function renderSmallImages(product) {
                if (!product.smallImages || product.smallImages.length === 0) return;

                let smallImgsContainer = document.querySelector('.small-images-container');
                if (!smallImgsContainer) {
                    smallImgsContainer = document.createElement('div');
                    smallImgsContainer.classList.add('small-images-container');
                    document.querySelector('.image-wrapper').after(smallImgsContainer);
                }
                smallImgsContainer.innerHTML = '';

                product.smallImages.forEach(src => {
                    const imgWrapper = document.createElement('div');
                    imgWrapper.classList.add('small-img-wrapper');

                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = `Thumbnail for ${product.title}`;
                    img.classList.add('small-img-thumbnail');

                    if (productImage && src === productImage.src) {
                        img.classList.add('active-thumbnail');
                    }

                    img.addEventListener('click', (e) => {
                        if (productImage) productImage.src = e.target.src;
                        document.querySelectorAll('.small-img-thumbnail').forEach(t => t.classList.remove('active-thumbnail'));
                        e.target.classList.add('active-thumbnail');
                    });

                    imgWrapper.appendChild(img);
                    smallImgsContainer.appendChild(imgWrapper);
                });
            }

            const MOCK_ALL_PRODUCTS_DATA = [
                {
                    "id": "2",
                    "image": "https://res.cloudinary.com/dwnnadeb0/image/upload/v1757088860/products/1757088860744-Gemini_Generated_Image_wps1hjwps1hjwps1.png.jpg",
                    "title": "Clean Lines",
                    "artist": "Lisa Chen",
                    "price": "$850",
                    "dimensions": "15 x 30 in",
                    "category": "painting",
                    "style": "minimalism",
                    "subject": "landscape",
                    "medium": "acrylic",
                    "size": "medium",
                    "priceRange": "500-1000",
                    "country": "usa",
                    "orientation": "landscape",
                    "palette": "cool",
                    "color": "blue white grey",
                    "smallImages": [
                        "https://res.cloudinary.com/dwnnadeb0/image/upload/v1757088860/products/1757088860744-Gemini_Generated_Image_wps1hjwps1hjwps1.png.jpg",
                        "https://i.etsystatic.com/42536102/r/il/5d26c8/6409880809/il_1588xN.6409880809_kgs9.jpg",
                        "https://i.etsystatic.com/42536102/r/il/33c0a6/6361801646/il_1588xN.6361801646_kjsj.jpg",
                        "https://i.etsystatic.com/42536102/r/il/3e87a0/6409880785/il_1588xN.6409880785_jv12.jpg"
                    ],
                    "descriptionText": null,
                    "artistBioText": "Lisa Chen's work, often recognized by its striking simplicity and profound use of color theory, has earned her international acclaim. She focuses on the essential communication of form and space, a philosophy derived from her architectural background. Her acrylic paintings are deliberate, highly structured, and deeply meditative. She lives and works in the Arizona desert, which inspires her palette."
                },
                {
                    "id": "3",
                    "image": "images/5.jpg",
                    "title": "Desert Horizon",
                    "artist": "Lisa Chen",
                    "price": "$900",
                    "dimensions": "18 x 24 in",
                    "category": "painting",
                    "style": "abstract",
                    "subject": "landscape",
                    "medium": "oil",
                    "size": "medium",
                    "priceRange": "500-1000",
                    "country": "usa",
                    "orientation": "portrait",
                    "palette": "warm",
                    "color": "orange brown",
                    "smallImages": [],
                    "descriptionText": "<p>Desert Horizon is a highly textural oil painting that captures the heat and stillness of the American Southwest. Using thick impasto techniques and a brush-knife, Chen builds layers of warm **orange and deep brown**, suggesting both the vastness of the land and the minute details of the desert flora. This piece is a powerful focal point and is ready for archival framing.</p>",
                    "artistBioText": null
                },
                {
                    "id": "1",
                    "image": "images/1.jpg",
                    "title": "Geometric Dance",
                    "artist": "Tomoki Tanaka",
                    "price": "$1,350",
                    "dimensions": "20 x 20 in",
                    "category": "drawing",
                    "style": "minimalism",
                    "subject": "abstract",
                    "medium": "ink",
                    "size": "medium",
                    "priceRange": "1000-2000",
                    "country": "japan",
                    "orientation": "square",
                    "palette": "monochromatic",
                    "color": "black white",
                    "smallImages": []
                }
            ];

            function renderRelatedProducts(product, allProducts) {
                const relatedProductsGrid = document.querySelector('.related-products .product-grid');
                if (!relatedProductsGrid) return;
                relatedProductsGrid.innerHTML = '';

                // Logic to select related products (same style/artist)
                const related = allProducts.filter(p => p.id !== product.id && (p.style === product.style || p.artist === product.artist));

                const fallbackCount = 4 - related.length;
                if (related.length < 4) {
                    const otherProducts = allProducts.filter(p => p.id !== product.id && related.every(r => r.id !== p.id));
                    related.push(...otherProducts.slice(0, fallbackCount));
                }

                related.slice(0, 4).forEach(relatedProduct => {
                    const card = document.createElement('a');
                    card.href = '#';
                    card.classList.add('product-card');

                    card.addEventListener('click', (e) => {
                        e.preventDefault();
                        // When a related product is clicked, save it and reload the page
                        localStorage.setItem('selectedProduct', JSON.stringify(relatedProduct));
                        window.location.reload();
                    });

                    card.innerHTML = `
                        <div class="product-card-image-wrapper">
                            <img src="${relatedProduct.image}" alt="${relatedProduct.title}">
                        </div>
                        <div class="product-card-info">
                            <h3 class="product-card-title">${relatedProduct.title}</h3>
                            <p class="product-card-category">${relatedProduct.category}</p>
                            <p class="product-card-price">${relatedProduct.price}</p>
                        </div>
                    `;
                    relatedProductsGrid.appendChild(card);
                });
            }


            // --- Initialization ---
            if (mainProduct) {
                renderMainProduct(mainProduct);
                renderSmallImages(mainProduct);
                renderRelatedProducts(mainProduct, MOCK_ALL_PRODUCTS_DATA);
            }

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
                quantityInput.addEventListener('change', function() {
                    if (this.value < 1) this.value = 1;
                    // Example: limit to 5
                    if (this.value > 5) this.value = 5; 
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
                        customButton.innerHTML = option.innerHTML + '<span class="arrow"></span>';
                    }

                    itemDiv.addEventListener('click', function(e) {
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
                customButton.addEventListener('click', function(e) {
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
                document.addEventListener('click', function(e) {
                    if (!wrapper.contains(e.target)) {
                        closeAllSelect();
                    }
                });
            }

            // --- Add to Cart Button Logic ---
            document.getElementById("add-to-cart-btns").addEventListener("click", () => {
                const title = document.querySelector(".product-title").textContent.trim();
                const price = document.querySelector(".product-price").textContent.trim();
                const selectVal = document.querySelector("#hidden-native-select")?.value || "Unframed";
                const image = document.querySelector(".product-image").src;
                const qty = parseInt(document.getElementById("quantity").value) || 1;

                const product = {
                    title,
                    price,
                    image,
                    qty,
                    selectVal
                };
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                cart.push(product);
                localStorage.setItem("cart", JSON.stringify(cart));

                const popup = document.getElementById('cartPopup');
                if (popup) {
                    popup.classList.add('show');
                    setTimeout(() => popup.classList.remove('show'), 2500);
                }
            });

            const nativeSelect = document.querySelector('#hidden-native-select');
            if (nativeSelect) {
                nativeSelect.addEventListener('change', () => {
                    console.log("Selected option:", nativeSelect.value);
                });
            }
        });
        const navLinks = document.getElementById('nav-links');
        const openMenuIcon = document.getElementById('menu-icon');
        const closeMenuIcon = document.getElementById('close-icon');
         window.toggleNav = function () {
            navLinks.classList.toggle('active');
            openMenuIcon.style.display = navLinks.classList.contains('active') ? 'none' : 'block';
            closeMenuIcon.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
        };
   