export class HairAnalysisResults {
  constructor({ hairData, onRetake, onAskAssistant, onViewRoutine }) {
    this.hairData = hairData;
    this.onRetake = onRetake;
    this.onAskAssistant = onAskAssistant;
    this.onViewRoutine = onViewRoutine;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'results-container fade-in';

    const {
      overallScore,
      hairTypeLabel,
      primaryCharacteristic,
      categories = [],
      recommendations,
      disclaimer,
      timestamp
    } = this.hairData;

    const formattedDate = new Date(timestamp || Date.now()).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (overallScore / 100) * circumference;

    const categoryCardsHtml = categories.map(cat => {
      const catCircumference = 2 * Math.PI * 24;
      const catOffset = catCircumference - (cat.score / 100) * catCircumference;

      return `
        <div class="category-card glass-panel">
          <div class="category-top">
            <div class="cat-meta">
              <span class="cat-pill">${cat.title}</span>
              <span class="cat-confidence">${cat.confidence}</span>
            </div>
            
            <div class="cat-circle-indicator">
              <svg viewBox="0 0 60 60" class="gauge-svg">
                <circle class="gauge-bg" cx="30" cy="30" r="24"></circle>
                <circle class="gauge-bar fill-hair" cx="30" cy="30" r="24"
                        style="stroke-dasharray: ${catCircumference}; stroke-dashoffset: ${catOffset};"></circle>
              </svg>
              <span class="gauge-text">${cat.score}</span>
            </div>
          </div>

          <div class="category-body">
            <div class="cat-observation-block">
              <span class="block-title">Cosmetic Hair Observation</span>
              <p class="observation-text">${cat.observation}</p>
            </div>

            <div class="cat-explanation-block">
              <span class="block-title">Explanation</span>
              <p class="explanation-text">${cat.simpleExplanation}</p>
            </div>

            <div class="cat-approach-block">
              <span class="block-title">Suggested Hair & Scalp Approach</span>
              <p class="approach-text text-hair">${cat.suggestedApproach}</p>
            </div>

            <div class="cat-linear-track">
              <div class="cat-linear-fill fill-hair-bar" style="width: ${cat.score}%;"></div>
            </div>
            <div class="cat-linear-label">
              <span>Observation Scale</span>
              <span>${cat.score}% (Cosmetic AI Estimate)</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Routine steps
    const washStepsHtml = (recommendations?.washDayRoutine || []).map(step => `
      <div class="routine-step-card glass-panel">
        <div class="step-badge evening">STEP ${step.step}</div>
        <div class="step-info">
          <div class="step-category-pill evening">${step.title}</div>
          <h4 class="step-product-name">${step.product}</h4>
          <p class="step-instruction">${step.instruction}</p>
        </div>
      </div>
    `).join('');

    const dailyStepsHtml = (recommendations?.dailyCareRoutine || []).map(step => `
      <div class="routine-step-card glass-panel">
        <div class="step-badge">STEP ${step.step}</div>
        <div class="step-info">
          <div class="step-category-pill">${step.title}</div>
          <h4 class="step-product-name">${step.product}</h4>
          <p class="step-instruction">${step.instruction}</p>
        </div>
      </div>
    `).join('');

    const ingredientsHtml = (recommendations?.ingredientSuggestions || []).map(ing => `
      <div class="ingredient-card glass-panel">
        <div class="ing-header">
          <span class="ing-icon">🌿</span>
          <div>
            <h4 class="ing-name">${ing.name}</h4>
            <span class="ing-role">${ing.role}</span>
          </div>
        </div>
        <p class="ing-why">${ing.why}</p>
        <span class="ing-safe-tag">Botanical Cosmetic Active</span>
      </div>
    `).join('');

    container.innerHTML = `
      <!-- Top Title Header -->
      <div class="results-header glass-panel">
        <div class="results-header-left">
          <div class="bio-badge">
            <span class="pulse-dot"></span>
            BIO HAIR PROFILE • GENERATED ${formattedDate}
          </div>
          <h1 class="results-main-title">Your Bio Hair & Scalp Profile</h1>
          <p class="results-lead-desc">
            ${primaryCharacteristic}. Below are your non-medical cosmetic strand and scalp observations.
          </p>
          
          <div class="facial-attributes-row">
            <div class="attribute-pill">
              <span class="attr-icon">💇‍♀️</span>
              <span class="attr-label">Pattern:</span>
              <strong>${hairTypeLabel || 'Type 2 Wavy'}</strong>
            </div>
            <div class="attribute-pill">
              <span class="attr-icon">✨</span>
              <span class="attr-label">Cuticle Focus:</span>
              <strong>Porosity & Shine Balance</strong>
            </div>
          </div>
        </div>

        <div class="overall-score-card">
          <div class="overall-gauge-wrapper">
            <svg viewBox="0 0 100 100" class="overall-gauge-svg">
              <circle class="overall-gauge-bg" cx="50" cy="50" r="${radius}"></circle>
              <circle class="overall-gauge-fill fill-hair" cx="50" cy="50" r="${radius}"
                      style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${strokeDashoffset};"></circle>
            </svg>
            <div class="overall-gauge-content">
              <span class="overall-number">${overallScore}</span>
              <span class="overall-subtext">Hair Score</span>
            </div>
          </div>
          <span class="overall-disclaimer-tag">AI Non-Medical Estimate</span>
        </div>
      </div>

      <!-- Action Navigation Toolbar -->
      <div class="results-action-bar">
        <button type="button" class="btn btn-secondary" id="btnAskAssistantHair">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Ask Hair Assistant
        </button>

        <button type="button" class="btn btn-outline" id="btnScanAgainHair">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            <path d="m9 11 3 3L22 4"></path>
          </svg>
          New Hair Scan
        </button>
      </div>

      <!-- Categories Grid -->
      <div class="results-section-title">
        <h2>Visible Hair & Scalp Dimensions</h2>
        <span class="section-badge">5 Analyzed Parameters</span>
      </div>

      <div class="categories-grid">
        ${categoryCardsHtml}
      </div>

      <!-- Tailored Hair Care Protocol -->
      <div class="results-section-title" style="margin-top: 24px;">
        <h2>Tailored Hair & Scalp Routine</h2>
        <span class="section-badge">Wash Day & Daily Care</span>
      </div>

      <div class="routines-grid">
        <div class="routine-col">
          <div class="routine-col-header">
            <span class="col-icon">🚿</span>
            <div>
              <h3>Wash Day Protocol</h3>
              <p>Scalp clarification & deep bond repair</p>
            </div>
          </div>
          <div class="routine-steps-list">
            ${washStepsHtml}
          </div>
        </div>

        <div class="routine-col">
          <div class="routine-col-header">
            <span class="col-icon">✨</span>
            <div>
              <h3>Daily Maintenance Ritual</h3>
              <p>Nightly scalp drops & cuticle shine sealant</p>
            </div>
          </div>
          <div class="routine-steps-list">
            ${dailyStepsHtml}
          </div>
        </div>
      </div>

      <!-- Star Hair Actives -->
      <div class="rec-section-box">
        <div class="rec-section-header">
          <h3>Key Hair & Scalp Botanical Actives</h3>
          <span>Ingredients selected for follicle vitality and cuticle smoothing</span>
        </div>
        <div class="ingredients-cards-grid">
          ${ingredientsHtml}
        </div>
      </div>

      <!-- Safety Disclaimer -->
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

    container.querySelector('#btnAskAssistantHair').addEventListener('click', () => {
      if (this.onAskAssistant) this.onAskAssistant();
    });

    container.querySelector('#btnScanAgainHair').addEventListener('click', () => {
      if (this.onRetake) this.onRetake();
    });

    return container;
  }
}
