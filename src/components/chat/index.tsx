import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageContainer } from './message';
import { SendMessageForm } from './send-message';
import { useRoomContext } from '@/contexts/room';
import { Room } from '@prisma/client';
import { Button } from '../ui/button';

export const Chat = ({ room }: { room: Room }) => {
  const { data: session } = useSession();

  const { data: messages, refetch } = trpc.message.get.useQuery({
    roomId: room.id,
  });

  trpc.message.onAdd.useSubscription(undefined, {
    onData: () => {
      refetch();
    },
  });

  return (
    <div className="flex-1 p-4">
      <Button onClick={() => refetch()}></Button>
      <div className="">{}</div>
      <section className="flex h-full flex-col justify-end space-y-4 p-4">
        <div className="flex flex-col space-y-4 overflow-y-auto">
          {messages?.items.map((item) => (
            <MessageContainer key={item.id} message={item} />
          ))}
        </div>
        <div className="w-full">
          <SendMessageForm />
        </div>
      </section>
    </div>
  );
};
