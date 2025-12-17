/**
 * MEDAS Solutions - Spectacular Animations Controller
 * Powered by GSAP + ScrollTrigger
 */

(function() {
  'use strict';

  // Wait for GSAP to be available
  function waitForGSAP(callback) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      callback();
    } else {
      setTimeout(() => waitForGSAP(callback), 50);
    }
  }

  function startAnimations() {
    waitForGSAP(function() {
      // Register ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger);

      // Initialize everything
      init();
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAnimations);
  } else {
    startAnimations();
  }

  // =========================================================================
  // PAGE LOADER
  // =========================================================================
  function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    const loaderBar = document.querySelector('.loader-bar');

    if (!loader || !loaderBar) return;

    // Animate loader bar
    gsap.to(loaderBar, {
      width: '100%',
      duration: 1.5,
      ease: 'power2.inOut',
      onComplete: () => {
        // Fade out loader
        gsap.to(loader, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            loader.classList.add('hidden');
            // Start hero animations
            initHeroAnimation();
          }
        });
      }
    });
  }

  // =========================================================================
  // SCROLL PROGRESS BAR
  // =========================================================================
  function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    gsap.to(progressBar, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });
  }

  // =========================================================================
  // HERO ANIMATIONS
  // =========================================================================
  function initHeroAnimation() {
    const hero = document.querySelector('.hero-animated');
    if (!hero) return;

    const timeline = gsap.timeline({ delay: 0.2 });

    // Animate morph shapes
    timeline.to('.morph-shape', {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Animate hero content
    timeline.fromTo('.hero__content .overline',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=1'
    );

    timeline.fromTo('.hero__title',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' },
      '-=0.4'
    );

    timeline.fromTo('.hero__subtitle',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    );

    // Buttons pop in
    timeline.fromTo('.hero__actions .btn',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(1.7)' },
      '-=0.3'
    );

    // Stats slide up
    timeline.fromTo('.hero__stat-item',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
      '-=0.3'
    );

    // Create floating particles
    createFloatingParticles();
    createFloatingIcons();
  }

  // =========================================================================
  // FLOATING PARTICLES
  // =========================================================================
  function createFloatingParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'hero-particle';

      // Random position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';

      // Random size
      const size = 4 + Math.random() * 6;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';

      // Random animation delay
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (6 + Math.random() * 6) + 's';

      container.appendChild(particle);
    }
  }

  // =========================================================================
  // FLOATING ICONS
  // =========================================================================
  function createFloatingIcons() {
    const container = document.querySelector('.hero-floating-icons');
    if (!container) return;

    const icons = [
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>', // Heartbeat
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', // Shield
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>', // Clock
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', // Heart
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>' // Logout/Data
    ];

    const iconCount = 8;
    const positions = [
      { top: '10%', left: '5%' },
      { top: '20%', right: '8%' },
      { top: '40%', left: '3%' },
      { top: '60%', right: '5%' },
      { top: '75%', left: '8%' },
      { top: '85%', right: '10%' },
      { top: '30%', left: '90%' },
      { top: '50%', right: '92%' }
    ];

    for (let i = 0; i < iconCount; i++) {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'floating-icon';
      iconWrapper.innerHTML = icons[i % icons.length];

      // Position
      const pos = positions[i];
      Object.keys(pos).forEach(key => {
        iconWrapper.style[key] = pos[key];
      });

      // Size
      iconWrapper.style.width = (30 + Math.random() * 30) + 'px';
      iconWrapper.style.height = iconWrapper.style.width;

      // Animation
      iconWrapper.style.animationDelay = (i * 1.5) + 's';
      iconWrapper.style.animationDuration = (8 + Math.random() * 4) + 's';

      container.appendChild(iconWrapper);
    }
  }

  // =========================================================================
  // USP CARDS ANIMATION
  // =========================================================================
  function initUSPCards() {
    const cards = document.querySelectorAll('.usp-card');
    if (!cards.length) return;

    gsap.fromTo(cards,
      { y: 60, opacity: 0, rotateX: 20 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cards[0].closest('.section') || cards[0],
          start: 'top 80%',
          once: true,
          onEnter: () => {
            cards.forEach(card => card.classList.add('animated'));
          }
        }
      }
    );
  }

  // =========================================================================
  // GCC COMPLIANCE ANIMATION
  // =========================================================================
  function initComplianceAnimation() {
    const items = document.querySelectorAll('.gcc-compliance-item');
    if (!items.length) return;

    gsap.fromTo(items,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gcc-compliance-grid',
          start: 'top 80%',
          once: true,
          onEnter: () => {
            items.forEach(item => item.classList.add('animated'));
          }
        }
      }
    );

    // Integration items
    const integrations = document.querySelectorAll('.integration-item');
    if (integrations.length) {
      gsap.fromTo(integrations,
        { scale: 0.5, opacity: 0, rotation: -10 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.5,
          stagger: {
            each: 0.1,
            from: 'center'
          },
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.integration-grid',
            start: 'top 85%',
            once: true,
            onEnter: () => {
              integrations.forEach(item => item.classList.add('animated'));
            }
          }
        }
      );
    }
  }

  // =========================================================================
  // SOLUTIONS ANIMATION
  // =========================================================================
  function initSolutionsAnimation() {
    const solutions = document.querySelectorAll('.solution-showcase-item');
    if (!solutions.length) return;

    solutions.forEach((item, index) => {
      const content = item.querySelector('.solution-showcase-content');
      const image = item.querySelector('.solution-showcase-image img');

      // Parallax on images
      if (image) {
        gsap.to(image, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      }

      // Content reveal
      ScrollTrigger.create({
        trigger: item,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          item.classList.add('animated');
          if (content) {
            setTimeout(() => content.classList.add('animated'), 200);
          }
        }
      });
    });
  }

  // =========================================================================
  // STATS ANIMATION
  // =========================================================================
  function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-item');
    if (!stats.length) return;

    // Find unique parent sections
    const sections = new Set();
    stats.forEach(stat => {
      const section = stat.closest('.stats-section, .stats-section-bg, .stats-grid');
      if (section) sections.add(section);
    });

    sections.forEach(section => {
      const sectionStats = section.querySelectorAll('.stat-item');

      gsap.fromTo(sectionStats,
        { scale: 0.8, y: 30, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              sectionStats.forEach(stat => stat.classList.add('animated'));
              animateCounters(sectionStats);
            }
          }
        }
      );
    });
  }

  // =========================================================================
  // COUNTER ANIMATION
  // =========================================================================
  function animateCounters(statItems) {
    statItems.forEach(stat => {
      const numberEl = stat.querySelector('.stat-number[data-count]');
      if (!numberEl) return;

      const target = parseInt(numberEl.dataset.count) || 0;
      const suffix = numberEl.dataset.suffix || '';
      const duration = 2;

      gsap.to({ val: 0 }, {
        val: target,
        duration: duration,
        ease: 'power2.out',
        onUpdate: function() {
          const current = Math.floor(this.targets()[0].val);
          if (target >= 1000000) {
            numberEl.textContent = (current / 1000000).toFixed(0) + 'M' + suffix;
          } else if (target >= 1000) {
            numberEl.textContent = current.toLocaleString() + suffix;
          } else {
            numberEl.textContent = current + suffix;
          }
        }
      });
    });
  }

  // =========================================================================
  // FEATURE CARDS ANIMATION
  // =========================================================================
  function initFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    if (!cards.length) return;

    gsap.fromTo(cards,
      { y: 50, opacity: 0, rotateX: 15 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 80%',
          once: true,
          onEnter: () => {
            cards.forEach(card => card.classList.add('animated'));
          }
        }
      }
    );

    // 3D tilt effect on hover
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }

  // =========================================================================
  // TRUST BADGES ANIMATION
  // =========================================================================
  function initTrustBadges() {
    const badges = document.querySelectorAll('.trust-badge');
    if (!badges.length) return;

    gsap.fromTo(badges,
      { y: 30, scale: 0.8, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.trust-badges',
          start: 'top 85%',
          once: true,
          onEnter: () => {
            badges.forEach(badge => badge.classList.add('animated'));
          }
        }
      }
    );
  }

  // =========================================================================
  // TESTIMONIAL ANIMATION
  // =========================================================================
  function initTestimonialAnimation() {
    const testimonial = document.querySelector('.testimonial-card');
    if (!testimonial) return;

    gsap.fromTo(testimonial,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: testimonial,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            testimonial.classList.add('animated');
          }
        }
      }
    );
  }

  // =========================================================================
  // GCC OFFICES ANIMATION
  // =========================================================================
  function initGCCOffices() {
    const cards = document.querySelectorAll('.gcc-office-card');
    if (!cards.length) return;

    gsap.fromTo(cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gcc-offices-grid',
          start: 'top 80%',
          once: true,
          onEnter: () => {
            cards.forEach(card => card.classList.add('animated'));
          }
        }
      }
    );
  }

  // =========================================================================
  // SECTION HEADERS ANIMATION
  // =========================================================================
  function initSectionHeaders() {
    const headers = document.querySelectorAll('.section-header');

    headers.forEach(header => {
      gsap.fromTo(header,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              header.classList.add('animated');
            }
          }
        }
      );
    });
  }

  // =========================================================================
  // MAGNETIC BUTTONS
  // =========================================================================
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-white');

    buttons.forEach(btn => {
      btn.classList.add('btn-magnetic', 'btn-ripple');

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }

  // =========================================================================
  // PARALLAX EFFECTS
  // =========================================================================
  function initParallax() {
    // Hero parallax
    const heroBg = document.querySelector('.hero-image-bg');
    if (heroBg) {
      gsap.to(heroBg, {
        backgroundPositionY: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroBg,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    // Morph shapes parallax
    const morphShapes = document.querySelectorAll('.morph-shape');
    morphShapes.forEach((shape, i) => {
      gsap.to(shape, {
        y: (i + 1) * -80,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-image-bg',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }

  // =========================================================================
  // INITIALIZE ALL ANIMATIONS
  // =========================================================================
  function init() {
    // Start with page loader
    initPageLoader();

    // Initialize scroll-triggered animations
    initScrollProgress();
    initSectionHeaders();
    initUSPCards();
    initComplianceAnimation();
    initSolutionsAnimation();
    initStatsAnimation();
    initFeatureCards();
    initTrustBadges();
    initTestimonialAnimation();
    initGCCOffices();
    initMagneticButtons();
    initParallax();
  }

})();
