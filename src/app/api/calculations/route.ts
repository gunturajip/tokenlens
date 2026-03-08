import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: calculations, error } = await supabase
      .from('calculations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching calculations:', error)
      return NextResponse.json({ error: 'Failed to fetch calculations' }, { status: 500 })
    }

    return NextResponse.json({ calculations })
  } catch (error) {
    console.error('Error in GET /api/calculations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      model_id,
      model_name,
      provider,
      input_tokens,
      output_tokens,
      requests_per_day,
      input_cost,
      output_cost,
      total_cost,
      daily_cost,
      monthly_cost,
    } = body

    // Validate required fields
    if (!model_id || !model_name || !provider || input_tokens === undefined || output_tokens === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: calculation, error } = await supabase
      .from('calculations')
      .insert({
        user_id: user.id,
        model_id,
        model_name,
        provider,
        input_tokens,
        output_tokens,
        requests_per_day: requests_per_day || 1,
        input_cost,
        output_cost,
        total_cost,
        daily_cost,
        monthly_cost,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving calculation:', error)
      return NextResponse.json({ error: 'Failed to save calculation' }, { status: 500 })
    }

    return NextResponse.json({ calculation }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/calculations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing calculation ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('calculations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting calculation:', error)
      return NextResponse.json({ error: 'Failed to delete calculation' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/calculations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
