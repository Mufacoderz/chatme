"use client"

import { useState } from "react"
import { FiTrash2 } from "react-icons/fi"
import DeleteAccountModal from "./DeleteAccountModal"

export default function DangerZone() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="mt-5 neo-card rounded-xl border-2 border-[var(--coral)] p-4">
      <p className="text-xs font-bold uppercase text-[var(--coral)]">Zona Berbahaya</p>
      <p className="mt-1 text-xs text-[var(--text3)]">
        Menghapus akun akan menghilangkan seluruh data kamu secara permanen.
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
