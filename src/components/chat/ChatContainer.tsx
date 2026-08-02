"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { FiChevronUp, FiChevronDown, FiX } from "react-icons/fi"
import ChatMessages from "./ChatMessages"
import ChatHeader from "./ChatHeader"
import ChatInput from "./ChatInput"
import SnoozeModal from "./modals/SnoozeModal"
import UndoToast from "./UndoToast"
import { MessageActionsProvider, useMessageActions } from "@/hooks/useMessageActions"
import { useMarkRemindedAndDone, useClearMessages, useClearBotMessages } from "@/hooks/useMessages"
import { MessageType } from "@prisma/client"
import type { ChatMessage } from "@/types/chat"

type Props = {
  room: { id: string; name: string; icon: string; description: string | null }
  messages: ChatMessage[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  onLoadMore: () => void
}

function ChatContainerInner({ room, messages, loading, loadingMore, hasMore, onLoadMore }: Props) {
  const roomId = room.id
  const { toggleDone, markReminded, setReminder, removeFromView, restoreToView, commitDelete } = useMessageActions()
  const markRemindedAndDone = useMarkRemindedAndDone(roomId)
  const clearMessages = useClearMessages(roomId)
  const clearBotMessages = useClearBotMessages(roomId)

  const [snoozeBotId, setSnoozeBotId] = useState<string | null>(null)
  const [snoozeSourceId, setSnoozeSourceId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [undoMessageId, setUndoMessageId] = useState<string | null>(null)
  const pendingDeleteRef = useRef<ChatMessage | null>(null)
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reminders = useMemo(
    () => messages.filter((m) => !m.isBot && m.remindAt && !m.isRemindDone),
    [messages]
  )

  const matchedMessages = useMemo(
    () =>
      searchQuery.trim()
        ? messages.filter((m) => !m.isBot && m.text.toLowerCase().includes(searchQuery.toLowerCase()))
        : [],
    [messages, searchQuery]
  )

  function handleSearch(query: string) {
    setSearchQuery(query)
    setActiveIndex(0)
  }

  const handleBotDone = useCallback((botMessageId: string, sourceMessageId: string) => {
    toggleDone.mutate({ id: sourceMessageId, isDone: true })
    markReminded.mutate({ id: botMessageId })
  }, [toggleDone, markReminded])

  const handleBotSnooze = useCallback((botMessageId: string, sourceMessageId: string) => {
    setSnoozeBotId(botMessageId)
    setSnoozeSourceId(sourceMessageId)
  }, [])

  async function handleSnoozeSelect(minutes: number) {
    if (!snoozeBotId || !snoozeSourceId) return
    const newRemindAt = new Date(Date.now() + minutes * 60 * 1000)
    setReminder.mutate({ id: snoozeSourceId, remindAt: newRemindAt.toISOString() })
    markReminded.mutate({ id: snoozeBotId })
    setSnoozeBotId(null)
    setSnoozeSourceId(null)
  }

  function handleReminderDone(messageId: string) {
    markRemindedAndDone.mutate({ id: messageId })
  }

  function handleClear() {
    clearMessages.mutate({ roomId })
  }

  function handleClearBots() {
    clearBotMessages.mutate({ roomId })
  }

  // Klik hapus -> pesan langsung hilang dari chat (optimistic). Kalau
  // masih ada delete lain yg lagi nunggu di undo-window, itu difinalisasi
  // duluan (dihapus permanen) sebelum yg baru mulai — cuma ada 1 slot
  // undo aktif dalam satu waktu.
  function handleDeleteMessage(message: ChatMessage) {
    if (pendingDeleteRef.current) {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
      commitDelete(pendingDeleteRef.current.id)
    }

    removeFromView(message.id)
    pendingDeleteRef.current = message
    setUndoMessageId(message.id)

    undoTimerRef.current = setTimeout(() => {
      commitDelete(message.id)
      pendingDeleteRef.current = null
      setUndoMessageId(null)
      undoTimerRef.current = null
    }, 5000)
  }

  function handleUndo() {
    if (!pendingDeleteRef.current) return
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current)
      undoTimerRef.current = null
    }
    restoreToView(pendingDeleteRef.current)
    pendingDeleteRef.current = null
    setUndoMessageId(null)
  }

  // Kalau user pindah room/nutup chat pas masih ada delete yg nunggu di
  // undo-window, langsung finalisasi (hapus permanen) — jangan biarin
  // ke-cancel gitu aja, soalnya pesannya udah kelanjur ilang dari cache.
  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
      if (pendingDeleteRef.current) commitDelete(pendingDeleteRef.current.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ChatHeader
        roomId={roomId}
        name={room.name}
        icon={room.icon}
        description={room.description}
        messageCount={messages.filter((m) => !m.isBot && m.type !== MessageType.CHECKLIST).length}
        reminders={reminders}
        messages={messages}
        onReminderDone={handleReminderDone}
        onClear={handleClear}
        onClearBots={handleClearBots}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />

      {searchQuery.trim() && (
        <div
          className="flex items-center justify-between px-4 py-2 border-b text-xs"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <span style={{ color: "var(--text3)" }}>
            {matchedMessages.length > 0
              ? `${activeIndex + 1} dari ${matchedMessages.length} hasil`
              : "Tidak ada hasil"}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              disabled={activeIndex === 0 || matchedMessages.length === 0}
              className="p-1 rounded-lg transition-opacity disabled:opacity-30 hover:bg-[var(--surface2)]"
              style={{ color: "var(--text2)" }}
            >
              <FiChevronUp size={16} />
            </button>
            <button
              onClick={() => setActiveIndex((i) => Math.min(matchedMessages.length - 1, i + 1))}
              disabled={activeIndex === matchedMessages.length - 1 || matchedMessages.length === 0}
              className="p-1 rounded-lg transition-opacity disabled:opacity-30 hover:bg-[var(--surface2)]"
              style={{ color: "var(--text2)" }}
            >
              <FiChevronDown size={16} />
            </button>
            <button
              onClick={() => {
                setSearchQuery("")
                setActiveIndex(0)
              }}
              className="p-1 rounded-lg hover:bg-[var(--surface2)] ml-1"
              style={{ color: "var(--text3)" }}
            >
              <FiX size={14} />
            </button>
          </div>
        </div>
      )}

      <ChatMessages
        messages={messages}
        isLoading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        onBotDone={handleBotDone}
        onBotSnooze={handleBotSnooze}
        onDeleteMessage={handleDeleteMessage}
        roomId={roomId}
        searchQuery={searchQuery}
        activeMatchId={matchedMessages[activeIndex]?.id ?? null}
      />

      <ChatInput
        roomId={roomId}
      />

      {undoMessageId && (
        <UndoToast
          message="Catatan telah dihapus"
          onUndo={handleUndo}
          onTimeout={() => setUndoMessageId(null)}
        />
      )}

      {snoozeBotId && (
        <SnoozeModal
          onSelect={handleSnoozeSelect}
          onClose={() => {
            setSnoozeBotId(null)
            setSnoozeSourceId(null)
          }}
        />
      )}
    </div>
  )
}

export default function ChatContainer(props: Props) {
  return (
    <MessageActionsProvider roomId={props.room.id}>
      <ChatContainerInner {...props} />
    </MessageActionsProvider>
  )
}