import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

export function useReports() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      let isAdmin = false
      let instId = null
      
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("institution_id, role").eq("id", user.id).single()
        isAdmin = profile?.role === "super_admin" || profile?.role === "institution_admin"
        instId = profile?.institution_id
      }
      
      let query = supabase
        .from("reports")
        .select("*, profiles(full_name)")
        .order("updated_at", { ascending: false })

      if (!isAdmin && instId) {
        query = query.eq("institution_id", instId)
      }

      const { data, error } = await query

      if (error) throw error

      if (data) {
        const mapped = data.map(report => ({
          id: report.id,
          title: report.title,
          type: report.type,
          status: report.status,
          progress: report.progress || 0,
          lastUpdated: new Date(report.updated_at).toLocaleDateString(),
          author: (report.profiles as any)?.full_name || "Unknown",
        }))
        setReports(mapped)
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return { reports, loading, refresh: fetchReports }
}
