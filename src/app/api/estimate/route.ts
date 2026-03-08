import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

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
 }`;

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      // Mock response if API key is missing
      return NextResponse.json({
        estimated_output_tokens: 500,
        output_token_range: { min: 300, max: 800 },
        complexity: "medium",
        reasoning: "Mock estimation because ANTHROPIC_API_KEY is not set.",
        recommended_model_tier: "mid-range",
        multimodal_notes: null
      });
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      system: ESTIMATION_SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: `Estimate output for this content: ${content.substring(0, 50000)}` }
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const result = JSON.parse(responseText);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Estimation API Error:', error);
    return NextResponse.json({ error: 'Failed to estimate tokens' }, { status: 500 });
  }
}
