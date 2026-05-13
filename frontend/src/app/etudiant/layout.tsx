import DashboardShell from '@/components/dashboard/DashboardShell'

export default function EtudiantLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="ETUDIANT">{children}</DashboardShell>
}
