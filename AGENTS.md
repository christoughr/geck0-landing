# AGENTS.md

Guidance for AI agents working in this repository.

## Cursor Cloud specific instructions

### What this repo is

Single **Next.js 14** app (`geck0-landing`): marketing site, MDX blog, checkout surfaces, and beta product under `/app/*`. No monorepo, no Docker/devcontainer, no Makefile.

### Dependency refresh

On VM startup, run `npm ci` from the repo root (see update script). Uses **npm** and `package-lock.json` (Node 20+; CI uses Node 22).

### Run the app (development)

```bash
npm run dev
```

Serves at **http://localhost:3000**. Prefer a **tmux** session (e.g. `next-dev-server`) for long-running dev — hot reload does not always pick up newly installed packages; restart `npm run dev` after `npm ci` if routes or imports behave oddly.

Optional: copy `.env.example` → `.env.local`. The app runs without secrets; `/api/health` reports `degraded` when Mailchimp, Blob/Resend, Stripe, KV, etc. are unset.

### Verify locally (fast)

With the server up:

```bash
npm run smoke:local
```

Hits http://localhost:3000 (routes, APIs, honeypot subscribe, checkout metadata). **Do not** use `npm run smoke` in Cloud VMs unless you intend to test production https://geck0.ai.

### Lint / typecheck / build

| Command | Purpose |
|---------|---------|
| `npm run lint` | ESLint (`next lint`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Production build |
| `npm run start` | Serve production build on port 3000 |

CI order: typecheck → lint → build.

### E2E (Playwright)

Playwright’s `webServer` runs **`npm run start`** (not `dev`) after a build. Typical flow:

```bash
npm run build
npm run test:e2e:install   # once per VM for Chromium
npm run test:e2e
```

Set `PLAYWRIGHT_BASE_URL` if the server is already running elsewhere.

### App beta on localhost

See `docs/APP_BETA.md`. For open sign-in locally: `APP_SESSION_SECRET` (32+ chars) and `APP_BETA_OPEN=true` in `.env.local`, then `npm run dev` → http://localhost:3000/app.

### Git / Vercel

Follow `.cursor/rules/vercel-git.mdc`: commit as repo owner (`christoughr@gmail.com`), not `geck0-bot`. If Vercel Git deploy is blocked, use `npx vercel deploy --prod --yes` from the project root.

### Services you do **not** need for default dev/smoke

Redis/KV, Mailchimp, Stripe, Turnstile, OAuth, and external analytics are optional for local marketing smoke and most Playwright tests. They are required only when testing those integrations end-to-end.

### Demo media

Product walkthrough: `public/demo/geck0-product-demo.mp4` and `.webm` (poster JPG). Do not commit `*-full.mp4` backups (gitignored).

Production CI smoke may 403 on Cloudflare — see `docs/CLOUDFLARE_CI.md`; local `npm run smoke:local` is the gate.

### Lighthouse CI

```bash
npm run build
npm run start   # separate terminal or background
npm run lighthouse
```

CI runs the same against `http://localhost:3000` after build. Reports upload as the `lighthouse-reports` artifact. Performance thresholds are **warn** only (accessibility/SEO are errors).
