(function() {
    // --- Helper Function for Dynamic Script Loading ---
    function loadExternalScript(src) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
    }
    // ------------------------------------------------

    // 1. Check if the user has already made a choice (Only 'accepted' is stored)
    const consent = localStorage.getItem('cookie_consent');

    // 2. Define the cookie handling function (The core logic)
    function handleConsent(status) {
        
        // CRITICAL: Only store the choice if ACCEPTED
        if (status === 'accepted') {
            localStorage.setItem('cookie_consent', status);
        }
        
        // Remove the banner if it exists
        const existingPopup = document.getElementById('cookie-consent-banner');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        // Reset body padding
        document.body.style.paddingTop = '0'; 

        // --- CORE COOKIE LOGIC STARTS HERE ---
        if (status === 'accepted') {
            console.log('Cookies Accepted: Loading tracking and analytics scripts.');
            // 🎯 Action 1: Load your scripts here
            // loadExternalScript('https://www.googletagmanager.com/gtag/js?id=YOUR_GA_TRACKING_ID');
            
        } else {
            console.log('Cookies Rejected: Non-essential cookies blocked. Banner will reappear on refresh.');
            // 🎯 Action 2: No scripts loaded.
        }
        // --- CORE COOKIE LOGIC ENDS HERE ---
    }
    
    // 3. If consent is already set, execute the logic immediately and EXIT
    if (consent !== null) {
        handleConsent(consent);
        return; 
    }


    // --- Only run the rest if consent is NULL (first visit OR previously rejected) ---

    // 4. Create and display the banner
    const popup = document.createElement('div');
    popup.id = 'cookie-consent-banner'; 
    const container = document.createElement('div');
    const content = document.createElement('p');
    const buttonGroup = document.createElement('div');
    const acceptButton = document.createElement('button');
    const rejectButton = document.createElement('button');

    // Set content and attributes
    content.innerHTML = '🍪 This site uses cookies to enhance your experience. Please accept or reject.';
    acceptButton.textContent = 'Accept Cookies';
    rejectButton.textContent = 'Reject';

    // 5. Define the inline CSS styles based on your site's aesthetic
    const brandColor = 'rgb(255, 0, 221)'; // Your pink hover color
    
    const styles = {
        // Popup container: Matches your fixed header styling
        popup: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            'background-color': '#fff', // White like your header
            color: '#000',
            padding: '15px 0',
            'box-shadow': '1px 14px 14px rgba(0, 0, 0, 0.1019607843)', // Matching your header shadow
            'z-index': '9999',
            'font-family': 'regular, sans-serif', // Using one of your custom fonts
            'text-align': 'center'
        },
        // Inner container
        container: {
            'max-width': '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'space-between',
            'flex-wrap': 'wrap'
        },
        // Content paragraph styles
        content: {
            margin: '0',
            'flex-grow': '1',
            'font-size': '16px',
            'line-height': '1.5',
            'text-align': 'left'
        },
        // Button group styles
        buttonGroup: {
            display: 'flex',
            gap: '10px',
            'margin-top': '0',
            'flex-shrink': '0'
        },
        // Base button styles - styled similarly to your primary site button hover
        button: {
            padding: '10px 20px',
            'border': `1px solid ${brandColor}`, // Border in your brand color
            'border-radius': '5px',
            cursor: 'pointer',
            'font-weight': '600',
            'font-size': '14px',
            'transition': 'all 0.3s ease',
            'font-family': 'st, sans-serif' // Using one of your other custom fonts
        },
        // Accept button specific styles (Primary action)
        acceptButton: {
            'background-color': brandColor, // Pink background
            'color': '#fff',
        },
        // Reject button specific styles (Outline style)
        rejectButton: {
            'background-color': 'transparent', // Transparent background
            'color': '#000', // Black text
            'border-color': '#000' // Black border
        }
    };

    // 6. Apply styles
    function applyStyles(element, styleObj) {
        for (const prop in styleObj) {
            element.style[prop] = styleObj[prop];
        }
    }

    applyStyles(popup, styles.popup);
    applyStyles(container, styles.container);
    applyStyles(content, styles.content);
    applyStyles(buttonGroup, styles.buttonGroup);

    applyStyles(acceptButton, styles.button);
    applyStyles(rejectButton, styles.button);

    applyStyles(acceptButton, styles.acceptButton);
    applyStyles(rejectButton, styles.rejectButton);

    // 7. Add hover effects (using your pink color)
    acceptButton.onmouseover = () => acceptButton.style.backgroundColor = 'transparent';
    acceptButton.onmouseout = () => acceptButton.style.backgroundColor = brandColor;
    rejectButton.onmouseover = () => { rejectButton.style.backgroundColor = brandColor; rejectButton.style.color = '#fff'; };
    rejectButton.onmouseout = () => { rejectButton.style.backgroundColor = 'transparent'; rejectButton.style.color = '#000'; };


    // 8. Add event listeners
    acceptButton.addEventListener('click', () => handleConsent('accepted'));
    rejectButton.addEventListener('click', () => handleConsent('rejected'));

    // 9. Assemble and Append the elements
    buttonGroup.appendChild(rejectButton);
    buttonGroup.appendChild(acceptButton);
    container.appendChild(content);
    container.appendChild(buttonGroup);
    popup.appendChild(container);
    document.body.appendChild(popup);
    
    // 10. Add padding to the body (calculated dynamically)
    setTimeout(() => {
        const bannerHeight = popup.offsetHeight;
        document.body.style.paddingTop = bannerHeight + 'px'; 
    }, 10);
    
})();
































