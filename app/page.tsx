"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mail, X, Sparkles, ShieldCheck, FileText } from "lucide-react";
import SettingsModal from "../components/SettingsModal";
import UploadPanel, {
  UploadPanelHandle,
  ResearchFile,
} from "../components/UploadPanel";
import { Sidebar } from "../components/Sidebar";
import Workspace from "../components/Workspace";

interface AnalysisResult {

decisionValidation:{
    isValid:boolean;
    reason:string;
    suggestion:string;
};

decision:string;

recommendation:{
    decision:string;
    reason:string;
};

decisionBrief:{
    finalDecision:string;
    rationale:string;
    confidence:string;
    evidenceSummary:string;
    riskSummary:string;
    nextBestAction:string;
};

decisionChangers:{
    missingInformation:string;
    whyItCouldChangeDecision:string;
    recommendedAction:string;
    priority:"High" | "Medium" | "Low";
}[];

risks:{
    risk:string;
    whyItMatters:string;
    severity:"High" | "Medium" | "Low";
}[];

contradictions:{
    issue:string;
    explanation:string;
    sources:string[];
}[];

alternatives:{
    option:string;
    tradeoff:string;
}[];

researchReadiness:{
    confidence:string;
    canRecommend:boolean;
    reason:string;
};

evidenceFound:string[];

evidenceMissing:string[];

executiveSummary:string;

majorThemes:any[];

supportingEvidence:any[];

}

interface DecisionContextData {
  description: string;
  goal: string;
  constraints: string;
  preferences: string;
  criteria: string;
}


// --- Icons (Shared) ---
const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const FolderIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const SearchCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const TargetIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
  </svg>
);

