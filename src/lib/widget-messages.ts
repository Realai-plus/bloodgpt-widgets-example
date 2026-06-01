/**
 * Extra next-intl messages for the widgets.
 *
 * @bloodgpt/widgets bundles only the `analysis` namespace, but the underlying
 * components also read from `testDetail`, `common`, and (in the edit modal)
 * `resultDescriptions`. Without these, next-intl renders the raw key paths
 * (e.g. "testDetail.allParameters"). We pass these to <BloodGPTProvider
 * messages={...}>, where they shallow-merge alongside the bundled defaults.
 *
 * Sourced verbatim from apps/patient-portal/messages/en.json in the monorepo.
 */
export const widgetMessages = {
  "testDetail": {
    "bloodTestResults": "Blood Test Results",
    "errorProcessing": "There was an error processing this test",
    "stillProcessing": "This test is still being processed",
    "downloadPdf": "Download PDF",
    "downloadLoading": "Loading...",
    "downloadFailed": "Failed to download report",
    "share": "Share",
    "linkCopied": "Copied!",
    "stopSharing": "Stop sharing",
    "disclaimer": "Disclaimer",
    "shareDisclaimerText1": "By enabling public sharing, you understand and agree that anyone who has the link will be able to view your test results. Only share the link with individuals you trust.",
    "shareDisclaimerText2": "You remain responsible for how the link is distributed and used. You can stop sharing at any time to revoke further public access; however, prior recipients may have already viewed or stored the information.",
    "iUnderstandAndContinue": "I Understand & Continue",
    "continue": "Continue",
    "remindMe": "Remind me",
    "remindMeAnyway": "Remind me anyway",
    "overdue": "overdue",
    "cancelReminder": "Cancel",
    "remind": "Remind",
    "scheduled": "Scheduled",
    "reminderSet": "Reminder set successfully",
    "reminderSetFailed": "Failed to set reminder",
    "remindRemaining": "Remind remaining",
    "reminderCancelFailed": "Failed to cancel reminder",
    "reminderTimingMissing": "Follow-up timing is unavailable for this test",
    "trendAnalysis": "Trend Analysis",
    "trend": "Trend",
    "showAbnormalOnly": "Show abnormal only",
    "allNormal": "All normal",
    "noMeasurement": "No measurement available",
    "noDescription": "No description available.",
    "loadingChart": "Loading chart...",
    "allParameters": "All Parameters",
    "abnormalParameters": "Abnormal Parameters",
    "showAll": "Show all",
    "searchBiomarkers": "Search biomarkers...",
    "sortByPanels": "By panels",
    "sortBySeverity": "By severity",
    "sortByFrequency": "By frequency",
    "sortByName": "By name",
    "sortByDate": "By date",
    "expandAll": "Expand all",
    "collapseAll": "Collapse all",
    "measurements": "{count, plural, one {# measurement} other {# measurements}}",
    "critical": "{count} critical",
    "borderline": "{count} borderline",
    "normal": "Normal",
    "groupCritical": "Critical",
    "groupBorderline": "Borderline",
    "noMatchingParams": "No parameters matching \"{query}\"",
    "noParamsAvailable": "No parameters available",
    "showingRange": "Showing {from}–{to} of {total}",
    "perPage": "{count} per page",
    "previous": "Previous",
    "next": "Next",
    "readMore": "Read more",
    "readLess": "Read less",
    "uploadedDocuments": "Uploaded documents",
    "errorLoadingDocuments": "Error loading documents",
    "errorLoadingDocument": "Error opening document",
    "unnamedFile": "Unnamed file",
    "learnMore": "Learn more",
    "provideMoreDetailsAbout": "Provide more details about {paramName}"
  },
  "common": {
    "signIn": "Sign In",
    "signOut": "Sign out",
    "loading": "Loading...",
    "error": "Something went wrong",
    "tryAgain": "Try again",
    "goHome": "Go Home",
    "pageNotFound": "Page not found",
    "notFound404": "404",
    "back": "Back",
    "total": "Total",
    "cancel": "Cancel",
    "save": "Save",
    "poweredBy": "Powered by BloodGPT",
    "patientPortal": "Patient Portal",
    "editProfile": "Edit Profile",
    "noData": "No Data"
  },
  "resultDescriptions": {
    "cancel": "Cancel",
    "save": "Save"
  }
} as const;
