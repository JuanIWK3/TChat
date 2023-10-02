/**
 * This file contains the root router of your tRPC-backend
 */
import { router } from '../trpc';
import { postRouter as messageRouter } from './message';
import { roomRouter } from './room';

export const appRouter = router({
  message: messageRouter,
  room: roomRouter,
});

export type AppRouter = typeof appRouter;
