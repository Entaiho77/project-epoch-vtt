/**
 * Map/token image handling — desktop edition.
 *
 * In the desktop app, images are saved as files on disk (src-tauri/src/assets.rs)
 * and the database only stores a short reference like `epoch-asset:<hash>.png`.
 * That keeps multi-megabyte maps out of every game read/sync. Use `imageSrc()`
 * to turn whatever is stored into something an <img> or canvas can load.
 *
 * Without the desktop bridge (tests, plain browser) images fall back to inline
 * data URLs, which `imageSrc()` passes through unchanged.
 */

const INLINE_MAX = 50 * 1024 * 1024; // 50 MB cap (maps and token art)
const ASSET_PREFIX = 'epoch-asset:';

/** Stored image value (asset reference, data URL, or http URL) → loadable src. */
export function imageSrc(stored?: string | null): string | undefined {
  if (!stored) return undefined;
  if (stored.startsWith(ASSET_PREFIX)) {
    const name = stored.slice(ASSET_PREFIX.length);
    return typeof window !== 'undefined' && window.epochAssets
      ? window.epochAssets.url(name)
      : undefined;
  }
  return stored;
}

/** Save a file to disk when running in the desktop app; otherwise inline it. */
async function storeImage(file: File): Promise<string> {
  if (typeof window !== 'undefined' && window.epochAssets) return window.epochAssets.put(file);
  return readDataUrl(file);
}

export function loadImageSize(
  src: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Could not read that image.'));
    img.src = src;
  });
}

function readDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsDataURL(file);
  });
}

export interface PreparedImage {
  /** What to store: an `epoch-asset:` reference in the desktop app, else a data URL. */
  imageUrl: string;
  width: number;
  height: number;
  /** True when the image was saved as a file rather than inlined. */
  stored: boolean;
}

/**
 * Token art — same contract as the web version (`scope` kept for signature
 * compatibility). Returns the value to store; render it through `imageSrc()`.
 */
export async function prepareTokenImage(_scope: string, file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }
  if (file.size > INLINE_MAX) {
    throw new Error('Image too large (max 50 MB).');
  }
  return storeImage(file);
}

export async function prepareMapImage(
  _gameId: string,
  file: File,
): Promise<PreparedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }

  const objectUrl = URL.createObjectURL(file);
  let dims: { width: number; height: number };
  try {
    dims = await loadImageSize(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }

  if (file.size > INLINE_MAX) {
    throw new Error('Image too large (max 50 MB).');
  }
  const imageUrl = await storeImage(file);
  return { imageUrl, ...dims, stored: imageUrl.startsWith(ASSET_PREFIX) };
}
