import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Filter, 
  Database, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../data/products';
import { Product } from '../types';

interface CatalogExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'INR' | 'USD';
  onSelectProductForChat: (product: Product) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'smartphones', label: 'Smartphones' },
  { id: 'headphones', label: 'Audio & Headphones' },
  { id: 'tablets', label: 'Tablets' },
  { id: 'smartwatches', label: 'Smartwatches' },
  { id: 'monitors', label: 'Monitors' },
  { id: 'keyboards', label: 'Keyboards' },
];

export const CatalogExplorerModal: React.FC<CatalogExplorerModalProps> = ({
  isOpen,
  onClose,
  currency,
  onSelectProductForChat,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(100000);

  if (!isOpen) return null;

  const filteredProducts = SAMPLE_PRODUCTS.filter((product) => {
    const matchesCat =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.intendedUses.some(u => u.toLowerCase().includes(searchQuery.toLowerCase()));
    const price = currency === 'USD' ? product.priceUSD : product.priceINR;
    const limit = currency === 'USD' ? maxPriceFilter / 80 : maxPriceFilter;
    const matchesPrice = price <= limit;

    return matchesCat && matchesQuery && matchesPrice;
  });

  const formatPrice = (p: Product) => {
    return currency === 'USD'
      ? `$${p.priceUSD.toLocaleString()}`
      : `₹${p.priceINR.toLocaleString('en-IN')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Sample Product Catalog Database
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  ({SAMPLE_PRODUCTS.length} Verified Tech Items)
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Explore available hardware specs, benchmarks, and market prices
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, brand (ASUS, Sony, Apple), or feature..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
              />
            </div>

            {/* Category Select on mobile */}
            <div className="sm:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 shadow-2xs"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Category Pills */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin bg-slate-50/40">
          {filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <Database className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-800">No products match this filter</p>
              <p className="text-xs text-slate-500 mt-1">Try broadening your search term or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group shadow-2xs"
                >
                  <div>
                    <div className="relative h-36 w-full rounded-xl bg-slate-50 overflow-hidden mb-3 border border-slate-100">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-white/90 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase shadow-2xs">
                        {p.category}
                      </span>
                      {p.highlightTag && (
                        <span className="absolute bottom-2 left-2 bg-indigo-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                          {p.highlightTag}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-500">{p.brand}</span>
                      <div className="flex items-center gap-1 text-[11px] text-amber-800 font-bold bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{p.rating}</span>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-2 leading-snug">
                      {p.name}
                    </h4>

                    {/* Quick specs chips */}
                    <div className="space-y-1 mb-3 text-[11px]">
                      {Object.entries(p.specs).slice(0, 2).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-slate-500">
                          <span>{k}:</span>
                          <span className="text-slate-800 font-medium truncate max-w-[150px]">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-slate-900">
                        {formatPrice(p)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectProductForChat(p);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Ask AI</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredProducts.length} of {SAMPLE_PRODUCTS.length} sample products</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
