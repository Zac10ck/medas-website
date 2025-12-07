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
 * Enhanced Mobile Navigation with Accessibility and Touch Support
 */
function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileNavPanel = document.querySelector('.mobile-nav-panel');

  if (!toggle || !mobileNav) return;

  let scrollPosition = 0;
  let touchStartX = 0;
  let touchCurrentX = 0;

  // Open mobile navigation
  function openMobileNav() {
    // Save scroll position
    scrollPosition = window.pageYOffset;

    // Update ARIA attributes
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileNav.classList.add('active');

    // Prevent body scroll
    document.body.classList.add('nav-open');
    document.body.style.top = `-${scrollPosition}px`;

    // Focus first interactive element
    setTimeout(() => {
      closeBtn?.focus();
    }, 300);
  }

  // Close mobile navigation
  function closeMobileNav() {
    // Update ARIA attributes
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.classList.remove('active');

    // Restore body scroll
    document.body.classList.remove('nav-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollPosition);

    // Return focus to toggle
    toggle.focus();
  }

  // Toggle button click
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  // Close button click
  closeBtn?.addEventListener('click', closeMobileNav);

  // Backdrop click to close
  backdrop?.addEventListener('click', closeMobileNav);

  // Close on link click (only direct links, not submenu toggles)
  mobileNav.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!mobileNav.classList.contains('active')) return;

    // Close on Escape
    if (e.key === 'Escape') {
      closeMobileNav();
    }

    // Trap focus within mobile nav
    if (e.key === 'Tab') {
      const focusableElements = mobileNav.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });

  // Swipe to close gesture
  mobileNavPanel?.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  mobileNavPanel?.addEventListener('touchmove', (e) => {
    if (!mobileNav.classList.contains('active')) return;
    touchCurrentX = e.touches[0].clientX;
    const diff = touchCurrentX - touchStartX;

    // Only allow swipe to the right (to close)
    if (diff > 0) {
      mobileNavPanel.style.transform = `translateX(${Math.min(diff, 100)}px)`;
    }
  }, { passive: true });

  mobileNavPanel?.addEventListener('touchend', () => {
    const diff = touchCurrentX - touchStartX;

    // If swiped more than 100px to the right, close the nav
    if (diff > 100) {
      closeMobileNav();
    }

    // Reset transform
    mobileNavPanel.style.transform = '';
    touchStartX = 0;
    touchCurrentX = 0;
  }, { passive: true });

  // Initialize submenu accordion
  initMobileSubmenu();
}

/**
 * Mobile Submenu Accordion
 */
function initMobileSubmenu() {
  const submenuToggles = document.querySelectorAll('.mobile-nav-item.has-submenu > button');

  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = toggle.closest('.mobile-nav-item');
      const submenu = parentItem.querySelector('.mobile-submenu');
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      // Close all other submenus (accordion behavior)
      document.querySelectorAll('.mobile-nav-item.has-submenu').forEach(item => {
        if (item !== parentItem) {
          item.classList.remove('expanded');
          const otherToggle = item.querySelector('button[aria-expanded]');
          const otherSubmenu = item.querySelector('.mobile-submenu');
          if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
          if (otherSubmenu) otherSubmenu.style.maxHeight = '0';
        }
      });

      // Toggle current submenu
      if (isExpanded) {
        toggle.setAttribute('aria-expanded', 'false');
        parentItem.classList.remove('expanded');
        if (submenu) submenu.style.maxHeight = '0';
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        parentItem.classList.add('expanded');
        if (submenu) submenu.style.maxHeight = submenu.scrollHeight + 'px';
      }
    });
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

/**
 * Touch-Optimized Interactions
 */
function initTouchInteractions() {
  // Detect touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    document.body.classList.add('touch-device');
  }

  // Enhanced button feedback
  document.querySelectorAll('.btn, .feature-card, .gcc-office-card').forEach(element => {
    element.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    }, { passive: true });

    element.addEventListener('touchend', function() {
      setTimeout(() => {
        this.classList.remove('touch-active');
      }, 150);
    }, { passive: true });

    element.addEventListener('touchcancel', function() {
      this.classList.remove('touch-active');
    }, { passive: true });
  });

  // Prevent double-tap zoom on buttons
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      if (e.target.closest('.btn, button, a')) {
        e.preventDefault();
      }
    }
    lastTouchEnd = now;
  }, { passive: false });

  // Lazy load images with IntersectionObserver
  initLazyLoading();

  // Initialize desktop dropdown navigation
  initDesktopDropdowns();
}

/**
 * Lazy Loading for Images
 */
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback to IntersectionObserver
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.remove('skeleton');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });

    images.forEach(img => {
      imageObserver.observe(img);
    });
  }
}

/**
 * Desktop Dropdown Navigation
 */
function initDesktopDropdowns() {
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

  dropdownItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown');

    if (!link || !dropdown) return;

    // Desktop: hover behavior
    item.addEventListener('mouseenter', () => {
      link.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('mouseleave', () => {
      link.setAttribute('aria-expanded', 'false');
    });

    // Keyboard accessibility
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isExpanded = link.getAttribute('aria-expanded') === 'true';
        link.setAttribute('aria-expanded', !isExpanded);
      }

      // Arrow down to first dropdown item
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const firstDropdownLink = dropdown.querySelector('a');
        if (firstDropdownLink) {
          link.setAttribute('aria-expanded', 'true');
          firstDropdownLink.focus();
        }
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!item.contains(e.target)) {
        link.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/**
 * Scroll Progress Indicator (optional)
 */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
  }, { passive: true });
}

// Initialize touch interactions on load
document.addEventListener('DOMContentLoaded', () => {
  initTouchInteractions();
});
