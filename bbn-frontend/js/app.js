import { ImageUpload } from './components/ImageUpload.js';
import { ImagePreview } from './components/ImagePreview.js';
import { BeautyAnalysis } from './components/BeautyAnalysis.js';
import { AnalysisResults } from './components/AnalysisResults.js';
import { HairAnalysisResults } from './components/HairAnalysisResults.js';
import { HairQuestionnaire } from './components/HairQuestionnaire.js';
import { RecommendationEngine } from './components/RecommendationEngine.js';
import { BeautyAssistant } from './components/BeautyAssistant.js';
import { UserBeautyProfile } from './components/UserBeautyProfile.js';
import { AnalysisTimeline } from './components/AnalysisTimeline.js';
import { AuthModal } from './components/AuthModal.js';
import { DietaryPlanView } from './components/DietaryPlanView.js';
import { API } from './api.js';

class BioBeautyNexusApp {
  constructor() {
    this.activeTab = 'home';
    this.selectedImage = null;
    this.currentAnalysis = null;
    this.currentHairAnalysis = null;
    this.scanPhase = 'upload'; // 'upload', 'preview', 'scanning', 'error'
    this.scanType = 'skin'; // 'skin' or 'hair'
    this.scanErrorMessage = null;
    this.currentUser = API.getCurrentUser();
    this.userProfile = API.getUserProfile();

    this.init();
  }

  init() {
    this.bindNavigation();
    this.renderAuthButton();
    this.renderCurrentView();
  }

