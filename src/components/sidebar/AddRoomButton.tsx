"use client"

import { useState } from "react"
import Image from "next/image"
import { FiPlus, FiX } from "react-icons/fi"
import { BottomSheet } from "@/components/ui/BottomSheet"
import { useCreateRoom } from "@/hooks/useRooms"
import { ROOM_ICONS, DEFAULT_ROOM_ICON } from "@/lib/roomIcons"

export default function AddRoomButton() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [icon, setIcon] = useState(DEFAULT_ROOM_ICON)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  function handleClose() {
    setOpen(false)
    setName("")
    setIcon(DEFAULT_ROOM_ICON)
    setDescription("")
  }

  const createRoom = useCreateRoom()

  async function handleCreate() {
    if (!name.trim()) return
    setLoading(true)
    await createRoom.mutateAsync({ name: name.trim(), icon, description: description.trim() || undefined })
    setLoading(false)
    handleClose()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="neo-button absolute bottom-6 right-5 z-20 flex h-12 w-12 rotate-3 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--accent-ink)] transition-all duration-200 hover:rotate-12"
      >
        <FiPlus size={22} />
      </button>

      {open && (
        <BottomSheet onClose={handleClose}>
            <div className="flex items-center justify-between mb-5">
              <p className="font-semibold font-sora text-base text-[var(--text)]">Buat Room Baru</p>
              <button onClick={handleClose} className="text-[var(--text3)] hover:text-[var(--text)] transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <label className="text-xs text-[var(--text3)] mb-1.5 block">Nama room *</label>
            <input
              className="neo-input w-full rounded-xl px-4 py-3 text-sm outline-none mb-4 bg-[var(--surface2)] text-[var(--text)] placeholder:text-[var(--text3)] focus:border-[var(--accent)] transition-colors"
              placeholder="Contoh: Tugas, Catatan, Random..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />

            <label className="text-xs text-[var(--text3)] mb-1.5 block">
              Deskripsi <span className="text-[var(--text3)]">(opsional)</span>
            </label>
            <input
              className="neo-input w-full rounded-xl px-4 py-3 text-sm outline-none mb-5 bg-[var(--surface2)] text-[var(--text)] placeholder:text-[var(--text3)] focus:border-[var(--accent)] transition-colors"
              placeholder="Untuk apa room ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="text-xs text-[var(--text3)] mb-2 block">Pilih ikon</label>
            <div className="grid grid-cols-4 gap-3 mb-6 max-h-[132px] overflow-y-auto pr-1">
              {ROOM_ICONS.map((name) => (
                <button
                  key={name}
                  onClick={() => setIcon(name)}
                  className="neo-button overflow-hidden w-14 h-14 rounded-xl flex items-center justify-center transition-colors"
                  style={{
                    background: icon === name ? "var(--accent)" : "var(--surface2)",
                  }}
                >
                  <Image
                    src={`/room-icons/${name}`}
                    alt={name}
                    width={56}
                    height={56}
                    className="object-contain"
                  />
                </button>
              ))}
            </div>

            <button
              onClick={handleCreate}
              disabled={!name.trim() || loading}
              className="neo-button w-full py-3 rounded-xl font-semibold text-sm font-sora transition-opacity bg-[var(--accent)] text-[var(--accent-ink)]"
              style={{ opacity: !name.trim() || loading ? 0.5 : 1 }}
            >
              {loading ? "Membuat..." : "Buat Room"}
            </button>
        </BottomSheet>
      )}
    </>
  )
}