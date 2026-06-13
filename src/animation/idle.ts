import { state } from '../state';
import { updateStarsIdle } from '../scene/stars';
import { starMat } from '../scene/stars';
import { camera } from '../scene/setup';
import { setHandler } from './machine';

export function updateFlybySlots(dt: number): void {
  for (let i = state.flybySlots.length - 1; i >= 0; i--) {
    const slot = state.flybySlots[i];
    slot.progress += dt * slot.speed;
    const t = slot.progress;
    slot.group.visible = true;

    const z = -80 + t * 100;
    const x = slot.offsetX + Math.sin(t * 2) * 3;
    const y = slot.offsetY + Math.cos(t * 1.5) * 2;
    slot.group.position.set(x, y, z);

    const scaleAtEnd = t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1;
    const scale = slot.baseScale * Math.max(0.05, scaleAtEnd) * (0.3 + t * 0.7);
    slot.group.scale.setScalar(scale);
    slot.group.rotation.y += dt * 3;
    slot.group.rotation.x += dt * 1.2;

    if (slot.group.children[0]) {
      const mesh = slot.group.children[0] as any;
      if (mesh.rotation) mesh.rotation.y += dt * 2;
    }

    if (t >= 1) {
      slot.group.visible = false;
      state.flybySlots.splice(i, 1);
    }
  }
}

export function updateStarsIdleOnly(dt: number): void {
  updateStarsIdle(dt);
}

export function startIdle(): void {
  camera.position.set(0, 0, 5);
  if (starMat) starMat.uniforms.warpFactor.value = 0;
  setHandler(() => {});
}
