"use client"

import { useState } from "react"
import { FiAlertTriangle, FiX } from "react-icons/fi"
import { signOut } from "next-auth/react"
import { Dialog } from "@/components/ui/Dialog"
import { trpc } from "@/lib/trpc"

export default function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const [confirmText, setConfirmText] = useState("")
  const [loading, setLoading] = useState(false)
  const deleteAccount = trpc.user.deleteAccount.useMutation()

  const canSubmit = confirmText.trim().toUpperCase() === "HAPUS" && !loading

  async function handleDelete() {
    if (!canSubmit) return
    setLoading(true)
    try {
      await deleteAccount.mutateAsync()
      await signOut({ callbackUrl: "/login" })
    } catch {
      setLoading(false)
    }
  }

  return (
    <Dialog onClose={onClose} closeOnBackdrop={!loading}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <FiAlertTriangle size={20} className="text-[var(--coral)]" />
          <h2 className="font-sora text-base font-bold text-[var(--text)]">Hapus Akun</h2>
        </div>
        <button onClick={onClose} aria-label="Tutup" className="text-[var(--text3)]">
          <FiX size={18} />
        </button>
      </div>

      <p className="text-sm text-[var(--text2)]">
        Semua room, catatan, checklist, dan pengingat kamu akan dihapus
        permanen dan TIDAK BISA dikembalikan. Ketik <strong>HAPUS</strong> untuk
        melanjutkan.
      </p>

      <input
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="Ketik HAPUS"
        className="neo-card mt-4 w-full rounded-xl border-2 border-[var(--neo-line)] bg-[var(--surface2)] px-3 py-2 text-sm text-[var(--text)] outline-none"
      />

      <div className="mt-5 flex gap-2">
        <button
          onClick={onClose}
          className="neo-button flex-1 rounded-xl bg-[var(--surface2)] px-4 py-2.5 text-sm font-semibold text-[var(--text)]"
        >
          Batal
        </button>
        <button
          onClick={handleDelete}
          disabled={!canSubmit}
          className="neo-button flex-1 rounded-xl bg-[var(--coral)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40"
        >
          {loading ? "Menghapus..." : "Hapus Akun"}
        </button>
      </div>
    </Dialog>
  )
}