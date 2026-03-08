import { getEncoding, Tiktoken } from "js-tiktoken";

let cachedEncoding: Tiktoken | null = null;

function getCachedEncoding(): Tiktoken {
  if (!cachedEncoding) {
    cachedEncoding = getEncoding("cl100k_base");
  }
  return cachedEncoding;
}

export function countTokens(text: string): number {
  if (!text) return 0;

  try {
    const enc = getCachedEncoding();
    const tokens = enc.encode(text);
    return tokens.length;
  } catch (error) {
    console.error("Token counting error:", error);
    return Math.ceil(text.length / 4);
  }
}

export function estimateClaudeTokens(text: string): number {
  const baseTokens = countTokens(text);
  return Math.ceil(baseTokens * 1.3);
}
