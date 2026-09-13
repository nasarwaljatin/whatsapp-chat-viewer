/**
 * Landing Page & File Upload Screen Component
 */

export function createUploadScreen({ onFileSelected, onDemoSelected, currentTheme, onThemeToggle }) {
  const container = document.createElement('div');
  container.className = 'upload-screen';

  container.innerHTML = `
    <div class="upload-header-bar">
      <button class="theme-toggle-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <span>${currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    </div>

    <div class="upload-card">
      <div class="app-brand">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.81 9.81 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.19 8.19 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.25-8.24zm4.52 10.2c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.98-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.31z"/>
        </svg>
        <h1>WhatsApp Chat Viewer</h1>
      </div>
      <p class="app-tagline">
        Relive your exported WhatsApp chats in authentic WhatsApp UI with full image, video & media timeline support.
      </p>

      <div class="drop-zone" id="drop-zone">
        <div class="drop-zone-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <div class="drop-zone-title">Drop your WhatsApp export .ZIP file here</div>
        <div class="drop-zone-subtitle">or click to browse your computer</div>
        <input type="file" id="file-input" class="file-input" accept=".zip" />
      </div>

      <div class="divider">OR</div>

      <button class="demo-btn" id="demo-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Try Interactive Demo Chat
      </button>

      <div class="privacy-badge">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
        </svg>
        100% Client-Side. Your chats never leave your browser.
      </div>
    </div>
  `;

  // Attach event handlers
  const themeBtn = container.querySelector('.theme-toggle-btn');
  themeBtn.addEventListener('click', () => {
    onThemeToggle();
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeBtn.querySelector('span').textContent = isDark ? 'Light Mode' : 'Dark Mode';
  });

  const dropZone = container.querySelector('#drop-zone');
  const fileInput = container.querySelector('#file-input');

  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.zip')) {
        onFileSelected(file);
      } else {
        alert('Please select a valid WhatsApp exported .ZIP file.');
      }
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  });

  const demoBtn = container.querySelector('#demo-btn');
  demoBtn.addEventListener('click', onDemoSelected);

  return container;
}

export function showLoadingSpinner(container, text = 'Parsing WhatsApp Chat ZIP...') {
  let overlay = container.querySelector('.loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="spinner"></div>
      <div style="font-weight: 500; font-size: 15px;">${text}</div>
    `;
    container.appendChild(overlay);
  }
}

export function hideLoadingSpinner(container) {
  const overlay = container.querySelector('.loading-overlay');
  if (overlay) overlay.remove();
}
