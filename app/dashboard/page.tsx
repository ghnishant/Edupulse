"use client"

import { motion } from "framer-motion"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { OverviewCharts } from "@/components/dashboard/overview-charts"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your institution&apos;s performance.
        </p>
      </motion.div>

      {/* KPI Cards */}
      <KPICards />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Charts - Takes 2 columns */}
        <div className="lg:col-span-2">
          <OverviewCharts />
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          <AIInsights />
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
