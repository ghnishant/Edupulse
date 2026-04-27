"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Globe, 
  Save,
  Loader2,
  Building2,
  Mail
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [autoProcessing, setAutoProcessing] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    full_name: "",
    role: "",
    email: ""
  })

  useEffect(() => {
    async function getProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        
        if (data) {
          setProfile(data)
          setFormData({
            full_name: data.full_name || "",
            role: data.role || "",
            email: user.email || ""
          })
        }
      }
      setLoading(false)
    }
    getProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
        })
        .eq("id", user.id)

      if (error) throw error
      toast.success("Profile updated successfully")
    } catch (err: any) {
      toast.error(`Update failed: ${err.message}`)
    } finally {
      setSaving(false)
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
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <User className="w-5 h-5" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Update your personal details and how others see you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="pl-10"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    value={formData.email}
                    disabled
                    className="pl-10 bg-muted/50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="role"
                  value={formData.role.replace("_", " ").toUpperCase()}
                  disabled
                  className="pl-10 bg-muted/50 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="gradient-primary text-primary-foreground gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Bell className="w-5 h-5" />
              <CardTitle>Preferences</CardTitle>
            </div>
            <CardDescription>
              Customize your experience and notification settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${emailNotifications ? "bg-primary/5 border border-primary/10" : ""}`}>
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <p className="text-xs text-muted-foreground">
                  Receive daily summaries of institutional reports
                </p>
              </div>
              <Button 
                variant={emailNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setEmailNotifications(!emailNotifications)
                  toast.success(`Email notifications ${!emailNotifications ? 'enabled' : 'disabled'}`)
                }}
              >
                {emailNotifications ? "ON" : "OFF"}
              </Button>
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${autoProcessing ? "bg-primary/5 border border-primary/10" : ""}`}>
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium">Auto-Processing</h4>
                <p className="text-xs text-muted-foreground">
                  Automatically start AI extraction on upload
                </p>
              </div>
              <Button 
                variant={autoProcessing ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setAutoProcessing(!autoProcessing)
                  toast.success(`Auto-processing ${!autoProcessing ? 'enabled' : 'disabled'}`)
                }}
              >
                {autoProcessing ? "ON" : "OFF"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
