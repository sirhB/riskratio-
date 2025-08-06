"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Users, TrendingUp, DollarSign, BarChart3, Search, Filter, Eye, Calendar, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdminLoginModal } from "./admin-login-modal"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface UserStats {
  user_id: string
  anonymous_id: string
  user_created_at: string
  total_trades: number
  winning_trades: number
  losing_trades: number
  total_pnl: number
  avg_win: number
  avg_loss: number
  win_rate: number
  last_trade_date: string
}

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalTrades: number
  totalVolume: number
  avgUserPnL: number
  topPerformers: number
}

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(true)
  const [userStats, setUserStats] = useState<UserStats[]>([])
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTrades: 0,
    totalVolume: 0,
    avgUserPnL: 0,
    topPerformers: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<'pnl' | 'trades' | 'winrate'>('pnl')
  const router = useRouter()

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth')
    if (adminAuth) {
      setIsAuthenticated(true)
      setShowLoginModal(false)
      fetchAdminData()
    }
  }, [])

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      
      if (data.userStats && data.adminStats) {
        setUserStats(data.userStats)
        setAdminStats(data.adminStats)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true)
      setShowLoginModal(false)
      fetchAdminData()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
    router.push('/')
  }

  const filteredUsers = userStats
    .filter(user => 
      user.anonymous_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'pnl':
          return b.total_pnl - a.total_pnl
        case 'trades':
          return b.total_trades - a.total_trades
        case 'winrate':
          return b.win_rate - a.win_rate
        default:
          return 0
      }
    })

  const topPerformers = userStats
    .filter(user => user.total_pnl > 0)
    .sort((a, b) => b.total_pnl - a.total_pnl)
    .slice(0, 10)

  const performanceData = userStats
    .filter(user => user.total_trades > 0)
    .map(user => ({
      name: user.anonymous_id,
      pnl: user.total_pnl,
      trades: user.total_trades,
      winRate: user.win_rate
    }))

  const winRateDistribution = [
    { name: '0-25%', value: userStats.filter(u => u.win_rate >= 0 && u.win_rate < 25).length, color: '#ef4444' },
    { name: '25-50%', value: userStats.filter(u => u.win_rate >= 25 && u.win_rate < 50).length, color: '#f97316' },
    { name: '50-75%', value: userStats.filter(u => u.win_rate >= 50 && u.win_rate < 75).length, color: '#eab308' },
    { name: '75-100%', value: userStats.filter(u => u.win_rate >= 75 && u.win_rate <= 100).length, color: '#22c55e' }
  ]

  if (!isAuthenticated) {
    return (
      <AdminLoginModal 
        isOpen={showLoginModal}
        onLogin={handleLogin}
        onClose={() => router.push('/')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs text-slate-400">RiskRat.io Management Console</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                <Shield className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-400 hover:text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">Overview</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-700">Users</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">Analytics</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-slate-700">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="h-4 w-4 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="animate-pulse bg-slate-700 h-8 w-16 rounded"></div>
                  ) : (
                    <div className="text-2xl font-bold text-white">
                      {adminStats.totalUsers.toLocaleString()}
                    </div>
                  )}
                  <p className="text-xs text-slate-400">
                    {adminStats.activeUsers} active this month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Total Trades</CardTitle>
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="animate-pulse bg-slate-700 h-8 w-20 rounded"></div>
                  ) : (
                    <div className="text-2xl font-bold text-white">
                      {adminStats.totalTrades.toLocaleString()}
                    </div>
                  )}
                  <p className="text-xs text-slate-400">
                    Across all users
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Platform Volume</CardTitle>
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <DollarSign className="h-4 w-4 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="animate-pulse bg-slate-700 h-8 w-24 rounded"></div>
                  ) : (
                    <div className="text-2xl font-bold text-white">
                      ${Math.abs(adminStats.totalVolume).toLocaleString()}
                    </div>
                  )}
                  <p className="text-xs text-slate-400">
                    Total trading volume
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Top Performers</CardTitle>
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-yellow-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="animate-pulse bg-slate-700 h-8 w-12 rounded"></div>
                  ) : (
                    <div className="text-2xl font-bold text-white">
                      {adminStats.topPerformers}
                    </div>
                  )}
                  <p className="text-xs text-slate-400">
                    Profitable users
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers Table */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  Top 10 Performers
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Most profitable users (anonymized for privacy)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-300">Rank</TableHead>
                      <TableHead className="text-slate-300">User ID</TableHead>
                      <TableHead className="text-slate-300">Total P&L</TableHead>
                      <TableHead className="text-slate-300">Win Rate</TableHead>
                      <TableHead className="text-slate-300">Total Trades</TableHead>
                      <TableHead className="text-slate-300">Avg Win</TableHead>
                      <TableHead className="text-slate-300">Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                          <div className="animate-pulse">Loading top performers...</div>
                        </TableCell>
                      </TableRow>
                    ) : topPerformers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                          No profitable users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      topPerformers.map((user, index) => (
                        <TableRow key={user.user_id} className="hover:bg-slate-700/30">
                          <TableCell className="text-white font-medium">#{index + 1}</TableCell>
                          <TableCell className="text-white">{user.anonymous_id}</TableCell>
                          <TableCell className="text-green-400 font-medium">
                            ${user.total_pnl.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-white">{user.win_rate}%</TableCell>
                          <TableCell className="text-white">{user.total_trades}</TableCell>
                          <TableCell className="text-green-400">
                            ${user.avg_win.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-slate-400">
                            {user.last_trade_date ? new Date(user.last_trade_date).toLocaleDateString() : 'Never'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <p className="text-slate-400 text-sm mt-1">All user data is anonymized for privacy protection</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400" 
                  />
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'pnl' | 'trades' | 'winrate')}
                  className="bg-slate-800/50 border border-slate-700/50 text-white rounded-md px-3 py-2"
                >
                  <option value="pnl">Sort by P&L</option>
                  <option value="trades">Sort by Trades</option>
                  <option value="winrate">Sort by Win Rate</option>
                </select>
              </div>
            </div>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-300">User ID</TableHead>
                      <TableHead className="text-slate-300">Joined</TableHead>
                      <TableHead className="text-slate-300">Total Trades</TableHead>
                      <TableHead className="text-slate-300">Win Rate</TableHead>
                      <TableHead className="text-slate-300">Total P&L</TableHead>
                      <TableHead className="text-slate-300">Avg Win</TableHead>
                      <TableHead className="text-slate-300">Avg Loss</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                          <div className="animate-pulse">Loading users...</div>
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.user_id} className="hover:bg-slate-700/30">
                          <TableCell className="font-medium text-white">{user.anonymous_id}</TableCell>
                          <TableCell className="text-slate-400">
                            {new Date(user.user_created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-white">{user.total_trades}</TableCell>
                          <TableCell className="text-white">{user.win_rate}%</TableCell>
                          <TableCell className={user.total_pnl > 0 ? "text-green-400 font-medium" : user.total_pnl < 0 ? "text-red-400 font-medium" : "text-slate-400"}>
                            ${user.total_pnl.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-green-400">
                            ${user.avg_win.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-red-400">
                            ${user.avg_loss.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge className={user.total_trades > 0 ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-slate-500/20 text-slate-400 border-slate-500/30"}>
                              {user.total_trades > 0 ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Platform Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">User Performance Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData.slice(0, 20)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                        <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                        />
                        <Line type="monotone" dataKey="pnl" stroke="#3B82F6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Win Rate Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={winRateDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {winRateDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Performance Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Platform Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Profitable Users</span>
                    <span className="text-green-400 font-medium">
                      {((adminStats.topPerformers / adminStats.totalUsers) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Avg User P&L</span>
                    <span className={adminStats.avgUserPnL > 0 ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                      ${adminStats.avgUserPnL.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Active Users</span>
                    <span className="text-blue-400 font-medium">
                      {((adminStats.activeUsers / adminStats.totalUsers) * 100).toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Trading Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Avg Trades/User</span>
                    <span className="text-white font-medium">
                      {(adminStats.totalTrades / adminStats.totalUsers).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Volume</span>
                    <span className="text-purple-400 font-medium">
                      ${Math.abs(adminStats.totalVolume).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Platform Growth</span>
                    <span className="text-green-400 font-medium">+12.5%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">High Risk Users</span>
                    <span className="text-red-400 font-medium">
                      {userStats.filter(u => u.total_pnl < -1000).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Low Activity</span>
                    <span className="text-yellow-400 font-medium">
                      {userStats.filter(u => u.total_trades < 5).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Platform Risk</span>
                    <span className="text-green-400 font-medium">Low</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
