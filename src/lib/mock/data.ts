/**
 * Mock dataset backing the example's fake BloodGPT API.
 *
 * The shapes here are the real public DTOs exported by @bloodgpt/widgets, so
 * the mock is contract-accurate: swap the route handlers in
 * src/app/api/v1/** for a real backend and the widgets behave identically.
 *
 * Everything is fictional and for demonstration only — not medical advice.
 */
import type {
  BloodGPTParameter,
  OverviewData,
  ParameterTrendData,
  ReportListItem,
  ReportsListResponse,
  TestFollowUpsResponse,
  TestOverviewResponse,
  TestParametersResponse,
} from "@bloodgpt/widgets";

export const EXTERNAL_PATIENT_ID = "patient-jordan-avery";

const PATIENT = {
  external_patient_id: EXTERNAL_PATIENT_ID,
  name: "Jordan Avery",
  birth_date: "1989-03-14",
  gender: "female",
  weight: 64,
  height: 168,
};

// --- Report ids --------------------------------------------------------------
export const TEST_LATEST = "rpt_2026_05";
export const TEST_PRIOR = "rpt_2025_11";
export const TEST_PROCESSING = "rpt_2026_05_pending";

const DATE_LATEST = "2026-05-20";
const DATE_PRIOR = "2025-11-08";
const DATE_OLDEST = "2025-05-02";

// -----------------------------------------------------------------------------
// Parameter helpers
// -----------------------------------------------------------------------------
function param(p: BloodGPTParameter): BloodGPTParameter {
  return p;
}

/** Build a trend series (date -> value) for the sparkline / trends chart. */
function trend(
  name: string,
  unit: string,
  range: { normalMin?: number; normalMax?: number },
  points: Record<string, number>,
  trendAnalysis?: string,
): ParameterTrendData {
  return {
    parameterName: name,
    unit,
    normalMin: range.normalMin,
    normalMax: range.normalMax,
    rangeType: "BOTH_BOUNDS",
    trend: points,
    trendAnalysis,
  };
}

