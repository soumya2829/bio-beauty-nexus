import { API } from '../api.js';

export class AuthModal {
  constructor({ onAuthSuccess, onClose }) {
    this.onAuthSuccess = onAuthSuccess;
    this.onClose = onClose;
    this.activeMode = 'login'; // 'login' or 'register'
  }

  render() {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade-in';
    backdrop.innerHTML = `
      <div class="auth-modal-card glass-panel" id="authCard">
        <button type="button" class="modal-close-btn" id="btnCloseModal">✕</button>

        <div class="auth-modal-header">
          <div class="bio-badge">
            <span class="pulse-dot"></span>
            BIO BEAUTY NEXUS ACCOUNT
          </div>
          <h2 id="authModalTitle">${this.activeMode === 'login' ? 'Welcome Back' : 'Create Your Bio Profile'}</h2>
          <p class="auth-modal-sub" id="authModalSub">
            ${this.activeMode === 'login' ? 'Access your saved skin & hair analyses and custom routines.' : 'Register to track longitudinal cosmetic scans and personalized routines.'}
          </p>

          <div class="auth-tab-switch">
            <button type="button" class="tab-btn ${this.activeMode === 'login' ? 'active' : ''}" id="tabLogin">Sign In</button>
            <button type="button" class="tab-btn ${this.activeMode === 'register' ? 'active' : ''}" id="tabRegister">Register</button>
          </div>
        </div>

        <div class="auth-modal-body">
          <div id="authAlert" class="auth-alert hidden"></div>

          <!-- Login Form -->
          <form id="loginForm" class="${this.activeMode === 'login' ? '' : 'hidden'}">
            <div class="form-group">
              <label for="loginEmail">Email Address</label>
              <input type="email" id="loginEmail" class="form-input" placeholder="alex.chen@biobeautynexus.io" required value="alex.chen@biobeautynexus.io" />
            </div>

            <div class="form-group">
              <label for="loginPassword">Password</label>
              <input type="password" id="loginPassword" class="form-input" placeholder="••••••••" required value="password123" />
            </div>

            <div class="demo-auth-hint">
              <span>💡 Demo account ready: <strong>alex.chen@biobeautynexus.io</strong> (password: <strong>password123</strong>)</span>
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="btnSubmitLogin">
              Sign In to Bio Nexus
            </button>
          </form>

          <!-- Register Form -->
          <form id="registerForm" class="${this.activeMode === 'register' ? '' : 'hidden'}">
            <div class="form-group">
              <label for="regName">Full Name</label>
              <input type="text" id="regName" class="form-input" placeholder="e.g. Jordan Rivera" required />
            </div>

            <div class="form-group">
              <label for="regEmail">Email Address</label>
              <input type="email" id="regEmail" class="form-input" placeholder="jordan@example.com" required />
            </div>

            <div class="form-group">
              <label for="regPassword">Password</label>
              <input type="password" id="regPassword" class="form-input" placeholder="Minimum 6 characters" required />
            </div>

            <div class="form-grid-modal">
              <div class="form-group">
                <label for="regSkin">Skin Type</label>
                <select id="regSkin" class="form-select">
                  <option value="Combination">Combination</option>
                  <option value="Dry">Dry</option>
                  <option value="Oily">Oily</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>

              <div class="form-group">
                <label for="regHair">Hair Type</label>
                <select id="regHair" class="form-select">
                  <option value="Type 2 Wavy">Type 2 Wavy</option>
                  <option value="Type 1 Straight">Type 1 Straight</option>
                  <option value="Type 3 Curly">Type 3 Curly</option>
                  <option value="Type 4 Coily">Type 4 Coily</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="btnSubmitRegister">
              Create Bio Account
            </button>
          </form>
        </div>

        <div class="auth-modal-footer">
          <span>🔒 Privacy-first cosmetic data encryption. We never share your photos or medical disclosures.</span>
        </div>
      </div>
    `;

    this.attachEvents(backdrop);
    return backdrop;
  }

  attachEvents(backdrop) {
    const btnClose = backdrop.querySelector('#btnCloseModal');
    const tabLogin = backdrop.querySelector('#tabLogin');
    const tabRegister = backdrop.querySelector('#tabRegister');
    const loginForm = backdrop.querySelector('#loginForm');
    const registerForm = backdrop.querySelector('#registerForm');
    const authTitle = backdrop.querySelector('#authModalTitle');
    const authSub = backdrop.querySelector('#authModalSub');
    const authAlert = backdrop.querySelector('#authAlert');

    // Close on backdrop or X
    btnClose.addEventListener('click', () => this.destroy(backdrop));
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.destroy(backdrop);
    });

    const setMode = (mode) => {
      this.activeMode = mode;
      authAlert.classList.add('hidden');
      if (mode === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        authTitle.textContent = 'Welcome Back';
        authSub.textContent = 'Access your saved skin & hair analyses and custom routines.';
      } else {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        authTitle.textContent = 'Create Your Bio Profile';
        authSub.textContent = 'Register to track longitudinal cosmetic scans and personalized routines.';
      }
    };

    tabLogin.addEventListener('click', () => setMode('login'));
    tabRegister.addEventListener('click', () => setMode('register'));

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = backdrop.querySelector('#loginEmail').value.trim();
      const password = backdrop.querySelector('#loginPassword').value;

      authAlert.classList.add('hidden');
      const res = await API.login(email, password);

      if (res.success) {
        if (this.onAuthSuccess) this.onAuthSuccess(res.user);
        this.destroy(backdrop);
      } else {
        authAlert.textContent = res.error || 'Invalid email or password';
        authAlert.classList.remove('hidden');
      }
    });

    // Handle Register
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = backdrop.querySelector('#regName').value.trim();
      const email = backdrop.querySelector('#regEmail').value.trim();
      const password = backdrop.querySelector('#regPassword').value;
      const skinType = backdrop.querySelector('#regSkin').value;
      const hairType = backdrop.querySelector('#regHair').value;

      authAlert.classList.add('hidden');
      const res = await API.register({ name, email, password, skinType, hairType });

      if (res.success) {
        if (this.onAuthSuccess) this.onAuthSuccess(res.user);
        this.destroy(backdrop);
      } else {
        authAlert.textContent = res.error || 'Could not complete registration';
        authAlert.classList.remove('hidden');
      }
    });
  }

  destroy(backdrop) {
    if (backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
    if (this.onClose) this.onClose();
  }
}
