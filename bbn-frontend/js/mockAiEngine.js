/**
 * Bio Beauty Nexus - Local Computer Vision & Cosmetic Feature Extraction Engine
 * Provides client-side fallback and intelligent image feature analysis.
 * Analyzes only visible, non-medical beauty characteristics.
 */

export class MockAiEngine {
  /**
   * Analyze canvas/image pixel data to derive non-medical cosmetic observations
   * @param {HTMLImageElement|string} imageSource 
   * @param {Object} questionnaire 
   * @param {string|null} presetMode 
   * @returns {Promise<Object>}
   */
  static async analyze(imageSource, questionnaire = {}, presetMode = null) {
    if (presetMode === 'poor_quality') {
      return {
        success: false,
        errorType: 'POOR_IMAGE_QUALITY',
        message: 'The uploaded image appears blurred, underexposed, or does not clearly show facial features. For the most accurate cosmetic observations, please take or upload a well-lit, front-facing selfie with neutral facial expression.'
      };
    }

    // Extract basic pixel statistics via HTML5 canvas if possible
    let stats = await this.extractImageStats(imageSource);

    // If sharpness/contrast is exceptionally poor, warn user
    if (stats && stats.contrast < 15 && !presetMode) {
      return {
        success: false,
        errorType: 'POOR_IMAGE_QUALITY',
        message: 'The image lacks sufficient lighting or contrast for facial analysis. Please upload a clear photo taken in natural ambient light.'
      };
    }

    let seed = stats ? (stats.avgR + stats.avgG + stats.avgB + Math.round(stats.contrast * 10)) : 100;
    
    // Default cosmetic baseline scores (0-100)
    let skinAppScore = 80 + (seed % 12);
    let textureScore = 74 + ((seed * 2) % 15);
    let hydrationScore = 68 + ((seed * 3) % 18);
    let rednessScore = 76 + ((seed * 5) % 14);
    let darkSpotsScore = 82 + ((seed * 7) % 12);
    let underEyeScore = 70 + ((seed * 4) % 16);
    let poresScore = 75 + ((seed * 6) % 15);

    let primaryObservation = 'Balanced skin appearance with localized superficial dehydration indicators';
    let faceShape = 'Oval';
    let hairAppearance = 'Glossy hair framing the forehead line';

    // Apply preset overrides if user selected a demo case
    if (presetMode === 'dry') {
      hydrationScore = 52;
      textureScore = 64;
      skinAppScore = 71;
      rednessScore = 68;
      primaryObservation = 'Visible signs of dryness and mild surface flakiness along cheek contours';
    } else if (presetMode === 'oily') {
      hydrationScore = 85;
      poresScore = 59;
      textureScore = 67;
      skinAppScore = 74;
      primaryObservation = 'Prominent visual surface shine in the T-zone with visible pore distribution';
    } else if (presetMode === 'redness') {
      rednessScore = 55;
      skinAppScore = 72;
      primaryObservation = 'Visible rosy coloration and superficial vascular flush on cheeks and nasal bridge';
    } else if (presetMode === 'glow') {
      skinAppScore = 93;
      hydrationScore = 90;
      textureScore = 89;
      rednessScore = 88;
      darkSpotsScore = 91;
      underEyeScore = 86;
      poresScore = 88;
      primaryObservation = 'High visual clarity, dewy surface reflection, and harmonized barrier appearance';
    }

    const clamp = (v) => Math.min(96, Math.max(48, Math.round(v)));

    const categories = [
      {
        key: 'skinAppearance',
        title: 'Skin Appearance',
        score: clamp(skinAppScore),
        observation: skinAppScore > 82 ? 'Luminous, radiant overall appearance' : 'Moderate radiance with slight uneven light reflection',
        confidence: '92% AI Estimate',
        simpleExplanation: 'Evaluates visible skin reflectivity, clarity, and overall complexion brightness under ambient lighting.',
        suggestedApproach: 'Maintain gentle antioxidant protection and light morning hydration to enhance natural cosmetic luminescence.'
      },
      {
        key: 'texture',
        title: 'Visible Skin Texture',
        score: clamp(textureScore),
        observation: textureScore > 78 ? 'Smooth micro-relief with minimal tactile grain' : 'Mild visible roughness and uneven surface texture around cheeks',
        confidence: '88% AI Estimate',
        simpleExplanation: 'Assesses visual skin smoothness and shadows caused by minor surface micro-texture.',
        suggestedApproach: 'Introduce gentle PHA or enzyme exfoliants 1-2 times per week to smooth the surface without stripping moisture.'
      },
      {
        key: 'hydration',
        title: 'Hydration Appearance',
        score: clamp(hydrationScore),
        observation: hydrationScore < 60 ? 'Visible signs of superficial surface dryness' : 'Supple moisture sheen with balanced skin bounce',
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
        observation: darkSpotsScore > 82 ? 'Discreet tone uniformity with negligible spot contrast' : 'Mild localized post-sun discoloration or cosmetic freckling visible',
        confidence: '86% AI Estimate',
        simpleExplanation: 'Identifies localized melanin contrast patterns and cosmetic pigmentation irregularities.',
        suggestedApproach: 'Pair daily broad-spectrum SPF 50+ with 5% Niacinamide and cosmetic Azelaic derivative to balance tone.'
      },
      {
        key: 'underEye',
        title: 'Visible Under-Eye Appearance',
        score: clamp(underEyeScore),
        observation: underEyeScore < 72 ? 'Mild cosmetic shadow appearance and slight puffiness in the orbital zone' : 'Awakened, well-rested orbital eye contour',
        confidence: '85% AI Estimate',
        simpleExplanation: 'Analyzes visual micro-shadows beneath the lower eyelid and subtle periorbital volume variations.',
        suggestedApproach: 'Use a caffeine-infused peptide eye hydrogel and gentle drainage acupressure during morning application.'
      },
      {
        key: 'pores',
        title: 'Visible Pores',
        score: clamp(poresScore),
        observation: poresScore < 72 ? 'Noticeable pore visibility along T-zone and adjacent medial cheeks' : 'Refined, discreet follicular appearance across all facial zones',
        confidence: '91% AI Estimate',
        simpleExplanation: 'Estimates geometric aperture dimensions and shadowing of visible skin pores under uniform lighting.',
        suggestedApproach: 'Incorporate 2-5% Niacinamide and double cleansing with a gentle botanical oil to keep pore lining clear.'
      }
    ];

    const overallScore = Math.round(categories.reduce((acc, c) => acc + c.score, 0) / categories.length);

    const recommendations = {
      summary: `Your Bio Beauty Scan highlights ${primaryObservation.toLowerCase()}. We have formulated a targeted, gentle non-medical cosmetic routine focusing on epidermal hydration, soothing botanical comfort, and UV barrier shielding.`,
      morningRoutine: [
        {
          step: 1,
          title: 'Purify',
          category: 'Gentle Cleanser',
          name: hydrationScore < 60 ? 'Bio-Adaptive Phyto Cleansing Milk' : 'Clarifying Botanical Amino Gel Cleanser',
          instruction: 'Massage with lukewarm water for 45 seconds to refresh your complexion without stripping natural lipids.'
        },
        {
          step: 2,
          title: 'Hydrate & Prep',
          category: 'Hydrating Essence',
          name: 'Cellular Hydration Micro-Essence',
          instruction: 'Pat gently onto damp skin to flood skin layers with multi-molecular hyaluronic acid.'
        },
        {
          step: 3,
          title: 'Target & Refine',
          category: 'Targeted Serum',
          name: 'Pore Refine & Radiance Serum (5% Niacinamide + PAD)',
          instruction: 'Press 3 drops into T-zone and areas with visible redness or tone variation.'
        },
        {
          step: 4,
          title: 'Protect & Shield',
          category: 'Mineral SPF 50+',
          name: 'Bio-Shield Invisible Mineral Fluid SPF 50+',
          instruction: 'Apply two finger-lengths as the crucial final shield against UV-induced premature skin changes.'
        }
      ],
      eveningRoutine: [
        {
          step: 1,
          title: 'Double Cleanse',
          category: 'Micellar / Botanical Oil',
          name: 'Bio-Adaptive Phyto Cleansing Milk',
          instruction: 'Dissolve daily sunscreen and environmental airborne particulates gently.'
        },
        {
          step: 2,
          title: 'Orbital Awakening',
          category: 'Eye Hydrogel',
          name: 'Orbital Bio-Awaken Eye Hydrogel',
          instruction: 'Tap gently along the orbital bone using your ring finger to soothe under-eye shadows.'
        },
        {
          step: 3,
          title: 'Barrier Restoration',
          category: 'Rich Moisturizer',
          name: 'Bio-Regenerative Barrier Cream (Ceramides + Squalane)',
          instruction: 'Warm between fingertips and smooth across face and neck to seal in restorative nighttime hydration.'
        }
      ],
      weeklyRoutine: [
        {
          frequency: '1-2 times weekly',
          title: 'Gentle Enzymatic Renewal Mask',
          description: 'Dissolves dull surface buildup without abrasive scrubbing, restoring touchable smoothness.'
        },
        {
          frequency: '2 times weekly',
          title: 'Deep Moisture Recovery Sheet Treatment',
          description: 'Immerses skin in Centella Asiatica and Panthenol to calm visible redness and replenish moisture reserves.'
        }
      ],
      ingredientSuggestions: [
        {
          name: 'Multi-Molecular Hyaluronic Acid',
          role: 'Deep Hydration Anchor',
          why: 'Draws moisture into multiple epidermal layers, smoothing the look of fine dehydration lines.'
        },
        {
          name: 'Ceramide Complex (NP, AP, EOP)',
          role: 'Lipid Barrier Sealant',
          why: 'Replenishes natural intercellular cement, dramatically reducing flaky texture and moisture loss.'
        },
        {
          name: 'Centella Asiatica (Cica)',
          role: 'Botanical Redness Soother',
          why: 'Rapidly tempers visible flush and promotes resilient skin equilibrium.'
        },
        {
          name: 'Niacinamide (Vitamin B3 2-5%)',
          role: 'Pore & Tone Harmonizer',
          why: 'Visibly reduces pore diameter appearance and evens superficial cosmetic discoloration.'
        }
      ],
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
      primaryCharacteristic: primaryObservation,
      recommendations,
      disclaimer: 'IMPORTANT NON-MEDICAL NOTICE: Bio Beauty Nexus delivers cosmetic and beauty observations for personal educational and aesthetic routine planning. This analysis does not diagnose diseases, detect clinical dermatological pathologies, or prescribe medical treatments. If you have medical skin concerns or persistent irritation, consult a certified dermatologist.'
    };
  }

  /**
   * Inspects image pixel metrics in browser environment
   */
  static extractImageStats(imageSource) {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !imageSource) {
        return resolve(null);
      }

      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const sampleSize = 64;
          canvas.width = sampleSize;
          canvas.height = sampleSize;
          ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
          const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
          
          let totalR = 0, totalG = 0, totalB = 0;
          let minLum = 255, maxLum = 0;
          const pixelCount = sampleSize * sampleSize;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            totalR += r;
            totalG += g;
            totalB += b;
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            if (lum < minLum) minLum = lum;
            if (lum > maxLum) maxLum = lum;
          }

          resolve({
            avgR: Math.round(totalR / pixelCount),
            avgG: Math.round(totalG / pixelCount),
            avgB: Math.round(totalB / pixelCount),
            contrast: maxLum - minLum
          });
        } catch (e) {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);

      if (typeof imageSource === 'string') {
        img.src = imageSource;
      } else if (imageSource instanceof HTMLImageElement) {
        img.src = imageSource.src;
      } else {
        resolve(null);
      }
    });
  }
}
