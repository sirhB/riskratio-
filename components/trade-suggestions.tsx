"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, TrendingUp, TrendingDown, Target, Clock, Zap, Brain, Lightbulb, CheckCircle } from 'lucide-react'
import { authenticatedFetch } from '@/lib/api-client'
import { marketDataService } from '@/lib/market-data'

interface TradeSuggestion {
  id: string
  symbol: string
  type: 'entry' | 'exit' | 'strategy'
  confidence: number
  reasoning: string
  priceTarget?: number
  stopLoss?: number
  takeProfit?: number
  timeframe: string
  riskLevel: 'low' | 'medium' | 'high'
  expectedReturn: number
  marketCondition: string
  timestamp: number
}

interface MarketCondition {
  symbol: string
  volatility: number
  trend: 'bullish' | 'bearish' | 'sideways'
  strength: number
  support: number
  resistance: number
  recommendation: string
}

interface StrategyRecommendation {
  strategy: string
  description: string
  winRate: number
  avgReturn: number
  riskLevel: 'low' | 'medium' | 'high'
  marketConditions: string[]
  confidence: number
}

export function TradeSuggestions() {
  const [suggestions, setSuggestions] = useState<TradeSuggestion[]>([])
  const [marketConditions, setMarketConditions] = useState<MarketCondition[]>([])
  const [strategyRecommendations, setStrategyRecommendations] = useState<StrategyRecommendation[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState("")
  const [loading, setLoading] = useState(false)
  const [trades, setTrades] = useState<any[]>([])

  useEffect(() => {
    loadTrades()
    generateSuggestions()
  }, [])

  const loadTrades = async () => {
    try {
      const response = await authenticatedFetch('/api/trades')
      const data = await response.json()
      
      if (response.ok && data.trades) {
        setTrades(data.trades)
      }
    } catch (error) {
      console.error('Error loading trades:', error)
    }
  }

  const generateSuggestions = async () => {
    setLoading(true)
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock suggestions based on market data and historical performance
    const mockSuggestions: TradeSuggestion[] = []
    const symbols = ['ES', 'NQ', 'CL', 'GC', 'EURUSD', 'GBPUSD']
    
    symbols.forEach((symbol, index) => {
      const currentPrice = marketDataService.getCurrentPrice(symbol)
      if (!currentPrice) return

      // Generate entry suggestions
      if (Math.random() > 0.5) {
        const entrySuggestion: TradeSuggestion = {
          id: `entry_${symbol}_${Date.now()}`,
          symbol,
          type: 'entry',
          confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
          reasoning: generateEntryReasoning(symbol, currentPrice),
          priceTarget: currentPrice.price * (1 + (Math.random() * 0.02 - 0.01)), // ±1%
          stopLoss: currentPrice.price * (1 - (Math.random() * 0.01 + 0.005)), // -0.5% to -1.5%
          takeProfit: currentPrice.price * (1 + (Math.random() * 0.02 + 0.01)), // +1% to +3%
          timeframe: ['1H', '4H', '1D'][Math.floor(Math.random() * 3)],
          riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          expectedReturn: Math.floor(Math.random() * 5) + 1, // 1-5%
          marketCondition: getMarketCondition(symbol),
          timestamp: Date.now() - Math.random() * 3600000 // Within last hour
        }
        mockSuggestions.push(entrySuggestion)
      }

      // Generate exit suggestions for open positions
      const openTrades = trades.filter(trade => trade.symbol === symbol && trade.status === 'Open')
      if (openTrades.length > 0) {
        const exitSuggestion: TradeSuggestion = {
          id: `exit_${symbol}_${Date.now()}`,
          symbol,
          type: 'exit',
          confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
          reasoning: generateExitReasoning(symbol, openTrades[0]),
          timeframe: '1H',
          riskLevel: 'medium',
          expectedReturn: Math.floor(Math.random() * 3) + 1, // 1-3%
          marketCondition: getMarketCondition(symbol),
          timestamp: Date.now() - Math.random() * 1800000 // Within last 30 minutes
        }
        mockSuggestions.push(exitSuggestion)
      }
    })

    // Generate market condition analysis
    const mockMarketConditions: MarketCondition[] = symbols.map(symbol => {
      const currentPrice = marketDataService.getCurrentPrice(symbol)
      if (!currentPrice) return null

      return {
        symbol,
        volatility: Math.floor(Math.random() * 50) + 10, // 10-60%
        trend: ['bullish', 'bearish', 'sideways'][Math.floor(Math.random() * 3)] as 'bullish' | 'bearish' | 'sideways',
        strength: Math.floor(Math.random() * 40) + 60, // 60-100%
        support: currentPrice.price * (1 - (Math.random() * 0.02 + 0.01)),
        resistance: currentPrice.price * (1 + (Math.random() * 0.02 + 0.01)),
        recommendation: generateMarketRecommendation(symbol)
      }
    }).filter(Boolean) as MarketCondition[]

    // Generate strategy recommendations
    const mockStrategyRecommendations: StrategyRecommendation[] = [
      {
        strategy: 'Breakout Trading',
        description: 'Enter trades when price breaks above resistance or below support with high volume',
        winRate: 65,
        avgReturn: 2.5,
        riskLevel: 'medium',
        marketConditions: ['High Volatility', 'Clear Support/Resistance'],
        confidence: 85
      },
      {
        strategy: 'Mean Reversion',
        description: 'Trade against extreme moves, expecting price to return to average',
        winRate: 58,
        avgReturn: 1.8,
        riskLevel: 'low',
        marketConditions: ['Sideways Market', 'Low Volatility'],
        confidence: 72
      },
      {
        strategy: 'Trend Following',
        description: 'Follow established trends with momentum indicators',
        winRate: 62,
        avgReturn: 3.2,
        riskLevel: 'high',
        marketConditions: ['Strong Trend', 'High Volume'],
        confidence: 78
      },
      {
        strategy: 'Scalping',
        description: 'Quick trades with tight stops for small profits',
        winRate: 45,
        avgReturn: 0.8,
        riskLevel: 'high',
        marketConditions: ['High Volatility', 'Liquid Market'],
        confidence: 65
      }
    ]

    setSuggestions(mockSuggestions)
    setMarketConditions(mockMarketConditions)
    setStrategyRecommendations(mockStrategyRecommendations)
    setLoading(false)
  }

  const generateEntryReasoning = (symbol: string, currentPrice: any): string => {
    const reasons = [
      `Strong momentum in ${symbol} with increasing volume`,
      `Price approaching key support level with bullish divergence`,
      `Breakout above resistance with confirmation from RSI`,
      `Oversold conditions with potential reversal signals`,
      `Trend continuation pattern with favorable risk/reward`,
      `Market structure showing higher highs and higher lows`
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  const generateExitReasoning = (symbol: string, trade: any): string => {
    const reasons = [
      `Price reaching target resistance level`,
      `Momentum indicators showing exhaustion`,
      `Risk/reward ratio no longer favorable`,
      `Market structure breaking down`,
      `Volume declining on price advances`,
      `Technical indicators showing overbought conditions`
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  const generateMarketRecommendation = (symbol: string): string => {
    const recommendations = [
      'Wait for pullback to enter long positions',
      'Consider short positions on rallies',
      'Range-bound trading recommended',
      'Strong trend - follow momentum',
      'High volatility - reduce position sizes',
      'Low volatility - increase position sizes'
    ]
    return recommendations[Math.floor(Math.random() * recommendations.length)]
  }

  const getMarketCondition = (symbol: string): string => {
    const conditions = [
      'Bullish Momentum',
      'Bearish Pressure',
      'Sideways Consolidation',
      'High Volatility',
      'Low Volatility',
      'Trend Continuation'
    ]
    return conditions[Math.floor(Math.random() * conditions.length)]
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400'
    if (confidence >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'text-green-400'
      case 'bearish': return 'text-red-400'
      case 'sideways': return 'text-yellow-400'
      default: return 'text-slate-400'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(price)
  }

  const formatTime = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Trade Suggestions</h2>
          <p className="text-slate-400">AI-powered insights and recommendations</p>
        </div>
        <Button 
          onClick={generateSuggestions}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Brain className="h-4 w-4 mr-2" />
          {loading ? 'Analyzing...' : 'Refresh Analysis'}
        </Button>
      </div>

      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="suggestions" className="text-slate-300">Trade Ideas</TabsTrigger>
          <TabsTrigger value="market" className="text-slate-300">Market Analysis</TabsTrigger>
          <TabsTrigger value="strategies" className="text-slate-300">Strategies</TabsTrigger>
          <TabsTrigger value="timing" className="text-slate-300">Timing</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Entry Suggestions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  Entry Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suggestions.filter(s => s.type === 'entry').length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No entry opportunities at this time</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestions.filter(s => s.type === 'entry').map((suggestion) => (
                      <div key={suggestion.id} className="p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{suggestion.symbol}</span>
                            <Badge variant="outline" className="text-xs">
                              {suggestion.timeframe}
                            </Badge>
                            <Badge className={`text-xs ${getRiskLevelColor(suggestion.riskLevel)}`}>
                              {suggestion.riskLevel}
                            </Badge>
                          </div>
                          <div className={`text-sm font-bold ${getConfidenceColor(suggestion.confidence)}`}>
                            {suggestion.confidence}%
                          </div>
                        </div>
                        
                        <div className="text-slate-300 text-sm mb-3">
                          {suggestion.reasoning}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="text-slate-400">Target</div>
                            <div className="text-green-400 font-medium">
                              {suggestion.priceTarget ? formatPrice(suggestion.priceTarget) : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400">Stop Loss</div>
                            <div className="text-red-400 font-medium">
                              {suggestion.stopLoss ? formatPrice(suggestion.stopLoss) : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400">Expected Return</div>
                            <div className="text-white font-medium">
                              {suggestion.expectedReturn}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-slate-500 mt-2">
                          {formatTime(suggestion.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Exit Suggestions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2 text-red-400" />
                  Exit Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suggestions.filter(s => s.type === 'exit').length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No exit recommendations at this time</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestions.filter(s => s.type === 'exit').map((suggestion) => (
                      <div key={suggestion.id} className="p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{suggestion.symbol}</span>
                            <Badge variant="outline" className="text-xs">
                              {suggestion.timeframe}
                            </Badge>
                            <Badge className={`text-xs ${getRiskLevelColor(suggestion.riskLevel)}`}>
                              {suggestion.riskLevel}
                            </Badge>
                          </div>
                          <div className={`text-sm font-bold ${getConfidenceColor(suggestion.confidence)}`}>
                            {suggestion.confidence}%
                          </div>
                        </div>
                        
                        <div className="text-slate-300 text-sm mb-3">
                          {suggestion.reasoning}
                        </div>
                        
                        <div className="text-xs text-slate-500">
                          {formatTime(suggestion.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Market Condition Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Symbol</TableHead>
                    <TableHead className="text-slate-300">Trend</TableHead>
                    <TableHead className="text-slate-300">Strength</TableHead>
                    <TableHead className="text-slate-300">Volatility</TableHead>
                    <TableHead className="text-slate-300">Support</TableHead>
                    <TableHead className="text-slate-300">Resistance</TableHead>
                    <TableHead className="text-slate-300">Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketConditions.map((condition) => (
                    <TableRow key={condition.symbol} className="border-slate-700">
                      <TableCell className="text-white font-medium">{condition.symbol}</TableCell>
                      <TableCell>
                        <Badge className={`${getTrendColor(condition.trend)} bg-slate-700`}>
                          {condition.trend}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{condition.strength}%</TableCell>
                      <TableCell className="text-white">{condition.volatility}%</TableCell>
                      <TableCell className="text-white">{formatPrice(condition.support)}</TableCell>
                      <TableCell className="text-white">{formatPrice(condition.resistance)}</TableCell>
                      <TableCell className="text-slate-300 text-sm">{condition.recommendation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Strategy Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategyRecommendations.map((strategy) => (
                  <div key={strategy.strategy} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{strategy.strategy}</h3>
                      <Badge className={`text-xs ${getRiskLevelColor(strategy.riskLevel)}`}>
                        {strategy.riskLevel}
                      </Badge>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-3">{strategy.description}</p>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div>
                        <div className="text-slate-400">Win Rate</div>
                        <div className="text-white font-medium">{strategy.winRate}%</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Avg Return</div>
                        <div className="text-white font-medium">{strategy.avgReturn}%</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Confidence</div>
                        <div className={`font-medium ${getConfidenceColor(strategy.confidence)}`}>
                          {strategy.confidence}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-400">
                      <div className="mb-1">Best for:</div>
                      <div className="flex flex-wrap gap-1">
                        {strategy.marketConditions.map((condition, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Optimal Trading Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 mr-2 text-blue-400" />
                    <h3 className="text-white font-medium">Morning Session</h3>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">6:00 AM - 12:00 PM ET</p>
                  <div className="text-xs text-slate-400">
                    <div>• High volatility opportunities</div>
                    <div>• Major news releases</div>
                    <div>• Trend establishment</div>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 mr-2 text-yellow-400" />
                    <h3 className="text-white font-medium">Afternoon Session</h3>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">12:00 PM - 5:00 PM ET</p>
                  <div className="text-xs text-slate-400">
                    <div>• Trend continuation</div>
                    <div>• Range-bound trading</div>
                    <div>• Position management</div>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 mr-2 text-purple-400" />
                    <h3 className="text-white font-medium">Evening Session</h3>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">5:00 PM - 12:00 AM ET</p>
                  <div className="text-xs text-slate-400">
                    <div>• Lower volatility</div>
                    <div>• Swing trading setup</div>
                    <div>• Position review</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
