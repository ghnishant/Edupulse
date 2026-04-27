import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

export function useDocuments() {
  const [documents, setDocuments] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    processed: 0,
    processing: 0,
    storage: "0 KB",
  })
  const [loading, setLoading] = useState(true)

  const fetchDocs = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from("documents")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false })

      if (error) throw error

      // 2. Fetch Storage Stats (Optional/Resilient)
      let storageUsed = "0 MB"
      try {
        const { data: files, error: storageError } = await supabase
          .storage
          .from("documents")
          .list()
        
        if (!storageError && files) {
          const totalBytes = files.reduce((acc, file) => acc + (file.metadata?.size || 0), 0)
          storageUsed = `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`
        }
      } catch (err) {
        console.warn("Storage bucket 'documents' not found. Please create it in Supabase dashboard.")
      }

      if (data) {
        const mapped = data.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          type: doc.file_type || (doc.name.endsWith('.pdf') ? 'pdf' : 'xlsx'),
          category: doc.category || "academic",
          size: doc.file_size ? `${(doc.file_size / (1024 * 1024)).toFixed(1)} MB` : "0 MB",
          status: doc.status || "completed",
          uploadedBy: doc.profiles?.full_name || "Unknown",
          uploadedAt: doc.created_at,
          file_url: doc.file_url,
        }))

        setDocuments(mapped)
        setStats({
          total: mapped.length,
          processed: mapped.filter((d: any) => d.status === "completed").length,
          processing: mapped.filter((d: any) => d.status === "processing").length,
          storage: storageUsed,
        })
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDocs()
  }, [fetchDocs])

  return { documents, stats, loading, refresh: fetchDocs }
}
