import * as THREE from 'three';
import { atmosphereVertex, atmosphereFragment } from '../shaders';
import { scene } from './setup';
import { state } from '../state';
import type { DataItem, PlanetData } from '../types';

const PLANET_COLORS: PlanetData[] = [
  { name: '', desc: '', color: [0.9, 0.3, 0.1], atmosphere: [1.0, 0.4, 0.1], rings: false },
  { name: '', desc: '', color: [0.4, 0.7, 0.95], atmosphere: [0.5, 0.8, 1.0], rings: false },
  { name: '', desc: '', color: [0.2, 0.7, 0.3], atmosphere: [0.3, 0.8, 0.4], rings: false },
  { name: '', desc: '', color: [0.6, 0.2, 0.8], atmosphere: [0.7, 0.3, 0.9], rings: true },
  { name: '', desc: '', color: [0.85, 0.7, 0.3], atmosphere: [0.9, 0.8, 0.4], rings: false },
  { name: '', desc: '', color: [0.1, 0.3, 0.8], atmosphere: [0.2, 0.4, 0.9], rings: true },
  { name: '', desc: '', color: [0.7, 0.2, 0.15], atmosphere: [0.8, 0.3, 0.2], rings: false },
  { name: '', desc: '', color: [0.5, 0.5, 0.55], atmosphere: [0.6, 0.6, 0.65], rings: true },
];

const sharedPlanetGeo = new THREE.SphereGeometry(1, 64, 64);

export const allPlanetGroups: THREE.Group[] = [];
export const planetMeshes: THREE.Mesh[] = [];
export let earthGroup: THREE.Group | null = null;
export let isEarthEasterEgg = false;

const EARTH_CHANCE = 0.12;

