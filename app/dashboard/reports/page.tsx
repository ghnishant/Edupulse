"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  FileText,
  Download,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  Building,
  BarChart3,
  Calendar,
  Sparkles,
} from "lucide-react"

const reports = [
  {
    id: "1",
    title: "NAAC SSR 2024",
    type: "naac",
    status: "in_review",
    progress: 85,
    lastUpdated: "2024-01-15",
    author: "Dr. Priya Sharma",
  },
  {
    id: "2",
    title: "NBA Self Assessment Report - CSE",
    type: "nba",
    status: "draft",
    progress: 60,
    lastUpdated: "2024-01-14",
    author: "Prof. Amit Kumar",
  },
  {
    id: "3",
    title: "Annual Quality Report 2023-24",
    type: "iqac",
    status: "approved",
    progress: 100,
    lastUpdated: "2024-01-10",
    author: "IQAC Team",
  },
  {
    id: "4",
    title: "Departmental Performance Analysis",
    type: "custom",
    status: "published",
    progress: 100,
    lastUpdated: "2024-01-08",
    author: "Admin Team",
  },
  {
    id: "5",
    title: "Research Output Summary Q4",
    type: "custom",
    status: "draft",
    progress: 30,
    lastUpdated: "2024-01-05",
    author: "Dr. Suresh Reddy",
  },
]

const reportTypes = [
  { value: "all", label: "All Types" },
  { value: "naac", label: "NAAC" },
  { value: "nba", label: "NBA" },
  { value: "iqac", label: "IQAC" },
  { value: "annual", label: "Annual" },
  { value: "custom", label: "Custom" },
]

const templates = [
  {
    id: "naac-ssr",
    name: "NAAC SSR",
    description: "Self Study Report for NAAC accreditation",
    icon: Award,
    color: "bg-warning/10 text-warning",
  },
  {
    id: "nba-sar",
    name: "NBA SAR",
    description: "Self Assessment Report for NBA programs",
    icon: Building,
    color: "bg-primary/10 text-primary",
  },
  {
    id: "aqar",
    name: "AQAR",
    description: "Annual Quality Assurance Report",
    icon: Calendar,
    color: "bg-success/10 text-success",
  },
  {
    id: "custom",
    name: "Custom Report",
    description: "Create a custom analytics report",
    icon: BarChart3,
    color: "bg-accent/10 text-accent",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "published":
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Published
        </Badge>
      )
    case "approved":
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      )
    case "in_review":
      return (
        <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
          <Clock className="w-3 h-3 mr-1" />
          In Review
        </Badge>
      )
    case "draft":
      return (
        <Badge variant="secondary">
          <Clock className="w-3 h-3 mr-1" />
          Draft
        </Badge>
      )
    default:
      return null
  }
}

const getTypeBadge = (type: string) => {
  const colors: Record<string, string> = {
    naac: "bg-warning/10 text-warning",
    nba: "bg-primary/10 text-primary",
    iqac: "bg-success/10 text-success",
    annual: "bg-info/10 text-info",
    custom: "bg-accent/10 text-accent",
  }
  return (
    <Badge className={colors[type] || "bg-muted text-muted-foreground"}>
      {type.toUpperCase()}
    </Badge>
  )
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || report.type === typeFilter
    return matchesSearch && matchesType
  })

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
          <h1 className="text-2xl md:text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Generate and manage accreditation reports with AI assistance
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Report</DialogTitle>
              <DialogDescription>
                Choose a template or create a custom report
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setIsCreateOpen(false)}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all text-left group"
                  >
                    <div className={`p-2 rounded-lg ${template.color} w-fit mb-3`}>
                      <template.icon className="w-5 h-5" />
                    </div>
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">
                      {template.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t border-border space-y-4">
                <div className="space-y-2">
                  <Label>Report Title</Label>
                  <Input placeholder="Enter report title" />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea placeholder="Brief description of the report" rows={3} />
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <p className="text-sm">
                    AI will auto-populate data from your documents
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary text-primary-foreground">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="glass">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-muted-foreground">In Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <Award className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">3.42</p>
                <p className="text-xs text-muted-foreground">NAAC Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="glass">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold">{report.title}</h3>
                        {getTypeBadge(report.type)}
                        {getStatusBadge(report.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{report.author}</span>
                        <span>Updated {report.lastUpdated}</span>
                      </div>
                      {report.progress < 100 && (
                        <div className="mt-3 flex items-center gap-3">
                          <Progress value={report.progress} className="h-2 flex-1" />
                          <span className="text-sm text-muted-foreground">
                            {report.progress}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No reports found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
