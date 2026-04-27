"use client"

import { motion } from "framer-motion"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { OverviewCharts } from "@/components/dashboard/overview-charts"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { CollegeComparison } from "@/components/dashboard/college-comparison"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 animate-pulse">
              ● Live Data
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s an overview of your institution&apos;s performance.
          </p>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <KPICards />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Charts - Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          <OverviewCharts />
          <CollegeComparison />
        </div>

        {/* Side Panel - Right 1 Column */}
        <div className="space-y-6">
          <AIInsights />
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
