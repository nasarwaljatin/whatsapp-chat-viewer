/**
 * Main Application Controller & State Coordinator
 */
import { createUploadScreen, showLoadingSpinner, hideLoadingSpinner } from './components/UploadScreen.js';
import { createChatView } from './components/ChatView.js';
import { extractWhatsAppZip } from './parser/zipExtractor.js';
import { generateSampleChat } from './utils/sampleChat.js';

class App {
  constructor() {
    this.appMount = document.getElementById('app');
    this.currentTheme = localStorage.getItem('wa_theme') || 'dark';
    this.currentScreen = 'upload'; // 'upload' | 'chat'
    this.chatData = null;

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

  async handleFileUpload(zipFile) {
    try {
      showLoadingSpinner(this.appMount, 'Extracting & Parsing WhatsApp ZIP...');
      const extractedData = await extractWhatsAppZip(zipFile);
      this.chatData = extractedData;
      this.currentScreen = 'chat';
      this.render();
    } catch (err) {
      console.error(err);
      alert(`Error parsing WhatsApp ZIP file:\n${err.message}`);
    } finally {
      hideLoadingSpinner(this.appMount);
    }
  }

  handleDemoUpload() {
    this.chatData = generateSampleChat();
    this.currentScreen = 'chat';
    this.render();
  }

  handleBackToUpload() {
    this.currentScreen = 'upload';
    this.chatData = null;
    this.render();
  }

  render() {
    this.appMount.innerHTML = '';

    if (this.currentScreen === 'upload') {
      const uploadElem = createUploadScreen({
        onFileSelected: (file) => this.handleFileUpload(file),
        onDemoSelected: () => this.handleDemoUpload(),
        currentTheme: this.currentTheme,
        onThemeToggle: () => this.toggleTheme()
      });
      this.appMount.appendChild(uploadElem);
    } else if (this.currentScreen === 'chat' && this.chatData) {
      const chatElem = createChatView({
        chatData: this.chatData,
        currentTheme: this.currentTheme,
        onBack: () => this.handleBackToUpload(),
        onThemeToggle: () => this.toggleTheme()
      });
      this.appMount.appendChild(chatElem);
    }
  }
}

// Initialize Application
new App();
