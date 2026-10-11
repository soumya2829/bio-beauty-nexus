export class AnalysisResults {
  constructor({ analysisData, onRetake, onAskAssistant, onViewRecommendations, onViewDietaryPlan }) {
    this.analysisData = analysisData;
    this.onRetake = onRetake;
    this.onAskAssistant = onAskAssistant;
    this.onViewRecommendations = onViewRecommendations;
    this.onViewDietaryPlan = onViewDietaryPlan;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'results-container fade-in';

    const {
      overallScore,
      categories,
      faceShape,
      hairAppearance,
      primaryCharacteristic,
      disclaimer,
      timestamp
    } = this.analysisData;

    const formattedDate = new Date(timestamp || Date.now()).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    // Circular Gauge calculation (circumference = 2 * PI * 42 = ~264)
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (overallScore / 100) * circumference;

    let categoryCardsHtml = categories.map(cat => {
      const catCircumference = 2 * Math.PI * 24;
      const catOffset = catCircumference - (cat.score / 100) * catCircumference;
      
      // Determine badge color tone
      let statusClass = 'status-optimal';
      if (cat.score < 65) statusClass = 'status-attention';
      else if (cat.score < 80) statusClass = 'status-moderate';

      return `
        <div class="category-card glass-panel">
          <div class="category-top">
            <div class="cat-meta">
              <span class="cat-pill ${statusClass}">${cat.title}</span>
              <span class="cat-confidence">${cat.confidence}</span>
            </div>
            
            <!-- Circular Indicator -->
            <div class="cat-circle-indicator" title="AI Estimate: ${cat.score}/100">
              <svg viewBox="0 0 60 60" class="gauge-svg">
                <circle class="gauge-bg" cx="30" cy="30" r="24"></circle>
                <circle class="gauge-bar" cx="30" cy="30" r="24"
                        style="stroke-dasharray: ${catCircumference}; stroke-dashoffset: ${catOffset};"></circle>
              </svg>
              <span class="gauge-text">${cat.score}</span>
            </div>
          </div>

          <div class="category-body">
            <div class="cat-observation-block">
              <span class="block-title">Cosmetic Observation</span>
              <p class="observation-text">${cat.observation}</p>
            </div>

            <div class="cat-explanation-block">
              <span class="block-title">Simple Explanation</span>
              <p class="explanation-text">${cat.simpleExplanation}</p>
            </div>

            <div class="cat-approach-block">
              <span class="block-title">Suggested Beauty-Care Approach</span>
              <p class="approach-text">${cat.suggestedApproach}</p>
            </div>

            <!-- Linear indicator bar labeled as AI estimate -->
            <div class="cat-linear-track">
              <div class="cat-linear-fill" style="width: ${cat.score}%;"></div>
            </div>
            <div class="cat-linear-label">
              <span>Scale: Subtle ↔ Prominent</span>
              <span>${cat.score}% (Cosmetic AI Estimate)</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <!-- Top Title Header -->
      <div class="results-header glass-panel">
        <div class="results-header-left">
          <div class="bio-badge">
            <span class="pulse-dot"></span>
            BIO BEAUTY PROFILE • GENERATED ${formattedDate}
          </div>
          <h1 class="results-main-title">Your Bio Beauty Profile</h1>
          <p class="results-lead-desc">
            ${primaryCharacteristic}. Below are your non-medical cosmetic observations calibrated by our multi-dimensional AI scanner.
          </p>
          
          <div class="facial-attributes-row">
            <div class="attribute-pill">
              <span class="attr-icon">👤</span>
              <span class="attr-label">Face Shape:</span>
              <strong>${faceShape || 'Oval'}</strong>
            </div>
            <div class="attribute-pill">
              <span class="attr-icon">✨</span>
              <span class="attr-label">Hair Appearance:</span>
              <strong>${hairAppearance || 'Visible Conditioned Hair'}</strong>
            </div>
          </div>
        </div>

        <!-- Overall Score Card -->
        <div class="overall-score-card">
          <div class="overall-gauge-wrapper">
            <svg viewBox="0 0 100 100" class="overall-gauge-svg">
              <circle class="overall-gauge-bg" cx="50" cy="50" r="${radius}"></circle>
              <circle class="overall-gauge-fill" cx="50" cy="50" r="${radius}"
                      style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${strokeDashoffset};"></circle>
            </svg>
            <div class="overall-gauge-content">
              <span class="overall-number">${overallScore}</span>
              <span class="overall-subtext">Cosmetic Score</span>
            </div>
          </div>
          <span class="overall-disclaimer-tag">AI Non-Medical Estimate</span>
        </div>
      </div>

      <!-- Action Navigation Toolbar -->
      <div class="results-action-bar">
        <button type="button" class="btn btn-primary" id="btnGoToRoutine">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          View Personalized Routine
        </button>

        <button type="button" class="btn btn-secondary" id="btnGoToDietary">
          <span class="mode-icon">🥗</span>
          Dietary Nutrition Plan
        </button>

        <button type="button" class="btn btn-secondary" id="btnAskAssistant">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Ask AI Beauty Assistant
        </button>

        <button type="button" class="btn btn-outline" id="btnScanAgain">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            <path d="m9 11 3 3L22 4"></path>
          </svg>
          New Scan
        </button>
      </div>

      <!-- Category Cards Grid -->
      <div class="results-section-title">
        <h2>Overall Beauty Profile Dimensions</h2>
        <span class="section-badge">7 Analyzed Parameters</span>
      </div>

      <div class="categories-grid">
        ${categoryCardsHtml}
      </div>

      <!-- Prominent Medical Disclaimer Banner -->
      <div class="safety-advisory-banner results-disclaimer">
        <svg class="advisory-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <div class="advisory-text">
          <strong>Important Safety & Non-Medical Notice:</strong>
          <p>${disclaimer}</p>
        </div>
      </div>
    `;

    container.querySelector('#btnGoToRoutine').addEventListener('click', () => {
      if (this.onViewRecommendations) this.onViewRecommendations();
    });

    const btnDietary = container.querySelector('#btnGoToDietary');
    if (btnDietary) {
      btnDietary.addEventListener('click', () => {
        if (this.onViewDietaryPlan) this.onViewDietaryPlan();
      });
    }

    container.querySelector('#btnAskAssistant').addEventListener('click', () => {
      if (this.onAskAssistant) this.onAskAssistant();
    });

    container.querySelector('#btnScanAgain').addEventListener('click', () => {
      if (this.onRetake) this.onRetake();
    });

    return container;
  }
}
