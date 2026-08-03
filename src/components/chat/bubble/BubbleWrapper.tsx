"use client"

import { useState, useRef, useCallback, memo } from "react"
import ContextMenu from "@/components/chat/modals/ContextMenu"
import RemindModal from "@/components/chat/modals/RemindModal"
import DeleteMessageModal from "@/components/chat/modals/DeleteMessageModal"
import EditMessageModal from "@/components/chat/modals/EditMessageModal"
import MessageBubble from "./MessageBubble"
import ChecklistBubble from "./ChecklistBubble"
import { MessageType } from "@prisma/client"
import { useMessageActions } from "@/hooks/useMessageActions"
import { EDIT_WINDOW_MS } from "@/lib/editWindow"
import type { ChatMessage } from "@/types/chat"

type Props = {
  message: ChatMessage
  roomId: string
  isNew?: boolean
  searchQuery?: string
  onDeleteMessage?: (message: ChatMessage) => void
}

const BubbleWrapper = memo(function BubbleWrapper({
  message,
  roomId,
  isNew = false,
  searchQuery = "",
  onDeleteMessage,
}: Props) {
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)
  const [showRemind, setShowRemind] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartPos = useRef<{ x: number; y: number } | null>(null)
  const MOVE_THRESHOLD = 10 // px

  const { editMessage, togglePin, toggleDone, setReminder, markReminded, checklistToggle } = useMessageActions()

  // Jendela edit 24 jam rolling dari createdAt — sinkron sama enforce di server.
  const canEditByTime = Date.now() - new Date(message.createdAt).getTime() <= EDIT_WINDOW_MS

  function openMenu(x: number, y: number) { setMenuPos({ x, y }) }

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0]
    touchStartPos.current = { x: touch.clientX, y: touch.clientY }
    touchTimer.current = setTimeout(() => openMenu(touch.clientX, touch.clientY), 500)
  }

  // Jari yang gemeter dikit (di bawah threshold) gak boleh batalin long-press.
  function handleTouchMove(e: React.TouchEvent) {
    if (!touchStartPos.current) return
    const touch = e.touches[0]
    const dx = touch.clientX - touchStartPos.current.x
    const dy = touch.clientY - touchStartPos.current.y
    if (Math.sqrt(dx * dx + dy * dy) > MOVE_THRESHOLD) handleTouchEnd()
  }

  function handleTouchEnd() {
    if (touchTimer.current) clearTimeout(touchTimer.current)
    touchStartPos.current = null
  }

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault()
    openMenu(e.clientX, e.clientY)
  }

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(message.text)
  }, [message.text])

  const handleSetStatus = useCallback((status: "PENDING" | "DONE" | "NOT_DONE") => {
    if (message.type === MessageType.CHECKLIST) {
      const nextItems = message.checklistItems.map((item) => ({
        text: item.text,
        isDone: status === "DONE",
      }))
      checklistToggle.mutate({
        id: message.id,
        title: message.text,
        items: nextItems,
      })
      return
    }
    toggleDone.mutate({ id: message.id, status })
  }, [message, toggleDone, checklistToggle])

  const handleTogglePin = useCallback(() => {
    togglePin.mutate({ id: message.id, isPinned: !message.isPinned })
  }, [message.id, message.isPinned, togglePin])

  const handleDelete = useCallback(async () => {
    onDeleteMessage?.(message)
  }, [message, onDeleteMessage])

  const handleEdit = useCallback(async (text: string) => {
    await editMessage.mutateAsync({ id: message.id, text })
  }, [message.id, editMessage])

  const handleRemindSave = useCallback((remindAt: Date) => {
    setReminder.mutate({ id: message.id, remindAt: remindAt.toISOString() })
  }, [message.id, setReminder])

  const handleMarkReminded = useCallback(() => {
    markReminded.mutate({ id: message.id })
  }, [message.id, markReminded])

  return (
    <>
      <div className="select-none">
        {message.type === MessageType.CHECKLIST ? (
          <ChecklistBubble
            message={message}
            roomId={roomId}
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          />
        ) : (
          <MessageBubble
            message={message}
            isNew={isNew}
            searchQuery={searchQuery}
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          />
        )}
      </div>

      {menuPos && (
        <ContextMenu
          x={menuPos.x}
          y={menuPos.y}
          isChecklist={message.type === MessageType.CHECKLIST}
          taskStatus={message.taskStatus}
          isPinned={message.isPinned}
          hasActiveReminder={Boolean(message.remindAt && !message.isRemindDone)}
          canEditByTime={canEditByTime}
          onCopy={handleCopy}
          onEdit={() => { setMenuPos(null); setShowEdit(true) }}
          onSetStatus={handleSetStatus}
          onRemind={() => { setMenuPos(null); setShowRemind(true) }}
          onMarkReminded={handleMarkReminded}
          onTogglePin={handleTogglePin}
          onDelete={() => { setMenuPos(null); setShowDelete(true) }}
          onClose={() => setMenuPos(null)}
        />
      )}

      {showRemind && (
        <RemindModal
          messageId={message.id}
          messageText={message.text}
          onClose={() => setShowRemind(false)}
          onSave={handleRemindSave}
        />
      )}

      {showEdit && message.type === MessageType.TEXT && (
        <EditMessageModal
          initialText={message.text}
          onSave={handleEdit}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showDelete && (
        <DeleteMessageModal
          label={message.type === MessageType.CHECKLIST ? "checklist" : "catatan"}
          onConfirm={handleDelete}
          onClose={() => setShowDelete(false)}
        />
      )}
    </>
  )
})

export default BubbleWrapper