import { API } from '../api.js';

export class AnalysisTimeline {
  constructor({ onSelectScan }) {
    this.onSelectScan = onSelectScan;
    this.historyList = [];
    this.selectedScanIndex = 0;
  }

  async loadHistory() {
    this.historyList = await API.fetchHistory();
    this.selectedScanIndex = Math.max(0, this.historyList.length - 1);
  }

  async render() {
    await this.loadHistory();

    const container = document.createElement('div');
    container.className = 'timeline-container fade-in';
    this.updateContent(container);
    return container;
  }

  updateContent(container) {
    const list = this.historyList;
    const current = list[this.selectedScanIndex] || list[list.length - 1];

    if (!current) {
      container.innerHTML = `<div class="glass-panel">No historical scans recorded yet. Complete an AI Beauty Scan to start your timeline!</div>`;
      return;
    }

    // Timeline navigation dots/steps
    const timelineStepsHtml = list.map((item, idx) => {
      const isActive = idx === this.selectedScanIndex;
      return `
        <button type="button" class="timeline-step-btn ${isActive ? 'active' : ''}" data-index="${idx}">
          <span class="step-circle ${isActive ? 'pulse' : ''}">${idx + 1}</span>
          <span class="step-label">${item.monthLabel || new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          <span class="step-score-pill">${item.overallScore} PTS</span>
        </button>
      `;
    }).join(`
      <div class="timeline-arrow-divider">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    `);

    // Metrics for selected scan
    const m = current.metrics || {};
    const skinScore = m.skinAppearance?.score || 80;
    const textureScore = m.texture?.score || 75;
    const hydrationScore = m.hydration?.score || 70;
    const rednessScore = m.redness?.score || 72;
    const poresScore = m.pores?.score || 74;

    container.innerHTML = `
      <div class="timeline-card glass-panel">
        <div class="timeline-header">
          <div class="bio-badge">
            <span class="pulse-dot"></span>
            LONGITUDINAL BEAUTY TIMELINE
          </div>
          <h2>Cosmetic Progress & Evolution Over Time</h2>
          <p class="timeline-desc">
            Track how your visible cosmetic characteristics, hydration sheen, and surface texture visual grain fluctuate across months.
          </p>
        </div>

        <!-- Timeline Step Bar: Sep 2026 -> Oct 2026 -> Nov 2026 -->
        <div class="timeline-nav-bar">
          ${timelineStepsHtml}
        </div>

        <!-- Detail Snapshot Card for selected month -->
        <div class="timeline-detail-view glass-panel">
          <div class="detail-header-row">
            <div>
              <span class="detail-date-badge">${current.monthLabel || 'Scan'}</span>
              <h3 class="detail-title">${current.summary}</h3>
            </div>
            <div class="detail-score-circle">
              <span class="score-val">${current.overallScore}</span>
              <span class="score-label">Cosmetic Score</span>
            </div>
          </div>

          <!-- Trend Bar Graph Comparison -->
          <div class="trend-bars-grid">
            <div class="trend-bar-item">
              <div class="bar-header">
                <span>Skin Appearance / Luminosity</span>
                <strong>${skinScore}/100</strong>
              </div>
              <div class="bar-track">
                <div class="bar-fill fill-glow" style="width: ${skinScore}%;"></div>
              </div>
            </div>

            <div class="trend-bar-item">
              <div class="bar-header">
                <span>Texture Smoothness Micro-Relief</span>
                <strong>${textureScore}/100</strong>
              </div>
              <div class="bar-track">
                <div class="bar-fill fill-texture" style="width: ${textureScore}%;"></div>
              </div>
            </div>

            <div class="trend-bar-item">
              <div class="bar-header">
                <span>Hydration Appearance Suppleness</span>
                <strong>${hydrationScore}/100</strong>
              </div>
              <div class="bar-track">
                <div class="bar-fill fill-hydration" style="width: ${hydrationScore}%;"></div>
              </div>
            </div>

            <div class="trend-bar-item">
              <div class="bar-header">
                <span>Visible Redness Equanimity</span>
                <strong>${rednessScore}/100</strong>
              </div>
              <div class="bar-track">
                <div class="bar-fill fill-redness" style="width: ${rednessScore}%;"></div>
              </div>
            </div>

            <div class="trend-bar-item">
              <div class="bar-header">
                <span>Pore Harmonization Index</span>
                <strong>${poresScore}/100</strong>
              </div>
              <div class="bar-track">
                <div class="bar-fill fill-pores" style="width: ${poresScore}%;"></div>
              </div>
            </div>
          </div>

          <!-- Qualitative Observations Comparison -->
          <div class="timeline-observations-box">
            <div class="obs-item">
              <strong>Recorded Focus:</strong>
              <p>${current.keyRecommendations || 'Maintain gentle daily routine with broad-spectrum SPF 50+ and barrier support.'}</p>
            </div>
            <div class="obs-item">
              <strong>Face & Hair Note:</strong>
              <p>${current.faceShape || 'Oval contour'} • ${current.hairAppearance || 'Visible healthy hair'}</p>
            </div>
          </div>
        </div>

        <!-- Safety Notice Regarding Historical Evolution -->
        <div class="safety-advisory-banner">
          <svg class="advisory-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
          <div class="advisory-text">
            <strong>Cosmetic Change Clarification:</strong> Changes over time reflect visible aesthetic variations, photographic illumination, and skincare consistency. They do not represent medical cures, clinical efficacy trials, or physiological pathology changes.
          </div>
        </div>
      </div>
    `;

    // Attach step click events
    container.querySelectorAll('.timeline-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        this.selectedScanIndex = idx;
        this.updateContent(container);
      });
    });
  }
}
