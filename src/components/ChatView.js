/**
 * Main WhatsApp Chat View Component orchestrating Header, FilterBar, Analytics, Gallery, and Starred Drawers
 */
import { createChatHeader } from './ChatHeader.js';
import { createFilterBar } from './FilterBar.js';
import { renderMessageBubble } from './MessageBubble.js';
import { createSearchBar } from './SearchBar.js';
import { createAnalyticsModal } from './AnalyticsModal.js';
import { createMediaGalleryDrawer } from './MediaGalleryDrawer.js';
import { createStarredMessagesDrawer } from './StarredMessagesDrawer.js';

export function createChatView({ chatData, currentTheme, onBack, onThemeToggle }) {
  const container = document.createElement('div');
  container.className = 'chat-app-container';

  const { messages, participants, primaryUser, chatTitle } = chatData;
  const isGroupChat = participants.length > 2;

  let activePrimaryUser = primaryUser;
  let searchQuery = '';
  let activeSenderFilter = 'all';
  let activeMediaTypeFilter = 'all';
  let searchBarElem = null;

  const starredMessageIds = new Set();

  // Header
  const header = createChatHeader({
    chatTitle,
    participants,
    messageCount: messages.length,
    onBack,
    onAnalyticsToggle: () => {
      createAnalyticsModal(messages, participants);
    },
    onGalleryToggle: () => {
      createMediaGalleryDrawer(messages, (msgId) => jumpToMessageInChat(msgId));
    },
    onStarredToggle: () => {
      const starredMsgs = messages.filter(m => starredMessageIds.has(m.id));
      createStarredMessagesDrawer(starredMsgs, (msgId) => jumpToMessageInChat(msgId));
    },
    onSearchToggle: () => {
      if (searchBarElem) {
        searchBarElem.remove();
        searchBarElem = null;
        searchQuery = '';
        renderMessages();
      } else {
        searchBarElem = createSearchBar({
          onSearch: (query) => {
            searchQuery = query;
            renderMessages();
            if (!query) return [];
            return getFilteredMessages().filter(m => 
              (m.content && m.content.toLowerCase().includes(query.toLowerCase())) ||
              (m.sender && m.sender.toLowerCase().includes(query.toLowerCase()))
            );
          },
          onJumpToMessage: (msgId) => {
            jumpToMessageInChat(msgId);
          },
          onClose: () => {
            searchBarElem = null;
            searchQuery = '';
            renderMessages();
          }
        });
        container.insertBefore(searchBarElem, filterBarElem);
      }
    },
    onThemeToggle
  });

  container.appendChild(header);

  // Filter Bar
  const filterBarElem = createFilterBar({
    participants,
    currentPrimaryUser: activePrimaryUser,
    onPrimaryUserChange: (newPrimaryUser) => {
      activePrimaryUser = newPrimaryUser;
      renderMessages();
    },
    onFilterChange: ({ sender, mediaType }) => {
      activeSenderFilter = sender;
      activeMediaTypeFilter = mediaType;
      renderMessages();
    },
    onJumpToDate: (dateStr) => {
      jumpToDateInChat(dateStr);
    }
  });

  container.appendChild(filterBarElem);

  // Chat Body Wrapper with Wallpaper
  const bodyWrapper = document.createElement('div');
  bodyWrapper.className = 'chat-body-wrapper';

  const doodleBg = document.createElement('div');
  doodleBg.className = 'chat-doodle-bg';
  bodyWrapper.appendChild(doodleBg);

  // Messages Container
  const messagesListContainer = document.createElement('div');
  messagesListContainer.className = 'messages-container';

  // Floating Sticky Date Badge
  const floatingDateWrapper = document.createElement('div');
  floatingDateWrapper.className = 'floating-date-wrapper';
  const floatingDateBadge = document.createElement('span');
  floatingDateBadge.className = 'floating-date-badge';
  floatingDateWrapper.appendChild(floatingDateBadge);
  messagesListContainer.appendChild(floatingDateWrapper);

  let floatingDateHideTimer = null;

  function updateFloatingDate() {
    const dateSeps = messagesListContainer.querySelectorAll('.date-separator');
    if (dateSeps.length === 0) {
      floatingDateBadge.classList.remove('visible');
      return;
    }

    const containerTop = messagesListContainer.getBoundingClientRect().top;
    const containerBottom = messagesListContainer.getBoundingClientRect().bottom;
    let currentDateText = '';
    let lastScrolledOutSep = null;

    // Find the last date separator whose bottom has scrolled above the container top
    for (const sep of dateSeps) {
      const sepBottom = sep.getBoundingClientRect().bottom;
      if (sepBottom < containerTop) {
        // This separator is fully scrolled out above the viewport
        const badge = sep.querySelector('.date-badge');
        if (badge) {
          currentDateText = badge.textContent;
          lastScrolledOutSep = sep;
        }
      }
    }

    // Check if ANY date separator is currently visible inside the viewport
    let anyDateVisibleInViewport = false;
    for (const sep of dateSeps) {
      const sepRect = sep.getBoundingClientRect();
      if (sepRect.bottom > containerTop && sepRect.top < containerBottom) {
        // Check if it's near the top (within first ~60px of the visible area)
        if (sepRect.top < containerTop + 60) {
          anyDateVisibleInViewport = true;
          break;
        }
      }
    }

    // Only show floating date when a separator scrolled out AND
    // no inline date separator is visible near the top
    if (currentDateText && !anyDateVisibleInViewport) {
      floatingDateBadge.textContent = currentDateText;
      floatingDateBadge.classList.add('visible');

      // Auto-hide after scrolling stops
      clearTimeout(floatingDateHideTimer);
      floatingDateHideTimer = setTimeout(() => {
        floatingDateBadge.classList.remove('visible');
      }, 1500);
    } else {
      floatingDateBadge.classList.remove('visible');
      clearTimeout(floatingDateHideTimer);
    }
  }

  // Scroll to bottom FAB
  const fab = document.createElement('button');
  fab.className = 'scroll-bottom-fab';
  fab.title = 'Scroll to bottom';
  fab.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `;
  fab.addEventListener('click', () => {
    messagesListContainer.scrollTo({
      top: messagesListContainer.scrollHeight,
      behavior: 'smooth'
    });
  });

  messagesListContainer.addEventListener('scroll', () => {
    const isFarFromBottom = messagesListContainer.scrollHeight - messagesListContainer.scrollTop - messagesListContainer.clientHeight > 300;
    if (isFarFromBottom) {
      fab.classList.add('visible');
    } else {
      fab.classList.remove('visible');
    }
    updateFloatingDate();
  });

  bodyWrapper.appendChild(messagesListContainer);
  bodyWrapper.appendChild(fab);

  // Decorative WhatsApp Input Bar Footer
  const footer = document.createElement('div');
  footer.className = 'chat-footer';
  footer.innerHTML = `
    <button class="icon-btn" title="Emoji (decorative)" style="color: var(--wa-header-subtext);">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
    </button>
    <button class="icon-btn" title="Attach (decorative)" style="color: var(--wa-header-subtext);">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
      </svg>
    </button>
    <div class="input-mock">Type a message (read-only chat viewer)...</div>
    <button class="icon-btn" title="Voice note (decorative)" style="color: var(--wa-header-subtext);">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
      </svg>
    </button>
  `;

  container.appendChild(bodyWrapper);
  container.appendChild(footer);

  function getFilteredMessages() {
    return messages.filter(msg => {
      if (msg.type === 'system') return true;

      // Sender filter
      if (activeSenderFilter !== 'all' && msg.sender !== activeSenderFilter) {
        return false;
      }

      // Media type filter
      if (activeMediaTypeFilter !== 'all') {
        if (!msg.media || msg.media.omitted) return false;
        if (activeMediaTypeFilter === 'image' && !['image', 'sticker'].includes(msg.media.mediaType)) return false;
        if (activeMediaTypeFilter === 'video' && msg.media.mediaType !== 'video') return false;
        if (activeMediaTypeFilter === 'audio' && msg.media.mediaType !== 'audio') return false;
        if (activeMediaTypeFilter === 'document' && !['document', 'pdf', 'file'].includes(msg.media.mediaType)) return false;
      }

      return true;
    });
  }

  function renderMessages() {
    messagesListContainer.innerHTML = '';
    // Re-add floating date wrapper after clearing
    messagesListContainer.appendChild(floatingDateWrapper);
    floatingDateBadge.classList.remove('visible');
    let lastDateStr = '';

    const filtered = getFilteredMessages();

    if (filtered.length === 0) {
      messagesListContainer.innerHTML = `
        <div style="text-align: center; color: var(--wa-text-secondary); margin-top: 60px; font-size: 14px;">
          No messages match the selected filters
        </div>
      `;
      return;
    }

    filtered.forEach((msg) => {
      // Date Separator Pill in DD/MM/YY format
      if (msg.formattedDate && msg.formattedDate !== lastDateStr) {
        lastDateStr = msg.formattedDate;
        const dateSep = document.createElement('div');
        dateSep.className = 'date-separator';
        dateSep.innerHTML = `<span class="date-badge">${formatDateBadgeText(msg.date, msg.formattedDate)}</span>`;
        messagesListContainer.appendChild(dateSep);
      }

      // Render Message Bubble
      const isStarred = starredMessageIds.has(msg.id);
      const bubbleElem = renderMessageBubble(
        msg,
        activePrimaryUser,
        isGroupChat,
        searchQuery,
        isStarred,
        (targetMsg) => {
          if (starredMessageIds.has(targetMsg.id)) {
            starredMessageIds.delete(targetMsg.id);
          } else {
            starredMessageIds.add(targetMsg.id);
          }
          renderMessages();
        }
      );
      messagesListContainer.appendChild(bubbleElem);
    });

    // Auto scroll to bottom if no active search
    setTimeout(() => {
      if (!searchQuery) {
        messagesListContainer.scrollTop = messagesListContainer.scrollHeight;
      }
    }, 50);
  }

  function jumpToMessageInChat(msgId) {
    // Reset filters if target message is filtered out
    activeSenderFilter = 'all';
    activeMediaTypeFilter = 'all';
    const senderSelect = container.querySelector('.sender-filter-select');
    if (senderSelect) senderSelect.value = 'all';
    const pills = container.querySelectorAll('.filter-pill');
    pills.forEach(p => p.classList.toggle('active', p.dataset.type === 'all'));

    renderMessages();

    setTimeout(() => {
      const targetElem = messagesListContainer.querySelector(`#${msgId}`);
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetElem.classList.add('highlighted');
        setTimeout(() => {
          targetElem.classList.remove('highlighted');
        }, 2500);
      }
    }, 100);
  }

  function jumpToDateInChat(selectedDateStr) {
    // Selected format: YYYY-MM-DD
    const parts = selectedDateStr.split('-');
    if (parts.length !== 3) return;
    const targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

    // Find first message on or after targetDate
    const targetMsg = messages.find(m => m.date && m.date >= targetDate);
    if (targetMsg) {
      jumpToMessageInChat(targetMsg.id);
    } else {
      alert('No messages found on or after the selected date.');
    }
  }

  renderMessages();

  return container;
}

function formatDateBadgeText(dateObj, fallbackStr) {
  if (!dateObj || isNaN(dateObj.getTime())) {
    return formatDateString(fallbackStr);
  }
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = String(dateObj.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

function formatDateString(str) {
  if (!str) return '';
  const parts = str.split('/');
  if (parts.length === 3 && parts[2].length === 4) {
    return `${parts[0]}/${parts[1]}/${parts[2].slice(-2)}`;
  }
  return str;
}
