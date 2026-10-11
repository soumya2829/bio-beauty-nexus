export class ImagePreview {
  constructor({ imageState, onAnalyze, onRetake }) {
    this.imageState = imageState;
    this.onAnalyze = onAnalyze;
    this.onRetake = onRetake;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'preview-card glass-panel fade-in';
    
    const isSafetyTest = this.imageState.presetMode === 'poor_quality';

    container.innerHTML = `
      <div class="preview-layout">
        <!-- Visual Column -->
        <div class="preview-image-wrapper">
          <div class="preview-frame">
            <img src="${this.imageState.imageData}" alt="Preview" class="preview-img" />
            <div class="preview-reticle-overlay">
              <div class="reticle-corner top-left"></div>
              <div class="reticle-corner top-right"></div>
              <div class="reticle-corner bottom-left"></div>
              <div class="reticle-corner bottom-right"></div>
              <div class="biometric-center-target"></div>
            </div>
            ${isSafetyTest ? `
              <div class="blur-warning-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span>Low Clarity Demo Sample</span>
              </div>
            ` : ''}
          </div>
          <span class="preview-image-label">${this.imageState.title || 'Selected Image'}</span>
        </div>

        <!-- Info & Controls Column -->
        <div class="preview-controls-wrapper">
          <div class="bio-badge">
            <span class="pulse-dot"></span>
            IMAGE CALIBRATION READY
          </div>
          
          <h2 class="preview-title">Ready for Bio-Cosmetic Analysis</h2>
          <p class="preview-desc">
            Our multi-spectral computer vision pipeline will assess 7 visible cosmetic dimensions to generate your personalized routine.
          </p>

          <div class="quality-checklist">
            <div class="checklist-item">
              <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              <span>Facial framing & optical positioning aligned</span>
            </div>
            <div class="checklist-item">
              <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              <span>Ambient illumination calibrated for visible texture analysis</span>
            </div>
            <div class="checklist-item">
              <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              <span>Cosmetic non-medical observation parameters enabled</span>
            </div>
          </div>

          <div class="safety-compact-notice">
            <strong>Important Safety Notice:</strong> Results are cosmetic observations only and do not constitute dermatological diagnosis or medical health certainty.
          </div>

          <div class="preview-actions">
            <button type="button" class="btn btn-primary btn-lg glow-pulse" id="btnAnalyze">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
                <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
              </svg>
              Analyze My Image
            </button>

            <button type="button" class="btn btn-secondary" id="btnRetake">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              Choose Different Image
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#btnAnalyze').addEventListener('click', () => {
      this.onAnalyze();
    });

    container.querySelector('#btnRetake').addEventListener('click', () => {
      this.onRetake();
    });

    return container;
  }
}
