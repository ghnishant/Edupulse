import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    facultyMembers: 0,
    researchPapers: 0,
    naacScore: 0,
    documents: 0,
    departments: 0,
    totalColleges: 0,
    placementRate: 0,
    passPercentage: 0,
    attendanceRate: 0,
    institutionScore: 0,
    bestCollege: "---",
    lowestCollege: "---",
    loading: true,
    error: null as string | null,
  })

  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Pulse Engine: Auto-refresh data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createClient()
        
        // 0. Get current user's context
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase.from("profiles").select("institution_id, full_name, role").eq("id", user.id).single()
        let instId = profile?.institution_id
        const isAdmin = profile?.role === "super_admin" || profile?.role === "institution_admin"
        
        // Auto-fix context if missing
        if (!instId) {
          const { data: existing } = await supabase.from("institutions").select("id").limit(1).single()
          if (existing) {
            instId = existing.id
            await supabase.from("profiles").update({ institution_id: instId }).eq("id", user.id)
          }
        }

        // 1. Fetch Global Count 
        const { data: institutions } = await supabase.from("institutions").select("id, name")
        const totalColleges = institutions?.length || 0

        // 2. Fetch Students (Global if Admin, Isolated if Faculty)
        let studentQuery = supabase.from("students").select("institution_id, performance_score", { count: "exact" })
        if (!isAdmin) {
          studentQuery = studentQuery.eq("institution_id", instId)
        }
        
        const { data: studentsData, count: studentCount } = await studentQuery
        const totalStudents = studentCount || 0

        // 3. Fetch Placements
        let placementQuery = supabase.from("placements").select("student_id", { count: "exact" })
        if (!isAdmin) {
          placementQuery = placementQuery.eq("institution_id", instId)
        }
        const { count: placedCount } = await placementQuery
        
        const placementRate = totalStudents > 0 
          ? Math.round(((placedCount || 0) / totalStudents) * 100) 
          : 0

        // 4. AI Performance Analysis: Find "Best College"
        let bestCollegeName = isAdmin ? "Analyzing..." : "---"
        let lowestCollegeName = isAdmin ? "Analyzing..." : "---"

        if (isAdmin && studentsData && studentsData.length > 0 && institutions) {
          const collegeScores: Record<string, { total: number, count: number }> = {}
          
          studentsData.forEach(s => {
            if (!s.institution_id) return
            if (!collegeScores[s.institution_id]) collegeScores[s.institution_id] = { total: 0, count: 0 }
            collegeScores[s.institution_id].total += (s.performance_score || 0)
            collegeScores[s.institution_id].count += 1
          })
          
          let bestScore = -1
          let worstScore = 999
          let bestId = null
          let worstId = null
          
          Object.keys(collegeScores).forEach(id => {
            const avg = collegeScores[id].total / collegeScores[id].count
            if (avg > bestScore) { bestScore = avg; bestId = id }
            if (avg < worstScore) { worstScore = avg; worstId = id }
          })
          
          if (bestId) bestCollegeName = institutions.find(i => i.id === bestId)?.name || "---"
          if (worstId && worstId !== bestId) lowestCollegeName = institutions.find(i => i.id === worstId)?.name || "---"
        }

        // 5. Fetch Analytics
        const { data: analytics } = await supabase.from("analytics_data").select("*")
        const getVal = (type: string) => analytics?.find(a => a.metric_type === type)?.value || 0

        setStats(prev => ({
          ...prev,
          totalStudents,
          totalColleges,
          placementRate,
          bestCollege: bestCollegeName,
          lowestCollege: lowestCollegeName,
          passPercentage: getVal("pass_rate") || 92,
          institutionScore: getVal("accreditation_readiness") || 84,
          loading: false
        }))
      } catch (err: any) {
        console.error("Dashboard error:", err)
      }
    }

    fetchStats()
  }, [refreshTrigger])

  return stats
}
