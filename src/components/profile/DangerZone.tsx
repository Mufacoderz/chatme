"use client"

import { useState } from "react"
import { FiAlertTriangle, FiTrash2 } from "react-icons/fi"
import DeleteAccountModal from "./DeleteAccountModal"

export default function DangerZone() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="neo-card rounded-xl border-2 border-[var(--coral)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-1.5">
        <FiAlertTriangle size={13} className="text-[var(--coral)]" />
        <p className="text-[11px] font-black uppercase tracking-widest text-[var(--coral)]">Danger Zone</p>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-[var(--text3)]">
        Menghapus akun akan menghilangkan seluruh data kamu secara permanen dan tidak bisa dibatalkan.
      </p>
      <button
        onClick={() => setShowModal(true)}
        className="neo-button mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--surface2)] px-4 py-2.5 text-sm font-bold text-[var(--coral)]"
      >
        <FiTrash2 size={15} />
        Hapus Akun
      </button>

      {showModal && <DeleteAccountModal onClose={() => setShowModal(false)} />}
    </div>
  )
}