/**
 * MEDAS Solutions - Lead Generation Scripts
 * Exit Intent Popup & Counter Animations
 */

// =========================================================================
// EXIT INTENT POPUP
// =========================================================================

(function() {
  const POPUP_COOKIE_NAME = 'medas_exit_popup_shown';
  const POPUP_COOKIE_DAYS = 7; // Don't show again for 7 days

  // Check if popup was already shown
  function hasPopupBeenShown() {
    return document.cookie.includes(POPUP_COOKIE_NAME);
  }

  // Set cookie to prevent repeat display
  function setPopupCookie() {
    const expires = new Date();
    expires.setDate(expires.getDate() + POPUP_COOKIE_DAYS);
    document.cookie = `${POPUP_COOKIE_NAME}=true; expires=${expires.toUTCString()}; path=/`;
  }

  // Show popup
  function showExitPopup() {
    const popup = document.getElementById('exitPopup');
    if (popup && !hasPopupBeenShown()) {
      popup.classList.add('active');
      setPopupCookie();
    }
  }

  // Close popup
  window.closeExitPopup = function() {
    const popup = document.getElementById('exitPopup');
    if (popup) {
      popup.classList.remove('active');
    }
  };

  // Exit intent detection
  function handleMouseLeave(e) {
    // Only trigger when mouse leaves through top of viewport
    if (e.clientY < 10) {
      showExitPopup();
      document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }

  // Click outside to close
  function handleOverlayClick(e) {
    const popup = document.getElementById('exitPopup');
    if (e.target === popup) {
      closeExitPopup();
    }
  }

  // Escape key to close
  function handleEscapeKey(e) {
    if (e.key === 'Escape') {
      closeExitPopup();
    }
  }

  // Initialize exit intent after page load and some engagement
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for some engagement before enabling exit intent
    setTimeout(function() {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000); // Wait 5 seconds

    // Setup overlay click and escape handlers
    const popup = document.getElementById('exitPopup');
    if (popup) {
      popup.addEventListener('click', handleOverlayClick);
      document.addEventListener('keydown', handleEscapeKey);
    }
  });
})();


// =========================================================================
// ANIMATED COUNTER
// =========================================================================

(function() {
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();

    function formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M+';
      } else if (num >= 1000) {
        return Math.floor(num).toLocaleString() + '+';
      }
      return Math.floor(num) + '+';
    }

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = start + (target - start) * easedProgress;

      element.textContent = formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Intersection Observer for counter animation
  function setupCounterObserver() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    if (!counters.length) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    counters.forEach(function(counter) {
      observer.observe(counter);
    });
  }

  document.addEventListener('DOMContentLoaded', setupCounterObserver);
})();


// =========================================================================
// FAQ ACCORDION
// =========================================================================

(function() {
  function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq-question');

      question.addEventListener('click', function() {
        // Close all other items
        faqItems.forEach(function(otherItem) {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current item
        item.classList.toggle('active');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', setupFAQAccordion);
})();


// =========================================================================
// FORM SUBMISSION TRACKING
// =========================================================================

(function() {
  function setupFormTracking() {
    const forms = document.querySelectorAll('form[action*="web3forms"]');

    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        // Track form submission event (for analytics)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submission', {
            'form_type': form.querySelector('input[name="subject"]')?.value || 'contact',
            'page_path': window.location.pathname
          });
        }

        // Optional: Add loading state to button
        const button = form.querySelector('button[type="submit"]');
        if (button) {
          button.disabled = true;
          button.textContent = 'Sending...';
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', setupFormTracking);
})();


// =========================================================================
// FLOATING BUTTON SCROLL BEHAVIOR
// =========================================================================

(function() {
  function setupFloatingButton() {
    const floatingContact = document.querySelector('.floating-contact');

    if (!floatingContact) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateFloatingButton() {
      const currentScrollY = window.scrollY;

      // Hide when scrolling down fast, show when scrolling up or at bottom
      if (currentScrollY > lastScrollY && currentScrollY > 500) {
        floatingContact.style.transform = 'translateY(150px)';
      } else {
        floatingContact.style.transform = 'translateY(0)';
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateFloatingButton);
        ticking = true;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', setupFloatingButton);
})();
