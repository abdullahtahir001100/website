
        // Get the textarea element and create a new element for the word count message
        const textarea = document.getElementById('message');
        const wordCountMessage = document.createElement('p');
        wordCountMessage.id = 'word-count-message';
        wordCountMessage.style.fontSize = '0.85em';
        wordCountMessage.style.marginTop = '5px';
        wordCountMessage.style.textAlign = 'left';

        // Insert the word count message below the textarea
        const textareaContainer = textarea.parentElement;
        textareaContainer.appendChild(wordCountMessage);

        // Define the word limit
        const MAX_WORDS = 250;

        /**
         * Updates the word count display and enforces the word limit.
         */
        function updateWordCount() {
            // Get the text from the textarea and trim whitespace
            const text = textarea.value.trim();

            // Split the text by any sequence of whitespace characters (including newlines) to count words.
            // \S+ means one or more non-whitespace characters.
            // If the text is empty, text.match(/\S+/g) will be null.
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

                // Display an error to the user (optional alert for better UX)
                setTimeout(() => {
                    alert(`Error: The message is limited to ${MAX_WORDS} words. Excess words have been removed.`);
                }, 1);

            } else {
                // Within limit
                wordCountMessage.textContent = `Words entered: ${wordCount} / ${MAX_WORDS}`;
                wordCountMessage.style.color = 'green';
            }
        }

        // Attach the event listener to the textarea
        textarea.addEventListener('input', updateWordCount);

        // Run the function once on load to initialize the display
        updateWordCount();
  