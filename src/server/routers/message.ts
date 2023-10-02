/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';
import { db } from '../db';
import { z } from 'zod';
import { authedProcedure, publicProcedure, router } from '../trpc';
import { type Message } from '@prisma/client';

interface MyEvents {
  add: (data: Message) => void;
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

class MyEventEmitter extends EventEmitter {}

// In a real app, you'd probably use Redis or something
const ee = new MyEventEmitter();

export const postRouter = router({
  add: authedProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        text: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const post = await db.message.create({
        data: {
          ...input,
          userId: ctx.user!.id,
        },
      });
      ee.emit('add', post);
      return post;
    }),

  infinite: publicProcedure.query(async () => {
    const page = await db.message.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    });
    const items = page.reverse();
    return {
      items,
    };
  }),

  onAdd: publicProcedure.subscription(() => {
    return observable<Message>((emit) => {
      const onAdd = (data: Message) => {
        emit.next(data);
      };
      ee.on('add', onAdd);
      return () => {
        ee.off('add', onAdd);
      };
    });
  }),
});
