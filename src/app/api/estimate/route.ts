import { NextResponse } from 'next/server';

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

    if (!process.env.MINIMAX_API_KEY) {
      return NextResponse.json({
        estimated_output_tokens: 500,
        output_token_range: { min: 300, max: 800 },
        complexity: "medium",
        reasoning: "Mock estimation because MINIMAX_API_KEY is not set.",
        recommended_model_tier: "mid-range",
        multimodal_notes: null
      });
    }

    const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.5',
        messages: [
          { role: 'system', content: ESTIMATION_SYSTEM_PROMPT },
          { role: 'user', content: `Estimate output for this content: ${content.substring(0, 50000)}` }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MiniMax API Error:', data);
      return NextResponse.json({ error: 'Failed to estimate tokens' }, { status: 500 });
    }

    const responseText = data.choices?.[0]?.message?.content || '';
    const result = JSON.parse(responseText);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Estimation API Error:', error);
    return NextResponse.json({ error: 'Failed to estimate tokens' }, { status: 500 });
  }
}
