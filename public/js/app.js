import { ImageUpload } from './components/ImageUpload.js';
import { ImagePreview } from './components/ImagePreview.js';
import { BeautyAnalysis } from './components/BeautyAnalysis.js';
import { AnalysisResults } from './components/AnalysisResults.js';
import { HairAnalysisResults } from './components/HairAnalysisResults.js';
import { RecommendationEngine } from './components/RecommendationEngine.js';
import { BeautyAssistant } from './components/BeautyAssistant.js';
import { UserBeautyProfile } from './components/UserBeautyProfile.js';
import { AnalysisTimeline } from './components/AnalysisTimeline.js';
import { AuthModal } from './components/AuthModal.js';
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
        // If clicking on logout icon
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
      case 'results':
        this.renderResults(mainOutlet);
        break;
      case 'hair_results':
        this.renderHairResults(mainOutlet);
        break;
      case 'routine':
        this.renderRoutine(mainOutlet);
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
            NEXT-GEN BIOTECHNOLOGY BEAUTY
          </div>
          
          <h1 class="hero-title">
            See Your Beauty.<br />
            <span class="gradient-text">Understand Your Routine.</span>
          </h1>
          
          <p class="hero-subtitle">
            AI-powered beauty analysis and personalized skincare & hair insights. Decode visible cosmetic characteristics with non-medical precision and build your optimal daily rituals.
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
              Start Your AI Beauty Scan
            </button>

            <button type="button" class="btn btn-secondary" id="btnStartHairScanHero">
              <span class="mode-icon">💇‍♀️</span>
              Try AI Hair & Scalp Scan
            </button>
          </div>

          <!-- Trust Badges -->
          <div class="hero-features-list">
            <div class="feature-badge">
              <span class="badge-icon">✓</span>
              <span>100% Non-Medical Cosmetic Analysis</span>
            </div>
            <div class="feature-badge">
              <span class="badge-icon">✓</span>
              <span>Facial Skin & Hair Dual Pipeline</span>
            </div>
            <div class="feature-badge">
              <span class="badge-icon">✓</span>
              <span>Member Account & Saved Progress</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-scan-card glass-panel">
            <div class="hero-scanner-preview">
              <div class="scanner-sweep-line"></div>
              <div class="face-biometric-mesh"></div>
              <div class="hero-overlay-tag top">FACIAL COMPLEXION ANALYSIS</div>
              <div class="hero-overlay-tag bottom">AI ESTIMATE • 7 DIMENSIONS</div>
            </div>
            <div class="hero-scanner-footer">
              <div class="metric-quick-stat">
                <span class="stat-num">94%</span>
                <span class="stat-lbl">Optical Clarity</span>
              </div>
              <div class="metric-quick-stat">
                <span class="stat-num">0%</span>
                <span class="stat-lbl">Medical Claims</span>
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
          <div class="bio-badge">TWO SPECIALIZED OPTICAL PIPELINES</div>
          <h2>Comprehensive Bio-Cosmetic Diagnostics</h2>
          <p>Choose between full facial skin profiling or targeted hair and scalp analysis.</p>
        </div>

        <div class="dual-cards-grid">
          <div class="dual-card glass-panel">
            <div class="dual-icon">✨</div>
            <h3>Facial Skin Analysis</h3>
            <p>Assesses 7 visible dimensions: skin appearance, micro-relief texture, hydration sheen, vascular redness, dark spots, under-eye contours, and pore visibility.</p>
            <button type="button" class="btn btn-primary" id="btnLaunchSkinScan">Scan Facial Skin</button>
          </div>

          <div class="dual-card glass-panel">
            <div class="dual-icon">💇‍♀️</div>
            <h3>Hair & Scalp Analysis</h3>
            <p>Analyzes strand texture, curl/wave pattern classification, cuticle alignment, halo frizz, and visible scalp parting comfort without clinical claims.</p>
            <button type="button" class="btn btn-secondary" id="btnLaunchHairScan">Scan Hair & Scalp</button>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="how-it-works-section">
        <div class="section-heading text-center">
          <div class="bio-badge">STEP-BY-STEP PROCESS</div>
          <h2>How It Works</h2>
          <p>Four effortless steps from a simple selfie to a customized, bio-compatible beauty routine.</p>
        </div>

        <div class="steps-grid">
          <div class="step-card glass-panel">
            <div class="step-number-circle">1</div>
            <div class="step-icon-box">📸</div>
            <h3>Upload Your Photo</h3>
            <p>Take a well-lit photo with your camera or select one of our calibrated test presets.</p>
          </div>

          <div class="step-card glass-panel">
            <div class="step-number-circle">2</div>
            <div class="step-icon-box">⚡</div>
            <h3>AI Analyzes Visible Characteristics</h3>
            <p>Evaluates visible texture, hydration, redness, pores, or hair cuticle alignment.</p>
          </div>

          <div class="step-card glass-panel">
            <div class="step-number-circle">3</div>
            <div class="step-icon-box">📊</div>
            <h3>Get Your Bio Profile</h3>
            <p>Receive your personalized cosmetic profile with AI confidence estimates.</p>
          </div>

          <div class="step-card glass-panel">
            <div class="step-number-circle">4</div>
            <div class="step-icon-box">🌿</div>
            <h3>Build Your Rituals</h3>
            <p>Unlock morning, evening, weekly routines and targeted active ingredients.</p>
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

    homeSection.querySelector('#btnStartHairScanHero').addEventListener('click', () => {
      this.scanType = 'hair';
      this.scanPhase = 'upload';
      this.navigateTo('scan');
    });

    homeSection.querySelector('#btnLaunchSkinScan').addEventListener('click', () => {
      this.scanType = 'skin';
      this.scanPhase = 'upload';
      this.navigateTo('scan');
    });

    homeSection.querySelector('#btnLaunchHairScan').addEventListener('click', () => {
      this.scanType = 'hair';
      this.scanPhase = 'upload';
      this.navigateTo('scan');
    });

    container.appendChild(homeSection);
  }

  renderScanSection(container) {
    const scanWrapper = document.createElement('div');
    scanWrapper.className = 'scan-page-wrapper';

    if (this.scanPhase === 'upload') {
      const uploadComp = new ImageUpload({
        initialMode: this.scanType,
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
            <strong>Photo Quality Tips:</strong>
            <ul>
              <li>Face natural light directly without harsh shadows.</li>
              <li>Hold your camera steady at eye level.</li>
              <li>Wipe your camera lens to remove smudges.</li>
            </ul>
          </div>
          <button type="button" class="btn btn-primary" id="btnTryAgain">
            Try Again With Another Photo
          </button>
        </div>
      `;
      scanWrapper.querySelector('#btnTryAgain').addEventListener('click', () => {
        this.scanErrorMessage = null;
        this.scanPhase = 'upload';
        this.renderScanSection(container);
      });
    }

    container.appendChild(scanWrapper);
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
          <p>Capture or upload a hair/scalp photo to generate your personalized Bio Hair Profile and custom routine.</p>
          <button type="button" class="btn btn-primary" id="btnGoToHairScanEmpty">
            Start Hair & Scalp Scan
          </button>
        </div>
      `;
      container.querySelector('#btnGoToHairScanEmpty').addEventListener('click', () => {
        this.scanType = 'hair';
        this.scanPhase = 'upload';
        this.navigateTo('scan');
      });
      return;
    }

    const hairComp = new HairAnalysisResults({
      hairData: this.currentHairAnalysis,
      onRetake: () => {
        this.scanType = 'hair';
        this.scanPhase = 'upload';
        this.navigateTo('scan');
      },
      onAskAssistant: () => {
        this.navigateTo('assistant');
      },
      onViewRoutine: () => {
        // Scroll down in current view
      }
    });

    container.appendChild(hairComp.render());
  }

  renderRoutine(container) {
    if (!this.currentAnalysis) {
      container.innerHTML = `
        <div class="empty-state-card glass-panel fade-in">
          <div class="empty-icon">🧴</div>
          <h2>Routine Generator Locked</h2>
          <p>Your personalized routine is generated directly from your AI Beauty Scan and questionnaire preferences.</p>
          <button type="button" class="btn btn-primary" id="btnGoScanForRoutine">
            Start AI Beauty Scan
          </button>
        </div>
      `;
      container.querySelector('#btnGoScanForRoutine').addEventListener('click', () => {
        this.scanType = 'skin';
        this.scanPhase = 'upload';
        this.navigateTo('scan');
      });
      return;
    }

    const recComp = new RecommendationEngine({
      recommendations: this.currentAnalysis.recommendations,
      questionnaire: this.userProfile,
      onAskAboutRoutine: () => {
        this.navigateTo('assistant');
      }
    });

    container.appendChild(recComp.render());
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
