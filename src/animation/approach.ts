import * as THREE from 'three';
import { state } from '../state';
import { Phase } from '../types';
import { updateStarsWarp } from '../scene/stars';
import { starMat } from '../scene/stars';
import { hideAllPlanets, checkEarthEasterEgg, getActivePlanetGroup, isEarthEasterEgg } from '../scene/planets';
import { audioManager } from '../audio/manager';
import { setHandler, transitionTo } from './machine';
import { showResult, setWinnerCard } from '../ui/result';
import { updateFlybySlots } from './idle';

const APPROACH_DURATION = 1.5;

export function startApproach(): void {
  state.approachTime = 0;
  hideAllPlanets();
  checkEarthEasterEgg();

  const group = getActivePlanetGroup();
  if (group) {
    group.visible = true;
    group.position.set(0, 0, -30);
    group.rotation.set(0, 0, 0);
    group.scale.setScalar(0.3);
  }

  transitionTo(Phase.APPROACH);
  setHandler(updateApproach);
}

function updateApproach(dt: number): void {
  state.approachTime += dt;
  const t = Math.min(state.approachTime / APPROACH_DURATION, 1);

  if (starMat) {
    starMat.uniforms.warpFactor.value = Math.max(0, (1 - t) * 0.5);
  }

  updateStarsWarp(dt);
  updateFlybySlots(dt);

  const group = getActivePlanetGroup();
  if (group) {
    const ease = 1 - Math.pow(1 - t, 3);

    group.position.z = -30 + ease * 26;
    group.rotation.y = ease * 0.3;

    const s = 0.3 + ease * 0.7;
    group.scale.setScalar(s);
  }

  if (t >= 1) {
    const group = getActivePlanetGroup();
    if (group) {
      group.rotation.set(0, 0.3, 0);
    }
    transitionTo(Phase.RESULT);
    setHandler(updateResultIdle);
    audioManager.playSfx('result', state.settings.soundEnabled);
    showResult();
    setWinnerCard(state.selectedIdx);
  }
}

function updateResultIdle(dt: number): void {
  const group = getActivePlanetGroup();
  if (group) {
    group.rotation.y += dt * 0.3;
  }
}
