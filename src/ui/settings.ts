import { state } from '../state';
import { presets, presetKeys } from '../data/presets';
import { parseFileContent } from '../data/parser';
import { preloadImages, clearImageCache } from '../data/cache';
import { rebuildPlanets, hideAllPlanets } from '../scene/planets';
import { audioManager } from '../audio/manager';
import { readAudioFile } from '../audio/blob-loader';
import { sfxEvents } from '../audio/manager';
import {
  settingsOverlay, settingsClose, tabBtns, tabPanels,
  dataInput, fileInput, dropZone, dataStatus,
  btnLoadData, btnClearData, optTitle, optSound, optExcludeDrawn,
  countDisplay, countMinus, countPlus,
  bgmDropZone, bgmFileInput, bgmStatus,
  sfxList, builtinCount, presetBtns, btnSettings,
} from './dom';

let currentFmt: 'txt' | 'csv' = 'txt';
let selectedPresetKey: string | null = null;

function setActiveTab(tabName: string): void {
  tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
  tabPanels.forEach(panel => {
    const isTarget = panel.id === `tab-${tabName}`;
    panel.classList.toggle('active', isTarget);
  });
}

function openSettings(): void {
  settingsOverlay.classList.remove('settings-hidden');
}

function closeSettings(): void {
  settingsOverlay.classList.add('settings-hidden');
}

function updateCountDisplay(): void {
  countDisplay.textContent = String(state.settings.selectionCount);
}

function loadDataFromText(text: string, fmt: 'txt' | 'csv'): void {
  const data = parseFileContent(text, fmt);
  if (data.length === 0) {
    dataStatus.textContent = '⚠ 未识别到有效数据';
    return;
  }
  state.activeData = data;
  state.currentPreset = null;
  rebuildPlanets(data);
  preloadImages(data);
  state.winnerPool.length = 0;
  state.winnersRevealed = 0;
  dataStatus.textContent = `✓ 已载入 ${data.length} 条数据`;
  builtinCount.textContent = `当前: 自定义数据 (${data.length} 条)`;
}

function loadPreset(key: string): void {
  const preset = presets[key];
  if (!preset) return;
  state.activeData = preset.data;
  state.currentPreset = key;
  state.winnerPool.length = 0;
  state.winnersRevealed = 0;
  state.drawnIndices.clear();
  rebuildPlanets(preset.data);
  preloadImages(preset.data);

  const lines = preset.data.map(item => {
    if (item.imgUrl) return `${item.id},${item.name},${item.imgUrl}`;
    if (item.emoji) return `${item.id},${item.name},${item.emoji}`;
    return item.name;
  });
  dataInput.value = lines.join('\n');

  builtinCount.textContent = `当前: ${preset.title} (${preset.data.length} 条)`;
  dataStatus.textContent = `✓ 已载入预设: ${preset.title} (${preset.data.length} 条)`;
  selectedPresetKey = key;
  presetBtns.forEach(btn => {
    btn.classList.toggle('active-preset', btn.dataset.preset === key);
  });
}

function setupFileDrop(): void {
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer?.files[0];
    if (file) readFile(file);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files?.[0]) readFile(fileInput.files[0]);
  });
}

function readFile(file: File): void {
  const reader = new FileReader();
  reader.onload = () => {
    dataInput.value = reader.result as string;
    const fmt = file.name.endsWith('.csv') ? 'csv' : 'txt';
    currentFmt = fmt;
    loadDataFromText(dataInput.value, fmt);
  };
  reader.readAsText(file);
}

function setupBgmDrop(): void {
  bgmDropZone.addEventListener('click', () => bgmFileInput.click());
  bgmDropZone.addEventListener('dragover', (e) => { e.preventDefault(); bgmDropZone.classList.add('dragover'); });
  bgmDropZone.addEventListener('dragleave', () => bgmDropZone.classList.remove('dragover'));
  bgmDropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    bgmDropZone.classList.remove('dragover');
    const file = e.dataTransfer?.files[0];
    if (file) await loadBgmFile(file);
  });
  bgmFileInput.addEventListener('change', async () => {
    if (bgmFileInput.files?.[0]) await loadBgmFile(bgmFileInput.files[0]);
  });
}

