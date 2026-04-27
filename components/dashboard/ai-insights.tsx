"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Lightbulb,
  Target,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

export function AIInsights() {
  const { totalStudents, facultyMembers, researchPapers, naacScore, loading } = useDashboardStats()

  if (loading) {
    return (
      <Card className="glass">
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  const insights = [
    {
      type: "success",
      icon: CheckCircle2,
      title: `Research Output: ${researchPapers} Papers`,
      description: `Your institution has a strong research focus with ${researchPapers} published works. Keep it up!`,
      action: "View Analytics",
      href: "/dashboard/analytics",
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Faculty-Student Ratio",
      description: `Current ratio is 1:${Math.round(totalStudents/facultyMembers) || 0}. Recommended for NAAC A++ is 1:15.`,
      action: "Review Departments",
      href: "/dashboard/analytics",
    },
    {
      type: "info",
      icon: Lightbulb,
      title: "NAAC Score Insight",
      description: `Your current score is ${naacScore}. Improving infrastructure documentation could push this above 3.5.`,
      action: "View Reports",
      href: "/dashboard/reports",
    },
  ]

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "success": return "border-success/30 bg-success/5"
      case "warning": return "border-warning/30 bg-warning/5"
      case "info": return "border-info/30 bg-info/5"
      default: return "border-border"
    }
  }

  const getIconStyles = (type: string) => {
    switch (type) {
      case "success": return "text-success"
      case "warning": return "text-warning"
      case "info": return "text-info"
      default: return "text-muted-foreground"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>AI Insights</CardTitle>
              <p className="text-sm text-muted-foreground">
                Recommendations based on your live data
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getTypeStyles(insight.type)}`}
              >
                <div className="flex gap-3">
                  <div className={`mt-0.5 ${getIconStyles(insight.type)}`}>
                    <insight.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.description}
                    </p>
                    <Button
                      asChild
                      variant="link"
                      size="sm"
                      className="h-auto p-0 mt-2 text-primary"
                    >
                      <Link href={insight.href}>
                        {insight.action}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
