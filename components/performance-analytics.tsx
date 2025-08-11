"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { TrendingUp, TrendingDown, Calendar, Clock, Target, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react'
import { authenticatedFetch } from '@/lib/api-client'

interface PerformanceMetrics {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  profitFactor: number
  avgWin: number
  avgLoss: number
  totalPnL: number
  maxDrawdown: number
  sharpeRatio: number
  sortinoRatio: number
  calmarRatio: number
  expectancy: number
  avgTradeDuration: number
  bestDay: string
  worstDay: string
  consecutiveWins: number
  consecutiveLosses: number
}

interface StrategyPerformance {
  strategy: string
  trades: number
  winRate: number
  profitFactor: number
  totalPnL: number
  avgPnL: number
}

interface TimeAnalysis {
  timeOfDay: string
  trades: number
  winRate: number
  avgPnL: number
}

interface SymbolPerformance {
  symbol: string
  trades: number
  winRate: number
  profitFactor: number
  totalPnL: number
  avgPnL: number
}

export function PerformanceAnalytics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [strategyPerformance, setStrategyPerformance] = useState<StrategyPerformance[]>([])
  const [timeAnalysis, setTimeAnalysis] = useState<TimeAnalysis[]>([])
  const [symbolPerformance, setSymbolPerformance] = useState<SymbolPerformance[]>([])
  const [timeframe, setTimeframe] = useState('all')
  const [loading, setLoading] = useState(true)
  const [trades, setTrades] = useState<any[]>([])

  useEffect(() => {
    loadTrades()
  }, [timeframe])

  useEffect(() => {
    if (trades.length > 0) {
      calculateMetrics()
      analyzeStrategies()
      analyzeTimePerformance()
      analyzeSymbolPerformance()
    }
  }, [trades])

  const loadTrades = async () => {
    try {
      setLoading(true)
      const response = await authenticatedFetch('/api/trades')
      const data = await response.json()
      
      if (response.ok && data.trades) {
        let filteredTrades = data.trades.filter((trade: any) => trade.status === 'Closed' && trade.pnl !== null)
        
        // Filter by timeframe
        if (timeframe !== 'all') {
          const now = new Date()
          const filterDate = new Date()
          
          switch (timeframe) {
            case '30d':
              filterDate.setDate(now.getDate() - 30)
              break
            case '90d':
              filterDate.setDate(now.getDate() - 90)
              break
            case '6m':
              filterDate.setMonth(now.getMonth() - 6)
              break
            case '1y':
              filterDate.setFullYear(now.getFullYear() - 1)
              break
          }
          
          filteredTrades = filteredTrades.filter((trade: any) => 
            new Date(trade.trade_date) >= filterDate
          )
        }
        
        setTrades(filteredTrades)
      }
    } catch (error) {
      console.error('Error loading trades:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateMetrics = () => {
    if (trades.length === 0) return

    const winningTrades = trades.filter(trade => trade.pnl > 0)
    const losingTrades = trades.filter(trade => trade.pnl < 0)
    
    const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0)
    const winRate = (winningTrades.length / trades.length) * 100
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / winningTrades.length : 0
    const avgLoss = losingTrades.length > 0 ? losingTrades.reduce((sum, trade) => sum + trade.pnl, 0) / losingTrades.length : 0
    
    const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0)
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0))
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0

    // Calculate max drawdown
    let maxDrawdown = 0
    let peak = 0
    let runningPnL = 0
    
    const sortedTrades = trades.sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())
    
    for (const trade of sortedTrades) {
      runningPnL += trade.pnl
      if (runningPnL > peak) {
        peak = runningPnL
      }
      const drawdown = peak - runningPnL
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown
      }
    }

    // Calculate Sharpe Ratio (simplified)
    const returns = trades.map(trade => trade.pnl / 1000) // Assuming $1000 average position size
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length
    const returnStdDev = Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length)
    const sharpeRatio = returnStdDev > 0 ? (avgReturn - 0.02) / returnStdDev : 0

    // Calculate Sortino Ratio
    const negativeReturns = returns.filter(ret => ret < 0)
    const downsideDeviation = negativeReturns.length > 0 
      ? Math.sqrt(negativeReturns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) / negativeReturns.length)
      : 0
    const sortinoRatio = downsideDeviation > 0 ? (avgReturn - 0.02) / downsideDeviation : 0

    // Calculate Calmar Ratio
    const calmarRatio = maxDrawdown > 0 ? (totalPnL / trades.length) / (maxDrawdown / trades.length) : 0

    // Calculate Expectancy
    const expectancy = (winRate / 100 * avgWin) + ((1 - winRate / 100) * avgLoss)

    // Calculate consecutive wins/losses
    let consecutiveWins = 0
    let consecutiveLosses = 0
    let currentStreak = 0
    
    for (const trade of sortedTrades) {
      if (trade.pnl > 0) {
        if (currentStreak > 0) {
          currentStreak++
        } else {
          currentStreak = 1
        }
        consecutiveWins = Math.max(consecutiveWins, currentStreak)
      } else {
        if (currentStreak < 0) {
          currentStreak--
        } else {
          currentStreak = -1
        }
        consecutiveLosses = Math.max(consecutiveLosses, Math.abs(currentStreak))
      }
    }

    // Find best and worst days
    const dailyPnL = trades.reduce((acc, trade) => {
      const date = new Date(trade.trade_date).toDateString()
      acc[date] = (acc[date] || 0) + trade.pnl
      return acc
    }, {} as { [key: string]: number })

    const bestDay = Object.entries(dailyPnL).reduce((a, b) => dailyPnL[a[0]] > dailyPnL[b[0]] ? a : b)[0]
    const worstDay = Object.entries(dailyPnL).reduce((a, b) => dailyPnL[a[0]] < dailyPnL[b[0]] ? a : b)[0]

    setMetrics({
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: Math.round(winRate * 10) / 10,
      profitFactor: Math.round(profitFactor * 100) / 100,
      avgWin: Math.round(avgWin * 100) / 100,
      avgLoss: Math.round(avgLoss * 100) / 100,
      totalPnL: Math.round(totalPnL * 100) / 100,
      maxDrawdown: Math.round(maxDrawdown * 100) / 100,
      sharpeRatio: Math.round(sharpeRatio * 100) / 100,
      sortinoRatio: Math.round(sortinoRatio * 100) / 100,
      calmarRatio: Math.round(calmarRatio * 100) / 100,
      expectancy: Math.round(expectancy * 100) / 100,
      avgTradeDuration: 0, // Would need trade duration data
      bestDay,
      worstDay,
      consecutiveWins,
      consecutiveLosses
    })
  }

  const analyzeStrategies = () => {
    const strategyMap = new Map<string, any[]>()
    
    trades.forEach(trade => {
      const strategy = trade.strategy || 'No Strategy'
      if (!strategyMap.has(strategy)) {
        strategyMap.set(strategy, [])
      }
      strategyMap.get(strategy)!.push(trade)
    })

    const strategyPerformance = Array.from(strategyMap.entries()).map(([strategy, strategyTrades]) => {
      const winningTrades = strategyTrades.filter(trade => trade.pnl > 0)
      const totalPnL = strategyTrades.reduce((sum, trade) => sum + trade.pnl, 0)
      const winRate = (winningTrades.length / strategyTrades.length) * 100
      
      const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0)
      const losingTrades = strategyTrades.filter(trade => trade.pnl < 0)
      const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0))
      const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0

      return {
        strategy,
        trades: strategyTrades.length,
        winRate: Math.round(winRate * 10) / 10,
        profitFactor: Math.round(profitFactor * 100) / 100,
        totalPnL: Math.round(totalPnL * 100) / 100,
        avgPnL: Math.round((totalPnL / strategyTrades.length) * 100) / 100
      }
    }).sort((a, b) => b.totalPnL - a.totalPnL)

    setStrategyPerformance(strategyPerformance)
  }

  const analyzeTimePerformance = () => {
    const timeMap = new Map<string, any[]>()
    
    trades.forEach(trade => {
      const hour = new Date(trade.trade_date).getHours()
      const timeSlot = hour < 12 ? 'Morning (6-12)' : hour < 17 ? 'Afternoon (12-17)' : 'Evening (17-24)'
      
      if (!timeMap.has(timeSlot)) {
        timeMap.set(timeSlot, [])
      }
      timeMap.get(timeSlot)!.push(trade)
    })

    const timeAnalysis = Array.from(timeMap.entries()).map(([timeOfDay, timeTrades]) => {
      const winningTrades = timeTrades.filter(trade => trade.pnl > 0)
      const totalPnL = timeTrades.reduce((sum, trade) => sum + trade.pnl, 0)
      const winRate = (winningTrades.length / timeTrades.length) * 100

      return {
        timeOfDay,
        trades: timeTrades.length,
        winRate: Math.round(winRate * 10) / 10,
        avgPnL: Math.round((totalPnL / timeTrades.length) * 100) / 100
      }
    })

    setTimeAnalysis(timeAnalysis)
  }

  const analyzeSymbolPerformance = () => {
    const symbolMap = new Map<string, any[]>()
    
    trades.forEach(trade => {
      if (!symbolMap.has(trade.symbol)) {
        symbolMap.set(trade.symbol, [])
      }
      symbolMap.get(trade.symbol)!.push(trade)
    })

    const symbolPerformance = Array.from(symbolMap.entries()).map(([symbol, symbolTrades]) => {
      const winningTrades = symbolTrades.filter(trade => trade.pnl > 0)
      const totalPnL = symbolTrades.reduce((sum, trade) => sum + trade.pnl, 0)
      const winRate = (winningTrades.length / symbolTrades.length) * 100
      
      const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0)
      const losingTrades = symbolTrades.filter(trade => trade.pnl < 0)
      const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0))
      const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0

      return {
        symbol,
        trades: symbolTrades.length,
        winRate: Math.round(winRate * 10) / 10,
        profitFactor: Math.round(profitFactor * 100) / 100,
        totalPnL: Math.round(totalPnL * 100) / 100,
        avgPnL: Math.round((totalPnL / symbolTrades.length) * 100) / 100
      }
    }).sort((a, b) => b.totalPnL - a.totalPnL)

    setSymbolPerformance(symbolPerformance)
  }

  const getPerformanceColor = (value: number, type: 'positive' | 'negative' | 'neutral' = 'neutral') => {
    if (type === 'positive') {
      return value > 0 ? 'text-green-400' : 'text-red-400'
    }
    if (type === 'negative') {
      return value < 0 ? 'text-red-400' : 'text-green-400'
    }
    return value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-slate-400'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse text-slate-400">Loading performance analytics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
          <p className="text-slate-400">Advanced metrics and profitability insights</p>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">All Time</SelectItem>
            <SelectItem value="30d" className="text-white hover:bg-slate-700">30 Days</SelectItem>
            <SelectItem value="90d" className="text-white hover:bg-slate-700">90 Days</SelectItem>
            <SelectItem value="6m" className="text-white hover:bg-slate-700">6 Months</SelectItem>
            <SelectItem value="1y" className="text-white hover:bg-slate-700">1 Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview" className="text-slate-300">Overview</TabsTrigger>
          <TabsTrigger value="strategies" className="text-slate-300">Strategies</TabsTrigger>
          <TabsTrigger value="timing" className="text-slate-300">Timing</TabsTrigger>
          <TabsTrigger value="symbols" className="text-slate-300">Symbols</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {metrics && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="text-slate-400 text-sm">Total P&L</div>
                    <div className={`text-2xl font-bold ${getPerformanceColor(metrics.totalPnL)}`}>
                      ${metrics.totalPnL.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="text-slate-400 text-sm">Win Rate</div>
                    <div className="text-2xl font-bold text-white">{metrics.winRate}%</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="text-slate-400 text-sm">Profit Factor</div>
                    <div className="text-2xl font-bold text-white">{metrics.profitFactor}</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="text-slate-400 text-sm">Max Drawdown</div>
                    <div className="text-2xl font-bold text-red-400">-${metrics.maxDrawdown.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Advanced Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Risk-Adjusted Returns</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-slate-400 text-sm">Sharpe Ratio</div>
                        <div className={`text-lg font-bold ${getPerformanceColor(metrics.sharpeRatio)}`}>
                          {metrics.sharpeRatio}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Sortino Ratio</div>
                        <div className={`text-lg font-bold ${getPerformanceColor(metrics.sortinoRatio)}`}>
                          {metrics.sortinoRatio}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Calmar Ratio</div>
                        <div className={`text-lg font-bold ${getPerformanceColor(metrics.calmarRatio)}`}>
                          {metrics.calmarRatio}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Expectancy</div>
                        <div className={`text-lg font-bold ${getPerformanceColor(metrics.expectancy)}`}>
                          ${metrics.expectancy}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Trade Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-slate-400 text-sm">Total Trades</div>
                        <div className="text-lg font-bold text-white">{metrics.totalTrades}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Winning Trades</div>
                        <div className="text-lg font-bold text-green-400">{metrics.winningTrades}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Avg Win</div>
                        <div className="text-lg font-bold text-green-400">${metrics.avgWin}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Avg Loss</div>
                        <div className="text-lg font-bold text-red-400">${metrics.avgLoss}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-slate-400 text-sm">Best Streak</div>
                        <div className="text-lg font-bold text-green-400">{metrics.consecutiveWins}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Worst Streak</div>
                        <div className="text-lg font-bold text-red-400">{metrics.consecutiveLosses}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Win/Loss Distribution Chart */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Win/Loss Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Winning Trades', value: metrics.winningTrades, color: '#10b981' },
                            { name: 'Losing Trades', value: metrics.losingTrades, color: '#ef4444' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {[
                            { name: 'Winning Trades', value: metrics.winningTrades, color: '#10b981' },
                            { name: 'Losing Trades', value: metrics.losingTrades, color: '#ef4444' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Strategy Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Strategy</TableHead>
                    <TableHead className="text-slate-300">Trades</TableHead>
                    <TableHead className="text-slate-300">Win Rate</TableHead>
                    <TableHead className="text-slate-300">Profit Factor</TableHead>
                    <TableHead className="text-slate-300">Total P&L</TableHead>
                    <TableHead className="text-slate-300">Avg P&L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {strategyPerformance.map((strategy) => (
                    <TableRow key={strategy.strategy} className="border-slate-700">
                      <TableCell className="text-white font-medium">{strategy.strategy}</TableCell>
                      <TableCell className="text-white">{strategy.trades}</TableCell>
                      <TableCell className="text-white">{strategy.winRate}%</TableCell>
                      <TableCell className="text-white">{strategy.profitFactor}</TableCell>
                      <TableCell className={`font-bold ${getPerformanceColor(strategy.totalPnL)}`}>
                        ${strategy.totalPnL}
                      </TableCell>
                      <TableCell className={`font-bold ${getPerformanceColor(strategy.avgPnL)}`}>
                        ${strategy.avgPnL}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Time-Based Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="timeOfDay" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Bar dataKey="avgPnL" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symbols" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Symbol Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Symbol</TableHead>
                    <TableHead className="text-slate-300">Trades</TableHead>
                    <TableHead className="text-slate-300">Win Rate</TableHead>
                    <TableHead className="text-slate-300">Profit Factor</TableHead>
                    <TableHead className="text-slate-300">Total P&L</TableHead>
                    <TableHead className="text-slate-300">Avg P&L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {symbolPerformance.map((symbol) => (
                    <TableRow key={symbol.symbol} className="border-slate-700">
                      <TableCell className="text-white font-medium">{symbol.symbol}</TableCell>
                      <TableCell className="text-white">{symbol.trades}</TableCell>
                      <TableCell className="text-white">{symbol.winRate}%</TableCell>
                      <TableCell className="text-white">{symbol.profitFactor}</TableCell>
                      <TableCell className={`font-bold ${getPerformanceColor(symbol.totalPnL)}`}>
                        ${symbol.totalPnL}
                      </TableCell>
                      <TableCell className={`font-bold ${getPerformanceColor(symbol.avgPnL)}`}>
                        ${symbol.avgPnL}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
