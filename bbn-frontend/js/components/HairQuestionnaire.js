import { API } from '../api.js';

export class HairQuestionnaire {
  constructor({ onAnalysisComplete }) {
    this.onAnalysisComplete = onAnalysisComplete;
    this.formData = {
      hairPattern: 'Type 2 Wavy',
      strandThickness: 'Medium',
      hairDensity: 'Medium',
      scalpType: 'Balanced / Normal',
      porosity: 'Medium Porosity',
      primaryGoal: 'Frizz Control & Smooth Cuticles',
      chemicalProcessing: 'Virgin hair',
      washFrequency: '2-3 times per week'
    };
    this.isSubmitting = false;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'hair-quiz-container fade-in';
    container.innerHTML = `
      <div class="hair-quiz-card glass-panel">
        <div class="hair-quiz-header">
          <div class="bio-badge hair-badge">
            <span class="pulse-dot hair-pulse-dot"></span>
            100% NATURAL BOTANICAL DIAGNOSTIC
          </div>
          <h2 class="hair-quiz-title">Hair & Scalp Analysis Questionnaire</h2>
          <p class="hair-quiz-subtitle">
            Answer 8 quick questions about your natural strand pattern, scalp tendencies, and goals to unlock your tailored botanical hair care protocol and 100% natural active ingredients.
          </p>
        </div>

        <form id="hairQuizForm" class="hair-quiz-form">
          <!-- Q1: Hair Pattern -->
          <div class="quiz-question-block">
            <label class="question-label">
              <span class="question-num">1</span>
              What is your natural hair pattern?
            </label>
            <div class="quiz-options-grid">
              <label class="quiz-option-card">
                <input type="radio" name="hairPattern" value="Type 1 Straight" class="visually-hidden" />
                <div class="option-content">
                  <span class="opt-icon">〰️</span>
                  <strong>Type 1 Straight</strong>
                  <span>Pin-straight or gentle bend</span>
                </div>
              </label>

              <label class="quiz-option-card active">
                <input type="radio" name="hairPattern" value="Type 2 Wavy" checked class="visually-hidden" />
                <div class="option-content">
                  <span class="opt-icon">🌊</span>
                  <strong>Type 2 Wavy</strong>
                  <span>Loose S-waves to defined beach waves</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="hairPattern" value="Type 3 Curly" class="visually-hidden" />
                <div class="option-content">
                  <span class="opt-icon">🌀</span>
                  <strong>Type 3 Curly</strong>
                  <span>Springy ringlets to corkscrew spirals</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="hairPattern" value="Type 4 Coily" class="visually-hidden" />
                <div class="option-content">
                  <span class="opt-icon">➰</span>
                  <strong>Type 4 Coily</strong>
                  <span>Tight coils, zigzags, high shrinkage</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Q2: Strand Thickness -->
          <div class="quiz-question-block">
            <label class="question-label">
              <span class="question-num">2</span>
              What is your individual strand thickness?
            </label>
            <div class="quiz-options-grid three-col">
              <label class="quiz-option-card">
                <input type="radio" name="strandThickness" value="Fine" class="visually-hidden" />
                <div class="option-content">
                  <strong>Fine</strong>
                  <span>Barely felt between fingertips, easily weighed down</span>
                </div>
              </label>

              <label class="quiz-option-card active">
                <input type="radio" name="strandThickness" value="Medium" checked class="visually-hidden" />
                <div class="option-content">
                  <strong>Medium</strong>
                  <span>Standard strand feel, versatile and balanced</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="strandThickness" value="Coarse / Thick" class="visually-hidden" />
                <div class="option-content">
                  <strong>Coarse / Thick</strong>
                  <span>Robust, sturdy, wire-like resilience</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Q3: Hair Density -->
          <div class="quiz-question-block">
            <label class="question-label">
              <span class="question-num">3</span>
              How would you describe your overall hair density (volume at roots)?
            </label>
            <div class="quiz-options-grid three-col">
              <label class="quiz-option-card">
                <input type="radio" name="hairDensity" value="Low" class="visually-hidden" />
                <div class="option-content">
                  <strong>Low Density</strong>
                  <span>Scalp is easily visible at parting line</span>
                </div>
              </label>

              <label class="quiz-option-card active">
                <input type="radio" name="hairDensity" value="Medium" checked class="visually-hidden" />
                <div class="option-content">
                  <strong>Medium Density</strong>
                  <span>Moderate scalp coverage, balanced volume</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="hairDensity" value="High / Dense" class="visually-hidden" />
                <div class="option-content">
                  <strong>High / Dense</strong>
                  <span>Very thick ponytail, scalp scarcely visible</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Q4: Scalp Condition -->
          <div class="quiz-question-block">
            <label class="question-label">
              <span class="question-num">4</span>
              How does your scalp feel 24–48 hours after washing?
            </label>
            <div class="quiz-options-grid">
              <label class="quiz-option-card active">
                <input type="radio" name="scalpType" value="Balanced / Normal" checked class="visually-hidden" />
                <div class="option-content">
                  <strong>Balanced & Comfortable</strong>
                  <span>Feels clean and fresh for 2–3 days</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="scalpType" value="Oily" class="visually-hidden" />
                <div class="option-content">
                  <strong>Oily / Greasy</strong>
                  <span>Roots look shiny or limp within 24 hours</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="scalpType" value="Dry & Tight" class="visually-hidden" />
                <div class="option-content">
                  <strong>Dry, Tight or Itchy</strong>
                  <span>Feels dry or produces small white flakes</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="scalpType" value="Sensitive / Reactive" class="visually-hidden" />
                <div class="option-content">
                  <strong>Sensitive & Reactive</strong>
                  <span>Easily pricked, stung, or irritated</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Q5: Porosity -->
          <div class="quiz-question-block">
            <label class="question-label">
              <span class="question-num">5</span>
              How porous is your hair (cuticle absorption & moisture retention)?
            </label>
            <div class="quiz-options-grid three-col">
              <label class="quiz-option-card">
                <input type="radio" name="porosity" value="Low Porosity" class="visually-hidden" />
                <div class="option-content">
                  <strong>Low Porosity</strong>
                  <span>Water beads up, takes forever to wet & dry</span>
                </div>
              </label>

              <label class="quiz-option-card active">
                <input type="radio" name="porosity" value="Medium Porosity" checked class="visually-hidden" />
                <div class="option-content">
                  <strong>Medium Porosity</strong>
                  <span>Absorbs and retains hydration easily</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="porosity" value="High Porosity" class="visually-hidden" />
                <div class="option-content">
                  <strong>High Porosity</strong>
                  <span>Soaks water quickly, dries fast, prone to frizz</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Q6: Primary Goal -->
          <div class="quiz-question-block">
            <label class="question-label">
              <span class="question-num">6</span>
              What is your primary hair & scalp priority?
            </label>
            <div class="quiz-options-grid">
              <label class="quiz-option-card active">
                <input type="radio" name="primaryGoal" value="Frizz Control & Smooth Cuticles" checked class="visually-hidden" />
                <div class="option-content">
                  <strong>Frizz Control & Shine</strong>
                  <span>Smooth cuticle alignment & humidity defense</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="primaryGoal" value="Root Density & Follicle Vitality" class="visually-hidden" />
                <div class="option-content">
                  <strong>Density & Root Vitality</strong>
                  <span>Stimulate follicle strength & volume</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="primaryGoal" value="Deep Botanical Moisture for Dry Strands" class="visually-hidden" />
                <div class="option-content">
                  <strong>Deep Plant Hydration</strong>
                  <span>Replenish parched lengths & split ends</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="primaryGoal" value="Scalp Clarification & Flake Relief" class="visually-hidden" />
                <div class="option-content">
                  <strong>Scalp Comfort & Clarification</strong>
                  <span>Soothe itchiness and clear follicle buildup</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Q7: Processing & Styling -->
          <div class="quiz-question-block">
            <label class="question-label">
              <span class="question-num">7</span>
              Chemical and heat styling exposure:
            </label>
            <div class="quiz-options-grid">
              <label class="quiz-option-card active">
                <input type="radio" name="chemicalProcessing" value="Virgin hair" checked class="visually-hidden" />
                <div class="option-content">
                  <strong>Virgin Hair</strong>
                  <span>No bleach, dyes, or intense heat</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="chemicalProcessing" value="Color-Treated / Highlights" class="visually-hidden" />
                <div class="option-content">
                  <strong>Color-Treated / Bleached</strong>
                  <span>Highlights, permanent dye, or bleach</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="chemicalProcessing" value="Frequent Heat Styling" class="visually-hidden" />
                <div class="option-content">
                  <strong>Frequent Heat Tools</strong>
                  <span>Blow dryers, flat irons, curling wands</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="chemicalProcessing" value="Chemically Straightened / Permed" class="visually-hidden" />
                <div class="option-content">
                  <strong>Chemical Straightening / Perm</strong>
                  <span>Relaxers, perms, or keratin treatments</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Q8: Wash Frequency -->
          <div class="quiz-question-block">
            <label class="question-label">
              <span class="question-num">8</span>
              How often do you wash your hair?
            </label>
            <div class="quiz-options-grid three-col">
              <label class="quiz-option-card">
                <input type="radio" name="washFrequency" value="Daily" class="visually-hidden" />
                <div class="option-content">
                  <strong>Daily</strong>
                  <span>Every morning or evening</span>
                </div>
              </label>

              <label class="quiz-option-card active">
                <input type="radio" name="washFrequency" value="2-3 times per week" checked class="visually-hidden" />
                <div class="option-content">
                  <strong>2–3 Times a Week</strong>
                  <span>Balanced cleansing cadence</span>
                </div>
              </label>

              <label class="quiz-option-card">
                <input type="radio" name="washFrequency" value="Once a week or less" class="visually-hidden" />
                <div class="option-content">
                  <strong>Weekly or Less</strong>
                  <span>Preserves natural scalp oils</span>
                </div>
              </label>
            </div>
          </div>

          <div class="quiz-submit-box">
            <button type="submit" class="btn btn-primary btn-lg glow-pulse" id="btnSubmitHairQuiz">
              <span class="mode-icon">🌿</span>
              Analyze My Hair via Questionnaire
            </button>
            <span class="quiz-loading-tag hidden" id="quizLoading">Formulating 100% natural botanical routine...</span>
          </div>
        </form>

        <div class="safety-advisory-banner" style="margin-top: 32px;">
          <svg class="advisory-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
          <div class="advisory-text">
            <strong>Non-Medical Aesthetic Questionnaire:</strong> This diagnostic provides cosmetic grooming insights and natural botanical recommendations. It does not diagnose clinical alopecia, scalp eczema, or dermatological diseases.
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
    return container;
  }

  attachEvents(container) {
    const form = container.querySelector('#hairQuizForm');
    const btnSubmit = container.querySelector('#btnSubmitHairQuiz');
    const loadingTag = container.querySelector('#quizLoading');

    // Make radio cards visually selectable
    container.querySelectorAll('.quiz-option-card').forEach(card => {
      card.addEventListener('click', () => {
        const input = card.querySelector('input');
        if (input) {
          input.checked = true;
          const groupName = input.name;
          container.querySelectorAll(`input[name="${groupName}"]`).forEach(otherInput => {
            otherInput.closest('.quiz-option-card').classList.remove('active');
          });
          card.classList.add('active');
          this.formData[groupName] = input.value;
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (this.isSubmitting) return;

      this.isSubmitting = true;
      btnSubmit.disabled = true;
      loadingTag.classList.remove('hidden');

      try {
        const result = await API.analyzeHairQuestionnaire(this.formData);
        if (this.onAnalysisComplete) {
          this.onAnalysisComplete(result);
        }
      } catch (err) {
        console.error('Questionnaire error:', err);
      } finally {
        this.isSubmitting = false;
        btnSubmit.disabled = false;
        loadingTag.classList.add('hidden');
      }
    });
  }
}
