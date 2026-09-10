/**
 * Maximus HealthCare Consult — Premium Animation System
 * World-class micro-interactions, scroll reveals, 3D effects, and visual enhancement.
 */

(function MaximusAnimations() {
  'use strict';

  // ── 1. SCROLL-TRIGGERED REVEAL ENGINE ────────────────────────────────────
  const revealElements = new Set();

  function initReveal() {
    const selectors = [
      '.svc', '.testi', '.check', '.pkg', '.step',
      '.why-visual', '.why-content', '.ph-trust-item',
      '.book-opt', '.scr-content', '.s-head',
      '.hero-pill', '.hero-btns', '.hero-metrics',
      '.hero-body', '.hero h1',
      '[data-reveal]'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach((el, idx) => {
        if (revealElements.has(el)) return;
        revealElements.add(el);

        el.style.opacity = '0';
        el.style.transform = el.classList.contains('why-visual')
          ? 'translateX(-30px)'
          : el.classList.contains('why-content')
            ? 'translateX(30px)'
            : 'translateY(24px)';
        el.style.transition = 'opacity 0.65s cubic-bezier(.22,.68,0,1.2), transform 0.65s cubic-bezier(.22,.68,0,1.2)';
        el.dataset.revealDelay = (idx % 6) * 75;
      });
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.revealDelay || 0);
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) translateX(0)';
        }, delay);
        obs.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => obs.observe(el));
  }


  // ── 2. COUNTER / COUNT-UP ANIMATION ──────────────────────────────────────
  function animateCounter(el, target, suffix, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const isDecimal = target % 1 !== 0;

    const tick = () => {
      start = Math.min(start + step, target);
      el.textContent = (isDecimal ? start.toFixed(1) : Math.round(start)) + suffix;
      if (start < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.metric-val, .band-num, .why-big');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const text = el.textContent.trim();
        const num = parseFloat(text.replace(/[^0-9.]/g, ''));
        const suffix = text.replace(/[0-9.,]/g, '');
        if (!isNaN(num) && num > 0 && !el.dataset.counted) {
          el.dataset.counted = 'true';
          animateCounter(el, num, suffix, 1600);
        }
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => obs.observe(el));
  }


  // ── 3. 3D TILT EFFECT ON SERVICE CARDS ──────────────────────────────────
  function initTilt() {
    const cards = document.querySelectorAll('.svc, .pkg, .testi, .check, .why-visual, .hero-card, .ph-card');

    cards.forEach(card => {
      card.style.transition = 'transform 0.1s linear, box-shadow 0.3s ease';
      card.style.willChange = 'transform';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const maxTilt = 8;
        card.style.transform = `perspective(800px) rotateY(${dx * maxTilt}deg) rotateX(${-dy * maxTilt}deg) translateY(-4px) scale(1.012)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s ease';
        card.style.transform = '';
        setTimeout(() => {
          card.style.transition = 'transform 0.1s linear, box-shadow 0.3s ease';
        }, 500);
      });
    });
  }


  // ── 4. RIPPLE EFFECT ON BUTTONS ──────────────────────────────────────────
  function initRipple() {
    const btns = document.querySelectorAll(
      '.btn-red, .btn-wa-full, .btn-wa-inline, .book-main, .nav-cta, .btn-primary-wa, .wa-btn-card, .btn-pkg'
    );

    btns.forEach(btn => {
      btn.style.overflow = 'hidden';
      btn.style.position = 'relative';

      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height) * 2;
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px; height: ${size}px;
          left: ${e.clientX - rect.left - size / 2}px;
          top: ${e.clientY - rect.top - size / 2}px;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-expand 0.6s linear forwards;
          pointer-events: none;
        `;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      });
    });
  }


  // ── 5. HERO SECTION: TYPEWRITER EFFECT ON H1 ─────────────────────────────
  function initTypewriter() {
    const h1 = document.querySelector('.hero h1');
    if (!h1) return;

    const span = h1.querySelector('span');
    if (!span) return;

    const text = span.textContent.trim();
    span.textContent = '';

    const obs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();

      let i = 0;
      setTimeout(() => {
        const interval = setInterval(() => {
          if (i <= text.length) {
            span.textContent = text.slice(0, i);
            i++;
          } else {
            clearInterval(interval);
          }
        }, 55);
      }, 700);
    }, { threshold: 0.5 });

    obs.observe(h1);
  }


  // ── 6. ANIMATED FLOATING BACKGROUND ORBS ─────────────────────────────────
  function initFloatingOrbs() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const orbsHTML = `
      <div class="max-orb max-orb-1" aria-hidden="true"></div>
      <div class="max-orb max-orb-2" aria-hidden="true"></div>
      <div class="max-orb max-orb-3" aria-hidden="true"></div>
    `;
    hero.insertAdjacentHTML('afterbegin', orbsHTML);
  }


  // ── 7. SECTION HEADING SHIMMER GRADIENT ──────────────────────────────────
  function initShimmerHeadings() {
    document.querySelectorAll('.s-head h2 em, .hero h1 span, .ph-heading, .book-content h2 em').forEach(el => {
      el.classList.add('gradient-text-shimmer');
    });
  }


  // ── 8. MEGA-MENU STAGGERED ENTRANCE ──────────────────────────────────────
  function initMegaMenuAnimation() {
    const hasMegas = document.querySelectorAll('.has-mega');

    hasMegas.forEach(hasMega => {
      const items = hasMega.querySelectorAll('.mega-item');

      hasMega.addEventListener('mouseenter', () => {
        items.forEach((item, idx) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          item.style.transition = 'none';

          setTimeout(() => {
            item.style.transition = 'opacity 0.25s ease, transform 0.25s cubic-bezier(.22,.68,0,1.2)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, idx * 40 + 50);
        });
      });

      hasMega.addEventListener('mouseleave', () => {
        items.forEach(item => {
          item.style.opacity = '';
          item.style.transform = '';
          item.style.transition = '';
        });
      });
    });
  }


  // ── 9. BAND STATS: ANIMATED GRADIENT SWEEP ───────────────────────────────
  function initBandGlow() {
    const band = document.querySelector('.band');
    if (!band) return;
    band.style.background = 'linear-gradient(135deg, var(--red-dark) 0%, var(--red) 50%, #e85a5a 100%)';
    band.style.backgroundSize = '200% 200%';
    band.style.animation = 'gradientShift 4s ease infinite';
  }


  // ── 10. HERO CARD QLINKS: STAGGER & GLOW ON LOAD ────────────────────────
  function initQlinkStagger() {
    document.querySelectorAll('.qlink').forEach((qlink, i) => {
      qlink.style.opacity = '0';
      qlink.style.transform = 'translateX(20px)';
      setTimeout(() => {
        qlink.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(.22,.68,0,1.2), background .18s, border-color .18s';
        qlink.style.opacity = '1';
        qlink.style.transform = 'translateX(0)';
      }, 900 + i * 100);
    });
  }


  // ── 11. NAV LINK HOVER: MAGNETIC PULL ────────────────────────────────────
  function initMagneticNav() {
    document.querySelectorAll('.nav-center > a, .nav-center > .has-mega > a').forEach(link => {
      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const dy = (e.clientY - rect.top - rect.height / 2) * 0.3;
        link.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      link.addEventListener('mouseleave', () => {
        link.style.transition = 'transform 0.4s cubic-bezier(.22,.68,0,1.2), color 0.2s';
        link.style.transform = '';
        setTimeout(() => link.style.transition = '', 400);
      });
    });
  }


  // ── 12. TESTIMONIAL CARDS: FADE + SHIMMER ────────────────────────────────
  function initTestiHighlight() {
    document.querySelectorAll('.testi').forEach(testi => {
      testi.addEventListener('mouseenter', () => {
        testi.style.borderColor = 'rgba(215,43,43,0.2)';
        testi.style.boxShadow = '0 20px 50px rgba(215,43,43,0.07), 0 4px 16px rgba(26,46,122,0.06)';
      });
      testi.addEventListener('mouseleave', () => {
        testi.style.borderColor = '';
        testi.style.boxShadow = '';
      });
    });
  }


  // ── 13. SCROLL PROGRESS BAR ───────────────────────────────────────────────
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'max-scroll-progress';
    bar.style.cssText = `
      position: fixed; top: 0; left: 0; height: 3px; width: 0%;
      background: linear-gradient(90deg, var(--red) 0%, #ff6b6b 40%, var(--navy) 100%);
      z-index: 99998; transition: width 0.1s linear;
      box-shadow: 0 0 8px rgba(215,43,43,0.6);
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }


  // ── 14. SECTION BACKGROUND PARALLAX ─────────────────────────────────────
  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight * 1.5) {
        const orb1 = document.querySelector('.max-orb-1');
        const orb2 = document.querySelector('.max-orb-2');
        if (orb1) orb1.style.transform = `translateY(${scrolled * 0.2}px)`;
        if (orb2) orb2.style.transform = `translateY(${scrolled * 0.12}px) translateX(${scrolled * -0.06}px)`;
      }
    }, { passive: true });
  }


  // ── 15. HERO H1 LINE 1: SLIDE FROM LEFT ──────────────────────────────────
  function initHeroTextEntrance() {
    const h1 = document.querySelector('.hero h1');
    if (!h1) return;
    const pill = document.querySelector('.hero-pill');
    const body = document.querySelector('.hero-body');
    const btns = document.querySelector('.hero-btns');
    const metrics = document.querySelector('.hero-metrics');

    [pill, h1, body, btns, metrics].forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(.22,.68,0,1.2)';
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + i * 150);
    });
  }


  // ── RUN ALL SYSTEMS ──────────────────────────────────────────────────────
  function boot() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    initScrollProgress();
    initFloatingOrbs();
    initHeroTextEntrance();
    initShimmerHeadings();
    initQlinkStagger();
    initBandGlow();

    // Defer non-critical initializations
    requestIdleCallback(() => {
      initReveal();
      initCounters();
      initTilt();
      initRipple();
      initTypewriter();
      initMegaMenuAnimation();
      initMagneticNav();
      initTestiHighlight();
      initParallax();
    }, { timeout: 800 });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Polyfill for requestIdleCallback
  if (!window.requestIdleCallback) {
    window.requestIdleCallback = function(cb) { return setTimeout(cb, 1); };
  }

})();
