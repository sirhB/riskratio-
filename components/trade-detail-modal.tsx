"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TrendingUp, TrendingDown, Calendar, DollarSign, Target, BarChart3, X, Edit, Save, XCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts"
import { authenticatedFetch } from '@/lib/api-client'

interface Trade {
  id: string
  symbol: string
  side: 'Long' | 'Short'
  quantity: number
  entry_price: number
  exit_price: number | null
  trade_date: string
  strategy: string | null
  status: 'Open' | 'Closed'
  pnl: number | null
  notes: string | null
}

interface TradeDetailModalProps {
  trade: Trade | null
  isOpen: boolean
  onClose: () => void
  onTradeUpdated: (updatedTrade: Trade) => void
}

const futuresSymbols = [
  "ES", "NQ", "YM", "RTY", // US Indices
  "CL", "NG", "GC", "SI", // Commodities
  "ZB", "ZN", "ZF", "ZT", // Bonds
  "6E", "6B", "6A", "6J", "6S", "6C" // Currencies
]

const forexPairs = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "USDCAD", "NZDUSD",
  "EURJPY", "GBPJPY", "EURGBP", "AUDJPY", "EURAUD", "EURCHF", "AUDCAD"
]

const strategies = [
  "breakout", "momentum", "reversal", "scalping", "swing", "news", "technical"
]

// Generate realistic price data for the chart
const generatePriceData = (symbol: string, startDate: string, entryPrice: number, exitPrice?: number) => {
  const data = []
  const start = new Date(startDate)
  start.setDate(start.getDate() - 15) // Start 15 days before trade
  
  let currentPrice = entryPrice * 0.98 // Start slightly below entry
  const volatility = symbol.includes('USD') || symbol.length === 6 ? 0.008 : 0.015 // Lower volatility for forex
  
  for (let i = 0; i < 45; i++) {
    const date = new Date(start)
    date.setDate(date.getDate() + i)
    
    // Generate price movement
    const randomChange = (Math.random() - 0.5) * volatility * 2
    const trendChange = exitPrice ? (exitPrice - currentPrice) * 0.005 : 0
    
    currentPrice = currentPrice * (1 + randomChange + trendChange)
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(currentPrice * 10000) / 10000,
      timestamp: date.getTime()
    })
  }
  
  return data
}

