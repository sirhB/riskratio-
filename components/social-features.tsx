"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Trophy, 
  Share2, 
  Heart, 
  MessageSquare,
  Star,
  Filter,
  Search,
  Plus,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Target,
  AlertTriangle
} from "lucide-react"
import { authenticatedFetch } from "@/lib/api-client"

interface CommunityPost {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  timestamp: string
  tags: string[]
  isTradeShare?: boolean
  tradeData?: {
    symbol: string
    entry: number
    exit: number
    pnl: number
    strategy: string
  }
}

interface LeaderboardEntry {
  id: string
  username: string
  avatar: string
  rank: number
  totalPnL: number
  winRate: number
  totalTrades: number
  followers: number
  isFollowing: boolean
}

interface Discussion {
  id: string
  title: string
  content: string
  author: string
  authorAvatar: string
  replies: number
  views: number
  lastActivity: string
  tags: string[]
  isPinned: boolean
}

export function SocialFeatures() {
  const [activeTab, setActiveTab] = useState("community")
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [newPost, setNewPost] = useState("")
  const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "" })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSharingTrade, setIsSharingTrade] = useState(false)
  const [sharedTrade, setSharedTrade] = useState({
    symbol: "",
    entry: "",
    exit: "",
    strategy: "",
    notes: ""
  })

  // Mock data for social features
  useEffect(() => {
    // Mock community posts
    setPosts([
      {
        id: "1",
        userId: "user1",
        username: "TraderPro",
        avatar: "/avatars/trader1.jpg",
        content: "Just closed a great EURUSD trade! The support level held perfectly. What's everyone's take on the current market sentiment?",
        likes: 24,
        comments: 8,
        shares: 3,
        timestamp: "2 hours ago",
        tags: ["EURUSD", "Support", "Market Analysis"],
        isTradeShare: true,
        tradeData: {
          symbol: "EURUSD",
          entry: 1.0850,
          exit: 1.0920,
          pnl: 70,
          strategy: "Support Bounce"
        }
      },
      {
        id: "2",
        userId: "user2",
        username: "CryptoQueen",
        avatar: "/avatars/trader2.jpg",
        content: "Market structure is looking bullish on BTC. Anyone else seeing this pattern?",
        likes: 18,
        comments: 12,
        shares: 5,
        timestamp: "4 hours ago",
        tags: ["BTC", "Market Structure", "Bullish"]
      },
      {
        id: "3",
        userId: "user3",
        username: "SwingTrader",
        avatar: "/avatars/trader3.jpg",
        content: "Risk management tip: Always size your positions based on your account size and risk tolerance. Never risk more than 1-2% per trade!",
        likes: 45,
        comments: 15,
        shares: 22,
        timestamp: "6 hours ago",
        tags: ["Risk Management", "Position Sizing", "Education"]
      }
    ])

    // Mock leaderboard
    setLeaderboard([
      {
        id: "1",
        username: "TraderPro",
        avatar: "/avatars/trader1.jpg",
        rank: 1,
        totalPnL: 15420,
        winRate: 68,
        totalTrades: 156,
        followers: 1247,
        isFollowing: true
      },
      {
        id: "2",
        username: "CryptoQueen",
        avatar: "/avatars/trader2.jpg",
        rank: 2,
        totalPnL: 12850,
        winRate: 72,
        totalTrades: 89,
        followers: 892,
        isFollowing: false
      },
      {
        id: "3",
        username: "SwingTrader",
        avatar: "/avatars/trader3.jpg",
        rank: 3,
        totalPnL: 9870,
        winRate: 65,
        totalTrades: 203,
        followers: 567,
        isFollowing: true
      }
    ])

    // Mock discussions
    setDiscussions([
      {
        id: "1",
        title: "Best risk management strategies for volatile markets",
        content: "With the current market volatility, what strategies are you using to manage risk?",
        author: "RiskManager",
        authorAvatar: "/avatars/risk.jpg",
        replies: 23,
        views: 156,
        lastActivity: "1 hour ago",
        tags: ["Risk Management", "Volatility"],
        isPinned: true
      },
      {
        id: "2",
        title: "Technical analysis vs fundamental analysis",
        content: "Which approach do you prefer and why?",
        author: "AnalystPro",
        authorAvatar: "/avatars/analyst.jpg",
        replies: 45,
        views: 234,
        lastActivity: "3 hours ago",
        tags: ["Technical Analysis", "Fundamental Analysis"],
        isPinned: false
      }
    ])
  }, [])

  const handleCreatePost = async () => {
    if (!newPost.trim()) return

    const post: CommunityPost = {
      id: Date.now().toString(),
      userId: "currentUser",
      username: "You",
      avatar: "/avatars/current.jpg",
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: "Just now",
      tags: selectedTags
    }

    setPosts([post, ...posts])
    setNewPost("")
    setSelectedTags([])
  }

  const handleShareTrade = async () => {
    if (!sharedTrade.symbol || !sharedTrade.entry || !sharedTrade.exit) return

    const post: CommunityPost = {
      id: Date.now().toString(),
      userId: "currentUser",
      username: "You",
      avatar: "/avatars/current.jpg",
      content: `Shared trade: ${sharedTrade.symbol} - Entry: ${sharedTrade.entry}, Exit: ${sharedTrade.exit}. Strategy: ${sharedTrade.strategy}. ${sharedTrade.notes}`,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: "Just now",
      tags: [sharedTrade.symbol, sharedTrade.strategy],
      isTradeShare: true,
      tradeData: {
        symbol: sharedTrade.symbol,
        entry: parseFloat(sharedTrade.entry),
        exit: parseFloat(sharedTrade.exit),
        pnl: (parseFloat(sharedTrade.exit) - parseFloat(sharedTrade.entry)) * 100000, // Mock calculation
        strategy: sharedTrade.strategy
      }
    }

    setPosts([post, ...posts])
    setSharedTrade({ symbol: "", entry: "", exit: "", strategy: "", notes: "" })
    setIsSharingTrade(false)
  }

  const handleCreateDiscussion = async () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) return

    const discussion: Discussion = {
      id: Date.now().toString(),
      title: newDiscussion.title,
      content: newDiscussion.content,
      author: "You",
      authorAvatar: "/avatars/current.jpg",
      replies: 0,
      views: 0,
      lastActivity: "Just now",
      tags: selectedTags,
      isPinned: false
    }

    setDiscussions([discussion, ...discussions])
    setNewDiscussion({ title: "", content: "" })
    setSelectedTags([])
  }

  const toggleFollow = (userId: string) => {
    setLeaderboard(prev => prev.map(entry => 
      entry.id === userId 
        ? { ...entry, isFollowing: !entry.isFollowing, followers: entry.isFollowing ? entry.followers - 1 : entry.followers + 1 }
        : entry
    ))
  }

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  const availableTags = ["EURUSD", "GBPUSD", "BTC", "ETH", "Support", "Resistance", "Risk Management", "Market Analysis", "Technical Analysis", "Fundamental Analysis", "Volatility", "Education"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trading Community</h1>
          <p className="text-gray-600 dark:text-gray-400">Connect with fellow traders, share insights, and learn from the community</p>
        </div>
        <Button onClick={() => setIsSharingTrade(true)} className="bg-blue-600 hover:bg-blue-700">
          <Share2 className="h-4 w-4 mr-2" />
          Share Trade
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="learn">Learn</TabsTrigger>
        </TabsList>

        <TabsContent value="community" className="space-y-6">
          {/* Create Post */}
          <Card>
            <CardHeader>
              <CardTitle>Share Your Thoughts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's on your mind about the markets?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tags:</span>
                {availableTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedTags(prev => 
                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                    )}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Post
              </Button>
            </CardContent>
          </Card>

          {/* Community Posts */}
          <div className="space-y-4">
            {posts.map(post => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>{post.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{post.username}</span>
                        <span className="text-sm text-gray-500">{post.timestamp}</span>
                        {post.isTradeShare && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Target className="h-3 w-3 mr-1" />
                            Trade Share
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
                      
                      {post.isTradeShare && post.tradeData && (
                        <Card className="bg-gray-50 dark:bg-gray-800">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Symbol:</span>
                                <span className="ml-2 font-semibold">{post.tradeData.symbol}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Strategy:</span>
                                <span className="ml-2">{post.tradeData.strategy}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Entry:</span>
                                <span className="ml-2">{post.tradeData.entry}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Exit:</span>
                                <span className="ml-2">{post.tradeData.exit}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-500">P&L:</span>
                                <span className={`ml-2 font-semibold ${post.tradeData.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {post.tradeData.pnl >= 0 ? '+' : ''}{post.tradeData.pnl.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          {post.shares}
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top Traders
              </CardTitle>
              <CardDescription>Ranked by total P&L and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                          {entry.rank}
                        </div>
                        <Avatar>
                          <AvatarImage src={entry.avatar} />
                          <AvatarFallback>{entry.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{entry.username}</div>
                          <div className="text-sm text-gray-500">
                            {entry.totalTrades} trades • {entry.winRate}% win rate
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className={`font-semibold ${entry.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${entry.totalPnL.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Total P&L</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold">{entry.followers}</div>
                        <div className="text-sm text-gray-500">Followers</div>
                      </div>
                      
                      <Button
                        variant={entry.isFollowing ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleFollow(entry.id)}
                      >
                        {entry.isFollowing ? "Following" : "Follow"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions" className="space-y-6">
          {/* Create Discussion */}
          <Card>
            <CardHeader>
              <CardTitle>Start a Discussion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Discussion title"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="What would you like to discuss?"
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[100px]"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tags:</span>
                {availableTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedTags(prev => 
                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                    )}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button onClick={handleCreateDiscussion} disabled={!newDiscussion.title.trim() || !newDiscussion.content.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Discussion
              </Button>
            </CardContent>
          </Card>

          {/* Discussions List */}
          <div className="space-y-4">
            {discussions.map(discussion => (
              <Card key={discussion.id} className={discussion.isPinned ? "border-blue-200 bg-blue-50 dark:bg-blue-900/20" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={discussion.authorAvatar} />
                      <AvatarFallback>{discussion.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {discussion.isPinned && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Pinned
                          </Badge>
                        )}
                        <h3 className="font-semibold text-lg">{discussion.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{discussion.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>by {discussion.author}</span>
                        <span>{discussion.replies} replies</span>
                        <span>{discussion.views} views</span>
                        <span>{discussion.lastActivity}</span>
                      </div>
                      <div className="flex gap-2">
                        {discussion.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="learn" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Popular Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">Support & Resistance Trading</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Learn to identify and trade key levels</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">Beginner</Badge>
                      <span className="text-sm text-gray-500">1.2k learners</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">Risk Management Fundamentals</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Essential risk management techniques</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">Beginner</Badge>
                      <span className="text-sm text-gray-500">856 learners</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">Advanced Chart Patterns</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Master complex chart patterns</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">Advanced</Badge>
                      <span className="text-sm text-gray-500">432 learners</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <h4 className="font-semibold">30-Day Consistency Challenge</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Trade consistently for 30 days</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="default" className="bg-blue-600">Active</Badge>
                      <span className="text-sm text-gray-500">234 participants</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">Risk Management Mastery</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Perfect your risk management</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">Upcoming</Badge>
                      <span className="text-sm text-gray-500">Starts in 3 days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Share Trade Modal */}
      {isSharingTrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Share Your Trade</CardTitle>
              <CardDescription>Share your trade details with the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Symbol</label>
                  <Input
                    value={sharedTrade.symbol}
                    onChange={(e) => setSharedTrade(prev => ({ ...prev, symbol: e.target.value }))}
                    placeholder="EURUSD"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Strategy</label>
                  <Input
                    value={sharedTrade.strategy}
                    onChange={(e) => setSharedTrade(prev => ({ ...prev, strategy: e.target.value }))}
                    placeholder="Support Bounce"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Entry Price</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={sharedTrade.entry}
                    onChange={(e) => setSharedTrade(prev => ({ ...prev, entry: e.target.value }))}
                    placeholder="1.0850"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Exit Price</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={sharedTrade.exit}
                    onChange={(e) => setSharedTrade(prev => ({ ...prev, exit: e.target.value }))}
                    placeholder="1.0920"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={sharedTrade.notes}
                  onChange={(e) => setSharedTrade(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="What was your reasoning for this trade?"
                  className="min-h-[80px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleShareTrade} className="flex-1">
                  Share Trade
                </Button>
                <Button variant="outline" onClick={() => setIsSharingTrade(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
