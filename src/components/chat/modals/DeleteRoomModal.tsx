"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FiAlertTriangle, FiX } from "react-icons/fi"
import { Dialog } from "@/components/ui/Dialog"
import { useDeleteRoom } from "@/hooks/useRooms"

type Props = {
  roomId: string
  roomName: string
  onClose: () => void
}

export default function DeleteRoomModal({ roomId, roomName, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const deleteRoom = useDeleteRoom()

  async function handleDelete() {
    setLoading(true)
    await deleteRoom.mutateAsync({ id: roomId })
    setLoading(false)
    onClose()
    router.push("/")
  }

  return (
    <Dialog onClose={onClose}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiAlertTriangle size={17} className="text-[var(--coral)]" />
          <h2 className="font-sora text-base font-bold text-[var(--text)]">
            Hapus Room
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="neo-button flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface2)]"
          aria-label="Tutup"
        >
          <FiX size={16} />
        </button>
      </div>

      <p className="text-sm leading-6 text-[var(--text2)]">
        Yakin mau hapus room <span className="font-semibold text-[var(--text)]">{roomName}</span>?
      </p>
      <p className="mt-1 text-xs text-[var(--text3)]">
        Semua catatan di dalam room ini akan ikut terhapus dan tidak bisa dikembalikan.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="neo-button flex-1 rounded-xl bg-[var(--surface2)] py-3 text-sm font-bold"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="neo-button flex-1 rounded-xl bg-[var(--coral)] py-3 text-sm font-bold text-[var(--text)] disabled:opacity-50"
        >
          {loading ? "Menghapus..." : "Hapus"}
        </button>
      </div>
    </Dialog>
  )
}