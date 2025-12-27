"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/Icons"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import { fetchSharedChat } from "@/services/supabaseDataService"
import type { ChatSession } from "@/types"
import { Role } from "@/types"

export default function SharedChatView({ shareCode }: { shareCode: string }) {
  const [chat, setChat] = useState<ChatSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadSharedChat = async () => {
      try {
        const sharedChat = await fetchSharedChat(shareCode)
        if (sharedChat) {
          setChat(sharedChat)
        } else {
          setError("Chat not found or not shared.")
        }
      } catch (err) {
        setError("Failed to load shared chat.")
      } finally {
        setLoading(false)
      }
    }

    loadSharedChat()
  }, [shareCode])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 text-sm font-medium">Loading shared chat...</p>
        </div>
      </div>
    )
  }

  if (error || !chat) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-red-500"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white">Chat Not Found</h1>
          <p className="text-gray-400 text-sm max-w-md">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-black text-gray-100 font-sans overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 md:px-6 md:py-4 border-b border-white/5 bg-black">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Logo className="w-5 h-5 text-black" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-white truncate max-w-[200px] md:max-w-none">{chat.title}</h1>
            <span className="text-xs text-gray-500">Shared Chat</span>
          </div>
        </div>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white rounded-lg text-sm font-medium transition-colors border border-white/5"
        >
          Open in ChatGPT
        </button>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-4 md:px-0 scrollbar-thin">
        <div className="flex flex-col w-full max-w-3xl mx-auto py-6">
          {chat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full mb-6 ${msg.role === Role.USER ? "justify-end" : "justify-start"}`}
            >
              {/* Model Avatar */}
              {msg.role === Role.MODEL && (
                <div className="flex-shrink-0 mr-4 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-[#19c37d] flex items-center justify-center text-white shadow-sm ring-1 ring-white/10">
                    <Logo className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              {/* Message Content */}
              <div
                className={`flex flex-col ${msg.role === Role.USER ? "items-end max-w-[85%] sm:max-w-[75%]" : "max-w-full min-w-0 flex-1"}`}
              >
                <div
                  className={`
                    ${
                      msg.role === Role.USER
                        ? "bg-[#0a0a0a] text-white rounded-[26px] rounded-br-sm px-5 py-3.5 border border-white/5 shadow-md"
                        : "text-gray-100 leading-relaxed pt-1"
                    }
                `}
                >
                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div
                      className={`flex flex-wrap gap-2 mb-3 ${msg.role === Role.USER ? "justify-end" : "justify-start"}`}
                    >
                      {msg.attachments.map((att, i) => (
                        <div
                          key={i}
                          className="relative group overflow-hidden rounded-xl border border-white/5 shadow-sm"
                        >
                          {att.mimeType.startsWith("image/") ? (
                            <img
                              src={`data:${att.mimeType};base64,${att.data}`}
                              alt="attachment"
                              className="h-32 w-auto object-cover"
                            />
                          ) : (
                            <div className="h-20 w-24 flex items-center justify-center bg-[#0a0a0a] text-xs text-gray-500 p-2 break-all font-medium">
                              {att.name || "File"}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Text Content */}
                  <div className={msg.role === Role.USER ? "whitespace-pre-wrap break-words" : "w-full min-w-0"}>
                    {msg.role === Role.MODEL ? <MarkdownRenderer content={msg.text} /> : msg.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <div className="border-t border-white/5 px-4 py-4 bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-2">This is a read-only shared chat</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            Start Your Own Chat
          </button>
        </div>
      </div>
    </div>
  )
}
