import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication (in a real app, use proper JWT verification)
    const authHeader = request.headers.get('authorization')
    // For demo purposes, we'll skip auth verification here
    
    // Get user statistics from the privacy-safe view
    const { data: userStats, error: userStatsError } = await supabase
      .from('admin_user_stats')
      .select('*')
      .order('total_pnl', { ascending: false })

    if (userStatsError) {
      console.error('Error fetching user stats:', userStatsError)
      return NextResponse.json({ error: 'Failed to fetch user statistics' }, { status: 500 })
    }

    // Calculate admin dashboard statistics
    const totalUsers = userStats.length
    const activeUsers = userStats.filter(user => user.total_trades > 0).length
    const totalTrades = userStats.reduce((sum, user) => sum + user.total_trades, 0)
    const totalVolume = userStats.reduce((sum, user) => sum + Math.abs(user.total_pnl), 0)
    const avgUserPnL = totalUsers > 0 ? userStats.reduce((sum, user) => sum + user.total_pnl, 0) / totalUsers : 0
    const topPerformers = userStats.filter(user => user.total_pnl > 0).length

    const adminStats = {
      totalUsers,
      activeUsers,
      totalTrades,
      totalVolume: Math.round(totalVolume * 100) / 100,
      avgUserPnL: Math.round(avgUserPnL * 100) / 100,
      topPerformers
    }

    return NextResponse.json({
      userStats,
      adminStats
    })

  } catch (error) {
    console.error('Error in GET /api/admin/stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
