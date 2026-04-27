import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar user={user} profile={profile} />
      <div className="flex-1 flex flex-col md:ml-64">
        <DashboardHeader user={user} profile={profile} />
        <main className="flex-1 p-4 md:p-6 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  )
}
