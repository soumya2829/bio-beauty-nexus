import { MockAiEngine } from './mockAiEngine.js';

const LOCAL_STORAGE_HISTORY_KEY = 'bbn_scan_history';
const LOCAL_STORAGE_HAIR_HISTORY_KEY = 'bbn_hair_history';
const LOCAL_STORAGE_PROFILE_KEY = 'bbn_user_profile';
const LOCAL_STORAGE_AUTH_KEY = 'bbn_auth_user';

const DEFAULT_HISTORY = [
  {
    id: "scan_2026_09",
    date: "2026-09-15T14:22:00Z",
    monthLabel: "September 2026",
    overallScore: 76,
    summary: "Initial baseline scan. Visible dehydration around cheek zones with moderate T-zone shine and mild surface redness.",
    metrics: {
      skinAppearance: { score: 78, observation: "Balanced with moderate vitality", confidence: "88% AI Estimate" },
      texture: { score: 70, observation: "Mild visible roughness along cheek contours", confidence: "85% AI Estimate" },
      hydration: { score: 64, observation: "Superficial dehydration indicators visible", confidence: "82% AI Estimate" },
      redness: { score: 68, observation: "Visible mild rosy tone over nasal bridge & cheeks", confidence: "91% AI Estimate" },
      darkSpots: { score: 79, observation: "Minimal localized post-sun discoloration", confidence: "84% AI Estimate" },
      underEye: { score: 66, observation: "Slight shadow appearance in inner tear trough", confidence: "80% AI Estimate" },
      pores: { score: 72, observation: "Noticeable pore distribution across nose & mid-cheeks", confidence: "89% AI Estimate" }
    },
    faceShape: "Oval / Soft Angular",
    hairAppearance: "Visible healthy brown hair framing upper forehead",
    keyRecommendations: "Incorporate multi-molecular hyaluronic acid and cica calming emulsion."
  },
  {
    id: "scan_2026_10",
    date: "2026-10-18T10:15:00Z",
    monthLabel: "October 2026",
    overallScore: 82,
    summary: "Progress check after 4 weeks. Noticeable increase in surface hydration and smoother visible texture.",
    metrics: {
      skinAppearance: { score: 83, observation: "Reflective healthy glow, improved radiance", confidence: "90% AI Estimate" },
      texture: { score: 77, observation: "Noticeably smoother visual grain on cheek contours", confidence: "88% AI Estimate" },
      hydration: { score: 78, observation: "Enhanced moisture sheen, minimal dry patches", confidence: "86% AI Estimate" },
      redness: { score: 76, observation: "Subdued rosy hue, calmer appearance", confidence: "92% AI Estimate" },
      darkSpots: { score: 81, observation: "Consistent tone across upper cheeks", confidence: "87% AI Estimate" },
      underEye: { score: 72, observation: "Moderately refreshed orbital contour", confidence: "83% AI Estimate" },
      pores: { score: 76, observation: "Less prominent follicular appearance on mid-face", confidence: "91% AI Estimate" }
    },
    faceShape: "Oval",
    hairAppearance: "Visible conditioned hair, sleek framing",
    keyRecommendations: "Continue barrier cream; introduce peptide booster to refine texture further."
  },
  {
    id: "scan_2026_11",
    date: "2026-11-20T16:40:00Z",
    monthLabel: "November 2026",
    overallScore: 88,
    summary: "Comprehensive 8-week follow-up. Peak skin luminosity, refined visual texture, and balanced barrier appearance.",
    metrics: {
      skinAppearance: { score: 89, observation: "High visual clarity and dewy luminescence", confidence: "93% AI Estimate" },
      texture: { score: 85, observation: "Silky visual surface with uniform micro-relief", confidence: "90% AI Estimate" },
      hydration: { score: 86, observation: "Optimal cosmetic plumpness and healthy hydration sheen", confidence: "89% AI Estimate" },
      redness: { score: 84, observation: "Uniform complexion with minimal redness contrast", confidence: "94% AI Estimate" },
      darkSpots: { score: 85, observation: "Even distribution of cosmetic skin tone", confidence: "88% AI Estimate" },
      underEye: { score: 80, observation: "Awakened, well-hydrated under-eye area", confidence: "86% AI Estimate" },
      pores: { score: 82, observation: "Harmonized, discreet pore visibility across T-zone", confidence: "93% AI Estimate" }
    },
    faceShape: "Oval",
    hairAppearance: "Visible glossy, well-kept hair",
    keyRecommendations: "Maintain protective barrier protocol and SPF 50+ mineral defense daily."
  }
];

