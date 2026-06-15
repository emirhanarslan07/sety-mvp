import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  console.log('Auth callback hit! Full URL:', request.url)
  console.log('Search params keys:', Array.from(requestUrl.searchParams.keys()))
  console.log('Search params entries:', Object.fromEntries(requestUrl.searchParams.entries()))
  const code = requestUrl.searchParams.get('code')

  if (code) {
    console.log('Auth callback received code:', code)
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('exchangeCodeForSession error:', error)
      } else {
        console.log('Code exchanged for session successfully. User ID:', data?.user?.id)
      }
      
      if (data?.user && !error) {
        // Check if profile exists, if not create one
        const { data: existingProfile, error: profileFetchError } = await supabase
          .from('user_profiles')
          .select('user_id')
          .eq('user_id', data.user.id)
          .maybeSingle()
        
        if (profileFetchError) {
          console.error('profileFetchError:', profileFetchError)
        }
        
        if (!existingProfile) {
          console.log('Creating new user profile for:', data.user.email)
          // Create profile
          const { error: profileInsertError } = await supabase.from('user_profiles').insert({
            user_id: data.user.id,
            email: data.user.email!,
            plan_type: 'founder',
            subscription_status: 'trialing',
            trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            is_active: true,
            onboarding_completed: true,
          })
          
          if (profileInsertError) {
            console.error('profileInsertError:', profileInsertError)
          } else {
            console.log('User profile created successfully.')
          }
          
          // Create store with auto-generated username
          const username = (data.user.email?.split('@')[0] || 'user' + Math.floor(Math.random() * 10000))
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
          
          // Check if username exists, append random numbers if so
          const { data: existingStore } = await supabase
            .from('stores')
            .select('username')
            .eq('username', username)
            .maybeSingle()
          
          const finalUsername = existingStore ? username + Math.floor(Math.random() * 1000) : username
          
          console.log('Creating new store with username:', finalUsername)
          const { error: storeInsertError } = await supabase.from('stores').insert({
            user_id: data.user.id,
            username: finalUsername,
            niche: 'Digital Store',
            platform: 'Instagram',
          })
          
          if (storeInsertError) {
            console.error('storeInsertError:', storeInsertError)
          } else {
            console.log('Store created successfully.')
          }
        } else {
          console.log('Profile already exists. Bypassing profile creation.')
        }
      }
    } catch (e) {
      console.error('Unexpected error in callback GET handler:', e)
    }
  } else {
    console.log('Auth callback: No code parameter provided.')
  }

  console.log('Redirecting to /dashboard...')
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}

