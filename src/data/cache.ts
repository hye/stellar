import type { DataItem } from '../types';

const imgCache: Map<string, HTMLImageElement> = new Map();

function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (imgCache.has(src)) {
      resolve(imgCache.get(src)!);
      return;
    }
    const img = new Image();
    img.onload = () => {
      imgCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export function preloadImages(data: DataItem[]): void {
  for (const item of data) {
    if (item.imgUrl) preloadImage(item.imgUrl).catch(() => {});
  }
}

export function getCachedImage(src: string): HTMLImageElement | undefined {
  return imgCache.get(src);
}

export function clearImageCache(): void {
  imgCache.clear();
}
