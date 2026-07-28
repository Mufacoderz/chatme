"use client"

import { FiSearch } from "react-icons/fi"

type Props = {
  query: string
  onQueryChange: (query: string) => void
}

export default function SearchBar({ query, onQueryChange }: Props) {
  return (
    <div className="px-3 py-3">
      <div className="neo-input flex items-center gap-2 rounded-xl bg-[var(--surface2)] px-3 py-2">
        <FiSearch size={14} className="flex-shrink-0 text-[var(--text3)]" />
        <input
          className="flex-1 bg-transparent text-sm outline-none text-[var(--text)]"
          placeholder="Cari room..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
    </div>
  )
}
