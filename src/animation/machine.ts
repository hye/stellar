import { state } from '../state';
import { Phase } from '../types';

let currentHandler: ((dt: number) => void) | null = null;

export function setHandler(handler: ((dt: number) => void) | null): void {
  currentHandler = handler;
}

export function updateAnimation(dt: number): void {
  if (currentHandler) currentHandler(dt);
}

export function transitionTo(phase: Phase): void {
  state.phase = phase;
}
