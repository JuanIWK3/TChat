import { z } from "zod";

import {
  createTRPCRouter,
  // protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { type Prisma } from "@prisma/client";

export type RoomWithUsersAndMessages = Prisma.RoomGetPayload<{
  include: {
    users: true;
    messages: true;
  };
}>;

export const roomRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.room.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        users: true,
        messages: true,
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.room.create({
        data: {
          name: input.name,
        },
      });
    }),
});
