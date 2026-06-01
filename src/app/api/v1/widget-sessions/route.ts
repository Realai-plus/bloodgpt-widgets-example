/**
 * POST /api/v1/widget-sessions
 *
 * Mirrors the real BloodGPT endpoint your server calls to exchange a
 * long-lived API key for a short-lived, patient-scoped session token.
 *
 *   curl -X POST http://localhost:3100/api/v1/widget-sessions \
 *     -H "Authorization: Bearer $BLOODGPT_API_KEY" \
 *     -H "Content-Type: application/json" \
 *     -d '{"external_patient_id":"patient-jordan-avery","ttl_seconds":900}'
 *
 * In this demo any non-empty API key is accepted.
 */
import { errorJson, json } from "@/lib/api-helpers";
import { bearerFrom, mintSessionToken } from "@/lib/session";

export async function POST(request: Request) {
  const apiKey = bearerFrom(request.headers.get("authorization"));
  if (!apiKey) {
    return errorJson(
      401,
      "missing_api_key",
      "Provide your API key as `Authorization: Bearer <key>`.",
    );
  }

  let body: { external_patient_id?: string; ttl_seconds?: number };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return errorJson(400, "invalid_body", "Request body must be JSON.");
  }

  if (!body.external_patient_id) {
    return errorJson(
      400,
      "missing_field",
      "`external_patient_id` is required.",
    );
  }

  const ttl =
    typeof body.ttl_seconds === "number" && body.ttl_seconds > 0
      ? Math.min(body.ttl_seconds, 3600)
      : undefined;

  const session = mintSessionToken(body.external_patient_id, ttl);
  return json(session);
}
