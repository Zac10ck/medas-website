/**
 * MEDAS Solutions - Main JavaScript
 * Professional Healthcare Software Website
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initAnimations();
  initForms();
  initCookieConsent();
  initLanguageSwitcher();
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

/**
 * Cookie Consent Banner
 */
function initCookieConsent() {
  const COOKIE_CONSENT_KEY = 'medas_cookie_consent';

  // Check if user already made a choice
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (consent) return;

  // Create cookie banner if it doesn't exist
  if (!document.querySelector('.cookie-banner')) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-banner-content">
        <div class="cookie-banner-text">
          <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
          By clicking "Accept All", you consent to our use of cookies.
          <a href="privacy-policy.html">Learn more</a></p>
        </div>
        <div class="cookie-banner-actions">
          <button class="cookie-btn cookie-btn-decline" data-action="decline">Decline</button>
          <button class="cookie-btn cookie-btn-accept" data-action="accept">Accept All</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
  }

  const banner = document.querySelector('.cookie-banner');

  // Show banner after a short delay
  setTimeout(() => {
    banner.classList.add('show');
  }, 1000);

  // Handle button clicks
  banner.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    if (action === 'accept') {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
      // Enable analytics and marketing cookies here if needed
    } else if (action === 'decline') {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
      // Disable non-essential cookies here if needed
    }

    // Hide banner with animation
    banner.classList.remove('show');
    setTimeout(() => {
      banner.remove();
    }, 400);
  });
}

/**
 * Language Switcher
 */
function initLanguageSwitcher() {
  const LANG_PREF_KEY = 'medas_language';

  // Store language preference when clicking language links
  document.querySelectorAll('.lang-btn[href]').forEach(btn => {
    btn.addEventListener('click', () => {
      const href = btn.getAttribute('href');
      const lang = href.includes('/ar/') ? 'ar' : 'en';
      localStorage.setItem(LANG_PREF_KEY, lang);
    });
  });

  // Check for browser language on first visit (optional auto-redirect)
  // Uncomment if you want automatic language detection
  /*
  const savedLang = localStorage.getItem(LANG_PREF_KEY);
  if (!savedLang) {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('ar')) {
      const isArabicPage = document.documentElement.lang === 'ar';
      if (!isArabicPage) {
        localStorage.setItem(LANG_PREF_KEY, 'ar');
        window.location.href = 'ar/index.html';
      }
    }
  }
  */
}
