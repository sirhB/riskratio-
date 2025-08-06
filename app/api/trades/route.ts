import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Contract size mapping for different instruments
const getContractSize = (symbol: string): number => {
  const contractSizes: { [key: string]: number } = {
    // Futures contract sizes
    'ES': 50.00,      // S&P 500 E-mini
    'NQ': 20.00,      // NASDAQ E-mini
    'YM': 5.00,       // Dow E-mini
    'RTY': 10.00,     // Russell 2000 E-mini
    'CL': 1000.00,    // Crude Oil
    'NG': 10000.00,   // Natural Gas
    'GC': 100.00,     // Gold
    'SI': 5000.00,    // Silver
    'ZB': 1000.00,    // 30-Year Treasury Bond
    'ZN': 1000.00,    // 10-Year Treasury Note
    'ZF': 1000.00,    // 5-Year Treasury Note
    'ZT': 2000.00,    // 2-Year Treasury Note
    '6E': 125000.00,  // Euro FX
    '6B': 62500.00,   // British Pound
    '6A': 100000.00,  // Australian Dollar
    '6J': 12500000.00, // Japanese Yen
    '6S': 125000.00,  // Swiss Franc
    '6C': 100000.00,  // Canadian Dollar
  }

  // Forex pairs (standard lot = 100,000 units)
  if (symbol.length === 6) {
    return 100000.00
  }

  return contractSizes[symbol] || 1.00
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '50'
    const offset = searchParams.get('offset') || '0'
    
    // Get user ID from request headers or session
    const userHeader = request.headers.get('x-user-id')
    if (!userHeader) {
      return NextResponse.json({ error: 'User authentication required' }, { status: 401 })
    }

    const userData = JSON.parse(userHeader)
    const userId = userData.id

    const { data: trades, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('trade_date', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) {
      console.error('Error fetching trades:', error)
      return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 })
    }

    return NextResponse.json({ trades })
  } catch (error) {
    console.error('Error in GET /api/trades:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get user ID from request headers
    const userHeader = request.headers.get('x-user-id')
    if (!userHeader) {
      return NextResponse.json({ error: 'User authentication required' }, { status: 401 })
    }

    const userData = JSON.parse(userHeader)
    const userId = userData.id

    // Get user's default leverage from settings
    const { data: userSettings } = await supabase
      .from('user_settings')
      .select('default_leverage')
      .eq('user_id', userId)
      .single()

    const defaultLeverage = userSettings?.default_leverage || 1.00
    const contractSize = getContractSize(body.symbol.toUpperCase())
    
    const tradeData = {
      user_id: userId,
      symbol: body.symbol.toUpperCase(),
      side: body.side,
      quantity: parseFloat(body.quantity),
      entry_price: parseFloat(body.entryPrice),
      exit_price: body.exitPrice ? parseFloat(body.exitPrice) : null,
      trade_date: body.date,
      strategy: body.strategy || null,
      notes: body.notes || null,
      status: body.exitPrice ? 'Closed' : 'Open',
      leverage: body.leverage ? parseFloat(body.leverage) : defaultLeverage,
      contract_size: contractSize
    }

    const { data: trade, error } = await supabase
      .from('trades')
      .insert([tradeData])
      .select()
      .single()

    if (error) {
      console.error('Error creating trade:', error)
      return NextResponse.json({ error: 'Failed to create trade' }, { status: 500 })
    }

    return NextResponse.json({ trade }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/trades:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
