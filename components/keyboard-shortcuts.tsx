"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Keyboard, X, Plus, Search, BarChart3, Target, Bell, 
  Users, Brain, Settings, ArrowUp, ArrowDown, Enter, Escape
} from "lucide-react"

interface KeyboardShortcutsProps {
  onAction: (action: string) => void
}

const shortcuts = [
  {
    category: "Navigation",
    shortcuts: [
      { key: "G + D", description: "Go to Dashboard", action: "dashboard" },
      { key: "G + T", description: "Go to Trades", action: "trades" },
      { key: "G + A", description: "Go to Analytics", action: "analytics" },
      { key: "G + C", description: "Go to Charting", action: "charting" },
      { key: "G + S", description: "Go to Settings", action: "settings" }
    ]
  },
  {
    category: "Actions",
    shortcuts: [
      { key: "N", description: "New Trade", action: "new-trade" },
      { key: "S", description: "Search", action: "search" },
      { key: "R", description: "Refresh Data", action: "refresh" },
      { key: "H", description: "Help / Tour", action: "help" }
    ]
  },
  {
    category: "Trading",
    shortcuts: [
      { key: "Alt + L", description: "Long Position", action: "long" },
      { key: "Alt + S", description: "Short Position", action: "short" },
      { key: "Alt + C", description: "Close Position", action: "close" },
      { key: "Alt + A", description: "Add Alert", action: "alert" }
    ]
  },
  {
    category: "Analysis",
    shortcuts: [
      { key: "Ctrl + 1", description: "Performance Chart", action: "performance" },
      { key: "Ctrl + 2", description: "Risk Analysis", action: "risk" },
      { key: "Ctrl + 3", description: "AI Insights", action: "ai" },
      { key: "Ctrl + 4", description: "Community", action: "community" }
    ]
  }
]

export function KeyboardShortcuts({ onAction }: KeyboardShortcutsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeKeys, setActiveKeys] = useState<string[]>([])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      
      // Prevent default for our shortcuts
      if (shortcuts.some(cat => 
        cat.shortcuts.some(shortcut => 
          shortcut.key.toLowerCase().includes(key)
        )
      )) {
        event.preventDefault()
      }

      // Track active keys for visual feedback
      setActiveKeys(prev => [...new Set([...prev, key])])

      // Handle shortcuts
      handleShortcut(event)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      setActiveKeys(prev => prev.filter(k => k !== key))
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const handleShortcut = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase()
    const ctrl = event.ctrlKey
    const alt = event.altKey
    const shift = event.shiftKey

    // Navigation shortcuts
    if (key === 'g') {
      // Wait for second key
      setTimeout(() => {
        const secondKey = event.key.toLowerCase()
        switch (secondKey) {
          case 'd': onAction('dashboard'); break
          case 't': onAction('trades'); break
          case 'a': onAction('analytics'); break
          case 'c': onAction('charting'); break
          case 's': onAction('settings'); break
        }
      }, 100)
    }

    // Single key shortcuts
    switch (key) {
      case 'n': onAction('new-trade'); break
      case 's': onAction('search'); break
      case 'r': onAction('refresh'); break
      case 'h': onAction('help'); break
    }

    // Alt key shortcuts
    if (alt) {
      switch (key) {
        case 'l': onAction('long'); break
        case 's': onAction('short'); break
        case 'c': onAction('close'); break
        case 'a': onAction('alert'); break
      }
    }

    // Ctrl key shortcuts
    if (ctrl) {
      switch (key) {
        case '1': onAction('performance'); break
        case '2': onAction('risk'); break
        case '3': onAction('ai'); break
        case '4': onAction('community'); break
      }
    }
  }

  const renderKey = (keyString: string) => {
    const keys = keyString.split(' + ')
    return (
      <div className="flex items-center space-x-1">
        {keys.map((key, index) => (
          <div key={index} className="flex items-center">
            <Badge 
              variant="outline" 
              className={`text-xs font-mono ${
                activeKeys.includes(key.toLowerCase()) 
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' 
                  : 'border-slate-600 text-slate-400'
              }`}
            >
              {key === 'Ctrl' && <span className="text-xs">⌘</span>}
              {key === 'Alt' && <span className="text-xs">⌥</span>}
              {key === 'Shift' && <span className="text-xs">⇧</span>}
              {key === 'Enter' && <Enter className="h-3 w-3" />}
              {key === 'Escape' && <Escape className="h-3 w-3" />}
              {key === 'ArrowUp' && <ArrowUp className="h-3 w-3" />}
              {key === 'ArrowDown' && <ArrowDown className="h-3 w-3" />}
              {!['Ctrl', 'Alt', 'Shift', 'Enter', 'Escape', 'ArrowUp', 'ArrowDown'].includes(key) && key}
            </Badge>
            {index < keys.length - 1 && <span className="text-slate-500 mx-1">+</span>}
          </div>
        ))}
      </div>
    )
  }

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-2 bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white z-40"
        title="Keyboard Shortcuts"
      >
        <Keyboard className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-slate-800/90 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg">
                <Keyboard className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-white">Keyboard Shortcuts</CardTitle>
                <CardDescription className="text-slate-400">
                  Power user shortcuts for faster navigation
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shortcuts.map((category) => (
              <div key={category.category} className="space-y-3">
                <h3 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-2">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.key}
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-slate-300 text-sm">
                          {shortcut.description}
                        </div>
                      </div>
                      {renderKey(shortcut.key)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="p-1 rounded bg-blue-500/20">
                <Keyboard className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">Pro Tips</h4>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Use 'G' + letter for quick navigation between sections</li>
                  <li>• Press 'N' to quickly add a new trade</li>
                  <li>• Use Alt + L/S for quick long/short position entry</li>
                  <li>• Ctrl + number keys for analysis tools</li>
                  <li>• Press 'H' anytime to see this help</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
