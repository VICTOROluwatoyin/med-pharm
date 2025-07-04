(function() {
    'use strict';
    
    // MedPharm AI Widget - Complete Implementation
    class MedPharmAI {
        constructor() {
            this.config = {
                apiKey: 'demo-key',
                theme: 'medical',
                position: 'bottom-right',
                title: 'MedPharm AI Assistant',
                subtitle: 'Pharmacy & Drug Information',
                apiUrl: window.location.origin,
                primaryColor: '#667eea',
                accentColor: '#4facfe',
                medicalColor: '#48bb78'
            };
            this.isOpen = false;
            this.widget = null;
            this.chatContainer = null;
            this.messageCount = 0;
        }
        
        init(options = {}) {
            this.config = { ...this.config, ...options };
            this.loadFontAwesome();
            this.loadStyles();
            this.createWidget();
            this.bindEvents();
            this.trackUsage('widget_loaded');
            console.log('🩺 MedPharm AI Widget loaded successfully');
        }
        
        loadFontAwesome() {
            if (!document.querySelector('link[href*="font-awesome"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
                document.head.appendChild(link);
            }
        }
        
        loadStyles() {
            if (document.getElementById('medpharm-styles')) return;
            
            const styles = `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                .medpharm-widget {
                    position: fixed;
                    z-index: 2147483647;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 14px;
                    line-height: 1.4;
                    color: #2d3748;
                    box-sizing: border-box;
                }
                
                .medpharm-widget *, .medpharm-widget *::before, .medpharm-widget *::after {
                    box-sizing: border-box;
                }
                
                .medpharm-widget.bottom-right { bottom: 20px; right: 20px; }
                .medpharm-widget.bottom-left { bottom: 20px; left: 20px; }
                .medpharm-widget.top-right { top: 20px; right: 20px; }
                .medpharm-widget.top-left { top: 20px; left: 20px; }
                
                .medpharm-trigger {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, ${this.config.primaryColor} 0%, ${this.config.accentColor} 100%);
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    position: relative;
                    overflow: hidden;
                    outline: none;
                }
                
                .medpharm-trigger:hover {
                    transform: scale(1.05);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
                }
                
                .medpharm-trigger:active {
                    transform: scale(0.95);
                }
                
                .medpharm-trigger::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    animation: shine 3s infinite;
                }
                
                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                
                .medpharm-notification {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 20px;
                    height: 20px;
                    background: #ef4444;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 600;
                    color: white;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                
                .medpharm-chat-container {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 400px;
                    height: 600px;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.15);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(20px) scale(0.95);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: none;
                }
                
                .medpharm-chat-container.open {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0) scale(1);
                    pointer-events: all;
                }
                
                .medpharm-widget.bottom-left .medpharm-chat-container {
                    right: auto;
                    left: 0;
                }
                
                .medpharm-widget.top-right .medpharm-chat-container {
                    bottom: auto;
                    top: 80px;
                }
                
                .medpharm-widget.top-left .medpharm-chat-container {
                    bottom: auto;
                    top: 80px;
                    right: auto;
                    left: 0;
                }
                
                .medpharm-header {
                    background: linear-gradient(135deg, ${this.config.primaryColor} 0%, ${this.config.medicalColor} 100%);
                    color: white;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                }
                
                .medpharm-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    animation: headerShine 4s infinite;
                }
                
                @keyframes headerShine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                
                .medpharm-header-content {
                    position: relative;
                    z-index: 1;
                    flex: 1;
                }
                
                .medpharm-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin: 0 0 4px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .medpharm-subtitle {
                    font-size: 0.85rem;
                    opacity: 0.9;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                .medpharm-status {
                    width: 6px;
                    height: 6px;
                    background: #10b981;
                    border-radius: 50%;
                    animation: statusPulse 2s infinite;
                }
                
                @keyframes statusPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .medpharm-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 6px;
                    transition: background 0.2s;
                    position: relative;
                    z-index: 2;
                    outline: none;
                }
                
                .medpharm-close:hover {
                    background: rgba(255,255,255,0.2);
                }
                
                .medpharm-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    background-image: 
                        radial-gradient(circle at 25px 25px, rgba(255,255,255,0.8) 2px, transparent 2px),
                        radial-gradient(circle at 75px 75px, rgba(255,255,255,0.8) 2px, transparent 2px);
                    background-size: 100px 100px;
                    background-position: 0 0, 50px 50px;
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e0 transparent;
                }
                
                .medpharm-messages::-webkit-scrollbar {
                    width: 6px;
                }
                
                .medpharm-messages::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .medpharm-messages::-webkit-scrollbar-thumb {
                    background: #cbd5e0;
                    border-radius: 3px;
                }
                
                .medpharm-messages::-webkit-scrollbar-thumb:hover {
                    background: #a0aec0;
                }
                
                .medpharm-welcome {
                    text-align: center;
                    color: #718096;
                    padding: 30px 20px;
                }
                
                .medpharm-welcome-icon {
                    font-size: 3rem;
                    margin-bottom: 16px;
                    background: linear-gradient(135deg, ${this.config.accentColor} 0%, ${this.config.medicalColor} 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .medpharm-welcome-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #2d3748;
                }
                
                .medpharm-welcome-text {
                    font-size: 0.9rem;
                    opacity: 0.8;
                    margin-bottom: 20px;
                }
                
                .medpharm-quick-questions {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-top: 16px;
                }
                
                .medpharm-quick-question {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 12px 16px;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }
                
                .medpharm-quick-question:hover {
                    background: #f7fafc;
                    border-color: ${this.config.primaryColor};
                    transform: translateY(-1px);
                }
                
                .medpharm-message {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-end;
                    animation: messageSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                @keyframes messageSlide {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .medpharm-message.user {
                    justify-content: flex-end;
                }
                
                .medpharm-message.bot {
                    justify-content: flex-start;
                }
                
                .medpharm-message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin: 0 10px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    flex-shrink: 0;
                }
                
                .medpharm-message.user .medpharm-message-avatar {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white;
                    order: 2;
                }
                
                .medpharm-message.bot .medpharm-message-avatar {
                    background: linear-gradient(135deg, ${this.config.accentColor} 0%, ${this.config.medicalColor} 100%);
                    color: white;
                    order: 1;
                }
                
                .medpharm-message-content {
                    max-width: 75%;
                    padding: 14px 18px;
                    border-radius: 18px;
                    font-size: 0.9rem;
                    line-height: 1.5;
                    position: relative;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
                    word-wrap: break-word;
                }
                
                .medpharm-message.user .medpharm-message-content {
                    background: linear-gradient(135deg, ${this.config.primaryColor} 0%, ${this.config.accentColor} 100%);
                    color: white;
                    border-bottom-right-radius: 6px;
                    order: 1;
                }
                
                .medpharm-message.bot .medpharm-message-content {
                    background: white;
                    color: #2d3748;
                    border-bottom-left-radius: 6px;
                    border: 1px solid #e2e8f0;
                    order: 2;
                }
                
                .medpharm-message-time {
                    font-size: 0.7rem;
                    opacity: 0.6;
                    margin-top: 6px;
                    text-align: center;
                }
                
                .medpharm-input-container {
                    padding: 20px;
                    background: white;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    gap: 12px;
                    align-items: flex-end;
                }
                
                .medpharm-input-wrapper {
                    flex: 1;
                    position: relative;
                }
                
                .medpharm-input {
                    width: 100%;
                    padding: 14px 18px;
                    border: 2px solid #e2e8f0;
                    border-radius: 22px;
                    font-size: 0.9rem;
                    font-family: inherit;
                    outline: none;
                    resize: none;
                    min-height: 44px;
                    max-height: 120px;
                    transition: all 0.3s ease;
                    background: #f8fafc;
                }
                
                .medpharm-input:focus {
                    border-color: ${this.config.primaryColor};
                    background: white;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                .medpharm-input::placeholder {
                    color: #a0aec0;
                }
                
                .medpharm-send {
                    background: linear-gradient(135deg, ${this.config.primaryColor} 0%, ${this.config.accentColor} 100%);
                    color: white;
                    border: none;
                    padding: 12px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    outline: none;
                }
                
                .medpharm-send:hover:not(:disabled) {
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }
                
                .medpharm-send:active:not(:disabled) {
                    transform: translateY(0) scale(0.98);
                }
                
                .medpharm-send:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                
                .medpharm-typing {
                    display: flex;
                    align-items: center;
                    padding: 14px 18px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 18px;
                    border-bottom-left-radius: 6px;
                    max-width: 75%;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
                    animation: messageSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .medpharm-typing-dots {
                    display: flex;
                    gap: 4px;
                    margin-right: 10px;
                }
                
                .medpharm-typing-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #718096;
                    animation: typingDot 1.4s infinite;
                }
                
                .medpharm-typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .medpharm-typing-dot:nth-child(3) { animation-delay: 0.4s; }
                
                @keyframes typingDot {
                    0%, 60%, 100% {
                        transform: scale(1);
                        opacity: 0.7;
                    }
                    30% {
                        transform: scale(1.3);
                        opacity: 1;
                    }
                }
                
                /* Markdown Styles */
                .medpharm-message-content strong {
                    font-weight: 600;
                    color: inherit;
                }
                
                .medpharm-message-content em {
                    font-style: italic;
                    color: inherit;
                }
                
                .medpharm-message-content h1, 
                .medpharm-message-content h2, 
                .medpharm-message-content h3 {
                    margin: 12px 0 8px 0;
                    font-weight: 600;
                    color: inherit;
                }
                
                .medpharm-message-content ul {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                
                .medpharm-message-content li {
                    margin: 6px 0;
                    line-height: 1.4;
                }
                
                .medpharm-message-content code {
                    background: rgba(0,0,0,0.1);
                    padding: 3px 6px;
                    border-radius: 4px;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-size: 0.8rem;
                    color: inherit;
                }
                
                .medpharm-message-content a {
                    color: ${this.config.primaryColor};
                    text-decoration: none;
                    border-bottom: 1px dotted ${this.config.primaryColor};
                    transition: all 0.2s ease;
                }
                
                .medpharm-message-content a:hover {
                    opacity: 0.8;
                }
                
                .medpharm-user-message .medpharm-message-content code {
                    background: rgba(255,255,255,0.2);
                }
                
                .medpharm-user-message .medpharm-message-content a {
                    color: rgba(255,255,255,0.9);
                    border-bottom-color: rgba(255,255,255,0.7);
                }
                
                /* Error Styles */
                .medpharm-error {
                    background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
                    border: 1px solid #fc8181;
                    color: #c53030;
                }
                
                /* Disclaimer */
                .medpharm-disclaimer {
                    font-size: 0.75rem;
                    color: #718096;
                    margin-top: 8px;
                    padding: 8px;
                    background: rgba(0,0,0,0.05);
                    border-radius: 6px;
                    font-style: italic;
                }
                
                /* Mobile Responsive */
                @media (max-width: 480px) {
                    .medpharm-chat-container {
                        width: calc(100vw - 20px);
                        height: calc(100vh - 100px);
                        bottom: 80px;
                        right: 10px;
                        left: 10px;
                        border-radius: 16px;
                    }
                    
                    .medpharm-widget.bottom-left .medpharm-chat-container,
                    .medpharm-widget.top-left .medpharm-chat-container,
                    .medpharm-widget.top-right .medpharm-chat-container {
                        left: 10px;
                        right: 10px;
                    }
                    
                    .medpharm-message-content {
                        max-width: 85%;
                        padding: 12px 16px;
                    }
                    
                    .medpharm-messages {
                        padding: 16px;
                    }
                    
                    .medpharm-input-container {
                        padding: 16px;
                    }
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.id = 'medpharm-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        createWidget() {
            this.widget = document.createElement('div');
            this.widget.className = `medpharm-widget ${this.config.position}`;
            this.widget.innerHTML = `
                <button class="medpharm-trigger" title="${this.config.title}" aria-label="Open ${this.config.title}">
                    <i class="fas fa-pills"></i>
                    <div class="medpharm-notification" style="display: none;">1</div>
                </button>
                <div class="medpharm-chat-container" role="dialog" aria-labelledby="medpharm-title">
                    <div class="medpharm-header">
                        <div class="medpharm-header-content">
                            <h3 class="medpharm-title" id="medpharm-title">
                                <i class="fas fa-user-md"></i>
                                ${this.config.title}
                            </h3>
                            <p class="medpharm-subtitle">
                                <span class="medpharm-status"></span>
                                ${this.config.subtitle}
                            </p>
                        </div>
                        <button class="medpharm-close" aria-label="Close chat">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="medpharm-messages" aria-live="polite">
                        <div class="medpharm-welcome">
                            <div class="medpharm-welcome-icon">
                                <i class="fas fa-prescription-bottle-alt"></i>
                            </div>
                            <div class="medpharm-welcome-title">Welcome to MedPharm AI!</div>
                            <div class="medpharm-welcome-text">
                                I'm your AI-powered pharmacy assistant. I can help with medication information, drug interactions, dosages, and safety guidelines.
                            </div>
                            <div class="medpharm-quick-questions">
                                <button class="medpharm-quick-question" onclick="window.MedPharmAI.sendQuickQuestion('What are the side effects of ibuprofen?')">
                                    What are the side effects of ibuprofen?
                                </button>
                                <button class="medpharm-quick-question" onclick="window.MedPharmAI.sendQuickQuestion('Can I take aspirin with blood thinners?')">
                                    Can I take aspirin with blood thinners?
                                </button>
                                <button class="medpharm-quick-question" onclick="window.MedPharmAI.sendQuickQuestion('What is the recommended dosage for acetaminophen?')">
                                    What is the recommended dosage for acetaminophen?
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="medpharm-input-container">
                        <div class="medpharm-input-wrapper">
                            <textarea class="medpharm-input" placeholder="Ask about medications, interactions, dosages..." rows="1" aria-label="Type your message"></textarea>
                        </div>
                        <button class="medpharm-send" aria-label="Send message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(this.widget);
            this.chatContainer = this.widget.querySelector('.medpharm-chat-container');
            
            // Show notification after 5 seconds
            setTimeout(() => {
                this.showNotification();
            }, 5000);
        }
        
        bindEvents() {
            const trigger = this.widget.querySelector('.medpharm-trigger');
            const closeBtn = this.widget.querySelector('.medpharm-close');
            const input = this.widget.querySelector('.medpharm-input');
            const sendBtn = this.widget.querySelector('.medpharm-send');
            
            trigger.addEventListener('click', () => this.toggleChat());
            closeBtn.addEventListener('click', () => this.closeChat());
            sendBtn.addEventListener('click', () => this.sendMessage());
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            input.addEventListener('input', () => this.autoResize());
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeChat();
                }
            });
        }
        
        showNotification() {
            const notification = this.widget.querySelector('.medpharm-notification');
            if (notification && !this.isOpen) {
                notification.style.display = 'flex';
            }
        }
        
        hideNotification() {
            const notification = this.widget.querySelector('.medpharm-notification');
            if (notification) {
                notification.style.display = 'none';
            }
        }
        
        toggleChat() {
            if (this.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        }
        
        openChat() {
            this.isOpen = true;
            this.chatContainer.classList.add('open');
            this.hideNotification();
            this.trackUsage('chat_opened');
            
            setTimeout(() => {
                const input = this.widget.querySelector('.medpharm-input');
                input.focus();
            }, 300);
        }
        
        closeChat() {
            this.isOpen = false;
            this.chatContainer.classList.remove('open');
            this.trackUsage('chat_closed');
        }
        
        autoResize() {
            const input = this.widget.querySelector('.medpharm-input');
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        }
        
        formatTime() {
            return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        addMessage(content, isUser = false, isError = false) {
            const messages = this.widget.querySelector('.medpharm-messages');
            const welcome = messages.querySelector('.medpharm-welcome');
            
            if (welcome) {
                welcome.remove();
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `medpharm-message ${isUser ? 'user' : 'bot'}`;
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'medpharm-message-avatar';
            avatarDiv.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = `medpharm-message-content ${isError ? 'medpharm-error' : ''}`;
            
            if (isUser) {
                contentDiv.textContent = content;
            } else {
                contentDiv.innerHTML = this.parseMarkdown(content);
                
                // Add disclaimer for medical advice
                if (!isError) {
                    const disclaimer = document.createElement('div');
                    disclaimer.className = 'medpharm-disclaimer';
                    disclaimer.textContent = '⚠️ This information is for educational purposes only. Always consult with a healthcare professional for medical advice.';
                    contentDiv.appendChild(disclaimer);
                }
            }
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'medpharm-message-time';
            timeDiv.textContent = this.formatTime();
            contentDiv.appendChild(timeDiv);
            
            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(contentDiv);
            messages.appendChild(messageDiv);
            
            this.scrollToBottom();
            
            if (!isUser) {
                this.trackUsage('message_received');
            }
        }
        
        scrollToBottom() {
            const messages = this.widget.querySelector('.medpharm-messages');
            messages.scrollTo({
                top: messages.scrollHeight,
                behavior: 'smooth'
            });
        }
        
        showTyping() {
            const messages = this.widget.querySelector('.medpharm-messages');
            const typingDiv = document.createElement('div');
            typingDiv.className = 'medpharm-message bot';
            typingDiv.id = 'medpharm-typing';
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'medpharm-message-avatar';
            avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
            
            const typingContent = document.createElement('div');
            typingContent.className = 'medpharm-typing';
            typingContent.innerHTML = `
                <div class="medpharm-typing-dots">
                    <div class="medpharm-typing-dot"></div>
                    <div class="medpharm-typing-dot"></div>
                    <div class="medpharm-typing-dot"></div>
                </div>
                <span style="font-size: 0.8rem; color: #718096;">Analyzing your query...</span>
            `;
            
            typingDiv.appendChild(avatarDiv);
            typingDiv.appendChild(typingContent);
            messages.appendChild(typingDiv);
            
            this.scrollToBottom();
        }
        
        hideTyping() {
            const typing = document.getElementById('medpharm-typing');
            if (typing) {
                typing.style.opacity = '0';
                typing.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    if (typing.parentNode) {
                        typing.remove();
                    }
                }, 200);
            }
        }
        
        parseMarkdown(text) {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/^\* (.*$)/gm, '<li>$1</li>')
                .replace(/^- (.*$)/gm, '<li>$1</li>')
                .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
                .replace(/\n/g, '<br>')
                .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
        }
        
        sendQuickQuestion(question) {
            const input = this.widget.querySelector('.medpharm-input');
            input.value = question;
            this.sendMessage();
        }
        
        async sendMessage() {
            const input = this.widget.querySelector('.medpharm-input');
            const sendBtn = this.widget.querySelector('.medpharm-send');
            const message = input.value.trim();
            
            if (!message) return;
            
            this.messageCount++;
            this.addMessage(message, true);
            input.value = '';
            input.style.height = 'auto';
            sendBtn.disabled = true;
            
            this.showTyping();
            this.trackUsage('message_sent', { message_count: this.messageCount });
            
            try {
                const medicalPrompt = `As a pharmaceutical assistant specializing in medication information, please provide accurate, helpful information about: ${message}. 

                Focus on:
                - Drug interactions and contraindications
                - Dosage information and administration
                - Side effects and safety considerations
                - Proper storage and handling
                - When to consult healthcare professionals
                
                Always include appropriate medical disclaimers and encourage consulting healthcare professionals for personalized medical advice. Format your response with clear sections using markdown.`;
                
                const response = await fetch(`${this.config.apiUrl}/api/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        message: medicalPrompt,
                        widget: true,
                        apiKey: this.config.apiKey,
                        timestamp: new Date().toISOString(),
                        session_id: this.getSessionId()
                    })
                });
                
                const data = await response.json();
                
                this.hideTyping();
                
                setTimeout(() => {
                    if (response.ok) {
                        this.addMessage(data.response);
                    } else {
                        this.addMessage('I apologize, but I encountered an error processing your request. Please try again or consult with a healthcare professional for immediate assistance.', false, true);
                    }
                }, 500);
                
            } catch (error) {
                this.hideTyping();
                setTimeout(() => {
                    this.addMessage('Connection error. Please check your internet connection and try again. For urgent medical questions, please contact a healthcare professional immediately.', false, true);
                }, 500);
            }
            
            sendBtn.disabled = false;
        }
        
        getSessionId() {
            if (!this.sessionId) {
                this.sessionId = 'medpharm_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            }
            return this.sessionId;
        }
        
        trackUsage(event, data = {}) {
            // Analytics tracking
            try {
                const payload = {
                    event,
                    timestamp: new Date().toISOString(),
                    session_id: this.getSessionId(),
                    widget_config: {
                        position: this.config.position,
                        theme: this.config.theme
                    },
                    page_url: window.location.href,
                    user_agent: navigator.userAgent,
                    ...data
                };
                
                // Send to analytics endpoint
                fetch(`${this.config.apiUrl}/analytics`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                }).catch(() => {
                    // Silent fail for analytics
                });
                
                console.log('📊 MedPharm Analytics:', event, data);
            } catch (error) {
                // Silent fail for analytics
            }
        }
        
        // Public methods
        destroy() {
            if (this.widget && this.widget.parentNode) {
                this.widget.parentNode.removeChild(this.widget);
            }
            const styles = document.getElementById('medpharm-styles');
            if (styles && styles.parentNode) {
                styles.parentNode.removeChild(styles);
            }
        }
        
        updateConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
            // Reinitialize if needed
        }
    }
    
    // Make it globally available
    window.MedPharmAI = MedPharmAI;
    
    // Auto-initialize with data attributes
    document.addEventListener('DOMContentLoaded', () => {
        const autoInit = document.querySelector('[data-medpharm-auto]');
        if (autoInit) {
            const config = {
                apiKey: autoInit.dataset.apiKey || 'demo-key',
                theme: autoInit.dataset.theme || 'medical',
                position: autoInit.dataset.position || 'bottom-right',
                title: autoInit.dataset.title || 'MedPharm AI Assistant',
                subtitle: autoInit.dataset.subtitle || 'Pharmacy & Drug Information',
                primaryColor: autoInit.dataset.primaryColor || '#667eea',
                accentColor: autoInit.dataset.accentColor || '#4facfe'
            };
            const widget = new MedPharmAI();
            widget.init(config);
        }
    });
    
})();
