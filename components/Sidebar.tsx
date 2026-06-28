import React from 'react';
import { ResearchFile } from '../components/UploadPanel';
import { Loader2, CheckCircle2, FileText, KeyRound, LifeBuoy, Info } from 'lucide-react';

const CollapseIcon = ({ className, direction = 'left' }: { className?: string; direction?: 'left' | 'right' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    {direction === 'left' ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    )}
  </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface SidebarProps {
  corpus: (ResearchFile & { selected?: boolean })[];
  selectedFileId: string | null;
  onFileSelect: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onUploadClick: () => void;
  onConfigureApi: () => void;
  onContactSupport: () => void;
  onAbout: () => void;
  onCollapse: () => void;
}

export const Sidebar = ({
    onConfigureApi,
    onContactSupport,
    onAbout,
    onUploadClick,
    onFileSelect,
    onToggleSelect,
    corpus,
    selectedFileId,
    onCollapse
}: SidebarProps) => {

    const [settingsMenuOpen, setSettingsMenuOpen] = React.useState(false);

    const selectedCount = corpus.filter(
        file => file.selected
    ).length;

    const readyCount = corpus.filter(
        file => file.selected && file.status === "completed"
    ).length;

    const failedCount = corpus.filter(
        file => file.selected && file.status === "failed"
    ).length;

    return (
    <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col shrink-0 relative z-10">
            <button
        onClick={onCollapse}
        className="absolute -right-3 top-4 bg-white border border-gray-200 rounded p-0.5 text-gray-400 hover:text-gray-600 shadow-sm z-10"
        aria-label="Collapse left panel"
      >
        <CollapseIcon className="w-4 h-4" direction="left" />
      </button>

      <div className="p-5 pb-6">
        <h2 className="text-[17px] font-semibold text-gray-900 leading-tight mb-1">Research Hub</h2>
        <p className="text-[13px] text-gray-500 mb-5">Manage intelligence</p>
        
        <button onClick={onUploadClick} className="w-full bg-[#2563eb] hover:bg-blue-700 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 font-medium text-[14px] transition-colors shadow-sm">
          <UploadIcon className="w-4 h-4" />
          Upload Source
        </button>
      </div>

      <div className="px-5 flex-1 overflow-y-auto">
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
          Research Corpus
        </h3>

        {corpus.length > 0 && (
  <div className="mb-4">
    <p className="text-[13px] font-semibold text-blue-600">
      {selectedCount} Sources Selected
    </p>

    <p className="text-[12px] text-gray-500 mt-1">
  <span className="text-green-600 font-medium">
    ✓ {readyCount} Ready
  </span>

  {failedCount > 0 && (
    <span className="text-amber-600 font-medium">
      {" • "}
      ⚠ {failedCount} Need Attention
    </span>
  )}
</p>
  </div>
)}
        
        {corpus.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-100 rounded-lg">
            <FileText className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-[13px] text-gray-400">No files uploaded yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {corpus.map((file) => {
              const isSelected = selectedFileId === file.id;
              return (
                <div 
                  key={file.id}
                  className={`flex items-center gap-3 p-2 rounded-md transition-colors border cursor-pointer hover:bg-gray-50 ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'border-transparent'
                  }`}
                >
                  <input 
                    type="checkbox"
                    checked={!!file.selected}
                    onChange={(e) => { e.stopPropagation(); onToggleSelect(file.id); }}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />

                  <div onClick={() => onFileSelect(file.id)} className="flex items-center gap-3 flex-1 min-w-0">
                    {file.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    ) : file.status === 'uploading' ? (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                    
                    <div className="flex flex-col min-w-0">
                      <span className={`text-[13px] font-medium truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                        {file.name}
                      </span>
                      {file.status === 'uploading' && (
                        <div className="text-[10px] text-blue-600 font-bold tabular-nums">
                          {Math.round(file.progress)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

            <div className="mt-auto px-5 py-4 border-t border-gray-100 relative">
        {settingsMenuOpen && (
  <div className="absolute bottom-14 left-5 right-5 rounded-xl border border-gray-200 bg-white p-2 shadow-lg z-30">

    <button
      onClick={() => {
        setSettingsMenuOpen(false);
        onConfigureApi();
      }}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-gray-700 hover:bg-gray-50"
    >
      <KeyRound className="h-4 w-4 text-blue-600" />
      Configure API
    </button>

    <button
      onClick={() => {
        setSettingsMenuOpen(false);
        onContactSupport();
      }}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-gray-700 hover:bg-gray-50"
    >
      <LifeBuoy className="h-4 w-4 text-blue-600" />
      Contact Support
    </button>

    <button
      onClick={() => {
        setSettingsMenuOpen(false);
        onAbout();
      }}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-gray-700 hover:bg-gray-50"
    >
      <Info className="h-4 w-4 text-blue-600" />
      About
    </button>

  </div>
)}

<button
  onClick={() => setSettingsMenuOpen((open) => !open)}
  className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors w-full"
>
  <SettingsIcon className="w-5 h-5" />
  <span className="text-[14px] font-medium">Settings</span>
</button>

</div>
</aside>
);
};