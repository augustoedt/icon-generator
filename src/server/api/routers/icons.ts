import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
export const iconRouter = createTRPCRouter({
  generateIcon: protectedProcedure.query(async ({ ctx }) => {
    const icons =
      (await ctx.prisma.icon.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      })) ?? [];
    return {
      message: "success",
      icons,
    };
  }),
});
