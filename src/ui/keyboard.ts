import { state } from '../state';
import { Phase } from '../types';
import { btnStart, btnNext, btnRetry, settingsOverlay } from './dom';
import { audioManager } from '../audio/manager';
import { startWarp } from '../animation/warp';
import { onNextWinner, onRetry } from './result';

function onKeydown(e: KeyboardEvent): void {
  const settingsOpen = settingsOverlay && !settingsOverlay.classList.contains('settings-hidden');

  if (e.code === 'KeyP') {
    e.preventDefault();
    if (settingsOpen) {
      settingsOverlay.classList.add('settings-hidden');
    } else {
      settingsOverlay.classList.remove('settings-hidden');
    }
    return;
  }

  if (settingsOpen) return;
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

  switch (e.code) {
    case 'Space':
    case 'Enter':
      e.preventDefault();
      if (state.phase === Phase.IDLE) {
        state.selectedIdx = Math.floor(Math.random() * state.activeData.length);
        startWarp();
      } else if (state.phase === Phase.RESULT) {
        onNextWinner();
      }
      break;
    case 'KeyM':
      e.preventDefault();
      state.settings.soundEnabled = !state.settings.soundEnabled;
      const optSound = document.getElementById('opt-sound') as HTMLInputElement;
      if (optSound) optSound.checked = state.settings.soundEnabled;
      audioManager.playBgm(state.settings.soundEnabled);
      break;
  }
}

export function initKeyboard(): void {
  document.addEventListener('keydown', onKeydown);
}
