/**
 * Media attachment renderer component
 */
import { createLightboxModal } from './Lightbox.js';

export function renderMediaMessage(media) {
  const container = document.createElement('div');
  container.className = 'media-container';

  if (!media) return container;

  if (media.omitted) {
    container.innerHTML = `<div class="doc-card"><div class="doc-title">⚠️ Media Omitted during export</div></div>`;
    return container;
  }

  const { mediaType, url, filename } = media;

  switch (mediaType) {
    case 'image':
      if (url) {
        const img = document.createElement('img');
        img.className = 'media-img';
        img.src = url;
        img.alt = filename || 'Chat image';
        img.addEventListener('click', () => createLightboxModal(url));
        container.appendChild(img);
      } else {
        container.innerHTML = `<div class="doc-card"><div class="doc-info"><div class="doc-title">🖼️ ${filename}</div><div class="doc-meta">Image file missing from ZIP</div></div></div>`;
      }
      break;

    case 'sticker':
      if (url) {
        const img = document.createElement('img');
        img.className = 'sticker-img';
        img.src = url;
        img.alt = 'Sticker';
        container.appendChild(img);
      } else {
        container.innerHTML = `<div class="doc-title">🎨 Sticker</div>`;
      }
      break;

    case 'video':
      if (url) {
        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'media-video-wrapper';
        videoWrapper.innerHTML = `
          <video src="${url}" controls preload="metadata"></video>
        `;
        container.appendChild(videoWrapper);
      } else {
        container.innerHTML = `<div class="doc-card"><div class="doc-info"><div class="doc-title">🎥 ${filename}</div><div class="doc-meta">Video file missing</div></div></div>`;
      }
      break;

    case 'audio':
      const audioContainer = document.createElement('div');
      audioContainer.className = 'audio-player-container';
      audioContainer.innerHTML = `
        <button class="audio-play-btn" title="Play audio">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </button>
        <div class="audio-waveform">
          <span class="waveform-bar" style="height: 40%"></span>
          <span class="waveform-bar" style="height: 70%"></span>
          <span class="waveform-bar" style="height: 100%"></span>
          <span class="waveform-bar" style="height: 50%"></span>
          <span class="waveform-bar" style="height: 80%"></span>
          <span class="waveform-bar" style="height: 60%"></span>
          <span class="waveform-bar" style="height: 90%"></span>
          <span class="waveform-bar" style="height: 40%"></span>
        </div>
      `;

      if (url) {
        const audio = new Audio(url);
        const playBtn = audioContainer.querySelector('.audio-play-btn');

        playBtn.addEventListener('click', () => {
          if (audio.paused) {
            audio.play();
            audioContainer.classList.add('playing');
            playBtn.innerHTML = `
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            `;
          } else {
            audio.pause();
            audioContainer.classList.remove('playing');
            playBtn.innerHTML = `
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            `;
          }
        });

        audio.addEventListener('ended', () => {
          audioContainer.classList.remove('playing');
          playBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          `;
        });
      }

      container.appendChild(audioContainer);
      break;

    case 'document':
    default:
      const docCard = document.createElement('a');
      docCard.className = 'doc-card';
      docCard.href = url || '#';
      docCard.target = '_blank';
      docCard.innerHTML = `
        <div class="doc-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
        <div class="doc-info">
          <div class="doc-title">${filename || 'Attachment'}</div>
          <div class="doc-meta">${url ? 'Click to view/download' : 'File missing from ZIP'}</div>
        </div>
      `;
      container.appendChild(docCard);
      break;
  }

  return container;
}
