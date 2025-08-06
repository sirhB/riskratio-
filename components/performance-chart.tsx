"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"
import { authenticatedFetch } from '@/lib/api-client'

export function PerformanceChart() {
  const [chartData, setChartData] = useState<Array<{date: string, pnl: number}>>([])

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await authenticatedFetch('/api/trades')
        const data = await response.json()
        
        if (response.ok && data.trades) {
          // Process trades into cumulative P&L data
          const closedTrades = data.trades
            .filter((trade: any) => trade.status === 'Closed' && trade.pnl !== null)
            .sort((a: any, b: any) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())
          
          let cumulativePnL = 0
          const processedData = closedTrades.map((trade: any) => {
            cumulativePnL += trade.pnl
            return {
              date: new Date(trade.trade_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              pnl: Math.round(cumulativePnL * 100) / 100
            }
          })
          
          setChartData(processedData)
        }
      } catch (error) {
        console.error('Error fetching chart data:', error)
      }
    }

    fetchChartData()
  }, [])

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <Tooltip 
            formatter={(value) => [`$${value}`, "P&L"]}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151', 
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="pnl" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
