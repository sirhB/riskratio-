"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronDown, ChevronUp, Menu, X, BarChart3, TrendingUp, 
  Calendar, DollarSign, Globe, Bell, Target, Lightbulb, 
  Users, LineChart, Brain, Link, Smartphone, PieChart, Settings
} from "lucide-react"

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
  { id: "Trading", label: "Trading", color: "from-blue-500 to-purple-600" },
  { id: "Analysis", label: "Analysis", color: "from-green-500 to-emerald-600" },
  { id: "Tools", label: "Tools", color: "from-orange-500 to-red-600" },
  { id: "Community", label: "Community", color: "from-indigo-500 to-blue-600" },
  { id: "Settings", label: "Settings", color: "from-slate-500 to-gray-600" }
]

export function ResponsiveTabs({ activeTab, onTabChange, alertCount = 0 }: ResponsiveTabsProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId)
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }

  const getTabsByCategory = (categoryId: string) => {
    return tabConfig.filter(tab => tab.category === categoryId)
  }

  const getCurrentTabInfo = () => {
    return tabConfig.find(tab => tab.id === activeTab) || tabConfig[0]
  }

  // Desktop Layout
  if (!isMobile) {
    return (
      <div className="grid w-full grid-cols-16 bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
        {tabConfig.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => handleTabClick(tab.id)}
            className={`relative px-3 py-2 text-xs font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-slate-700 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center space-x-1">
              {(() => {
                const IconComponent = tab.icon;
                return <IconComponent className="h-3 w-3" />;
              })()}
              <span className="hidden sm:inline">{tab.label}</span>
            </div>
            {tab.badge && alertCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500 text-white">
                {alertCount}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    )
  }

  // Mobile Layout
  return (
    <div className="space-y-4">
      {/* Mobile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            {(() => {
              const IconComponent = getCurrentTabInfo().icon;
              return <IconComponent className="h-4 w-4 text-white" />;
            })()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{getCurrentTabInfo().label}</h2>
            <p className="text-xs text-slate-400">{getCurrentTabInfo().category}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-400 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
          {categories.map((category) => {
            const categoryTabs = getTabsByCategory(category.id)
            const isExpanded = expandedCategories.includes(category.id)
            
            return (
              <div key={category.id} className="border-b border-slate-700/50 last:border-b-0">
                <Button
                  variant="ghost"
                  onClick={() => toggleCategory(category.id)}
                  className="w-full justify-between px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`} />
                    <span className="font-medium">{category.label}</span>
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {categoryTabs.length}
                    </Badge>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                
                {isExpanded && (
                  <div className="bg-slate-700/20">
                    {categoryTabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant="ghost"
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-full justify-start px-8 py-2 text-left text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'bg-slate-700/50 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {(() => {
                            const IconComponent = tab.icon;
                            return <IconComponent className="h-4 w-4" />;
                          })()}
                          <span>{tab.mobileLabel}</span>
                          {tab.badge && alertCount > 0 && (
                            <Badge className="ml-auto bg-red-500 text-white text-xs">
                              {alertCount}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Actions for Mobile */}
      <div className="grid grid-cols-4 gap-2">
        {tabConfig.slice(0, 4).map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center space-y-1 p-2 h-auto ${
              activeTab === tab.id
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {(() => {
              const IconComponent = tab.icon;
              return <IconComponent className="h-4 w-4" />;
            })()}
            <span className="text-xs">{tab.mobileLabel}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
