import { LLMModel, CostBreakdown } from '../types';

/**
 * Calculates the cost breakdown for a given model based on input and output tokens.
 */
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

/**
 * Image token estimation logic.
 * Different providers use different vision pricing strategies.
 */
export function estimateImageTokens(
  width: number,
  height: number,
  modelProvider: string
): number {
  if (modelProvider === 'Anthropic') {
    // Claude vision pricing formula: 85 + 170 * (ceil(width/512) * ceil(height/512))
    const tilesW = Math.ceil(width / 512);
    const tilesH = Math.ceil(height / 512);
    return 85 + 170 * tilesW * tilesH;
  }
  
  // Default OpenAI/other estimation: (width * height) / 750, capped at 1700
  return Math.min(Math.ceil((width * height) / 750), 1700);
}
