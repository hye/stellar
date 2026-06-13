const blobUrls = new Map<string, string>();

export function arrayBufferToBlobUrl(buffer: ArrayBuffer, mimeType: string): string {
  const blob = new Blob([buffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  return url;
}

export function cacheBlobUrl(key: string, url: string): void {
  const old = blobUrls.get(key);
  if (old) URL.revokeObjectURL(old);
  blobUrls.set(key, url);
}

export function getBlobUrl(key: string): string | undefined {
  return blobUrls.get(key);
}

export function revokeBlobUrl(key: string): void {
  const url = blobUrls.get(key);
  if (url) {
    URL.revokeObjectURL(url);
    blobUrls.delete(key);
  }
}

export function readAudioFile(file: File): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}
