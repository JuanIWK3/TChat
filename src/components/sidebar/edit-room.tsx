'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import { Plus, UserPlus2 } from 'lucide-react';
import { Room } from '@prisma/client';

export function EditRoom({ room }: { room: Room }) {
  const { data: users, refetch } = trpc.user.getAllNotInTheRoom.useQuery({
    roomId: room.id,
  });

  const joinUser = trpc.room.addUsertoRoom.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className="text-center">
      <Dialog>
        <DialogTrigger className="w-full flex items-center justify-center py-2">
          <UserPlus2 />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Edit room</DialogTitle>
            {users?.map((user) => (
              <div
                className="flex justify-between items-center border rounded px-4 py-2"
                key={user.id}
              >
                <p>{user.name}</p>
                <Button
                  variant={'outline'}
                  onClick={() => {
                    joinUser.mutate({ roomId: room.id, userId: user.id });
                  }}
                >
                  <Plus />
                </Button>
              </div>
            ))}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
