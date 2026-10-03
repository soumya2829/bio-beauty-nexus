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
      // Local fallback login
      const user = {
        id: 'usr_local',
        name: email.split('@')[0] || 'Beauty Member',
        email,
        skinType: 'Combination',
        hairType: 'Wavy'
      };
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(user));
      return { success: true, user };
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
      // Local fallback register
      const user = {
        id: 'usr_' + Date.now(),
        name: userData.name,
        email: userData.email,
        skinType: userData.skinType || 'Combination',
        hairType: userData.hairType || 'Wavy'
      };
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(user));
      return { success: true, user };
    }
  },

  getCurrentUser() {
    const raw = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    // Default demo user logged in
    const defaultUser = {
      id: "usr_demo_01",
      name: "Alex Chen",
      email: "alex.chen@biobeautynexus.io",
      skinType: "Combination",
      hairType: "Wavy / Medium Density"
    };
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(defaultUser));
    return defaultUser;
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
  }
};
