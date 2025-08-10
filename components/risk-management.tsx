"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Calculator, Shield, TrendingDown, DollarSign, Target, AlertCircle } from 'lucide-react'
import { authenticatedFetch } from '@/lib/api-client'
import { marketDataService } from '@/lib/market-data'

interface RiskSettings {
  accountBalance: number
  riskPerTrade: number
  maxDrawdown: number
  maxPositionSize: number
  correlationLimit: number
}

interface PositionSizingResult {
  recommendedSize: number
  riskAmount: number
  maxLoss: number
  riskPercentage: number
  kellyCriterion: number
  kellyPositionSize: number
}

interface PortfolioRisk {
  totalRisk: number
  riskPercentage: number
  maxDrawdown: number
  correlationScore: number
  diversificationScore: number
  riskLevel: 'low' | 'medium' | 'high'
}

export function RiskManagement() {
  const [riskSettings, setRiskSettings] = useState<RiskSettings>({
    accountBalance: 10000,
    riskPerTrade: 2,
    maxDrawdown: 10,
    maxPositionSize: 20,
    correlationLimit: 0.7
  })
  const [positionSizing, setPositionSizing] = useState({
    symbol: "",
    entryPrice: "",
    stopLoss: "",
    accountBalance: "",
    riskPerTrade: ""
  })
  const [sizingResult, setSizingResult] = useState<PositionSizingResult | null>(null)
  const [portfolioRisk, setPortfolioRisk] = useState<PortfolioRisk | null>(null)
  const [openTrades, setOpenTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserSettings()
    loadOpenTrades()
  }, [])

  useEffect(() => {
    if (openTrades.length > 0) {
      calculatePortfolioRisk()
    }
  }, [openTrades, riskSettings])

  const loadUserSettings = async () => {
    try {
      const response = await authenticatedFetch('/api/settings')
      const data = await response.json()
      
      if (response.ok && data.settings) {
        setRiskSettings(prev => ({
          ...prev,
          accountBalance: data.settings.account_balance || 10000,
          riskPerTrade: data.settings.risk_per_trade || 2
        }))
        
        setPositionSizing(prev => ({
          ...prev,
          accountBalance: (data.settings.account_balance || 10000).toString(),
          riskPerTrade: (data.settings.risk_per_trade || 2).toString()
        }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadOpenTrades = async () => {
    try {
      const response = await authenticatedFetch('/api/trades')
      const data = await response.json()
      
      if (response.ok && data.trades) {
        const open = data.trades.filter((trade: any) => trade.status === 'Open')
        setOpenTrades(open)
      }
    } catch (error) {
      console.error('Error loading open trades:', error)
    }
  }

  const calculatePositionSize = () => {
    const entry = parseFloat(positionSizing.entryPrice)
    const stop = parseFloat(positionSizing.stopLoss)
    const balance = parseFloat(positionSizing.accountBalance)
    const riskPercent = parseFloat(positionSizing.riskPerTrade)

    if (!entry || !stop || !balance || !riskPercent) return

    const riskAmount = balance * (riskPercent / 100)
    const priceRisk = Math.abs(entry - stop)
    const recommendedSize = riskAmount / priceRisk
    const maxLoss = recommendedSize * priceRisk
    const riskPercentage = (maxLoss / balance) * 100

    // Kelly Criterion calculation (simplified)
    const winRate = 0.55 // This should come from user's historical data
    const avgWin = 2 // Average win in R-multiples
    const avgLoss = 1 // Average loss in R-multiples
    const kellyCriterion = (winRate * avgWin - (1 - winRate) * avgLoss) / avgWin
    const kellyPositionSize = Math.max(0, kellyCriterion) * recommendedSize

    setSizingResult({
      recommendedSize: Math.round(recommendedSize * 100) / 100,
      riskAmount: Math.round(riskAmount * 100) / 100,
      maxLoss: Math.round(maxLoss * 100) / 100,
      riskPercentage: Math.round(riskPercentage * 100) / 100,
      kellyCriterion: Math.round(kellyCriterion * 1000) / 1000,
      kellyPositionSize: Math.round(kellyPositionSize * 100) / 100
    })
  }

  const calculatePortfolioRisk = () => {
    if (openTrades.length === 0) {
      setPortfolioRisk(null)
      return
    }

    let totalRisk = 0
    let totalValue = 0
    const symbols = new Set<string>()
    const correlations: { [key: string]: number } = {}

    openTrades.forEach(trade => {
      const currentPrice = marketDataService.getCurrentPrice(trade.symbol)
      if (currentPrice) {
        const positionValue = trade.quantity * currentPrice.price * trade.contract_size
        const riskAmount = positionValue * (riskSettings.riskPerTrade / 100)
        
        totalRisk += riskAmount
        totalValue += positionValue
        symbols.add(trade.symbol)
      }
    })

    // Calculate correlation score (simplified)
    const correlationScore = symbols.size > 1 ? 1 - (symbols.size / 20) : 1
    const diversificationScore = Math.min(100, symbols.size * 20)

    // Calculate risk level
    const riskPercentage = (totalRisk / riskSettings.accountBalance) * 100
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    
    if (riskPercentage > riskSettings.maxDrawdown) {
      riskLevel = 'high'
    } else if (riskPercentage > riskSettings.maxDrawdown / 2) {
      riskLevel = 'medium'
    }

    setPortfolioRisk({
      totalRisk: Math.round(totalRisk * 100) / 100,
      riskPercentage: Math.round(riskPercentage * 100) / 100,
      maxDrawdown: Math.round(riskSettings.maxDrawdown * 100) / 100,
      correlationScore: Math.round(correlationScore * 100) / 100,
      diversificationScore: Math.round(diversificationScore * 100) / 100,
      riskLevel
    })
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'low': return <Shield className="h-4 w-4" />
      case 'medium': return <AlertTriangle className="h-4 w-4" />
      case 'high': return <AlertCircle className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading risk management...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Risk Management</h2>
        <p className="text-slate-400">Calculate position sizes and monitor portfolio risk</p>
      </div>

      <Tabs defaultValue="position-sizing" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="position-sizing" className="text-slate-300">Position Sizing</TabsTrigger>
          <TabsTrigger value="portfolio-risk" className="text-slate-300">Portfolio Risk</TabsTrigger>
          <TabsTrigger value="settings" className="text-slate-300">Risk Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="position-sizing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Position Sizing Calculator */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Position Size Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="symbol" className="text-slate-300">Symbol</Label>
                  <Input
                    id="symbol"
                    value={positionSizing.symbol}
                    onChange={(e) => setPositionSizing(prev => ({ ...prev, symbol: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="e.g., ES, EURUSD"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="entryPrice" className="text-slate-300">Entry Price</Label>
                    <Input
                      id="entryPrice"
                      type="number"
                      step="0.01"
                      value={positionSizing.entryPrice}
                      onChange={(e) => setPositionSizing(prev => ({ ...prev, entryPrice: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stopLoss" className="text-slate-300">Stop Loss</Label>
                    <Input
                      id="stopLoss"
                      type="number"
                      step="0.01"
                      value={positionSizing.stopLoss}
                      onChange={(e) => setPositionSizing(prev => ({ ...prev, stopLoss: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountBalance" className="text-slate-300">Account Balance</Label>
                    <Input
                      id="accountBalance"
                      type="number"
                      step="0.01"
                      value={positionSizing.accountBalance}
                      onChange={(e) => setPositionSizing(prev => ({ ...prev, accountBalance: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="riskPerTrade" className="text-slate-300">Risk Per Trade (%)</Label>
                    <Input
                      id="riskPerTrade"
                      type="number"
                      step="0.1"
                      value={positionSizing.riskPerTrade}
                      onChange={(e) => setPositionSizing(prev => ({ ...prev, riskPerTrade: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="2.0"
                    />
                  </div>
                </div>

                <Button 
                  onClick={calculatePositionSize}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Calculate Position Size
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sizingResult ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="text-slate-400 text-sm">Recommended Size</div>
                        <div className="text-white text-xl font-bold">{sizingResult.recommendedSize}</div>
                      </div>
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="text-slate-400 text-sm">Risk Amount</div>
                        <div className="text-white text-xl font-bold">${sizingResult.riskAmount}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="text-slate-400 text-sm">Max Loss</div>
                        <div className="text-white text-xl font-bold">${sizingResult.maxLoss}</div>
                      </div>
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="text-slate-400 text-sm">Risk %</div>
                        <div className="text-white text-xl font-bold">{sizingResult.riskPercentage}%</div>
                      </div>
                    </div>

                    <div className="bg-slate-700 p-4 rounded-lg">
                      <div className="text-slate-400 text-sm mb-2">Kelly Criterion Analysis</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-slate-400 text-xs">Kelly %</div>
                          <div className="text-white font-bold">{(sizingResult.kellyCriterion * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-xs">Kelly Size</div>
                          <div className="text-white font-bold">{sizingResult.kellyPositionSize}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-slate-400 text-sm">Risk Assessment</div>
                      <div className="flex items-center space-x-2">
                        {sizingResult.riskPercentage > riskSettings.maxDrawdown ? (
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                        ) : (
                          <Shield className="h-4 w-4 text-green-400" />
                        )}
                        <span className={`text-sm ${sizingResult.riskPercentage > riskSettings.maxDrawdown ? 'text-red-400' : 'text-green-400'}`}>
                          {sizingResult.riskPercentage > riskSettings.maxDrawdown 
                            ? 'Risk exceeds maximum drawdown limit' 
                            : 'Risk within acceptable limits'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter trade details to calculate position size</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio-risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Risk Overview */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2" />
                  Portfolio Risk Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {portfolioRisk ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="text-slate-400 text-sm">Total Risk</div>
                        <div className="text-white text-xl font-bold">${portfolioRisk.totalRisk}</div>
                      </div>
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="text-slate-400 text-sm">Risk %</div>
                        <div className="text-white text-xl font-bold">{portfolioRisk.riskPercentage}%</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Risk Level</span>
                        <Badge className={`${getRiskLevelColor(portfolioRisk.riskLevel)} bg-slate-700`}>
                          {getRiskLevelIcon(portfolioRisk.riskLevel)}
                          <span className="ml-1 capitalize">{portfolioRisk.riskLevel}</span>
                        </Badge>
                      </div>
                      <Progress 
                        value={portfolioRisk.riskPercentage} 
                        max={portfolioRisk.maxDrawdown}
                        className="h-2"
                      />
                      <div className="text-xs text-slate-500">
                        {portfolioRisk.riskPercentage.toFixed(1)}% of {portfolioRisk.maxDrawdown}% max drawdown
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="text-slate-400 text-sm">Correlation Score</div>
                        <div className="text-white text-lg font-bold">{portfolioRisk.correlationScore}%</div>
                      </div>
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="text-slate-400 text-sm">Diversification</div>
                        <div className="text-white text-lg font-bold">{portfolioRisk.diversificationScore}%</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No open positions to analyze</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Open Positions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Open Positions</CardTitle>
              </CardHeader>
              <CardContent>
                {openTrades.length > 0 ? (
                  <div className="space-y-3">
                    {openTrades.map((trade) => {
                      const currentPrice = marketDataService.getCurrentPrice(trade.symbol)
                      const unrealizedPnL = currentPrice 
                        ? (currentPrice.price - trade.entry_price) * trade.quantity * trade.contract_size * (trade.side === 'Long' ? 1 : -1)
                        : 0

                      return (
                        <div key={trade.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                          <div>
                            <div className="text-white font-medium">{trade.symbol}</div>
                            <div className="text-slate-400 text-sm">
                              {trade.side} {trade.quantity} @ {trade.entry_price}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              ${unrealizedPnL.toFixed(2)}
                            </div>
                            <div className="text-slate-400 text-sm">
                              {currentPrice ? currentPrice.price.toFixed(2) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p>No open positions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Risk Management Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountBalance" className="text-slate-300">Account Balance</Label>
                  <Input
                    id="accountBalance"
                    type="number"
                    step="0.01"
                    value={riskSettings.accountBalance}
                    onChange={(e) => setRiskSettings(prev => ({ ...prev, accountBalance: parseFloat(e.target.value) || 0 }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="riskPerTrade" className="text-slate-300">Risk Per Trade (%)</Label>
                  <Input
                    id="riskPerTrade"
                    type="number"
                    step="0.1"
                    value={riskSettings.riskPerTrade}
                    onChange={(e) => setRiskSettings(prev => ({ ...prev, riskPerTrade: parseFloat(e.target.value) || 0 }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="maxDrawdown" className="text-slate-300">Max Drawdown (%)</Label>
                  <Input
                    id="maxDrawdown"
                    type="number"
                    step="0.1"
                    value={riskSettings.maxDrawdown}
                    onChange={(e) => setRiskSettings(prev => ({ ...prev, maxDrawdown: parseFloat(e.target.value) || 0 }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPositionSize" className="text-slate-300">Max Position Size (%)</Label>
                  <Input
                    id="maxPositionSize"
                    type="number"
                    step="0.1"
                    value={riskSettings.maxPositionSize}
                    onChange={(e) => setRiskSettings(prev => ({ ...prev, maxPositionSize: parseFloat(e.target.value) || 0 }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <Button 
                onClick={() => {
                  // Save settings to backend
                  console.log('Saving risk settings:', riskSettings)
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
