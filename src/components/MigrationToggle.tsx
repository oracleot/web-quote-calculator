'use client';

interface MigrationToggleProps {
  isMigration: boolean;
  onChange: (isMigration: boolean) => void;
}

export default function MigrationToggle({ isMigration, onChange }: MigrationToggleProps) {
  return (
    <div className="mb-6">
      <p className="text-xs font-medium text-[#64748b] mb-3 px-1">Project type:</p>

      {/* Desktop: side-by-side cards */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-3">
        <button
          onClick={() => onChange(false)}
          className={`select-card p-4 text-left w-full transition-all duration-200 ${!isMigration ? 'selected' : ''}`}
        >
          <div className="flex items-start gap-3 relative z-10">
            <div className={`mt-0.5 flex-shrink-0 ${!isMigration ? 'text-[#818cf8]' : 'text-[#64748b]'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white text-sm leading-tight">New website</div>
              <div className="text-xs text-[#64748b] leading-tight mt-0.5">Build from scratch</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onChange(true)}
          className={`select-card p-4 text-left w-full transition-all duration-200 ${isMigration ? 'selected' : ''}`}
        >
          <div className="flex items-start gap-3 relative z-10">
            <div className={`mt-0.5 flex-shrink-0 ${isMigration ? 'text-[#818cf8]' : 'text-[#64748b]'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white text-sm leading-tight">Migrate existing website</div>
              <div className="text-xs text-[#64748b] leading-tight mt-0.5">
                Includes full site audit, content transfer, and redirect setup
                <span className="ml-1 text-[#818cf8] font-medium">(+£100)</span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Mobile: segmented control */}
      <div className="sm:hidden flex bg-[rgba(255,255,255,0.04)] rounded-lg p-0.5 border border-[rgba(255,255,255,0.06)]">
        <button
          onClick={() => onChange(false)}
          className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
            !isMigration ? 'bg-[#818cf8] text-white shadow-sm' : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          New website
        </button>
        <button
          onClick={() => onChange(true)}
          className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
            isMigration ? 'bg-[#818cf8] text-white shadow-sm' : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          Migrate (+£100)
        </button>
      </div>

      {isMigration && (
        <p className="sm:hidden text-xs text-[#64748b] mt-2 px-1">
          Includes full site audit, content transfer, and redirect setup
        </p>
      )}
    </div>
  );
}
