/**
 * Turns whatever the DM pastes or uploads into plain text, ready for the DM's own review/edit
 * pass and then parseStatBlock (pasteParser.ts). Per the paste-parser spec: try the fastest path
 * first (a file's own text layer), OCR only as a fallback — "I want to make this as painless as
 * possible" (Matthew, voice, 2026-10-09).
 *
 * Everything here runs locally in the renderer — no network call, ever. Tesseract.js and pdf.js
 * load their worker/WASM/language-data from public/tesseract and public/pdfjs (copied there at
 * build time by scripts/prepare-parser-assets.mjs), never from a CDN.
 */

export type InputKind = 'text' | 'image' | 'pdf' | 'docx' | 'doc' | 'unsupported';

/** Lowercased, whitespace-collapsed form of a line, for comparing two lines that may differ only
 *  in incidental whitespace or case (common after OCR) when looking for an overlap. */
function normalizeLine(line: string): string {
  return line.trim().replace(/\s+/g, ' ').toLowerCase();
}

/** Join two chunks of a stat block that may have been captured as separate screenshots/pastes
 *  of the same creature (Matthew, voice, 2026-10-09): D&D Beyond's page doesn't scroll in the
 *  snipping tool, so a long stat block sometimes has to be captured in pieces, and the pieces
 *  often overlap by a line or two where the DM re-captured a bit of the previous shot to make
 *  sure nothing was missed. Finds the longest run of trailing lines in `a` that matches the
 *  leading lines of `b` and merges on that seam; if no overlap is found, the two chunks are just
 *  joined as-is — either way the DM reviews the result before it's parsed, so a bad seam is
 *  still visible and fixable there rather than silently mangling the creature. */
function mergeOverlap(a: string, b: string): string {
  const linesA = a.split('\n');
  const linesB = b.split('\n');
  const maxOverlap = Math.min(linesA.length, linesB.length, 15); // don't scan the whole document
  for (let k = maxOverlap; k >= 1; k--) {
    const tail = linesA.slice(linesA.length - k).map(normalizeLine).join('\n');
    const head = linesB.slice(0, k).map(normalizeLine).join('\n');
    if (tail.length > 0 && tail === head) {
      return [...linesA, ...linesB.slice(k)].join('\n');
    }
  }
  return [...linesA, ...linesB].join('\n');
}

/** Stitch however many parts a split stat block was captured in, in order, into one block of
 *  text — ready for the DM to review/edit before anything is parsed or highlighted. */
export function stitchParts(parts: string[]): string {
  return parts.filter((p) => p.trim().length > 0).reduce((acc, part) => (acc ? mergeOverlap(acc, part) : part), '');
}

export interface ExtractResult {
  text: string;
  /** Whether this text came from OCR, so the UI can nudge the DM to review it a little more
   *  carefully — OCR is the one path that can misread characters, not just lose formatting. */
  viaOcr: boolean;
  warnings: string[];
}

export function detectKind(file: File): InputKind {
  const name = file.name.toLowerCase();
  if (file.type.startsWith('image/') || /\.(png|jpe?g|gif|bmp|webp|tiff?)$/.test(name)) return 'image';
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
  if (name.endsWith('.docx')) return 'docx';
  if (name.endsWith('.doc')) return 'doc';
  if (file.type.startsWith('text/') || name.endsWith('.txt') || name.endsWith('.md')) return 'text';
  return 'unsupported';
}

let ocrWorkerPromise: Promise<import('tesseract.js').Worker> | null = null;

/** One shared Tesseract worker for the life of the page — starting it (loading the WASM core +
 *  language data) takes a moment, so later pastes in the same session don't pay that cost again. */
async function getOcrWorker() {
  if (!ocrWorkerPromise) {
    ocrWorkerPromise = (async () => {
      const { createWorker } = await import('tesseract.js');
      return createWorker('eng', 1, {
        workerPath: '/tesseract/worker.min.js',
        corePath: '/tesseract/tesseract-core-simd-lstm.wasm.js',
        langPath: '/tesseract',
        cacheMethod: 'none', // Assets are already local files; no need for IndexedDB caching.
      });
    })();
  }
  return ocrWorkerPromise;
}

