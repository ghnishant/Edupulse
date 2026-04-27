import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Upload, FileText, CheckCircle } from "lucide-react"

export function useRecentActivity() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchActivities = useCallback(async () => {
    try {
      const supabase = createClient()
      
      // 1. Fetch recent documents
      const { data: documents } = await supabase
        .from("documents")
        .select("id, name, created_at, user_id, profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(5)

      // 2. Fetch recent reports
      const { data: reports } = await supabase
        .from("reports")
        .select("id, title, created_at, author, status")
        .order("created_at", { ascending: false })
        .limit(5)

      const docActivities = documents?.map(doc => ({
        id: doc.id,
        user: (doc.profiles as any)?.full_name || "Unknown User",
        initials: (doc.profiles as any)?.full_name?.split(' ').map((n: any) => n[0]).join('') || "?",
        action: "uploaded",
        target: doc.name,
        type: "document",
        time: new Date(doc.created_at).toLocaleDateString(),
        timestamp: new Date(doc.created_at).getTime(),
        icon: Upload,
      })) || []

      const reportActivities = reports?.map(report => ({
        id: report.id,
        user: report.author || "System",
        initials: report.author?.split(' ').map((n: any) => n[0]).join('') || "S",
        action: report.status === 'published' ? "published" : "generated",
        target: report.title,
        type: "report",
        time: new Date(report.created_at).toLocaleDateString(),
        timestamp: new Date(report.created_at).getTime(),
        icon: FileText,
      })) || []

      // Combine and sort by timestamp
      const combined = [...docActivities, ...reportActivities]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 8)

      setActivities(combined)
      setLoading(false)
    } catch (err) {
      console.error("Activity Fetch Error:", err)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  return { activities, loading, refresh: fetchActivities }
}
