// Opens a second copy of the desktop app with its own save file, so one PC can
// play GM and player at the same time. Needs `npm run dev` already running
// (this copy uses the same dev server) and a build from that run.
//
//   npm run player            -> profile "player"
//   npm run player -- thomas  -> profile "thomas"
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const profile = process.argv[2] || 'player';
const here = dirname(fileURLToPath(import.meta.url));
const exe = join(here, '..', 'src-tauri', 'target', 'debug', process.platform === 'win32' ? 'epoch-vtt.exe' : 'epoch-vtt');

if (!existsSync(exe)) {
  console.error(`Can't find ${exe}.\nRun "npm run dev" once first so the app gets built.`);
  process.exit(1);
}
console.log(`Opening a second copy as "${profile}" (its own save file). Close its window to stop.`);
const child = spawn(exe, [], { stdio: 'inherit', env: { ...process.env, EPOCH_PROFILE: profile } });
child.on('exit', (code) => process.exit(code ?? 0));
