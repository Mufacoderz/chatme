"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ModalPortal } from "./ModalPortal"

type Props = {
  onClose: () => void
  children: React.ReactNode
  className?: string
  /** Matiin klik-backdrop-buat-nutup, misal pas lagi proses hapus. Default true. */
  closeOnBackdrop?: boolean
}

const GHOST_CLICK_GUARD_MS = 350

/**
 * Shell dialog center yang konsisten dipakai semua modal confirm/alert
 * (hapus, clear, dsb). Selalu di tengah, radius all-corner, neo-panel.
 */
export function Dialog({ onClose, children, className, closeOnBackdrop = true }: Props) {
  const [openedAt] = useState(() => Date.now())

  function handleBackdropClick(e: React.MouseEvent) {
    if (!closeOnBackdrop) return
    if (Date.now() - openedAt < GHOST_CLICK_GUARD_MS) return
    if (e.target !== e.currentTarget) return
    onClose()
  }

  return (
    <ModalPortal>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "#00000070", backdropFilter: "blur(4px)" }}
        onClick={handleBackdropClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          className={`neo-panel w-full max-w-sm rounded-2xl bg-[var(--surface)] p-5 ${className ?? ""}`}
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </ModalPortal>
  )
}