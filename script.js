/* ============================================================
   AYUSH RAJ — PORTFOLIO JAVASCRIPT
   Scroll animations, counters, skill bars, tilt effects, nav
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ── DOM Cache ──────────────────────────────────────────────
  const scrollTopBtn = document.getElementById('scrollTop');
  const contactForm  = document.getElementById('contactForm');
  const sections     = document.querySelectorAll('.section');

  // ── 1. BUBBLE MENU JAVASCRIPT ──────────────────────────────
  const bubbleMenuToggle = document.getElementById('bubbleMenuToggle');
  const bubbleMenuOverlay = document.getElementById('bubbleMenuOverlay');
  const pillLinks = document.querySelectorAll('.pill-link');
  const pillLabels = document.querySelectorAll('.pill-label');
  
  let isMenuOpen = false;
  let showOverlay = false;
  
  const animationDuration = 0.5;
  const animationEase = 'back.out(1.5)';
  const staggerDelay = 0.12;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
      showOverlay = true;
      bubbleMenuToggle.classList.add('open');
      bubbleMenuToggle.setAttribute('aria-pressed', 'true');
      bubbleMenuOverlay.setAttribute('aria-hidden', 'false');
      
      gsap.set(bubbleMenuOverlay, { display: 'flex' });
      gsap.killTweensOf([...pillLinks, ...pillLabels]);
      gsap.set(pillLinks, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(pillLabels, { y: 24, autoAlpha: 0 });

      pillLinks.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });

        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase,
          clearProps: "scale" // Allow CSS hover scale to work after animation
        });
        if (pillLabels[i]) {
          tl.to(
            pillLabels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: 'power3.out'
            },
            `-=${animationDuration * 0.9}`
          );
        }
      });
    } else {
      bubbleMenuToggle.classList.remove('open');
      bubbleMenuToggle.setAttribute('aria-pressed', 'false');
      bubbleMenuOverlay.setAttribute('aria-hidden', 'true');

      gsap.killTweensOf([...pillLinks, ...pillLabels]);
      gsap.to(pillLabels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power3.in'
      });
      gsap.to(pillLinks, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(bubbleMenuOverlay, { display: 'none' });
          showOverlay = false;
        }
      });
    }
  }

  if (bubbleMenuToggle) {
    bubbleMenuToggle.addEventListener('click', toggleMenu);
  }

  // Close nav on link click
  pillLinks.forEach(link => {
    link.addEventListener('click', () => {
      if(isMenuOpen) toggleMenu();
    });
  });

  // ── 2. ACTIVE NAV LINK ──────────────────────────────────────
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        pillLinks.forEach(l => {
          if (l.getAttribute('href') === `#${id}`) {
            l.style.border = '2px solid rgba(255, 255, 255, 0.5)';
          } else {
            l.style.border = '1px solid rgba(255, 255, 255, 0.1)';
          }
        });
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: `-72px 0px 0px 0px`
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

  // ── 13. SCROLL REVEAL TEXT (Word by word blur/fade) ────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    scrollRevealElements.forEach((el) => {
      const text = el.textContent.trim();
      if (!text) return;

      const words = text.split(/\s+/).filter(w => w.trim().length > 0);
      
      el.innerHTML = '';
      words.forEach((word) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        el.appendChild(span);
        // Add a space after each word except the last
        el.appendChild(document.createTextNode(' '));
      });

      const wordElements = el.querySelectorAll('.word');

      const baseRotation = 3;
      const baseOpacity = 0.1;
      const blurStrength = 4;
      const rotationEnd = 'bottom bottom';
      const wordAnimationEnd = 'bottom bottom';

      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: rotationEnd,
            scrub: true
          }
        }
      );

      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, filter: `blur(${blurStrength}px)`, willChange: 'opacity, filter' },
        {
          ease: 'none',
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true
          }
        }
      );
    });
  }

  // ── 14. VARIABLE PROXIMITY TEXT (Hover font variation) ────────
  const vpElements = document.querySelectorAll('.variable-proximity');
  if (vpElements.length > 0) {
    let vpMouseX = -1000;
    let vpMouseY = -1000;
    
    window.addEventListener('mousemove', (e) => {
      vpMouseX = e.clientX;
      vpMouseY = e.clientY;
    });
    
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        vpMouseX = e.touches[0].clientX;
        vpMouseY = e.touches[0].clientY;
      }
    });

    vpElements.forEach((el) => {
      const label = el.getAttribute('data-label') || '';
      const radius = 100;
      const falloff = 'linear'; // linear, exponential, gaussian
      const fromSettings = new Map([['wght', 400], ['opsz', 9]]);
      const toSettings = new Map([['wght', 1000], ['opsz', 40]]);
      
      const parsedSettings = Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
        axis,
        fromValue,
        toValue: toSettings.get(axis) ?? fromValue
      }));

      // Build HTML
      const words = label.split(' ');
      el.innerHTML = '';
      const letterRefs = [];
      
      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';
        
        word.split('').forEach(letter => {
          const letterSpan = document.createElement('span');
          letterSpan.style.display = 'inline-block';
          letterSpan.textContent = letter;
          // default
          letterSpan.style.fontVariationSettings = "'wght' 400, 'opsz' 9";
          letterRefs.push(letterSpan);
          wordSpan.appendChild(letterSpan);
        });
        
        el.appendChild(wordSpan);
        if (wordIndex < words.length - 1) {
          const spaceSpan = document.createElement('span');
          spaceSpan.style.display = 'inline-block';
          spaceSpan.innerHTML = '&nbsp;';
          el.appendChild(spaceSpan);
        }
      });
      
      const srSpan = document.createElement('span');
      srSpan.className = 'sr-only';
      srSpan.textContent = label;
      el.appendChild(srSpan);

      const calculateDistance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      
      const calculateFalloff = (distance) => {
        const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
        switch (falloff) {
          case 'exponential': return norm ** 2;
          case 'gaussian': return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
          case 'linear': default: return norm;
        }
      };
      
      let lastRenderX = null;
      let lastRenderY = null;

      const updateLetters = () => {
        // Only update if mouse moved
        if (vpMouseX !== lastRenderX || vpMouseY !== lastRenderY) {
          lastRenderX = vpMouseX;
          lastRenderY = vpMouseY;

          letterRefs.forEach((letterRef) => {
            if (!letterRef) return;
            const rect = letterRef.getBoundingClientRect();
            const letterCenterX = rect.left + rect.width / 2;
            const letterCenterY = rect.top + rect.height / 2;
            
            const distance = calculateDistance(vpMouseX, vpMouseY, letterCenterX, letterCenterY);
            
            if (distance >= radius) {
              letterRef.style.fontVariationSettings = "'wght' 400, 'opsz' 9";
              return;
            }
            
            const falloffValue = calculateFalloff(distance);
            const newSettings = parsedSettings
              .map(({ axis, fromValue, toValue }) => {
                const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
                return `'${axis}' ${interpolatedValue}`;
              })
              .join(', ');
              
            letterRef.style.fontVariationSettings = newSettings;
          });
        }
        
        requestAnimationFrame(updateLetters);
      };
      
      requestAnimationFrame(updateLetters);
    });
  }

  // ── 15. LIQUID ETHER (Three.js Fluid Simulation Shaders) ─────
  if (typeof THREE !== 'undefined') {
    const container = document.getElementById('liquid-ether-container');
    if (container) {
      // Configuration
      const mouseForce = 20;
      const cursorSize = 100;
      const isViscous = false;
      const viscous = 30;
      const iterationsViscous = 32;
      const iterationsPoisson = 32;
      const dt = 0.014;
      const BFECC = true;
      const resolution = 0.5; // lower = better performance
      const isBounce = false;
      const colors = ['#5227FF', '#FF9FFC', '#B497CF'];
      const autoDemo = true;
      const autoSpeed = 0.5;
      const autoIntensity = 2.2;
      const takeoverDuration = 0.25;
      const autoResumeDelay = 1000;
      const autoRampDuration = 0.6;

      function makePaletteTexture(stops) {
        let arr = (Array.isArray(stops) && stops.length > 0) ? (stops.length === 1 ? [stops[0], stops[0]] : stops) : ['#ffffff', '#ffffff'];
        const w = arr.length;
        const data = new Uint8Array(w * 4);
        for (let i = 0; i < w; i++) {
          const c = new THREE.Color(arr[i]);
          data[i * 4 + 0] = Math.round(c.r * 255);
          data[i * 4 + 1] = Math.round(c.g * 255);
          data[i * 4 + 2] = Math.round(c.b * 255);
          data[i * 4 + 3] = 255;
        }
        const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
        tex.magFilter = THREE.LinearFilter;
        tex.minFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.generateMipmaps = false;
        tex.needsUpdate = true;
        return tex;
      }

      const paletteTex = makePaletteTexture(colors);
      const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

      class CommonClass {
        constructor() {
          this.width = 0;
          this.height = 0;
          this.aspect = 1;
          this.pixelRatio = 1;
          this.time = 0;
          this.delta = 0;
          this.container = null;
          this.renderer = null;
          this.clock = null;
        }
        init(cont) {
          this.container = cont;
          this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
          this.resize();
          this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          this.renderer.autoClear = false;
          this.renderer.setClearColor(new THREE.Color(0x000000), 0);
          this.renderer.setPixelRatio(this.pixelRatio);
          this.renderer.setSize(this.width, this.height);
          this.renderer.domElement.style.width = '100%';
          this.renderer.domElement.style.height = '100%';
          this.renderer.domElement.style.display = 'block';
          this.clock = new THREE.Clock();
          this.clock.start();
        }
        resize() {
          if (!this.container) return;
          const rect = this.container.getBoundingClientRect();
          this.width = Math.max(1, Math.floor(rect.width));
          this.height = Math.max(1, Math.floor(rect.height));
          this.aspect = this.width / this.height;
          if (this.renderer) this.renderer.setSize(this.width, this.height, false);
        }
        update() {
          this.delta = this.clock.getDelta();
          this.time += this.delta;
        }
      }
      const Common = new CommonClass();

      class MouseClass {
        constructor() {
          this.coords = new THREE.Vector2();
          this.coords_old = new THREE.Vector2();
          this.diff = new THREE.Vector2();
          this.isHoverInside = false;
          this.hasUserControl = false;
          this.isAutoActive = false;
          this.autoIntensity = autoIntensity;
          this.takeoverActive = false;
          this.takeoverStartTime = 0;
          this.takeoverDuration = takeoverDuration;
          this.takeoverFrom = new THREE.Vector2();
          this.takeoverTo = new THREE.Vector2();
          this.onInteract = null;
        }
        init(cont) {
          this.container = cont;
          window.addEventListener('mousemove', (e) => this.onMove(e.clientX, e.clientY));
          window.addEventListener('touchstart', (e) => this.onTouch(e), { passive: true });
          window.addEventListener('touchmove', (e) => this.onTouch(e), { passive: true });
        }
        isPointInside(x, y) {
          const rect = this.container.getBoundingClientRect();
          return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        }
        setCoords(x, y) {
          const rect = this.container.getBoundingClientRect();
          const nx = (x - rect.left) / rect.width;
          const ny = (y - rect.top) / rect.height;
          this.coords.set(nx * 2 - 1, -(ny * 2 - 1));
        }
        onMove(x, y) {
          this.isHoverInside = this.isPointInside(x, y);
          if (!this.isHoverInside) return;
          if (this.onInteract) this.onInteract();
          if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
            const rect = this.container.getBoundingClientRect();
            this.takeoverFrom.copy(this.coords);
            this.takeoverTo.set(((x - rect.left) / rect.width) * 2 - 1, -(((y - rect.top) / rect.height) * 2 - 1));
            this.takeoverStartTime = performance.now();
            this.takeoverActive = true;
            this.hasUserControl = true;
            this.isAutoActive = false;
            return;
          }
          this.setCoords(x, y);
          this.hasUserControl = true;
        }
        onTouch(e) {
          if (e.touches.length !== 1) return;
          this.onMove(e.touches[0].clientX, e.touches[0].clientY);
        }
        setNormalized(nx, ny) {
          this.coords.set(nx, ny);
        }
        update() {
          if (this.takeoverActive) {
            const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
            if (t >= 1) {
              this.takeoverActive = false;
              this.coords.copy(this.takeoverTo);
              this.coords_old.copy(this.coords);
              this.diff.set(0, 0);
            } else {
              const k = t * t * (3 - 2 * t);
              this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
            }
          }
          this.diff.subVectors(this.coords, this.coords_old);
          this.coords_old.copy(this.coords);
          if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
        }
      }
      const Mouse = new MouseClass();

      class AutoDriver {
        constructor(manager) {
          this.manager = manager;
          this.enabled = autoDemo;
          this.speed = autoSpeed;
          this.resumeDelay = autoResumeDelay;
          this.rampDurationMs = autoRampDuration * 1000;
          this.active = false;
          this.current = new THREE.Vector2(0, 0);
          this.target = new THREE.Vector2();
          this.lastTime = performance.now();
          this.activationTime = 0;
          this._tmpDir = new THREE.Vector2();
          this.pickNewTarget();
        }
        pickNewTarget() {
          this.target.set((Math.random() * 2 - 1) * 0.8, (Math.random() * 2 - 1) * 0.8);
        }
        forceStop() {
          this.active = false;
          Mouse.isAutoActive = false;
        }
        update() {
          if (!this.enabled) return;
          const now = performance.now();
          const idle = now - this.manager.lastUserInteraction;
          if (idle < this.resumeDelay || Mouse.isHoverInside) {
            if (this.active) this.forceStop();
            return;
          }
          if (!this.active) {
            this.active = true;
            this.current.copy(Mouse.coords);
            this.lastTime = now;
            this.activationTime = now;
          }
          Mouse.isAutoActive = true;
          let dtSec = Math.min((now - this.lastTime) / 1000, 0.016);
          this.lastTime = now;
          
          const dir = this._tmpDir.subVectors(this.target, this.current);
          const dist = dir.length();
          if (dist < 0.01) {
            this.pickNewTarget();
            return;
          }
          dir.normalize();
          let ramp = 1;
          if (this.rampDurationMs > 0) {
            const t = Math.min(1, (now - this.activationTime) / this.rampDurationMs);
            ramp = t * t * (3 - 2 * t);
          }
          const move = Math.min(this.speed * dtSec * ramp, dist);
          this.current.addScaledVector(dir, move);
          Mouse.setNormalized(this.current.x, this.current.y);
        }
      }

      // ── GLSL Shaders ──
      const face_vert = `attribute vec3 position; uniform vec2 boundarySpace; varying vec2 uv; void main(){ vec2 scale = 1.0 - boundarySpace * 2.0; vec3 pos = vec3(position.xy * scale, 0.0); uv = vec2(0.5) + pos.xy * 0.5; gl_Position = vec4(pos, 1.0); }`;
      const line_vert = `attribute vec3 position; uniform vec2 px; varying vec2 uv; void main(){ uv = 0.5 + position.xy * 0.5; vec2 n = sign(position.xy); vec2 pos = abs(position.xy) - px; gl_Position = vec4(pos * n, 0.0, 1.0); }`;
      const mouse_vert = `attribute vec3 position; attribute vec2 uv; uniform vec2 center; uniform vec2 scale; uniform vec2 px; varying vec2 vUv; void main(){ vec2 pos = position.xy * scale * 2.0 * px + center; vUv = uv; gl_Position = vec4(pos, 0.0, 1.0); }`;
      const advection_frag = `precision highp float; uniform sampler2D velocity; uniform float dt; uniform bool isBFECC; uniform vec2 fboSize; varying vec2 uv; void main(){ vec2 ratio = max(fboSize.x, fboSize.y) / fboSize; if(!isBFECC){ vec2 vel = texture2D(velocity, uv).xy; vec2 uv2 = uv - vel * dt * ratio; gl_FragColor = vec4(texture2D(velocity, uv2).xy, 0.0, 0.0); } else { vec2 spot_new = uv; vec2 vel_old = texture2D(velocity, uv).xy; vec2 spot_old = spot_new - vel_old * dt * ratio; vec2 vel_new1 = texture2D(velocity, spot_old).xy; vec2 spot_new2 = spot_old + vel_new1 * dt * ratio; vec2 error = spot_new2 - spot_new; vec2 spot_new3 = spot_new - error / 2.0; vec2 vel_2 = texture2D(velocity, spot_new3).xy; vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio; gl_FragColor = vec4(texture2D(velocity, spot_old2).xy, 0.0, 0.0); } }`;
      const color_frag = `precision highp float; uniform sampler2D velocity; uniform sampler2D palette; uniform vec4 bgColor; varying vec2 uv; void main(){ vec2 vel = texture2D(velocity, uv).xy; float lenv = clamp(length(vel), 0.0, 1.0); vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb; gl_FragColor = vec4(mix(bgColor.rgb, c, lenv), mix(bgColor.a, 1.0, lenv)); }`;
      const divergence_frag = `precision highp float; uniform sampler2D velocity; uniform float dt; uniform vec2 px; varying vec2 uv; void main(){ float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x; float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x; float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y; float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y; gl_FragColor = vec4((x1 - x0 + y1 - y0) / (2.0 * dt)); }`;
      const externalForce_frag = `precision highp float; uniform vec2 force; varying vec2 vUv; void main(){ vec2 circle = (vUv - 0.5) * 2.0; float d = 1.0 - min(length(circle), 1.0); gl_FragColor = vec4(force * (d * d), 0.0, 1.0); }`;
      const poisson_frag = `precision highp float; uniform sampler2D pressure; uniform sampler2D divergence; uniform vec2 px; varying vec2 uv; void main(){ float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r; float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r; float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r; float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r; float div = texture2D(divergence, uv).r; gl_FragColor = vec4((p0 + p1 + p2 + p3) / 4.0 - div); }`;
      const pressure_frag = `precision highp float; uniform sampler2D pressure; uniform sampler2D velocity; uniform vec2 px; uniform float dt; varying vec2 uv; void main(){ float p0 = texture2D(pressure, uv + vec2(px.x, 0.0)).r; float p1 = texture2D(pressure, uv - vec2(px.x, 0.0)).r; float p2 = texture2D(pressure, uv + vec2(0.0, px.y)).r; float p3 = texture2D(pressure, uv - vec2(0.0, px.y)).r; vec2 v = texture2D(velocity, uv).xy; vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5; gl_FragColor = vec4(v - gradP * dt, 0.0, 1.0); }`;
      const viscous_frag = `precision highp float; uniform sampler2D velocity; uniform sampler2D velocity_new; uniform float v; uniform vec2 px; uniform float dt; varying vec2 uv; void main(){ vec2 old = texture2D(velocity, uv).xy; vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy; vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy; vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy; vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy; vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3); gl_FragColor = vec4(newv / (4.0 * (1.0 + v * dt)), 0.0, 0.0); }`;

      class ShaderPass {
        constructor(props) {
          this.props = props;
          this.uniforms = props.material?.uniforms;
          this.scene = new THREE.Scene();
          this.camera = new THREE.Camera();
          if (this.uniforms) {
            this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.0), new THREE.RawShaderMaterial(props.material)));
          }
        }
        update() {
          Common.renderer.setRenderTarget(this.props.output || null);
          Common.renderer.render(this.scene, this.camera);
          Common.renderer.setRenderTarget(null);
        }
      }

      class Simulation {
        constructor() {
          this.fbos = { vel_0: null, vel_1: null, vel_viscous0: null, vel_viscous1: null, div: null, pressure_0: null, pressure_1: null };
          this.fboSize = new THREE.Vector2();
          this.cellScale = new THREE.Vector2();
          this.boundarySpace = new THREE.Vector2();
          this.init();
        }
        init() {
          this.calcSize();
          const type = (/(iPad|iPhone|iPod)/i.test(navigator.userAgent)) ? THREE.HalfFloatType : THREE.FloatType;
          const opts = { type, depthBuffer: false, stencilBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping };
          for (let key in this.fbos) this.fbos[key] = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, opts);
          
          this.advection = new ShaderPass({ material: { vertexShader: face_vert, fragmentShader: advection_frag, uniforms: { boundarySpace: { value: this.cellScale }, px: { value: this.cellScale }, fboSize: { value: this.fboSize }, velocity: { value: this.fbos.vel_0.texture }, dt: { value: dt }, isBFECC: { value: true } } }, output: this.fbos.vel_1 });
          this.externalForce = new ShaderPass({ output: this.fbos.vel_1 });
          const mouseM = new THREE.RawShaderMaterial({ vertexShader: mouse_vert, fragmentShader: externalForce_frag, blending: THREE.AdditiveBlending, depthWrite: false, uniforms: { px: { value: this.cellScale }, force: { value: new THREE.Vector2() }, center: { value: new THREE.Vector2() }, scale: { value: new THREE.Vector2(cursorSize, cursorSize) } } });
          this.externalForce.mouse = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mouseM);
          this.externalForce.scene.add(this.externalForce.mouse);
          this.viscous = new ShaderPass({ material: { vertexShader: face_vert, fragmentShader: viscous_frag, uniforms: { boundarySpace: { value: this.boundarySpace }, velocity: { value: this.fbos.vel_1.texture }, velocity_new: { value: this.fbos.vel_viscous0.texture }, v: { value: viscous }, px: { value: this.cellScale }, dt: { value: dt } } }, output: this.fbos.vel_viscous1, output0: this.fbos.vel_viscous0, output1: this.fbos.vel_viscous1 });
          this.divergence = new ShaderPass({ material: { vertexShader: face_vert, fragmentShader: divergence_frag, uniforms: { boundarySpace: { value: this.boundarySpace }, velocity: { value: this.fbos.vel_viscous0.texture }, px: { value: this.cellScale }, dt: { value: dt } } }, output: this.fbos.div });
          this.poisson = new ShaderPass({ material: { vertexShader: face_vert, fragmentShader: poisson_frag, uniforms: { boundarySpace: { value: this.boundarySpace }, pressure: { value: this.fbos.pressure_0.texture }, divergence: { value: this.fbos.div.texture }, px: { value: this.cellScale } } }, output: this.fbos.pressure_1, output0: this.fbos.pressure_0, output1: this.fbos.pressure_1 });
          this.pressure = new ShaderPass({ material: { vertexShader: face_vert, fragmentShader: pressure_frag, uniforms: { boundarySpace: { value: this.boundarySpace }, pressure: { value: this.fbos.pressure_0.texture }, velocity: { value: this.fbos.vel_viscous0.texture }, px: { value: this.cellScale }, dt: { value: dt } } }, output: this.fbos.vel_0 });
        }
        calcSize() {
          const w = Math.max(1, Math.round(resolution * Common.width));
          const h = Math.max(1, Math.round(resolution * Common.height));
          this.cellScale.set(1.0 / w, 1.0 / h);
          this.fboSize.set(w, h);
        }
        resize() {
          this.calcSize();
          for (let key in this.fbos) this.fbos[key].setSize(this.fboSize.x, this.fboSize.y);
        }
        update() {
          this.boundarySpace.copy(isBounce ? new THREE.Vector2(0,0) : this.cellScale);
          this.advection.uniforms.dt.value = dt;
          this.advection.uniforms.isBFECC.value = BFECC;
          this.advection.update();

          const fX = (Mouse.diff.x / 2) * mouseForce;
          const fY = (Mouse.diff.y / 2) * mouseForce;
          const cX = Math.min(Math.max(Mouse.coords.x, -1 + cursorSize * this.cellScale.x + this.cellScale.x * 2), 1 - cursorSize * this.cellScale.x - this.cellScale.x * 2);
          const cY = Math.min(Math.max(Mouse.coords.y, -1 + cursorSize * this.cellScale.y + this.cellScale.y * 2), 1 - cursorSize * this.cellScale.y - this.cellScale.y * 2);
          this.externalForce.mouse.material.uniforms.force.value.set(fX, fY);
          this.externalForce.mouse.material.uniforms.center.value.set(cX, cY);
          this.externalForce.mouse.material.uniforms.scale.value.set(cursorSize, cursorSize);
          this.externalForce.update();

          let vel = this.fbos.vel_1;
          if (isViscous) {
            this.viscous.uniforms.v.value = viscous;
            for (let i = 0; i < iterationsViscous; i++) {
              let fIn = (i % 2 === 0) ? this.viscous.props.output0 : this.viscous.props.output1;
              let fOut = (i % 2 === 0) ? this.viscous.props.output1 : this.viscous.props.output0;
              this.viscous.uniforms.velocity_new.value = fIn.texture;
              this.viscous.props.output = fOut;
              this.viscous.uniforms.dt.value = dt;
              this.viscous.update();
              vel = fOut;
            }
          }

          this.divergence.uniforms.velocity.value = vel.texture;
          this.divergence.update();

          let pOut;
          for (let i = 0; i < iterationsPoisson; i++) {
            let pIn = (i % 2 === 0) ? this.poisson.props.output0 : this.poisson.props.output1;
            pOut = (i % 2 === 0) ? this.poisson.props.output1 : this.poisson.props.output0;
            this.poisson.uniforms.pressure.value = pIn.texture;
            this.poisson.props.output = pOut;
            this.poisson.update();
          }

          this.pressure.uniforms.velocity.value = vel.texture;
          this.pressure.uniforms.pressure.value = pOut.texture;
          this.pressure.update();
        }
      }

      class Output {
        constructor() {
          this.simulation = new Simulation();
          this.scene = new THREE.Scene();
          this.camera = new THREE.Camera();
          this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.RawShaderMaterial({
            vertexShader: face_vert,
            fragmentShader: color_frag,
            transparent: true,
            depthWrite: false,
            uniforms: { velocity: { value: this.simulation.fbos.vel_0.texture }, palette: { value: paletteTex }, bgColor: { value: bgVec4 } }
          })));
        }
        resize() { this.simulation.resize(); }
        update() {
          this.simulation.update();
          Common.renderer.setRenderTarget(null);
          Common.renderer.render(this.scene, this.camera);
        }
      }

      class WebGLManager {
        constructor() {
          Common.init(container);
          Mouse.init(container);
          this.lastUserInteraction = performance.now();
          Mouse.onInteract = () => { this.lastUserInteraction = performance.now(); if (this.autoDriver) this.autoDriver.forceStop(); };
          this.autoDriver = new AutoDriver(this);
          container.prepend(Common.renderer.domElement);
          this.output = new Output();
          
          window.addEventListener('resize', () => { Common.resize(); this.output.resize(); });
          this.loop = this.loop.bind(this);
          requestAnimationFrame(this.loop);
        }
        loop() {
          if (this.autoDriver) this.autoDriver.update();
          Mouse.update();
          Common.update();
          this.output.update();
          requestAnimationFrame(this.loop);
        }
      }
      
      new WebGLManager();
    }
  }

  // ── 17. BORDER GLOW (Profile Pic) ──────────────────────────
  const glowCard = document.querySelector('.about-avatar-glow');
  if (glowCard) {
    const getCenterOfElement = (el) => {
      const rect = el.getBoundingClientRect();
      return [rect.width / 2, rect.height / 2];
    };

    const getEdgeProximity = (el, x, y) => {
      const [cx, cy] = getCenterOfElement(el);
      const dx = x - cx;
      const dy = y - cy;
      let kx = Infinity, ky = Infinity;
      if (dx !== 0) kx = cx / Math.abs(dx);
      if (dy !== 0) ky = cy / Math.abs(dy);
      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    };

    const getCursorAngle = (el, x, y) => {
      const [cx, cy] = getCenterOfElement(el);
      const dx = x - cx;
      const dy = y - cy;
      if (dx === 0 && dy === 0) return 0;
      const radians = Math.atan2(dy, dx);
      let degrees = radians * (180 / Math.PI) + 90;
      if (degrees < 0) degrees += 360;
      return degrees;
    };

    glowCard.addEventListener('pointermove', (e) => {
      const rect = glowCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const edge = getEdgeProximity(glowCard, x, y);
      const angle = getCursorAngle(glowCard, x, y);

      glowCard.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
      glowCard.style.setProperty('--cursor-angle', angle.toFixed(3) + 'deg');
    });

    // Intro sweep animation
    const sweep = () => {
      glowCard.classList.add('sweep-active');
      const angleStart = 110, angleEnd = 465;
      glowCard.style.setProperty('--cursor-angle', angleStart + 'deg');

      gsap.to(glowCard, { '--edge-proximity': 100, duration: 0.5 });
      gsap.to(glowCard, { 
        '--cursor-angle': angleEnd + 'deg', 
        duration: 3, 
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(glowCard, { '--edge-proximity': 0, duration: 1.5, ease: 'power2.in', onComplete: () => glowCard.classList.remove('sweep-active') });
        }
      });
    };
    
    // Create an intersection observer to trigger sweep when visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        sweep();
        observer.disconnect();
      }
    });
    observer.observe(glowCard);
  }



  // ── Initial state ──────────────────────────────────────────
  handleScrollTop();

  // ── ACHIEVEMENTS MODAL ──────────────────────────────────────
  const achieveCards = document.querySelectorAll('.achieve-card');
  const modalOverlay = document.getElementById('lightboxModal');
  const modalClose = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');

  if (achieveCards.length > 0 && modalOverlay) {
    achieveCards.forEach(card => {
      card.addEventListener('click', () => {
        const content = card.querySelector('.achieve-content').innerHTML;
        modalBody.innerHTML = content;
        
        const imgContainer = modalBody.querySelector('.achieve-card-img');
        if (imgContainer) {
          imgContainer.style.maxHeight = 'none';
          const img = imgContainer.querySelector('img');
          if (img) {
            img.style.objectFit = 'contain';
            img.style.maxHeight = '60vh';
          }
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

});
