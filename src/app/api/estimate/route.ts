import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.MINIMAX_API_KEY || '',
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

function getDefaultEstimation() {
  return {
    estimated_output_tokens: 500,
    output_token_range: { min: 300, max: 800 },
    complexity: "medium",
    reasoning: "Default estimation due to API error.",
    recommended_model_tier: "mid-range",
    multimodal_notes: null
  };
}

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!process.env.MINIMAX_API_KEY) {
      return NextResponse.json(getDefaultEstimation());
    }

    let message;
    try {
      message = await anthropic.messages.create({
        model: 'MiniMax-M2.5',
        max_tokens: 1000,
        system: ESTIMATION_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Estimate output for this content: ${content.substring(0, 50000)}`
          }
        ],
      });
    } catch (apiError) {
      console.error('MiniMax API call failed:', apiError);
      return NextResponse.json(getDefaultEstimation());
    }

    console.log('MiniMax Response:', JSON.stringify(message, null, 2));

    let responseText = '';

    if (message.content && Array.isArray(message.content)) {
      for (const block of message.content) {
        if (block.type === 'text') {
          responseText = block.text || '';
          break;
        }
      }
    }

    if (!responseText) {
      console.error('Empty response text from MiniMax');
      return NextResponse.json(getDefaultEstimation());
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', responseText);
      return NextResponse.json(getDefaultEstimation());
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Estimation API Error:', error);
    return NextResponse.json(getDefaultEstimation());
  }
}
