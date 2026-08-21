export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'laptops' | 'smartphones' | 'headphones' | 'smartwatches' | 'tablets' | 'monitors' | 'keyboards';
  priceINR: number;
  priceUSD: number;
  originalPriceINR: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  specs: {
    [key: string]: string;
  };
  intendedUses: string[];
  features: string[];
  pros: string[];
  cons: string[];
  valueForMoneyScore: number; // 1-10
  batteryScore?: number; // 1-10
  performanceScore?: number; // 1-10
  durabilityScore?: number; // 1-10
  inStock: boolean;
  highlightTag?: string; // e.g. "Best Value", "Top Performance", "Battery Champ"
}

export interface ShoppingRequirements {
  category: string | null;
  budgetMax: number | null;
  budgetMin: number | null;
  currency: 'INR' | 'USD';
  intendedUse: string | null;
  preferredBrands: string[];
  requiredFeatures: string[];
  priorities: string[]; // e.g., 'battery', 'performance', 'camera', 'budget', 'durability'
  missingFields: string[]; // e.g., ['budget', 'brand', 'use_case']
  readyForRecommendation: boolean;
}

export type AgentStepType = 
  | 'understand'
  | 'missing_info'
  | 'search_filter'
  | 'compare'
  | 'rank'
  | 'explain'
  | 'next_action';

export interface AgentWorkflowStep {
  id: AgentStepType;
  label: string;
  status: 'pending' | 'running' | 'completed';
  details?: string;
}

export interface ProductComparisonItem {
  product: Product;
  budgetStatus: 'under' | 'exact' | 'over';
  budgetDiff: number; // positive = savings, negative = over
  overallScore: number; // 1-100
  recommendationRank: number;
  rankBadge: string; // e.g. "1st - Best Choice", "2nd - Best Budget", "3rd - Premium Alt"
  whyPickThis: string;
  tradeOffConsideration: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: number;
  requirements?: ShoppingRequirements;
  products?: ProductComparisonItem[];
  bestChoiceId?: string;
  decisionExplanation?: {
    summary: string;
    whyBestChoiceWon: string;
    runnerUpTradeoff: string;
    valueForMoneyVerdict: string;
    budgetVerdict: string;
  };
  followUpQuestions?: string[];
  quickReplies?: string[];
  workflowSteps?: AgentWorkflowStep[];
}

export interface SavedDecision {
  id: string;
  title: string;
  timestamp: number;
  requirements: ShoppingRequirements;
  bestProduct: Product;
  runnerUps: Product[];
  explanation: string;
}
