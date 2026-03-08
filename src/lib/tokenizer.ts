import { getEncoding } from "js-tiktoken";

/**
 * Token counting using cl100k_base encoding (baseline for GPT-4/Claude models).
 */
export function countTokens(text: string): number {
  if (!text) return 0;
  
  try {
    const enc = getEncoding("cl100k_base");
    const tokens = enc.encode(text);
    return tokens.length;
  } catch (error) {
    console.error("Token counting error:", error);
    // Fallback: roughly 4 characters per token
    return Math.ceil(text.length / 4);
  }
}

/**
 * Claude models typically use ~1.3x more tokens than tiktoken for the same text.
 * This helper provides a more accurate estimate for Anthropic models.
 */
export function estimateClaudeTokens(text: string): number {
  const baseTokens = countTokens(text);
  return Math.ceil(baseTokens * 1.3);
}
