// Market Data Service for RiskRat.io
// Handles real-time price updates, alerts, and market data integration

export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  previousClose: number
  timestamp: number
}

export interface PriceAlert {
  id: string
  symbol: string
  targetPrice: number
  direction: 'above' | 'below'
  triggered: boolean
  createdAt: number
  triggeredAt?: number
}

export interface MarketHours {
  isOpen: boolean
  nextOpen: Date
  nextClose: Date
  isPreMarket: boolean
  isAfterHours: boolean
}

class MarketDataService {
  private ws: WebSocket | null = null
  private priceAlerts: Map<string, PriceAlert[]> = new Map()
  private subscribers: Map<string, Set<(data: MarketData) => void>> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  // Mock market data for development
  private mockData: Map<string, MarketData> = new Map()

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    const symbols = [
      'ES', 'NQ', 'YM', 'RTY', 'CL', 'NG', 'GC', 'SI',
      'ZB', 'ZN', 'ZF', 'ZT', '6E', '6B', '6A', '6J',
      'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD'
    ]

    symbols.forEach(symbol => {
      const basePrice = this.getBasePrice(symbol)
      const change = (Math.random() - 0.5) * basePrice * 0.02 // ±1% change
      
      this.mockData.set(symbol, {
        symbol,
        price: basePrice + change,
        change,
        changePercent: (change / basePrice) * 100,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        high: basePrice + Math.abs(change) * 1.5,
        low: basePrice - Math.abs(change) * 1.5,
        open: basePrice,
        previousClose: basePrice,
        timestamp: Date.now()
      })
    })
  }

  private getBasePrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'ES': 4500, 'NQ': 15000, 'YM': 35000, 'RTY': 2000,
      'CL': 80, 'NG': 3.5, 'GC': 2000, 'SI': 25,
      'ZB': 150, 'ZN': 110, 'ZF': 105, 'ZT': 100,
      '6E': 1.08, '6B': 1.25, '6A': 0.65, '6J': 150,
      'EURUSD': 1.08, 'GBPUSD': 1.25, 'USDJPY': 150, 'USDCHF': 0.90,
      'AUDUSD': 0.65, 'USDCAD': 1.35
    }
    return basePrices[symbol] || 100
  }

  // Subscribe to real-time price updates
  subscribe(symbol: string, callback: (data: MarketData) => void): () => void {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set())
    }
    
    this.subscribers.get(symbol)!.add(callback)
    
    // Return unsubscribe function
    return () => {
      const symbolSubscribers = this.subscribers.get(symbol)
      if (symbolSubscribers) {
        symbolSubscribers.delete(callback)
        if (symbolSubscribers.size === 0) {
          this.subscribers.delete(symbol)
        }
      }
    }
  }

  // Get current market data for a symbol
  getCurrentPrice(symbol: string): MarketData | null {
    return this.mockData.get(symbol) || null
  }

  // Add price alert
  addPriceAlert(symbol: string, targetPrice: number, direction: 'above' | 'below'): string {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const alert: PriceAlert = {
      id: alertId,
      symbol,
      targetPrice,
      direction,
      triggered: false,
      createdAt: Date.now()
    }

    if (!this.priceAlerts.has(symbol)) {
      this.priceAlerts.set(symbol, [])
    }
    this.priceAlerts.get(symbol)!.push(alert)

    // Store in localStorage for persistence
    this.saveAlertsToStorage()

    return alertId
  }

  // Remove price alert
  removePriceAlert(alertId: string): boolean {
    for (const [symbol, alerts] of this.priceAlerts.entries()) {
      const index = alerts.findIndex(alert => alert.id === alertId)
      if (index !== -1) {
        alerts.splice(index, 1)
        if (alerts.length === 0) {
          this.priceAlerts.delete(symbol)
        }
        this.saveAlertsToStorage()
        return true
      }
    }
    return false
  }

  // Get all price alerts for a symbol
  getPriceAlerts(symbol?: string): PriceAlert[] {
    if (symbol) {
      return this.priceAlerts.get(symbol) || []
    }
    
    const allAlerts: PriceAlert[] = []
    for (const alerts of this.priceAlerts.values()) {
      allAlerts.push(...alerts)
    }
    return allAlerts
  }

  // Check if market is open
  getMarketHours(): MarketHours {
    const now = new Date()
    const day = now.getDay()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const currentTime = hour * 100 + minute

    // Market hours: 9:30 AM - 4:00 PM ET, Monday-Friday
    const isWeekday = day >= 1 && day <= 5
    const isMarketHours = isWeekday && currentTime >= 930 && currentTime <= 1600
    const isPreMarket = isWeekday && currentTime >= 400 && currentTime < 930
    const isAfterHours = isWeekday && currentTime > 1600 && currentTime <= 2000

    return {
      isOpen: isMarketHours,
      nextOpen: this.getNextMarketOpen(now),
      nextClose: this.getNextMarketClose(now),
      isPreMarket,
      isAfterHours
    }
  }

  private getNextMarketOpen(currentDate: Date): Date {
    const nextOpen = new Date(currentDate)
    nextOpen.setHours(9, 30, 0, 0)
    
    if (currentDate.getDay() === 0) { // Sunday
      nextOpen.setDate(nextOpen.getDate() + 1)
    } else if (currentDate.getDay() === 6) { // Saturday
      nextOpen.setDate(nextOpen.getDate() + 2)
    } else if (currentDate.getHours() >= 9 && currentDate.getMinutes() >= 30) {
      nextOpen.setDate(nextOpen.getDate() + 1)
    }
    
    return nextOpen
  }

  private getNextMarketClose(currentDate: Date): Date {
    const nextClose = new Date(currentDate)
    nextClose.setHours(16, 0, 0, 0)
    
    if (currentDate.getDay() === 0) { // Sunday
      nextClose.setDate(nextClose.getDate() + 1)
    } else if (currentDate.getDay() === 6) { // Saturday
      nextClose.setDate(nextClose.getDate() + 2)
    } else if (currentDate.getHours() >= 16) {
      nextClose.setDate(nextClose.getDate() + 1)
    }
    
    return nextClose
  }

  // Start real-time updates (mock implementation)
  startRealTimeUpdates() {
    setInterval(() => {
      this.updateMockData()
      this.checkPriceAlerts()
    }, 5000) // Update every 5 seconds
  }

  private updateMockData() {
    for (const [symbol, data] of this.mockData.entries()) {
      const basePrice = this.getBasePrice(symbol)
      const volatility = this.getVolatility(symbol)
      const change = (Math.random() - 0.5) * basePrice * volatility
      
      const newData: MarketData = {
        ...data,
        price: data.price + change,
        change: data.change + change,
        changePercent: ((data.price + change - data.previousClose) / data.previousClose) * 100,
        volume: data.volume + Math.floor((Math.random() - 0.5) * 10000),
        high: Math.max(data.high, data.price + change),
        low: Math.min(data.low, data.price + change),
        timestamp: Date.now()
      }

      this.mockData.set(symbol, newData)

      // Notify subscribers
      const subscribers = this.subscribers.get(symbol)
      if (subscribers) {
        subscribers.forEach(callback => callback(newData))
      }
    }
  }

  private getVolatility(symbol: string): number {
    const volatilities: { [key: string]: number } = {
      'ES': 0.001, 'NQ': 0.002, 'YM': 0.001, 'RTY': 0.002,
      'CL': 0.005, 'NG': 0.01, 'GC': 0.003, 'SI': 0.005,
      'ZB': 0.002, 'ZN': 0.001, 'ZF': 0.001, 'ZT': 0.001,
      '6E': 0.0005, '6B': 0.0008, '6A': 0.0008, '6J': 0.0005,
      'EURUSD': 0.0003, 'GBPUSD': 0.0005, 'USDJPY': 0.0003, 'USDCHF': 0.0003,
      'AUDUSD': 0.0005, 'USDCAD': 0.0004
    }
    return volatilities[symbol] || 0.001
  }

  private checkPriceAlerts() {
    for (const [symbol, alerts] of this.priceAlerts.entries()) {
      const currentData = this.mockData.get(symbol)
      if (!currentData) continue

      for (const alert of alerts) {
        if (alert.triggered) continue

        const shouldTrigger = 
          (alert.direction === 'above' && currentData.price >= alert.targetPrice) ||
          (alert.direction === 'below' && currentData.price <= alert.targetPrice)

        if (shouldTrigger) {
          alert.triggered = true
          alert.triggeredAt = Date.now()
          this.triggerAlert(alert, currentData)
        }
      }
    }
  }

  private triggerAlert(alert: PriceAlert, marketData: MarketData) {
    // Create notification
    const notification = {
      id: `notification_${Date.now()}`,
      type: 'price_alert' as const,
      title: `Price Alert: ${alert.symbol}`,
      message: `${alert.symbol} has reached ${alert.targetPrice} (${alert.direction === 'above' ? 'above' : 'below'} target)`,
      data: { alert, marketData },
      timestamp: Date.now()
    }

    // Store notification
    this.saveNotification(notification)

    // Trigger browser notification if available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      })
    }

    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('priceAlert', { detail: notification }))
  }

  private saveAlertsToStorage() {
    const alertsData = Object.fromEntries(this.priceAlerts)
    localStorage.setItem('riskratio_price_alerts', JSON.stringify(alertsData))
  }

  private loadAlertsFromStorage() {
    const alertsData = localStorage.getItem('riskratio_price_alerts')
    if (alertsData) {
      try {
        const parsed = JSON.parse(alertsData)
        this.priceAlerts = new Map(Object.entries(parsed))
      } catch (error) {
        console.error('Error loading price alerts from storage:', error)
      }
    }
  }

  private saveNotification(notification: any) {
    const notifications = JSON.parse(localStorage.getItem('riskratio_notifications') || '[]')
    notifications.unshift(notification)
    
    // Keep only last 100 notifications
    if (notifications.length > 100) {
      notifications.splice(100)
    }
    
    localStorage.setItem('riskratio_notifications', JSON.stringify(notifications))
  }

  // Initialize the service
  init() {
    this.loadAlertsFromStorage()
    this.startRealTimeUpdates()
  }

  // Get notifications
  getNotifications(): any[] {
    const notifications = localStorage.getItem('riskratio_notifications')
    return notifications ? JSON.parse(notifications) : []
  }

  // Clear notifications
  clearNotifications() {
    localStorage.removeItem('riskratio_notifications')
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService()

// Initialize on module load
if (typeof window !== 'undefined') {
  marketDataService.init()
}

