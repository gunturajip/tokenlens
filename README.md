---

# 🧾 Master Prompt: AI Token Cost Calculator SaaS

```
You are an expert full-stack developer specializing in Next.js 14+ (App Router), 
Supabase, and SaaS applications. Build a production-ready AI Token Cost Calculator 
SaaS web application with the following complete specification.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PROJECT OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build "TokenLens" — a SaaS web app that calculates and simulates AI token costs 
based on:
- Input text (typed or pasted by user)
- Multiple image uploads (with per-image token estimation)
- Multiple file uploads (.pdf, .txt, .docx, .csv, .md)
- Estimated output token predictions
- Real-time cost comparison across 40 top LLM models

The app uses an Anthropic Claude API call to predict token estimates for input/output
when analyzing given content, then calculates cost using a local pricing database
seeded in Supabase.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Framework: Next.js 14+ with App Router and TypeScript
- Database: Supabase (PostgreSQL) with Row Level Security
- Auth: Supabase Auth (email/password + Google OAuth)
- Styling: Tailwind CSS + shadcn/ui components
- State: Zustand for global state management
- File parsing: pdf-parse, mammoth (docx), csv-parse
- Token counting (client-side estimate): tiktoken (js-tiktoken)
- Animation: Framer Motion
- Charts: Recharts
- Payments (optional placeholder): Stripe

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## SUPABASE DATABASE SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create the following tables with full RLS policies:

### 1. `llm_models` (seed data, public read)
```sql
create table llm_models (
  id uuid primary key default gen_random_uuid(),
  rank integer not null,
  name text not null,              -- display name e.g. "GPT-4o"
  model_id text not null unique,   -- API identifier e.g. "gpt-4o"
  provider text not null,          -- "OpenAI", "Anthropic", etc.
  input_price_per_mtok numeric not null,   -- USD per 1M input tokens
  output_price_per_mtok numeric not null,  -- USD per 1M output tokens
  context_window integer,          -- in tokens
  supports_vision boolean default false,
  supports_files boolean default false,
  is_reasoning_model boolean default false,
  notes text,
  created_at timestamptz default now()
);
```

### 2. `calculations` (user history)
```sql
create table calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  session_id text,                 -- for anonymous users
  input_text text,
  input_tokens_estimated integer,
  output_tokens_estimated integer,
  image_count integer default 0,
  file_count integer default 0,
  image_tokens_estimated integer default 0,
  file_tokens_estimated integer default 0,
  selected_model_id text,
  total_input_tokens integer,
  total_output_tokens integer,
  estimated_cost_usd numeric,
  calculation_snapshot jsonb,      -- full result snapshot for all models
  created_at timestamptz default now()
);
```

### 3. `user_profiles`
```sql
create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  plan text default 'free',        -- 'free' | 'pro' | 'enterprise'
  calculations_used integer default 0,
  created_at timestamptz default now()
);
```

### Seed `llm_models` with these 40 models (ranked by LLM leaderboard):

INSERT INTO llm_models (rank, name, model_id, provider, input_price_per_mtok, 
output_price_per_mtok, context_window, supports_vision, supports_files, 
is_reasoning_model) VALUES

-- TIER S: Top 10 Frontier Models
(1,  'Gemini 3.1 Pro Preview', 'gemini-3.1-pro-preview', 'Google', 2.00, 12.00, 1000000, true, true, false),
(2,  'GPT-5.4', 'gpt-5.4', 'OpenAI', 5.00, 40.00, 128000, true, true, true),
(3,  'Claude Opus 4.6 (Adaptive)', 'claude-opus-4-6', 'Anthropic', 5.00, 25.00, 200000, true, true, true),
(4,  'Claude Sonnet 4.6 (Adaptive)', 'claude-sonnet-4-6', 'Anthropic', 3.00, 15.00, 200000, true, true, false),
(5,  'GPT-5.3 Codex', 'gpt-5.3-codex', 'OpenAI', 3.00, 24.00, 256000, true, true, true),
(6,  'Grok 4 Heavy', 'grok-4-heavy', 'xAI', 3.00, 15.00, 256000, true, true, true),
(7,  'GPT-5.2 Pro', 'gpt-5.2-pro', 'OpenAI', 21.00, 168.00, 128000, true, true, true),
(8,  'Gemini 2.5 Pro', 'gemini-2.5-pro', 'Google', 1.25, 10.00, 1000000, true, true, true),
(9,  'GPT-5.2', 'gpt-5.2', 'OpenAI', 1.75, 14.00, 128000, true, true, false),
(10, 'DeepSeek-R1-0528', 'deepseek-r1-0528', 'DeepSeek', 0.55, 2.19, 128000, false, true, true),

-- TIER A: Strong Performers
(11, 'Claude Opus 4.5', 'claude-opus-4-5', 'Anthropic', 15.00, 75.00, 200000, true, true, false),
(12, 'GPT-5.1', 'gpt-5.1', 'OpenAI', 2.00, 16.00, 400000, true, true, false),
(13, 'Grok 4', 'grok-4', 'xAI', 3.00, 15.00, 256000, true, true, false),
(14, 'Gemini 3 Flash', 'gemini-3-flash', 'Google', 0.50, 3.00, 1000000, true, true, false),
(15, 'GPT-5', 'gpt-5', 'OpenAI', 1.25, 10.00, 400000, true, true, false),
(16, 'GPT-4o', 'gpt-4o', 'OpenAI', 2.50, 10.00, 128000, true, true, false),
(17, 'Claude Sonnet 4.5', 'claude-sonnet-4-5', 'Anthropic', 3.00, 15.00, 200000, true, true, false),
(18, 'Qwen3-235B-A22B', 'qwen3-235b-a22b', 'Alibaba', 0.22, 0.88, 128000, false, false, true),
(19, 'Grok 4.1 Fast', 'grok-4.1-fast', 'xAI', 0.20, 0.50, 2000000, true, true, false),
(20, 'GLM-4.6', 'glm-4.6', 'Zhipu AI', 0.50, 2.00, 200000, true, true, false),

-- TIER B: Great Value
(21, 'GPT-5 Mini', 'gpt-5-mini', 'OpenAI', 0.25, 2.00, 128000, true, true, false),
(22, 'DeepSeek V3', 'deepseek-v3', 'DeepSeek', 0.14, 0.28, 128000, false, true, false),
(23, 'Gemini 2.5 Flash', 'gemini-2.5-flash', 'Google', 0.30, 1.50, 1000000, true, true, true),
(24, 'Claude Haiku 4.5', 'claude-haiku-4-5', 'Anthropic', 1.00, 5.00, 200000, true, true, false),
(25, 'Llama 4 Maverick', 'llama-4-maverick', 'Meta', 0.27, 0.85, 1000000, true, true, false),
(26, 'Llama 4 Scout', 'llama-4-scout', 'Meta', 0.08, 0.30, 10000000, true, false, false),
(27, 'Mistral Large 3', 'mistral-large-3', 'Mistral', 2.00, 6.00, 128000, true, true, false),
(28, 'Command R+', 'command-r-plus', 'Cohere', 2.50, 10.00, 128000, false, true, false),
(29, 'Gemma 3 27B', 'gemma-3-27b', 'Google', 0.10, 0.30, 128000, true, false, false),
(30, 'Phi-4', 'phi-4', 'Microsoft', 0.07, 0.14, 16000, false, false, false),

-- TIER C: Budget & Specialized
(31, 'GPT-4o Mini', 'gpt-4o-mini', 'OpenAI', 0.15, 0.60, 128000, true, true, false),
(32, 'Gemini 2.5 Flash-Lite', 'gemini-2.5-flash-lite', 'Google', 0.10, 0.40, 1000000, true, false, false),
(33, 'DeepSeek V3-0324', 'deepseek-v3-0324', 'DeepSeek', 0.27, 1.10, 128000, false, true, false),
(34, 'Llama 3.3 70B', 'llama-3.3-70b', 'Meta', 0.23, 0.92, 128000, false, false, false),
(35, 'Mistral Nemo', 'mistral-nemo', 'Mistral', 0.02, 0.02, 128000, false, false, false),
(36, 'Qwen2.5-72B', 'qwen2.5-72b', 'Alibaba', 0.35, 0.40, 128000, false, false, false),
(37, 'GPT-5 Nano', 'gpt-5-nano', 'OpenAI', 0.05, 0.40, 128000, false, false, false),
(38, 'Gemma 3n E4B', 'gemma-3n-e4b', 'Google', 0.03, 0.10, 32000, false, false, false),
(39, 'Mistral 7B Instruct', 'mistral-7b-instruct', 'Mistral', 0.04, 0.04, 32000, false, false, false),
(40, 'Llama 3.1 8B', 'llama-3.1-8b', 'Meta', 0.10, 0.10, 128000, false, false, false);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## APPLICATION ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### File Structure
```
src/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (auth)/signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              ← Main calculator page
│   │   ├── history/page.tsx      ← Calculation history
│   │   └── compare/page.tsx      ← Side-by-side model comparison
│   ├── api/
│   │   ├── estimate/route.ts     ← Claude API call for token prediction
│   │   ├── models/route.ts       ← Fetch models from Supabase
│   │   └── save-calculation/route.ts
│   ├── layout.tsx
│   └── page.tsx                  ← Landing page
├── components/
│   ├── calculator/
│   │   ├── InputPanel.tsx        ← Text + file + image input
│   │   ├── ModelSelector.tsx     ← Dropdown/grid to pick model
│   │   ├── ResultsPanel.tsx      ← Token breakdown + cost
│   │   ├── ComparisonTable.tsx   ← All 40 models cost table
│   │   └── CostChart.tsx         ← Bar chart visualization
│   ├── ui/ (shadcn components)
│   └── layout/
│       ├── Navbar.tsx
│       └── Sidebar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── tokenizer.ts              ← Client-side token estimation
│   ├── fileParser.ts             ← Extract text from files
│   └── costCalculator.ts         ← Core pricing math
├── stores/
│   └── calculatorStore.ts        ← Zustand store
└── types/
    └── index.ts
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## CORE FEATURES — DETAILED SPECIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### FEATURE 1: Input Panel (`InputPanel.tsx`)
- Textarea for typed/pasted text (auto-resize, 10,000 char limit on free plan)
- Drag-and-drop zone for:
  - Images: .jpg, .png, .gif, .webp (max 10 files, 10MB each)
  - Files: .pdf, .txt, .docx, .csv, .md (max 5 files, 20MB each)
