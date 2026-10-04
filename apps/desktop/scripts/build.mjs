// `npm run build`: prepares the peer-to-peer helper, then builds the Windows
// installer with a version number that goes up with every commit (0.1.<commits>).
//
// Why: the installer only replaces an installed copy when the version is newer.
// With the version stuck at 0.1.0, installing a new build over an old one left the
// old files in place. The number lives in a generated, git-ignored file passed to
// Tauri, so pulling updates never conflicts with it.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const run = (cmd, args) =>
  execFileSync(cmd, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });

let build = 0;
try {
  build = Number(execFileSync('git', ['rev-list', '--count', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim());
} catch {
  console.warn('[build] git not available; using build number 0');
}
const version = `0.1.${build}`;
const configFile = join(root, 'src-tauri', 'tauri.version.json');
writeFileSync(configFile, JSON.stringify({ version }, null, 2) + '\n');
console.log(`[build] Project Epoch VTT ${version}`);

run('node', ['scripts/prepare-swarm.mjs']);
run('npx', ['tauri', 'build', '--config', 'src-tauri/tauri.version.json']);
console.log(`\n[build] Done: Project Epoch VTT ${version}`);
console.log('[build] Installer: src-tauri\\target\\release\\bundle\\nsis\\');
