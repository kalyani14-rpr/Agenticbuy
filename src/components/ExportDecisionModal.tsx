import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Sparkles,
  Share2
} from 'lucide-react';
import { ProductComparisonItem, ShoppingRequirements, Product } from '../types';

interface ExportDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bestProduct?: Product;
  requirements: ShoppingRequirements | null;
  comparisonItems?: ProductComparisonItem[];
  decisionExplanation?: {
    summary: string;
    whyBestChoiceWon: string;
    runnerUpTradeoff: string;
    valueForMoneyVerdict: string;
    budgetVerdict: string;
  };
  currency: 'INR' | 'USD';
}

export const ExportDecisionModal: React.FC<ExportDecisionModalProps> = ({
  isOpen,
  onClose,
  bestProduct,
  requirements,
  comparisonItems,
  decisionExplanation,
  currency,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !bestProduct) return null;

  const priceStr = currency === 'USD' ? `$${bestProduct.priceUSD}` : `₹${bestProduct.priceINR.toLocaleString('en-IN')}`;
  const budgetStr = requirements?.budgetMax ? (currency === 'USD' ? `$${requirements.budgetMax}` : `₹${requirements.budgetMax.toLocaleString('en-IN')}`) : 'Flexible';

  const markdownContent = `# 🛍️ AgenticBuy AI – Decision Summary Report
Generated on: ${new Date().toLocaleString()}

## 🎯 Shopping Objective & Constraints
- **Target Category:** ${requirements?.category ? requirements.category.toUpperCase() : 'Not specified'}
- **Primary Use Case:** ${requirements?.intendedUse || 'General'}
- **Budget Ceiling:** ${budgetStr}
- **Preferred Brands:** ${requirements?.preferredBrands.join(', ') || 'Any'}
- **Required Features:** ${requirements?.requiredFeatures.join(', ') || 'Standard'}

---

## 🥇 AI Recommended Best Choice: ${bestProduct.name}
- **Brand:** ${bestProduct.brand}
- **Price:** ${priceStr} (Value Score: ${bestProduct.valueForMoneyScore}/10)
- **User Rating:** ${bestProduct.rating}★ (${bestProduct.reviewsCount.toLocaleString()} reviews)
- **Key Hardware Specs:**
${Object.entries(bestProduct.specs).map(([k, v]) => `  - **${k}:** ${v}`).join('\n')}

### ✨ Why It Won:
${decisionExplanation?.whyBestChoiceWon || 'Ranked #1 for optimal balance of performance, budget compliance, and real-world durability.'}

### ⚖️ Trade-off Analysis:
${decisionExplanation?.runnerUpTradeoff || 'Balanced trade-offs against runner-up alternatives.'}

### 💰 Budget & Value Verdict:
${decisionExplanation?.budgetVerdict || 'Compliant with stated budget requirements.'}

---
*Generated autonomously by AgenticBuy AI Decision Assistant*
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgenticBuy-Decision-${bestProduct.name.replace(/[^a-z0-9]/gi, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Export Purchasing Decision Summary
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Share or save this documented decision report
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Markdown Container */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin font-mono text-xs text-slate-700 bg-slate-50 m-4 rounded-xl border border-slate-200/90 whitespace-pre-wrap leading-relaxed">
          {markdownContent}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download .MD Report</span>
          </button>
        </div>

      </div>
    </div>
  );
};
