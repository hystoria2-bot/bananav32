(() => {
  'use strict';

  const STORAGE_KEY = 'banana-rush-muted';
  const MUSIC_PATH = './Banana-Rush-Bounce.mp3';
  const GAME_VOLUME = 0.28;

  const audio = new Audio(MUSIC_PATH);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = GAME_VOLUME;

  let gameStatus = 'menu';
  let userInteracted = false;
  let muted = window.__bananaStorage.getItem(STORAGE_KEY) === '1';
  let button = null;

  const shouldPlay = () =>
    userInteracted &&
    !muted &&
    gameStatus === 'playing' &&
    !document.hidden;

  const playMusic = async () => {
    if (!shouldPlay()) return;
    try {
      await audio.play();
    } catch (error) {
      console.debug('Banana Rush: audio pendiente de interacción.', error);
    }
  };

  const updateButton = () => {
    if (!button) return;
    button.textContent = muted ? '🔇' : '🔊';
    button.setAttribute('aria-label', muted ? 'Activar sonido' : 'Silenciar sonido');
    button.title = muted ? 'Activar sonido' : 'Silenciar sonido';
    button.setAttribute('aria-pressed', String(muted));
  };

  const syncMusic = () => {
    if (shouldPlay()) {
      void playMusic();
    } else {
      audio.pause();
    }
    updateButton();
  };

  const toggleMute = (event) => {
    event.preventDefault();
    event.stopPropagation();
    userInteracted = true;
    muted = !muted;
    window.__bananaStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
    window.dispatchEvent(new CustomEvent('banana-rush-audio-setting', { detail: { muted } }));
    syncMusic();
  };

  const installButton = () => {
    const actions = document.querySelector('.topbar-actions');
    if (!actions) return false;

    button = document.getElementById('banana-music-toggle');
    if (!button) {
      button = document.createElement('button');
      button.id = 'banana-music-toggle';
      button.type = 'button';
      button.className = 'icon-button music-button';
      button.addEventListener('pointerdown', toggleMute);
      actions.appendChild(button);
    }

    updateButton();
    return true;
  };

  const registerInteraction = () => {
    userInteracted = true;
    void playMusic();
  };

  window.addEventListener('banana-rush-status', (event) => {
    gameStatus = event.detail?.status || gameStatus;
    syncMusic();
  });

  document.addEventListener('pointerdown', registerInteraction, {
    capture: true,
    passive: true,
  });
  document.addEventListener('keydown', registerInteraction, {
    capture: true,
  });
  document.addEventListener('visibilitychange', syncMusic);

  window.addEventListener('pagehide', () => audio.pause());
  window.addEventListener('pageshow', syncMusic);

  const observer = new MutationObserver(() => {
    if (!document.getElementById('banana-music-toggle')) {
      installButton();
    }
  });

  const start = () => {
    installButton();
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
