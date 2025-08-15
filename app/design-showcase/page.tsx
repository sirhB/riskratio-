"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Shield, Zap, Target, Users, Star, ArrowRight } from 'lucide-react'

const colorSchemes = {
  professionalDark: {
    name: "Professional Dark",
    class: "from-[#2563eb] to-[#475569] bg-[#0f172a] text-[#f8fafc]"
  },
  lightAnalytics: {
    name: "Light Analytics",
    class: "from-[#0ea5e9] to-[#64748b] bg-white text-[#0f172a]"
  },
  modernFintech: {
    name: "Modern Fintech",
    class: "from-[#6366f1] to-[#a855f7] bg-[#18181b] text-[#fafafa]"
  },
  warmProfessional: {
    name: "Warm Professional",
    class: "from-[#f59e0b] to-[#d97706] bg-[#fffbeb] text-[#1f2937]"
  },
  highContrast: {
    name: "High Contrast",
    class: "from-[#3b82f6] to-[#1e40af] bg-black text-white"
  },
  ecoGreen: {
    name: "Eco Green",
    class: "from-[#059669] to-[#047857] bg-[#ecfdf5] text-[#064e3b]"
  },
  oceanDeep: {
    name: "Ocean Deep",
    class: "from-[#0891b2] to-[#0e7490] bg-[#164e63] text-[#ecfeff]"
  }
}

const designStyles = {
  minimalist: {
    name: "Minimalist Trading",
    cardClass: "border border-slate-200/10 shadow-sm",
    buttonClass: "rounded-sm",
    contentClass: "space-y-4"
  },
  glassMorphism: {
    name: "Glass Morphism",
    cardClass: "backdrop-blur-xl bg-white/10 border border-white/20",
    buttonClass: "backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl",
    contentClass: "space-y-6"
  },
  neumorphism: {
    name: "Neumorphism",
    cardClass: "shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.1)] rounded-xl",
    buttonClass: "shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.1)] rounded-xl",
    contentClass: "space-y-5"
  },
  modernFlat: {
    name: "Modern Flat",
    cardClass: "border-0 rounded-none",
    buttonClass: "rounded-none",
    contentClass: "space-y-4"
  },
  richDepth: {
    name: "Rich Depth",
    cardClass: "shadow-2xl border-2",
    buttonClass: "shadow-lg rounded-lg",
    contentClass: "space-y-8"
  },
  dynamicMotion: {
    name: "Dynamic Motion",
    cardClass: "transform transition-all duration-300 hover:scale-105",
    buttonClass: "transform transition-all duration-300 hover:scale-105 rounded-lg",
    contentClass: "space-y-6"
  },
  dataDense: {
    name: "Data Dense",
    cardClass: "p-2",
    buttonClass: "text-sm py-1 px-2 rounded",
    contentClass: "space-y-2"
  }
}

export default function DesignShowcase() {
  const [selectedColor, setSelectedColor] = useState("professionalDark")
  const [selectedStyle, setSelectedStyle] = useState("minimalist")

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Deep performance insights with Sharpe ratio analysis"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Real-Time P&L",
      description: "Live profit and loss tracking with interactive charts"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Risk Management",
      description: "Sophisticated risk metrics and position sizing tools"
    }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 bg-${colorSchemes[selectedColor as keyof typeof colorSchemes].class}`}>
      <div className="container mx-auto px-4 py-20">
        {/* Style & Color Scheme Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h3 className="text-2xl font-bold mb-4">Color Schemes</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(colorSchemes).map(([key, scheme]) => (
                <Button
                  key={key}
                  onClick={() => setSelectedColor(key)}
                  className={`w-full justify-start ${
                    selectedColor === key ? 'ring-2 ring-offset-2' : ''
                  } bg-gradient-to-r ${scheme.class}`}
                >
                  {scheme.name}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-4">Design Styles</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(designStyles).map(([key, style]) => (
                <Button
                  key={key}
                  onClick={() => setSelectedStyle(key)}
                  className={`w-full justify-start ${
                    selectedStyle === key ? 'ring-2 ring-offset-2' : ''
                  }`}
                >
                  {style.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Section Example */}
        <section className="mb-20">
          <div className="text-center">
            <Badge className={`mb-6 inline-flex items-center ${designStyles[selectedStyle as keyof typeof designStyles].buttonClass}`}>
              <Zap className="h-3 w-3 mr-1" />
              Professional Trading Analytics
            </Badge>
            
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r ${colorSchemes[selectedColor as keyof typeof colorSchemes].class} leading-tight`}>
              Master Your
              <br />
              Trading Edge
            </h1>
            
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-80">
              Transform your trading performance with advanced analytics, risk management, and AI-powered insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg"
                className={`bg-gradient-to-r ${colorSchemes[selectedColor as keyof typeof colorSchemes].class} ${designStyles[selectedStyle as keyof typeof designStyles].buttonClass}`}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section Example */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 bg-gradient-to-r ${colorSchemes[selectedColor as keyof typeof colorSchemes].class}`}>
              Feature Showcase
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`${designStyles[selectedStyle as keyof typeof designStyles].cardClass} bg-gradient-to-r ${colorSchemes[selectedColor as keyof typeof colorSchemes].class}`}
              >
                <CardContent className={`p-8 ${designStyles[selectedStyle as keyof typeof designStyles].contentClass}`}>
                  <div className="mb-4 p-3 rounded-xl w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="leading-relaxed opacity-80">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Component Examples */}
        <section>
          <h2 className={`text-4xl font-bold mb-8 bg-gradient-to-r ${colorSchemes[selectedColor as keyof typeof colorSchemes].class}`}>
            Component Examples
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Buttons */}
            <Card className={`${designStyles[selectedStyle as keyof typeof designStyles].cardClass}`}>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Buttons</h3>
                <div className="space-y-4">
                  <Button 
                    className={`w-full ${designStyles[selectedStyle as keyof typeof designStyles].buttonClass} bg-gradient-to-r ${colorSchemes[selectedColor as keyof typeof colorSchemes].class}`}
                  >
                    Primary Button
                  </Button>
                  <Button 
                    variant="outline"
                    className={`w-full ${designStyles[selectedStyle as keyof typeof designStyles].buttonClass}`}
                  >
                    Secondary Button
                  </Button>
                  <Button 
                    variant="ghost"
                    className={`w-full ${designStyles[selectedStyle as keyof typeof designStyles].buttonClass}`}
                  >
                    Ghost Button
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className={`${designStyles[selectedStyle as keyof typeof designStyles].cardClass}`}>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Badges</h3>
                <div className="flex flex-wrap gap-4">
                  <Badge className={`${designStyles[selectedStyle as keyof typeof designStyles].buttonClass} bg-gradient-to-r ${colorSchemes[selectedColor as keyof typeof colorSchemes].class}`}>
                    Default
                  </Badge>
                  <Badge variant="outline" className={designStyles[selectedStyle as keyof typeof designStyles].buttonClass}>
                    Outline
                  </Badge>
                  <Badge variant="secondary" className={designStyles[selectedStyle as keyof typeof designStyles].buttonClass}>
                    Secondary
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
