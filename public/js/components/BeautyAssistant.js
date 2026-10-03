import { API } from '../api.js';

export class BeautyAssistant {
  constructor({ getCurrentAnalysis }) {
    this.getCurrentAnalysis = getCurrentAnalysis;
    this.messages = [
      {
        sender: 'assistant',
        text: `### Hello! I am your AI Beauty Assistant 🌿\n\nI can help you interpret your Bio Beauty Profile, break down active ingredients, and optimize your daily morning, evening, or weekly skincare steps.\n\n*Tap any of the common questions below or ask your own!*`
      }
    ];
    this.isLoading = false;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'assistant-container fade-in';
    container.innerHTML = `
      <div class="assistant-card glass-panel">
        <!-- Header -->
        <div class="assistant-header">
          <div class="assistant-avatar">
            <span class="bot-icon">🌿</span>
            <span class="online-indicator"></span>
          </div>
          <div class="assistant-meta">
            <h3>Bio Beauty AI Assistant</h3>
            <span class="assistant-status">Active • Calibrated with your latest scan data</span>
          </div>
        </div>

        <!-- Quick Prompts Row -->
        <div class="quick-prompts-bar">
          <span class="prompts-label">Suggested Inquiries:</span>
          <div class="prompts-scroll" id="promptsScroll">
            <button class="prompt-chip" data-prompt="What does my analysis mean?">
              “What does my analysis mean?”
            </button>
            <button class="prompt-chip" data-prompt="Build me a morning routine.">
              “Build me a morning routine.”
            </button>
            <button class="prompt-chip" data-prompt="Which ingredients should I look for?">
              “Which ingredients should I look for?”
            </button>
            <button class="prompt-chip" data-prompt="Explain my skin texture result.">
              “Explain my skin texture result.”
            </button>
            <button class="prompt-chip" data-prompt="How can I improve my beauty routine?">
              “How can I improve my beauty routine?”
            </button>
          </div>
        </div>

        <!-- Messages Feed -->
        <div class="messages-feed" id="messagesFeed"></div>

        <!-- Input Area -->
        <form class="assistant-input-form" id="assistantForm">
          <input 
            type="text" 
            id="chatInput" 
            class="chat-input-field" 
            placeholder="Ask about ingredients, routines, skin texture, or your scan..." 
            autocomplete="off" 
          />
          <button type="submit" class="btn btn-primary send-btn" id="btnSend">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span>Send</span>
          </button>
        </form>

        <div class="assistant-footer-disclaimer">
          AI cosmetic educational assistant. Does not provide medical advice or dermatological diagnoses.
        </div>
      </div>
    `;

    this.attachEvents(container);
    this.renderMessages(container);
    return container;
  }

  attachEvents(container) {
    const form = container.querySelector('#assistantForm');
    const input = container.querySelector('#chatInput');
    const promptsScroll = container.querySelector('#promptsScroll');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || this.isLoading) return;
      input.value = '';
      this.handleUserMessage(text, container);
    });

    promptsScroll.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const promptText = chip.getAttribute('data-prompt');
        if (promptText && !this.isLoading) {
          this.handleUserMessage(promptText, container);
        }
      });
    });
  }

  async handleUserMessage(userText, container) {
    // Add user message
    this.messages.push({ sender: 'user', text: userText });
    this.isLoading = true;
    this.renderMessages(container);

    const contextAnalysis = this.getCurrentAnalysis ? this.getCurrentAnalysis() : null;

    try {
      const reply = await API.askAssistant(userText, contextAnalysis);
      this.messages.push({ sender: 'assistant', text: reply });
    } catch (e) {
      this.messages.push({
        sender: 'assistant',
        text: 'I apologize, but I encountered an issue generating a response. Please try asking again in a moment.'
      });
    } finally {
      this.isLoading = false;
      this.renderMessages(container);
    }
  }

  renderMessages(container) {
    const feed = container.querySelector('#messagesFeed');
    if (!feed) return;

    let html = this.messages.map(msg => {
      const isUser = msg.sender === 'user';
      return `
        <div class="message-row ${isUser ? 'msg-user' : 'msg-bot'}">
          <div class="msg-avatar">${isUser ? '👤' : '🌿'}</div>
          <div class="msg-bubble glass-panel">
            ${this.formatMarkdown(msg.text)}
          </div>
        </div>
      `;
    }).join('');

    if (this.isLoading) {
      html += `
        <div class="message-row msg-bot">
          <div class="msg-avatar">🌿</div>
          <div class="msg-bubble glass-panel typing-indicator">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      `;
    }

    feed.innerHTML = html;
    feed.scrollTop = feed.scrollHeight;
  }

  formatMarkdown(text) {
    if (!text) return '';
    // Simple markdown formatting
    let formatted = text
      .replace(/^### (.*$)/gim, '<h4 class="md-h4">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="md-li">$1</li>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');

    // Wrap li in ul if needed
    if (formatted.includes('<li')) {
      formatted = formatted.replace(/(<li.*<\/li>)/gms, '<ul class="md-ul">$1</ul>');
    }
    return formatted;
  }
}
