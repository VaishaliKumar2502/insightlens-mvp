"use client";

import React from "react";
import jsPDF from "jspdf";
import {
    ShieldAlert,
    FileText,
    Sparkles,
    Layers3,
    BadgeCheck,
    TriangleAlert,
    ArrowRightCircle,
    Gauge,
    Database,
    ListChecks,
    Brain,
    GitBranch,
    Download
} from "lucide-react";

interface ResultsScreenProps {
  analysisResult: {
  decision: string;

  recommendation?: {
    decision: string;
    reason: string;
  };

  decisionBrief?: {
    finalDecision: string;
    rationale: string;
    confidence: string;
    evidenceSummary: string;
    riskSummary: string;
    nextBestAction: string;
  };

  decisionChangers?: {
    missingInformation: string;
    whyItCouldChangeDecision: string;
    recommendedAction: string;
    priority: "High" | "Medium" | "Low";
  }[];

    risks?: {
    risk: string;
    whyItMatters: string;
    severity: "High" | "Medium" | "Low";
  }[];

  contradictions?: {
    issue: string;
    explanation: string;
    sources: string[];
  }[];

  alternatives?: {
    option: string;
    tradeoff: string;
  }[];

  researchReadiness: {
    confidence: string;
    canRecommend: boolean;
    reason: string;
  };

  evidenceFound: any[];
  evidenceMissing: any[];

  recommendedNextSteps: {
  action: string;
  reason: string;
}[];

  executiveSummary: string;

  majorThemes: any[];

  supportingEvidence: any[];
} | null;
  onBack: () => void;
}

// Helper to safely render unknown values without crashing or showing [object Object]
const getSafeString = (val: any): string => {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  
  if (typeof val === "object") {
    // Try to find common text fields AI might generate in objects
    const possibleText =
    val.reasoning ||
    val.value ||
    val.finding ||
    val.summary ||
    val.description ||
    val.content ||
    val.text ||
    val.reason ||
    val.title ||
    val.field ||
    val.name ||
    val.theme ||
    val.evidence;
      
    if (possibleText && typeof possibleText === "string") {
      return possibleText;
    }
    // Fallback to JSON string if no standard keys exist
    // Handle structured AI objects
if (
  typeof val.assumption === "string" &&
  typeof val.impact === "string"
) {
  return `${val.assumption}\n${val.impact}`;
}

// Generic fallback
return "";
  }
  return String(val);
};

type CardTitleProps = {
    icon: React.ReactNode;
    title: string;
};

function CardTitle({ icon, title }: CardTitleProps) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                {icon}
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                {title}
            </h2>
        </div>
    );
}

const getWhyThisMatters = (field: string) => {
    const normalizedField = field.toLowerCase();

    if (normalizedField.includes("salary") || normalizedField.includes("compensation")) {
        return "This matters because compensation is one of the core facts needed to evaluate the offer.";
    }

    if (normalizedField.includes("benefit")) {
        return "This matters because benefits can materially change the total value of the agreement.";
    }

    if (normalizedField.includes("termination") || normalizedField.includes("notice")) {
        return "This matters because termination terms affect risk, flexibility, and future obligations.";
    }

    if (normalizedField.includes("confidential")) {
        return "This matters because confidentiality obligations can affect what the employee can share or do after joining.";
    }

    if (normalizedField.includes("role") || normalizedField.includes("position") || normalizedField.includes("responsibil")) {
        return "This matters because the role scope helps confirm what the employee is actually agreeing to do.";
    }

    if (normalizedField.includes("employer") || normalizedField.includes("employee") || normalizedField.includes("name")) {
        return "This matters because the agreement must clearly identify the parties involved.";
    }

    if (normalizedField.includes("date") || normalizedField.includes("start")) {
        return "This matters because timing affects employment start, obligations, and planning.";
    }

    return "This matters because it is a document-supported fact that helps evaluate the decision.";
};

const getEvidenceField = (item: any, index: number) => {
    return getSafeString(
        item?.field ||
        item?.title ||
        item?.label ||
        item?.name ||
        `Finding ${index + 1}`
    );
};

