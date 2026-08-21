import React, { useState } from 'react';
import { 
  Tag, 
  Wallet, 
  Target, 
  SlidersHorizontal, 
  Sparkles, 
  X, 
  Check, 
  AlertCircle,
  Layers
} from 'lucide-react';
import { ShoppingRequirements } from '../types';

interface RequirementExtractionBarProps {
  requirements: ShoppingRequirements | null;
  onUpdateRequirements: (newReqs: ShoppingRequirements) => void;
  currency: 'INR' | 'USD';
}

export const RequirementExtractionBar: React.FC<RequirementExtractionBarProps> = ({
  requirements,
  onUpdateRequirements,
  currency,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editBudget, setEditBudget] = useState<string>(
    requirements?.budgetMax ? String(requirements.budgetMax) : ''
  );
  const [editPurpose, setEditPurpose] = useState<string>(requirements?.intendedUse || '');
  const [editBrand, setEditBrand] = useState<string>(requirements?.preferredBrands.join(', ') || '');

  if (!requirements || (!requirements.category && !requirements.budgetMax && !requirements.intendedUse)) {
    return null;
  }

  const handleSave = () => {
    const updated: ShoppingRequirements = {
      ...requirements,
      budgetMax: editBudget ? Number(editBudget.replace(/[^0-9.]/g, '')) : null,
      intendedUse: editPurpose || null,
      preferredBrands: editBrand
        ? editBrand.split(',').map(b => b.trim()).filter(Boolean)
        : [],
    };
    onUpdateRequirements(updated);
    setIsEditing(false);
  };

  const budgetDisplay = requirements.budgetMax
    ? currency === 'USD'
      ? `$${requirements.budgetMax.toLocaleString()}`
      : `₹${requirements.budgetMax.toLocaleString('en-IN')}`
    : 'No strict limit';

  return (
    <div id="requirement-extraction-bar" className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm mb-4 relative overflow-hidden">
      {/* Background subtle accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
        
        {/* Left: Requirements Summary */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Extracted Intent:</span>
          </div>

          {/* Category Chip */}
          {requirements.category && (
            <div className="flex items-center gap-1 text-xs bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
              <Layers className="w-3 h-3 text-indigo-600" />
              <span className="text-slate-500 font-medium">Category:</span>
              <strong className="capitalize text-slate-900">{requirements.category}</strong>
            </div>
          )}

          {/* Budget Chip */}
          <div className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200/80">
            <Wallet className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-700/80 font-medium">Budget:</span>
            <strong className="text-emerald-900">{budgetDisplay}</strong>
          </div>

          {/* Purpose Chip */}
          {requirements.intendedUse && (
            <div className="flex items-center gap-1 text-xs bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200/80">
              <Target className="w-3 h-3 text-amber-600" />
              <span className="text-amber-700/80 font-medium">Purpose:</span>
              <strong className="text-amber-950">{requirements.intendedUse}</strong>
            </div>
          )}

          {/* Preferred Brands Chip */}
          {requirements.preferredBrands.length > 0 && (
            <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg border border-purple-200/80">
              <Tag className="w-3 h-3 text-purple-600" />
              <span className="text-purple-700/80 font-medium">Brands:</span>
              <strong className="text-purple-950">{requirements.preferredBrands.join(', ')}</strong>
            </div>
          )}

          {/* Missing info notice if any */}
          {requirements.missingFields.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              <span>Missing: {requirements.missingFields.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Right: Quick Refine button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditBudget(requirements.budgetMax ? String(requirements.budgetMax) : '');
              setEditPurpose(requirements.intendedUse || '');
              setEditBrand(requirements.preferredBrands.join(', ') || '');
              setIsEditing(!isEditing);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isEditing ? 'Cancel Edit' : 'Refine Filters'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Refinement Form Popover */}
      {isEditing && (
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Max Budget ({currency})</label>
            <input
              type="text"
              value={editBudget}
              onChange={(e) => setEditBudget(e.target.value)}
              placeholder="e.g. 60000"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Intended Primary Use</label>
            <input
              type="text"
              value={editPurpose}
              onChange={(e) => setEditPurpose(e.target.value)}
              placeholder="e.g. Coding & Dev, Gaming, Study"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Preferred Brands (Comma separated)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editBrand}
                onChange={(e) => setEditBrand(e.target.value)}
                placeholder="e.g. ASUS, Lenovo, Sony"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
              />
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg flex items-center gap-1 transition-colors flex-shrink-0 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" /> Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
