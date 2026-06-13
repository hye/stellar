import type { DataItem } from '../types';

export function parseTxtInput(text: string): DataItem[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  return lines.map((name, i) => ({
    id: String(i + 1),
    name,
    emoji: '',
    imgUrl: '',
    desc: '',
    title: '',
    subtitle: '',
  }));
}

function isUrl(str: string): boolean {
  return /^https?:\/\//.test(str) || /^\/\//.test(str);
}

export function parseCsvInput(text: string): DataItem[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const data: DataItem[] = [];
  let i = 0;
  for (const line of lines) {
    if (i === 0 && /^id/i.test(line)) { i++; continue; }
    const parts = line.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      let emoji = '';
      let imgUrl = '';
      let title = '';
      let subtitle = '';

      if (parts.length >= 3) {
        if (isUrl(parts[2])) {
          imgUrl = parts[2];
        } else {
          emoji = parts[2];
        }
      }
      if (parts.length >= 4) {
        title = parts[3];
      }
      if (parts.length >= 5) {
        subtitle = parts[4];
      }

      data.push({
        id: parts[0],
        name: parts[1],
        emoji,
        imgUrl,
        desc: '',
        title,
        subtitle,
      });
    }
    i++;
  }
  return data;
}

export function parseFileContent(text: string, fmt: 'txt' | 'csv'): DataItem[] {
  return fmt === 'csv' ? parseCsvInput(text) : parseTxtInput(text);
}
