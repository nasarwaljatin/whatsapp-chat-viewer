/**
 * Split Layout Housing ChatSidebar and ChatView
 */
import { createChatSidebar } from './ChatSidebar.js';
import { createChatView } from './ChatView.js';

export function createChatAppLayout({
  sessions,
  activeSessionId,
  currentTheme,
  onSelectSession,
  onAddZip,
  onBackToLanding,
  onThemeToggle
}) {
  const container = document.createElement('div');
  container.className = 'chat-split-container';
  container.style.cssText = `
    width: 100%;
    height: 100%;
    display: flex;
    background-color: var(--wa-chat-bg);
    position: relative;
    overflow: hidden;
  `;

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Render Sidebar
  const sidebar = createChatSidebar({
    sessions,
    activeSessionId: activeSession ? activeSession.id : null,
    onSelectSession,
    onAddZip,
    onBackToLanding
  });

  container.appendChild(sidebar);

  // Render Right Chat View
  if (activeSession) {
    const chatView = createChatView({
      chatData: activeSession,
      currentTheme,
      onBack: onBackToLanding,
      onThemeToggle
    });

    chatView.style.flex = '1';
    container.appendChild(chatView);
  } else {
    const emptyState = document.createElement('div');
    emptyState.style.cssText = `
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--wa-text-secondary);
      background: var(--wa-chat-bg);
    `;
    emptyState.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 12px;">💬</div>
      <div style="font-size: 18px; font-weight: 600; color: var(--wa-text-primary); margin-bottom: 6px;">WhatsApp Chat Viewer</div>
      <div style="font-size: 13px;">Select a conversation from the left sidebar or upload another chat ZIP.</div>
    `;
    container.appendChild(emptyState);
  }

  return container;
}