// --- IGNORE ---
 
        const AUTH_CONTAINER = document.getElementById('auth-container');
const LOGIN_PAGE_URL = 'login.html';
const PROFILE_PAGE_URL = 'settings.html'; // Placeholder for profile page
const BURGER_MENU_DROPDOWN = document.getElementById('burger-menu-dropdown');
const MENU_ICON_CONTAINER = document.getElementById('menu-icon-container');

/**
 * Generates a random light hex color (high luminosity).
 */
function getRandomColor() {
    // Generates a color between #A0A0A0 and #FFFFFF
    const color = (Math.random() * 0x5f5f5f + 0xa0a0a0).toString(16).slice(0, 6);
    return '#' + color.padStart(6, '0');
}

/**
 * Fetches user data from local storage.
 */
function getAuthData() {
    const data = localStorage.getItem('userAuthData');
    return data ? JSON.parse(data) : null;
}

/**
 * Toggles the visibility of the user menu pop-up.
 */
function toggleUserMenu(event) {
    if (event) event.stopPropagation();

    const menu = document.getElementById('user-menu-popup');
    if (!menu) return;

    const isHidden = menu.style.display === 'none' || menu.style.display === '';

    // Close all other menus (Burger Menu)
    if (BURGER_MENU_DROPDOWN) BURGER_MENU_DROPDOWN.style.display = 'none';

    if (isHidden) {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
}

/**
 * Toggles the visibility of the Burger Menu pop-up.
 */
window.toggleBurgerMenu = function (event) {
    if (event) event.stopPropagation();

    if (BURGER_MENU_DROPDOWN.style.display === 'block') {
        BURGER_MENU_DROPDOWN.style.display = 'none';
    } else {
        // Close user profile menu if open
        const userMenu = document.getElementById('user-menu-popup');
        if (userMenu) userMenu.style.display = 'none';
        
        BURGER_MENU_DROPDOWN.style.display = 'block';
    }
}

/**
 * Handles global clicks to close pop-up menus.
 */
document.addEventListener('click', (event) => {
    const userMenu = document.getElementById('user-menu-popup');

    // 1. Close User Menu if open and click is outside
    if (userMenu && userMenu.style.display === 'block') {
        const authContainer = document.getElementById('auth-container');
        if (!userMenu.contains(event.target) && !authContainer.contains(event.target)) {
            userMenu.style.display = 'none';
        }
    }
    
    // 2. Close Burger Menu if open and click is outside
    if (BURGER_MENU_DROPDOWN && BURGER_MENU_DROPDOWN.style.display === 'block') {
        if (!BURGER_MENU_DROPDOWN.contains(event.target) && !MENU_ICON_CONTAINER.contains(event.target)) {
            BURGER_MENU_DROPDOWN.style.display = 'none';
        }
    }
});


/**
 * Handles the click event on the auth container.
 */
function handleAuthClick(event) {
    const userData = getAuthData();
    if (userData && userData.isLoggedIn) {
        // Logged in: Toggle the custom menu
        toggleUserMenu(event);
    } else {
        // Not logged in: Go to login page
        window.location.href = LOGIN_PAGE_URL;
    }
}

/**
 * Logs out the current user silently.
 */
window.handleLogout = function () {
    localStorage.removeItem('userAuthData');
    renderAuthStatus(); // Update header
    console.log('User logged out successfully.');
}

/**
 * Simulates switching account by logging out and redirecting to login.
 */
window.handleSwitchAccount = function () {
    // 1. Close the menu
    toggleUserMenu(); 
    
    // 2. Perform silent logout
    localStorage.removeItem('userAuthData');
    renderAuthStatus();
    console.log('Switch Account initiated: User logged out and redirecting to login page.');

    // 3. Redirect to the login page
    window.location.href = LOGIN_PAGE_URL;
}

/**
 * Renders the appropriate element (Login Icon or Avatar) in the header.
 */
function renderAuthStatus() {
    const userData = getAuthData();
    AUTH_CONTAINER.innerHTML = ''; // Clear existing content

    if (userData && userData.isLoggedIn) {
        const fullName = `${userData.firstName} ${userData.lastName || ''}`.trim();
        const firstName = userData.firstName || 'U';
        const firstLetter = firstName.charAt(0).toUpperCase();
        const avatarColor = userData.avatarColor || getRandomColor(); 

        // 1. Create Avatar structure (Avatar + Simple Hover Tooltip)
        const avatarHtml = `
            <div class="user-avatar" style="background-color: ${avatarColor};" onclick="handleAuthClick(event)">
                ${firstLetter}
            </div>
            <div class="user-info-tooltip">
                <p>${fullName}</p>
                <p>${userData.email}</p>
            </div>
        `;

        // 2. Create the Pop-up Menu structure (Hidden by default)
        const menuHtml = `
            <div id="user-menu-popup" class="user-menu-popup" style="display: none;">
                <div class="user-menu-header">
                    <div class="menu-avatar" style="background-color: ${avatarColor};">
                        ${firstLetter}
                    </div>
                    <p>${fullName}</p>
                    <p class="user-email">${userData.email}</p>
                </div>
                
                <div class="user-menu-actions">
                    <button onclick="window.location.href='${PROFILE_PAGE_URL}'">
                        <i class="fas fa-user-circle"></i> View Profile
                    </button>
                    <button onclick="window.location.href='settings.html'">
                        <i class="fas fa-cog"></i> Settings
                    </button>
                </div>
                
                <div class="menu-footer">
                    <button onclick="handleLogout()">
                        <i class="fas fa-sign-out-alt"></i> Log Out
                    </button>
                    <button onclick="handleSwitchAccount()">
                        <i class="fas fa-exchange-alt"></i> Switch Account
                    </button>
                </div>
            </div>
        `;

        AUTH_CONTAINER.innerHTML = avatarHtml + menuHtml;

    } else {
        // Not logged in: Show Login Icon
        AUTH_CONTAINER.innerHTML = `
            <a href="${LOGIN_PAGE_URL}" aria-label="Login or Register">
                <img src="images/avatar.png" class="imgee" onclick="handleAuthClick(event)"></i>
            </a>
        `;
    }
}

// --- SIMULATED LOGIN (for testing) ---
function simulateLogin() {
    const userMock = {
        isLoggedIn: true,
        firstName: "Sara",
        lastName: "Khan",
        email: "sara.khan@inkbyhand.com",
        username: "saraink_official",
        avatarColor: getRandomColor()
    };
    localStorage.setItem('userAuthData', JSON.stringify(userMock));
    renderAuthStatus();
    console.log('Simulated Login Success. Color updated.');
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderAuthStatus();
    // To simulate a logged-in user on every page load, uncomment the line below:
    // simulateLogin(); 
});
   // activityTracker.js