  bindNavigation() {
    document.querySelectorAll('[data-nav-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-nav-target');
        this.navigateTo(target);
      });
    });

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (mobileMenuBtn && navLinks) {
      mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('nav-open');
      });
    }

    const btnAuth = document.getElementById('navAuthBtn');
    if (btnAuth) {
      btnAuth.addEventListener('click', () => {
        this.openAuthModal();
      });
    }
  }

  renderAuthButton() {
    const btnAuth = document.getElementById('navAuthBtn');
    if (!btnAuth) return;

    if (this.currentUser) {
      btnAuth.innerHTML = `
        <span class="user-avatar-tiny">👤</span>
        <span class="user-nav-name">${this.currentUser.name || 'Member'}</span>
        <span class="logout-icon" title="Log Out">⏻</span>
      `;
      btnAuth.onclick = (e) => {
        if (e.target.classList.contains('logout-icon')) {
          e.stopPropagation();
          API.logout();
          this.currentUser = null;
          this.renderAuthButton();
          return;
        }
        this.openAuthModal();
      };
    } else {
      btnAuth.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Sign In / Register</span>
      `;
      btnAuth.onclick = () => this.openAuthModal();
    }
  }

  openAuthModal() {
    const modal = new AuthModal({
      onAuthSuccess: (user) => {
        this.currentUser = user;
        this.renderAuthButton();
      }
    });
    document.body.appendChild(modal.render());
  }

  navigateTo(tabName) {
    this.activeTab = tabName;

    document.querySelectorAll('[data-nav-target]').forEach(b => {
      if (b.getAttribute('data-nav-target') === tabName) {
        b.classList.add('nav-active');
      } else {
        b.classList.remove('nav-active');
      }
    });

    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('nav-open');

    this.renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderCurrentView() {
    const mainOutlet = document.getElementById('mainOutlet');
    if (!mainOutlet) return;
    mainOutlet.innerHTML = '';

    switch (this.activeTab) {
      case 'home':
        this.renderHome(mainOutlet);
        break;
      case 'scan':
        this.renderScanSection(mainOutlet);
        break;
      case 'hair_quiz':
        this.renderHairQuiz(mainOutlet);
        break;
      case 'results':
        this.renderResults(mainOutlet);
        break;
      case 'hair_results':
        this.renderHairResults(mainOutlet);
        break;
      case 'routine':
        this.renderRoutine(mainOutlet);
        break;
      case 'diet':
        this.renderDietaryPlan(mainOutlet);
        break;
      case 'assistant':
        this.renderAssistant(mainOutlet);
        break;
      case 'timeline':
        this.renderTimeline(mainOutlet);
        break;
      case 'questionnaire':
        this.renderQuestionnaire(mainOutlet);
        break;
      default:
        this.renderHome(mainOutlet);
    }
  }

  renderHome(container) {
    const homeSection = document.createElement('div');
    homeSection.className = 'home-wrapper fade-in';
    homeSection.innerHTML = `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="bio-badge">
            <span class="pulse-dot"></span>
            100% NATURAL BOTANICAL & BIOTECH BEAUTY
          </div>
          
          <h1 class="hero-title">
            See Your Beauty.<br />
            <span class="gradient-text">Understand Your Routine.</span>
          </h1>
          
          <p class="hero-subtitle">
            AI-powered beauty & hair analysis using pure natural ingredients. Decode visible characteristics with non-medical precision and build your optimal botanical daily rituals.
          </p>

          <div class="hero-cta-group">
            <button type="button" class="btn btn-primary btn-hero glow-pulse" id="btnStartScanHero">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
                <line x1="12" y1="2" x2="12" y2="5"></line>
                <line x1="12" y1="19" x2="12" y2="22"></line>
                <line x1="2" y1="12" x2="5" y2="12"></line>
                <line x1="19" y1="12" x2="22" y2="12"></line>
              </svg>
              Start AI Facial Scan
            </button>

            <button type="button" class="btn btn-secondary btn-hero" id="btnLaunchHairQuizHero">
              <span class="mode-icon">📝</span>
              Hair Questionnaire Diagnostic
            </button>
          </div>

          <!-- Trust Badges -->
          <div class="hero-features-list">
            <div class="feature-badge">
              <span class="badge-icon">🌿</span>
              <span>100% Natural Botanical Ingredients</span>
            </div>
            <div class="feature-badge">
              <span class="badge-icon">💇‍♀️</span>
              <span>Hair Analysis by Questionnaire & Scan</span>
            </div>
            <div class="feature-badge">
              <span class="badge-icon">🛡️</span>
              <span>Strict Non-Medical Safety Standard</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-scan-card glass-panel">
            <div class="hero-scanner-preview">
              <div class="scanner-sweep-line"></div>
              <div class="face-biometric-mesh"></div>
              <div class="hero-overlay-tag top">NATURAL INGREDIENTS DATABASE</div>
              <div class="hero-overlay-tag bottom">HAIR QUESTIONNAIRE & OPTICAL SCAN</div>
            </div>
            <div class="hero-scanner-footer">
              <div class="metric-quick-stat">
                <span class="stat-num">100%</span>
                <span class="stat-lbl">Botanical Ingredients</span>
              </div>
              <div class="metric-quick-stat">
                <span class="stat-num">8-Step</span>
                <span class="stat-lbl">Hair Questionnaire</span>
              </div>
              <div class="metric-quick-stat">
                <span class="stat-num">Dual</span>
                <span class="stat-lbl">Skin & Hair</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Dual Analysis Hub Cards -->
      <section class="dual-features-section">
        <div class="section-heading text-center">
          <div class="bio-badge">TWO DIAGNOSTIC PATHWAYS</div>
          <h2>Comprehensive Bio-Cosmetic Diagnostics</h2>
          <p>Choose between full facial skin profiling or our in-depth hair & scalp diagnostic questionnaire.</p>
        </div>

        <div class="dual-cards-grid">
          <div class="dual-card glass-panel">
            <div class="dual-icon">✨</div>
            <h3>Facial Skin Analysis</h3>
            <p>Assesses 7 visible dimensions: skin appearance, micro-relief texture, hydration sheen, vascular redness, dark spots, under-eye contours, and pore visibility.</p>
            <button type="button" class="btn btn-primary" id="btnLaunchSkinScan">Start Facial Skin Scan</button>
          </div>

          <div class="dual-card glass-panel natural-border">
            <div class="dual-icon">💇‍♀️</div>
            <h3>Hair Analysis by Questionnaire</h3>
            <p>Answer 8 quick questions on your hair pattern, strand thickness, density, porosity, and scalp balance to receive a 100% natural botanical routine (Amla, Rosemary, Argan, Rice Water).</p>
            <button type="button" class="btn btn-primary" id="btnLaunchHairQuiz">Take Hair Questionnaire</button>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="how-it-works-section">
        <div class="section-heading text-center">
          <div class="bio-badge">STEP-BY-STEP PROCESS</div>
          <h2>How It Works</h2>
          <p>Four effortless steps to a customized, 100% botanical skincare and hair care routine.</p>
        </div>

        <div class="steps-grid">
          <div class="step-card glass-panel">
            <div class="step-number-circle">1</div>
            <div class="step-icon-box">📸</div>
            <h3>Upload or Answer Quiz</h3>
            <p>Upload a photo or complete the 8-step hair questionnaire.</p>
          </div>

          <div class="step-card glass-panel">
            <div class="step-number-circle">2</div>
            <div class="step-icon-box">🌿</div>
            <h3>Match Natural Actives</h3>
            <p>Evaluates characteristics against pure botanical ingredients in our database.</p>
          </div>

          <div class="step-card glass-panel">
            <div class="step-number-circle">3</div>
            <div class="step-icon-box">📊</div>
            <h3>Get Your Bio Profile</h3>
            <p>Receive your personalized profile with AI estimates and explanations.</p>
          </div>

          <div class="step-card glass-panel">
            <div class="step-number-circle">4</div>
            <div class="step-icon-box">🧴</div>
            <h3>Build Natural Rituals</h3>
            <p>Follow tailored pre-wash, wash day, and daily leave-in routines.</p>
          </div>
        </div>
      </section>

      <!-- Safety Banner -->
      <section class="home-safety-section">
        <div class="safety-advisory-banner glass-panel">
          <svg class="advisory-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
          <div class="advisory-text">
            <strong>Important Safety & Non-Medical Clarification:</strong>
            Bio Beauty Nexus is formulated strictly for cosmetic aesthetic observations and beauty routine planning. The platform does NOT diagnose diseases, assess medical conditions, or recommend prescription medications. Always consult a board-certified dermatologist for medical skin concerns.
          </div>
        </div>
      </section>
    `;

    homeSection.querySelector('#btnStartScanHero').addEventListener('click', () => {
      this.scanType = 'skin';
      this.scanPhase = 'upload';
      this.navigateTo('scan');
    });

    homeSection.querySelector('#btnLaunchHairQuizHero').addEventListener('click', () => {
      this.navigateTo('hair_quiz');
    });

    homeSection.querySelector('#btnLaunchSkinScan').addEventListener('click', () => {
      this.scanType = 'skin';
      this.scanPhase = 'upload';
      this.navigateTo('scan');
    });

    homeSection.querySelector('#btnLaunchHairQuiz').addEventListener('click', () => {
      this.navigateTo('hair_quiz');
    });

    container.appendChild(homeSection);
  }

  renderScanSection(container) {
    container.innerHTML = '';
    const scanWrapper = document.createElement('div');
    scanWrapper.className = 'scan-page-wrapper';

    if (this.scanPhase === 'upload') {
      const uploadComp = new ImageUpload({
        initialMode: this.scanType,
        onOpenHairQuiz: () => {
          this.navigateTo('hair_quiz');
        },
        onImageSelected: (imageState) => {
          this.selectedImage = imageState;
          this.scanType = imageState.scanType || this.scanType;
          this.scanPhase = 'preview';
          this.renderScanSection(container);
        },
        onError: (err) => {
          this.scanErrorMessage = err;
          this.scanPhase = 'error';
          this.renderScanSection(container);
        }
      });
      scanWrapper.appendChild(uploadComp.render());
    } else if (this.scanPhase === 'preview') {
      const previewComp = new ImagePreview({
        imageState: this.selectedImage,
        onAnalyze: () => {
          this.startAnalysis(container);
        },
        onRetake: () => {
          this.selectedImage = null;
          this.scanPhase = 'upload';
          this.renderScanSection(container);
        }
      });
      scanWrapper.appendChild(previewComp.render());
    } else if (this.scanPhase === 'scanning') {
      const analysisComp = new BeautyAnalysis({
        imageState: this.selectedImage
      });
      scanWrapper.appendChild(analysisComp.render());
    } else if (this.scanPhase === 'error') {
      scanWrapper.innerHTML = `
        <div class="error-card glass-panel fade-in">
          <div class="error-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div class="bio-badge text-attention">IMAGE QUALITY REJECTED</div>
          <h2 class="error-title">Image Quality Too Low for Accurate Analysis</h2>
          <p class="error-msg">
            ${this.scanErrorMessage || 'The image appears blurred, underexposed, or does not clearly show features. Please upload a clear photo taken in natural ambient light.'}
          </p>
          <div class="error-tips">
            <strong>Alternative:</strong> You can skip the photo and take our comprehensive <strong>Hair & Scalp Questionnaire</strong> instead!
          </div>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button type="button" class="btn btn-primary" id="btnTryHairQuizError">
              Take Hair Questionnaire
            </button>
            <button type="button" class="btn btn-secondary" id="btnTryAgain">
              Try Another Photo
            </button>
          </div>
        </div>
      `;
      scanWrapper.querySelector('#btnTryHairQuizError').addEventListener('click', () => {
        this.navigateTo('hair_quiz');
      });
      scanWrapper.querySelector('#btnTryAgain').addEventListener('click', () => {
        this.scanErrorMessage = null;
        this.scanPhase = 'upload';
        this.renderScanSection(container);
      });
    }

    container.appendChild(scanWrapper);
  }

  renderHairQuiz(container) {
    const quizComp = new HairQuestionnaire({
      onAnalysisComplete: (result) => {
        this.currentHairAnalysis = result;
        this.navigateTo('hair_results');
      }
    });
    container.appendChild(quizComp.render());
  }

  async startAnalysis(container) {
    this.scanPhase = 'scanning';
    this.renderScanSection(container);

    const minAnimTime = new Promise(resolve => setTimeout(resolve, 2200));

    try {
      const isHair = this.scanType === 'hair';
      let result;

      if (isHair) {
        const [hairRes] = await Promise.all([
          API.analyzeHairImage(this.selectedImage.imageData, this.userProfile, this.selectedImage.presetMode),
          minAnimTime
        ]);
        result = hairRes;
      } else {
        const [skinRes] = await Promise.all([
          API.analyzeBeautyImage(this.selectedImage.imageData, this.userProfile, this.selectedImage.presetMode),
          minAnimTime
        ]);
        result = skinRes;
      }

      if (result && result.success) {
        this.scanPhase = 'upload';
        if (isHair) {
          this.currentHairAnalysis = result;
          this.navigateTo('hair_results');
        } else {
          this.currentAnalysis = result;
          this.navigateTo('results');
        }
      } else {
        this.scanErrorMessage = result?.message || 'The uploaded photo was blurred or low-clarity. Please upload a clear photo.';
        this.scanPhase = 'error';
        this.renderScanSection(container);
      }
    } catch (err) {
      console.error('Scan error:', err);
      this.scanErrorMessage = 'An error occurred during analysis. Please try again.';
      this.scanPhase = 'error';
      this.renderScanSection(container);
    }
  }

  renderResults(container) {
    if (!this.currentAnalysis) {
      container.innerHTML = `
        <div class="empty-state-card glass-panel fade-in">
          <div class="empty-icon">🧬</div>
          <h2>No Skin Analysis Performed Yet</h2>
          <p>Please complete an AI Facial Beauty Scan to generate your personalized Bio Beauty Profile.</p>
          <button type="button" class="btn btn-primary" id="btnGoToScanEmpty">
            Start Facial Beauty Scan
          </button>
        </div>
      `;
      container.querySelector('#btnGoToScanEmpty').addEventListener('click', () => {
        this.scanType = 'skin';
        this.scanPhase = 'upload';
        this.navigateTo('scan');
      });
      return;
    }

    const resultsComp = new AnalysisResults({
      analysisData: this.currentAnalysis,
      onRetake: () => {
        this.scanType = 'skin';
        this.scanPhase = 'upload';
        this.navigateTo('scan');
      },
      onAskAssistant: () => {
        this.navigateTo('assistant');
      },
      onViewRecommendations: () => {
        this.navigateTo('routine');
      },
      onViewDietaryPlan: () => {
        this.navigateTo('diet');
      }
    });

    container.appendChild(resultsComp.render());
  }

  renderHairResults(container) {
    if (!this.currentHairAnalysis) {
      container.innerHTML = `
        <div class="empty-state-card glass-panel fade-in">
          <div class="empty-icon">💇‍♀️</div>
          <h2>No Hair Analysis Performed Yet</h2>
          <p>Answer our 8-step Hair Questionnaire or upload a hair/scalp photo to generate your personalized Bio Hair Profile and 100% natural botanical routine.</p>
          <div style="display: flex; gap: 12px; justify-content: center; margin-top: 16px;">
            <button type="button" class="btn btn-primary" id="btnGoToHairQuizEmpty">
              Take Hair Questionnaire
            </button>
            <button type="button" class="btn btn-secondary" id="btnGoToHairScanEmpty">
              Camera Hair Scan
            </button>
          </div>
        </div>
      `;
      container.querySelector('#btnGoToHairQuizEmpty').addEventListener('click', () => {
        this.navigateTo('hair_quiz');
      });
      container.querySelector('#btnGoToHairScanEmpty').addEventListener('click', () => {
        this.scanType = 'hair';
        this.scanPhase = 'upload';
        this.navigateTo('scan');
      });
      return;
    }

    const hairComp = new HairAnalysisResults({
      hairData: this.currentHairAnalysis,
      onOpenQuestionnaire: () => {
        this.navigateTo('hair_quiz');
      },
      onRetake: () => {
        this.scanType = 'hair';
        this.scanPhase = 'upload';
        this.navigateTo('scan');
      },
      onAskAssistant: () => {
        this.navigateTo('assistant');
      },
      onViewRoutine: () => {
        this.navigateTo('routine');
      },
      onViewDietaryPlan: () => {
        this.navigateTo('diet');
      }
    });

    container.appendChild(hairComp.render());
  }

  renderRoutine(container) {
    if (!this.currentAnalysis) {
      container.innerHTML = `
        <div class="empty-state-card glass-panel fade-in">
          <div class="empty-icon">🧴</div>
          <h2>Routine Generator Ready</h2>
          <p>Complete an AI Beauty Scan or explore our proposed whole-food beauty routines and products.</p>
          <div style="display: flex; gap: 12px; justify-content: center; margin-top: 16px;">
            <button type="button" class="btn btn-primary" id="btnGoScanForRoutine">
              Start AI Beauty Scan
            </button>
            <button type="button" class="btn btn-secondary" id="btnGoDietFromLockedRoutine">
              🥗 View Dietary Nutrition Plan
            </button>
          </div>
        </div>
      `;
      container.querySelector('#btnGoScanForRoutine').addEventListener('click', () => {
        this.scanType = 'skin';
        this.scanPhase = 'upload';
        this.navigateTo('scan');
      });
      container.querySelector('#btnGoDietFromLockedRoutine').addEventListener('click', () => {
        this.navigateTo('diet');
      });
      return;
    }

    const recComp = new RecommendationEngine({
      recommendations: this.currentAnalysis.recommendations,
      questionnaire: this.userProfile,
      onAskAboutRoutine: () => {
        this.navigateTo('assistant');
      },
      onViewDietaryPlan: () => {
        this.navigateTo('diet');
      }
    });

    container.appendChild(recComp.render());
  }

  renderDietaryPlan(container) {
    const activePlan = this.currentAnalysis?.recommendations?.dietaryPlan 
      || this.currentHairAnalysis?.recommendations?.dietaryPlan 
      || null;

    const dietComp = new DietaryPlanView({
      contextPlan: activePlan,
      activePlanId: activePlan?.id || null,
      onAskAssistant: () => {
        this.navigateTo('assistant');
      }
    });

    dietComp.render().then(elem => {
      container.appendChild(elem);
    });
  }

  renderAssistant(container) {
    const assistantComp = new BeautyAssistant({
      getCurrentAnalysis: () => this.currentAnalysis || this.currentHairAnalysis
    });
    container.appendChild(assistantComp.render());
  }

  renderTimeline(container) {
    const timelineComp = new AnalysisTimeline({
      onSelectScan: () => {}
    });
    timelineComp.render().then(elem => {
      container.appendChild(elem);
    });
  }

  renderQuestionnaire(container) {
    const profileComp = new UserBeautyProfile({
      onProfileUpdated: (updatedProfile) => {
        this.userProfile = updatedProfile;
      }
    });
    container.appendChild(profileComp.render());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.bioBeautyApp = new BioBeautyNexusApp();
});
