'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged, onIdTokenChanged, FirebaseUser, auth } from '@/services/firebase'
import { User } from '@/types'
import api from '@/services/api.service'

interface AuthContextType {
  firebaseUser: FirebaseUser | null
  user: User | null
  loading: boolean
  authVersion: number
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  loading: true,
  authVersion: 0,
  logout: async () => {},
})

function setAuthCookie(role: string) {
  document.cookie = `auth_role=${role}; path=/; SameSite=Lax; max-age=86400`
}

async function setTokenCookie(token: string) {
  await fetch('/api/auth/set-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
}

async function clearAuthCookie() {
  document.cookie = 'auth_role=; path=/; max-age=0'
  await fetch('/api/auth/clear-token', { method: 'POST' })
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authVersion, setAuthVersion] = useState(0)

  useEffect(() => {
    const unsubToken = onIdTokenChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) await setTokenCookie(await fbUser.getIdToken())
    })

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken()
          await setTokenCookie(token)
          const { data } = await api.get<User>('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          })
          setUser(data)
          setAuthCookie(data.role)
        } catch {
          setUser(null)
          await clearAuthCookie()
        }
      } else {
        setUser(null)
        await clearAuthCookie()
      }
      setLoading(false)
      setAuthVersion(v => v + 1)
    })
    return () => { unsubscribe(); unsubToken() }
  }, [])

  const logout = async () => {
    const { logout: signOut } = await import('@/services/auth.service')
    await signOut()
    setUser(null)
    setFirebaseUser(null)
    await clearAuthCookie()
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, authVersion, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
