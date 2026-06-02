# Lighthouse CI

The repo runs [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) on pull requests and `master` via `.github/workflows/ci.yml`.

## Local

```bash
npm run build
npm run start   # http://localhost:3000
npm run lighthouse
```

Reports are written to `.lighthouseci/` (gitignored).

If Chrome crashes in a container/VM, set `CHROME_PATH` to a system Chromium:

```bash
CHROME_PATH=/usr/bin/chromium-browser npm run lighthouse
```

## CI

- Installs `chromium-browser` on Ubuntu and sets `CHROME_PATH`.
- Audits `/`, `/demo`, `/pricing`, `/customers`.
- **Accessibility** and **SEO** scores must be ≥ 0.9 (errors).
- **Performance** and **best-practices** are warnings only (CI runners vary).
- The Lighthouse step uses `continue-on-error: true` so a runner Chrome flake does not block deploy; check the `lighthouse-reports` artifact when tuning performance.

## Config

See `lighthouserc.cjs` for URLs and thresholds.
