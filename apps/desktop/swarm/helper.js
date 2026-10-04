/* global Bare */
/**
 * Project Epoch — peer-to-peer session helper.
 *
 * Runs on the Bare runtime next to the desktop app. The app (src-tauri/src/swarm.rs)
 * starts it, then talks to it over a local TCP connection using one JSON object per
 * line. This file is the only place that knows about Hyperswarm.
 *
 * Roles
 *  - GM:     joins the room's topic as a server and waits for players. It does the job
 *            the old relay server did: player → GM, GM → players (all, or one).
 *  - Player: joins the topic as a client, introduces itself, and waits for the GM to
 *            approve. Only approved players exchange game messages.
 *
 * Voice travels as encrypted datagrams on the same connections (NoiseSecretStream
 * send/trySend): a lost packet is skipped rather than resent, which is what live audio
 * wants. Players send their voice to the GM; the GM stamps who it came from and passes
 * it to everyone else. Unapproved or GM-muted players' voice is dropped.
 *
 * Every connection is encrypted (Noise). Each install has a fixed key pair, so the GM
 * can recognise a returning player's device.
 *
 * App → helper commands  {cmd: 'host' | 'join' | 'send' | 'approve' | 'kick' | 'retopic' | 'leave'
 *                               | 'voice' | 'voice-mute', …}
 * Helper → app events    {ev: 'status', status} | {ev: 'message', message} | {ev: 'voice', from, seq, data}
 * `message` uses the same shapes the relay server sent (hosted, player-joined,
 * player-left, gm-disconnected, game-message, error), plus join-request / waiting /
 * kicked, so the app's session code barely changes.
 */

const Hyperswarm = require('hyperswarm')
const HyperDHT = require('hyperdht')
const crypto = require('hypercore-crypto')
const b4a = require('b4a')
const tcp = require('bare-tcp')

const PROTOCOL = 1
const HELLO_TIMEOUT_MS = 10_000
const MAX_LINE = 8 * 1024 * 1024 // generous: image chunks are ~350 KB

// Voice datagrams (inside the encrypted message):
//   player → GM   [VOICE_UP][seq u16][opus frame]
//   GM → player   [VOICE_DOWN][seq u16][id length u8][speaker id][opus frame]
const VOICE_UP = 1
const VOICE_DOWN = 2
const MAX_VOICE_FRAME = 1000 // an Opus frame is ~100 bytes; keep well under the path MTU

// --- Arguments ------------------------------------------------------------------

function arg (name) {
  const i = Bare.argv.indexOf('--' + name)
  return i === -1 ? null : Bare.argv[i + 1]
}

const port = Number(arg('port'))
const token = arg('token')
const seedHex = arg('seed')
const bootstrapArg = arg('bootstrap') // tests only: "host:port,host:port"

if (!port || !token || !seedHex || seedHex.length !== 64) {
  console.error('[swarm] usage: helper --port <n> --token <t> --seed <64 hex>')
  Bare.exit(2)
}

const keyPair = crypto.keyPair(b4a.from(seedHex, 'hex'))
const myKey = b4a.toString(keyPair.publicKey, 'hex')

// --- Line-delimited JSON over a stream ------------------------------------------

function lineReader (stream, onObject, onTooLong) {
  let buf = ''
  stream.on('data', (chunk) => {
    buf += b4a.toString(chunk)
    if (buf.length > MAX_LINE && buf.indexOf('\n') === -1) {
      buf = ''
      onTooLong?.()
      return
    }
    let nl
    while ((nl = buf.indexOf('\n')) !== -1) {
      const line = buf.slice(0, nl)
      buf = buf.slice(nl + 1)
      if (!line) continue
      let obj
      try { obj = JSON.parse(line) } catch { continue }
      if (obj && typeof obj === 'object') onObject(obj)
    }
  })
}

const writeLine = (stream, obj) => {
  if (!stream.destroyed) stream.write(JSON.stringify(obj) + '\n')
}

// --- Connection to the app --------------------------------------------------------

