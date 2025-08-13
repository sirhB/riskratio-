import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  // Rewrite /dashboard/<tab> to /dashboard?tab=<tab> so the shell persists
  if (url.pathname.startsWith('/dashboard/')) {
    const segments = url.pathname.split('/').filter(Boolean)
    const tab = segments[1] // ['dashboard', '<tab>']
    if (tab) {
      const newUrl = req.nextUrl.clone()
      newUrl.pathname = '/dashboard'
      newUrl.searchParams.set('tab', tab)
      return NextResponse.rewrite(newUrl)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}


