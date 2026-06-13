import * as THREE from 'three';
import { Phase, type DataItem, type FlybySlot, type Settings } from './types';

class AppState {
  phase: Phase = Phase.IDLE;
  selectedIdx: number = -1;
  warpTime: number = 0;
  approachTime: number = 0;
  spawnAccum: number = 0;
  flybySpawned: number = 0;
  flybyTarget: number = 2;

  flybySlots: FlybySlot[] = [];
  winnerPool: DataItem[] = [];
  winnersRevealed: number = 0;
  drawnIndices: Set<number> = new Set();
  activeData: DataItem[] = [];
  currentPreset: string | null = null;

  settings: Settings = {
    soundEnabled: true,
    selectionCount: 1,
    excludeDrawn: true,
  };

  imgCache: Map<string, HTMLImageElement> = new Map();

  camera!: THREE.PerspectiveCamera;
}

export const state = new AppState();