(function () {
    // --- CONFIGURATION ---
    // ⚠️ CRITICAL: Ensure this is the correct API base URL for your backend.
    const API_1 = 'https://backend-web-1-yb6q.vercel.app/api'; 
    const HEARTBEAT_INTERVAL_MS = 60000; // 60 seconds interval for heartbeat
    
    // --- ACTIVITY TRACKING VARIABLES ---
    let lastActivityTime = Date.now(); // Last time the page was actively viewed/loaded
    let heartbeatTimer = null; 
    let isActive = true; // Flag for page visibility
    // Automatically determine the page route (e.g., /admin/dashboard, /settings.html)
    const CURRENT_PAGE_ROUTE = window.location.pathname; 

    // 1. Headers (Includes Content-Type and ensures cookies are sent via 'credentials: include')
    const getHeaders = () => ({
        'Content-Type': 'application/json'
    });

    // --- UTILITY: Get IP Address ---
    async function getIPAddress() {
        try {
            // Using a reliable public IP service
            const response = await fetch('https://api64.ipify.org?format=json');
            const data = await response.json();
            return data.ip || 'N/A';
        } catch (error) {
            return 'Localhost/N/A';
        }
    }
    
    // --- CORE FUNCTION: Track Activity (The main API call) ---
    async function trackActivity(type, pageRoute, durationMs) {
        // IP address fetch can be slow, but required for the User model update
        const ip = await getIPAddress();
        const device = navigator.userAgent; 
        const route = pageRoute || CURRENT_PAGE_ROUTE; 
        const duration = durationMs || 0; 
        
        const payload = JSON.stringify({ 
            type, 
            pageRoute: route, 
            durationMs: duration,
            description: `User event: ${type} on page ${route}`, 
            ip,
            device 
        });

        try {
            const response = await fetch(`${API_1}/activity`, { 
                method: 'POST',
                headers: getHeaders(),
                // CRITICAL: This sends the authentication cookie
                credentials: 'include', 
                body: payload
            });
            
            if (response.status === 401 || response.status === 403) {
                console.error("Session expired. Please log in again.");
                stopHeartbeat();
                // window.location.href = '/login'; // Optional: Redirect
            } else if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
                console.error("Failed to log activity:", response.status, errorData.error);
            } else {
                // If successful, update the last active time
                lastActivityTime = Date.now();
            }
        } catch (error) {
            console.error("Network error during tracking:", error);
        }
    }
    
    // --- HEARTBEAT CONTROL FUNCTIONS ---
    function sendHeartbeat() {
        if (isActive) {
            // Logs a HEARTBEAT event to keep the session alive
            trackActivity('HEARTBEAT', CURRENT_PAGE_ROUTE, 0); 
        }
    }

    function startHeartbeat() {
        if (heartbeatTimer) return;
        sendHeartbeat(); // First heartbeat immediately
        heartbeatTimer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
    }

    function stopHeartbeat() {
        if (heartbeatTimer) {
            clearInterval(heartbeatTimer);
            heartbeatTimer = null;
        }
    }
    
    // --- SESSION AND VISIBILITY HANDLERS ---

    // Handles page closure (Final EXIT log using sendBeacon for reliability)
    function handleBeforeUnload() {
        const finalDurationMs = Date.now() - lastActivityTime;
        
        const type = 'EXIT';
        const route = CURRENT_PAGE_ROUTE;
        const device = navigator.userAgent;
        
        const payload = JSON.stringify({ 
            type, 
            pageRoute: route, 
            durationMs: finalDurationMs,
            description: `User event: ${type} on page ${route}`, 
            ip: 'unknown_on_unload', // IP fetch is skipped here for reliability
            device 
        });

        // Use sendBeacon for reliable background logging during page closing
        if (navigator.sendBeacon) {
            navigator.sendBeacon(`${API_1}/activity`, payload);
        } else {
            // Fallback for older browsers
            fetch(`${API_1}/activity`, {
                method: 'POST',
                headers: getHeaders(),
                credentials: 'include', 
                body: payload,
                keepalive: true 
            }).catch(e => console.error("Unreliable EXIT log failed:", e));
        }
        
        stopHeartbeat(); 
    }
    
    // Handles tab switching or minimizing (more accurate duration tracking)
    function handleVisibilityChange() {
        if (document.hidden) {
            // Log exit and stop tracking when tab is switched/minimized
            const durationMs = Date.now() - lastActivityTime;
            trackActivity('BACKGROUND_EXIT', CURRENT_PAGE_ROUTE, durationMs);
            stopHeartbeat();
            isActive = false;
        } else {
            // Log return and restart tracking when tab is active
            lastActivityTime = Date.now();
            trackActivity('BACKGROUND_RETURN', CURRENT_PAGE_ROUTE, 0);
            startHeartbeat();
            isActive = true;
        }
    }
    
    // --- INITIALIZATION ---
    window.addEventListener('load', async () => {
        // Log the initial page view
        await trackActivity('PAGE_VIEW', CURRENT_PAGE_ROUTE, 0); 
        
        // Start the periodic heartbeat
        startHeartbeat(); 
    });

    // Setup event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Expose trackActivity globally if needed by other scripts (e.g., for 'DELETE' event)
    window.trackActivity = trackActivity;
    
})();