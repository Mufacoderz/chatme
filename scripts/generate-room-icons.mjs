import { readdirSync, writeFileSync } from "fs"
import { join } from "path"

const dir = join(process.cwd(), "public/room-icons")
const numbers = readdirSync(dir)
  .filter((f) => /^\d+\.webp$/.test(f))
  .map((f) => parseInt(f))
  .sort((a, b) => a - b)

if (numbers.length === 0) {
  console.error("Gak ada file .webp ketemu di public/room-icons")
  process.exit(1)
}

const expected = Array.from({ length: numbers.length }, (_, i) => i + 1)
if (JSON.stringify(numbers) !== JSON.stringify(expected)) {
  console.error(`Nomor file harus berurutan 1..N tanpa lompat. Ketemu: ${numbers.join(", ")}`)
  process.exit(1)
}

writeFileSync(
  join(process.cwd(), "src/lib/roomIcons.generated.ts"),
  `// FILE INI DI-GENERATE OTOMATIS, JANGAN EDIT MANUAL.\n// Regenerate: node scripts/generate-room-icons.mjs\n\nexport const TOTAL_ROOM_ICONS = ${numbers.length}\n`
)
console.log(`✅ ${numbers.length} icon terdeteksi, roomIcons.generated.ts di-update.`)
