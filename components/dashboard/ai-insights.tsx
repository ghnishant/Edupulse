"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Lightbulb,
  Target
} from "lucide-react"
import Link from "next/link"

const insights = [
  {
    type: "success",
    icon: CheckCircle2,
    title: "Research Output Up 23%",
    description: "Your institution has published 36 more papers compared to last year. Computer Science department leads with 45 publications.",
    action: "View Details",
    href: "/dashboard/analytics",
  },
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Faculty-Student Ratio Alert",
    description: "Electronics department has a ratio of 1:22, which is below the recommended 1:15 for NAAC A++ grade.",
    action: "Take Action",
    href: "/dashboard/departments",
  },
  {
    type: "info",
    icon: Lightbulb,
    title: "NAAC Recommendation",
    description: "To improve your infrastructure score, consider adding 3 more smart classrooms and 1 research lab by next quarter.",
    action: "View Plan",
    href: "/dashboard/reports",
  },
  {
    type: "target",
    icon: Target,
    title: "Placement Target On Track",
    description: "78% placement rate achieved. Need 22 more placements to reach the 85% target for this academic year.",
    action: "View Stats",
    href: "/dashboard/analytics",
  },
]

const getTypeStyles = (type: string) => {
  switch (type) {
    case "success":
      return "border-success/30 bg-success/5"
    case "warning":
      return "border-warning/30 bg-warning/5"
    case "info":
      return "border-info/30 bg-info/5"
    case "target":
      return "border-primary/30 bg-primary/5"
    default:
      return "border-border"
  }
}

const getIconStyles = (type: string) => {
  switch (type) {
    case "success":
      return "text-success"
    case "warning":
      return "text-warning"
    case "info":
      return "text-info"
    case "target":
      return "text-primary"
    default:
      return "text-muted-foreground"
  }
}

export function AIInsights() {
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
                Personalized recommendations based on your data
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <TrendingUp className="w-3 h-3" />
            4 New
          </Badge>
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

          <div className="mt-4 pt-4 border-t border-border">
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/ai-assistant">
                <Sparkles className="w-4 h-4 mr-2" />
                Ask AI Assistant
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
