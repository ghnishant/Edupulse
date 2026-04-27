import { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useDashboardStats } from "./use-dashboard-stats"
import { useDocuments } from "./use-documents"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your EduPulse AI assistant. I can help you analyze institutional data, generate reports, and provide insights for accreditation. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const stats = useDashboardStats()
  const docs = useDocuments()

  const generateResponse = (input: string): string => {
    const text = input.toLowerCase()
    
    if (text.includes("performance") || text.includes("stats") || text.includes("metrics")) {
      return `Based on your live data:
- **Total Students:** ${stats.totalStudents}
- **Faculty Members:** ${stats.facultyMembers}
- **Research Papers:** ${stats.researchPapers}
- **Current NAAC Score:** ${stats.naacScore}

Would you like more details on a specific department?`
    }

    if (text.includes("document") || text.includes("upload")) {
      return `You currently have **${docs.stats.total}** documents in the system. 
- **Processed:** ${docs.stats.processed}
- **In Progress:** ${docs.stats.processing}
- **Storage used:** ${docs.stats.storage}

You can upload more documents in the Documents tab for AI extraction.`
    }

    if (text.includes("research")) {
      return `Your research output is currently at **${stats.researchPapers}** papers. The Computer Science department is leading research activities. I recommend focusing on patents and grants next quarter to further improve your score.`
    }

    return `I'm EduPulse AI. I've analyzed your database and can tell you that you have ${stats.departments} active departments with ${stats.totalStudents} students. 

How can I assist you with your accreditation reports today?`
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI processing delay
    setTimeout(() => {
      const response = generateResponse(content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return { messages, isLoading, sendMessage }
}
