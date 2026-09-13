/**
 * WhatsApp Header Component with Analytics, Media Gallery, and Starred Messages triggers
 */

export function createChatHeader({
  chatTitle,
  participants,
  messageCount,
  onBack,
  onSearchToggle,
  onAnalyticsToggle,
  onGalleryToggle,
  onStarredToggle,
  onThemeToggle
}) {
  const header = document.createElement('header');
  header.className = 'chat-header';

  const isGroup = participants && participants.length > 2;
  const initial = chatTitle ? chatTitle.charAt(0).toUpperCase() : 'W';
  const subtext = isGroup 
    ? `${participants.length} participants • ${messageCount} messages`
    : `${messageCount} messages`;

  header.innerHTML = `
    <div class="header-left">
      <button class="back-btn" title="Back to upload">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <div class="avatar">${initial}</div>
      <div class="chat-info">
        <div class="chat-name">${escapeHTML(chatTitle)}</div>
        <div class="chat-status">${escapeHTML(subtext)}</div>
      </div>
    </div>
    <div class="header-actions">
      <button class="icon-btn analytics-btn" title="Chat Insights & Analytics">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      </button>

      <button class="icon-btn gallery-btn" title="Media, Links & Docs Gallery">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </button>

      <button class="icon-btn starred-btn" title="Starred Messages">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </button>

      <button class="icon-btn search-toggle-btn" title="Search chat">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>

      <button class="icon-btn theme-toggle-btn-header" title="Toggle theme">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    </div>
  `;

  header.querySelector('.back-btn').addEventListener('click', onBack);
  header.querySelector('.analytics-btn').addEventListener('click', onAnalyticsToggle);
  header.querySelector('.gallery-btn').addEventListener('click', onGalleryToggle);
  header.querySelector('.starred-btn').addEventListener('click', onStarredToggle);
  header.querySelector('.search-toggle-btn').addEventListener('click', onSearchToggle);
  header.querySelector('.theme-toggle-btn-header').addEventListener('click', onThemeToggle);

  return header;
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