function simplex2d(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

function generatePlanetTexture(planetData: PlanetData, size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext('2d')!;
  const [r, g, b] = planetData.color;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const nx = x / canvas.width;
      const ny = y / canvas.height;
      const noise = simplex2d(nx * 6, ny * 6) * 0.3
        + simplex2d(nx * 12, ny * 12) * 0.15
        + simplex2d(nx * 24, ny * 24) * 0.07;
      const bands = Math.sin(ny * Math.PI * 8 + noise * 4) * 0.08;
      const cr = Math.max(0, Math.min(1, r + noise * 0.3 + bands));
      const cg = Math.max(0, Math.min(1, g + noise * 0.25 + bands));
      const cb = Math.max(0, Math.min(1, b + noise * 0.2 + bands));
      ctx.fillStyle = `rgb(${cr * 255 | 0},${cg * 255 | 0},${cb * 255 | 0})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const px = (i / 4) % canvas.width;
    const py = Math.floor((i / 4) / canvas.width);
    const nx = px / canvas.width;
    const ny = py / canvas.height;
    const detail = simplex2d(nx * 30, ny * 30) * 0.08;
    data[i] = Math.max(0, Math.min(255, data[i] + detail * 255));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + detail * 255));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + detail * 255));
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function generateBumpTexture(planetData: PlanetData, size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(canvas.width, canvas.height);
  const data = imgData.data;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const nx = x / canvas.width;
      const ny = y / canvas.height;
      const v = (simplex2d(nx * 10, ny * 10) * 0.5 + 0.5) * 255;
      const idx = (y * canvas.width + x) * 4;
      data[idx] = data[idx + 1] = data[idx + 2] = v | 0;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return new THREE.CanvasTexture(canvas);
}

function createPlanetGroup(
  planetData: PlanetData,
  _data: DataItem
): THREE.Group {
  const group = new THREE.Group();

  const tex = generatePlanetTexture(planetData);
  const bumpTex = generateBumpTexture(planetData);
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    bumpMap: bumpTex,
    bumpScale: 0.03,
    roughness: 0.8,
    metalness: 0.1,
  });

  const mesh = new THREE.Mesh(sharedPlanetGeo, mat);
  mesh.scale.setScalar(2);
  group.add(mesh);
  planetMeshes.push(mesh);

  const atmoColor = new THREE.Color(
    planetData.atmosphere[0],
    planetData.atmosphere[1],
    planetData.atmosphere[2]
  );
  const atmoMat = new THREE.ShaderMaterial({
    uniforms: { glowColor: { value: atmoColor } },
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const atmoMesh = new THREE.Mesh(new THREE.SphereGeometry(2.18, 48, 48), atmoMat);
  group.add(atmoMesh);

  if (planetData.rings) {
    const ringMat = new THREE.MeshStandardMaterial({
      color: atmoColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      roughness: 0.9,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(2.8, 4.2, 64), ringMat);
    ring.rotation.x = Math.PI * 0.45;
    group.add(ring);
  }

  group.visible = false;
  scene.add(group);
  allPlanetGroups.push(group);
  return group;
}

function createEarthGroup(): THREE.Group {
  const group = new THREE.Group();

  const texLoader = new THREE.TextureLoader();
  const dayTex = texLoader.load('/src/texture/earth_day_4096.jpg');
  dayTex.colorSpace = THREE.SRGBColorSpace;
  const nightTex = texLoader.load('/src/texture/earth_night_4096.jpg');
  nightTex.colorSpace = THREE.SRGBColorSpace;

  const mat = new THREE.MeshStandardMaterial({
    map: dayTex,
    roughness: 0.7,
    metalness: 0.1,
  });

  const mesh = new THREE.Mesh(sharedPlanetGeo, mat);
  mesh.scale.setScalar(2);
  group.add(mesh);

  const atmoMat = new THREE.ShaderMaterial({
    uniforms: { glowColor: { value: new THREE.Color(0.3, 0.6, 1.0) } },
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const atmoMesh = new THREE.Mesh(new THREE.SphereGeometry(2.15, 48, 48), atmoMat);
  group.add(atmoMesh);

  group.visible = false;
  scene.add(group);
  return group;
}

export function initPlanets(data: DataItem[]): void {
  for (let i = 0; i < data.length; i++) {
    const planetData: PlanetData = {
      color: [...PLANET_COLORS[i % PLANET_COLORS.length].color] as [number, number, number],
      atmosphere: [...PLANET_COLORS[i % PLANET_COLORS.length].atmosphere] as [number, number, number],
      rings: Math.random() > 0.6,
      name: '',
      desc: '',
    };
    createPlanetGroup(planetData, data[i]);
  }
  earthGroup = createEarthGroup();
}

export function rebuildPlanets(data: DataItem[]): void {
  for (const g of allPlanetGroups) scene.remove(g);
  if (earthGroup) scene.remove(earthGroup);
  allPlanetGroups.length = 0;
  planetMeshes.length = 0;

  for (let i = 0; i < data.length; i++) {
    const base = PLANET_COLORS[i % PLANET_COLORS.length];
    const planetData: PlanetData = {
      color: base.color.map(c => c + (Math.random() - 0.5) * 0.15) as [number, number, number],
      atmosphere: [...base.atmosphere] as [number, number, number],
      rings: Math.random() > 0.6,
      name: '',
      desc: '',
    };
    createPlanetGroup(planetData, data[i]);
  }
  earthGroup = createEarthGroup();
}

export function checkEarthEasterEgg(): boolean {
  isEarthEasterEgg = Math.random() < EARTH_CHANCE;
  return isEarthEasterEgg;
}

export function getActivePlanetGroup(): THREE.Group | null {
  if (isEarthEasterEgg && earthGroup) return earthGroup;
  const idx = state.selectedIdx;
  if (idx >= 0 && idx < allPlanetGroups.length) return allPlanetGroups[idx];
  return null;
}

export function hideAllPlanets(): void {
  for (const g of allPlanetGroups) g.visible = false;
  if (earthGroup) earthGroup.visible = false;
  for (const s of state.flybySlots) s.group.visible = false;
}
