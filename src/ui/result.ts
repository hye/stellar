import { state } from '../state';
import { getCachedImage } from '../data/cache';
import { planetNameEl, planetDescEl, btnNext, resultPanel, btnStart } from './dom';
import { hideAllPlanets } from '../scene/planets';
import { audioManager } from '../audio/manager';
import { startIdle } from '../animation/idle';
import { startWarp } from '../animation/warp';
import { Phase } from '../types';

export function showResult(): void {
  resultPanel.classList.add('show');
}

export function hideResult(): void {
  resultPanel.classList.remove('show');
  resultPanel.classList.remove('has-winners');
}

function renderWinnerCard(item: { name: string; emoji: string; imgUrl: string; desc: string; title: string; subtitle: string }): string {
  const hasImg = item.imgUrl && getCachedImage(item.imgUrl);
  const isLong = item.name.length > 5;
  const nameClass = isLong ? 'name name-scroll' : 'name';
  let html = '<div class="winner-card">';
  if (hasImg) {
    html += `<img class="img" src="${item.imgUrl}" alt="${item.name}">`;
  }
  html += `<span class="emoji">${item.emoji}</span>`;
  if (isLong) {
    html += `<span class="${nameClass}"><span class="name-scroll-inner">${item.name}&nbsp;&nbsp;&nbsp;&nbsp;${item.name}</span></span>`;
  } else {
    html += `<span class="${nameClass}">${item.name}</span>`;
  }
  if (item.title) {
    html += `<span class="title">${item.title}</span>`;
  }
  if (item.subtitle) {
    html += `<span class="subtitle">${item.subtitle}</span>`;
  }
  if (item.desc) {
    html += `<span class="desc">${item.desc}</span>`;
  }
  html += '</div>';
  return html;
}

function renderWinnerList(): void {
  const winners = state.winnerPool;
  let html = '<div class="winner-list">';
  for (const item of winners) {
    html += renderWinnerCard(item);
  }
  html += '</div>';
  planetNameEl.innerHTML = '';
  planetDescEl.innerHTML = html;
}

export function setWinnerCard(idx: number): void {
  const item = state.activeData[idx];
  if (!item) return;

  state.winnersRevealed++;

  const allDone = state.winnersRevealed >= state.settings.selectionCount
    || state.winnersRevealed >= state.activeData.length;

  if (allDone) {
    renderWinnerList();
    btnNext.style.display = 'none';
  } else {
    const hasImg = item.imgUrl && getCachedImage(item.imgUrl);
    let nameHtml = `<span class="winner-name">${item.emoji} ${item.name}</span>`;
    if (hasImg) {
      nameHtml = `<img class="winner-img" src="${item.imgUrl}" alt="${item.name}"><br>${nameHtml}`;
    }
    planetNameEl.innerHTML = nameHtml;

    let descHtml = '';
    if (item.title) descHtml += `<div class="winner-title">${item.title}</div>`;
    if (item.subtitle) descHtml += `<div class="winner-subtitle">${item.subtitle}</div>`;
    if (item.desc) descHtml += `<div class="winner-desc-text">${item.desc}</div>`;
    planetDescEl.innerHTML = descHtml;

    btnNext.style.display = '';
  }
}

export function onNextWinner(): void {
  hideResult();
  btnStart.style.display = 'none';
  audioManager.playSfx('next', state.settings.soundEnabled);
  startWarp();
}

export function onRetry(): void {
  hideResult();
  audioManager.playSfx('reset', state.settings.soundEnabled);
  state.winnersRevealed = 0;
  state.winnerPool.length = 0;
  state.drawnIndices.clear();
  state.selectedIdx = -1;
  state.phase = Phase.IDLE;
  hideAllPlanets();
  btnStart.style.display = '';
  startIdle();
}
