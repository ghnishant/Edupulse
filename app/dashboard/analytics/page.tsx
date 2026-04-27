"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  ComposedChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  Target,
  Building,
  Loader2,
} from "lucide-react"
import { useAnalyticsData } from "@/hooks/use-analytics-data"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("5years")
  const [mounted, setMounted] = useState(false)
  const { yearly, performance, departments, placement, research, monthly, loading } = useAnalyticsData()
  const stats = useDashboardStats()

  useEffect(() => {
    setMounted(true)
  }, [])

  const kpiData = [
    { label: "Total Students", value: mounted ? stats.totalStudents.toLocaleString() : "", icon: Users, color: "text-primary" },
    { label: "Faculty Count", value: mounted ? stats.facultyMembers.toLocaleString() : "", icon: GraduationCap, color: "text-accent" },
    { label: "Research Papers", value: mounted ? stats.researchPapers.toLocaleString() : "", icon: BookOpen, color: "text-success" },
    { label: "Placement Rate", value: mounted ? "88%" : "", icon: Target, color: "text-warning" },
    { label: "NAAC Score", value: mounted ? stats.naacScore.toString() : "", icon: Award, color: "text-info" },
    { label: "Departments", value: mounted ? stats.departments.toString() : "", icon: Building, color: "text-muted-foreground" },
  ]

  if (loading || stats.loading) {
// ... existing loading logic ...
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into institutional performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="3years">3 Years</SelectItem>
              <SelectItem value="5years">5 Years</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {kpiData.map((kpi, index) => (
          <Card key={kpi.label} className="glass">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between mb-2">
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
              <CardDescription>Year-over-year institutional growth</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="enrollment">
                <TabsList className="mb-4">
                  <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
                  <TabsTrigger value="research">Research</TabsTrigger>
                  <TabsTrigger value="placements">Placements</TabsTrigger>
                </TabsList>
                <TabsContent value="enrollment">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={yearly}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="year" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                        <YAxis yAxisId="left" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="students" name="Students" fill="oklch(0.55 0.2 240)" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="research" name="Research" stroke="oklch(0.65 0.18 195)" strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="research">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={yearly}>
                        <defs>
                          <linearGradient id="colorResearch" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="oklch(0.65 0.18 145)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="oklch(0.65 0.18 145)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="year" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                        <YAxis tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="research" name="Publications" stroke="oklch(0.65 0.18 145)" fill="url(#colorResearch)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="placements">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={yearly}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="year" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="placements" name="Placement %" stroke="oklch(0.75 0.18 85)" strokeWidth={2} dot={{ fill: 'oklch(0.75 0.18 85)' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle>NAAC Criteria Analysis</CardTitle>
              <CardDescription>Performance across all seven criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={performance}>
                    <PolarGrid className="stroke-border" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: 'oklch(0.5 0.02 250)' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: 'oklch(0.5 0.02 250)' }} />
                    <Radar name="Score" dataKey="score" stroke="oklch(0.55 0.2 240)" fill="oklch(0.55 0.2 240)" fillOpacity={0.3} strokeWidth={2} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Department Comparison</CardTitle>
              <CardDescription>Performance metrics across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departments}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="dept" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="students" name="Students" fill="oklch(0.55 0.2 240)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="faculty" name="Faculty" fill="oklch(0.65 0.18 195)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle>Outcome Distribution</CardTitle>
              <CardDescription>Graduate outcomes breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={placement}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {placement.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-xs">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle>Monthly Activity Trends</CardTitle>
            <CardDescription>Student enrollment and research query activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="students" name="Students" stroke="oklch(0.55 0.2 240)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