// -----------------------------------------------------------------------------
// Latest report (2026-05) — parameters grouped into panels
// -----------------------------------------------------------------------------
const LATEST_PANELS: TestParametersResponse["panels"] = [
  {
    panel_name: "Complete Blood Count",
    overview:
      "Red and white cell lines are within range. Hemoglobin sits at the lower edge of normal, consistent with the iron findings below.",
    parameters: [
      param({
        name: "Hemoglobin",
        value: 11.9,
        unit: "g/dL",
        interpretation: "low",
        referenceRange: { normalMin: 12, normalMax: 15.5 },
        normalMin: 12,
        normalMax: 15.5,
        description:
          "Oxygen-carrying protein in red blood cells. Mildly below range, often related to low iron stores.",
      }),
      param({
        name: "Hematocrit",
        value: 38,
        unit: "%",
        interpretation: "normal",
        referenceRange: { normalMin: 36, normalMax: 46 },
        normalMin: 36,
        normalMax: 46,
      }),
      param({
        name: "White Blood Cells",
        value: 6.2,
        unit: "10^9/L",
        interpretation: "normal",
        referenceRange: { normalMin: 4, normalMax: 11 },
        normalMin: 4,
        normalMax: 11,
      }),
      param({
        name: "Platelets",
        value: 268,
        unit: "10^9/L",
        interpretation: "normal",
        referenceRange: { normalMin: 150, normalMax: 400 },
        normalMin: 150,
        normalMax: 400,
      }),
    ],
    trend_data: {
      Hemoglobin: trend(
        "Hemoglobin",
        "g/dL",
        { normalMin: 12, normalMax: 15.5 },
        { [DATE_OLDEST]: 13.1, [DATE_PRIOR]: 12.4, [DATE_LATEST]: 11.9 },
        "Gradual downward drift over the last year — worth pairing with ferritin.",
      ),
    },
  },
  {
    panel_name: "Lipid Panel",
    overview:
      "LDL cholesterol is elevated while HDL is protective. Total cholesterol is driven mostly by the LDL fraction.",
    parameters: [
      param({
        name: "Total Cholesterol",
        value: 214,
        unit: "mg/dL",
        interpretation: "high",
        referenceRange: { normalMin: 0, normalMax: 200 },
        normalMin: 0,
        normalMax: 200,
        rangeType: "UPPER_BOUND_ONLY",
      }),
      param({
        name: "LDL Cholesterol",
        value: 142,
        unit: "mg/dL",
        interpretation: "high",
        referenceRange: { normalMin: 0, normalMax: 100 },
        normalMin: 0,
        normalMax: 100,
        rangeType: "UPPER_BOUND_ONLY",
        description:
          "\"Bad\" cholesterol. Elevated values raise long-term cardiovascular risk.",
      }),
      param({
        name: "HDL Cholesterol",
        value: 58,
        unit: "mg/dL",
        interpretation: "normal",
        referenceRange: { normalMin: 40, normalMax: 100 },
        normalMin: 40,
        normalMax: 100,
        rangeType: "LOWER_BOUND_ONLY",
      }),
      param({
        name: "Triglycerides",
        value: 118,
        unit: "mg/dL",
        interpretation: "normal",
        referenceRange: { normalMin: 0, normalMax: 150 },
        normalMin: 0,
        normalMax: 150,
        rangeType: "UPPER_BOUND_ONLY",
      }),
    ],
    trend_data: {
      "LDL Cholesterol": trend(
        "LDL Cholesterol",
        "mg/dL",
        { normalMin: 0, normalMax: 100 },
        { [DATE_OLDEST]: 121, [DATE_PRIOR]: 133, [DATE_LATEST]: 142 },
        "Steady climb across three draws — trending the wrong direction.",
      ),
    },
  },
  {
    panel_name: "Metabolic Panel",
    overview:
      "Fasting glucose has crept into the pre-diabetic band. Kidney and liver markers are unremarkable.",
    parameters: [
      param({
        name: "Fasting Glucose",
        value: 104,
        unit: "mg/dL",
        interpretation: "high",
        referenceRange: { normalMin: 70, normalMax: 99 },
        normalMin: 70,
        normalMax: 99,
        description:
          "Blood sugar after fasting. 100–125 mg/dL is the pre-diabetic range.",
      }),
      param({
        name: "HbA1c",
        value: 5.7,
        unit: "%",
        interpretation: "high",
        referenceRange: { normalMin: 4, normalMax: 5.6 },
        normalMin: 4,
        normalMax: 5.6,
      }),
      param({
        name: "Creatinine",
        value: 0.82,
        unit: "mg/dL",
        interpretation: "normal",
        referenceRange: { normalMin: 0.6, normalMax: 1.1 },
        normalMin: 0.6,
        normalMax: 1.1,
      }),
      param({
        name: "ALT",
        value: 22,
        unit: "U/L",
        interpretation: "normal",
        referenceRange: { normalMin: 7, normalMax: 35 },
        normalMin: 7,
        normalMax: 35,
      }),
    ],
    trend_data: {
      "Fasting Glucose": trend(
        "Fasting Glucose",
        "mg/dL",
        { normalMin: 70, normalMax: 99 },
        { [DATE_OLDEST]: 92, [DATE_PRIOR]: 98, [DATE_LATEST]: 104 },
        "Crossed from normal into the pre-diabetic band this cycle.",
      ),
    },
  },
  {
    panel_name: "Thyroid",
    overview: "Thyroid function is balanced; TSH stable within range.",
    parameters: [
      param({
        name: "TSH",
        value: 2.1,
        unit: "mIU/L",
        interpretation: "normal",
        referenceRange: { normalMin: 0.4, normalMax: 4 },
        normalMin: 0.4,
        normalMax: 4,
      }),
      param({
        name: "Free T4",
        value: 1.2,
        unit: "ng/dL",
        interpretation: "normal",
        referenceRange: { normalMin: 0.8, normalMax: 1.8 },
        normalMin: 0.8,
        normalMax: 1.8,
      }),
    ],
    trend_data: {},
  },
  {
    panel_name: "Vitamins & Minerals",
    overview:
      "Vitamin D is deficient and ferritin is low — together these explain the borderline hemoglobin and reported fatigue.",
    parameters: [
      param({
        name: "Vitamin D, 25-OH",
        value: 18,
        unit: "ng/mL",
        interpretation: "low",
        referenceRange: { normalMin: 30, normalMax: 100 },
        normalMin: 30,
        normalMax: 100,
        description:
          "Below 20 ng/mL is considered deficient. Supports bone health, immunity, and mood.",
      }),
      param({
        name: "Ferritin",
        value: 14,
        unit: "ng/mL",
        interpretation: "low",
        referenceRange: { normalMin: 15, normalMax: 150 },
        normalMin: 15,
        normalMax: 150,
        description: "Iron storage protein. Low ferritin precedes anemia.",
      }),
      param({
        name: "Vitamin B12",
        value: 412,
        unit: "pg/mL",
        interpretation: "normal",
        referenceRange: { normalMin: 200, normalMax: 900 },
        normalMin: 200,
        normalMax: 900,
      }),
    ],
    trend_data: {
      "Vitamin D, 25-OH": trend(
        "Vitamin D, 25-OH",
        "ng/mL",
        { normalMin: 30, normalMax: 100 },
        { [DATE_PRIOR]: 24, [DATE_LATEST]: 18 },
        "Declined further since autumn — typical seasonal dip, now deficient.",
      ),
    },
  },
];

