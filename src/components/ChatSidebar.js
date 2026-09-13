/**
 * WhatsApp Web Left Sidebar component for multi-chat navigation
 */

export function createChatSidebar({ sessions, activeSessionId, onSelectSession, onAddZip, onBackToLanding }) {
  const sidebar = document.createElement('aside');
  sidebar.className = 'chat-sidebar';
  sidebar.style.cssText = `
    width: 350px;
    height: 100%;
    background: var(--wa-panel-bg);
    border-right: 1px solid var(--wa-border-color);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    z-index: 20;
  `;

  let searchQuery = '';

  sidebar.innerHTML = `
    <!-- Sidebar Header -->
    <div style="
      height: 60px;
      background: var(--wa-header-bg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      color: var(--wa-header-text);
    ">
      <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" class="sidebar-brand-btn" title="Back to landing page">
        <div class="avatar" style="width: 36px; height: 36px; font-size: 14px;">W</div>
        <span style="font-weight: 600; font-size: 15px; color: var(--wa-header-text);">Chats (${sessions.length})</span>
      </div>

      <div style="display: flex; align-items: center; gap: 8px;">
        <button class="icon-btn add-zip-btn" title="Add another WhatsApp ZIP chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Search Conversations -->
    <div style="padding: 8px 12px; background: var(--wa-input-bg); border-bottom: 1px solid var(--wa-border-color);">
      <input 
        type="text" 
        class="sidebar-search-input" 
        placeholder="Search or start new chat" 
        style="
          width: 100%;
          height: 34px;
          background: var(--wa-panel-bg);
          border: 1px solid var(--wa-border-color);
          border-radius: 8px;
          padding: 0 12px;
          color: var(--wa-text-primary);
          font-size: 13px;
          outline: none;
        "
      />
    </div>

    <!-- Conversations List -->
    <div class="sidebar-chat-list" style="
      flex: 1;
      overflow-y: auto;
    "></div>
  `;

  const searchInput = sidebar.querySelector('.sidebar-search-input');
  const chatListContainer = sidebar.querySelector('.sidebar-chat-list');
  const addZipBtn = sidebar.querySelector('.add-zip-btn');
  const brandBtn = sidebar.querySelector('.sidebar-brand-btn');

  brandBtn.addEventListener('click', onBackToLanding);
  addZipBtn.addEventListener('click', onAddZip);

  function renderList() {
    chatListContainer.innerHTML = '';

    const filtered = sessions.filter(s => {
      if (!searchQuery) return true;
      const titleMatch = s.chatTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const lastMsgMatch = s.lastMessage && s.lastMessage.content && s.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
      return titleMatch || lastMsgMatch;
    });

    if (filtered.length === 0) {
      chatListContainer.innerHTML = `
        <div style="text-align: center; color: var(--wa-text-secondary); margin-top: 40px; font-size: 13px; padding: 0 16px;">
          No conversations match "${escapeHTML(searchQuery)}"
        </div>
      `;
      return;
    }

    filtered.forEach(session => {
      const isActive = session.id === activeSessionId;
      const initial = session.chatTitle ? session.chatTitle.charAt(0).toUpperCase() : 'C';

      let snippetText = 'No messages';
      let timestampText = '';

      if (session.lastMessage) {
        snippetText = session.lastMessage.content || (session.lastMessage.media ? `[${session.lastMessage.media.mediaType}]` : '');
        timestampText = session.lastMessage.formattedTime || session.lastMessage.formattedDate || '';
      }

      const item = document.createElement('div');
      item.className = `sidebar-item ${isActive ? 'active' : ''}`;
      item.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        background: ${isActive ? 'var(--wa-hover-bg)' : 'transparent'};
        border-bottom: 1px solid var(--wa-border-color);
        transition: background 0.15s;
      `;

      item.innerHTML = `
        <div class="avatar" style="width: 44px; height: 44px; font-size: 18px; flex-shrink: 0;">${initial}</div>
        <div style="flex: 1; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <div style="font-size: 14.5px; font-weight: 600; color: var(--wa-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHTML(session.chatTitle)}
            </div>
            <div style="font-size: 11px; color: var(--wa-text-secondary); flex-shrink: 0; margin-left: 8px;">
              ${timestampText}
            </div>
          </div>
          <div style="font-size: 13px; color: var(--wa-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${escapeHTML(snippetText)}
          </div>
        </div>
      `;

      item.addEventListener('click', () => {
        onSelectSession(session.id);
      });

      chatListContainer.appendChild(item);
    });
  }

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    renderList();
  });

  renderList();

  return sidebar;
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
