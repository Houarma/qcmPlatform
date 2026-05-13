'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamMember {
  name: string
  role: string
  initials: string
  from: string
  to: string
  photo: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'Génération par IA',
    desc: 'Créez des QCM complets en quelques secondes. Saisissez votre sujet, Groq AI génère les questions, les choix et les bonnes réponses automatiquement.',
    gradient: 'from-violet-600/20 to-indigo-600/10',
    border: 'border-violet-500/20',
    iconColor: 'text-violet-400',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Correction Instantanée',
    desc: 'Dès la soumission du test, le score est calculé automatiquement. Aucune intervention manuelle — les résultats sont disponibles en temps réel.',
    gradient: 'from-blue-600/20 to-cyan-600/10',
    border: 'border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Analyses Détaillées',
    desc: "Visualisez les taux de réussite, identifiez les lacunes par question et mesurez la progression de chaque étudiant grâce aux analyses du service ML.",
    gradient: 'from-cyan-600/20 to-teal-600/10',
    border: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    title: 'Notifications Email',
    desc: 'À chaque publication de test, tous les étudiants inscrits reçoivent automatiquement un email de notification. Aucun étudiant ne rate un examen.',
    gradient: 'from-pink-600/20 to-rose-600/10',
    border: 'border-pink-500/20',
    iconColor: 'text-pink-400',
  },
]

const BENEFITS = [
  { icon: '🧠', title: 'IA Groq Intégrée', desc: 'Génération ultra-rapide de QCM pertinents via LLaMA 3' },
  { icon: '🔐', title: 'Auth Firebase', desc: 'Connexion sécurisée avec vérification email, Google et GitHub' },
  { icon: '✅', title: 'Auto-Correction', desc: 'Notation automatique instantanée à la soumission' },
  { icon: '📊', title: 'Analytics ML', desc: "Analyses intelligentes : lacunes, difficultés, taux d'échec" },
  { icon: '📧', title: 'Emails Auto', desc: 'Notifications automatiques aux étudiants à chaque nouveau test' },
  { icon: '👥', title: 'Double Interface', desc: 'Espaces dédiés et sécurisés pour enseignants et étudiants' },
]

const STEPS = [
  {
    num: '01',
    title: 'Créez votre compte',
    desc: "Inscrivez-vous en tant qu'enseignant ou étudiant. Vérifiez votre email et vous êtes prêt.",
  },
  {
    num: '02',
    title: "Générez un QCM par l'IA",
    desc: "L'enseignant saisit le titre et les objectifs du test. Groq AI génère automatiquement les questions et réponses.",
  },
  {
    num: '03',
    title: 'Publiez et notifiez',
    desc: "En un clic, publiez le test. Tous les étudiants reçoivent immédiatement un email de notification.",
  },
  {
    num: '04',
    title: 'Analysez les résultats',
    desc: "Consultez les scores, les lacunes identifiées par le ML et le taux de réussite par question.",
  },
]

const TEAM: TeamMember[] = [
  {
    name: "Souday's Koulagna",
    role: 'Ingénieur Data Science',
    initials: 'SK',
    from: 'from-violet-500',
    to: 'to-indigo-600',
    photo: '/team/member-1.jpeg',
  },
  {
    name: 'Anne Nioula',
    role: 'Ingénieur Data Science',
    initials: 'AN',
    from: 'from-blue-500',
    to: 'to-cyan-600',
    photo: '/team/member-2.jpeg',
  },
  {
    name: 'Haphiz Ouarma',
    role: 'Ingénieur Data Science',
    initials: 'HO',
    from: 'from-cyan-500',
    to: 'to-teal-600',
    photo: '/team/member-3.jpeg',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useScrollInView() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  return { ref, inView }
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 },
  }),
}

// ─── Typewriter ───────────────────────────────────────────────────────────────

