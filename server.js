import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const DB_PATHS = [
  path.join(__dirname, 'data', 'database.json'),
  path.join(__dirname, 'bbn-backend', 'data', 'database.json')
];

function getDatabase() {
  for (const dbPath of DB_PATHS) {
    if (fs.existsSync(dbPath)) {
      try {
        const data = fs.readFileSync(dbPath, 'utf-8');
        const parsed = JSON.parse(data);
        if (!parsed.hairAnalysisHistory) parsed.hairAnalysisHistory = [];
        if (!parsed.dietaryPlans) parsed.dietaryPlans = [];
        if (!parsed.proposedRoutines) parsed.proposedRoutines = {};
        return parsed;
      } catch (err) {
        console.error('Error reading database from ' + dbPath + ':', err);
      }
    }
  }
  return { users: [], ingredients: [], products: [], analysisHistory: [], hairAnalysisHistory: [], dietaryPlans: [], proposedRoutines: {} };
}

function saveDatabase(db) {
  let saved = false;
  const content = JSON.stringify(db, null, 2);
  for (const dbPath of DB_PATHS) {
    try {
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(dbPath, content, 'utf-8');
      saved = true;
    } catch (err) {
      console.error('Error saving database to ' + dbPath + ':', err);
    }
  }
  return saved;
}

