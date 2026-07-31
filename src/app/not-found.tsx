import Link from "next/link"
import Image from "next/image"
import { FiArrowLeft, FiMessageCircle } from "react-icons/fi"

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-4 sm:p-6">
            <div className="w-full max-w-md text-center">
                <Image
                    src="/logo.png"
                    alt="Chatme"
                    width={40}
                    height={40}
                    className="mx-auto mb-8"
                />

                <div className="neo-panel mx-auto mb-6 inline-block -rotate-2 rounded-2xl bg-[var(--surface)] px-8 py-6">
                    <p className="font-sora text-7xl font-black leading-none text-[var(--text)] sm:text-8xl">
                        404
                    </p>
                </div>

                <div className="neo-card mx-auto flex max-w-xs items-start gap-2.5 rounded-2xl rounded-bl-sm bg-[var(--surface2)] p-4 text-left">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[var(--neo-line)] bg-[var(--accent)] text-[var(--accent-ink)]">
                        <FiMessageCircle size={13} />
                    </div>
                    <p className="text-sm font-semibold leading-snug text-[var(--text)]">
                        Halaman Tidak ditemukan.
                    </p>
                </div>

                <Link
                    href="/"
                    className="neo-button mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-bold text-[var(--accent-ink)]"
                >
                    <FiArrowLeft size={16} />
                    Balik ke Chatme
                </Link>
            </div>
        </main>
    )
}