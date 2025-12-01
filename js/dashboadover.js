/**
 * dashboadover.js - Complete Frontend Logic
 * Records user traffic AND fetches all dashboard data.
 * FIX: API_PREFIX changed from /api/dashboard to /api/v1 to match server.js
 * * NOTE: The redundant initial 'fetch' functions have been removed. 
 * The main script already correctly calls all 'get' functions in initializeDashboard.
 */

// FIX APPLIED HERE: Changed from /api/dashboard to /api/v1
const API_PREFIX = 'https://backend-web-1.vercel.app/api/v1'; 

// --- Part 1: Traffic Recording Logic ---

function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let device = 'Web'; 
    let browser = 'Unknown';

    if (/(Mobi|Android|iPhone)/i.test(userAgent) && !/(Tablet|iPad)/i.test(userAgent)) {
        device = 'Mobile';
    } else if (/(Tablet|iPad)/i.test(userAgent)) {
        device = 'Tablet';
    }
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        browser = 'Chrome';
    } else if (userAgent.includes('Firefox')) {
        browser = 'Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browser = 'Safari';
    } else if (userAgent.includes('Edg')) {
        browser = 'Edge';
    } else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
        browser = 'Opera';
    }
    
    return { device, browser };
}

function getTrafficSource() {
    const referrer = document.referrer;
    if (!referrer) return 'direct';

    try {
        const currentHost = window.location.host;
        const referrerHost = new URL(referrer).host;

        if (referrerHost === currentHost) return 'direct';
        
        if (referrerHost.includes('google') || referrerHost.includes('bing')) {
            return 'Search Engine';
        }
        if (referrerHost.includes('facebook') || referrerHost.includes('twitter')) {
            return 'Social Media';
        }

        return referrerHost; 
    } catch (e) {
        return 'direct'; 
    }
}

// 🚀 Traffic Recording (POST)
function recordUserTraffic() {
    const { device, browser } = getDeviceInfo();
    const source = getTrafficSource();
    const pageUrl = window.location.pathname;

    const trafficData = {
        device,
        browser,
        source,
        pageUrl
    };

    fetch(`${API_PREFIX}/traffic-source`, { // Hits /api/v1/record-traffic
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(trafficData)
    })
    .then(response => {
        if (!response.ok) {
            console.warn(`Failed to record traffic: Status ${response.status}. Check backend prefix.`);
        } else {
            console.log('Traffic recorded successfully to /api/v1/traffic-source.');
        }
    })
    .catch(error => {
        console.error('Network error during traffic recording:', error);
    });
}

// --- Part 2: Dashboard Data Fetching Logic (GET Routes) ---

/**
 * Centralized fetch function. Takes the endpoint slug and prefixes it with API_PREFIX.
 * @param {string} endpoint - The API endpoint slug (e.g., 'stats', 'earnings-report').
 * @returns {Promise<Object|null>} The fetched JSON data or null on error.
 */
async function fetchData(endpoint) {
    try {
        const url = `${API_PREFIX}/${endpoint}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}. URL: ${url}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data for ${endpoint}:`, error);
        return null; 
    }
}

// 1. Stat Cards
async function getDashboardStats() {
    const stats = await fetchData('stats');
    if (stats) {
        console.log('1. Stats (Stat Cards):', stats);
        // **TODO: Add DOM update logic here**
        // Example: updateStatCards(stats);
    }
    return stats;
}

// 2. Earnings Report
async function getEarningsReport() {
    // NOTE: If the actual endpoint is /api/orders, you must change 'earnings-report' below to 'orders'.
    // Assuming the server uses the convention /api/v1/earnings-report based on the function name.
    const report = await fetchData('earnings-report'); 
    if (report) {
        console.log('2. Earnings Report (Bar Chart):', report);
        // **TODO: Add Chart update logic here**
        // Example: createBarChart(report);
    }
    return report;
}

// 3. Device Visits
async function getDeviceVisits() {
    const visits = await fetchData('device-visits');
    if (visits) {
        console.log('3. Device Visits (Progress Bars):', visits);
        // **TODO: Add Progress bar update logic here**
        // Example: updateProgressBars(visits);
    }
    return visits;
}

// 4. Traffic Source
async function getTrafficSourceData() {
    const source = await fetchData('traffic-source');
    if (source) {
        console.log('4. Traffic Source (Traffic List):', source);
        // **TODO: Add List update logic here**
        // Example: renderTrafficSourceList(source);
    }
    return source;
}

// 5. Sales Countries
async function getSalesCountries() {
    const countries = await fetchData('sales-countries');
    if (countries) {
        console.log('5. Sales Countries (Sales List):', countries);
        // **TODO: Add List/Table update logic here**
        // Example: renderSalesCountriesTable(countries);
    }
    return countries;
}

// 6. Campaign Source
async function getCampaignSource() {
    const campaigns = await fetchData('campaign-source');
    if (campaigns) {
        console.log('6. Campaign Source (Campaign Table):', campaigns);
        // **TODO: Add Table update logic here**
        // Example: renderCampaignTable(campaigns);
    }
    return campaigns;
}

// 7. Top Pages
async function getTopPages() {
    const pages = await fetchData('top-pages');
    if (pages) {
        console.log('7. Top Pages (Page List):', pages);
        // **TODO: Add List update logic here**
        // Example: renderTopPagesList(pages);
    }
    return pages;
}

