/**
 * Starred Messages Drawer Component
 */

export function createStarredMessagesDrawer(starredMessages, onJumpToMessage, onClose) {
  const drawer = document.createElement('div');
  drawer.className = 'starred-drawer-container';
  drawer.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 360px;
    height: 100%;
    background: var(--wa-panel-bg);
    border-left: 1px solid var(--wa-border-color);
    box-shadow: -4px 0 20px var(--wa-shadow);
    z-index: 50;
    display: flex;
    flex-direction: column;
    animation: slideInRight 0.25s ease-out;
  `;

  drawer.innerHTML = `
    <div style="
      height: 60px;
      background: var(--wa-header-bg);
      color: var(--wa-header-text);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
    ">
      <div style="font-weight: 600; font-size: 16px; display: flex; align-items: center; gap: 8px;">
        ⭐ Starred Messages (${starredMessages.length})
      </div>
      <button class="starred-close-btn" style="
        background: none;
        border: none;
        color: var(--wa-header-text);
        cursor: pointer;
        font-size: 18px;
      ">✕</button>
    </div>

    <div class="starred-content-body" style="
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    ">
      ${starredMessages.length === 0 ? `
        <div style="text-align: center; color: var(--wa-text-secondary); margin-top: 60px; font-size: 14px;">
          <div style="font-size: 32px; margin-bottom: 10px;">⭐</div>
          No starred messages yet.<br/>Hover over any message bubble and click the star icon to save it here!
        </div>
      ` : ''}
    </div>
  `;

  const closeBtn = drawer.querySelector('.starred-close-btn');
  const contentBody = drawer.querySelector('.starred-content-body');

  if (starredMessages.length > 0) {
    starredMessages.forEach(msg => {
      const card = document.createElement('div');
      card.style.cssText = `
        background: var(--wa-input-bg);
        padding: 14px;
        border-radius: 12px;
        margin-bottom: 12px;
        border-left: 3px solid var(--wa-accent);
      `;

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 12.5px; font-weight: 600; color: var(--wa-accent);">${escapeHTML(msg.sender)}</span>
          <span style="font-size: 11px; color: var(--wa-text-secondary);">${msg.formattedDate} ${msg.formattedTime}</span>
        </div>
        <div style="font-size: 13.5px; color: var(--wa-text-primary); margin-bottom: 10px; line-height: 1.4;">
          ${escapeHTML(msg.content || (msg.media ? `[${msg.media.mediaType}]` : ''))}
        </div>
        <div style="display: flex; justify-content: flex-end;">
          <button class="jump-btn" style="
            background: var(--wa-accent);
            color: #ffffff;
            border: none;
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
          ">Jump to message ↗</button>
        </div>
      `;

      card.querySelector('.jump-btn').addEventListener('click', () => {
        onJumpToMessage(msg.id);
      });

      contentBody.appendChild(card);
    });
  }

  closeBtn.addEventListener('click', () => {
    drawer.remove();
    if (onClose) onClose();
  });

  document.body.appendChild(drawer);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
