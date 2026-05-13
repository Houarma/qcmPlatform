import DashboardShell from '@/components/dashboard/DashboardShell'

export default function EnseignantLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="ENSEIGNANT">{children}</DashboardShell>
}
