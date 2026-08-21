import React from 'react';
import { 
  X, 
  BrainCircuit, 
  ArrowRight, 
  CheckCircle2, 
  Scale, 
  Trophy, 
  Sparkles, 
  Database,
  Layers,
  Zap,
  Code
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WORKFLOW_STEPS = [
  {
    step: '1',
    title: 'Natural Language Understanding',
    desc: 'Extracts semantic parameters from raw user sentences (e.g. "laptop for coding under ₹60,000 with good battery").',
    icon: <BrainCircuit className="w-5 h-5 text-indigo-400" />,
  },
  {
    step: '2',
    title: 'Missing Attribute Gap Detection',
    desc: 'Identifies missing constraints (budget, brand, battery priority) and prompts clarifying follow-up questions proactively.',
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
  },
  {
    step: '3',
    title: 'Multi-Tier Catalog Filtering',
    desc: 'Queries catalog database by category, budget ceiling, and hardware capabilities.',
    icon: <Database className="w-5 h-5 text-blue-400" />,
  },
  {
    step: '4',
    title: 'Trade-off & Matrix Comparison',
    desc: 'Computes price-to-performance ratio, battery endurance, and compares pros vs. cons.',
    icon: <Scale className="w-5 h-5 text-teal-400" />,
  },
  {
    step: '5',
    title: 'Autonomous Ranking & Winner Selection',
    desc: 'Selects the single #1 "Best Choice" and positions runner-up value/performance alternates.',
    icon: <Trophy className="w-5 h-5 text-yellow-400" />,
  },
  {
    step: '6',
    title: 'Decision Rationale Generation',
    desc: 'Explains WHY the recommendation won rather than dumping a raw product link list.',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  },
];

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Agentic Commerce Architecture
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/80">
                  Autonomous Decision Engine
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                How AgenticBuy AI goes beyond basic chatbots to act as an autonomous shopping agent
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin bg-slate-50/40">
          
          {/* Concept Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs text-slate-700 leading-relaxed shadow-2xs">
            <p className="font-bold text-indigo-900 mb-1 text-sm">
              🤖 The Paradigm Shift: Chatbot vs. Agentic Decision System
            </p>
            <p>
              Traditional e-commerce chatbots only perform keyword search or regurgitate links. <strong>AgenticBuy AI</strong> executes a stateful reasoning loop: it assesses requirements, identifies missing variables, audits trade-offs, computes value-for-money metrics, and justifies its decisions transparently.
            </p>
          </div>

          {/* 6 Core Architectural Stages */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              The 6-Stage Autonomous Decision Pipeline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WORKFLOW_STEPS.map((s) => (
                <div
                  key={s.step}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-start gap-3 shadow-2xs"
                >
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0">
                    {s.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200 text-[10px] flex items-center justify-center font-mono text-slate-600 font-bold">
                        {s.step}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{s.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Specs */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 text-xs space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Code className="w-4 h-4 text-indigo-600" />
              <span>Project Tech Stack & Implementation</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-900 block mb-0.5 font-bold">Frontend</strong>
                <span>React 19 + TypeScript + Tailwind CSS + Motion</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-900 block mb-0.5 font-bold">Backend & AI</strong>
                <span>Express.js / Node + Gemini AI SDK (@google/genai)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-900 block mb-0.5 font-bold">Database & Storage</strong>
                <span>Realistic Spec Catalog + Local Storage Persistence</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Got it, Let's Shop!
          </button>
        </div>

      </div>
    </div>
  );
};
