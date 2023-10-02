import { signOut, useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import { trpc } from '@/utils/trpc';
import { CreateRoom } from './create-room';
import { useRoomContext } from '@/contexts/chat';
import { NewPrivate } from './new-private';

export const Sidebar = () => {
  const { data: rooms, refetch } = trpc.room.getAllWithUser.useQuery();
  const { setSelectedRoom } = useRoomContext();
  const { data: session } = useSession();

  return (
    <aside className="border-r p-4 flex flex-col">
      <Button variant={'default'} onClick={() => void signOut()}>
        Logout
      </Button>
      <div className="border-b border-gray-300 mt-4"></div>
      <h3 className="font-bold my-4 text-center">Rooms</h3>

      <CreateRoom refetch={refetch} />
      <NewPrivate refetch={refetch} />

      {rooms?.map((room) => (
        <div key={room.id} className="mt-4">
          <Button
            variant={'outline'}
            className="w-full"
            onClick={() => {
              setSelectedRoom(room);
            }}
          >
            {room.private && <span className="mr-2">🔒</span>}
            {room.private ? (
              <div>
                {room.users?.filter((u) => u.id !== session?.user?.id)[0].name}
              </div>
            ) : (
              <div>{room.name}</div>
            )}
          </Button>
        </div>
      ))}
    </aside>
  );
};