export const API = {
  // ----------------------------------------------------
  // Authentication: Login, Register, Current User
  // ----------------------------------------------------
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(data.user));
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (e) {
      return{
        success: false,
        error: 'Login failed due to network issues. Please try again later.'
      }
    }
  },

  async register(userData) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(data.user));
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch (e) {
      return{
        success: false,
        error: 'Registration failed due to network issues. Please try again later.'
        }
    }
  },

  getCurrentUser() {
    const raw = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return null;
  },

  logout() {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  },

  // ----------------------------------------------------
  // Skin Analysis
  // ----------------------------------------------------
  async analyzeBeautyImage(imageData, questionnaire = {}, presetMode = null) {
    try {
      const response = await fetch('/api/analyze-beauty-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData, questionnaire, presetMode })
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
      
      const errData = await response.json().catch(() => ({}));
      if (errData.errorType === 'POOR_IMAGE_QUALITY') {
        return errData;
      }
    } catch (e) {
      console.info('Backend API unavailable, using resilient client MockAiEngine fallback.');
    }

    // Client-side fallback
    const result = await MockAiEngine.analyze(imageData, questionnaire, presetMode);
    if (result.success) {
      this.saveHistoryLocal({
        id: result.analysisId,
        date: result.timestamp,
        monthLabel: new Date(result.timestamp).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        overallScore: result.overallScore,
        summary: result.primaryCharacteristic,
        metrics: {
          skinAppearance: result.categories.find(c => c.key === 'skinAppearance'),
          texture: result.categories.find(c => c.key === 'texture'),
          hydration: result.categories.find(c => c.key === 'hydration'),
          redness: result.categories.find(c => c.key === 'redness'),
          darkSpots: result.categories.find(c => c.key === 'darkSpots'),
          underEye: result.categories.find(c => c.key === 'underEye'),
          pores: result.categories.find(c => c.key === 'pores')
        },
        faceShape: result.faceShape,
        hairAppearance: result.hairAppearance,
        keyRecommendations: result.recommendations.summary
      });
    }
    return result;
  },

  // ----------------------------------------------------
  // Hair Analysis
  // ----------------------------------------------------
  async analyzeHairImage(imageData, questionnaire = {}, presetMode = null) {
    try {
      const response = await fetch('/api/analyze-hair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData, questionnaire, presetMode })
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
      const errData = await response.json().catch(() => ({}));
      if (errData.errorType === 'POOR_IMAGE_QUALITY') return errData;
    } catch (e) {
      console.info('Hair API fallback');
    }

    if (presetMode === 'poor_quality') {
      return {
        success: false,
        errorType: 'POOR_IMAGE_QUALITY',
        message: 'The uploaded hair photo appears out of focus or lacks sufficient lighting. Please capture a clear, well-lit photo of your hair parting.'
      };
    }

    // Client fallback hair analysis
    return {
      success: true,
      analysisId: 'hair_' + Date.now(),
      timestamp: new Date().toISOString(),
      overallScore: 80,
      hairTypeLabel: 'Type 2 Wavy • Medium Porosity',
      primaryCharacteristic: 'Visible wave definition with slight cuticle flyaways and dry mid-lengths',
      categories: [
        { key: 'hairDensity', title: 'Visible Hair Density', score: 84, observation: 'Full, abundant strand coverage along root partings', confidence: '91% AI Estimate', simpleExplanation: 'Evaluates visible hair fiber density and contrast along scalp line.', suggestedApproach: 'Massage a peptide & rosemary scalp tonic nightly to stimulate micro-circulation.' },
        { key: 'hairTexture', title: 'Visible Pattern & Micro-Relief', score: 78, observation: 'Type 2 Wavy with slight cuticle irregularities', confidence: '89% AI Estimate', simpleExplanation: 'Identifies curl, wave, or straight alignment.', suggestedApproach: 'Use sulfate-free gentle cleansers and wide-tooth combs.' },
        { key: 'hairShine', title: 'Hair Shine & Moisture Lustre', score: 72, observation: 'Moderate light reflection, mild dryness along ends', confidence: '87% AI Estimate', simpleExplanation: 'Measures specular reflection off outer hair cuticle sheath.', suggestedApproach: 'Seal cuticles with lightweight cold-pressed argan oil.' },
        { key: 'scalpComfort', title: 'Visible Scalp Comfort', score: 76, observation: 'Clean, comfortable visual scalp parting with balanced barrier', confidence: '92% AI Estimate', simpleExplanation: 'Monitors root shine, particulate flakiness, and redness.', suggestedApproach: 'Incorporate a gentle clarifying scrub or 1% salicylic acid scalp treatment.' },
        { key: 'frizzControl', title: 'Frizz & Cuticle Alignment', score: 70, observation: 'Moderate halo flyaways and strand displacement', confidence: '88% AI Estimate', simpleExplanation: 'Detects detached micro-fibers projecting outside hair silhouette.', suggestedApproach: 'Apply a phyto-keratin bond mask weekly.' }
      ],
      recommendations: {
        summary: 'Your Hair Analysis highlights a natural wave pattern with moderate cuticle roughness. Your customized ritual focuses on scalp invigoration and strand lipid replenishment.',
        washDayRoutine: [
          { step: 1, title: 'Scalp Clarification & Cleanse', product: 'Bio-Botanical Amino Sulfate-Free Shampoo', instruction: 'Massage into scalp for 2 minutes and let suds glide down lengths.' },
          { step: 2, title: 'Cuticle Repair & Conditioning', product: 'Phyto-Keratin Deep Bond Recovery Hair Mask', instruction: 'Distribute through mid-lengths and ends. Leave for 5-8 minutes before cool-water rinsing.' }
        ],
        dailyCareRoutine: [
          { step: 1, title: 'Nightly Scalp Fortification', product: 'Follicle-Bio Rosemary & Caffeine Scalp Tonic', instruction: 'Apply 1-2 droppers onto dry scalp along parting lines; gently press.' },
          { step: 2, title: 'Leave-In Cuticle Sealing', product: 'Mirror-Gloss Botanical Silk Argan Finishing Drops', instruction: 'Warm 2 drops between palms and smooth over ends to repel humidity.' }
        ],
        ingredientSuggestions: [
          { name: 'Rosemary Leaf Extract', role: 'Scalp Vitality & Follicle Tonic', why: 'Supports scalp comfort and promotes the appearance of resilient, fuller roots.' },
          { name: 'Hydrolyzed Plant Keratin', role: 'Cuticle Restorer', why: 'Fills microscopic gaps in strand fibers to dramatically reduce frizz.' },
          { name: 'Cold-Pressed Argan Oil', role: 'Lipid Barrier & Gloss', why: 'Imparts mirror-like sheen without heaviness.' }
        ]
      },
      disclaimer: 'IMPORTANT NON-MEDICAL HAIR NOTICE: Bio Beauty Nexus delivers cosmetic hair and scalp observations for personal grooming and routine planning. It does NOT diagnose clinical alopecia, seborrheic dermatitis, or trichological diseases.'
    };
  },

  async analyzeHairQuestionnaire(formData) {
    try {
      const response = await fetch('/api/analyze-hair-questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionnaire: formData })
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (e) {
      console.info('Questionnaire API fallback');
    }

    // Client fallback with 100% natural ingredients
    return {
      success: true,
      analysisId: 'hair_q_' + Date.now(),
      analysisType: 'questionnaire',
      timestamp: new Date().toISOString(),
      overallScore: 82,
      hairTypeLabel: `${formData.hairPattern || 'Type 2 Wavy'} • ${formData.porosity || 'Medium Porosity'}`,
      primaryCharacteristic: `Custom questionnaire analysis: ${formData.hairPattern || 'Type 2 Wavy'} with ${formData.porosity || 'medium porosity'}`,
      categories: [
        { key: 'hairDensity', title: 'Hair Density & Root Vitality', score: 80, observation: `Calibrated for ${formData.hairDensity || 'Medium'} density`, confidence: '95% Questionnaire Calibration', simpleExplanation: 'Reflects self-reported scalp volume and hair thickness.', suggestedApproach: 'Warm 2 droppers of pure Rosemary & Amla scalp nectar into root partings 3 nights a week.' },
        { key: 'hairTexture', title: 'Pattern & Fiber Micro-Relief', score: 82, observation: `${formData.hairPattern || 'Type 2 Wavy'} with ${formData.strandThickness || 'medium'} fiber diameter`, confidence: '96% Questionnaire Calibration', simpleExplanation: 'Identifies cuticle wave pattern and strand grouping.', suggestedApproach: 'Use sulfate-free herbal cleansers; detangle exclusively with wide-tooth wooden combs on wet conditioned hair.' },
        { key: 'hairShine', title: 'Moisture Lustre & Cuticle Porosity', score: 76, observation: `Cuticle absorption aligned with ${formData.porosity || 'Medium Porosity'}`, confidence: '94% Questionnaire Calibration', simpleExplanation: 'Determines how easily hydration penetrates and locks inside.', suggestedApproach: 'Seal wet ends with 2-3 drops of Cold-Pressed Virgin Argan and Olive Squalane.' },
        { key: 'scalpComfort', title: 'Scalp Barrier Comfort', score: 78, observation: `${formData.scalpType || 'Balanced'} baseline environment`, confidence: '92% Questionnaire Calibration', simpleExplanation: 'Evaluates sebum balance and root comfort.', suggestedApproach: 'Apply Organic Aloe Vera gel and gentle Jojoba pre-wash scalp massage.' },
        { key: 'frizzControl', title: 'Frizz Index & Cuticle Alignment', score: 72, observation: 'Moderate halo flyaways and cuticle roughness', confidence: '93% Questionnaire Calibration', simpleExplanation: 'Reflects atmospheric humidity defense.', suggestedApproach: 'Incorporate weekly Fermented Rice Water & Hibiscus mask treatment.' }
      ],
      recommendations: {
        summary: `Your Hair Questionnaire reveals a ${formData.hairPattern || 'Type 2 Wavy'} profile with ${formData.porosity || 'medium porosity'}. We have crafted a 100% natural, chemical-free botanical routine to nourish hair follicles and seal cuticles.`,
        washDayRoutine: [
          { step: 1, title: 'Pre-Wash Herbal Scalp Oil Massage', product: 'Ayurvedic Amla, Rosemary & Bhringraj Scalp Nectar', instruction: 'Massage 1-2 droppers into scalp partings for 3 minutes before washing to stimulate micro-circulation.' },
          { step: 2, title: 'Gentle Botanical Cleanse', product: 'Tea Tree & Aloe Vera Scalp Clarifying Elixir', instruction: 'Apply directly to wet roots to dissolve sebum buildup without stripping natural lipids.' },
          { step: 3, title: 'Deep Plant Mask & Cuticle Bond Seal', product: 'Fermented Rice Water & Hibiscus Curl Recovery Mask', instruction: 'Rake through damp mid-lengths to ends. Rinse with cool water after 10 minutes.' }
        ],
        dailyCareRoutine: [
          { step: 1, title: 'Nightly Scalp Tonic Drops', product: 'Rosemary Leaf Hydrosol & Aloe Vera Mist', instruction: 'Mist onto clean scalp along partings before bed; lightly press with pads of your fingers.' },
          { step: 2, title: 'Daily Cuticle Sealant & Shine Drops', product: 'Cold-Pressed Argan & Olive Squalane Silk Drops', instruction: 'Smooth 2 drops over damp or dry ends to eliminate frizz and shield against atmospheric humidity.' }
        ],
        ingredientSuggestions: [
          { name: 'Rosemary Leaf Extract & Essential Oil', origin: '100% Pure Botanical', role: 'Follicle Stimulator & Root Tonic', why: 'Rich in carnosic acid; enhances micro-circulation at the root to improve visible strand density and invigorate sluggish hair follicles.' },
          { name: 'Organic Amla & Bhringraj', origin: 'Ayurvedic Herbal Blend', role: 'Ayurvedic Density & Cortex Fortifier', why: 'Packed with natural tannins and bio-Vitamin C that fortify hair shafts from within, enhancing rich natural color and hair bounce.' },
          { name: 'Cold-Pressed Virgin Argan Oil', origin: '100% Pure Moroccan Oil', role: 'Lipid Cuticle Sealant & Mirror Gloss', why: 'Oleic and linoleic essential fatty acids coat each hair strand in a weightless natural shield that blocks out humidity-induced frizz.' },
          { name: 'Fermented Rice Water & Hibiscus', origin: 'Bio-Fermented Botanical', role: 'Tensile Strength & Cuticle Repair', why: 'Natural inositol and plant alpha-hydroxy acids penetrate porous strands, smoothing jagged cuticles and defining natural waves/curls.' }
        ]
      },
      disclaimer: 'IMPORTANT NON-MEDICAL HAIR ADVISORY: This questionnaire provides cosmetic observations and natural grooming guidance based on your self-reported hair and scalp characteristics. It is NOT a clinical diagnosis for alopecia, telogen effluvium, psoriasis, or trichological disorders.'
    };
  },

  // ----------------------------------------------------
  // History & Assistant
  // ----------------------------------------------------
  async fetchHistory() {
    try {
      const response = await fetch('/api/history');
      if (response.ok) {
        const data = await response.json();
        if (data.history && data.history.length > 0) return data.history;
      }
    } catch (e) {}

    const local = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (local) {
      try { return JSON.parse(local); } catch (e) {}
    }
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(DEFAULT_HISTORY));
    return DEFAULT_HISTORY;
  },

  saveHistoryLocal(entry) {
    try {
      let current = this.getLocalHistory();
      current.push(entry);
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(current));
    } catch (e) {}
  },

  getLocalHistory() {
    const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (!raw) return [...DEFAULT_HISTORY];
    try { return JSON.parse(raw); } catch (e) { return [...DEFAULT_HISTORY]; }
  },

  async askAssistant(question, contextAnalysis = null) {
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, contextAnalysis })
      });
      if (response.ok) {
        const data = await response.json();
        return data.reply;
      }
    } catch (e) {}

    const q = (question || '').toLowerCase();
    if (q.includes('hair') || q.includes('scalp') || q.includes('frizz')) {
      return `### Bio Hair & Scalp Assistant 💇‍♀️\n\n- **Hair Texture & Frizz**: Use **Hydrolyzed Plant Keratin** and **Argan Oil** to seal raised cuticles.\n- **Scalp Care**: Massage a **Rosemary & Caffeine Scalp Tonic** into root partings 3-4 times a week.\n- **Wash Day Tip**: Shampoo your roots only, and condition mid-lengths with cool water.\n\n*All hair guidance is strictly cosmetic and non-medical!*`;
    }

    if (q.includes('what does my analysis mean') || q.includes('analysis mean')) {
      return `### Understanding Your Bio Beauty Profile\n\nYour profile assesses 7 key visual dimensions: skin luminosity, texture smoothness, hydration appearance, redness, dark spots, under-eye contours, and pore visibility. Each insight guides your non-medical cosmetic routine steps!`;
    }

    if (q.includes('morning routine') || q.includes('build me a morning routine')) {
      return `### Your Recommended Morning Protocol ☀️\n\n1. **Gentle Cleanser**: Non-foaming botanical wash.\n2. **Hydrating Essence**: Multi-weight Hyaluronic Acid patted onto damp skin.\n3. **Tone & Radiance Serum**: 5% Niacinamide or gentle Vitamin C derivative.\n4. **Mineral SPF 50+**: Daily broad-spectrum defense.\n\n*Non-negotiable daily defense to protect your skin barrier!*`;
    }

    return `### Bio Beauty Assistant\n\nI can help you with skincare routines, ingredient guidance, and hair/scalp care tips. Feel free to ask any question!`;
  },

  saveUserProfile(profile) {
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
  },

  getUserProfile() {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return {
      name: "Alex Chen",
      skinType: "Combination",
      hairType: "Wavy / Medium Density",
      mainConcern: "Hydration & Glow",
      sensitivity: "Mildly Sensitive",
      ageGroup: "25-34",
      climate: "Temperate / Urban",
      lifestyle: "Screen-focused / Active"
    };
  },

  async fetchProducts() {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        return { products: data.products || [], ingredients: data.ingredients || [] };
      }
    } catch (e) {}
    return { products: [], ingredients: [] };
  },

  async fetchDietaryPlans() {
    try {
      const res = await fetch('/api/dietary-plans');
      if (res.ok) {
        const data = await res.json();
        return data.dietaryPlans || [];
      }
    } catch (e) {}
    return [];
  },

  async fetchProposedRoutines() {
    try {
      const res = await fetch('/api/proposed-routines');
      if (res.ok) {
        const data = await res.json();
        return data.proposedRoutines || {};
      }
    } catch (e) {}
    return {};
  }
};
