/**
 * Maximus HealthCare Consult — Shared JavaScript & WhatsApp Intake Engine
 * Phone / WhatsApp: +233 24 803 1796
 * Email: info@maximushealthcaregh.com
 * Website: http://www.maximushealthcaregh.com/
 */

const MAXIMUS_WHATSAPP_NUMBER = "233248031796";

// Navigation Scroll Effect
window.addEventListener("scroll", function() {
  const nav = document.getElementById("nav");
  if (!nav) return;
  if (window.scrollY > 24) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// Mobile Menu Toggle
function openMenu() {
  const drawer = document.getElementById("mob-drawer");
  const overlay = document.getElementById("mob-overlay");
  const hamburger = document.getElementById("hamburger");
  if (drawer) {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
  }
  if (overlay) overlay.classList.add("open");
  if (hamburger) hamburger.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  const drawer = document.getElementById("mob-drawer");
  const overlay = document.getElementById("mob-overlay");
  const hamburger = document.getElementById("hamburger");
  if (drawer) {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  }
  if (overlay) overlay.classList.remove("open");
  if (hamburger) hamburger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

// Accordion FAQ helper
function toggleFaq(btn) {
  const item = btn.closest(".faq-item");
  if (!item) return;
  const isOpen = item.classList.contains("open");
  
  // Close other open faqs in the same accordion
  const parent = item.closest(".faq-accordion");
  if (parent) {
    parent.querySelectorAll(".faq-item.open").forEach(function(openItem) {
      if (openItem !== item) {
        openItem.classList.remove("open");
        const a = openItem.querySelector(".faq-ans");
        if (a) a.style.maxHeight = null;
        const b = openItem.querySelector(".faq-q");
        if (b) b.setAttribute("aria-expanded", "false");
      }
    });
  }
  
  const ans = item.querySelector(".faq-ans");
  if (isOpen) {
    item.classList.remove("open");
    if (ans) ans.style.maxHeight = null;
    btn.setAttribute("aria-expanded", "false");
  } else {
    item.classList.add("open");
    if (ans) ans.style.maxHeight = ans.scrollHeight + 30 + "px";
    btn.setAttribute("aria-expanded", "true");
  }
}

// Form Submission to WhatsApp
function handleWhatsAppSubmit(event, serviceName) {
  event.preventDefault();
  const form = event.target;
  
  // Basic validation
  const nameInput = form.querySelector('[name="fullname"]');
  const phoneInput = form.querySelector('[name="phone"]');
  
  if (!nameInput || !nameInput.value.trim()) {
    alert("Please enter your full name.");
    if (nameInput) nameInput.focus();
    return false;
  }
  
  if (!phoneInput || !phoneInput.value.trim()) {
    alert("Please enter your phone or WhatsApp number.");
    if (phoneInput) phoneInput.focus();
    return false;
  }
  
  // Extract all inputs into key-value lines
  let messageLines = [
    "🏥 *MAXIMUS HEALTHCARE CONSULT*",
    `📋 *Service Request:* ${serviceName}`,
    "──────────────────────────",
    `👤 *Name:* ${nameInput.value.trim()}`,
    `📞 *Phone / WhatsApp:* ${phoneInput.value.trim()}`
  ];
  
  // Additional dynamic fields
  const elements = form.elements;
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (!el.name || el.name === "fullname" || el.name === "phone" || el.type === "submit" || el.type === "button") {
      continue;
    }
    
    let label = el.getAttribute("data-label") || el.name;
    let val = "";
    
    if (el.type === "radio") {
      if (el.checked) {
        val = el.value;
      } else {
        continue;
      }
    } else if (el.type === "checkbox") {
      if (el.checked) {
        val = el.value || "Yes";
      } else {
        continue;
      }
    } else {
      val = el.value.trim();
    }
    
    if (val) {
      messageLines.push(`▪️ *${label}:* ${val}`);
    }
  }
  
  messageLines.push("──────────────────────────");
  messageLines.push("🌐 _Sent via Maximus HealthCare Access Platform_");
  
  const fullMessage = messageLines.join("\n");
  const waUrl = `https://wa.me/${MAXIMUS_WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`;
  
  // Visual button feedback
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn ? submitBtn.innerHTML : "";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Connecting to WhatsApp...</span>`;
  }
  
  setTimeout(() => {
    window.open(waUrl, "_blank");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }, 400);
  
  return false;
}
