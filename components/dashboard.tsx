"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, Plus, Filter, Search, Moon, Sun, Settings, Globe, HelpCircle } from 'lucide-react'
import { TradeForm } from "./trade-form"
import { TradeHistory } from "./trade-history"
import { PerformanceChart } from "./performance-chart"
import { CalendarView } from "./calendar-view"
import { PnLCalendar } from "./pnl-calendar"
import { SettingsPage } from "./settings-page"
import { EconomicCalendar } from "./economic-calendar"
import { PriceAlerts } from "./price-alerts"
import { RiskManagement } from "./risk-management"
import { PerformanceAnalytics } from "./performance-analytics"
import { TradeSuggestions } from "./trade-suggestions"
import { SocialFeatures } from "./social-features"
import { AdvancedCharting } from "./advanced-charting"
import { AdvancedAI } from "./advanced-ai"
import { BrokerIntegrations } from "./broker-integrations"
import { MobileApp } from "./mobile-app"
import { QuickActions } from "./quick-actions"
import { BreadcrumbNav } from "./breadcrumb-nav"
import { GlobalSearch } from "./global-search"
import { ResponsiveTabs } from "./responsive-tabs"
import { OnboardingTour } from "./onboarding-tour"
import { ToastNotifications, useToast } from "./toast-notifications"
import { KeyboardShortcuts } from "./keyboard-shortcuts"
import { PWARegistration } from "./pwa-registration"
import { 
  ModernCard, 
  ModernButton, 
  ModernBadge, 
  GradientText, 
  GlassContainer,
  AnimatedIcon,
  FloatingActionButton,
  PulseEffect
} from "./modern-design-system"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { useRouter } from 'next/navigation'
import { authenticatedFetch } from '@/lib/api-client'

