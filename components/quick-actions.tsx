"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ModernCard, 
  ModernButton, 
  ModernBadge, 
  GradientText, 
  AnimatedIcon,
  GlassContainer
} from "./modern-design-system"
import { 
  Plus, TrendingUp, Bell, BarChart3, Target, AlertTriangle, 
  DollarSign, Clock, Users, Zap, Activity, Calendar, ArrowRight
} from "lucide-react"
import { authenticatedFetch } from "@/lib/api-client"

interface QuickActionsProps {
  onAddTrade: () => void
  onNavigate: (tab: string) => void
  stats: any
}

export function QuickActions({ onAddTrade, onNavigate, stats }: QuickActionsProps) {
  const [alertCount, setAlertCount] = useState(0)
  const [recentTrades, setRecentTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuickData = async () => {
      try {
        // Fetch recent trades
        const tradesResponse = await authenticatedFetch('/api/trades?limit=3')
        const tradesData = await tradesResponse.json()
        if (tradesResponse.ok) {
          setRecentTrades(tradesData.trades || [])
        }

        // Mock alert count (in real app, fetch from alerts API)
        setAlertCount(Math.floor(Math.random() * 5))
      } catch (error) {
        console.error('Error fetching quick data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuickData()
  }, [])

  const quickActions = [
    {
      title: "Add New Trade",
      description: "Record a new trade",
      icon: Plus,
      action: onAddTrade,
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-gradient-to-r from-blue-500/20 to-purple-600/20"
    },
    {
      title: "Today's P&L",
      description: `$${stats.totalPnL?.toLocaleString() || 0}`,
      icon: DollarSign,
      action: () => onNavigate("pnl"),
      color: stats.totalPnL >= 0 ? "from-green-500 to-emerald-600" : "from-red-500 to-pink-600",
      bgColor: stats.totalPnL >= 0 ? "bg-gradient-to-r from-green-500/20 to-emerald-600/20" : "bg-gradient-to-r from-red-500/20 to-pink-600/20"
    },
    {
      title: "Price Alerts",
      description: `${alertCount} active alerts`,
      icon: Bell,
      action: () => onNavigate("alerts"),
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-r from-orange-500/20 to-red-600/20",
      badge: alertCount > 0 ? alertCount : undefined
    },
    {
      title: "Risk Management",
      description: "Check portfolio risk",
      icon: Target,
      action: () => onNavigate("risk"),
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-gradient-to-r from-yellow-500/20 to-orange-600/20"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <ModernCard 
            key={index}
            variant="glass"
            className="p-6 cursor-pointer group hover:scale-105 transition-transform duration-300"
            onClick={action.action}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <AnimatedIcon animation={index % 2 === 0 ? "pulse" : "float"} delay={index * 100}>
                    <action.icon className={`h-6 w-6 bg-gradient-to-r ${action.color} bg-clip-text text-transparent`} />
                  </AnimatedIcon>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
              {action.badge && (
                <ModernBadge variant="error" className="animate-pulse">
                  {action.badge}
                </ModernBadge>
              )}
            </div>
          </ModernCard>
        ))}
      </div>

      {/* Recent Trades Preview */}
      <ModernCard variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <GradientText className="text-xl font-bold">Recent Trades</GradientText>
            <p className="text-sm text-muted-foreground mt-1">Your latest trading activity</p>
          </div>
          <ModernButton 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("trades")}
          >
            <AnimatedIcon animation="float" className="mr-2">
              <ArrowRight className="h-4 w-4" />
            </AnimatedIcon>
            View All
          </ModernButton>
        </div>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center space-x-3">
                  <div className="bg-slate-700 h-8 w-8 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-slate-700 h-4 w-24 rounded"></div>
                    <div className="bg-slate-700 h-3 w-32 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentTrades.length > 0 ? (
            <div className="space-y-3">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded ${trade.pnl >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {trade.pnl >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-400 transform rotate-180" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">{trade.symbol}</div>
                      <div className="text-sm text-slate-400">{trade.side} • {trade.quantity} contracts</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${trade.pnl?.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-400">
                      {new Date(trade.entry_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <BarChart3 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No trades yet</p>
              <Button 
                onClick={onAddTrade}
                className="mt-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Trade
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
