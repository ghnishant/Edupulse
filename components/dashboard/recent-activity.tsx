"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, BarChart3, Users, CheckCircle, Loader2 } from "lucide-react"
import { useRecentActivity } from "@/hooks/use-recent-activity"

const getTypeBadge = (type: string) => {
  switch (type) {
    case "document":
      return <Badge variant="secondary" className="text-xs">Document</Badge>
    case "report":
      return <Badge className="text-xs bg-primary/10 text-primary hover:bg-primary/20">Report</Badge>
    case "analytics":
      return <Badge className="text-xs bg-accent/10 text-accent hover:bg-accent/20">Analytics</Badge>
    case "users":
      return <Badge className="text-xs bg-success/10 text-success hover:bg-success/20">Users</Badge>
    case "system":
      return <Badge variant="outline" className="text-xs">System</Badge>
    default:
      return null
  }
}

export function RecentActivity() {
  const { activities, loading } = useRecentActivity()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="glass">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-muted">
                      {activity.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{activity.user}</span>
                      <span className="text-sm text-muted-foreground">{activity.action}</span>
                      {getTypeBadge(activity.type)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.target}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {mounted && activity.time}
                    </p>
                  </div>
                  <activity.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
