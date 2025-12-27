import { createClient } from "../lib/supabase/client"
import type { ChatSession, ChatMessage } from "../types"

export interface SupabaseChatSession {
  id: string
  user_id: string
  title: string
  last_modified: string
  is_shared: boolean
  share_code: string | null
}

export interface SupabaseChatMessage {
  id: string
  session_id: string
  role: string
  text: string
  timestamp: number
  attachments: any
}

/**
 * Sanitizes chat text to prevent injection vulnerabilities.
 */
function sanitizeText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// <CHANGE> Optimized to only fetch session metadata, not messages
export async function fetchChatSessions(): Promise<ChatSession[]> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("last_modified", { ascending: false })
    .limit(50) // <CHANGE> Limit to 50 most recent sessions for performance

  if (error) {
    console.error("Error fetching chat sessions:", error)
    return []
  }

  // <CHANGE> Return sessions WITHOUT messages initially - messages loaded on demand
  const sessions: ChatSession[] = (data || []).map((session) => ({
    id: session.id,
    title: session.title,
    messages: [], // Empty initially - loaded when chat is opened
    lastModified: new Date(session.last_modified).getTime(),
  }))

  return sessions
}

export async function fetchChatMessages(sessionId: string): Promise<ChatMessage[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("timestamp", { ascending: true })

  if (error) {
    console.error("Error fetching messages:", error)
    return []
  }

  return (data || []).map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "model",
    text: msg.text,
    timestamp: msg.timestamp,
    attachments: msg.attachments || [],
  }))
}

// <CHANGE> New function to load a complete chat session with messages
export async function loadChatSession(sessionId: string): Promise<ChatSession | null> {
  const supabase = createClient()

  const { data: sessionData, error: sessionError } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("id", sessionId)
    .single()

  if (sessionError || !sessionData) {
    console.error("Error loading chat session:", sessionError)
    return null
  }

  const messages = await fetchChatMessages(sessionId)

  return {
    id: sessionData.id,
    title: sessionData.title,
    messages: messages,
    lastModified: new Date(sessionData.last_modified).getTime(),
  }
}

export async function createChatSession(title: string): Promise<string | null> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.error("User not authenticated")
    return null
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      user_id: user.id,
      title: title,
      last_modified: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating chat session:", error)
    return null
  }

  return data.id
}

export async function saveChatMessage(
  sessionId: string,
  role: "user" | "model",
  text: string,
  timestamp: number,
  attachments?: any[],
): Promise<boolean> {
  const supabase = createClient()

  // V12 Security: Sanitize incoming text
  const sanitizedText = sanitizeText(text)

  const { error } = await supabase.from("chat_messages").insert({
    session_id: sessionId,
    role: role,
    text: sanitizedText,
    timestamp: timestamp,
    attachments: attachments || null,
  })

  if (error) {
    console.error("Error saving message:", error)
    return false
  }

  // Update session last_modified
  await supabase.from("chat_sessions").update({ last_modified: new Date().toISOString() }).eq("id", sessionId)

  return true
}

export async function updateChatSessionTitle(sessionId: string, title: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("chat_sessions").update({ title }).eq("id", sessionId)

  if (error) {
    console.error("Error updating chat session title:", error)
    return false
  }

  return true
}

export async function deleteChatSession(sessionId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("chat_sessions").delete().eq("id", sessionId)

  if (error) {
    console.error("Error deleting chat session:", error)
    return false
  }

  return true
}

export async function shareChatSession(sessionId: string): Promise<string | null> {
  const supabase = createClient()

  // Generate a random share code
  const shareCode = Math.random().toString(36).substring(2, 12).toUpperCase()

  const { error } = await supabase
    .from("chat_sessions")
    .update({
      is_shared: true,
      share_code: shareCode,
    })
    .eq("id", sessionId)

  if (error) {
    console.error("Error sharing chat session:", error)
    return null
  }

  return shareCode
}

export async function fetchSharedChat(shareCode: string): Promise<ChatSession | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("share_code", shareCode)
    .eq("is_shared", true)
    .single()

  if (error || !data) {
    console.error("Error fetching shared chat:", error)
    return null
  }

  const messages = await fetchChatMessages(data.id)

  return {
    id: data.id,
    title: data.title,
    messages: messages,
    lastModified: new Date(data.last_modified).getTime(),
  }
}

export async function migrateLocalStorageToSupabase(): Promise<boolean> {
  if (typeof window === "undefined") return false

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const savedHistory = localStorage.getItem("gemini_chat_history")
  if (!savedHistory) return true // Nothing to migrate

  try {
    const localChats: ChatSession[] = JSON.parse(savedHistory)

    for (const chat of localChats) {
      // Create session
      const { data: session, error: sessionError } = await supabase
        .from("chat_sessions")
        .insert({
          user_id: user.id,
          title: chat.title,
          last_modified: new Date(chat.lastModified).toISOString(),
        })
        .select()
        .single()

      if (sessionError) {
        console.error("Error migrating session:", sessionError)
        continue
      }

      // Insert messages
      const messagesToInsert = chat.messages.map((msg) => ({
        session_id: session.id,
        role: msg.role,
        text: msg.text,
        timestamp: msg.timestamp,
        attachments: msg.attachments || null,
      }))

      const { error: messagesError } = await supabase.from("chat_messages").insert(messagesToInsert)

      if (messagesError) {
        console.error("Error migrating messages:", messagesError)
      }
    }

    // Clear localStorage after successful migration
    localStorage.removeItem("gemini_chat_history")
    return true
  } catch (e) {
    console.error("Error during migration:", e)
    return false
  }
}
