import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { SAMPLE_PRODUCTS } from './src/data/products';
import { Product, ShoppingRequirements, ProductComparisonItem, AgentWorkflowStep } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with lazy safety check
let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
    }
  }
  return aiClient;
}

// -------------------------------------------------------------
// HELPER: Intelligent Local Heuristics / Rule-based Shopping Agent
// (Used as primary or high-resilience fallback)
// -------------------------------------------------------------
function extractRequirementsRuleBased(
  userText: string,
  existingReqs?: Partial<ShoppingRequirements>
): ShoppingRequirements {
  const text = userText.toLowerCase();

  // Category detection
  let category: string | null = existingReqs?.category || null;
  if (/laptop|notebook|macbook|computer|pc|ultrabook/i.test(text)) category = 'laptops';
  else if (/phone|smartphone|mobile|android|iphone/i.test(text)) category = 'smartphones';
  else if (/headphone|earphone|earbuds|tws|neckband|anc|audio|buds/i.test(text)) category = 'headphones';
  else if (/watch|smartwatch|fitness tracker|band/i.test(text)) category = 'smartwatches';
  else if (/tablet|ipad|tab/i.test(text)) category = 'tablets';
  else if (/monitor|screen|display/i.test(text)) category = 'monitors';
  else if (/keyboard|mechanical/i.test(text)) category = 'keyboards';

  // Budget detection (Supports ₹, Rs, INR, k, thousand, $, USD)
  let budgetMax: number | null = existingReqs?.budgetMax || null;
  let budgetMin: number | null = existingReqs?.budgetMin || null;
  const currency: 'INR' | 'USD' = existingReqs?.currency || (text.includes('$') || text.includes('usd') ? 'USD' : 'INR');

  // Match e.g. "under 60,000", "under 60k", "under ₹60,000", "budget 5000", "within 25000"
  const underMatch = text.match(/(?:under|below|max|around|within|budget of|budget|upto|up to|less than)\s*(?:₹|rs\.?|inr|\$)?\s*([\d,]+(?:\.\d+)?)\s*(k|thousand|lakh|lakhs)?/i);
  if (underMatch) {
    let numStr = underMatch[1].replace(/,/g, '');
    let val = parseFloat(numStr);
    const unit = (underMatch[2] || '').toLowerCase();
    if (unit === 'k' || unit === 'thousand') val *= 1000;
    else if (unit === 'lakh' || unit === 'lakhs') val *= 100000;
    else if (val < 200 && currency === 'INR' && !text.includes('$')) {
      // e.g. "60k" captured as 60
      if (val <= 150) val *= 1000;
    }
    budgetMax = val;
  } else {
    // Single number with k like "60k"
    const kMatch = text.match(/(\d+)\s*k\b/i);
    if (kMatch) {
      budgetMax = parseInt(kMatch[1], 10) * 1000;
    } else {
      const plainNumMatch = text.match(/(?:₹|rs\.?)\s*([\d,]+)/i);
      if (plainNumMatch) {
        budgetMax = parseFloat(plainNumMatch[1].replace(/,/g, ''));
      }
    }
  }

  // Intended Use detection
  let intendedUse: string | null = existingReqs?.intendedUse || null;
  if (/coding|programming|developer|software|vscode|python|java|web dev|developer/i.test(text)) {
    intendedUse = 'Coding & Software Development';
  } else if (/study|studying|student|school|college|lectures|reading|exam/i.test(text)) {
    intendedUse = 'Study & Academic Focus';
  } else if (/gaming|gamer|gta|fps|esports|games/i.test(text)) {
    intendedUse = 'Gaming & Graphics';
  } else if (/office|work|meetings|business|excel|zoom/i.test(text)) {
    intendedUse = 'Office & Daily Productivity';
  } else if (/camera|photography|photos|video|vlog|youtube/i.test(text)) {
    intendedUse = 'Camera & Content Creation';
  } else if (/travel|commute|portable|lightweight/i.test(text)) {
    intendedUse = 'Travel & Portability';
  } else if (/gym|running|workout|fitness/i.test(text)) {
    intendedUse = 'Fitness & Workouts';
  }

  // Brand preferences
  const brandsFound = new Set<string>(existingReqs?.preferredBrands || []);
  const allBrands = ['asus', 'lenovo', 'hp', 'acer', 'apple', 'dell', 'jbl', 'sony', 'realme', 'boat', 'oneplus', 'nothing', 'samsung', 'motorola', 'xiaomi', 'amazfit', 'lg', 'keychron'];
  for (const b of allBrands) {
    if (new RegExp(`\\b${b}\\b`, 'i').test(text)) {
      brandsFound.add(b.toUpperCase());
    }
  }

  // Required features & priorities
  const features = new Set<string>(existingReqs?.requiredFeatures || []);
  const priorities = new Set<string>(existingReqs?.priorities || []);

  if (/noise cancel|noise cancellation|anc|silence/i.test(text)) {
    features.add('Active Noise Cancellation (ANC)');
    priorities.add('ANC & Focus');
  }
  if (/battery|backup|long lasting|battery life/i.test(text)) {
    features.add('Long Battery Life');
    priorities.add('Battery Life');
  }
  if (/oled|amoled|screen|display|120hz|144hz|4k/i.test(text)) {
    features.add('High Quality Display');
    priorities.add('Display Quality');
  }
  if (/lightweight|thin|portable|compact/i.test(text)) {
    features.add('Lightweight & Portable');
    priorities.add('Portability');
  }
  if (/fast charge|fast charging|100w|65w/i.test(text)) {
    features.add('Fast Charging');
  }
  if (/waterproof|ip68|water resist/i.test(text)) {
    features.add('Water Resistance');
  }

  // Missing fields determination
  const missingFields: string[] = [];
  if (!category) missingFields.push('product_category');
  if (!budgetMax) missingFields.push('budget_limit');
  if (!intendedUse) missingFields.push('intended_use');

  const readyForRecommendation = !!(category && (budgetMax || intendedUse));

  return {
    category,
    budgetMax,
    budgetMin,
    currency,
    intendedUse,
    preferredBrands: Array.from(brandsFound),
    requiredFeatures: Array.from(features),
    priorities: Array.from(priorities),
    missingFields,
    readyForRecommendation,
  };
}

