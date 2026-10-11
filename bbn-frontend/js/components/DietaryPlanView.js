import { API } from '../api.js';

export class DietaryPlanView {
  constructor({ activePlanId = null, contextPlan = null, onAskAssistant }) {
    this.activePlanId = activePlanId;
    this.contextPlan = contextPlan;
    this.onAskAssistant = onAskAssistant;
    this.plans = [];
    this.currentPlan = null;
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'dietary-page-wrapper fade-in';

    // Fetch all dietary plans from backend
    this.plans = await API.fetchDietaryPlans();

    // Determine current plan
    if (this.contextPlan) {
      this.currentPlan = this.contextPlan;
      this.activePlanId = this.contextPlan.id;
    } else if (this.activePlanId && this.plans.length > 0) {
      this.currentPlan = this.plans.find(p => p.id === this.activePlanId) || this.plans[0];
    } else if (this.plans.length > 0) {
      this.currentPlan = this.plans[0];
      this.activePlanId = this.currentPlan.id;
    }

    this.renderContent(container);
    return container;
  }

  renderContent(container) {
    if (!this.currentPlan) {
      container.innerHTML = `
        <div class="empty-state-card glass-panel fade-in">
          <div class="empty-icon">🥗</div>
          <h2>Dietary Protocol Loading...</h2>
          <p>Fetching personalized nutrition recommendations from our database.</p>
        </div>
      `;
      return;
    }

    const plan = this.currentPlan;
    const scores = plan.scores || {};

    // Plan selector tabs
    const tabsHtml = (this.plans || []).map(p => {
      const isActive = p.id === plan.id;
      let icon = '🥗';
      if (p.id.includes('barrier')) icon = '💧';
      else if (p.id.includes('hair')) icon = '💇‍♀️';
      else if (p.id.includes('antiinflammatory')) icon = '🌿';
      else if (p.id.includes('sebum')) icon = '🍃';
      else if (p.id.includes('collagen')) icon = '✨';

      return `
        <button type="button" class="diet-tab-btn ${isActive ? 'active' : ''}" data-diet-id="${p.id}">
          <span class="diet-tab-icon">${icon}</span>
          <span class="diet-tab-title">${p.title.split('Protocol')[0].trim()}</span>
        </button>
      `;
    }).join('');

    // Daily meals cards
    const mealsHtml = (plan.dailyMeals || []).map((m, idx) => `
      <div class="diet-meal-card glass-panel">
        <div class="meal-header">
          <div class="meal-meta">
            <span class="meal-phase-badge">${m.phase}</span>
            <span class="meal-time-tag">⏰ ${m.time}</span>
          </div>
          <div class="meal-icon-circle">${m.icon || '🥣'}</div>
        </div>
        <h4 class="meal-title">${m.title}</h4>
        <div class="meal-recipe-box">
          <span class="recipe-label">Whole-Food Recipe:</span>
          <p class="recipe-text">${m.recipe}</p>
        </div>
        <div class="meal-nutrients-row">
          <span class="nutrient-pill">🌱 <strong>Key Actives:</strong> ${m.nutrients}</span>
        </div>
        <div class="meal-benefit-box">
          <span class="benefit-label">Cellular Beauty Benefit:</span>
          <p class="benefit-text">${m.benefit}</p>
        </div>
      </div>
    `).join('');

    // Superfoods cards
    const superfoodsHtml = (plan.superfoods || []).map(sf => `
      <div class="superfood-card glass-panel">
        <div class="sf-top">
          <span class="sf-icon">🥑</span>
          <div>
            <div class="sf-origin-tag">${sf.origin}</div>
            <h4 class="sf-name">${sf.name}</h4>
            <span class="sf-role">${sf.role}</span>
          </div>
        </div>
        <div class="sf-dose">
          <strong>Daily Recommended Serving:</strong> ${sf.dose}
        </div>
        <p class="sf-why">${sf.why}</p>
      </div>
    `).join('');

    // Emphasize & Moderate foods
    const emphasizeHtml = (plan.foodsToEmphasize || []).map(f => `
      <li class="food-item emphasize">
        <span class="check-bullet">✓</span>
        <span>${f}</span>
      </li>
    `).join('');

    const moderateHtml = (plan.foodsToModerate || []).map(f => `
      <li class="food-item moderate">
        <span class="cross-bullet">✕</span>
        <span>${f}</span>
      </li>
    `).join('');

    // Herbal infusions
    const infusionsHtml = (plan.herbalInfusions || []).map(inf => `
      <div class="infusion-card glass-panel">
        <span class="infusion-icon">🍵</span>
        <div class="infusion-info">
          <h5 class="infusion-name">${inf.name}</h5>
          <p class="infusion-herbs"><strong>Botanicals:</strong> ${inf.herbs}</p>
          <span class="infusion-timing">Timing: ${inf.timing}</span>
        </div>
      </div>
    `).join('');

    // Recommended for pills
    const recPillsHtml = (plan.recommendedFor || []).map(r => `
      <span class="diet-rec-pill">🎯 ${r}</span>
    `).join('');

    container.innerHTML = `
      <!-- Main Title Header -->
      <div class="diet-hero-header glass-panel">
        <div class="diet-header-content">
          <div class="bio-badge">
            <span class="pulse-dot"></span>
            100% NATURAL WHOLE-FOOD BEAUTY NUTRITION
          </div>
          <h1 class="diet-main-title">Cellular Nutrition & Dietary Beauty Protocols</h1>
          <p class="diet-main-desc">
            Beauty begins in the gut and cellular matrix. Discover evidence-informed, whole-food nutritional regimens designed to replenish epidermal lipids, protect elastic collagen fibers, and stimulate hair follicles from within.
          </p>
        </div>
      </div>

      <!-- Protocol Selection Switcher -->
      <div class="diet-tabs-nav-wrapper glass-panel">
        <div class="diet-tabs-label">Select Calibrated Beauty Protocol:</div>
        <div class="diet-tabs-scroll">
          ${tabsHtml}
        </div>
      </div>

      <!-- Active Plan Overview Banner -->
      <div class="diet-overview-card glass-panel fade-in">
        <div class="diet-overview-top">
          <div class="diet-badge-group">
            <span class="bio-badge text-glow">${plan.badge}</span>
            <span class="diet-status-tag">ACTIVE DATABASE PROTOCOL</span>
          </div>
          <h2 class="active-plan-title">${plan.title}</h2>
          <p class="active-plan-subtitle">${plan.subtitle}</p>
          <p class="active-plan-summary">${plan.summary}</p>

          <div class="diet-recommended-row">
            <span class="rec-row-label">Optimal For Visible Characteristics:</span>
            <div class="diet-pills-wrap">
              ${recPillsHtml}
            </div>
          </div>
        </div>

        <!-- Biometric Cellular Scores -->
        <div class="diet-scores-grid">
          <div class="diet-score-pill">
            <div class="score-num">${scores.hydrationIndex || 95}%</div>
            <div class="score-label">Hydration Index</div>
            <div class="mini-bar"><div class="mini-fill" style="width: ${scores.hydrationIndex || 95}%;"></div></div>
          </div>
          <div class="diet-score-pill">
            <div class="score-num">${scores.collagenSynthesis || 92}%</div>
            <div class="score-label">Collagen Support</div>
            <div class="mini-bar"><div class="mini-fill" style="width: ${scores.collagenSynthesis || 92}%;"></div></div>
          </div>
          <div class="diet-score-pill">
            <div class="score-num">${scores.follicleStrength || 88}%</div>
            <div class="score-label">Follicle Biomass</div>
            <div class="mini-bar"><div class="mini-fill" style="width: ${scores.follicleStrength || 88}%;"></div></div>
          </div>
          <div class="diet-score-pill">
            <div class="score-num">${scores.antioxidantLoad || 96}%</div>
            <div class="score-label">Antioxidant Load</div>
            <div class="mini-bar"><div class="mini-fill" style="width: ${scores.antioxidantLoad || 96}%;"></div></div>
          </div>
          <div class="diet-score-pill">
            <div class="score-num">${scores.healthyLipids || 94}%</div>
            <div class="score-label">Essential Lipids</div>
            <div class="mini-bar"><div class="mini-fill" style="width: ${scores.healthyLipids || 94}%;"></div></div>
          </div>
        </div>
      </div>

      <!-- 5-Phase Daily Meal Timeline -->
      <div class="diet-section-wrapper">
        <div class="diet-section-heading">
          <span class="section-icon">🗓️</span>
          <div>
            <h3>5-Phase Daily Cellular Meal Schedule</h3>
            <p>Chronobiologically timed whole-food nutrition to optimize digestion, circulation, and nocturnal repair.</p>
          </div>
        </div>
        <div class="diet-meals-timeline">
          ${mealsHtml}
        </div>
      </div>

      <!-- Bioactive Superfoods Section -->
      <div class="diet-section-wrapper">
        <div class="diet-section-heading">
          <span class="section-icon">🥑</span>
          <div>
            <h3>Targeted Botanical Superfoods</h3>
            <p>Nutrient-dense whole-food actives calibrated to support your cosmetic goals.</p>
          </div>
        </div>
        <div class="superfoods-grid">
          ${superfoodsHtml}
        </div>
      </div>

      <!-- Emphasize vs Moderate Checklist -->
      <div class="diet-section-wrapper">
        <div class="diet-section-heading">
          <span class="section-icon">⚖️</span>
          <div>
            <h3>Dietary Balance & Food Guidelines</h3>
            <p>Whole foods to incorporate abundantly versus processed triggers to moderate.</p>
          </div>
        </div>
        <div class="guidelines-columns-grid">
          <div class="guideline-col glass-panel">
            <div class="col-head green-head">
              <span class="icon">🌿</span>
              <h4>Foods to Emphasize Abundantly</h4>
            </div>
            <ul class="foods-checklist">
              ${emphasizeHtml}
            </ul>
          </div>

          <div class="guideline-col glass-panel">
            <div class="col-head amber-head">
              <span class="icon">🚫</span>
              <h4>Foods & Triggers to Moderate</h4>
            </div>
            <ul class="foods-checklist">
              ${moderateHtml}
            </ul>
          </div>
        </div>
      </div>

      <!-- Botanical Herbal Infusions -->
      <div class="diet-section-wrapper">
        <div class="diet-section-heading">
          <span class="section-icon">🫖</span>
          <div>
            <h3>Botanical Teas & Therapeutic Infusions</h3>
            <p>Hydration tonics packed with polyphenols, carnosic acid, and plant catechins.</p>
          </div>
        </div>
        <div class="infusions-grid">
          ${infusionsHtml}
        </div>
      </div>

      <!-- Chat with Assistant Banner -->
      <div class="rec-assistant-cta glass-panel">
        <div>
          <h4>Have questions about your dietary plan?</h4>
          <p>Ask our AI Beauty Assistant how to substitute ingredients, time smoothies, or tailor for dietary restrictions.</p>
        </div>
        <button type="button" class="btn btn-primary" id="btnAskAboutDiet">
          Chat With Beauty Assistant
        </button>
      </div>

      <!-- Strict Non-Medical Advisory -->
      <div class="safety-advisory-banner">
        <svg class="advisory-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <div class="advisory-text">
          <strong>Important Non-Medical Nutrition Notice:</strong>
          Dietary suggestions are provided strictly for general cosmetic aesthetic wellness and natural grooming support. They do NOT constitute medical nutritional therapy, disease treatment, or clinical allergy diagnosis. Always consult a registered dietitian or licensed healthcare practitioner before making substantial changes to your diet, especially if you have underlying metabolic or digestive conditions.
        </div>
      </div>
    `;

    // Bind Tab click events
    container.querySelectorAll('.diet-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-diet-id');
        const selected = this.plans.find(p => p.id === targetId);
        if (selected) {
          this.currentPlan = selected;
          this.activePlanId = selected.id;
          this.renderContent(container);
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }
      });
    });

    const btnAsk = container.querySelector('#btnAskAboutDiet');
    if (btnAsk) {
      btnAsk.addEventListener('click', () => {
        if (this.onAskAssistant) this.onAskAssistant();
      });
    }
  }
}
