"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Download, RefreshCw, CheckCircle, XCircle, Smartphone, 
  Wifi, WifiOff, Bell, Settings, Info
} from "lucide-react"

interface PWARegistrationProps {
  onInstall?: () => void
  onUpdate?: () => void
}

export function PWARegistration({ onInstall, onUpdate }: PWARegistrationProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    // Check if PWA is already installed
    const checkInstallation = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      onInstall?.()
    }

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Listen for service worker updates
    const handleServiceWorkerUpdate = () => {
      setUpdateAvailable(true)
    }

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true)
                }
              })
            }
          })

          // Listen for controller change (update applied)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            setUpdateAvailable(false)
            onUpdate?.()
          })

        } catch (error) {
          console.error('Service worker registration failed:', error)
        }
      }
    }

    checkInstallation()
    registerServiceWorker()

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [onInstall, onUpdate])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        }
      })
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        console.log('Notification permission granted')
      }
    }
  }

  if (isInstalled && !updateAvailable && !showInstallPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 space-y-2">
      {/* Offline Indicator */}
      {!isOnline && (
        <Card className="w-80 bg-yellow-500/20 border-yellow-500/30">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <WifiOff className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-yellow-300">You're offline</span>
              <Badge variant="outline" className="text-xs border-yellow-500/50 text-yellow-300">
                Offline Mode
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Update Available */}
      {updateAvailable && (
        <Card className="w-80 bg-blue-500/20 border-blue-500/30">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 text-blue-400" />
              <CardTitle className="text-sm text-blue-300">Update Available</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-xs text-blue-200 mb-3">
              A new version of RiskRat.io is available. Update to get the latest features.
            </CardDescription>
            <Button
              size="sm"
              onClick={handleUpdate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Update Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Install Prompt */}
      {showInstallPrompt && !isInstalled && (
        <Card className="w-80 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Download className="h-4 w-4 text-purple-400" />
              <CardTitle className="text-sm text-purple-300">Install RiskRat.io</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-xs text-purple-200 mb-3">
              Install RiskRat.io as a mobile app for a better trading experience with offline access.
            </CardDescription>
            <div className="space-y-2">
              <Button
                size="sm"
                onClick={handleInstall}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Download className="h-3 w-3 mr-2" />
                Install App
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInstallPrompt(false)}
                className="w-full border-purple-500/50 text-purple-300 hover:text-purple-200"
              >
                Maybe Later
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Installed Success */}
      {isInstalled && (
        <Card className="w-80 bg-green-500/20 border-green-500/30">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-300">App Installed</span>
              <Badge variant="outline" className="text-xs border-green-500/50 text-green-300">
                PWA
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// PWA Utilities
export const pwaUtils = {
  // Check if running as PWA
  isPWA: () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true
  },

  // Check if service worker is supported
  isServiceWorkerSupported: () => {
    return 'serviceWorker' in navigator
  },

  // Check if notifications are supported
  isNotificationSupported: () => {
    return 'Notification' in window
  },

  // Request notification permission
  requestNotificationPermission: async () => {
    if ('Notification' in window) {
      return await Notification.requestPermission()
    }
    return 'denied'
  },

  // Send notification
  sendNotification: (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options)
    }
  },

  // Check online status
  isOnline: () => {
    return navigator.onLine
  },

  // Get app version
  getAppVersion: () => {
    return '1.0.0'
  }
}
