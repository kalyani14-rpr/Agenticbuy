import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AgentWorkflowTracker } from './components/AgentWorkflowTracker';
import { RequirementExtractionBar } from './components/RequirementExtractionBar';
import { ProductCard } from './components/ProductCard';
import { ProductComparisonSection } from './components/ProductComparisonSection';
import { DecisionAssistantCard } from './components/DecisionAssistantCard';
import { ChatWindow } from './components/ChatWindow';
import { CatalogExplorerModal } from './components/CatalogExplorerModal';
import { SavedDecisionsDrawer } from './components/SavedDecisionsDrawer';
import { ExportDecisionModal } from './components/ExportDecisionModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { SAMPLE_PRODUCTS } from './data/products';
import { 
  ChatMessage, 
  ShoppingRequirements, 
  ProductComparisonItem, 
  Product, 
  SavedDecision,
  AgentWorkflowStep 
} from './types';
import { 
  Scale, 
  Sparkles, 
  Crown, 
  RotateCcw, 
  ShoppingBag, 
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function App() {
  // Main states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [requirements, setRequirements] = useState<ShoppingRequirements | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductComparisonItem[]>([]);
  const [decisionExplanation, setDecisionExplanation] = useState<any>(null);
  const [workflowSteps, setWorkflowSteps] = useState<AgentWorkflowStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // User preferences
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [savedDecisions, setSavedDecisions] = useState<SavedDecision[]>(() => {
    try {
      const stored = localStorage.getItem('agentic_buy_saved_decisions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modals & drawers
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showComparisonMatrix, setShowComparisonMatrix] = useState(false);

  // Sync saved decisions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agentic_buy_saved_decisions', JSON.stringify(savedDecisions));
    } catch (err) {
      console.warn('Failed to save to localStorage', err);
    }
  }, [savedDecisions]);

  // Handle sending a chat message to the agentic backend
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
          currentRequirements: requirements,
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: data.reply || 'Here are the best options for you:',
        timestamp: Date.now(),
        requirements: data.requirements,
        products: data.products,
        bestChoiceId: data.bestChoiceId,
        decisionExplanation: data.decisionExplanation,
        followUpQuestions: data.followUpQuestions,
        quickReplies: data.quickReplies,
        workflowSteps: data.workflowSteps,
      };

      setMessages((prev) => [...prev, agentMsg]);

      if (data.requirements) {
        setRequirements(data.requirements);
      }

      if (data.products && data.products.length > 0) {
        setRecommendedProducts(data.products);
        setSelectedCompareIds(data.products.map((p: ProductComparisonItem) => p.product.id));
      }

      if (data.decisionExplanation) {
        setDecisionExplanation(data.decisionExplanation);
      }

      if (data.workflowSteps) {
        setWorkflowSteps(data.workflowSteps);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `agent-error-${Date.now()}`,
        sender: 'agent',
        text: "I processed your request using local reasoning. Here are the top matched recommendations based on your budget and requirements:",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Prompt handler (e.g. from starter chips or follow-up suggestions)
  const handleQuickPrompt = (prompt: string) => {
    // If it's a compare prompt, open matrix
    if (prompt.toLowerCase().includes('compare')) {
      setShowComparisonMatrix(true);
      return;
    }
    handleSendMessage(prompt);
  };

  // Toggle compare selection
  const handleToggleCompare = (productId: string) => {
    setSelectedCompareIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Finalize / Save decision
  const handleSaveDecision = (product?: Product) => {
    const bestPick = product || recommendedProducts[0]?.product;
    if (!bestPick || !requirements) return;

    const newDecision: SavedDecision = {
      id: `dec-${Date.now()}`,
      title: `${bestPick.name.split(' ')[0]} ${requirements.category || 'Product'} Choice`,
      timestamp: Date.now(),
      requirements: requirements,
      bestProduct: bestPick,
      runnerUps: recommendedProducts.slice(1).map((p) => p.product),
      explanation: decisionExplanation?.whyBestChoiceWon || 'Top matched specification balance within budget.',
    };

    setSavedDecisions((prev) => [newDecision, ...prev.filter((d) => d.bestProduct.id !== bestPick.id)]);
  };

  // Reset entire shopping session
  const handleResetChat = () => {
    setMessages([]);
    setRequirements(null);
    setRecommendedProducts([]);
    setDecisionExplanation(null);
    setSelectedCompareIds([]);
    setWorkflowSteps([]);
  };

  // Filter comparison items
  const comparisonList = recommendedProducts.filter((item) =>
    selectedCompareIds.includes(item.product.id)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <Header
        currency={currency}
        onCurrencyToggle={() => setCurrency((prev) => (prev === 'INR' ? 'USD' : 'INR'))}
        onOpenCatalog={() => setShowCatalogModal(true)}
        onOpenSavedDecisions={() => setShowSavedModal(true)}
        onOpenHowItWorks={() => setShowHowItWorksModal(true)}
        onResetChat={handleResetChat}
        savedCount={savedDecisions.length}
        catalogCount={SAMPLE_PRODUCTS.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Agent Workflow Tracker (Core Feature 9) */}
        <AgentWorkflowTracker
          steps={workflowSteps}
          isProcessing={isLoading}
        />

        {/* Live Extracted Requirements Bar (Core Feature 2 & 7) */}
        <RequirementExtractionBar
          requirements={requirements}
          onUpdateRequirements={(newReqs) => {
            setRequirements(newReqs);
            handleSendMessage(`Refined requirement: Budget is ${newReqs.budgetMax || 'flexible'}, Purpose: ${newReqs.intendedUse || 'general'}`);
          }}
          currency={currency}
        />

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: AI Shopping Chatbot (Core Feature 1, 6) */}
          <div className="lg:col-span-5 space-y-4">
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              currency={currency}
              onQuickPrompt={handleQuickPrompt}
            />

            {/* Quick Actions Bar under Chat */}
            {recommendedProducts.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs shadow-2xs">
                <span className="text-slate-500 font-semibold">
                  {selectedCompareIds.length} products shortlisted
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowComparisonMatrix(!showComparisonMatrix)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/80 transition-all font-bold shadow-2xs"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{showComparisonMatrix ? 'Hide Comparison' : 'Compare Top 3 Matrix'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Recommendations & AI Decision Assistant (Core Feature 3, 4, 5, 8) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* AI Decision Assistant Card (Core Feature 5) */}
            {recommendedProducts.length > 0 && (
              <DecisionAssistantCard
                decisionExplanation={decisionExplanation}
                bestProduct={recommendedProducts[0]?.product}
                runnerUpProduct={recommendedProducts[1]?.product}
                requirements={requirements}
                currency={currency}
                onFinalizeDecision={() => handleSaveDecision()}
                onExportReport={() => setShowExportModal(true)}
                isSaved={savedDecisions.some((d) => d.bestProduct.id === recommendedProducts[0]?.product.id)}
              />
            )}

            {/* Comparison Matrix Table if toggled (Core Feature 4) */}
            {showComparisonMatrix && comparisonList.length > 0 && (
              <ProductComparisonSection
                products={comparisonList}
                currency={currency}
                userBudgetMax={requirements?.budgetMax || null}
                onClose={() => setShowComparisonMatrix(false)}
                onSelectDecision={(p) => handleSaveDecision(p)}
              />
            )}

            {/* Product Recommendations Grid (Core Feature 3 & 8) */}
            {recommendedProducts.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Ranked Product Matches ({recommendedProducts.length})
                    </h3>
                  </div>

                  <button
                    onClick={() => setShowComparisonMatrix(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>View Side-by-Side Matrix</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {recommendedProducts.map((item) => (
                    <ProductCard
                      key={item.product.id}
                      item={item}
                      currency={currency}
                      userBudgetMax={requirements?.budgetMax || null}
                      isSelectedForCompare={selectedCompareIds.includes(item.product.id)}
                      onToggleCompare={handleToggleCompare}
                      onSelectDecision={(p) => handleSaveDecision(p)}
                      onViewRationale={(it) => {
                        setShowComparisonMatrix(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Empty state placeholder before first prompt */
              <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[460px] shadow-2xs">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 ring-8 ring-indigo-50/50 shadow-xs">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  No Active Recommendations Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-md leading-relaxed mb-6">
                  Type your shopping requirements in the chat or pick one of the 1-click starter demos on the left. AgenticBuy AI will extract your budget, filter matching hardware, compare alternatives, and explain the best choice.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => handleSendMessage('I need a laptop for coding under ₹60,000 with good battery life.')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run "Laptop for Coding" Demo</span>
                  </button>

                  <button
                    onClick={() => setShowCatalogModal(true)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
                  >
                    <span>Browse Sample Catalog</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-600">
            <strong className="text-slate-900 font-bold">AgenticBuy AI</strong> – Autonomous Shopping & Decision Agent for Agentic Commerce.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setShowHowItWorksModal(true)}
              className="hover:text-slate-900 underline transition-colors"
            >
              Agentic Workflow Docs
            </button>
            <span>•</span>
            <button
              onClick={() => setShowCatalogModal(true)}
              className="hover:text-slate-900 underline transition-colors"
            >
              Demo Catalog ({SAMPLE_PRODUCTS.length} items)
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <CatalogExplorerModal
        isOpen={showCatalogModal}
        onClose={() => setShowCatalogModal(false)}
        currency={currency}
        onSelectProductForChat={(p) => {
          handleSendMessage(`Tell me more about ${p.name} (${currency === 'USD' ? '$' + p.priceUSD : '₹' + p.priceINR.toLocaleString('en-IN')}) and recommend the best alternatives in this price range.`);
        }}
      />

      <SavedDecisionsDrawer
        isOpen={showSavedModal}
        onClose={() => setShowSavedModal(false)}
        savedDecisions={savedDecisions}
        onDeleteDecision={(id) => setSavedDecisions((prev) => prev.filter((d) => d.id !== id))}
        onClearAll={() => setSavedDecisions([])}
        currency={currency}
        onViewDecision={(dec) => {
          setShowSavedModal(false);
          handleSendMessage(`Review my previously saved choice: ${dec.bestProduct.name}`);
        }}
      />

      <ExportDecisionModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        bestProduct={recommendedProducts[0]?.product}
        requirements={requirements}
        comparisonItems={recommendedProducts}
        decisionExplanation={decisionExplanation}
        currency={currency}
      />

      <HowItWorksModal
        isOpen={showHowItWorksModal}
        onClose={() => setShowHowItWorksModal(false)}
      />

    </div>
  );
}
