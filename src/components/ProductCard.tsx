import React, { useState } from 'react';
import { 
  Star, 
  Crown, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Battery, 
  Cpu, 
  Sparkles, 
  Scale, 
  Bookmark, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { ProductComparisonItem, Product } from '../types';

interface ProductCardProps {
  item: ProductComparisonItem;
  currency: 'INR' | 'USD';
  userBudgetMax: number | null;
  isSelectedForCompare: boolean;
  onToggleCompare: (productId: string) => void;
  onSelectDecision: (product: Product) => void;
  onViewRationale: (item: ProductComparisonItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  currency,
  userBudgetMax,
  isSelectedForCompare,
  onToggleCompare,
  onSelectDecision,
  onViewRationale,
}) => {
  const [showFullSpecs, setShowFullSpecs] = useState(false);
  const [showProsCons, setShowProsCons] = useState(false);

  const { product, budgetStatus, budgetDiff, overallScore, rankBadge, recommendationRank } = item;
  const isBestChoice = recommendationRank === 1;

  const price = currency === 'USD' ? product.priceUSD : product.priceINR;
  const originalPrice = currency === 'USD' ? Math.round(product.priceUSD * 1.3) : product.originalPriceINR;
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

  const formatCurrency = (val: number) => {
    return currency === 'USD'
      ? `$${val.toLocaleString()}`
      : `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className={`relative rounded-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isBestChoice
          ? 'bg-white border-2 border-indigo-600 shadow-md ring-1 ring-indigo-500/10'
          : 'bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md'
      }`}
    >
      {/* Top Banner for Best Choice */}
      {isBestChoice && (
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-600 px-4 py-1.5 flex items-center justify-between text-white text-xs font-bold shadow-xs">
          <div className="flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce" />
            <span className="tracking-wide uppercase">AI Ranked #1: Best Choice Recommendation</span>
          </div>
          <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] font-mono">
            Score {overallScore}/100
          </span>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {/* Header: Rank Badge & Compare Checkbox */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {!isBestChoice && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {rankBadge}
              </span>
            )}
            {product.highlightTag && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                {product.highlightTag}
              </span>
            )}
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none font-medium">
            <input
              type="checkbox"
              checked={isSelectedForCompare}
              onChange={() => onToggleCompare(product.id)}
              className="rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
            />
            <span>Compare</span>
          </label>
        </div>

        {/* Product Visual & Name */}
        <div className="flex gap-4 mb-4">
          <div className="w-24 h-24 rounded-xl bg-slate-50 p-2 border border-slate-200/80 flex-shrink-0 flex items-center justify-center overflow-hidden relative group">
            <img
              src={product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute bottom-1 right-1 bg-white/90 text-[10px] font-bold text-slate-800 px-1 rounded border border-slate-200 uppercase shadow-2xs">
              {product.brand}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug line-clamp-2">
              {product.name}
            </h3>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mt-1.5 text-xs">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-bold border border-amber-200/80">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                <span>{product.rating}</span>
              </div>
              <span className="text-slate-500 text-[11px]">
                ({product.reviewsCount.toLocaleString()} verified reviews)
              </span>
            </div>

            {/* Price & Discount */}
            <div className="mt-2 flex items-baseline gap-2 flex-wrap">
              <span className="text-xl font-extrabold text-slate-900">
                {formatCurrency(price)}
              </span>
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(originalPrice)}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                {discountPercent}% OFF
              </span>
            </div>
          </div>
        </div>

        {/* Budget Check Indicator (Core Feature 8) */}
        <div className="mb-4">
          {userBudgetMax ? (
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                budgetStatus === 'under'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : budgetStatus === 'exact'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <div className="flex items-center gap-1.5 font-medium">
                {budgetStatus === 'under' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : budgetStatus === 'exact' ? (
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                )}
                <span>
                  {budgetStatus === 'under' && `Under Budget: Save ${formatCurrency(budgetDiff)} (${Math.round((budgetDiff / userBudgetMax) * 100)}% savings)`}
                  {budgetStatus === 'exact' && `Exact Budget Match: Full budget optimization`}
                  {budgetStatus === 'over' && `Exceeds budget by ${formatCurrency(Math.abs(budgetDiff))}`}
                </span>
              </div>
              <span className="text-[10px] font-mono opacity-80 uppercase font-bold">
                Budget Check
              </span>
            </div>
          ) : (
            <div className="p-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-between">
              <span>Value Score: <strong className="text-slate-900">{product.valueForMoneyScore}/10</strong></span>
              <span className="text-emerald-700 font-semibold font-mono">High Value</span>
            </div>
          )}
        </div>

        {/* Key Hardware Specs preview */}
        <div className="space-y-1.5 mb-4 text-xs">
          {Object.entries(product.specs).slice(0, showFullSpecs ? undefined : 3).map(([key, value]) => (
            <div key={key} className="flex items-start justify-between gap-2 py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">{key}:</span>
              <span className="text-slate-800 font-semibold text-right">{value}</span>
            </div>
          ))}
          {Object.keys(product.specs).length > 3 && (
            <button
              onClick={() => setShowFullSpecs(!showFullSpecs)}
              className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 pt-1 font-semibold"
            >
              <span>{showFullSpecs ? 'Show less specs' : `+${Object.keys(product.specs).length - 3} more specs`}</span>
              {showFullSpecs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Pros & Cons Accordion */}
        <div className="mb-4">
          <button
            onClick={() => setShowProsCons(!showProsCons)}
            className="w-full text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-lg flex items-center justify-between border border-slate-200 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
              <span>Advantages & Disadvantages</span>
            </span>
            {showProsCons ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showProsCons && (
            <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="font-bold text-emerald-700 flex items-center gap-1 mb-1 text-[11px] uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Key Advantages (Pros)
                </span>
                <ul className="space-y-1 pl-4 list-disc text-slate-700 text-[11px]">
                  {product.pros.map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="font-bold text-rose-700 flex items-center gap-1 mb-1 text-[11px] uppercase tracking-wider">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" /> Trade-offs (Cons)
                </span>
                <ul className="space-y-1 pl-4 list-disc text-slate-600 text-[11px]">
                  {product.cons.map((con, i) => (
                    <li key={i}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* AI Rationalization Snapshot */}
        <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-slate-800 mb-4 flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-indigo-900 flex items-center gap-1 text-[11px] uppercase">
              <Sparkles className="w-3 h-3 text-indigo-600" /> AI Decision Takeaway:
            </span>
          </div>
          <p className="text-[11px] text-slate-700 leading-relaxed line-clamp-3">
            {item.whyPickThis}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
          <button
            onClick={() => onViewRationale(item)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Why This Won</span>
          </button>

          <button
            onClick={() => onSelectDecision(product)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
              isBestChoice
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Select as Best</span>
          </button>
        </div>

      </div>
    </div>
  );
};
