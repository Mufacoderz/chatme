"use client"

import { FiX, FiClock } from "react-icons/fi"
import { BottomSheet } from "@/components/ui/BottomSheet"

type Props = {
  onSelect: (minutes: number) => void
  onClose: () => void
}

const OPTIONS = [
  { label: "15 Menit", minutes: 15 },
  { label: "1 Jam", minutes: 60 },
  { label: "Besok", minutes: 60 * 24 },
]

export default function SnoozeModal({ onSelect, onClose }: Props) {
  return (
    <BottomSheet onClose={onClose}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <FiClock size={16} className="text-[var(--accent)]" />
          <p className="font-semibold font-sora text-sm text-[var(--text)]">
            Tunda Pengingat
          </p>
        </div>
        <button onClick={onClose} className="text-[var(--text3)]">
          <FiX size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.minutes}
            onClick={() => onSelect(opt.minutes)}
            className="w-full py-3.5 rounded-xl text-sm font-semibold font-sora text-left px-4 border transition-colors hover:bg-[var(--surface2)]"
            style={{
              background: "var(--surface2)",
              borderColor: "var(--border2)",
              color: "var(--text)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </BottomSheet>
  )
}