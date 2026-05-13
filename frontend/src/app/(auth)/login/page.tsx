'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { loginWithEmail, loginWithGoogle, loginWithGithub } from '@/services/auth.service'
import { auth } from '@/services/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useAuth } from '@/context/AuthContext'
import AuthVisual from '@/components/auth/AuthVisual'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, authVersion } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null)
  const [oauthRole, setOauthRole] = useState<'ETUDIANT' | 'ENSEIGNANT'>('ETUDIANT')

  useEffect(() => {
    if (loading) return
    if (user) {
      router.replace(user.role === 'ENSEIGNANT' ? '/enseignant' : '/etudiant')
    } else {
      setOauthLoading(null)
    }
  }, [user, loading, authVersion, router])

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await loginWithEmail(email, password)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion'
      if (msg.includes('email-not-verified')) {
        toast.error('Vérifiez votre email avant de vous connecter.')
      } else if (msg.includes('invalid-credential')) {
        toast.error('Email ou mot de passe incorrect')
      } else {
        toast.error(msg)
      }
      setSubmitting(false)
    }
  }

  async function handleGoogle() {
    setOauthLoading('google')
    try {
      await loginWithGoogle(oauthRole)
    } catch {
      toast.error('Connexion Google échouée')
      setOauthLoading(null)
    }
  }

  async function handleGithub() {
    setOauthLoading('github')
    try {
      await loginWithGithub(oauthRole)
    } catch {
      toast.error('Connexion GitHub échouée')
      setOauthLoading(null)
    }
  }

  async function handleForgotPassword() {
    if (!email) { toast.error("Entrez votre email d'abord"); return }
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Email de réinitialisation envoyé !')
    } catch {
      toast.error("Impossible d'envoyer l'email de réinitialisation")
    }
  }

  const busy = submitting || oauthLoading !== null

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8"
      style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 30%, #e3f2fd 70%, #e8eaf6 100%)' }}>

      {/* Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex min-h-155">

        {/* ── Left: Form ── */}
        <div className="flex-1 flex flex-col p-8 md:p-10 relative overflow-hidden">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-auto">
            <Image src="/logo.png" alt="QCMPlatform" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-slate-700 text-base tracking-tight">QCMPlatform</span>
          </div>

          {/* Center content */}
          <div className="flex flex-col items-center justify-center flex-1 py-6">

            {/* Grid pattern behind icon */}
            <div className="relative mb-5">
              <div
                className="absolute inset-0 -m-8 rounded-xl opacity-100"
                style={{
                  backgroundImage: `
                    linear-gradient(#dbeafe 1px, transparent 1px),
                    linear-gradient(90deg, #dbeafe 1px, transparent 1px)
                  `,
                  backgroundSize: '22px 22px',
                  maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
                }}
              />
              {/* Login icon */}
              <div className="relative w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 z-10">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-1">Connexion à votre compte !</h1>
            <p className="text-slate-400 text-sm mb-7 text-center">
              Entrez votre email et mot de passe pour vous connecter
            </p>

            <form onSubmit={handleEmail} className="w-full max-w-sm flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 text-sm font-medium">Email</label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all bg-white">
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ex. prenom@gmail.com"
                    required
                    disabled={busy}
                    autoComplete="email"
                    className="flex-1 text-sm text-slate-700 outline-none placeholder-slate-300 bg-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 text-sm font-medium">Mot de passe</label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all bg-white">
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    disabled={busy}
                    autoComplete="current-password"
                    className="flex-1 text-sm text-slate-700 outline-none placeholder-slate-300 bg-transparent"
                  />
                  <button type="button" onClick={() => setShowPwd(p => !p)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    {showPwd ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600" />
                  <span className="text-slate-500 text-sm">Se souvenir de moi</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all disabled:opacity-60 shadow-lg shadow-blue-500/30 mt-1 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : null}
                {submitting ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            {/* Divider */}
            <div className="w-full max-w-sm flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs">Ou se connecter avec</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Role selector for OAuth */}
            <div className="w-full max-w-sm mb-3">
              <p className="text-slate-400 text-xs text-center mb-2">Je me connecte en tant que</p>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOauthRole('ETUDIANT')}
                  disabled={busy}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    oauthRole === 'ETUDIANT' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Étudiant
                </button>
                <button
                  type="button"
                  onClick={() => setOauthRole('ENSEIGNANT')}
                  disabled={busy}
                  className={`flex-1 py-2 text-sm font-medium transition-colors border-l border-slate-200 ${
                    oauthRole === 'ENSEIGNANT' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Enseignant
                </button>
              </div>
            </div>

            {/* OAuth buttons */}
            <div className="w-full max-w-sm grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogle}
                disabled={busy}
                className="flex items-center justify-center gap-2.5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-60"
              >
                {oauthLoading === 'google' ? (
                  <svg className="animate-spin w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span className="text-slate-600 text-sm font-medium">Google</span>
              </button>

              <button
                onClick={handleGithub}
                disabled={busy}
                className="flex items-center justify-center gap-2.5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-60"
              >
                {oauthLoading === 'github' ? (
                  <svg className="animate-spin w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                )}
                <span className="text-slate-600 text-sm font-medium">GitHub</span>
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-slate-500 text-sm mt-6">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* ── Right: Visual ── */}
        <div
          className="hidden md:flex w-[55%] relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #dbeafe 0%, #eff6ff 50%, #e0f2fe 100%)' }}
        >
          <AuthVisual />
        </div>
      </div>
    </div>
  )
}
