"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DocumentUploadDialog } from "@/components/dashboard/document-upload-dialog"
import {
  Search,
  Upload,
  FileText,
  FileSpreadsheet,
  File,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Filter,
  FolderOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"

// Mock data - in production this would come from Supabase
const documents = [
  {
    id: "1",
    name: "Faculty CVs 2024.pdf",
    type: "pdf",
    category: "academic",
    size: "2.4 MB",
    status: "completed",
    uploadedBy: "Dr. Priya Sharma",
    uploadedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Research Publications.xlsx",
    type: "xlsx",
    category: "research",
    size: "1.8 MB",
    status: "completed",
    uploadedBy: "Prof. Amit Kumar",
    uploadedAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "3",
    name: "Student Enrollment Data.csv",
    type: "csv",
    category: "administrative",
    size: "856 KB",
    status: "processing",
    uploadedBy: "Admin Team",
    uploadedAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    name: "NAAC SSR Document.pdf",
    type: "pdf",
    category: "accreditation",
    size: "5.2 MB",
    status: "completed",
    uploadedBy: "Dr. Suresh Reddy",
    uploadedAt: "2024-01-12T16:45:00Z",
  },
  {
    id: "5",
    name: "Annual Budget 2024.xlsx",
    type: "xlsx",
    category: "financial",
    size: "1.2 MB",
    status: "pending",
    uploadedBy: "Finance Team",
    uploadedAt: "2024-01-11T11:00:00Z",
  },
]

const categories = [
  { value: "all", label: "All Categories" },
  { value: "academic", label: "Academic" },
  { value: "research", label: "Research" },
  { value: "administrative", label: "Administrative" },
  { value: "accreditation", label: "Accreditation" },
  { value: "financial", label: "Financial" },
]

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="w-5 h-5 text-destructive" />
    case "xlsx":
    case "csv":
      return <FileSpreadsheet className="w-5 h-5 text-success" />
    default:
      return <File className="w-5 h-5 text-muted-foreground" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Processed
        </Badge>
      )
    case "processing":
      return (
        <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
          <Clock className="w-3 h-3 mr-1" />
          Processing
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="secondary">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    case "failed":
      return (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
          <AlertCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      )
    default:
      return null
  }
}

const getCategoryBadge = (category: string) => {
  const colors: Record<string, string> = {
    academic: "bg-primary/10 text-primary",
    research: "bg-accent/10 text-accent",
    administrative: "bg-info/10 text-info",
    accreditation: "bg-warning/10 text-warning",
    financial: "bg-success/10 text-success",
  }
  return (
    <Badge className={colors[category] || "bg-muted text-muted-foreground"}>
      {category}
    </Badge>
  )
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter
    return matchesSearch && matchesCategory
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
          <h1 className="text-2xl md:text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Upload, manage, and extract insights from your documents
          </p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} className="gradient-primary text-primary-foreground">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </motion.div>

      {/* Stats Cards */}
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
                <FolderOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,284</p>
                <p className="text-xs text-muted-foreground">Total Documents</p>
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
                <p className="text-2xl font-bold">1,156</p>
                <p className="text-xs text-muted-foreground">Processed</p>
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
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <FileText className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">4.2 GB</p>
                <p className="text-xs text-muted-foreground">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Table */}
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
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Document</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden sm:table-cell">Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Uploaded By</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.type)}
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">
                              {doc.category}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getCategoryBadge(doc.category)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {doc.size}
                      </TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                        {doc.uploadedBy}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No documents found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Upload Dialog */}
      <DocumentUploadDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} />
    </div>
  )
}
