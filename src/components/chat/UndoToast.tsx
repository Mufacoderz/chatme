"use client"

import { useEffect } from "react"
import { FiRotateCcw } from "react-icons/fi"

type Props = {
  message: string
  onUndo: () => void
  onTimeout: () => void
  duration?: number
}

export default function UndoToast({ message, onUndo, onTimeout, duration = 5000 }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTimeout()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onTimeout])

  return (
    <div className="fixed bottom-6 left-3 right-3 z-50 flex justify-center pointer-events-none">
      <div
        className="neo-panel pointer-events-auto flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg animate-slide-up"
        style={{
          background: "var(--surface2)",
          border: "2px solid var(--neo-line)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <p className="flex-1 text-sm text-[var(--text)] truncate">{message}</p>
        <button
          onClick={onUndo}
          className="neo-button flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold flex-shrink-0"
          style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
        >
          <FiRotateCcw size={13} />
          Urungkan
        </button>
      </div>
    </div>
  )
}
