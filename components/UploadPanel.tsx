"use client";

import React, { useRef, useCallback, useImperativeHandle, forwardRef, useMemo, useState } from 'react';
import { FileUp, Trash2, CheckCircle2, Loader2, Check, FolderOpen, FileText, File } from 'lucide-react';
import mammoth from 'mammoth';

export interface ResearchFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  selected: boolean;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  progress: number;
  uploadedAt: Date | string;
  error?: string;
}

export interface UploadPanelHandle {
  triggerUpload: () => void;
}

interface UploadPanelProps {
  corpus: ResearchFile[];
  setCorpus: React.Dispatch<React.SetStateAction<ResearchFile[]>>;
  onContinue?: () => void;
}

const UploadPanel = forwardRef<UploadPanelHandle, UploadPanelProps>(({ corpus, setCorpus, onContinue }, ref) => {
  const [loadingSamples, setLoadingSamples] = React.useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploading = useMemo(() => corpus.some(f => f.status === 'uploading' || f.status === 'pending'), [corpus]);
  const completedFiles = useMemo(() => corpus.filter(f => f.status === 'completed'), [corpus]);
  const selectedCompletedFiles = useMemo(
  () => corpus.filter(f => f.status === 'completed' && f.selected),
  [corpus]
);
const hasFiles = corpus.length > 0;
const isCorpusReady = selectedCompletedFiles.length > 0 && !isUploading;

  useImperativeHandle(ref, () => ({
    triggerUpload: () => !isUploading && fileInputRef.current?.click(),
  }));

  const extractText = async (file: File): Promise<string> => {
  if (file.type === 'text/plain') {
    try {
    return await file.text();
    } catch {
    throw new Error(
        "Unable to read text file."
    );
}
  }

  if (file.type === "application/pdf") {

    try {
    const pdfjsLib = await import("pdfjs-dist");

    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
    ).toString();

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
    }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        text +=
            content.items
                .map((item: any) => item.str)
                .join(" ") + "\n";
    }

    return text;
  } catch {

        throw new Error(
            "Unable to read PDF."
        );

    }
}

    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }  catch {

    throw new Error(
        "Unable to read Word document."
    );

} }
    throw new Error(
  `Unsupported file type: ${file.type}`
);
  };

  const handleFiles = useCallback((selectedFiles: FileList | File[]) => {
    Array.from(selectedFiles).forEach(async (file) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newFile: ResearchFile = {
        id,
        name: file.name,
        type: file.type,
        size: file.size,
        content: '',
        selected: true,
        status: 'uploading',
        progress: 0,
        uploadedAt: new Date(),
      };

      setCorpus(prev => [...prev, newFile]);

      try {
        const content = await extractText(file);
        setCorpus(prev => prev.map(item => item.id === id ? { ...item, status: "completed", progress: 100, content } : item));
      } catch (error) {
    console.error(
        `Failed to process ${file.name}`,
        error
    );

    const message =
        error instanceof Error
            ? error.message
            : "Unknown error";

    setCorpus(prev =>
        prev.map(item =>
            item.id === id
                ? {
                    ...item,
                    status: "failed",
                    progress: 100,
                    error: message,
                }
                : item
        )
    );
}
    });
  }, [setCorpus]);

  const loadSampleProject = async () => {
    setLoadingSamples(true);
    const sampleFiles = [
  { name: 'Employeement Agreement.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { name: 'Insurance claim form.pdf', type: 'application/pdf' },
  { name: 'Meeting Notes.txt', type: 'text/plain' },
  { name: 'Competitor Analysis.pdf', type: 'application/pdf' },
];

    try {
      const filesToProcess = await Promise.all(
        sampleFiles.map(async (f) => {
          const response = await fetch(`/sample-project/${f.name}`);
          const blob = await response.blob();
          return new window.File(
    [blob],
    f.name,
    {
        type: f.type
    }
);
        })
      );
      handleFiles(filesToProcess);
    } catch (e) {
      console.error("Failed to load samples", e);
    } finally {
      setLoadingSamples(false);
    }
  };

  const removeFile = (id: string) => {
    setCorpus(prev => prev.filter(f => f.id !== id));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  if (!isUploading) {
    setIsDragging(true);
  }
};

const handleDragLeave = () => {
  setIsDragging(false);
};

const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  setIsDragging(false);

  if (isUploading || !event.dataTransfer.files.length) {
    return;
  }

  handleFiles(event.dataTransfer.files);
};

