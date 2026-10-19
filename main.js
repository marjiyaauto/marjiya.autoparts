/* ═══════════════════════════════════════════════════════════
   MARJIYA AUTO JASHORE — MAIN JAVASCRIPT
   ═══════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ── 1. SCROLL REVEAL ─────────────────────────────────── */
  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
  });

  /* ── 2. MOBILE MENU ───────────────────────────────────── */
  var hamburger  = document.querySelector('.hamburger');
  var mobileNav  = document.querySelector('.mobile-nav');
  var body       = document.body;

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        body.style.overflow = '';
      });
    });
  }

  /* ── 3. FAQ ACCORDION ─────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = this.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(function(i) {
        i.classList.remove('open');
      });
      // Open clicked if it was closed
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ── 4. PRODUCT GALLERY THUMBNAILS ───────────────────── */
  var mainImg = document.querySelector('.product-main-img img');
  document.querySelectorAll('.product-thumb').forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      if (!mainImg) return;
      var src = this.querySelector('img').src;
      mainImg.src = src;
      document.querySelectorAll('.product-thumb').forEach(function(t) {
        t.classList.remove('active');
      });
      this.classList.add('active');
    });
  });

  /* ── 5. SCROLL EFFECTS ────────────────────────────────── */
  var scrollCta  = document.getElementById('scrollCta');
  var backTop    = document.querySelector('.back-top');
  var lastScroll = 0;
  var siteNav    = document.querySelector('.site-nav');

  window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;

    // Scroll CTA — product pages only
    if (scrollCta) {
      if (scrollY > 300) scrollCta.classList.add('visible');
      else               scrollCta.classList.remove('visible');
    }

    // Back to top button
    if (backTop) {
      if (scrollY > 600) backTop.classList.add('visible');
      else               backTop.classList.remove('visible');
    }

    lastScroll = scrollY;
  }, { passive: true });

  // Back to top click
  if (backTop) {
    backTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 6. ACTIVE NAV LINK ───────────────────────────────── */
  var currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function(link) {
    if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href')) &&
        link.getAttribute('href') !== '/marjiya-auto/') {
      link.classList.add('active');
    }
  });

  /* ── 7. GA4 EVENT TRACKING ────────────────────────────── */
  function trackEvent(name, params) {
    if (typeof gtag === 'function') {
      gtag('event', name, params || {});
    }
  }

  // Track WhatsApp clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(function(link) {
    link.addEventListener('click', function() {
      var href  = this.getAttribute('href') || '';
      var parts = href.split('?');
      var text  = '';
      if (parts[1]) {
        try {
          text = new URLSearchParams(parts[1]).get('text') || '';
        } catch(e) {}
      }
      trackEvent('whatsapp_click', {
        event_category: 'conversion',
        event_label: text.substring(0, 100),
        page_location: window.location.href
      });
    });
  });

  // Track phone clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
    link.addEventListener('click', function() {
      trackEvent('phone_click', {
        event_category: 'conversion',
        event_label: this.getAttribute('href'),
        page_location: window.location.href
      });
    });
  });

  // Track Google Maps clicks
  document.querySelectorAll('a[href*="maps.google"], a[href*="g.page"], a[href*="goo.gl/maps"]').forEach(function(link) {
    link.addEventListener('click', function() {
      trackEvent('maps_click', {
        event_category: 'engagement',
        event_label: 'Google Maps',
        page_location: window.location.href
      });
    });
  });

  // Track Facebook page clicks
  document.querySelectorAll('a[href*="facebook.com/marjiya"]').forEach(function(link) {
    link.addEventListener('click', function() {
      trackEvent('social_click', {
        event_category: 'engagement',
        event_label: 'facebook',
        page_location: window.location.href
      });
    });
  });

  /* ── 8. SMOOTH ANCHOR SCROLLING ──────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = 80; // nav height
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── 9. LAZY LOAD IMAGES (fallback) ──────────────────── */
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading — already handled by loading="lazy"
  } else {
    // Fallback: IntersectionObserver
    var lazyObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          lazyObserver.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(function(img) {
      lazyObserver.observe(img);
    });
  }

  /* ── 10. ANNOUNCE BAR CLOSE ──────────────────────────── */
  var announceClose = document.querySelector('.announce-close');
  if (announceClose) {
    announceClose.addEventListener('click', function() {
      var bar = document.querySelector('.announce-bar');
      if (bar) bar.style.display = 'none';
      try { sessionStorage.setItem('announceClosed', '1'); } catch(e) {}
    });
    try {
      if (sessionStorage.getItem('announceClosed') === '1') {
        var bar = document.querySelector('.announce-bar');
        if (bar) bar.style.display = 'none';
      }
    } catch(e) {}
  }

  /* ── 11. PRELOAD NEXT PAGE ON HOVER ──────────────────── */
  if (typeof window.requestIdleCallback !== 'undefined') {
    window.requestIdleCallback(function() {
      document.querySelectorAll('a.card, a.brand-card, a.model-card, a.product-card').forEach(function(link) {
        link.addEventListener('mouseenter', function() {
          var href = this.getAttribute('href');
          if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('wa.me')) return;
          var prefetch = document.createElement('link');
          prefetch.rel = 'prefetch';
          prefetch.href = href;
          document.head.appendChild(prefetch);
        }, { once: true });
      });
    });
  }

  /* ── 12. COPY PHONE ON CLICK ─────────────────────────── */
  document.querySelectorAll('.copy-phone').forEach(function(el) {
    el.addEventListener('click', function() {
      var text = this.dataset.phone || '01349-022347';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
          el.textContent = '✅ Copied!';
          setTimeout(function() { el.textContent = text; }, 2000);
        });
      }
    });
  });

})();
