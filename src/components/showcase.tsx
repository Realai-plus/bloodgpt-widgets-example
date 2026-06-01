"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ReportsList,
  TestFollowUps,
  TestOverview,
  TestParameters,
  TestReport,
  useReports,
  useTestOverview,
} from "@bloodgpt/widgets";
import { Activity, Clock, FlaskConical, ShieldCheck } from "lucide-react";

import { Badge, Card, CodeBlock, Eyebrow, Tabs } from "./ui";

const TABS = [
  { id: "report", label: "Full report" },
  { id: "overview", label: "Overview" },
  { id: "parameters", label: "Parameters" },
  { id: "followups", label: "Follow-ups" },
  { id: "hook", label: "Hook (raw data)" },
];

const SNIPPETS: Record<string, string> = {
  report: `import { TestReport } from "@bloodgpt/widgets";

<TestReport testId={testId} />`,
  overview: `import { TestOverview } from "@bloodgpt/widgets";

<TestOverview testId={testId} />`,
  parameters: `import { TestParameters } from "@bloodgpt/widgets";

<TestParameters testId={testId} variant="dashboard" />`,
  followups: `import { TestFollowUps } from "@bloodgpt/widgets";

<TestFollowUps testId={testId} />`,
  hook: `import { useTestOverview } from "@bloodgpt/widgets";

// Bring your own rendering — the hook hands you raw data.
const { data, isLoading } = useTestOverview(testId);`,
};

