"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  FiArrowLeft, FiEdit2, FiTrash2, FiBookmark, FiBell,
  FiCheckSquare, FiCalendar, FiMessageSquare,
} from "react-icons/fi"
import { trpc } from "@/lib/trpc"
import { useRoomInfo } from "@/hooks/useRoom"
import { useRoomPinnedMessages, useRoomActiveReminders, useMarkRemindedAndDone } from "@/hooks/useMessages"
import { getRoomIconSrc } from "@/lib/roomIcons"
import EditRoomModal from "./modals/EditRoomModal"
import DeleteRoomModal from "./modals/DeleteRoomModal"
import PinnedMessagesModal from "./modals/PinnedMessagesModal"
import ReminderListModal from "./modals/ReminderListModal"

type Props = { roomId: string }

export default function RoomInfoView({ roomId }: Props) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const { data: info, isLoading } = useRoomInfo(roomId)

  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showPinned, setShowPinned] = useState(false)
  const [showReminders, setShowReminders] = useState(false)

  const pinnedQuery = useRoomPinnedMessages(roomId, showPinned)
  const remindersQuery = useRoomActiveReminders(roomId, showReminders)
  const markRemindedAndDone = useMarkRemindedAndDone(roomId)

  function refreshStats() {
    utils.room.getInfo.invalidate({ id: roomId })
  }

  function closePinned() {
    setShowPinned(false)
    utils.message.listPinned.invalidate({ roomId })
    refreshStats()
  }

  function closeReminders() {
    setShowReminders(false)
    utils.message.listActiveReminders.invalidate({ roomId })
    refreshStats()
  }

  if (isLoading || !info) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100dvh" }} className="flex items-center justify-center">
        <p className="text-sm text-[var(--text3)]">Memuat info room...</p>
      </div>
    )
  }

  const tanggalDibuat = new Date(info.createdAt).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  })

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh" }} className="pb-8">
      {/* Header */}
      <div className="m-3 mb-0 flex items-center gap-3 rounded-xl bg-[var(--surface)] px-3 py-3 neo-panel">
        <button
          onClick={() => router.back()}
          className="neo-button w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--paper)] text-[var(--text)]"
        >
          <FiArrowLeft size={20} />
        </button>
        <p className="font-semibold font-sora text-base text-[var(--text)]">Info Room</p>
      </div>

      {/* Hero */}
      <div className="m-3 flex flex-col items-center rounded-xl bg-[var(--surface)] px-6 py-8 neo-panel">
        <div className="neo-button w-24 h-24 rounded-2xl flex items-center justify-center bg-[var(--surface2)] overflow-hidden mb-4">
          <Image src={getRoomIconSrc(info.icon)} alt={info.icon} width={96} height={96} className="object-contain" />
        </div>
        <p className="font-bold font-sora text-lg text-[var(--text)] text-center">{info.name}</p>
        {info.description && (
          <p className="text-sm text-[var(--text3)] text-center mt-1.5 max-w-xs">{info.description}</p>
        )}
        <div className="flex items-center gap-1.5 mt-4 text-xs text-[var(--text3)]">
          <FiCalendar size={13} />
          <span>Dibuat {tanggalDibuat}</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mx-3 grid grid-cols-2 gap-3">
        <div className="neo-card rounded-xl p-4 bg-[var(--surface)]">
          <FiMessageSquare size={16} className="text-[var(--accent)] mb-2" />
          <p className="text-xl font-bold font-sora text-[var(--text)]">{info.totalPesan}</p>
          <p className="text-xs text-[var(--text3)]">Total Catatan</p>
        </div>

        <button onClick={() => setShowPinned(true)} className="neo-card rounded-xl p-4 bg-[var(--surface)] text-left">
          <FiBookmark size={16} className="text-[var(--accent)] mb-2" />
          <p className="text-xl font-bold font-sora text-[var(--text)]">{info.pesanDipin}</p>
          <p className="text-xs text-[var(--text3)]">Catatan Dipin</p>
        </button>

        <button onClick={() => setShowReminders(true)} className="neo-card rounded-xl p-4 bg-[var(--surface)] text-left">
          <FiBell size={16} className="text-[var(--accent)] mb-2" />
          <p className="text-xl font-bold font-sora text-[var(--text)]">{info.reminderAktif}</p>
          <p className="text-xs text-[var(--text3)]">Reminder Aktif</p>
        </button>

        <div className="neo-card rounded-xl p-4 bg-[var(--surface)]">
          <FiCheckSquare size={16} className="text-[var(--accent)] mb-2" />
          <p className="text-xl font-bold font-sora text-[var(--text)]">
            {info.checklist.selesai}/{info.checklist.total}
          </p>
          <p className="text-xs text-[var(--text3)]">Checklist Selesai</p>
        </div>
      </div>

      {/* Kelola room */}
      <div className="m-3 flex flex-col gap-3">
        <button
          onClick={() => setShowEdit(true)}
          className="neo-button flex items-center gap-3 rounded-xl px-4 py-3 bg-[var(--surface)] text-[var(--text)] text-sm font-medium"
        >
          <FiEdit2 size={16} /> Edit Room
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="neo-button flex items-center gap-3 rounded-xl px-4 py-3 bg-[var(--surface)] text-sm font-medium"
          style={{ color: "#fca5a5" }}
        >
          <FiTrash2 size={16} /> Hapus Room
        </button>
      </div>

      {showEdit && (
        <EditRoomModal
          roomId={info.id}
          initialName={info.name}
          initialIcon={info.icon}
          initialDescription={info.description}
          onClose={() => { setShowEdit(false); refreshStats() }}
        />
      )}

      {showDelete && (
        <DeleteRoomModal roomId={info.id} roomName={info.name} onClose={() => setShowDelete(false)} />
      )}

      {showPinned && (
        <PinnedMessagesModal messages={pinnedQuery.data ?? []} onClose={closePinned} />
      )}

      {showReminders && (
        <ReminderListModal
          reminders={remindersQuery.data ?? []}
          onDone={(id) => {
            markRemindedAndDone.mutate({ id })
          }}
          onClose={closeReminders}
        />
      )}
    </div>
  )
}
