import { DemoProvider } from "@/components/provider";
import { Showcase } from "@/components/showcase";
import { EXTERNAL_PATIENT_ID } from "@/lib/mock/data";
import { mintSessionToken } from "@/lib/session";

// Mint a fresh, short-lived token on every request so it never expires
// mid-session and is never baked into a static build.
export const dynamic = "force-dynamic";

export default function Page() {
  const externalPatientId =
    process.env.DEMO_EXTERNAL_PATIENT_ID || EXTERNAL_PATIENT_ID;

  // --- Server-side token mint --------------------------------------------
  // In production this is an HTTP call your server makes with its API key:
  //
  //   const res = await fetch(`${API}/api/v1/widget-sessions`, {
  //     method: "POST",
  //     headers: { Authorization: `Bearer ${process.env.BLOODGPT_API_KEY}` },
  //     body: JSON.stringify({ external_patient_id: externalPatientId }),
  //   });
  //   const { session_token } = await res.json();
  //
  // (That exact route is implemented at src/app/api/v1/widget-sessions.)
  // Here we call the mint helper directly to keep the example self-contained.
  const { session_token, expires_at } = mintSessionToken(externalPatientId);

  // Empty string => same-origin: the widgets hit this app's mock endpoints.
  const apiUrl = process.env.NEXT_PUBLIC_BLOODGPT_API_URL || "";

  return (
    <DemoProvider
      token={session_token}
      apiUrl={apiUrl}
    >
      <Showcase
        externalPatientId={externalPatientId}
        sessionToken={session_token}
        apiUrl={apiUrl}
        expiresAt={expires_at}
      />
    </DemoProvider>
  );
}
