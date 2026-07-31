import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

// Buat mutation yang sering dipanggil manusia mengetik normal
// (kirim pesan, toggle checklist, dsb).
export const writeRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "10 s"),
  prefix: "chatme:write",
})

// Buat mutation yang harusnya jarang dipanggil (bikin room, subscribe push).
export const strictRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  prefix: "chatme:strict",
})
