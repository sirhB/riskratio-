"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { authenticatedFetch } from '@/lib/api-client'
import { Calculator } from 'lucide-react'

interface TradeFormProps {
  onClose: () => void
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

export function TradeForm({ onClose }: TradeFormProps) {
  const [formData, setFormData] = useState({
    symbol: "",
    side: "",
    quantity: "",
    entryPrice: "",
    exitPrice: "",
    date: "",
    strategy: "",
    notes: "",
    instrumentType: "futures",
    leverage: "1.00"
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [defaultLeverage, setDefaultLeverage] = useState(1.00)
  const [potentialPnL, setPotentialPnL] = useState(0)

  useEffect(() => {
    // Fetch user's default leverage
    const fetchSettings = async () => {
      try {
        const response = await authenticatedFetch('/api/settings')
        const data = await response.json()
        
        if (response.ok && data.settings) {
          setDefaultLeverage(data.settings.default_leverage || 1.00)
          setFormData(prev => ({ 
            ...prev, 
            leverage: (data.settings.default_leverage || 1.00).toString() 
          }))
        } else {
          // Use default values if settings not available
          setDefaultLeverage(1.00)
          setFormData(prev => ({ ...prev, leverage: "1.00" }))
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        // Use default values on error
        setDefaultLeverage(1.00)
        setFormData(prev => ({ ...prev, leverage: "1.00" }))
      }
    }

    fetchSettings()
  }, [])

  // Calculate potential P&L when form data changes
  useEffect(() => {
    if (formData.entryPrice && formData.exitPrice && formData.quantity && formData.leverage && formData.symbol) {
      const entry = parseFloat(formData.entryPrice)
      const exit = parseFloat(formData.exitPrice)
      const quantity = parseFloat(formData.quantity)
      const leverage = parseFloat(formData.leverage)
      
      // Get contract size based on symbol
      const getContractSize = (symbol: string): number => {
        const contractSizes: { [key: string]: number } = {
          'ES': 50.00, 'NQ': 20.00, 'YM': 5.00, 'RTY': 10.00,
          'CL': 1000.00, 'NG': 10000.00, 'GC': 100.00, 'SI': 5000.00,
          'ZB': 1000.00, 'ZN': 1000.00, 'ZF': 1000.00, 'ZT': 2000.00,
          '6E': 125000.00, '6B': 62500.00, '6A': 100000.00, '6J': 12500000.00,
          '6S': 125000.00, '6C': 100000.00,
        }
        
        if (symbol.length === 6) return 100000.00 // Forex
        return contractSizes[symbol] || 1.00
      }

      const contractSize = getContractSize(formData.symbol.toUpperCase())
      
      let pnl = 0
      if (formData.side === 'Long') {
        pnl = (exit - entry) * quantity * contractSize * leverage
      } else if (formData.side === 'Short') {
        pnl = (entry - exit) * quantity * contractSize * leverage
      }
      
      setPotentialPnL(pnl)
    } else {
      setPotentialPnL(0)
    }
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await authenticatedFetch('/api/trades', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        console.log("Trade submitted successfully")
        onClose()
        window.location.reload()
      } else {
        const data = await response.json()
        console.error("Failed to submit trade:", data.error)
      }
    } catch (error) {
      console.error("Error submitting trade:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableSymbols = formData.instrumentType === "futures" ? futuresSymbols : forexPairs

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Add New Trade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instrumentType" className="text-slate-300">Instrument Type</Label>
              <Select 
                value={formData.instrumentType} 
                onValueChange={(value) => setFormData({ ...formData, instrumentType: value, symbol: "" })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="futures" className="text-white hover:bg-slate-700">Futures</SelectItem>
                  <SelectItem value="forex" className="text-white hover:bg-slate-700">Forex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="symbol" className="text-slate-300">Symbol</Label>
              <Select value={formData.symbol} onValueChange={(value) => setFormData({ ...formData, symbol: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder={`Select ${formData.instrumentType} symbol`} />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 max-h-48">
                  {availableSymbols.map((symbol) => (
                    <SelectItem key={symbol} value={symbol} className="text-white hover:bg-slate-700">
                      {symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="side" className="text-slate-300">Side</Label>
              <Select value={formData.side} onValueChange={(value) => setFormData({ ...formData, side: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select side" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="Long" className="text-white hover:bg-slate-700">Long</SelectItem>
                  <SelectItem value="Short" className="text-white hover:bg-slate-700">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity" className="text-slate-300">
                {formData.instrumentType === "futures" ? "Contracts" : "Lot Size"}
              </Label>
              <Input
                id="quantity"
                type="number"
                step={formData.instrumentType === "forex" ? "0.01" : "1"}
                placeholder={formData.instrumentType === "futures" ? "1" : "0.1"}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="entryPrice" className="text-slate-300">Entry Price</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.0001"
                placeholder={formData.instrumentType === "futures" ? "4500.00" : "1.0850"}
                value={formData.entryPrice}
                onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="exitPrice" className="text-slate-300">Exit Price (Optional)</Label>
              <Input
                id="exitPrice"
                type="number"
                step="0.0001"
                placeholder={formData.instrumentType === "futures" ? "4550.00" : "1.0920"}
                value={formData.exitPrice}
                onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="leverage" className="text-slate-300">Leverage</Label>
              <Input
                id="leverage"
                type="number"
                step="0.01"
                min="1"
                max="500"
                placeholder={defaultLeverage.toString()}
                value={formData.leverage}
                onChange={(e) => setFormData({ ...formData, leverage: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* P&L Calculator */}
          {potentialPnL !== 0 && (
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calculator className="h-4 w-4 mr-2 text-blue-400" />
                <span className="text-white font-medium">Potential P&L</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">With {formData.leverage}x leverage:</span>
                <Badge className={potentialPnL > 0 ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                  {potentialPnL > 0 ? '+' : ''}${potentialPnL.toFixed(2)}
                </Badge>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="date" className="text-slate-300">Trade Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="strategy" className="text-slate-300">Strategy</Label>
            <Select value={formData.strategy} onValueChange={(value) => setFormData({ ...formData, strategy: value })}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="breakout" className="text-white hover:bg-slate-700">Breakout</SelectItem>
                <SelectItem value="momentum" className="text-white hover:bg-slate-700">Momentum</SelectItem>
                <SelectItem value="reversal" className="text-white hover:bg-slate-700">Reversal</SelectItem>
                <SelectItem value="scalping" className="text-white hover:bg-slate-700">Scalping</SelectItem>
                <SelectItem value="swing" className="text-white hover:bg-slate-700">Swing Trading</SelectItem>
                <SelectItem value="news" className="text-white hover:bg-slate-700">News Trading</SelectItem>
                <SelectItem value="technical" className="text-white hover:bg-slate-700">Technical Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes" className="text-slate-300">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add your trade notes, setup, market conditions, and lessons learned..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Trade..." : "Add Trade"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
