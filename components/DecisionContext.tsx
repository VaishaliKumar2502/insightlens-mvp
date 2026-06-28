"use client";

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";

interface DecisionContextProps {
  onAnalyze: (data: { description: string; goal: string; constraints: string; preferences: string; criteria: string }) => void;
  loading?: boolean;
  
  uiMessage?: {
    type: "error" | "warning" | "info";
    title: string;
    description: string;
  } | null;

  analysisStatus?: string;
  retryAttempts?: number;
    hasApiKey?: boolean;
  hasUsableResearch?: boolean;
  onOpenSettings?: () => void;
  onClearMessage?: () => void;
  
}

export default function DecisionContext({
  onAnalyze,
  loading,
  uiMessage,
  analysisStatus,
  retryAttempts = 0,
    hasApiKey = false,
  hasUsableResearch = false,
    onOpenSettings,
  onClearMessage,
}: DecisionContextProps) {
  const [formData, setFormData] = useState({
    description: "",
    goal: "",
    constraints: "",
    preferences: "",
    criteria: "",
  });

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [retryCountdown, setRetryCountdown] = useState(0);
  const [canRetry, setCanRetry] = useState(true);
  const analysisSteps = [
  "Reading uploaded documents...",
  "Building research corpus...",
  "Sending research to Gemini...",
  "Analyzing evidence...",
  "Generating recommendations...",
];

const currentStepIndex = analysisSteps.findIndex(
  step => step === analysisStatus
);

const isFormValid = useMemo(() => {
  return formData.description.trim().length >= 15;
}, [formData.description]);

        const hasBlockingError = uiMessage?.type === "error";
  const isQuotaWaitError =
    hasBlockingError &&
    uiMessage?.description.toLowerCase().includes("please wait");

      const isWaitingToRetry =
  isQuotaWaitError && !canRetry;

    const recoveryTitle = retryAttempts >= 3
    ? "Update your API key to continue."
    : isQuotaWaitError
      ? "Gemini is temporarily rate-limiting this API key. Wait for the timer before retrying."
      : hasBlockingError
        ? "Review the message, then try again."
        : uiMessage?.type === "warning"
          ? "Update the highlighted requirement, then continue."
          : "";

    const recoveryActionText = retryAttempts >= 3
    ? "Open API Settings"
    : hasBlockingError && !isQuotaWaitError
      ? "Try Again"
      : "";

  const showRecoveryAction = Boolean(recoveryActionText);

  const buttonText = loading
    ? "Analyzing Research..."
    : !hasApiKey
      ? "Configure API Key"
      : retryAttempts >= 3
        ? "Update API Key"
        : !hasUsableResearch
          ? "Select Research First"
          : !isFormValid
            ? "Describe Your Decision"
                        : isQuotaWaitError && retryCountdown > 0
              ? `Retry Available in ${retryCountdown}s`
              : hasBlockingError
                ? "Try Again"
                : "Analyze Research";

    const buttonDisabled =
    loading ||
    !hasUsableResearch ||
    !isFormValid ||
    isWaitingToRetry;

  const buttonClassName =
    !hasApiKey || retryAttempts >= 3
      ? "bg-amber-600 hover:bg-amber-700 text-white"
      : !buttonDisabled
        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
        : "bg-slate-200 text-slate-400 cursor-not-allowed";

    const updateField = (field: keyof typeof formData, value: string) => {
    if (uiMessage && !loading) {
      onClearMessage?.();
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
  // Reset the scroll position of the workspace
  const scrollContainer = document.querySelector(
    "[data-workspace-scroll]"
  ) as HTMLElement | null;

  scrollContainer?.scrollTo({
    top: 0,
    behavior: "instant" as ScrollBehavior,
  });

  // Focus the first field after the scroll has been reset
  const timer = setTimeout(() => {
    descriptionRef.current?.focus();
  }, 50);

  return () => clearTimeout(timer);
}, []);


useEffect(() => {
  if (
    uiMessage?.type !== "error" ||
    !uiMessage.description.includes("Please wait")
  ) {
    setRetryCountdown(0);
    setCanRetry(true);
    return;
  }

  const match = uiMessage.description.match(/(\d+)\s*seconds?/i);

  if (!match) {
    return;
  }

  const seconds = Number(match[1]);

  setRetryCountdown(seconds);
  setCanRetry(false);

  const timer = setInterval(() => {
    setRetryCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        setCanRetry(true);
        return 0;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);

}, [uiMessage]);

  const fields = [
  {
    id: "description",
    label: "What decision are you trying to make? *",
    required: true,
    placeholder:
      "Please describe an actual decision (at least 15 characters). \nExample: Should our company expand into the UAE market or strengthen our presence in India first?.",
  },
  {
    id: "goal",
    label: "Goal",
    required: false,
    placeholder:
      "Example: Maximize long-term revenue while minimizing operational risk.",
  },
  {
    id: "constraints",
    label: "Constraints",
    required: false,
    placeholder:
      "Example: Budget under $100k, launch within 6 months, team of 5 engineers.",
  },
  {
    id: "preferences",
    label: "Preferences",
    required: false,
    placeholder:
      "Example: Prioritize evidence-backed recommendations and clearly explain trade-offs.",
  },
  {
    id: "criteria",
    label: "Decision Criteria",
    required: false,
    placeholder:
      "Example: Cost, ROI, implementation effort, scalability, and customer impact.",
  },
] as const;

  return (
    <div className="max-w-3xl mx-auto w-full p-8 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
  <h1 className="text-4xl font-bold tracking-tight text-slate-900">
    Tell us about your decision
  </h1>

  <p className="mt-3 max-w-2xl mx-auto text-lg leading-8 text-slate-500">
    Start by describing the decision you're trying to make. Add goals or constraints only if they matter. They help generate more focused recommendations. We'll use your uploaded research to analyze this decision.
  </p>

</div>

      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="
block
text-[20px]
font-semibold
text-slate-900
mb-3
tracking-[-0.01em]
">
    {field.label}

    {!field.required && (
        <span className="ml-2 text-xs font-normal text-slate-400">
            (Optional)
        </span>
    )}
</label>
            <textarea disabled={loading}
            ref={field.id === "description" ? descriptionRef : undefined}
    rows={4}
    className="
        w-full
        p-4
        border
        border-slate-200
        rounded-xl
        bg-white
        resize-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-blue-500
        transition-all
        outline-none
        placeholder:text-slate-400
    "
              placeholder={field.placeholder}
              value={formData[field.id]}
              onChange={(e) => updateField(field.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      {uiMessage && (
  <div
    className={`mb-8 rounded-2xl border p-6 transition-all ${
      uiMessage.type === "error"
        ? "border-red-200 bg-red-50"
        : uiMessage.type === "warning"
        ? "border-amber-200 bg-amber-50"
        : "border-blue-200 bg-blue-50"
    }`}
  >
    <div className="flex items-start gap-4">

      <div className="mt-1 text-2xl">
        {uiMessage.type === "error" ? "⚠️" : "ℹ️"}
      </div>

      <div className="flex-1">

        <h3 className="text-lg font-semibold text-slate-900">
          {uiMessage.title}
        </h3>

        <p className="mt-2 leading-7 text-slate-600">
          {uiMessage.description}
        </p>

        {retryCountdown > 0 && (
          <div className="mt-5 inline-flex rounded-full bg-red-100 px-4 py-2">

            <span className="font-medium text-red-700">
              Retry available in {retryCountdown}s
            </span>

          </div>
        )}

                {recoveryTitle && (
          <div className="mt-5 rounded-xl border border-white/70 bg-white/60 p-4">
            <p className="text-sm font-semibold text-slate-900">
              What to do next
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              {recoveryTitle}
            </p>

            {showRecoveryAction && (
              <button
                onClick={() => {
                  if (retryAttempts >= 3) {
                    onOpenSettings?.();
                    return;
                  }

                  if (!isWaitingToRetry) {
                    onAnalyze(formData);
                  }
                }}
                className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {recoveryActionText}
              </button>
            )}
          </div>
        )}

        <p className="mt-5 text-sm text-slate-500">
          Your uploaded documents and decision details are safe. You do not need to upload them again.
        </p>

      </div>

    </div>
  </div>
)}

      <div className="mt-10 pb-10">

        {loading && (
  <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">

    <div className="flex items-start gap-4">

      <div className="mt-1">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
      </div>

      <div className="flex-1">

        <h3 className="text-lg font-semibold text-slate-900">
          Analyzing your research
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          We're reviewing your uploaded documents and generating evidence-backed recommendations.
        </p>

        <div className="mt-6 space-y-4">

          {analysisSteps.map((step, index) => {

            const completed = index < currentStepIndex;
            const current = index === currentStepIndex;

            return (

              <div
                key={step}
                className="flex items-center gap-3"
              >

                {/* Icon */}

                {completed ? (

                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold">
                    ✓
                  </div>

                ) : current ? (

                  <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />

                ) : (

                  <div className="h-6 w-6 rounded-full border-2 border-slate-300" />

                )}

                <span
                  className={`text-sm ${
                    completed
                      ? "text-green-700 font-medium"
                      : current
                      ? "text-blue-700 font-semibold"
                      : "text-slate-400"
                  }`}
                >
                  {step}
                </span>

              </div>

            );

          })}

        </div>

        <div className="mt-6 rounded-xl bg-white border border-blue-100 p-4">

          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Current Activity
          </p>

          <p className="mt-2 text-sm font-medium text-slate-800">
            {analysisStatus}
          </p>

        </div>

        <p className="mt-6 text-xs leading-6 text-slate-500">
          This usually takes <strong>30–60 seconds</strong> depending on the number and size of your uploaded documents.
        </p>

      </div>

    </div>

  </div>
)}


    <button
    onClick={() => {
                  if (!hasApiKey || retryAttempts >= 3) {
        onOpenSettings?.();
        return;
      }

      if (buttonDisabled) {
        return;
      }

      onAnalyze(formData);
    }}
    disabled={buttonDisabled}
    className={`w-full py-4 rounded-xl font-bold text-lg transition-all disabled:cursor-not-allowed disabled:opacity-90 ${buttonClassName}`}
  >
    {buttonText}
  </button>
</div>
    </div>
  );
}