const LATEST_OVERVIEW: OverviewData = {
  narrativeSummary:
    "Most of your results look healthy. The story this panel tells is about three connected, very fixable things: low iron and vitamin D, a creeping fasting glucose, and a rising LDL cholesterol. None are emergencies, but each is trending in a direction worth acting on now.",
  identifiedPatterns: [
    {
      pattern_title: "Early iron & vitamin D depletion",
      pattern_description:
        "Ferritin and vitamin D are both below range and hemoglobin is at the low edge. This cluster commonly drives fatigue and is the most actionable finding here.",
      severity: "noticeable",
      supporting_biomarkers: ["Ferritin", "Vitamin D, 25-OH", "Hemoglobin"],
    },
    {
      pattern_title: "Glucose drifting toward pre-diabetes",
      pattern_description:
        "Fasting glucose (104) and HbA1c (5.7%) both sit just inside the pre-diabetic band. Caught this early, lifestyle changes usually reverse the trend.",
      severity: "noticeable",
      supporting_biomarkers: ["Fasting Glucose", "HbA1c"],
    },
    {
      pattern_title: "Healthy thyroid & liver function",
      pattern_description:
        "Thyroid hormones, liver enzymes, and kidney markers are all comfortably within range.",
      severity: "balanced",
      supporting_biomarkers: ["TSH", "Free T4", "ALT", "Creatinine"],
    },
  ],
  healthConsiderations: [
    {
      consideration_title: "Iron-deficiency, pre-anemia",
      explanation:
        "Low ferritin with low-normal hemoglobin suggests iron stores are being depleted faster than they are replenished. Worth confirming the cause (diet, menstrual losses, or absorption).",
    },
    {
      consideration_title: "Metabolic risk, reversible stage",
      explanation:
        "The glucose and LDL trends together point to early metabolic risk. This is the stage where diet, movement, and sleep have the largest payoff.",
    },
  ],
  stepsIntroduction:
    "A short, prioritized set of next steps based on this panel:",
  recommendedSteps: [
    {
      category: "lab_test",
      step_title: "Re-check ferritin & vitamin D in 3 months",
      rationale:
        "After starting supplementation, confirm the levels are climbing back into range.",
    },
    {
      category: "lifestyle_action",
      step_title: "Add iron-rich foods + vitamin C",
      rationale:
        "Pairing leafy greens, legumes, or red meat with vitamin C improves iron absorption.",
    },
    {
      category: "lifestyle_action",
      step_title: "Tighten refined-carb intake",
      rationale:
        "Reducing sugary drinks and refined carbohydrates is the fastest lever on fasting glucose and HbA1c.",
    },
    {
      category: "consultation",
      step_title: "Discuss lipid trend with your clinician",
      rationale:
        "LDL has risen across three draws; a clinician can decide whether monitoring or treatment is appropriate.",
    },
  ],
};

