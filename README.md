# BloodGPT Widgets — Example App

A standalone **Next.js 15 (App Router)** app that showcases
[`@bloodgpt/widgets`](https://www.npmjs.com/package/@bloodgpt/widgets)
(`0.1.0-alpha.0`, installed from npm) — the drop-in React components that render
BloodGPT blood-test reports inside your own product.

It ships with a **mock backend**, so it runs end-to-end with **no real
credentials**. The widgets, their props, and the API data contracts are the
real thing — point the app at a live backend and it behaves identically.

📚 **Full documentation:** [docs.bloodgpt.com](https://docs.bloodgpt.com) ·
📦 **Package:** [`@bloodgpt/widgets` on npm](https://www.npmjs.com/package/@bloodgpt/widgets)

![Full report view](./docs/screenshot.png)

## What it demonstrates

- All five widgets: **`<ReportsList>`**, **`<TestOverview>`**,
  **`<TestParameters>`**, **`<TestFollowUps>`**, and the composite
  **`<TestReport>`**.
- The **hook escape hatch** (`useTestOverview`) for bringing your own UI.
- The real **auth flow**: a short-lived, patient-scoped **session token** minted
  on the server and handed to `<BloodGPTProvider>` — the browser never sees an
  API key.
- A faithful **mock backend** implementing the documented endpoints with rich,
  realistic (fictional) lab data — including trends, follow-up tiers, and a
  still-processing report.

## Quick start

```bash
pnpm install
cp .env.example .env.local   # optional — sensible defaults are baked in
pnpm dev                     # http://localhost:3100
```

`pnpm build && pnpm start` runs the production build on the same port.

## How it fits together

```
Browser                         Next.js server (this app)
───────                         ─────────────────────────
<BloodGPTProvider               POST /api/v1/widget-sessions     ← mints token
  sessionToken=…                GET  /api/v1/widgets/patients/... ← ReportsList
  apiUrl="" (same origin)>      GET  /api/v1/widgets/tests/:id/overview
  <ReportsList/> <TestReport/>  GET  /api/v1/widgets/tests/:id/parameters
                                GET  /api/v1/widgets/tests/:id/follow-ups
```

| Concern        | Where                                                        |
| -------------- | ------------------------------------------------------------ |
| Token mint     | `src/lib/session.ts`, `src/app/api/v1/widget-sessions`       |
| Mock data      | `src/lib/mock/data.ts`                                        |
| Widget API     | `src/app/api/v1/widgets/**`                                  |
| Provider wiring| `src/components/provider.tsx`, `src/app/page.tsx`           |
| Showcase UI    | `src/components/showcase.tsx`                                 |

### The session-token flow

`src/app/page.tsx` (a Server Component) mints a token and passes it to the
client provider. In production that mint is an HTTP call your server makes with
its API key:

```ts
const res = await fetch(`${API}/api/v1/widget-sessions`, {
  method: "POST",
  headers: { Authorization: `Bearer ${process.env.BLOODGPT_API_KEY}` },
  body: JSON.stringify({ external_patient_id }),
});
const { session_token } = await res.json();
```

That exact endpoint is implemented here too (`src/app/api/v1/widget-sessions`),
so you can exercise it with `curl`:

```bash
curl -X POST http://localhost:3100/api/v1/widget-sessions \
  -H "Authorization: Bearer demo-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"external_patient_id":"patient-jordan-avery"}'
```

## Going live

Set `NEXT_PUBLIC_BLOODGPT_API_URL` to a real BloodGPT deployment and replace the
server-side mint in `src/app/page.tsx` with a real call using your
`BLOODGPT_API_KEY`. Delete `src/app/api/v1/**` and `src/lib/mock/**` once you no
longer need the mock.

For API keys, the endpoint reference, and integration guides, see the docs at
**[docs.bloodgpt.com](https://docs.bloodgpt.com)**.

## Notes on consuming the package

This example installs the published package straight from npm:

```jsonc
// package.json
"@bloodgpt/widgets": "0.1.0-alpha.0"
```

Three alpha rough edges are worked around here on the consumer side (each is a
known gap in `@bloodgpt/widgets@0.1.0-alpha.0` worth a ticket upstream):

1. **Styling** — the package's prebuilt `styles.css` is utilities-only and
   incomplete (it omits the brand design tokens and the hand-written typography
   utilities). This app instead generates a complete, brand-accurate stylesheet
   via its own Tailwind build: `src/app/globals.css` points `@source` at the
   installed bundle (`node_modules/@bloodgpt/widgets/dist/index.js`) so every
   class the widgets use is emitted, and re-declares the BloodGPT design tokens.
2. **`fetch` binding** — the widgets' HTTP client calls `fetch` unbound, which
   throws "Illegal invocation" in the browser; `src/components/provider.tsx`
   passes a bound wrapper via the provider's `fetch` prop.
3. **Locale namespaces** — the package bundles only the `analysis` next-intl
   namespace, but the components also read `testDetail` / `common`; we supply
   those via the provider's `messages` prop (`src/lib/widget-messages.ts`).

> **Heads-up for live data:** the backend's trend endpoint emits ISO-timestamp
> keys (`2025-03-10T00:00:00.000Z`) while the chart only plots date-only keys
> (`2025-03-10`), so trend lines render blank against a real backend until that
> mismatch is fixed (date-only keys in `b2b-api`'s `buildTrends`, or
> key-normalization in the chart). The mock backend here uses date-only keys.

## Disclaimer

All data is fictional and for demonstration only — **not medical advice**.
