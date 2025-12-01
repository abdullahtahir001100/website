// activityTracker.js - Comprehensive script for Activity Tracking AND Dashboard Functionality

// --- CONFIGURATION ---
const API_BASE = 'https://backend-web-1.vercel.app/api'; 
const HEARTBEAT_INTERVAL_MS = 60000; // 60 seconds interval
let heartbeatTimer = null; 
let lastPageEnterTime = Date.now();
const CURRENT_PAGE_ROUTE = window.location.pathname; 

// Dashboard State Variables
let allUsersCache = [];
let currentUserId = null; 

// 1. Authentication Headers 
const getHeaders = () => ({
    'Content-Type': 'application/json'
});

// --- UTILITY FUNCTIONS ---
// Function to fetch the user's public IP
async function getIPAddress() {
    try {
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        return data.ip || 'N/A';
    } catch (error) {
        return 'Localhost/N/A';
    }
}

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// --- ACTIVITY TRACKING CORE FUNCTION ---
/**
 * Logs a user activity event to the server.
 */
async function trackActivity(type, pageRoute, durationMs) {
    const ip = await getIPAddress();
    const device = navigator.userAgent; 
    const route = pageRoute || CURRENT_PAGE_ROUTE;
    
    try {
        const response = await fetch(`${API_BASE}/activity`, { 
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include', 
            body: JSON.stringify({ 
                type, 
                pageRoute: route, 
                durationMs: durationMs || 0,
                description: `User event: ${type} on page ${route}`, 
                ip,
                device 
            })
        });
        
        if (!response.ok) {
            console.error(`Failed to log activity: ${response.status}`, response.statusText);
            
            if (response.status === 401) {
                 stopHeartbeat();
                 console.warn("Session expired. Stopping heartbeat.");
                 // window.location.href = '/login'; 
            }
        }
    } catch (error) {
        console.error("Network error during tracking:", error);
    }
}

// --- HEARTBEAT LOGIC ---
async function sendHeartbeat() {
    await trackActivity('HEARTBEAT', CURRENT_PAGE_ROUTE, 0); 
}

function startHeartbeat() {
    if (heartbeatTimer) return;
    sendHeartbeat(); // Immediate first heartbeat
    heartbeatTimer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
}

function stopHeartbeat() {
    if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
    }
}

// ========================================================
// === DASHBOARD DATA FETCHING AND RENDERING LOGIC ===
// ========================================================

async function fetchUserList() {
    const loadingSpinner = document.getElementById("loading-spinner");
    const errorMessage = document.getElementById("error-message");
    
    if (loadingSpinner) loadingSpinner.classList.remove("hidden");
    if (errorMessage) errorMessage.classList.add("hidden");
    
    try {
        const response = await fetch(`${API_BASE}/users`, { headers: getHeaders(), credentials: 'include' });
        
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                 throw new Error("Authentication failed. Please log in as an Admin.");
            }
            const errorData = await response.json();
            throw new Error(`Server returned ${response.status}: ${errorData.error || 'Unknown error'}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
            allUsersCache = data.data; // Store full data
            renderUserList(); 
        } else {
            throw new Error(data.error || "Failed to fetch users.");
        }

    } catch (error) {
        console.error("Fetch error:", error);
        if (errorMessage) {
            errorMessage.innerText = `Error loading users: ${error.message}`;
            errorMessage.classList.remove("hidden");
        }
    } finally {
        if (loadingSpinner) loadingSpinner.classList.add("hidden");
    }
}

async function fetchUserDetail(userId) {
    if (!userId) return; // Basic check
    
    currentUserId = userId; 
    
    // Logic to show detail view and hide list view (requires corresponding HTML IDs)
    const detailView = document.getElementById("user-detail-view");
    const listView = document.getElementById("user-list-view");
    const mainTitle = document.getElementById("page-main-title");
    
    if (listView) listView.classList.add("hidden");
    if (detailView) {
        detailView.classList.remove("hidden");
        // Simple loading state
        document.getElementById("detail-name").innerText = 'Loading...';
    }

    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, { headers: getHeaders(), credentials: 'include' });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server returned ${response.status} ${response.statusText}`);
        }
        const responseData = await response.json();
        
        if (responseData.success && responseData.data) {
            showUserDetail(responseData.data); 
        } else {
            throw new Error(responseData.error || 'Failed to load user details.');
        }
    } catch (error) {
        console.error("Detail Fetch Error:", error);
        alert(`Could not load user details: ${error.message}`);
        showUserList(); 
    }
}

