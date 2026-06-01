/**
 * Demo session-token mint/verify.
 *
 * In production the widgets never see your API key. Your server exchanges the
 * key for a short-lived, patient-scoped session token via
 *   POST https://backend.bloodgpt.tech/api/v1/widget-sessions
 * and hands the token to the browser. This file fakes that exchange.
 *
 * The token here is just a signed-ish, base64url-encoded payload — it is NOT
 * cryptographically secure and exists only so the mock widget endpoints can
 * scope data to a patient the same way the real API does. Do not copy this
 * into production.
 */
const DEFAULT_TTL_SECONDS = 900; // 15 minutes, matches the real default

export interface SessionPayload {
  /** external patient id this token is scoped to */
  pid: string;
  /** expiry, epoch ms */
  exp: number;
}

export interface MintedSession {
  session_token: string;
  external_patient_id: string;
  expires_at: string;
}

function base64urlEncode(input: string): string {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded, "base64").toString("utf8");
}

export function mintSessionToken(
  externalPatientId: string,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): MintedSession {
  const expMs = Date.now() + ttlSeconds * 1000;
  const payload: SessionPayload = { pid: externalPatientId, exp: expMs };
  const token = `sess_${base64urlEncode(JSON.stringify(payload))}`;
  return {
    session_token: token,
    external_patient_id: externalPatientId,
    expires_at: new Date(expMs).toISOString(),
  };
}

/** Returns the scoped external patient id, or null if invalid / expired. */
export function verifySessionToken(token: string | null): string | null {
  if (!token || !token.startsWith("sess_")) return null;
  try {
    const payload = JSON.parse(
      base64urlDecode(token.slice("sess_".length)),
    ) as SessionPayload;
    if (typeof payload.pid !== "string") return null;
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) {
      return null; // expired
    }
    return payload.pid;
  } catch {
    return null;
  }
}

/** Pull a bearer token out of an Authorization header. */
export function bearerFrom(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const match = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  return match ? match[1] : null;
}
