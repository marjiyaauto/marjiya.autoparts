/* ═══════════════════════════════════════════════════════════
   MARJIYA AUTO JASHORE — MAIN JAVASCRIPT (v2)
   Everything here is progressive enhancement: the site is fully
   readable and every link works with JavaScript turned off.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var BASE = body.getAttribute('data-base') || '/';

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  /* ── 1. SCROLL REVEAL ─────────────────────────────────── */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── 2. MOBILE MENU ───────────────────────────────────── */
  var hamburger = $('.hamburger');
  var mobileNav = $('.mobile-nav');

  function setMenu(open) {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.toggle('open', open);
    mobileNav.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    body.style.overflow = open ? 'hidden' : '';
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      setMenu(!mobileNav.classList.contains('open'));
    });
    $$('a', mobileNav).forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        setMenu(false);
        hamburger.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setMenu(false);
    });
  }

  /* ── 3. FAQ ACCORDION (keyboard + screen-reader friendly) ─ */
  $$('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var willOpen = !item.classList.contains('open');
      var list = btn.closest('.faq-list') || doc;
      $$('.faq-item', list).forEach(function (i) {
        i.classList.remove('open');
        var q = $('.faq-q', i);
        if (q) q.setAttribute('aria-expanded', 'false');
        var ic = $('.faq-icon', i);
        if (ic) ic.textContent = '+';
      });
      if (willOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        var icon = $('.faq-icon', btn);
        if (icon) icon.textContent = '−';
      }
    });
  });

  /* ── 4. PRODUCT GALLERY THUMBNAILS ───────────────────── */
  var mainImg = $('.product-main-img img');
  $$('.product-thumb').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var img = $('img', thumb);
      if (!mainImg || !img) return;
      mainImg.src = img.src;
      mainImg.alt = img.alt;
      $$('.product-thumb').forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');
    });
  });

  /* ── 5. SCROLL EFFECTS (throttled with rAF) ──────────── */
  var scrollCta = $('#scrollCta');
  var backTop = $('.back-top');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset;
    if (scrollCta) scrollCta.classList.toggle('visible', y > 300);
    if (backTop) backTop.classList.toggle('visible', y > 600);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 6. ACTIVE NAV LINK (base-path aware) ────────────── */
  var path = window.location.pathname;
  $$('.nav-links a:not(.nav-cta), .mobile-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^(https?:|tel:)/.test(href)) return;
    if (href === BASE) return; // never mark "Home" as active everywhere
    if (path.indexOf(href) === 0) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── 7. GA4 EVENT TRACKING (no-op until gtag is loaded) ─ */
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  doc.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') !== -1) {
      var text = '';
      try { text = new URL(href).searchParams.get('text') || ''; } catch (err) {}
      track('whatsapp_click', { event_category: 'conversion', event_label: text.substring(0, 100), page_location: location.href });
    } else if (href.indexOf('tel:') === 0) {
      track('phone_click', { event_category: 'conversion', event_label: href, page_location: location.href });
    } else if (/maps\.google|g\.page|goo\.gl\/maps/.test(href)) {
      track('maps_click', { event_category: 'engagement', page_location: location.href });
    } else if (href.indexOf('facebook.com') !== -1) {
      track('social_click', { event_category: 'engagement', event_label: 'facebook', page_location: location.href });
    }
  });

  /* ── 8. SMOOTH ANCHOR SCROLLING ──────────────────────── */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = doc.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

  /* ── 9. ANNOUNCEMENT BAR CLOSE ───────────────────────── */
  var bar = $('.announce-bar');
  var close = $('.announce-close');
  try { if (bar && sessionStorage.getItem('announceClosed') === '1') bar.style.display = 'none'; } catch (e) {}
  if (bar && close) {
    close.addEventListener('click', function () {
      bar.style.display = 'none';
      try { sessionStorage.setItem('announceClosed', '1'); } catch (e) {}
    });
  }

  /* ── 10. PREFETCH ON HOVER (internal links only) ─────── */
  var prefetched = {};
  function prefetch(href) {
    if (prefetched[href]) return;
    prefetched[href] = true;
    var l = doc.createElement('link');
    l.rel = 'prefetch';
    l.href = href;
    doc.head.appendChild(l);
  }
  $$('a.card, a.bs-brand, a.bs-model').forEach(function (link) {
    link.addEventListener('mouseenter', function () {
      var href = link.getAttribute('href');
      if (href && href.indexOf(BASE) === 0) prefetch(href);
    }, { once: true });
  });

  /* ── 11. COPY PHONE ON CLICK ─────────────────────────── */
  $$('.copy-phone').forEach(function (el) {
    el.addEventListener('click', function () {
      var text = el.dataset.phone || el.textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          var old = el.textContent;
          el.textContent = '✅ Copied!';
          setTimeout(function () { el.textContent = old; }, 2000);
        });
      }
    });
  });

  /* ── 12. QUICK ORDER FORM → pre-filled WhatsApp message ─ */
  var form = $('#quick-order');
  if (form) {
    var dataEl = $('#quick-order-data');
    var brands = [];
    try { brands = JSON.parse(dataEl.textContent); } catch (e) {}

    var brandSel = $('[name="brand"]', form);
    var modelSel = $('[name="model"]', form);

    function fillModels() {
      var b = brands.filter(function (x) { return x.name === brandSel.value; })[0];
      modelSel.innerHTML = '';
      var first = doc.createElement('option');
      first.value = '';
      first.textContent = b ? 'Select model' : 'Select brand first';
      modelSel.appendChild(first);
      if (b) {
        b.models.forEach(function (m) {
          var o = doc.createElement('option');
          o.value = m; o.textContent = m;
          modelSel.appendChild(o);
        });
        var other = doc.createElement('option');
        other.value = 'Other'; other.textContent = 'Other / not listed';
        modelSel.appendChild(other);
      }
    }
    brandSel.addEventListener('change', fillModels);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { var el = $('[name="' + n + '"]', form); return el ? el.value.trim() : ''; };
      var lines = ['আমি পার্টস কিনতে চাই।'];
      var bike = [v('brand'), v('model')].filter(Boolean).join(' ');
      if (bike) lines.push('বাইক: ' + bike);
      if (v('year')) lines.push('বাইকের বছর: ' + v('year'));
      if (v('part')) lines.push('পার্টস: ' + v('part'));
      if (v('district')) lines.push('জেলা: ' + v('district'));
      if (v('payment')) lines.push('Payment: ' + v('payment'));
      var url = form.getAttribute('data-wa') + '?text=' + encodeURIComponent(lines.join('\n'));
      track('whatsapp_click', { event_category: 'conversion', event_label: 'quick_order_form', page_location: location.href });
      window.open(url, '_blank', 'noopener');
    });
  }
})();
