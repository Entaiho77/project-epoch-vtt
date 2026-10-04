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
 * Every connection is encrypted (Noise). Each install has a fixed key pair, so the GM
 * can recognise a returning player's device.
 *
 * App → helper commands  {cmd: 'host' | 'join' | 'send' | 'approve' | 'kick' | 'retopic' | 'leave', …}
 * Helper → app events    {ev: 'status', status} | {ev: 'message', message}
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
    case 'leave': return stop().then(() => status('closed'))
  }
})
