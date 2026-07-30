"use client"

import { Message } from "@prisma/client"
import { FiX, FiCheck, FiBell } from "react-icons/fi"
import { ModalPortal } from "@/components/ui/ModalPortal"

type Props = {
  reminders: Message[]
  onDone: (messageId: string) => void
  onClose: () => void
}

export default function ReminderListModal({ reminders, onDone, onClose }: Props) {
  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center"
        style={{ background: "#00000070", backdropFilter: "blur(4px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
      <div className="neo-panel w-[calc(100%-24px)] max-w-md rounded-2xl bg-[var(--surface)] p-6 pb-8">
        <div className="w-12 h-2 -rotate-1 rounded-md mx-auto mb-5 bg-[var(--accent)] border-2 border-[var(--neo-line)]" />
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold font-sora text-sm text-[var(--text)]">Reminder Aktif</p>
          <button onClick={onClose} className="text-[var(--text3)]">
            <FiX size={18} />
          </button>
        </div>

        {reminders.length === 0 ? (
          <p className="text-sm text-center py-6 text-[var(--text3)]">Tidak ada reminder aktif</p>
        ) : (
          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
            {reminders.map((r) => (
              <div
                key={r.id}
                className="neo-card flex items-center gap-3 rounded-xl p-3"
                style={{ background: "var(--surface2)", borderColor: "var(--border2)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate text-[var(--text)]">{r.text}</p>
                  {r.remindAt && (
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--accent)]">
                      <FiBell size={11} />
                      {new Date(r.remindAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onDone(r.id)}
                  className="neo-button w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 hover:opacity-80"
                  style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
                >
                  <FiCheck size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </ModalPortal>
  )
}