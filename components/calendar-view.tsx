"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"

const tradeDates = [
  new Date(2024, 0, 15), // January 15
  new Date(2024, 0, 14), // January 14
  new Date(2024, 0, 13), // January 13
  new Date(2024, 0, 12), // January 12
  new Date(2024, 0, 11), // January 11
]

const tradesByDate = {
  "2024-01-15": [
    { symbol: "AAPL", pnl: 550, side: "Long" }
  ],
  "2024-01-14": [
    { symbol: "TSLA", pnl: 250, side: "Short" }
  ],
  "2024-01-13": [
    { symbol: "MSFT", pnl: -375, side: "Long" }
  ],
  "2024-01-12": [
    { symbol: "GOOGL", pnl: 125, side: "Long" }
  ],
  "2024-01-11": [
    { symbol: "NVDA", pnl: 0, side: "Long", status: "Open" }
  ]
}

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const selectedDateKey = selectedDate?.toISOString().split('T')[0]
  const selectedTrades = selectedDateKey ? (tradesByDate[selectedDateKey as keyof typeof tradesByDate] || []) : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Trading Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              trading: tradeDates
            }}
            modifiersStyles={{
              trading: { backgroundColor: '#dbeafe', color: '#1d4ed8' }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? selectedDate.toDateString() : "Select a Date"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedTrades.length > 0 ? (
            <div className="space-y-3">
              {selectedTrades.map((trade, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{trade.symbol}</span>
                    <Badge variant={trade.side === "Long" ? "default" : "secondary"}>
                      {trade.side}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    P&L: <span className={trade.pnl > 0 ? "text-green-600" : trade.pnl < 0 ? "text-red-600" : "text-gray-600"}>
                      {trade.pnl !== 0 ? `$${trade.pnl}` : "Open"}
                    </span>
                  </div>
                  {trade.status === "Open" && (
                    <Badge variant="outline" className="mt-1">Open Position</Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No trades on this date</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
