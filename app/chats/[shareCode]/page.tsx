import { Suspense } from "react"
import SharedChatView from "./SharedChatView"

export default function SharedChatPage({ params }: { params: { shareCode: string } }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-black">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white/60 text-sm font-medium">Loading shared chat...</p>
          </div>
        </div>
      }
    >
      <SharedChatView shareCode={params.shareCode} />
    </Suspense>
  )
}
