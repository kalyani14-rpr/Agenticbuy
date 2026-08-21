# 🛍️ AgenticBuy AI – Autonomous Shopping & Decision Agent

> **An AI-Powered Shopping & Decision Assistant for Agentic Commerce.**  
> *Transforming natural language shopping requirements into intelligent, trade-off evaluated purchasing decisions.*

---

## 📌 Project Overview

**AgenticBuy AI** is an autonomous shopping and decision intelligence web application built for college project demonstrations, hackathons, and research in Agentic Commerce. 

Unlike traditional e-commerce search bars or basic chatbots that merely return raw links, AgenticBuy AI functions as an **Agentic Decision Assistant**. It understands complex natural language prompts (such as *"I need a laptop for coding under ₹60,000 with good battery life"*), identifies missing constraints, queries a structured multi-category hardware catalog, calculates value-for-money metrics, benchmarks trade-offs, and provides rationalized purchasing recommendations with a highlighted **#1 Best Choice**.

---

## 🌟 Key Features

### 1. 🤖 AI Shopping Chatbot
- Conversational chat interface supporting natural language queries with context retention across multiple turns.
- Recognizes constraints like price ceilings, primary use cases, preferred brands, and hardware priorities.

### 2. 🔍 Requirement Extraction Engine
- Automatically parses and isolates:
  - **Product Category** (Laptops, Smartphones, Audio/Headphones, Tablets, Smartwatches, Monitors, Keyboards)
  - **Budget Range & Currency** (₹ INR / $ USD)
  - **Intended Use** (Coding, Academic Study, Gaming, Content Creation, Office, Fitness)
  - **Brand Preferences** (ASUS, Lenovo, HP, Apple, Sony, JBL, Samsung, OnePlus, etc.)
  - **Required Capabilities** (Active Noise Cancellation, OLED screen, Battery Endurance, Light weight)

### 3. 🎯 7-Stage Agentic Reasoning Pipeline
Follows the structured Agentic Commerce lifecycle:
1. **Understand Requirements** → Semantic token extraction.
2. **Identify Missing Info** → Proactive gap detection (e.g. asking for max budget or brand preference).
3. **Search & Filter** → Multi-criteria database retrieval.
4. **Compare Products** → Cross-spec hardware benchmarking.
5. **Rank Products** → Scoring algorithm based on user fit and value.
6. **Explain Recommendation** → Clear natural-language rationale for why the winner won.
7. **Suggest Next Action** → 1-click matrix comparison, refinement chips, and decision finalization.

### 4. ⚖️ Side-by-Side Comparison & Trade-off Matrix
- Interactive multi-product table comparing price, battery endurance, performance scores, advantages (pros), disadvantages (cons), and value-for-money ratings.

### 5. 💰 Clear Budget Check
- Dynamic budget compliance meter indicating:
  - **Under Budget** (with exact savings amount and % saved)
  - **Exact Budget Match**
  - **Over Budget Warning**

### 6. 🏆 AI Decision Assistant
- Generates transparent rationalization explaining why the #1 Best Choice is recommended instead of simply outputting a flat list.
- Explains why the runner-up lost and what trade-offs the buyer should consider.

### 7. 💾 Local Decision Memory & Export
- Finalize decisions with confetti celebration and persist them in LocalStorage.
- Export clean Markdown (`.md`) reports summarizing requirements, specifications, and reasoning.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + TypeScript |
| **Styling & Icons** | Tailwind CSS + Lucide React |
| **Backend Server** | Express.js (Node.js) with ESBuild bundling |
| **AI Intelligence** | Google GenAI SDK (`@google/genai` with `gemini-3.7-flash`) |
| **Resilience / Fallback** | Deterministic Rule-Based Heuristic Agent (Zero crash guarantee) |
| **Product Database** | Structured multi-category hardware catalog (`/src/data/products.ts`) |
| **Build & Dev Tool** | Vite + TSX |

