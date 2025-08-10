"use client"
import { useState, useEffect } from "react"
import { 
  ModernCard, 
  ModernButton, 
  ModernBadge, 
  GradientText, 
  GlassContainer,
  AnimatedIcon,
  AnimatedProgress,
  PulseEffect
} from "./modern-design-system"
import {
  BarChart3, TrendingUp, Target, Shield, Users, Zap, 
  ArrowRight, Star, CheckCircle, Play, Pause, DollarSign,
  TrendingDown, Activity, Globe, Smartphone, Brain, Settings
} from "lucide-react"

export function ModernLanding() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive trading performance metrics with real-time insights",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Target,
      title: "Risk Management",
      description: "Professional position sizing and portfolio risk assessment",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Machine learning algorithms for trade suggestions and market analysis",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with traders worldwide and share strategies",
      color: "from-orange-500 to-red-600"
    }
  ]

  const stats = [
    { label: "Active Traders", value: "10,000+", icon: Users },
    { label: "Trades Analyzed", value: "1M+", icon: BarChart3 },
    { label: "Success Rate", value: "85%", icon: TrendingUp },
    { label: "Countries", value: "50+", icon: Globe }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PulseEffect>
                <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg">
                  <AnimatedIcon animation="float">
                    <BarChart3 className="h-6 w-6 text-primary-foreground" />
                  </AnimatedIcon>
                </div>
              </PulseEffect>
              <GradientText className="text-2xl font-bold">
                RiskRat.io
              </GradientText>
            </div>
            <div className="flex items-center space-x-4">
              <ModernButton variant="ghost" size="sm">
                Features
              </ModernButton>
              <ModernButton variant="ghost" size="sm">
                Pricing
              </ModernButton>
              <ModernButton variant="ghost" size="sm">
                About
              </ModernButton>
              <ModernButton variant="gradient" size="sm">
                Get Started
              </ModernButton>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <ModernBadge variant="info" className="mb-6">
              <AnimatedIcon animation="pulse" className="mr-2">
                <Star className="h-3 w-3" />
              </AnimatedIcon>
              Trusted by 10,000+ Professional Traders
            </ModernBadge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <GradientText className="bg-gradient-to-r from-primary via-accent to-purple-600">
                Master Your Trading
              </GradientText>
              <br />
              <span className="text-foreground">With Advanced Analytics</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The ultimate trading journal and risk management platform for futures and forex traders. 
              Track performance, manage risk, and make data-driven decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <ModernButton variant="gradient" size="lg" className="text-lg px-8 py-4">
                <AnimatedIcon animation="bounce" className="mr-2">
                  <Play className="h-5 w-5" />
                </AnimatedIcon>
                Start Free Trial
              </ModernButton>
              <ModernButton variant="outline" size="lg" className="text-lg px-8 py-4">
                <AnimatedIcon animation="float" className="mr-2">
                  <ArrowRight className="h-5 w-5" />
                </AnimatedIcon>
                Watch Demo
              </ModernButton>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <GradientText>Powerful Features</GradientText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to become a more profitable trader
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <ModernCard 
                key={index}
                variant="glass" 
                className={`p-8 text-center transition-all duration-500 ${
                  currentFeature === index ? 'scale-105 shadow-2xl' : 'scale-100'
                }`}
              >
                <div className={`p-4 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 mx-auto w-16 h-16 flex items-center justify-center`}>
                  <AnimatedIcon animation={index % 2 === 0 ? "pulse" : "float"} delay={index * 200}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </AnimatedIcon>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </ModernCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  <AnimatedIcon animation="pulse" delay={index * 100}>
                    <stat.icon className="h-8 w-8 text-primary mx-auto" />
                  </AnimatedIcon>
                </div>
                <GradientText className="text-3xl font-bold block mb-2">
                  {stat.value}
                </GradientText>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <GlassContainer className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              <GradientText>Ready to Transform Your Trading?</GradientText>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of traders who have improved their performance with RiskRat.io
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ModernButton variant="gradient" size="lg" className="text-lg px-8 py-4">
                <AnimatedIcon animation="bounce" className="mr-2">
                  <Zap className="h-5 w-5" />
                </AnimatedIcon>
                Get Started Free
              </ModernButton>
              <ModernButton variant="outline" size="lg" className="text-lg px-8 py-4">
                <AnimatedIcon animation="float" className="mr-2">
                  <Users className="h-5 w-5" />
                </AnimatedIcon>
                Join Community
              </ModernButton>
            </div>
          </GlassContainer>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-card/30 backdrop-blur-xl py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-xl">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <GradientText className="text-xl font-bold">
                RiskRat.io
              </GradientText>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>© 2024 RiskRat.io. All rights reserved.</span>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
