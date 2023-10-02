/**
 * This file contains the root router of your tRPC-backend
 */
import { router } from '../trpc';
import { postRouter as messageRouter } from './message';
import { roomRouter } from './room';
import { userRouter } from './user';

export const appRouter = router({
  message: messageRouter,
  room: roomRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
