'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import { MessageSquarePlus } from 'lucide-react';
import { useSession } from 'next-auth/react';

export function NewPrivate({
  refetch: refetchRooms,
}: {
  refetch: () => unknown;
}) {
  const { data: users } = trpc.user.getAll.useQuery();
  const { data: session } = useSession();

  const createRoom = trpc.room.addPrivate.useMutation({
    onSuccess: () => {
      refetchRooms();

      window.location.reload();
    },
  });

  return (
    <div className="text-center">
      <Dialog>
        <DialogTrigger className="w-full  flex items-center justify-center py-2">
          <MessageSquarePlus />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Private Chat</DialogTitle>
            {users
              ?.filter((u) => u.id !== session?.user.id)
              .map((user) => (
                <Button
                  className="flex justify-between items-center border rounded px-4 py-2"
                  key={user.id}
                  onClick={() => {
                    createRoom.mutate({
                      name: user.name ?? 'Private Chat',
                      friendId: user.id,
                    });
                  }}
                >
                  <p>{user.name}</p>
                  <p>{user.id}</p>
                </Button>
              ))}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
