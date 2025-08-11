"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, X, Filter, TrendingUp, TrendingDown, Calendar, 
  DollarSign, Users, Settings, Clock, Tag
} from "lucide-react"
import { authenticatedFetch } from "@/lib/api-client"

interface SearchResult {
  id: string
  type: 'trade' | 'post' | 'setting'
  title: string
  description: string
  date?: string
  pnl?: number
  symbol?: string
  tags?: string[]
}

interface GlobalSearchProps {
  onNavigate: (tab: string, itemId?: string) => void
}

export function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  const filters = [
    { id: 'trades', label: 'Trades', icon: TrendingUp },
    { id: 'posts', label: 'Posts', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const searchData = async () => {
      setLoading(true)
      try {
        // Search trades
        const tradesResponse = await authenticatedFetch('/api/trades')
        const tradesData = await tradesResponse.json()
        
        let searchResults: SearchResult[] = []

        if (tradesResponse.ok && tradesData.trades) {
          const filteredTrades = tradesData.trades.filter((trade: any) => 
            trade.symbol?.toLowerCase().includes(query.toLowerCase()) ||
            trade.notes?.toLowerCase().includes(query.toLowerCase())
          )

          searchResults.push(...filteredTrades.map((trade: any) => ({
            id: trade.id,
            type: 'trade' as const,
            title: `${trade.symbol} ${trade.side}`,
            description: trade.notes || `Quantity: ${trade.quantity}`,
            date: trade.entry_date,
            pnl: trade.pnl,
            symbol: trade.symbol
          })))
        }

        // Mock community posts search
        const mockPosts = [
          { id: '1', title: 'ES Analysis', description: 'Looking at ES support levels', tags: ['analysis', 'ES'] },
          { id: '2', title: 'Risk Management Tips', description: 'How I manage my risk', tags: ['risk', 'tips'] }
        ].filter(post => 
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.description.toLowerCase().includes(query.toLowerCase())
        )

        searchResults.push(...mockPosts.map(post => ({
          id: post.id,
          type: 'post' as const,
          title: post.title,
          description: post.description,
          tags: post.tags
        })))

        // Apply filters
        if (activeFilters.length > 0) {
          searchResults = searchResults.filter(result => 
            activeFilters.includes(result.type + 's')
          )
        }

        setResults(searchResults.slice(0, 10)) // Limit to 10 results
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchData, 300)
    return () => clearTimeout(debounceTimer)
  }, [query, activeFilters])

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    )
  }

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'trade') {
      onNavigate('trades', result.id)
    } else if (result.type === 'post') {
      onNavigate('social')
    } else {
      onNavigate('settings')
    }
    setIsOpen(false)
    setQuery("")
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'trade': return TrendingUp
      case 'post': return Users
      case 'setting': return Settings
      default: return Search
    }
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search trades, posts, settings..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 w-80 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("")
              setResults([])
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.length >= 2 || loading) && (
        <Card className="absolute top-full mt-2 w-96 bg-slate-800/90 border-slate-700/50 backdrop-blur-xl z-50">
          <CardContent className="p-0">
            {/* Filters */}
            <div className="p-3 border-b border-slate-700/50">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-400">Filter:</span>
                {filters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={activeFilters.includes(filter.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter(filter.id)}
                    className={`h-6 px-2 text-xs ${
                      activeFilters.includes(filter.id)
                        ? 'bg-blue-600 text-white'
                        : 'border-slate-600 text-slate-300 hover:text-white'
                    }`}
                  >
                    {(() => {
                      const IconComponent = filter.icon;
                      return <IconComponent className="h-3 w-3 mr-1" />;
                    })()}
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-slate-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  Searching...
                </div>
              ) : results.length > 0 ? (
                <div className="divide-y divide-slate-700/50">
                  {results.map((result) => {
                    const Icon = getResultIcon(result.type)
                    return (
                      <div
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="p-3 hover:bg-slate-700/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-1 rounded bg-slate-700/50">
                            <Icon className="h-4 w-4 text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium text-white truncate">
                                {result.title}
                              </h4>
                              {result.pnl !== undefined && (
                                <Badge className={`text-xs ${
                                  result.pnl >= 0 
                                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                                }`}>
                                  ${result.pnl.toLocaleString()}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1 truncate">
                              {result.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              {result.date && (
                                <div className="flex items-center space-x-1 text-xs text-slate-500">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(result.date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {result.tags && result.tags.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Tag className="h-3 w-3 text-slate-500" />
                                  {result.tags.slice(0, 2).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs border-slate-600 text-slate-400">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : query.length >= 2 ? (
                <div className="p-4 text-center text-slate-400">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No results found</p>
                  <p className="text-xs mt-1">Try different keywords or filters</p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
