"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronDown, ChevronUp, Menu, X, BarChart3, TrendingUp, 
  Calendar, DollarSign, Globe, Bell, Target, Lightbulb, 
  Users, LineChart, Brain, Link, Smartphone, PieChart, Settings, ChevronRight, ChevronLeft
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface ResponsiveTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  alertCount?: number
}

const tabConfig = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    category: "Trading",
    mobileLabel: "Dashboard"
  },
  {
    id: "trades",
    label: "Trades",
    icon: TrendingUp,
    category: "Trading",
    mobileLabel: "Trades"
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    category: "Trading",
    mobileLabel: "Calendar"
  },
  {
    id: "pnl",
    label: "P&L Calendar",
    icon: DollarSign,
    category: "Trading",
    mobileLabel: "P&L"
  },
  {
    id: "economic",
    label: "Economic",
    icon: Globe,
    category: "Analysis",
    mobileLabel: "Economic"
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: Bell,
    category: "Tools",
    mobileLabel: "Alerts",
    badge: true
  },
  {
    id: "risk",
    label: "Risk",
    icon: Target,
    category: "Analysis",
    mobileLabel: "Risk"
  },
  {
    id: "suggestions",
    label: "Suggestions",
    icon: Lightbulb,
    category: "Tools",
    mobileLabel: "AI Tips"
  },
  {
    id: "social",
    label: "Community",
    icon: Users,
    category: "Community",
    mobileLabel: "Community"
  },
  {
    id: "charting",
    label: "Charting",
    icon: LineChart,
    category: "Analysis",
    mobileLabel: "Charts"
  },
  {
    id: "ai",
    label: "AI",
    icon: Brain,
    category: "Analysis",
    mobileLabel: "AI"
  },
  {
    id: "broker",
    label: "Broker",
    icon: Link,
    category: "Tools",
    mobileLabel: "Broker"
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: Smartphone,
    category: "Tools",
    mobileLabel: "Mobile"
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: PieChart,
    category: "Analysis",
    mobileLabel: "Analytics"
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    category: "Settings",
    mobileLabel: "Settings"
  }
]

const categories = [
  { id: "Trading", label: "Trading", color: "from-green-500 to-emerald-600" },
  { id: "Analysis", label: "Analysis", color: "from-green-500 to-emerald-600" },
  { id: "Tools", label: "Tools", color: "from-orange-500 to-red-600" },
  { id: "Community", label: "Community", color: "from-indigo-500 to-blue-600" },
  { id: "Settings", label: "Settings", color: "from-slate-500 to-gray-600" }
]

export function SidebarNav({ activeTab, onTabChange, alertCount = 0 }: ResponsiveTabsProps) {
  const [collapsed, setCollapsed] = useState(false)
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId)
  }
  return (
    <TooltipProvider>
      <nav className={`fixed top-0 left-0 h-full z-[1000] bg-black/90 border-r border-gray-800 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}
        style={{ minHeight: '100vh' }}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-cyan-400" />
            {!collapsed && <span className="text-lg font-bold text-white">RiskRat.io</span>}
          </div>
          <button
            className="text-gray-400 hover:text-cyan-400 focus:outline-none"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        <div className="flex-1 flex flex-col py-4 space-y-2 overflow-y-auto">
          {tabConfig.map((tab) => (
            <Tooltip key={tab.id}>
              <TooltipTrigger asChild>
                <button
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 group ${activeTab === tab.id ? 'bg-cyan-900/60 text-cyan-400' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'} ${collapsed ? 'justify-center' : ''}`}
                  onClick={() => handleTabClick(tab.id)}
                  aria-label={tab.label}
                >
                  {(() => {
                    const IconComponent = tab.icon;
                    return <IconComponent className="h-5 w-5" />;
                  })()}
                  {!collapsed && <span className="ml-3 text-base">{tab.label}</span>}
                  {tab.badge && alertCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{alertCount}</span>
                  )}
                </button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  {tab.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </div>
      </nav>
    </TooltipProvider>
  )
}
