// Copies the paste-parser's file-reading assets — Tesseract.js's OCR worker/WASM/language
// data, and pdf.js's PDF worker — into public/ so they run fully offline, no CDN fetch at
// runtime, matching the project's no-subscription/no-server-dependency goal. Runs before
// `vite dev`/`vite build` (see package.json), same idea as prepare-swarm.mjs for the P2P
// helper. public/tesseract/ and public/pdfjs/ are generated, so they're git-ignored.
//
// Uses the "_best_int" English OCR model (tesseract-core-simd-lstm + eng 4.0.0_best_int) —
// the fast integer variant, a good fit for printed, typed stat-block text (not handwriting)
// and a third the size of the default "best" model.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const rendererDir = join(root, 'src/renderer');

function copyInto(outDir, fromPkg, fromRel, toName) {
  mkdirSync(outDir, { recursive: true });
  const from = join(dirname(require.resolve(`${fromPkg}/package.json`)), fromRel);
  copyFileSync(from, join(outDir, toName));
}

// --- OCR (Tesseract.js) -----------------------------------------------------
const ocrDir = join(rendererDir, 'public/tesseract');
copyInto(ocrDir, 'tesseract.js', 'dist/worker.min.js', 'worker.min.js');
// WASM core (SIMD + LSTM build — the one tesseract.js's worker loads by default for v7).
copyInto(ocrDir, 'tesseract.js-core', 'tesseract-core-simd-lstm.wasm.js', 'tesseract-core-simd-lstm.wasm.js');
copyInto(ocrDir, 'tesseract.js-core', 'tesseract-core-simd-lstm.wasm', 'tesseract-core-simd-lstm.wasm');
// English language data, already gzipped the way tesseract.js expects to find it (it
// decompresses on load) — copy as-is rather than unpacking. Skip re-copying a 3 MB file
// that's already there (dev runs this on every start).
const dataPkgDir = dirname(require.resolve('@tesseract.js-data/eng/package.json'));
const engGz = join(dataPkgDir, '4.0.0_best_int', 'eng.traineddata.gz');
if (!existsSync(join(ocrDir, 'eng.traineddata.gz'))) {
  copyFileSync(engGz, join(ocrDir, 'eng.traineddata.gz'));
}

// --- PDF text layer (pdf.js) ------------------------------------------------
const pdfDir = join(rendererDir, 'public/pdfjs');
copyInto(pdfDir, 'pdfjs-dist', 'build/pdf.worker.min.mjs', 'pdf.worker.min.mjs');

console.log('Paste-parser assets ready in src/renderer/public/{tesseract,pdfjs}/');
