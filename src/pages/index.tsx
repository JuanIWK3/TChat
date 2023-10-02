import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';
import { trpc } from '../utils/trpc';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react';

function SendMessageForm({ onMessagePost }: { onMessagePost: () => void }) {
  const sendMessage = trpc.message.add.useMutation();
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [enterToPostMessage, setEnterToPostMessage] = useState(true);

  async function postMessage() {
    const input = {
      text: message,
    };
    try {
      await sendMessage.mutateAsync(input);
      setMessage('');
      onMessagePost();
    } catch {}
  }

  const userName = session?.user?.name;
  if (!userName) {
    return (
      <div className="flex w-full justify-between rounded px-3 py-2 text-lg">
        <p className="font-bold">
          You have to{' '}
          <Button
            className="inline font-bold underline"
            onClick={() => void signIn()}
          >
            sign in
          </Button>{' '}
          to write.
        </p>
        <Button
          onClick={() => void signIn()}
          data-testid="signin"
          className="h-full rounded px-4"
        >
          Sign In
        </Button>
      </div>
    );
  }
  return (
    <>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={async (e) => {
          e.preventDefault();
          /**
           * In a real app you probably don't want to use this manually
           * Checkout React Hook Form - it works great with tRPC
           * @link https://react-hook-form.com/
           */
          await postMessage();
        }}
      >
        <fieldset disabled={sendMessage.isLoading} className="min-w-0">
          <div className="flex w-full items-end rounded px-3 py-2 text-lg">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-transparent outline-0 border"
              placeholder="Digite sua mensagem"
              id="text"
              name="text"
              autoFocus
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onKeyDown={(e) => {
                if (e.key === 'Shift') {
                  setEnterToPostMessage(false);
                }
                if (e.key === 'Enter' && enterToPostMessage) {
                  void postMessage();
                }
              }}
              onKeyUp={(e) => {
                if (e.key === 'Shift') {
                  setEnterToPostMessage(true);
                }
              }}
              onBlur={() => {
                setEnterToPostMessage(true);
              }}
            />
            <Button type="submit" className="" variant={'ghost'}>
              <SendHorizontal />
            </Button>
          </div>
        </fieldset>
        {sendMessage.error && (
          <p style={{ color: 'red' }}>{sendMessage.error.message}</p>
        )}
      </form>
    </>
  );
}

export default function IndexPage() {
  const { data: session } = useSession();

  const postsQuery = trpc.message.infinite.useInfiniteQuery({});
  const utils = trpc.useContext();

  // list of messages that are rendered
  const [messages, setMessages] = useState(() => {
    const msgs = postsQuery.data?.pages.map((page) => page.items).flat();
    return msgs;
  });
  type Post = NonNullable<typeof messages>[number];
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  // fn to add and dedupe new messages onto state
  const addMessages = useCallback((incoming?: Post[]) => {
    setMessages((current) => {
      const map: Record<Post['id'], Post> = {};
      for (const msg of current ?? []) {
        map[msg.id] = msg;
      }
      for (const msg of incoming ?? []) {
        map[msg.id] = msg;
      }
      return Object.values(map).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );
    });
  }, []);

  // when new data from `useInfiniteQuery`, merge with current state
  useEffect(() => {
    const msgs = postsQuery.data?.pages.map((page) => page.items).flat();
    addMessages(msgs);
  }, [postsQuery.data?.pages, addMessages]);

  const scrollToBottomOfList = useCallback(() => {
    if (scrollTargetRef.current == null) {
      return;
    }

    scrollTargetRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [scrollTargetRef]);
  useEffect(() => {
    scrollToBottomOfList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // subscribe to new posts and add
  trpc.message.onAdd.useSubscription(undefined, {
    onData(post) {
      addMessages([post]);
    },
    onError(err) {
      console.error('Subscription error:', err);
      // we might have missed a message - invalidate cache
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      utils.message.infinite.invalidate();
    },
  });

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
        <title>Prisma Starter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen flex-col md:flex-row">
        <Button variant={'outline'} onClick={() => void signOut()}>
          Logout
        </Button>
        <div className="flex-1 overflow-y-hidden md:h-screen">
          <section className="flex h-full flex-col justify-end space-y-4 p-4">
            <div className="space-y-4 overflow-y-auto">
              {messages?.map((item) => (
                <article
                  key={item.id}
                  className={`flex flex-col ${
                    item.userId === session?.user?.id ? 'items-end' : ''
                  }`}
                >
                  <header className="flex space-x-2 text-sm">
                    <h3 className="text-base">
                      {item.user?.name ?? item.user?.email}
                    </h3>
                    <span className="">
                      {new Intl.DateTimeFormat('en-GB', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      }).format(item.createdAt)}
                    </span>
                  </header>
                  <p className="whitespace-pre-line text-xl leading-tight">
                    {item.text}
                  </p>
                </article>
              ))}
              <div ref={scrollTargetRef}></div>
            </div>
            <div className="w-full">
              <SendMessageForm onMessagePost={() => scrollToBottomOfList()} />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
