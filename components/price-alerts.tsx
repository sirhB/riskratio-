"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Bell, Plus, Trash2, CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { marketDataService, PriceAlert, MarketData } from '@/lib/market-data'

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

export function PriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newAlert, setNewAlert] = useState({
    symbol: "",
    targetPrice: "",
    direction: "above" as 'above' | 'below'
  })
  const [currentPrices, setCurrentPrices] = useState<Map<string, MarketData>>(new Map())
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    // Load existing alerts
    const existingAlerts = marketDataService.getPriceAlerts()
    setAlerts(existingAlerts)

    // Load notifications
    const existingNotifications = marketDataService.getNotifications()
    setNotifications(existingNotifications)

    // Subscribe to price updates for symbols with alerts
    const symbols = [...new Set(existingAlerts.map(alert => alert.symbol))]
    const unsubscribers: (() => void)[] = []

    symbols.forEach(symbol => {
      const unsubscribe = marketDataService.subscribe(symbol, (data) => {
        setCurrentPrices(prev => new Map(prev.set(symbol, data)))
      })
      unsubscribers.push(unsubscribe)

      // Get initial price
      const initialPrice = marketDataService.getCurrentPrice(symbol)
      if (initialPrice) {
        setCurrentPrices(prev => new Map(prev.set(symbol, initialPrice)))
      }
    })

    // Listen for price alert events
    const handlePriceAlert = (event: CustomEvent) => {
      setNotifications(prev => [event.detail, ...prev])
    }

    window.addEventListener('priceAlert', handlePriceAlert as EventListener)

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      unsubscribers.forEach(unsub => unsub())
      window.removeEventListener('priceAlert', handlePriceAlert as EventListener)
    }
  }, [])

  const handleAddAlert = () => {
    if (!newAlert.symbol || !newAlert.targetPrice) return

    const targetPrice = parseFloat(newAlert.targetPrice)
    if (isNaN(targetPrice)) return

    const alertId = marketDataService.addPriceAlert(
      newAlert.symbol.toUpperCase(),
      targetPrice,
      newAlert.direction
    )

    // Add to local state
    const newAlertObj: PriceAlert = {
      id: alertId,
      symbol: newAlert.symbol.toUpperCase(),
      targetPrice,
      direction: newAlert.direction,
      triggered: false,
      createdAt: Date.now()
    }

    setAlerts(prev => [...prev, newAlertObj])

    // Subscribe to price updates if not already subscribed
    const currentPrice = marketDataService.getCurrentPrice(newAlert.symbol.toUpperCase())
    if (currentPrice) {
      setCurrentPrices(prev => new Map(prev.set(newAlert.symbol.toUpperCase(), currentPrice)))
    }

    // Reset form and close dialog
    setNewAlert({ symbol: "", targetPrice: "", direction: "above" })
    setShowAddDialog(false)
  }

  const handleRemoveAlert = (alertId: string) => {
    const success = marketDataService.removePriceAlert(alertId)
    if (success) {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))
    }
  }

  const handleClearNotifications = () => {
    marketDataService.clearNotifications()
    setNotifications([])
  }

  const getAlertStatus = (alert: PriceAlert) => {
    const currentPrice = currentPrices.get(alert.symbol)
    if (!currentPrice) return { status: 'unknown', color: 'gray' }

    if (alert.triggered) {
      return { status: 'triggered', color: 'green' }
    }

    const priceDiff = currentPrice.price - alert.targetPrice
    if (alert.direction === 'above' && priceDiff >= 0) {
      return { status: 'near', color: 'yellow' }
    }
    if (alert.direction === 'below' && priceDiff <= 0) {
      return { status: 'near', color: 'yellow' }
    }

    return { status: 'waiting', color: 'blue' }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(price)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Price Alerts</h2>
          <p className="text-slate-400">Set alerts for price movements and get notified instantly</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add Price Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="symbol" className="text-slate-300">Symbol</Label>
                <Select value={newAlert.symbol} onValueChange={(value) => setNewAlert(prev => ({ ...prev, symbol: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select symbol" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <div className="p-2">
                      <div className="text-sm font-semibold text-slate-400 mb-2">Futures</div>
                      {futuresSymbols.map(symbol => (
                        <SelectItem key={symbol} value={symbol} className="text-white hover:bg-slate-600">
                          {symbol}
                        </SelectItem>
                      ))}
                    </div>
                    <div className="p-2">
                      <div className="text-sm font-semibold text-slate-400 mb-2">Forex</div>
                      {forexPairs.map(symbol => (
                        <SelectItem key={symbol} value={symbol} className="text-white hover:bg-slate-600">
                          {symbol}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="targetPrice" className="text-slate-300">Target Price</Label>
                <Input
                  id="targetPrice"
                  type="number"
                  step="0.01"
                  value={newAlert.targetPrice}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter target price"
                />
              </div>

              <div>
                <Label htmlFor="direction" className="text-slate-300">Direction</Label>
                <Select value={newAlert.direction} onValueChange={(value: 'above' | 'below') => setNewAlert(prev => ({ ...prev, direction: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="above" className="text-white hover:bg-slate-600">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                        Above
                      </div>
                    </SelectItem>
                    <SelectItem value="below" className="text-white hover:bg-slate-600">
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 mr-2 text-red-400" />
                        Below
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAlert} disabled={!newAlert.symbol || !newAlert.targetPrice}>
                  Add Alert
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Alerts */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Active Alerts ({alerts.filter(a => !a.triggered).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.filter(a => !a.triggered).length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active alerts</p>
              <p className="text-sm">Create your first price alert to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Symbol</TableHead>
                  <TableHead className="text-slate-300">Current Price</TableHead>
                  <TableHead className="text-slate-300">Target</TableHead>
                  <TableHead className="text-slate-300">Direction</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Created</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.filter(a => !a.triggered).map((alert) => {
                  const currentPrice = currentPrices.get(alert.symbol)
                  const status = getAlertStatus(alert)
                  
                  return (
                    <TableRow key={alert.id} className="border-slate-700">
                      <TableCell className="text-white font-medium">{alert.symbol}</TableCell>
                      <TableCell className="text-white">
                        {currentPrice ? formatPrice(currentPrice.price) : 'Loading...'}
                      </TableCell>
                      <TableCell className="text-white">{formatPrice(alert.targetPrice)}</TableCell>
                      <TableCell>
                        <Badge variant={alert.direction === 'above' ? 'default' : 'secondary'}>
                          {alert.direction === 'above' ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {alert.direction}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.color === 'green' ? 'default' : status.color === 'yellow' ? 'secondary' : 'outline'}>
                          {status.status === 'triggered' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {status.status === 'near' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {status.status === 'waiting' && <Clock className="h-3 w-3 mr-1" />}
                          {status.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {formatTime(alert.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAlert(alert.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Triggered Alerts */}
      {alerts.filter(a => a.triggered).length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              Triggered Alerts ({alerts.filter(a => a.triggered).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Symbol</TableHead>
                  <TableHead className="text-slate-300">Target Price</TableHead>
                  <TableHead className="text-slate-300">Direction</TableHead>
                  <TableHead className="text-slate-300">Triggered At</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.filter(a => a.triggered).map((alert) => (
                  <TableRow key={alert.id} className="border-slate-700">
                    <TableCell className="text-white font-medium">{alert.symbol}</TableCell>
                    <TableCell className="text-white">{formatPrice(alert.targetPrice)}</TableCell>
                    <TableCell>
                      <Badge variant={alert.direction === 'above' ? 'default' : 'secondary'}>
                        {alert.direction}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {alert.triggeredAt ? formatTime(alert.triggeredAt) : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAlert(alert.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Recent Notifications ({notifications.length})
              </span>
              <Button variant="outline" size="sm" onClick={handleClearNotifications}>
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {notifications.slice(0, 10).map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{notification.title}</div>
                    <div className="text-slate-400 text-sm">{notification.message}</div>
                    <div className="text-slate-500 text-xs">{formatTime(notification.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
