import { trpc } from '@/utils/trpc';
import { type Room } from '@prisma/client';
import { MessageContainer } from './message';
import { SendMessageForm } from './send-message';
import React from 'react';
import { EditRoom } from '../sidebar/edit-room';

export const Chat = ({ room }: { room: Room }) => {
  const { data: messages, refetch } = trpc.message.get.useQuery({
    roomId: room.id,
  });

  const scrollRef = React.useRef<HTMLDivElement>(null);

  trpc.message.onAdd.useSubscription(undefined, {
    onData: () => {
      void refetch();
    },
  });

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages?.items.length]);

  return (
    <div className="flex flex-col w-full p-4 h-full">
      <div className="flex justify-between border-b border-gray-300 items-center">
        <div className="text-lg font-bold">{room.name}</div>
        <EditRoom room={room} />
      </div>
      <section className="flex flex-col h-full justify-end space-y-4 p-4">
        <div
          ref={scrollRef}
          className="flex flex-col space-y-4 overflow-y-auto pr-4"
        >
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
