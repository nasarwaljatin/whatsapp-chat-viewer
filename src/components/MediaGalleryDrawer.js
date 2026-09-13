/**
 * Media, Links & Docs Gallery Drawer Component
 */
import { createLightboxModal } from './Lightbox.js';

export function createMediaGalleryDrawer(messages, onJumpToMessage, onClose) {
  const drawer = document.createElement('div');
  drawer.className = 'media-drawer-container';
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

  // Categorize media messages
  const mediaItems = {
    visuals: [], // images, stickers, videos
    audio: [],   // voice notes
    docs: []     // pdfs, docx, etc.
  };

  messages.forEach(msg => {
    if (msg.media && !msg.media.omitted) {
      const type = msg.media.mediaType;
      if (['image', 'video', 'sticker'].includes(type)) {
        mediaItems.visuals.push(msg);
      } else if (type === 'audio') {
        mediaItems.audio.push(msg);
      } else {
        mediaItems.docs.push(msg);
      }
    }
  });

  let activeTab = 'visuals'; // 'visuals' | 'audio' | 'docs'

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
        🖼️ Media, Links & Docs
      </div>
      <button class="gallery-close-btn" style="
        background: none;
        border: none;
        color: var(--wa-header-text);
        cursor: pointer;
        font-size: 18px;
      ">✕</button>
    </div>

    <!-- Tabs Header -->
    <div style="
      display: flex;
      background: var(--wa-input-bg);
      border-bottom: 1px solid var(--wa-border-color);
    ">
      <button class="gallery-tab-btn active" data-tab="visuals" style="
        flex: 1;
        padding: 12px 6px;
        background: none;
        border: none;
        color: var(--wa-text-primary);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        border-bottom: 2px solid var(--wa-accent);
      ">Photos (${mediaItems.visuals.length})</button>
      
      <button class="gallery-tab-btn" data-tab="audio" style="
        flex: 1;
        padding: 12px 6px;
        background: none;
        border: none;
        color: var(--wa-text-secondary);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        border-bottom: 2px solid transparent;
      ">Audio (${mediaItems.audio.length})</button>

      <button class="gallery-tab-btn" data-tab="docs" style="
        flex: 1;
        padding: 12px 6px;
        background: none;
        border: none;
        color: var(--wa-text-secondary);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        border-bottom: 2px solid transparent;
      ">Docs (${mediaItems.docs.length})</button>
    </div>

    <!-- Tab Content Container -->
    <div class="gallery-content-body" style="
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    "></div>
  `;

  const closeBtn = drawer.querySelector('.gallery-close-btn');
  const tabBtns = drawer.querySelectorAll('.gallery-tab-btn');
  const contentBody = drawer.querySelector('.gallery-content-body');

  function renderTabContent() {
    contentBody.innerHTML = '';

    if (activeTab === 'visuals') {
      if (mediaItems.visuals.length === 0) {
        contentBody.innerHTML = `<div style="text-align: center; color: var(--wa-text-secondary); margin-top: 40px; font-size: 14px;">No photos or videos shared</div>`;
        return;
      }

      const grid = document.createElement('div');
      grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      `;

      mediaItems.visuals.forEach(msg => {
        const item = document.createElement('div');
        item.style.cssText = `
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          background: var(--wa-input-bg);
          cursor: pointer;
        `;

        if (msg.media.url) {
          if (msg.media.mediaType === 'video') {
            item.innerHTML = `<video src="${msg.media.url}" style="width: 100%; height: 100%; object-fit: cover;"></video>`;
          } else {
            item.innerHTML = `<img src="${msg.media.url}" style="width: 100%; height: 100%; object-fit: cover;" />`;
          }
        } else {
          item.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 12px; color: var(--wa-text-secondary); p-2;">${msg.media.filename}</div>`;
        }

        // Overlay button to jump to chat
        const jumpOverlay = document.createElement('button');
        jumpOverlay.title = 'Jump to in chat';
        jumpOverlay.innerHTML = '↗';
        jumpOverlay.style.cssText = `
          position: absolute;
          bottom: 6px;
          right: 6px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(0,0,0,0.6);
          color: #ffffff;
          border: none;
          cursor: pointer;
          font-size: 12px;
        `;

        jumpOverlay.addEventListener('click', (e) => {
          e.stopPropagation();
          onJumpToMessage(msg.id);
        });

        item.addEventListener('click', () => {
          if (msg.media.url && msg.media.mediaType !== 'video') {
            createLightboxModal(msg.media.url);
          } else {
            onJumpToMessage(msg.id);
          }
        });

        item.appendChild(jumpOverlay);
        grid.appendChild(item);
      });

      contentBody.appendChild(grid);
    } else if (activeTab === 'audio') {
      if (mediaItems.audio.length === 0) {
        contentBody.innerHTML = `<div style="text-align: center; color: var(--wa-text-secondary); margin-top: 40px; font-size: 14px;">No voice notes shared</div>`;
        return;
      }

      mediaItems.audio.forEach(msg => {
        const card = document.createElement('div');
        card.style.cssText = `
          background: var(--wa-input-bg);
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        `;

        card.innerHTML = `
          <div>
            <div style="font-size: 13px; font-weight: 600; color: var(--wa-text-primary);">🎵 Voice Note</div>
            <div style="font-size: 11px; color: var(--wa-text-secondary);">${msg.sender} • ${msg.formattedDate}</div>
          </div>
          <button class="jump-btn" style="
            background: var(--wa-accent);
            color: #ffffff;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
          ">Jump ↗</button>
        `;

        card.querySelector('.jump-btn').addEventListener('click', () => {
          onJumpToMessage(msg.id);
        });

        contentBody.appendChild(card);
      });
    } else if (activeTab === 'docs') {
      if (mediaItems.docs.length === 0) {
        contentBody.innerHTML = `<div style="text-align: center; color: var(--wa-text-secondary); margin-top: 40px; font-size: 14px;">No documents shared</div>`;
        return;
      }

      mediaItems.docs.forEach(msg => {
        const card = document.createElement('div');
        card.style.cssText = `
          background: var(--wa-input-bg);
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        `;

        card.innerHTML = `
          <div style="overflow: hidden; flex: 1;">
            <div style="font-size: 13px; font-weight: 600; color: var(--wa-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              📄 ${msg.media.filename || 'Document'}
            </div>
            <div style="font-size: 11px; color: var(--wa-text-secondary);">${msg.sender} • ${msg.formattedDate}</div>
          </div>
          <button class="jump-btn" style="
            background: var(--wa-accent);
            color: #ffffff;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            flex-shrink: 0;
          ">Jump ↗</button>
        `;

        card.querySelector('.jump-btn').addEventListener('click', () => {
          onJumpToMessage(msg.id);
        });

        contentBody.appendChild(card);
      });
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.style.color = 'var(--wa-text-secondary)';
        b.style.borderBottomColor = 'transparent';
      });
      btn.style.color = 'var(--wa-text-primary)';
      btn.style.borderBottomColor = 'var(--wa-accent)';
      activeTab = btn.dataset.tab;
      renderTabContent();
    });
  });

  closeBtn.addEventListener('click', () => {
    drawer.remove();
    if (onClose) onClose();
  });

  renderTabContent();
  document.body.appendChild(drawer);
}
