// js/contect.js

// 🚨 IMPORTANT: Apne backend server ka URL yahan set karein
// Agar aap local development mein hain to yeh localhost URL use hoga:
const API_BASE_URL = 'https://backend-web-1.vercel.app/api/contact'; 

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submitBtn');

// =================================================================
// 1. WORD COUNT AND LIMIT LOGIC
// =================================================================

const textarea = document.getElementById('message');
const MAX_WORDS = 250;

// Create and insert the word count message element
const wordCountMessage = document.createElement('p');
wordCountMessage.id = 'word-count-message';
wordCountMessage.style.fontSize = '0.85em';
wordCountMessage.style.marginTop = '5px';
wordCountMessage.style.textAlign = 'left';

// Insert the word count message below the textarea
const textareaContainer = textarea.parentElement; // Yeh .text-center div hoga
textareaContainer.appendChild(wordCountMessage);

/**
 * Updates the word count display and enforces the word limit.
 */
function updateWordCount() {
    const text = textarea.value.trim();

    // Word count calculation
    const words = text ? text.match(/\S+/g) : [];
    const wordCount = words ? words.length : 0;

    // Update the message content and color
    if (wordCount > MAX_WORDS) {
        // Exceeds limit
        wordCountMessage.textContent = `Word limit exceeded: ${wordCount} / ${MAX_WORDS} words`;
        wordCountMessage.style.color = 'red';
        
        // Truncate the text to fit the word limit
        const truncatedText = words.slice(0, MAX_WORDS).join(' ');
        textarea.value = truncatedText;
        
        // Display the correct truncated count
        wordCountMessage.textContent = `Words entered: ${MAX_WORDS} / ${MAX_WORDS}`;
        
    } else if (wordCount > MAX_WORDS - 20) {
        // Warning (last 20 words)
        wordCountMessage.textContent = `Words entered: ${wordCount} / ${MAX_WORDS} (Approaching limit)`;
        wordCountMessage.style.color = 'orange';
    } else {
        // Within limit
        wordCountMessage.textContent = `Words entered: ${wordCount} / ${MAX_WORDS}`;
        wordCountMessage.style.color = 'green';
    }
}

// Attach the event listener for real-time counting and limiting
textarea.addEventListener('input', updateWordCount);

// Run the function once on load to initialize the display
updateWordCount();


// =================================================================
// 2. FORM SUBMISSION LOGIC
// =================================================================

// Helper function to display status messages
const displayMessage = (message, type) => {
    formStatus.textContent = message;
    formStatus.className = ''; // Clear previous classes
    formStatus.classList.add(type);
    formStatus.style.display = 'block';

    // 5 seconds ke baad message hide kar dein
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
};

// Form submission handler
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.style.display = 'none';

    // Form data ko collect karein
    const formData = new FormData(contactForm);
    // FormData ko plain JSON object mein convert karein jo backend expect karta hai
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            // Success
            displayMessage(result.message || 'Message sent successfully! Thank you.', 'success');
            contactForm.reset(); // Form ko reset kar dein
            updateWordCount(); // Word count display ko bhi reset karein
        } else {
            // Server side error
            displayMessage(result.message || 'Failed to send message. Please check the form data.', 'error');
        }

    } catch (error) {
        console.error('Submission Error:', error);
        displayMessage('A network error occurred. Please check your connection and server URL.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send A Message';
    }
});


// =================================================================
// 3. HEADER TOGGLE (For Navigation Bar)
// =================================================================
function toggleNav() {
    const navLinks = document.getElementById('nav-links');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    } else {
        navLinks.classList.add('active');
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    }
}