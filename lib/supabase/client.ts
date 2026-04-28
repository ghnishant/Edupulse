import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | undefined = undefined

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dnuvhyqoxhbeynbcppfc.supabase.co"
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRudXZoeXFveGhiZXluYmNwcGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDE1MzAsImV4cCI6MjA5Mjg3NzUzMH0.6C2kYTpnz7F7CAULCFFbDl5aAkWGdq2mgzKJIAsh7Xw"

  if (client) return client

  client = createBrowserClient(supabaseUrl, supabaseKey)
  return client
}
