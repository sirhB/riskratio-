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
  Link, 
  RefreshCw, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Database,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Clock,
  DollarSign,
  BarChart3,
  Activity,
  Shield,
  Key,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ExternalLink,
  Zap,
  Globe,
  Server
} from "lucide-react"

interface BrokerConnection {
  id: string
  name: string
  type: 'demo' | 'live'
  status: 'connected' | 'disconnected' | 'error' | 'connecting'
  lastSync: string
  symbols: string[]
  dataTypes: string[]
  apiKey?: string
  secretKey?: string
  accountId?: string
}

interface DataProvider {
  id: string
  name: string
  type: 'market_data' | 'news' | 'economic'
  status: 'active' | 'inactive' | 'error'
  lastUpdate: string
  symbols: string[]
  updateFrequency: string
  cost: string
}

interface DataSync {
  id: string
  brokerId: string
  symbol: string
  lastSync: string
  records: number
  status: 'syncing' | 'completed' | 'error'
  progress: number
}

export function BrokerIntegrations() {
  const [activeTab, setActiveTab] = useState("connections")
  const [isConnecting, setIsConnecting] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  
  const [brokerConnections, setBrokerConnections] = useState<BrokerConnection[]>([])
  const [dataProviders, setDataProviders] = useState<DataProvider[]>([])
  const [dataSyncs, setDataSyncs] = useState<DataSync[]>([])
  const [newConnection, setNewConnection] = useState({
    name: "",
    type: "demo" as 'demo' | 'live',
    apiKey: "",
    secretKey: "",
    accountId: ""
  })

  // Mock data initialization
  useEffect(() => {
    // Mock broker connections
    setBrokerConnections([
      {
        id: "1",
        name: "MetaTrader 5 Demo",
        type: "demo",
        status: "connected",
        lastSync: "2 minutes ago",
        symbols: ["EURUSD", "GBPUSD", "USDJPY", "BTCUSD"],
        dataTypes: ["OHLCV", "Ticks", "News"],
        apiKey: "demo_api_key_123",
        accountId: "12345678"
      },
      {
        id: "2",
        name: "OANDA Live",
        type: "live",
        status: "connected",
        lastSync: "5 minutes ago",
        symbols: ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD"],
        dataTypes: ["OHLCV", "Ticks", "News", "Economic"],
        apiKey: "live_api_key_456",
        accountId: "87654321"
      }
    ])

    // Mock data providers
    setDataProviders([
      {
        id: "1",
        name: "Alpha Vantage",
        type: "market_data",
        status: "active",
        lastUpdate: "1 minute ago",
        symbols: ["EURUSD", "GBPUSD", "USDJPY", "BTCUSD"],
        updateFrequency: "Real-time",
        cost: "Free Tier"
      },
      {
        id: "2",
        name: "Polygon.io",
        type: "market_data",
        status: "active",
        lastUpdate: "30 seconds ago",
        symbols: ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD"],
        updateFrequency: "Real-time",
        cost: "Premium"
      },
      {
        id: "3",
        name: "Reuters",
        type: "news",
        status: "active",
        lastUpdate: "5 minutes ago",
        symbols: ["All"],
        updateFrequency: "Real-time",
        cost: "Included"
      }
    ])

    // Mock data syncs
    setDataSyncs([
      {
        id: "1",
        brokerId: "1",
        symbol: "EURUSD",
        lastSync: "2 minutes ago",
        records: 1250,
        status: "completed",
        progress: 100
      },
      {
        id: "2",
        brokerId: "1",
        symbol: "GBPUSD",
        lastSync: "1 minute ago",
        records: 980,
        status: "syncing",
        progress: 65
      }
    ])
  }, [])

  const connectBroker = async () => {
    if (!newConnection.name || !newConnection.apiKey) return
    
    setIsConnecting(true)
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const connection: BrokerConnection = {
      id: Date.now().toString(),
      name: newConnection.name,
      type: newConnection.type,
      status: "connected",
      lastSync: "Just now",
      symbols: ["EURUSD", "GBPUSD", "USDJPY"],
      dataTypes: ["OHLCV", "Ticks"],
      apiKey: newConnection.apiKey,
      accountId: newConnection.accountId
    }
    
    setBrokerConnections(prev => [...prev, connection])
    setNewConnection({ name: "", type: "demo", apiKey: "", secretKey: "", accountId: "" })
    setIsConnecting(false)
  }

  const disconnectBroker = (brokerId: string) => {
    setBrokerConnections(prev => prev.map(broker => 
      broker.id === brokerId ? { ...broker, status: "disconnected" } : broker
    ))
  }

  const syncData = async (brokerId: string) => {
    setSyncProgress(0)
    
    // Simulate sync process
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'connecting':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case 'disconnected':
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case 'error':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case 'connecting':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Broker Integrations</h1>
          <p className="text-gray-600 dark:text-gray-400">Connect to brokers and data providers for real-time market data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowApiKeys(!showApiKeys)}>
            {showApiKeys ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showApiKeys ? "Hide" : "Show"} Keys
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Connection
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="providers">Data Providers</TabsTrigger>
          <TabsTrigger value="sync">Data Sync</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Broker Connections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Broker Connections
                </CardTitle>
                <CardDescription>Connected trading accounts and data sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {brokerConnections.map(broker => (
                  <div key={broker.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(broker.status)}
                        <span className="font-semibold">{broker.name}</span>
                        <Badge variant={broker.type === 'live' ? 'destructive' : 'secondary'}>
                          {broker.type.toUpperCase()}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(broker.status)}>
                        {broker.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>Account ID:</span>
                        <span className="font-mono">{broker.accountId}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>API Key:</span>
                        <span className="font-mono">
                          {showApiKeys ? broker.apiKey : `${broker.apiKey?.slice(0, 8)}...`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Last Sync:</span>
                        <span>{broker.lastSync}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => syncData(broker.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Sync
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => disconnectBroker(broker.id)}
                      >
                        <WifiOff className="h-4 w-4 mr-1" />
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Add New Connection */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Connection</CardTitle>
                <CardDescription>Connect to a new broker or data provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Connection Name</label>
                  <Input
                    value={newConnection.name}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My MT5 Demo"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Account Type</label>
                  <Select value={newConnection.type} onValueChange={(value: 'demo' | 'live') => setNewConnection(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demo">Demo Account</SelectItem>
                      <SelectItem value="live">Live Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">API Key</label>
                  <Input
                    type={showApiKeys ? "text" : "password"}
                    value={newConnection.apiKey}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Enter API key"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Secret Key (Optional)</label>
                  <Input
                    type={showApiKeys ? "text" : "password"}
                    value={newConnection.secretKey}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, secretKey: e.target.value }))}
                    placeholder="Enter secret key"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Account ID</label>
                  <Input
                    value={newConnection.accountId}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, accountId: e.target.value }))}
                    placeholder="Enter account ID"
                  />
                </div>
                
                <Button 
                  onClick={connectBroker} 
                  disabled={isConnecting || !newConnection.name || !newConnection.apiKey}
                  className="w-full"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Link className="h-4 w-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Providers */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Providers
                </CardTitle>
                <CardDescription>Market data and news providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataProviders.map(provider => (
                    <div key={provider.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(provider.status)}
                          <span className="font-semibold">{provider.name}</span>
                        </div>
                        <Badge className={getStatusColor(provider.status)}>
                          {provider.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Type:</span>
                          <span className="capitalize">{provider.type.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Update Frequency:</span>
                          <span>{provider.updateFrequency}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Cost:</span>
                          <span>{provider.cost}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Update:</span>
                          <span>{provider.lastUpdate}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Visit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Synchronization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Data Synchronization
                </CardTitle>
                <CardDescription>Sync historical and real-time data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dataSyncs.map(sync => (
                  <div key={sync.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{sync.symbol}</span>
                      <Badge className={getStatusColor(sync.status)}>
                        {sync.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>Records:</span>
                        <span>{sync.records.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Last Sync:</span>
                        <span>{sync.lastSync}</span>
                      </div>
                    </div>
                    
                    {sync.status === 'syncing' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress:</span>
                          <span>{sync.progress}%</span>
                        </div>
                        <Progress value={sync.progress} className="w-full" />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sync Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Sync Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2,230</div>
                    <div className="text-sm text-gray-500">Total Records</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">15</div>
                    <div className="text-sm text-gray-500">Active Symbols</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Last Full Sync:</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Data Size:</span>
                    <span className="font-medium">45.2 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sync Frequency:</span>
                    <span className="font-medium">Every 5 minutes</span>
                  </div>
                </div>
                
                <Button className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Force Full Sync
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Connection Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Connection Settings</CardTitle>
                <CardDescription>Configure connection parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-reconnect</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSL/TLS Encryption</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Connection Timeout</span>
                    <span className="text-sm font-medium">30 seconds</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Retry Attempts</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Data Settings</CardTitle>
                <CardDescription>Configure data synchronization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Real-time Updates</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Historical Data</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">News Feed</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Economic Calendar</span>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
