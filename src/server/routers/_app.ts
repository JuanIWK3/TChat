/**
 * This file contains the root router of your tRPC-backend
 */
import { router } from '../trpc';
import { postRouter as messageRouter } from './message';

export const appRouter = router({
  message: messageRouter,
});

export type AppRouter = typeof appRouter;
