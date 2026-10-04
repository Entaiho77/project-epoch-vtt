// Prepares the peer-to-peer helper for the desktop app. Runs before `tauri dev`
// and `tauri build` (see package.json):
//
//  1. Bundles swarm/helper.js and its dependencies into src-tauri/swarm-dist/
//     (one .bundle file plus the few native pieces Hyperswarm needs).
//  2. Copies the Bare runtime for this computer into src-tauri/binaries/, named
//     the way Tauri expects for a bundled helper program ("sidecar").
//
// Both folders are generated, so they're git-ignored.
import { execFileSync } from 'node:child_process';
import { chmodSync, copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tauriDir = join(root, 'src-tauri');
const host = `${process.platform}-${process.arch}`; // e.g. win32-x64
const isWindows = process.platform === 'win32';

// Rust's name for this platform, e.g. x86_64-pc-windows-msvc.
const rustInfo = execFileSync('rustc', ['-vV'], { encoding: 'utf8' });
const triple = /^host: (\S+)$/m.exec(rustInfo)?.[1];
if (!triple) throw new Error('Could not read the Rust target from `rustc -vV`.');

// 1. Bundle the helper.
const out = join(tauriDir, 'swarm-dist');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const barePack = join(dirname(require.resolve('bare-pack')), 'bin.js');
// Paths inside the bundle are relative to --base, and the bundle can't reach above
// it. npm hoists packages to the repo root, so use the folder holding node_modules.
const base = dirname(dirname(dirname(require.resolve('hyperswarm'))));
execFileSync(
  process.execPath,
  [
    barePack,
    '--base', base,
    '--host', host,
    '--offload-addons',
    '-o', join(out, 'helper.bundle'),
    join(root, 'swarm', 'helper.js'),
  ],
  { stdio: 'inherit', cwd: base },
);

// 2. The Bare runtime as a Tauri sidecar: binaries/bare-<triple>[.exe]
const bare = require('bare-runtime')();
const binDir = join(tauriDir, 'binaries');
mkdirSync(binDir, { recursive: true });
const dest = join(binDir, `bare-${triple}${isWindows ? '.exe' : ''}`);
copyFileSync(bare, dest);
if (!isWindows) chmodSync(dest, 0o755);

console.log(`[prepare-swarm] helper bundled for ${host}; Bare runtime → ${dest}`);
