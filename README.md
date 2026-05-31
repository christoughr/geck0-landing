# geck0 Landing Page

Production marketing site for [geck0.ai](https://geck0.ai) — B2B AI knowledge platform.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Stack

- **Next.js 14** App Router, TypeScript, Tailwind CSS
- **Framer Motion** — section animations
- **Canvas 2D** — Hero synapse background (`SynapseCanvas.tsx`)
- **i18n** — KO/EN via cookie + localStorage (`geck0-locale`)
- **Plausible** — analytics (cookie-consent gated)
- **Mailchimp** — waitlist API
- **Vercel** — hosting + GitHub auto-deploy

## Project structure

```
src/
├── app/              # Routes, API handlers, sitemap, robots
├── components/       # UI sections
├── config/site.ts    # Brand constants, footer links
├── lib/
│   ├── i18n/         # translations.ts, pageContent.ts, I18nProvider
│   ├── metadata.ts   # Localized SEO metadata
│   ├── locale.ts     # Cookie-based locale
│   ├── rate-limit.ts # API rate limiting
│   └── contact-store.ts  # Blob + Slack persistence
├── content/blog/     # MDX blog posts
middleware.ts         # Security headers, ?lang= cookie setter
public/
├── favicon.svg
└── og-image.png
```

## Environment variables

Copy `.env.example` → `.env.local`. Production vars live in Vercel.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL` | Plausible script (consent-gated) |
| `MAILCHIMP_*` | Waitlist subscription |
| `SLACK_WEBHOOK_URL` | Contact form notifications |
| `BLOB_READ_WRITE_TOKEN` | Durable contact form storage |
| `ADMIN_API_KEY` | Protects GET `/api/subscribe` |

## Locale / SEO

- Switch language: navbar **EN/KO** button or `?lang=en` / `?lang=ko`
- Tab title updates with locale via `DocumentMeta` + server cookie
- All public routes have `generateMetadata` with KO/EN variants

## Deploy

GitHub `master` → Vercel auto-deploy:

```bash
git push origin master
```

Manual: `vercel --prod`

## Synapse animation

See `docs/SYNAPSE_BRIEF.md` for full technical brief (for design/animation review).

---

*geck0 · hello@geck0.ai*
