"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, GraduationCap, BookOpen, Award, FileText, Building, Loader2 } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

export function KPICards() {
  const { 
    totalColleges,
    totalStudents, 
    institutionScore,
    bestCollege,
    lowestCollege,
    placementRate,
    passPercentage,
    attendanceRate,
    loading 
  } = useDashboardStats()

  const kpis = [
    {
      label: "Total Colleges",
      value: totalColleges.toLocaleString(),
      icon: Building,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Total Students",
      value: totalStudents.toLocaleString(),
      icon: Users,
      color: "bg-accent/10 text-accent",
    },
    {
      label: "Institution Score",
      value: `${institutionScore}/100`,
      icon: Award,
      color: "bg-warning/10 text-warning",
    },
    {
      label: "Best College",
      value: bestCollege,
      icon: GraduationCap,
      color: "bg-success/10 text-success",
    },
    {
      label: "Lowest College",
      value: lowestCollege,
      icon: TrendingDown,
      color: "bg-destructive/10 text-destructive",
    },
    {
      label: "Placement Rate",
      value: `${placementRate}%`,
      icon: TrendingUp,
      color: "bg-info/10 text-info",
    },
    {
      label: "Pass Percentage",
      value: `${passPercentage}%`,
      icon: FileText,
      color: "bg-success/10 text-success",
    },
    {
      label: "Attendance Rate",
      value: `${attendanceRate}%`,
      icon: BookOpen,
      color: "bg-primary/10 text-primary",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[140px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto col-span-full" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="glass hover:shadow-lg transition-shadow h-full">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className={`p-2 rounded-lg ${kpi.color} w-fit mb-4`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold truncate">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
