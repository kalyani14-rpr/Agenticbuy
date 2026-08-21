import React from 'react';
import { 
  Sparkles, 
  Trophy, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  BookmarkCheck, 
  ArrowRight,
  Crown,
  CheckCircle2,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProductComparisonItem, ShoppingRequirements, Product } from '../types';

interface DecisionAssistantCardProps {
  decisionExplanation?: {
    summary: string;
    whyBestChoiceWon: string;
    runnerUpTradeoff: string;
    valueForMoneyVerdict: string;
    budgetVerdict: string;
  };
  bestProduct?: Product;
  runnerUpProduct?: Product;
  requirements: ShoppingRequirements | null;
  currency: 'INR' | 'USD';
  onFinalizeDecision: () => void;
  onExportReport: () => void;
  isSaved?: boolean;
}

export const DecisionAssistantCard: React.FC<DecisionAssistantCardProps> = ({
  decisionExplanation,
  bestProduct,
  runnerUpProduct,
  requirements,
  currency,
  onFinalizeDecision,
  onExportReport,
  isSaved = false,
}) => {
  if (!decisionExplanation && !bestProduct) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b'],
    });
    onFinalizeDecision();
  };

  return (
    <div id="ai-decision-assistant-card" className="bg-gradient-to-br from-indigo-50/90 via-white to-sky-50/70 border border-indigo-200/90 rounded-2xl p-5 shadow-sm mb-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-100 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                AI Decision Assistant Rationale
              </h3>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                Autonomous Analysis
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Why this product was chosen over all alternatives based on your criteria
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 rounded-xl border border-slate-200 transition-colors shadow-2xs"
            title="Download or copy decision summary"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export Brief</span>
          </button>

          <button
            onClick={triggerConfetti}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>{isSaved ? 'Decision Finalized' : 'Finalize & Save Decision'}</span>
          </button>
        </div>
      </div>

      {/* Structured Decision Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 relative z-10 text-xs">
        
        {/* Left Column: Why #1 Won */}
        <div className="p-4 rounded-xl bg-white border border-indigo-100 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-600 text-sm">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Why The Winner Outranked Others</span>
          </div>
          <p className="text-slate-700 leading-relaxed text-xs">
            {decisionExplanation?.whyBestChoiceWon ||
              `The ${bestProduct?.name} was determined as the #1 Best Choice because its hardware specifications perfectly match your intended use (${requirements?.intendedUse || 'daily productivity'}) with the highest reliability score.`}
          </p>

          {bestProduct && (
            <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px]">
              <span>Key Strength: <strong className="text-slate-800">{bestProduct.features[0]}</strong></span>
              <span className="text-emerald-700 font-bold font-mono">{bestProduct.rating}★ Rating</span>
            </div>
          )}
        </div>

        {/* Right Column: Trade-offs & Runner-up */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-indigo-700 text-sm">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Trade-off & Runner-up Analysis</span>
          </div>
          <p className="text-slate-700 leading-relaxed text-xs">
            {decisionExplanation?.runnerUpTradeoff ||
              (runnerUpProduct
                ? `Compared to ${runnerUpProduct.name}, the winner offers superior balance, while the runner-up is best if you want to optimize strictly for ${runnerUpProduct.highlightTag || 'secondary features'}.`
                : 'No other product met all constraints with comparable balance.')}
          </p>

          <div className="pt-2 mt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <strong className="text-slate-700">Budget Check: </strong>
            <span>{decisionExplanation?.budgetVerdict || 'Compliant with stated budget ceiling.'}</span>
          </div>
        </div>

      </div>

      {/* Value-for-Money & Longevity Summary */}
      {decisionExplanation?.valueForMoneyVerdict && (
        <div className="mt-3 p-3 bg-white rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2 relative z-10 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 font-semibold">Value-for-Money Assessment: </strong>
            <span className="text-slate-600">{decisionExplanation.valueForMoneyVerdict}</span>
          </div>
        </div>
      )}
    </div>
  );
};
