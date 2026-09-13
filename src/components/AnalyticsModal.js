/**
 * Chat Analytics & Insights Modal Component
 */

export function createAnalyticsModal(messages, participants, onClose) {
  const modal = document.createElement('div');
  modal.className = 'lightbox-modal'; // Reuse dark backdrop styling
  modal.style.padding = '20px';

  const stats = computeChatStats(messages, participants);

  modal.innerHTML = `
    <div class="analytics-card" style="
      background: var(--wa-panel-bg);
      border: 1px solid var(--wa-border-color);
      border-radius: 20px;
      padding: 28px;
      max-width: 680px;
      width: 100%;
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px var(--wa-shadow);
      color: var(--wa-text-primary);
      position: relative;
      animation: fadeIn 0.25s ease-out;
    ">
      <button class="analytics-close-btn" style="
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: var(--wa-text-secondary);
        cursor: pointer;
        font-size: 20px;
      ">✕</button>

      <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; color: var(--wa-text-primary);">
        📊 Chat Insights & Analytics
      </h2>
      <p style="font-size: 13px; color: var(--wa-text-secondary); margin-bottom: 24px;">
        Statistical breakdown of ${messages.length} messages across ${participants.length} participant${participants.length > 1 ? 's' : ''}.
      </p>

      <!-- Key Metrics Overview Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 14px; margin-bottom: 28px;">
        <div style="background: var(--wa-input-bg); padding: 16px; border-radius: 12px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: var(--wa-accent);">${stats.totalMessages}</div>
          <div style="font-size: 12px; color: var(--wa-text-secondary); margin-top: 4px;">Total Messages</div>
        </div>
        <div style="background: var(--wa-input-bg); padding: 16px; border-radius: 12px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #36ded0;">${stats.mediaCount}</div>
          <div style="font-size: 12px; color: var(--wa-text-secondary); margin-top: 4px;">Media Shared</div>
        </div>
        <div style="background: var(--wa-input-bg); padding: 16px; border-radius: 12px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #ff9d42;">${stats.totalDays}</div>
          <div style="font-size: 12px; color: var(--wa-text-secondary); margin-top: 4px;">Active Days</div>
        </div>
        <div style="background: var(--wa-input-bg); padding: 16px; border-radius: 12px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #ff73c5;">${stats.avgPerDay}</div>
          <div style="font-size: 12px; color: var(--wa-text-secondary); margin-top: 4px;">Msgs / Day</div>
        </div>
      </div>

      <!-- Participant Message Share Progress Bars -->
      <div style="margin-bottom: 28px;">
        <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 14px; color: var(--wa-text-primary);">
          👥 Messages per Participant
        </h3>
        ${stats.participantShare.map(p => `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
              <span style="font-weight: 500; color: var(--wa-text-primary);">${escapeHTML(p.name)}</span>
              <span style="color: var(--wa-text-secondary);">${p.count} msgs (${p.percentage}%)</span>
            </div>
            <div style="width: 100%; height: 8px; background: var(--wa-input-bg); border-radius: 4px; overflow: hidden;">
              <div style="width: ${p.percentage}%; height: 100%; background: var(--wa-accent); border-radius: 4px; transition: width 0.4s ease;"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Top Emojis Section -->
      ${stats.topEmojis.length > 0 ? `
        <div style="margin-bottom: 28px;">
          <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 14px; color: var(--wa-text-primary);">
            🔥 Top Emojis Used
          </h3>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${stats.topEmojis.map(e => `
              <div style="background: var(--wa-input-bg); padding: 8px 14px; border-radius: 20px; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                <span>${e.emoji}</span>
                <span style="font-size: 12px; font-weight: 600; color: var(--wa-text-secondary);">${e.count}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Peak Chatting Days -->
      <div>
        <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 14px; color: var(--wa-text-primary);">
          📅 Activity by Day of Week
        </h3>
        <div style="display: flex; gap: 6px; align-items: flex-end; height: 100px; padding-top: 10px;">
          ${stats.dayOfWeekStats.map(d => `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%;">
              <div style="flex: 1; width: 100%; display: flex; align-items: flex-end; justify-content: center;">
                <div style="width: 70%; height: ${d.height}%; background: var(--wa-accent); border-radius: 4px 4px 0 0; min-height: 4px;"></div>
              </div>
              <div style="font-size: 11px; color: var(--wa-text-secondary); margin-top: 6px;">${d.day}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  modal.querySelector('.analytics-close-btn').addEventListener('click', () => {
    modal.remove();
    if (onClose) onClose();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      if (onClose) onClose();
    }
  });

  document.body.appendChild(modal);
}

function computeChatStats(messages, participants) {
  const totalMessages = messages.filter(m => m.type !== 'system').length;
  let mediaCount = 0;
  const participantMap = {};
  const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun..Sat
  const emojiMap = {};
  const dateSet = new Set();

  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

  messages.forEach(msg => {
    if (msg.type === 'system') return;

    // Participant counts
    participantMap[msg.sender] = (participantMap[msg.sender] || 0) + 1;

    // Media counts
    if (msg.media && !msg.media.omitted) mediaCount++;

    // Dates
    if (msg.date && !isNaN(msg.date.getTime())) {
      dateSet.add(msg.date.toDateString());
      dayOfWeekCounts[msg.date.getDay()]++;
    }

    // Emoji counts
    if (msg.content) {
      const matches = msg.content.match(emojiRegex);
      if (matches) {
        matches.forEach(emoji => {
          emojiMap[emoji] = (emojiMap[emoji] || 0) + 1;
        });
      }
    }
  });

  // Participant Share
  const participantShare = Object.keys(participantMap).map(name => ({
    name,
    count: participantMap[name],
    percentage: totalMessages > 0 ? Math.round((participantMap[name] / totalMessages) * 100) : 0
  })).sort((a, b) => b.count - a.count);

  // Top Emojis
  const topEmojis = Object.keys(emojiMap)
    .map(emoji => ({ emoji, count: emojiMap[emoji] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Day of Week Stats
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxDayCount = Math.max(...dayOfWeekCounts, 1);
  const dayOfWeekStats = dayOfWeekCounts.map((count, i) => ({
    day: dayNames[i],
    count,
    height: Math.round((count / maxDayCount) * 100)
  }));

  const totalDays = Math.max(dateSet.size, 1);
  const avgPerDay = (totalMessages / totalDays).toFixed(1);

  return {
    totalMessages,
    mediaCount,
    totalDays,
    avgPerDay,
    participantShare,
    topEmojis,
    dayOfWeekStats
  };
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
