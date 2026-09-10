/**
 * Maximus HealthCare Consult — Universal Header Navigation & Mobile Drawer Controller
 * Provides seamless scroll state management, mobile drawer transitions, and keyboard accessibility.
 */
(function initNavSystem() {
  function getElements() {
    return {
      nav: document.getElementById('nav'),
      drawer: document.getElementById('mob-drawer'),
      overlay: document.getElementById('mob-overlay'),
      burger: document.getElementById('hamburger')
    };
  }

  // 1. Scroll State Management (.scrolled class on #nav)
  function handleScroll() {
    const { nav } = getElements();
    if (nav) {
      if (window.scrollY > 30) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Initialize immediately on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleScroll);
  } else {
    handleScroll();
  }

  // 2. Global Mobile Drawer Open/Close Controls
  window.openMenu = function () {
    const { drawer, overlay, burger } = getElements();
    if (drawer) {
      drawer.classList.add('open');
      drawer.classList.add('on');
      drawer.setAttribute('aria-hidden', 'false');
    }
    if (overlay) {
      overlay.classList.add('open');
      overlay.classList.add('on');
    }
    if (burger) {
      burger.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  };

  window.closeMenu = function () {
    const { drawer, overlay, burger } = getElements();
    if (drawer) {
      drawer.classList.remove('open');
      drawer.classList.remove('on');
      drawer.setAttribute('aria-hidden', 'true');
    }
    if (overlay) {
      overlay.classList.remove('open');
      overlay.classList.remove('on');
    }
    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  };

  // 3. Accessibility: Close drawer on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      window.closeMenu();
    }
  });

  // 4. Smooth Anchor Link Scrolling (with auto drawer close)
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#' && targetId.length > 1) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            window.closeMenu();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  });
})();
