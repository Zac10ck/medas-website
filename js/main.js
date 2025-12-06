/**
 * MEDAS Solutions - Main JavaScript
 * Professional Healthcare Software Website
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initAnimations();
  initForms();
});

/**
 * Header scroll effect
 */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile navigation toggle
 */
function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Scroll animations using Intersection Observer
 */
function initAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  // Add index to grid items for staggered animations
  document.querySelectorAll('.integration-grid, .gcc-offices-grid, .regions-grid, .offices-grid').forEach(grid => {
    grid.querySelectorAll('[data-animate]').forEach((item, index) => {
      item.style.setProperty('--item-index', index);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('animate-in');
          entry.target.classList.add('visible'); // Keep for backwards compatibility
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));

  // Counter animation for stats
  initCounterAnimation();
}

/**
 * Animated counter for statistics
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = el.dataset.count || el.textContent.replace(/[^0-9.]/g, '');
    const suffix = el.textContent.replace(/[0-9.]/g, '');
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        el.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target + suffix;
      }
    };

    updateCounter();
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    counter.dataset.count = counter.textContent.replace(/[^0-9.]/g, '');
    counterObserver.observe(counter);
  });
}

/**
 * Form validation
 */
function initForms() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll('[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--error)';
        } else {
          input.style.borderColor = '';
        }
      });

      if (isValid) {
        // Show success message
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Thank you! We\'ll be in touch.';
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          form.reset();
        }, 3000);
      }
    });
  });
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const top = target.offsetTop - headerHeight;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  });
});
