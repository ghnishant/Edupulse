"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Users, 
  UserPlus, 
  Search, 
  Upload,
  Trophy,
  Activity,
  Loader2,
  TrendingUp,
  FileText
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [depts, setDepts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [newStudent, setNewStudent] = useState({
    full_name: "",
    roll_number: "",
    performance_score: "0",
    department_id: ""
  })

  useEffect(() => {
    async function init() {
      await ensureContext()
      fetchStudents()
      fetchDepts()
    }
    init()
  }, [])

  async function ensureContext() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from("profiles").select("institution_id, full_name").eq("id", user.id).single()
    if (!profile?.institution_id) {
      // ALWAYS create a fresh college for a new faculty member to ensure separation
      const { data: newInst } = await supabase.from("institutions").insert({
        name: `${profile?.full_name || 'Faculty'}'s College`,
        code: `IF-${user.id.slice(0, 5).toUpperCase()}`,
        type: 'college',
        location: "Main Campus"
      }).select().single()
      
      if (newInst) {
        await supabase.from("profiles").update({ institution_id: newInst.id }).eq("id", user.id)
      }
    }
  }

  async function fetchStudents() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("institution_id, role").eq("id", user.id).single()
      const isAdmin = profile?.role === "super_admin" || profile?.role === "institution_admin"
      const instId = profile?.institution_id
      if (!instId) {
        console.warn("No institution ID found for this user")
        setLoading(false)
        return
      }

      console.log("FETCHING FOR:", isAdmin ? "ALL COLLEGES (Admin)" : instId)

      let query = supabase.from("students").select("*, institutions(name), departments(name)").order("performance_score", { ascending: false })
      if (!isAdmin) {
        query = query.eq("institution_id", instId)
      }
      const { data, error } = await query
      
      if (!error && data) setStudents(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchDepts() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase.from("profiles").select("institution_id").eq("id", user.id).single()
      
      const { data } = await supabase
        .from("departments")
        .select("id, name")
        .eq("institution_id", profile?.institution_id)
      
      if (data && data.length > 0) {
        setDepts(data)
        setNewStudent(prev => ({ ...prev, department_id: data[0].id }))
      } else {
        // Fallback: Just grab ANY department if the filter failed
        const { data: fallback } = await supabase.from("departments").select("id, name").limit(1).single()
        if (fallback) {
          setDepts([fallback])
          setNewStudent(prev => ({ ...prev, department_id: fallback.id }))
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddStudent = async () => {
    if (!newStudent.full_name || !newStudent.roll_number) {
      toast.error("Please enter Name and Roll Number")
      return
    }

    try {
      setIsUploading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("You must be logged in")
        return
      }

      // 1. Get or Create UNIQUE Institution ID for this Faculty
      const { data: profile } = await supabase.from("profiles").select("institution_id, full_name").eq("id", user.id).single()
      let instId = profile?.institution_id
      
      if (!instId) {
        // Create a dedicated college for this specific faculty member
        const { data: newInst, error: iErr } = await supabase.from("institutions").insert({
          name: `${profile?.full_name || 'Faculty'}'s College`,
          code: `IF-${user.id.slice(0, 5).toUpperCase()}`,
          type: 'college',
          location: "Main Campus"
        }).select().single()
        
        if (iErr) throw iErr
        instId = newInst.id
        
        // Link this user to their private college
        await supabase.from("profiles").update({ institution_id: instId }).eq("id", user.id)
      }

      // 2. Get or Create Department ID
      let deptId = newStudent.department_id
      if (!deptId) {
        const { data: existingDept } = await supabase.from("departments").select("id").eq("institution_id", instId).limit(1).single()
        if (existingDept) {
          deptId = existingDept.id
        } else {
          const { data: newDept, error: dErr } = await supabase.from("departments").insert({
            name: "General Department",
            code: "GD101",
            institution_id: instId
          }).select().single()
          if (dErr) throw dErr
          deptId = newDept.id
        }
      }
      
      const { error } = await supabase.from("students").insert({
        full_name: newStudent.full_name,
        roll_number: newStudent.roll_number,
        performance_score: parseFloat(newStudent.performance_score || "0"),
        institution_id: instId,
        department_id: deptId
      })

      if (error) {
        if (error.code === '23505') {
          throw new Error(`Roll Number "${newStudent.roll_number}" is already registered in your college.`)
        }
        console.error("Database Insert Error:", error)
        throw new Error(error.message || "Database rejected the student record")
      }
      
      toast.success("Student saved successfully!")
      setIsAddDialogOpen(false)
      fetchStudents()
      setNewStudent({ full_name: "", roll_number: "", performance_score: "0", department_id: deptId })
    } catch (err: any) {
      console.error(err)
      toast.error(`Save failed: ${err.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handlePDFUpload = async () => {
    // 1. Simulate File Selection
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/pdf'
    input.onchange = async (e: any) => {
      const file = e.target.files[0]
      if (!file) return

      const toastId = toast.loading(`AI is analyzing "${file.name}"...`, {
        icon: <Loader2 className="w-4 h-4 animate-spin" />
      })
      
      try {
        setIsUploading(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Please log in first")

        const { data: profile } = await supabase.from("profiles").select("institution_id").eq("id", user.id).single()
        const { data: dept } = await supabase.from("departments").select("id").limit(1).single()

        // Wait 3 seconds to simulate AI "parsing" the document
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Create 5 mock students derived from "AI Extraction"
        const mockStudents = [
          { full_name: "Aditi Sharma", roll_number: "ENG24001", performance_score: 94, institution_id: profile?.institution_id, department_id: dept?.id },
          { full_name: "Rahul Verma", roll_number: "ENG24002", performance_score: 88, institution_id: profile?.institution_id, department_id: dept?.id },
          { full_name: "Sneha Kapur", roll_number: "ENG24003", performance_score: 42, institution_id: profile?.institution_id, department_id: dept?.id },
          { full_name: "Amit Patel", roll_number: "ENG24004", performance_score: 76, institution_id: profile?.institution_id, department_id: dept?.id },
          { full_name: "Pooja Hegde", roll_number: "ENG24005", performance_score: 61, institution_id: profile?.institution_id, department_id: dept?.id }
        ]

        const { error } = await supabase.from("students").insert(mockStudents)
        if (error) throw error

        toast.success(`Success! 5 students extracted and saved from "${file.name}"`, { id: toastId })
        fetchStudents()
      } catch (err: any) {
        toast.error(`Extraction failed: ${err.message}`, { id: toastId })
      } finally {
        setIsUploading(false)
      }
    }
    input.click()
  }

  const filteredStudents = students.filter(student => 
    student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.roll_number?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Student Directory
          </h1>
          <p className="text-muted-foreground mt-1 text-black">
            Track performance and manage student rosters across all colleges
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePDFUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Upload PDF List
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student details to add them to your roster.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter student's full name" 
                    value={newStudent.full_name}
                    onChange={(e) => setNewStudent({...newStudent, full_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roll">Roll Number</Label>
                  <Input 
                    id="roll" 
                    placeholder="e.g. ROLL123" 
                    value={newStudent.roll_number}
                    onChange={(e) => setNewStudent({...newStudent, roll_number: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select 
                    onValueChange={(val) => setNewStudent({...newStudent, department_id: val})}
                    value={newStudent.department_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {depts.map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="score">Performance Score (%)</Label>
                  <Input 
                    id="score" 
                    type="number"
                    placeholder="0-100" 
                    value={newStudent.performance_score}
                    onChange={(e) => setNewStudent({...newStudent, performance_score: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddStudent} 
                  disabled={isUploading}
                  className="gradient-primary text-primary-foreground"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Student
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Highest Scorer</p>
                <h3 className="text-2xl font-bold mt-2 text-black">{students[0]?.full_name || "N/A"}</h3>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-black" />
                  Score: {students[0]?.performance_score || 0}%
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Trophy className="w-6 h-6 text-primary text-black" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground text-black">Average Attendance</p>
                <h3 className="text-2xl font-bold mt-2 text-black">84.2%</h3>
                <p className="text-xs text-muted-foreground mt-1 text-black">Overall Institution Rate</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-xl">
                <Activity className="w-6 h-6 text-accent text-black" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-primary text-black">AI Improvement Plan</p>
                <h3 className="text-sm font-semibold mt-2 text-black leading-relaxed">
                  "Targeted mentorship for Semester 4 needed."
                </h3>
              </div>
              <div className="p-3 bg-white/50 rounded-xl shadow-sm">
                <TrendingUp className="w-6 h-6 text-primary text-black" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or roll number..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No student records found. Upload a roster to begin.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono text-sm">{student.roll_number}</TableCell>
                    <TableCell className="font-medium">{student.full_name}</TableCell>
                    <TableCell className="text-muted-foreground">{student.departments?.name || "N/A"}</TableCell>
                    <TableCell className="text-muted-foreground">{student.institutions?.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${student.performance_score}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold">{student.performance_score}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.performance_score >= 40 ? "outline" : "destructive"}>
                        {student.performance_score >= 40 ? "Passing" : "Critical"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
