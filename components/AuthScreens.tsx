"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AppleIcon, GoogleIcon } from "./Icons"
import { createClient } from "../lib/supabase/client"

const DISPOSABLE_DOMAINS = ["tempmail.com", "mailinator.com", "guerrillamail.com", "10minutemail.com", "yopmail.com"]

export const AuthScreens: React.FC<{ onAuthSuccess: (email: string) => void }> = ({ onAuthSuccess }) => {
  const [view, setView] = useState<"login" | "signup" | "verify">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)

  useEffect(() => {
    if (lockoutTime) {
      const interval = setInterval(() => {
        const remaining = lockoutTime - Date.now()
        if (remaining <= 0) {
          setLockoutTime(null)
          localStorage.removeItem("auth_lockout")
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [lockoutTime])

  useEffect(() => {
    const savedLockout = localStorage.getItem("auth_lockout")
    if (savedLockout) {
      const time = Number.parseInt(savedLockout)
      if (time > Date.now()) setLockoutTime(time)
    }
  }, [])

  const validateEmail = (email: string) => {
    const domain = email.split("@")[1]?.toLowerCase()
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      const unlockTime = Date.now() + 3 * 60 * 1000 // 3 minutes lockout
      setLockoutTime(unlockTime)
      localStorage.setItem("auth_lockout", String(unlockTime))
      return false
    }
    return true
  }

  const handleAuth = async (isSignUp: boolean) => {
    if (lockoutTime) return
    if (!validateEmail(email)) {
      setError("Disposable emails are not allowed. Device restricted for 3 minutes.")
      return
    }

    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const { data, error: authError } = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin },
          })
        : await supabase.auth.signInWithPassword({ email, password })

      if (authError) throw authError

      if (isSignUp && data.user && !data.session) {
        setView("verify")
      } else if (data.user) {
        onAuthSuccess(data.user.email!)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const showSocialUnavailable = () => {
    setError("Social login is currently unavailable. We are implementing it soon.")
    setTimeout(() => setError(null), 3000)
  }

  const bgImage =
    "https://cdn.dribbble.com/userupload/40215287/file/original-ebf01c6ddff59b937e08d5c7f38160e4.jpg?resize=1024x1024&vertical=center"

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat fixed inset-0 font-sans"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-[340px] md:w-[400px] backdrop-blur-[25px] bg-black/60 border border-white/10 rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl font-extrabold mb-2 tracking-tight uppercase leading-tight">
            {view === "signup" ? "Create\nAccount" : "Welcome\nBack"}
          </h1>
          <p className="text-gray-400 text-xs py-2 px-4 bg-white/5 border border-white/10 rounded-full inline-block font-medium">
            Enter your login information
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[54px] bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 text-white text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[54px] bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 text-white text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-600"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center font-bold px-4 py-2 bg-red-500/10 rounded-lg animate-pulse">
              {error}
            </p>
          )}
          {lockoutTime && (
            <p className="text-orange-400 text-xs text-center font-bold">
              Locked for: {Math.ceil((lockoutTime - Date.now()) / 1000)}s
            </p>
          )}

          <button
            onClick={() => handleAuth(view === "signup")}
            disabled={isLoading || !!lockoutTime}
            className="w-full h-[54px] bg-gradient-to-b from-blue-500 to-blue-700 text-white font-black rounded-2xl shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:shadow-blue-500/40 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-widest text-sm"
          >
            {isLoading ? "Processing..." : view === "signup" ? "SIGN UP" : "LOGIN"}
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Or</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          <div className="flex gap-4">
            <button
              onClick={showSocialUnavailable}
              className="flex-1 h-[54px] bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white text-xs font-bold hover:bg-white/5 transition-all active:scale-95"
            >
              <GoogleIcon className="w-5 h-5" />
              GOOGLE
            </button>
            <button
              onClick={showSocialUnavailable}
              className="flex-1 h-[54px] bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white text-xs font-bold hover:bg-white/5 transition-all active:scale-95"
            >
              <AppleIcon className="w-5 h-5" />
              APPLE
            </button>
          </div>

          <p className="text-center text-gray-500 text-xs mt-8 font-semibold">
            {view === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setView(view === "signup" ? "login" : "signup")}
              className="text-blue-400 font-black hover:underline ml-1"
            >
              {view === "signup" ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