async function loadBgmFile(file: File): Promise<void> {
  try {
    const buffer = await readAudioFile(file);
    await audioManager.loadBgmFromBuffer(buffer);
    bgmStatus.textContent = `✓ 已加载: ${file.name}`;
    audioManager.playBgm(state.settings.soundEnabled);
  } catch {
    bgmStatus.textContent = `✗ 加载失败: ${file.name}`;
  }
}

function setupSfxUploads(): void {
  for (const event of sfxEvents) {
    const row = document.createElement('div');
    row.className = 'sfx-row';
    row.innerHTML = `
      <span class="sfx-label">${event}</span>
      <input type="file" accept="audio/*" hidden>
      <button class="sfx-upload-btn">上传</button>
      <span class="sfx-status hint"></span>
    `;
    const btn = row.querySelector('.sfx-upload-btn')!;
    const input = row.querySelector('input')! as HTMLInputElement;
    const status = row.querySelector('.sfx-status')!;
    btn.addEventListener('click', () => input.click());
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const buffer = await file.arrayBuffer();
        await audioManager.loadSfx(event, buffer, file.type);
        status.textContent = `✓ ${file.name}`;
      } catch {
        status.textContent = `✗ 加载失败`;
      }
    });
    sfxList.appendChild(row);
  }
}

export function initSettings(): void {
  btnSettings.addEventListener('click', openSettings);
  settingsClose.addEventListener('click', closeSettings);
  settingsOverlay.addEventListener('click', (e) => {
    if (e.target === settingsOverlay) closeSettings();
  });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab || 'data'));
  });

  const radioItems = document.querySelectorAll('input[name="fmt"]') as NodeListOf<HTMLInputElement>;
  radioItems.forEach(radio => {
    radio.addEventListener('change', () => {
      currentFmt = radio.value as 'txt' | 'csv';
    });
  });

  btnLoadData.addEventListener('click', () => {
    if (dataInput.value.trim()) loadDataFromText(dataInput.value, currentFmt);
  });

  btnClearData.addEventListener('click', () => {
    const defaultPreset = presets['food'];
    state.activeData = defaultPreset.data;
    state.currentPreset = 'food';
    state.winnerPool.length = 0;
    state.winnersRevealed = 0;
    clearImageCache();
    rebuildPlanets(defaultPreset.data);
    preloadImages(defaultPreset.data);
    dataInput.value = '';
    dataStatus.textContent = '';
    builtinCount.textContent = `当前: ${defaultPreset.title} (${defaultPreset.data.length} 条)`;
    selectedPresetKey = 'food';
    presetBtns.forEach(btn => btn.classList.toggle('active-preset', btn.dataset.preset === 'food'));
  });

  optTitle.addEventListener('input', () => {
    const titleEl = document.getElementById('title');
    if (titleEl) titleEl.textContent = optTitle.value || '星 际 穿 越';
  });

  optSound.addEventListener('change', () => {
    state.settings.soundEnabled = optSound.checked;
    audioManager.playBgm(optSound.checked);
  });

  optExcludeDrawn.addEventListener('change', () => {
    state.settings.excludeDrawn = optExcludeDrawn.checked;
  });

  countMinus.addEventListener('click', () => {
    state.settings.selectionCount = Math.max(1, state.settings.selectionCount - 1);
    updateCountDisplay();
  });

  countPlus.addEventListener('click', () => {
    state.settings.selectionCount = Math.min(10, state.settings.selectionCount + 1);
    updateCountDisplay();
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.preset;
      if (key) loadPreset(key);
    });
  });

  setupFileDrop();
  setupBgmDrop();
  setupSfxUploads();

  dataInput.addEventListener('input', () => {
    const val = dataInput.value.trim();
    if (!val) return;
    const lines = val.split('\n').filter(l => l.trim());
    const hasComma = lines.some(l => l.includes(','));
    if (hasComma) {
      currentFmt = 'csv';
      const csvRadio = document.querySelector('input[name="fmt"][value="csv"]') as HTMLInputElement;
      if (csvRadio) csvRadio.checked = true;
    } else {
      currentFmt = 'txt';
      const txtRadio = document.querySelector('input[name="fmt"][value="txt"]') as HTMLInputElement;
      if (txtRadio) txtRadio.checked = true;
    }
  });

  builtinCount.textContent = `当前: 吃什么 (${presets['food'].data.length} 条)`;
  updateCountDisplay();
}