const LATEST_FOLLOWUPS: Omit<TestFollowUpsResponse, "request_id" | "test_id"> = {
  schedule: {
    days_till_followup: 90,
    timeframe_description: "In about 3 months",
    purpose_description:
      "Re-test the markers that are trending so you can confirm the changes are working before they become a bigger issue.",
    follow_up_tests: [
      { test_name: "Ferritin", test_purpose: "Confirm iron stores recovering" },
      {
        test_name: "Vitamin D, 25-OH",
        test_purpose: "Confirm levels back above 30 ng/mL",
      },
      { test_name: "HbA1c", test_purpose: "Track 3-month average glucose" },
    ],
  },
  urgent_tests: [
    {
      test_name: "Iron studies (TIBC, transferrin saturation)",
      test_purpose:
        "Pin down whether the low ferritin is from poor intake, blood loss, or absorption.",
      tier: "important",
    },
    {
      test_name: "Fasting insulin",
      test_purpose:
        "Adds context to the glucose/HbA1c trend and flags early insulin resistance.",
      tier: "recommended",
    },
  ],
};

// -----------------------------------------------------------------------------
// Prior report (2025-11) — lighter dataset, used to show a second completed row
// -----------------------------------------------------------------------------
const PRIOR_PANELS: TestParametersResponse["panels"] = [
  {
    panel_name: "Lipid Panel",
    overview: "LDL was already above target at this draw.",
    parameters: [
      param({
        name: "LDL Cholesterol",
        value: 133,
        unit: "mg/dL",
        interpretation: "high",
        referenceRange: { normalMin: 0, normalMax: 100 },
        normalMin: 0,
        normalMax: 100,
        rangeType: "UPPER_BOUND_ONLY",
      }),
      param({
        name: "HDL Cholesterol",
        value: 61,
        unit: "mg/dL",
        interpretation: "normal",
        referenceRange: { normalMin: 40, normalMax: 100 },
        normalMin: 40,
        normalMax: 100,
        rangeType: "LOWER_BOUND_ONLY",
      }),
    ],
    trend_data: {},
  },
  {
    panel_name: "Metabolic Panel",
    overview: "Glucose was high-normal at this draw.",
    parameters: [
      param({
        name: "Fasting Glucose",
        value: 98,
        unit: "mg/dL",
        interpretation: "normal",
        referenceRange: { normalMin: 70, normalMax: 99 },
        normalMin: 70,
        normalMax: 99,
      }),
    ],
    trend_data: {},
  },
];

const PRIOR_OVERVIEW: OverviewData = {
  narrativeSummary:
    "An overall healthy panel with two early watch-points: LDL cholesterol above target and fasting glucose at the top of normal. Both are worth keeping an eye on at the next draw.",
  identifiedPatterns: [
    {
      pattern_title: "LDL above target",
      pattern_description:
        "LDL cholesterol is modestly elevated. Diet and activity are the first levers.",
      severity: "noticeable",
      supporting_biomarkers: ["LDL Cholesterol"],
    },
  ],
  recommendedSteps: [
    {
      category: "monitoring",
      step_title: "Recheck lipids & glucose in ~6 months",
      rationale: "Confirm whether the early trends hold or improve.",
    },
  ],
};

const PRIOR_FOLLOWUPS: Omit<TestFollowUpsResponse, "request_id" | "test_id"> = {
  schedule: {
    days_till_followup: 180,
    timeframe_description: "In about 6 months",
    purpose_description: "Routine re-check of the lipid and glucose trends.",
    follow_up_tests: [
      { test_name: "Lipid Panel", test_purpose: "Track LDL trend" },
    ],
  },
  urgent_tests: [],
};

// -----------------------------------------------------------------------------
// Per-test registry
// -----------------------------------------------------------------------------
type TestRecord = {
  test_id: string;
  test_date: string;
  metrics: { total: number; normal: number; abnormal: number; critical: number };
  panels: TestParametersResponse["panels"];
  overview: OverviewData;
  followUps: Omit<TestFollowUpsResponse, "request_id" | "test_id">;
};

function countMetrics(
  panels: TestParametersResponse["panels"],
): TestRecord["metrics"] {
  let total = 0;
  let normal = 0;
  let abnormal = 0;
  for (const panel of panels) {
    for (const p of panel.parameters) {
      total += 1;
      if (p.interpretation === "normal") normal += 1;
      else abnormal += 1;
    }
  }
  // No critical/out-of-bounds-by-a-lot values in this demo dataset.
  return { total, normal, abnormal, critical: 0 };
}

