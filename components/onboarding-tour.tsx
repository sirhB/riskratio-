"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  X, ChevronLeft, ChevronRight, Check, Play, BarChart3, 
  Target, Bell, Users, Brain, Smartphone, Settings
} from "lucide-react"

interface OnboardingTourProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const tourSteps = [
  {
    id: 1,
    title: "Welcome to RiskRat.io",
    description: "Your comprehensive trading journal and risk management platform. Let's take a quick tour of the key features.",
    icon: BarChart3,
    color: "from-blue-500 to-purple-600",
    bgColor: "bg-gradient-to-r from-blue-500/20 to-purple-600/20"
  },
  {
    id: 2,
    title: "Quick Actions",
    description: "Access your most common tasks right from the dashboard. Add trades, check P&L, manage alerts, and monitor risk.",
    icon: Target,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-gradient-to-r from-green-500/20 to-emerald-600/20"
  },
  {
    id: 3,
    title: "Trade Management",
    description: "Record and analyze your trades with detailed charts, performance metrics, and risk calculations.",
    icon: BarChart3,
    color: "from-orange-500 to-red-600",
    bgColor: "bg-gradient-to-r from-orange-500/20 to-red-600/20"
  },
  {
    id: 4,
    title: "Risk Management",
    description: "Calculate position sizes, monitor portfolio risk, and set up alerts to protect your capital.",
    icon: Target,
    color: "from-yellow-500 to-orange-600",
    bgColor: "bg-gradient-to-r from-yellow-500/20 to-orange-600/20"
  },
  {
    id: 5,
    title: "AI-Powered Insights",
    description: "Get intelligent trade suggestions, market analysis, and pattern recognition to improve your trading decisions.",
    icon: Brain,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-gradient-to-r from-purple-500/20 to-pink-600/20"
  },
  {
    id: 6,
    title: "Community & Learning",
    description: "Connect with other traders, share insights, and learn from the community's collective experience.",
    icon: Users,
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-gradient-to-r from-indigo-500/20 to-blue-600/20"
  },
  {
    id: 7,
    title: "Mobile Access",
    description: "Access your trading journal on the go with our mobile app. Never miss important alerts or opportunities.",
    icon: Smartphone,
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-gradient-to-r from-teal-500/20 to-cyan-600/20"
  },
  {
    id: 8,
    title: "You're All Set!",
    description: "You're ready to start tracking your trades and improving your performance. Let's begin your trading journey!",
    icon: Check,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-gradient-to-r from-green-500/20 to-emerald-600/20"
  }
]

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
      setCompletedSteps([])
    }
  }, [isOpen])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep])
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const currentTourStep = tourSteps[currentStep]
  const progress = ((currentStep + 1) / tourSteps.length) * 100

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800/90 border-slate-700/50 backdrop-blur-xl">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${currentTourStep.bgColor}`}>
                <currentTourStep.icon className={`h-6 w-6 bg-gradient-to-r ${currentTourStep.color} bg-clip-text text-transparent`} />
              </div>
              <div>
                <CardTitle className="text-white">{currentTourStep.title}</CardTitle>
                <CardDescription className="text-slate-400">
                  Step {currentStep + 1} of {tourSteps.length}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{Math.round(progress)}% Complete</span>
              <span>{currentStep + 1} / {tourSteps.length}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step Content */}
          <div className="text-center space-y-4">
            <p className="text-slate-300 text-lg leading-relaxed">
              {currentTourStep.description}
            </p>
            
            {/* Feature Preview */}
            {currentStep < tourSteps.length - 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                {tourSteps.slice(0, 4).map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border transition-all ${
                      index === currentStep
                        ? 'border-blue-500 bg-blue-500/10'
                        : completedSteps.includes(index)
                        ? 'border-green-500/50 bg-green-500/5'
                        : 'border-slate-600 bg-slate-700/30'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <step.icon className={`h-4 w-4 ${
                        index === currentStep
                          ? 'text-blue-400'
                          : completedSteps.includes(index)
                          ? 'text-green-400'
                          : 'text-slate-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        index === currentStep
                          ? 'text-blue-300'
                          : completedSteps.includes(index)
                          ? 'text-green-300'
                          : 'text-slate-400'
                      }`}>
                        {step.title.split(' ')[0]}
                      </span>
                    </div>
                    {completedSteps.includes(index) && (
                      <Check className="h-3 w-3 text-green-400 mt-1" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="border-slate-600 text-slate-300 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                Skip Tour
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {currentStep === tourSteps.length - 1 ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Get Started
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="p-1 rounded bg-blue-500/20">
                <Settings className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">Pro Tip</h4>
                <p className="text-xs text-slate-400">
                  {currentStep === 0 && "You can always access this tour again from the Settings menu."}
                  {currentStep === 1 && "Use Quick Actions to save time on your most common tasks."}
                  {currentStep === 2 && "Add detailed notes to your trades for better analysis later."}
                  {currentStep === 3 && "Set up alerts before entering trades to protect your capital."}
                  {currentStep === 4 && "AI suggestions are based on your trading history and market conditions."}
                  {currentStep === 5 && "Engage with the community to learn new strategies and get feedback."}
                  {currentStep === 6 && "Enable push notifications to stay updated on mobile."}
                  {currentStep === 7 && "Start by adding your first trade and explore the features as you go!"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
