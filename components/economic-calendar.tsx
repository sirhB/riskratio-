"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, TrendingUp, AlertTriangle, Info, RefreshCw, Globe, DollarSign } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EconomicEvent {
  id: string
  time: string
  currency: string
  event: string
  impact: 'High' | 'Medium' | 'Low'
  forecast: string | null
  previous: string | null
  actual: string | null
  description: string
  category: string
}

// Mock data for economic events - in a real app, this would come from an API
const generateMockEvents = (days: number): EconomicEvent[] => {
  const events: EconomicEvent[] = []
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD']
  const impacts: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low']
  
  const eventTypes = [
    { name: 'Non-Farm Payrolls', impact: 'High', category: 'Employment' },
    { name: 'CPI (Consumer Price Index)', impact: 'High', category: 'Inflation' },
    { name: 'Federal Funds Rate', impact: 'High', category: 'Interest Rates' },
    { name: 'GDP Growth Rate', impact: 'High', category: 'Economic Growth' },
    { name: 'Unemployment Rate', impact: 'Medium', category: 'Employment' },
    { name: 'Retail Sales', impact: 'Medium', category: 'Economic Activity' },
    { name: 'Manufacturing PMI', impact: 'Medium', category: 'Manufacturing' },
    { name: 'Services PMI', impact: 'Medium', category: 'Services' },
    { name: 'Trade Balance', impact: 'Medium', category: 'Trade' },
    { name: 'Industrial Production', impact: 'Medium', category: 'Manufacturing' },
    { name: 'Consumer Confidence', impact: 'Low', category: 'Sentiment' },
    { name: 'Building Permits', impact: 'Low', category: 'Housing' },
    { name: 'Existing Home Sales', impact: 'Low', category: 'Housing' },
    { name: 'Initial Jobless Claims', impact: 'Medium', category: 'Employment' },
    { name: 'Producer Price Index', impact: 'Medium', category: 'Inflation' },
  ]

  for (let day = 0; day < days; day++) {
    const date = new Date()
    date.setDate(date.getDate() + day)
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue
    
    // Generate 3-8 events per day
    const eventsPerDay = Math.floor(Math.random() * 6) + 3
    
    for (let i = 0; i < eventsPerDay; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const currency = currencies[Math.floor(Math.random() * currencies.length)]
      const hour = Math.floor(Math.random() * 12) + 8 // 8 AM to 8 PM
      const minute = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, 45
      
      const eventTime = new Date(date)
      eventTime.setHours(hour, minute, 0, 0)
      
      events.push({
        id: `${day}-${i}-${Date.now()}`,
        time: eventTime.toISOString(),
        currency,
        event: `${currency} ${eventType.name}`,
        impact: eventType.impact as 'High' | 'Medium' | 'Low',
        forecast: Math.random() > 0.3 ? `${(Math.random() * 5).toFixed(1)}%` : null,
        previous: Math.random() > 0.2 ? `${(Math.random() * 5).toFixed(1)}%` : null,
        actual: day === 0 && Math.random() > 0.7 ? `${(Math.random() * 5).toFixed(1)}%` : null,
        description: `${eventType.category} indicator for ${currency}. This event measures economic activity and can significantly impact currency movements.`,
        category: eventType.category
      })
    }
  }
  
  return events.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
}

