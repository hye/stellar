import type { SfxEvent } from '../types';

export const sfxEvents: SfxEvent[] = ['warp', 'flyby', 'result', 'next', 'reset'];

let audioCtx: AudioContext | null = null;
let activeNodes: OscillatorNode[] = [];

function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function stopActiveNodes(): void {
  for (const node of activeNodes) {
    try { node.stop(); } catch {}
  }
  activeNodes = [];
}

function playProceduralSfx(event: SfxEvent): void {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  if (event !== 'flyby') {
    stopActiveNodes();
  }

  function addNode(osc: OscillatorNode): void {
    activeNodes.push(osc);
    osc.onended = () => {
      const idx = activeNodes.indexOf(osc);
      if (idx >= 0) activeNodes.splice(idx, 1);
    };
  }

  switch (event) {
    case 'warp': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.6);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc.connect(gain).connect(ctx.destination);
      addNode(osc);
      osc.start(now);
      osc.stop(now + 0.8);
      break;
    }
    case 'flyby': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain).connect(ctx.destination);
      addNode(osc);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    }
    case 'result': {
      const notes = [523, 659, 784];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
        osc.connect(gain).connect(ctx.destination);
        addNode(osc);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
      });
      break;
    }
    case 'next': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain).connect(ctx.destination);
      addNode(osc);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
    }
    case 'reset': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.4);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain).connect(ctx.destination);
      addNode(osc);
      osc.start(now);
      osc.stop(now + 0.5);
      break;
    }
  }
}

class AudioManager {
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmBlobUrl: string | null = null;
  private sfxCache: Map<SfxEvent, HTMLAudioElement> = new Map();
  private sfxReady: Set<SfxEvent> = new Set();

  constructor() {
    if (typeof Audio !== 'undefined') {
      sfxEvents.forEach(ev => this.sfxCache.set(ev, new Audio()));
    }
  }

  async loadBgmFromBuffer(buffer: ArrayBuffer): Promise<void> {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.src = '';
    }
    if (this.bgmBlobUrl) URL.revokeObjectURL(this.bgmBlobUrl);

    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    this.bgmBlobUrl = URL.createObjectURL(blob);
    this.bgmAudio = new Audio(this.bgmBlobUrl);
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = 0.3;
  }

  playBgm(enabled: boolean): void {
    if (!this.bgmAudio) return;
    this.bgmAudio.volume = 0.3;
    if (enabled) this.bgmAudio.play().catch(() => {});
    else this.bgmAudio.pause();
  }

  stopBgm(): void {
    if (this.bgmAudio) this.bgmAudio.pause();
  }

  isBgmReady(): boolean {
    return this.bgmAudio !== null;
  }

  async loadSfx(event: SfxEvent, buffer: ArrayBuffer, mimeType: string): Promise<void> {
    const blob = new Blob([buffer], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const audio = this.sfxCache.get(event)!;
    audio.src = url;
    this.sfxReady.add(event);
  }

  playSfx(event: SfxEvent, enabled: boolean): void {
    if (!enabled) return;

    const audio = this.sfxCache.get(event);
    if (audio && this.sfxReady.has(event) && audio.src) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      playProceduralSfx(event);
    }
  }
}

export const audioManager = new AudioManager();
