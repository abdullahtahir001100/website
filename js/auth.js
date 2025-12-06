// ====================================================================
// File: js/auth.js (Shared Utility Functions)
// NOTE: Must be loaded before all other scripts that need it.
// All functions are exposed globally for use in other HTML scripts.
// ====================================================================

// Configuration: The base URL for your Express API
const API_BASE = 'http://localhost:5000/api'; 

/**
 * Check if the 'loggedIn' cookie exists for client-side status check.
 * This cookie is NOT httpOnly and is set by the server for frontend convenience.
 * @returns {boolean} True if the client-readable status cookie is found.
 */
const checkAuthStatus = () => {
    // Client-side se 'loggedIn' cookie check karein
    const cookies = document.cookie.split('; ');
    // We only check for the non-httpOnly 'loggedIn=true' status cookie
    return cookies.some(cookie => cookie.startsWith('loggedIn=true'));
};

/**
 * Returns the necessary headers for API calls (mostly Content-Type).
 * Cookies are handled automatically by the browser when 'credentials: include' is used.
 * @returns {Object}
 */
const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
    };
};

/**
 * Redirect user based on authentication status.
 *
 * @param {boolean} isAuthenticated - Result of checkAuthStatus().
 * @param {string} authPage - Page to redirect to if not authenticated (e.g., '/login.html').
 * @param {string} dashboardPage - Page to redirect to if authenticated (e.g., '/dashboard.html').
 * @param {boolean} currentIsAuthPage - True if the current page is a login/register page.
 */
const checkAndRedirect = (isAuthenticated, authPage = '/login.html', dashboardPage = '/dashboard.html', currentIsAuthPage = false) => {
    if (isAuthenticated && currentIsAuthPage) {
        // Logged in hai aur login page par hai, toh dashboard par bhej do
        window.location.href = dashboardPage;
    } else if (!isAuthenticated && !currentIsAuthPage) {
        // Logged in nahi hai aur protected page par hai, toh login page par bhej do
        window.location.href = authPage;
    }
};

/**
 * Global Logout Function: Makes an API call to the server to delete the secure session 
 * and clears client-side status cookies.
 */
const logoutUser = async () => {
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            // CRITICAL: This sends the secure httpOnly cookie to the server for deletion
            credentials: 'include', 
            headers: getHeaders(),
        });
    } catch (error) {
        // Log the error but proceed with client-side cleanup
        console.error("Logout failed on server, but clearing client status.", error);
    }
    
    // Clear client-side status cookie immediately
    // Setting expiry to the past clears the cookie in the browser
    document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Redirect to login page
    window.location.href = '/login.html';
};