"use client"

import { createPortal } from "react-dom"
import { useSyncExternalStore } from "react"

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export function ModalPortal({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated()

  if (!hydrated) return null
  return createPortal(children, document.body)
}
