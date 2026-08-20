import { renderIcons } from './icons.js';

export function initProduct360Viewer() {
  let overlay;
  let video;
  let duration = 0;
  let frameId;
  let pendingRatio;

  const removeListeners = () => {
    overlay?.removeEventListener('mousemove', handlePointerMove);
    overlay?.removeEventListener('touchmove', handleTouchMove);
    overlay?.removeEventListener('click', handleOverlayClick);
    document.removeEventListener('keydown', handleKeydown);
    if (frameId) cancelAnimationFrame(frameId);
    frameId = undefined;
    pendingRatio = undefined;
  };

  const close = () => {
    if (!overlay) return;
    removeListeners();
    video.pause();
    video.currentTime = 0;
    overlay.remove();
    overlay = undefined;
    video = undefined;
  };

  const updateFrame = () => {
    frameId = undefined;
    if (!video || !duration || pendingRatio === undefined) return;
    video.currentTime = pendingRatio * duration;
    pendingRatio = undefined;
  };

  const scrub = (clientX) => {
    if (!overlay || !video || !duration) return;
    const zone = overlay.querySelector('.product-360-stage').getBoundingClientRect();
    pendingRatio = Math.max(0, Math.min(1, (clientX - zone.left) / zone.width));
    if (!frameId) frameId = requestAnimationFrame(updateFrame);
    overlay.querySelector('.product-360-hint')?.remove();
  };

  function handlePointerMove(event) { scrub(event.clientX); }
  function handleTouchMove(event) { if (event.touches[0]) scrub(event.touches[0].clientX); }
  function handleOverlayClick(event) { if (event.target === overlay) close(); }
  function handleKeydown(event) { if (event.key === 'Escape') close(); }

  const open = (source) => {
    if (overlay) close();
    overlay = document.createElement('div');
    overlay.className = 'product-360-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Visualiseur 360 degrés de la Robe Noyer');
    overlay.innerHTML = '<button class="header-icon product-360-close" type="button" aria-label="Fermer le visualiseur"><i data-lucide="x"></i></button><div class="product-360-stage"><video muted playsinline preload="auto" disablePictureInPicture disableRemotePlayback controlsList="nofullscreen nodownload noremoteplayback noplaybackrate" class="product-360-video"></video><p class="product-360-hint">Déplacez votre souris pour faire pivoter</p></div>';
    document.body.append(overlay);
    video = overlay.querySelector('video');
    video.src = source;
    video.addEventListener('loadedmetadata', () => { duration = video.duration; });
    overlay.querySelector('.product-360-close').addEventListener('click', close);
    overlay.addEventListener('mousemove', handlePointerMove);
    overlay.addEventListener('touchmove', handleTouchMove, { passive: true });
    overlay.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleKeydown);
    renderIcons();
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-360-viewer]');
    if (!trigger) return;
    event.preventDefault();
    event.stopPropagation();
    const source = trigger.getAttribute('data-open-360-viewer');
    if (source) open(source);
  });
}
