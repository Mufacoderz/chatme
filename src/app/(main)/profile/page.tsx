import Link from "next/link"
import { redirect } from "next/navigation"
import { FiArrowLeft, FiCalendar, FiMail, FiShield, FiLogOut } from "react-icons/fi"
import { auth, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import ProfileHeader from "@/components/profile/ProfileHeader"
import EnablePushButton from "@/components/profile/EnablePushButton"
import DangerZone from "@/components/profile/DangerZone"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const [roomCount, noteCount, reminderCount, dbUser] = await Promise.all([
    prisma.room.count({ where: { userId: session.user.id } }),
    prisma.message.count({ where: { userId: session.user.id, isBot: false } }),
    prisma.message.count({
      where: { userId: session.user.id, remindAt: { not: null }, isRemindDone: false },
    }),
    prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { createdAt: true },
    }),
  ])

  const name = session.user.name || "Pengguna Chatme"
  const email = session.user.email || "email belum tersedia"
  const initial = name.charAt(0).toUpperCase()
  const joinedLabel = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(dbUser.createdAt)

  return (
    <main className="min-h-full flex-1 overflow-y-auto bg-[var(--bg)] p-3 sm:p-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-5 flex items-center gap-3">
          <Link
            href="/"
            aria-label="Kembali"
            className="neo-button flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text)]"
          >
            <FiArrowLeft size={19} />
          </Link>
          <div>
            <h1 className="font-sora text-xl font-bold text-[var(--text)]">My Profile</h1>
            <p className="text-xs text-[var(--text3)]">Informasi akun Chatme kamu</p>
          </div>
        </div>

        <section className="neo-panel rounded-2xl bg-[var(--surface)] p-5 sm:p-7">
          <ProfileHeader name={name} email={email} image={session.user.image} initial={initial} />

          <div className="my-6 border-t-2 border-dashed border-[var(--neo-line)]" />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="neo-card rounded-xl bg-[var(--surface2)] p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[var(--neo-line)] bg-[var(--sage)] text-[var(--text)]">
                <FiMail size={17} />
              </div>
              <p className="text-xs font-bold uppercase text-[var(--text3)]">Email</p>
              <p className="mt-1 break-all text-sm font-semibold text-[var(--text)]">{email}</p>
            </div>

            <div className="neo-card rounded-xl bg-[var(--surface2)] p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[var(--neo-line)] bg-[var(--coral)] text-[var(--text)]">
                <FiShield size={17} />
              </div>
              <p className="text-xs font-bold uppercase text-[var(--text3)]">Login Provider</p>
              <p className="mt-1 text-sm font-semibold text-[var(--text)]">Google OAuth</p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-3 gap-3">
          <div className="neo-card rounded-xl bg-[var(--accent)] p-4 text-center">
            <p className="font-sora text-xl font-black text-[var(--accent-ink)]">{roomCount}</p>
            <p className="mt-1 text-[11px] font-bold text-[var(--accent-ink)]">Rooms</p>
          </div>
          <div className="-rotate-1 neo-card rounded-xl bg-[var(--accent)] p-4 text-center">
            <p className="font-sora text-xl font-black text-[var(--accent-ink)]">{noteCount}</p>
            <p className="mt-1 text-[11px] font-bold text-[var(--accent-ink)]">Pesan</p>
          </div>
          <div className="rotate-1 neo-card rounded-xl bg-[var(--accent)] p-4 text-center">
            <p className="font-sora text-xl font-black text-[var(--accent-ink)]">{reminderCount}</p>
            <p className="mt-1 text-[11px] font-bold text-[var(--accent-ink)]">Pengingat Aktif</p>
          </div>
        </section>

        <div className="mt-5 flex items-center gap-2 text-xs text-[var(--text3)]">
          <FiCalendar size={14} />
          <span>Bergabung sejak {joinedLabel}</span>
        </div>

        <EnablePushButton />

        <form
          action={async () => {
            "use server"
            await signOut()
          }}
          className="mt-5"
        >
          <button
            type="submit"
            className="neo-button flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--coral)] px-4 py-3 text-sm font-bold text-white"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </form>

        <DangerZone />

        <p className="mt-6 text-center text-xs text-[var(--text3)]">
          <Link href="/privacy" className="underline">Kebijakan Privasi</Link>
        </p>
      </div>
    </main>
  )
}