const getEvidenceValue = (item: any) => {
    return getSafeString(
        item?.value ||
        item?.description ||
        item?.content ||
        item?.text
    );
};

const getEvidenceSource = (item: any) => {
    return getSafeString(
        item?.source ||
        item?.document ||
        item?.file ||
        item?.filename
    );
};

const getSupportingEvidenceText = (item: any) => {
    return getSafeString(
        item?.reasoning ||
        item?.summary ||
        item?.description ||
        item?.text ||
        item
    );
};

const getSupportingEvidenceDocuments = (item: any) => {
    if (Array.isArray(item?.documents)) {
        return item.documents.map(getSafeString).filter(Boolean);
    }

    const source = getSafeString(item?.source || item?.document || item?.file || item?.filename);

    return source ? [source] : [];
};

function calculateResearchReadiness(
    evidenceFound: number,
    evidenceMissing: number
) {
    const total = evidenceFound + evidenceMissing;

    if (total === 0) {
        return 0;
    }

    return Math.round((evidenceFound / total) * 100);
}

type ResearchGap = {
    assumption: string;
    impact: string;
};

export default function ResultsScreen({ analysisResult, onBack }: ResultsScreenProps) {
  // Graceful fallbacks for missing analysisResult payloads
  const confidence = analysisResult?.researchReadiness?.confidence ?? "Low";
    const decisionBrief = {
    finalDecision:
      analysisResult?.decisionBrief?.finalDecision ||
      analysisResult?.recommendation?.decision ||
      "Recommendation unavailable",
    rationale:
      analysisResult?.decisionBrief?.rationale ||
      analysisResult?.recommendation?.reason ||
      analysisResult?.researchReadiness?.reason ||
      "",
    confidence:
      analysisResult?.decisionBrief?.confidence ||
      analysisResult?.researchReadiness?.confidence ||
      "Low",
    evidenceSummary:
      analysisResult?.decisionBrief?.evidenceSummary ||
      analysisResult?.executiveSummary ||
      "",
    riskSummary:
      analysisResult?.decisionBrief?.riskSummary ||
      "",
    nextBestAction:
      analysisResult?.decisionBrief?.nextBestAction ||
      "",
  };
  const canRecommend = analysisResult?.researchReadiness?.canRecommend === true;

  const isLowConfidence = confidence === "Low";

const showRecommendation =
  canRecommend;

  const confidenceBadge = {
    High: { label: "🟢 High", className: "bg-green-100 text-green-700" },
    Medium: { label: "🟡 Medium", className: "bg-yellow-100 text-yellow-700" },
    Low: { label: "🔴 Low", className: "bg-red-100 text-red-700" },
  }[confidence] ?? { label: "🔴 Low", className: "bg-red-100 text-red-700" };


  const readinessStatus = canRecommend
    ? confidence === "High"
      ? {
          label: "Ready",
          className: "border-green-200 bg-green-50 text-green-700",
          description: "The uploaded research is strong enough to support a recommendation.",
        }
      : {
          label: "Ready with assumptions",
          className: "border-amber-200 bg-amber-50 text-amber-700",
          description: "The uploaded research supports a recommendation, but some uncertainty remains.",
        }
    : {
        label: "More research required",
        className: "border-red-200 bg-red-50 text-red-700",
        description: "Important information is missing, so the recommendation should wait.",
      };

  // Safe array extractions
  const evidenceFound = Array.isArray(analysisResult?.evidenceFound) ? analysisResult.evidenceFound : [];
  const evidenceMissing = Array.isArray(analysisResult?.evidenceMissing) ? analysisResult.evidenceMissing : [];
      const decisionChangers = Array.isArray(analysisResult?.decisionChangers)
    ? analysisResult.decisionChangers
        .map((item: any) => ({
          missingInformation: getSafeString(item?.missingInformation),
          whyItCouldChangeDecision: getSafeString(item?.whyItCouldChangeDecision),
          recommendedAction: getSafeString(item?.recommendedAction),
          priority: ["High", "Medium", "Low"].includes(item?.priority)
            ? item.priority
            : "Low",
        }))
        .filter((item: any) => item.missingInformation)
    : [];

      const risks = Array.isArray(analysisResult?.risks)
    ? analysisResult.risks
        .map((item: any) => ({
          risk: getSafeString(item?.risk),
          whyItMatters: getSafeString(item?.whyItMatters),
          severity: ["High", "Medium", "Low"].includes(item?.severity)
            ? item.severity
            : "Low",
        }))
        .filter((item: any) => item.risk)
    : [];

  const contradictions = Array.isArray(analysisResult?.contradictions)
    ? analysisResult.contradictions
        .map((item: any) => ({
          issue: getSafeString(item?.issue),
          explanation: getSafeString(item?.explanation),
          sources: Array.isArray(item?.sources)
            ? item.sources.map(getSafeString).filter(Boolean)
            : [],
        }))
        .filter((item: any) => item.issue)
    : [];

  const alternatives = Array.isArray(analysisResult?.alternatives)
    ? analysisResult.alternatives
        .map((item: any) => ({
          option: getSafeString(item?.option),
          tradeoff: getSafeString(item?.tradeoff),
        }))
        .filter((item: any) => item.option)
    : [];


    const keyFindings = evidenceFound
    .map((item: any, index: number) => {
        const title = getEvidenceField(item, index);
        const value = getEvidenceValue(item);
        const source = getEvidenceSource(item);

        return {
            title,
            value,
            source,
            whyItMatters: getWhyThisMatters(title),
        };
    })
    .filter((finding) => finding.title && finding.value);
  const majorThemes = Array.isArray(analysisResult?.majorThemes) ? analysisResult.majorThemes : [];

  const normalizedAnalysis = {
    recommendation: analysisResult?.recommendation,
    executiveSummary: analysisResult?.executiveSummary ?? "",

    majorThemes: Array.isArray(analysisResult?.majorThemes)
        ? analysisResult.majorThemes
        : [],

    supportingEvidence: Array.isArray(analysisResult?.supportingEvidence)
        ? analysisResult.supportingEvidence
        : [],

    evidenceFound: Array.isArray(analysisResult?.evidenceFound)
        ? analysisResult.evidenceFound
        : [],

    evidenceMissing: Array.isArray(analysisResult?.evidenceMissing)
        ? analysisResult.evidenceMissing
        : [],

    recommendedNextSteps: Array.isArray(
        analysisResult?.recommendedNextSteps
    )
        ? analysisResult.recommendedNextSteps
        : [],
};

const supportingEvidence = normalizedAnalysis.supportingEvidence
    .map((item: any) => {
        const text = getSupportingEvidenceText(item).trim();
        const documents = getSupportingEvidenceDocuments(item);

        return {
            text,
            documents,
        };
    })
    .filter((item) => {
        const text = item.text.toLowerCase();

        return (
            item.text.length > 3 &&
            item.text !== "." &&
            item.text !== "-" &&
            text !== "n/a" &&
            !text.includes("additional information") &&
            !text.includes("missing") &&
            !text.includes("not found")
        );
    });

const uniqueSupportingEvidence = supportingEvidence.filter(
    (item, index, self) =>
        index === self.findIndex((other) => other.text === item.text)
);

const uniqueMissingEvidence = normalizedAnalysis.evidenceMissing.filter(
  (item) => {
    if (typeof item === "string") {
      return item.trim().length > 0;
    }

    return item != null;
  }
);


const groupedFindingList = keyFindings;

const evidenceCount = Math.max(
    uniqueSupportingEvidence.length,
    groupedFindingList.length,
    analysisResult?.evidenceFound?.length ?? 0
);

const researchReadiness = calculateResearchReadiness(
    evidenceCount,
    uniqueMissingEvidence.length
);

const readinessReason =
    analysisResult?.researchReadiness?.reason ||
    readinessStatus.description;

const foundCount = evidenceFound.length;
const missingCount = uniqueMissingEvidence.length;

const getDecisionChangerPriorityClass = (priority: string) => {
    switch (priority) {
        case "High":
            return "border-red-200 bg-red-50 text-red-700";
        case "Medium":
            return "border-amber-200 bg-amber-50 text-amber-700";
        default:
            return "border-blue-200 bg-blue-50 text-blue-700";
    }
};

const getSeverityClass = (severity: string) => {
    switch (severity) {
        case "High":
            return "border-red-200 bg-red-50 text-red-700";
        case "Medium":
            return "border-amber-200 bg-amber-50 text-amber-700";
        default:
            return "border-blue-200 bg-blue-50 text-blue-700";
    }
};

    const recommendedNextSteps = decisionChangers.length > 0
    ? decisionChangers
        .filter((item: any) => item.recommendedAction)
        .map((item: any) => ({
          action: item.recommendedAction,
          reason: item.whyItCouldChangeDecision,
        }))
    : Array.isArray(analysisResult?.recommendedNextSteps)
      ? analysisResult.recommendedNextSteps
      : [];


      const showNextActions =
  !canRecommend ||
  isLowConfidence ||
  decisionChangers.length > 0 ||
  recommendedNextSteps.length > 0;

  const recommendationStatus:
  | "READY"
  | "READY_WITH_ASSUMPTIONS"
  | "MORE_RESEARCH_REQUIRED" =
  canRecommend
    ? confidence === "High"
      ? "READY"
      : "READY_WITH_ASSUMPTIONS"
    : "MORE_RESEARCH_REQUIRED";

      const exportDecisionBriefPdf = () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 48;
    const contentWidth = pageWidth - margin * 2;
    let y = 54;

    const generatedAt = new Date().toLocaleString();

    const addPageIfNeeded = (neededHeight = 80) => {
      if (y + neededHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
    };

    const addText = (
      text: string,
      options: {
        size?: number;
        style?: "normal" | "bold";
        color?: [number, number, number];
        gapAfter?: number;
        lineHeight?: number;
      } = {}
    ) => {
      const {
        size = 10,
        style = "normal",
        color = [51, 65, 85],
        gapAfter = 10,
        lineHeight = size + 5,
      } = options;

      if (!text) return;

      pdf.setFont("helvetica", style);
      pdf.setFontSize(size);
      pdf.setTextColor(...color);

      const lines = pdf.splitTextToSize(text, contentWidth);
      addPageIfNeeded(lines.length * lineHeight + gapAfter);

      pdf.text(lines, margin, y);
      y += lines.length * lineHeight + gapAfter;
    };

    const addSectionTitle = (title: string) => {
      addPageIfNeeded(60);
      y += 8;
      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 24;

      addText(title, {
        size: 15,
        style: "bold",
        color: [15, 23, 42],
        gapAfter: 14,
      });
    };

    const addLabelValue = (label: string, value: string) => {
      if (!value) return;

      addText(label, {
        size: 9,
        style: "bold",
        color: [71, 85, 105],
        gapAfter: 4,
      });

      addText(value, {
        size: 10.5,
        color: [30, 41, 59],
        gapAfter: 12,
      });
    };

    const addBullet = (title: string, body?: string) => {
      const text = body ? `${title}: ${body}` : title;
      addText(`• ${text}`, {
        size: 10,
        color: [51, 65, 85],
        gapAfter: 8,
      });
    };

    pdf.setFillColor(37, 99, 235);
    pdf.rect(0, 0, pageWidth, 92, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("InsightLens Decision Brief", margin, 42);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(`Generated ${generatedAt}`, margin, 64);

    y = 126;

    addSectionTitle("Decision Brief");
    addLabelValue("Final Decision", decisionBrief.finalDecision);
    addLabelValue("Rationale", decisionBrief.rationale);
    addLabelValue("Confidence", decisionBrief.confidence);
    addLabelValue("Evidence Summary", decisionBrief.evidenceSummary);
    addLabelValue("Remaining Risk", decisionBrief.riskSummary);
    addLabelValue("Next Best Action", decisionBrief.nextBestAction);

    if (analysisResult?.executiveSummary) {
      addSectionTitle("Analysis Summary");
      addText(analysisResult.executiveSummary, {
        size: 10.5,
        lineHeight: 16,
      });
    }

    addSectionTitle("Research Readiness");
    addLabelValue("Status", readinessStatus.label);
    addLabelValue("Reason", readinessReason);
    addLabelValue("Coverage", `${researchReadiness}%`);
    addLabelValue("Evidence Found", String(foundCount));
    addLabelValue("Evidence Missing", String(missingCount));

    addSectionTitle("What Could Change This Decision?");
    if (decisionChangers.length > 0) {
      decisionChangers.forEach((item: any) => {
        addBullet(
          `${item.priority || "Low"} impact - ${item.missingInformation}`,
          item.whyItCouldChangeDecision
        );

        if (item.recommendedAction) {
          addText(`Recommended action: ${item.recommendedAction}`, {
            size: 9.5,
            color: [30, 64, 175],
            gapAfter: 10,
          });
        }
      });
    } else {
      addText("No decision-changing gaps were detected from the uploaded research.");
    }

    addSectionTitle("Risks");
    if (risks.length > 0) {
      risks.forEach((item: any) => {
        addBullet(`${item.severity || "Low"} risk - ${item.risk}`, item.whyItMatters);
      });
    } else {
      addText("No material risks were identified from the uploaded research.");
    }

    addSectionTitle("Contradictions");
    if (contradictions.length > 0) {
      contradictions.forEach((item: any) => {
        addBullet(item.issue, item.explanation);

        if (item.sources.length > 0) {
          addText(`Sources: ${item.sources.join(", ")}`, {
            size: 9.5,
            color: [71, 85, 105],
            gapAfter: 10,
          });
        }
      });
    } else {
      addText("No contradictions were found across the uploaded research.");
    }

    addSectionTitle("Alternatives");
    if (alternatives.length > 0) {
      alternatives.forEach((item: any) => {
        addBullet(item.option, item.tradeoff);
      });
    } else {
      addText("No stronger alternative action was identified from the uploaded research.");
    }

    addSectionTitle("Recommended Next Steps");
    if (recommendedNextSteps.length > 0) {
      recommendedNextSteps.forEach((step: any) => {
        addBullet(step.action, step.reason);
      });
    } else {
      addText("No urgent follow-up action was identified from the uploaded research.");
    }

    addSectionTitle("Key Findings");
    if (groupedFindingList.length > 0) {
      groupedFindingList.forEach((finding: any) => {
        addLabelValue(finding.title, finding.value);

        if (finding.whyItMatters) {
          addText(`Why this matters: ${finding.whyItMatters}`, {
            size: 9.5,
            color: [71, 85, 105],
            gapAfter: 8,
          });
        }

        if (finding.source) {
          addText(`Source: ${finding.source}`, {
            size: 9.5,
            color: [71, 85, 105],
            gapAfter: 12,
          });
        }
      });
    } else {
      addText("No key findings were extracted.");
    }

    addSectionTitle("Major Themes");
    if (majorThemes.length > 0) {
      addText(majorThemes.map(getSafeString).filter(Boolean).join(", "));
    } else {
      addText("No major themes were identified.");
    }

    addSectionTitle("Supporting Evidence");
    if (uniqueSupportingEvidence.length > 0) {
      uniqueSupportingEvidence.forEach((item: any) => {
        addBullet(item.text);

        if (item.documents.length > 0) {
          addText(`Documents: ${item.documents.join(", ")}`, {
            size: 9.5,
            color: [71, 85, 105],
            gapAfter: 10,
          });
        }
      });
    } else {
      addText("No direct supporting evidence was extracted.");
    }

    addSectionTitle("Other Missing Evidence");
    if (uniqueMissingEvidence.length > 0) {
      uniqueMissingEvidence.forEach((item: any) => {
        const gap = {
          assumption:
            typeof item === "string"
              ? item
              : item.assumption ||
                item.title ||
                item.reason ||
                getSafeString(item),
          impact:
            typeof item === "string"
              ? ""
              : item.impact ||
                item.description ||
                item.details ||
                "",
        };

        addBullet(gap.assumption, gap.impact);
      });
    } else {
      addText("No significant remaining research gaps were detected.");
    }

    const pageCount = pdf.getNumberOfPages();

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      pdf.setPage(pageNumber);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        `InsightLens Decision Brief • Page ${pageNumber} of ${pageCount}`,
        margin,
        pageHeight - 24
      );
    }

        const filenameDate = new Date().toISOString().slice(0, 10);
    const decisionSlug = getSafeString(analysisResult?.decision || decisionBrief.finalDecision)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 48);

    pdf.save(
      `insightlens-decision-brief-${decisionSlug || "analysis"}-${filenameDate}.pdf`
    );
  };

  const recommendationStyles = {
  READY: {
    border: "border-green-200",
    bg: "bg-green-50",
    label: "text-green-700",
    title: "text-green-900",
  },

  READY_WITH_ASSUMPTIONS: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    label: "text-amber-700",
    title: "text-amber-900",
  },

  MORE_RESEARCH_REQUIRED: {
    border: "border-red-200",
    bg: "bg-red-50",
    label: "text-red-700",
    title: "text-red-900",
  },
};

  return (
    <div className="p-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h2 className="text-5xl font-bold tracking-tight">Analysis Results</h2>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportDecisionBriefPdf}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>

          <button
            onClick={onBack}
            className="text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            ← Back to Decision
          </button>
        </div>
      </div>

            <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
        Export includes the decision brief, readiness score, key findings, supporting evidence, missing information, risks, contradictions, alternatives, and recommended next steps.
      </div>

      <div className="space-y-8">
        
        { }

                <div className={`rounded-2xl border p-6 mb-5
${recommendationStyles[recommendationStatus].border}
${recommendationStyles[recommendationStatus].bg}`}>

          <CardTitle
            icon={<FileText className="h-5 w-5" />}
            title="Decision Brief"
          />

          <div className="rounded-xl bg-white/70 border border-white p-5">
            <p className={`text-sm font-semibold uppercase tracking-wide ${recommendationStyles[recommendationStatus].label}`}>
              Final Decision
            </p>

            <h2 className={`mt-2 text-3xl font-bold ${recommendationStyles[recommendationStatus].title}`}>
              {decisionBrief.finalDecision}
            </h2>

            {decisionBrief.rationale && (
              <p className="mt-4 text-lg leading-8 text-slate-700">
                {decisionBrief.rationale}
              </p>
            )}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-white/70 border border-white p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Confidence
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {decisionBrief.confidence}
              </p>
            </div>

            <div className="rounded-xl bg-white/70 border border-white p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Next Best Action
              </p>

              <p className="mt-2 leading-7 text-slate-700">
                {decisionBrief.nextBestAction ||
  (decisionChangers.length > 0
    ? "Review the decision-changing gaps below before proceeding."
    : "Review the evidence below, then proceed based on the recommendation.")}
              </p>
            </div>
          </div>

          {(decisionBrief.evidenceSummary || decisionBrief.riskSummary) && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {decisionBrief.evidenceSummary && (
                <div className="rounded-xl bg-white/70 border border-white p-5">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Evidence Summary
                  </p>

                  <p className="mt-2 leading-7 text-slate-700">
                    {decisionBrief.evidenceSummary}
                  </p>
                </div>
              )}

              {decisionBrief.riskSummary && (
                <div className="rounded-xl bg-white/70 border border-white p-5">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Remaining Risk
                  </p>

                  <p className="mt-2 leading-7 text-slate-700">
                    {decisionBrief.riskSummary}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {analysisResult?.executiveSummary && (
  <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm mb-8">

      <CardTitle
    icon={<FileText className="h-5 w-5" />}
    title="Analysis Summary"
/>

    <p className="text-lg leading-8 text-slate-700">
      {analysisResult.executiveSummary}
    </p>
  </div>
)}

        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <CardTitle
            icon={<Gauge className="h-5 w-5" />}
            title="Research Readiness"
          />

          <div className="space-y-6">
            <div className={`rounded-xl border p-4 ${readinessStatus.className}`}>
              <p className="text-sm font-semibold uppercase tracking-wide">
                {readinessStatus.label}
              </p>

              <p className="mt-2 text-base leading-7 text-slate-700">
                {readinessReason}
              </p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Research Coverage
                </span>

                <span className="text-lg font-semibold text-slate-900">
                  {researchReadiness}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${researchReadiness}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Confidence
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {confidence}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Evidence Found
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {foundCount}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Evidence Missing
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {missingCount}
                </p>
              </div>
            </div>
          </div>
        </section>

                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <CardTitle
            icon={<GitBranch className="h-5 w-5" />}
            title="What Could Change This Decision?"
          />

          {decisionChangers.length > 0 ? (
            <div className="space-y-4">
              <p className="text-slate-600 leading-7">
                These are the missing pieces of information that could realistically change the recommendation.
              </p>

              {decisionChangers.map((item: any, index: number) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.missingInformation}
                    </h3>

                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDecisionChangerPriorityClass(item.priority)}`}>
                      {item.priority || "Low"} impact
                    </span>
                  </div>

                  {item.whyItCouldChangeDecision && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-slate-500">
                        Why it could change the decision
                      </p>

                      <p className="mt-1 leading-7 text-slate-700">
                        {item.whyItCouldChangeDecision}
                      </p>
                    </div>
                  )}

                  {item.recommendedAction && (
                    <div className="mt-4 rounded-xl border border-blue-100 bg-white p-4">
                      <p className="text-sm font-semibold text-blue-900">
                        Recommended action
                      </p>

                      <p className="mt-1 leading-7 text-blue-800">
                        {item.recommendedAction}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <p className="font-semibold text-green-800">
                No decision-changing gaps detected.
              </p>

              <p className="mt-2 leading-7 text-green-700">
                Based on the uploaded research, no missing information was identified that would likely change the recommendation.
              </p>
            </div>
          )}
        </section>

                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <CardTitle
            icon={<TriangleAlert className="h-5 w-5" />}
            title="Risks, Contradictions & Alternatives"
          />

          <div className="grid gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Risks
              </h3>

              {risks.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {risks.map((item: any, index: number) => (
                    <div key={index} className="rounded-xl border border-white bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <p className="font-medium text-slate-900">
                          {item.risk}
                        </p>

                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getSeverityClass(item.severity)}`}>
                          {item.severity} risk
                        </span>
                      </div>

                      {item.whyItMatters && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.whyItMatters}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-slate-500 italic">
                  No material risks were identified from the uploaded research.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Contradictions
              </h3>

              {contradictions.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {contradictions.map((item: any, index: number) => (
                    <div key={index} className="rounded-xl border border-amber-100 bg-white p-4">
                      <p className="font-medium text-slate-900">
                        {item.issue}
                      </p>

                      {item.explanation && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.explanation}
                        </p>
                      )}

                      {item.sources.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.sources.map((source: string, sourceIndex: number) => (
                            <span
                              key={sourceIndex}
                              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-slate-500 italic">
                  No contradictions were found across the uploaded research.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Alternatives
              </h3>

              {alternatives.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {alternatives.map((item: any, index: number) => (
                    <div key={index} className="rounded-xl border border-blue-100 bg-white p-4">
                      <p className="font-medium text-slate-900">
                        {item.option}
                      </p>

                      {item.tradeoff && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.tradeoff}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-slate-500 italic">
                  No stronger alternative action was identified from the uploaded research.
                </p>
              )}
            </div>
          </div>
        </section>

        {}
        {showNextActions && (
          <section className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <CardTitle
    icon={<ListChecks className="h-5 w-5" />}
    title="Recommended Next Steps"
/>
            </div>
            
            <p className="text-slate-700 mb-5 font-medium">
              {decisionChangers.length > 0
                ? "Start with the actions most likely to confirm or change the recommendation."
                : "To reach a more confident decision, complete the highest-value follow-up actions below."}
            </p>

            {recommendedNextSteps.length > 0 ? (
  <ul className="space-y-3 mb-6">
    {recommendedNextSteps.map((step, index) => (
      <li
        key={index}
        className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-white/60 p-4 shadow-sm"
      >
        <span className="mt-1 text-blue-600">📄</span>

        <div>
          <p className="font-medium text-slate-900">
            {step.action}
          </p>

          {step.reason && (
            <p className="mt-1 text-sm text-slate-600">
              {step.reason}
            </p>
          )}
        </div>
      </li>
    ))}
  </ul>
) : (
    <div className="rounded-2xl border border-blue-100 bg-white/60 p-4">
    <p className="italic text-slate-600">
      No urgent follow-up action was identified from the uploaded research. Review the decision brief and supporting evidence before proceeding.
    </p>
  </div>
)}

            <button
  onClick={onBack}
  className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition shadow-sm w-full sm:w-auto"
>
  {decisionChangers.length > 0 ? "Add Missing Information" : "Upload More Research"}
</button>
          </section>
        )}

        {}

            <section>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <CardTitle
    icon={< Sparkles className="h-5 w-5" />}
    title="Key Findings"
/>
                {keyFindings.length > 0 ? (
                  <div className="space-y-4">
                    {groupedFindingList.map((finding: any, index) => (
    <div
        key={index}
        className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
    >
        <h3 className="text-xl font-semibold text-slate-900">
            {finding.title}
        </h3>

        <p className="mt-3 text-lg leading-8 text-slate-700">
            {finding.value}
        </p>

        <div className="mt-5 rounded-xl border border-blue-100 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">
                Why this matters
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
                {finding.whyItMatters}
            </p>
        </div>

        {finding.source && (
            <div className="mt-5 border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <FileText className="h-4 w-4" />
                    Source
                </div>

                <p className="mt-1 font-medium text-slate-700">
                    {finding.source}
                </p>
            </div>
        )}
    </div>
))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No key findings extracted.</p>
                )}
              </div>
            </section>

            <section>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <CardTitle
    icon={<Brain className="h-5 w-5" />}
    title="Major Themes"
/>
                {majorThemes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {majorThemes.map((theme, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 text-sm font-medium"
                      >
                        {getSafeString(theme)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No major themes identified.</p>
                )}
              </div>
            </section>


            <section>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-slate-700">
                <CardTitle
    icon={<BadgeCheck className="h-5 w-5" />}
    title="Supporting Evidence"
/>
                {uniqueSupportingEvidence.length > 0 ? (
                  <div className="space-y-4">

    <p className="mb-2 text-slate-600 leading-7">

        The following evidence directly supports the recommendation generated from the uploaded research.

    </p>
                    {uniqueSupportingEvidence.map((item, index) => (
    <div
        key={index}
        className="rounded-xl border border-green-200 bg-green-50 p-4"
    >
        <div className="flex items-start gap-3">
            <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-green-600" />

            <div>
                <p className="leading-7 text-slate-700">
                    {item.text}
                </p>

                {item.documents.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {item.documents.map((document: string, documentIndex: number) => (
                            <span
                                key={documentIndex}
                                className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-white px-3 py-1 text-xs font-medium text-green-700"
                            >
                                <FileText className="h-3.5 w-3.5" />
                                {document}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

    <p className="text-slate-600">

        No direct supporting evidence was extracted from the uploaded documents.

    </p>

</div>
                )}
              </div>
            </section>

            <section className="mb-8">
  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

    <CardTitle
    icon={<Database className="h-5 w-5" />}
    title="Other Missing Evidence"
/>

    {evidenceMissing.length > 0 ? (
      <div className="space-y-3">

        {uniqueMissingEvidence.map((item: any, index) => {
          const gap = {
  assumption:
    typeof item === "string"
      ? item
      : item.assumption ||
        item.title ||
        item.reason ||
        getSafeString(item),

  impact:
    typeof item === "string"
      ? ""
      : item.impact ||
        item.description ||
        item.details ||
        "",
};

          return (
            <div
              key={index}
              className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
            >
              <div className="flex gap-3">

                <div className="text-amber-600 mt-1">
                  ⚠️
                </div>

                <div>

                  <p className="font-medium text-slate-900">
                    {gap.assumption}
                  </p>

                  {gap.impact && (
                    <p className="mt-1 text-sm text-slate-600">
                      {gap.impact}
                    </p>
                  )}

                </div>

              </div>
            </div>
          );
        })}

      </div>
    ) : (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
        <p className="text-green-700 font-medium">
          No significant research gaps detected.
        </p>
      </div>
    )}

  </div>
</section>

      </div>
    </div>
  );
}