import { initScene, handleResize, composer } from './scene/setup';
import { initStars, starMat } from './scene/stars';
import { initPlanets, hideAllPlanets } from './scene/planets';
import { initNebula } from './scene/nebula';
import { presets } from './data/presets';
import { preloadImages } from './data/cache';
import { state } from './state';
import { Phase } from './types';
import { initSettings } from './ui/settings';
import { initKeyboard } from './ui/keyboard';
import { btnStart, btnNext, btnRetry, canvasContainer } from './ui/dom';
import { startWarp } from './animation/warp';
import { onNextWinner, onRetry } from './ui/result';
import { startIdle, updateStarsIdleOnly } from './animation/idle';
import { updateAnimation } from './animation/machine';

function init(): void {
  initScene(canvasContainer);
  initStars();
  initNebula();

  const defaultPreset = presets['food'];
  state.activeData = defaultPreset.data;
  state.currentPreset = 'food';
  initPlanets(defaultPreset.data);
  preloadImages(defaultPreset.data);

  initSettings();
  initKeyboard();

  btnStart.addEventListener('click', () => {
    if (state.phase !== Phase.IDLE) return;
    state.selectedIdx = Math.floor(Math.random() * state.activeData.length);
    startWarp();
  });

  btnNext.addEventListener('click', () => onNextWinner());
  btnRetry.addEventListener('click', () => onRetry());

  window.addEventListener('resize', handleResize);

  startIdle();
  animate();
}

let lastTime = 0;
function animate(time: number = 0): void {
  requestAnimationFrame(animate);
  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;

  updateAnimation(dt);

  if (state.phase === Phase.IDLE) {
    updateStarsIdleOnly(dt);
  }

  composer.render();
}

init();
