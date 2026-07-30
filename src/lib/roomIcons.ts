import { TOTAL_ROOM_ICONS } from "./roomIcons.generated"

export const ROOM_ICONS = Array.from({ length: TOTAL_ROOM_ICONS }, (_, i) => `${i + 1}.webp`)

export const ROOM_ICON_REGEX = new RegExp(
  `^(${Array.from({ length: TOTAL_ROOM_ICONS }, (_, i) => i + 1).join("|")})\\.webp$`
)

export const DEFAULT_ROOM_ICON = "1.webp"

export function isValidRoomIcon(icon: string): boolean {
  return ROOM_ICON_REGEX.test(icon)
}

export function getRoomIconSrc(icon: string): string {
  if (isValidRoomIcon(icon)) return `/room-icons/${icon}`
  return `/room-icons/${DEFAULT_ROOM_ICON}`
}
