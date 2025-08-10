"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { 
  Smartphone, 
  Download, 
  Upload, 
  Settings, 
  Bell, 
  Home,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Eye,
  EyeOff,
  Share2,
  Heart,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Globe,
  Users,
  Trophy,
  Zap,
  Activity,
  PieChart,
  LineChart
} from "lucide-react"

interface MobileTrade {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  entry: number
  current: number
  pnl: number
  pnlPercent: number
  quantity: number
  timestamp: string
  status: 'open' | 'closed'
}

interface MobileAlert {
  id: string
  type: 'price' | 'news' | 'pattern' | 'risk'
  title: string
  message: string
  symbol?: string
  timestamp: string
  read: boolean
  priority: 'high' | 'medium' | 'low'
}

interface MobileNotification {
  id: string
  type: 'trade' | 'alert' | 'news' | 'social'
  title: string
  message: string
  timestamp: string
  read: boolean
}

export function MobileApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isOnline, setIsOnline] = useState(true)
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [signalStrength, setSignalStrength] = useState(4)
  const [showSensitiveData, setShowSensitiveData] = useState(false)
  const [mobileTrades, setMobileTrades] = useState<MobileTrade[]>([])
  const [mobileAlerts, setMobileAlerts] = useState<MobileAlert[]>([])
  const [mobileNotifications, setMobileNotifications] = useState<MobileNotification[]>([])

  // Mock mobile data
  useEffect(() => {
    // Mock mobile trades
    setMobileTrades([
      {
        id: "1",
        symbol: "EURUSD",
        type: "buy",
        entry: 1.0850,
        current: 1.0875,
        pnl: 25,
        pnlPercent: 0.23,
        quantity: 100000,
        timestamp: "2 hours ago",
        status: "open"
      },
      {
        id: "2",
        symbol: "GBPUSD",
        type: "sell",
        entry: 1.2700,
        current: 1.2680,
        pnl: 20,
        pnlPercent: 0.16,
        quantity: 50000,
        timestamp: "1 hour ago",
        status: "open"
      }
    ])

    // Mock mobile alerts
    setMobileAlerts([
      {
        id: "1",
        type: "price",
        title: "Price Alert: EURUSD",
        message: "EURUSD reached your target price of 1.0900",
        symbol: "EURUSD",
        timestamp: "5 minutes ago",
        read: false,
        priority: "high"
      },
      {
        id: "2",
        type: "pattern",
        title: "Pattern Detected",
        message: "Double bottom pattern detected on GBPUSD 1H chart",
        symbol: "GBPUSD",
        timestamp: "15 minutes ago",
        read: false,
        priority: "medium"
      },
      {
        id: "3",
        type: "news",
        title: "Economic News",
        message: "US Non-Farm Payrolls data released - stronger than expected",
        timestamp: "1 hour ago",
        read: true,
        priority: "high"
      }
    ])

    // Mock mobile notifications
    setMobileNotifications([
      {
        id: "1",
        type: "trade",
        title: "Trade Closed",
        message: "Your EURUSD trade closed with +$25 profit",
        timestamp: "2 minutes ago",
        read: false
      },
      {
        id: "2",
        type: "social",
        title: "New Follower",
        message: "TraderPro started following you",
        timestamp: "10 minutes ago",
        read: false
      },
      {
        id: "3",
        type: "alert",
        title: "Risk Alert",
        message: "Portfolio risk level increased to 75%",
        timestamp: "30 minutes ago",
        read: true
      }
    ])
  }, [])

  const getSignalIcon = (strength: number) => {
    const bars = []
    for (let i = 1; i <= 5; i++) {
      bars.push(
        <div
          key={i}
          className={`w-1 rounded-full ${
            i <= strength ? 'bg-green-500' : 'bg-gray-300'
          }`}
          style={{ height: `${i * 2}px` }}
        />
      )
    }
    return <div className="flex items-end gap-0.5">{bars}</div>
  }

  const getBatteryIcon = (level: number) => {
    let color = "bg-green-500"
    if (level < 20) color = "bg-red-500"
    else if (level < 50) color = "bg-yellow-500"
    
    return (
      <div className="flex items-center gap-1">
        <div className="w-6 h-3 border border-gray-400 rounded-sm relative">
          <div 
            className={`h-full ${color} rounded-sm`}
            style={{ width: `${level}%` }}
          />
        </div>
        <div className="w-0.5 h-1 bg-gray-400 rounded-r-sm" />
        <span className="text-xs">{level}%</span>
      </div>
    )
  }

  const getPnlIcon = (pnl: number) => {
    if (pnl > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />
    if (pnl < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case 'medium':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case 'low':
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mobile App</h1>
          <p className="text-gray-600 dark:text-gray-400">React Native mobile application for on-the-go trading</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download APK
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload to Store
          </Button>
        </div>
      </div>

      {/* Mobile Device Simulation */}
      <div className="max-w-sm mx-auto">
        <Card className="border-4 border-gray-800 rounded-3xl bg-gray-900">
          <CardContent className="p-0">
            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white text-xs rounded-t-2xl">
              <div className="flex items-center gap-2">
                <span>9:41</span>
              </div>
              <div className="flex items-center gap-2">
                {getSignalIcon(signalStrength)}
                <Wifi className="h-3 w-3" />
                {getBatteryIcon(batteryLevel)}
              </div>
            </div>

            {/* Mobile App Content */}
            <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsContent value="dashboard" className="h-full space-y-4">
                  {/* Mobile Dashboard */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold">Dashboard</h2>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Bell className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Total P&L</span>
                        </div>
                        <div className="text-lg font-bold text-green-600">+$45</div>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Win Rate</span>
                        </div>
                        <div className="text-lg font-bold">68%</div>
                      </div>
                    </div>

                    {/* Active Trades */}
                    <div className="space-y-2">
                      <h3 className="font-semibold">Active Trades</h3>
                      {mobileTrades.map(trade => (
                        <div key={trade.id} className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getPnlIcon(trade.pnl)}
                              <span className="font-semibold">{trade.symbol}</span>
                              <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'}>
                                {trade.type.toUpperCase()}
                              </Badge>
                            </div>
                            <div className={`font-bold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                            </div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Entry: {trade.entry}</span>
                            <span>Current: {trade.current}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="trades" className="h-full space-y-4">
                  {/* Mobile Trades */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold">Trades</h2>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        New
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {mobileTrades.map(trade => (
                        <div key={trade.id} className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{trade.symbol}</span>
                              <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'}>
                                {trade.type.toUpperCase()}
                              </Badge>
                            </div>
                            <div className={`font-bold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                            </div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Qty: {trade.quantity.toLocaleString()}</span>
                            <span>{trade.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="alerts" className="h-full space-y-4">
                  {/* Mobile Alerts */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold">Alerts</h2>
                      <Button size="sm" variant="outline">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {mobileAlerts.map(alert => (
                        <div key={alert.id} className={`p-3 rounded-lg ${alert.read ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-600'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(alert.priority)}>
                                {alert.priority.toUpperCase()}
                              </Badge>
                              {!alert.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                            </div>
                            <span className="text-xs text-gray-500">{alert.timestamp}</span>
                          </div>
                          <h4 className="font-semibold mb-1">{alert.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="h-full space-y-4">
                  {/* Mobile Notifications */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold">Notifications</h2>
                      <Button size="sm" variant="outline">
                        Mark All Read
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {mobileNotifications.map(notification => (
                        <div key={notification.id} className={`p-3 rounded-lg ${notification.read ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-600'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {notification.type.toUpperCase()}
                              </Badge>
                              {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                            </div>
                            <span className="text-xs text-gray-500">{notification.timestamp}</span>
                          </div>
                          <h4 className="font-semibold mb-1">{notification.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Mobile Navigation */}
              <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t">
                <div className="flex justify-around py-2">
                  <Button variant="ghost" size="sm" className="flex flex-col items-center">
                    <Home className="h-4 w-4" />
                    <span className="text-xs">Home</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex flex-col items-center">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-xs">Trades</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex flex-col items-center">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs">Alerts</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex flex-col items-center">
                    <Bell className="h-4 w-4" />
                    <span className="text-xs">Notifications</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile App Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Mobile Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Push Notifications</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Biometric Login</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Offline Mode</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Dark Mode</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>App Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-xl font-bold text-blue-600">15.2k</div>
                <div className="text-sm text-gray-500">Downloads</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-xl font-bold text-green-600">4.8★</div>
                <div className="text-sm text-gray-500">Rating</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Active Users:</span>
                <span className="font-medium">8,456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Daily Sessions:</span>
                <span className="font-medium">12,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Crash Rate:</span>
                <span className="font-medium text-green-600">0.02%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Development Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">iOS Version:</span>
                <Badge variant="outline">v2.1.0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Android Version:</span>
                <Badge variant="outline">v2.1.0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last Updated:</span>
                <span className="text-sm">2 days ago</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">iOS Store:</span>
                <Badge className="bg-green-100 text-green-800">Published</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Google Play:</span>
                <Badge className="bg-green-100 text-green-800">Published</Badge>
              </div>
            </div>
            
            <Button className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Deploy Update
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
