// ============================================
// CHATBOT JAVASCRIPT - CodeAssist AI
// ============================================

class Chatbot {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        this.isTyping = false;
        this.conversationContext = [];
        this.init();
    }

    init() {
        this.createChatbotWidget();
        this.attachEventListeners();
        this.loadChatHistory();
        console.log('🤖 Chatbot - Initialized');
    }

    createChatbotWidget() {
        // Check if chatbot already exists
        if (document.getElementById('chatbotWidget')) return;

        const chatbotHTML = `
            <!-- Chatbot Button -->
            <button class="chatbot-button" id="chatbotButton">
                <i class="fas fa-comment-dots"></i>
                <span class="chatbot-badge">AI</span>
            </button>

            <!-- Chatbot Widget -->
            <div class="chatbot-widget" id="chatbotWidget">
                <div class="chatbot-header">
                    <div class="chatbot-header-content">
                        <div class="chatbot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div>
                            <h4>CodeAssist AI</h4>
                            <p class="chatbot-status">
                                <span class="status-dot"></span> Online
                            </p>
                        </div>
                    </div>
                    <div class="chatbot-header-actions">
                        <button class="chatbot-header-btn" id="clearChat" title="Clear chat">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="chatbot-header-btn" id="closeChatbot" title="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <div class="chatbot-messages" id="chatbotMessages">
                    <div class="chatbot-message bot-message">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <p>Hi! 👋 I'm your AI coding assistant. How can I help you today?</p>
                            <div class="quick-actions">
                                <button class="quick-action-btn">Getting Started</button>
                                <button class="quick-action-btn">Pricing Info</button>
                                <button class="quick-action-btn">Technical Support</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chatbot-input-container">
                    <div class="chatbot-input-wrapper">
                        <input
                            type="text"
                            class="chatbot-input"
                            id="chatbotInput"
                            placeholder="Type your message..."
                            autocomplete="off"
                        >
                        <button class="chatbot-send-btn" id="sendMessage">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <p class="chatbot-disclaimer">AI responses may contain errors. Verify important information.</p>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        // Open chatbot
        const chatbotButton = document.getElementById('chatbotButton');
        if (chatbotButton) {
            chatbotButton.addEventListener('click', () => this.toggleChatbot());
        }

        // Close chatbot
        const closeBtn = document.getElementById('closeChatbot');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeChatbot());
        }

        // Clear chat
        const clearBtn = document.getElementById('clearChat');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearChat());
        }

        // Send message
        const sendBtn = document.getElementById('sendMessage');
        const input = document.getElementById('chatbotInput');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Quick action buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-btn')) {
                const action = e.target.textContent;
                this.handleQuickAction(action);
            }
        });
    }

    toggleChatbot() {
        const widget = document.getElementById('chatbotWidget');
        const button = document.getElementById('chatbotButton');

        if (widget.classList.contains('active')) {
            this.closeChatbot();
        } else {
            widget.classList.add('active');
            button.style.display = 'none';
            this.isOpen = true;

            // Focus input
            setTimeout(() => {
                document.getElementById('chatbotInput')?.focus();
            }, 300);
        }
    }

    closeChatbot() {
        const widget = document.getElementById('chatbotWidget');
        const button = document.getElementById('chatbotButton');

        widget.classList.remove('active');
        button.style.display = 'flex';
        this.isOpen = false;
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate AI response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageEl = document.createElement('div');
        messageEl.className = `chatbot-message ${sender}-message`;

        if (sender === 'bot') {
            messageEl.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>${text}</p>
                </div>
            `;
        } else {
            messageEl.innerHTML = `
                <div class="message-content">
                    <p>${text}</p>
                </div>
            `;
        }

        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Save to history
        this.messages.push({ text, sender, timestamp: Date.now() });
        this.saveChatHistory();
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingEl = document.createElement('div');
        typingEl.className = 'chatbot-message bot-message typing-indicator';
        typingEl.id = 'typingIndicator';
        typingEl.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.isTyping = true;
    }

    hideTypingIndicator() {
        const typingEl = document.getElementById('typingIndicator');
        if (typingEl) {
            typingEl.remove();
        }
        this.isTyping = false;
    }

    generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        // Knowledge base responses
        const responses = {
            pricing: "Our pricing starts at $0/month for the Free tier with basic features. Pro is $29/month with unlimited AI suggestions. Enterprise plans start at $299/month with dedicated support. Would you like to see the full pricing comparison?",

            features: "CodeAssist AI offers real-time code completion, intelligent error detection, multi-language support (40+ languages), code snippets library, and AI-powered chatbot. What specific feature would you like to learn more about?",

            'getting started': "Getting started is easy! 1) Sign up for a free account 2) Install our IDE extension or use the web editor 3) Start coding and experience AI suggestions in real-time. Need help with installation?",

            support: "We offer 24/7 support via live chat, email (support@codeassist.ai), and our community forum. Pro users get priority support with response within 2 hours. How can we help you today?",

            languages: "We support 40+ programming languages including JavaScript, Python, Java, C++, TypeScript, Ruby, Go, Rust, PHP, Swift, Kotlin, and more! Which language are you interested in?",

            api: "Yes! We offer a REST API for integrating CodeAssist AI into your tools and workflows. Check our API documentation at /api-reference for details. Need help with integration?",

            security: "Your code security is our top priority. We use end-to-end encryption, don't store your code permanently, and are SOC 2 Type II certified. Read more in our Security page."
        };

        // Check for keyword matches
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        // Default helpful response
        return "I'm here to help! I can answer questions about our features, pricing, getting started, technical support, programming languages, API integration, and security. What would you like to know?";
    }

    handleQuickAction(action) {
        // Simulate clicking the quick action
        const input = document.getElementById('chatbotInput');
        input.value = action;
        this.sendMessage();
    }

    clearChat() {
        if (confirm('Clear all chat messages?')) {
            const messagesContainer = document.getElementById('chatbotMessages');
            messagesContainer.innerHTML = `
                <div class="chatbot-message bot-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>Chat cleared. How can I help you today?</p>
                    </div>
                </div>
            `;
            this.messages = [];
            localStorage.removeItem('chatbot_history');
        }
    }

    saveChatHistory() {
        localStorage.setItem('chatbot_history', JSON.stringify(this.messages));
    }

    loadChatHistory() {
        const saved = localStorage.getItem('chatbot_history');
        if (saved) {
            this.messages = JSON.parse(saved);
        }
    }
}

// Initialize chatbot
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new Chatbot();
});