- Live token counter below textarea using `tiktoken` (cl100k_base encoding)
- For images: show thumbnail previews with per-image token estimate badge
  - Formula: (width × height) / 750 ≈ tokens (estimate, capped at 1700 per image)
  - For models that use fixed vision pricing: 85 + 170 × ceil(width/512) × ceil(height/512)
- For files: extract text client-side when possible, server-side for PDF/DOCX
- Show file name, size, extracted character count, and estimated token count per file
- "Clear all" button that resets entire form

### FEATURE 2: Model Selector (`ModelSelector.tsx`)
- Tabbed view: "All Models" | "Frontier" | "Value" | "Open Source"
- Each model card shows: provider logo/color, model name, input $/MTok, output $/MTok, context window badge
- Toggle between "Single Model Mode" (detailed view) and "Compare All Mode" (table view)
- Highlight top 5 models in a "⭐ Recommended" section
- Filter chips: Vision support, Files support, Reasoning model, Budget (<$1/MTok), Premium (>$5/MTok)
- Sticky selected model indicator at top showing current selection

### FEATURE 3: AI-Powered Estimation (`/api/estimate/route.ts`)
This is the KEY differentiator. When user clicks "Estimate", call Claude API to:
1. Analyze the extracted text/file content
2. Predict likely output token range for a typical analysis task
3. Return structured JSON with reasoning

