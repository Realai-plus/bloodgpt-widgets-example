import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _tanstack_react_query from '@tanstack/react-query';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { FollowUpSchedule, UrgentTest, OverviewData, BloodGPTParameter, ParameterTrendData } from '@repo/analysis-ui';
export { BloodGPTParameter, FollowUpSchedule, OverviewData, ParameterTrendData, UrgentTest } from '@repo/analysis-ui';

interface BloodGPTProviderProps {
    /**
     * Short-lived session token minted by your backend via
     * `POST /api/v1/widget-sessions`. The token is bound to a specific
     * external patient ID and is read-only.
     */
    sessionToken: string;
    /**
     * Base URL of the BloodGPT API. Defaults to the production endpoint.
     * Override for staging or self-hosted deployments.
     */
    apiUrl?: string;
    /**
     * BCP-47 locale code. Defaults to "en". The widgets ship with English
     * strings only — pass `messages` to provide additional locales.
     */
    locale?: string;
    /**
     * Override or extend the bundled messages. Shape mirrors the keys under
     * the `analysis` namespace in apps/patient-portal/messages/<locale>.json.
     * Customer-provided entries shallow-merge over defaults.
     */
    messages?: Record<string, unknown>;
    /**
     * Bring your own QueryClient (e.g. to share cache with the host app).
     * If omitted, the provider creates an isolated one.
     */
    queryClient?: QueryClient;
    /**
     * Custom fetch implementation — useful for SSR with auth cookies or for
     * test mocking. Defaults to `globalThis.fetch`.
     */
    fetch?: typeof globalThis.fetch;
    children: ReactNode;
}
declare function BloodGPTProvider({ sessionToken, apiUrl, locale, messages, queryClient, fetch, children, }: BloodGPTProviderProps): react_jsx_runtime.JSX.Element;

/**
 * API response DTOs for the widgets endpoints.
 *
 * These mirror the shapes the b2b-api will return at:
 *   GET /api/v1/widgets/patients/by-external/:externalId/tests
 *   GET /api/v1/widgets/tests/:testId/overview
 *   GET /api/v1/widgets/tests/:testId/parameters
 *   GET /api/v1/widgets/tests/:testId/follow-ups
 *
 * Once the endpoints exist we should switch to the orval-generated types
 * (regenerated as part of the SDK publish pipeline). Hand-maintained here
 * for the v0.1 widget UI work — the public widget components only depend
 * on these DTOs so the swap is contract-only.
 */

interface ReportListItem {
    test_id: string;
    test_date: string | null;
    created_at: string;
    status: "processing" | "completed" | "failed";
    total_count: number;
    normal_count: number;
    abnormal_count: number;
    critical_count: number;
    headline_summary?: string | null;
}
interface ReportsListResponse {
    request_id: string;
    patient: {
        external_patient_id: string;
        name?: string | null;
    };
    reports: ReportListItem[];
}
interface TestOverviewResponse {
    request_id: string;
    test_id: string;
    test_date: string | null;
    patient: {
        name?: string | null;
        birth_date?: string | null;
        gender?: string | null;
        weight?: number | null;
        height?: number | null;
    } | null;
    metrics: {
        total: number;
        normal: number;
        abnormal: number;
        critical: number;
    };
    overview: OverviewData | null;
}
interface TestParametersResponse {
    request_id: string;
    test_id: string;
    panels: Array<{
        panel_name: string;
        overview?: string | null;
        parameters: BloodGPTParameter[];
        /** Map of parameter_name → trend data for sparkline / trends chart. */
        trend_data?: Record<string, ParameterTrendData>;
    }>;
}
interface TestFollowUpsResponse {
    request_id: string;
    test_id: string;
    schedule: FollowUpSchedule | null;
    urgent_tests: UrgentTest[];
}

interface ReportsListProps {
    externalPatientId: string;
    /** Called when a row is clicked. Receives the test id. */
    onSelectReport?: (testId: string) => void;
    /** Override the link target — useful for next/link integration. */
    renderRow?: (item: ReportListItem) => React.ReactNode;
    className?: string;
    loadingFallback?: React.ReactNode;
    errorFallback?: (error: Error) => React.ReactNode;
    emptyFallback?: React.ReactNode;
}
declare function ReportsList({ externalPatientId, onSelectReport, renderRow, className, loadingFallback, errorFallback, emptyFallback, }: ReportsListProps): react_jsx_runtime.JSX.Element;

