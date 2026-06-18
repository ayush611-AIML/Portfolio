/* ============================================================
   AYUSH RAJ — PORTFOLIO JAVASCRIPT
   Scroll animations, counters, skill bars, tilt effects, nav
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ── DOM Cache ──────────────────────────────────────────────
  const navbar       = document.getElementById('navbar');
  const navToggle    = document.getElementById('navToggle');
  const navLinks     = document.getElementById('navLinks');
  const navLinkEls   = document.querySelectorAll('.nav-link');
  const scrollTopBtn = document.getElementById('scrollTop');
  const contactForm  = document.getElementById('contactForm');
  const sections     = document.querySelectorAll('.section');

  // ── 1. NAVBAR — Scroll & Mobile Toggle ─────────────────────
  let lastScroll = 0;

  function handleNavScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 50);
    lastScroll = y;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ── 2. ACTIVE NAV LINK — Intersection Observer ─────────────
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinkEls.forEach(l => {
          l.classList.toggle('active', l.dataset.section === id);
        });
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72}px 0px 0px 0px`
  });

  sections.forEach(sec => navObserver.observe(sec));

  // ── 3. SCROLL-TRIGGERED REVEAL ANIMATIONS ──────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — keep it simple, one-shot reveal
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── 4. EXPERIENCE CARDS — Curtain Reveal ───────────────────
  const expCards = document.querySelectorAll('.exp-card');

  const expObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Small delay for dramatic effect
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, 300);
        expObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  expCards.forEach(card => expObserver.observe(card));

  // ── 5. SKILL BARS — Animate Width + Count Up ──────────────
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillPercents = document.querySelectorAll('.skill-percent');
  let skillsAnimated = false;

  const skillsSection = document.getElementById('skills');

  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        animateSkills();
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (skillsSection) {
    skillObserver.observe(skillsSection);
  }

  function animateSkills() {
    // Animate bar widths
    skillBars.forEach(bar => {
      const targetWidth = bar.dataset.width;
      bar.style.width = targetWidth + '%';
    });

    // Count up percentages
    skillPercents.forEach(el => {
      const target = parseInt(el.dataset.target);
      countUp(el, 0, target, 1200);
    });
  }

  function countUp(el, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + range * eased);
      el.textContent = current + '%';
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // ── 6. STAT COUNTERS — Count Up on Scroll ─────────────────
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const achieveSection = document.getElementById('achievements');

  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(el => {
          const target = parseInt(el.dataset.count);
          countUpStat(el, 0, target, 1800);
        });
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (achieveSection) {
    statObserver.observe(achieveSection);
  }

  function countUpStat(el, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + range * eased);
      el.textContent = current + (end >= 100 ? '+' : '');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = end + (end >= 100 ? '+' : '');
      }
    }

    requestAnimationFrame(step);
  }

  // ── 7. CERTIFICATION CARDS — Tilt on Hover ────────────────
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });

  // ── 8. SCROLL-TO-TOP BUTTON ────────────────────────────────
  function handleScrollTop() {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }

  window.addEventListener('scroll', handleScrollTop, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── 9. CONTACT FORM — Mailto Functionality ─────────────────
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('formName').value.trim();
    const email   = document.getElementById('formEmail').value.trim();
    const subject = document.getElementById('formSubject').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !email || !message) {
      showFormFeedback('Please fill in all required fields.', 'error');
      return;
    }

    // Build mailto link
    const mailtoSubject = encodeURIComponent(subject || `Portfolio Contact from ${name}`);
    const mailtoBody    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    const mailtoLink = `mailto:ayushra6111@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    window.location.href = mailtoLink;

    showFormFeedback('Opening your email client...', 'success');

    // Reset form after a moment
    setTimeout(() => {
      contactForm.reset();
    }, 2000);
  });

  function showFormFeedback(msg, type) {
    const sendBtn = document.getElementById('sendBtn');
    const originalText = sendBtn.innerHTML;

    sendBtn.innerHTML = type === 'success'
      ? `<i class="fa-solid fa-check"></i>&nbsp; ${msg}`
      : `<i class="fa-solid fa-exclamation-triangle"></i>&nbsp; ${msg}`;

    sendBtn.style.background = type === 'success'
      ? 'linear-gradient(135deg, #34d399, #059669)'
      : 'linear-gradient(135deg, #fb7185, #e11d48)';

    setTimeout(() => {
      sendBtn.innerHTML = originalText;
      sendBtn.style.background = '';
    }, 3000);
  }

  // ── 10. SMOOTH ANCHOR SCROLLING (Fallback) ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── 11. TYPING EFFECT for Hero Greeting ────────────────────
  const heroGreeting = document.querySelector('.hero-greeting');
  if (heroGreeting) {
    heroGreeting.style.opacity = '0';
    setTimeout(() => {
      heroGreeting.style.opacity = '1';
      heroGreeting.style.transition = 'opacity 0.8s ease';
    }, 200);
  }

  // ── 12. PARALLAX-LIKE ORB MOVEMENT on mouse ───────────────
  const orbs = document.querySelectorAll('.hero-orb');

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 8;
      orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });

  // ── Initial state ──────────────────────────────────────────
  handleNavScroll();
  handleScrollTop();
});