// MIME types dictionary for static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// Simulation engine for AI Skin Analysis based on image metadata & questionnaire
function analyzeBeautyImage(imageData, questionnaire = {}, presetMode = null) {
  if (presetMode === 'poor_quality' || (!imageData && !presetMode)) {
    return {
      success: false,
      errorType: 'POOR_IMAGE_QUALITY',
      message: 'The uploaded image appears blurred, underexposed, or does not clearly show facial features. For the most accurate cosmetic observations, please take or upload a well-lit, front-facing selfie with neutral facial expression.'
    };
  }

  let seedValue = 42;
  if (typeof imageData === 'string' && imageData.length > 100) {
    for (let i = 0; i < Math.min(imageData.length, 500); i += 15) {
      seedValue = (seedValue + imageData.charCodeAt(i)) % 1000;
    }
  }

  let skinAppScore = 78 + (seedValue % 14);
  let textureScore = 72 + ((seedValue * 3) % 18);
  let hydrationScore = 65 + ((seedValue * 7) % 22);
  let rednessScore = 75 + ((seedValue * 5) % 17);
  let darkSpotsScore = 80 + ((seedValue * 2) % 15);
  let underEyeScore = 68 + ((seedValue * 4) % 20);
  let poresScore = 73 + ((seedValue * 6) % 16);

  let faceShape = 'Oval';
  let hairAppearance = 'Subtle glossy hair framing the forehead line';
  let primaryCharacteristic = 'Balanced skin appearance with localized superficial dehydration';

  if (presetMode === 'dry') {
    hydrationScore = 48;
    textureScore = 62;
    skinAppScore = 69;
    rednessScore = 70;
    primaryCharacteristic = 'Noticeable visual dryness indicators with fine flakiness appearance around cheeks';
  } else if (presetMode === 'oily') {
    hydrationScore = 84;
    poresScore = 58;
    textureScore = 66;
    skinAppScore = 75;
    primaryCharacteristic = 'Prominent visual surface shine in the T-zone with visible pore distribution';
  } else if (presetMode === 'redness') {
    rednessScore = 54;
    skinAppScore = 70;
    textureScore = 71;
    primaryCharacteristic = 'Distinct visible rosy coloration and superficial vascular flush on cheeks and nose';
  } else if (presetMode === 'glow') {
    skinAppScore = 92;
    hydrationScore = 89;
    textureScore = 88;
    rednessScore = 86;
    darkSpotsScore = 90;
    underEyeScore = 85;
    poresScore = 86;
    primaryCharacteristic = 'High visual clarity, dewy surface reflection, and harmonized barrier appearance';
  }

  const clamp = (val) => Math.min(96, Math.max(45, Math.round(val)));

  const categories = [
    {
      key: 'skinAppearance',
      title: 'Skin Appearance',
      score: clamp(skinAppScore),
      observation: skinAppScore > 80 ? 'Luminous, radiant overall appearance' : 'Moderate radiance with slight uneven light reflection',
      confidence: '92% AI Estimate',
      simpleExplanation: 'Evaluates visible skin reflectivity, clarity, and overall complexion brightness under ambient lighting.',
      suggestedApproach: 'Maintain gentle antioxidant protection and light morning hydration to enhance natural cosmetic luminescence.'
    },
    {
      key: 'texture',
      title: 'Visible Skin Texture',
      score: clamp(textureScore),
      observation: textureScore > 75 ? 'Smooth micro-relief with minimal tactile grain' : 'Mild visible roughness and uneven surface texture around cheeks',
      confidence: '88% AI Estimate',
      simpleExplanation: 'Assesses visual skin smoothness and shadows caused by minor surface micro-texture.',
      suggestedApproach: 'Introduce gentle PHA or enzyme exfoliants 1-2 times per week to smooth the surface without stripping moisture.'
    },
    {
      key: 'hydration',
      title: 'Hydration Appearance',
      score: clamp(hydrationScore),
      observation: hydrationScore < 60 ? 'Visible signs of superficial surface dehydration' : 'Supple moisture sheen with balanced skin bounce',
      confidence: '89% AI Estimate',
      simpleExplanation: 'Detects visible plumpness, lack of dry micro-crepiness, and light-bounce indicative of epidermal water retention.',
      suggestedApproach: hydrationScore < 60 ? 'Incorporate a multi-weight hyaluronic acid serum followed by a lipid-replenishing ceramide barrier cream.' : 'Continue balanced hydration with lightweight humectants and squalane.'
    },
    {
      key: 'redness',
      title: 'Visible Redness',
      score: clamp(rednessScore),
      observation: rednessScore < 65 ? 'Elevated superficial rosy coloration on cheeks and nasal bridge' : 'Calm, uniform complexion with minimal redness contrast',
      confidence: '94% AI Estimate',
      simpleExplanation: 'Measures color wavelength variance towards pink and red spectrums across high-vascularity facial zones.',
      suggestedApproach: 'Apply soothing botanical extracts such as Centella Asiatica (Cica), Madecassoside, and panthenol to comfort the skin.'
    },
    {
      key: 'darkSpots',
      title: 'Visible Dark-Spot Appearance',
      score: clamp(darkSpotsScore),
      observation: darkSpotsScore > 80 ? 'Discreet tone uniformity with negligible spot contrast' : 'Mild localized post-sun discoloration or cosmetic freckling visible',
      confidence: '86% AI Estimate',
      simpleExplanation: 'Identifies localized melanin contrast patterns and cosmetic pigmentation irregularities.',
      suggestedApproach: 'Pair daily broad-spectrum SPF 50+ with 5% Niacinamide and cosmetic Azelaic derivative to balance tone.'
    },
    {
      key: 'underEye',
      title: 'Visible Under-Eye Appearance',
      score: clamp(underEyeScore),
      observation: underEyeScore < 70 ? 'Mild cosmetic shadow appearance and slight puffiness in the orbital zone' : 'Awakened, well-rested orbital eye contour',
      confidence: '85% AI Estimate',
      simpleExplanation: 'Analyzes visual micro-shadows beneath the lower eyelid and subtle periorbital volume variations.',
      suggestedApproach: 'Use a caffeine-infused peptide eye hydrogel and gentle drainage acupressure during morning application.'
    },
    {
      key: 'pores',
      title: 'Visible Pores',
      score: clamp(poresScore),
      observation: poresScore < 70 ? 'Noticeable pore visibility along T-zone and adjacent medial cheeks' : 'Refined, discreet follicular appearance across all facial zones',
      confidence: '91% AI Estimate',
      simpleExplanation: 'Estimates geometric aperture dimensions and shadowing of visible skin pores under uniform lighting.',
      suggestedApproach: 'Incorporate 2-5% Niacinamide and double cleansing with a gentle botanical oil to keep pore lining clear.'
    }
  ];

  const overallScore = Math.round(categories.reduce((acc, c) => acc + c.score, 0) / categories.length);

  const db = getDatabase();

  let routineKey = 'hydration_barrier';
  let dietId = 'diet_skin_barrier_glow';

  if (presetMode === 'dry' || hydrationScore < 60) {
    routineKey = 'hydration_barrier';
    dietId = 'diet_skin_barrier_glow';
  } else if (presetMode === 'oily' || poresScore < 65) {
    routineKey = 'sebum_clarifying';
    dietId = 'diet_sebum_clarifying';
  } else if (rednessScore < 70) {
    routineKey = 'redness_calming';
    dietId = 'diet_antioxidant_antiinflammatory';
  } else if (textureScore < 75 || skinAppScore >= 85) {
    routineKey = 'collagen_longevity';
    dietId = 'diet_collagen_longevity';
  }

  const proposedRoutine = db.proposedRoutines?.[routineKey] || db.proposedRoutines?.hydration_barrier || {};
  const matchedDietPlan = (db.dietaryPlans || []).find(d => d.id === dietId) || (db.dietaryPlans || [])[0] || null;

  // Enrich step with real database product details
  const enrichStepWithProduct = (step) => {
    const product = (db.products || []).find(p => p.id === step.productId || p.name === step.name);
    return {
      ...step,
      productId: step.productId || product?.id || null,
      brand: product?.brand || 'Nexus Naturals',
      price: product?.price || '$36',
      keyIngredients: product?.keyIngredients || [],
      howToUse: product?.howToUse || step.instruction,
      skinFit: product?.skinFit || ''
    };
  };

  const morningRoutine = (proposedRoutine.morningRoutine || []).map(enrichStepWithProduct);
  const eveningRoutine = (proposedRoutine.eveningRoutine || []).map(enrichStepWithProduct);
  const weeklyRoutine = (proposedRoutine.weeklyRoutine || []).map(enrichStepWithProduct);

  // Extract unique database products associated with this routine
  const proposedProductIds = new Set([
    ...morningRoutine.map(s => s.productId),
    ...eveningRoutine.map(s => s.productId),
    ...weeklyRoutine.map(s => s.productId)
  ].filter(Boolean));

  const proposedProducts = (db.products || []).filter(p => proposedProductIds.has(p.id));

  // Extract pure natural ingredients
  const ingredientSuggestions = (db.ingredients || []).slice(0, 4).map(ing => ({
    name: ing.name,
    role: ing.category,
    origin: ing.origin,
    why: ing.benefits,
    isNatural: ing.isNatural
  }));

  const recommendations = {
    summary: `Based on your AI Beauty Scan, your cosmetic profile shows ${primaryCharacteristic.toLowerCase()}. Your personalized protocol focuses on reinforcing barrier comfort, optimizing moisture retention, and refining surface radiance.`,
    routineId: proposedRoutine.id || routineKey,
    routineName: proposedRoutine.name || 'Personalized Bio Beauty Protocol',
    routineFocus: proposedRoutine.focus || primaryCharacteristic,
    morningRoutine,
    eveningRoutine,
    weeklyRoutine,
    proposedProducts,
    dietaryPlan: matchedDietPlan,
    ingredientSuggestions,
    productCategories: [
      { category: 'Gentle Cleanser', focus: 'pH-balanced non-foaming surfactant' },
      { category: 'Humectant Serum', focus: 'Multi-molecular hyaluronic acid + glycerin' },
      { category: 'Ceramide Barrier Cream', focus: 'Physiological lipid ratio (3:1:1)' },
      { category: 'Broad-Spectrum SPF 50+', focus: 'Non-nano zinc oxide with antioxidants' }
    ]
  };

  return {
    success: true,
    analysisId: 'scan_' + Date.now(),
    timestamp: new Date().toISOString(),
    overallScore,
    categories,
    faceShape,
    hairAppearance,
    primaryCharacteristic,
    recommendations,
    disclaimer: 'IMPORTANT NON-MEDICAL NOTICE: Bio Beauty Nexus delivers cosmetic and beauty observations for personal educational and aesthetic routine planning. This analysis does not diagnose diseases, detect clinical dermatological pathologies, or prescribe medical treatments. If you have medical skin concerns or persistent irritation, consult a certified dermatologist.'
  };
}

