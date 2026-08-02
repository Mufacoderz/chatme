"use client"

import { useState } from "react"
import { FiX, FiLoader } from "react-icons/fi"
import { ModalPortal } from "@/components/ui/ModalPortal"

type Props = {
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => Promise<void>
  onClose: () => void
}

export default function ClearMessagesModal({ title, description, confirmLabel, onConfirm, onClose }: Props) {
  const [openedAt] = useState(() => Date.now())
  const [pending, setPending] = useState(false)
  const GHOST_CLICK_GUARD_MS = 350

  function handleBackdropClick(e: React.MouseEvent) {
    if (pending) return
    if (Date.now() - openedAt < GHOST_CLICK_GUARD_MS) return
    if (e.target !== e.currentTarget) return
    onClose()
  }

  async function handleConfirm() {
    setPending(true)
    try {
      await onConfirm()
      onClose()
    } catch {
      // gagal → reset, biarin user coba lagi (pola sama kayak DeleteAccountModal)
      setPending(false)
    }
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
            {!pending && (
              <button onClick={onClose} className="text-[var(--text3)]">
                <FiX size={18} />
              </button>
            )}
          </div>

          <p className="text-sm text-[var(--text3)] mb-6">{description}</p>

          {pending ? (
            <div className="flex items-center justify-center gap-2 py-3">
              <FiLoader size={16} className="animate-spin text-[var(--text3)]" />
              <span className="text-sm font-medium text-[var(--text)]">Menghapus...</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="neo-button flex-1 rounded-xl py-3 text-sm font-medium bg-[var(--surface2)] text-[var(--text)]"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className="neo-button flex-1 rounded-xl py-3 text-sm font-bold"
                style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
              >
                {confirmLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  )
}
