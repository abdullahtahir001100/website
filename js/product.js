document.addEventListener('DOMContentLoaded', () => {
    // --- Product Data ---
    const ALL_PRODUCTS_DATA = [{
            "id": "1",
            "image": "https://i.etsystatic.com/42536102/r/il/5d26c8/6409880809/il_1588xN.6409880809_kgs9.jpg",
            "title": "Geometric Dance",
            "artist": "Tomoki Tanaka",
            "price": "$1,350",
            "dimensions": "20 x 20 in",
            "category": "drawing",
            "style": "minimalism",
            "subject": "abstract",
            "medium": "ink",
            "size": "small",
            "priceRange": "1000-2000",
            "country": "japan",
            "orientation": "square",
            "palette": "monochromatic",
            "color": "black white",
           "smallImages": [
                        "https://res.cloudinary.com/dwnnadeb0/image/upload/v1757088860/products/1757088860744-Gemini_Generated_Image_wps1hjwps1hjwps1.png.jpg",
                        "https://i.etsystatic.com/42536102/r/il/5d26c8/6409880809/il_1588xN.6409880809_kgs9.jpg",
                        "https://i.etsystatic.com/42536102/r/il/33c0a6/6361801646/il_1588xN.6361801646_kjsj.jpg",
                        "https://i.etsystatic.com/42536102/r/il/3e87a0/6409880785/il_1588xN.6409880785_jv12.jpg"
                    ],
            "descriptionText": "A meticulous abstract drawing using sumi ink.",
            "artistBioText": "Tanaka is a Tokyo-based artist focused on line and space."
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
    "size": "small",
    "priceRange": "1000-2000",
    "country": "Japan",
    "orientation": "square",
    "palette": "monochromatic",
    "color": "black white",
    "smallImages": [
      "images/2.jpg",
      "images/3.jpg",
      "images/4.jpg",
      "images/5.jpg"
    ],
    "descriptionText": "A meticulous abstract drawing using sumi ink.",
    "artistBioText": "Tanaka is a Tokyo-based artist focused on line and space."
  },
  {
    "id": "2",
    "image": "images/6.jpg",
    "title": "Golden Whispers",
    "artist": "Aisha Rahman",
    "price": "$950",
    "dimensions": "18 x 24 in",
    "category": "painting",
    "style": "modern",
    "subject": "floral",
    "medium": "acrylic",
    "size": "medium",
    "priceRange": "500-1000",
    "country": "Pakistan",
    "orientation": "portrait",
    "palette": "warm",
    "color": "gold brown",
    "smallImages": [
      "images/7.jpg",
      "images/8a.jpg",
      "images/9.jpg"
    ],
    "descriptionText": "A soft modern painting symbolizing growth and serenity.",
    "artistBioText": "Aisha Rahman blends traditional South Asian art with modern minimalism."
  },
  {
    "id": "3",
    "image": "images/10.jpg",
    "title": "Urban Mirage",
    "artist": "Liam Novak",
    "price": "$2,100",
    "dimensions": "30 x 30 in",
    "category": "digital art",
    "style": "abstract expressionism",
    "subject": "cityscape",
    "medium": "digital",
    "size": "large",
    "priceRange": "2000-3000",
    "country": "USA",
    "orientation": "square",
    "palette": "cool",
    "color": "blue gray white",
    "smallImages": [
      "images/11.jpg",
      "images/1.jpg",
      "images/4.jpg"
    ],
    "descriptionText": "A digital abstraction of city life and motion.",
    "artistBioText": "Novak explores modern digital mediums inspired by fast-paced urban life."
  },
  {
    "id": "4",
    "image": "images/9.jpg",
    "title": "Serenity Bloom",
    "artist": "Mei Lin",
    "price": "$780",
    "dimensions": "16 x 20 in",
    "category": "painting",
    "style": "realism",
    "subject": "nature",
    "medium": "watercolor",
    "size": "medium",
    "priceRange": "500-1000",
    "country": "China",
    "orientation": "landscape",
    "palette": "soft",
    "color": "green pink white",
    "smallImages": [
      "images/1.jpg",
      "images/1a.jpg",
      "images/2a.jpg"
    ],
    "descriptionText": "A calming watercolor that captures the delicate rhythm of spring.",
    "artistBioText": "Mei Lin is a watercolor artist specializing in delicate, nature-inspired themes."
  },
  {
    "id": "5",
    "image": "images/2a.jpg",
    "title": "Echoes of Time",
    "artist": "Carlos Mendes",
    "price": "$1,800",
    "dimensions": "24 x 36 in",
    "category": "mixed media",
    "style": "contemporary",
    "subject": "abstract",
    "medium": "mixed",
    "size": "large",
    "priceRange": "1500-2000",
    "country": "Brazil",
    "orientation": "landscape",
    "palette": "earthy",
    "color": "brown beige gold",
    "smallImages": [
      "images/4.jpg",
      "images/5.jpg",
      "images/9.jpg"
    ],
    "descriptionText": "A layered composition representing the passing of eras.",
    "artistBioText": "Carlos Mendes merges texture and color to express the essence of memory."
  },
  {
    "id": "6",
    "image": "images/5.jpg",
    "title": "Crimson Horizon",
    "artist": "Sara Noor",
    "price": "$1,250",
    "dimensions": "22 x 22 in",
    "category": "painting",
    "style": "abstract minimalism",
    "subject": "landscape",
    "medium": "oil",
    "size": "medium",
    "priceRange": "1000-1500",
    "country": "UAE",
    "orientation": "square",
    "palette": "vibrant",
    "color": "red orange gold",
    "smallImages": [
      "images/6.jpg",
      "images/7.jpg",
      "images/8a.jpg"
    ],
    "descriptionText": "A bold and fiery abstraction inspired by desert sunsets.",
    "artistBioText": "Sara Noor paints minimalist landscapes evoking emotion through color balance."
  },
        {
            "id": "2",
            "image": "images/10.jpg",
            "title": "Quaran Caligraphy",
            "artist": "Areeba Tahir",
            "price": "Rs 8500",
            "dimensions": "30 x 30 in",
            "category": "painting",
            "style": "minimalism",
            "subject": "abstract",
            "medium": "acrylic",
            "size": "medium",
            "priceRange": "500-1000",
            "country": "usa",
            "orientation": "square",
            "palette": "cool",
            "color": "blue white grey",
            "smallImages": [
                        "https://res.cloudinary.com/dwnnadeb0/image/upload/v1757088860/products/1757088860744-Gemini_Generated_Image_wps1hjwps1hjwps1.png.jpg",
                        "https://i.etsystatic.com/42536102/r/il/5d26c8/6409880809/il_1588xN.6409880809_kgs9.jpg",
                        "https://i.etsystatic.com/42536102/r/il/33c0a6/6361801646/il_1588xN.6361801646_kjsj.jpg",
                        "https://i.etsystatic.com/42536102/r/il/3e87a0/6409880785/il_1588xN.6409880785_jv12.jpg"
                    ],
            "descriptionText": "Al-Quran Calligraphy is a sacred form of Islamic art.",
            "artistBioText": "Areeba's work focuses on spiritual Arabic script."
        },
        {
            "id": "3",
            "image": "images/3a.jpg",
            "title": "Desert Horizon",
            "artist": "Lisa Chen",
            "price": "$900",
            "dimensions": "18 x 24 in",
            "category": "painting",
            "style": "abstract",
            "subject": "landscape",
            "medium": "oil",
            "size": "small",
            "priceRange": "500-1000",
            "country": "usa",
            "orientation": "portrait",
            "palette": "warm",
            "color": "orange brown",
            "smallImages": [],
            "descriptionText": "Desert Horizon captures the heat and stillness of the American Southwest.",
            "artistBioText": null
        },
        //{
        //     "id": "4",
        //     "image": "https://images.unsplash.com/photo-1579783900882-c94e4e9a3f29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MjY4Mzh8MHwxfGFsbHwzfHx8fHx8fDF8fDE3NTcwODg4NjB8&ixlib=rb-4.0.3&q=80&w=1080",
        //     "title": "Urban Blur",
        //     "artist": "Anya Sharma",
        //     "price": "$1,100",
        //     "dimensions": "40 x 30 in",
        //     "category": "photography",
        //     "style": "impressionism",
        //     "subject": "cityscape",
        //     "medium": "digital",
        //     "size": "medium",
        //     "priceRange": "1000-2000",
        //     "country": "india",
        //     "orientation": "portrait",
        //     "palette": "vibrant",
        //     "color": "red black yellow",
        //     "smallImages": [],
        //     "descriptionText": "A dynamic, high-energy photograph capturing motion and light in a busy metropolis.",
        //     "artistBioText": "Sharma's photography blurs the line between reality and emotion."
        // }
    ];

    const productGrid = document.getElementById('artGallery');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-icon');
    const searchBar = document.getElementById('searchBar'); // New element reference

    // Helper to prevent XSS issues
    function escapeHtml(str) {
        return String(str)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    // --- 1. Get Current Filter State (Same as before) ---
    function getActiveState() {
        const activeState = {
            searchQuery: (searchInput.value || '').toLowerCase().trim()
        };

        const checkboxes = document.querySelectorAll('.sidebar input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            const type = checkbox.getAttribute('data-filter-type');
            if (!type) return;
            if (!activeState[type]) {
                activeState[type] = new Set();
            }
            activeState[type].add(String(checkbox.value).toLowerCase());
        });

        const colorSwatches = document.querySelectorAll('.color-swatch.selected');
        if (colorSwatches.length > 0) {
            activeState['color'] = new Set();
            colorSwatches.forEach(swatch => {
                const col = swatch.getAttribute('data-color');
                if (col) activeState['color'].add(col.toLowerCase());
            });
        }

        return activeState;
    }

    // --- 2. Filter Logic (Same as before) ---
    function filterProducts(products, state) {
        return products.filter(product => {

            if (state.searchQuery) {
                const q = state.searchQuery;
                const searchFields = [
                    (product.title || '').toLowerCase(),
                    (product.artist || '').toLowerCase(),
                    (product.style || '').toLowerCase(),
                    (product.descriptionText || '').toLowerCase()
                ];
                const matchesSearch = searchFields.some(field => field.includes(q));
                if (!matchesSearch) return false;
            }

            for (const type in state) {
                if (type === 'searchQuery') continue;
                const activeValues = state[type]; 

                if (activeValues instanceof Set && activeValues.size > 0) {
                    const productValueRaw = product[type];
                    if (!productValueRaw) return false; 

                    const requiredValues = Array.from(activeValues);

                    if (type === 'color') {
                        const productColors = String(productValueRaw).toLowerCase().split(/\s+/);
                        const matchesColor = requiredValues.some(activeColor => productColors.includes(activeColor));
                        if (!matchesColor) return false; 
                    } else {
                        const productValue = String(productValueRaw).toLowerCase();
                        const matches = requiredValues.some(rv => rv === productValue);
                        if (!matches) return false; 
                    }
                }
            }

            return true;
        });
    }

    // --- 3. Product Card Generation (Same as before) ---
    function createProductCard(product) {
        // ... (Card creation logic is unchanged)
        const cardLink = document.createElement('a');
        cardLink.classList.add('art-card');
        cardLink.href = `detail.html?id=${product.id}`; 
        cardLink.setAttribute('aria-label', product.title || 'art item');

        cardLink.addEventListener('click', () => {
            try {
                localStorage.setItem('selectedProduct', JSON.stringify(product));
            } catch (err) {
                console.warn('Could not save selectedProduct to localStorage', err);
            }
        });

        const safeTitle = escapeHtml(product.title || '');
        const safeArtist = escapeHtml(product.artist || '');
        const safeDimensions = escapeHtml(product.dimensions || '');
        const safePrice = escapeHtml(product.price || '');
        const imgSrc = product.image || '';

        cardLink.innerHTML = `
            <div class="card-image-container">
                <img src="${imgSrc}" alt="${safeTitle}" class="card-image" loading="lazy">
                <div class="overlay-icons">
                    <button class="icon quick-view" aria-label="Quick View" type="button">👁️</button>
                    <button class="icon add-to-cart" aria-label="Add to Cart" type="button" data-product-id="${product.id}">🛒</button>
                </div>
            </div>
            <div class="card-info">
                <h3 class="title">${safeTitle}</h3>
                <p class="artist">${safeArtist}</p>
                <p class="dimensions">${safeDimensions}</p>
                <p class="price">${safePrice}</p>
            </div>
        `;

        const addToCartBtn = cardLink.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault(); 
                e.stopPropagation(); 
                console.log(`Added Product ID ${product.id} to cart!`);
                alert(`Added ${safeTitle} to cart!`);
            });
        }

        return cardLink;
    }

    // --- 4. Main Render Function (Same as before) ---
    function renderFilteredProducts() {
        const activeState = getActiveState();
        const filteredProducts = filterProducts(ALL_PRODUCTS_DATA, activeState);

        if (!productGrid) return;

        productGrid.innerHTML = '';

        if (filteredProducts.length === 0) {
            productGrid.style.display = 'block';
            productGrid.innerHTML = `
                <p class="no-results-message" style="padding: 50px 0; text-align: center; color: #555; font-size: 1.2em; grid-column: 1 / -1;">
                    😔 Sorry, no art matches your current selection. Try broadening your search!
                </p>
            `;
        } else {
            productGrid.style.display = 'grid';
            filteredProducts.forEach(product => {
                const card = createProductCard(product);
                productGrid.appendChild(card);
            });
        }
    }

    // --- 5. Event Listeners ---

    // **NEW** Search Bar Toggle Logic
    const handleSearchToggle = () => {
        // 1. Check if the bar is currently expanded
        const isExpanded = searchBar.classList.contains('active');
        
        if (isExpanded) {
            // If expanded AND input has text, run the search logic
            if (searchInput.value.trim() !== "") {
                renderFilteredProducts();
            } else {
                // If expanded and empty, collapse the bar
                searchBar.classList.remove('active');
            }
        } else {
            // If collapsed, expand the bar and focus the input
            searchBar.classList.add('active');
            searchInput.focus();
        }
    };
    
    // Attach the new handler to the search button click
    if (searchButton) searchButton.addEventListener('click', handleSearchToggle);
    
    // Only run search if Enter is pressed while expanded
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => { 
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                renderFilteredProducts();
                searchInput.blur(); // Optional: remove focus after search
            }
        });
    }

    // Filters and Color Swatches
    const filterControls = document.querySelectorAll('.sidebar input[type="checkbox"], .color-swatch');
    filterControls.forEach(control => {
        control.addEventListener(control.tagName === 'INPUT' ? 'change' : 'click', function() {
            if (this.classList.contains('color-swatch')) {
                this.classList.toggle('selected');
            }
            renderFilteredProducts();
        });
    });

    // Mobile Menu Toggle (Same as before)
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') ? '<img src="images/close.png" alt="">' : '<img src="images/ui.png" alt="">';
            menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        });
    }

    // Filter Header Collapse/Expand (Same as before)
    const filterHeaders = document.querySelectorAll('.filter-header');
    filterHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('collapsed');
            const container = this.nextElementSibling;
            if (container) {
                container.classList.toggle('collapsed');
            }
        });
        
        if (window.innerWidth < 768) {
            header.classList.add('collapsed');
            const container = header.nextElementSibling;
            if (container) container.classList.add('collapsed');
        }
    });

    // --- Initial Load ---
    renderFilteredProducts();
});