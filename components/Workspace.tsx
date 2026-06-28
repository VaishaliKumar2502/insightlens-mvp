"use client";

import React, { useState } from 'react';
import UploadPanel, { UploadPanelHandle, ResearchFile } from "../components/UploadPanel";
import ResultsScreen from "../components/ResultsScreen";
import DecisionContext from "../components/DecisionContext";

// --- Types ---
interface WorkspaceProps {
  uploadPanelRef: React.RefObject<UploadPanelHandle | null>;
  workflow: "upload" | "decision" | "results";
  corpus: ResearchFile[];
  setCorpus: React.Dispatch<React.SetStateAction<ResearchFile[]>>;
  analysisResult: any;
  selectedFile: ResearchFile | null;
  onBackToUpload?: () => void;
  onContinue?: () => void;
  onAnalyze: (data: {
    description: string;
    goal: string;
    constraints: string;
    preferences: string;
    criteria: string;
  }) => void;
  loading?: boolean;
  uiMessage?: {
  type: "error" | "warning" | "info";
  title: string;
  description: string;
} | null;
analysisStatus?: string;
retryAttempts?: number;
onOpenSettings?: () => void;
onClearMessage?: () => void;
hasApiKey?: boolean;
hasUsableResearch?: boolean;
}

// --- Document Preview Component ---
const DocumentPreview = ({ file }: { file: ResearchFile }) => (
  <div className="flex flex-col h-full p-8 bg-slate-50 overflow-hidden">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{file.name}</h2>
        <p className="text-sm text-slate-500 uppercase tracking-wider">{file.type}</p>
      </div>
    </div>
    <div className="flex-1 bg-white border border-slate-200 rounded-lg p-6 shadow-sm overflow-y-auto">
      <div className="flex flex-col h-full">
        <div className="border-b px-8 py-5">
          <h2 className="font-semibold text-lg">{file.name}</h2>
          <p className="text-sm text-gray-500">{file.type}</p>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {file.content ? (
            <div className="whitespace-pre-wrap text-[15px] leading-7 text-gray-700">
              {file.content}
            </div>
          ) : (
            <div className="text-gray-400">No extracted content found.</div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// --- Workspace Presentation Component ---

const Workspace = ({
  uploadPanelRef,
  workflow,
  selectedFile,
  corpus,
  setCorpus,
  analysisResult,
  onBackToUpload,
  onContinue,
  onAnalyze,
  loading,
  uiMessage,
  analysisStatus,
  retryAttempts,
onOpenSettings,
onClearMessage,
hasApiKey,
hasUsableResearch
}: WorkspaceProps) => {
  
  if (workflow === "results") {
  return (
    <main className="flex-1 overflow-y-auto bg-slate-50">
      <ResultsScreen
        analysisResult={analysisResult}
        onBack={onBackToUpload || (() => {})}
      />
    </main>
  );
}
  
  if (workflow === "decision" && selectedFile) {
    return <DocumentPreview file={selectedFile} />;
  }

  if (workflow === "decision") {
  return (
    <main className="flex-1 bg-white flex flex-col min-h-0">
      <div data-workspace-scroll
  className="flex-1 overflow-y-auto">
        <DecisionContext
    onAnalyze={onAnalyze}
    loading={loading}
    uiMessage={uiMessage}
    analysisStatus={analysisStatus}
    retryAttempts={retryAttempts}
    onOpenSettings={onOpenSettings}
    hasUsableResearch={hasUsableResearch}
    onClearMessage={onClearMessage}
    hasApiKey={hasApiKey}
/>
      </div>
    </main>
  );
}

return (
  <main className="flex-1 bg-white flex flex-col min-h-0 overflow-hidden relative">
    <div className="flex-1 overflow-y-auto relative pb-6">
      <div className="flex flex-col items-center px-8 pt-8 pb-8 z-10 w-full max-w-[900px] mx-auto">
          <h1 className="text-[42px] font-bold text-gray-900 mb-4 text-center tracking-tight">
          Transform Research Into Decisions
        </h1>

        <p className="text-[17px] text-gray-600 mb-8 text-center max-w-2xl">
          Upload reports, research papers, strategy decks, and competitor analyses to build evidence-based decisions.
        </p>

        <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-6 mb-8 w-full max-w-[480px] shadow-sm">
          <h3 className="text-[18px] font-bold text-gray-900 mb-4 text-center leading-snug">
            Most AI tools answer questions.<br />
            InsightLens helps answer:
          </h3>

          <ul className="space-y-3 px-6">
            <li className="flex items-center gap-3 text-[14px] text-gray-700 font-medium">
              <span className="w-5 h-5 rounded-full border-2 border-[#2563eb] text-[#2563eb] flex items-center justify-center text-xs font-bold shrink-0">
                ✓
              </span>
              Do we have enough evidence?
            </li>

            <li className="flex items-center gap-3 text-[14px] text-gray-700 font-medium">
              <span className="w-5 h-5 rounded-full border-2 border-[#2563eb] text-[#2563eb] flex items-center justify-center text-xs font-bold shrink-0">
                ✓
              </span>
              What are we missing?
            </li>

            <li className="flex items-center gap-3 text-[14px] text-gray-700 font-medium">
              <span className="w-5 h-5 rounded-full border-2 border-[#2563eb] text-[#2563eb] flex items-center justify-center text-xs font-bold shrink-0">
                ✓
              </span>
              What should we do next?
            </li>
          </ul>
        </div>

        <UploadPanel
          ref={uploadPanelRef}
          corpus={corpus}
          setCorpus={setCorpus}
          onContinue={onContinue}
        />
      </div>
    </div>

    <div className="shrink-0 bg-white border-t border-gray-100 py-3 px-6 z-20 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.03)] w-full">
  <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2">

    <div className="bg-[#f1f5f9] text-[#475569] font-bold text-[11px] tracking-widest px-3 py-1.5 rounded-md">
      HOW IT WORKS
    </div>

    {/* Step 1 */}
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-full border-2 border-[#2563eb] text-[#2563eb] flex items-center justify-center font-bold text-[13px]">
        1
      </div>
      <span className="text-[14px] font-bold text-slate-900">
        Upload Research
      </span>
    </div>

    <div className="text-slate-300 text-xl">→</div>

    {/* Step 2 */}
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-full border-2 border-slate-300 text-slate-500 flex items-center justify-center font-bold text-[13px]">
        2
      </div>
      <span className="text-[14px] font-semibold text-slate-600">
        Build Corpus
      </span>
    </div>

    <div className="text-slate-300 text-xl">→</div>

    {/* Step 3 */}
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-full border-2 border-slate-300 text-slate-500 flex items-center justify-center font-bold text-[13px]">
        3
      </div>
      <span className="text-[14px] font-semibold text-slate-600">
        Analyze & Decide
      </span>
    </div>

  </div>
</div>

  </main>
);
};

export default Workspace;