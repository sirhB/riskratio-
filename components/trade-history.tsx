"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, TrendingUp, TrendingDown, Eye } from 'lucide-react'
import { useEffect, useState } from "react"
import { TradeDetailModal } from "./trade-detail-modal"
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

export function TradeHistory() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await authenticatedFetch('/api/trades')
        const data = await response.json()
        
        if (response.ok && data.trades) {
          setTrades(data.trades)
        } else {
          console.error('Failed to fetch trades:', data.error)
        }
      } catch (error) {
        console.error('Error fetching trades:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrades()
  }, [])

  const handleDeleteTrade = async (tradeId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click
    try {
      const response = await authenticatedFetch(`/api/trades/${tradeId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTrades(trades.filter(trade => trade.id !== tradeId))
      } else {
        const data = await response.json()
        console.error("Failed to delete trade:", data.error)
      }
    } catch (error) {
      console.error("Error deleting trade:", error)
    }
  }

  const handleRowClick = (trade: Trade) => {
    setSelectedTrade(trade)
    setIsModalOpen(true)
  }

  const handleEditClick = (trade: Trade, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click
    setSelectedTrade(trade)
    setIsModalOpen(true)
  }

  const handleViewClick = (trade: Trade, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click
    setSelectedTrade(trade)
    setIsModalOpen(true)
  }

  const handleTradeUpdated = (updatedTrade: Trade) => {
    setTrades(trades.map(trade => 
      trade.id === updatedTrade.id ? updatedTrade : trade
    ))
    setSelectedTrade(updatedTrade) // Update the selected trade to reflect changes
  }

  return (
    <>
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-300">Date</TableHead>
                <TableHead className="text-slate-300">Symbol</TableHead>
                <TableHead className="text-slate-300">Side</TableHead>
                <TableHead className="text-slate-300">Quantity</TableHead>
                <TableHead className="text-slate-300">Entry</TableHead>
                <TableHead className="text-slate-300">Exit</TableHead>
                <TableHead className="text-slate-300">P&L</TableHead>
                <TableHead className="text-slate-300">Strategy</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-slate-400">
                    <div className="animate-pulse">Loading trades...</div>
                  </TableCell>
                </TableRow>
              ) : trades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-slate-400">
                    No trades found. Add your first trade to get started!
                  </TableCell>
                </TableRow>
              ) : (
                trades.map((trade) => (
                  <TableRow 
                    key={trade.id}
                    className="cursor-pointer hover:bg-slate-700/30 transition-colors"
                    onClick={() => handleRowClick(trade)}
                  >
                    <TableCell className="text-white">{new Date(trade.trade_date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium text-white">{trade.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={trade.side === "Long" ? "default" : "secondary"} className={trade.side === "Long" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                        {trade.side === "Long" ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
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
                        variant={trade.status === "Open" ? "default" : "secondary"} 
                        className={trade.status === "Open" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-slate-500/20 text-slate-300 border-slate-500/30"}
                      >
                        {trade.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => handleViewClick(trade, e)}
                          className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => handleEditClick(trade, e)}
                          className="text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10"
                          title="Edit Trade"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => handleDeleteTrade(trade.id, e)}
                          className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                          title="Delete Trade"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TradeDetailModal 
        trade={selectedTrade}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTrade(null)
        }}
        onTradeUpdated={handleTradeUpdated}
      />
    </>
  )
}
