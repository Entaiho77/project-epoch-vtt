# @solryn/desktop — Project Epoch VTT (Electron)

The standalone desktop virtual tabletop. A GM hosts a room; players connect
through the [relay server](../relay) with a 6-letter room code. Local-first, no
Firebase, no subscriptions.

## Layout

```
electron/
  main.ts          BrowserWindow + IPC (relay:connect|disconnect|send, app:getVersion)
  preload.ts       contextBridge → window.relay + window.app (contextIsolation on)
  relay-client.ts  main-process ws connection to the relay, auto-reconnect (≤3)
src/               React renderer (Firebase-free), talks only to window.relay
  App.tsx          lobby (host / join) + room (players, chat) UI
  lib/useRelaySession.ts   session state machine over the relay protocol
  types/global.d.ts        window.relay / window.app typings
electron.vite.config.ts    MUST be named exactly this (electron-vite rejects vite.config.ts)
```

The shared `@solryn/*` packages are consumed as TypeScript **source** via the
aliases in `electron.vite.config.ts` (mirroring `tsconfig.base.json` paths) — no
package build step.

## Develop

```bash
# from the repo root
npm install                 # links all @solryn/* workspaces
npm run -w @solryn/relay build && node apps/relay/dist/server.js   # start a relay on :3001

# in another shell
npm run -w @solryn/desktop dev     # electron-vite dev (opens the app window)
```

Then click **Host game** in one window to get a room code; run a second instance
(or a second machine) and **Join** with that code.

## Verify without a window

The Electron binary can't always be downloaded in sandboxed CI, so verify with:

```bash
npm run -w @solryn/desktop typecheck   # node + renderer typecheck
npm run -w @solryn/desktop build       # electron-vite build (main + preload + renderer)
```

## Package

```bash
npm run -w @solryn/desktop dist        # electron-builder → AppImage / nsis / dmg
```

## Version pins (do not bump blindly)

`electron-vite@5` peers on `vite ≤ 7`, so this app pins **vite@7** +
**@vitejs/plugin-react@5**. Do not move to vite@8 / plugin-react@6 here.