/** Grayscale + contrast + threshold, per the spec's preprocessing step, run on a canvas before
 *  OCR. Deskew is left out of this first pass — flagged in the spec as a later addition "if DMs
 *  struggle" — since most screenshots (D&D Beyond, PDFs) are already axis-aligned. */
function preprocessToCanvas(img: HTMLImageElement | ImageBitmap): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    // Raise contrast around the midpoint, then threshold to pure black/white.
    const boosted = (gray - 128) * 1.6 + 128;
    const bw = boosted > 150 ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = bw;
  }
  ctx.putImageData(new ImageData(data, canvas.width, canvas.height), 0, 0);
  return canvas;
}

async function ocrImage(source: HTMLImageElement | ImageBitmap): Promise<string> {
  const canvas = preprocessToCanvas(source);
  const worker = await getOcrWorker();
  const { data } = await worker.recognize(canvas);
  return data.text;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { resolve(img); URL.revokeObjectURL(url); };
    img.onerror = () => { reject(new Error('Could not read that image file.')); URL.revokeObjectURL(url); };
    img.src = url;
  });
}

/** Extract a PDF's own text layer, page by page. Returns '' if the PDF has no real text
 *  (a scanned page), so the caller knows to fall back to OCR. */
async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((it: any) => ('str' in it ? it.str : '')).join(' '));
  }
  return pages.join('\n').trim();
}

/** OCR every page of a PDF by rendering it to a canvas first — the fallback for a scanned PDF
 *  with no text layer. */
async function ocrPdf(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 2 }); // Higher scale = sharper OCR input.
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    pages.push(await ocrImage(canvas as unknown as HTMLImageElement));
  }
  return pages.join('\n');
}

/**
 * Extract plain text from an uploaded file, trying the fastest path first:
 *  - .txt/.md: read directly.
 *  - .docx: mammoth's own text extraction (real text, no OCR needed).
 *  - .pdf: try the embedded text layer first; OCR each page only if that comes back empty.
 *  - image: OCR straight away (images have no text layer to try first).
 *  - .doc (old binary Word format): no reliable local parser for it — reported as unsupported
 *    rather than risk silently mangling the DM's text.
 */
export async function extractText(file: File): Promise<ExtractResult> {
  const kind = detectKind(file);
  const warnings: string[] = [];

  if (kind === 'text') {
    return { text: await file.text(), viaOcr: false, warnings };
  }

  if (kind === 'docx') {
    const mammoth = await import('mammoth');
    const buf = await file.arrayBuffer();
    const { value, messages } = await mammoth.extractRawText({ arrayBuffer: buf });
    for (const m of messages) if (m.type === 'warning') warnings.push(m.message);
    return { text: value, viaOcr: false, warnings };
  }

  if (kind === 'pdf') {
    const textLayer = await extractPdfText(file);
    if (textLayer.length > 20) {
      return { text: textLayer, viaOcr: false, warnings };
    }
    warnings.push('This PDF has no selectable text (it looks scanned) — read it with OCR instead.');
    return { text: (await ocrPdf(file)).trim(), viaOcr: true, warnings };
  }

  if (kind === 'image') {
    const img = await loadImage(file);
    return { text: (await ocrImage(img)).trim(), viaOcr: true, warnings };
  }

  if (kind === 'doc') {
    throw new Error(
      'The old .doc Word format can\'t be read locally here — save it as .docx or a PDF, or paste the text directly.',
    );
  }

  throw new Error(`"${file.name}" isn't a file type the paste-parser can read yet.`);
}

/** Release the shared OCR worker. Not required for correctness — Tesseract keeps it around for
 *  speed on the next file — but useful if the DM is done with OCR for a while. */
export async function terminateOcrWorker(): Promise<void> {
  if (ocrWorkerPromise) {
    const worker = await ocrWorkerPromise;
    await worker.terminate();
    ocrWorkerPromise = null;
  }
}
