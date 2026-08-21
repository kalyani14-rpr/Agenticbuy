import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Circle, 
  ChevronRight, 
  BrainCircuit, 
  Search, 
  Scale, 
  Trophy, 
  Sparkles, 
  ArrowRightCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AgentWorkflowStep, AgentStepType } from '../types';

interface AgentWorkflowTrackerProps {
  steps?: AgentWorkflowStep[];
  isProcessing?: boolean;
}

const STEP_ICONS: Record<AgentStepType, React.ReactNode> = {
  understand: <BrainCircuit className="w-3.5 h-3.5" />,
  missing_info: <HelpCircle className="w-3.5 h-3.5" />,
  search_filter: <Search className="w-3.5 h-3.5" />,
  compare: <Scale className="w-3.5 h-3.5" />,
  rank: <Trophy className="w-3.5 h-3.5" />,
  explain: <Sparkles className="w-3.5 h-3.5" />,
  next_action: <ArrowRightCircle className="w-3.5 h-3.5" />,
};

export const AgentWorkflowTracker: React.FC<AgentWorkflowTrackerProps> = ({
  steps,
  isProcessing = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultSteps: AgentWorkflowStep[] = [
    { id: 'understand', label: 'Understand Requirements', status: 'completed', details: 'Extract intent, budget, purpose, and brands' },
    { id: 'missing_info', label: 'Identify Missing Information', status: 'completed', details: 'Check budget limits & user priorities' },
    { id: 'search_filter', label: 'Search & Filter Products', status: 'completed', details: 'Match query to multi-tier hardware catalog' },
    { id: 'compare', label: 'Compare Trade-offs', status: 'completed', details: 'Benchmark specs, battery, & ratings' },
    { id: 'rank', label: 'Rank by Fit', status: 'completed', details: 'Determine Best Choice & Alternatives' },
    { id: 'explain', label: 'Explain Reasoning', status: 'completed', details: 'Synthesize decision rationale' },
    { id: 'next_action', label: 'Suggest Next Action', status: 'completed', details: 'Generate comparison & smart prompts' },
  ];

  const activeSteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <div id="agent-workflow-tracker" className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm mb-4 transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-xs">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Autonomous Agent Decision Pipeline
              </span>
              {isProcessing && (
                <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-mono animate-pulse border border-indigo-200">
                  <Loader2 className="w-3 h-3 animate-spin" /> Reasoning...
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              7-Stage Agentic Reasoning Loop from natural language query to purchasing verdict
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors font-medium"
        >
          <span>{isExpanded ? 'Hide Details' : 'View Pipeline'}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Horizontal Steps Ribbon */}
      <div className="mt-3 overflow-x-auto pb-1 scrollbar-thin">
        <div className="flex items-center gap-1.5 min-w-max">
          {activeSteps.map((step, idx) => {
            const isDone = step.status === 'completed';
            const isRunning = step.status === 'running' || (isProcessing && idx === 3);

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isRunning
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-xs animate-pulse'
                      : isDone
                      ? 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100/80'
                      : 'bg-slate-50/50 text-slate-400 border-slate-100'
                  }`}
                >
                  <span className={isRunning ? 'text-indigo-600' : isDone ? 'text-emerald-600' : 'text-slate-400'}>
                    {isRunning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      STEP_ICONS[step.id] || <Circle className="w-3.5 h-3.5" />
                    )}
                  </span>
                  <span className="truncate max-w-[140px] font-semibold text-slate-800">{step.label}</span>
                </div>

                {idx < activeSteps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Expanded detailed breakdown */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          {activeSteps.map((step, idx) => (
            <div key={step.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                <span className="w-4 h-4 rounded-full bg-white border border-slate-200 text-[10px] flex items-center justify-center font-mono text-slate-600 shadow-2xs">
                  {idx + 1}
                </span>
                <span>{step.label}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {step.details || 'Step completed successfully'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
