(() => {
  'use strict';

  const STORAGE_KEY = 'banana-rush-progress-v1';
  const SELECTED_KEY = 'banana-rush-selected-level';
  const LEVELS = [
    ['Costa Dorada', '#67d5ff', '#4fd05b'],
    ['Selva Esmeralda', '#55c79b', '#58d36a'],
    ['Atardecer Mango', '#ff9b71', '#d7bc4b'],
    ['Cueva de Cristal', '#182a54', '#7fe7ff'],
    ['Nubes de Vainilla', '#9bcbff', '#f7df72'],
    ['Volcán Picante', '#5a1931', '#ff7e42'],
    ['Bosque Nocturno', '#101936', '#69d68b'],
    ['Ruinas del Sol', '#e9b96f', '#b8bf54'],
    ['Tormenta Tropical', '#2d5266', '#67bd73'],
    ['Templo Banana', '#3b226b', '#f5c84b'],
  ];

  let status = window.__BANANA_RUSH_STATE__?.status || 'menu';
  let overlay = null;
  let mapButton = null;

  const defaultProgress = () => ({ unlocked: 1, levels: {} });

  const readProgress = () => {
    try {
      const parsed = JSON.parse(window.__bananaStorage.getItem(STORAGE_KEY) || '{}');
      return {
        unlocked: Math.max(1, Math.min(10, Number(parsed.unlocked) || 1)),
        levels: parsed.levels && typeof parsed.levels === 'object' ? parsed.levels : {},
      };
    } catch {
      return defaultProgress();
    }
  };

  const writeProgress = (progress) => {
    window.__bananaStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  };

  const saveResult = (detail) => {
    if (detail.status !== 'levelcomplete') return;
    const level = Number(detail.level);
    if (!Number.isFinite(level)) return;
    const progress = readProgress();
    const previous = progress.levels[level] || {};
    progress.levels[level] = {
      stars: Math.max(Number(previous.stars) || 0, Number(detail.stars) || 1),
      bestTime: previous.bestTime == null ? Number(detail.time) : Math.min(Number(previous.bestTime), Number(detail.time)),
    };
    progress.unlocked = Math.max(progress.unlocked, Math.min(10, level + 1));
    writeProgress(progress);
    renderGrid();
  };

  const createOverlay = () => {
    overlay = document.createElement('div');
    overlay.id = 'banana-level-map';
    overlay.className = 'banana-level-map';
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="level-map-panel" role="dialog" aria-modal="true" aria-labelledby="level-map-title">
        <header class="level-map-header">
          <div>
            <span class="level-map-kicker">LAS DIEZ ISLAS</span>
            <h2 id="level-map-title">Selecciona un nivel</h2>
          </div>
          <button type="button" class="level-map-close" aria-label="Cerrar mapa">×</button>
        </header>
        <div class="level-map-grid" id="banana-level-grid"></div>
        <p class="level-map-note">Supera un nivel para desbloquear el siguiente. Se guardan tus estrellas y tu mejor tiempo.</p>
      </section>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.level-map-close').addEventListener('click', closeMap);
    overlay.addEventListener('pointerdown', (event) => {
      if (event.target === overlay) closeMap();
    });
    renderGrid();
  };

  const renderGrid = () => {
    if (!overlay) return;
    const grid = overlay.querySelector('#banana-level-grid');
    if (!grid) return;
    const progress = readProgress();
    grid.replaceChildren();

    LEVELS.forEach(([name, sky, accent], index) => {
      const level = index + 1;
      const unlocked = level <= progress.unlocked;
      const result = progress.levels[level] || {};
      const stars = Math.max(0, Math.min(3, Number(result.stars) || 0));
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `level-card${unlocked ? '' : ' is-locked'}`;
      button.disabled = !unlocked;
      button.style.setProperty('--level-sky', sky);
      button.style.setProperty('--level-accent', accent);
      button.innerHTML = `
        <span class="level-card-number">${unlocked ? level : '🔒'}</span>
        <span class="level-card-copy">
          <strong>${name}</strong>
          <small>${unlocked ? `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}${result.bestTime != null ? ` · ${result.bestTime}s` : ''}` : 'Bloqueado'}</small>
        </span>`;
      if (unlocked) {
        button.addEventListener('click', () => {
          window.__bananaStorage.setItem(SELECTED_KEY, String(level));
          closeMap();
          window.dispatchEvent(new CustomEvent('banana-rush-select-level', { detail: { level } }));
        });
      }
      grid.appendChild(button);
    });
  };

  function openMap() {
    if (!overlay) createOverlay();
    if (status === 'playing') {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
    }
    renderGrid();
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('is-open'));
  }

  function closeMap() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    window.setTimeout(() => {
      if (overlay && !overlay.classList.contains('is-open')) overlay.hidden = true;
    }, 160);
  }

  const installMapButton = () => {
    const actions = document.querySelector('.topbar-actions');
    if (!actions) return false;
    mapButton = document.getElementById('banana-level-map-button');
    if (!mapButton) {
      mapButton = document.createElement('button');
      mapButton.id = 'banana-level-map-button';
      mapButton.type = 'button';
      mapButton.className = 'icon-button map-button';
      mapButton.textContent = '🗺';
      mapButton.title = 'Seleccionar nivel';
      mapButton.setAttribute('aria-label', 'Abrir selección de niveles');
      mapButton.addEventListener('click', openMap);
      const home = actions.querySelector('.home-button');
      actions.insertBefore(mapButton, home || actions.firstChild);
    }
    return true;
  };

  window.addEventListener('banana-rush-status', (event) => {
    status = event.detail?.status || status;
    saveResult(event.detail || {});
  });

  window.addEventListener('banana-rush-home', () => {
    window.setTimeout(openMap, 80);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay && !overlay.hidden) {
      event.preventDefault();
      closeMap();
    }
  });

  const observer = new MutationObserver(installMapButton);
  const start = () => {
    createOverlay();
    installMapButton();
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