function TypewriterText({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + i * 0.032, duration: 0.05 }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </span>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 bg-[#040b18]/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="flex items-center gap-2.5">
        <Image src="/logo.png" alt="QCMPlatform" width={32} height={32} className="rounded-lg" />
        <span className="text-white font-bold text-base sm:text-lg tracking-tight">
          QCM<span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Platform</span>
        </span>
      </div>
      <Link
        href="/login"
        className="px-4 sm:px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-violet-500/25"
      >
        Commencer
      </Link>
    </motion.header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const LINE1 = 'Transformez vos Évaluations'
const LINE2 = "avec l'Intelligence Artificielle"

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden px-4">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-[15%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-violet-700/15 blur-[160px]" />
        <div className="absolute top-1/3 right-[10%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full bg-blue-700/15 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[800px] h-[200px] sm:h-[300px] rounded-full bg-cyan-800/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7 inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs sm:text-sm text-center"
      >
        <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shrink-0" />
        Plateforme académique intelligente · Propulsée par Groq AI
      </motion.div>

      {/* Typewriter headline */}
      <h1 className="text-3xl sm:text-5xl md:text-[68px] font-bold text-center text-white max-w-4xl leading-[1.12] tracking-tight">
        <TypewriterText text={LINE1} delay={0.3} />
        <br />
        <TypewriterText
          text={LINE2}
          delay={0.3 + LINE1.length * 0.032 + 0.1}
          className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent"
        />
      </h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="mt-6 text-base sm:text-lg text-slate-400 text-center max-w-2xl leading-relaxed"
      >
        Créez, publiez et analysez des QCM intelligents en quelques secondes.
        Une solution complète pour les enseignants et les étudiants.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.8 }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
      >
        <Link
          href="/login"
          className="w-full sm:w-auto text-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-base hover:opacity-90 hover:scale-105 transition-all shadow-2xl shadow-violet-500/30"
        >
          Commencer gratuitement
        </Link>
        <a
          href="#features"
          className="w-full sm:w-auto text-center px-8 py-3.5 rounded-xl border border-white/10 text-slate-300 text-base hover:border-white/30 hover:text-white transition-all"
        >
          Découvrir →
        </a>
      </motion.div>

      {/* Dashboard mockup */}
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 2.0, ease: 'easeOut' }}
        className="mt-16 sm:mt-20 w-full max-w-5xl mx-auto relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/20 via-blue-600/10 to-transparent blur-3xl rounded-3xl" />
        <DashboardMockup />
      </motion.div>
    </section>
  )
}

