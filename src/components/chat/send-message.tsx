import { Form } from '@/components/ui/form';
import { useRoomContext } from '@/contexts/chat';
import { trpc } from '@/utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendHorizontal } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function SendMessageForm({}) {
  const { selectedRoom } = useRoomContext();
  const sendMessage = trpc.message.add.useMutation();
  const { data: session } = useSession();

  const formSchema = z.object({
    text: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await sendMessage.mutateAsync({
        text: values.text,
        roomId: selectedRoom?.id ?? '',
      });
    } catch {}
    console.log(values);
    form.reset({
      text: '',
    });
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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className=" flex w-full items-center justify-center gap-2"
    >
      <Input
        className="w-full"
        placeholder="Type here"
        {...form.register('text')}
      />
      <Button variant={'ghost'}>
        <SendHorizontal />
      </Button>
    </form>
  );
}
