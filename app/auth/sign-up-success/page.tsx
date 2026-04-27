"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Mail, CheckCircle2 } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">EduPulse AI</span>
        </Link>

        <Card className="glass text-center">
          <CardHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-success" />
            </motion.div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              {"We've sent you a confirmation link"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-muted/50">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Please check your inbox and spam folder
              </span>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Click the link in the email to verify your account and complete the registration process.</p>
              <p>The link will expire in 24 hours.</p>
            </div>

            <div className="pt-4 space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/login">
                  Back to Sign In
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                {"Didn't receive the email? "}
                <button className="text-primary hover:underline">
                  Resend confirmation
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
