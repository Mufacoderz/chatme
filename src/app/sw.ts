import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist"
import { Serwist } from "serwist"

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document"
        },
      },
    ],
  },
})

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {}
  const options = {
    body: data.body ?? "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: data.tag,
    renotify: true,
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200],
    data: { url: data.url ?? "/", reminderId: data.id },
    actions: [
      { action: "snooze", title: "Tunda 15 menit" },
      { action: "done", title: "Selesai" },
    ],
  }
  event.waitUntil(
    self.registration.showNotification(data.title ?? "Chatme", options)
  )
})

self.addEventListener("notificationclick", (event) => {
  const reminderId = event.notification.data?.reminderId
  const action = event.action

  event.notification.close()

  if ((action === "snooze" || action === "done") && reminderId) {
    const endpoint = action === "snooze" ? "snooze" : "done"
    event.waitUntil(
      fetch(`/api/reminders/${reminderId}/${endpoint}`, { method: "POST" })
        .then(() => {
          // Biar tab yang lagi kebuka ikut ke-refresh, pakai channel sync yang sudah ada.
          new BroadcastChannel("chatme-sync").postMessage({
            type: "invalidate",
            queryKey: [["message"]],
          })
        })
        .catch(() => {})
    )
    return
  }

  const url = event.notification.data?.url ?? "/"
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientsArr) => {
      const existing = clientsArr.find((c) => c.url.includes(url))
      if (existing) return existing.focus()
      return self.clients.openWindow(url)
    })
  )
})

serwist.addEventListeners()
