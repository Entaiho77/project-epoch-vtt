// Test helpers: a private HyperDHT network plus real helper processes on Bare,
// with this file playing the part of the desktop app (src-tauri/src/swarm.rs).
const net = require('net')
const path = require('path')
const crypto = require('crypto')
const { spawn } = require('child_process')
const createTestnet = require('hyperdht/testnet')
const fs = require('fs')
const bareBinary = require('bare-runtime')()
// npm doesn't keep the execute bit on this binary (non-Windows).
if (process.platform !== 'win32') { try { fs.chmodSync(bareBinary, 0o755) } catch {} }

const HELPER = path.join(__dirname, 'helper.js')

async function startTestnet () {
  const testnet = await createTestnet(3, { host: '127.0.0.1' })
  const bootstrap = testnet.bootstrap.map((b) => `${b.host}:${b.port}`).join(',')
  return { testnet, bootstrap }
}

/** Start one helper; resolves once it has connected back and said ready. */
function startHelper ({ bootstrap, seed = crypto.randomBytes(32).toString('hex'), entry = HELPER, bin = bareBinary }) {
  return new Promise((resolve, reject) => {
    const token = crypto.randomBytes(16).toString('hex')
    const events = []
    const waiters = []
    let sock = null
    let buf = ''
    const server = net.createServer((s) => {
      sock = s
      s.on('data', (d) => {
        buf += d.toString()
        let nl
        while ((nl = buf.indexOf('\n')) !== -1) {
          const line = buf.slice(0, nl); buf = buf.slice(nl + 1)
          if (!line) continue
          const ev = JSON.parse(line)
          if (ev.ev === 'ready') {
            if (ev.token !== token) return s.destroy()
            api.key = ev.key
            resolve(api)
            continue
          }
          events.push(ev)
          for (const w of [...waiters]) if (w.pred(ev)) { waiters.splice(waiters.indexOf(w), 1); w.resolve(ev) }
        }
      })
    })
    let child
    const api = {
      events,
      key: null,
      send: (cmd) => sock.write(JSON.stringify(cmd) + '\n'),
      /** Wait for an event matching pred (checks history first). */
      waitFor (pred, ms = 15000, label = 'event') {
        const hit = events.find(pred)
        if (hit) return Promise.resolve(hit)
        return new Promise((res, rej) => {
          const w = { pred, resolve: (e) => { clearTimeout(t); res(e) } }
          const t = setTimeout(() => { waiters.splice(waiters.indexOf(w), 1); rej(new Error('timed out waiting for ' + label)) }, ms)
          waiters.push(w)
        })
      },
      messages: (type) => events.filter((e) => e.ev === 'message' && e.message.type === type),
      async close () {
        sock?.destroy()
        server.close()
        await new Promise((r) => { if (child.exitCode !== null) return r(); child.once('exit', r); setTimeout(() => { child.kill(); r() }, 3000) })
      }
    }
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port
      const args = [entry, '--port', String(port), '--token', token, '--seed', seed]
      if (bootstrap) args.push('--bootstrap', bootstrap)
      child = spawn(bin, args, { stdio: ['ignore', 'inherit', 'inherit'] })
      child.on('error', reject)
    })
  })
}

const isMsg = (type) => (e) => e.ev === 'message' && e.message.type === type
const isStatus = (s) => (e) => e.ev === 'status' && e.status === s

module.exports = { startTestnet, startHelper, isMsg, isStatus }
