"use client"

import { useState } from "react"
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
  Filter,
  Calendar,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  Target,
  Building,
} from "lucide-react"

const yearlyData = [
  { year: "2020", students: 3800, faculty: 180, research: 65, placements: 72 },
  { year: "2021", students: 4200, faculty: 200, research: 78, placements: 75 },
  { year: "2022", students: 4600, faculty: 220, research: 92, placements: 78 },
  { year: "2023", students: 4900, faculty: 235, research: 112, placements: 82 },
  { year: "2024", students: 5120, faculty: 240, research: 135, placements: 85 },
]

const departmentComparison = [
  { dept: "CSE", students: 850, faculty: 45, ratio: 18.9, research: 45, placements: 92 },
  { dept: "ECE", students: 720, faculty: 38, ratio: 18.9, research: 32, placements: 88 },
  { dept: "ME", students: 680, faculty: 35, ratio: 19.4, research: 28, placements: 82 },
  { dept: "CE", students: 550, faculty: 28, ratio: 19.6, research: 22, placements: 78 },
  { dept: "EE", students: 620, faculty: 32, ratio: 19.4, research: 25, placements: 85 },
]

const naacCriteria = [
  { criteria: "Curricular Aspects", score: 85, weight: 100 },
  { criteria: "Teaching-Learning", score: 88, weight: 200 },
  { criteria: "Research & Extension", score: 82, weight: 250 },
  { criteria: "Infrastructure", score: 78, weight: 100 },
  { criteria: "Student Support", score: 84, weight: 100 },
  { criteria: "Governance", score: 80, weight: 100 },
  { criteria: "Innovation", score: 75, weight: 150 },
]

const monthlyTrends = [
  { month: "Jul", admissions: 850, queries: 1200, placements: 45 },
  { month: "Aug", admissions: 320, queries: 800, placements: 62 },
  { month: "Sep", admissions: 120, queries: 600, placements: 78 },
  { month: "Oct", admissions: 50, queries: 400, placements: 95 },
  { month: "Nov", admissions: 30, queries: 350, placements: 120 },
  { month: "Dec", admissions: 20, queries: 300, placements: 145 },
  { month: "Jan", admissions: 15, queries: 450, placements: 180 },
]

const researchDist = [
  { name: "Journals", value: 45, color: "oklch(0.55 0.2 240)" },
  { name: "Conferences", value: 30, color: "oklch(0.65 0.18 195)" },
  { name: "Patents", value: 15, color: "oklch(0.65 0.18 145)" },
  { name: "Books", value: 10, color: "oklch(0.75 0.18 85)" },
]

const kpiData = [
  { label: "Student Enrollment", value: "5,120", change: "+12%", trend: "up", icon: Users, color: "text-primary" },
  { label: "Faculty Count", value: "240", change: "+8%", trend: "up", icon: GraduationCap, color: "text-accent" },
  { label: "Research Output", value: "156", change: "+23%", trend: "up", icon: BookOpen, color: "text-success" },
  { label: "Placement Rate", value: "85%", change: "+3%", trend: "up", icon: Target, color: "text-warning" },
  { label: "NAAC Score", value: "3.42", change: "+0.15", trend: "up", icon: Award, color: "text-info" },
  { label: "Departments", value: "12", change: "0", trend: "neutral", icon: Building, color: "text-muted-foreground" },
]

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
  const [department, setDepartment] = useState("all")

  return (
    <div className="space-y-6">
      {/* Page Header */}
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

      {/* KPI Cards */}
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
                {kpi.trend !== "neutral" && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-destructive" />
                    )}
                    {kpi.change}
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Growth Trends */}
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
                      <ComposedChart data={yearlyData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="year" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                        <YAxis yAxisId="left" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="students" name="Students" fill="oklch(0.55 0.2 240)" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="faculty" name="Faculty" stroke="oklch(0.65 0.18 195)" strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="research">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={yearlyData}>
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
                      <LineChart data={yearlyData}>
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

        {/* NAAC Criteria Performance */}
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
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={naacCriteria}>
                    <PolarGrid className="stroke-border" />
                    <PolarAngleAxis dataKey="criteria" tick={{ fontSize: 10, fill: 'oklch(0.5 0.02 250)' }} />
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

      {/* Department Comparison & Research Distribution */}
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
                  <BarChart data={departmentComparison}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="dept" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="research" name="Research" fill="oklch(0.55 0.2 240)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="placements" name="Placements %" fill="oklch(0.65 0.18 195)" radius={[4, 4, 0, 0]} />
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
              <CardTitle>Research Distribution</CardTitle>
              <CardDescription>Publication types breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={researchDist}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {researchDist.map((entry, index) => (
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

      {/* Monthly Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle>Monthly Activity Trends</CardTitle>
            <CardDescription>Admissions, queries, and placement activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="admissions" name="Admissions" stroke="oklch(0.55 0.2 240)" strokeWidth={2} />
                  <Line type="monotone" dataKey="queries" name="Queries" stroke="oklch(0.65 0.18 195)" strokeWidth={2} />
                  <Line type="monotone" dataKey="placements" name="Placements" stroke="oklch(0.65 0.18 145)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
