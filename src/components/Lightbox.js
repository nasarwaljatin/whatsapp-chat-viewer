/**
 * Fullscreen Lightbox Modal component for viewing images
 */

export function createLightboxModal(imageUrl, onClose) {
  const modal = document.createElement('div');
  modal.className = 'lightbox-modal';

  modal.innerHTML = `
    <button class="lightbox-close-btn" title="Close">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <img src="${imageUrl}" class="lightbox-content" alt="Enlarged media" />
  `;

  const closeBtn = modal.querySelector('.lightbox-close-btn');
  closeBtn.addEventListener('click', () => {
    modal.remove();
    if (onClose) onClose();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      if (onClose) onClose();
    }
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleKeyDown);
      if (onClose) onClose();
    }
  };
  document.addEventListener('keydown', handleKeyDown);

  document.body.appendChild(modal);
}
