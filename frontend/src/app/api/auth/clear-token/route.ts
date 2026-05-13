import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('firebase_token', '', { httpOnly: true, maxAge: 0, path: '/' })
  res.cookies.set('auth_role', '', { maxAge: 0, path: '/' })
  return res
}
