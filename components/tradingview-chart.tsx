"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Save, RotateCcw, TrendingUp, BarChart3 } from 'lucide-react'
import { authenticatedFetch } from '@/lib/api-client'

interface TradingViewChartProps {
  symbol: string
  onSymbolChange?: (symbol: string) => void
  trades?: any[]
  height?: number
}

interface ChartSettings {
  timeframe: string
  chartType: string
  indicators: string[]
  colorScheme: {
    upColor: string
    downColor: string
    backgroundColor: string
    gridColor: string
  }
  layoutSettings: {
    showVolume: boolean
    showGrid: boolean
    showCrosshair: boolean
    showTimeScale: boolean
    showPriceScale: boolean
  }
}

const timeframes = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '1H', label: '1 Hour' },
  { value: '4H', label: '4 Hours' },
  { value: '1D', label: '1 Day' },
  { value: '1W', label: '1 Week' }
]

const chartTypes = [
  { value: 'candlestick', label: 'Candlestick' },
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' },
  { value: 'bars', label: 'Bars' }
]

const popularIndicators = [
  'Moving Average (20)',
  'Moving Average (50)',
  'RSI',
  'MACD',
  'Bollinger Bands',
  'Volume',
  'Stochastic'
]

export function TradingViewChart({ symbol, onSymbolChange, trades = [], height = 500 }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<ChartSettings>({
    timeframe: '1H',
    chartType: 'candlestick',
    indicators: ['Moving Average (20)', 'Volume'],
    colorScheme: {
      upColor: '#26a69a',
      downColor: '#ef5350',
      backgroundColor: '#1e293b',
      gridColor: '#374151'
    },
    layoutSettings: {
      showVolume: true,
      showGrid: true,
      showCrosshair: true,
      showTimeScale: true,
      showPriceScale: true
    }
  })
  const [isSaving, setIsSaving] = useState(false)

  // Load chart settings on mount
  useEffect(() => {
    const loadChartSettings = async () => {
      try {
        const response = await authenticatedFetch(`/api/chart-settings?symbol=${symbol}`)
        const data = await response.json()
        
        if (response.ok && data.settings) {
          setSettings({
            timeframe: data.settings.timeframe || '1H',
            chartType: data.settings.chart_type || 'candlestick',
            indicators: data.settings.indicators || ['Moving Average (20)', 'Volume'],
            colorScheme: data.settings.color_scheme || settings.colorScheme,
            layoutSettings: data.settings.layout_settings || settings.layoutSettings
          })
        }
      } catch (error) {
        console.error('Error loading chart settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadChartSettings()
  }, [symbol])

  // Initialize TradingView widget
  useEffect(() => {
    if (!chartContainerRef.current || isLoading) return

    // Clear previous widget
    chartContainerRef.current.innerHTML = ''

    // Create TradingView widget script
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: getFormattedSymbol(symbol),
      interval: settings.timeframe,
      timezone: "Etc/UTC",
      theme: "dark",
      style: getChartStyle(settings.chartType),
      locale: "en",
      enable_publishing: false,
      backgroundColor: settings.colorScheme.backgroundColor,
      gridColor: settings.colorScheme.gridColor,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      container_id: "tradingview_chart",
      studies: settings.indicators.map(indicator => getStudyId(indicator)).filter(Boolean)
    })

    const container = document.createElement('div')
    container.className = 'tradingview-widget-container'
    container.style.height = `${height}px`
    container.style.width = '100%'
    
    const chartDiv = document.createElement('div')
    chartDiv.id = 'tradingview_chart'
    chartDiv.style.height = '100%'
    chartDiv.style.width = '100%'
    
    container.appendChild(chartDiv)
    container.appendChild(script)
    
    chartContainerRef.current.appendChild(container)

    return () => {
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = ''
      }
    }
  }, [symbol, settings, isLoading, height])

  const getFormattedSymbol = (sym: string): string => {
    // Convert internal symbols to TradingView format
    const symbolMap: { [key: string]: string } = {
      'ES': 'CME_MINI:ES1!',
      'NQ': 'CME_MINI:NQ1!',
      'YM': 'CBOT_MINI:YM1!',
      'RTY': 'CME_MINI:RTY1!',
      'CL': 'NYMEX:CL1!',
      'NG': 'NYMEX:NG1!',
      'GC': 'COMEX:GC1!',
      'SI': 'COMEX:SI1!',
      'ZB': 'CBOT:ZB1!',
      'ZN': 'CBOT:ZN1!',
      'ZF': 'CBOT:ZF1!',
      'ZT': 'CBOT:ZT1!',
      '6E': 'CME:6E1!',
      '6B': 'CME:6B1!',
      '6A': 'CME:6A1!',
      '6J': 'CME:6J1!',
      '6S': 'CME:6S1!',
      '6C': 'CME:6C1!'
    }
    
    // Handle forex pairs
    if (sym.length === 6) {
      return `FX_IDC:${sym}`
    }
    
    return symbolMap[sym] || `NASDAQ:${sym}`
  }

  const getChartStyle = (type: string): string => {
    const styleMap: { [key: string]: string } = {
      'candlestick': '1',
      'line': '2',
      'area': '3',
      'bars': '0'
    }
    return styleMap[type] || '1'
  }

  const getStudyId = (indicator: string): string | null => {
    const studyMap: { [key: string]: string } = {
      'Moving Average (20)': 'MASimple@tv-basicstudies',
      'Moving Average (50)': 'MASimple@tv-basicstudies',
      'RSI': 'RSI@tv-basicstudies',
      'MACD': 'MACD@tv-basicstudies',
      'Bollinger Bands': 'BB@tv-basicstudies',
      'Volume': 'Volume@tv-basicstudies',
      'Stochastic': 'Stochastic@tv-basicstudies'
    }
    return studyMap[indicator] || null
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await authenticatedFetch('/api/chart-settings', {
        method: 'POST',
        body: JSON.stringify({
          symbol,
          timeframe: settings.timeframe,
          chartType: settings.chartType,
          indicators: settings.indicators,
          colorScheme: settings.colorScheme,
          layoutSettings: settings.layoutSettings
        })
      })

      if (response.ok) {
        console.log('Chart settings saved successfully')
      } else {
        console.error('Failed to save chart settings')
      }
    } catch (error) {
      console.error('Error saving chart settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const resetToDefaults = () => {
    setSettings({
      timeframe: '1H',
      chartType: 'candlestick',
      indicators: ['Moving Average (20)', 'Volume'],
      colorScheme: {
        upColor: '#26a69a',
        downColor: '#ef5350',
        backgroundColor: '#1e293b',
        gridColor: '#374151'
      },
      layoutSettings: {
        showVolume: true,
        showGrid: true,
        showCrosshair: true,
        showTimeScale: true,
        showPriceScale: true
      }
    })
  }

  const toggleIndicator = (indicator: string) => {
    setSettings(prev => ({
      ...prev,
      indicators: prev.indicators.includes(indicator)
        ? prev.indicators.filter(i => i !== indicator)
        : [...prev.indicators, indicator]
    }))
  }

  // Get trades for current symbol
  const symbolTrades = trades.filter(trade => trade.symbol === symbol)
  const openTrades = symbolTrades.filter(trade => trade.status === 'Open')
  const closedTrades = symbolTrades.filter(trade => trade.status === 'Closed')

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                {symbol}
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {settings.timeframe}
                </Badge>
                {openTrades.length > 0 && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {openTrades.length} Open
                  </Badge>
                )}
              </CardTitle>
              <p className="text-slate-400 text-sm">
                {closedTrades.length} completed trades • Live market data
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefaults}
              className="text-slate-400 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={saveSettings}
              disabled={isSaving}
              className="text-slate-400 hover:text-white"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Chart Controls */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-slate-300">Timeframe:</label>
            <Select 
              value={settings.timeframe} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, timeframe: value }))}
            >
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {timeframes.map((tf) => (
                  <SelectItem key={tf.value} value={tf.value} className="text-white hover:bg-slate-700">
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-slate-300">Chart Type:</label>
            <Select 
              value={settings.chartType} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, chartType: value }))}
            >
              <SelectTrigger className="w-36 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {chartTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-700">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Indicators */}
        <div className="pt-2">
          <label className="text-sm text-slate-300 mb-2 block">Technical Indicators:</label>
          <div className="flex flex-wrap gap-2">
            {popularIndicators.map((indicator) => (
              <Badge
                key={indicator}
                variant={settings.indicators.includes(indicator) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  settings.indicators.includes(indicator)
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
                    : "bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700"
                }`}
                onClick={() => toggleIndicator(indicator)}
              >
                {indicator}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Separator className="bg-slate-700/50" />
        <div 
          ref={chartContainerRef}
          className="w-full"
          style={{ height: `${height}px` }}
        >
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-slate-400">Loading chart...</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}