```typescript
// System prompt for estimation API:
const ESTIMATION_SYSTEM_PROMPT = `You are a token estimation expert for AI models. 
Given input content (text, extracted file text, or image descriptions), 
estimate the likely OUTPUT tokens a typical LLM would generate when 
analyzing/responding to this content.

Respond ONLY with valid JSON in this exact format:
{
  "estimated_output_tokens": number,
  "output_token_range": { "min": number, "max": number },
  "complexity": "low" | "medium" | "high" | "very_high",
  "reasoning": "brief explanation max 2 sentences",
  "recommended_model_tier": "budget" | "mid-range" | "premium",
  "multimodal_notes": "notes if images/files present, else null"
}`
```

### FEATURE 4: Results Panel (`ResultsPanel.tsx`)
Display a breakdown card showing:
- **Input Tokens Breakdown:**
  - Text tokens: [count]
  - Image tokens: [count] (× number of images)
  - File tokens: [count] (total extracted)
  - **Total Input Tokens: [count]**
- **Output Tokens Estimate:**
  - Estimated: [count] (AI-predicted)
  - Range: [min] — [max]
  - Complexity: [badge]
- **Cost Summary for Selected Model:**
  - Input cost: $[amount]
  - Output cost: $[amount]
  - **Total estimated cost: $[amount]**