---

## 📁 Project Directory Structure

```text
├── .env.example               # Environment variable declarations (GEMINI_API_KEY)
├── index.html                 # Main HTML entry point
├── metadata.json              # Platform metadata & capabilities
├── package.json               # Dependencies & scripts
├── README.md                  # Project documentation
├── server.ts                  # Express backend & Gemini agent pipeline
├── src/
│   ├── App.tsx                # Primary application container & state orchestration
│   ├── main.tsx               # React DOM initialization
│   ├── index.css              # Tailwind CSS styles
│   ├── types.ts               # TypeScript interfaces & types
│   ├── data/
│   │   └── products.ts        # Realistic sample product catalog with specs
│   └── components/
│       ├── Header.tsx                 # Header with currency switch & tool triggers
│       ├── AgentWorkflowTracker.tsx   # 7-stage Agentic Pipeline visualizer
│       ├── RequirementExtractionBar.tsx# Extracted intent badge bar & quick editor
│       ├── ProductCard.tsx            # Product recommendation card with budget check
│       ├── ProductComparisonSection.tsx# Side-by-side trade-off matrix table
│       ├── DecisionAssistantCard.tsx  # AI Decision Assistant explanation panel
│       ├── ChatWindow.tsx             # Interactive chatbot with follow-up questions
│       ├── CatalogExplorerModal.tsx   # Full catalog search & browser modal
│       ├── SavedDecisionsDrawer.tsx   # Local storage decision history drawer
│       ├── ExportDecisionModal.tsx    # Markdown report exporter
│       └── HowItWorksModal.tsx        # Agentic commerce explanation for viva
└── tsconfig.json              # TypeScript configuration
```

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional for Gemini AI)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API Key in `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> *Note: If `GEMINI_API_KEY` is not provided, the application automatically uses its built-in rule-based heuristic agent, ensuring the entire decision pipeline works flawlessly offline.*

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🧪 Sample Demonstration Prompts

Try these test prompts in the chatbot to demonstrate different agent capabilities:

1. **Coding Laptop Under Budget**:
   > *"I need a laptop for coding under ₹60,000 with good battery life."*
   > → *Agent identifies ASUS Vivobook 15 OLED as #1 Best Choice, highlights Ryzen 7 8-core CPU and ₹5,010 savings under budget.*

2. **Study Headphones with ANC**:
   > *"I need wireless headphones under ₹5,000 for studying."*
   > → *Agent identifies JBL Tune 770NC (Adaptive ANC, 70-hour battery, ₹4,999) and compares it with Sony WH-CH720N.*

3. **Camera Smartphone**:
   > *"Suggest a good camera smartphone under ₹30,000 for content creation."*
   > → *Agent recommends OnePlus Nord CE4 and Nothing Phone (2a) with Sony LYT-600 OIS camera comparisons.*

4. **Student Tablet**:
   > *"Looking for a student tablet under ₹25,000 with active stylus support."*
   > → *Agent suggests Xiaomi Pad 6 with 144Hz 2.8K display and 8840mAh battery.*

---

## 🎓 College Viva / Project Presentation Points

- **Why is this an Agent rather than a standard Chatbot?**
  - Standard chatbots execute stateless single-turn responses without constraint checks.
  - AgenticBuy AI executes a **7-stage loop**: (1) Intent Parsing, (2) Missing Info Discovery, (3) Filtering, (4) Spec Benchmarking, (5) Algorithmic Ranking, (6) Rationale Synthesis, and (7) Actionable Next Steps.
- **How are trade-offs handled?**
  - Each recommendation card provides both **Key Advantages (Pros)** and **Trade-offs (Cons)** so buyers make informed decisions rather than buying blindly.
- **Budget Intelligence**:
  - Automatically calculates price vs budget delta, showing whether the user saves money or needs to stretch their budget.

---

## 📄 License
MIT License. Created for educational and demonstration purposes.
