export class BeautyAnalysis {
  constructor({ imageState, onComplete, onError }) {
    this.imageState = imageState;
    this.onComplete = onComplete;
    this.onError = onError;
    this.intervalId = null;
    this.scanType = imageState?.scanType || 'skin';
  }

  render() {
    const isSkin = this.scanType === 'skin';
    const container = document.createElement('div');
    container.className = 'scan-card glass-panel fade-in';
    container.innerHTML = `
      <div class="scan-animation-layout">
        <!-- Scan Viewport -->
        <div class="scan-viewport">
          <div class="scan-image-box">
            <img src="${this.imageState.imageData}" alt="Scanning..." class="scan-base-img" />
            
            <!-- Laser scanning beam -->
            <div class="scan-laser-beam ${!isSkin ? 'hair-laser-beam' : ''}"></div>
            
            <!-- Biometric matrix overlay -->
            <div class="biometric-matrix-grid"></div>

            ${isSkin ? `
              <!-- Pulsing Facial Landmarks -->
              <div class="landmark-node lm-forehead"><span class="lm-dot"></span><span class="lm-pulse"></span></div>
              <div class="landmark-node lm-tzone"><span class="lm-dot"></span><span class="lm-pulse"></span></div>
              <div class="landmark-node lm-cheek-l"><span class="lm-dot"></span><span class="lm-pulse"></span></div>
              <div class="landmark-node lm-cheek-r"><span class="lm-dot"></span><span class="lm-pulse"></span></div>
              <div class="landmark-node lm-undereye-l"><span class="lm-dot"></span><span class="lm-pulse"></span></div>
              <div class="landmark-node lm-undereye-r"><span class="lm-dot"></span><span class="lm-pulse"></span></div>
              <div class="landmark-node lm-chin"><span class="lm-dot"></span><span class="lm-pulse"></span></div>
            ` : `
              <!-- Hair & Scalp Landmarks -->
              <div class="landmark-node lm-crown"><span class="lm-dot hair-dot"></span><span class="lm-pulse hair-pulse"></span></div>
              <div class="landmark-node lm-parting"><span class="lm-dot hair-dot"></span><span class="lm-pulse hair-pulse"></span></div>
              <div class="landmark-node lm-strand-l"><span class="lm-dot hair-dot"></span><span class="lm-pulse hair-pulse"></span></div>
              <div class="landmark-node lm-strand-r"><span class="lm-dot hair-dot"></span><span class="lm-pulse hair-pulse"></span></div>
              <div class="landmark-node lm-ends"><span class="lm-dot hair-dot"></span><span class="lm-pulse hair-pulse"></span></div>
            `}

            <!-- Target Brackets -->
            <div class="bracket-tl"></div>
            <div class="bracket-tr"></div>
            <div class="bracket-bl"></div>
            <div class="bracket-br"></div>
          </div>
        </div>

        <!-- Telemetry & Progress Box -->
        <div class="scan-telemetry-box">
          <div class="bio-badge">
            <span class="pulse-dot"></span>
            ${isSkin ? 'BIO-OPTICAL SENSING IN PROGRESS' : 'HAIR FIBER ANALYSIS IN PROGRESS'}
          </div>

          <h2 class="scan-status-title">${isSkin ? 'Analyzing Visible Beauty Metrics' : 'Analyzing Visible Hair & Scalp Metrics'}</h2>
          <p class="scan-status-stage" id="scanStageLabel">
            ${isSkin ? 'Calibrating optical exposure & facial mesh alignment...' : 'Calibrating illumination and follicle parting alignment...'}
          </p>

          <div class="scan-progress-wrap">
            <div class="scan-bar-track">
              <div class="scan-bar-fill ${!isSkin ? 'hair-bar-fill' : ''}" id="scanBarFill" style="width: 12%;"></div>
            </div>
            <div class="scan-percentage" id="scanPercentText">12%</div>
          </div>

          <div class="telemetry-grid">
            <div class="telemetry-pill">
              <span class="tel-label">Scan Mode</span>
              <span class="tel-val">${isSkin ? 'Facial Skin' : 'Hair & Scalp'}</span>
            </div>
            <div class="telemetry-pill">
              <span class="tel-label">Target Zones</span>
              <span class="tel-val">${isSkin ? '7 Cosmetic Regions' : '5 Hair Zones'}</span>
            </div>
            <div class="telemetry-pill">
              <span class="tel-label">Safety Filter</span>
              <span class="tel-val text-success">Non-Medical Only</span>
            </div>
            <div class="telemetry-pill">
              <span class="tel-label">Optical Target</span>
              <span class="tel-val">${isSkin ? 'Epidermal Light-Bounce' : 'Cuticle Alignment'}</span>
            </div>
          </div>

          <div class="scan-safety-note">
            <span class="shield-dot"></span>
            Non-medical aesthetic observations only. No clinical or disease diagnosis is performed.
          </div>
        </div>
      </div>
    `;

    this.startScanSimulation(container, isSkin);
    return container;
  }

  startScanSimulation(container, isSkin) {
    const stageLabel = container.querySelector('#scanStageLabel');
    const barFill = container.querySelector('#scanBarFill');
    const percentText = container.querySelector('#scanPercentText');

    let progress = 10;
    const skinStages = [
      { at: 15, text: "Calibrating optical exposure & facial mesh alignment..." },
      { at: 35, text: "Evaluating visible skin texture and micro-relief..." },
      { at: 60, text: "Measuring superficial hydration light-bounce & shine..." },
      { at: 80, text: "Analyzing cosmetic redness & tone distribution..." },
      { at: 95, text: "Synthesizing personalized Bio Beauty Profile..." }
    ];

    const hairStages = [
      { at: 15, text: "Calibrating hair alignment and scalp parting illumination..." },
      { at: 35, text: "Mapping strand pattern and visible curl/wave micro-relief..." },
      { at: 60, text: "Measuring cuticle light reflection & moisture lustre..." },
      { at: 80, text: "Evaluating scalp parting comfort & surface flyaways..." },
      { at: 95, text: "Synthesizing personalized Bio Hair & Scalp Profile..." }
    ];

    const stages = isSkin ? skinStages : hairStages;

    this.intervalId = setInterval(() => {
      progress += Math.floor(Math.random() * 6) + 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(this.intervalId);
      }

      barFill.style.width = `${progress}%`;
      percentText.textContent = `${progress}%`;

      const matchedStage = stages.slice().reverse().find(s => progress >= s.at);
      if (matchedStage) {
        stageLabel.textContent = matchedStage.text;
      }
    }, 110);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
