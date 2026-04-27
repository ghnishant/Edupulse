"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  ArrowRight,
  Target,
  Sparkles
} from "lucide-react"

const colleges = [
  { name: "Engineering College", score: 92, status: "excellent", trend: "up", progress: 85 },
  { name: "Medical Institute", score: 88, status: "good", trend: "up", progress: 70 },
  { name: "Arts & Science", score: 64, status: "critical", trend: "down", progress: 45 },
  { name: "Business School", score: 79, status: "pending", trend: "neutral", progress: 60 }
]

export function CollegeComparison() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <Sparkles className="w-5 h-5 text-primary/40 animate-pulse" />
        </div>
        
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Institutional Comparison
          </CardTitle>
          <CardDescription>
            Comparative analysis of academic output across colleges
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {colleges.map((college, index) => (
              <motion.div
                key={college.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">{college.name}</p>
                    {college.status === "critical" && (
                      <Badge variant="destructive" className="animate-bounce">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Weak Spot
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">{college.score}%</span>
                    {college.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : college.trend === "down" ? (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    ) : null}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Accreditation Progress</span>
                    <span>{college.progress}%</span>
                  </div>
                  <Progress value={college.progress} className="h-2" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-4 border-t border-border/40">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <Target className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">AI Growth Prediction</p>
                <p className="text-sm text-muted-foreground mt-1 text-black">
                  Based on current trends, <span className="font-bold">Business School</span> is projected to reach "Excellent" status in <span className="text-primary">4 months</span>.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
