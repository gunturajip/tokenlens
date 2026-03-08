import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

const supabase = createClient();

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('llm_models')
      .select('*')
      .order('rank', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Models API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}