- "Save to History" button (requires auth)

### FEATURE 5: Comparison Table (`ComparisonTable.tsx`)
Show all 40 models in a sortable table:
Columns: Rank | Provider | Model Name | Context Window | Input $/MTok | Output $/MTok | Est. Input Cost | Est. Output Cost | **Total Cost** | Vision | Files

Features:
- Sort by any column (default: Total Cost ascending)
- Color-code rows: green (<$0.01 total), yellow ($0.01-$0.10), orange ($0.10-$1.00), red (>$1.00)
- Highlight currently selected model
- "Use this model" button on each row
- Sticky header
- Show savings percentage vs most expensive model
- Export CSV button

### FEATURE 6: Cost Chart (`CostChart.tsx`)
- Horizontal bar chart (Recharts) showing cost for top 20 models
- Toggle: "Input Only" | "Output Only" | "Total"
- Animated bars on first render
- Show provider color coding
- Tooltip with full cost breakdown on hover

### FEATURE 7: History Page
- Table of past calculations with: date, model used, input tokens, output tokens, total cost
- Click to expand full snapshot with all 40 model costs
- Delete individual records
- Filter by date range or model

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## COST CALCULATION LOGIC (`costCalculator.ts`)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```typescript
export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  model: LLMModel
): CostBreakdown {
  const inputCost = (inputTokens / 1_000_000) * model.input_price_per_mtok;
  const outputCost = (outputTokens / 1_000_000) * model.output_price_per_mtok;
  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    inputCostPerRequest: inputCost,
    monthlyEstimate1k: (inputCost + outputCost) * 1000,
    monthlyEstimate10k: (inputCost + outputCost) * 10_000,
  };
}

