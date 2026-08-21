import React from 'react';
import { 
  Bot, 
  Sparkles, 
  Database, 
  Bookmark, 
  HelpCircle, 
  RotateCcw,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface HeaderProps {
  currency: 'INR' | 'USD';
  onCurrencyToggle: () => void;
  onOpenCatalog: () => void;
  onOpenSavedDecisions: () => void;
  onOpenHowItWorks: () => void;
  onResetChat: () => void;
  savedCount: number;
  catalogCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyToggle,
  onOpenCatalog,
  onOpenSavedDecisions,
  onOpenHowItWorks,
  onResetChat,
  savedCount,
  catalogCount,
}) => {
  return (
    <header id="app-header" className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/20">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  AgenticBuy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-300 font-extrabold">AI</span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Zap className="w-3 h-3" /> Autonomous Agent
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">
                Intelligent Shopping & Agentic Purchasing Engine
              </p>
            </div>
          </div>

          {/* Mobile Actions quick row */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <button
              id="mobile-currency-btn"
              onClick={onCurrencyToggle}
              className="px-2 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-200 border border-slate-700"
            >
              {currency === 'INR' ? '₹ INR' : '$ USD'}
            </button>
          </div>
        </div>

        {/* Global Controls & Tools */}
        <div className="flex items-center flex-wrap gap-2 justify-end w-full sm:w-auto">
          {/* Currency Switcher */}
          <div className="hidden sm:flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
            <button
              id="currency-inr-btn"
              onClick={() => currency !== 'INR' && onCurrencyToggle()}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                currency === 'INR'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ₹ INR
            </button>
            <button
              id="currency-usd-btn"
              onClick={() => currency !== 'USD' && onCurrencyToggle()}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                currency === 'USD'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Sample Catalog Button */}
          <button
            id="catalog-modal-trigger"
            onClick={onOpenCatalog}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-all shadow-sm"
            title="Browse verified product catalog"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Catalog Database</span>
            <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 text-[10px] rounded-full font-mono font-bold">
              {catalogCount}
            </span>
          </button>

          {/* Saved Decisions Button */}
          <button
            id="saved-decisions-trigger"
            onClick={onOpenSavedDecisions}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-all shadow-sm relative"
            title="View finalized purchasing decisions"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Saved Decisions</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* How Agent Works Info */}
          <button
            id="how-it-works-trigger"
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-all"
            title="Learn about the Agentic decision workflow"
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Agent Architecture</span>
          </button>

          {/* Reset Chat */}
          <button
            id="reset-chat-trigger"
            onClick={onResetChat}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
            title="Start new shopping session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Demo Notice Banner */}
      <div className="bg-slate-950 px-4 py-1 flex items-center justify-center gap-2 text-[11px] text-slate-400 border-t border-slate-800/60">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        <span>
          <strong className="text-slate-300 font-medium">Sleek Agentic Intelligence:</strong> Real tech market specs with Gemini autonomous requirement extraction & decision logic.
        </span>
      </div>
    </header>
  );
};
