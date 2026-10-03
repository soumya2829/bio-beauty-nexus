export class RecommendationEngine {
  constructor({ recommendations, questionnaire, onAskAboutRoutine }) {
    this.recommendations = recommendations;
    this.questionnaire = questionnaire;
    this.onAskAboutRoutine = onAskAboutRoutine;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'recommendations-container fade-in';

    const {
      summary,
      morningRoutine = [],
      eveningRoutine = [],
      weeklyRoutine = [],
      ingredientSuggestions = [],
      productCategories = []
    } = this.recommendations;

    // Build Morning Steps HTML
    const morningStepsHtml = morningRoutine.map(step => `
      <div class="routine-step-card glass-panel">
        <div class="step-badge">STEP ${step.step}</div>
        <div class="step-info">
          <div class="step-category-pill">${step.category}</div>
          <h4 class="step-product-name">${step.name}</h4>
          <p class="step-instruction">${step.instruction}</p>
        </div>
      </div>
    `).join('');

    // Build Evening Steps HTML
    const eveningStepsHtml = eveningRoutine.map(step => `
      <div class="routine-step-card glass-panel">
        <div class="step-badge evening">STEP ${step.step}</div>
        <div class="step-info">
          <div class="step-category-pill evening">${step.category}</div>
          <h4 class="step-product-name">${step.name}</h4>
          <p class="step-instruction">${step.instruction}</p>
        </div>
      </div>
    `).join('');

    // Build Weekly Treatments HTML
    const weeklyHtml = weeklyRoutine.map(item => `
      <div class="weekly-item-card glass-panel">
        <div class="weekly-freq-badge">${item.frequency}</div>
        <h4 class="weekly-title">${item.title}</h4>
        <p class="weekly-desc">${item.description}</p>
      </div>
    `).join('');

    // Build Ingredient Suggestions HTML
    const ingredientsHtml = ingredientSuggestions.map(ing => `
      <div class="ingredient-card glass-panel">
        <div class="ing-header">
          <span class="ing-icon">🧪</span>
          <div>
            <h4 class="ing-name">${ing.name}</h4>
            <span class="ing-role">${ing.role}</span>
          </div>
        </div>
        <p class="ing-why">${ing.why}</p>
        <span class="ing-safe-tag">Non-Prescription Cosmetic Active</span>
      </div>
    `).join('');

    // Build Product Categories HTML
    const categoriesHtml = productCategories.map(cat => `
      <div class="prod-cat-pill">
        <strong>${cat.category}</strong>
        <span>${cat.focus}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <!-- Header Banner -->
      <div class="rec-header glass-panel">
        <div class="bio-badge">
          <span class="pulse-dot"></span>
          PERSONALIZED PROTOCOL
        </div>
        <h2 class="rec-title">Your Tailored Beauty Care Routine</h2>
        <p class="rec-summary-lead">${summary}</p>
        
        <div class="user-factors-pills">
          <span class="factor-tag">Skin Type: <strong>${this.questionnaire?.skinType || 'Combination'}</strong></span>
          <span class="factor-tag">Goal: <strong>${this.questionnaire?.mainConcern || 'Radiance & Barrier'}</strong></span>
          <span class="factor-tag">Sensitivity: <strong>${this.questionnaire?.sensitivity || 'Mild'}</strong></span>
        </div>
      </div>

      <!-- Routines Grid: Morning & Evening -->
      <div class="routines-grid">
        <!-- Morning Column -->
        <div class="routine-col">
          <div class="routine-col-header">
            <span class="col-icon">☀️</span>
            <div>
              <h3>Morning Defense Routine</h3>
              <p>Hydration, antioxidant shield, and UV defense</p>
            </div>
          </div>
          <div class="routine-steps-list">
            ${morningStepsHtml}
          </div>
        </div>

        <!-- Evening Column -->
        <div class="routine-col">
          <div class="routine-col-header">
            <span class="col-icon">🌙</span>
            <div>
              <h3>Evening Recovery Routine</h3>
              <p>Purification, barrier restoration, and nourishment</p>
            </div>
          </div>
          <div class="routine-steps-list">
            ${eveningStepsHtml}
          </div>
        </div>
      </div>

      <!-- Weekly Rhythm Section -->
      <div class="rec-section-box">
        <div class="rec-section-header">
          <h3>Weekly Beauty Rhythm</h3>
          <span>Targeted replenishment 1-2 times per week</span>
        </div>
        <div class="weekly-cards-grid">
          ${weeklyHtml}
        </div>
      </div>

      <!-- Star Cosmetic Ingredients -->
      <div class="rec-section-box">
        <div class="rec-section-header">
          <h3>Key Cosmetic Active Ingredients</h3>
          <span>Ingredients selected to harmonize your visible skin profile</span>
        </div>
        <div class="ingredients-cards-grid">
          ${ingredientsHtml}
        </div>
      </div>

      <!-- Recommended Product Formats -->
      <div class="rec-section-box">
        <div class="rec-section-header">
          <h3>Target Product Categories</h3>
          <span>Essential formula types to look for in your beauty cabinet</span>
        </div>
        <div class="prod-cat-grid">
          ${categoriesHtml}
        </div>
      </div>

      <!-- Assistant CTA Box -->
      <div class="rec-assistant-cta glass-panel">
        <div>
          <h4>Have questions about your custom routine?</h4>
          <p>Ask our AI Beauty Assistant how to layer these ingredients or adjust for morning vs night.</p>
        </div>
        <button type="button" class="btn btn-primary" id="btnAskAboutRoutine">
          Chat With Beauty Assistant
        </button>
      </div>

      <!-- Safety Disclaimer -->
      <div class="safety-advisory-banner">
        <svg class="advisory-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <div class="advisory-text">
          <strong>Cosmetic Safety Guideline:</strong> We do not recommend prescription medications or claim to treat, cure, or diagnose medical dermatological diseases. If you experience persistent irritation or allergic reactions, discontinue use and consult a physician.
        </div>
      </div>
    `;

    container.querySelector('#btnAskAboutRoutine').addEventListener('click', () => {
      if (this.onAskAboutRoutine) this.onAskAboutRoutine();
    });

    return container;
  }
}
