"use client"

import { ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BreadcrumbNavProps {
  currentTab: string
  onNavigate: (tab: string) => void
}

const tabLabels: Record<string, string> = {
  dashboard: "Dashboard",
  trades: "Trade History",
  calendar: "Trading Calendar",
  pnl: "P&L Calendar",
  economic: "Economic Calendar",
  alerts: "Price Alerts",
  risk: "Risk Management",
  suggestions: "Trade Suggestions",
  social: "Community",
  charting: "Advanced Charting",
  ai: "AI Analytics",
  broker: "Broker Integrations",
  mobile: "Mobile App",
  analytics: "Performance Analytics",
  settings: "Settings"
}

const tabCategories: Record<string, string> = {
  dashboard: "Trading",
  trades: "Trading",
  calendar: "Trading",
  pnl: "Trading",
  economic: "Analysis",
  alerts: "Tools",
  risk: "Analysis",
  suggestions: "Tools",
  social: "Community",
  charting: "Analysis",
  ai: "Analysis",
  broker: "Tools",
  mobile: "Tools",
  analytics: "Analysis",
  settings: "Settings"
}

export function BreadcrumbNav({ currentTab, onNavigate }: BreadcrumbNavProps) {
  const currentLabel = tabLabels[currentTab] || currentTab
  const currentCategory = tabCategories[currentTab] || "Other"

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate("dashboard")}
        className="p-1 h-auto text-slate-400 hover:text-white"
      >
        <Home className="h-4 w-4" />
      </Button>
      <ChevronRight className="h-4 w-4" />
      <span className="text-slate-500">{currentCategory}</span>
      <ChevronRight className="h-4 w-4" />
      <span className="text-white font-medium">{currentLabel}</span>
    </nav>
  )
}
