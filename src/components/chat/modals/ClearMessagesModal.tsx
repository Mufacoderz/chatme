"use client"

import { useRef } from "react"
import { FiX } from "react-icons/fi"
import { ModalPortal } from "@/components/ui/ModalPortal"

type Props = {
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onClose: () => void
}

export default function ClearMessagesModal({ title, description, confirmLabel, onConfirm, onClose }: Props) {
  // Ghost click dari touch bisa nimpa backdrop sesaat setelah modal mount.
  const openedAt = useRef(Date.now())
  const GHOST_CLICK_GUARD_MS = 350

  function handleBackdropClick(e: React.MouseEvent) {
    if (Date.now() - openedAt.current < GHOST_CLICK_GUARD_MS) return
    if (e.target !== e.currentTarget) return
    onClose()
  }

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3"
        style={{ background: "#00000070", backdropFilter: "blur(4px)" }}
        onClick={handleBackdropClick}
      >
        <div className="neo-panel w-full max-w-sm rounded-2xl bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold font-sora text-sm text-[var(--text)]">{title}</p>
            <button onClick={onClose} className="text-[var(--text3)]">
              <FiX size={18} />
            </button>
          </div>

          <p className="text-sm text-[var(--text3)] mb-6">
            {description}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="neo-button flex-1 rounded-xl py-3 text-sm font-medium bg-[var(--surface2)] text-[var(--text)]"
            >
              Batal
            </button>
            <button
              onClick={() => { onConfirm(); onClose() }}
              className="neo-button flex-1 rounded-xl py-3 text-sm font-bold"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}
