import { API } from '../api.js';

export class UserBeautyProfile {
  constructor({ onProfileUpdated }) {
    this.onProfileUpdated = onProfileUpdated;
    this.profile = API.getUserProfile();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'profile-container fade-in';
    container.innerHTML = `
      <div class="profile-card glass-panel">
        <div class="profile-header">
          <div class="bio-badge">
            <span class="pulse-dot"></span>
            QUESTIONNAIRE & BIO-PREFERENCES
          </div>
          <h2>Your Skincare Questionnaire & Profile</h2>
          <p class="profile-desc">
            Personalize the AI Recommendation Engine by matching your visible facial scan with your lifestyle, climate, and sensitivity preferences.
          </p>
        </div>

        <form id="profileForm" class="profile-form">
          <div class="form-grid">
            <!-- Skin Type -->
            <div class="form-group">
              <label for="skinType">Self-Identified Skin Type</label>
              <select id="skinType" class="form-select">
                <option value="Dry" ${this.profile.skinType === 'Dry' ? 'selected' : ''}>Dry (Tight, prone to flaking)</option>
                <option value="Combination" ${this.profile.skinType === 'Combination' ? 'selected' : ''}>Combination (Oily T-zone, normal/dry cheeks)</option>
                <option value="Oily" ${this.profile.skinType === 'Oily' ? 'selected' : ''}>Oily (Uniform shine, prominent pores)</option>
                <option value="Normal" ${this.profile.skinType === 'Normal' ? 'selected' : ''}>Normal (Well-balanced moisture)</option>
              </select>
            </div>

            <!-- Primary Goal -->
            <div class="form-group">
              <label for="mainConcern">Primary Aesthetic Goal</label>
              <select id="mainConcern" class="form-select">
                <option value="Hydration & Glow" ${this.profile.mainConcern === 'Hydration & Glow' ? 'selected' : ''}>Hydration & Natural Glow</option>
                <option value="Pore Refinement" ${this.profile.mainConcern === 'Pore Refinement' ? 'selected' : ''}>Pore Refinement & Oil Balance</option>
                <option value="Redness Soothing" ${this.profile.mainConcern === 'Redness Soothing' ? 'selected' : ''}>Redness Soothing & Barrier Comfort</option>
                <option value="Texture Smoothing" ${this.profile.mainConcern === 'Texture Smoothing' ? 'selected' : ''}>Texture Smoothing & Elasticity</option>
                <option value="Tone Radiance" ${this.profile.mainConcern === 'Tone Radiance' ? 'selected' : ''}>Tone Radiance & Dark Spot Evening</option>
              </select>
            </div>

            <!-- Sensitivity -->
            <div class="form-group">
              <label for="sensitivity">Sensitivity Level</label>
              <select id="sensitivity" class="form-select">
                <option value="Resilient" ${this.profile.sensitivity === 'Resilient' ? 'selected' : ''}>Resilient (Rarely experiences stinging or flushing)</option>
                <option value="Mildly Sensitive" ${this.profile.sensitivity === 'Mildly Sensitive' ? 'selected' : ''}>Mildly Sensitive (Occasional redness with new actives)</option>
                <option value="Highly Reactive" ${this.profile.sensitivity === 'Highly Reactive' ? 'selected' : ''}>Highly Reactive (Prone to irritation, needs fragrance-free)</option>
              </select>
            </div>

            <!-- Age Range -->
            <div class="form-group">
              <label for="ageGroup">Age Group</label>
              <select id="ageGroup" class="form-select">
                <option value="18-24" ${this.profile.ageGroup === '18-24' ? 'selected' : ''}>18 - 24</option>
                <option value="25-34" ${this.profile.ageGroup === '25-34' ? 'selected' : ''}>25 - 34</option>
                <option value="35-44" ${this.profile.ageGroup === '35-44' ? 'selected' : ''}>35 - 44</option>
                <option value="45+" ${this.profile.ageGroup === '45+' ? 'selected' : ''}>45+</option>
              </select>
            </div>

            <!-- Climate -->
            <div class="form-group">
              <label for="climate">Local Climate Environment</label>
              <select id="climate" class="form-select">
                <option value="Temperate / Urban" ${this.profile.climate === 'Temperate / Urban' ? 'selected' : ''}>Temperate / Urban</option>
                <option value="Dry / Arid" ${this.profile.climate === 'Dry / Arid' ? 'selected' : ''}>Dry / Arid / Desert</option>
                <option value="Humid / Tropical" ${this.profile.climate === 'Humid / Tropical' ? 'selected' : ''}>Humid / Tropical</option>
                <option value="Cold / Dry Winters" ${this.profile.climate === 'Cold / Dry Winters' ? 'selected' : ''}>Cold / Dry Winters</option>
              </select>
            </div>

            <!-- Lifestyle Factor -->
            <div class="form-group">
              <label for="lifestyle">Daily Lifestyle Factor</label>
              <select id="lifestyle" class="form-select">
                <option value="Screen-focused / Active" ${this.profile.lifestyle === 'Screen-focused / Active' ? 'selected' : ''}>Screen-focused / High Blue Light</option>
                <option value="Outdoor / Sun Exposure" ${this.profile.lifestyle === 'Outdoor / Sun Exposure' ? 'selected' : ''}>Outdoor / Frequent Sun Exposure</option>
                <option value="Frequent Traveler / Air Conditioning" ${this.profile.lifestyle === 'Frequent Traveler / Air Conditioning' ? 'selected' : ''}>Frequent Air Conditioning / Travel</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" id="btnSaveProfile">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save Profile & Recalibrate Recommendations
            </button>
            <span class="save-toast hidden" id="saveToast">✓ Profile preferences updated!</span>
          </div>
        </form>
      </div>
    `;

    const form = container.querySelector('#profileForm');
    const toast = container.querySelector('#saveToast');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.profile = {
        name: "Alex Chen",
        skinType: container.querySelector('#skinType').value,
        mainConcern: container.querySelector('#mainConcern').value,
        sensitivity: container.querySelector('#sensitivity').value,
        ageGroup: container.querySelector('#ageGroup').value,
        climate: container.querySelector('#climate').value,
        lifestyle: container.querySelector('#lifestyle').value
      };

      API.saveUserProfile(this.profile);
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 3000);

      if (this.onProfileUpdated) {
        this.onProfileUpdated(this.profile);
      }
    });

    return container;
  }
}
