"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Send,
  User,
  Bot,
  Lightbulb,
  FileText,
  BarChart3,
  HelpCircle,
  Loader2,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  {
    icon: BarChart3,
    text: "What are our key performance metrics this quarter?",
    category: "Analytics",
  },
  {
    icon: FileText,
    text: "Generate a NAAC criteria summary report",
    category: "Reports",
  },
  {
    icon: Lightbulb,
    text: "How can we improve our research output?",
    category: "Insights",
  },
  {
    icon: HelpCircle,
    text: "What documents are needed for NBA accreditation?",
    category: "Help",
  },
]

const mockResponses: Record<string, string> = {
  default: `I'm your EduPulse AI assistant, here to help you with institutional analytics, report generation, and accreditation guidance. 

Based on your current data, here are some key insights:

**Performance Summary:**
- Overall NAAC score: 3.42 (A+ grade)
- Research publications up 23% YoY
- Student-faculty ratio: 1:18 (target: 1:15)

**Recommended Actions:**
1. Focus on improving faculty ratio in Electronics department
2. Increase industry collaborations for better placements
3. Submit pending NBA documentation by next month

How can I help you further?`,
  metrics: `Here's a summary of your key performance metrics this quarter:

**Academic Performance:**
- Pass rate: 94.2% (up 2.1% from last quarter)
- Average CGPA: 7.8/10
- Research papers published: 42

**Infrastructure Utilization:**
- Lab utilization: 78%
- Library usage: 65%
- Smart classroom adoption: 85%

**Financial Health:**
- Budget utilization: 72%
- Revenue from consultancy: ₹45L
- Research grants received: ₹1.2Cr

Would you like me to generate a detailed report on any specific metric?`,
  naac: `Here's a comprehensive NAAC criteria summary:

**Criterion 1: Curricular Aspects (Score: 85/100)**
- Curriculum design and development: Excellent
- Academic flexibility: Good
- Curriculum enrichment: Very Good

**Criterion 2: Teaching-Learning & Evaluation (Score: 88/100)**
- Student enrollment and profile: Excellent
- Learning resources: Very Good
- Student performance and learning outcomes: Excellent

**Criterion 3: Research, Innovations & Extension (Score: 82/100)**
- Research promotion: Good
- Innovation ecosystem: Very Good
- Extension activities: Excellent

**Areas for Improvement:**
1. Increase PhD faculty percentage
2. More international collaborations
3. Industry-sponsored research projects

Shall I generate the full SSR document draft?`,
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your EduPulse AI assistant. I can help you analyze institutional data, generate reports, and provide insights for accreditation. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let response = mockResponses.default
      if (messageText.toLowerCase().includes("metric") || messageText.toLowerCase().includes("performance")) {
        response = mockResponses.metrics
      } else if (messageText.toLowerCase().includes("naac") || messageText.toLowerCase().includes("criteria")) {
        response = mockResponses.naac
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" />
            AI Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            Get instant insights, generate reports, and ask questions about your data
          </p>
        </motion.div>

        <Card className="glass flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="w-4 h-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div
                      className={`text-xs mt-2 ${
                        message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-secondary">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="w-4 h-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your institution..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="gradient-primary text-primary-foreground"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Suggestions Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="w-full lg:w-80 space-y-4"
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Suggested Questions</CardTitle>
            <CardDescription>Click to ask</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestedQuestions.map((question, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSend(question.text)}
                className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <question.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm group-hover:text-primary transition-colors">
                      {question.text}
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {question.category}
                    </Badge>
                  </div>
                </div>
              </motion.button>
            ))}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Generate NAAC Report
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Lightbulb className="w-4 h-4 mr-2" />
              Get Recommendations
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
