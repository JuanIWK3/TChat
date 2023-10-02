import { z } from 'zod';
import { db } from '../db';
import { authedProcedure, router } from '../trpc';

export const roomRouter = router({
  getAll: authedProcedure.query(async () => {
    return await db.room.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),

  addPrivate: authedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        friendId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await db.room.create({
        data: {
          name: input.name,
          private: true,
          users: {
            connect: [
              {
                id: ctx.user!.id,
              },
              {
                id: input.friendId,
              },
            ],
          },
        },
      });
    }),

  getAllWithUser: authedProcedure.query(async ({ input, ctx }) => {
    return await db.room.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        users: {
          some: {
            id: ctx.user!.id,
          },
        },
      },
      include: {
        users: true,
      },
    });
  }),

  addUsertoRoom: authedProcedure
    .input(
      z.object({
        roomId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await db.room.update({
        where: {
          id: input.roomId,
        },
        data: {
          users: {
            connect: {
              id: input.userId,
            },
          },
        },
      });
    }),

  add: authedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await db.room.create({
        data: {
          ...input,
          users: {
            connect: {
              id: ctx.user!.id,
            },
          },
        },
      });
    }),
});