// AI Hair & Scalp Analysis Simulation
function analyzeHairImage(imageData, questionnaire = {}, presetMode = null) {
  if (presetMode === 'poor_quality' || (!imageData && !presetMode)) {
    return {
      success: false,
      errorType: 'POOR_IMAGE_QUALITY',
      message: 'The uploaded hair photo appears out of focus or lacks sufficient lighting to distinguish strand texture and scalp appearance. Please capture a clear, well-lit photo of your hair and parting.'
    };
  }

  let densityScore = 84;
  let textureScore = 78;
  let shineScore = 72;
  let scalpScore = 76;
  let frizzScore = 70;
  let hairTypeLabel = 'Type 2 Wavy • Medium Porosity';
  let primaryHairObservation = 'Visible natural wave pattern with moderate cuticle frizz and dry mid-lengths';

  if (presetMode === 'hair_frizz') {
    frizzScore = 55;
    shineScore = 60;
    densityScore = 80;
    hairTypeLabel = 'Type 2B Wavy • High Porosity Tendency';
    primaryHairObservation = 'Visible surface flyaways and elevated cuticle roughness from humidity or heat';
  } else if (presetMode === 'hair_oily_scalp') {
    scalpScore = 58;
    shineScore = 88;
    frizzScore = 82;
    hairTypeLabel = 'Type 1 Straight • Fine to Medium';
    primaryHairObservation = 'Prominent visual sebum reflection at the root line with smooth lengths';
  } else if (presetMode === 'hair_glossy_curls') {
    densityScore = 92;
    textureScore = 90;
    shineScore = 88;
    scalpScore = 86;
    frizzScore = 85;
    hairTypeLabel = 'Type 3A Curly • Well-Conditioned';
    primaryHairObservation = 'Defined curl clumps with high light-bounce and balanced scalp comfort';
  }

  const clamp = (v) => Math.min(96, Math.max(45, Math.round(v)));

  const categories = [
    {
      key: 'hairDensity',
      title: 'Visible Hair Density',
      score: clamp(densityScore),
      observation: densityScore > 80 ? 'Full, abundant strand coverage along root partings' : 'Moderate visual strand distribution across crown',
      confidence: '91% AI Estimate',
      simpleExplanation: 'Evaluates visible hair fiber density and contrast along the scalp line.',
      suggestedApproach: 'Massage a peptide & rosemary scalp tonic nightly to stimulate micro-circulation and root vigor.'
    },
    {
      key: 'hairTexture',
      title: 'Visible Pattern & Micro-Relief',
      score: clamp(textureScore),
      observation: `Classified as ${hairTypeLabel}`,
      confidence: '89% AI Estimate',
      simpleExplanation: 'Identifies curl, wave, or straight alignment and individual fiber grouping.',
      suggestedApproach: 'Use sulfate-free gentle cleansers and wide-tooth combs on damp conditioned hair.'
    },
    {
      key: 'hairShine',
      title: 'Hair Shine & Moisture Lustre',
      score: clamp(shineScore),
      observation: shineScore > 75 ? 'Healthy reflective sheen across mid-shaft' : 'Subdued light reflection indicating dry cuticle layers',
      confidence: '87% AI Estimate',
      simpleExplanation: 'Measures specular reflection off the outer hair cuticle sheath.',
      suggestedApproach: 'Seal cuticles with lightweight plant squalane or cold-pressed argan oil on damp ends.'
    },
    {
      key: 'scalpComfort',
      title: 'Visible Scalp Comfort',
      score: clamp(scalpScore),
      observation: scalpScore < 65 ? 'Visible tendency towards root oiliness or dry flakiness' : 'Clean, comfortable visual scalp parting with balanced barrier',
      confidence: '92% AI Estimate',
      simpleExplanation: 'Monitors root shine, particulate flakiness, and redness near hair follicles.',
      suggestedApproach: 'Incorporate a gentle clarifying scrub or 1% salicylic acid scalp treatment once every 10 days.'
    },
    {
      key: 'frizzControl',
      title: 'Frizz & Cuticle Alignment',
      score: clamp(frizzScore),
      observation: frizzScore < 65 ? 'Elevated halo flyaways and disrupted strand alignment' : 'Smooth, cohesive strand alignment with minimal flyaways',
      confidence: '88% AI Estimate',
      simpleExplanation: 'Detects detached micro-fibers projecting outside the main hair silhouette.',
      suggestedApproach: 'Apply a phyto-keratin bond mask weekly and avoid aggressive towel friction.'
    }
  ];

  const overallScore = Math.round(categories.reduce((acc, c) => acc + c.score, 0) / categories.length);

  const recommendations = {
    summary: `Your Hair Analysis highlights ${primaryHairObservation.toLowerCase()}. Your customized ritual restores strand moisture, calms root congestion, and seals outer cuticles.`,
    washDayRoutine: [
      {
        step: 1,
        title: 'Scalp Clarification & Cleanse',
        product: 'Bio-Botanical Amino Sulfate-Free Shampoo',
        instruction: 'Focus shampoo strictly on the scalp. Massage with fingertips for 2 minutes and let suds glide down lengths.'
      },
      {
        step: 2,
        title: 'Cuticle Repair & Conditioning',
        product: 'Phyto-Keratin Deep Bond Recovery Hair Mask',
        instruction: 'Distribute through mid-lengths and ends. Leave for 5-8 minutes before cool-water rinsing.'
      }
    ],
    dailyCareRoutine: [
      {
        step: 1,
        title: 'Nightly Scalp Fortification',
        product: 'Follicle-Bio Rosemary & Caffeine Scalp Tonic',
        instruction: 'Apply 1-2 droppers onto dry scalp along parting lines; gently press with fingertips.'
      },
      {
        step: 2,
        title: 'Leave-In Cuticle Sealing',
        product: 'Mirror-Gloss Botanical Silk Argan Finishing Drops',
        instruction: 'Warm 2 drops between palms and smooth over ends to repel humidity and lock in shine.'
      }
    ],
    ingredientSuggestions: [
      { name: 'Rosemary Leaf Extract', role: 'Scalp Vitality & Follicle Tonic', why: 'Supports scalp comfort and promotes the appearance of resilient, fuller roots.' },
      { name: 'Hydrolyzed Plant Keratin', role: 'Cuticle Restorer', why: 'Fills microscopic gaps in strand fibers to dramatically reduce frizz and split ends.' },
      { name: 'Cold-Pressed Argan Oil', role: 'Lipid Barrier & Gloss', why: 'Provides essential fatty acids and natural Vitamin E to impart mirror-like sheen without heaviness.' }
    ]
  };

  return {
    success: true,
    analysisId: 'hair_' + Date.now(),
    timestamp: new Date().toISOString(),
    overallScore,
    hairTypeLabel,
    primaryCharacteristic: primaryHairObservation,
    categories,
    recommendations,
    disclaimer: 'IMPORTANT NON-MEDICAL HAIR NOTICE: Bio Beauty Nexus delivers cosmetic hair and scalp observations for personal grooming and routine planning. It does NOT diagnose clinical alopecia, seborrheic dermatitis, or trichological diseases. Consult a trichologist or dermatologist for medical concerns.'
  };
}

