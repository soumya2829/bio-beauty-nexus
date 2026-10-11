export class RecommendationEngine {
  constructor({ recommendations, questionnaire, onAskAboutRoutine, onViewDietaryPlan }) {
    this.recommendations = recommendations;
    this.questionnaire = questionnaire;
    this.onAskAboutRoutine = onAskAboutRoutine;
    this.onViewDietaryPlan = onViewDietaryPlan;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'recommendations-container fade-in';

    const {
      summary,
      routineName,
      routineFocus,
      morningRoutine = [],
      eveningRoutine = [],
      weeklyRoutine = [],
      proposedProducts = [],
      dietaryPlan = null,
      ingredientSuggestions = [],
      productCategories = []
    } = this.recommendations;

    // Build Morning Steps HTML
    const morningStepsHtml = morningRoutine.map(step => `
      <div class="routine-step-card glass-panel">
        <div class="step-badge">STEP ${step.step}</div>
        <div class="step-info">
          <div class="step-category-row">
            <span class="step-category-pill">${step.category}</span>
            ${step.price ? `<span class="step-price-tag">${step.price} • ${step.brand || 'Nexus Naturals'}</span>` : ''}
          </div>
          <h4 class="step-product-name">${step.name}</h4>
          <p class="step-instruction">${step.instruction}</p>
          ${step.keyIngredients && step.keyIngredients.length > 0 ? `
            <div class="step-actives-pill">Actives: ${step.keyIngredients.join(' • ')}</div>
          ` : ''}
        </div>
      </div>
    `).join('');

    // Build Evening Steps HTML
    const eveningStepsHtml = eveningRoutine.map(step => `
      <div class="routine-step-card glass-panel">
        <div class="step-badge evening">STEP ${step.step}</div>
        <div class="step-info">
          <div class="step-category-row">
            <span class="step-category-pill evening">${step.category}</span>
            ${step.price ? `<span class="step-price-tag">${step.price} • ${step.brand || 'Nexus Naturals'}</span>` : ''}
          </div>
          <h4 class="step-product-name">${step.name}</h4>
          <p class="step-instruction">${step.instruction}</p>
          ${step.keyIngredients && step.keyIngredients.length > 0 ? `
            <div class="step-actives-pill">Actives: ${step.keyIngredients.join(' • ')}</div>
          ` : ''}
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

    // Build Proposed Products Catalog HTML
    const proposedProductsHtml = proposedProducts.map(p => `
      <div class="proposed-prod-card glass-panel">
        <div class="prod-badge-row">
          <span class="bio-badge prod-brand-badge">${p.brand || 'Nexus Naturals'}</span>
          <span class="prod-price-tag">${p.price || '$36'}</span>
        </div>
        <h4 class="prod-title">${p.name}</h4>
        <span class="prod-cat">${p.category}</span>
        <div class="prod-ingredients-list">
          <strong>Key Actives:</strong> ${(p.keyIngredients || []).join(' • ')}
        </div>
        <p class="prod-usage"><strong>How to Use:</strong> ${p.howToUse}</p>
        <div class="prod-fit-tag">✓ Formulated for: ${p.skinFit}</div>
      </div>
    `).join('');

    // Build Dietary Plan Preview Card HTML
    const dietarySectionHtml = dietaryPlan ? `
      <div class="rec-dietary-card glass-panel">
        <div class="dietary-card-header">
          <div class="bio-badge text-glow">${dietaryPlan.badge || '100% WHOLE-FOOD NUTRITION'}</div>
          <span class="dietary-active-pill">MATCHED CELLULAR DIET</span>
        </div>
        <h3 class="dietary-card-title">${dietaryPlan.title}</h3>
        <p class="dietary-card-sub">${dietaryPlan.subtitle}</p>
        <p class="dietary-card-summary">${dietaryPlan.summary}</p>
        
        <div class="dietary-highlights-grid">
          <div class="dietary-hl-col">
            <span class="hl-title">⏰ Daily Chronobiological Meals:</span>
            <div class="hl-meals-list">
              ${(dietaryPlan.dailyMeals || []).slice(0, 3).map(m => `
                <div class="hl-meal-item">
                  <span class="hl-time">${m.time}</span>
                  <span class="hl-name">${m.icon} ${m.title}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="dietary-hl-col">
            <span class="hl-title">🥑 Recommended Beauty Superfoods:</span>
            <div class="hl-sf-chips">
              ${(dietaryPlan.superfoods || []).slice(0, 4).map(sf => `
                <span class="hl-sf-chip"><strong>${sf.name.split('(')[0].trim()}</strong> (${sf.dose})</span>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="dietary-cta-row">
          <button type="button" class="btn btn-primary" id="btnOpenDietaryFromRoutine">
            🥗 View Full 5-Phase Dietary Protocol & Meal Plan
          </button>
        </div>
      </div>
    ` : '';

    // Build Ingredient Suggestions HTML
    const ingredientsHtml = ingredientSuggestions.map(ing => `
      <div class="ingredient-card glass-panel">
        <div class="ing-header">
          <span class="ing-icon">🌿</span>
          <div>
            <h4 class="ing-name">${ing.name}</h4>
            <span class="ing-role">${ing.role}</span>
          </div>
        </div>
        <p class="ing-why">${ing.why}</p>
        <span class="ing-safe-tag">100% Pure Botanical Active</span>
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
          ${routineName ? routineName.toUpperCase() : 'PERSONALIZED BIO BEAUTY PROTOCOL'}
        </div>
        <h2 class="rec-title">Your Tailored Beauty Care Routine</h2>
        <p class="rec-summary-lead">${summary}</p>
        
        <div class="user-factors-pills">
          <span class="factor-tag">Skin Type: <strong>${this.questionnaire?.skinType || 'Combination'}</strong></span>
          <span class="factor-tag">Target: <strong>${routineFocus || this.questionnaire?.mainConcern || 'Radiance & Barrier'}</strong></span>
          <span class="factor-tag">Formulations: <strong>Database Proposed Products</strong></span>
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
              <p>Hydration, antioxidant shield, and mineral UV defense</p>
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
              <p>Purification, barrier restoration, and lipid seal</p>
            </div>
          </div>
          <div class="routine-steps-list">
            ${eveningStepsHtml}
          </div>
        </div>
      </div>

      <!-- Dietary Plan Feature Card -->
      ${dietarySectionHtml}

      <!-- Proposed Database Products Section -->
      ${proposedProducts.length > 0 ? `
        <div class="rec-section-box">
          <div class="rec-section-header">
            <div class="bio-badge">NEXUS NATURALS DATABASE</div>
            <h3>Proposed Formulations From Our Database</h3>
            <span>Targeted non-comedogenic botanical formulas matched to your profile</span>
          </div>
          <div class="proposed-products-grid">
            ${proposedProductsHtml}
          </div>
        </div>
      ` : ''}

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
          <h3>Key Botanical Active Ingredients</h3>
          <span>100% natural bio-actives selected to harmonize your visible skin profile</span>
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
          <h4>Have questions about your custom routine or nutrition?</h4>
          <p>Ask our AI Beauty Assistant how to layer products, understand ingredients, or time meals.</p>
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

    const btnDiet = container.querySelector('#btnOpenDietaryFromRoutine');
    if (btnDiet) {
      btnDiet.addEventListener('click', () => {
        if (this.onViewDietaryPlan) this.onViewDietaryPlan();
      });
    }

    container.querySelector('#btnAskAboutRoutine').addEventListener('click', () => {
      if (this.onAskAboutRoutine) this.onAskAboutRoutine();
    });

    return container;
  }
}
