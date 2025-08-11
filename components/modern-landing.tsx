"use client"
import { useState, useEffect } from "react"
import { useRef } from "react"
import { AuthModal } from "./auth-modal"
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
import { motion } from "framer-motion"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import { useCallback } from "react"

export function ModernLanding() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')

  // Section refs for smooth scroll
  const featuresRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)

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

  // Scroll helpers
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden dark">
      {/* Animated Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: "transparent" },
          particles: {
            color: { value: ["#fff", "#a855f7", "#06b6d4"] },
            links: { enable: true, color: "#fff", opacity: 0.1 },
            move: { enable: true, speed: 0.5 },
            number: { value: 40 },
            opacity: { value: 0.2 },
            size: { value: { min: 1, max: 3 } },
          },
        }}
        className="fixed inset-0 z-0 pointer-events-none"
      />
      {/* Sticky Navbar */}
      <motion.header initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className="sticky top-0 z-20 border-b border-gray-800 bg-black/80 backdrop-blur-xl shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PulseEffect>
              <div className="p-2 bg-gradient-to-r from-purple-700 to-cyan-600 rounded-xl shadow-lg">
                  <AnimatedIcon animation="float">
                  <BarChart3 className="h-6 w-6 text-white" />
                  </AnimatedIcon>
                </div>
              </PulseEffect>
            <GradientText className="text-2xl font-extrabold tracking-tight">
                RiskRat.io
              </GradientText>
            </div>
          <nav className="flex items-center space-x-4">
            <ModernButton variant="ghost" size="sm" onClick={() => scrollToSection(featuresRef)} className="text-gray-200 hover:text-white">
                Features
              </ModernButton>
            <ModernButton variant="ghost" size="sm" onClick={() => scrollToSection(pricingRef)} className="text-gray-200 hover:text-white">
                Pricing
              </ModernButton>
            <ModernButton variant="ghost" size="sm" onClick={() => scrollToSection(aboutRef)} className="text-gray-200 hover:text-white">
                About
              </ModernButton>
            <ModernButton variant="gradient" size="sm" onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }} className="shadow-glow animate-pulse">
                Get Started
              </ModernButton>
          </nav>
            </div>
      </motion.header>
      {/* Hero Section */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative z-10 py-28 px-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ModernBadge variant="info" className="mb-6 bg-gradient-to-r from-purple-700 to-cyan-600 text-white animate-pulse">
              <AnimatedIcon animation="pulse" className="mr-2">
                <Star className="h-3 w-3" />
              </AnimatedIcon>
              Trusted by 10,000+ Professional Traders
            </ModernBadge>
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 animate-gradient-x bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                Master Your Trading
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The ultimate trading journal and risk management platform for futures and forex traders. Track performance, manage risk, and make data-driven decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <ModernButton variant="gradient" size="lg" className="text-lg px-8 py-4 shadow-glow hover:scale-105 transition-transform animate-pulse" onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}>
                <AnimatedIcon animation="bounce" className="mr-2">
                  <Play className="h-5 w-5" />
                </AnimatedIcon>
                Start Free Trial
              </ModernButton>
              <ModernButton variant="outline" size="lg" className="text-lg px-8 py-4 hover:scale-105 transition-transform" onClick={() => alert('Demo video coming soon!')}>
                <AnimatedIcon animation="float" className="mr-2">
                  <ArrowRight className="h-5 w-5" />
                </AnimatedIcon>
                Watch Demo
              </ModernButton>
            </div>
          </motion.div>
          </div>
      </motion.section>
      {/* Features Section */}
      <motion.section ref={featuresRef} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white animate-gradient-x bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to become a more profitable trader
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <ModernCard variant="glass" className={`p-8 text-center transition-all duration-500 bg-black/70 border-gray-800 ${currentFeature === index ? 'scale-105 shadow-2xl' : 'scale-100'}`}>
                  <div className={`p-4 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 mx-auto w-16 h-16 flex items-center justify-center animate-pulse`}>
                  <AnimatedIcon animation={index % 2 === 0 ? "pulse" : "float"} delay={index * 200}>
                    {(() => {
                      const IconComponent = feature.icon;
                      return <IconComponent className="h-8 w-8 text-white" />;
                    })()}
                  </AnimatedIcon>
                </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
              </ModernCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* Stats Section */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                <div className="mb-4">
                  <AnimatedIcon animation="pulse" delay={index * 100}>
                    {(() => {
                      const IconComponent = stat.icon;
                      return <IconComponent className="h-8 w-8 text-cyan-400 mx-auto animate-bounce-slow" />;
                    })()}
                  </AnimatedIcon>
                </div>
                <GradientText className="text-3xl font-bold block mb-2 animate-gradient-x bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </GradientText>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* CTA Section */}
      <motion.section ref={pricingRef} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <GlassContainer className="text-center max-w-4xl mx-auto bg-black/80 border-gray-800">
            <h2 className="text-4xl font-bold mb-6 text-white animate-gradient-x bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of traders who have improved their performance with RiskRat.io
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ModernButton variant="gradient" size="lg" className="text-lg px-8 py-4 shadow-glow animate-pulse" onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}>
                <AnimatedIcon animation="bounce" className="mr-2">
                  <Zap className="h-5 w-5" />
                </AnimatedIcon>
                Get Started Free
              </ModernButton>
              <ModernButton variant="outline" size="lg" className="text-lg px-8 py-4 hover:scale-105 transition-transform" onClick={() => alert('Community features coming soon!')}>
                <AnimatedIcon animation="float" className="mr-2">
                  <Users className="h-5 w-5" />
                </AnimatedIcon>
                Join Community
              </ModernButton>
            </div>
          </GlassContainer>
        </div>
      </motion.section>
      {/* Testimonials Carousel */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-white text-center animate-gradient-x bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">What Our Users Say</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            {/* Example testimonials, replace with real data as needed */}
            {[{
              name: "Alex T.",
              text: "RiskRat.io made me a more disciplined trader. The analytics are next-level!",
              avatar: "/placeholder-user.jpg"
            }, {
              name: "Morgan S.",
              text: "The dark UI is beautiful and the features are so intuitive.",
              avatar: "/placeholder-user.jpg"
            }, {
              name: "Jamie L.",
              text: "I love the community and the AI-powered trade suggestions!",
              avatar: "/placeholder-user.jpg"
            }].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="bg-black/80 border border-gray-800 rounded-xl p-8 max-w-sm text-center shadow-lg hover:scale-105 transition-transform">
                <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-cyan-400" />
                <p className="text-gray-200 text-lg mb-4">“{t.text}”</p>
                <span className="text-cyan-400 font-bold">{t.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* Footer (About section anchor) */}
      <footer ref={aboutRef} className="relative z-10 border-t border-gray-800 bg-black/90 backdrop-blur-xl py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-purple-700 to-cyan-600 rounded-xl">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <GradientText className="text-xl font-bold">
                RiskRat.io
              </GradientText>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>© 2024 RiskRat.io. All rights reserved.</span>
              <span className="hover:text-cyan-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-cyan-400 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={setAuthMode}
        />
      )}
    </div>
  )
}
