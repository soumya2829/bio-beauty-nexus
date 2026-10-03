import { DEMO_PRESETS, HAIR_DEMO_PRESETS } from '../demoPresets.js';

export class ImageUpload {
  constructor({ onImageSelected, onError, initialMode = 'skin' }) {
    this.onImageSelected = onImageSelected;
    this.onError = onError;
    this.scanType = initialMode; // 'skin' or 'hair'
    this.videoStream = null;
    this.isCameraActive = false;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'upload-card glass-panel fade-in';
    this.updateUploadCard(container);
    return container;
  }

  updateUploadCard(container) {
    const isSkin = this.scanType === 'skin';
    const presets = isSkin ? DEMO_PRESETS : HAIR_DEMO_PRESETS;

    container.innerHTML = `
      <!-- Scan Type Mode Switcher: Skin vs Hair -->
      <div class="scan-mode-toggle-wrap">
        <button type="button" class="mode-toggle-btn ${isSkin ? 'active' : ''}" id="toggleModeSkin">
          <span class="mode-icon">✨</span>
          <span>Facial Skin Scan</span>
        </button>
        <button type="button" class="mode-toggle-btn ${!isSkin ? 'active' : ''}" id="toggleModeHair">
          <span class="mode-icon">💇‍♀️</span>
          <span>Hair & Scalp Scan</span>
        </button>
      </div>

      <div class="upload-header">
        <div class="bio-badge">
          <span class="pulse-dot"></span>
          ${isSkin ? 'AI FACIAL SCANNER v2.6' : 'AI HAIR & SCALP SCANNER v2.6'}
        </div>
        <h2 class="upload-title">${isSkin ? 'Capture or Upload Your Face Image' : 'Capture or Upload Your Hair & Scalp'}</h2>
        <p class="upload-subtitle">
          ${isSkin 
            ? 'Ensure good, balanced lighting facing the camera with a neutral facial expression for optimal cosmetic feature extraction.'
            : 'Capture a clear, well-lit photo showing your hair texture, crown parting, or lengths to analyze density, shine, and cuticle alignment.'}
        </p>
      </div>

      <!-- Drag & Drop Zone -->
      <div class="dropzone" id="dropzoneContainer">
        <input type="file" id="fileInput" accept="image/png, image/jpeg, image/webp" class="visually-hidden" />
        
        <div class="dropzone-content">
          <div class="dropzone-icon-circle ${!isSkin ? 'hair-icon-circle' : ''}">
            <svg class="drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
          </div>
          <div class="dropzone-text">
            <strong>Click to upload</strong> or drag and drop your ${isSkin ? 'selfie' : 'hair photo'} here
          </div>
          <div class="dropzone-hint">
            Supports JPEG, PNG, WEBP (Max 10MB)
          </div>
        </div>

        <div class="upload-actions-row">
          <button type="button" class="btn btn-primary" id="btnUploadFile">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
              <path d="M12 12v9"></path>
              <path d="m16 16-4-4-4 4"></path>
            </svg>
            Upload Photo
          </button>
          
          <button type="button" class="btn btn-secondary" id="btnStartCamera">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            Open Camera
          </button>
        </div>
      </div>

      <!-- Live Camera Stream -->
      <div class="camera-stream-wrapper hidden" id="cameraWrapper">
        <div class="camera-stream-container">
          <video id="cameraVideo" autoplay playsinline muted></video>
          <div class="camera-face-guide">
            <div class="${isSkin ? 'oval-guide' : 'oval-guide hair-guide'}"></div>
            <div class="guide-text">${isSkin ? 'Align face inside oval' : 'Align hair parting or crown inside frame'}</div>
          </div>
        </div>
        <div class="camera-controls">
          <button type="button" class="btn btn-secondary" id="btnCancelCamera">Cancel</button>
          <button type="button" class="btn btn-primary shutter-btn" id="btnSnapPhoto">
            <span class="shutter-circle"></span>
            Capture Photo
          </button>
        </div>
      </div>

      <!-- Demo Presets Section -->
      <div class="demo-presets-section">
        <div class="presets-header">
          <span class="presets-tag">${isSkin ? 'Skin Demo Cases' : 'Hair Demo Cases'}</span>
          <span>Don't have a photo ready? Try one of our instant calibrated test profiles:</span>
        </div>
        <div class="preset-chips-grid" id="presetChipsGrid"></div>
      </div>

      <!-- Safety Advisory Banner -->
      <div class="safety-advisory-banner">
        <svg class="advisory-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <div class="advisory-text">
          <strong>Cosmetic Safety Standard:</strong> Bio Beauty Nexus analyzes visible cosmetic characteristics only. It does not diagnose medical diseases, alopecia, scalp pathologies, or prescribe pharmaceuticals.
        </div>
      </div>
    `;

    this.attachEvents(container, presets);
  }

