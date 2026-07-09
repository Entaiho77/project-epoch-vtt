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

## Local persistence

Campaigns/characters/scenes live in a local SQLite database, opened in the
**main process** and exposed to the renderer over an IPC bridge (`window.db`),
never by giving the renderer filesystem access.

- Engine: **sql.js** (SQLite compiled to WebAssembly) — no native module, so no
  `node-gyp` / electron-rebuild step. The whole DB is exported to
  `<userData>/epoch.db` after every mutation (temp-file + rename for crash
  safety).
- The engine sits entirely behind `DbApi` (`src/shared/persistence.ts`) and the
  `electron/db.ts` `Repository`. Swapping to `better-sqlite3` later would not
  change those shapes or the schema.
- Schema migrations are keyed off `PRAGMA user_version` in `electron/db.ts`.
- Verified headlessly by `electron/__tests__/db.test.ts` (`npm run -w
  @solryn/desktop test`) — CRUD, ordering, and persistence across reopen.

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

### Headless / CI / sandbox launch

On a normal desktop, leave the defaults alone — Electron detects X11/Wayland and
the GPU itself. Only for headless-ish hosts (no GPU, restricted `/tmp`, XWayland
quirks) set `EPOCH_LINUX_COMPAT=1` to force the software path
(`ozone-platform=x11`, `disable-gpu`, `no-sandbox`, `disable-dev-shm-usage`):

```bash
EPOCH_LINUX_COMPAT=1 npm run -w @solryn/desktop dev
```

## Verify without a window

The Electron binary can't always be downloaded in sandboxed CI, so verify with:

```bash
npm run -w @solryn/desktop typecheck   # node + renderer typecheck
npm run -w @solryn/desktop build       # electron-vite build (main + preload + renderer)
```

## Package (UNVERIFIED)

```bash
npm run -w @solryn/desktop dist        # electron-builder → AppImage / nsis / dmg
```

⚠️ Packaging has **not** been run/verified yet. The main bundle keeps `sql.js`
and `ws` as external `require()`s, so the packaged app must ship those
production `node_modules` — hence `build.files` includes `node_modules/**/*` and
`build.asarUnpack` unpacks `sql-wasm.wasm`. In this hoisted npm-workspaces repo
those deps live in the **root** `node_modules`, which electron-builder's
monorepo handling may or may not collect cleanly. When someone does a real
`dist`, confirm the AppImage launches and can create a campaign; if `sql.js` /
`ws` aren't found, the likely fix is bundling them into the main output
(`externalizeDepsPlugin({ exclude: ['sql.js', 'ws'] })`) and copying the wasm
into `out/`.

## Version pins (do not bump blindly)

`electron-vite@5` peers on `vite ≤ 7`, so this app pins **vite@7** +
**@vitejs/plugin-react@5**. Do not move to vite@8 / plugin-react@6 here.
