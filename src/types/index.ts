export interface LLMModel {
  id: string;
  rank: number;
  name: string;
  model_id: string;
  provider: string;
  input_price_per_mtok: number;
  output_price_per_mtok: number;
  context_window: number;
  supports_vision: boolean;
  supports_files: boolean;
  is_reasoning_model: boolean;
  notes?: string;
  created_at: string;
}

export interface Calculation {
  id: string;
  user_id?: string;
  session_id?: string;
  input_text?: string;
  input_tokens_estimated: number;
  output_tokens_estimated: number;
  image_count: number;
  file_count: number;
  image_tokens_estimated: number;
  file_tokens_estimated: number;
  selected_model_id?: string;
  total_input_tokens: number;
  total_output_tokens: number;
  estimated_cost_usd: number;
  calculation_snapshot: Record<string, CostBreakdown>;
  created_at: string;
}

export interface UserProfile {
  id: string;
  display_name?: string;
  plan: 'free' | 'pro' | 'enterprise';
  calculations_used: number;
  auth_provider?: string;
  created_at: string;
}

export interface CostBreakdown {
  inputCost: number;
  outputCost: number;
  totalCost: number;
  inputCostPerRequest: number;
  monthlyEstimate1k: number;
  monthlyEstimate10k: number;
}

export interface EstimationResult {
  estimated_output_tokens: number;
  output_token_range: { min: number; max: number };
  complexity: 'low' | 'medium' | 'high' | 'very_high';
  reasoning: string;
  recommended_model_tier: 'budget' | 'mid-range' | 'premium';
  multimodal_notes: string | null;
  totalCost: number;
  inputTokens: number;
  outputTokens: number;
  breakdown: {
    inputCost: number;
    outputCost: number;
  };
}