export function TradeDetailModal({ trade, isOpen, onClose, onTradeUpdated }: TradeDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editData, setEditData] = useState<Partial<Trade>>({})
  const [chartData, setChartData] = useState<any[]>([])

  // Initialize edit data when trade changes
  useEffect(() => {
    if (trade) {
      setEditData({
        symbol: trade.symbol,
        side: trade.side,
        quantity: trade.quantity,
        entry_price: trade.entry_price,
        exit_price: trade.exit_price,
        trade_date: trade.trade_date,
        strategy: trade.strategy,
        notes: trade.notes
      })
    }
  }, [trade])

  // Generate chart data when trade or edit data changes
  useEffect(() => {
    if (trade) {
      const currentTrade = isEditing ? { ...trade, ...editData } : trade
      const priceData = generatePriceData(
        currentTrade.symbol || trade.symbol,
        trade.trade_date,
        currentTrade.entry_price || trade.entry_price,
        currentTrade.exit_price || undefined
      )
      setChartData(priceData)
    }
  }, [trade, isEditing, editData])

  const handleSave = async () => {
    if (!trade) return
    
    setIsSaving(true)
    try {
      const response = await authenticatedFetch(`/api/trades/${trade.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          symbol: editData.symbol,
          side: editData.side,
          quantity: editData.quantity,
          entryPrice: editData.entry_price,
          exitPrice: editData.exit_price,
          date: editData.trade_date,
          strategy: editData.strategy,
          notes: editData.notes
        }),
      })

      if (response.ok) {
        const { trade: updatedTrade } = await response.json()
        onTradeUpdated(updatedTrade)
        setIsEditing(false)
      } else {
        const data = await response.json()
        console.error("Failed to update trade:", data.error)
      }
    } catch (error) {
      console.error("Error updating trade:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (trade) {
      setEditData({
        symbol: trade.symbol,
        side: trade.side,
        quantity: trade.quantity,
        entry_price: trade.entry_price,
        exit_price: trade.exit_price,
        trade_date: trade.trade_date,
        strategy: trade.strategy,
        notes: trade.notes
      })
    }
    setIsEditing(false)
  }

  if (!trade) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPnLColor = (pnl: number | null) => {
    if (!pnl) return 'text-slate-400'
    return pnl > 0 ? 'text-green-400' : 'text-red-400'
  }

  const getPnLBgColor = (pnl: number | null) => {
    if (!pnl) return 'bg-slate-700/30'
    return pnl > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
  }

  // Calculate P&L for editing mode
  const calculatePnL = () => {
    if (!editData.exit_price || !editData.entry_price || !editData.quantity || !editData.side) return null
    
    if (editData.side === 'Long') {
      return (editData.exit_price - editData.entry_price) * editData.quantity
    } else {
      return (editData.entry_price - editData.exit_price) * editData.quantity
    }
  }

  const currentPnL = isEditing ? calculatePnL() : trade.pnl
  const currentTrade = isEditing ? { ...trade, ...editData, pnl: currentPnL } : trade

  const availableSymbols = [...futuresSymbols, ...forexPairs]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl text-white flex items-center gap-3">
                {isEditing ? (
                  <Select 
                    value={editData.symbol} 
                    onValueChange={(value) => setEditData({ ...editData, symbol: value })}
                  >
                    <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 max-h-48">
                      {availableSymbols.map((symbol) => (
                        <SelectItem key={symbol} value={symbol} className="text-white hover:bg-slate-700">
                          {symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  currentTrade.symbol
                )}
                <Badge className={currentTrade.side === 'Long' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                  {currentTrade.side === "Long" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {currentTrade.side}
                </Badge>
                <Badge className="bg-slate-700 text-slate-300 border-slate-600">
                  {currentTrade.strategy || 'No Strategy'}
                </Badge>
              </DialogTitle>
              <p className="text-slate-400 text-sm mt-1">
                {formatDate(currentTrade.trade_date)} at {formatTime(currentTrade.trade_date)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCancel}
                  className="text-slate-400 hover:text-white"
                  disabled={isSaving}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSave}
                  className="text-green-400 hover:text-green-300"
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="text-slate-400 hover:text-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trade Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-slate-700/30 border-slate-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-300 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-400" />
                  Entry Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Input
                    type="number"
                    step="0.0001"
                    value={editData.entry_price || ''}
                    onChange={(e) => setEditData({ ...editData, entry_price: parseFloat(e.target.value) })}
                    className="bg-slate-600 border-slate-500 text-white text-xl font-bold"
                  />
                ) : (
                  <div className="text-xl font-bold text-white">
                    ${currentTrade.entry_price.toFixed(4)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-700/30 border-slate-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-300 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-purple-400" />
                  Exit Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Input
                    type="number"
                    step="0.0001"
                    value={editData.exit_price || ''}
                    onChange={(e) => setEditData({ ...editData, exit_price: e.target.value ? parseFloat(e.target.value) : null })}
                    className="bg-slate-600 border-slate-500 text-white text-xl font-bold"
                    placeholder="Optional"
                  />
                ) : (
                  <div className="text-xl font-bold text-white">
                    {currentTrade.exit_price ? `$${currentTrade.exit_price.toFixed(4)}` : 'Open'}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-700/30 border-slate-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-300 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-yellow-400" />
                  Quantity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Input
                    type="number"
                    step="0.01"
                    value={editData.quantity || ''}
                    onChange={(e) => setEditData({ ...editData, quantity: parseFloat(e.target.value) })}
                    className="bg-slate-600 border-slate-500 text-white text-xl font-bold"
                  />
                ) : (
                  <div className="text-xl font-bold text-white">
                    {currentTrade.quantity} {currentTrade.symbol && currentTrade.symbol.length === 6 ? 'lots' : 'contracts'}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className={`border-slate-600 ${getPnLBgColor(currentPnL)}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-300 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                  P&L
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-xl font-bold ${getPnLColor(currentPnL)}`}>
                  {currentPnL ? `$${currentPnL.toFixed(2)}` : '$0.00'}
                </div>
                {currentPnL && currentTrade.entry_price && currentTrade.quantity && (
                  <div className={`text-xs ${getPnLColor(currentPnL)}`}>
                    {currentPnL > 0 ? '+' : ''}{((currentPnL / (currentTrade.entry_price * currentTrade.quantity)) * 100).toFixed(2)}%
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Price Chart */}
          <Card className="bg-slate-700/30 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                Price Chart
                {isEditing && (
                  <Badge className="ml-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Live Preview
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      domain={['dataMin - 0.01', 'dataMax + 0.01']}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value: any) => [`$${value}`, "Price"]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#priceGradient)"
                    />
                    
                    {/* Entry Price Line */}
                    <ReferenceLine 
                      y={currentTrade.entry_price} 
                      stroke="#10B981" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      label={{ 
                        value: `Entry: $${currentTrade.entry_price.toFixed(4)}`, 
                        position: "topRight", 
                        fill: "#10B981",
                        fontSize: 12
                      }}
                    />
                    
                    {/* Exit Price Line */}
                    {currentTrade.exit_price && (
                      <ReferenceLine 
                        y={currentTrade.exit_price} 
                        stroke={currentPnL && currentPnL > 0 ? "#10B981" : "#EF4444"} 
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        label={{ 
                          value: `Exit: $${currentTrade.exit_price.toFixed(4)}`, 
                          position: "topRight", 
                          fill: currentPnL && currentPnL > 0 ? "#10B981" : "#EF4444",
                          fontSize: 12
                        }}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Trade Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-700/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-400" />
                  Trade Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Side</span>
                  {isEditing ? (
                    <Select 
                      value={editData.side} 
                      onValueChange={(value: 'Long' | 'Short') => setEditData({ ...editData, side: value })}
                    >
                      <SelectTrigger className="w-24 bg-slate-600 border-slate-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="Long" className="text-white hover:bg-slate-700">Long</SelectItem>
                        <SelectItem value="Short" className="text-white hover:bg-slate-700">Short</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={currentTrade.side === 'Long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {currentTrade.side}
                    </Badge>
                  )}
                </div>
                <Separator className="bg-slate-600" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Status</span>
                  <Badge className={currentTrade.exit_price ? 'bg-slate-500/20 text-slate-300' : 'bg-blue-500/20 text-blue-400'}>
                    {currentTrade.exit_price ? 'Closed' : 'Open'}
                  </Badge>
                </div>
                <Separator className="bg-slate-600" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Strategy</span>
                  {isEditing ? (
                    <Select 
                      value={editData.strategy || ''} 
                      onValueChange={(value) => setEditData({ ...editData, strategy: value || null })}
                    >
                      <SelectTrigger className="w-32 bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {strategies.map((strategy) => (
                          <SelectItem key={strategy} value={strategy} className="text-white hover:bg-slate-700 capitalize">
                            {strategy}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="font-medium text-white">{currentTrade.strategy || 'N/A'}</span>
                  )}
                </div>
                <Separator className="bg-slate-600" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Date</span>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editData.trade_date || ''}
                      onChange={(e) => setEditData({ ...editData, trade_date: e.target.value })}
                      className="w-40 bg-slate-600 border-slate-500 text-white"
                    />
                  ) : (
                    <span className="font-medium text-white">{new Date(currentTrade.trade_date).toLocaleDateString()}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Trade Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editData.notes || ''}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    placeholder="Add your trade notes, setup, and lessons learned..."
                    className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400 min-h-[120px]"
                  />
                ) : (
                  <>
                    {currentTrade.notes ? (
                      <p className="text-slate-300 leading-relaxed">{currentTrade.notes}</p>
                    ) : (
                      <p className="text-slate-400 italic">No notes added for this trade.</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
