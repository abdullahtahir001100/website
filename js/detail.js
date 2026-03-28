
    let loading = false;

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // API & STATE
    // ----------------------------------------------------
    const API_URL = 'https://backend-web-1-yb6q.vercel.app/api/products'; 
    const REVIEWS_API_URL = 'https://backend-web-1.vercel.app/api/reviews';
    let ALL_PRODUCTS_DATA = [];

    // ----------------------------------------------------
    // ELEMENTS
    // ----------------------------------------------------
    const els = {
        imgFrame: document.querySelector('.main-image-frame img'),
        thumbsContainer: document.querySelector('.gallery-thumbnails'),
        title: document.querySelector('.product-title'),
        price: document.querySelector('.product-price'),
        collection: document.querySelector('.collection-tag'),
        descText: document.getElementById('description-text'),
        specList: document.getElementById('spec-list'),
        relatedWrapper: document.getElementById('related-swiper-wrapper'),
        reviewsContainer: document.getElementById('reviews-list-container'),
        finishSelect: document.getElementById('finish-select'),
        qtyInput: document.getElementById('quantity'),
        addBtn: document.getElementById('add-to-cart-btns'),
        modal: document.getElementById('productAddedModal'),
        modalImg: document.getElementById('modalProductImage'),
        modalTitle: document.getElementById('modalProductTitle'),
        continueShopBtn: document.getElementById('continueShoppingButton')
    };

    // ----------------------------------------------------
    // INITIALIZATION
    // ----------------------------------------------------
    loadProductDetails();

    // ----------------------------------------------------
    // 1. FETCH PRODUCT
    // ----------------------------------------------------
    async function loadProductDetails() {
        const params = new URLSearchParams(window.location.search);
        // Default ID for testing if none provided
        const productId = params.get('id');

        try {
            if (loading) return;
            loading = true;

            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Network Error");
            
            const rawProducts = await response.json();
            ALL_PRODUCTS_DATA = rawProducts.map(p => ({
                ...p, id: p._id, image: p.mainImage
            }));

            // If no ID, pick first for demo, or find by ID
            const mainProduct = productId 
                ? ALL_PRODUCTS_DATA.find(p => String(p.id) === String(productId))
                : ALL_PRODUCTS_DATA[0];

            if (mainProduct) {
                renderProduct(mainProduct);
                renderReviews(mainProduct.id);
                renderRelated(mainProduct);
                setupCart(mainProduct);
            } else {
                els.title.innerText = "Product Not Found";
            }
        } catch (e) {
            console.error(e);
            els.title.innerText = "Error Loading Product";
        } finally {
            loading = false;
            // Hide Loader
            const loaderOverlay = document.getElementById('loader-overlay');
            if (loaderOverlay) {
                setTimeout(() => {
                    loaderOverlay.classList.add('hidden');
                }, 500); // slight delay for smooth transition
            }
        }
    }
   


    // ----------------------------------------------------
    // 2. RENDER MAIN INFO
    // ----------------------------------------------------
    function renderProduct(product) {
        updateSeoAndStructuredData(product);

        // Text
        if(els.title) els.title.innerText = product.title || "Untitled";
        if(els.price) els.price.innerText = `$${(product.price || 0).toLocaleString()}`;
        if(els.collection) els.collection.innerText = `INKBYHAND • ${product.artist || 'Collection'}`;
        
        // Specs / Desc
        if(els.descText) els.descText.innerHTML = product.description || "No description available.";
        if(els.specList) els.specList.innerHTML = `
            <li><strong>Artist:</strong> ${product.artist || '-'}</li>
            <li><strong>Medium:</strong> ${product.medium || '-'}</li>
            <li><strong>Dimensions:</strong> ${product.dimensions || '-'}</li>
            <li><strong>Style:</strong> ${product.style || '-'}</li>
        `;

        // Images
        if(els.imgFrame) els.imgFrame.src = product.image;
        
        // Thumbnails
        if(els.thumbsContainer) {
            const images = [product.image, ...(product.smallImages || [])].filter((v,i,a) => a.indexOf(v) === i);
            els.thumbsContainer.innerHTML = '';
            images.forEach((src, idx) => {
                const thumb = document.createElement('div');
                thumb.className = `thumb ${idx === 0 ? 'active' : ''}`;
                thumb.innerHTML = `<img src="${src}">`;
                thumb.onclick = () => {
                    els.imgFrame.style.opacity = 0;
                    setTimeout(() => {
                        els.imgFrame.src = src;
                        els.imgFrame.style.opacity = 1;
                    }, 200);
                    
                    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                };
                els.thumbsContainer.appendChild(thumb);
            });
        }
    }

    function upsertMeta(selector, attrName, attrValue, content) {
        let tag = document.querySelector(selector);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attrName, attrValue);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    }

    function updateSeoAndStructuredData(product) {
        const productTitle = product.title || 'INKBYHAND Product';
        const productDescription = (product.description || 'Discover handcrafted INKBYHAND artwork and premium editions.').replace(/<[^>]*>/g, '').slice(0, 240);
        const productImage = product.image || 'https://inkbyhand.store/favicon.png';
        const productId = product.id ? String(product.id) : '';
        const productUrl = productId
            ? `https://inkbyhand.store/detail.html?id=${encodeURIComponent(productId)}`
            : 'https://inkbyhand.store/detail.html';
        const productPrice = Number(product.price || 0);

        document.title = `${productTitle} | INKBYHAND Product Detail`;

        upsertMeta('meta[name="description"]', 'name', 'description', productDescription);
        upsertMeta('meta[property="og:title"]', 'property', 'og:title', `${productTitle} | INKBYHAND`);
        upsertMeta('meta[property="og:description"]', 'property', 'og:description', productDescription);
        upsertMeta('meta[property="og:image"]', 'property', 'og:image', productImage);
        upsertMeta('meta[property="og:url"]', 'property', 'og:url', productUrl);
        upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', `${productTitle} | INKBYHAND`);
        upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', productDescription);
        upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', productImage);

        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', productUrl);

        let jsonLd = document.getElementById('product-jsonld');
        if (!jsonLd) {
            jsonLd = document.createElement('script');
            jsonLd.type = 'application/ld+json';
            jsonLd.id = 'product-jsonld';
            document.head.appendChild(jsonLd);
        }

        const payload = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": productTitle,
            "image": [productImage],
            "description": productDescription,
            "sku": productId || undefined,
            "brand": {
                "@type": "Brand",
                "name": "INKBYHAND"
            },
            "offers": {
                "@type": "Offer",
                "url": productUrl,
                "priceCurrency": "USD",
                "price": productPrice,
                "availability": "https://schema.org/InStock"
            }
        };

        jsonLd.textContent = JSON.stringify(payload);
    }

    // ----------------------------------------------------
    // 3. RENDER REVIEWS (Connected Nodes)
    // ----------------------------------------------------
    async function renderReviews(productId) {
        if(!els.reviewsContainer) return;
        
        els.reviewsContainer.innerHTML = '<p style="padding-left:40px; color:#666;">Loading connection points...</p>';

        try {
            // Mock data for design demonstration
            const reviews = [
                { user: "Collector A.", text: "The precision in the lines is unmatched. Truly captures the essence of the void.", rating: 5 },
                { user: "Davide M.", text: "Arrived in perfect condition. The archival framing is museum quality.", rating: 5 },
                { user: "Sarah J.", text: "A conversation piece in my living room. Minimalist perfection.", rating: 4 }
            ];

            els.reviewsContainer.innerHTML = '';

            if (reviews.length === 0) {
                els.reviewsContainer.innerHTML = '<p style="padding-left:40px; color:#666;">Be the first to connect.</p>';
            } else {
                reviews.forEach(r => {
                    const node = document.createElement('div');
                    node.className = 'review-node';
                    node.style.position = 'relative';
                    node.style.paddingLeft = '40px';
                    node.style.marginBottom = '40px';
                    
                    // Connected Line Styles
                    // Note: CSS classes handle most lines, but inline style ensures visibility if CSS missing
                    
                    const stars = '★'.repeat(r.rating);
                    
                    node.innerHTML = `
                        <div class="review-line"></div>
                        <h4 style="font-size: 0.9rem; color: #fff; margin-bottom: 5px;">${r.user} <span style="color:#555; margin-left:10px;">${stars}</span></h4>
                        <p style="color: #999; font-size: 0.9rem; line-height: 1.6;">${r.text}</p>
                    `;
                    els.reviewsContainer.appendChild(node);
                });

                // Animate them
                if(window.gsap && window.ScrollTrigger) {
                    gsap.fromTo('.review-node', 
                        { opacity: 0, y: 20 },
                        { 
                            opacity: 1, y: 0, duration: 0.5, stagger: 0.2,
                            scrollTrigger: { trigger: '.review-node', start: "top 90%" }
                        }
                    );
                }
            }
            
            setupReviewForm(productId);

        } catch (e) {
            console.error(e);
            els.reviewsContainer.innerHTML = '<p style="padding-left:40px;">Unable to load reviews.</p>';
        }
        
        // Refresh Loco
        setTimeout(() => window.locoScroll && window.locoScroll.update(), 1000);
    }

    function setupReviewForm(pid) {
        const starContainer = document.getElementById('star-rating');
        const ratingInput = document.getElementById('rating-value');
        if(!starContainer || !ratingInput) return;

        let currentRating = 0;
        starContainer.innerHTML = '';
        
        [1,2,3,4,5].forEach(i => {
            const s = document.createElement('span');
            s.innerHTML = '★'; 
            s.style.opacity = '0.3';
            s.style.marginRight = '5px';
            s.onmouseover = () => {
                Array.from(starContainer.children).forEach((c, idx) => c.style.opacity = idx < i ? '1' : '0.3');
            };
            s.onmouseleave = () => {
                Array.from(starContainer.children).forEach((c, idx) => c.style.opacity = idx < currentRating ? '1' : '0.3');
            };
            s.onclick = () => {
                currentRating = i;
                ratingInput.value = i;
                Array.from(starContainer.children).forEach((c, idx) => c.style.opacity = idx < i ? '1' : '0.3');
            };
            starContainer.appendChild(s);
        });

        const form = document.getElementById('review-form');
        if(form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const text = document.getElementById('review-text').value;
                if(!currentRating) { alert("Please select a rating."); return; }
                
                const feed = document.getElementById('review-feedback');
                if(feed) {
                    feed.innerText = "Review submitted successfully. Connecting...";
                    feed.style.color = "#4ade80"; 
                }
                document.getElementById('review-text').value = '';
            };
        }
    }

    // ----------------------------------------------------
    // 4. RELATED PRODUCTS -> SWIPER
    // ----------------------------------------------------
    function renderRelated(mainProduct) {
        if(!els.relatedWrapper) return;

        const related = ALL_PRODUCTS_DATA.filter(p => p.id !== mainProduct.id).slice(0, 5);
        
        els.relatedWrapper.innerHTML = '';
        related.forEach(p => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <img src="${p.image}" alt="${p.title}">
                <div class="slide-overlay">
                    <h4 class="slide-title">${p.title}</h4>
                    <p class="slide-desc">$${p.description}</p>
                    <a href="detail.html?id=${p.id}" class="slide-btn">View Work</a>
                </div>
            `;
            els.relatedWrapper.appendChild(slide);
        });

        // Initialize Swiper
        if(window.Swiper) {
            new Swiper('.mySwiper', {
                slidesPerView: 'auto',
                spaceBetween: 30,
                freeMode: true,
                grabCursor: true
            });
        }
    }

    // ----------------------------------------------------
    // 5. ADD TO CART
    // ----------------------------------------------------
    function setupCart(product, selection) { // NOTE: selection param unused here but kept for signature
        if(!els.addBtn) return;

        els.addBtn.onclick = () => {
            const finish = els.finishSelect ? els.finishSelect.value : "Standard";
            const qty = els.qtyInput ? (parseInt(els.qtyInput.value) || 1) : 1;

            if(!finish) {
                alert("Please select a finish option.");
                return;
            }

            const item = {
                id: product.id,
                title: product.title,
                price: parseFloat((product.price+"").replace(/[^0-9.]/g, '')), 
                image: product.image,
                option: finish,
                qty: qty
            };

            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existing = cart.find(i => i.id === item.id && i.option === item.option);
            
            if(existing) {
                existing.qty += qty;
            } else {
                cart.push(item);
                // Also trigger storage event for other tabs/components
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('storage'));

            // Show Modal
            if(els.modal) {
                if(els.modalImg) els.modalImg.src = product.image;
                if(els.modalTitle) els.modalTitle.innerText = `${product.title} — ${finish}`;
                els.modal.classList.remove('hidden');
                els.modal.style.display = 'flex'; // Ensure visibility override
            }
        };
        
        // Modal Event Listeners
        if(els.modal) {
            els.modal.addEventListener('click', (e) => {
                if(e.target === els.modal) {
                    els.modal.classList.add('hidden');
                    els.modal.style.display = 'none';
                }
            });
        }
        
        if(els.continueShopBtn) {
            els.continueShopBtn.addEventListener('click', () => {
                if(els.modal) {
                    els.modal.classList.add('hidden');
                    els.modal.style.display = 'none';
                }
            });
        }
    }

});
