"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "EduPulse AI transformed our NAAC preparation. We achieved A++ grade with 50% less effort than our previous cycle.",
    author: "Dr. Rajesh Kumar",
    role: "Vice Chancellor",
    institution: "National Institute of Technology",
    initials: "RK",
  },
  {
    quote: "The AI-powered analytics helped us identify gaps in our research output. Our publications increased by 40% in just one year.",
    author: "Prof. Meera Sharma",
    role: "IQAC Director",
    institution: "Delhi University",
    initials: "MS",
  },
  {
    quote: "Real-time dashboards and automated reports save our administrative team countless hours every month. Highly recommended.",
    author: "Dr. Amit Patel",
    role: "Dean of Academics",
    institution: "IIT Bombay",
    initials: "AP",
  },
  {
    quote: "The document parsing feature is incredible. It extracted data from hundreds of faculty CVs in minutes, not days.",
    author: "Dr. Priya Nair",
    role: "HR Director",
    institution: "Anna University",
    initials: "PN",
  },
  {
    quote: "NBA compliance is now streamlined. The platform automatically tracks all criteria and alerts us about pending items.",
    author: "Prof. Suresh Reddy",
    role: "Department Head, CSE",
    institution: "BITS Pilani",
    initials: "SR",
  },
  {
    quote: "Best investment we made for institutional excellence. The ROI was visible within the first semester itself.",
    author: "Dr. Kavita Singh",
    role: "Principal",
    institution: "St. Xavier&apos;s College",
    initials: "KS",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 relative">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 text-sm font-medium text-success mb-4">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Trusted by{" "}
            <span className="text-gradient">Leading Institutions</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Hear from educators and administrators who have transformed their 
            institutions with EduPulse AI.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full glass hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <p className="text-foreground mb-6 leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.institution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground mb-6">Trusted by institutions across India</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {["IIT", "NIT", "BITS", "DU", "AU", "VIT"].map((inst) => (
              <div key={inst} className="text-2xl font-bold text-muted-foreground">
                {inst}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
