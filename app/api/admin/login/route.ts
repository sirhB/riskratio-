import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { loginKey } = await request.json()

    if (!loginKey) {
      return NextResponse.json(
        { error: 'Login key is required' },
        { status: 400 }
      )
    }

    // Check admin credentials
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', 'admin')
      .eq('password_hash', loginKey)
      .single()

    if (error || !admin) {
      return NextResponse.json(
        { error: 'Invalid login key' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully'
    })

  } catch (error) {
    console.error('Error in admin login:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
