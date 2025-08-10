"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Settings, 
  Play, 
  RotateCcw,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Eye,
  Lightbulb,
  MessageSquare,
  Calendar,
  Clock,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react"

interface Pattern {
  id: string
  name: string
  symbol: string
  timeframe: string
  confidence: number
  direction: 'bullish' | 'bearish' | 'neutral'
  probability: number
  description: string
  timestamp: string
}

interface SentimentAnalysis {
  symbol: string
  overall: number
  news: number
  social: number
  technical: number
  fundamental: number
  timestamp: string
}

interface Prediction {
  symbol: string
  timeframe: string
  target: number
  stopLoss: number
  confidence: number
  reasoning: string
  timestamp: string
}

interface MarketInsight {
  id: string
  type: 'pattern' | 'sentiment' | 'prediction' | 'risk'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  symbols: string[]
  timestamp: string
  actionable: boolean
}

export function AdvancedAI() {
  const [activeTab, setActiveTab] = useState("patterns")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [selectedSymbol, setSelectedSymbol] = useState("EURUSD")
  const [timeframe, setTimeframe] = useState("1H")
  const [aiEnabled, setAiEnabled] = useState(true)
  const [confidenceThreshold, setConfidenceThreshold] = useState(70)
  
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [sentiments, setSentiments] = useState<SentimentAnalysis[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [insights, setInsights] = useState<MarketInsight[]>([])

  // Mock data initialization
  useEffect(() => {
    // Mock patterns
    setPatterns([
      {
        id: "1",
        name: "Double Bottom",
        symbol: "EURUSD",
        timeframe: "1H",
        confidence: 85,
        direction: "bullish",
        probability: 78,
        description: "Price formed a double bottom pattern at support level 1.0850",
        timestamp: "2 minutes ago"
      },
      {
        id: "2",
        name: "Head and Shoulders",
        symbol: "GBPUSD",
        timeframe: "4H",
        confidence: 92,
        direction: "bearish",
        probability: 85,
        description: "Classic head and shoulders pattern detected with neckline break",
        timestamp: "15 minutes ago"
      },
      {
        id: "3",
        name: "Ascending Triangle",
        symbol: "BTCUSD",
        timeframe: "1D",
        confidence: 76,
        direction: "bullish",
        probability: 68,
        description: "Ascending triangle pattern forming with increasing volume",
        timestamp: "1 hour ago"
      }
    ])

    // Mock sentiment analysis
    setSentiments([
      {
        symbol: "EURUSD",
        overall: 65,
        news: 70,
        social: 60,
        technical: 68,
        fundamental: 62,
        timestamp: "5 minutes ago"
      },
      {
        symbol: "GBPUSD",
        overall: 42,
        news: 35,
        social: 45,
        technical: 40,
        fundamental: 50,
        timestamp: "10 minutes ago"
      }
    ])

    // Mock predictions
    setPredictions([
      {
        symbol: "EURUSD",
        timeframe: "1H",
        target: 1.0920,
        stopLoss: 1.0820,
        confidence: 78,
        reasoning: "Strong support at 1.0850 with bullish momentum indicators",
        timestamp: "3 minutes ago"
      },
      {
        symbol: "GBPUSD",
        timeframe: "4H",
        target: 1.2650,
        stopLoss: 1.2750,
        confidence: 65,
        reasoning: "Resistance level at 1.2700 with bearish divergence",
        timestamp: "20 minutes ago"
      }
    ])

    // Mock insights
    setInsights([
      {
        id: "1",
        type: "pattern",
        title: "Multiple Bullish Patterns Detected",
        description: "EURUSD showing multiple bullish patterns across timeframes",
        impact: "high",
        symbols: ["EURUSD"],
        timestamp: "5 minutes ago",
        actionable: true
      },
      {
        id: "2",
        type: "sentiment",
        title: "Negative Sentiment Shift",
        description: "GBPUSD sentiment turned negative due to economic data",
        impact: "medium",
        symbols: ["GBPUSD"],
        timestamp: "15 minutes ago",
        actionable: true
      },
      {
        id: "3",
        type: "risk",
        title: "High Volatility Alert",
        description: "Increased volatility expected during upcoming news events",
        impact: "high",
        symbols: ["EURUSD", "GBPUSD", "USDJPY"],
        timestamp: "1 hour ago",
        actionable: false
      }
    ])
  }, [])

  const runAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'bullish':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case 'bearish':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case 'medium':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case 'low':
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced AI Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Machine learning-powered pattern recognition and predictive analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
            <span className="text-sm">AI Enabled</span>
          </div>
          <Button onClick={runAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {isAnalyzing && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>AI Analysis Progress</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
              <p className="text-xs text-gray-500">
                Analyzing patterns, sentiment, and market conditions...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pattern Detection */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Pattern Recognition
                </CardTitle>
                <CardDescription>AI-detected chart patterns and formations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {patterns.map(pattern => (
                  <div key={pattern.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getDirectionIcon(pattern.direction)}
                        <span className="font-semibold">{pattern.name}</span>
                        <Badge variant="outline">{pattern.symbol}</Badge>
                        <Badge variant="outline">{pattern.timeframe}</Badge>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${getConfidenceColor(pattern.confidence)}`}>
                          {pattern.confidence}%
                        </div>
                        <div className="text-xs text-gray-500">Confidence</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {pattern.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Probability: {pattern.probability}%</span>
                      <span>{pattern.timestamp}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pattern Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Pattern Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-sm text-gray-500">Active Patterns</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Bullish Patterns:</span>
                    <span className="font-medium text-green-600">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bearish Patterns:</span>
                    <span className="font-medium text-red-600">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Confidence:</span>
                    <span className="font-medium">84%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Market Sentiment
                </CardTitle>
                <CardDescription>AI-analyzed market sentiment across multiple sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sentiments.map(sentiment => (
                  <div key={sentiment.symbol} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold">{sentiment.symbol}</span>
                      <Badge variant={sentiment.overall > 60 ? "default" : sentiment.overall > 40 ? "secondary" : "destructive"}>
                        {sentiment.overall > 60 ? "Bullish" : sentiment.overall > 40 ? "Neutral" : "Bearish"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>News Sentiment:</span>
                        <span className="font-medium">{sentiment.news}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Social Sentiment:</span>
                        <span className="font-medium">{sentiment.social}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Technical Sentiment:</span>
                        <span className="font-medium">{sentiment.technical}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Fundamental Sentiment:</span>
                        <span className="font-medium">{sentiment.fundamental}%</span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      Updated {sentiment.timestamp}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sentiment Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Trends</CardTitle>
                <CardDescription>Sentiment changes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Sentiment trend chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  AI Predictions
                </CardTitle>
                <CardDescription>Machine learning price predictions and targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{prediction.symbol}</span>
                        <Badge variant="outline">{prediction.timeframe}</Badge>
                      </div>
                      <div className={`font-bold ${getConfidenceColor(prediction.confidence)}`}>
                        {prediction.confidence}%
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="text-sm text-gray-500">Target</div>
                        <div className="font-semibold text-green-600">{prediction.target}</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        <div className="text-sm text-gray-500">Stop Loss</div>
                        <div className="font-semibold text-red-600">{prediction.stopLoss}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {prediction.reasoning}
                    </p>
                    <div className="text-xs text-gray-500">
                      {prediction.timestamp}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Prediction Accuracy */}
            <Card>
              <CardHeader>
                <CardTitle>Prediction Accuracy</CardTitle>
                <CardDescription>Historical accuracy of AI predictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">78%</div>
                    <div className="text-sm text-gray-500">Accuracy Rate</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <div className="text-sm text-gray-500">Predictions Made</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Correct Predictions:</span>
                    <span className="font-medium text-green-600">122</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Incorrect Predictions:</span>
                    <span className="font-medium text-red-600">34</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Confidence:</span>
                    <span className="font-medium">72%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Insights */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Market Insights
                </CardTitle>
                <CardDescription>Automated market analysis and actionable insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map(insight => (
                  <div key={insight.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact.toUpperCase()}
                        </Badge>
                        <span className="font-semibold">{insight.title}</span>
                      </div>
                      {insight.actionable && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Actionable
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {insight.symbols.map(symbol => (
                          <Badge key={symbol} variant="outline" className="text-xs">
                            {symbol}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{insight.timestamp}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
                <CardDescription>Configure AI analysis parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Confidence Threshold</label>
                  <Slider
                    value={[confidenceThreshold]}
                    onValueChange={([value]) => setConfidenceThreshold(value)}
                    max={100}
                    min={50}
                    step={5}
                  />
                  <span className="text-sm text-gray-500">{confidenceThreshold}%</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pattern Recognition</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sentiment Analysis</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Price Predictions</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Alerts</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Analysis Schedule</CardTitle>
                <CardDescription>Automated analysis timing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Real-time Analysis</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hourly Updates</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Reports</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Summary</span>
                    <Switch />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
