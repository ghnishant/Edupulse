import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  created_at: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setNotifications(data || [])
      setLoading(false)
    } catch (err) {
      console.error("Error fetching notifications:", err)
      setLoading(false)
    }
  }, [])

  const markAsRead = async (id: string) => {
    try {
      const supabase = createClient()
      await supabase.from("notifications").update({ read: true }).eq("id", id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase.from("notifications").update({ read: true }).eq("user_id", user.id)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error("Error marking all as read:", err)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const supabase = createClient()
      await supabase.from("notifications").delete().eq("id", id)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error("Error deleting notification:", err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    refresh: fetchNotifications 
  }
}
