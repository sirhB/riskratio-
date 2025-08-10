"use client"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Modern Card Component
interface ModernCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "glass" | "gradient"
  hover?: boolean
}

export function ModernCard({ children, className, variant = "default", hover = true }: ModernCardProps) {
  return (
    <div
      className={cn(
        "card-modern",
        variant === "glass" && "glass",
        variant === "gradient" && "gradient-bg",
        hover && "hover-lift",
        className
      )}
    >
      {children}
    </div>
  )
}

// Modern Button Component
interface ModernButtonProps {
  children: ReactNode
  className?: string
  variant?: "default" | "gradient" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  disabled?: boolean
}

export function ModernButton({ 
  children, 
  className, 
  variant = "default", 
  size = "md",
  onClick,
  disabled = false 
}: ModernButtonProps) {
  const baseClasses = "btn-modern font-medium transition-all duration-300 rounded-lg"
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    gradient: "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    ghost: "text-primary hover:bg-primary/10"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  }
  
  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// Modern Badge Component
interface ModernBadgeProps {
  children: ReactNode
  className?: string
  variant?: "default" | "success" | "warning" | "error" | "info"
}

export function ModernBadge({ children, className, variant = "default" }: ModernBadgeProps) {
  const variants = {
    default: "badge-modern text-primary",
    success: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700",
    error: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700",
    info: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
  }
  
  return (
    <span
      className={cn(
        "badge-modern inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

// Animated Loading Component
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  }
  
  return (
    <div className={cn("animate-spin", sizes[size], className)}>
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

// Gradient Text Component
interface GradientTextProps {
  children: ReactNode
  className?: string
  from?: string
  to?: string
}

export function GradientText({ children, className, from = "primary", to = "accent" }: GradientTextProps) {
  return (
    <span
      className={cn(
        "text-gradient",
        className
      )}
      style={{
        background: `linear-gradient(135deg, hsl(var(--${from})), hsl(var(--${to})))`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
      }}
    >
      {children}
    </span>
  )
}

// Animated Counter Component
interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export function AnimatedCounter({ 
  value, 
  duration = 2000, 
  className,
  prefix = "",
  suffix = "",
  decimals = 0
}: AnimatedCounterProps) {
  return (
    <span className={cn("font-bold", className)}>
      {prefix}
      <span className="animate-pulse-slow">
        {value.toFixed(decimals)}
      </span>
      {suffix}
    </span>
  )
}

// Glassmorphism Container
interface GlassContainerProps {
  children: ReactNode
  className?: string
  blur?: "sm" | "md" | "lg"
}

export function GlassContainer({ children, className, blur = "md" }: GlassContainerProps) {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg"
  }
  
  return (
    <div
      className={cn(
        "glass",
        blurClasses[blur],
        "rounded-xl p-6",
        className
      )}
    >
      {children}
    </div>
  )
}

// Animated Progress Bar
interface AnimatedProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  variant?: "default" | "gradient" | "success" | "warning" | "error"
}

export function AnimatedProgress({ 
  value, 
  max = 100, 
  className,
  showLabel = false,
  variant = "default"
}: AnimatedProgressProps) {
  const percentage = (value / max) * 100
  
  const variants = {
    default: "from-primary to-accent",
    gradient: "from-blue-500 to-purple-500",
    success: "from-green-500 to-emerald-500",
    warning: "from-yellow-500 to-orange-500",
    error: "from-red-500 to-pink-500"
  }
  
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className="progress-modern h-2 w-full">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out",
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Floating Action Button
interface FloatingActionButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}

export function FloatingActionButton({ 
  children, 
  onClick, 
  className,
  position = "bottom-right"
}: FloatingActionButtonProps) {
  const positions = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6"
  }
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-float",
        positions[position],
        className
      )}
    >
      {children}
    </button>
  )
}

// Animated Icon
interface AnimatedIconProps {
  children: ReactNode
  className?: string
  animation?: "pulse" | "bounce" | "spin" | "float" | "none"
  delay?: number
}

export function AnimatedIcon({ 
  children, 
  className, 
  animation = "none",
  delay = 0
}: AnimatedIconProps) {
  const animations = {
    pulse: "animate-pulse-slow",
    bounce: "animate-bounce-slow",
    spin: "animate-spin",
    float: "animate-float",
    none: ""
  }
  
  return (
    <div
      className={cn(
        animations[animation],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// Modern Input
interface ModernInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  type?: string
  disabled?: boolean
}

export function ModernInput({ 
  placeholder, 
  value, 
  onChange, 
  className,
  type = "text",
  disabled = false
}: ModernInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={cn(
        "input-modern w-full px-4 py-2 rounded-lg focus:outline-none",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    />
  )
}

// Hover Card
interface HoverCardProps {
  trigger: ReactNode
  content: ReactNode
  className?: string
}

export function HoverCard({ trigger, content, className }: HoverCardProps) {
  return (
    <div className={cn("group relative", className)}>
      <div className="cursor-pointer">
        {trigger}
      </div>
      <div className="absolute top-full left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="card-modern p-4 min-w-[200px] shadow-xl">
          {content}
        </div>
      </div>
    </div>
  )
}

// Animated Divider
interface AnimatedDividerProps {
  className?: string
  variant?: "solid" | "gradient" | "dashed"
}

export function AnimatedDivider({ className, variant = "solid" }: AnimatedDividerProps) {
  const variants = {
    solid: "border-t border-border",
    gradient: "border-t-2 border-gradient",
    dashed: "border-t-2 border-dashed border-border"
  }
  
  return (
    <div className={cn("w-full my-4", variants[variant], className)} />
  )
}

// Pulse Effect
interface PulseEffectProps {
  children: ReactNode
  className?: string
  color?: string
}

export function PulseEffect({ children, className, color = "primary" }: PulseEffectProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      <div
        className={cn(
          "absolute inset-0 rounded-full animate-ping opacity-20",
          `bg-${color}`
        )}
      />
    </div>
  )
}
