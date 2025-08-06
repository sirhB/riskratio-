"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, DollarSign, Bell, Shield, Palette, Globe, Save, AlertCircle } from 'lucide-react'
import { authenticatedFetch } from '@/lib/api-client'

interface UserSettings {
  id: string
  user_id: string
  default_leverage: number
  account_currency: string
  account_balance: number
  risk_per_trade: number
  timezone: string
  date_format: string
  theme: string
  email_notifications: boolean
  trade_alerts: boolean
  performance_reports: boolean
  data_sharing: boolean
  analytics_tracking: boolean
  created_at: string
  updated_at: string
}

export function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setError(null)
        const response = await authenticatedFetch('/api/settings')
        const data = await response.json()
        
        if (response.ok && data.settings) {
          setSettings(data.settings)
        } else {
          console.error('Failed to fetch settings:', data.error)
          setError('Failed to load settings. Please try again.')
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        setError('Failed to load settings. Please check your connection.')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value })
      setHasChanges(true)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    setError(null)
    
    try {
      const response = await authenticatedFetch('/api/settings', {
        method: 'PUT',
        body: JSON.stringify({
          defaultLeverage: settings.default_leverage,
          accountCurrency: settings.account_currency,
          accountBalance: settings.account_balance,
          riskPerTrade: settings.risk_per_trade,
          timezone: settings.timezone,
          dateFormat: settings.date_format,
          theme: settings.theme,
          emailNotifications: settings.email_notifications,
          tradeAlerts: settings.trade_alerts,
          performanceReports: settings.performance_reports,
          dataSharing: settings.data_sharing,
          analyticsTracking: settings.analytics_tracking
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSettings(data.settings)
        setHasChanges(false)
        // Show success message (you could add a toast here)
        console.log('Settings saved successfully')
      } else {
        console.error("Failed to save settings:", data.error)
        setError('Failed to save settings. Please try again.')
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      setError('Failed to save settings. Please check your connection.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading settings...</div>
      </div>
    )
  }

  if (error && !settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Use default settings if none exist
  const currentSettings = settings || {
    id: '',
    user_id: '',
    default_leverage: 1.00,
    account_currency: 'USD',
    account_balance: 10000.00,
    risk_per_trade: 2.00,
    timezone: 'UTC',
    date_format: 'MM/DD/YYYY',
    theme: 'dark',
    email_notifications: true,
    trade_alerts: true,
    performance_reports: true,
    data_sharing: false,
    analytics_tracking: true,
    created_at: '',
    updated_at: ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-slate-400 text-sm mt-1">Customize your trading experience</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
            <Button 
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <Tabs defaultValue="trading" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="trading" className="data-[state=active]:bg-slate-700">
              <DollarSign className="h-4 w-4 mr-2" />
              Trading
            </TabsTrigger>
            <TabsTrigger value="display" className="data-[state=active]:bg-slate-700">
              <Palette className="h-4 w-4 mr-2" />
              Display
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-slate-700">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="regional" className="data-[state=active]:bg-slate-700">
              <Globe className="h-4 w-4 mr-2" />
              Regional
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trading" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-400" />
                  Trading Configuration
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure your default trading parameters and risk management settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="defaultLeverage" className="text-slate-300">Default Leverage</Label>
                    <Input
                      id="defaultLeverage"
                      type="number"
                      step="0.01"
                      min="1"
                      max="500"
                      value={currentSettings.default_leverage}
                      onChange={(e) => handleSettingChange('default_leverage', parseFloat(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <p className="text-xs text-slate-400">
                      Default leverage for new trades (1x = no leverage)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountBalance" className="text-slate-300">Account Balance</Label>
                    <Input
                      id="accountBalance"
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentSettings.account_balance}
                      onChange={(e) => handleSettingChange('account_balance', parseFloat(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <p className="text-xs text-slate-400">
                      Your current account balance for risk calculations
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountCurrency" className="text-slate-300">Account Currency</Label>
                    <Select 
                      value={currentSettings.account_currency} 
                      onValueChange={(value) => handleSettingChange('account_currency', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="USD" className="text-white hover:bg-slate-700">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR" className="text-white hover:bg-slate-700">EUR - Euro</SelectItem>
                        <SelectItem value="GBP" className="text-white hover:bg-slate-700">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY" className="text-white hover:bg-slate-700">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="AUD" className="text-white hover:bg-slate-700">AUD - Australian Dollar</SelectItem>
                        <SelectItem value="CAD" className="text-white hover:bg-slate-700">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="CHF" className="text-white hover:bg-slate-700">CHF - Swiss Franc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskPerTrade" className="text-slate-300">Risk Per Trade (%)</Label>
                    <Input
                      id="riskPerTrade"
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10"
                      value={currentSettings.risk_per_trade}
                      onChange={(e) => handleSettingChange('risk_per_trade', parseFloat(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <p className="text-xs text-slate-400">
                      Maximum percentage of account to risk per trade
                    </p>
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Leverage Impact</h4>
                  <p className="text-slate-300 text-sm mb-2">
                    With {currentSettings.default_leverage}x leverage, your P&L will be multiplied by {currentSettings.default_leverage}.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Example: 1 point move</span>
                      <div className="text-green-400 font-medium">
                        Profit: ${(50 * currentSettings.default_leverage).toFixed(2)} (ES contract)
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Risk per ${currentSettings.account_balance.toLocaleString()} account</span>
                      <div className="text-red-400 font-medium">
                        Max Risk: ${((currentSettings.account_balance * currentSettings.risk_per_trade) / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs remain the same but use currentSettings instead of settings */}
          <TabsContent value="display" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-purple-400" />
                  Display Preferences
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Customize how data is displayed throughout the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme" className="text-slate-300">Theme</Label>
                    <Select 
                      value={currentSettings.theme} 
                      onValueChange={(value) => handleSettingChange('theme', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="dark" className="text-white hover:bg-slate-700">Dark</SelectItem>
                        <SelectItem value="light" className="text-white hover:bg-slate-700">Light</SelectItem>
                        <SelectItem value="system" className="text-white hover:bg-slate-700">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat" className="text-slate-300">Date Format</Label>
                    <Select 
                      value={currentSettings.date_format} 
                      onValueChange={(value) => handleSettingChange('date_format', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="MM/DD/YYYY" className="text-white hover:bg-slate-700">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY" className="text-white hover:bg-slate-700">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD" className="text-white hover:bg-slate-700">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-blue-400" />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Control when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-300">Email Notifications</Label>
                      <p className="text-sm text-slate-400">Receive general notifications via email</p>
                    </div>
                    <Switch
                      checked={currentSettings.email_notifications}
                      onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-300">Trade Alerts</Label>
                      <p className="text-sm text-slate-400">Get notified when trades are executed or closed</p>
                    </div>
                    <Switch
                      checked={currentSettings.trade_alerts}
                      onCheckedChange={(checked) => handleSettingChange('trade_alerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-300">Performance Reports</Label>
                      <p className="text-sm text-slate-400">Weekly and monthly performance summaries</p>
                    </div>
                    <Switch
                      checked={currentSettings.performance_reports}
                      onCheckedChange={(checked) => handleSettingChange('performance_reports', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-400" />
                  Privacy & Security
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Control your data privacy and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-300">Data Sharing</Label>
                      <p className="text-sm text-slate-400">Allow anonymized data sharing for platform improvements</p>
                    </div>
                    <Switch
                      checked={currentSettings.data_sharing}
                      onCheckedChange={(checked) => handleSettingChange('data_sharing', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-300">Analytics Tracking</Label>
                      <p className="text-sm text-slate-400">Help us improve the platform with usage analytics</p>
                    </div>
                    <Switch
                      checked={currentSettings.analytics_tracking}
                      onCheckedChange={(checked) => handleSettingChange('analytics_tracking', checked)}
                    />
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Data Security</h4>
                  <p className="text-slate-300 text-sm">
                    Your trading data is encrypted and stored securely. We never share your personal trading information 
                    with third parties without your explicit consent.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-green-400" />
                  Regional Settings
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure timezone and regional preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-slate-300">Timezone</Label>
                  <Select 
                    value={currentSettings.timezone} 
                    onValueChange={(value) => handleSettingChange('timezone', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 max-h-48">
                      <SelectItem value="UTC" className="text-white hover:bg-slate-700">UTC</SelectItem>
                      <SelectItem value="America/New_York" className="text-white hover:bg-slate-700">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago" className="text-white hover:bg-slate-700">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver" className="text-white hover:bg-slate-700">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles" className="text-white hover:bg-slate-700">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London" className="text-white hover:bg-slate-700">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris" className="text-white hover:bg-slate-700">Paris (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo" className="text-white hover:bg-slate-700">Tokyo (JST)</SelectItem>
                      <SelectItem value="Asia/Shanghai" className="text-white hover:bg-slate-700">Shanghai (CST)</SelectItem>
                      <SelectItem value="Australia/Sydney" className="text-white hover:bg-slate-700">Sydney (AEST)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-400">
                    All times in the application will be displayed in this timezone
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
