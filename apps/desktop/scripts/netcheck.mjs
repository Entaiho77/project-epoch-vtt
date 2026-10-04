// Network check: can this computer find and reach a hosted game, the way a
// player's app would? Run while the GM is hosting:
//
//   node apps/desktop/scripts/netcheck.mjs PS5K-Y2KU
//
// It reports each step in plain words: joining the peer-to-peer network, how
// reachable this computer is, whether the game's code is being advertised, and
// whether a connection to the GM's computer opens.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const HyperDHT = require('hyperdht');
const crypto = require('hypercore-crypto');
const b4a = require('b4a');

const code = process.argv[2];
if (!code) {
  console.log('Usage: node apps/desktop/scripts/netcheck.mjs <invite code>');
  process.exit(1);
}
const normalize = (c) => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const topic = crypto.hash(b4a.from('epoch-room-v1:' + normalize(code)));
const hex = (b) => b4a.toString(b, 'hex');
const say = (...a) => console.log(...a);
const withTimeout = (p, ms, label) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`${label} timed out after ${ms / 1000}s`)), ms))]);

// Tests only: a private network ("host:port,host:port").
const boot = process.env.EPOCH_SWARM_BOOTSTRAP;
const dht = boot
  ? new HyperDHT({ bootstrap: boot.split(',').map((hp) => ({ host: hp.split(':')[0], port: Number(hp.split(':')[1]) })), host: '127.0.0.1', ephemeral: true })
  : new HyperDHT();
try {
  say(`Checking invite code ${code} …\n`);

  say('1. Joining the peer-to-peer network…');
  await withTimeout(dht.ready(), 30_000, 'joining');
  say(`   OK. This computer is seen from the internet as ${dht.host ?? '?'}:${dht.port ?? '?'}`);
  say(`   Reachable directly from outside: ${dht.firewalled ? 'no (normal for home internet)' : 'yes'}`);
  say(`   Home router type: ${dht.randomized ? 'strict (changes ports — harder to connect through)' : 'normal'}\n`);

  say('2. Looking for a game advertised with that code…');
  const found = new Map();
  await withTimeout(
    (async () => {
      for await (const res of dht.lookup(topic)) {
        for (const peer of res.peers) found.set(hex(peer.publicKey), peer);
      }
    })(),
    30_000,
    'looking',
  ).catch((e) => say(`   (${e.message})`));
  if (found.size === 0) {
    say('   NOT FOUND. Nobody is advertising that code right now.');
    say("   → Is the GM's app hosting this exact game? Has the code changed since?");
    process.exit(2);
  }
  say(`   Found ${found.size} computer(s) hosting it.\n`);

  say("3. Connecting to the GM's computer…");
  let anyOk = false;
  for (const [key, peer] of found) {
    const addrs = (peer.relayAddresses ?? []).map((a) => `${a.host}:${a.port}`).join(', ');
    say(`   GM ${key.slice(0, 8)}… (via ${addrs || 'no relays listed'})`);
    const started = Date.now();
    const socket = dht.connect(b4a.from(key, 'hex'));
    try {
      await withTimeout(
        new Promise((resolve, reject) => {
          socket.once('open', resolve);
          socket.once('error', reject);
        }),
        30_000,
        'connecting',
      );
      const raw = socket.rawStream;
      say(`   CONNECTED in ${((Date.now() - started) / 1000).toFixed(1)}s` + (raw?.remoteHost ? ` (talking to ${raw.remoteHost}:${raw.remotePort})` : ''));
      anyOk = true;
    } catch (e) {
      say(`   FAILED: ${e.code ? e.code + ' — ' : ''}${e.message}`);
    } finally {
      socket.destroy();
    }
  }
  say(anyOk ? '\nAll good from this computer.' : '\nThe game is advertised but this computer could not connect to it.');
} catch (e) {
  say(`   FAILED: ${e.message}`);
} finally {
  await dht.destroy().catch(() => {});
  process.exit(0);
}
