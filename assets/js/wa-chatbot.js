/**
 * Maximus HealthCare Consult — Interactive Circular WhatsApp Chatbot Widget (Bottom-Left)
 * Official WhatsApp: +233 24 803 1796
 */

(function initWhatsAppChatbot() {
  const WHATSAPP_NUMBER = "233248031796";

  // Create stylesheet for the chatbot
  const style = document.createElement("style");
  style.textContent = `
    /* Floating Circular Button (Bottom-Left) */
    .maximus-wa-fab {
      position: fixed;
      bottom: 24px;
      left: 24px;
      z-index: 99999;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      color: #FFFFFF;
      box-shadow: 0 10px 28px rgba(37, 211, 102, 0.45), 0 4px 12px rgba(0, 0, 0, 0.15);
      border: 3px solid #FFFFFF;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      outline: none;
    }

    .maximus-wa-fab:hover {
      transform: scale(1.08) translateY(-3px);
      box-shadow: 0 14px 34px rgba(37, 211, 102, 0.6);
    }

    .maximus-wa-fab svg {
      width: 32px;
      height: 32px;
      fill: #FFFFFF;
      transition: transform 0.3s ease;
    }

    .maximus-wa-fab.open svg {
      transform: rotate(90deg);
    }

    /* Pulsing Signal Ring */
    .maximus-wa-pulse {
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border-radius: 50%;
      border: 2px solid #25D366;
      animation: waPulse 2s infinite ease-out;
      pointer-events: none;
    }

    @keyframes waPulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.25); opacity: 0; }
      100% { transform: scale(0.95); opacity: 0; }
    }

    /* Notification Badge */
    .maximus-wa-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: #D72B2B;
      color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 11px;
      font-weight: 700;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #FFFFFF;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      animation: badgeBounce 1s ease infinite alternate;
    }

    @keyframes badgeBounce {
      0% { transform: translateY(0); }
      100% { transform: translateY(-3px); }
    }

    /* Chatbot Window Container (Bottom-Left) */
    .maximus-chat-window {
      position: fixed;
      bottom: 98px;
      left: 24px;
      width: 370px;
      max-width: calc(100vw - 48px);
      height: 520px;
      max-height: calc(100vh - 120px);
      background: #ECE5DD;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(10, 10, 26, 0.28), 0 4px 16px rgba(0,0,0,0.1);
      z-index: 99998;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.95);
      transform-origin: bottom left;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .maximus-chat-window.active {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    /* Chat Window Header */
    .maximus-chat-header {
      background: #075E54;
      color: #FFFFFF;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    .maximus-chat-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #FFFFFF;
      border: 2px solid #25D366;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
      overflow: hidden;
    }

    .maximus-chat-avatar img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .maximus-chat-header-info {
      flex: 1;
      min-width: 0;
    }

    .maximus-chat-header-title {
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 5px;
      line-height: 1.2;
    }

    .maximus-verified-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 15px;
      height: 15px;
      background: #25D366;
      color: #FFFFFF;
      border-radius: 50%;
      font-size: 9px;
      font-weight: 900;
    }

    .maximus-chat-header-status {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.82);
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 2px;
    }

    .maximus-chat-header-status .status-dot {
      width: 7px;
      height: 7px;
      background: #25D366;
      border-radius: 50%;
      display: inline-block;
    }

    .maximus-chat-close-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.85);
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
      line-height: 1;
      transition: color 0.2s;
    }

    .maximus-chat-close-btn:hover {
      color: #FFFFFF;
    }

    /* Chat Messages Body */
    .maximus-chat-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background-color: #EFE7DE;
      background-image: radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px);
      background-size: 16px 16px;
    }

    .chat-date-chip {
      align-self: center;
      background: rgba(255, 255, 255, 0.85);
      color: #667781;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.06);
      margin-bottom: 4px;
    }

    .chat-bubble {
      max-width: 84%;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13.5px;
      line-height: 1.45;
      position: relative;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      word-wrap: break-word;
    }

    .chat-bubble.bot {
      align-self: flex-start;
      background: #FFFFFF;
      color: #111B21;
      border-top-left-radius: 0;
    }

    .chat-bubble.user {
      align-self: flex-end;
      background: #E7FFDB;
      color: #111B21;
      border-top-right-radius: 0;
    }

    .chat-bubble-time {
      font-size: 10px;
      color: #667781;
      text-align: right;
      margin-top: 4px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 3px;
    }

    /* Quick Action Chips */
    .chat-action-chips {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-top: 4px;
    }

    .chat-chip {
      background: #FFFFFF;
      border: 1px solid #D1D7DB;
      border-radius: 12px;
      padding: 8px 12px;
      font-size: 12.5px;
      font-weight: 500;
      color: #128C7E;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .chat-chip:hover {
      background: #F0FDF4;
      border-color: #25D366;
      color: #075E54;
      transform: translateX(3px);
    }

    .chat-cta-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #25D366;
      color: #FFFFFF;
      font-weight: 700;
      font-size: 13px;
      padding: 10px 14px;
      border-radius: 8px;
      text-decoration: none;
      margin-top: 8px;
      box-shadow: 0 2px 8px rgba(37, 211, 102, 0.4);
      transition: background 0.2s;
    }

    .chat-cta-btn:hover {
      background: #128C7E;
    }

    /* Typing indicator */
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      background: #FFFFFF;
      border-radius: 8px;
      border-top-left-radius: 0;
      width: fit-content;
    }

    .typing-dot {
      width: 6px;
      height: 6px;
      background: #8696A0;
      border-radius: 50%;
      animation: typingAnimation 1.4s infinite ease-in-out;
    }

    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typingAnimation {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }

    /* Chat Footer Input */
    .maximus-chat-footer {
      background: #F0F2F5;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-top: 1px solid #E9EDEF;
    }

    .maximus-chat-input {
      flex: 1;
      padding: 9px 14px;
      background: #FFFFFF;
      border: 1px solid #D1D7DB;
      border-radius: 24px;
      font-size: 13.5px;
      outline: none;
      font-family: inherit;
    }

    .maximus-chat-input:focus {
      border-color: #128C7E;
    }

    .maximus-chat-send-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #128C7E;
      color: #FFFFFF;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s;
      flex-shrink: 0;
    }

    .maximus-chat-send-btn:hover {
      background: #075E54;
    }

    .maximus-chat-send-btn svg {
      width: 18px;
      height: 18px;
      fill: #FFFFFF;
      transform: translateX(1px);
    }
  `;
  document.head.appendChild(style);

  // Create DOM Elements
  const container = document.createElement("div");
  container.id = "maximus-wa-chatbot-root";
  container.innerHTML = `
    <!-- Circular FAB Button (Bottom-Left) -->
    <button class="maximus-wa-fab" id="maximus-wa-toggle" aria-label="Open WhatsApp Health Assistant">
      <div class="maximus-wa-pulse"></div>
      <div class="maximus-wa-badge">1</div>
      <svg viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </button>

    <!-- Chat Window Container -->
    <div class="maximus-chat-window" id="maximus-chat-window" role="dialog" aria-label="WhatsApp Health Concierge">
      <!-- Header -->
      <div class="maximus-chat-header">
        <div class="maximus-chat-avatar">
          <span>🏥</span>
        </div>
        <div class="maximus-chat-header-info">
          <div class="maximus-chat-header-title">
            Maximus HealthCare
            <span class="maximus-verified-badge" title="Verified Health Platform">✓</span>
          </div>
          <div class="maximus-chat-header-status">
            <span class="status-dot"></span>
            <span>Online | East Legon Pharmacist</span>
          </div>
        </div>
        <button class="maximus-chat-close-btn" id="maximus-chat-close" aria-label="Close Chat">✕</button>
      </div>

      <!-- Body -->
      <div class="maximus-chat-body" id="maximus-chat-messages">
        <div class="chat-date-chip">TODAY</div>
        
        <div class="chat-bubble bot">
          <strong>Hello! 👋 Akwaaba to Maximus HealthCare Consult.</strong><br>
          I am your instant healthcare concierge based in East Legon, Accra.
          <div class="chat-bubble-time">${getCurrentTime()}</div>
        </div>

        <div class="chat-bubble bot">
          How may our clinical team assist you today? Choose an option below:
          <div class="chat-action-chips">
            <button class="chat-chip" data-intent="delivery">🚚 <strong>Order Meds & Doorstep Delivery</strong></button>
            <button class="chat-chip" data-intent="chronic">🔄 <strong>Chronic Care Monthly Auto-Refill</strong></button>
            <button class="chat-chip" data-intent="consult">🩺 <strong>Speak to a Licensed Pharmacist</strong></button>
            <button class="chat-chip" data-intent="corporate">🏢 <strong>Corporate Wellness & Screenings</strong></button>
            <button class="chat-chip" data-intent="outreach">❤️ <strong>Book Free Church Health Day</strong></button>
            <button class="chat-chip" data-intent="calculator">📊 <strong>Calculate My BMI & Health Score</strong></button>
          </div>
          <div class="chat-bubble-time">${getCurrentTime()}</div>
        </div>
      </div>

      <!-- Footer -->
      <form class="maximus-chat-footer" id="maximus-chat-form">
        <input type="text" class="maximus-chat-input" id="maximus-chat-input" placeholder="Type a message or question..." autocomplete="off">
        <button type="submit" class="maximus-chat-send-btn" aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(container);

  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }

  // Element handles
  const toggleBtn = document.getElementById("maximus-wa-toggle");
  const chatWindow = document.getElementById("maximus-chat-window");
  const closeBtn = document.getElementById("maximus-chat-close");
  const messagesContainer = document.getElementById("maximus-chat-messages");
  const chatForm = document.getElementById("maximus-chat-form");
  const chatInput = document.getElementById("maximus-chat-input");
  const badge = toggleBtn.querySelector(".maximus-wa-badge");

  // Toggle open/close
  function toggleChat() {
    const isOpen = chatWindow.classList.contains("active");
    if (isOpen) {
      chatWindow.classList.remove("active");
      toggleBtn.classList.remove("open");
    } else {
      chatWindow.classList.add("active");
      toggleBtn.classList.add("open");
      if (badge) badge.style.display = "none";
      setTimeout(() => chatInput.focus(), 300);
    }
  }

  toggleBtn.addEventListener("click", toggleChat);
  closeBtn.addEventListener("click", toggleChat);

  // Handle Action Chip Clicks
  const responses = {
    delivery: {
      userText: "I want to order medication for delivery in Accra.",
      botReply: "Great! Our delivery covers all of Greater Accra (East Legon, Airport, Osu, Spintex, etc.) with same-day dispatch. 100% verified by our Superintendent Pharmacist.",
      waText: "Hello Maximus HealthCare, I would like to order medication for same-day delivery in Accra."
    },
    chronic: {
      userText: "Tell me about the Chronic Care monthly subscription.",
      botReply: "Our Chronic Care plan automatically refills hypertension, diabetes, and asthma medications 3 days before you run out, plus free vitals monitoring.",
      waText: "Hello Maximus HealthCare, I want to enrol in the Chronic Care monthly subscription plan."
    },
    consult: {
      userText: "I would like to consult with a pharmacist.",
      botReply: "Our clinical team is on standby to review your lab results, check drug interactions, or advise on health concerns without medical jargon.",
      waText: "Hello Maximus HealthCare, I need to consult with a licensed pharmacist."
    },
    corporate: {
      userText: "I'm interested in corporate wellness for my company.",
      botReply: "We deliver onsite employee screenings and comprehensive board-ready health audit reports for organizations across Ghana.",
      waText: "Hello Maximus HealthCare, I am an employer/HR manager interested in a Corporate Wellness proposal."
    },
    outreach: {
      userText: "I want to book a free community/church screening event.",
      botReply: "Our 'Know Your Numbers Ghana' initiative provides free blood pressure, sugar, and BMI screening for church congregations and community groups at zero cost.",
      waText: "Hello Maximus HealthCare, I would like to book a free community/church health screening event."
    },
    calculator: {
      userText: "How can I check my health numbers and BMI?",
      botReply: "You can use our interactive 'Know Your Numbers' Health Calculator on this page, or send your readings directly to our pharmacist for analysis!",
      waText: "Hello Maximus HealthCare, I want help analyzing my blood pressure and blood sugar numbers."
    }
  };

  messagesContainer.addEventListener("click", (e) => {
    const chip = e.target.closest(".chat-chip");
    if (!chip) return;
    const intent = chip.getAttribute("data-intent");
    const data = responses[intent];
    if (!data) return;

    // Append user message
    appendMessage(data.userText, "user");

    // Show typing indicator
    const typing = showTypingIndicator();

    setTimeout(() => {
      typing.remove();
      // Append bot response with CTA to WhatsApp
      const botMsg = document.createElement("div");
      botMsg.className = "chat-bubble bot";
      botMsg.innerHTML = `
        ${data.botReply}<br>
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(data.waText)}" target="_blank" rel="noopener" class="chat-cta-btn">
          <span>Continue to WhatsApp with Pharmacist →</span>
        </a>
        <div class="chat-bubble-time">${getCurrentTime()}</div>
      `;
      messagesContainer.appendChild(botMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 600);
  });

  // Handle Form Submission (User typing)
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    chatInput.value = "";

    const typing = showTypingIndicator();
    setTimeout(() => {
      typing.remove();
      const botMsg = document.createElement("div");
      botMsg.className = "chat-bubble bot";
      botMsg.innerHTML = `
        Thank you for your message! Let's connect directly with our Superintendent Pharmacist on WhatsApp to assist you immediately:
        <br>
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Maximus HealthCare, ' + text)}" target="_blank" rel="noopener" class="chat-cta-btn">
          <span>Open in WhatsApp (+233 24 803 1796) →</span>
        </a>
        <div class="chat-bubble-time">${getCurrentTime()}</div>
      `;
      messagesContainer.appendChild(botMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 500);
  });

  function appendMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `chat-bubble ${sender}`;
    msg.innerHTML = `
      ${escapeHtml(text)}
      <div class="chat-bubble-time">${getCurrentTime()} ${sender === 'user' ? '✓✓' : ''}</div>
    `;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "typing-indicator";
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    messagesContainer.appendChild(indicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return indicator;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
})();
