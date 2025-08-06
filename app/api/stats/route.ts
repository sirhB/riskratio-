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

    // Fetch all trades for the authenticated user only
    const { data: trades, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching trades for stats:', error)
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }

    const closedTrades = trades.filter(trade => trade.status === 'Closed' && trade.pnl !== null)
    const winningTrades = closedTrades.filter(trade => trade.pnl! > 0)
    const losingTrades = closedTrades.filter(trade => trade.pnl! < 0)

    const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0)
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, trade) => sum + trade.pnl!, 0) / winningTrades.length : 0
    const avgLoss = losingTrades.length > 0 ? losingTrades.reduce((sum, trade) => sum + trade.pnl!, 0) / losingTrades.length : 0
    
    const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl!, 0)
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl!, 0))
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0

    // Calculate max drawdown (simplified)
    let maxDrawdown = 0
    let peak = 0
    let runningPnL = 0
    
    const sortedTrades = closedTrades.sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())
    
    for (const trade of sortedTrades) {
      runningPnL += trade.pnl || 0
      if (runningPnL > peak) {
        peak = runningPnL
      }
      const drawdown = peak - runningPnL
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown
      }
    }

    // Simple Sharpe ratio calculation (assuming risk-free rate of 2%)
    const returns = closedTrades.map(trade => (trade.pnl || 0) / (trade.entry_price * trade.quantity))
    const avgReturn = returns.length > 0 ? returns.reduce((sum, ret) => sum + ret, 0) / returns.length : 0
    const returnStdDev = returns.length > 1 ? Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / (returns.length - 1)) : 0
    const sharpeRatio = returnStdDev > 0 ? (avgReturn - 0.02) / returnStdDev : 0

    const stats = {
      totalPnL: Math.round(totalPnL * 100) / 100,
      winRate: Math.round(winRate * 10) / 10,
      totalTrades: trades.length,
      avgWin: Math.round(avgWin * 100) / 100,
      avgLoss: Math.round(avgLoss * 100) / 100,
      profitFactor: Math.round(profitFactor * 100) / 100,
      maxDrawdown: -Math.round(maxDrawdown * 100) / 100,
      sharpeRatio: Math.round(sharpeRatio * 100) / 100
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error in GET /api/stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
