import React from 'react';
import { 
  Bookmark, 
  X, 
  Trash2, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Download,
  Share2
} from 'lucide-react';
import { SavedDecision } from '../types';

interface SavedDecisionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: SavedDecision[];
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
  currency: 'INR' | 'USD';
  onViewDecision: (decision: SavedDecision) => void;
}

export const SavedDecisionsDrawer: React.FC<SavedDecisionsDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onDeleteDecision,
  onClearAll,
  currency,
  onViewDecision,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shadow-xs">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Saved Purchasing Decisions
              </h3>
              <p className="text-[11px] text-slate-500 font-normal">
                {savedDecisions.length} finalized product choices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {savedDecisions.length > 0 && (
              <button
                onClick={onClearAll}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs transition-colors"
                title="Clear all saved decisions"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin bg-slate-50/50">
          {savedDecisions.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center px-4">
              <Bookmark className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-800">No saved decisions yet</p>
              <p className="text-xs text-slate-500 mt-1">
                When you find your perfect product, click "Finalize & Save Decision" to store it here.
              </p>
            </div>
          ) : (
            savedDecisions.map((dec) => {
              const price = currency === 'USD' ? dec.bestProduct.priceUSD : dec.bestProduct.priceINR;
              const formattedPrice = currency === 'USD' ? `$${price}` : `₹${price.toLocaleString('en-IN')}`;

              return (
                <div
                  key={dec.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5 relative group hover:border-slate-300 shadow-2xs transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>{dec.title}</span>
                    </div>

                    <button
                      onClick={() => onDeleteDecision(dec.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Delete decision"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <img
                      src={dec.bestProduct.imageUrl}
                      alt={dec.bestProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover rounded-xl bg-slate-50 border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <h4 className="font-bold text-slate-900 truncate">
                        {dec.bestProduct.name}
                      </h4>
                      <p className="text-emerald-700 font-extrabold mt-0.5">
                        {formattedPrice}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(dec.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Requirements chips */}
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {dec.requirements.category && (
                      <span className="bg-slate-50 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 capitalize font-medium">
                        {dec.requirements.category}
                      </span>
                    )}
                    {dec.requirements.intendedUse && (
                      <span className="bg-slate-50 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 font-medium">
                        {dec.requirements.intendedUse}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{dec.explanation}"
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors shadow-2xs"
          >
            Close Drawer
          </button>
        </div>

      </div>
    </div>
  );
};
