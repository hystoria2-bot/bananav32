(() => {
  'use strict';
  const MUTE_KEY = 'banana-rush-muted';
  let context = null;

  const getContext = () => {
    if (!context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      context = new AudioContextClass();
    }
    if (context.state === 'suspended') void context.resume();
    return context;
  };

  const muted = () => localStorage.getItem(MUTE_KEY) === '1';

  const tone = (frequency, duration, options = {}) => {
    if (muted()) return;
    const ctx = getContext();
    if (!ctx) return;
    const now = ctx.currentTime + (options.delay || 0);
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = options.wave || 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);
    if (options.endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, options.endFrequency), now + duration);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(options.volume || 0.08, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  };

  const play = (type) => {
    switch (type) {
      case 'jump':
        tone(260, 0.12, { endFrequency: 470, wave: 'square', volume: 0.045 });
        break;
      case 'double':
        tone(360, 0.16, { endFrequency: 760, wave: 'triangle', volume: 0.06 });
        tone(520, 0.13, { endFrequency: 900, delay: 0.035, volume: 0.04 });
        break;
      case 'coin':
        tone(880, 0.08, { endFrequency: 1280, volume: 0.045 });
        tone(1320, 0.08, { delay: 0.055, volume: 0.035 });
        break;
      case 'power':
        [420, 560, 760].forEach((frequency, index) => tone(frequency, 0.13, { delay: index * 0.055, wave: 'triangle', volume: 0.045 }));
        break;
      case 'life':
        [440, 660, 880, 1100].forEach((frequency, index) => tone(frequency, 0.18, { delay: index * 0.07, volume: 0.055 }));
        break;
      case 'checkpoint':
        tone(520, 0.12, { endFrequency: 720, volume: 0.045 });
        tone(820, 0.16, { delay: 0.09, volume: 0.05 });
        break;
      case 'stomp':
        tone(150, 0.11, { endFrequency: 70, wave: 'square', volume: 0.07 });
        break;
      case 'hurt':
        tone(240, 0.25, { endFrequency: 80, wave: 'sawtooth', volume: 0.055 });
        break;
      case 'gameover':
        [330, 260, 196, 130].forEach((frequency, index) => tone(frequency, 0.28, { delay: index * 0.16, wave: 'triangle', volume: 0.05 }));
        break;
      case 'complete':
        [523, 659, 784, 1047].forEach((frequency, index) => tone(frequency, 0.28, { delay: index * 0.09, volume: 0.05 }));
        break;
    }
  };

  window.addEventListener('banana-rush-sfx', (event) => play(event.detail?.type));
  document.addEventListener('pointerdown', getContext, { once: true, capture: true });
  document.addEventListener('keydown', getContext, { once: true, capture: true });
})();