const CollapseIcon = ({ className, direction = 'left' }: { className?: string; direction?: 'left' | 'right' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    {direction === 'left' ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    )}
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// --- components/Header.tsx ---
const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 relative z-20">
      <div className="flex items-center">
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
          InsightLens
        </h1>
      </div>

      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

// --- components/RightPanel.tsx ---
export const RightPanel = ({ onCollapse }: { onCollapse: () => void }) => {
  return (
    <aside className="w-[320px] bg-[#fafafa] border-l border-gray-200 flex flex-col shrink-0 relative z-10">
      <button
        onClick={onCollapse}
        className="absolute -left-3 top-4 bg-white border border-gray-200 rounded p-0.5 text-gray-400 hover:text-gray-600 shadow-sm z-10"
        aria-label="Collapse right panel"
      >
        <CollapseIcon className="w-4 h-4" direction="right" />
      </button>

      <div className="p-6 flex flex-col h-full overflow-y-auto">
        <h2 className="text-[18px] font-semibold text-gray-900 mb-6 text-center">How It Helps</h2>

        <div className="space-y-4">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-slate-900">
              <BookOpenIcon className="w-5 h-5 text-[#2563eb]" />
              <h3 className="font-bold text-[15px]">Understand Research</h3>
            </div>
            <p className="text-[14px] text-slate-600 leading-relaxed mb-4">
              Turn hundreds of pages into key findings, major themes and executive summaries.
            </p>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-[11px] font-bold tracking-[0.08em] text-slate-400 uppercase">
                EXECUTIVE SUMMARIES • THEMES • CITATIONS
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-slate-900">
              <SearchCheckIcon className="w-5 h-5 text-[#2563eb]" />
              <h3 className="font-bold text-[15px]">Find What's Missing</h3>
            </div>
            <p className="text-[14px] text-slate-600 leading-relaxed mb-4">
              Discover blind spots, research gaps and unanswered questions before making decisions.
            </p>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-[11px] font-bold tracking-[0.08em] text-slate-400 uppercase">
                BLIND SPOTS • GAPS • CONTRADICTIONS
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-slate-900">
              <TargetIcon className="w-5 h-5 text-[#2563eb]" />
              <h3 className="font-bold text-[15px]">Make Better Decisions</h3>
            </div>
            <p className="text-[14px] text-slate-600 leading-relaxed mb-4">
              Compare alternatives, evaluate trade-offs and generate evidence-backed recommendations.
            </p>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-[11px] font-bold tracking-[0.08em] text-slate-400 uppercase leading-relaxed">
                ALTERNATIVES • RISKS • RECOMMENDATIONS
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const ContactSupportModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">
        <div className="mb-7 flex items-center justify-between">
          <h2 className="text-center text-xl font-bold tracking-wide text-slate-900">
            CONTACT CORPORATE SUPPORT
          </h2>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close support modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <a
            href="tel:+18005550199"
            className="flex items-center gap-5 rounded-xl border border-slate-200 p-5 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Phone className="h-5 w-5" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Call Dedicated Line
              </p>
              <p className="text-sm font-medium text-slate-500">
                +971-547312700
              </p>
            </div>
          </a>

          <a
            href="mailto:vaishali.gupta2502@gmail.com"
            className="flex items-center gap-5 rounded-xl border border-slate-200 p-5 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Email Helpdesk
              </p>
              <p className="text-sm font-medium text-slate-500">
                vaishali.gupta2502@gmail.com
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

const AboutModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="shrink-0 border-b border-slate-100 p-7 pb-5">
  <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Sparkles className="h-6 w-6" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              InsightLens
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Evidence-backed research decision copilot · MVP v1.0
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close about modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        </div>
<div className="overflow-y-auto p-7 pt-5">
        <p className="text-base leading-7 text-slate-700">
  InsightLens is an AI research decision copilot that analyzes uploaded documents, extracts evidence, identifies gaps, risks, alternatives, contradictions, and generates an evidence-backed decision brief with recommendations, next steps and what could realistically change the recommendation.
</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-900">
              <FileText className="h-4 w-4 text-blue-600" />
              <p className="font-semibold">
                Understand Research
              </p>
            </div>

            <p className="text-sm leading-6 text-slate-600">
              Generates analysis summaries, key findings, major themes, supporting evidence, and source-aware extracted facts.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-900">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <p className="font-semibold">
                Find What Is Missing
              </p>
            </div>

            <p className="text-sm leading-6 text-slate-600">
  Identifies missing evidence, research readiness, contradictions, and the specific gaps that could change the decision.
</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-900">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <p className="font-semibold">
                Make Better Decisions
              </p>
            </div>

            <p className="text-sm leading-6 text-slate-600">
  Produces a decision brief with final decision, rationale, confidence, evidence summary, remaining risk, alternatives, trade-offs, and next best action.
</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-900">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <p className="font-semibold">
                MVP Architecture
              </p>
            </div>

            <p className="text-sm leading-6 text-slate-600">
  Runs without a custom backend. Analysis uses the configured Gemini API key, selected research sources, and shortened document text when needed to reduce API limit issues.
</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">
            Current capabilities
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-800">
  Upload files, select research sources, enter decision context, analyze selected documents, review a decision brief, inspect key findings, compare major themes, evaluate supporting evidence, check research readiness, identify decision-changing gaps, review risks, detect contradictions, compare alternatives, and follow recommended next steps.
</p>
        </div>

        <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            Important note
          </p>

          <p className="mt-1 text-sm leading-6 text-amber-800">
  InsightLens supports decision-making but does not replace legal, financial, medical, or professional advice. Gemini API limits may temporarily delay analysis, and long documents may be shortened before analysis. Users should review source documents before acting on recommendations.
</p>
        </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span>
            InsightLens MVP
          </span>

          <span>
            Local-first prototype · Gemini-powered analysis
          </span>
        </div>
      </div>
      </div>
    </div>
  );
};


export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const uploadPanelRef = useRef<UploadPanelHandle | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const [corpus, setCorpus] = useState<ResearchFile[]>([]);
  const [workflow, setWorkflow] = useState<"upload" | "decision" | "results">("upload");
  const [apiKey, setApiKey] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const selectedFile = corpus.find(f => f.id === selectedFileId) ?? null;
  const [analysisStatus, setAnalysisStatus] = useState("");
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [uiMessage, setUiMessage] = useState<{
  type: "error" | "warning" | "info";
  title: string;
  description: string;
} | null>(null);

      useEffect(() => {
  const savedKey = localStorage.getItem("geminiApiKey");
  if (savedKey) {
    setApiKey(savedKey);
  }
}, []);

  const hasUsableResearch = corpus.some(
    (file) => file.selected && file.status === "completed" && file.content.trim()
  );

    const toggleFileSelection = (id: string) => {
    setCorpus((prev) => {
      const nextCorpus = prev.map((file) =>
        file.id === id ? { ...file, selected: !(file as any).selected } : file
      );

      const hasSelectedCompletedFile = nextCorpus.some(
        (file) => file.selected && file.status === "completed" && file.content.trim()
      );

      if (hasSelectedCompletedFile) {
        setUiMessage((message) =>
          message?.title === "No usable research found" ? null : message
        );
      }

      return nextCorpus;
    });
  };

  const performAnalysis = async (
    corpus: string,
    decision: DecisionContextData
  ) => {
    
        if (!apiKey) {
      setUiMessage({
        type: "warning",
        title: "Configure your API key",
        description: "Add a valid Gemini API key before analyzing research.",
      });
      setSettingsOpen(true);
      return;
    }

    setAnalysisResult(null);

setUiMessage(null);

setAnalysisStatus("");

setWorkflow("decision");
    setLoading(true);
    setAnalysisStatus("Reading uploaded documents...");
    try {
      const prompt = 
      `
You are an expert Research Decision Copilot.

Your role is to help users make evidence-backed decisions.

Analyze the uploaded research together with the user's Decision Context and determine whether there is enough information to make a reasonable recommendation.

Your objective is NOT to determine whether perfect information exists.

Your objective is to determine whether there is sufficient information to make the best recommendation possible while clearly communicating confidence, assumptions and remaining uncertainty.

==================================================
USER DECISION
==================================================

${JSON.stringify(decision)}

The Decision Context contains the user's decision, goals, assumptions, constraints, preferences, success criteria and any additional details.

Treat the Decision Context as trusted user input.

==================================================
RESEARCH CORPUS
==================================================

${corpus}

==================================================
INSTRUCTIONS
==================================================

STEP 1 — Validate the Decision

Determine whether the user's request represents a real decision that can reasonably be evaluated using research.

Examples of VALID decisions

• Should we expand into the UAE?
• Which CRM should we choose?
• Should we migrate to AWS?
• Should we build this feature?
• Which framework should we adopt?
• Should we acquire Company X?
• Should I sign this employment agreement?
• Should this insurance claim be approved?

Examples of INVALID decisions

• hello
• hi
• test
• random text
• ??
• blank input

If the request is invalid:

• decisionValidation.isValid = false

• Explain why.

• Suggest how to rewrite the request.

• Do NOT analyze the research corpus.

• Return empty arrays for evidenceFound, evidenceMissing, decisionChangers, risks, contradictions, alternatives, recommendedNextSteps, majorThemes, supportingEvidence and assumptionsUsed.

• Return an empty decisionBrief object with empty strings for every decisionBrief field.

• researchReadiness.status = "MORE_RESEARCH_REQUIRED"

• researchReadiness.canRecommend = false

• researchReadiness.confidence = "Low"

• executiveSummary = ""

Otherwise continue.

--------------------------------------------------

STEP 2 — Analyze the Research

Use ONLY the uploaded research corpus for factual findings.

Some long documents may be shortened before analysis to avoid API limits.

If a document appears shortened, do not claim that missing middle content was reviewed.

Base factual findings only on the visible text provided in the research corpus.

Never fabricate evidence.

Never invent facts.

Do NOT introduce new factual claims that are not supported by either:

• the uploaded research

OR

• the user's Decision Context.

General professional knowledge may only be used to interpret the supplied evidence.

Every factual finding must be traceable to the uploaded research.

Recommendations may use BOTH:

1. Facts extracted from the uploaded research.

2. The user's Decision Context, including:

• goals

• assumptions

• constraints

• preferences

• success criteria

• priorities

Always distinguish between:

• document-supported facts

• user-provided assumptions

• genuinely missing evidence

--------------------------------------------------

STEP 3 — Assess Decision Readiness

Real-world decisions are rarely made with perfect information.

Your goal is to determine whether there is enough information to make a reasonable recommendation.

Do NOT reject a recommendation simply because additional information could exist.

Treat assumptions supplied by the user as valid decision inputs.

Do NOT request additional research merely to verify those assumptions.

Before deciding recommendation readiness, answer these questions in order.

Question 1

Can this decision reasonably be answered using:

• the uploaded research

AND

• the user's Decision Context?

If YES

↓

researchReadiness.canRecommend = true

Question 2

Would the recommendation probably change if the missing information became available?

If NO

↓

Keep

researchReadiness.canRecommend = true

Lower confidence if appropriate.

Question 3

Only return

researchReadiness.canRecommend = false

when genuinely critical factual evidence is missing and that missing evidence would likely change the recommendation.

Examples of critical missing evidence

• Missing pages of a contract

• Missing acquisition financial statements

• Missing implementation cost

• Missing vendor proposal

• Missing medical history

The following should NOT prevent recommendations

• company culture

• optional market research

• optional benchmarks

• analyst opinions

• information already supplied by the user

Confidence measures certainty.

Confidence does NOT determine whether recommendations are allowed.

Use:

HIGH

Strong supporting evidence

Minimal assumptions

Few knowledge gaps

MEDIUM

Enough evidence

Some assumptions

Moderate uncertainty

LOW

Limited evidence

Significant assumptions

Recommendation still possible

--------------------------------------------------

STEP 4 — Generate the Analysis

Decision

Generate one concise sentence describing the user's decision.

Executive Summary

Write a concise executive summary focused on the decision. Do not restate document contents. Explain what the evidence means for the user's decision in no more than 3-4 sentences.

Decision Brief

Create a practical decision brief for the user.

The decision brief must answer:

• What decision should the user make?
• Why is this the best decision based on the uploaded research?
• How confident is the recommendation?
• What evidence most strongly supports the decision?
• What risks or uncertainty remain?
• What is the next best action?

The decision brief must be based on uploaded research and the user's Decision Context.

Do not invent facts.

Keep it clear, professional, and useful for someone deciding what to do next.

Major Themes

Identify the major recurring themes.

Supporting Evidence

Summarize the strongest evidence supporting the recommendation.

Evidence Found

Return the important raw facts extracted directly from the uploaded documents.

This is the single source of truth for Key Findings in the UI.

Do NOT generate a separate keyFindings field.

Do NOT include explanations, reasoning, recommendations, or summaries inside evidenceFound.

Each evidenceFound item must be short, factual, and traceable to one uploaded document.

Assumptions Used

Return every user assumption that materially influenced the recommendation.

For each assumption include:

• assumption

• impact

Evidence Missing

Only include information whose absence would likely change the recommendation.

Do NOT include information that would merely improve confidence.

Decision Changers

Return missing information that could realistically change the final decision.

This is different from generic missing evidence.

Only include items where the answer might change if this information became available.

For each item include:

• missingInformation: the specific missing information
• whyItCouldChangeDecision: how this information could change the recommendation
• recommendedAction: the exact document, data source, or action the user should take
• priority: High, Medium, or Low

If no missing information is likely to change the decision, return an empty array.

Risks

Return the most important risks that remain after reviewing the uploaded research and Decision Context.

Risks must be grounded in uploaded documents, user-provided decision context, or clearly identified uncertainty.

For each risk include:

• risk: the risk or concern
• whyItMatters: why this could affect the decision
• severity: High, Medium, or Low

Contradictions

Return contradictions, inconsistencies, or conflicts found across uploaded documents.

Only include contradictions that are actually present in the uploaded research.

For each contradiction include:

• issue: the contradiction or conflict
• explanation: why the information conflicts
• sources: document names involved

If no contradictions are found, return an empty array.

Alternatives

Return realistic alternative actions the user could consider.

Alternatives must be relevant to the user's decision and available evidence.

For each alternative include:

• option: the alternative action
• tradeoff: the main trade-off compared with the recommended decision

--------------------------------------------------

OUTPUT REQUIREMENTS

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations.

Do NOT return code fences.

Every property shown in the JSON schema must exist.

Do NOT return any extra properties.

Do NOT return keyFindings.

The UI derives Key Findings from evidenceFound.

Never return null.

Use empty arrays where appropriate.

Use empty strings where appropriate.

Return ONLY the JSON object.

==================================================
OUTPUT JSON
==================================================

{
  "decisionValidation": {
    "isValid": true,
    "reason": "",
    "suggestion": ""
  },
    "decision": "",
  "decisionBrief": {
    "finalDecision": "",
    "rationale": "",
    "confidence": "",
    "evidenceSummary": "",
    "riskSummary": "",
    "nextBestAction": ""
  },
  "researchReadiness": {
    "status": "READY | READY_WITH_ASSUMPTIONS | MORE_RESEARCH_REQUIRED",
    "confidence": "High | Medium | Low",
    "canRecommend": true,
    "reason": ""
  },
  "recommendation": {
  "decision": "Recommend | Recommend with Caution | Do Not Recommend | More Research Required",
  "reason": ""
},
"recommendedNextSteps": [
  {
    "action": "",
    "reason": ""
  }
],
  "executiveSummary": "",
  "majorThemes": [],
  "supportingEvidence": [
  {
    "reasoning": "",
    "documents": []
  }
],

"evidenceFound": [
  {
    "field": "",
    "value": "",
    "source": ""
  }
],"assumptionsUsed": [
    {
      "assumption": "",
      "impact": ""
    }
  ],
    "evidenceMissing": [],
    "decisionChangers": [
    {
      "missingInformation": "",
      "whyItCouldChangeDecision": "",
      "recommendedAction": "",
      "priority": "High | Medium | Low"
    }
  ],
  "risks": [
    {
      "risk": "",
      "whyItMatters": "",
      "severity": "High | Medium | Low"
    }
  ],
  "contradictions": [
    {
      "issue": "",
      "explanation": "",
      "sources": []
    }
  ],
  "alternatives": [
    {
      "option": "",
      "tradeoff": ""
    }
  ]
}

IMPORTANT:

Evidence Found contains ONLY raw facts extracted directly from the uploaded documents.

Each item MUST follow this structure:

{
  "field": "Name of extracted field",
  "value": "Exact extracted value",
  "source": "Document filename"
}

Examples:

{
  "field": "Employee Name",
  "value": "John Smith",
  "source": "EmploymentAgreement.docx"
}

{
  "field": "Salary",
  "value": "$90,000 annually",
  "source": "EmploymentAgreement.docx"
}

Do NOT include reasoning, summaries, interpretations, recommendations, or explanations inside evidenceFound.

------------------------------------------------

Supporting Evidence is DIFFERENT.

It explains WHY the recommendation was made based on the uploaded research.

Each item MUST follow this structure:

{
  "reasoning": "The employment agreement explicitly specifies an annual salary of $90,000, providing direct evidence of the employee's compensation.",
  "documents": [
    "EmploymentAgreement.docx"
  ]
}

Supporting Evidence should explain:

• what evidence supports the recommendation
• why it matters
• which uploaded document(s) were used

Do NOT repeat raw extracted facts here.
Do NOT duplicate evidenceFound.

Recommended Next Steps is NOT the same as Evidence Missing.

Evidence Missing identifies information that was not found.

Recommended Next Steps converts those missing pieces into concrete actions for the user.

Each item MUST follow this structure:

{
  "action": "",
  "reason": ""
}

Examples

Evidence Missing

[
  {
    "assumption":"Annual leave policy is unavailable.",
    "impact":"Unable to verify employee benefits."
  },
  {
    "assumption":"Bonus structure is missing.",
    "impact":"Unable to estimate total compensation."
  }
]

Recommended Next Steps

[
  {
    "action":"Upload the HR Handbook.",
    "reason":"The handbook usually contains annual leave policies."
  },
  {
    "action":"Upload the Benefits Policy.",
    "reason":"This document normally explains bonus eligibility and payouts."
  },
  {
    "action":"Upload the signed Offer Letter.",
    "reason":"It may contain compensation details missing from other documents."
  }
]

Rules

• Never copy Evidence Missing into Recommended Next Steps.

• Every recommended action should tell the user exactly which document, report, policy or data source to upload.

• If multiple missing items can be solved by one document, combine them into a single recommendation.

• Prefer actionable document names over generic suggestions like "upload more research."

• Limit to the 3–5 highest-value next actions.
`;
      setAnalysisStatus("Building research corpus...");
await new Promise(resolve => setTimeout(resolve, 300));

setAnalysisStatus("Sending research to Gemini...");

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      });
      setAnalysisStatus("Analyzing evidence...");
await new Promise(resolve => setTimeout(resolve, 300));

setAnalysisStatus("Generating recommendations...");
      
      const data = await response.json();

// Check for HTTP errors first
if (!response.ok) {

  const rawMessage =
    data?.error?.message ?? "";

  let description =
    "We couldn't complete the analysis. Please try again.";

  if (rawMessage.includes("Quota exceeded")) {

  const attempts = retryAttempts + 1;

  setRetryAttempts(attempts);

  const retry =
    rawMessage.match(/retry in ([0-9.]+)/i);

  if (attempts === 1) {

    description =
      retry
        ? `We've reached the current Gemini API usage limit.

Please wait ${Math.ceil(Number(retry[1]))} seconds before trying again.`
        : `We've reached the current Gemini API usage limit.

Please wait about one minute before trying again.`;

  }

  else if (attempts === 2) {

    description =
      `The AI service is still busy.

Please wait another minute before trying again.

Your uploaded documents and decision details are safe.`;

  }

  else {

    description =
`The Gemini API usage limit has been reached.

Additional retries are unlikely to succeed immediately.

You can continue by:

• Updating your Gemini API key.

• Using a Gemini API key from another Google Cloud project.

• Upgrading to a paid Gemini API plan.

• Waiting for the quota window to reset.

Click "Update API Key" below to continue.`;

  }

}

  else if (rawMessage.toLowerCase().includes("rate")) {

    description =
      "Too many requests were sent. Please wait a few moments and try again.";

  }

  else if (rawMessage.toLowerCase().includes("api key")) {

    description =
      "Your Gemini API key is invalid. Please verify it in Settings.";

  }

  else if (rawMessage.toLowerCase().includes("permission")) {

    description =
      "Your Gemini API key doesn't have permission to access this model.";

  }

  setUiMessage({
  type: "error",
  title: rawMessage.includes("Quota exceeded")
    ? "Gemini is temporarily busy"
    : "Analysis couldn't be completed",
  description,
});

  setAnalysisStatus("");

  return;
}

// Make sure Gemini actually returned a candidate
const candidate = data?.candidates?.[0];

if (!candidate) {
  throw new Error(
    "The AI service didn't return any recommendations. Please try rephrasing your decision."
  );
}

// Extract text safely
const resultText = candidate.content?.parts
  ?.map((part: any) => part.text ?? "")
  .join("")
  .trim();

if (!resultText) {
  throw new Error(
    "The AI service returned an empty response. Please try again."
  );
}

const cleanJson = resultText.replace(/```json|```/g, "").trim();

let parsedResult;

try {
  parsedResult = JSON.parse(cleanJson);
} catch {
  throw new Error(
    "The AI returned an invalid response. Please try again."
  );
}

// Validate required JSON fields
if (
  !Array.isArray(parsedResult.evidenceFound) ||
  !Array.isArray(parsedResult.majorThemes) ||
  !Array.isArray(parsedResult.supportingEvidence) ||
  !Array.isArray(parsedResult.evidenceMissing) ||
  !Array.isArray(parsedResult.decisionChangers) ||
  !Array.isArray(parsedResult.risks) ||
  !Array.isArray(parsedResult.contradictions) ||
  !Array.isArray(parsedResult.alternatives) ||
  !Array.isArray(parsedResult.recommendedNextSteps) ||
  typeof parsedResult.executiveSummary !== "string" ||
  !parsedResult.decisionValidation ||
  typeof parsedResult.researchReadiness !== "object" ||
  typeof parsedResult.decisionBrief !== "object"
) {
  throw new Error(
    "The AI response was incomplete. Please try again."
  );
}

parsedResult.evidenceFound = parsedResult.evidenceFound.filter((item: any) => {
  return item && typeof item === "object" && item.field && item.value;
});

parsedResult.decisionChangers = parsedResult.decisionChangers.filter((item: any) => {
  return item && typeof item === "object" && item.missingInformation;
});

parsedResult.risks = parsedResult.risks.filter((item: any) => {
  return item && typeof item === "object" && item.risk;
});

parsedResult.contradictions = parsedResult.contradictions.filter((item: any) => {
  return item && typeof item === "object" && item.issue;
});

parsedResult.alternatives = parsedResult.alternatives.filter((item: any) => {
  return item && typeof item === "object" && item.option;
});

parsedResult.decisionBrief = {
  finalDecision: parsedResult.decisionBrief?.finalDecision || parsedResult.recommendation?.decision || "",
  rationale: parsedResult.decisionBrief?.rationale || parsedResult.recommendation?.reason || "",
  confidence: parsedResult.decisionBrief?.confidence || parsedResult.researchReadiness?.confidence || "",
  evidenceSummary: parsedResult.decisionBrief?.evidenceSummary || "",
  riskSummary: parsedResult.decisionBrief?.riskSummary || "",
  nextBestAction: parsedResult.decisionBrief?.nextBestAction || "",
};

/*
|--------------------------------------------------------------------------
| NEW: Decision validation check
|--------------------------------------------------------------------------
*/

if (!parsedResult.decisionValidation?.isValid) {
  setUiMessage({
    type: "warning",
    title: "Please describe a real decision",
    description:
      parsedResult.decisionValidation.reason ||
      "Your request doesn't describe a real business, research or strategic decision."
  });

  setLoading(false);
  return;
}

/*
|--------------------------------------------------------------------------
| Valid decision → continue normally
|--------------------------------------------------------------------------
*/

setAnalysisResult(parsedResult);

setRetryAttempts(0);

// Give React one render cycle
await new Promise(resolve => setTimeout(resolve, 100));

setAnalysisStatus("");

setWorkflow("results");
    } catch (error) {
  console.error("Analysis failed:", error);

const rawMessage =
  error instanceof Error ? error.message : "";

let description =
  "Something unexpected happened while analyzing your research.";

if (rawMessage.toLowerCase().includes("model")) {
  description =
    "The AI service is temporarily unavailable. Please try again in a few minutes.";
} else if (rawMessage.toLowerCase().includes("network")) {
  description =
    "We couldn't connect to the AI service. Please check your internet connection and try again.";
} else if (rawMessage.toLowerCase().includes("empty response")) {

  description =
    "The AI returned an empty response. Please try again.";

} else if (rawMessage.toLowerCase().includes("invalid response")) {

  description =
    "The AI returned an invalid response. Please try again.";

} else if (!rawMessage.includes("Quota exceeded")) {
  setRetryAttempts(0);
}

setUiMessage({
  type: "error",
  title: "Analysis couldn't be completed",
  description,
});

  setAnalysisStatus("");
} finally {
      setLoading(false);
    }
  };

    const handleApiKeyValidated = (validatedKey: string) => {
    setApiKey(validatedKey);
    setRetryAttempts(0);
    setUiMessage(null);
    console.log("Gemini API key validated");
    setSettingsOpen(false);
  };

    const prepareDocumentForAnalysis = (file: ResearchFile) => {
    const maxCharactersPerDocument = 12000;
    const content = file.content.trim();

    if (content.length <= maxCharactersPerDocument) {
      return `SOURCE: ${file.name}\n${content}`;
    }

    return `SOURCE: ${file.name}
NOTE: This document was shortened for analysis to avoid API limits. The beginning and ending sections are included.

${content.slice(0, 8000)}

[...middle content shortened...]

${content.slice(-4000)}`;
  };

  const handleAnalyze = (decision: DecisionContextData) => {
    const selectedCorpus = corpus
    .filter(file => file.selected && file.status === "completed" && file.content.trim())
    .map(prepareDocumentForAnalysis)
    .join("\n\n");

  if (!selectedCorpus.trim()) {
  setUiMessage({
  type: "warning",
  title: "No usable research found",
  description:
    "Select at least one successfully processed document before generating recommendations.",
});

  return;
}
  setUiMessage(null);
  if (retryAttempts >= 3) {
  setRetryAttempts(0);
}
  performAnalysis(selectedCorpus, decision);
};

