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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { DocumentUploadDialog } from "@/components/dashboard/document-upload-dialog"
import { toast } from "sonner"
import {
  Search,
  Upload,
  FileText,
  FileSpreadsheet,
  File,
  MoreHorizontal,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  Filter,
  FolderOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useDocuments } from "@/hooks/use-documents"

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
  const { documents, stats, loading, refresh } = useDocuments()

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleView = (doc: any) => {
    if (!doc.file_url) {
      toast.error("File URL not found")
      return
    }
    
    // Ensure we have a full URL
    let fullUrl = doc.file_url
    if (!fullUrl.startsWith("http")) {
      const supabase = createClient()
      const { data } = supabase.storage.from("documents").getPublicUrl(fullUrl)
      fullUrl = data.publicUrl
    }
    
    window.open(fullUrl, "_blank")
  }

  const handleDownload = async (doc: any) => {
    try {
      const supabase = createClient()
      
      // Extract path if it's a full URL
      let filePath = doc.file_url
      if (filePath.includes("storage/v1/object/public/")) {
        filePath = filePath.split("documents/")[1]
      }

      const { data, error } = await supabase.storage
        .from("documents")
        .download(filePath)

      if (error) throw error

      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", doc.name)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
    } catch (err: any) {
      toast.error(`Failed to download: ${err.message}`)
    }
  }

  const handleDelete = async (docId: string, fileUrl: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      const supabase = createClient()
      
      // Extract path if it's a full URL
      let filePath = fileUrl
      if (filePath.includes("storage/v1/object/public/")) {
        filePath = filePath.split("documents/")[1]
      }

      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([filePath])
      
      if (storageError) console.warn("Storage deletion error:", storageError)

      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", docId)

      if (dbError) throw dbError

      toast.success("Document deleted successfully")
      refresh()
    } catch (err: any) {
      toast.error(`Failed to delete: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

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
                <p className="text-2xl font-bold">{stats.total}</p>
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
                <p className="text-2xl font-bold">{stats.processed}</p>
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
                <p className="text-2xl font-bold">{stats.processing}</p>
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
                <p className="text-2xl font-bold">{stats.storage}</p>
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
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem onClick={() => handleView(doc)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(doc)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(doc.id, doc.file_url)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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
