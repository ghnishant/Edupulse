"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, GraduationCap, BookOpen, Award, FileText, Building } from "lucide-react"

const kpis = [
  {
    label: "Total Students",
    value: "5,120",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Faculty Members",
    value: "240",
    change: "+8%",
    trend: "up",
    icon: GraduationCap,
    color: "bg-accent/10 text-accent",
  },
  {
    label: "Research Papers",
    value: "156",
    change: "+23%",
    trend: "up",
    icon: BookOpen,
    color: "bg-success/10 text-success",
  },
  {
    label: "NAAC Score",
    value: "3.42",
    change: "+0.15",
    trend: "up",
    icon: Award,
    color: "bg-warning/10 text-warning",
  },
  {
    label: "Documents",
    value: "1,284",
    change: "+34%",
    trend: "up",
    icon: FileText,
    color: "bg-info/10 text-info",
  },
  {
    label: "Departments",
    value: "12",
    change: "0",
    trend: "neutral",
    icon: Building,
    color: "bg-muted text-muted-foreground",
  },
]

export function KPICards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="glass hover:shadow-lg transition-shadow">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${kpi.color}`}>
                  <kpi.icon className="w-4 h-4" />
                </div>
                {kpi.trend !== "neutral" && (
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${
                    kpi.trend === "up" ? "text-success" : "text-destructive"
                  }`}>
                    {kpi.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{kpi.change}</span>
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
