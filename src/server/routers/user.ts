import { z } from 'zod';
import { db } from '../db';
import { authedProcedure, router } from '../trpc';

export const userRouter = router({
  getAll: authedProcedure.query(async ({ ctx }) => {
    return await db.user.findMany();
  }),

  getAllNotInTheRoom: authedProcedure
    .input(
      z.object({
        roomId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await db.user.findMany({
        where: {
          rooms: {
            none: {
              id: input.roomId,
            },
          },
        },
      });
    }),
});
