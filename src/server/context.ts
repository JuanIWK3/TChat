import type * as trpc from '@trpc/server';
import type * as trpcNext from '@trpc/server/adapters/next';
import { type NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http';
import { type IncomingMessage } from 'http';
import { getSession } from 'next-auth/react';
import type ws from 'ws';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
  opts:
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
    | trpcNext.CreateNextContextOptions,
) => {
  const session = await getSession(opts);

  console.log('createContext for', session?.user?.name ?? 'unknown user');

  return {
    session,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