// Image token estimation:
export function estimateImageTokens(
  width: number,
  height: number,
  modelProvider: string
): number {
  if (modelProvider === 'Anthropic') {
    // Claude vision pricing formula
    const tilesW = Math.ceil(width / 512);
    const tilesH = Math.ceil(height / 512);
    return 85 + 170 * tilesW * tilesH;
  }
  // Default OpenAI/other estimation
  return Math.min(Math.ceil((width * height) / 750), 1700);
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## UI/UX DESIGN REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design Language: "Developer-first dark SaaS" inspired by Vercel/Linear

- Dark mode by default, light mode toggle available
- Color palette:
  - Background: #0A0A0A (dashboard), #111111 (cards)
  - Accent: Electric blue #3B82F6 (primary), Purple #8B5CF6 (secondary)
  - Success: #10B981, Warning: #F59E0B, Error: #EF4444
  - Text: #F9FAFB (primary), #9CA3AF (muted)
- Typography: Inter font
- Provider color coding in model cards:
  - OpenAI: #74AA9C (teal)
  - Anthropic: #CC785C (orange)
  - Google: #4285F4 (blue)
  - Meta: #0668E1 (blue)
  - xAI/Grok: #FFFFFF (white)
  - DeepSeek: #4D6FFF (indigo)
  - Mistral: #FF7000 (orange)
  - Alibaba/Qwen: #FF6A00 (orange)

Layout:
- Left sidebar (240px) with navigation
- Main content area with 2-column layout on desktop (input left, results right)
- Responsive: stack to single column on mobile
- Sticky results panel that scrolls with content

Micro-interactions:
- Token counter animates when text is typed
- Cost numbers count up with animation when calculated
- Model cards have hover lift effect
- Loading skeleton while AI estimation is running
- Confetti if cost < $0.001 ("💸 Under $0.001!")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## LANDING PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hero section with:
- Headline: "Know exactly what AI will cost you — before you build"
- Sub: "Simulate token costs across 40 top LLM models in seconds"
- Live demo calculator embedded (no auth required for first 5 uses)
- Animated number ticker showing "X tokens analyzed today"

Sections:
1. How it works (3-step visual)
2. Feature highlights with screenshots
3. Pricing table (Free / Pro $9/mo / Enterprise)
4. Model coverage grid (show all 40 model logos)
5. FAQ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ENVIRONMENT VARIABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=              ← For the /api/estimate endpoint

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## IMPORTANT IMPLEMENTATION NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. TOKEN COUNTING: Use `js-tiktoken` with `cl100k_base` encoding as the baseline 
   client-side estimator. Note in the UI that different models use different 
   tokenizers, so actual counts may vary ±10-15%. Claude uses ~1.3x more tokens 
   than tiktoken for the same text on average.

2. FILE PROCESSING FLOW:
   - .txt / .md / .csv → read as text, count tokens directly
   - .pdf → send to /api/parse-file which uses pdf-parse server-side
   - .docx → send to /api/parse-file which uses mammoth server-side
   - Images → generate thumbnail, read dimensions client-side, apply formula

3. RATE LIMITING: Add a simple rate limit on /api/estimate (5 req/min for free 
   users, 60/min for pro) using Supabase to track usage.

4. ANONYMOUS USE: Allow up to 5 calculations without signup using localStorage 
   session_id. Prompt signup after 5th use.

5. ACCURACY DISCLAIMER: Display a notice: "Estimates are indicative. Actual token 
   counts may vary based on model tokenizer, system prompts, and tool usage."

6. CACHING: Cache the llm_models table in memory/Redis for 1 hour since pricing 
   rarely changes. Use Next.js unstable_cache or route segment config.

Build this as a complete, production-ready application. Start with the Supabase 
schema and seed data, then the core calculator logic, then UI components, then 
landing page. Ensure all TypeScript types are properly defined.
```

---

## Ringkasan Arsitektur

Prompt di atas mencakup beberapa bagian utama:

**Database** — Skema Supabase dengan 40 model ter-seed lengkap dengan harga terkini (berdasarkan data pricing Maret 2026), mulai dari Gemini 3.1 Pro ($2/MTok input) hingga Mistral 7B ($0.04/MTok).

**Core Logic** — Formula kalkulasi token untuk teks, gambar (formula khusus per provider seperti Claude vs OpenAI), dan file yang di-parse server-side.

**AI Estimation** — Memanggil Claude API untuk memprediksi output token yang *realistis* berdasarkan konten input — ini yang membedakan app ini dari kalkulator statis biasa.

**UI/UX** — Dark mode, provider color coding, comparison table sortable, bar chart animasi, dan micro-interactions seperti cost counter animasi.