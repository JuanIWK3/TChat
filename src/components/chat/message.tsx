import { type MessageWithUser } from '@/server/routers/message';
import { useSession } from 'next-auth/react';

export const MessageContainer = ({ message }: { message: MessageWithUser }) => {
  const { data: session } = useSession();

  return (
    <div
      key={message.id}
      className={`flex flex-col border p-4 max-w-max rounded-md ${
        message.userId === session?.user?.id ? 'self-end' : ''
      }`}
    >
      <header className="flex space-x-2 text-sm">
        <h3 className="text-base">
          {message.user?.name ?? message.user?.email}
        </h3>
        <span className="">
          {new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'short',
            timeStyle: 'short',
          }).format(message.createdAt)}
        </span>
      </header>
      <p className="whitespace-pre-line text-xl leading-tight">
        {message.text}
      </p>
    </div>
  );
};