// -------------------------------------------------------------
// FILTER & RANK PRODUCTS BASED ON SHOPPING REQUIREMENTS
// -------------------------------------------------------------
function rankProductsForRequirements(
  reqs: ShoppingRequirements,
  allProducts: Product[]
): ProductComparisonItem[] {
  let filtered = allProducts;

  // Filter by category if specified
  if (reqs.category) {
    const cat = reqs.category.toLowerCase();
    filtered = filtered.filter(p => p.category.toLowerCase() === cat);
  }

  if (filtered.length === 0) {
    filtered = allProducts; // fallback to general pool if category mismatch
  }

  // Score each product
  const scored = filtered.map(p => {
    let score = 50; // base score

    const price = reqs.currency === 'USD' ? p.priceUSD : p.priceINR;
    const maxBudget = reqs.budgetMax;

    let budgetStatus: 'under' | 'exact' | 'over' = 'exact';
    let budgetDiff = 0;

    if (maxBudget) {
      budgetDiff = maxBudget - price;
      if (price <= maxBudget) {
        budgetStatus = 'under';
        // Give positive points for being within budget, with optimal sweet spot around 80-98% of budget
        const ratio = price / maxBudget;
        if (ratio >= 0.7 && ratio <= 1.0) {
          score += 25; // sweet spot
        } else if (ratio < 0.7) {
          score += 18; // strong budget saver
        }
      } else {
        budgetStatus = 'over';
        const overPercent = ((price - maxBudget) / maxBudget) * 100;
        if (overPercent <= 15) {
          score -= 10; // slightly over budget, acceptable as premium alt
        } else {
          score -= 35; // significantly over budget
        }
      }
    }

    // Purpose matching
    if (reqs.intendedUse) {
      const useLower = reqs.intendedUse.toLowerCase();
      const matched = p.intendedUses.some(u => {
        const uLower = u.toLowerCase();
        return uLower.includes(useLower) || useLower.split(' ').some(w => w.length > 3 && uLower.includes(w));
      });
      if (matched) score += 20;
    }

    // Brand preference
    if (reqs.preferredBrands.length > 0) {
      const matchBrand = reqs.preferredBrands.some(b => b.toLowerCase() === p.brand.toLowerCase());
      if (matchBrand) score += 15;
    }

    // Priority matching
    if (reqs.priorities.includes('Battery Life') && p.batteryScore) {
      score += p.batteryScore * 2;
    }
    if (reqs.priorities.includes('ANC & Focus') && (p.specs.ANC || p.features.some(f => f.toLowerCase().includes('anc')))) {
      score += 15;
    }
    if (reqs.priorities.includes('Portability') && p.specs.Weight && parseFloat(p.specs.Weight) < 1.5) {
      score += 12;
    }

    // Value for money weighting
    score += (p.valueForMoneyScore || 8) * 2;
    score += (p.rating || 4) * 3;

    return {
      product: p,
      budgetStatus,
      budgetDiff,
      overallScore: Math.min(Math.round(score), 99),
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.overallScore - a.overallScore);

  // Take top 3 recommendations
  const topList = scored.slice(0, 3);

  return topList.map((item, idx) => {
    let rankBadge = '';
    let whyPickThis = '';
    let tradeOff = '';

    if (idx === 0) {
      rankBadge = '🥇 Best Overall Choice';
      whyPickThis = `Highest overall score with optimal balance of ${reqs.intendedUse || 'performance'}, budget compliance, and top customer ratings.`;
      tradeOff = item.product.cons[0] || 'Slightly higher demand';
    } else if (idx === 1) {
      rankBadge = item.budgetStatus === 'under' ? '🥈 Best Value Alternative' : '🥈 High Performance Alternate';
      whyPickThis = item.budgetStatus === 'under'
        ? `Saves more money (${item.budgetDiff > 0 ? (reqs.currency === 'USD' ? `$${item.budgetDiff}` : `₹${item.budgetDiff.toLocaleString('en-IN')}`) + ' under budget' : 'cost-efficient'}) while delivering key features.`
        : `Offers higher performance tier for a slight budget stretch.`;
      tradeOff = item.product.cons[0] || 'Trade-off on secondary specs';
    } else {
      rankBadge = '🥉 Specialized Option';
      whyPickThis = `Strong contender specifically recognized for ${item.product.highlightTag || 'unique hardware strengths'}.`;
      tradeOff = item.product.cons[0] || 'Narrower focus area';
    }

    return {
      product: item.product,
      budgetStatus: item.budgetStatus,
      budgetDiff: item.budgetDiff,
      overallScore: item.overallScore,
      recommendationRank: idx + 1,
      rankBadge,
      whyPickThis,
      tradeOffConsideration: tradeOff,
    };
  });
}

// -------------------------------------------------------------
// WORKFLOW STEPS GENERATOR
// -------------------------------------------------------------
function generateWorkflowSteps(reqs: ShoppingRequirements, hasProducts: boolean): AgentWorkflowStep[] {
  return [
    {
      id: 'understand',
      label: 'Understand Requirements',
      status: 'completed',
      details: reqs.category ? `Category: ${reqs.category.toUpperCase()} | Purpose: ${reqs.intendedUse || 'General'}` : 'Analyzing shopping intent',
    },
    {
      id: 'missing_info',
      label: 'Identify Missing Information',
      status: reqs.missingFields.length > 0 ? 'completed' : 'completed',
      details: reqs.missingFields.length > 0 ? `Identified: ${reqs.missingFields.join(', ')}` : 'All critical requirements identified',
    },
    {
      id: 'search_filter',
      label: 'Search & Filter Catalog',
      status: hasProducts ? 'completed' : 'running',
      details: `Filtered catalog matching ${reqs.currency} ${reqs.budgetMax ? reqs.budgetMax.toLocaleString() : 'any'} budget`,
    },
    {
      id: 'compare',
      label: 'Compare Products & Trade-offs',
      status: hasProducts ? 'completed' : 'pending',
      details: 'Evaluated specs, battery, price-to-performance ratio',
    },
    {
      id: 'rank',
      label: 'Rank Products by User Fit',
      status: hasProducts ? 'completed' : 'pending',
      details: 'Ranked options and selected #1 Best Choice',
    },
    {
      id: 'explain',
      label: 'Explain Recommendation Reasoning',
      status: hasProducts ? 'completed' : 'pending',
      details: 'Synthesized decision rationalization',
    },
    {
      id: 'next_action',
      label: 'Suggest Next Action',
      status: hasProducts ? 'completed' : 'pending',
      details: 'Prepared smart follow-up suggestions',
    },
  ];
}

// -------------------------------------------------------------
// API ROUTE: CHAT & AGENTIC SHOPPING DECISION
// -------------------------------------------------------------
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], currentRequirements, currency = 'INR' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required' });
    }

    // Step 1 & 2: Requirement Extraction
    const mergedReqs = extractRequirementsRuleBased(message, currentRequirements);
    mergedReqs.currency = currency;

    // Check if Gemini API is available for advanced synthesis
    const gemini = getGeminiAI();
    let geminiExtracted: any = null;

    if (gemini) {
      try {
        const prompt = `You are AgenticBuy AI, an autonomous shopping and decision intelligence agent.
Analyze the user's latest message and conversation history.
Extract their shopping requirements, check missing criteria, and explain why recommendations fit their goal.

User Message: "${message}"
Prior Context: ${JSON.stringify(history.slice(-3))}

Catalog Available Categories: laptops, smartphones, headphones, smartwatches, tablets, monitors, keyboards.

Output strictly valid JSON with this schema:
{
  "category": "laptops" | "smartphones" | "headphones" | "smartwatches" | "tablets" | "monitors" | "keyboards" | null,
  "budgetMax": number | null,
  "intendedUse": string | null,
  "preferredBrands": string[],
  "requiredFeatures": string[],
  "priorities": string[],
  "missingFields": string[],
  "conversationalReply": string,
  "whyTopChoiceFits": string,
  "followUpQuestions": string[],
  "quickActionChips": string[]
}`;

        const response = await gemini.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const textResponse = response.text?.trim();
        if (textResponse) {
          geminiExtracted = JSON.parse(textResponse);
        }
      } catch (err) {
        console.warn('Gemini generateContent error, gracefully using heuristic agent:', err);
      }
    }

    // Harmonize extracted requirements
    const finalReqs: ShoppingRequirements = {
      category: geminiExtracted?.category || mergedReqs.category,
      budgetMax: geminiExtracted?.budgetMax || mergedReqs.budgetMax,
      budgetMin: mergedReqs.budgetMin,
      currency: currency,
      intendedUse: geminiExtracted?.intendedUse || mergedReqs.intendedUse,
      preferredBrands: Array.from(new Set([...(mergedReqs.preferredBrands || []), ...(geminiExtracted?.preferredBrands || [])])),
      requiredFeatures: Array.from(new Set([...(mergedReqs.requiredFeatures || []), ...(geminiExtracted?.requiredFeatures || [])])),
      priorities: Array.from(new Set([...(mergedReqs.priorities || []), ...(geminiExtracted?.priorities || [])])),
      missingFields: geminiExtracted?.missingFields || mergedReqs.missingFields,
      readyForRecommendation: false,
    };

    // Ready for recommendations if we have at least category OR a strong intent
    finalReqs.readyForRecommendation = !!(finalReqs.category);

    // Filter & rank products
    let rankedProducts: ProductComparisonItem[] = [];
    if (finalReqs.category) {
      rankedProducts = rankProductsForRequirements(finalReqs, SAMPLE_PRODUCTS);
    }

    // Step 5: Decision Reasoning Synthesis
    const bestChoice = rankedProducts[0];
    const runnerUp = rankedProducts[1];

    let decisionExplanation = undefined;
    if (bestChoice) {
      const bestPriceStr = currency === 'USD' ? `$${bestChoice.product.priceUSD}` : `₹${bestChoice.product.priceINR.toLocaleString('en-IN')}`;
      const budgetMaxStr = finalReqs.budgetMax ? (currency === 'USD' ? `$${finalReqs.budgetMax}` : `₹${finalReqs.budgetMax.toLocaleString('en-IN')}`) : 'your requirement';

      let budgetVerdict = '';
      if (bestChoice.budgetStatus === 'under') {
        const savingsStr = currency === 'USD' ? `$${bestChoice.budgetDiff}` : `₹${bestChoice.budgetDiff.toLocaleString('en-IN')}`;
        budgetVerdict = `Well within budget (${savingsStr} savings remaining for accessories or warranty).`;
      } else if (bestChoice.budgetStatus === 'exact') {
        budgetVerdict = `Exact match for your targeted ${budgetMaxStr} budget.`;
      } else {
        budgetVerdict = `Slightly exceeds stated budget by ${(bestChoice.budgetDiff * -1).toLocaleString()}, but delivers essential hardware longevity.`;
      }

      decisionExplanation = {
        summary: `Based on your request for ${finalReqs.category} tailored to "${finalReqs.intendedUse || 'general productivity'}" under ${budgetMaxStr}, we evaluated options against benchmark performance, thermal reliability, battery metrics, and real-world value.`,
        whyBestChoiceWon: geminiExtracted?.whyTopChoiceFits || `The ${bestChoice.product.name} wins #1 rank because it features ${Object.entries(bestChoice.product.specs).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(', ')} while scoring ${bestChoice.product.valueForMoneyScore}/10 for value-for-money.`,
        runnerUpTradeoff: runnerUp
          ? `Compared to ${runnerUp.product.name}, the #1 pick provides superior ${bestChoice.product.features[0] || 'build & performance'}, while the runner-up is an attractive alternative if you want to optimize for ${runnerUp.product.highlightTag || 'secondary features'}.`
          : 'No other product in the catalog matched the tight criteria with equal balance.',
        valueForMoneyVerdict: `${bestChoice.product.name} provides an exceptional price-to-performance ratio (${bestChoice.product.valueForMoneyScore}/10) backed by ${bestChoice.product.rating}★ rating across ${bestChoice.product.reviewsCount.toLocaleString()} verified buyer reviews.`,
        budgetVerdict,
      };
    }

    // Conversational text & follow-up questions
    let replyText = '';
    let followUpQuestions: string[] = [];
    let quickReplies: string[] = [];

    if (!finalReqs.category) {
      replyText = "I'm ready to help you find the best tech gear! Which product category are you looking for (e.g. Laptop for coding, ANC Headphones for study, Camera Smartphone, or Tablet)?";
      followUpQuestions = [
        "What is your target budget (e.g. under ₹60,000)?",
        "What is your primary use case (coding, gaming, study, travel)?",
        "Do you have any preferred brand?",
      ];
      quickReplies = [
        "💻 Coding Laptop under ₹60,000",
        "🎧 Study Headphones under ₹5,000",
        "📱 Camera Phone under ₹30,000",
        "📱 Student Tablet under ₹25,000",
      ];
    } else if (rankedProducts.length > 0) {
      if (geminiExtracted?.conversationalReply) {
        replyText = geminiExtracted.conversationalReply;
      } else {
        const top = rankedProducts[0].product;
        const budgetDesc = finalReqs.budgetMax
          ? `under ${currency === 'USD' ? '$' + finalReqs.budgetMax : '₹' + finalReqs.budgetMax.toLocaleString('en-IN')}`
          : '';
        replyText = `I analyzed our catalog for ${finalReqs.category} ${budgetDesc} focused on ${finalReqs.intendedUse || 'your needs'}. Here are the top 3 recommendations, led by the ${top.name} as your Best Choice:`;
      }

      // Generate smart follow-up suggestions
      if (geminiExtracted?.followUpQuestions?.length) {
        followUpQuestions = geminiExtracted.followUpQuestions;
      } else {
        if (!finalReqs.budgetMax) followUpQuestions.push("What is your strict maximum budget?");
        if (finalReqs.preferredBrands.length === 0) followUpQuestions.push("Do you have a specific brand preference (e.g., ASUS, Lenovo, Sony, Samsung)?");
        followUpQuestions.push("Would you like a detailed side-by-side spec comparison of the top 2?");
      }

      if (geminiExtracted?.quickActionChips?.length) {
        quickReplies = geminiExtracted.quickActionChips;
      } else {
        quickReplies = [
          `📊 Compare Top 2 Options`,
          `🔍 Why did ${rankedProducts[0]?.product.name.split(' ')[0]} win?`,
          `💰 Show options with better battery life`,
          `🏷️ Filter only under ${currency === 'USD' ? '$' : '₹'}${finalReqs.budgetMax ? Math.round(finalReqs.budgetMax * 0.85).toLocaleString() : '50,000'}`,
        ];
      }
    } else {
      replyText = `I couldn't find exact matches for ${finalReqs.category} with those strict filters. Would you like to adjust your budget or explore nearby alternatives?`;
      quickReplies = ["Increase budget by 15%", "Show all products in this category", "Reset filters"];
    }

    const workflowSteps = generateWorkflowSteps(finalReqs, rankedProducts.length > 0);

    return res.json({
      reply: replyText,
      requirements: finalReqs,
      products: rankedProducts,
      bestChoiceId: bestChoice?.product.id,
      decisionExplanation,
      followUpQuestions,
      quickReplies,
      workflowSteps,
    });
  } catch (error: any) {
    console.error('Error in /api/chat endpoint:', error);
    return res.status(500).json({ error: 'Internal shopping agent error', details: error?.message });
  }
});