const TESTS: Record<string, TestRecord> = {
  [TEST_LATEST]: {
    test_id: TEST_LATEST,
    test_date: DATE_LATEST,
    metrics: countMetrics(LATEST_PANELS),
    panels: LATEST_PANELS,
    overview: LATEST_OVERVIEW,
    followUps: LATEST_FOLLOWUPS,
  },
  [TEST_PRIOR]: {
    test_id: TEST_PRIOR,
    test_date: DATE_PRIOR,
    metrics: countMetrics(PRIOR_PANELS),
    panels: PRIOR_PANELS,
    overview: PRIOR_OVERVIEW,
    followUps: PRIOR_FOLLOWUPS,
  },
};

// -----------------------------------------------------------------------------
// Reports list (includes the still-processing upload)
// -----------------------------------------------------------------------------
const REPORTS: ReportListItem[] = [
  {
    test_id: TEST_PROCESSING,
    test_date: "2026-05-28",
    created_at: "2026-05-28T09:12:00.000Z",
    status: "processing",
    total_count: 0,
    normal_count: 0,
    abnormal_count: 0,
    critical_count: 0,
    headline_summary: null,
  },
  {
    test_id: TEST_LATEST,
    test_date: DATE_LATEST,
    created_at: `${DATE_LATEST}T08:30:00.000Z`,
    status: "completed",
    total_count: TESTS[TEST_LATEST].metrics.total,
    normal_count: TESTS[TEST_LATEST].metrics.normal,
    abnormal_count: TESTS[TEST_LATEST].metrics.abnormal,
    critical_count: TESTS[TEST_LATEST].metrics.critical,
    headline_summary:
      "Iron & vitamin D are low and glucose is drifting up — a few targeted, reversible changes recommended.",
  },
  {
    test_id: TEST_PRIOR,
    test_date: DATE_PRIOR,
    created_at: `${DATE_PRIOR}T10:05:00.000Z`,
    status: "completed",
    total_count: TESTS[TEST_PRIOR].metrics.total,
    normal_count: TESTS[TEST_PRIOR].metrics.normal,
    abnormal_count: TESTS[TEST_PRIOR].metrics.abnormal,
    critical_count: TESTS[TEST_PRIOR].metrics.critical,
    headline_summary: "Mostly healthy; LDL above target and glucose high-normal.",
  },
];

// -----------------------------------------------------------------------------
// Response builders consumed by the route handlers
// -----------------------------------------------------------------------------
let requestCounter = 0;
function requestId(): string {
  requestCounter += 1;
  return `req_demo_${requestCounter.toString().padStart(6, "0")}`;
}

export function patientMatches(externalPatientId: string): boolean {
  return externalPatientId === EXTERNAL_PATIENT_ID;
}

export function buildReportsResponse(): ReportsListResponse {
  return {
    request_id: requestId(),
    patient: {
      external_patient_id: PATIENT.external_patient_id,
      name: PATIENT.name,
    },
    reports: REPORTS,
  };
}

export function buildOverviewResponse(
  testId: string,
): TestOverviewResponse | null {
  const t = TESTS[testId];
  if (!t) return null;
  return {
    request_id: requestId(),
    test_id: t.test_id,
    test_date: t.test_date,
    patient: {
      name: PATIENT.name,
      birth_date: PATIENT.birth_date,
      gender: PATIENT.gender,
      weight: PATIENT.weight,
      height: PATIENT.height,
    },
    metrics: t.metrics,
    overview: t.overview,
  };
}

export function buildParametersResponse(
  testId: string,
): TestParametersResponse | null {
  const t = TESTS[testId];
  if (!t) return null;
  return {
    request_id: requestId(),
    test_id: t.test_id,
    panels: t.panels,
  };
}

export function buildFollowUpsResponse(
  testId: string,
): TestFollowUpsResponse | null {
  const t = TESTS[testId];
  if (!t) return null;
  return {
    request_id: requestId(),
    test_id: t.test_id,
    schedule: t.followUps.schedule,
    urgent_tests: t.followUps.urgent_tests,
  };
}

export function isKnownTest(testId: string): boolean {
  return Boolean(TESTS[testId]);
}
