"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { 
  LineChart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Settings, 
  Play, 
  Square, 
  RotateCcw,
  Download,
  Share2,
  Layers,
  MousePointer,
  Type,
  Move,
  Zap,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { createChart, IChartApi, ISeriesApi, LineData, BarData } from 'lightweight-charts'

interface Indicator {
  id: string
  name: string
  type: 'overlay' | 'separate'
  enabled: boolean
  settings: Record<string, any>
}

interface DrawingTool {
  id: string
  name: string
  icon: any
  active: boolean
}

interface BacktestResult {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalPnL: number
  maxDrawdown: number
  sharpeRatio: number
  profitFactor: number
  avgWin: number
  avgLoss: number
  trades: Array<{
    entry: { time: number; price: number }
    exit: { time: number; price: number }
    pnl: number
    type: 'long' | 'short'
  }>
}

export function AdvancedCharting() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null)
  
  const [symbol, setSymbol] = useState("EURUSD")
  const [timeframe, setTimeframe] = useState("1H")
  const [indicators, setIndicators] = useState<Indicator[]>([
    { id: "sma", name: "Simple Moving Average", type: "overlay", enabled: false, settings: { period: 20 } },
    { id: "ema", name: "Exponential Moving Average", type: "overlay", enabled: false, settings: { period: 20 } },
    { id: "rsi", name: "RSI", type: "separate", enabled: false, settings: { period: 14 } },
    { id: "macd", name: "MACD", type: "separate", enabled: false, settings: { fast: 12, slow: 26, signal: 9 } },
    { id: "bollinger", name: "Bollinger Bands", type: "overlay", enabled: false, settings: { period: 20, stdDev: 2 } },
    { id: "fibonacci", name: "Fibonacci Retracement", type: "overlay", enabled: false, settings: { levels: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1] } }
  ])
  
  const [drawingTools, setDrawingTools] = useState<DrawingTool[]>([
    { id: "trendline", name: "Trend Line", icon: TrendingUp, active: false },
    { id: "horizontal", name: "Horizontal Line", icon: Type, active: false },
    { id: "fibonacci", name: "Fibonacci", icon: Target, active: false },
    { id: "rectangle", name: "Rectangle", icon: Square, active: false },
    { id: "ellipse", name: "Ellipse", icon: Move, active: false }
  ])
  
  const [isBacktesting, setIsBacktesting] = useState(false)
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null)
  const [strategy, setStrategy] = useState("sma_crossover")
  const [riskPerTrade, setRiskPerTrade] = useState(2)
  const [accountSize, setAccountSize] = useState(10000)

  // Mock candlestick data
  const generateMockData = (count: number) => {
    const data = []
    let basePrice = 1.0850
    let timestamp = Date.now() - (count * 60 * 60 * 1000) // 1 hour intervals
    
    for (let i = 0; i < count; i++) {
      const open = basePrice + (Math.random() - 0.5) * 0.01
      const high = open + Math.random() * 0.005
      const low = open - Math.random() * 0.005
      const close = low + Math.random() * (high - low)
      
      data.push({
        time: timestamp / 1000,
        open: open,
        high: high,
        low: low,
        close: close
      })
      
      basePrice = close
      timestamp += 60 * 60 * 1000
    }
    
    return data
  }

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: '#1e293b' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#334155' },
        horzLines: { color: '#334155' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#334155',
      },
      timeScale: {
        borderColor: '#334155',
        timeVisible: true,
        secondsVisible: false,
      },
    })

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    })

    const volumeSeries = chart.addHistogramSeries({
      color: '#3b82f6',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    })

    const data = generateMockData(100)
    candlestickSeries.setData(data)
    
    // Mock volume data
    const volumeData = data.map(d => ({
      time: d.time,
      value: Math.random() * 1000 + 500
    }))
    volumeSeries.setData(volumeData)

    chartRef.current = chart
    candlestickSeriesRef.current = candlestickSeries
    volumeSeriesRef.current = volumeSeries

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [])

  // Update chart when symbol or timeframe changes
  useEffect(() => {
    if (candlestickSeriesRef.current) {
      const newData = generateMockData(100)
      candlestickSeriesRef.current.setData(newData)
    }
  }, [symbol, timeframe])

  const toggleIndicator = (indicatorId: string) => {
    setIndicators(prev => prev.map(ind => 
      ind.id === indicatorId ? { ...ind, enabled: !ind.enabled } : ind
    ))
  }

  const updateIndicatorSettings = (indicatorId: string, settings: Record<string, any>) => {
    setIndicators(prev => prev.map(ind => 
      ind.id === indicatorId ? { ...ind, settings: { ...ind.settings, ...settings } } : ind
    ))
  }

  const activateDrawingTool = (toolId: string) => {
    setDrawingTools(prev => prev.map(tool => ({
      ...tool,
      active: tool.id === toolId ? !tool.active : false
    })))
  }

  const runBacktest = async () => {
    setIsBacktesting(true)
    
    // Simulate backtest processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockResults: BacktestResult = {
      totalTrades: 45,
      winningTrades: 28,
      losingTrades: 17,
      winRate: 62.2,
      totalPnL: 2340,
      maxDrawdown: -890,
      sharpeRatio: 1.45,
      profitFactor: 1.8,
      avgWin: 156,
      avgLoss: -87,
      trades: []
    }
    
    setBacktestResults(mockResults)
    setIsBacktesting(false)
  }

  const exportChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.takeScreenshot()
      const link = document.createElement('a')
      link.download = `${symbol}_${timeframe}_chart.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced Charting</h1>
          <p className="text-gray-600 dark:text-gray-400">Professional charting with indicators, drawing tools, and backtesting</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportChart}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="indicators">Indicators</TabsTrigger>
          <TabsTrigger value="drawing">Drawing Tools</TabsTrigger>
          <TabsTrigger value="backtest">Backtesting</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4">
          {/* Chart Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Symbol:</span>
                  <Select value={symbol} onValueChange={setSymbol}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EURUSD">EURUSD</SelectItem>
                      <SelectItem value="GBPUSD">GBPUSD</SelectItem>
                      <SelectItem value="USDJPY">USDJPY</SelectItem>
                      <SelectItem value="BTCUSD">BTCUSD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Timeframe:</span>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1M">1M</SelectItem>
                      <SelectItem value="5M">5M</SelectItem>
                      <SelectItem value="15M">15M</SelectItem>
                      <SelectItem value="1H">1H</SelectItem>
                      <SelectItem value="4H">4H</SelectItem>
                      <SelectItem value="1D">1D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Theme:</span>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart Container */}
          <Card>
            <CardContent className="p-0">
              <div ref={chartContainerRef} className="w-full h-[500px]" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indicators" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Available Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Indicators</CardTitle>
                <CardDescription>Add and configure technical indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {indicators.map(indicator => (
                  <div key={indicator.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={indicator.enabled}
                        onCheckedChange={() => toggleIndicator(indicator.id)}
                      />
                      <div>
                        <div className="font-medium">{indicator.name}</div>
                        <div className="text-sm text-gray-500">{indicator.type}</div>
                      </div>
                    </div>
                    {indicator.enabled && (
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Indicator Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Indicator Settings</CardTitle>
                <CardDescription>Configure selected indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {indicators.filter(ind => ind.enabled).map(indicator => (
                  <div key={indicator.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">{indicator.name}</h4>
                    {indicator.id === 'sma' && (
                      <div className="space-y-2">
                        <label className="text-sm">Period</label>
                        <Slider
                          value={[indicator.settings.period]}
                          onValueChange={([value]) => updateIndicatorSettings(indicator.id, { period: value })}
                          max={100}
                          min={5}
                          step={1}
                        />
                        <span className="text-sm text-gray-500">{indicator.settings.period}</span>
                      </div>
                    )}
                    {indicator.id === 'rsi' && (
                      <div className="space-y-2">
                        <label className="text-sm">Period</label>
                        <Slider
                          value={[indicator.settings.period]}
                          onValueChange={([value]) => updateIndicatorSettings(indicator.id, { period: value })}
                          max={50}
                          min={5}
                          step={1}
                        />
                        <span className="text-sm text-gray-500">{indicator.settings.period}</span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="drawing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Drawing Tools</CardTitle>
              <CardDescription>Add technical analysis drawings to your chart</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {drawingTools.map(tool => (
                  <Button
                    key={tool.id}
                    variant={tool.active ? "default" : "outline"}
                    className="flex flex-col items-center gap-2 h-20"
                    onClick={() => activateDrawingTool(tool.id)}
                  >
                    {(() => {
                      const IconComponent = tool.icon;
                      return <IconComponent className="h-5 w-5" />;
                    })()}
                    <span className="text-xs">{tool.name}</span>
                  </Button>
                ))}
              </div>
              
              {drawingTools.some(tool => tool.active) && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Click and drag on the chart to draw {drawingTools.find(t => t.active)?.name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backtest" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strategy Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Strategy Configuration</CardTitle>
                <CardDescription>Set up your backtesting strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Strategy</label>
                  <Select value={strategy} onValueChange={setStrategy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sma_crossover">SMA Crossover</SelectItem>
                      <SelectItem value="rsi_reversal">RSI Reversal</SelectItem>
                      <SelectItem value="macd_signal">MACD Signal</SelectItem>
                      <SelectItem value="bollinger_bounce">Bollinger Bounce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Risk per Trade (%)</label>
                  <Slider
                    value={[riskPerTrade]}
                    onValueChange={([value]) => setRiskPerTrade(value)}
                    max={5}
                    min={0.5}
                    step={0.1}
                  />
                  <span className="text-sm text-gray-500">{riskPerTrade}%</span>
                </div>

                <div>
                  <label className="text-sm font-medium">Account Size ($)</label>
                  <Input
                    type="number"
                    value={accountSize}
                    onChange={(e) => setAccountSize(Number(e.target.value))}
                    placeholder="10000"
                  />
                </div>

                <Button 
                  onClick={runBacktest} 
                  disabled={isBacktesting}
                  className="w-full"
                >
                  {isBacktesting ? (
                    <>
                      <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                      Running Backtest...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Backtest
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Backtest Results */}
            <Card>
              <CardHeader>
                <CardTitle>Backtest Results</CardTitle>
                <CardDescription>Performance analysis of your strategy</CardDescription>
              </CardHeader>
              <CardContent>
                {backtestResults ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">${backtestResults.totalPnL}</div>
                        <div className="text-sm text-gray-500">Total P&L</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{backtestResults.winRate}%</div>
                        <div className="text-sm text-gray-500">Win Rate</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Trades:</span>
                        <span className="font-medium">{backtestResults.totalTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Winning Trades:</span>
                        <span className="font-medium text-green-600">{backtestResults.winningTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Losing Trades:</span>
                        <span className="font-medium text-red-600">{backtestResults.losingTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Max Drawdown:</span>
                        <span className="font-medium text-red-600">${backtestResults.maxDrawdown}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Sharpe Ratio:</span>
                        <span className="font-medium">{backtestResults.sharpeRatio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Profit Factor:</span>
                        <span className="font-medium">{backtestResults.profitFactor}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Run a backtest to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
