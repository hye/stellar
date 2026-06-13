import * as THREE from 'three';
import { state } from '../state';
import { Phase } from '../types';
import { updateStarsWarp } from '../scene/stars';
import { starMat } from '../scene/stars';
import { allPlanetGroups, planetMeshes, hideAllPlanets } from '../scene/planets';
import { audioManager } from '../audio/manager';
import { setHandler, transitionTo } from './machine';
import { startApproach } from './approach';
import { updateFlybySlots } from './idle';
import { btnStart } from '../ui/dom';

const WARP_DURATION = 2.0;
const FLYBY_COUNT_MIN = 1;
const FLYBY_COUNT_MAX = 3;

function resetFlybySlots(): void {
  for (const slot of state.flybySlots) {
    slot.group.visible = false;
  }
  state.flybySlots.length = 0;
  state.spawnAccum = 0;
}

function pickRandomPlanetGroup(): THREE.Group | null {
  if (allPlanetGroups.length === 0) return null;
  const notInSlot = allPlanetGroups.filter(g => !state.flybySlots.some(s => s.group === g));
  if (notInSlot.length === 0) return null;
  return notInSlot[Math.floor(Math.random() * notInSlot.length)];
}

function pickWinner(): number {
  if (state.settings.excludeDrawn && state.drawnIndices.size < state.activeData.length) {
    const available: number[] = [];
    for (let i = 0; i < state.activeData.length; i++) {
      if (!state.drawnIndices.has(i)) available.push(i);
    }
    return available[Math.floor(Math.random() * available.length)];
  }
  return Math.floor(Math.random() * state.activeData.length);
}

export function startWarp(): void {
  state.warpTime = 0;
  state.flybySlots.length = 0;
  state.spawnAccum = 0;
  state.flybySpawned = 0;
  state.flybyTarget = FLYBY_COUNT_MIN + Math.floor(Math.random() * (FLYBY_COUNT_MAX - FLYBY_COUNT_MIN + 1));
  hideAllPlanets();
  btnStart.style.display = 'none';

  state.selectedIdx = pickWinner();
  const selected = state.activeData[state.selectedIdx];
  if (selected) {
    state.winnerPool.push(selected);
    state.drawnIndices.add(state.selectedIdx);
  }

  audioManager.playSfx('warp', state.settings.soundEnabled);
  transitionTo(Phase.WARP);
  setHandler(updateWarp);
}

export function updateWarp(dt: number): void {
  state.warpTime += dt;

  if (starMat) {
    const t = state.warpTime;
    let warp: number;
    if (t < WARP_DURATION * 0.3) {
      warp = (t / (WARP_DURATION * 0.3)) * 0.8;
    } else if (t < WARP_DURATION * 0.7) {
      warp = 0.8 + Math.sin((t - WARP_DURATION * 0.3) / (WARP_DURATION * 0.4) * Math.PI) * 0.2;
    } else {
      const ease = 1 - (t - WARP_DURATION * 0.7) / (WARP_DURATION * 0.3);
      warp = Math.max(0, ease * 0.8);
    }
    starMat.uniforms.warpFactor.value = warp;
  }

  updateStarsWarp(dt);
  updateFlybySlots(dt);

  const spawnInterval = WARP_DURATION / (state.flybyTarget + 1);
  state.spawnAccum += dt;
  while (state.spawnAccum >= spawnInterval && state.flybySpawned < state.flybyTarget) {
    state.spawnAccum -= spawnInterval;
    state.flybySpawned++;
    const planetGroup = pickRandomPlanetGroup();
    if (planetGroup) {
      planetGroup.visible = true;
      const speed = 0.6 + Math.random() * 0.8;
      state.flybySlots.push({
        idx: Math.floor(Math.random() * planetMeshes.length),
        group: planetGroup,
        progress: 0,
        speed,
        offsetX: (Math.random() - 0.5) * 10,
        offsetY: (Math.random() - 0.5) * 8,
        baseScale: 0.8 + Math.random() * 2.0,
      });
      audioManager.playSfx('flyby', state.settings.soundEnabled);
    }
  }

  if (state.warpTime >= WARP_DURATION) {
    hideAllPlanets();
    resetFlybySlots();
    startApproach();
  }
}
