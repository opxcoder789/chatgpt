"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import {
  SpinnerLoader, // Changed from CustomLoader to SpinnerLoader
} from "./components/Icons"
import { streamChatResponse, fileToBase64 } from "./services/geminiService"
import { createClient } from "./lib/supabase/client"
import {
  fetchChatSessions,
  createChatSession,
  saveChatMessage,
  deleteChatSession,
  shareChatSession,
  migrateLocalStorageToSupabase,
  loadChatSession, // Import loadChatSession
} from "./services/supabaseDataService"
import { type ChatMessage, Role, type Attachment, type ChatSession } from "./types"
import { DEFAULT_MODEL, MODELS } from "./constants"

type AuthState = "landing" | "loading" | "authenticated"

export default function App() {
  // App Loading State (Splash Screen)
  const [isAppLoading, setIsAppLoading] = useState(true)
  const [isDataLoading, setIsDataLoading] = useState(false) // New state for database operations

  const [authState, setAuthState] = useState<AuthState>("loading")
  const [userEmail, setUserEmail] = useState("")
  const [supabaseUser, setSupabaseUser] = useState<any>(null)

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([])

  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [showModelMenu, setShowModelMenu] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  // Changed from isSidebarCollapsed: false to use localStorage persistence
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar_collapsed") === "true"
    }
    return false
  })

  // Custom API Key State (with persistence)
  const [customApiKey, setCustomApiKey] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("gemini_custom_api_key") || ""
    }
    return ""
  })

  // Global Error State
  const [globalError, setGlobalError] = useState<string | null>(null)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]) // New state for audio chunks

  const [collapsedMessages, setCollapsedMessages] = useState<Set<string>>(new Set())

  // --- Initialization & Persistence ---

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setSupabaseUser(user)
        setUserEmail(user.email || "")
        setAuthState("authenticated")

        migrateLocalStorageToSupabase().catch(console.error)

        setIsDataLoading(true)
        const sessions = await fetchChatSessions()
        setChatHistory(sessions)
        setIsDataLoading(false)
      } else {
        setAuthState("landing")
      }

      setIsAppLoading(false)
    }

    checkAuth()

    // Listen for auth state changes
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user)
        setUserEmail(session.user.email || "")
        setAuthState("authenticated")

        // Load chat sessions
        setIsDataLoading(true)
        const sessions = await fetchChatSessions()
        setChatHistory(sessions)
        setIsDataLoading(false)
      } else {
        setSupabaseUser(null)
        setUserEmail("")
        setAuthState("landing")
        setChatHistory([])
        setMessages([])
        setCurrentChatId(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // --- Chat Logic ---

  // Helper to update chat history state
  const updateChatHistory = (id: string, msgs: ChatMessage[]) => {
    setChatHistory((prev) => {
      const existingIndex = prev.findIndex((session) => session.id === id)

      // Generate title from first user message
      const firstUserMsg = msgs.find((m) => m.role === Role.USER)
      const title = firstUserMsg
        ? firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? "..." : "")
        : "New Chat"

      const updatedSession: ChatSession = {
        id,
        title: title || "New Chat",
        messages: msgs,
        lastModified: Date.now(),
      }

      if (existingIndex >= 0) {
        const newHistory = [...prev]
        newHistory[existingIndex] = updatedSession
        // Move to top
        newHistory.sort((a, b) => b.lastModified - a.lastModified)
        return newHistory
      } else {
        return [updatedSession, ...prev]
      }
    })
  }

  const startNewChat = () => {
    setMessages([])
    setCurrentChatId(null)
    setIsMobileMenuOpen(false)
  }

  const loadChat = async (chatId: string) => {
    const chat = chatHistory.find((c) => c.id === chatId)
    if (chat) {
      // If messages are already loaded, use them
      if (chat.messages && chat.messages.length > 0) {
        setMessages([...chat.messages])
        setCurrentChatId(chatId)
        setIsMobileMenuOpen(false)
      } else {
        // Load messages from Supabase
        setIsDataLoading(true)
        const loadedSession = await loadChatSession(chatId)
        setIsDataLoading(false)

        if (loadedSession) {
          setMessages([...loadedSession.messages])
          setCurrentChatId(chatId)
          setIsMobileMenuOpen(false)

          // Update chatHistory with loaded messages
          setChatHistory((prev) => prev.map((session) => (session.id === chatId ? loadedSession : session)))
        }
      }
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      setMediaRecorder(recorder)
      setAudioChunks([])

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) setAudioChunks((prev) => [...prev, e.data])
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        // In a real app, you'd send this to an STT service. For now, we simulate.
        console.log("[v0] Recording finished. Blob size:", audioBlob.size)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setIsRecording(true)
      triggerHaptic()
    } catch (err) {
      console.error("Error accessing microphone", err)
      setGlobalError("Microphone access denied or not available.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      triggerHaptic()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments: Attachment[] = []

      const ALLOWED_TYPES = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/gif",
        "text/html",
        "text/css",
        "text/javascript",
        "application/json",
        "text/x-c",
        "text/x-c++",
        "application/x-javascript",
        "text/plain",
      ]
      const RESTRICTED_EXTENSIONS = [".mp4", ".mov", ".avi", ".mp3", ".wav", ".m4a"]

      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i]
        const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase()

        if (RESTRICTED_EXTENSIONS.includes(extension)) {
          setGlobalError(`File type ${extension} is restricted. Video and music are disabled.`)
          continue
        }

        try {
          const base64 = await fileToBase64(file)
          newAttachments.push({
            mimeType: file.type || "text/plain", // Default to text/plain if mimeType is empty
            data: base64,
            name: file.name,
          })
        } catch (err) {
          console.error("Error reading file", err)
          setGlobalError("Failed to process file.")
        }
      }
      setAttachments((prev) => [...prev, ...newAttachments])
      e.target.value = ""
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
      setMessages((prev) => {
        const newMsgs = [...prev]
        if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === Role.MODEL) {
          newMsgs[newMsgs.length - 1].isStreaming = false
        }
        // Update history on stop
        if (currentChatId) {
          updateChatHistory(currentChatId, newMsgs)
        }
        return newMsgs
      })
    }
  }

  const shouldCollapseMessage = useCallback(
    (text: string, messageId: string) => {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768
      const isLongMessage = text.length > 300
      return isMobile && isLongMessage && !collapsedMessages.has(messageId)
    },
    [collapsedMessages],
  )

  const toggleMessageCollapse = useCallback((messageId: string) => {
    setCollapsedMessages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(messageId)) {
        newSet.delete(messageId)
      } else {
        newSet.add(messageId)
      }
      return newSet
    })
  }, [])

  const sendMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) return
    if (isLoading) return

    const userMessageText = inputValue.trim() || "(Attachment)"
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: Role.USER,
      text: userMessageText,
      timestamp: Date.now(),
      attachments: [...attachments],
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setAttachments([])
    setIsLoading(true)
    setGlobalError(null)

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    let sessionId = currentChatId
    if (!sessionId) {
      // Create new session
      const firstWords = userMessageText.split(" ").slice(0, 5).join(" ")
      const title = firstWords.length > 50 ? firstWords.slice(0, 47) + "..." : firstWords
      sessionId = await createChatSession(title || "New Chat")
      if (sessionId) {
        setCurrentChatId(sessionId)
      }
    }

    if (sessionId) {
      await saveChatMessage(sessionId, Role.USER, userMessageText, userMessage.timestamp, userMessage.attachments)
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: Role.MODEL,
      text: "",
      isStreaming: true,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, assistantMessage])

    try {
      const stream = streamChatResponse(messages, userMessageText, userMessage.attachments, selectedModel, customApiKey)

      let fullText = ""
      for await (const chunk of stream) {
        if (abortController.signal.aborted) {
          break
        }
        fullText += chunk
        setMessages((prev) => {
          const newMsgs = [...prev]
          const lastMsg = newMsgs[newMsgs.length - 1]
          if (lastMsg && lastMsg.role === Role.MODEL && lastMsg.id === assistantMessage.id) {
            newMsgs[newMsgs.length - 1] = { ...lastMsg, text: fullText }
          }
          return newMsgs
        })
      }

      if (sessionId) {
        await saveChatMessage(sessionId, Role.MODEL, fullText, assistantMessage.timestamp)
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMessage.id ? { ...m, isStreaming: false, text: fullText } : m)),
      )

      const updatedSessions = await fetchChatSessions()
      setChatHistory(updatedSessions)
    } catch (error: any) {
      setGlobalError(error?.message || "An error occurred while sending your message.")
      setMessages((prev) => prev.filter((m) => m.id !== assistantMessage.id))
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const deleteChat = async (chatId: string) => {
    const success = await deleteChatSession(chatId)
    if (success) {
      setChatHistory((prev) => prev.filter((c) => c.id !== chatId))
      if (currentChatId === chatId) {
        setMessages([])
        setCurrentChatId(null)
      }
    }
  }

  const handleShareChat = async (chatId: string) => {
    triggerHaptic()

    const shareCode = await shareChatSession(chatId)
    if (shareCode) {
      const shareUrl = `${window.location.origin}/chats/${shareCode}`

      // Try to use native share API if available
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Shared Chat",
            text: "Check out this chat!",
            url: shareUrl,
          })
          return
        } catch (err) {
          // Fallback to clipboard if share cancelled or fails
        }
      }

      // Fallback to clipboard
      navigator.clipboard.writeText(shareUrl)
      setGlobalError(null)
      // Show success message
      const successMsg = document.createElement("div")
      successMsg.className =
        "fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-green-500/90 text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 fade-in duration-300"
      successMsg.textContent = "Share link copied to clipboard!"
      document.body.appendChild(successMsg)
      setTimeout(() => successMsg.remove(), 3000)
    } else {
      setGlobalError("Failed to generate share link. Please try again.")
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setShowSettings(false)
  }

  const isTyping = inputValue.length > 0 || attachments.length > 0

  // Get active model name
  const activeModelName = MODELS.find((m) => m.id === selectedModel)?.name || "Gemini"

  const triggerHaptic = useCallback(() => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10) // Subtle haptic feedback
    }
  }, [])

  // Added toggleSidebar function with localStorage persistence
  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => {
      const newState = !prev
      localStorage.setItem("sidebar_collapsed", String(newState))
      triggerHaptic()
      return newState
    })
  }, [triggerHaptic])

  useEffect(() => {
    // Check for shared chat in URL
    const path = window.location.pathname
    if (path.startsWith("/chats/")) {
      const shareCode = path.split("/").pop()
      if (shareCode) {
        // Handle fetching shared chat (readonly or import)
        console.log("[v0] Viewing shared chat:", shareCode)
      }
    }
  }, [])

  /* --- Initial Loader Screen --- */
  if (isAppLoading) {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center flex-col">
        <SpinnerLoader className="w-12 h-12 text-white" />
        <div className="text-neutral-600 text-xs font-semibold tracking-[0.2em] uppercase mt-4 animate-pulse">
          Initializing
        </div>
      </div>
    )
  }

  /* --- Render Main Chat App --- */
  return (
    <div className="flex h-[100dvh] bg-black text-gray-100 font-sans overflow-hidden w-full relative">
      {/* --- Database Operation Loader Overlay --- */}
      {isDataLoading && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-6">
            <SpinnerLoader className="w-10 h-10 text-blue-500" />
            <p className="text-white font-black text-xs tracking-[0.3em] uppercase animate-pulse">Syncing Knowledge</p>
          </div>
        </div>
      )}
    </div>
  )
}
