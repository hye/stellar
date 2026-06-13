import * as THREE from 'three';
import { nebulaVertex, nebulaFragment } from '../shaders';
import { scene } from './setup';

const NEBULA_COUNT = 200;

export let nebulaMat: THREE.ShaderMaterial;

export function initNebula(): void {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(NEBULA_COUNT * 3);
  const sizes = new Float32Array(NEBULA_COUNT);

  for (let i = 0; i < NEBULA_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1500;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1500;
    positions[i * 3 + 2] = -Math.random() * 1500;
    sizes[i] = 30 + Math.random() * 80;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  nebulaMat = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: nebulaVertex,
    fragmentShader: nebulaFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const nebula = new THREE.Points(geo, nebulaMat);
  scene.add(nebula);
}
