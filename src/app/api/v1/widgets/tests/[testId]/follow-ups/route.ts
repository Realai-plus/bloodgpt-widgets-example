/**
 * GET /api/v1/widgets/tests/:testId/follow-ups
 * Backs the <TestFollowUps> widget.
 */
import { errorJson, json, resolveSession } from "@/lib/api-helpers";
import { buildFollowUpsResponse, patientMatches } from "@/lib/mock/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ testId: string }> },
) {
  const session = resolveSession(request);
  if ("error" in session) return session.error;
  if (!patientMatches(session.externalPatientId)) {
    return errorJson(403, "patient_scope_mismatch", "Unknown patient scope.");
  }

  const { testId } = await params;
  const response = buildFollowUpsResponse(testId);
  if (!response) {
    return errorJson(
      404,
      "test_not_found",
      "No completed report found for that test id.",
    );
  }
  return json(response);
}
