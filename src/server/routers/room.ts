import { z } from 'zod';
import { db } from '../db';
import { authedProcedure, router } from '../trpc';

export const roomRouter = router({
  getAll: authedProcedure.query(async () => {
    const posts = await db.room.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return posts;
  }),

  add: authedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const post = await db.room.create({
        data: {
          ...input,
        },
      });
      return post;
    }),
});
