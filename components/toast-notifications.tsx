"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, XCircle, AlertTriangle, Info, X, 
  TrendingUp, TrendingDown, Bell, DollarSign
} from "lucide-react"

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  data?: any
}

interface ToastNotificationsProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
}

const toastColors = {
  success: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    icon: 'text-green-400',
    title: 'text-green-300',
    message: 'text-green-200'
  },
  error: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    title: 'text-red-300',
    message: 'text-red-200'
  },
  warning: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    icon: 'text-yellow-400',
    title: 'text-yellow-300',
    message: 'text-yellow-200'
  },
  info: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    title: 'text-blue-300',
    message: 'text-blue-200'
  }
}

export function ToastNotifications({ toasts, onDismiss }: ToastNotificationsProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [progress, setProgress] = useState(100)
  const [isVisible, setIsVisible] = useState(true)
  const Icon = toastIcons[toast.type]
  const colors = toastColors[toast.type]
  const duration = toast.duration || 5000

  useEffect(() => {
    if (duration === Infinity) return

    const startTime = Date.now()
    const endTime = startTime + duration

    const updateProgress = () => {
      const now = Date.now()
      const remaining = Math.max(0, endTime - now)
      const newProgress = (remaining / duration) * 100
      
      setProgress(newProgress)
      
      if (remaining > 0) {
        requestAnimationFrame(updateProgress)
      } else {
        handleDismiss()
      }
    }

    requestAnimationFrame(updateProgress)
  }, [duration])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss(toast.id), 300)
  }

  const handleAction = () => {
    toast.action?.onClick()
    handleDismiss()
  }

  if (!isVisible) return null

  return (
    <Card 
      className={`${colors.bg} ${colors.border} border backdrop-blur-xl transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-1 rounded ${colors.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h4 className={`font-medium ${colors.title}`}>
                {toast.title}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="p-1 h-auto text-slate-400 hover:text-white ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className={`text-sm mt-1 ${colors.message}`}>
              {toast.message}
            </p>
            
            {toast.action && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAction}
                className="mt-2 border-slate-600 text-slate-300 hover:text-white"
              >
                {toast.action.label}
              </Button>
            )}
          </div>
        </div>
        
        {duration !== Infinity && (
          <Progress 
            value={progress} 
            className="mt-3 h-1" 
          />
        )}
      </CardContent>
    </Card>
  )
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    setToasts(prev => [...prev, newToast])
    return id
  }

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (title: string, message: string, options?: Partial<Toast>) => {
    return addToast({ type: 'success', title, message, ...options })
  }

  const error = (title: string, message: string, options?: Partial<Toast>) => {
    return addToast({ type: 'error', title, message, ...options })
  }

  const warning = (title: string, message: string, options?: Partial<Toast>) => {
    return addToast({ type: 'warning', title, message, ...options })
  }

  const info = (title: string, message: string, options?: Partial<Toast>) => {
    return addToast({ type: 'info', title, message, ...options })
  }

  return {
    toasts,
    addToast,
    dismissToast,
    success,
    error,
    warning,
    info
  }
}

// Predefined toast templates
export const toastTemplates = {
  tradeAdded: (symbol: string, pnl: number) => ({
    type: 'success' as const,
    title: 'Trade Added',
    message: `${symbol} trade recorded with P&L: $${pnl.toLocaleString()}`,
    duration: 4000
  }),
  
  tradeUpdated: (symbol: string) => ({
    type: 'success' as const,
    title: 'Trade Updated',
    message: `${symbol} trade has been updated successfully`,
    duration: 3000
  }),
  
  alertSet: (symbol: string, price: number) => ({
    type: 'info' as const,
    title: 'Alert Set',
    message: `Price alert set for ${symbol} at $${price}`,
    duration: 3000
  }),
  
  alertTriggered: (symbol: string, price: number) => ({
    type: 'warning' as const,
    title: 'Price Alert',
    message: `${symbol} has reached $${price}`,
    duration: 6000,
    action: {
      label: 'View Chart',
      onClick: () => console.log('Navigate to chart')
    }
  }),
  
  dataSync: (status: 'success' | 'error') => ({
    type: status as 'success' | 'error',
    title: status === 'success' ? 'Data Synced' : 'Sync Failed',
    message: status === 'success' 
      ? 'Your trading data has been synchronized'
      : 'Failed to sync trading data. Please try again.',
    duration: status === 'success' ? 3000 : 5000
  }),
  
  aiAnalysis: (symbol: string) => ({
    type: 'info' as const,
    title: 'AI Analysis Complete',
    message: `Analysis completed for ${symbol}. Check the AI tab for insights.`,
    duration: 4000,
    action: {
      label: 'View Analysis',
      onClick: () => console.log('Navigate to AI tab')
    }
  })
}
