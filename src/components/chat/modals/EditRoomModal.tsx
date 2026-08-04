"use client"

import { useState } from "react"
import Image from "next/image"
import { FiX } from "react-icons/fi"
import { BottomSheet } from "@/components/ui/BottomSheet"
import { useUpdateRoom } from "@/hooks/useRooms"
import { ROOM_ICONS } from "@/lib/roomIcons"

type Props = {
  roomId: string
  initialName: string
  initialIcon: string
  initialDescription: string | null
  onClose: () => void
}

export default function EditRoomModal({
  roomId, initialName, initialIcon, initialDescription, onClose
}: Props) {
  const [name, setName] = useState(initialName)
  const [icon, setIcon] = useState(initialIcon)
  const [description, setDescription] = useState(initialDescription ?? "")
  const [loading, setLoading] = useState(false)

  const updateRoom = useUpdateRoom()

  async function handleSave() {
    if (!name.trim()) return
    setLoading(true)
    await updateRoom.mutateAsync({ id: roomId, name: name.trim(), icon, description: description.trim() || null })
    setLoading(false)
    onClose()
  }

  return (
    <BottomSheet onClose={onClose}>
      <div className="flex items-center justify-between mb-5">
        <p className="font-semibold font-sora text-base text-[var(--text)]">Edit Room</p>
        <button onClick={onClose} className="text-[var(--text3)] hover:text-[var(--text)] transition-colors">
          <FiX size={20} />
        </button>
      </div>

      <label className="text-xs text-[var(--text3)] mb-1.5 block">Nama room *</label>
      <input
        className="neo-input w-full rounded-xl px-4 py-3 text-sm outline-none mb-4 bg-[var(--surface2)] text-[var(--text)] placeholder:text-[var(--text3)] focus:border-[var(--accent)] transition-colors"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
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
        onClick={handleSave}
        disabled={!name.trim() || loading}
        className="neo-button w-full py-3 rounded-xl font-semibold text-sm font-sora transition-opacity bg-[var(--accent)] text-[var(--accent-ink)]"
        style={{ opacity: !name.trim() || loading ? 0.5 : 1 }}
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </BottomSheet>
  )
}