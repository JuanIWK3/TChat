import { Chat } from '@/components/chat';
import { Sidebar } from '@/components/sidebar';
import { useRoomContext } from '@/contexts/chat';
import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';

export default function IndexPage() {
  const { data: session, status } = useSession();
  const { selectedRoom } = useRoomContext();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex w-full min-h-screen justify-center rounded px-3 py-2 text-lg items-center">
        <button onClick={() => void signIn()} data-testid="signin" className="">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>TRPC Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen">
        <Sidebar />
        {!selectedRoom ? (
          <div className="flex w-full min-h-screen justify-center rounded px-3 py-2 text-lg items-center">
            <p className="font-bold">Select a room to start chatting</p>
          </div>
        ) : (
          <Chat room={selectedRoom} />
        )}
      </div>
    </>
  );
}
