/**
 * MEDAS Solution Finder Quiz
 */

(function() {
  const totalSteps = 5;
  let currentStep = 1;
  const answers = {};

  // Product database with scoring
  const products = {
    hims: {
      name: 'HIMS',
      title: 'Hospital Information Management System',
      description: 'Complete hospital management including patient registration, scheduling, billing, and clinical workflows.',
      link: 'products/hims.html',
      score: 0
    },
    eclinic: {
      name: 'E-Clinic',
      title: 'Electronic Clinic Management',
      description: 'Streamlined solution for outpatient clinics with appointment scheduling, EMR, and billing.',
      link: 'products/e-clinic.html',
      score: 0
    },
    elab: {
      name: 'E-Lab',
      title: 'Laboratory Information System',
      description: 'Complete lab automation with sample tracking, machine integration, and result management.',
      link: 'products/e-lab.html',
      score: 0
    },
    epharma: {
      name: 'E-Pharma',
      title: 'Pharmacy Management System',
      description: 'Inventory management, prescription processing, and insurance integration for pharmacies.',
      link: 'products/e-pharma.html',
      score: 0
    },
    telemedicine: {
      name: 'Telemedicine',
      title: 'Virtual Care Platform',
      description: 'Video consultations, e-prescriptions, and online booking for remote patient care.',
      link: 'products/telemedicine.html',
      score: 0
    },
    accrehealth: {
      name: 'AccreHealth',
      title: 'Quality & Accreditation Management',
      description: 'JCI, CBAHI, and quality management for continuous accreditation readiness.',
      link: 'products/accre-health.html',
      score: 0
    },
    eveterinary: {
      name: 'E-Veterinary',
      title: 'Veterinary Clinic Management',
      description: 'Complete veterinary practice management for animal healthcare facilities.',
      link: 'products/e-veterinary.html',
      score: 0
    },
    mobileapp: {
      name: 'Mobile App',
      title: 'Patient Mobile Application',
      description: 'Patient-facing app for appointments, health records, and telemedicine.',
      link: 'products/mobile-app.html',
      score: 0
    }
  };

  // Scoring rules based on answers
  const scoringRules = {
    facilityType: {
      hospital: { hims: 10, elab: 5, epharma: 5, accrehealth: 5, mobileapp: 3 },
      clinic: { eclinic: 10, mobileapp: 5, telemedicine: 3 },
      lab: { elab: 10 },
      pharmacy: { epharma: 10 },
      veterinary: { eveterinary: 10 }
    },
    orgSize: {
      small: { eclinic: 5, mobileapp: 2 },
      medium: { hims: 3, eclinic: 3, elab: 3, epharma: 3 },
      large: { hims: 5, elab: 4, epharma: 4, accrehealth: 3, mobileapp: 3 },
      enterprise: { hims: 8, elab: 5, epharma: 5, accrehealth: 5, mobileapp: 5, telemedicine: 3 }
    },
    primaryNeed: {
      'patient-management': { hims: 8, eclinic: 8, mobileapp: 5 },
      'lab-automation': { elab: 10 },
      'pharmacy': { epharma: 10 },
      'telemedicine': { telemedicine: 10, mobileapp: 5 },
      'quality': { accrehealth: 10 }
    },
    currentSystem: {
      paper: { hims: 5, eclinic: 5, elab: 5, epharma: 5 },
      legacy: { hims: 5, eclinic: 5, elab: 5, epharma: 5 },
      upgrade: { telemedicine: 5, mobileapp: 5, accrehealth: 3 },
      new: { hims: 8, eclinic: 5, elab: 5, epharma: 5, mobileapp: 3 }
    },
    region: {
      uae: {},
      saudi: {},
      qatar: {},
      kuwait: {},
      bahrain: {},
      other: {}
    }
  };

  // DOM elements
  const form = document.getElementById('quizForm');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const quizNav = document.getElementById('quizNav');
  const quizResults = document.getElementById('quizResults');
  const recommendations = document.getElementById('recommendations');
  const restartBtn = document.getElementById('restartQuiz');

  if (!form) return;

  // Initialize
  updateProgress();
  setupEventListeners();

  function setupEventListeners() {
    // Next button
    nextBtn.addEventListener('click', () => {
      if (validateStep()) {
        if (currentStep < totalSteps) {
          currentStep++;
          showStep(currentStep);
        } else {
          showResults();
        }
      }
    });

    // Previous button
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });

    // Auto-advance on selection
    form.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener('change', () => {
        saveAnswer(input.name, input.value);
        // Auto-advance after short delay
        setTimeout(() => {
          if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
          } else {
            showResults();
          }
        }, 300);
      });
    });

    // Restart button
    if (restartBtn) {
      restartBtn.addEventListener('click', restartQuiz);
    }
  }

  function showStep(step) {
    // Hide all steps
    form.querySelectorAll('.quiz-step').forEach(el => {
      el.classList.remove('active');
    });

    // Show current step
    const currentStepEl = form.querySelector(`.quiz-step[data-step="${step}"]`);
    if (currentStepEl) {
      currentStepEl.classList.add('active');
    }

    updateProgress();
    updateNavButtons();
  }

  function updateProgress() {
    const percent = ((currentStep - 1) / totalSteps) * 100;
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `Question ${currentStep} of ${totalSteps}`;
  }

  function updateNavButtons() {
    prevBtn.disabled = currentStep === 1;
    nextBtn.textContent = currentStep === totalSteps ? 'See Results' : 'Next';
  }

  function validateStep() {
    const currentStepEl = form.querySelector(`.quiz-step[data-step="${currentStep}"]`);
    const selectedOption = currentStepEl.querySelector('input[type="radio"]:checked');

    if (!selectedOption) {
      // Highlight options
      currentStepEl.querySelectorAll('.option-card').forEach(card => {
        card.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
          card.style.animation = '';
        }, 500);
      });
      return false;
    }

    saveAnswer(selectedOption.name, selectedOption.value);
    return true;
  }

  function saveAnswer(name, value) {
    answers[name] = value;
  }

  function calculateScores() {
    // Reset scores
    Object.keys(products).forEach(key => {
      products[key].score = 0;
    });

    // Apply scoring rules
    Object.entries(answers).forEach(([question, answer]) => {
      const rules = scoringRules[question]?.[answer];
      if (rules) {
        Object.entries(rules).forEach(([product, points]) => {
          if (products[product]) {
            products[product].score += points;
          }
        });
      }
    });

    // Sort by score
    return Object.entries(products)
      .filter(([_, product]) => product.score > 0)
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 4);
  }

  function showResults() {
    // Hide quiz steps and nav
    form.querySelectorAll('.quiz-step').forEach(el => {
      el.style.display = 'none';
    });
    quizNav.style.display = 'none';

    // Update progress to complete
    progressFill.style.width = '100%';
    progressText.textContent = 'Complete!';

    // Calculate and display recommendations
    const topProducts = calculateScores();
    renderRecommendations(topProducts);

    // Show results
    quizResults.style.display = 'block';
    quizResults.scrollIntoView({ behavior: 'smooth' });
  }

  function renderRecommendations(topProducts) {
    recommendations.innerHTML = '';

    topProducts.forEach(([key, product], index) => {
      const matchPercent = Math.min(100, Math.round((product.score / 25) * 100));
      const isPrimary = index === 0;

      const card = document.createElement('div');
      card.className = `recommendation-card ${isPrimary ? 'primary' : ''}`;
      card.innerHTML = `
        <div class="recommendation-header">
          <span class="recommendation-rank">${isPrimary ? 'Best Match' : `#${index + 1}`}</span>
          <span class="recommendation-match">${matchPercent}% Match</span>
        </div>
        <h3>${product.name}</h3>
        <p class="recommendation-title">${product.title}</p>
        <p class="recommendation-desc">${product.description}</p>
        <a href="${product.link}" class="btn ${isPrimary ? 'btn-primary' : 'btn-outline'}">Learn More</a>
      `;

      recommendations.appendChild(card);
    });
  }

  function restartQuiz() {
    // Reset state
    currentStep = 1;
    Object.keys(answers).forEach(key => delete answers[key]);

    // Clear selections
    form.querySelectorAll('input[type="radio"]').forEach(input => {
      input.checked = false;
    });

    // Show quiz steps, hide results
    form.querySelectorAll('.quiz-step').forEach(el => {
      el.style.display = '';
    });
    quizNav.style.display = '';
    quizResults.style.display = 'none';

    // Show first step
    showStep(1);

    // Scroll to top
    document.querySelector('.quiz-container').scrollIntoView({ behavior: 'smooth' });
  }
})();
