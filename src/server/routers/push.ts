import { z } from "zod"
import { router, protectedProcedure, strictRateLimitedProcedure } from "../trpc"

export const pushRouter = router({
  //simpan/update subscription push
  subscribe: strictRateLimitedProcedure
    .input(z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({ p256dh: z.string(), auth: z.string() }),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.pushSubscription.upsert({
        where: { endpoint: input.subscription.endpoint },
        create: {
          endpoint: input.subscription.endpoint,
          p256dh: input.subscription.keys.p256dh,
          auth: input.subscription.keys.auth,
          userId: ctx.userId,
        },
        update: {
          p256dh: input.subscription.keys.p256dh,
          auth: input.subscription.keys.auth,
          userId: ctx.userId,
        },
      })
    }),

  //hapus subscription push
  unsubscribe: protectedProcedure
    .input(z.object({ endpoint: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.pushSubscription.deleteMany({
        where: { endpoint: input.endpoint, userId: ctx.userId },
      })
      return { success: true }
    }),
})
