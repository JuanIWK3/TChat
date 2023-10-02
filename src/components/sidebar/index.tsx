import { signOut } from 'next-auth/react';
import { Button } from '../ui/button';
import { trpc } from '@/utils/trpc';
import { CreateRoom } from './create-room';
import { useRoomContext } from '@/contexts/room';

export const Sidebar = () => {
  const { data: rooms, refetch } = trpc.room.getAll.useQuery();
  const { setSelectedRoom } = useRoomContext();

  return (
    <aside className="border-r p-4">
      <Button variant={'default'} onClick={() => void signOut()}>
        Logout
      </Button>
      <div className="border-b border-gray-300 mt-4"></div>
      <h3 className="font-bold my-4 text-center">Rooms</h3>

      <CreateRoom refetch={refetch} />

      {rooms?.map((room) => (
        <div key={room.id} className="mt-4">
          <Button
            variant={'outline'}
            className="w-full"
            onClick={() => {
              setSelectedRoom(room);
            }}
          >
            {room.name}
          </Button>
        </div>
      ))}
    </aside>
  );
};
