# Deploying to Vercel

This project deploys as a single Express app (`server.ts` at the repo root,
which mounts the existing API from `artifacts/api-server`) using Vercel's
zero-configuration Node.js backend support. The built frontend
(`artifacts/drew-halle`) is copied into `public/`, which Vercel serves
directly — no `api/` folder or `vercel.json` rewrites are involved, so there's
no risk of a rewrite stripping the `/api` prefix from a request path. Follow
these steps in order.

## Why `server.ts` gets pre-bundled before Vercel sees it

`vercel-build.sh` runs `server-build.mjs`, which uses esbuild to bundle
`server.ts` (and everything it imports — `artifacts/api-server`, `lib/db`,
etc.) into a single self-contained `server.js` at the repo root, then removes
`server.ts` from the build output. This is required, not optional:

Vercel's zero-config Node backend transpiles a TS entrypoint file-by-file,
mirroring the source tree, rather than bundling it into one file — and that
transpile does not add file extensions to relative import specifiers. Node's
ESM runtime resolver (unlike TypeScript's `bundler` resolution used for local
dev/typecheck) requires relative imports to include their extension, so an
un-rewritten `import app from "./artifacts/api-server/src/app"` throws
`ERR_MODULE_NOT_FOUND` on every request in production, even though the Vercel
build itself reports success. Pre-bundling with esbuild inlines all local
relative imports ourselves, so none are left for Vercel's transpile step to
mishandle — only bare package specifiers (`express`, `pg`, etc.) remain,
which Node resolves via `node_modules` regardless of extensions. See the
comment at the top of `server-build.mjs` for the full explanation, and
`artifacts/api-server/build.mjs` for the equivalent (and original) pattern
this mirrors.

## 1. Environment variables (Vercel Project Settings → Environment Variables)

Set these for the **Production** environment (and Preview, if you want preview
deployments to have a working API/database):

| Vercel env var name | Value / where to get it |
| --- | --- |
| `DATABASE_URL` | The external Postgres connection string you provisioned for production. **Must be named exactly `DATABASE_URL`** — the app reads `process.env.DATABASE_URL`; it does not read `VERCEL_DATABASE_URL` (that name is only used for the copy of the same value stored as a Replit secret in this workspace). |
| `SESSION_SECRET` | Copy the value of the `SESSION_SECRET` secret from this Replit workspace (Tools → Secrets). Used to sign the portal's session cookie. |
| `PORTAL_PASSWORD` | Copy the value of the `PORTAL_PASSWORD` secret from this Replit workspace. This is the password required to log into `/portal`. |
| `RESEND_API_KEY` | Copy the value of the `RESEND_API_KEY` secret from this Replit workspace. Used by the contact form to send email via Resend. |

None of these should be committed to the repo — set them directly in Vercel's
dashboard.

## 2. Project settings

- **Framework preset:** Vercel auto-detects Express from `server.ts` (its
  zero-config Node.js backend support) — no framework preset to choose.
- **Root directory:** the repository root (leave it blank/unset). `server.ts`
  must be at the project root for Vercel's entrypoint detection to find it,
  and `lib/db` / `artifacts/api-server` need to be reachable from there. The
  build command (`vercel-build.sh`, invoked via `pnpm -w exec bash
  vercel-build.sh`) is written to work correctly even if this setting is
  accidentally left pointing at a subfolder — pnpm's `-w` flag forces the
  build to run from the real monorepo root regardless — but if the build
  ever fails with an error mentioning "Root Directory", check this setting
  first.
- **Node.js version:** pinned via `"engines": { "node": "24.x" }` in the root
  `package.json`. Vercel reads this automatically; no manual setting needed.

## 3. Deploy

Push to the branch connected to your Vercel project (or run `vercel --prod`
from the CLI once linked). Vercel will:
1. Run the `buildCommand` in `vercel.json` (`vercel-build.sh`), which builds
   the Vite frontend into `public/`, then runs `server-build.mjs` to bundle
   `server.ts` into a single `server.js` and removes `server.ts` from the
   build output (see "Why `server.ts` gets pre-bundled" above).
2. Detect `server.js` as the Node entrypoint, deploy it as a single Node
   function, and route every request to it — static files under `public/`
   are served directly without invoking the function; everything else
   (`/api/*` and client-side routes) reaches the Express app with its
   original path intact.

## 4. Post-deploy smoke tests

Run through these on the live Vercel URL (not the Replit preview):

- **Contact form:** submit it from the site; confirm you receive the email via
  Resend and the form shows a success state.
- **Recent Work carousel:** confirm it loads items from `/api/recent-work`
  (or shows the correct empty state if nothing has been added yet).
- **Portal login:** go to `/portal`, log in with `PORTAL_PASSWORD`, confirm you
  land on the authenticated view. Reload the page — you should stay logged in
  (the session cookie persists across requests/serverless invocations).
- **Portal CRUD:** add a recent-work item, edit it, toggle its active state,
  and delete it. Confirm each change is reflected immediately and persists
  after a reload (i.e. it's actually hitting the production database).
- **Portal logout:** log out, then reload — you should be sent back to the
  login screen.
- **Client-side routes:** navigate directly to a deep link like `/portal` (not
  just via in-app navigation) and confirm it loads the app instead of a 404 —
  this exercises the SPA fallback in `server.ts`.
- **Search engines:** confirm `/robots.txt` on the live domain still disallows
  `/portal`.

## Keeping the database schema in sync

This project uses two separate Postgres databases: Replit's internal dev
database, and the external one configured above for Vercel. They do not sync
automatically. Whenever the Drizzle schema in `lib/db/src/schema` changes, push
it to both:

```bash
# Replit dev database (uses the workspace's own DATABASE_URL)
pnpm --filter @workspace/db run push

# Vercel production database
DATABASE_URL="<your external connection string>" pnpm --filter @workspace/db run push
```