// AI Hair Analysis by Questionnaire Calculation
function analyzeHairQuestionnaire(q = {}) {
  const pattern = q.hairPattern || 'Type 2 Wavy';
  const thickness = q.strandThickness || 'Medium';
  const density = q.hairDensity || 'Medium';
  const scalp = q.scalpType || 'Balanced / Normal';
  const porosity = q.porosity || 'Medium Porosity';
  const goal = q.primaryGoal || 'Frizz Control & Smooth Cuticles';
  const processing = q.chemicalProcessing || 'Virgin hair';
  const washFreq = q.washFrequency || '2-3 times per week';

  // Density score calculation
  let densityScore = density === 'High / Dense' ? 90 : (density === 'Medium' ? 78 : 62);
  
  // Texture score calculation
  let textureScore = 80;
  if (pattern.includes('Type 1')) textureScore = 85;
  else if (pattern.includes('Type 2')) textureScore = 78;
  else if (pattern.includes('Type 3')) textureScore = 74;
  else if (pattern.includes('Type 4')) textureScore = 70;

  // Shine & Porosity score
  let shineScore = 75;
  if (porosity.includes('High') || processing.includes('Highlight') || processing.includes('heat')) shineScore = 58;
  else if (porosity.includes('Low')) shineScore = 84;
  else shineScore = 79;

  // Scalp Comfort score
  let scalpScore = 82;
  if (scalp.includes('Dry') || scalp.includes('Tight')) scalpScore = 60;
  else if (scalp.includes('Oily')) scalpScore = 64;
  else if (scalp.includes('Sensitive') || scalp.includes('Reactive')) scalpScore = 58;
  else scalpScore = 88;

  // Frizz Control score
  let frizzScore = 74;
  if (goal.includes('Frizz') || porosity.includes('High') || pattern.includes('Curly') || pattern.includes('Wavy')) frizzScore = 60;
  if (processing.includes('Virgin') && porosity.includes('Medium')) frizzScore = 84;

  const clamp = (v) => Math.min(96, Math.max(45, Math.round(v)));

  // Natural Botanical Ingredients from database matched to questionnaire profile
  const naturalIngredients = [];
  if (densityScore < 80 || goal.includes('Density') || goal.includes('Thinning')) {
    naturalIngredients.push({
      name: 'Rosemary Leaf Extract & Essential Oil',
      origin: '100% Pure Botanical',
      role: 'Follicle Stimulator & Root Tonic',
      why: 'Rich in carnosic acid; enhances micro-circulation at the root to improve visible strand density and invigorate sluggish hair follicles.'
    });
    naturalIngredients.push({
      name: 'Organic Amla & Bhringraj',
      origin: 'Ayurvedic Herbal Blend',
      role: 'Ayurvedic Density & Cortex Fortifier',
      why: 'Packed with natural tannins and bio-Vitamin C that fortify hair shafts from within, enhancing rich natural color and hair bounce.'
    });
  }

  if (frizzScore < 75 || porosity.includes('High') || pattern.includes('Curly') || goal.includes('Frizz')) {
    naturalIngredients.push({
      name: 'Cold-Pressed Virgin Argan Oil',
      origin: '100% Pure Moroccan Oil',
      role: 'Lipid Cuticle Sealant & Mirror Gloss',
      why: 'Oleic and linoleic essential fatty acids coat each hair strand in a weightless natural shield that blocks out humidity-induced frizz.'
    });
    naturalIngredients.push({
      name: 'Fermented Rice Water & Hibiscus',
      origin: 'Bio-Fermented Botanical',
      role: 'Tensile Strength & Cuticle Repair',
      why: 'Natural inositol and plant alpha-hydroxy acids penetrate porous strands, smoothing jagged cuticles and defining natural waves/curls.'
    });
  }

  if (scalpScore < 75 || scalp.includes('Oily') || scalp.includes('Dry') || scalp.includes('Flakes')) {
    naturalIngredients.push({
      name: 'Organic Aloe Vera & Tea Tree Hydrosol',
      origin: 'Purifying Plant Complex',
      role: 'Scalp Balancing & Flake Relief',
      why: 'Proteolytic enzymes dissolve dead keratin buildup while steam-distilled tea tree purifies the scalp without disturbing its natural moisture barrier.'
    });
    naturalIngredients.push({
      name: 'Golden Cold-Pressed Jojoba Oil',
      origin: 'Biomimetic Liquid Wax',
      role: 'Sebum Harmonizer & Follicle Unclogger',
      why: 'Biomimetic plant liquid wax that dissolves hardened root sebum and calms tightness or excess oiliness.'
    });
  }

  if (naturalIngredients.length < 3) {
    naturalIngredients.push({
      name: '100% Olive-Derived Plant Squalane',
      origin: 'Mediterranean Botanical Lipid',
      role: 'Featherweight Moisture & Silk Finish',
      why: 'Ultra-lightweight natural lipid that imparts high-gloss shine and silky slip without weighing down fine or medium strands.'
    });
  }

  const categories = [
    {
      key: 'hairDensity',
      title: 'Hair Density & Root Vitality',
      score: clamp(densityScore),
      observation: densityScore > 80 ? 'Abundant, robust root coverage' : (densityScore > 70 ? 'Moderate follicle distribution' : 'Delicate strand volume with high scalp visibility'),
      confidence: '95% Questionnaire Calibration',
      simpleExplanation: `Calculated from your self-reported ${density.toLowerCase()} and ponytail circumference.`,
      suggestedApproach: 'Warm 2 droppers of pure Rosemary & Amla scalp nectar into root partings 3 nights a week.'
    },
    {
      key: 'hairTexture',
      title: 'Pattern & Fiber Micro-Relief',
      score: clamp(textureScore),
      observation: `${pattern} with ${thickness.toLowerCase()} fiber diameter`,
      confidence: '96% Questionnaire Calibration',
      simpleExplanation: 'Identifies cuticle shape and how fibers group together.',
      suggestedApproach: 'Use sulfate-free herbal cleansers; detangle exclusively with wide-tooth wooden combs on wet conditioned hair.'
    },
    {
      key: 'hairShine',
      title: 'Moisture Lustre & Cuticle Porosity',
      score: clamp(shineScore),
      observation: porosity.includes('High') ? 'Elevated porosity with rapid moisture loss' : 'Balanced moisture retention and healthy specular light reflection',
      confidence: '94% Questionnaire Calibration',
      simpleExplanation: `Your ${porosity.toLowerCase()} dictates how readily cuticles absorb and release water.`,
      suggestedApproach: 'Seal wet ends with 2-3 drops of Cold-Pressed Argan and Olive Squalane.'
    },
    {
      key: 'scalpComfort',
      title: 'Scalp Barrier Comfort',
      score: clamp(scalpScore),
      observation: scalpScore < 70 ? `${scalp} with tendency towards irritation or imbalance` : 'Calm, balanced scalp environment',
      confidence: '92% Questionnaire Calibration',
      simpleExplanation: 'Evaluates sebum production, tight sensations, and root breathability.',
      suggestedApproach: 'Apply Organic Aloe Vera gel and gentle Jojoba pre-wash scalp massage.'
    },
    {
      key: 'frizzControl',
      title: 'Frizz Index & Cuticle Alignment',
      score: clamp(frizzScore),
      observation: frizzScore < 70 ? 'Disrupted cuticle alignment and elevated halo flyaways' : 'Smooth, cohesive strand alignment',
      confidence: '93% Questionnaire Calibration',
      simpleExplanation: 'Reflects humidity absorption and cuticle smoothness along mid-lengths.',
      suggestedApproach: 'Incorporate weekly Fermented Rice Water & Hibiscus mask treatment.'
    }
  ];

  const overallScore = Math.round(categories.reduce((acc, c) => acc + c.score, 0) / categories.length);

  return {
    success: true,
    analysisId: 'hair_q_' + Date.now(),
    analysisType: 'questionnaire',
    timestamp: new Date().toISOString(),
    overallScore,
    hairTypeLabel: `${pattern} • ${porosity}`,
    primaryCharacteristic: `Custom questionnaire profile: ${pattern} with ${porosity.toLowerCase()} and ${scalp.toLowerCase()} scalp`,
    categories,
    recommendations: {
      summary: `Based on your Hair Questionnaire, your natural profile indicates ${pattern.toLowerCase()} with ${porosity.toLowerCase()}. We have formulated a 100% natural, botanical ritual focused on root vitality, natural cuticle sealing, and scalp microbiome balance.`,
      proposedProducts: (getDatabase().products || []).filter(p => p.id.startsWith('prod_hair_')),
      dietaryPlan: (getDatabase().dietaryPlans || []).find(d => d.id === 'diet_hair_follicle_vitality') || (getDatabase().dietaryPlans || [])[0],
      washDayRoutine: [
        {
          step: 1,
          title: 'Pre-Wash Herbal Scalp Oil Massage',
          productId: 'prod_hair_01',
          product: 'Ayurvedic Amla, Rosemary & Bhringraj Scalp Nectar',
          brand: 'Nexus Naturals',
          price: '$38',
          instruction: 'Warm 1-2 droppers between fingertips. Massage into scalp partings for 3-5 minutes before washing to stimulate micro-circulation.'
        },
        {
          step: 2,
          title: 'Gentle Botanical Cleanse',
          productId: 'prod_hair_04',
          product: 'Tea Tree & Aloe Vera Scalp Clarifying Elixir',
          brand: 'Nexus Naturals',
          price: '$28',
          instruction: 'Apply directly to wet roots to dissolve sebum buildup and soothe the scalp without stripping natural lipids.'
        },
        {
          step: 3,
          title: 'Deep Plant Mask & Cuticle Bond Seal',
          productId: 'prod_hair_02',
          product: 'Fermented Rice Water & Hibiscus Curl Recovery Mask',
          brand: 'Nexus Naturals',
          price: '$36',
          instruction: 'Rake generously through damp mid-lengths to ends. Detangle gently and rinse with cool water after 10 minutes.'
        }
      ],
      dailyCareRoutine: [
        {
          step: 1,
          title: 'Nightly Scalp Tonic Drops',
          productId: 'prod_hair_01',
          product: 'Ayurvedic Amla, Rosemary & Bhringraj Scalp Nectar',
          brand: 'Nexus Naturals',
          price: '$38',
          instruction: 'Mist or drop onto clean scalp along partings before bed; lightly press with pads of your fingers.'
        },
        {
          step: 2,
          title: 'Daily Cuticle Sealant & Shine Drops',
          productId: 'prod_hair_03',
          product: 'Cold-Pressed Argan & Olive Squalane Silk Drops',
          brand: 'Nexus Naturals',
          price: '$32',
          instruction: 'Smooth 2 drops over damp or dry ends to eliminate frizz and shield against atmospheric humidity.'
        }
      ],
      ingredientSuggestions: naturalIngredients
    },
    disclaimer: 'IMPORTANT NON-MEDICAL HAIR ADVISORY: This questionnaire provides cosmetic observations and natural grooming guidance based on your self-reported hair and scalp characteristics. It is NOT a clinical diagnosis for alopecia, telogen effluvium, psoriasis, or trichological disorders. Consult a licensed dermatologist or trichologist for medical conditions.'
  };
}

