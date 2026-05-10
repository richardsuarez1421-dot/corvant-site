/* ============================================================
   CORVANT — INTERACTIONS
   1. Hero canvas (network nodes animation)
   2. Scroll reveal with stagger + blur
   3. Animated counters for stats
   4. Magnetic buttons
   5. FAQ accordion
   6. Smooth scroll
   7. Marquee (CSS-driven, but JS for pause-on-hover)
   ============================================================ */

(function () {
  'use strict';

  // Activate JS-only styles immediately (fallback for no-JS users)
  document.documentElement.classList.add('js');

  /* ============================================================
     1. HERO CANVAS — Network nodes
     ============================================================ */
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let nodes = [];
    let mouse = { x: -1000, y: -1000, radius: 160 };

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    }

    function createNodes() {
      const density = window.innerWidth < 768 ? 0.00012 : 0.00018;
      const count = Math.floor(width * height * density);
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6,
          baseAlpha: Math.random() * 0.5 + 0.25
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Update + draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Bounce off edges
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Mouse repel (subtle)
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          n.x += (dx / dist) * force * 1.5;
          n.y += (dy / dist) * force * 1.5;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 137, 51, ${n.baseAlpha})`;
        ctx.fill();
      }

      // Draw connections
      const maxDist = 130;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.25;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255, 97, 0, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    resize();
    createNodes();
    animate();

    window.addEventListener('resize', () => {
      resize();
      createNodes();
    });

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });
  }

  /* ============================================================
     2. SCROLL REVEAL (stagger + blur)
     ============================================================ */
  function initScrollReveal() {
    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal, .reveal-child').forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // For grids: stagger child reveals
          const children = entry.target.querySelectorAll('.reveal-child');
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('revealed'), i * 90);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Safety net: after 3s, force-reveal anything still hidden
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.revealed), .reveal-child:not(.revealed)').forEach(el => {
        el.classList.add('revealed');
      });
    }, 3000);
  }

  /* ============================================================
     3. ANIMATED COUNTERS
     ============================================================ */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));

    function animateCounter(el) {
      const target = parseInt(el.dataset.count, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value = Math.floor(target * eased);
        el.textContent = prefix + value + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = prefix + target + suffix;
      }
      requestAnimationFrame(update);
    }
  }

  /* ============================================================
     4. MAGNETIC BUTTONS
     ============================================================ */
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-magnetic');
    buttons.forEach(btn => {
      const strength = 0.35;

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ============================================================
     5. FAQ ACCORDION
     ============================================================ */
  function initFAQ() {
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
    const firstFaq = document.querySelector('.faq-item');
    if (firstFaq) firstFaq.classList.add('open');
  }

  /* ============================================================
     6. NAV SCROLL EFFECT (more glass on scroll)
     ============================================================ */
  function initNavScroll() {
    const nav = document.querySelector('nav.site-nav');
    if (!nav) return;
    function check() {
      if (window.scrollY > 30) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ============================================================
     7. CARD TILT (subtle 3D on hover)
     ============================================================ */
  function initCardTilt() {
    const cards = document.querySelectorAll('.tilt');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = ((y - cy) / cy) * -3;
        const ry = ((x - cx) / cx) * 3;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    initHeroCanvas();
    initScrollReveal();
    initCounters();
    initMagneticButtons();
    initFAQ();
    initNavScroll();
    initCardTilt();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
