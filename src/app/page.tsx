import { DemoProvider } from "@/components/provider";
import { Showcase } from "@/components/showcase";
import { EXTERNAL_PATIENT_ID } from "@/lib/mock/data";
import { mintSessionToken, mintViaBackend, type MintedSession } from "@/lib/session";

// Mint a fresh, short-lived token on every request so it never expires
// mid-session and is never baked into a static build.
export const dynamic = "force-dynamic";

export default async function Page() {
  const externalPatientId =
    process.env.DEMO_EXTERNAL_PATIENT_ID || EXTERNAL_PATIENT_ID;

  // Where the *widgets* (browser) fetch data from. Empty => same-origin mock.
  const apiUrl = process.env.NEXT_PUBLIC_BLOODGPT_API_URL || "";

  // Where the *server* mints the session token. Defaults to the public URL,
  // but can be overridden (e.g. an internal/cluster URL the browser can't see).
  const mintUrl = process.env.BLOODGPT_API_URL || apiUrl;

  // --- Token mint ---------------------------------------------------------
  // Real backend configured  -> exchange the API key for a real `wgt_` token.
  // No backend URL           -> mint a local mock token for the bundled API.
  let session: MintedSession;
  let mintError: string | null = null;
  if (mintUrl) {
    try {
      session = await mintViaBackend({
        apiUrl: mintUrl,
        apiKey: process.env.BLOODGPT_API_KEY,
        externalPatientId,
      });
    } catch (err) {
      mintError = err instanceof Error ? err.message : String(err);
      session = mintSessionToken(externalPatientId); // placeholder; not used on error
    }
  } else {
    session = mintSessionToken(externalPatientId);
  }

  if (mintError) {
    return (
      <MintErrorScreen
        message={mintError}
        apiUrl={apiUrl}
        mintUrl={mintUrl}
        externalPatientId={externalPatientId}
        hasKey={Boolean(process.env.BLOODGPT_API_KEY)}
      />
    );
  }

  return (
    <DemoProvider
      token={session.session_token}
      apiUrl={apiUrl}
    >
      <Showcase
        externalPatientId={externalPatientId}
        sessionToken={session.session_token}
        apiUrl={apiUrl}
        expiresAt={session.expires_at}
      />
    </DemoProvider>
  );
}

function MintErrorScreen({
  message,
  apiUrl,
  mintUrl,
  externalPatientId,
  hasKey,
}: {
  message: string;
  apiUrl: string;
  mintUrl: string;
  externalPatientId: string;
  hasKey: boolean;
}) {
  const rows = [
    { k: "mint endpoint", v: `${mintUrl.replace(/\/+$/, "")}/api/v1/widget-sessions` },
    { k: "widget api_url", v: apiUrl || "(same origin)" },
    { k: "external_patient_id", v: externalPatientId },
    { k: "BLOODGPT_API_KEY", v: hasKey ? "set" : "MISSING" },
  ];
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-800">
          Couldn’t mint a widget session token
        </h1>
        <p className="mt-2 text-sm text-red-700">{message}</p>
      </div>

      <dl className="mt-6 space-y-2 rounded-2xl border border-gray-200 bg-white p-5 text-sm">
        {rows.map((r) => (
          <div
            key={r.k}
            className="flex items-center justify-between gap-3"
          >
            <dt className="text-gray-400">{r.k}</dt>
            <dd className="truncate font-mono text-gray-700">{r.v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 text-sm leading-relaxed text-gray-600">
        <p className="font-medium text-gray-900">Common fixes</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <code className="rounded bg-gray-100 px-1">401 invalid_api_key</code> —{" "}
            <code className="rounded bg-gray-100 px-1">BLOODGPT_API_KEY</code> must
            be a valid WorkOS API key whose organization exists in the backend.
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1">ECONNREFUSED</code> — start
            the backend (<code className="rounded bg-gray-100 px-1">apps/b2b-api</code>{" "}
            on <code className="rounded bg-gray-100 px-1">:8000</code>) or fix{" "}
            <code className="rounded bg-gray-100 px-1">NEXT_PUBLIC_BLOODGPT_API_URL</code>.
          </li>
          <li>
            To run fully offline against the bundled mock backend, unset{" "}
            <code className="rounded bg-gray-100 px-1">NEXT_PUBLIC_BLOODGPT_API_URL</code>{" "}
            (and <code className="rounded bg-gray-100 px-1">BLOODGPT_API_URL</code>).
          </li>
        </ul>
      </div>
    </main>
  );
}
