// Context menu yang muncul saat long-press bubble
// Posisinya absolute mengikuti posisi klik/touch
// "use client" karena ada event handler

"use client"

import { useLayoutEffect, useState, useRef } from "react"
import { FiCopy, FiCheck, FiBell, FiBookmark, FiTrash2, FiCheckCircle, FiEdit2, FiX, FiCheckSquare, FiRefreshCw } from "react-icons/fi"
import { ModalPortal } from "@/components/ui/ModalPortal"
import type { OutboxItem } from "@/lib/outbox"

type Props = {
  x: number
  y: number
  isChecklist?: boolean
  taskStatus: "PENDING" | "DONE" | "NOT_DONE"
  isPinned: boolean
  hasActiveReminder: boolean
  canEditByTime: boolean
  pendingOutbox?: OutboxItem
  onCancelSend?: () => void
  onRetrySend?: () => void
  onCopy: () => void
  onEdit: () => void
  onSetStatus: (status: "PENDING" | "DONE" | "NOT_DONE") => void
  onRemind: () => void
  onMarkReminded: () => void
  onTogglePin: () => void
  onDelete: () => void
  onSelect: () => void
  onClose: () => void
}

export default function ContextMenu({
  x, y, isChecklist = false, taskStatus, isPinned, hasActiveReminder, canEditByTime,
  pendingOutbox, onCancelSend, onRetrySend,
  onCopy, onEdit, onSetStatus, onRemind, onMarkReminded, onTogglePin, onDelete, onSelect, onClose
}: Props) {

  // Ghost click dari touch (synthetic click yang dikirim browser setelah
  // touchend) bisa nimpa backdrop sesaat setelah modal mount — klik di bawah
  // jendela ini diabaikan.
  const [openedAt] = useState(() => Date.now())
  const GHOST_CLICK_GUARD_MS = 350
  const pointerDownAtRef = useRef<number | null>(null)

  function handleBackdropPointerDown() {
    pointerDownAtRef.current = Date.now()
  }

  function handleBackdropClick() {
    // Kalau pointerdown-nya terjadi SEBELUM modal dibuka (bukan setelah), itu
    // sisa dari long-press yg ngebuka modal ini — release nya bikin synthetic
    // click. Jangan dianggap click abis backdrop, supaya long-press tahan lama
    // (jauh di atas guard waktu) juga gak nutup modal.
    if (pointerDownAtRef.current !== null && pointerDownAtRef.current < openedAt) {
      pointerDownAtRef.current = null
      return
    }
    if (Date.now() - openedAt < GHOST_CLICK_GUARD_MS) return
    onClose()
  }

  // Posisi menu dihitung dari UKURAN ASLI-nya (bukan angka fix kayak
  // sebelumnya), soalnya jumlah item context menu beda-beda tergantung
  // kondisi (checklist vs teks, ada reminder aktif atau nggak, dst) jadi
  // tingginya gak konstan. Diukur sesudah mount, lalu di-clamp/flip biar
  // selalu ada di dalam viewport.
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: y, left: x, maxHeight: 9999, ready: false })

  useLayoutEffect(() => {
    const el = menuRef.current
    if (!el) return

    const margin = 8
    const { offsetWidth, offsetHeight } = el

    let left = x - 100
    left = Math.max(margin, Math.min(left, window.innerWidth - offsetWidth - margin))

    const spaceBelow = window.innerHeight - y - margin
    const spaceAbove = y - margin
    let top: number

    if (offsetHeight <= spaceBelow) {
      // cukup ruang di bawah titik klik/tap
      top = y
    } else if (offsetHeight <= spaceAbove) {
      // gak cukup di bawah, tapi cukup kalau dibuka ke atas
      top = y - offsetHeight
    } else {
      // dua-duanya gak cukup (menu lebih tinggi dari layar) — nempel ke
      // sisi yang ruangnya lebih gede, sisanya bisa discroll
      top = spaceBelow >= spaceAbove ? y : margin
    }
    top = Math.max(margin, Math.min(top, window.innerHeight - margin))

    setPos({
      top,
      left,
      maxHeight: window.innerHeight - margin * 2,
      ready: true,
    })
  }, [x, y])

  const items = pendingOutbox
    ? [
        ...(pendingOutbox.status === "failed" ? [{
          icon: <FiRefreshCw size={15} />, label: "Coba Lagi", onClick: onRetrySend!, danger: false,
        }] : []),
        { icon: <FiTrash2 size={15} />, label: "Batalkan Pengiriman", onClick: onCancelSend!, danger: true },
      ]
    : [
    ...(!isChecklist ? [{
      icon: <FiCheckSquare size={15} />,
      label: "Pilih",
      onClick: onSelect,
      danger: false,
    }] : []),
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
        onPointerDown={handleBackdropPointerDown}
        onClick={handleBackdropClick}
      >
        <div
          ref={menuRef}
          className="neo-panel fixed z-50 min-w-[200px] overflow-y-auto rounded-xl bg-[var(--surface2)]"
          style={{
            top: pos.top,
            left: pos.left,
            maxHeight: pos.maxHeight,
            visibility: pos.ready ? "visible" : "hidden",
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