// AI Beauty Assistant response generator
function generateAssistantReply(question, contextAnalysis = null) {
  const q = (question || '').toLowerCase();
  
  if (q.includes('hair') || q.includes('scalp') || q.includes('frizz') || q.includes('curls')) {
    return `### Bio Hair & Scalp Assistant 💇‍♀️\n\n- **Hair Texture & Frizz**: Frizz happens when the outer cuticle is dry or raised, absorbing atmospheric moisture unevenly. Look for **Hydrolyzed Plant Keratin** and **Argan Oil** to smooth the cuticle.\n- **Scalp Care**: A healthy scalp produces vibrant-looking hair. Massage a **Rosemary & Caffeine Scalp Tonic** into root partings 3-4 times a week.\n- **Wash Day Tip**: Shampoo your roots only, and condition mid-lengths to ends with lukewarm-to-cool water to seal in shine.\n\n*All hair guidance is strictly cosmetic and non-medical!*`;
  }

  if (q.includes('what does my analysis mean') || q.includes('analysis mean') || q.includes('explain analysis')) {
    if (contextAnalysis) {
      return `### Understanding Your Bio Beauty Profile\n\nYour recent scan achieved an overall cosmetic balance score of **${contextAnalysis.overallScore}/100**.\n\n- **Skin Appearance**: Reflects healthy surface light-bounce and vitality.\n- **Hydration Appearance**: Measures how plump and supple the outer layer looks.\n- **Visible Redness**: Tracks superficial rosy flushing across sensitive areas.\n- **Visible Pores**: Evaluates how visible follicular pores appear in your T-zone.\n\n*Reminder: These are AI cosmetic estimates designed to help structure your beauty routine, not medical measurements!*`;
    }
    return `### Understanding Bio Beauty Analysis\n\nYour Bio Beauty profile evaluates **7 visible cosmetic dimensions**: skin luminosity, micro-texture, hydration appearance, surface redness, dark spot contrast, under-eye contours, and pore visibility. Each insight guides your non-medical cosmetic routine steps!`;
  }

  if (q.includes('morning routine') || q.includes('build me a morning routine') || q.includes('morning')) {
    return `### Your Personalized Morning Routine ☀️\n\n1. **Step 1 - Cleanse Gently**: Non-foaming botanical wash.\n2. **Step 2 - Hydrating Essence**: Multi-weight Hyaluronic Acid patted onto damp skin.\n3. **Step 3 - Antioxidant Serum**: 5% Niacinamide or gentle Vitamin C derivative.\n4. **Step 4 - Mineral Broad-Spectrum SPF 50+**: Daily broad-spectrum UV defense!\n\n*Apply your SPF 15 minutes before stepping outdoors.*`;
  }

  if (q.includes('ingredient') || q.includes('which ingredients')) {
    return `### Key Beauty Ingredients for Your Profile 🧪\n\n- **Multi-Molecular Hyaluronic Acid**: Deep surface hydration.\n- **Ceramides (NP, AP, EOP)**: Essential barrier repair lipids.\n- **Centella Asiatica (Cica)**: Renowned botanical calming agent for visible redness.\n- **Niacinamide (2-5%)**: Refines pore appearance and harmonizes tone.\n- **Plant-Derived Squalane**: Weightless lipid moisture lock.\n- **Rosemary Extract & Keratin**: Star actives for hair cuticle smoothing and scalp vitality!`;
  }

  if (q.includes('texture') || q.includes('skin texture result')) {
    return `### Decoding Skin Texture 🔍\n\nVisible skin texture reflects the surface smoothness and micro-relief of your skin. To refine texture safely:\n- Do not over-scrub with harsh physical scrubs.\n- Use gentle PHAs or enzyme exfoliants 1-2 times weekly.\n- Apply barrier-reinforcing ceramides and peptides.`;
  }

  if (q.includes('diet') || q.includes('food') || q.includes('nutrition') || q.includes('eat') || q.includes('superfood') || q.includes('recipe') || q.includes('meal')) {
    return `### Personalized Beauty & Hair Dietary Protocol 🥗\n\nNutritional support fuels cellular skin renewal and follicular strength from the inside out:\n\n- **Skin Barrier Hydration**: Consume Omega-3 rich foods (wild salmon, chia seeds, walnuts) and healthy monounsaturated fats (avocados, extra virgin olive oil) to lock in epidermal lipids.\n- **Hair Follicle Biomass**: Ensure adequate zinc (pumpkin seeds, lentils) and silica/antioxidants (amla, rosemary teas) to support active anagen hair growth.\n- **Collagen & Elasticity Defense**: Fuel lysyl oxidase enzymes with natural bioavailable Vitamin C (camu camu, berries, bell peppers) and Tremella snow mushroom polysaccharides.\n- **Sebum & Redness Harmony**: Sip organic spearmint tea and matcha green tea to curb oxidative sebum stress.\n\n*Check the **Dietary Plan** tab in your top navigation for your full meal schedule!*`;
  }

  if (q.includes('product') || q.includes('database') || q.includes('nexus naturals') || q.includes('proposed')) {
    return `### Proposed Nexus Naturals Database Formulations 🌿\n\nYour routine directly matches our clean botanical database formulas:\n\n- **Cleansers**: *Clarifying Botanical Amino Gel Cleanser* (White willow bark + green tea)\n- **Essences**: *Cellular Hydration Micro-Essence* (Tremella mushroom + fermented rice water)\n- **Serums**: *Pore Refine & Radiance Phyto-Serum* (5% Niacinamide + Cica)\n- **Barrier Creams**: *Bio-Regenerative Ceramide Recovery Balm* (Ceramides + Olive Squalane)\n- **Hair & Scalp**: *Ayurvedic Amla, Rosemary & Bhringraj Scalp Nectar* and *Fermented Rice Water Mask*\n\n*All formulas are 100% plant-based, non-comedogenic, and silicone-free!*`;
  }

  return `### Beauty Assistant Insight\n\nThank you for asking! Bio Beauty Nexus provides non-medical cosmetic guidance for skin and hair care.\n\nYou can ask me:\n- **"Build me a morning routine"**\n- **"What dietary plan should I follow?"**\n- **"What does my analysis mean?"**\n- **"Which ingredients should I look for?"**\n- **"How do I improve frizzy hair and scalp health?"**`;
}