export function Showcase({
  externalPatientId,
  sessionToken,
  apiUrl,
  expiresAt,
}: {
  externalPatientId: string;
  sessionToken: string;
  apiUrl: string;
  expiresAt: string;
}) {
  const [activeTab, setActiveTab] = useState("report");
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const { data: reportsData } = useReports(externalPatientId);
  const reports = reportsData?.reports ?? [];

  // Default to the most recent completed report once the list arrives.
  useEffect(() => {
    if (selectedTestId) return;
    const firstCompleted = reports.find((r) => r.status === "completed");
    if (firstCompleted) setSelectedTestId(firstCompleted.test_id);
  }, [reports, selectedTestId]);

  const selectedReport = useMemo(
    () => reports.find((r) => r.test_id === selectedTestId) ?? null,
    [reports, selectedTestId],
  );
  const selectionIsReady =
    !!selectedTestId && selectedReport?.status === "completed";

  return (
    <div className="min-h-screen">
      <HeaderBar
        externalPatientId={externalPatientId}
        sessionToken={sessionToken}
        apiUrl={apiUrl}
        expiresAt={expiresAt}
      />

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
          {/* ---------------------------------------------------------- */}
          {/* Left: report selector (the <ReportsList> widget itself)    */}
          {/* ---------------------------------------------------------- */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <Eyebrow>Reports</Eyebrow>
                <span className="text-xs text-gray-400">
                  &lt;ReportsList /&gt;
                </span>
              </div>
              <ReportsList
                externalPatientId={externalPatientId}
                onSelectReport={(testId) => setSelectedTestId(testId)}
              />
            </Card>

            <SessionCard
              externalPatientId={externalPatientId}
              sessionToken={sessionToken}
              apiUrl={apiUrl}
            />
          </aside>

          {/* ---------------------------------------------------------- */}
          {/* Right: tabbed widget showcase                              */}
          {/* ---------------------------------------------------------- */}
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Eyebrow>Selected report</Eyebrow>
                <h2 className="mt-1 text-lg font-semibold text-gray-900">
                  {selectedReport
                    ? new Date(
                        selectedReport.test_date ?? selectedReport.created_at,
                      ).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Pick a report"}
                </h2>
              </div>
              <Tabs
                tabs={TABS}
                active={activeTab}
                onChange={setActiveTab}
              />
            </div>

            <Card className="p-5 sm:p-6">
              {!selectedTestId ? (
                <Placeholder>Select a report on the left to begin.</Placeholder>
              ) : !selectionIsReady ? (
                <ProcessingNotice />
              ) : (
                <WidgetForTab
                  tab={activeTab}
                  testId={selectedTestId}
                />
              )}
            </Card>

            <div className="space-y-2">
              <Eyebrow>How you embed it</Eyebrow>
              <CodeBlock code={SNIPPETS[activeTab]} />
            </div>
          </section>
        </div>

        <Disclaimer />
      </main>
    </div>
  );
}

function WidgetForTab({ tab, testId }: { tab: string; testId: string }) {
  switch (tab) {
    case "overview":
      return <TestOverview testId={testId} />;
    case "parameters":
      return <TestParameters testId={testId} variant="dashboard" />;
    case "followups":
      return <TestFollowUps testId={testId} />;
    case "hook":
      return <RawHookDemo testId={testId} />;
    case "report":
    default:
      return <TestReport testId={testId} />;
  }
}

/** Demonstrates consuming a hook directly and rendering your own UI. */
function RawHookDemo({ testId }: { testId: string }) {
  const { data, isLoading, error } = useTestOverview(testId);

  if (isLoading) {
    return <Placeholder>Loading raw data…</Placeholder>;
  }
  if (error) {
    return <Placeholder>Error: {error.message}</Placeholder>;
  }
  if (!data) return null;

  const { metrics } = data;
  const stats = [
    { label: "Biomarkers", value: metrics.total },
    { label: "In range", value: metrics.normal },
    { label: "Out of range", value: metrics.abnormal },
    { label: "Critical", value: metrics.critical },
  ];

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        The <code className="rounded bg-gray-100 px-1 py-0.5">useTestOverview</code>{" "}
        hook returns the same data the widgets use — here it drives a custom
        layout instead of the built-in one.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center"
          >
            <div className="text-3xl font-bold text-gray-900">{s.value}</div>
            <div className="mt-1 text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
      {data.overview?.narrativeSummary ? (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
          {data.overview.narrativeSummary}
        </div>
      ) : null}
    </div>
  );
}

function HeaderBar({
  externalPatientId,
  expiresAt,
}: {
  externalPatientId: string;
  sessionToken: string;
  apiUrl: string;
  expiresAt: string;
}) {
  return (
    <header className="bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-2 text-emerald-300">
          <FlaskConical className="h-5 w-5" />
          <span className="text-sm font-semibold tracking-wide">
            BloodGPT Widgets
          </span>
        </div>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Drop-in React widgets for blood-test reports
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-300">
          This is a standalone Next.js app embedding{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-emerald-200">
            @bloodgpt/widgets
          </code>
          . It talks to a built-in mock backend, so it runs with no real
          credentials — the widgets, props, and data contracts are the real
          thing.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone="brand">
            <ShieldCheck className="h-3.5 w-3.5" /> Patient-scoped session token
          </Badge>
          <Badge>
            <Activity className="h-3.5 w-3.5" /> Next.js App Router
          </Badge>
          <Badge tone="muted">patient: {externalPatientId}</Badge>
          <Badge tone="muted">
            <Clock className="h-3.5 w-3.5" /> token expires{" "}
            {new Date(expiresAt).toLocaleTimeString()}
          </Badge>
        </div>
      </div>
    </header>
  );
}

function SessionCard({
  externalPatientId,
  sessionToken,
  apiUrl,
}: {
  externalPatientId: string;
  sessionToken: string;
  apiUrl: string;
}) {
  const rows = [
    { k: "external_patient_id", v: externalPatientId },
    { k: "api_url", v: apiUrl || "(same origin)" },
    { k: "session_token", v: `${sessionToken.slice(0, 18)}…` },
  ];
  return (
    <Card className="p-5">
      <Eyebrow>Session</Eyebrow>
      <p className="mt-2 text-xs leading-relaxed text-gray-500">
        Minted on the server, then handed to{" "}
        <code className="rounded bg-gray-100 px-1 py-0.5">
          &lt;BloodGPTProvider&gt;
        </code>
        . The browser never sees your API key.
      </p>
      <dl className="mt-3 space-y-2">
        {rows.map((r) => (
          <div
            key={r.k}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <dt className="text-gray-400">{r.k}</dt>
            <dd className="truncate font-mono text-gray-700">{r.v}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function ProcessingNotice() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
        <Clock className="h-6 w-6 text-amber-600" />
      </div>
      <div>
        <p className="font-medium text-gray-900">This report is still processing</p>
        <p className="mt-1 text-sm text-gray-500">
          The widget endpoints return data only once analysis completes. Pick a
          completed report to see the widgets render.
        </p>
      </div>
    </div>
  );
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-12 text-center text-sm text-gray-500">{children}</div>
  );
}

function Disclaimer() {
  return (
    <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-gray-400">
      Demo data only — fictional patient, fictional results, not medical advice.
      The data contracts and widget components are identical to production;
      swap the mock route handlers in{" "}
      <code className="rounded bg-gray-100 px-1 py-0.5">src/app/api/v1</code> for
      a real BloodGPT backend to go live.
    </p>
  );
}