function showUserList() {
    const detailView = document.getElementById("user-detail-view");
    const listView = document.getElementById("user-list-view");
    const mainTitle = document.getElementById("page-main-title");

    if (detailView) detailView.classList.add("hidden");
    if (listView) listView.classList.remove("hidden");
    if (mainTitle) mainTitle.innerText = "Admin Dashboard";
    
    currentUserId = null; // Clear the current user context
}

// --- Placeholder Rendering Functions (Need HTML Elements with matching IDs) ---

function renderUserList(filterText = "") {
    const tbody = document.getElementById("users-table-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    
    const filteredUsers = allUsersCache.filter(user => 
        (user.firstName || '').toLowerCase().includes(filterText.toLowerCase()) || 
        (user.lastName || '').toLowerCase().includes(filterText.toLowerCase()) || 
        (user.email || '').toLowerCase().includes(filterText.toLowerCase())
    );
    
    if (filteredUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">No users found.</td></tr>';
        return;
    }

    filteredUsers.forEach(user => {
        const statusClass = user.sessionStatus === "Active" ? "active" : "inactive";
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50 transition cursor-pointer";
        tr.onclick = () => fetchUserDetail(user.id);

        tr.innerHTML = `
            <td class="px-6 py-4"><div class="font-medium text-gray-800">${user.firstName || ''} ${user.lastName || ''}</div></td>
            <td class="px-6 py-4 text-sm text-gray-600">${user.email}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${user.lastActivity}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${user.currentDevice || 'N/A'}</td>
            <td class="px-6 py-4">
                <div class="flex items-center text-sm text-gray-600">
                    <span class="status-dot ${statusClass}"></span>
                    ${user.sessionStatus}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function showUserDetail(data) {
    const user = data.profile;
    const mainTitle = document.getElementById("page-main-title");
    
    // Populate Profile Section
    if (mainTitle) mainTitle.innerText = `${user.firstName} ${user.lastName}'s Details`;
    document.getElementById("detail-name").innerText = `${user.firstName} ${user.lastName}`;
    document.getElementById("detail-email").innerText = user.email;
    document.getElementById("detail-profile-pic").src = user.profilePic || 'https://via.placeholder.com/150/E0E7FF/4F46E5?text=U'; 

    // Note: Other rendering functions (renderTopPages, renderActivityHistory, etc.) 
    // must be defined separately if needed, using the 'data' structure.
    
    // Placeholders for other details
    document.getElementById("summary-total-orders").innerText = data.metrics.totalOrders || 0;
    document.getElementById("summary-total-feedback").innerText = data.metrics.totalFeedback || 0;
    
    // ... add logic for rendering logs, orders, and metrics here ...
}

// --- INITIALIZATION AND EVENT LISTENERS ---
function initActivityTracker() {
    // 1. Log Activity Setup
    window.addEventListener('load', async () => {
        const eventType = (CURRENT_PAGE_ROUTE.includes('/login') || CURRENT_PAGE_ROUTE === '/') ? 'LOGIN' : 'PAGE_VIEW';

        await trackActivity(eventType, CURRENT_PAGE_ROUTE, 0); 
        lastPageEnterTime = Date.now();
        
        startHeartbeat(); 
        
        // 2. DASHBOARD DATA LOADING: Start fetching user data only on the admin dashboard
        if (CURRENT_PAGE_ROUTE.includes('/dashboard')) {
            fetchUserList();
            
            // Setup search listener
            const searchInput = document.getElementById("search-input");
            if (searchInput) {
                searchInput.addEventListener("input", (e) => {
                    renderUserList(e.target.value);
                });
            }
        }
    });

    // 3. Log the EXIT event when the user leaves the page
    window.addEventListener('beforeunload', async () => {
        stopHeartbeat(); 
        const finalDurationMs = Date.now() - lastPageEnterTime;
        await trackActivity('EXIT', CURRENT_PAGE_ROUTE, finalDurationMs); 
    });
    
    // Make sure the global functions required by the HTML (like showUserList) are exposed
    window.showUserList = showUserList;
    window.fetchUserDetail = fetchUserDetail;
    // window.deleteUser = deleteUser; // If deleteUser is defined elsewhere, expose it here too.
}

// Execute the initialization function
initActivityTracker();



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