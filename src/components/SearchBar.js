/**
 * Search bar component for WhatsApp messages with "Show in Chat" navigation
 */

export function createSearchBar({ onSearch, onJumpToMessage, onClose }) {
  const container = document.createElement('div');
  container.className = 'search-bar-wrapper';
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    background: var(--wa-header-bg);
    border-bottom: 1px solid var(--wa-border-color);
    box-shadow: 0 4px 12px var(--wa-shadow);
    z-index: 25;
    animation: fadeIn 0.2s ease-out;
    position: relative;
  `;

  container.innerHTML = `
    <div class="search-top-bar" style="display: flex; align-items: center; gap: 10px; padding: 10px 16px;">
      <button class="search-back-btn icon-btn" title="Close search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div style="flex: 1; position: relative; display: flex; align-items: center;">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search messages..." 
          style="
            width: 100%;
            height: 38px;
            background: var(--wa-input-bg);
            border: 1px solid var(--wa-border-color);
            border-radius: 8px;
            padding: 0 16px;
            color: var(--wa-header-text);
            font-size: 14px;
            outline: none;
          "
        />
      </div>

      <span class="search-counter" style="font-size: 12px; color: var(--wa-header-subtext); white-space: nowrap;"></span>

      <div class="search-nav-btns" style="display: flex; gap: 4px; display: none;">
        <button class="icon-btn prev-match-btn" title="Previous match" style="width: 32px; height: 32px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
        <button class="icon-btn next-match-btn" title="Next match" style="width: 32px; height: 32px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- Dropdown Result Snippets Panel -->
    <div class="search-results-panel" style="
      max-height: 240px;
      overflow-y: auto;
      background: var(--wa-panel-bg);
      border-top: 1px solid var(--wa-border-color);
      display: none;
    "></div>
  `;

  const input = container.querySelector('.search-input');
  const closeBtn = container.querySelector('.search-back-btn');
  const counterElem = container.querySelector('.search-counter');
  const navBtns = container.querySelector('.search-nav-btns');
  const prevBtn = container.querySelector('.prev-match-btn');
  const nextBtn = container.querySelector('.next-match-btn');
  const resultsPanel = container.querySelector('.search-results-panel');

  let currentResults = []; // Array of matching message objects
  let currentIndex = 0;
  let debounceTimer;

  function updateSearchUI() {
    if (currentResults.length === 0) {
      counterElem.textContent = input.value.trim() ? 'No matches' : '';
      navBtns.style.display = 'none';
      resultsPanel.style.display = 'none';
      resultsPanel.innerHTML = '';
      return;
    }

    navBtns.style.display = 'flex';
    counterElem.textContent = `${currentIndex + 1} of ${currentResults.length}`;

    // Render Dropdown List with "Show in Chat" buttons
    resultsPanel.style.display = 'block';
    resultsPanel.innerHTML = '';

    currentResults.forEach((msg, idx) => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.style.cssText = `
        padding: 10px 16px;
        border-bottom: 1px solid var(--wa-border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        cursor: pointer;
        background: ${idx === currentIndex ? 'var(--wa-hover-bg)' : 'transparent'};
        transition: background 0.15s;
      `;

      item.innerHTML = `
        <div style="overflow: hidden; flex: 1;">
          <div style="font-size: 12px; font-weight: 600; color: var(--wa-accent); margin-bottom: 2px;">
            ${escapeHTML(msg.sender)} <span style="color: var(--wa-timestamp); font-weight: 400;">• ${msg.formattedDate} ${msg.formattedTime}</span>
          </div>
          <div style="font-size: 13.5px; color: var(--wa-header-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${highlightText(escapeHTML(msg.content), input.value.trim())}
          </div>
        </div>
        <button class="show-in-chat-btn" style="
          background: var(--wa-accent);
          color: #ffffff;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
        ">
          Show in chat ↗
        </button>
      `;

      item.addEventListener('click', () => {
        currentIndex = idx;
        updateSearchUI();
        onJumpToMessage(msg.id);
      });

      item.querySelector('.show-in-chat-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = idx;
        updateSearchUI();
        onJumpToMessage(msg.id);
      });

      resultsPanel.appendChild(item);
    });
  }

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = input.value.trim();
      if (!query) {
        currentResults = [];
        currentIndex = 0;
        onSearch('');
        updateSearchUI();
        return;
      }

      currentResults = onSearch(query);
      currentIndex = 0;
      updateSearchUI();
      if (currentResults.length > 0) {
        onJumpToMessage(currentResults[0].id);
      }
    }, 200);
  });

  prevBtn.addEventListener('click', () => {
    if (currentResults.length === 0) return;
    currentIndex = (currentIndex - 1 + currentResults.length) % currentResults.length;
    updateSearchUI();
    onJumpToMessage(currentResults[currentIndex].id);
  });

  nextBtn.addEventListener('click', () => {
    if (currentResults.length === 0) return;
    currentIndex = (currentIndex + 1) % currentResults.length;
    updateSearchUI();
    onJumpToMessage(currentResults[currentIndex].id);
  });

  closeBtn.addEventListener('click', () => {
    container.remove();
    onSearch('');
    if (onClose) onClose();
  });

  setTimeout(() => input.focus(), 100);

  return container;
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark style="background: rgba(255, 235, 59, 0.4); color: inherit; padding: 0 2px; border-radius: 2px;">$1</mark>');
}
