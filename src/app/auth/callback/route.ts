import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('redirectTo') || '/calculator'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const provider = user.app_metadata?.provider || 'email'

                const { error: updateError } = await supabase
                    .from('user_profiles')
                    .update({ auth_provider: provider })
                    .eq('id', user.id)

                if (updateError) {
                    console.error('Error updating user auth provider:', updateError)
                }
            }

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`)
}
