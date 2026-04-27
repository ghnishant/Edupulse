"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, BarChart3, Users, CheckCircle } from "lucide-react"

const activities = [
  {
    id: 1,
    user: "Dr. Priya Sharma",
    initials: "PS",
    action: "uploaded",
    target: "Faculty CV Bundle 2024",
    type: "document",
    time: "2 minutes ago",
    icon: Upload,
  },
  {
    id: 2,
    user: "Prof. Amit Kumar",
    initials: "AK",
    action: "generated",
    target: "NAAC SSR Report Draft",
    type: "report",
    time: "15 minutes ago",
    icon: FileText,
  },
  {
    id: 3,
    user: "Admin Team",
    initials: "AT",
    action: "updated",
    target: "Department Analytics",
    type: "analytics",
    time: "1 hour ago",
    icon: BarChart3,
  },
  {
    id: 4,
    user: "Dr. Suresh Reddy",
    initials: "SR",
    action: "added",
    target: "5 new faculty members",
    type: "users",
    time: "2 hours ago",
    icon: Users,
  },
  {
    id: 5,
    user: "System",
    initials: "SY",
    action: "completed",
    target: "Monthly backup",
    type: "system",
    time: "3 hours ago",
    icon: CheckCircle,
  },
]

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
                    {activity.time}
                  </p>
                </div>
                <activity.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
