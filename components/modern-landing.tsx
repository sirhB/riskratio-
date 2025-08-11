"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"

import { AuthModal } from "./auth-modal"
import {
  ModernCard,
  ModernButton,
  ModernBadge,
  GradientText,
  GlassContainer,
  AnimatedIcon,
  PulseEffect,
} from "./modern-design-system"
import {
  BarChart3,
  LineChart,
  TrendingUp,
  TrendingDown,
  Shield,
  Brain,
  Bell,
  Users,
  DollarSign,
  ArrowRight,
  Star,
  CheckCircle,
  Play,
  Zap,
} from "lucide-react"

/* ----------------------------------------------
   Market Ticker (fake data for visual interest)
----------------------------------------------- */
function MarketTicker() {
  const [ticks, setTicks] = useState(
    [
      { symbol: "ES", price: 5268.25, change: +0.42 },
      { symbol: "NQ", price: 18542.75, change: -0.15 },
      { symbol: "CL", price: 82.31, change: +0.28 },
      { symbol: "GC", price: 2365.8, change: -0.12 },
      { symbol: "EURUSD", price: 1.0875, change: +0.06 },
      { symbol: "GBPUSD", price: 1.2721, change: -0.04 },
      { symbol: "USDJPY", price: 147.82, change: +0.09 },
    ].map((t, i) => ({ ...t, id: i }))
  )

  useEffect(() => {
    const id = setInterval(() => {
      setTicks((prev) =>
        prev.map((t) => {
          const delta = (Math.random() - 0.5) * (t.price > 200 ? 0.6 : 0.01)
          const price = +(t.price + delta).toFixed(t.price > 200 ? 2 : 4)
          const change = +(t.change + (Math.random() - 0.5) * 0.05).toFixed(2)
          return { ...t, price, change }
        })
      )
    }, 1500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative w-full overflow-hidden border-y border-gray-800 bg-black/80">
      <div className="flex animate-[ticker_30s_linear_infinite] whitespace-nowrap py-2">
        {[...ticks, ...ticks].map((t, i) => (
          <div key={`${t.symbol}-${i}`} className="flex items-center gap-2 px-4">
            <span className="text-xs text-gray-400">{t.symbol}</span>
            <span className="text-sm text-white font-semibold">{t.price}</span>
            <span className={`text-xs ${t.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {t.change >= 0 ? "▲" : "▼"} {Math.abs(t.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  )
}

export function ModernLanding() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup")

  const featuresRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      icon: BarChart3,
      title: "Performance Analytics",
      desc: "Real-time KPIs, trend breakdowns, and edge identification.",
    },
    {
      icon: Shield,
      title: "Risk Management",
      desc: "Position sizing, portfolio exposure, and drawdown control.",
    },
    {
      icon: Brain,
      title: "AI Suggestions",
      desc: "Context-aware insights and pattern recognition for setups.",
    },
    {
      icon: LineChart,
      title: "Advanced Charting",
      desc: "Trade overlays, screenshots, and indicator templates.",
    },
    {
      icon: Bell,
      title: "Price Alerts",
      desc: "Get notified the instant your levels are tapped.",
    },
    {
      icon: Users,
      title: "Community",
      desc: "Compare notes, learn faster, and sharpen your edge.",
    },
  ]

  const plans = [
    {
      name: "Starter",
      badge: "Free",
      price: "$0",
      period: "/mo",
      color: "from-gray-700 to-gray-600",
      features: ["Basic analytics", "10 trades/mo", "Community access"],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Trader",
      badge: "Most Popular",
      price: "$19",
      period: "/mo",
      color: "from-emerald-600 to-green-600",
      features: [
        "Full analytics",
        "Unlimited trades",
        "Price alerts",
        "Advanced charting",
      ],
      cta: "Start Trial",
      highlight: true,
    },
    {
      name: "Pro",
      badge: "Teams",
      price: "$39",
      period: "/mo",
      color: "from-rose-600 to-pink-600",
      features: ["All features", "AI suggestions", "Priority support"],
      cta: "Go Pro",
      highlight: false,
    },
  ]

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  // tsparticles init
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine)
  }, [])

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Particles background */}
      <Particles
        id="landing-particles"
        init={particlesInit}
        className="pointer-events-none fixed inset-0 z-0"
        options={{
          fullScreen: { enable: false },
          background: { color: "transparent" },
          particles: {
            color: { value: ["#16a34a", "#ef4444", "#ffffff"] },
            links: { enable: true, color: "#16a34a", opacity: 0.12 },
            move: { enable: true, speed: 0.6 },
            number: { value: 40 },
            opacity: { value: 0.2 },
            size: { value: { min: 1, max: 3 } },
          },
        }}
      />

      {/* Navbar */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-20 border-b border-gray-800 bg-black/75 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PulseEffect>
              <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-600 to-rose-600 shadow-lg">
                <AnimatedIcon animation="float">
                  <BarChart3 className="h-6 w-6 text-white" />
                </AnimatedIcon>
              </div>
            </PulseEffect>
            <GradientText className="text-2xl font-bold tracking-tight">RiskRat.io</GradientText>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            <ModernButton variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={() => scrollTo(featuresRef)}>
              Features
            </ModernButton>
            <ModernButton variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={() => scrollTo(pricingRef)}>
              Pricing
            </ModernButton>
            <ModernButton variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={() => scrollTo(faqRef)}>
              FAQ
            </ModernButton>
            <ModernButton variant="gradient" size="sm" className="shadow-glow" onClick={() => { setAuthMode("signup"); setShowAuthModal(true) }}>
              Get Started
            </ModernButton>
          </nav>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative z-10">
        <MarketTicker />
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <ModernBadge variant="info" className="mb-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <Star className="h-3 w-3 mr-2" /> Built for serious futures & forex traders
              </ModernBadge>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                <span className="animate-gradient-x bg-gradient-to-r from-emerald-400 via-white to-rose-400 bg-clip-text text-transparent">
                  Trade Smarter.
                </span>
                <br />
                <span className="text-white">Journal. Analyze. Improve.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-300 max-w-xl">
                RiskRat.io is your edge: performance analytics, disciplined risk, and AI-powered insights in one sleek, trader-first platform.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <ModernButton variant="gradient" size="lg" className="px-8 py-4 text-lg shadow-glow" onClick={() => { setAuthMode("signup"); setShowAuthModal(true) }}>
                  <Play className="h-5 w-5 mr-2" /> Start Free Trial
                </ModernButton>
                <ModernButton variant="outline" size="lg" className="px-8 py-4 text-lg" onClick={() => scrollTo(featuresRef)}>
                  <ArrowRight className="h-5 w-5 mr-2" /> Explore Features
                </ModernButton>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> No credit card required</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Cancel anytime</div>
              </div>
            </div>

            {/* Product preview */}
            <div className="lg:col-span-6">
              <GlassContainer className="bg-black/70 border-gray-800 p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" /> Live
                  </div>
                  <div className="text-sm text-gray-400">Demo Overview</div>
                </div>
                <div className="mt-4 h-56 md:h-72 w-full rounded-lg bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
                  {/* Faux chart lines */}
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="absolute left-0 right-0 h-px bg-gray-700/40" style={{ top: `${(i + 1) * (100 / 13)}%` }} />
                    ))}
                  </div>
                  <div className="absolute inset-0">
                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-rose-500 via-emerald-500 to-rose-500 blur-sm opacity-60" />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[{
                    label: "Win Rate", value: "64%", color: "text-emerald-400", icon: TrendingUp
                  }, {
                    label: "Max DD", value: "-4.2%", color: "text-rose-400", icon: TrendingDown
                  }, {
                    label: "Profit Factor", value: "1.84", color: "text-emerald-400", icon: DollarSign
                  }].map((kpi, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 flex items-center gap-3">
                      {(() => { const I = kpi.icon as any; return <I className={`h-4 w-4 ${kpi.color}`} /> })()}
                      <div>
                        <div className="text-xs text-gray-400">{kpi.label}</div>
                        <div className="text-sm font-semibold text-white">{kpi.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Three-part Edge */}
      <section className="relative z-10 py-12 md:py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{
            title: "Journal with Precision",
            desc: "Log trades effortlessly with screenshots, tags, and setups.",
            color: "from-emerald-600 to-green-600",
          }, {
            title: "Analyze Your Edge",
            desc: "Find what truly works with robust, no-nonsense analytics.",
            color: "from-rose-600 to-pink-600",
          }, {
            title: "Trade with Discipline",
            desc: "Risk controls and alerts keep emotions out of the cockpit.",
            color: "from-cyan-600 to-blue-600",
          }].map((c, i) => (
            <ModernCard key={i} variant="glass" className="p-6 bg-black/70 border-gray-800">
              <div className={`inline-block px-3 py-1 rounded-full text-xs text-white mb-3 bg-gradient-to-r ${c.color}`}>{c.title}</div>
              <p className="text-gray-300">{c.desc}</p>
            </ModernCard>
          ))}
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="relative z-10 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="animate-gradient-x bg-gradient-to-r from-emerald-400 via-white to-rose-400 bg-clip-text text-transparent">Powerful Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <div className="p-6 rounded-xl bg-black/70 border border-gray-800 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    {(() => { const I = f.icon as any; return <I className="h-5 w-5 text-emerald-400" /> })()}
                    <div className="font-semibold">{f.title}</div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section ref={pricingRef} className="relative z-10 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className={`rounded-2xl p-6 bg-black/80 border border-gray-800 ${p.highlight ? "ring-2 ring-emerald-500/50" : ""}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs text-white bg-gradient-to-r ${p.color}`}>{p.name}</span>
                  <span className="text-xs text-gray-400">{p.badge}</span>
                </div>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-4xl font-extrabold">{p.price}</span>
                  <span className="text-gray-400">{p.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" /> {f}
                    </li>
                  ))}
                </ul>
                <ModernButton variant={p.highlight ? "gradient" : "outline"} size="lg" className="w-full" onClick={() => { setAuthMode("signup"); setShowAuthModal(true) }}>
                  {p.cta}
                </ModernButton>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} className="relative z-10 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{
              q: "Is there a free trial?",
              a: "Yes, get full access to features during your trial. No credit card required.",
            }, {
              q: "Can I cancel anytime?",
              a: "Absolutely. Manage your plan from settings with a single click.",
            }, {
              q: "Do you support futures and forex?",
              a: "Yes. Our analytics are optimized for both futures and FX workflows.",
            }, {
              q: "Is my data secure?",
              a: "We use modern security best-practices and never share your data.",
            }].map((item, i) => (
              <GlassContainer key={i} className="bg-black/70 border-gray-800">
                <div className="font-semibold mb-2">{item.q}</div>
                <p className="text-gray-300 text-sm leading-relaxed">{item.a}</p>
              </GlassContainer>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 bg-black/85 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-600 to-rose-600 rounded-xl">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <GradientText className="text-xl font-bold">RiskRat.io</GradientText>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-6">
            <span>© 2024 RiskRat.io</span>
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </footer>

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
