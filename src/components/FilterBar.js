/**
 * Filter Bar component for filtering chat messages and selecting primary user (Me / Right Side).
 */

export function createFilterBar({ participants, currentPrimaryUser, onFilterChange, onPrimaryUserChange, onJumpToDate }) {
  const bar = document.createElement('div');
  bar.className = 'filter-bar-wrapper';
  bar.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: var(--wa-input-bg);
    padding: 8px 16px;
    border-bottom: 1px solid var(--wa-border-color);
    z-index: 22;
    overflow-x: auto;
  `;

  bar.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px; flex: 1; flex-wrap: nowrap;">
      <!-- Right Side (Me) Selector -->
      <select class="me-filter-select" title="Choose which participant appears on the right side (Me)" style="
        background: var(--wa-panel-bg);
        color: var(--wa-accent);
        border: 1px solid var(--wa-accent);
        padding: 5px 10px;
        border-radius: 16px;
        font-size: 12.5px;
        font-weight: 600;
        outline: none;
        cursor: pointer;
      ">
        <option value="none" ${!currentPrimaryUser ? 'selected' : ''}>👉 Right Side (Me): None</option>
        ${participants.map(p => `
          <option value="${escapeHTML(p)}" ${p === currentPrimaryUser ? 'selected' : ''}>👉 Right Side (Me): ${escapeHTML(p)}</option>
        `).join('')}
      </select>

      <!-- Sender Dropdown -->
      <select class="sender-filter-select" title="Filter messages by sender" style="
        background: var(--wa-panel-bg);
        color: var(--wa-text-primary);
        border: 1px solid var(--wa-border-color);
        padding: 5px 10px;
        border-radius: 16px;
        font-size: 12.5px;
        outline: none;
        cursor: pointer;
      ">
        <option value="all">👥 Filter: All Participants</option>
        ${participants.map(p => `<option value="${escapeHTML(p)}">👤 ${escapeHTML(p)}</option>`).join('')}
      </select>

      <!-- Media Type Pills -->
      <div class="media-filter-pills" style="display: flex; gap: 6px; align-items: center;">
        <button class="filter-pill active" data-type="all">All</button>
        <button class="filter-pill" data-type="image">📷 Photos</button>
        <button class="filter-pill" data-type="video">🎥 Videos</button>
        <button class="filter-pill" data-type="audio">🎵 Audio</button>
        <button class="filter-pill" data-type="document">📄 Docs</button>
      </div>
    </div>

    <!-- Date Picker Jump -->
    <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
      <span style="font-size: 12px; color: var(--wa-text-secondary);">📅 Jump:</span>
      <input type="date" class="date-picker-input" style="
        background: var(--wa-panel-bg);
        color: var(--wa-text-primary);
        border: 1px solid var(--wa-border-color);
        padding: 4px 8px;
        border-radius: 8px;
        font-size: 12px;
        cursor: pointer;
      " />
    </div>
  `;

  const meSelect = bar.querySelector('.me-filter-select');
  const senderSelect = bar.querySelector('.sender-filter-select');
  const pills = bar.querySelectorAll('.filter-pill');
  const dateInput = bar.querySelector('.date-picker-input');

  let activeSender = 'all';
  let activeMediaType = 'all';

  meSelect.addEventListener('change', (e) => {
    const val = e.target.value === 'none' ? null : e.target.value;
    onPrimaryUserChange(val);
  });

  senderSelect.addEventListener('change', (e) => {
    activeSender = e.target.value;
    onFilterChange({ sender: activeSender, mediaType: activeMediaType });
  });

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeMediaType = pill.dataset.type;
      onFilterChange({ sender: activeSender, mediaType: activeMediaType });
    });
  });

  dateInput.addEventListener('change', (e) => {
    if (e.target.value) {
      onJumpToDate(e.target.value);
    }
  });

  return bar;
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