  attachEvents(container, presets) {
    const fileInput = container.querySelector('#fileInput');
    const dropzone = container.querySelector('#dropzoneContainer');
    const btnUploadFile = container.querySelector('#btnUploadFile');
    const btnStartCamera = container.querySelector('#btnStartCamera');
    const cameraWrapper = container.querySelector('#cameraWrapper');
    const cameraVideo = container.querySelector('#cameraVideo');
    const btnCancelCamera = container.querySelector('#btnCancelCamera');
    const btnSnapPhoto = container.querySelector('#btnSnapPhoto');
    const presetGrid = container.querySelector('#presetChipsGrid');

    const toggleSkin = container.querySelector('#toggleModeSkin');
    const toggleHair = container.querySelector('#toggleModeHair');

    toggleSkin.addEventListener('click', () => {
      this.scanType = 'skin';
      this.updateUploadCard(container);
    });

    toggleHair.addEventListener('click', () => {
      this.scanType = 'hair';
      this.updateUploadCard(container);
    });

    btnUploadFile.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('click', (e) => {
      if (e.target !== btnStartCamera && !btnStartCamera.contains(e.target)) {
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) this.processFile(file);
    });

    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-active');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-active');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files[0]) this.processFile(files[0]);
    });

    // Camera
    btnStartCamera.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert('Camera capture is not supported or requires localhost/HTTPS.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        
        this.videoStream = stream;
        cameraVideo.srcObject = stream;
        cameraWrapper.classList.remove('hidden');
        dropzone.classList.add('hidden');
        this.isCameraActive = true;
      } catch (err) {
        alert('Could not access camera. Please allow camera permissions.');
      }
    });

    const stopCamera = () => {
      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop());
        this.videoStream = null;
      }
      cameraWrapper.classList.add('hidden');
      dropzone.classList.remove('hidden');
      this.isCameraActive = false;
    };

    btnCancelCamera.addEventListener('click', (e) => {
      e.stopPropagation();
      stopCamera();
    });

    btnSnapPhoto.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!cameraVideo.videoWidth) return;

      const canvas = document.createElement('canvas');
      canvas.width = cameraVideo.videoWidth;
      canvas.height = cameraVideo.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

      stopCamera();
      this.onImageSelected({
        imageData: dataUrl,
        presetMode: null,
        scanType: this.scanType,
        title: this.scanType === 'skin' ? 'Live Face Capture' : 'Live Hair Capture'
      });
    });

    // Populate Presets
    presets.forEach(preset => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'preset-card-btn';
      chip.innerHTML = `
        <div class="preset-thumb">
          <img src="${preset.image}" alt="${preset.title}" />
        </div>
        <div class="preset-info">
          <span class="preset-badge">${preset.badge}</span>
          <span class="preset-name">${preset.title}</span>
          <span class="preset-desc">${preset.subtitle}</span>
        </div>
      `;
      chip.addEventListener('click', () => {
        this.onImageSelected({
          imageData: preset.image,
          presetMode: preset.presetMode,
          scanType: this.scanType,
          title: preset.title
        });
      });
      presetGrid.appendChild(chip);
    });
  }

  processFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.onImageSelected({
        imageData: e.target.result,
        presetMode: null,
        scanType: this.scanType,
        title: file.name
      });
    };
    reader.readAsDataURL(file);
  }
}
