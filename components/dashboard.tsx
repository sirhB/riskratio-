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
import { SidebarNav } from "./responsive-tabs"

interface DashboardProps {
  initialTab?: string
}

export function Dashboard({ initialTab }: DashboardProps) {
  const [showTradeForm, setShowTradeForm] = useState(false)
  const [activeTab, setActiveTab] = useState(initialTab || "dashboard")
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

  // Note: keeping navigation state internal to preserve the dashboard shell

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

  const renderContent = () => {
    switch (activeTab) {
      case "settings":
        return <SettingsPage />
      case "alerts":
        return <PriceAlerts />
      case "risk":
        return <RiskManagement />
      case "analytics":
        return <PerformanceAnalytics />
      case "suggestions":
        return <TradeSuggestions />
      case "social":
        return <SocialFeatures />
      case "charting":
        return <AdvancedCharting />
      case "ai":
        return <AdvancedAI />
      case "broker":
        return <BrokerIntegrations />
      case "mobile":
        return <MobileApp />
      case "trades":
        return <TradeHistory />
      case "calendar":
        return <CalendarView />
      case "pnl":
        return <PnLCalendar />
      case "economic":
        return <EconomicCalendar />
      default:
        return (
          <>
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
          </>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Sidebar Navigation */}
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} alertCount={alertCount} />
      {/* Main Content */}
      <div className="flex-1 ml-56 transition-all duration-300">
      <div className="container mx-auto px-4 py-6 relative">
          <BreadcrumbNav currentTab={activeTab} onNavigate={setActiveTab} />
          <div className="space-y-6">
            {renderContent()}
          </div>
      </div>
        {/* Main Content */}
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

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setShowTradeForm(true)}
        position="bottom-right"
        className="bg-gradient-to-r from-primary to-accent shadow-2xl"
      >
        <AnimatedIcon animation="bounce">
          <Plus className="h-6 w-6" />
        </AnimatedIcon>
      </FloatingActionButton>

      {/* PWA Registration */}
      <PWARegistration 
        onInstall={() => toast.success('App Installed', 'RiskRat.io has been installed successfully!')}
        onUpdate={() => toast.info('App Updated', 'RiskRat.io has been updated to the latest version.')}
      />
      </div>
    </div>
  )
}
