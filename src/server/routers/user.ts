import { router, protectedProcedure } from "../trpc"

export const userRouter = router({
  deleteAccount: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.prisma.user.delete({ where: { id: ctx.userId } })
      return { success: true }
    }),
})
