"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileText,
  FileSpreadsheet,
  File,
  X,
  CheckCircle2,
  Loader2,
  Cloud,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface DocumentUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface UploadedFile {
  file: File
  progress: number
  status: "uploading" | "processing" | "completed" | "error"
}

const categories = [
  { value: "academic", label: "Academic" },
  { value: "research", label: "Research" },
  { value: "administrative", label: "Administrative" },
  { value: "accreditation", label: "Accreditation" },
  { value: "financial", label: "Financial" },
  { value: "other", label: "Other" },
]

const getFileIcon = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "pdf":
      return <FileText className="w-8 h-8 text-destructive" />
    case "xlsx":
    case "xls":
    case "csv":
      return <FileSpreadsheet className="w-8 h-8 text-success" />
    default:
      return <File className="w-8 h-8 text-muted-foreground" />
  }
}

export function DocumentUploadDialog({ open, onOpenChange }: DocumentUploadDialogProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [category, setCategory] = useState("academic")
  const [department, setDepartment] = useState("")

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }

  const addFiles = async (newFiles: File[]) => {
    const supabase = createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error("Please log in to upload documents")
      return
    }

    let { data: profile } = await supabase
      .from("profiles")
      .select("institution_id")
      .eq("id", user.id)
      .single()

    // If profile is missing, create a default one to stop foreign key errors
    if (!profile) {
      const { data: newProfile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email,
          role: 'faculty'
        })
        .select("institution_id")
        .single()
      
      if (!profileError) profile = newProfile
    }

    // Get institution ID (fallback to first available if profile is missing it)
    let instId = profile?.institution_id
    if (!instId) {
      const { data: insts } = await supabase.from("institutions").select("id").limit(1)
      instId = insts?.[0]?.id
    }

    const currentFilesCount = files.length
    const uploadFiles: UploadedFile[] = newFiles.map((file) => ({
      file,
      progress: 0,
      status: "uploading",
    }))
    
    setFiles((prev) => [...prev, ...uploadFiles])

    for (const [index, uploadFile] of uploadFiles.entries()) {
      const fileIndex = currentFilesCount + index
      const filePath = `${user.id}/${Date.now()}-${uploadFile.file.name}`

      try {
        // 1. Upload to Storage
        const { error: storageError } = await supabase.storage
          .from("documents")
          .upload(filePath, uploadFile.file)

        if (storageError) throw storageError

        setFiles((prev) =>
          prev.map((f, i) =>
            i === fileIndex ? { ...f, progress: 100, status: "processing" } : f
          )
        )

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from("documents")
          .getPublicUrl(filePath)

        // 3. Insert into Database
        const { error: dbError } = await supabase.from("documents").insert({
          name: uploadFile.file.name,
          file_type: uploadFile.file.name.split(".").pop() || "other",
          file_url: publicUrl,
          file_size: uploadFile.file.size,
          category: category as any,
          institution_id: instId,
          user_id: user.id,
          status: "completed",
        })

        if (dbError) throw dbError

        setFiles((prev) =>
          prev.map((f, i) =>
            i === fileIndex ? { ...f, status: "completed" } : f
          )
        )
        toast.success(`${uploadFile.file.name} uploaded successfully`)
      } catch (err: any) {
        // Deep extraction of error details
        console.error("FULL ERROR OBJECT:", JSON.stringify(err, null, 2));
        console.error("ERROR TYPE:", typeof err);
        
        const message = err.message || err.error_description || err.error || (typeof err === 'string' ? err : 'Unknown Error');
        const status = err.status || err.statusCode || 'No Status';

        setFiles((prev) =>
          prev.map((f, i) =>
            i === fileIndex ? { ...f, status: "error" } : f
          )
        )
        
        const errorMsg = message === "Bucket not found" 
          ? "Bucket 'documents' not found. Check Dashboard -> Storage."
          : `Upload Failed (${status}): ${message}`
        toast.error(errorMsg)
      }
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleClose = () => {
    setFiles([])
    setCategory("academic")
    setDepartment("")
    onOpenChange(false)
  }

  const allCompleted = files.length > 0 && files.every((f) => f.status === "completed")

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Upload PDF, Excel, or CSV files for AI-powered data extraction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category & Department Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
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
            <div className="space-y-2">
              <Label>Department (Optional)</Label>
              <Input
                placeholder="e.g., Computer Science"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <input
              type="file"
              multiple
              accept=".pdf,.csv,.xlsx,.xls,.doc,.docx"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Cloud className={`w-12 h-12 mx-auto mb-4 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
            <p className="font-medium">
              {isDragging ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Supports PDF, Excel, CSV, Word (max 50MB per file)
            </p>
          </div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {files.map((uploadFile, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    {getFileIcon(uploadFile.file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {uploadFile.file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {uploadFile.status === "uploading" && (
                          <>
                            <Progress value={uploadFile.progress} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(uploadFile.progress)}%
                            </span>
                          </>
                        )}
                        {uploadFile.status === "processing" && (
                          <div className="flex items-center gap-1 text-warning">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span className="text-xs">Processing...</span>
                          </div>
                        )}
                        {uploadFile.status === "completed" && (
                          <div className="flex items-center gap-1 text-success">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="text-xs">Processed</span>
                          </div>
                        )}
                        {uploadFile.status === "error" && (
                          <div className="flex items-center gap-1 text-destructive">
                            <X className="w-3 h-3" />
                            <span className="text-xs">Failed</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="gradient-primary text-primary-foreground"
              disabled={files.length === 0 || !allCompleted}
              onClick={handleClose}
            >
              {allCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Done
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