export function Dashboard() {
  const [showTradeForm, setShowTradeForm] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState({
    totalPnL: 0,
    winRate: 0,
    totalTrades: 0,
    avgWin: 0,
    avgLoss: 0,
    profitFactor: 0,
    maxDrawdown: 0,
    sharpeRatio: 0
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [alertCount, setAlertCount] = useState(0)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const toast = useToast()

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle user authentication
  useEffect(() => {
    if (!isClient) return

    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/')
      return
    }
    
    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Check if user is new and show onboarding
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
      if (!hasSeenOnboarding && parsedUser.id) {
        setShowOnboarding(true)
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/')
    }
  }, [isClient, router])

  // Fetch stats
  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      try {
        const response = await authenticatedFetch('/api/stats')
        const data = await response.json()
        
        if (response.ok && data.stats) {
          setStats(data.stats)
        } else {
          console.error('Failed to fetch stats:', data.error)
          toast.error('Error', 'Failed to load trading statistics')
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        toast.error('Error', 'Failed to load trading statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user, toast])

  // Mock alert count (in real app, fetch from alerts API)
  useEffect(() => {
    setAlertCount(Math.floor(Math.random() * 5))
  }, [])

  // Show loading state while checking authentication
  if (!isClient || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    )
  }

  const handleNavigate = (tab: string, itemId?: string) => {
    setActiveTab(tab)
    // Handle specific item navigation if needed
    if (itemId) {
      // Could scroll to specific trade or highlight item
      console.log(`Navigate to ${tab} with item ${itemId}`)
    }
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    localStorage.setItem('hasSeenOnboarding', 'true')
    toast.success('Welcome!', 'You\'re all set to start trading. Explore the features and add your first trade!')
  }

  const handleKeyboardAction = (action: string) => {
    switch (action) {
      case 'dashboard':
      case 'trades':
      case 'analytics':
      case 'charting':
      case 'settings':
        setActiveTab(action)
        break
      case 'new-trade':
        setShowTradeForm(true)
        break
      case 'search':
        // Focus search input
        document.querySelector('input[placeholder*="Search"]')?.focus()
        break
      case 'refresh':
        // Refresh data
        window.location.reload()
        break
      case 'help':
        setShowOnboarding(true)
        break
      case 'long':
      case 'short':
      case 'close':
      case 'alert':
        toast.info('Feature', `${action} action triggered`)
        break
      case 'performance':
      case 'risk':
      case 'ai':
      case 'community':
        setActiveTab(action === 'performance' ? 'analytics' : action)
        break
    }
  }

  // If settings tab is active, show settings page
  if (activeTab === "settings") {
    return <SettingsPage />
  }

  // If price alerts tab is active, show price alerts page
  if (activeTab === "alerts") {
    return <PriceAlerts />
  }

  // If risk management tab is active, show risk management page
  if (activeTab === "risk") {
    return <RiskManagement />
  }

  // If analytics tab is active, show performance analytics page
  if (activeTab === "analytics") {
    return <PerformanceAnalytics />
  }

  // If suggestions tab is active, show trade suggestions page
  if (activeTab === "suggestions") {
    return <TradeSuggestions />
  }

  // If social tab is active, show social features page
  if (activeTab === "social") {
    return <SocialFeatures />
  }

  // If charting tab is active, show advanced charting page
  if (activeTab === "charting") {
    return <AdvancedCharting />
  }

  // If ai tab is active, show advanced AI page
  if (activeTab === "ai") {
    return <AdvancedAI />
  }

  // If broker tab is active, show broker integrations page
  if (activeTab === "broker") {
    return <BrokerIntegrations />
  }

  // If mobile tab is active, show mobile app page
  if (activeTab === "mobile") {
    return <MobileApp />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl supports-[backdrop-filter]:bg-card/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <PulseEffect>
                  <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg">
                    <AnimatedIcon animation="float">
                      <BarChart3 className="h-6 w-6 text-primary-foreground" />
                    </AnimatedIcon>
                  </div>
                </PulseEffect>
                <div>
                  <GradientText className="text-3xl font-bold">
                    RiskRat.io
                  </GradientText>
                  <p className="text-xs text-muted-foreground">Futures & Forex Analytics</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <GlobalSearch onNavigate={handleNavigate} />
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-foreground">{user.full_name || user.fullName}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
              <ModernButton
                variant="ghost"
                size="sm"
                onClick={() => setShowOnboarding(true)}
                title="Help & Tour"
              >
                <AnimatedIcon animation="pulse" className="mr-2">
                  <HelpCircle className="h-4 w-4" />
                </AnimatedIcon>
                Help & Tour
              </ModernButton>
              <ModernButton
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("settings")}
              >
                <AnimatedIcon animation="float" className="mr-2">
                  <Settings className="h-4 w-4" />
                </AnimatedIcon>
                Settings
              </ModernButton>
              <ModernButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem('user')
                  router.push('/')
                }}
              >
                Sign Out
              </ModernButton>
              <ModernButton
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <AnimatedIcon animation="float" className="mr-2">
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </AnimatedIcon>
              </ModernButton>
              <ModernButton 
                variant="gradient"
                onClick={() => setShowTradeForm(true)} 
                className="shadow-lg hover:shadow-xl"
              >
                <AnimatedIcon animation="bounce" className="mr-2">
                  <Plus className="h-4 w-4" />
                </AnimatedIcon>
                Add Trade
              </ModernButton>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <BreadcrumbNav currentTab={activeTab} onNavigate={handleNavigate} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <ResponsiveTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            alertCount={alertCount}
          />

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Actions */}
            <QuickActions 
              onAddTrade={() => setShowTradeForm(true)}
              onNavigate={handleNavigate}
              stats={stats}
            />

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ModernCard variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Total P&L</h3>
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <AnimatedIcon animation="pulse">
                      <DollarSign className="h-4 w-4 text-green-400" />
                    </AnimatedIcon>
                  </div>
                </div>
                <div className="space-y-2">
                  {loading ? (
                    <div className="animate-pulse bg-muted h-8 w-20 rounded"></div>
                  ) : (
                    <GradientText className="text-3xl font-bold text-green-400">
                      ${stats.totalPnL.toLocaleString()}
                    </GradientText>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Including leverage effects
                  </p>
                </div>
              </ModernCard>

              <ModernCard variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Win Rate</h3>
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <AnimatedIcon animation="float">
                      <Target className="h-4 w-4 text-blue-400" />
                    </AnimatedIcon>
                  </div>
                </div>
                <div className="space-y-2">
                  {loading ? (
                    <div className="animate-pulse bg-muted h-8 w-20 rounded"></div>
                  ) : (
                    <GradientText className="text-3xl font-bold text-blue-400">
                      {stats.winRate}%
                    </GradientText>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {stats.totalTrades} total trades
                  </p>
                </div>
              </ModernCard>

              <ModernCard variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Avg Win</h3>
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <AnimatedIcon animation="bounce">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    </AnimatedIcon>
                  </div>
                </div>
                <div className="space-y-2">
                  {loading ? (
                    <div className="animate-pulse bg-muted h-8 w-20 rounded"></div>
                  ) : (
                    <GradientText className="text-3xl font-bold text-green-400">
                      ${stats.avgWin}
                    </GradientText>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Per winning trade
                  </p>
                </div>
              </ModernCard>

              <ModernCard variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Avg Loss</h3>
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AnimatedIcon animation="pulse">
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    </AnimatedIcon>
                  </div>
                </div>
                <div className="space-y-2">
                  {loading ? (
                    <div className="animate-pulse bg-muted h-8 w-20 rounded"></div>
                  ) : (
                    <GradientText className="text-3xl font-bold text-red-400">
                      ${stats.avgLoss}
                    </GradientText>
                  )}
                  <p className="space-y-2">
                    Per losing trade
                  </p>
                </div>
              </ModernCard>
            </div>

            {/* Performance Chart and P&L Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Performance Overview</CardTitle>
                  <CardDescription className="text-slate-400">Your trading performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <PerformanceChart />
                </CardContent>
              </Card>

              <PnLCalendar />
            </div>

            {/* Advanced Metrics */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Advanced Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-sm text-slate-300">Profit Factor</span>
                    {loading ? (
                      <div className="animate-pulse bg-slate-600 h-4 w-8 rounded"></div>
                    ) : (
                      <span className="font-medium text-white">{stats.profitFactor}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-sm text-slate-300">Max Drawdown</span>
                    {loading ? (
                      <div className="animate-pulse bg-slate-600 h-4 w-12 rounded"></div>
                    ) : (
                      <span className="font-medium text-red-400">${stats.maxDrawdown.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-sm text-slate-300">Sharpe Ratio</span>
                    {loading ? (
                      <div className="animate-pulse bg-slate-600 h-4 w-8 rounded"></div>
                    ) : (
                      <span className="font-medium text-white">{stats.sharpeRatio}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-sm text-slate-300">Total Trades</span>
                    {loading ? (
                      <div className="animate-pulse bg-slate-600 h-4 w-8 rounded"></div>
                    ) : (
                      <span className="font-medium text-white">{stats.totalTrades}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trades" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Trade History</h2>
                <p className="text-slate-400 text-sm mt-1">Click on any trade to view detailed chart and analysis</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search trades..." 
                    className="pl-8 w-64 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400" 
                  />
                </div>
                <Button variant="outline" className="border-slate-700/50 text-slate-300 hover:text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            <TradeHistory />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceChart />
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Trade Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-slate-300">Winning Trades</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {Math.round(stats.totalTrades * stats.winRate / 100)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-slate-300">Losing Trades</span>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        {stats.totalTrades - Math.round(stats.totalTrades * stats.winRate / 100)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Trading Calendar</h2>
            <CalendarView />
          </TabsContent>

          <TabsContent value="economic" className="space-y-6">
            <EconomicCalendar />
          </TabsContent>
        </Tabs>
      </div>

      {showTradeForm && (
        <TradeForm onClose={() => setShowTradeForm(false)} />
      )}

      {/* Onboarding Tour */}
      <OnboardingTour 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* Toast Notifications */}
      <ToastNotifications 
        toasts={toast.toasts}
        onDismiss={toast.dismissToast}
      />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts onAction={handleKeyboardAction} />

      {/* PWA Registration */}
      <PWARegistration 
        onInstall={() => toast.success('App Installed', 'RiskRat.io has been installed successfully!')}
        onUpdate={() => toast.info('App Updated', 'RiskRat.io has been updated to the latest version.')}
      />
    </div>
  )
}
