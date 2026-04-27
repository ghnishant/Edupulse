"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
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
} from "recharts"
import { useAnalyticsData } from "@/hooks/use-analytics-data"

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm">{label}</p>
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

export function OverviewCharts() {
  const { 
    enrollment, 
    performance, 
    departments, 
    placement, 
    research, 
    loading 
  } = useAnalyticsData()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] w-full">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {/* Main charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle>Enrollment Trends</CardTitle>
              <CardDescription>Student and faculty growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                {enrollment.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enrollment}>
                      <defs>
                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.55 0.2 240)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="oklch(0.55 0.2 240)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" tick={{ fill: 'oklch(0.5 0.02 250)' }} />
                      <YAxis className="text-xs" tick={{ fill: 'oklch(0.5 0.02 250)' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="students"
                        name="Students"
                        stroke="oklch(0.55 0.2 240)"
                        strokeWidth={2}
                        fill="url(#colorStudents)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">No enrollment data available yet</p>
                    <p className="text-[10px] text-muted-foreground/60">Upload analytics data to see trends</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* NAAC Performance Radar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle>NAAC Performance Metrics</CardTitle>
              <CardDescription>Institutional quality assessment scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                {performance.some(p => p.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={performance}>
                      <PolarGrid className="stroke-border" />
                      <PolarAngleAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11, fill: 'oklch(0.5 0.02 250)' }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={{ fontSize: 10, fill: 'oklch(0.5 0.02 250)' }}
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
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">No performance metrics available</p>
                    <p className="text-[10px] text-muted-foreground/60">Data will appear after accreditation reports are processed</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Secondary charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Department Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Department-wise Performance</CardTitle>
              <CardDescription>Comparative analysis across departments</CardDescription>
            </CardHeader>
            <CardContent>
              {departments.length > 0 ? (
                <Tabs defaultValue="score" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="score">Score</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                    <TabsTrigger value="faculty">Faculty</TabsTrigger>
                  </TabsList>
                  <TabsContent value="score">
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departments} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                          <XAxis type="number" domain={[0, 100]} tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                          <YAxis dataKey="dept" type="category" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} width={100} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="score" 
                            name="Score"
                            fill="oklch(0.55 0.2 240)" 
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  <TabsContent value="students">
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departments} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                          <XAxis type="number" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                          <YAxis dataKey="dept" type="category" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} width={100} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="students" 
                            name="Students"
                            fill="oklch(0.65 0.18 195)" 
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  <TabsContent value="faculty">
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departments} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                          <XAxis type="number" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                          <YAxis dataKey="dept" type="category" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} width={100} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="faculty" 
                            name="Faculty"
                            fill="oklch(0.65 0.18 145)" 
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-center">
                  <p className="text-sm text-muted-foreground">No department data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Placement Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle>Placement Distribution</CardTitle>
              <CardDescription>Graduate outcomes breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center">
                {placement.length > 0 && placement.some(p => p.value > 0) ? (
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
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">No placement records found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Research Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle>Research Output Trends</CardTitle>
            <CardDescription>Publications, patents, and grants over the years</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {research.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={research}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="year" tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      formatter={(value) => <span className="text-xs">{value}</span>}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="papers" 
                      name="Papers"
                      stroke="oklch(0.55 0.2 240)" 
                      strokeWidth={2}
                      dot={{ fill: 'oklch(0.55 0.2 240)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="patents" 
                      name="Patents"
                      stroke="oklch(0.65 0.18 195)" 
                      strokeWidth={2}
                      dot={{ fill: 'oklch(0.65 0.18 195)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="grants" 
                      name="Grants"
                      stroke="oklch(0.65 0.18 145)" 
                      strokeWidth={2}
                      dot={{ fill: 'oklch(0.65 0.18 145)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">No research output data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
