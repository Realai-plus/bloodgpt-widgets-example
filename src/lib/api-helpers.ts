import { bearerFrom, verifySessionToken } from "./session";

/** JSON response with a small artificial latency so loading states are visible. */
export async function json(
  body: unknown,
  init?: { status?: number },
): Promise<Response> {
  // ~350ms so the widgets' skeleton loaders are actually observable in the demo.
  await new Promise((r) => setTimeout(r, 350));
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: {
      "content-type": "application/json",
      "x-request-id": `req_${Math.random().toString(36).slice(2, 10)}`,
    },
  });
}

export function errorJson(
  status: number,
  error: string,
  message: string,
): Promise<Response> {
  return json({ error, message }, { status });
}

/**
 * Resolve the patient a request is scoped to from its session token, mirroring
 * how the real widget endpoints authenticate. Returns the external patient id,
 * or an error Response to return directly.
 */
export function resolveSession(
  request: Request,
): { externalPatientId: string } | { error: Response } {
  const token = bearerFrom(request.headers.get("authorization"));
  const externalPatientId = verifySessionToken(token);
  if (!externalPatientId) {
    return {
      error: errorJsonSync(
        401,
        "invalid_session",
        "Missing, invalid, or expired session token.",
      ),
    };
  }
  return { externalPatientId };
}

// Synchronous variant for the error path (no artificial latency needed).
function errorJsonSync(
  status: number,
  error: string,
  message: string,
): Response {
  return new Response(JSON.stringify({ error, message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}
