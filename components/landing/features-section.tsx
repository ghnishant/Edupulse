"use client"

import { motion } from "framer-motion"
import { 
  BarChart3, 
  FileText, 
  Brain, 
  Shield, 
  Zap, 
  Users,
  LineChart,
  Database,
  MessageSquare,
  Clock
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Advanced machine learning algorithms analyze your institutional data to provide actionable recommendations and predictions.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Monitor key performance indicators with live dashboards that update in real-time as new data flows in.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: FileText,
    title: "Automated Reports",
    description: "Generate NAAC, NBA, and IQAC compliant reports automatically with one click. Save weeks of manual work.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Shield,
    title: "Accreditation Ready",
    description: "Stay compliant with built-in templates and checklists for all major accreditation bodies including NAAC and NBA.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: Database,
    title: "Document Management",
    description: "Upload, organize, and extract insights from PDFs, spreadsheets, and documents with intelligent parsing.",
    color: "bg-info/10 text-info",
  },
  {
    icon: MessageSquare,
    title: "AI Assistant",
    description: "24/7 intelligent chatbot that answers questions about your data, helps generate reports, and provides guidance.",
    color: "bg-destructive/10 text-destructive",
  },
]

const additionalFeatures = [
  { icon: LineChart, label: "Trend Analysis" },
  { icon: Users, label: "Multi-Role Access" },
  { icon: Zap, label: "Instant Processing" },
  { icon: Clock, label: "Historical Data" },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Everything You Need for{" "}
            <span className="text-gradient">Institutional Excellence</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Comprehensive tools designed specifically for higher education institutions 
            to streamline operations and improve outcomes.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Additional Features Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          {additionalFeatures.map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm font-medium"
            >
              <feature.icon className="w-4 h-4 text-primary" />
              <span>{feature.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
