document.addEventListener('DOMContentLoaded', () => {
    // --- Global Data Store & Constants ---
    let ALL_PRODUCTS_DATA = [];
    let FILTER_OPTIONS = {};

    const productGrid = document.getElementById('artGallery');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-icon');
    const searchBar = document.getElementById('searchBar');
    // Is page ke liye, hum saare products click count descending mein laate hain.
    const API_URL = 'http://localhost:5000/api/products'; 
    const filtersWrapper = document.querySelector('.filters-wrapper');

    // ⭐ NEW: Mapping palette names to actual CSS colors for display
    const colorMap = {
        'monochromatic': '#A0A0A0', // Example grey
        'analogous': '#4CAF50', // Example green/blue tone
        'pastel': '#FFB6C1', // Example light pink
        'vibrant': '#FF0000', // Example red
        'earthy': '#8B4513', // Example brown
        'cool': '#00BFFF', // Example deep sky blue
        'warm': '#FFA500', // Example orange
        // Add more mappings as per your palette values in the backend
    };

    // Helper to prevent XSS issues
    function escapeHtml(str) {
        return String(str)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    // Helper function for collapsing filters
    function toggleFilterCollapse() {
        this.classList.toggle('collapsed');
        const container = this.nextElementSibling;
        if (container) {
            container.classList.toggle('collapsed');
        }
    }

    // ⭐ NEW FUNCTION: Send API call to increment click_count
    async function increaseClickCount(productId) {
        try {
            // Hum detail page ke API ko call kar rahe hain, jo count ko increment karta hai.
            // Hum sirf GET request bhejenge, aur response ko ignore kar denge.
            await fetch(`${API_URL}/${productId}`, {
                method: 'GET'
            });
            // Console mein success message
            console.log(`Click count incremented for product ID: ${productId}`);
        } catch (error) {
            console.error('Failed to increment click count:', error);
            // Error hone par bhi navigation hone denge.
        }
    }


    // --- CORE LOGIC: Dynamic Filter Extraction ---

    function extractUniqueFilters(products) {
        const filters = {
            category: new Set(),
            style: new Set(),
            subject: new Set(),
            medium: new Set(),
            size: new Set(),
            orientation: new Set(),
            palette: new Set(), // Using 'palette'
            priceRange: [
                'under-500', '500-1000', '1000-2000', '2000-5000'
            ]
        };
        const priceDisplayMap = {
            'under-500': 'Under $500',
            '500-1000': '$500 - $1,000',
            '1000-2000': '$1,000 - $2,000',
            '2000-5000': '$2,000 - $5,000'
        };
        products.forEach(product => {
            if (product.category) filters.category.add(product.category);
            if (product.medium) filters.medium.add(product.medium);
            if (product.style) filters.style.add(product.style);
            if (product.subject) filters.subject.add(product.subject);
            if (product.size) filters.size.add(product.size);
            if (product.orientation) filters.orientation.add(product.orientation);

            // Corrected: Use 'palette' field (which is an array)
            if (product.palette && Array.isArray(product.palette)) {
                product.palette.forEach(c => filters.palette.add(c));
            }
        });
        for (const key in filters) {
            if (key === 'priceRange') {
                FILTER_OPTIONS[key] = filters[key].map(value => ({ value: value, display: priceDisplayMap[value] }));
            } else {
                FILTER_OPTIONS[key] = Array.from(filters[key])
                    .filter(v => v && String(v).trim() !== '')
                    .sort()
                    .map(value => ({ value: value, display: value }));
            }
        }

        if (FILTER_OPTIONS.size) {
            FILTER_OPTIONS.size.forEach(option => {
                if (option.value === 'small') option.display = 'Small (up to 20 x 20 in)';
                if (option.value === 'medium') option.display = 'Medium (20 x 20 to 40 x 40 in)';
                if (option.value === 'large') option.display = 'Large (40 x 40 to 60 x 60 in)';
            });
        }
    }

    /**
     * Renders a single filter group using the required HTML structure.
     */
    function renderFilterSection(title, type, options) {
        if (!options || options.length === 0) return '';
        const displayTitle = (type === 'palette' ? 'COLOR' : title.toUpperCase());
        const isPaletteFilter = type === 'palette';
        const isPriceFilter = type === 'priceRange';
        let optionsHtml = '';

        if (isPaletteFilter) {
            optionsHtml = options.map(option => {
                const paletteName = option.value.toLowerCase();
                const actualColor = colorMap[paletteName] || '#CCCCCC';

                const safePaletteName = escapeHtml(option.value);
                
                return `<div class="color-swatch" data-filter-type="palette" data-value="${safePaletteName}" style="background-color:${actualColor};" title="${safePaletteName}"></div>`;
            }).join('');
            optionsHtml = `<div class="filter-options-container color-options">${optionsHtml}</div>`; 
        
        } else {
            optionsHtml = options.map(option => {
                const safeId = `filter-${type}-${option.value.toLowerCase().replace(/\s/g, '-')}`;
                const escapedValue = escapeHtml(option.value);
                const escapedDisplay = escapeHtml(option.display);
                
                return `
                    <label class="filter-item">
                        <input type="checkbox" id="${safeId}" value="${escapedValue}" data-filter-type="${type}">
                        ${escapedDisplay}
                    </label>
                `;
            }).join('');
            optionsHtml = `<div class="filter-options-container">${optionsHtml}</div>`; 
        }

        const colorClass = isPaletteFilter ? ' color-palette-picker' : ''; 

        return `
            <div class="filter-group${colorClass}">
                <h3 class="filter-header">${displayTitle}</h3>
                ${optionsHtml} </div>
        `;
    }

    function renderAllFilters() {
        if (!filtersWrapper) return;
        let filtersHTML = '';
        const filterOrder = ['category', 'style', 'subject', 'medium', 'size', 'orientation', 'priceRange', 'palette'];

        filterOrder.forEach(type => {
            const options = FILTER_OPTIONS[type];
            if (options && options.length > 0) {
                filtersHTML += renderFilterSection(type, type, options);
            }
        });
        filtersWrapper.innerHTML = filtersHTML;

        // Re-attach listeners to dynamic elements
        attachFilterListeners();
        attachFilterHeaderListeners();
    }


    // --- Data Fetching and Product Mapping ---
    async function fetchProducts() {
        if (!productGrid) return;
        productGrid.innerHTML = '<p style="padding: 50px 0; text-align: center;">Fetching artwork and building filters...</p>';
        try {
            // API call now brings all products sorted by click_count descending
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawProducts = await response.json();
            ALL_PRODUCTS_DATA = rawProducts.map(product => ({
                ...product,
                id: product._id,
                image: product.mainImage,
                priceValue: product.price ? parseFloat(product.price) : 0,
                price: typeof product.price === 'number' ? `$${product.price.toLocaleString('en-US')}` : product.price

            }));

            extractUniqueFilters(ALL_PRODUCTS_DATA);
            renderAllFilters();
            renderFilteredProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
            productGrid.innerHTML = `
                <p class="no-results-message" style="padding: 50px 0; text-align: center; color: red; font-size: 1.2em; grid-column: 1 / -1;">
                    ❌ Error loading products.
                    Please check if the API server is running at ${API_URL}.
                </p>
            `;
        }
    }

    // --- Filter State ---

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

        // Handle 'palette' (color) swatches separately
        const paletteSwatches = document.querySelectorAll('.color-swatch.selected[data-filter-type="palette"]');
        if (paletteSwatches.length > 0) {
            activeState['palette'] = new Set();
            paletteSwatches.forEach(swatch => {
                const paletteVal = swatch.getAttribute('data-value');
                if (paletteVal) activeState['palette'].add(paletteVal.toLowerCase());
            });
        }
        
        return activeState;
    }

    // --- Filter Logic ---
    function filterProducts(products, state) {
        return products.filter(product => {
            if (state.searchQuery) {
                const q = state.searchQuery;
                const searchFields = [
                    (product.title || '').toLowerCase(),
                    (product.artist || '').toLowerCase(),
                    (product.style || '').toLowerCase(),
                ];
                const matchesSearch = searchFields.some(field => field.includes(q));

                if (!matchesSearch) return false;
            }

            for (const type in state) {
                if (type === 'searchQuery' || state[type].size === 0) continue;

                const activeValues = state[type];
                const requiredValues = Array.from(activeValues).map(v => 
                    v.toLowerCase());

                let matchesFilter = false;

                if (type === 'priceRange' && product.priceValue !== undefined) {
                    matchesFilter = requiredValues.some(range => {
                        const price = product.priceValue;
                        if (range === 'under-500' && price < 500) return true;
                        if (range === '500-1000' && price >= 500 && price <= 1000) return true;
                        if (range === '1000-2000' && price > 1000 && price <= 2000) return true;
                        if (range === '2000-5000' && price > 2000 && price <= 5000) return true;
                        return false;
                    });
                    if (!matchesFilter) return false;
                    continue;
                }

                if (type === 'size' || type === 'orientation') {
                    const productValueRaw = product[type];
                    if (!productValueRaw) return false;
                    const productValueLower = String(productValueRaw).toLowerCase();
                    matchesFilter = requiredValues.some(rv => rv === productValueLower);
                    if (!matchesFilter) return false;
                    continue;
                }

                // PALETTE (Color) Filter
                if (type === 'palette') {
                    const productPalette = product.palette;
                    if (!productPalette || !Array.isArray(productPalette)) return false;
                    const productValues = productPalette.map(v => String(v).toLowerCase());
                    matchesFilter = requiredValues.some(rv => productValues.includes(rv));

                    if (!matchesFilter) return false;
                    continue;
                }

                // Standard filters (Category, Style, Medium, Subject)
                const productValueRaw = product[type];
                if (!productValueRaw) return false;

                if (Array.isArray(productValueRaw)) {
                    const productValues = productValueRaw.map(v => String(v).toLowerCase());
                    matchesFilter = requiredValues.some(rv => productValues.includes(rv));
                } else if (typeof productValueRaw === 'string') {
                    const productValueLower = productValueRaw.toLowerCase();
                    matchesFilter = requiredValues.some(rv => rv === productValueLower);
                }
                if (!matchesFilter) return false;
            }
            return true;
        });
    }

    // --- Product Card Rendering (MODIFIED) ---
    function createProductCard(product) {
        const cardLink = document.createElement('a');
        cardLink.classList.add('art-card');
        cardLink.href = `detail.html?id=${product.id}`; // Navigation link
        // ⭐ NEW: Add listener to link to increment click count before navigation
        cardLink.addEventListener('click', (e) => {
             // e.preventDefault(); // Don't prevent navigation, just do the API call first
             increaseClickCount(product.id);
             // The browser will continue the navigation to 'detail.html?id=...'
        });


        const safeTitle = escapeHtml(product.title || '');
        const safeArtist = escapeHtml(product.artist || '');
        const safePrice = escapeHtml(product.price || '');
        const imgSrc = product.image || 'images/placeholder.png';
        cardLink.innerHTML = `
            <div class="card-image-container">
                <img src="${imgSrc}" alt="${safeTitle}" class="card-image" loading="lazy">
                <div class="overlay-icons">
                    <button class="icon quick-view" aria-label="Quick View" type="button">👁️</button>
                    <button class="icon add-to-cart" 
                        aria-label="Add to Cart" type="button" data-product-id="${product.id}">🛒</button>
                </div>
            </div>
            <div class="card-info">
                <h3 class="title">${safeTitle}</h3>
                <p class="artist">${safeArtist}</p>
                <p class="price">${safePrice}</p>
    
            </div>
        `;
        const addToCartBtn = cardLink.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent link navigation
                e.stopPropagation(); // Stop event from bubbling up to the cardLink
                alert(`Added ${safeTitle} to cart!`);
                // Note: Agar aap cart mein add karte hain, toh click count nahi badhega.
            });
        }

        return cardLink;
    }

    function renderFilteredProducts() {
        const activeState = getActiveState();
        const filteredProducts = filterProducts(ALL_PRODUCTS_DATA, activeState);

        if (!productGrid) return;

        productGrid.innerHTML = '';
        if (filteredProducts.length === 0) {
            productGrid.style.display = 'block';
            productGrid.innerHTML = `
                <p class="no-results-message" style="padding: 50px 0; text-align: center; color: #555; font-size: 1.2em; grid-column: 1 / -1;">
                    😔 Sorry, no art matches your current selection.
                    Try broadening your search!
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

    // --- Event Listeners Setup ---

    function attachFilterListeners() {
        const filterControls = document.querySelectorAll('.sidebar input[type="checkbox"]');
        filterControls.forEach(control => {
            control.removeEventListener('change', renderFilteredProducts);
            control.addEventListener('change', renderFilteredProducts);
        });
        
        const paletteSwatches = document.querySelectorAll('.color-swatch[data-filter-type="palette"]');
        paletteSwatches.forEach(swatch => {
            swatch.removeEventListener('click', handlePaletteSwatchClick);
            swatch.addEventListener('click', handlePaletteSwatchClick);
        });
    }

    function handlePaletteSwatchClick() {
        this.classList.toggle('selected');
        renderFilteredProducts();
    }

    function attachFilterHeaderListeners() {
        const filterHeaders = document.querySelectorAll('.filter-header');
        filterHeaders.forEach(header => {
            header.removeEventListener('click', toggleFilterCollapse);
            header.addEventListener('click', toggleFilterCollapse);
        });
    }

    // --- Search Logic ---
    const handleSearchToggle = () => {
        const isExpanded = searchBar.classList.contains('active');
        const query = searchInput.value.trim();

        if (isExpanded) {
            renderFilteredProducts(); 

            if (query === "") { 
                searchBar.classList.remove('active');
            }
        } else {
            searchBar.classList.add('active');
            searchInput.focus();
        }
    };

    if (searchButton) searchButton.addEventListener('click', handleSearchToggle);

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                renderFilteredProducts();
                searchInput.blur();
            }
        });
    }

    // --- Initial Load ---
    fetchProducts();
});