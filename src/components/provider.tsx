"use client";

import type { ReactNode } from "react";

import { BloodGPTProvider } from "@bloodgpt/widgets";

import { widgetMessages } from "@/lib/widget-messages";

/**
 * The widgets' internal HttpClient stores `globalThis.fetch` and later calls
 * it as a method (`this.fetchImpl(...)`), which strips its `window` binding
 * and throws "Illegal invocation" in the browser. We sidestep that with the
 * provider's documented `fetch` prop: a stable wrapper that always invokes
 * fetch with the correct receiver. Works on both server and client.
 */
const boundFetch: typeof globalThis.fetch = (input, init) =>
  globalThis.fetch(input, init);

/**
 * Thin wrapper around the package's <BloodGPTProvider>. The session token is
 * minted on the server (see src/app/page.tsx) and handed down as a prop — the
 * browser never sees your API key.
 */
export function DemoProvider({
  token,
  apiUrl,
  children,
}: {
  token: string;
  apiUrl: string;
  children: ReactNode;
}) {
  return (
    <BloodGPTProvider
      sessionToken={token}
      apiUrl={apiUrl}
      fetch={boundFetch}
      messages={widgetMessages}
    >
      {children}
    </BloodGPTProvider>
  );
}
