'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard, BookOpen, Plus, FlaskConical, Trophy,
  Settings, HelpCircle, LogOut, Search, Mail, Bell, Menu, X,
} from 'lucide-react'

type Role = 'ENSEIGNANT' | 'ETUDIANT'

const NAV_ENSEIGNANT = [
  {
    label: 'Tableau de bord',
    href: '/enseignant',
    icon: LayoutDashboard,
    isActive: (p: string) => p === '/enseignant',
  },
  {
    label: 'Mes Évaluations',
    href: '/enseignant/evaluations',
    icon: BookOpen,
    isActive: (p: string) =>
      p.startsWith('/enseignant/evaluations') &&
      !p.startsWith('/enseignant/evaluations/creer'),
  },
  {
    label: 'Créer un QCM',
    href: '/enseignant/evaluations/creer',
    icon: Plus,
    isActive: (p: string) => p.startsWith('/enseignant/evaluations/creer'),
  },
]

const NAV_ETUDIANT = [
  {
    label: 'Tableau de bord',
    href: '/etudiant',
    icon: LayoutDashboard,
    isActive: (p: string) => p === '/etudiant',
  },
  {
    label: 'Tests disponibles',
    href: '/etudiant/tests',
    icon: FlaskConical,
    isActive: (p: string) => p.startsWith('/etudiant/tests'),
  },
  {
    label: 'Mes Résultats',
    href: '/etudiant/resultats',
    icon: Trophy,
    isActive: (p: string) => p.startsWith('/etudiant/resultats'),
  },
]

export default function DashboardShell({
  children,
  role,
}: {
  children: React.ReactNode
  role: Role
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const nav = role === 'ENSEIGNANT' ? NAV_ENSEIGNANT : NAV_ETUDIANT
  const initials = `${user?.prenom?.[0] ?? ''}${user?.nom?.[0] ?? ''}`
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed md:relative z-40 md:z-auto
        w-64 md:w-52 h-full
        bg-white border-r border-slate-100 flex flex-col shrink-0
        transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Logo */}
        <div className="flex items-center justify-between gap-2.5 px-5 py-4 border-b border-slate-50">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="QCMPlatform" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-slate-800 text-sm tracking-tight">QCMPlatform</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-5">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest px-5 mb-2">
            Menu
          </p>

          {nav.map(item => {
            const active = item.isActive(pathname)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 pl-5 pr-3 py-2.5 text-sm transition-all ${
                  active
                    ? 'text-violet-700 font-semibold bg-violet-50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-violet-600 rounded-r-full" />
                )}
                <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-violet-600' : ''}`} />
                {item.label}
              </Link>
            )
          })}

          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest px-5 mt-6 mb-2">
            Général
          </p>

          {[
            { label: 'Paramètres', icon: Settings },
            { label: 'Aide', icon: HelpCircle },
          ].map(item => (
            <button
              key={item.label}
              className="relative flex items-center gap-3 pl-5 pr-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all w-full"
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="relative flex items-center gap-3 pl-5 pr-3 py-2.5 text-sm text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all w-full"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Déconnexion
          </button>
        </nav>

        {/* Bottom promo card */}
        <div className="p-3">
          <div className="bg-violet-900 rounded-2xl p-4 text-white">
            <p className="text-xs font-bold mb-1 leading-snug">Téléchargez notre app mobile</p>
            <p className="text-[10px] text-violet-300 mb-3 leading-snug">
              Évaluez où que vous soyez
            </p>
            <button className="w-full py-1.5 bg-white text-violet-800 text-[11px] font-semibold rounded-lg hover:bg-violet-50 transition-colors">
              Télécharger
            </button>
          </div>
        </div>
      </aside>

      {/* ── Right side ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 md:px-6 gap-3 shrink-0">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-violet-600 transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-50 sm:max-w-65">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                className="flex-1 text-sm bg-transparent outline-none text-slate-600 placeholder-slate-300 min-w-0"
                placeholder="Rechercher..."
                readOnly
              />
              <kbd className="hidden sm:block text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-mono shrink-0">
                ⌘F
              </kbd>
            </div>
          </div>

          {/* Icons + user */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center text-slate-400 hover:text-violet-600 transition-colors">
              <Mail className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-violet-600 transition-colors">
              <Bell className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-100 ml-1">
              <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs">{initials}</span>
              </div>
              <div className="hidden lg:block leading-tight">
                <p className="text-sm font-semibold text-slate-800">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-[11px] text-slate-400">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  )
}
