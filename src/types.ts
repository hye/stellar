export enum Phase {
  IDLE = 0,
  WARP = 1,
  SELECT = 2,
  APPROACH = 3,
  RESULT = 4,
}

export interface DataItem {
  id: string;
  name: string;
  emoji: string;
  imgUrl: string;
  desc: string;
  title: string;
  subtitle: string;
}

export interface PlanetData {
  name: string;
  desc: string;
  color: [number, number, number];
  atmosphere: [number, number, number];
  rings: boolean;
}

export interface PresetData {
  title: string;
  titleColor: [number, number, number];
  data: DataItem[];
}

export interface FlybySlot {
  idx: number;
  group: THREE.Group;
  progress: number;
  speed: number;
  offsetX: number;
  offsetY: number;
  baseScale: number;
}

export interface Settings {
  soundEnabled: boolean;
  selectionCount: number;
  excludeDrawn: boolean;
}

export type SfxEvent = 'warp' | 'flyby' | 'result' | 'next' | 'reset';

import type * as THREE from 'three';
