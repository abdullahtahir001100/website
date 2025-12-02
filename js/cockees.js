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