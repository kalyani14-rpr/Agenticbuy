import React from 'react';
import { 
  Scale, 
  CheckCircle2, 
  XCircle, 
  Crown, 
  Sparkles, 
  ArrowRight, 
  X,
  Star,
  Award
} from 'lucide-react';
import { ProductComparisonItem, Product } from '../types';

interface ProductComparisonSectionProps {
  products: ProductComparisonItem[];
  currency: 'INR' | 'USD';
  userBudgetMax: number | null;
  onClose?: () => void;
  onSelectDecision: (product: Product) => void;
}

export const ProductComparisonSection: React.FC<ProductComparisonSectionProps> = ({
  products,
  currency,
  userBudgetMax,
  onClose,
  onSelectDecision,
}) => {
  if (!products || products.length === 0) return null;

  const formatPrice = (p: Product) => {
    return currency === 'USD'
      ? `$${p.priceUSD.toLocaleString()}`
      : `₹${p.priceINR.toLocaleString('en-IN')}`;
  };

  // Collect all unique spec keys
  const allSpecKeys: string[] = Array.from(
    new Set(products.flatMap(item => Object.keys(item.product.specs)))
  );

  return (
    <div id="product-comparison-section" className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-xs">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Side-by-Side Product Comparison & Trade-off Matrix
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              Comparing {products.length} shortlisted contenders across price, hardware, value, and pros/cons
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Comparison Table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-3.5 bg-slate-50 text-slate-700 font-bold border-b border-slate-200 min-w-[140px]">
                Criteria / Spec
              </th>
              {products.map((item, idx) => {
                const isBest = idx === 0;
                return (
                  <th
                    key={item.product.id}
                    className={`p-3.5 border-b border-slate-200 min-w-[220px] transition-colors ${
                      isBest
                        ? 'bg-indigo-50/50 border-t-2 border-t-indigo-600'
                        : 'bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[11px] font-bold text-slate-600">
                        {item.rankBadge}
                      </span>
                      {isBest && (
                        <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      )}
                    </div>
                    <div className="font-bold text-slate-900 text-sm line-clamp-1">
                      {item.product.name}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {/* Visual Thumbnail */}
            <tr>
              <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">
                Visual
              </td>
              {products.map(item => (
                <td key={item.product.id} className="p-3 bg-white">
                  <div className="w-16 h-16 rounded-xl bg-slate-50 p-1 border border-slate-200 overflow-hidden shadow-2xs">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </td>
              ))}
            </tr>

            {/* Price Row */}
            <tr>
              <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">
                Price & Budget
              </td>
              {products.map(item => (
                <td key={item.product.id} className="p-3 bg-white">
                  <div className="text-sm font-extrabold text-slate-900">
                    {formatPrice(item.product)}
                  </div>
                  <div className="text-[11px] font-medium mt-0.5">
                    {item.budgetStatus === 'under' ? (
                      <span className="text-emerald-700 font-semibold">
                        ✓ Under Budget ({currency === 'USD' ? `$${item.budgetDiff}` : `₹${item.budgetDiff.toLocaleString('en-IN')}`} savings)
                      </span>
                    ) : item.budgetStatus === 'exact' ? (
                      <span className="text-indigo-700 font-semibold">
                        ✓ Exact Target Budget
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold">
                        ⚠ +{currency === 'USD' ? `$${Math.abs(item.budgetDiff)}` : `₹${Math.abs(item.budgetDiff).toLocaleString('en-IN')}`} over
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Rating & Review count */}
            <tr>
              <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">
                Rating & Reviews
              </td>
              {products.map(item => (
                <td key={item.product.id} className="p-3 bg-white">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-bold border border-amber-200/80">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{item.product.rating}</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">
                      ({item.product.reviewsCount.toLocaleString()} reviews)
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Value for money score */}
            <tr>
              <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">
                Value For Money
              </td>
              {products.map(item => (
                <td key={item.product.id} className="p-3 bg-white">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-teal-500 h-full rounded-full"
                        style={{ width: `${item.product.valueForMoneyScore * 10}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-slate-800">
                      {item.product.valueForMoneyScore}/10
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Hardware Specs Rows */}
            {allSpecKeys.map(specKey => (
              <tr key={specKey}>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50/50">
                  {specKey}
                </td>
                {products.map(item => (
                  <td key={item.product.id} className="p-3 text-slate-800 bg-white font-medium">
                    {item.product.specs[specKey] || '—'}
                  </td>
                ))}
              </tr>
            ))}

            {/* Top Pros */}
            <tr>
              <td className="p-3 font-semibold text-emerald-700 bg-slate-50/50">
                Top Advantage
              </td>
              {products.map(item => (
                <td key={item.product.id} className="p-3 text-emerald-900 bg-white text-[11px] leading-relaxed">
                  <div className="flex items-start gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{item.product.pros[0]}</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Main Trade-off (Con) */}
            <tr>
              <td className="p-3 font-semibold text-rose-700 bg-slate-50/50">
                Trade-off / Con
              </td>
              {products.map(item => (
                <td key={item.product.id} className="p-3 text-rose-900 bg-white text-[11px] leading-relaxed">
                  <div className="flex items-start gap-1">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{item.product.cons[0]}</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Agent Verdict & Action */}
            <tr>
              <td className="p-3 font-semibold text-indigo-700 bg-slate-50/50">
                Agent Verdict
              </td>
              {products.map(item => (
                <td key={item.product.id} className="p-3 bg-white">
                  <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                    {item.whyPickThis}
                  </p>
                  <button
                    onClick={() => onSelectDecision(item.product)}
                    className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Select This</span>
                  </button>
                </td>
              ))}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};
