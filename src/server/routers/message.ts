/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { type Message, type User } from '@prisma/client';
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';
import { z } from 'zod';
import { db } from '../db';
import { authedProcedure, publicProcedure, router } from '../trpc';

interface MyEvents {
  add: (data: MessageWithUser) => void;
}
declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  emit<TEv extends keyof MyEvents>(
    event: TEv,
    ...args: Parameters<MyEvents[TEv]>
  ): boolean;
}

export type MessageWithUser = Message & {
  user: User;
};

class MyEventEmitter extends EventEmitter {}

// In a real app, you'd probably use Redis or something
const ee = new MyEventEmitter();

export const postRouter = router({
  add: authedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        roomId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const post = await db.message.create({
        data: {
          ...input,
          userId: ctx.user!.id,
        },
        include: {
          user: true,
        },
      });
      ee.emit('add', post);
      return post;
    }),

  get: publicProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      const page = await db.message.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: true,
        },
        where: {
          roomId: input.roomId,
        },
      });
      const items = page.reverse();
      return {
        items,
      };
    }),

  onAdd: publicProcedure.subscription(() => {
    return observable<MessageWithUser>((emit) => {
      const onAdd = (data: MessageWithUser) => {
        emit.next(data);
      };
      ee.on('add', onAdd);
      return () => {
        ee.off('add', onAdd);
      };
    });
  }),
});