const app = tcp.createConnection(port, '127.0.0.1')
app.on('error', () => Bare.exit(1))
app.on('close', () => shutdown())
app.on('connect', () => {
  writeLine(app, { token, ev: 'ready', key: myKey })
})

const emit = (ev) => writeLine(app, ev)
const status = (s) => emit({ ev: 'status', status: s })
const message = (m) => emit({ ev: 'message', message: m })
const errorMsg = (text) => message({ type: 'error', payload: { message: text } })

// --- Session state ------------------------------------------------------------------

let swarm = null
let mode = null // 'host' | 'join'
let topic = null
let identity = null // { uid, displayName, roomCode }

/** GM: approved players. playerId → { conn, displayName, key } */
const players = new Map()
/** GM: connections that said hello and await the app's decision. key → { conn, playerId, displayName } */
const pending = new Map()
/** GM: device keys kicked this session (can't come back until a new code). */
const banned = new Set()
/** GM: players whose voice the GM has muted. */
const voiceMuted = new Set()

/** Player: the GM connection once approved. */
let gmConn = null
let leaving = false

const topicFor = (code) => crypto.hash(b4a.from('epoch-room-v1:' + normalize(code)))
const normalize = (code) => String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '')

function newSwarm (role) {
  if (!bootstrapArg) return new Hyperswarm({ keyPair }) // the public network
  // Tests: a private network on this machine. Every peer shares 127.0.0.1 there,
  // which makes HyperDHT's hole punching stall for ~15 s, so the test GM is marked
  // directly reachable. (The real network keeps hole punching: GMs are behind routers.)
  const bootstrap = bootstrapArg.split(',').map((hp) => {
    const [host, p] = hp.split(':')
    return { host, port: Number(p) }
  })
  const dht = new HyperDHT({
    bootstrap,
    host: '127.0.0.1',
    ephemeral: true,
    ...(role === 'host' ? { firewalled: false } : {})
  })
  return new Hyperswarm({ keyPair, dht })
}

async function startHost (cmd) {
  await stop()
  mode = 'host'
  identity = { uid: cmd.uid, displayName: cmd.displayName, roomCode: normalize(cmd.roomCode) }
  status('connecting')
  swarm = newSwarm('host')
  swarm.on('connection', onGmConnection)
  topic = topicFor(identity.roomCode)
  try {
    await swarm.join(topic, { server: true, client: false }).flushed()
  } catch (e) {
    status('error')
    return errorMsg('Could not start hosting: ' + (e?.message || e))
  }
  if (mode !== 'host') return
  status('open')
  message({ type: 'hosted', payload: { roomCode: cmd.roomCode } })
}

function onGmConnection (conn) {
  const key = b4a.toString(conn.remotePublicKey, 'hex')
  conn.on('error', () => {})
  if (banned.has(key)) return conn.destroy()

  let playerId = null
  conn.on('message', (buf) => {
    if (!playerId || buf.byteLength < 4 || buf[0] !== VOICE_UP) return
    const p = players.get(playerId)
    if (!p || p.conn !== conn || voiceMuted.has(playerId)) return
    const seq = (buf[1] << 8) | buf[2]
    const frame = buf.subarray(3)
    if (frame.byteLength > MAX_VOICE_FRAME) return
    emit({ ev: 'voice', from: playerId, seq, data: b4a.toString(frame, 'base64') })
    relayVoice(playerId, seq, frame, conn)
  })
  const helloTimer = setTimeout(() => { if (!playerId) conn.destroy() }, HELLO_TIMEOUT_MS)

  lineReader(conn, (msg) => {
    if (msg.t === 'hello') {
      if (playerId || typeof msg.playerId !== 'string' || !msg.playerId) return conn.destroy()
      clearTimeout(helloTimer)
      playerId = msg.playerId.slice(0, 128)
      const displayName = String(msg.displayName || 'Adventurer').slice(0, 64)
      pending.set(key, { conn, playerId, displayName })
      // The app decides (auto-allow a known device, otherwise ask the GM).
      message({ type: 'join-request', payload: { peerKey: key, playerId, displayName } })
      writeLine(conn, { t: 'waiting' })
      return
    }
    if (msg.t === 'game' && playerId) {
      const p = players.get(playerId)
      if (!p || p.conn !== conn) return // not approved (or replaced): drop silently
      message({ type: 'game-message', payload: { from: playerId, data: msg.data } })
    }
  }, () => conn.destroy())

  conn.on('close', () => {
    clearTimeout(helloTimer)
    pending.delete(key)
    if (playerId) {
      const p = players.get(playerId)
      if (p && p.conn === conn) {
        players.delete(playerId)
        message({ type: 'player-left', payload: { playerId } })
      }
    }
  })
}

