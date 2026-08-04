"use client"

import { useState } from "react"
import { motion, useDragControls, type PanInfo } from "framer-motion"
import { ModalPortal } from "./ModalPortal"

type Props = {
  onClose: () => void
  children: React.ReactNode
  className?: string
}

const GHOST_CLICK_GUARD_MS = 350
// Jarak & kecepatan drag minimum sebelum dianggap "user mau nutup".
const CLOSE_DRAG_THRESHOLD_PX = 120
const CLOSE_VELOCITY_THRESHOLD = 500

/**
 * Shell bottom sheet yang konsisten dipakai semua modal "form/list/edit".
 * - Nempel rata di bawah layar (rounded-t aja, full width)
 * - Bisa ditutup dengan drag ke bawah lewat handle bar (bukan cuma dekoratif)
 * - Backdrop bisa diklik buat nutup (dengan ghost-click guard 350ms)
 */
export function BottomSheet({ onClose, children, className }: Props) {
  const [openedAt] = useState(() => Date.now())
  const [closing, setClosing] = useState(false)
  const dragControls = useDragControls()

  function handleBackdropClick(e: React.MouseEvent) {
    if (Date.now() - openedAt < GHOST_CLICK_GUARD_MS) return
    if (e.target !== e.currentTarget) return
    onClose()
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    const shouldClose =
      info.offset.y > CLOSE_DRAG_THRESHOLD_PX || info.velocity.y > CLOSE_VELOCITY_THRESHOLD
    if (shouldClose) setClosing(true)
  }

  function startDrag(e: React.PointerEvent) {
    dragControls.start(e)
  }

  return (
    <ModalPortal>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center"
        style={{ background: "#00000070", backdropFilter: "blur(4px)" }}
        onClick={handleBackdropClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          className={`w-full max-w-md rounded-t-3xl border-t border-[var(--border2)] bg-[var(--surface)] px-6 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] ${className ?? ""}`}
          drag="y"
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={handleDragEnd}
          initial={{ y: "100%" }}
          animate={{ y: closing ? "100%" : 0 }}
          transition={
            closing
              ? { duration: 0.2, ease: "easeIn" }
              : { type: "spring", damping: 32, stiffness: 340 }
          }
          onAnimationComplete={() => {
            if (closing) onClose()
          }}
        >
          <div
            onPointerDown={startDrag}
            className="-mt-1 mb-3 mx-auto flex h-6 w-16 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
            aria-hidden="true"
          >
            <div className="h-1.5 w-10 rounded-full bg-[var(--border2)]" />
          </div>
          {children}
        </motion.div>
      </motion.div>
    </ModalPortal>
  )
}