interface TestFollowUpsProps {
    testId: string;
    compact?: boolean;
    className?: string;
    loadingFallback?: React.ReactNode;
    errorFallback?: (error: Error) => React.ReactNode;
}
declare function TestFollowUps({ testId, compact, className, loadingFallback, errorFallback, }: TestFollowUpsProps): react_jsx_runtime.JSX.Element | null;

interface TestOverviewProps {
    /** BloodGPT internal test id (from a ReportsList row or your own records). */
    testId: string;
    /**
     * Hide the patient demographics block. Defaults to false. Set to true
     * when you embed the widget in a context that already shows patient info
     * (e.g. a chart on a patient detail page) or for share links where PII
     * has been stripped on the server.
     */
    hidePatientInfo?: boolean;
    /**
     * Optional className for the outer wrapper — lets you compose the widget
     * inside your own layout without an extra wrapper div.
     */
    className?: string;
    /** Slot rendered when the request is loading. Defaults to a simple placeholder. */
    loadingFallback?: React.ReactNode;
    /** Slot rendered on error. Receives the error message. */
    errorFallback?: (error: Error) => React.ReactNode;
}
declare function TestOverview({ testId, hidePatientInfo, className, loadingFallback, errorFallback, }: TestOverviewProps): react_jsx_runtime.JSX.Element | null;

interface TestParametersProps {
    testId: string;
    variant?: "default" | "dashboard" | "report";
    className?: string;
    loadingFallback?: React.ReactNode;
    errorFallback?: (error: Error) => React.ReactNode;
    onParameterClick?: (parameterName: string) => void;
}
declare function TestParameters({ testId, variant, className, loadingFallback, errorFallback, onParameterClick, }: TestParametersProps): react_jsx_runtime.JSX.Element | null;

interface TestReportProps {
    testId: string;
    hidePatientInfo?: boolean;
    className?: string;
    sections?: {
        overview?: boolean;
        parameters?: boolean;
        followUps?: boolean;
    };
}
/**
 * Composite widget — renders Overview + Parameters + FollowUps stacked.
 * For most embedding use cases this is the only widget customers need.
 */
declare function TestReport({ testId, hidePatientInfo, className, sections, }: TestReportProps): react_jsx_runtime.JSX.Element;

declare function useReports(externalPatientId: string | null | undefined, options?: Omit<UseQueryOptions<ReportsListResponse, Error>, "queryKey" | "queryFn">): _tanstack_react_query.UseQueryResult<ReportsListResponse, Error>;

declare function useTestFollowUps(testId: string | null | undefined, options?: Omit<UseQueryOptions<TestFollowUpsResponse, Error>, "queryKey" | "queryFn">): _tanstack_react_query.UseQueryResult<TestFollowUpsResponse, Error>;

declare function useTestOverview(testId: string | null | undefined, options?: Omit<UseQueryOptions<TestOverviewResponse, Error>, "queryKey" | "queryFn">): _tanstack_react_query.UseQueryResult<TestOverviewResponse, Error>;

declare function useTestParameters(testId: string | null | undefined, options?: Omit<UseQueryOptions<TestParametersResponse, Error>, "queryKey" | "queryFn">): _tanstack_react_query.UseQueryResult<TestParametersResponse, Error>;

interface HttpClientOptions {
    apiUrl: string;
    sessionToken: string;
    fetch?: typeof globalThis.fetch;
}
declare class BloodGPTApiError extends Error {
    readonly status: number;
    readonly code?: string;
    readonly requestId?: string;
    constructor(opts: {
        status: number;
        message: string;
        code?: string;
        requestId?: string;
    });
}
declare class HttpClient {
    private readonly apiUrl;
    private readonly sessionToken;
    private readonly fetchImpl;
    constructor(opts: HttpClientOptions);
    get<T>(path: string, signal?: AbortSignal): Promise<T>;
}

declare function useBloodGPTClient(): HttpClient;

export { BloodGPTApiError, BloodGPTProvider, type BloodGPTProviderProps, HttpClient, type ReportListItem, ReportsList, type ReportsListProps, type ReportsListResponse, TestFollowUps, type TestFollowUpsProps, type TestFollowUpsResponse, TestOverview, type TestOverviewProps, type TestOverviewResponse, TestParameters, type TestParametersProps, type TestParametersResponse, TestReport, type TestReportProps, useBloodGPTClient, useReports, useTestFollowUps, useTestOverview, useTestParameters };
