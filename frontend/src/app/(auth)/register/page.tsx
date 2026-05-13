'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { registerWithEmail } from '@/services/auth.service'
import { Role } from '@/types'
import AuthVisual from '@/components/auth/AuthVisual'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', password: '', role: 'ETUDIANT' as Role,
  })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    setLoading(true)
    try {
      await registerWithEmail(form.email, form.password, form.nom, form.prenom, form.role)
      toast.success('Compte créé ! Vérifiez votre email puis connectez-vous.')
      router.push('/login')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la création du compte'
      toast.error(msg.includes('email-already-in-use') ? 'Email déjà utilisé' : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8"
      style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 30%, #e3f2fd 70%, #e8eaf6 100%)' }}>

      {/* Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex min-h-170">

        {/* ── Left: Form ── */}
        <div className="flex-1 flex flex-col p-8 md:p-10 relative overflow-hidden">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-auto">
            <Image src="/logo.png" alt="QCMPlatform" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-slate-700 text-base tracking-tight">QCMPlatform</span>
          </div>

          {/* Center content */}
          <div className="flex flex-col items-center justify-center flex-1 py-4">

            {/* Grid pattern behind icon */}
            <div className="relative mb-5">
              <div
                className="absolute inset-0 -m-8 rounded-xl"
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
              <div className="relative w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 z-10">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-1">Créer votre compte !</h1>
            <p className="text-slate-400 text-sm mb-6 text-center">
              Rejoignez la plateforme et commencez à évaluer intelligemment
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-3.5">

              {/* Prénom + Nom */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Prénom', field: 'prenom', placeholder: 'Jean' },
                  { label: 'Nom', field: 'nom', placeholder: 'Dupont' },
                ].map(f => (
                  <div key={f.field} className="flex flex-col gap-1.5">
                    <label className="text-slate-600 text-sm font-medium">{f.label}</label>
                    <input
                      type="text"
                      value={form[f.field as 'prenom' | 'nom']}
                      onChange={set(f.field)}
                      placeholder={f.placeholder}
                      required
                      disabled={loading}
                      className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 text-sm font-medium">Email</label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="ex. prenom@gmail.com"
                    required
                    disabled={loading}
                    autoComplete="email"
                    className="flex-1 text-sm text-slate-700 outline-none placeholder-slate-300 bg-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 text-sm font-medium">Mot de passe</label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Min. 6 caractères"
                    required
                    disabled={loading}
                    autoComplete="new-password"
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

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 text-sm font-medium">Je suis</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['ETUDIANT', 'ENSEIGNANT'] as Role[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, role: r }))}
                      disabled={loading}
                      className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        form.role === r
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {r === 'ETUDIANT' ? '🎓 Étudiant' : '👨‍🏫 Enseignant'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all disabled:opacity-60 shadow-lg shadow-blue-500/30 mt-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : null}
                {loading ? 'Création...' : 'Créer mon compte'}
              </button>
            </form>

            {/* Login link */}
            <p className="text-slate-500 text-sm mt-5">
              Déjà inscrit ?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                Se connecter
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
