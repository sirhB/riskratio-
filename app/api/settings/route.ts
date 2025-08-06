import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request headers
    const userHeader = request.headers.get('x-user-id')
    if (!userHeader) {
      return NextResponse.json({ error: 'User authentication required' }, { status: 401 })
    }

    const userData = JSON.parse(userHeader)
    const userId = userData.id

    // Try to fetch user settings
    let { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    // If no settings found, create default settings
    if (error && error.code === 'PGRST116') {
      const { data: newSettings, error: createError } = await supabase
        .from('user_settings')
        .insert([{
          user_id: userId,
          default_leverage: 1.00,
          account_currency: 'USD',
          account_balance: 10000.00,
          risk_per_trade: 2.00,
          timezone: 'UTC',
          date_format: 'MM/DD/YYYY',
          theme: 'dark',
          email_notifications: true,
          trade_alerts: true,
          performance_reports: true,
          data_sharing: false,
          analytics_tracking: true
        }])
        .select()
        .single()

      if (createError) {
        console.error('Error creating default settings:', createError)
        return NextResponse.json({ error: 'Failed to create default settings' }, { status: 500 })
      }

      settings = newSettings
    } else if (error) {
      console.error('Error fetching user settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error in GET /api/settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get user ID from request headers
    const userHeader = request.headers.get('x-user-id')
    if (!userHeader) {
      return NextResponse.json({ error: 'User authentication required' }, { status: 401 })
    }

    const userData = JSON.parse(userHeader)
    const userId = userData.id

    const updateData = {
      default_leverage: body.defaultLeverage ? parseFloat(body.defaultLeverage) : undefined,
      account_currency: body.accountCurrency,
      account_balance: body.accountBalance ? parseFloat(body.accountBalance) : undefined,
      risk_per_trade: body.riskPerTrade ? parseFloat(body.riskPerTrade) : undefined,
      timezone: body.timezone,
      date_format: body.dateFormat,
      theme: body.theme,
      email_notifications: body.emailNotifications,
      trade_alerts: body.tradeAlerts,
      performance_reports: body.performanceReports,
      data_sharing: body.dataSharing,
      analytics_tracking: body.analyticsTracking
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
    )

    // Try to update existing settings
    let { data: settings, error } = await supabase
      .from('user_settings')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single()

    // If no settings found, create new ones with the update data
    if (error && error.code === 'PGRST116') {
      const { data: newSettings, error: createError } = await supabase
        .from('user_settings')
        .insert([{
          user_id: userId,
          default_leverage: updateData.default_leverage || 1.00,
          account_currency: updateData.account_currency || 'USD',
          account_balance: updateData.account_balance || 10000.00,
          risk_per_trade: updateData.risk_per_trade || 2.00,
          timezone: updateData.timezone || 'UTC',
          date_format: updateData.date_format || 'MM/DD/YYYY',
          theme: updateData.theme || 'dark',
          email_notifications: updateData.email_notifications !== undefined ? updateData.email_notifications : true,
          trade_alerts: updateData.trade_alerts !== undefined ? updateData.trade_alerts : true,
          performance_reports: updateData.performance_reports !== undefined ? updateData.performance_reports : true,
          data_sharing: updateData.data_sharing !== undefined ? updateData.data_sharing : false,
          analytics_tracking: updateData.analytics_tracking !== undefined ? updateData.analytics_tracking : true
        }])
        .select()
        .single()

      if (createError) {
        console.error('Error creating settings:', createError)
        return NextResponse.json({ error: 'Failed to create settings' }, { status: 500 })
      }

      settings = newSettings
    } else if (error) {
      console.error('Error updating user settings:', error)
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error in PUT /api/settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
