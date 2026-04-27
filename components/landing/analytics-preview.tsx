"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, GraduationCap, BookOpen, Award } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const enrollmentData = [
  { month: "Jan", students: 4200, faculty: 210 },
  { month: "Feb", students: 4350, faculty: 215 },
  { month: "Mar", students: 4500, faculty: 220 },
  { month: "Apr", students: 4650, faculty: 225 },
  { month: "May", students: 4800, faculty: 230 },
  { month: "Jun", students: 5100, faculty: 240 },
]

const performanceData = [
  { name: "Research", value: 85 },
  { name: "Teaching", value: 92 },
  { name: "Infrastructure", value: 78 },
  { name: "Placements", value: 88 },
  { name: "Governance", value: 82 },
  { name: "Innovation", value: 75 },
]

const departmentData = [
  { dept: "CS", score: 92 },
  { dept: "ECE", score: 88 },
  { dept: "ME", score: 85 },
  { dept: "CE", score: 82 },
  { dept: "EE", score: 87 },
]

const kpis = [
  { label: "Total Students", value: "5,120", change: "+12%", trend: "up", icon: Users },
  { label: "Faculty Members", value: "240", change: "+8%", trend: "up", icon: GraduationCap },
  { label: "Research Papers", value: "156", change: "+23%", trend: "up", icon: BookOpen },
  { label: "NAAC Score", value: "3.42", change: "+0.15", trend: "up", icon: Award },
]

export function AnalyticsPreview() {
  return (
    <section id="analytics" className="py-24 relative bg-muted/30">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-accent mb-4">
            Analytics Dashboard
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Powerful Insights at Your{" "}
            <span className="text-gradient">Fingertips</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Interactive dashboards that transform complex data into clear, 
            actionable insights for informed decision-making.
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {kpis.map((kpi, index) => (
            <Card key={kpi.label} className="glass">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl md:text-3xl font-bold mt-1">{kpi.value}</p>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${kpi.trend === "up" ? "text-success" : "text-destructive"}`}>
                      {kpi.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{kpi.change}</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <kpi.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Enrollment Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass h-full">
              <CardHeader>
                <CardTitle className="text-lg">Enrollment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enrollmentData}>
                      <defs>
                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.55 0.2 240)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="oklch(0.55 0.2 240)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                      <YAxis className="text-xs fill-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "oklch(var(--card))",
                          border: "1px solid oklch(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="students"
                        stroke="oklch(0.55 0.2 240)"
                        strokeWidth={2}
                        fill="url(#colorStudents)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Radar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass h-full">
              <CardHeader>
                <CardTitle className="text-lg">NAAC Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                      <PolarGrid className="stroke-border" />
                      <PolarAngleAxis 
                        dataKey="name" 
                        className="text-xs fill-muted-foreground"
                        tick={{ fontSize: 12 }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        className="text-xs fill-muted-foreground"
                      />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke="oklch(0.65 0.18 195)"
                        fill="oklch(0.65 0.18 195)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Department Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Department-wise Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} className="text-xs fill-muted-foreground" />
                      <YAxis dataKey="dept" type="category" className="text-xs fill-muted-foreground" width={40} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "oklch(var(--card))",
                          border: "1px solid oklch(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Bar 
                        dataKey="score" 
                        fill="oklch(0.55 0.2 240)" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
