import { trpc } from '@/utils/trpc';
import { type Room } from '@prisma/client';
import { MessageContainer } from './message';
import { SendMessageForm } from './send-message';

export const Chat = ({ room }: { room: Room }) => {
  const { data: messages, refetch } = trpc.message.get.useQuery({
    roomId: room.id,
  });

  trpc.message.onAdd.useSubscription(undefined, {
    onData: () => {
      void refetch();
    },
  });

  return (
    <div className="flex-1 p-4">
      <section className="flex h-full flex-col justify-end space-y-4 p-4">
        <div className="flex flex-col space-y-4 overflow-y-auto pr-4">
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
