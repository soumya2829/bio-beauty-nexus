# 🌿 Bio Beauty Nexus - AI-Powered Beauty Image Analysis Platform

An advanced, biotechnology-inspired web application for non-medical cosmetic facial analysis, personalized skincare routine generation, and interactive AI beauty guidance.

---

## 🌟 Core Features

1. **AI Beauty Scan**:
   - **Upload Image**: Drag-and-drop or select any clear selfie (JPEG, PNG, WEBP).
   - **Camera Capture**: Live webcam/smartphone camera capture with interactive face-alignment oval guide.
   - **Demo Presets**: Instant one-click test cases (Balanced Radiance, Visible Dryness, Oily T-Zone, Rosy/Redness, and Poor Image Quality Safety Rejection test).
   - **Facial Scan Animation**: Real-time holographic scan beam, biometric facial landmarks, and progressive telemetry indicators.

2. **Visible Non-Medical Characteristics Analyzed**:
   - **Skin Appearance** (radiance, clarity, vitality)
   - **Visible Skin Texture** (micro-relief, smoothness)
   - **Hydration Appearance** (moisture sheen, visible dryness/flakiness)
   - **Visible Redness** (superficial flush, rosy hue across cheeks & nose)
   - **Visible Dark-Spot Appearance** (tone uniformity, cosmetic contrast)
   - **Visible Under-Eye Appearance** (shadows, orbital contour)
   - **Visible Pores** (follicular aperture visibility across T-zone)
   - **Face Shape & Hair Appearance**

3. **Results UI - “Your Bio Beauty Profile”**:
   - Overall Bio Beauty Score with circular SVG gauge indicators.
   - Breakdown for all 7 cosmetic categories showing:
     - **Observation**
     - **Confidence Level** (clearly marked as AI estimates)
     - **Simple Explanation**
     - **Suggested Beauty-Care Approach**

4. **Personalized Skincare Recommendations**:
   - **Morning Defense Routine** (Step-by-step: Cleanser, Hydrating Essence, Targeted Serum, Mineral SPF 50+)
   - **Evening Recovery Routine** (Double cleanse, orbital eye care, ceramide barrier restoration)
   - **Weekly Rhythm** (Enzymatic masks, deep moisture recovery treatments)
   - **Ingredient Suggestions** (Multi-molecular Hyaluronic Acid, Ceramides, Centella Asiatica, Niacinamide, Squalane)
   - **Product Category Guide**

5. **AI Beauty Assistant**:
   - Interactive chat interface with quick action prompt chips:
     - *“What does my analysis mean?”*
     - *“Build me a morning routine.”*
     - *“Which ingredients should I look for?”*
     - *“Explain my skin texture result.”*
     - *“How can I improve my beauty routine?”*
   - Free-form conversation contextually grounded in the user's latest scan results.

6. **Analysis History & Timeline Comparison**:
   - Monthly progression timeline (e.g., September 2026 → October 2026 → November 2026).
   - Side-by-side cosmetic trend indicators without claiming medical improvement.

7. **Skincare Questionnaire Integration**:
   - Skin type, primary goals, sensitivity level, age group, climate, and lifestyle factors saved and factored into recommendations.

---

## 🛡️ Medical Safety & Compliance

- **Cosmetic Observations Only**: Strictly avoids medical, dermatological, or disease diagnoses.
- **No Diagnostic Claims**: Results are labeled as cosmetic AI estimates.
- **No Prescription Recommendations**: Exclusively suggests cosmetic products and over-the-counter skincare actives.
- **Image Quality Filtering**: Flags blurred or underexposed images with clear photography guidance.

---

## 🚀 Getting Started

### Method 1: Run with Node.js Server (Recommended)
The built-in Node server has **zero external npm dependencies** (uses Node.js built-in `http`, `fs`, `path`, `crypto`).

```bash
# In the project directory:
node server.js
```
Then open your browser at:
`http://localhost:3000`

### Method 2: Direct Browser Launch (Standalone Mode)
You can also directly open `public/index.html` in any modern web browser. The application includes a resilient client-side fallback engine (`MockAiEngine`) and local storage persistence.

---

## 🔌 API Specification

### `POST /api/analyze-beauty-image`
Accepts an image payload and returns structured cosmetic analysis data.

**Request Payload:**
```json
{
  "image": "data:image/jpeg;base64,...",
  "questionnaire": {
    "skinType": "Combination",
    "mainConcern": "Hydration & Glow",
    "sensitivity": "Mildly Sensitive"
  },
  "presetMode": null
}
```

**Response (Success):**
```json
{
  "success": true,
  "analysisId": "scan_1727414400000",
  "timestamp": "2026-09-27T10:50:00.000Z",
  "overallScore": 82,
  "categories": [
    {
      "key": "skinAppearance",
      "title": "Skin Appearance",
      "score": 85,
      "observation": "Luminous, radiant overall appearance",
      "confidence": "92% AI Estimate",
      "simpleExplanation": "Evaluates visible skin reflectivity and clarity under ambient lighting.",
      "suggestedApproach": "Maintain gentle antioxidant protection and light morning hydration."
    }
  ],
  "faceShape": "Oval",
  "hairAppearance": "Visible healthy brown hair",
  "primaryCharacteristic": "Balanced skin appearance with localized superficial dehydration",
  "recommendations": { ... },
  "disclaimer": "IMPORTANT NON-MEDICAL NOTICE: Bio Beauty Nexus delivers cosmetic observations..."
}
```

**Response (Poor Quality Rejection):**
```json
{
  "success": false,
  "errorType": "POOR_IMAGE_QUALITY",
  "message": "The uploaded image appears blurred, underexposed, or does not clearly show facial features..."
}
```

### Other Endpoints:
- `GET /api/history` - Retrieve scan timeline history
- `POST /api/assistant` - Conversational endpoint for beauty assistant
- `GET /api/products` - Curated product & ingredient encyclopedia

---

## 🔮 Connecting a Real AI / Computer Vision API

To connect an external computer vision service (e.g. Google Cloud Vision API, Vertex AI, MediaPipe Face Mesh, or custom PyTorch/ONNX model):
1. In `server.js`, locate the `analyzeBeautyImage` function.
2. Replace or augment the pixel heuristic feature extraction with your remote model call:
   ```javascript
   // Example Vertex AI / Vision API call:
   const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
     method: 'POST',
     headers: { 'Authorization': `Bearer ${process.env.GCP_TOKEN}` },
     body: JSON.stringify({ ... })
   });
   ```
3. Map the returned face landmarks, skin tone luminance, and texture variance into the established 7 cosmetic category format.
