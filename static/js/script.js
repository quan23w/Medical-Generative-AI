document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('message-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    
    // Format the current time as HH:MM
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Add a new message to the chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
        
        const currentTime = getCurrentTime();
        
        // Only add avatar for bot messages
        let avatarHtml = '';
        if (!isUser) {
            avatarHtml = `
                <div class="avatar">
                    <img src="/static/image/doctor.png" alt="Bot">
                </div>
            `;
        }
        
        messageDiv.innerHTML = `
            ${avatarHtml}
            <div class="message-content">
                <p>${content}</p>
                <span class="timestamp">${currentTime}</span>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Show the typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing';
        typingDiv.innerHTML = `
            <div class="avatar">
                <img src="/static/image/doctor.png" alt="Bot">
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
        return typingDiv;
    }
    
    // Scroll to the bottom of the chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Handle form submission
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userMessage = userInput.value.trim();
        if (!userMessage) return;
        
        // Add user message to chat
        addMessage(userMessage, true);
        userInput.value = '';
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        // Send the message to the server
        fetch('/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `msg=${encodeURIComponent(userMessage)}`
        })
        .then(response => response.text())
        .then(data => {
            // Remove typing indicator
            typingIndicator.remove();
            // Add bot response
            addMessage(data);
        })
        .catch(error => {
            console.error('Error:', error);
            typingIndicator.remove();
            addMessage('Sorry, I encountered an error processing your request. Please try again.');
        });
    });
    
    // Initialize by scrolling to bottom
    scrollToBottom();
});