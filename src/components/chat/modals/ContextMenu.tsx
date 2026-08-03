// Context menu yang muncul saat long-press bubble
// Posisinya absolute mengikuti posisi klik/touch
// "use client" karena ada event handler

"use client"

import { useState } from "react"
import { FiCopy, FiCheck, FiBell, FiBookmark, FiTrash2, FiCheckCircle, FiEdit2, FiX } from "react-icons/fi"
import { ModalPortal } from "@/components/ui/ModalPortal"

type Props = {
  x: number
  y: number
  isChecklist?: boolean
  taskStatus: "PENDING" | "DONE" | "NOT_DONE"
  isPinned: boolean
  hasActiveReminder: boolean
  canEditByTime: boolean
  onCopy: () => void
  onEdit: () => void
  onSetStatus: (status: "PENDING" | "DONE" | "NOT_DONE") => void
  onRemind: () => void
  onMarkReminded: () => void
  onTogglePin: () => void
  onDelete: () => void
  onClose: () => void
}

export default function ContextMenu({
  x, y, isChecklist = false, taskStatus, isPinned, hasActiveReminder, canEditByTime,
  onCopy, onEdit, onSetStatus, onRemind, onMarkReminded, onTogglePin, onDelete, onClose
}: Props) {

  // Ghost click dari touch (synthetic click yang dikirim browser setelah
  // touchend) bisa nimpa backdrop sesaat setelah modal mount — klik di bawah
  // jendela ini diabaikan.
  const [openedAt] = useState(() => Date.now())
  const GHOST_CLICK_GUARD_MS = 350

  function handleBackdropClick() {
    if (Date.now() - openedAt < GHOST_CLICK_GUARD_MS) return
    onClose()
  }

  // pastiin menu tidak keluar dari viewport
  const safeY = Math.min(y, window.innerHeight - 280)
  const safeX = Math.max(8, Math.min(x - 100, window.innerWidth - 210))

  const items = [
    ...(!isChecklist ? [{
      icon: <FiCopy size={15} />,
      label: "Salin",
      onClick: onCopy,
      danger: false,
    }] : []),
    ...(!isChecklist && taskStatus === "PENDING" && canEditByTime ? [{
      icon: <FiEdit2 size={15} />,
      label: "Edit Catatan",
      onClick: onEdit,
      danger: false,
    }] : []),
    ...(!isChecklist ? (
      taskStatus === "PENDING"
        ? [
            { icon: <FiCheck size={15} />, label: "Tandai Selesai", onClick: () => onSetStatus("DONE"), danger: false },
            { icon: <FiX size={15} />, label: "Tandai Tidak Dilakukan", onClick: () => onSetStatus("NOT_DONE"), danger: false },
          ]
        : [
            { icon: <FiCheck size={15} />, label: "Tandai Belum Selesai", onClick: () => onSetStatus("PENDING"), danger: false },
          ]
    ) : []),
    {
      icon: hasActiveReminder ? <FiCheckCircle size={15} /> : <FiBell size={15} />,
      label: hasActiveReminder ? "Tandai sudah diingatkan" : "Ingatkan",
      onClick: hasActiveReminder ? onMarkReminded : onRemind,
      danger: false,
    },
    {
      icon: <FiBookmark size={15} />,
      label: isPinned ? "Unpin" : isChecklist ? "Pin Checklist" : "Pin Catatan",
      onClick: onTogglePin,
      danger: false,
    },
    {
      icon: <FiTrash2 size={15} />,
      label: "Hapus",
      onClick: onDelete,
      danger: true,
    },
  ]

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-40"
        onClick={handleBackdropClick}
      >
        <div
          className="neo-panel fixed z-50 min-w-[200px] overflow-hidden rounded-xl bg-[var(--surface2)]"
          style={{
            top: safeY,
            left: safeX,
            animation: "menuPop 0.15s ease",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick(); onClose() }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors border-b-2 last:border-b-0 border-[var(--neo-line)]"
              style={{
                color: item.danger ? "#fca5a5" : "var(--text)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--surface3)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </ModalPortal>
  )
}