function approve (cmd) {
  const req = pending.get(cmd.peerKey)
  if (!req) return
  pending.delete(cmd.peerKey)
  if (!cmd.allow) {
    writeLine(req.conn, { t: 'denied' })
    setTimeout(() => req.conn.destroy(), 200)
    return
  }
  // A device reconnecting replaces its own older connection.
  const old = players.get(req.playerId)
  if (old && old.conn !== req.conn) old.conn.destroy()
  players.set(req.playerId, { conn: req.conn, displayName: req.displayName, key: cmd.peerKey })
  writeLine(req.conn, { t: 'welcome' })
  if (voiceMuted.has(req.playerId)) writeLine(req.conn, { t: 'voice-muted', muted: true })
  message({
    type: 'player-joined',
    payload: { playerId: req.playerId, displayName: req.displayName, peerKey: cmd.peerKey }
  })
}

/** GM: move to a new room code. Players already in stay connected. */
async function retopic (cmd) {
  if (mode !== 'host' || !swarm) return
  const next = topicFor(cmd.roomCode)
  const prev = topic
  topic = next
  identity.roomCode = normalize(cmd.roomCode)
  try {
    await swarm.join(next, { server: true, client: false }).flushed()
    if (prev) await swarm.leave(prev)
    message({ type: 'hosted', payload: { roomCode: cmd.roomCode } })
  } catch (e) {
    errorMsg('Could not switch to the new code: ' + (e?.message || e))
  }
}

/** GM: pass a voice frame to every approved player except `skip`. */
function relayVoice (speakerId, seq, frame, skip) {
  const id = b4a.from(String(speakerId).slice(0, 128))
  const packet = b4a.alloc(4 + id.byteLength + frame.byteLength)
  packet[0] = VOICE_DOWN
  packet[1] = (seq >> 8) & 0xff
  packet[2] = seq & 0xff
  packet[3] = id.byteLength
  packet.set(id, 4)
  packet.set(frame, 4 + id.byteLength)
  for (const p of players.values()) {
    if (p.conn !== skip) p.conn.trySend(packet)
  }
}

/** The app's own voice: GM → all players; player → GM. */
function sendVoice (cmd) {
  if (typeof cmd.data !== 'string') return
  const frame = b4a.from(cmd.data, 'base64')
  if (!frame.byteLength || frame.byteLength > MAX_VOICE_FRAME) return
  const seq = (cmd.seq >>> 0) & 0xffff
  if (mode === 'host') {
    relayVoice(identity.uid, seq, frame, null)
  } else if (mode === 'join' && gmConn) {
    const packet = b4a.alloc(3 + frame.byteLength)
    packet[0] = VOICE_UP
    packet[1] = (seq >> 8) & 0xff
    packet[2] = seq & 0xff
    packet.set(frame, 3)
    gmConn.trySend(packet)
  }
}

/** GM: mute or unmute a player's voice for everyone, and tell them. */
function voiceMute (cmd) {
  if (mode !== 'host' || typeof cmd.playerId !== 'string') return
  if (cmd.muted) voiceMuted.add(cmd.playerId)
  else voiceMuted.delete(cmd.playerId)
  const p = players.get(cmd.playerId)
  if (p) writeLine(p.conn, { t: 'voice-muted', muted: !!cmd.muted })
}

