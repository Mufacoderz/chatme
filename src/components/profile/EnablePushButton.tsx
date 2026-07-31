"use client"

import { useState } from "react"
import { FiBell, FiCheckCircle } from "react-icons/fi"
import { usePushSubscription } from "@/hooks/usePushSubscription"

export default function EnablePushButton() {
  const { enablePush } = usePushSubscription()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleClick() {
    if (loading || done) return
    setLoading(true)
    try {
      const ok = await enablePush()
      if (ok) setDone(true)
    } catch {
      // permission denied atau error subscribe — biarkan tombol bisa dicoba lagi
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || done}
      className="neo-button mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-bold text-[var(--accent-ink)] disabled:opacity-40"
    >
      {done ? <FiCheckCircle size={16} /> : <FiBell size={16} />}
      {done ? "Notifikasi Aktif" : loading ? "Mengaktifkan..." : "Aktifkan Notifikasi"}
    </button>
  )
}
