"use client"

import Image from "next/image"

type Props = {
  name: string
  email: string
  image: string | null | undefined
  initial: string
}

export default function ProfileHeader({ name, email, image, initial }: Props) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      {image ? (
        <Image
          src={image}
          alt={name}
          width={88}
          height={88}
          unoptimized
          className="neo-card h-20 w-20 rounded-xl object-cover sm:h-24 sm:w-24"
        />
      ) : (
        <div className="neo-card flex h-20 w-20 items-center justify-center rounded-xl bg-[var(--accent)] font-sora text-3xl font-bold text-[var(--accent-ink)] sm:h-24 sm:w-24">
          {initial}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="mb-2 inline-flex rotate-1 rounded-md border-2 border-[var(--neo-line)] bg-[var(--accent)] px-2 py-1 text-[10px] font-bold uppercase text-[var(--accent-ink)]">
          Personal account
        </div>
        <h2 className="truncate font-sora text-2xl font-bold text-[var(--text)]">{name}</h2>
        <p className="mt-1 truncate text-sm text-[var(--text2)]">{email}</p>
      </div>
    </div>
  )
}