return (
  <div className="w-full max-w-2xl mx-auto p-6">
    <input
      ref={fileInputRef}
      type="file"
      multiple
      className="hidden"
      accept=".pdf,.docx,.txt"
      onChange={(e) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
      }}
    />

    <div
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  className={`rounded-2xl bg-white shadow-sm border transition-all p-10 flex flex-col items-center text-center ${
    isDragging ? "border-blue-500 bg-blue-50" : "border-slate-200"
  }`}
>
      {isCorpusReady ? (
        <>
          <div className="flex items-center gap-2 text-green-600 font-bold text-xl mb-4">
            <Check className="h-6 w-6" />
            Research Corpus Ready
          </div>
          <p className="text-slate-600 font-medium mb-6">
            {selectedCompletedFiles.length} Sources Selected
          </p>
          <button
            onClick={onContinue}
            className="
w-full
bg-[#2563eb]
hover:bg-blue-700
text-white
rounded-lg
py-3
font-semibold
transition-colors
shadow-sm
disabled:bg-gray-300
disabled:cursor-not-allowed
"
          >
            Continue
          </button>
        </>
      ) : (
        <>
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <FileUp className="h-8 w-8 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Upload Research / Drag & Drop Files
          </h2>

          <p className="mt-2 text-slate-500 mb-8">
            Select files from your computer or workspace
          </p>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50 transition-all shadow-sm"
            >
              Upload Sources
            </button>

            <button
              onClick={loadSampleProject}
              disabled={isUploading || loadingSamples}
              className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loadingSamples ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FolderOpen className="w-4 h-4" />
              )}
              Use Sample Project
            </button>
          </div>

          <p className="mt-8 text-slate-500 text-sm font-medium">
            Load a pre-built research project and try the platform instantly.
          </p>

          <div className="mt-6 flex justify-center items-center gap-8">
            {[
              { label: 'PDF', icon: File },
              { label: 'DOCX', icon: FileText },
              { label: 'TXT', icon: FileText },
            ].map((item) => (
              <div key={item.label} className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors cursor-default">
                <item.icon className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
                <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>

    {hasFiles && (
      <div className="mt-8 space-y-3">
        <h3 className="font-semibold text-slate-900 text-sm">
          Recently Added
        </h3>
        {corpus.map((f) => (
          <div
            key={f.id}
            className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg"
          >
            {f.status === "completed" ? (
  <CheckCircle2 className="w-5 h-5 text-green-500" />
) : f.status === "failed" ? (
  <FileText className="w-5 h-5 text-red-500" />
) : (
  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {f.name}
              </p>
              {f.status === "failed" && (
  <p className="text-xs text-red-500 mt-1">
    {f.error && (
    <p className="text-red-500 text-sm">
        {f.error}
    </p>
)}
  </p>
)}
              <div className="w-full bg-slate-100 h-1.5 mt-1 rounded-full overflow-hidden">
                <div
  className={`h-full transition-all duration-300 ${
    f.status === "completed"
      ? "bg-green-500"
      : f.status === "failed"
      ? "bg-red-500"
      : "bg-blue-600"
  }`}
  style={{ width: `${f.status === "failed" ? 100 : f.progress}%` }}
/>
              </div>
            </div>
            <button
              onClick={() => removeFile(f.id)}
              className="text-slate-400 hover:text-red-500 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);
});

UploadPanel.displayName = 'UploadPanel';
export default UploadPanel;