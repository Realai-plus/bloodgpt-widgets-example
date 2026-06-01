# @bloodgpt/widgets

Drop-in React widgets that render BloodGPT reports inside your own application.

> **Status — v0.1.0-alpha.** Backend endpoints (`/api/v1/widget-sessions`,
> `/api/v1/widgets/...`) are tracked in BG-XXXX and not yet shipped. The
> widget surface is stable; data wiring will light up once the API ships.

## Install

```bash
npm install @bloodgpt/widgets @tanstack/react-query next-intl
```

Peer dependencies:

- `react` ≥ 18
- `react-dom` ≥ 18
- `@tanstack/react-query` ≥ 5
- `next-intl` ≥ 4

Import the stylesheet **once** in your app entry (e.g. `app/layout.tsx`):

```ts
import "@bloodgpt/widgets/styles.css";
```

## Authentication

The widgets never see your API key. Your backend mints short-lived session
tokens scoped to a single patient:

```ts
// in your server (Next.js route handler, Express, etc.)
const res = await fetch(
  "https://backend.bloodgpt.tech/api/v1/widget-sessions",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BLOODGPT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      external_patient_id: "your-patient-id",
      ttl_seconds: 900, // optional, default 900 (15 min)
    }),
  },
);
const { session_token } = await res.json();
```

Hand `session_token` to the browser and pass it to the provider:

```tsx
import { BloodGPTProvider, TestOverview } from "@bloodgpt/widgets";

export function PatientPage({ token, testId }: Props) {
  return (
    <BloodGPTProvider sessionToken={token}>
      <TestOverview testId={testId} />
    </BloodGPTProvider>
  );
}
```

## Widgets

- `<TestOverview testId>` — patient demographics + scan metrics + narrative summary
- `<ReportsList externalPatientId>` _(coming next)_
- `<TestParameters testId>` _(coming next)_
- `<TestFollowUps testId>` _(coming next)_
- `<TestReport testId>` — composite of the above _(coming next)_

Each widget also exports a hook (`useTestOverview`, etc.) for customers who
want raw data plus their own rendering.

## Locales

English ships bundled. Pass additional messages via the `messages` prop
on `BloodGPTProvider`:

```tsx
import esMessages from "./bloodgpt-es.json";

<BloodGPTProvider
  sessionToken={token}
  locale="es"
  messages={esMessages}
>
  ...
</BloodGPTProvider>;
```

## Internal notes

This package is built from the `packages/analysis-ui` view components and
the public REST surface of `apps/b2b-api`. The adapter pattern is:

```
<Widget> = useQuery via @bloodgpt/sdk → render <View> from @repo/analysis-ui
```

`@repo/analysis-ui` is bundled into the published artifact (via tsup
`noExternal`) so customers don't need access to monorepo sources.
