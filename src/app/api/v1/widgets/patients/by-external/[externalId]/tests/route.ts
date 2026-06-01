/**
 * GET /api/v1/widgets/patients/by-external/:externalId/tests
 * Backs the <ReportsList> widget.
 */
import { errorJson, json, resolveSession } from "@/lib/api-helpers";
import { buildReportsResponse, patientMatches } from "@/lib/mock/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ externalId: string }> },
) {
  const session = resolveSession(request);
  if ("error" in session) return session.error;

  const { externalId } = await params;

  // The session token is the source of truth for which patient the caller may
  // read. Reject any attempt to read a different patient's reports.
  if (
    externalId !== session.externalPatientId ||
    !patientMatches(session.externalPatientId)
  ) {
    return errorJson(
      403,
      "patient_scope_mismatch",
      "This session token is not scoped to the requested patient.",
    );
  }

  return json(buildReportsResponse());
}
