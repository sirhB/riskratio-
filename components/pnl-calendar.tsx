"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, CalendarIcon, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { authenticatedFetch } from '@/lib/api-client'

interface Trade {
  id: string
  symbol: string
  side: 'Long' | 'Short'
  quantity: number
  entry_price: number
  exit_price: number | null
  trade_date: string
  strategy: string | null
  status: 'Open' | 'Closed'
  pnl: number | null
  notes: string | null
}

interface DailyPnL {
  date: string
  pnl: number
  tradeCount: number
  trades: Trade[]
}

interface WeeklyPnL {
  weekStart: string
  weekEnd: string
  pnl: number
  tradeCount: number
}

export function PnLCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [dailyPnL, setDailyPnL] = useState<DailyPnL[]>([])
  const [weeklyPnL, setWeeklyPnL] = useState<WeeklyPnL[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedDayTrades, setSelectedDayTrades] = useState<Trade[]>([])
  const [showTradesModal, setShowTradesModal] = useState(false)

  useEffect(() => {
    const fetchPnLData = async () => {
      try {
        const response = await authenticatedFetch('/api/trades')
        const data = await response.json()
        
        if (response.ok && data.trades) {
          // Group trades by date and calculate daily P&L
          const dailyData: { [key: string]: { pnl: number, count: number, trades: Trade[] } } = {}
          
          data.trades.forEach((trade: Trade) => {
            const date = trade.trade_date
            if (!dailyData[date]) {
              dailyData[date] = { pnl: 0, count: 0, trades: [] }
            }
            if (trade.pnl) {
              dailyData[date].pnl += trade.pnl
            }
            dailyData[date].count += 1
            dailyData[date].trades.push(trade)
          })

          const dailyPnLArray = Object.entries(dailyData).map(([date, data]) => ({
            date,
            pnl: Math.round(data.pnl * 100) / 100,
            tradeCount: data.count,
            trades: data.trades
          }))

          setDailyPnL(dailyPnLArray)

          // Calculate weekly P&L
          const weeklyData = calculateWeeklyPnL(dailyPnLArray, currentDate)
          setWeeklyPnL(weeklyData)
        }
      } catch (error) {
        console.error('Error fetching P&L data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPnLData()
  }, [currentDate])

  const calculateWeeklyPnL = (dailyData: DailyPnL[], currentDate: Date): WeeklyPnL[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const weeks: WeeklyPnL[] = []
    let currentWeekStart = new Date(firstDay)
    
    // Adjust to start of week (Sunday)
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay())
    
    while (currentWeekStart <= lastDay) {
      const weekEnd = new Date(currentWeekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      
      let weekPnL = 0
      let weekTradeCount = 0
      
      dailyData.forEach(day => {
        const dayDate = new Date(day.date)
        if (dayDate >= currentWeekStart && dayDate <= weekEnd) {
          weekPnL += day.pnl
          weekTradeCount += day.tradeCount
        }
      })
      
      weeks.push({
        weekStart: currentWeekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0],
        pnl: Math.round(weekPnL * 100) / 100,
        tradeCount: weekTradeCount
      })
      
      currentWeekStart.setDate(currentWeekStart.getDate() + 7)
    }
    
    return weeks
  }

  const getDayPnL = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return dailyPnL.find(day => day.date === dateString)
  }

  const getWeekPnL = (weekIndex: number) => {
    return weeklyPnL[weekIndex] || null
  }

  const handleDateClick = (date: Date) => {
    const dayData = getDayPnL(date)
    if (dayData && dayData.trades.length > 0) {
      setSelectedDate(date)
      setSelectedDayTrades(dayData.trades)
      setShowTradesModal(true)
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay()) // Start from Sunday

    const weeks = []
    let currentDateForLoop = new Date(startDate)

    // Generate 6 weeks to ensure full calendar
    for (let week = 0; week < 6; week++) {
      const weekDays = []
      
      // Generate 7 days for each week
      for (let day = 0; day < 7; day++) {
        const isCurrentMonth = currentDateForLoop.getMonth() === month
        const dayPnL = getDayPnL(currentDateForLoop)
        const isToday = currentDateForLoop.toDateString() === new Date().toDateString()
        const hasTradesForClick = dayPnL && dayPnL.trades.length > 0
        
        weekDays.push(
          <div
            key={`${week}-${day}`}
            className={`
              h-16 border border-slate-600/30 flex flex-col items-center justify-center text-xs relative
              ${!isCurrentMonth ? 'text-slate-500 bg-slate-800/20' : 'text-white'}
              ${isToday ? 'ring-2 ring-blue-400' : ''}
              ${dayPnL ? (dayPnL.pnl > 0 ? 'bg-green-500/20 border-green-500/30' : dayPnL.pnl < 0 ? 'bg-red-500/20 border-red-500/30' : 'bg-slate-700/30') : 'bg-slate-800/30'}
              ${hasTradesForClick ? 'cursor-pointer hover:bg-opacity-80 hover:scale-105 transition-all duration-200' : ''}
            `}
            onClick={() => handleDateClick(currentDateForLoop)}
            title={hasTradesForClick ? `Click to view ${dayPnL.tradeCount} trade${dayPnL.tradeCount > 1 ? 's' : ''}` : ''}
          >
            <div className="font-medium">{currentDateForLoop.getDate()}</div>
            {dayPnL && (
              <div className={`text-xs font-bold ${dayPnL.pnl > 0 ? 'text-green-400' : dayPnL.pnl < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                ${dayPnL.pnl > 0 ? '+' : ''}${dayPnL.pnl}
              </div>
            )}
            {dayPnL && dayPnL.tradeCount > 0 && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
            )}
            {hasTradesForClick && (
              <div className="absolute bottom-1 right-1">
                <Eye className="h-3 w-3 text-slate-400 opacity-60" />
              </div>
            )}
          </div>
        )
        
        currentDateForLoop.setDate(currentDateForLoop.getDate() + 1)
      }

      // Add weekly summary at the end of each row
      const weekPnL = getWeekPnL(week)
      weekDays.push(
        <div
          key={`week-${week}`}
          className={`
            h-16 border border-slate-600/50 flex flex-col justify-center items-center text-xs font-medium
            ${weekPnL && weekPnL.pnl !== 0 ? (weekPnL.pnl > 0 ? 'bg-green-500/30 border-green-500/50 text-green-300' : 'bg-red-500/30 border-red-500/50 text-red-300') : 'bg-slate-700/30 text-slate-400'}
          `}
        >
          <div className="text-xs font-bold">Week</div>
          {weekPnL && weekPnL.pnl !== 0 ? (
            <>
              <div className="font-bold text-sm">
                ${weekPnL.pnl > 0 ? '+' : ''}${weekPnL.pnl}
              </div>
              <div className="text-xs opacity-75">{weekPnL.tradeCount} trades</div>
            </>
          ) : (
            <div className="text-xs">$0.00</div>
          )}
        </div>
      )

      weeks.push(
        <div key={week} className="grid grid-cols-8 gap-0">
          {weekDays}
        </div>
      )
    }

    return weeks
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Week"]

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-blue-400" />
              P&L Calendar
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="text-slate-400 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-white font-medium min-w-[140px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="text-slate-400 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-slate-400">Loading calendar...</div>
            </div>
          ) : (
            <div className="space-y-0">
              {/* Day headers */}
              <div className="grid grid-cols-8 gap-0 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-slate-400 border-b border-slate-600/30">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="space-y-0">
                {renderCalendar()}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-slate-600/30">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500/30 border border-green-500/50 rounded"></div>
                  <span className="text-xs text-slate-300">Profit Day</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500/30 border border-red-500/50 rounded"></div>
                  <span className="text-xs text-slate-300">Loss Day</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-xs text-slate-300">Has Trades</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-3 w-3 text-slate-400" />
                  <span className="text-xs text-slate-300">Click to View</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trades Modal */}
      <Dialog open={showTradesModal} onOpenChange={setShowTradesModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-blue-400" />
              Trades for {selectedDate ? formatDate(selectedDate) : ''}
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {selectedDayTrades.length} trade{selectedDayTrades.length !== 1 ? 's' : ''}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Daily Summary */}
            <Card className="bg-slate-700/30 border-slate-600">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-slate-400">Total P&L</div>
                    <div className={`text-lg font-bold ${
                      selectedDayTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) > 0 
                        ? 'text-green-400' 
                        : selectedDayTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) < 0 
                        ? 'text-red-400' 
                        : 'text-slate-400'
                    }`}>
                      ${selectedDayTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Winning Trades</div>
                    <div className="text-lg font-bold text-green-400">
                      {selectedDayTrades.filter(trade => (trade.pnl || 0) > 0).length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Losing Trades</div>
                    <div className="text-lg font-bold text-red-400">
                      {selectedDayTrades.filter(trade => (trade.pnl || 0) < 0).length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trades Table */}
            <Card className="bg-slate-700/30 border-slate-600">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-300">Symbol</TableHead>
                      <TableHead className="text-slate-300">Side</TableHead>
                      <TableHead className="text-slate-300">Quantity</TableHead>
                      <TableHead className="text-slate-300">Entry</TableHead>
                      <TableHead className="text-slate-300">Exit</TableHead>
                      <TableHead className="text-slate-300">P&L</TableHead>
                      <TableHead className="text-slate-300">Strategy</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDayTrades.map((trade) => (
                      <TableRow key={trade.id} className="hover:bg-slate-600/30">
                        <TableCell className="font-medium text-white">{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge className={trade.side === "Long" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                            {trade.side}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">{trade.quantity}</TableCell>
                        <TableCell className="text-white">${trade.entry_price.toFixed(4)}</TableCell>
                        <TableCell className="text-white">
                          {trade.exit_price ? `$${trade.exit_price.toFixed(4)}` : "-"}
                        </TableCell>
                        <TableCell>
                          <span className={trade.pnl && trade.pnl > 0 ? "text-green-400 font-medium" : trade.pnl && trade.pnl < 0 ? "text-red-400 font-medium" : "text-slate-400"}>
                            {trade.pnl ? `$${trade.pnl.toFixed(2)}` : "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">
                            {trade.strategy || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={trade.status === "Open" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-slate-500/20 text-slate-300 border-slate-500/30"}
                          >
                            {trade.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
