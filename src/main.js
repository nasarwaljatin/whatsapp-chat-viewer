/**
 * Main Application Controller & State Coordinator (Multi-Chat enabled)
 */
import { createUploadScreen, showLoadingSpinner, hideLoadingSpinner } from './components/UploadScreen.js';
import { createChatAppLayout } from './components/ChatAppLayout.js';
import { extractWhatsAppZip } from './parser/zipExtractor.js';
import { generateSampleChat } from './utils/sampleChat.js';

class App {
  constructor() {
    this.appMount = document.getElementById('app');
    this.currentTheme = localStorage.getItem('wa_theme') || 'dark';
    this.currentScreen = 'upload'; // 'upload' | 'chat'
    this.sessions = [];
    this.activeSessionId = null;

    this.applyTheme(this.currentTheme);
    this.render();
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wa_theme', theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  async handleFileUpload(zipFiles) {
    try {
      showLoadingSpinner(this.appMount, 'Extracting & Parsing WhatsApp ZIP(s)...');
      const newSessions = await extractWhatsAppZip(zipFiles);
      
      // Combine with existing sessions if any
      this.sessions = [...this.sessions, ...newSessions];
      if (!this.activeSessionId || !this.sessions.find(s => s.id === this.activeSessionId)) {
        this.activeSessionId = this.sessions[0].id;
      }
      
      this.currentScreen = 'chat';
      this.render();
    } catch (err) {
      console.error(err);
      alert(`Error parsing WhatsApp ZIP file(s):\n${err.message}`);
    } finally {
      hideLoadingSpinner(this.appMount);
    }
  }

  handleDemoUpload() {
    this.sessions = generateSampleChat();
    this.activeSessionId = this.sessions[0].id;
    this.currentScreen = 'chat';
    this.render();
  }

  handleSelectSession(sessionId) {
    this.activeSessionId = sessionId;
    this.render();
  }

  handleAddMoreZip() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip';
    input.multiple = true;
    input.onchange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        this.handleFileUpload(Array.from(e.target.files));
      }
    };
    input.click();
  }

  handleBackToUpload() {
    this.currentScreen = 'upload';
    this.sessions = [];
    this.activeSessionId = null;
    this.render();
  }

  render() {
    this.appMount.innerHTML = '';

    if (this.currentScreen === 'upload') {
      const uploadElem = createUploadScreen({
        onFilesSelected: (files) => this.handleFileUpload(files),
        onDemoSelected: () => this.handleDemoUpload(),
        currentTheme: this.currentTheme,
        onThemeToggle: () => this.toggleTheme()
      });
      this.appMount.appendChild(uploadElem);
    } else if (this.currentScreen === 'chat' && this.sessions.length > 0) {
      const chatLayoutElem = createChatAppLayout({
        sessions: this.sessions,
        activeSessionId: this.activeSessionId,
        currentTheme: this.currentTheme,
        onSelectSession: (id) => this.handleSelectSession(id),
        onAddZip: () => this.handleAddMoreZip(),
        onBackToLanding: () => this.handleBackToUpload(),
        onThemeToggle: () => this.toggleTheme()
      });
      this.appMount.appendChild(chatLayoutElem);
    }
  }
}

// Initialize Application
new App();