return (
      <div className="flex flex-col h-screen w-full bg-white overflow-hidden text-slate-900 font-sans">
      <Header />

    <div className="flex flex-1 overflow-hidden relative">
            {leftPanelOpen ? (
        <Sidebar
          corpus={corpus}
          selectedFileId={selectedFileId}
          onFileSelect={setSelectedFileId}
          onToggleSelect={toggleFileSelection}
          onUploadClick={() => uploadPanelRef.current?.triggerUpload()}
          onConfigureApi={() => setSettingsOpen(true)}
          onContactSupport={() => setSupportOpen(true)}
          onAbout={() => setAboutOpen(true)}
          onCollapse={() => setLeftPanelOpen(false)}
        />
      ) : (
        <button
          onClick={() => setLeftPanelOpen(true)}
          className="absolute left-3 top-4 z-30 rounded border border-gray-200 bg-white p-1 text-gray-500 shadow-sm hover:text-gray-900"
          aria-label="Expand left panel"
        >
          <CollapseIcon className="h-4 w-4" direction="right" />
        </button>
      )}

      <Workspace
        uploadPanelRef={uploadPanelRef}
        workflow={workflow}
        corpus={corpus}
        setCorpus={setCorpus}
        analysisResult={analysisResult}
        selectedFile={workflow === "upload" ? null : selectedFile}
        onAnalyze={handleAnalyze}
        loading={loading}
        uiMessage={uiMessage}
        retryAttempts={retryAttempts}
        hasApiKey={Boolean(apiKey)}
        hasUsableResearch={hasUsableResearch}
onOpenSettings={() => setSettingsOpen(true)}
        onClearMessage={() => setUiMessage(null)}
        analysisStatus={analysisStatus}
        onBackToUpload={() => {
  setSelectedFileId(null);

  // Optional but recommended so a new analysis starts clean
  setAnalysisResult(null);
  setAnalysisError(null);
  setUiMessage(null);
  setAnalysisStatus("");

  // Return to the original upload experience
  setWorkflow("upload");
}}
        onContinue={() => {
          setSelectedFileId(null);
          setWorkflow("decision");
        }}
      />

            {workflow !== "results" && rightPanelOpen && (
        <RightPanel onCollapse={() => setRightPanelOpen(false)} />
      )}

      {workflow !== "results" && !rightPanelOpen && (
        <button
          onClick={() => setRightPanelOpen(true)}
          className="absolute right-3 top-4 z-30 rounded border border-gray-200 bg-white p-1 text-gray-500 shadow-sm hover:text-gray-900"
          aria-label="Expand right panel"
        >
          <CollapseIcon className="h-4 w-4" direction="left" />
        </button>
      )}

    <SettingsModal
      isOpen={settingsOpen}
      onClose={() => setSettingsOpen(false)}
      onValidated={handleApiKeyValidated}
    />

        <ContactSupportModal
      isOpen={supportOpen}
      onClose={() => setSupportOpen(false)}
    />

          <AboutModal
      isOpen={aboutOpen}
      onClose={() => setAboutOpen(false)}
    />

    </div>
  </div>
);
}