/**
 * Map/token image handling — desktop edition. There is no remote Storage bucket;
 * images are inlined as data URLs and live in the local database (and travel to
 * players inside normal sync writes). This was the web app's no-Storage fallback
 * path, now the only path. The cap is raised a little since SQLite handles
 * larger values than RTDB comfortably did.
 */

const INLINE_MAX = 50 * 1024 * 1024; // 50 MB inline cap (maps and token art)

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
  imageUrl: string;
  width: number;
  height: number;
  /** Always false on desktop — images are inlined, never uploaded. */
  stored: boolean;
}

/**
 * Token art — same contract as the web version (`scope` kept for signature
 * compatibility; there is no upload path to scope any more).
 */
export async function prepareTokenImage(_scope: string, file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }
  if (file.size > INLINE_MAX) {
    throw new Error('Image too large (max 50 MB).');
  }
  return readDataUrl(file);
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
  const dataUrl = await readDataUrl(file);
  return { imageUrl: dataUrl, ...dims, stored: false };
}
