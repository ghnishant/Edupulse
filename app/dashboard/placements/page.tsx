"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Briefcase, 
  TrendingUp, 
  Building2, 
  Trophy,
  Loader2,
  Plus,
  BarChart,
  Target
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function PlacementsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10
  const [placements, setPlacements] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newPlacement, setNewPlacement] = useState({
    student_id: "",
    company_name: "",
    package_amount: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("institution_id, role").eq("id", user.id).single()
      const isAdmin = profile?.role === "super_admin" || profile?.role === "institution_admin"
      const instId = profile?.institution_id
      
      // Fetch Placements (Global if Admin)
      let pQuery = supabase
        .from("placements")
        .select(`
          *,
          students(full_name, roll_number)
        `)
        .order("created_at", { ascending: false })
      if (!isAdmin && instId) pQuery = pQuery.eq("institution_id", instId)
      
      const { data: pData } = await pQuery
      if (pData) setPlacements(pData)

      // Fetch Students for selection (Global if Admin)
      let sQuery = supabase.from("students").select("id, full_name, roll_number")
      if (!isAdmin && instId) sQuery = sQuery.eq("institution_id", instId)
      
      const { data: sData } = await sQuery
      if (sData) setStudents(sData)
      
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPlacement = async () => {
    if (!newPlacement.student_id || !newPlacement.company_name) {
      toast.error("Please fill in Student and Company")
      return
    }

    try {
      setIsSaving(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data: profile } = await supabase.from("profiles").select("institution_id").eq("id", user.id).single()

      const { error } = await supabase.from("placements").insert({
        student_id: newPlacement.student_id,
        company_name: newPlacement.company_name,
        package_amount: parseFloat(newPlacement.package_amount || "0"),
        institution_id: profile?.institution_id
      })

      if (error) throw error

      toast.success("Placement record saved!")
      setIsAddOpen(false)
      fetchData()
      setNewPlacement({ student_id: "", company_name: "", package_amount: "" })
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const avgPackage = placements.length > 0 
    ? placements.reduce((acc, curr) => acc + (curr.package_amount || 0), 0) / placements.length 
    : 0

  const totalPages = Math.ceil(placements.length / ITEMS_PER_PAGE)
  const paginatedPlacements = placements.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
            <Briefcase className="w-8 h-8 text-primary" />
            Placement Cell
          </h1>
          <p className="text-muted-foreground mt-1 text-black">
            Track student career outcomes and recruitment performance
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground text-black">
              <Plus className="w-4 h-4 mr-2 text-black" />
              Add Placement Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Placement Record</DialogTitle>
              <DialogDescription>
                Record a successful student recruitment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Student</Label>
                <Select 
                  onValueChange={(val) => setNewPlacement({...newPlacement, student_id: val})}
                  value={newPlacement.student_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.full_name} ({s.roll_number})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input 
                  placeholder="e.g. Google, Microsoft" 
                  value={newPlacement.company_name}
                  onChange={(e) => setNewPlacement({...newPlacement, company_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Package (LPA)</Label>
                <Input 
                  type="number"
                  placeholder="e.g. 12" 
                  value={newPlacement.package_amount}
                  onChange={(e) => setNewPlacement({...newPlacement, package_amount: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleAddPlacement} 
                disabled={isSaving}
                className="gradient-primary text-primary-foreground"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-black">Placement Rate</p>
            <h3 className="text-2xl font-bold mt-2 text-black">78.5%</h3>
            <div className="flex items-center gap-1 text-success text-xs mt-1">
              <TrendingUp className="w-3 h-3 text-black" />
              +5.4% from last year
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-black">Avg Package</p>
            <h3 className="text-2xl font-bold mt-2 text-black">{avgPackage.toFixed(1)} LPA</h3>
            <p className="text-xs text-muted-foreground mt-1 text-black">Across all colleges</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-black">Top Recruiter</p>
            <h3 className="text-2xl font-bold mt-2 text-black">Google</h3>
            <p className="text-xs text-primary font-medium mt-1 text-black">12 Offers Distributed</p>
          </CardContent>
        </Card>
        <Card className="glass border-primary/20">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest text-black">Target Goal</p>
            <h3 className="text-2xl font-bold mt-2 text-black">90%</h3>
            <p className="text-xs text-muted-foreground mt-1 text-black">Goal for academic year 2024</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Recent Placements</CardTitle>
          <CardDescription>Verified job offers from visiting companies</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No placement records found. Add your first hire to begin!
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPlacements.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{p.students?.full_name}</span>
                        <span className="text-xs text-muted-foreground">{p.students?.roll_number}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{p.company_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {p.package_amount} LPA
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(p.placed_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-success text-success-foreground">Placed</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