export function EconomicCalendar() {
  const [events, setEvents] = useState<EconomicEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all')
  const [selectedImpact, setSelectedImpact] = useState<string>('all')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockEvents = generateMockEvents(7) // Next 7 days
      setEvents(mockEvents)
      setLastUpdated(new Date())
      setLoading(false)
    }

    fetchEvents()
  }, [])

  const refreshData = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    const mockEvents = generateMockEvents(7)
    setEvents(mockEvents)
    setLastUpdated(new Date())
    setLoading(false)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Low':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'High':
        return <AlertTriangle className="h-3 w-3" />
      case 'Medium':
        return <TrendingUp className="h-3 w-3" />
      case 'Low':
        return <Info className="h-3 w-3" />
      default:
        return <Info className="h-3 w-3" />
    }
  }

  const getCurrencyFlag = (currency: string) => {
    const flags: { [key: string]: string } = {
      'USD': '🇺🇸',
      'EUR': '🇪🇺',
      'GBP': '🇬🇧',
      'JPY': '🇯🇵',
      'AUD': '🇦🇺',
      'CAD': '🇨🇦',
      'CHF': '🇨🇭',
      'NZD': '🇳🇿'
    }
    return flags[currency] || '🌍'
  }

  const filterEvents = (eventList: EconomicEvent[]) => {
    return eventList.filter(event => {
      const currencyMatch = selectedCurrency === 'all' || event.currency === selectedCurrency
      const impactMatch = selectedImpact === 'all' || event.impact === selectedImpact
      return currencyMatch && impactMatch
    })
  }

  const getTodayEvents = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return filterEvents(events.filter(event => {
      const eventDate = new Date(event.time)
      return eventDate >= today && eventDate < tomorrow
    }))
  }

  const getWeekEvents = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    
    return filterEvents(events.filter(event => {
      const eventDate = new Date(event.time)
      return eventDate >= today && eventDate < nextWeek
    }))
  }

  const groupEventsByImpact = (eventList: EconomicEvent[]) => {
    const grouped = {
      High: eventList.filter(e => e.impact === 'High'),
      Medium: eventList.filter(e => e.impact === 'Medium'),
      Low: eventList.filter(e => e.impact === 'Low')
    }
    return grouped
  }

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (timeString: string) => {
    const date = new Date(timeString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const EventCard = ({ event }: { event: EconomicEvent }) => (
    <Card className="bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getCurrencyFlag(event.currency)}</span>
            <Badge className={getImpactColor(event.impact)}>
              {getImpactIcon(event.impact)}
              <span className="ml-1">{event.impact}</span>
            </Badge>
            <Badge variant="outline" className="bg-slate-600/30 text-slate-300 border-slate-500">
              {event.category}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">{formatDate(event.time)}</div>
            <div className="text-sm font-medium text-white flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(event.time)}
            </div>
          </div>
        </div>
        
        <h3 className="font-medium text-white mb-2">{event.event}</h3>
        <p className="text-sm text-slate-400 mb-3">{event.description}</p>
        
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-center">
            <div className="text-slate-400">Previous</div>
            <div className="font-medium text-slate-300">
              {event.previous || 'N/A'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Forecast</div>
            <div className="font-medium text-blue-400">
              {event.forecast || 'N/A'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Actual</div>
            <div className={`font-medium ${event.actual ? 'text-green-400' : 'text-slate-500'}`}>
              {event.actual || 'TBD'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const EventsList = ({ events, title }: { events: EconomicEvent[], title: string }) => {
    const groupedEvents = groupEventsByImpact(events)
    
    return (
      <div className="space-y-6">
        {(['High', 'Medium', 'Low'] as const).map(impact => {
          const impactEvents = groupedEvents[impact]
          if (impactEvents.length === 0) return null
          
          return (
            <div key={impact}>
              <div className="flex items-center space-x-2 mb-4">
                <Badge className={getImpactColor(impact)}>
                  {getImpactIcon(impact)}
                  <span className="ml-1">{impact} Impact</span>
                </Badge>
                <span className="text-slate-400 text-sm">({impactEvents.length} events)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {impactEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )
        })}
        
        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">No Events Found</h3>
            <p className="text-slate-400">
              {selectedCurrency !== 'all' || selectedImpact !== 'all' 
                ? 'Try adjusting your filters to see more events.'
                : 'No economic events scheduled for this period.'
              }
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Economic Calendar</h2>
            <p className="text-slate-400 text-sm">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <Button
          onClick={refreshData}
          disabled={loading}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-slate-400" />
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">All Currencies</SelectItem>
                  <SelectItem value="USD" className="text-white hover:bg-slate-700">🇺🇸 USD</SelectItem>
                  <SelectItem value="EUR" className="text-white hover:bg-slate-700">🇪🇺 EUR</SelectItem>
                  <SelectItem value="GBP" className="text-white hover:bg-slate-700">🇬🇧 GBP</SelectItem>
                  <SelectItem value="JPY" className="text-white hover:bg-slate-700">🇯🇵 JPY</SelectItem>
                  <SelectItem value="AUD" className="text-white hover:bg-slate-700">🇦🇺 AUD</SelectItem>
                  <SelectItem value="CAD" className="text-white hover:bg-slate-700">🇨🇦 CAD</SelectItem>
                  <SelectItem value="CHF" className="text-white hover:bg-slate-700">🇨🇭 CHF</SelectItem>
                  <SelectItem value="NZD" className="text-white hover:bg-slate-700">🇳🇿 NZD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-slate-400" />
              <Select value={selectedImpact} onValueChange={setSelectedImpact}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">All Impact</SelectItem>
                  <SelectItem value="High" className="text-white hover:bg-slate-700">High Impact</SelectItem>
                  <SelectItem value="Medium" className="text-white hover:bg-slate-700">Medium Impact</SelectItem>
                  <SelectItem value="Low" className="text-white hover:bg-slate-700">Low Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1" />
            
            <div className="text-sm text-slate-400">
              Showing {filterEvents(events).length} of {events.length} events
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Tabs */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="today" className="data-[state=active]:bg-slate-700">
            <Calendar className="h-4 w-4 mr-2" />
            Today ({getTodayEvents().length})
          </TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-slate-700">
            <Clock className="h-4 w-4 mr-2" />
            This Week ({getWeekEvents().length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="ml-3 text-slate-400">Loading today's events...</span>
            </div>
          ) : (
            <EventsList events={getTodayEvents()} title="Today's Events" />
          )}
        </TabsContent>

        <TabsContent value="week" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="ml-3 text-slate-400">Loading this week's events...</span>
            </div>
          ) : (
            <EventsList events={getWeekEvents()} title="This Week's Events" />
          )}
        </TabsContent>
      </Tabs>

      {/* Impact Legend */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-sm">Impact Level Guide</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                <AlertTriangle className="h-3 w-3 mr-1" />
                High
              </Badge>
              <span className="text-slate-300">Major market impact expected</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                <TrendingUp className="h-3 w-3 mr-1" />
                Medium
              </Badge>
              <span className="text-slate-300">Moderate market impact possible</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Info className="h-3 w-3 mr-1" />
                Low
              </Badge>
              <span className="text-slate-300">Minimal market impact expected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