// -------------------------------------------------------------
// API ROUTE: LIST / SEARCH PRODUCTS
// -------------------------------------------------------------
app.get('/api/products', (req, res) => {
  const { category, maxPrice, minPrice, search, brand } = req.query;

  let results = SAMPLE_PRODUCTS;

  if (category && typeof category === 'string') {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (brand && typeof brand === 'string') {
    results = results.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    results = results.filter(p => p.priceINR <= Number(maxPrice));
  }

  if (minPrice && !isNaN(Number(minPrice))) {
    results = results.filter(p => p.priceINR >= Number(minPrice));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.features.some(f => f.toLowerCase().includes(q)) ||
        p.intendedUses.some(u => u.toLowerCase().includes(q))
    );
  }

  res.json({
    count: results.length,
    products: results,
  });
});

// -------------------------------------------------------------
// API ROUTE: GET SINGLE PRODUCT
// -------------------------------------------------------------
app.get('/api/products/:id', (req, res) => {
  const product = SAMPLE_PRODUCTS.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found in sample catalog' });
  }
  res.json(product);
});

// -------------------------------------------------------------
// API ROUTE: COMPARE MULTIPLE PRODUCTS
// -------------------------------------------------------------
app.post('/api/compare', (req, res) => {
  const { productIds, userRequirements } = req.body;
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: 'productIds array is required' });
  }

  const selected = SAMPLE_PRODUCTS.filter(p => productIds.includes(p.id));
  if (selected.length === 0) {
    return res.status(404).json({ error: 'No matching products found' });
  }

  // Calculate comparison metrics
  const comparison = {
    products: selected,
    specKeys: Array.from(new Set(selected.flatMap(p => Object.keys(p.specs)))),
    scoreComparison: selected.map(p => ({
      id: p.id,
      name: p.name,
      rating: p.rating,
      valueScore: p.valueForMoneyScore,
      batteryScore: p.batteryScore || 7.0,
      performanceScore: p.performanceScore || 8.0,
      priceINR: p.priceINR,
      priceUSD: p.priceUSD,
    })),
    bestValuePick: selected.reduce((prev, curr) => (curr.valueForMoneyScore > prev.valueForMoneyScore ? curr : prev), selected[0]),
    bestPerformancePick: selected.reduce((prev, curr) => ((curr.performanceScore || 0) > (prev.performanceScore || 0) ? curr : prev), selected[0]),
  };

  res.json(comparison);
});

// -------------------------------------------------------------
// HEALTH CHECK
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'AgenticBuy AI',
    version: '1.0.0',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    totalProductsInCatalog: SAMPLE_PRODUCTS.length,
  });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgenticBuy AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