function kick (cmd) {
  const p = players.get(cmd.playerId)
  if (!p) return
  banned.add(p.key)
  players.delete(cmd.playerId)
  writeLine(p.conn, { t: 'kicked' })
  setTimeout(() => p.conn.destroy(), 200)
  message({ type: 'player-left', payload: { playerId: cmd.playerId } })
}

async function startJoin (cmd) {
  await stop()
  mode = 'join'
  identity = { uid: cmd.uid, displayName: cmd.displayName, roomCode: normalize(cmd.roomCode) }
  status('connecting')
  swarm = newSwarm('join')
  swarm.on('connection', onPlayerConnection)
  swarm.join(topicFor(identity.roomCode), { server: false, client: true })
}

function onPlayerConnection (conn) {
  conn.on('error', () => {})
  conn.on('message', (buf) => {
    if (conn !== gmConn || buf.byteLength < 5 || buf[0] !== VOICE_DOWN) return
    const seq = (buf[1] << 8) | buf[2]
    const idLen = buf[3]
    if (buf.byteLength < 4 + idLen + 1) return
    const from = b4a.toString(buf.subarray(4, 4 + idLen))
    if (from === identity?.uid) return
    emit({ ev: 'voice', from, seq, data: b4a.toString(buf.subarray(4 + idLen), 'base64') })
  })
  writeLine(conn, {
    t: 'hello',
    v: PROTOCOL,
    playerId: identity.uid,
    displayName: identity.displayName
  })
  lineReader(conn, (msg) => {
    switch (msg.t) {
      case 'waiting':
        message({ type: 'waiting', payload: {} })
        break
      case 'welcome':
        if (gmConn && gmConn !== conn) gmConn.destroy()
        gmConn = conn
        status('open')
        break
      case 'denied':
        message({ type: 'error', payload: { message: 'The GM declined your request to join.' } })
        stop().then(() => status('closed'))
        break
      case 'kicked':
        message({ type: 'kicked', payload: {} })
        stop().then(() => status('closed'))
        break
      case 'bye':
        message({ type: 'gm-disconnected' })
        stop().then(() => status('closed'))
        break
      case 'voice-muted':
        if (conn === gmConn) message({ type: 'voice-muted', payload: { muted: !!msg.muted } })
        break
      case 'game':
        if (conn === gmConn) message({ type: 'game-message', payload: { from: 'gm', data: msg.data } })
        break
    }
  }, () => conn.destroy())
  conn.on('close', () => {
    if (conn === gmConn) {
      gmConn = null
      // Hyperswarm keeps looking for the GM; show "reconnecting" meanwhile.
      if (!leaving && mode === 'join') status('connecting')
    }
  })
}

function send (cmd) {
  const frame = { t: 'game', data: cmd.data }
  if (mode === 'host') {
    if (cmd.to) {
      const p = players.get(cmd.to)
      if (p) writeLine(p.conn, frame)
    } else {
      for (const p of players.values()) writeLine(p.conn, frame)
    }
  } else if (mode === 'join' && gmConn) {
    writeLine(gmConn, frame)
  }
}

async function stop () {
  leaving = true
  if (mode === 'host') for (const p of players.values()) writeLine(p.conn, { t: 'bye' })
  const s = swarm
  swarm = null
  mode = null
  topic = null
  gmConn = null
  players.clear()
  pending.clear()
  voiceMuted.clear()
  if (s) {
    await new Promise((resolve) => setTimeout(resolve, 100)) // let 'bye' flush
    try { await s.destroy() } catch {}
  }
  leaving = false
}

async function shutdown () {
  await stop()
  Bare.exit(0)
}

lineReader(app, (cmd) => {
  switch (cmd.cmd) {
    case 'host': return startHost(cmd)
    case 'join': return startJoin(cmd)
    case 'send': return send(cmd)
    case 'approve': return approve(cmd)
    case 'kick': return kick(cmd)
    case 'retopic': return retopic(cmd)
    case 'voice': return sendVoice(cmd)
    case 'voice-mute': return voiceMute(cmd)
    case 'leave': return stop().then(() => status('closed'))
  }
})
