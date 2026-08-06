---
name: Vercel + pnpm monorepo API deployment
description: How this project's API is deployed to Vercel from a pnpm monorepo — Express app as a zero-config Node backend, external prod Postgres.
---

## Architecture decision
The Express app is deployed via Vercel's zero-config Node.js backend support (a root-level `server.ts` that imports `express` and exports the app) rather than a hand-rolled `api/*.ts` serverless function + `vercel.json` rewrites.

**Why:** The classic `api/[[...path]].ts` catch-all + rewrite approach is fragile — it's easy to end up with a rewrite or routing rule that doesn't preserve the full original request path, so an Express app mounted at `/api` silently 404s on every sub-route. Vercel's native framework detection hands the raw, unmodified request straight to the exported app, eliminating that whole class of bug. Prefer it whenever the deployed backend is a supported framework (Express, Hono, Fastify, etc.).

**How to apply:** Entrypoint must be a recognized filename (root or `src/`: `app`/`index`/`server`/`main`) at the project's Vercel root directory, must literally `import` the framework package, and should `export default` the app instance. No `api/` folder, no `vercel.json` rewrites needed for routing. Static assets go in `public/` (served directly by Vercel, bypassing the function) — use that instead of `express.static` for anything Vercel should serve without invoking the function; an SPA needs an explicit Express catch-all route (e.g. `app.get("/*splat", ...)` in Express 5) to serve `index.html` for client-side routes.

## Two separate Postgres databases
Replit's own dev database is internal-only and unreachable from Vercel. This project's Vercel production deployment therefore uses a separate, externally-hosted Postgres the user provisioned themselves (not a Replit-managed database).

**Why:** The user chose to self-host rather than provision Replit's production DB (which requires publishing through Replit first).

**How to apply:** Whenever the Drizzle schema changes, push it to both databases — the Replit dev one and the external Vercel one — they do not sync automatically and will drift otherwise.

## Serverless-safe patterns to preserve
- Size DB connection pools down (fewer max connections, shorter idle timeout) when running serverless vs. a persistent process, and always attach an error handler to the pool — an unhandled idle-connection error otherwise crashes the whole process.
- Any server-side session state must be stateless (e.g. a signed cookie carrying just an issued-at timestamp) rather than kept in an in-memory store, since serverless invocations don't share memory across requests. Validate that timestamp isn't in the future (not just "not yet expired"), and pass the exact same cookie options to `clearCookie` as were used on `res.cookie`, or browsers won't remove it.
- Never disable TLS certificate verification (`rejectUnauthorized: false`) to work around a "self-signed certificate in chain" error from a hosted Postgres provider (e.g. Supabase) — instead fetch the provider's actual root CA and pass it alongside Node's default trust store (`ca: [...tls.rootCertificates, providerRootCA]`), keeping verification fully enabled.
