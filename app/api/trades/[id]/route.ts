import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params

    // Get user ID from request headers
    const userHeader = request.headers.get('x-user-id')
    if (!userHeader) {
      return NextResponse.json({ error: 'User authentication required' }, { status: 401 })
    }

    const userData = JSON.parse(userHeader)
    const userId = userData.id

    const updateData = {
      symbol: body.symbol?.toUpperCase(),
      side: body.side,
      quantity: body.quantity ? parseFloat(body.quantity) : undefined,
      entry_price: body.entryPrice ? parseFloat(body.entryPrice) : undefined,
      exit_price: body.exitPrice ? parseFloat(body.exitPrice) : null,
      trade_date: body.date,
      strategy: body.strategy || null,
      notes: body.notes || null,
      status: body.exitPrice ? 'Closed' : 'Open'
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
    )

    const { data: trade, error } = await supabase
      .from('trades')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId) // Ensure user can only update their own trades
      .select()
      .single()

    if (error) {
      console.error('Error updating trade:', error)
      return NextResponse.json({ error: 'Failed to update trade' }, { status: 500 })
    }

    if (!trade) {
      return NextResponse.json({ error: 'Trade not found or access denied' }, { status: 404 })
    }

    return NextResponse.json({ trade })
  } catch (error) {
    console.error('Error in PUT /api/trades/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get user ID from request headers
    const userHeader = request.headers.get('x-user-id')
    if (!userHeader) {
      return NextResponse.json({ error: 'User authentication required' }, { status: 401 })
    }

    const userData = JSON.parse(userHeader)
    const userId = userData.id

    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', id)
      .eq('user_id', userId) // Ensure user can only delete their own trades

    if (error) {
      console.error('Error deleting trade:', error)
      return NextResponse.json({ error: 'Failed to delete trade' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Trade deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/trades/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
