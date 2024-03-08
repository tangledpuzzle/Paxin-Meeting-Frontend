'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import createRoom from '@/lib/server/chat/createRoom';
import getRoomDetails from '@/lib/server/chat/getRoomDetails';
import sendMessage from '@/lib/server/chat/sendMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IoMdSend } from 'react-icons/io';
import { z } from 'zod';

export default function MessageForm({
  children,
  user,
  roomId,
}: {
  children: React.ReactNode;
  user: {
    username: string;
    userId: string;
  };
  roomId: string;
}) {
  const t = useTranslations('chatting');
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const formSchema = z.object({
    message: z.string().min(1, { message: t('message_required') }),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' },
  });

  const submit = async (data: FormData) => {
    setIsLoading(true);

    try {
      if (roomId === '') {
        const _roomId = await createRoom({
          acceptorId: user.userId,
          initialMessage: data.message,
        });

        if (!_roomId) {
          toast.error(t('failed_to_send_message'), {
            position: 'top-right',
          });

          return;
        }

        router.push(`/profile/chat/${_roomId}`);
      } else {
        const roomDataRes = await getRoomDetails({ roomId });
        if (!roomDataRes || !roomDataRes.data.Members) {
          toast.error('Failed to send message', {
            position: 'top-right',
          });

          return;
        }

        for (const member of roomDataRes.data.Members) {
          if (member.UserID === user.userId && !member.IsSubscribed) {
            toast.error(t('not_subscribed_yet'), {
              position: 'top-right',
            });

            return;
          }
        }

        const res = await sendMessage({ roomId, message: data.message });

        if (!res) {
          toast.error(t('failed_to_send_message'), {
            position: 'top-right',
          });

          return;
        }

        router.push(`/profile/chat/${roomId}`);
      }
    } catch (error) {
      toast.error(t('failed_to_send_message'), {
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='w-full max-w-[320px] sm:w-80'>
        <div>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>
              {t.rich('message_to_username', { username: `@${user.username}` })}
            </h4>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
              <FormField
                control={form.control}
                name='message'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='mt-4 flex items-center'>
                        <Input className='rounded-r-none' {...field} />
                        <Button
                          type='submit'
                          size='icon'
                          className='h-9 rounded-l-none'
                        >
                          {isLoading && (
                            <Loader2 className='size-5 animate-spin' />
                          )}
                          {!isLoading && <IoMdSend className='size-5' />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