function DashboardMockup() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#080f22]/95 backdrop-blur shadow-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 sm:px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <div className="w-3 h-3 rounded-full bg-green-500/60" />
        <div className="ml-4 sm:ml-6 flex-1 max-w-xs h-6 rounded-md bg-white/5 flex items-center px-3">
          <span className="text-slate-500 text-xs">localhost/enseignant</span>
        </div>
      </div>
      <div className="flex">
        {/* Sidebar — hidden on xs, shown on sm+ */}
        <div className="hidden sm:flex w-40 md:w-52 border-r border-white/5 p-4 flex-col gap-1 bg-white/[0.01] shrink-0">
          <div className="text-slate-600 text-xs font-medium uppercase tracking-wider mb-3 px-2">Navigation</div>
          {[
            { label: 'Dashboard', active: true },
            { label: 'Mes QCM', active: false },
            { label: 'Créer un QCM', active: false },
            { label: 'Analyses', active: false },
          ].map(item => (
            <div
              key={item.label}
              className={`px-3 py-2 rounded-lg text-xs font-medium ${
                item.active ? 'bg-violet-600/25 text-violet-300 border border-violet-500/20' : 'text-slate-500'
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div className="flex-1 p-3 sm:p-5 flex flex-col gap-4 min-w-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: 'QCM publiés', value: '12', sub: '+3 ce mois', color: 'from-violet-600/20 to-violet-600/5', border: 'border-violet-500/15', text: 'text-violet-400' },
              { label: 'Étudiants actifs', value: '48', sub: 'sur 52 inscrits', color: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-500/15', text: 'text-blue-400' },
              { label: 'Taux de réussite', value: '78%', sub: '↑ 5% vs dernier', color: 'from-cyan-600/20 to-cyan-600/5', border: 'border-cyan-500/15', text: 'text-cyan-400' },
            ].map(s => (
              <div key={s.label} className={`rounded-xl bg-gradient-to-br ${s.color} border ${s.border} p-2 sm:p-4`}>
                <div className="text-lg sm:text-2xl font-bold text-white mb-0.5">{s.value}</div>
                <div className="text-slate-400 text-[10px] sm:text-xs">{s.label}</div>
                <div className={`text-[10px] sm:text-xs mt-1 ${s.text} hidden sm:block`}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            <div className="col-span-3 rounded-xl border border-white/5 bg-white/[0.02] p-2 sm:p-4">
              <div className="text-slate-400 text-xs font-medium mb-3">Scores moyens par test</div>
              <div className="flex items-end gap-1 sm:gap-1.5 h-16 sm:h-20">
                {[55, 72, 60, 85, 68, 91, 78, 88, 74, 96].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-600 to-blue-500 opacity-75" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="col-span-2 rounded-xl border border-white/5 bg-white/[0.02] p-2 sm:p-4">
              <div className="text-slate-400 text-xs font-medium mb-3">Tests récents</div>
              {['Algorithmique', 'Bases de données', 'Réseaux'].map((test, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <span className="text-slate-300 text-xs truncate">{test}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ml-2 shrink-0 ${i === 0 ? 'bg-green-500/15 text-green-400' : 'bg-violet-500/15 text-violet-400'}`}>
                    {i === 0 ? 'Actif' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────

function AboutSection() {
  const { ref, inView } = useScrollInView()
  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto text-center">
      <motion.p variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'}
        className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-4">
        À propos de la plateforme
      </motion.p>
      <motion.p variants={fadeUp} custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'}
        className="text-slate-300 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
        Nous sommes une équipe d'ingénieurs Data Science qui croient que l'IA peut{' '}
        <span className="text-white font-semibold">révolutionner l'évaluation académique</span>.
        Notre plateforme automatise la création de QCM, la correction et l'analyse des résultats —
        pour que les enseignants se concentrent sur{' '}
        <span className="text-white font-semibold">ce qui compte vraiment : enseigner</span>.
      </motion.p>
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate={inView ? 'visible' : 'hidden'}
        className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {[
          { label: 'Next.js', color: 'border-slate-500/40 text-slate-300' },
          { label: 'Spring Boot', color: 'border-green-500/40 text-green-400' },
          { label: 'Firebase', color: 'border-yellow-500/40 text-yellow-400' },
          { label: 'PostgreSQL', color: 'border-blue-500/40 text-blue-400' },
          { label: 'FastAPI', color: 'border-cyan-500/40 text-cyan-400' },
          { label: 'Groq AI', color: 'border-violet-500/40 text-violet-400' },
        ].map(t => (
          <span key={t.label} className={`px-3 sm:px-4 py-2 rounded-full border text-sm font-medium ${t.color}`}>{t.label}</span>
        ))}
      </motion.div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────

function FeaturesSection() {
  const { ref, inView } = useScrollInView()
  return (
    <section id="features" ref={ref} className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-800/10 blur-[160px]" />
      </div>
      <div className="max-w-6xl mx-auto relative">
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="text-center mb-12 sm:mb-16">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Fonctionnalités</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Débloquez de Nouvelles Possibilités
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">avec l'IA</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} variants={fadeUp} custom={i + 1} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`p-5 sm:p-6 rounded-2xl border ${f.border} bg-gradient-to-br ${f.gradient} group cursor-default`}>
              <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 ${f.iconColor} group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Dashboard Preview ────────────────────────────────────────────────────────

function PreviewSection() {
  const { ref, inView } = useScrollInView()
  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="text-center mb-12 sm:mb-16">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-4">Aperçu</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Ce qu'on a construit pour vous</h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">Une interface soignée, pensée pour la simplicité. Côté enseignant et côté étudiant.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <motion.div variants={fadeUp} custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="rounded-2xl border border-white/8 bg-[#080f22]/80 overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
              <span className="text-slate-400 text-xs font-medium">Interface Enseignant</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400">Admin</span>
            </div>
            <div className="p-4 sm:p-5 flex flex-col gap-3">
              <div className="h-20 sm:h-24 rounded-xl bg-gradient-to-br from-violet-600/15 to-blue-600/10 border border-violet-500/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">12</div>
                  <div className="text-violet-400 text-xs">QCM générés ce mois</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/3 border border-white/5 p-3 text-center">
                  <div className="text-white font-bold text-xl">48</div>
                  <div className="text-slate-500 text-xs">Étudiants</div>
                </div>
                <div className="rounded-xl bg-white/3 border border-white/5 p-3 text-center">
                  <div className="text-white font-bold text-xl">78%</div>
                  <div className="text-slate-500 text-xs">Réussite moy.</div>
                </div>
              </div>
              <div className="rounded-xl bg-white/3 border border-white/5 p-3">
                <div className="text-slate-400 text-xs mb-2">Générer un QCM par IA</div>
                <div className="h-6 rounded bg-white/5 mb-2" />
                <div className="h-6 w-24 rounded bg-gradient-to-r from-violet-600 to-blue-600 opacity-70" />
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} custom={2} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="rounded-2xl border border-white/8 bg-[#080f22]/80 overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
              <span className="text-slate-400 text-xs font-medium">Interface Étudiant</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Student</span>
            </div>
            <div className="p-4 sm:p-5 flex flex-col gap-3">
              <div className="h-20 sm:h-24 rounded-xl bg-gradient-to-br from-blue-600/15 to-cyan-600/10 border border-blue-500/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">84%</div>
                  <div className="text-blue-400 text-xs">Votre score moyen</div>
                </div>
              </div>
              <div className="rounded-xl bg-white/3 border border-white/5 p-3">
                <div className="text-slate-400 text-xs mb-2">Tests disponibles</div>
                {['Algorithmique – Ch.4', 'Bases de données'].map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-slate-300 text-xs">{t}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">Nouveau</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-white/3 border border-white/5 p-3">
                <div className="text-slate-400 text-xs mb-1">Progression</div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Benefits ─────────────────────────────────────────────────────────────────

function BenefitsSection() {
  const { ref, inView } = useScrollInView()
  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-800/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-800/10 blur-[120px]" />
      </div>
      <div className="max-w-6xl mx-auto relative">
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="text-center mb-12 sm:mb-16">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-4">Avantages</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Tout ce dont vous avez besoin</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((b, i) => (
            <motion.div key={b.title} variants={fadeUp} custom={i * 0.5 + 1} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-5 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15 transition-all">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="text-white font-semibold mb-1.5">{b.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Globe SVG ────────────────────────────────────────────────────────────────

function GlobeSVG() {
  return (
    <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
      <g stroke="#6366f1" strokeWidth="0.7">
        <circle cx="200" cy="200" r="194" opacity="0.5" />
        <ellipse cx="200" cy="120" rx="158" ry="40" opacity="0.35" />
        <ellipse cx="200" cy="160" rx="182" ry="52" opacity="0.35" />
        <ellipse cx="200" cy="200" rx="194" ry="62" opacity="0.35" />
        <ellipse cx="200" cy="240" rx="182" ry="52" opacity="0.35" />
        <ellipse cx="200" cy="280" rx="158" ry="40" opacity="0.35" />
        <ellipse cx="200" cy="320" rx="110" ry="28" opacity="0.25" />
        <ellipse cx="200" cy="80"  rx="110" ry="28" opacity="0.25" />
        <ellipse cx="200" cy="200" rx="40"  ry="194" opacity="0.3" />
        <ellipse cx="200" cy="200" rx="100" ry="194" opacity="0.3" />
        <ellipse cx="200" cy="200" rx="158" ry="194" opacity="0.3" />
        <ellipse cx="200" cy="200" rx="194" ry="194" opacity="0.2" />
      </g>
    </svg>
  )
}

// ─── Team Card ────────────────────────────────────────────────────────────────

function TeamCard({ member, active }: { member: TeamMember; active: boolean }) {
  return (
    <div
      className="w-64 sm:w-72 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      style={{
        background: 'linear-gradient(145deg, #0c1535 0%, #0e1040 100%)',
        border: active ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
        minHeight: 320,
        boxShadow: active
          ? '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.15)'
          : '0 20px 50px rgba(0,0,0,0.5)',
      }}
    >
      <div className="relative flex-1 overflow-hidden" style={{ minHeight: 200 }}>
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 640px) 256px, 288px"
        />
      </div>
      <div className="px-6 pb-6 flex items-center justify-between">
        <div>
          <div className="text-white font-semibold text-sm">{member.name}</div>
          <div className="text-violet-400 text-xs mt-0.5 font-medium">{member.role}</div>
        </div>
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${member.from} ${member.to} flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0`}
        >
          {member.initials}
        </div>
      </div>
    </div>
  )
}

// ─── Team Section ─────────────────────────────────────────────────────────────

function TeamSection() {
  const { ref, inView } = useScrollInView()
  const [active, setActive] = useState(0)
  const total = TEAM.length

  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % total), 3800)
    return () => clearInterval(id)
  }, [total])

  const getStyle = (index: number) => {
    const diff = ((index - active) % total + total) % total
    const norm = diff > total / 2 ? diff - total : diff
    switch (norm) {
      case  0: return { x:    0, rotate:   0, scale: 1,    opacity: 1,    z: 10 }
      case  1: return { x:  290, rotate:  14, scale: 0.82, opacity: 0.6,  z:  5 }
      case -1: return { x: -290, rotate: -14, scale: 0.82, opacity: 0.6,  z:  5 }
      case  2: return { x:  510, rotate:  26, scale: 0.65, opacity: 0.28, z:  2 }
      case -2: return { x: -510, rotate: -26, scale: 0.65, opacity: 0.28, z:  2 }
      default: return { x:    0, rotate:   0, scale: 0.5,  opacity: 0,    z:  0 }
    }
  }

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, #040b18 100%)' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[640px] h-[400px] sm:h-[640px] pointer-events-none opacity-60">
        <GlobeSVG />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="flex items-center justify-center gap-5 mb-5">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-violet-400" />
              <div className="w-2 h-2 rounded-full bg-violet-400" />
            </div>
            <span className="text-violet-300 text-sm font-semibold tracking-[0.2em] uppercase">Notre Équipe</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-violet-400" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Rencontrez l'Équipe</h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Des ingénieurs Data Science passionnés qui construisent l'avenir de l'évaluation académique
          </p>
        </motion.div>

        {/* Mobile: single card centered */}
        <div className="sm:hidden flex flex-col items-center gap-6">
          <div className="transition-all duration-300">
            <TeamCard member={TEAM[active]} active />
          </div>
          <div className="flex items-center gap-2.5">
            {TEAM.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active ? 'w-9 h-2.5 bg-violet-500 shadow-lg shadow-violet-500/40' : 'w-2.5 h-2.5 bg-white/15 hover:bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: carousel */}
        <div className="hidden sm:block">
          <div className="relative flex items-center justify-center" style={{ height: 380 }}>
            {TEAM.map((member, i) => {
              const s = getStyle(i)
              return (
                <motion.div
                  key={i}
                  className="absolute cursor-pointer"
                  style={{ zIndex: s.z }}
                  animate={{ x: s.x, rotate: s.rotate, scale: s.scale, opacity: s.opacity }}
                  transition={{ type: 'spring', stiffness: 70, damping: 16 }}
                  onClick={() => setActive(i)}
                >
                  <TeamCard member={member} active={i === active} />
                </motion.div>
              )
            })}
          </div>
          <div className="flex items-center justify-center gap-2.5 mt-12">
            {TEAM.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active ? 'w-9 h-2.5 bg-violet-500 shadow-lg shadow-violet-500/40' : 'w-2.5 h-2.5 bg-white/15 hover:bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const { ref, inView } = useScrollInView()
  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="text-center mb-12 sm:mb-16">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Simple à utiliser</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Opérationnel en quelques minutes</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STEPS.map((step, i) => (
            <motion.div key={step.num} variants={fadeUp} custom={i + 1} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              className="relative p-6 rounded-2xl border border-white/8 bg-white/[0.03]">
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-5 h-px bg-gradient-to-r from-violet-500/40 to-transparent z-10" />
              )}
              <div className="text-5xl font-black bg-gradient-to-br from-violet-500/40 to-blue-500/20 bg-clip-text text-transparent mb-4">
                {step.num}
              </div>
              <h3 className="text-white font-semibold mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTASection() {
  const { ref, inView } = useScrollInView()
  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-blue-900/20" />
      </div>
      <div className="max-w-3xl mx-auto text-center relative">
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Boostez vos Évaluations
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">dès aujourd'hui</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-10">
            Rejoignez la plateforme et transformez la façon dont vous créez et gérez vos QCM.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-base sm:text-lg hover:opacity-90 hover:scale-105 transition-all shadow-2xl shadow-violet-500/30"
          >
            Commencer maintenant →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="QCMPlatform" width={28} height={28} className="rounded-lg" />
          <span className="text-white font-bold">
            QCM<span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Platform</span>
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Connexion</Link>
          <Link href="/register" className="text-slate-400 hover:text-white text-sm transition-colors">Inscription</Link>
        </div>
        <p className="text-slate-600 text-sm text-center sm:text-right">© 2026 QCMPlatform · Projet académique</p>
      </div>
    </footer>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#040b18] text-white">
      <Header />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <PreviewSection />
      <BenefitsSection />
      <TeamSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  )
}
