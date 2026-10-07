/**
 * Ambient scene audio (2026-10-07 MVP backlog) — one looping track per map. Same storage
 * contract as map/token images (see images.ts): saved as a file on disk in the desktop app,
 * referenced by a short `epoch-asset:<hash>.<ext>` string; inlined as a data URL when running
 * without the desktop bridge (tests, plain browser). Resolve a stored reference to a loadable
 * src with `imageSrc()` from images.ts — it just turns an `epoch-asset:` reference into a URL
 * and is generic over any file type, not actually image-specific, so there's no separate
 * `audioSrc()`.
 */

const INLINE_MAX = 50 * 1024 * 1024; // 50 MB cap, same as images

function readDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsDataURL(file);
  });
}

async function storeAsset(file: File): Promise<string> {
  if (typeof window !== 'undefined' && window.epochAssets) return window.epochAssets.put(file);
  return readDataUrl(file);
}

/** Validate + save an uploaded ambient track. Returns the value to store at
 *  `MapDef.ambientAudio.track`. */
export async function prepareAmbientTrack(file: File): Promise<string> {
  if (!file.type.startsWith('audio/')) {
    throw new Error('Please choose an audio file (mp3, ogg, wav, or m4a).');
  }
  if (file.size > INLINE_MAX) {
    throw new Error('File too large (max 50 MB).');
  }
  return storeAsset(file);
}
