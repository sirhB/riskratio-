import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RiskRat.io - Trading Journal & Analytics",
  description: "Professional trading journal and analytics platform for futures and forex traders",
  generator: 'v0.dev',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RiskRat.io'
  },
  openGraph: {
    title: 'RiskRat.io - Trading Journal & Analytics',
    description: 'Professional trading journal and analytics platform for futures and forex traders',
    type: 'website',
    url: 'https://riskratio.io',
    siteName: 'RiskRat.io'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RiskRat.io - Trading Journal & Analytics',
    description: 'Professional trading journal and analytics platform for futures and forex traders'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