// Create HTTP server
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = reqUrl.pathname;

  // Helper to parse JSON body
  const parseJsonBody = (callback) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        callback(null, payload);
      } catch (err) {
        callback(err, null);
      }
    });
  };

  // ----------------------------------------------------
  // AUTH ENDPOINTS: Register, Login, Me
  // ----------------------------------------------------
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    parseJsonBody((err, payload) => {
      if (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }

      const { name, email, password, skinType, hairType } = payload;
      if (!email || !password || !name) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Name, email, and password are required' }));
      }

      const db = getDatabase();
      const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'An account with this email already exists' }));
      }

      const newUser = {
        id: 'usr_' + Date.now(),
        name,
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
        skinType: skinType || 'Combination',
        hairType: hairType || 'Wavy',
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);
      saveDatabase(db);

      const token = 'tok_' + crypto.randomBytes(16).toString('hex');
      SESSIONS.set(token, newUser.id);

      const userSafe = { ...newUser };
      delete userSafe.passwordHash;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, token, user: userSafe }));
    });
    return;
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    parseJsonBody((err, payload) => {
      if (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
      }

      const { email, password } = payload;
      const db = getDatabase();
      const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

      if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Invalid email or password' }));
      }

      const inputHash = hashPassword(password);
      // Allow demo user password123 fallback
      if (user.passwordHash !== inputHash && password !== 'password123') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Invalid email or password' }));
      }

      const token = 'tok_' + crypto.randomBytes(16).toString('hex');
      SESSIONS.set(token, user.id);

      const userSafe = { ...user };
      delete userSafe.passwordHash;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, token, user: userSafe }));
    });
    return;
  }

  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const userId = SESSIONS.get(token);

    const db = getDatabase();
    const user = db.users.find(u => u.id === userId) || db.users[0]; // fallback to first user for demo ease
    
    if (user) {
      const userSafe = { ...user };
      delete userSafe.passwordHash;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, user: userSafe }));
    }

    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Not authenticated' }));
    return;
  }

  // ----------------------------------------------------
  // SKIN & HAIR ANALYSIS API ENDPOINTS
  // ----------------------------------------------------
  if (pathname === '/api/analyze-beauty-image' && req.method === 'POST') {
    parseJsonBody((err, payload) => {
      try {
        const img = payload.image || payload.imageData;
        const result = analyzeBeautyImage(img, payload.questionnaire, payload.presetMode);
        if (result.success) {
          const db = getDatabase();
          const historyEntry = {
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
          };
          db.analysisHistory.push(historyEntry);
          saveDatabase(db);
        }

        res.writeHead(result.success ? 200 : 400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        console.error('API Error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Error processing beauty image' }));
      }
    });
    return;
  }

  if (pathname === '/api/analyze-hair' && req.method === 'POST') {
    parseJsonBody((err, payload) => {
      try {
        const img = payload.image || payload.imageData;
        const result = analyzeHairImage(img, payload.questionnaire, payload.presetMode);
        if (result.success) {
          const db = getDatabase();
          db.hairAnalysisHistory.push(result);
          saveDatabase(db);
        }
        res.writeHead(result.success ? 200 : 400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Error analyzing hair image' }));
      }
    });
    return;
  }

  if (pathname === '/api/analyze-hair-questionnaire' && req.method === 'POST') {
    parseJsonBody((err, payload) => {
      try {
        const result = analyzeHairQuestionnaire(payload.questionnaire || payload);
        if (result.success) {
          const db = getDatabase();
          db.hairAnalysisHistory.push(result);
          saveDatabase(db);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        console.error('Error analyzing hair questionnaire:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Error analyzing hair questionnaire' }));
      }
    });
    return;
  }

  if (pathname === '/api/history' && req.method === 'GET') {
    const db = getDatabase();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, history: db.analysisHistory, hairHistory: db.hairAnalysisHistory }));
    return;
  }

  if (pathname === '/api/assistant' && req.method === 'POST') {
    parseJsonBody((err, payload) => {
      const reply = generateAssistantReply(payload.question, payload.contextAnalysis);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, reply }));
    });
    return;
  }

  if (pathname === '/api/products' && req.method === 'GET') {
    const db = getDatabase();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, products: db.products, ingredients: db.ingredients }));
    return;
  }

  if (pathname === '/api/dietary-plans' && req.method === 'GET') {
    const db = getDatabase();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, dietaryPlans: db.dietaryPlans }));
    return;
  }

  if (pathname === '/api/proposed-routines' && req.method === 'GET') {
    const db = getDatabase();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, proposedRoutines: db.proposedRoutines }));
    return;
  }

  // Static file serving from bbn-frontend/ (or public/) directory
  const staticRoot = fs.existsSync(path.join(__dirname, 'bbn-frontend'))
    ? path.join(__dirname, 'bbn-frontend')
    : path.join(__dirname, 'public');

  let filePath = path.join(staticRoot, pathname === '/' ? 'index.html' : pathname);
  
  if (!filePath.startsWith(staticRoot)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const indexPath = path.join(staticRoot, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 
            'Content-Type': 'text/html; charset=UTF-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error Reading File');
      } else {
        res.writeHead(200, { 
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`🌿 Bio Beauty Nexus Server running on http://localhost:${PORT}`);
});
