"use client";

import React, { useState, useEffect, useRef } from 'react';

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

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SpinnerIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

const UploadFileIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const LinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
  </svg>
);


// --- components/SettingsModal.tsx ---
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidated: (apiKey: string) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onValidated,
}: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitialCheck, setIsInitialCheck] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus management and restore state on open
  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('geminiApiKey') || '';
      if (savedKey) {
        setIsInitialCheck(true);
        setApiKey(savedKey);
      } else {
        setIsInitialCheck(false);
        setApiKey('');
        setStatus('idle');
        setErrorMessage('');
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle Escape key and Focus Trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll('button, input, a') || [];
        if (focusable.length === 0) return;
        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced auto-validation logic
  useEffect(() => {
    if (!isOpen) return;

    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      setStatus('idle');
      setErrorMessage('');
      return;
    }

    let isActive = true;

    const validate = async () => {
      setStatus('validating');
      try {
        // Using models list endpoint is lighter and universally correct for validating a Gemini key
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${trimmedKey}`);
        if (!isActive) return;

        if (response.ok) {
          setStatus('success');
          setErrorMessage('');
        } else {
          setStatus('error');
          if (response.status === 400) setErrorMessage('Invalid API key.');
          else if (response.status === 403) setErrorMessage('Gemini API is not enabled or insufficient permissions.');
          else if (response.status === 429) setErrorMessage('Quota exceeded. Check your plan.');
          else setErrorMessage(`Invalid API key (${response.status}).`);
        }
      } catch (err) {
        if (!isActive) return;
        setStatus('error');
        setErrorMessage('Network unavailable. Please check your connection.');
      } finally {
        if (isActive) {
          setIsInitialCheck(false);
        }
      }
    };

    let timerId: ReturnType<typeof setTimeout>;

    if (isInitialCheck) {
      validate(); // Validate instantly if it's the saved key
    } else {
      timerId = setTimeout(validate, 600); // 600ms debounce
    }

    return () => {
      isActive = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [apiKey, isOpen, isInitialCheck]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setStatus('idle');
    setErrorMessage('');
    setIsInitialCheck(false);
  };

  const handleSave = () => {
    if (status === 'success') {
      const finalKey = apiKey.trim();
      localStorage.setItem('geminiApiKey', finalKey);
      localStorage.setItem('apiKeyValidated', 'true');
      onValidated(finalKey);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="text-xl font-bold text-gray-900 mb-1">API Configuration</h2>
        <p className="text-sm text-gray-500 mb-6">Validate your Gemini API key to enable research analysis.</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="apiKeyInput" className="block text-sm font-medium text-gray-700 mb-1.5">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                id="apiKeyInput"
                ref={inputRef}
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={handleInputChange}
                className="w-full pl-4 pr-16 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
                placeholder="AIza..."
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Validation Feedback States */}
            <div className="h-6 mt-2">
              {status === 'validating' && (
                <div className="flex items-center gap-1.5 text-sm text-blue-600 font-medium">
                  <SpinnerIcon className="animate-spin w-3.5 h-3.5" />
                  {isInitialCheck ? 'Checking saved API key...' : 'Validating Gemini API key...'}
                </div>
              )}
              {status === 'success' && (
                <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium animate-in fade-in duration-200">
                  <CheckCircleIcon className="w-4 h-4" />
                  {isInitialCheck ? 'API key is valid.' : 'Gemini API key validated successfully'}
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-1.5 text-sm text-red-600 font-medium animate-in fade-in duration-200">
                  <XCircleIcon className="w-4 h-4" />
                  {errorMessage}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={status !== 'success'}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all active:scale-[0.98]"
          >
            Save Configuration
          </button>

          {/* Quick AI Studio Link */}
          <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Don't have a Gemini API key?</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 group transition-colors"
            >
              Create one for free
              <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- components/Header.tsx ---
export const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 relative z-20">
      <div className="flex items-center">
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">InsightLens</h1>
      </div>
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
          <img src="https://i.pravatar.cc/150?img=11" alt="User avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};


// --- components/Sidebar.tsx ---
export const Sidebar = ({ onSettingsClick }: { onSettingsClick?: () => void }) => {
  return (
    <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col shrink-0 relative z-10">
      <button className="absolute -right-3 top-4 bg-white border border-gray-200 rounded p-0.5 text-gray-400 hover:text-gray-600 shadow-sm z-10">
        <CollapseIcon className="w-4 h-4" direction="left" />
      </button>

      <div className="p-5 pb-6">
        <h2 className="text-[17px] font-semibold text-gray-900 leading-tight mb-1">Research Hub</h2>
        <p className="text-[13px] text-gray-500 mb-5">Manage intelligence</p>
        
        <button className="w-full bg-[#2563eb] hover:bg-blue-700 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 font-medium text-[14px] transition-colors shadow-sm">
          <UploadIcon className="w-4 h-4" />
          Upload Source
        </button>
      </div>

      <div className="px-5">
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
          Research Corpus
        </h3>
        <div className="flex items-center gap-2 text-gray-400">
          <FolderIcon className="w-5 h-5" />
          <span className="text-[13px] font-medium">No sources added yet</span>
        </div>
      </div>

      <div className="mt-auto px-5 py-4 border-t border-gray-100">
        <button 
          onClick={onSettingsClick} 
          className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors w-full"
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[14px] font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};


// --- components/RightPanel.tsx ---
export const RightPanel = () => {
  return (
    <aside className="w-[320px] bg-[#fafafa] border-l border-gray-200 flex flex-col shrink-0 relative z-10">
      <button className="absolute -left-3 top-4 bg-white border border-gray-200 rounded p-0.5 text-gray-400 hover:text-gray-600 shadow-sm z-10">
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

        {/* Quick Support */}
        <div className="mt-auto pt-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h4 className="text-[13px] font-bold text-gray-900 mb-1.5">Quick Support</h4>
            <p className="text-[12px] text-gray-500 mb-3 leading-relaxed">
              Need help setting up your research corpus? Our team is available for 1-on-1 onboarding.
            </p>
            <a href="#" className="text-[12px] font-semibold text-[#2563eb] hover:underline">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};


// --- components/Workspace.tsx ---
export const Workspace = () => {
  return (
    <main className="flex-1 bg-white flex flex-col h-full overflow-hidden relative">
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Background graphic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor" className="text-gray-900">
            <path d="M50 0 C50 30, 70 50, 100 50 C70 50, 50 70, 50 100 C50 70, 30 50, 0 50 C30 50, 50 30, 50 0 Z" />
          </svg>
        </div>

        <div className="flex flex-col items-center px-8 pt-16 pb-16 z-10 w-full max-w-[900px] mx-auto min-h-full">
          {/* Header Text */}
          <h1 className="text-[42px] font-bold text-gray-900 mb-4 text-center tracking-tight">
            Transform Research Into Decisions
          </h1>
          <p className="text-[17px] text-gray-600 mb-10 text-center max-w-2xl">
            Upload reports, research papers, strategy decks, and competitor analyses to build evidence-based decisions.
          </p>

          {/* Info Box */}
          <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-6 mb-12 w-full max-w-[480px] shadow-sm">
            <h3 className="text-[16px] font-semibold text-gray-900 mb-4 text-center leading-snug">
              Most AI tools answer questions.<br />InsightLens helps answer:
            </h3>
            <ul className="space-y-3 px-6">
              <li className="flex items-center gap-3 text-[14px] text-gray-700 font-medium">
                <CheckCircleIcon className="text-[#2563eb] w-5 h-5 flex-shrink-0" />
                Do we have enough evidence?
              </li>
              <li className="flex items-center gap-3 text-[14px] text-gray-700 font-medium">
                <CheckCircleIcon className="text-[#2563eb] w-5 h-5 flex-shrink-0" />
                What are we missing?
              </li>
              <li className="flex items-center gap-3 text-[14px] text-gray-700 font-medium">
                <CheckCircleIcon className="text-[#2563eb] w-5 h-5 flex-shrink-0" />
                What should we do next?
              </li>
            </ul>
          </div>

          {/* Upload Panel */}
          <div className="w-full max-w-[640px] bg-white border border-gray-200 rounded-[24px] p-10 flex flex-col items-center shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] mb-8">
            <div className="w-12 h-12 bg-[#eff6ff] text-[#2563eb] rounded-full flex items-center justify-center mb-5">
              <UploadFileIcon className="w-6 h-6" />
            </div>
            
            <h2 className="text-[20px] font-bold text-gray-900 mb-1 text-center">
              Upload Research / Drag & Drop Files
            </h2>
            <p className="text-[14px] text-gray-500 mb-6 text-center">
              Select files from your computer or workspace
            </p>
            
            <div className="flex flex-col gap-3 w-full max-w-[220px]">
              <button className="w-full bg-[#2563eb] text-white hover:bg-blue-700 py-2.5 rounded-lg font-medium text-[14px] transition-colors shadow-sm">
                Upload Sources
              </button>
              <button className="w-full bg-[#f8fafc] text-[#2563eb] border border-[#cbd5e1] hover:bg-[#f1f5f9] py-2.5 rounded-lg font-medium text-[14px] transition-colors">
                Use Sample Project
              </button>
            </div>

            <p className="text-[14px] text-gray-900 font-medium mt-8 mb-4 text-center">
              Load a pre-built research project and try the platform instantly.
            </p>

            <div className="flex items-center gap-6 text-gray-400">
              <div className="flex items-center gap-1.5">
                <FileTextIcon className="w-4 h-4" />
                <span className="text-[12px] font-bold tracking-wide">PDF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileTextIcon className="w-4 h-4" />
                <span className="text-[12px] font-bold tracking-wide">DOCX</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileTextIcon className="w-4 h-4" />
                <span className="text-[12px] font-bold tracking-wide">TXT</span>
              </div>
              <div className="flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4" />
                <span className="text-[12px] font-bold tracking-wide">URL</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Fixed Footer: How It Works */}
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
            <span className="text-[14px] font-bold text-slate-900">Upload Research</span>
          </div>

          <ArrowRightIcon className="w-4 h-4 text-slate-300" />

          {/* Step 2 */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full border-2 border-slate-300 text-slate-500 flex items-center justify-center font-bold text-[13px]">
              2
            </div>
            <span className="text-[14px] font-semibold text-slate-600">Build Corpus</span>
          </div>

          <ArrowRightIcon className="w-4 h-4 text-slate-300" />

          {/* Step 3 */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full border-2 border-slate-300 text-slate-500 flex items-center justify-center font-bold text-[13px]">
              3
            </div>
            <span className="text-[14px] font-semibold text-slate-600">Analyze & Decide</span>
          </div>

        </div>
      </div>

    </main>
  );
};
