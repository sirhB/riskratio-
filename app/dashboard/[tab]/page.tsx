import { Dashboard } from "@/components/dashboard"

interface PageProps {
  params: { tab?: string }
}

export default function DashboardTabPage({ params }: PageProps) {
  const initialTab = params?.tab || "dashboard"
  return <Dashboard initialTab={initialTab} />
}


