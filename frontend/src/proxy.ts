import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const role = request.cookies.get('auth_role')?.value

  if (pathname === '/') {
    if (role === 'ENSEIGNANT') return NextResponse.redirect(new URL('/enseignant', request.url))
    if (role === 'ETUDIANT') return NextResponse.redirect(new URL('/etudiant', request.url))
    // No cookie → show landing page (page.tsx handles it)
  }

  if (pathname === '/login' || pathname === '/register') {
    if (role === 'ENSEIGNANT') return NextResponse.redirect(new URL('/enseignant', request.url))
    if (role === 'ETUDIANT') return NextResponse.redirect(new URL('/etudiant', request.url))
  }

  if (pathname.startsWith('/enseignant')) {
    if (!role) return NextResponse.redirect(new URL('/login', request.url))
    if (role !== 'ENSEIGNANT') return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith('/etudiant')) {
    if (!role) return NextResponse.redirect(new URL('/login', request.url))
    if (role !== 'ETUDIANT') return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
