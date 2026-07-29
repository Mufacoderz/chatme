export const ROOM_ICON_REGEX = /^([1-9]|1[0-6])\.png$/

export const ROOM_ICONS = Array.from({ length: 16 }, (_, i) => `${i + 1}.png`)

export const DEFAULT_ROOM_ICON = "1.png"

export function isValidRoomIcon(icon: string): boolean {
  return ROOM_ICON_REGEX.test(icon)
}

export function getRoomIconSrc(icon: string): string {
  if (isValidRoomIcon(icon)) return `/room-icons/${icon}`
  return `/room-icons/${DEFAULT_ROOM_ICON}`
}
