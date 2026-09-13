/**
 * Message Bubble DOM component with Quoted Reply & Star toggle support
 */
import { renderMediaMessage } from './MediaMessage.js';

// SVG Tail snippets
const SENT_TAIL_SVG = `<svg class="bubble-tail" viewBox="0 0 8 13" width="8" height="13"><path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"/></svg>`;
const RECEIVED_TAIL_SVG = `<svg class="bubble-tail" viewBox="0 0 8 13" width="8" height="13"><path d="M2.812 1h5.188v11.193l-6.467-8.625C.474 2.156 1.042 1 2.812 1z"/></svg>`;
const READ_TICKS_SVG = `<span class="ticks" title="Read"><svg viewBox="0 0 16 11" width="16" height="11" fill="currentColor"><path d="M11.05 1.2L4.65 7.6 1.95 4.9.75 6.1l3.9 3.9 7.6-7.6-1.2-1.2zm3.9 0l-7.6 7.6-1.2-1.2 7.6-7.6 1.2 1.2z"/></svg></span>`;

const participantColorMap = {};
let colorIndex = 1;

function getParticipantColor(sender) {
  if (!participantColorMap[sender]) {
    participantColorMap[sender] = `var(--user-color-${colorIndex})`;
    colorIndex = (colorIndex % 8) + 1;
  }
  return participantColorMap[sender];
}

export function renderMessageBubble(msg, primaryUser, isGroupChat = false, searchQuery = '', isStarred = false, onToggleStar = null) {
  // System message pill
  if (msg.type === 'system') {
    const sysRow = document.createElement('div');
    sysRow.className = 'system-msg-row';
    sysRow.id = msg.id;
    sysRow.innerHTML = `
      <div class="system-badge">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
        ${escapeHTML(msg.content)}
      </div>
    `;
    return sysRow;
  }

  const isSent = msg.sender === primaryUser || msg.sender === 'You';
  const row = document.createElement('div');
  row.className = `msg-row ${isSent ? 'sent' : 'received'}`;
  row.id = msg.id;

  const bubble = document.createElement('div');
  bubble.className = `msg-bubble ${msg.media && msg.media.mediaType === 'sticker' ? 'sticker-bubble' : ''}`;

  // Attach Tail SVG
  bubble.insertAdjacentHTML('afterbegin', isSent ? SENT_TAIL_SVG : RECEIVED_TAIL_SVG);

  // Group chat sender name
  if (isGroupChat && !isSent) {
    const senderElem = document.createElement('div');
    senderElem.className = 'sender-name';
    senderElem.style.color = getParticipantColor(msg.sender);
    senderElem.textContent = msg.sender;
    bubble.appendChild(senderElem);
  }

  // Quoted Reply Box Detection
  if (msg.content && (msg.content.startsWith('>') || msg.content.includes('\n>'))) {
    const lines = msg.content.split('\n');
    const quoteLines = [];
    const mainLines = [];

    lines.forEach(line => {
      if (line.startsWith('>')) {
        quoteLines.push(line.replace(/^>\s?/, ''));
      } else {
        mainLines.push(line);
      }
    });

    if (quoteLines.length > 0) {
      const quoteBox = document.createElement('div');
      quoteBox.className = 'quoted-reply-box';
      quoteBox.style.cssText = `
        background: rgba(0, 0, 0, 0.06);
        border-left: 4px solid var(--wa-accent);
        border-radius: 6px;
        padding: 6px 10px;
        margin-bottom: 6px;
        font-size: 13px;
        color: var(--wa-text-secondary);
      `;
      quoteBox.innerHTML = escapeHTML(quoteLines.join(' '));
      bubble.appendChild(quoteBox);
      msg.cleanedText = mainLines.join('\n').trim();
    }
  }

  // Render Media attachment if present
  if (msg.media) {
    const mediaElem = renderMediaMessage(msg.media);
    bubble.appendChild(mediaElem);
  }

  // Render Message Text
  const textToShow = msg.cleanedText !== undefined ? msg.cleanedText : msg.content;
  if (textToShow && textToShow.trim()) {
    let cleaned = textToShow;
    if (msg.media && msg.media.filename && cleaned.trim() === `${msg.media.filename} (file attached)`) {
      cleaned = '';
    }

    if (cleaned.trim()) {
      const textElem = document.createElement('span');
      textElem.className = 'msg-text';
      
      if (searchQuery && searchQuery.trim()) {
        textElem.innerHTML = highlightSearchText(escapeHTML(cleaned), escapeHTML(searchQuery));
      } else {
        textElem.textContent = cleaned;
      }
      
      bubble.appendChild(textElem);
    }
  }

  // Timestamp, Star & ticks
  const metaElem = document.createElement('div');
  metaElem.className = 'msg-meta';
  metaElem.innerHTML = `
    ${isStarred ? '<span style="color: #ffd15c; font-size: 11px; margin-right: 2px;">★</span>' : ''}
    <span class="timestamp">${msg.formattedTime}</span>
    ${isSent ? READ_TICKS_SVG : ''}
  `;
  bubble.appendChild(metaElem);

  // Star Toggle Action Button on Hover
  if (onToggleStar) {
    const starBtn = document.createElement('button');
    starBtn.className = 'star-toggle-btn';
    starBtn.title = isStarred ? 'Unstar message' : 'Star message';
    starBtn.innerHTML = isStarred ? '★' : '☆';
    starBtn.style.cssText = `
      position: absolute;
      top: 4px;
      right: 6px;
      background: none;
      border: none;
      color: ${isStarred ? '#ffd15c' : 'var(--wa-timestamp)'};
      cursor: pointer;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.15s;
    `;

    bubble.addEventListener('mouseenter', () => starBtn.style.opacity = '1');
    bubble.addEventListener('mouseleave', () => starBtn.style.opacity = '0');

    starBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onToggleStar(msg);
    });

    bubble.appendChild(starBtn);
  }

  row.appendChild(bubble);
  return row;
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function highlightSearchText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
