"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { login } from "@/lib/actions/auth"

interface LoginCredentials {
  email: string
  motDePasse: string
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    motDePasse: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(credentials)

      if (result.success) {
        // Show success message
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })

        // Get the callback URL from the search params or default to home
        const callbackUrl = searchParams.get("callbackUrl") || "/"
        router.push(callbackUrl)
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: result.error || "Please check your credentials and try again.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show error message if redirected with error
  const error = searchParams.get("error")
  if (error) {
    const errorMessages: { [key: string]: string } = {
      unauthorized: "You need to be logged in to access this page.",
      session_expired: "Your session has expired. Please log in again.",
    }

    toast({
      variant: "destructive",
      title: "Authentication Error",
      description: errorMessages[error] || "Please log in to continue.",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <div className="relative w-full max-w-lg">
        {/* Decorative elements */}
        <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40">
          <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
          <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
        </div>

        <div className="relative p-8 bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Please enter your credentials to sign in</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                disabled={isLoading}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={credentials.motDePasse}
                  onChange={(e) =>
                    setCredentials({ ...credentials, motDePasse: e.target.value })
                  }
                  disabled={isLoading}
                  className="w-full pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 font-semibold text-primary hover:text-primary/80"
                onClick={() => router.push("/register")}
              >
                Sign up
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}