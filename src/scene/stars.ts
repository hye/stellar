import * as THREE from 'three';
import { starVertex, starFragment } from '../shaders';
import { scene } from './setup';

const STAR_COUNT = 3000;

let starGeo: THREE.BufferGeometry;
export let starMat: THREE.ShaderMaterial;
const starPositions: Float32Array = new Float32Array(STAR_COUNT * 3);
const starColors: Float32Array = new Float32Array(STAR_COUNT * 3);
const starSizes: Float32Array = new Float32Array(STAR_COUNT);
const starVelocities: Float32Array = new Float32Array(STAR_COUNT);

function resetStar(i: number, randomZ: boolean): void {
  const i3 = i * 3;
  starPositions[i3] = (Math.random() - 0.5) * 800;
  starPositions[i3 + 1] = (Math.random() - 0.5) * 800;
  starPositions[i3 + 2] = randomZ
    ? (Math.random() * 800 + 50)
    : (Math.random() * 2000 - 200);
  const c = new THREE.Color().setHSL(
    0.55 + Math.random() * 0.15,
    0.3 + Math.random() * 0.4,
    0.7 + Math.random() * 0.3
  );
  starColors[i3] = c.r;
  starColors[i3 + 1] = c.g;
  starColors[i3 + 2] = c.b;
  starSizes[i] = 0.5 + Math.random() * 2.0;
  starVelocities[i] = 0.3 + Math.random() * 0.7;
}

export function initStars(): void {
  starGeo = new THREE.BufferGeometry();
  for (let i = 0; i < STAR_COUNT; i++) {
    resetStar(i, false);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

  starMat = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      warpFactor: { value: 0 },
    },
    vertexShader: starVertex,
    fragmentShader: starFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);
}

export function updateStarsIdle(dt: number): void {
  const posArr = starGeo.attributes.position.array as Float32Array;
  for (let i = 0; i < STAR_COUNT; i++) {
    const i3 = i * 3;
    posArr[i3 + 2] -= starVelocities[i] * dt * 8;
    if (posArr[i3 + 2] < -100) {
      posArr[i3 + 2] = 1000 + Math.random() * 500;
      posArr[i3] = (Math.random() - 0.5) * 800;
      posArr[i3 + 1] = (Math.random() - 0.5) * 800;
    }
  }
  starGeo.attributes.position.needsUpdate = true;
}

export function updateStarsWarp(dt: number): void {
  const posArr = starGeo.attributes.position.array as Float32Array;
  const warp = starMat.uniforms.warpFactor.value;
  for (let i = 0; i < STAR_COUNT; i++) {
    const i3 = i * 3;
    const speed = (1 + warp * 15) * starVelocities[i] * 40;
    posArr[i3 + 2] -= speed * dt;
    if (posArr[i3 + 2] < -100) {
      posArr[i3 + 2] = 800 + Math.random() * 400;
      posArr[i3] = (Math.random() - 0.5) * 600;
      posArr[i3 + 1] = (Math.random() - 0.5) * 600;
    }
  }
  starGeo.attributes.position.needsUpdate = true;
}
