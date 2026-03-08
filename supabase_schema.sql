-- 1. Create llm_models table
create table if not exists llm_models (
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

-- 2. Create calculations table
create table if not exists calculations (
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

-- 3. Create user_profiles table
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  plan text default 'free',        -- 'free' | 'pro' | 'enterprise'
  calculations_used integer default 0,
  created_at timestamptz default now()
);

-- Enable RLS
alter table llm_models enable row level security;
alter table calculations enable row level security;
alter table user_profiles enable row level security;

-- RLS Policies
create policy "Allow public read on llm_models" on llm_models for select using (true);

create policy "Users can see their own calculations" on calculations
  for select using (auth.uid() = user_id or session_id is not null);

create policy "Users can insert their own calculations" on calculations
  for insert with check (auth.uid() = user_id or session_id is not null);

create policy "Users can see their own profile" on user_profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on user_profiles
  for update using (auth.uid() = id);

-- Seed llm_models
INSERT INTO llm_models (rank, name, model_id, provider, input_price_per_mtok, output_price_per_mtok, context_window, supports_vision, supports_files, is_reasoning_model) VALUES
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
(31, 'GPT-4o Mini', 'gpt-4o-mini', 'OpenAI', 0.15, 0.60, 128000, true, true, false),
(32, 'Gemini 2.5 Flash-Lite', 'gemini-2.5-flash-lite', 'Google', 0.10, 0.40, 1000000, true, false, false),
(33, 'DeepSeek V3-0324', 'deepseek-v3-0324', 'DeepSeek', 0.27, 1.10, 128000, false, true, false),
(34, 'Llama 3.3 70B', 'llama-3.3-70b', 'Meta', 0.23, 0.92, 128000, false, false, false),
(35, 'Mistral Nemo', 'mistral-nemo', 'Mistral', 0.02, 0.02, 128000, false, false, false),
(36, 'Qwen2.5-72B', 'qwen2.5-72b', 'Alibaba', 0.35, 0.40, 128000, false, false, false),
(37, 'GPT-5 Nano', 'gpt-5-nano', 'OpenAI', 0.05, 0.40, 128000, false, false, false),
(38, 'Gemma 3n E4B', 'gemma-3n-e4b', 'Google', 0.03, 0.10, 32000, false, false, false),
(39, 'Mistral 7B Instruct', 'mistral-7b-instruct', 'Mistral', 0.04, 0.04, 32000, false, false, false),
(40, 'Llama 3.1 8B', 'llama-3.1-8b', 'Meta', 0.10, 0.10, 128000, false, false, false)
ON CONFLICT (model_id) DO UPDATE SET
  rank = EXCLUDED.rank,
  name = EXCLUDED.name,
  provider = EXCLUDED.provider,
  input_price_per_mtok = EXCLUDED.input_price_per_mtok,
  output_price_per_mtok = EXCLUDED.output_price_per_mtok,
  context_window = EXCLUDED.context_window,
  supports_vision = EXCLUDED.supports_vision,
  supports_files = EXCLUDED.supports_files,
  is_reasoning_model = EXCLUDED.is_reasoning_model;