// 8. Top Leads
async function getTopLeads() {
    const leads = await fetchData('top-leads');
    if (leads) {
        console.log('8. Top Leads (Leads Chart):', leads);
        // **TODO: Add Chart update logic here**
        // Example: createLeadsChart(leads);
    }
    return leads;
}

// 9. Top Session (Browser)
async function getTopSession() {
    const session = await fetchData('top-session');
    if (session) {
        console.log('9. Top Session (Pie Chart):', session);
        // **TODO: Add Pie Chart update logic here**
        // Example: createSessionPieChart(session);
    }
    return session;
}

// --- Part 3: Initialization & Data Handling ---

/**
 * Fetches all data endpoints concurrently.
 * @returns {Promise<Object>} An object containing data from all endpoints.
 */
async function handleDashboardData() {
    // Fetch all data concurrently using Promise.all
    const [
        stats, 
        report, 
        visits, 
        source, 
        countries, 
        campaigns, 
        pages, 
        leads, 
        session
    ] = await Promise.all([
        getDashboardStats(),
        getEarningsReport(),
        getDeviceVisits(),
        getTrafficSourceData(),
        getSalesCountries(),
        getCampaignSource(),
        getTopPages(),
        getTopLeads(),
        getTopSession()
    ]);

    // Consolidate all fetched data (useful if you need all data together later)
    return {
        stats, report, visits, source, countries, campaigns, pages, leads, session
    };
}


function initializeDashboard() {
    // 🚀 1. Record the current user's visit
    recordUserTraffic(); 

    // 📊 2. Fetch and process all dashboard data
    handleDashboardData();
}

// 🌐 Start the process when the document is fully loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);















// --- Tracking System Integration Script ---
// Yeh script aapke backend tracking routes ko call karne ke liye zaroori hai.

// API ka base path. Assuming aapka frontend aur backend same domain par hain.
const API_BASE = '/api/tracking'; 
let currentPage = window.location.pathname; // Current page ka URL path

/**
 * 1. API Call Wrapper (API calls ko asaan aur error-free banane ke liye)
 * @param {string} endpoint - Jaise '/track-visitor'
 * @param {string} method - 'GET' ya 'POST'
 * @param {object} body - POST request ka data
 */
async function makeRequest(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : null
        };
        
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status} at ${endpoint}`);
            return null; 
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return null;
    }
}

/**
 * 2. Initialize Tracking (Zaroori: Visitor ID aur session shuru karne ke liye)
 * ⭐ Zaroori Kadam: Isse har page load par sabse pehle call karein.
 */
async function initializeTracking() {
    const data = await makeRequest('/track-visitor');
    if (data) {
        console.log(`Tracking Initialized. Visitor ID: ${data.visitorID}. First Time: ${data.firstTime}`);
        
        // Initialization ke baad, pehle page visit ko turant track karein
        trackPageVisit(currentPage);
    }
}

/**
 * 3. Track Page Visit (Har naye page view ko record karne ke liye)
 * ⭐ Zaroori Kadam: Isse har page load par ya SPA mein route change par call karein.
 * @param {string} page - Current page ka naam ya URL path
 */
async function trackPageVisit(page) {
    console.log(`Tracking page view: ${page}`);
    // Backend route /add-page-visit ko call karega
    await makeRequest('/add-page-visit', 'POST', { page: page });
}

/**
 * 4. Custom Preference/Cookie Update (Jaise Dark Mode ya Category)
 * ⭐ Zaroori Kadam: Ise button click ya user setting change par call karein.
 * * Udaharan (Dark Mode ON set karne ke liye): setPreference('set-dark-mode', 'on')
 * Udaharan (Category set karne ke liye): setPreference('set-category-cookie', 'Sports')
 * @param {string} endpointPath - Jaise 'set-dark-mode' ya 'set-category-cookie'
 * @param {string} value - Cookie ki value
 */
async function setPreference(endpointPath, value) {
    const data = await makeRequest(`/${endpointPath}/${value}`, 'POST');
    if (data) {
        console.log(`Preference Updated: ${data.message}`);
    }
}

/**
 * 5. Update Cart Reminder Cookie (Cart mein items ki sankhaya track karne ke liye)
 * ⭐ Zaroori Kadam: Ise tab call karein jab cart mein items ki sankhaya badle.
 * * Udaharan: updateCartReminder(5);
 * @param {number} count - Cart mein items ki total sankhya
 */
async function updateCartReminder(count) {
    if (count < 0 || isNaN(count)) return;
    
    const data = await makeRequest(`/set-cart-reminder/${count}`, 'POST');
    if (data) {
        console.log(`Cart Reminder Updated: ${data.message}`);
    }
}

// ----------------------------------------------------------------------
// APNI WEBSITE MEIN KAHAAN AUR KAISE USE KAREIN:
// ----------------------------------------------------------------------

// 1. Visitor Tracking shuru karein (Website load hone par)
// Jab aapki website load ho jaye, toh is function ko call karein:
// initializeTracking();

// 2. Button Action ka Udaharan
// document.getElementById('dark-mode-toggle-button').addEventListener('click', () => {
//     setPreference('set-dark-mode', 'on');
// });

// 3. Cart Update ka Udaharan
// function onAddItemToCart(itemCount) {
//     updateCartReminder(itemCount);
// }